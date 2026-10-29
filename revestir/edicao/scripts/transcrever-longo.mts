import { registerMediabunnyServer } from "@mediabunny/server";
import {
  WHISPER_WEBGPU_SAMPLE_RATE,
  canUseWhisperWebGpu,
  downloadWhisperModel,
  loadWhisperModel,
  toCaptions,
  transcribe,
} from "@remotion/whisper-webgpu";
import {
  ALL_FORMATS,
  Conversion,
  FilePathSource,
  Input,
  NullTarget,
  Output,
  WavOutputFormat,
} from "mediabunny";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Transcrição de vídeos longos (horas), em blocos, com retomada.
// Uso: npx tsx scripts/transcrever-longo.mts ../20261015_082734.mp4 ../transcricao
// Pouca RAM: until [ -f ../transcricao/transcricao.md ]; do MAX_BLOCOS=4 npx tsx scripts/transcrever-longo.mts ...; done
// Saída: <dir>/blocos/NNN.json (por bloco), <dir>/legendas.json e <dir>/transcricao.md
const ARQUIVO = process.argv[2];
const SAIDA = process.argv[3] ?? "../transcricao";
if (!ARQUIVO) {
  throw new Error("Informe o caminho do vídeo original");
}
const BLOCO_S = 600;
const SR = WHISPER_WEBGPU_SAMPLE_RATE;
const dirBlocos = path.join(SAIDA, "blocos");
await mkdir(dirBlocos, { recursive: true });

registerMediabunnyServer();

const support = await canUseWhisperWebGpu();
if (!support.supported) {
  throw new Error(support.detailedReason);
}

// Áudio decodificado fica em cache (f32 mono 16 kHz) para não reler os 23 GB numa retomada.
const cacheAudio = path.join(SAIDA, "audio-16k.f32");
let channelWaveform: Float32Array;
if (existsSync(cacheAudio)) {
  const buf = await readFile(cacheAudio);
  channelWaveform = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
} else {
  type WaveformChunk = { startFrame: number; waveform: Float32Array };
  const chunks: WaveformChunk[] = [];
  using input = new Input({
    formats: ALL_FORMATS,
    source: new FilePathSource(ARQUIVO),
  });
  const audioTrack = await input.getPrimaryAudioTrack();
  if (audioTrack === null) {
    throw new Error("The media does not contain an audio track.");
  }
  const conversion = await Conversion.init({
    input,
    output: new Output({ format: new WavOutputFormat(), target: new NullTarget() }),
    video: { discard: true },
    audio: (track) => {
      if (track.id !== audioTrack.id) {
        return { discard: true };
      }
      return {
        codec: "pcm-f32",
        forceTranscode: true,
        numberOfChannels: 1,
        sampleFormat: "f32",
        sampleRate: SR,
        process: (sample) => {
          const waveform = new Float32Array(
            sample.allocationSize({ format: "f32", planeIndex: 0 }) /
              Float32Array.BYTES_PER_ELEMENT,
          );
          sample.copyTo(waveform, { format: "f32", planeIndex: 0 });
          chunks.push({ startFrame: Math.round(sample.timestamp * SR), waveform });
          return sample;
        },
      };
    },
  });
  if (!conversion.isValid) {
    throw new Error("The audio track cannot be decoded.");
  }
  conversion.onProgress = (p) => process.stdout.write(`\rdecodificando áudio: ${(p * 100).toFixed(1)}%`);
  await conversion.execute();
  console.log();

  const len = chunks.reduce((max, c) => Math.max(max, c.startFrame + c.waveform.length), 0);
  channelWaveform = new Float32Array(len);
  for (const c of chunks) {
    const dst = Math.max(0, c.startFrame);
    const src = Math.max(0, -c.startFrame);
    const n = Math.min(c.waveform.length - src, len - dst);
    if (n > 0) channelWaveform.set(c.waveform.subarray(src, src + n), dst);
  }
  await writeFile(cacheAudio, Buffer.from(channelWaveform.buffer));
}

const duracao = channelWaveform.length / SR;
const nBlocos = Math.ceil(duracao / BLOCO_S);
console.log(`áudio: ${(duracao / 60).toFixed(1)} min → ${nBlocos} blocos de ${BLOCO_S / 60} min`);

const model = "large-v3-turbo";
await downloadWhisperModel({ model });
await using _modelo = await loadWhisperModel({ model });
console.log("modelo carregado");

// Em máquinas com pouca RAM o processo vaza memória a cada bloco; limitar blocos por execução
// e rodar em loop até gerar transcricao.md (ver uso no topo).
const MAX_NOVOS = Number(process.env.MAX_BLOCOS ?? Infinity);
let novos = 0;

type Legenda = { text: string; startMs: number; endMs: number };
const todas: Legenda[] = [];
for (let i = 0; i < nBlocos; i++) {
  const arqBloco = path.join(dirBlocos, `${String(i).padStart(3, "0")}.json`);
  let legendas: Legenda[];
  if (existsSync(arqBloco)) {
    legendas = JSON.parse(await readFile(arqBloco, "utf8"));
  } else {
    if (novos >= MAX_NOVOS) {
      console.log("limite de blocos desta execução atingido");
      process.exit(0);
    }
    novos++;
    const ini = i * BLOCO_S * SR;
    const trecho = channelWaveform.slice(ini, Math.min(ini + BLOCO_S * SR, channelWaveform.length));
    const t0 = Date.now();
    const out = await transcribe({ channelWaveform: trecho, model, language: "pt" });
    const offsetMs = i * BLOCO_S * 1000;
    legendas = toCaptions({ whisperWebGpuOutput: out }).captions.map((c) => ({
      text: c.text,
      startMs: c.startMs + offsetMs,
      endMs: c.endMs + offsetMs,
    }));
    await writeFile(arqBloco, JSON.stringify(legendas));
    console.log(`bloco ${i + 1}/${nBlocos} pronto em ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  todas.push(...legendas);
}

await writeFile(path.join(SAIDA, "legendas.json"), JSON.stringify(todas, null, 1));

// Texto legível: parágrafos a cada pausa > 2 s, com marca de tempo.
const hms = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
};
const linhas: string[] = [`# Transcrição — ${process.env.TITULO ?? path.basename(ARQUIVO)}`, ""];
let par = "";
let parIni = 0;
let fimAnt = 0;
for (const c of todas) {
  if (par && (c.startMs - fimAnt > 2000 || par.length > 900)) {
    linhas.push(`**[${hms(parIni)}]** ${par.trim()}`, "");
    par = "";
  }
  if (!par) parIni = c.startMs;
  par += c.text;
  fimAnt = c.endMs;
}
if (par) linhas.push(`**[${hms(parIni)}]** ${par.trim()}`, "");
await writeFile(path.join(SAIDA, "transcricao.md"), linhas.join("\n"));
console.log("transcrição concluída");
