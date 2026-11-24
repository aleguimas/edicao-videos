// Analisa uma música: BPM (autocorrelação do fluxo espectral simplificado),
// fase do tempo forte e energia por segundo (estrutura: intro, partes cheias, finais).
// Uso: node scripts/analisar-musica.mjs <arquivo>
import { execFileSync } from "node:child_process";

const arq = process.argv[2];
const SR = 22050;
const pcm = execFileSync("npx", ["remotion", "ffmpeg", "-v", "error", "-i", arq, "-ac", "1", "-ar", String(SR), "-c:a", "pcm_s16le", "-f", "wav", "-"], { maxBuffer: 1 << 30 });
const d0 = pcm.indexOf("data") + 8;
const n = Math.floor((pcm.length - d0) / 2);
const x = new Float32Array(n);
for (let i = 0; i < n; i++) x[i] = pcm.readInt16LE(d0 + i * 2) / 32768;

// envelope de ataque: energia em janelas de 512 (≈23 ms) com passa-altas simples (realça bateria)
const HOP = 512;
const frames = Math.floor(n / HOP);
const env = new Float32Array(frames);
let prev = 0;
for (let f = 0; f < frames; f++) {
  let e = 0;
  for (let i = f * HOP; i < (f + 1) * HOP; i++) { const hp = x[i] - prev; prev = x[i]; e += hp * hp; }
  env[f] = Math.log(1 + 100 * e);
}
const onset = new Float32Array(frames);
for (let f = 1; f < frames; f++) onset[f] = Math.max(0, env[f] - env[f - 1]);

const fps = SR / HOP;
let melhor = { bpm: 0, s: -Infinity };
for (let bpm = 70; bpm <= 180; bpm += 0.25) {
  const lag = (60 / bpm) * fps;
  let s = 0;
  for (let f = 0; f + 4 * lag < frames; f++) {
    const a = onset[f];
    s += a * (lerp(onset, f + lag) + 0.5 * lerp(onset, f + 2 * lag) + 0.25 * lerp(onset, f + 4 * lag));
  }
  if (s > melhor.s) melhor = { bpm, s };
}
function lerp(arr, p) { const i = Math.floor(p); const t = p - i; return (arr[i] ?? 0) * (1 - t) + (arr[i + 1] ?? 0) * t; }
// mostra também os candidatos meia/dupla velocidade
console.log(`BPM estimado: ${melhor.bpm}`);
const beat = 60 / melhor.bpm;
// fase: deslocamento (s) que maximiza a soma do ataque nos tempos
let fase = { t: 0, s: -1 };
for (let t = 0; t < beat; t += 0.005) {
  let s = 0;
  for (let b = t; b * fps < frames; b += beat) s += lerp(onset, b * fps);
  if (s > fase.s) fase = { t, s };
}
console.log(`primeiro tempo em ${fase.t.toFixed(3)} s (período ${beat.toFixed(4)} s, compasso ${(4 * beat).toFixed(3)} s)`);

// energia RMS por segundo (dB)
const linhas = [];
for (let s = 0; s * SR < n; s++) {
  let e = 0; const a = s * SR, b = Math.min(n, a + SR);
  for (let i = a; i < b; i++) e += x[i] * x[i];
  const db = 10 * Math.log10(e / (b - a) + 1e-12);
  linhas.push(`${String(s).padStart(3)}s ${db.toFixed(1).padStart(6)} dB ${"█".repeat(Math.max(0, Math.round((db + 40) / 1.2)))}`);
}
console.log(linhas.join("\n"));
