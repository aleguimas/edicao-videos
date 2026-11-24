import { downloadWhisperModel, loadWhisperModel, toCaptions, transcribe } from "@remotion/whisper-webgpu";
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";

// Confere o início e o fim de cada corte (palavra cortada no meio?).
// Uso: npx tsx scripts/conferir-cortes.mts ../cortes
const DIR = process.argv[2] ?? "../cortes";
const model = "large-v3-turbo";
await downloadWhisperModel({ model });
await using _m = await loadWhisperModel({ model });
for (const arq of readdirSync(DIR).filter((f) => f.endsWith(".mp4")).sort()) {
  const pcm = execFileSync("npx", ["remotion", "ffmpeg", "-v", "error", "-i", `${DIR}/${arq}`, "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", "-f", "wav", "-"], { maxBuffer: 1 << 30 });
  const dados = pcm.indexOf("data") + 8; // pula o cabeçalho WAV até o chunk de dados
  const n = Math.floor((pcm.length - dados) / 2);
  const wave = new Float32Array(n);
  for (let i = 0; i < n; i++) wave[i] = pcm.readInt16LE(dados + i * 2) / 32768;
  const { captions } = toCaptions({ whisperWebGpuOutput: await transcribe({ channelWaveform: wave, model, language: "pt" }) });
  const txt = (cs: typeof captions) => cs.map((c) => c.text).join("").trim();
  console.log(`\n${arq}\n  INÍCIO: ${txt(captions.slice(0, 14))}\n  FIM:    ${txt(captions.slice(-14))}`);
}
