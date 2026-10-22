import { downloadWhisperModel, loadWhisperModel, toCaptions, transcribe } from "@remotion/whisper-webgpu";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

// Transcreve todos os vídeos curtos de uma pasta (ex.: depoimentos).
// Uso: npx tsx scripts/transcrever-curtos.mts ../depoimentos
// Saída: <pasta>/transcricoes/<nome>.json + frases com tempo no terminal.
const DIR = process.argv[2] ?? "../depoimentos";
const SAIDA = path.join(DIR, "transcricoes");
mkdirSync(SAIDA, { recursive: true });

const model = "large-v3-turbo";
await downloadWhisperModel({ model });
await using _m = await loadWhisperModel({ model });

const s = (ms: number) => (ms / 1000).toFixed(1).padStart(5);
for (const arq of readdirSync(DIR).filter((f) => /\.(mp4|mov)$/i.test(f)).sort()) {
  const pcm = execFileSync("npx", ["remotion", "ffmpeg", "-v", "error", "-i", path.join(DIR, arq), "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", "-f", "wav", "-"], { maxBuffer: 1 << 30 });
  const dados = pcm.indexOf("data") + 8; // pula o cabeçalho WAV até o chunk de dados
  const n = Math.floor((pcm.length - dados) / 2);
  const wave = new Float32Array(n);
  for (let i = 0; i < n; i++) wave[i] = pcm.readInt16LE(dados + i * 2) / 32768;
  const { captions } = toCaptions({ whisperWebGpuOutput: await transcribe({ channelWaveform: wave, model, language: "pt" }) });
  writeFileSync(path.join(SAIDA, arq.replace(/\.\w+$/, ".json")), JSON.stringify(captions, null, 1));

  console.log(`\n=== ${arq}`);
  let frase = "";
  let ini = 0;
  for (const c of captions) {
    if (!frase) ini = c.startMs;
    frase += c.text;
    if (/[.?!]\s*$/.test(c.text)) {
      console.log(`${s(ini)}–${s(c.endMs)}  ${frase.trim()}`);
      frase = "";
    }
  }
  if (frase) console.log(`${s(ini)}       ${frase.trim()}`);
}
