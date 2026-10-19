// Afina o ponto de emenda de uma música: compara o padrão da bateria nos 8 s antes
// do ponto A com os 8 s antes do ponto B e diz quanto mover B (em ms) para os tempos
// coincidirem. Use depois de escolher A e B em compassos inteiros (analisar-musica.mjs).
// Uso: node scripts/alinhar-emenda.mjs <arquivo> <A em s> <B em s>
// Ex.: node scripts/alinhar-emenda.mjs ../../musicas/videoplayback.mp4 110.45 132.94  -> +100 ms
import { execFileSync } from "node:child_process";

const [arq, aStr, bStr] = process.argv.slice(2);
const A = Number(aStr);
const B = Number(bStr);
const SR = 22050;
const HOP = 128;
const W = 8;

const pcm = execFileSync("npx", ["remotion", "ffmpeg", "-v", "error", "-i", arq, "-ac", "1", "-ar", String(SR), "-c:a", "pcm_s16le", "-f", "wav", "-"], { maxBuffer: 1 << 30 });
const d0 = pcm.indexOf("data") + 8;
const n = Math.floor((pcm.length - d0) / 2);
const x = new Float32Array(n);
for (let i = 0; i < n; i++) x[i] = pcm.readInt16LE(d0 + i * 2) / 32768;

// envelope de ataque (passa-altas simples realça a bateria)
const F = Math.floor(n / HOP);
const env = new Float32Array(F);
let p = 0;
for (let f = 0; f < F; f++) {
  let e = 0;
  for (let i = f * HOP; i < (f + 1) * HOP; i++) { const h = x[i] - p; p = x[i]; e += h * h; }
  env[f] = Math.log(1 + 100 * e);
}
const ataque = new Float32Array(F);
for (let f = 1; f < F; f++) ataque[f] = Math.max(0, env[f] - env[f - 1]);
const fps = SR / HOP;

let melhor = { d: 0, s: -1 };
for (let d = -0.4; d <= 0.4; d += 0.005) {
  let s = 0;
  for (let t = 0; t < W; t += 1 / fps) s += ataque[Math.round((A - W + t) * fps)] * ataque[Math.round((B - W + t + d) * fps)];
  if (s > melhor.s) melhor = { d, s };
}
console.log(`mover B em ${melhor.d >= 0 ? "+" : ""}${(melhor.d * 1000).toFixed(0)} ms -> B = ${(B + melhor.d).toFixed(2)} s`);
