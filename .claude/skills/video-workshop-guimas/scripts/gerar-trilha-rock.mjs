// Trilha instrumental original (sem direitos de terceiros): rock com bateria,
// duas guitarras distorcidas (Karplus-Strong + saturação + "caixa" de guitarra)
// e baixo. 120 BPM em Mi menor: 1 compasso = 2 s = 60 frames a 30 fps, para os
// cortes do vídeo caírem no tempo forte.
// Uso: node scripts/gerar-trilha-rock.mjs [--versao 90|60] [--saida public/resumo/trilha.wav]
// A estrutura (em compassos) está em SECOES; ajuste ali se a linha do tempo mudar.
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const VERSAO = args.includes("--versao") ? args[args.indexOf("--versao") + 1] : "90";
const SAIDA = args.includes("--saida")
  ? args[args.indexOf("--saida") + 1]
  : VERSAO === "60" ? "public/resumo/trilha-60.wav" : "public/resumo/trilha.wav";

const SR = 44100;
const BPM = 120;
const BEAT = 60 / BPM;
const COMPASSO = BEAT * 4;
// tipo de cada compasso (versão de 90 s)
const SECOES_90 = [
  { de: 0, ate: 2, tipo: "intro" },     // 0–4 s: abertura Cuiabá
  { de: 2, ate: 26, tipo: "verso" },    // 4–52 s: falas
  { de: 26, ate: 27, tipo: "subida" },  // 52–54 s
  { de: 27, ate: 29, tipo: "refrao" },  // 54–58 s: MÃO NA MASSA
  { de: 29, ate: 43, tipo: "verso" },   // 58–86 s: depoimentos
  { de: 43, ate: 44, tipo: "subida" },  // 86–88 s
  { de: 44, ate: 45, tipo: "final" },   // 88–90 s: @aleguimas
];
// versão de 60 s (YouTube Shorts)
const SECOES_60 = [
  { de: 0, ate: 2, tipo: "intro" },     // 0–4 s: abertura Cuiabá
  { de: 2, ate: 17, tipo: "verso" },    // 4–34 s: falas
  { de: 17, ate: 18, tipo: "subida" },  // 34–36 s
  { de: 18, ate: 19, tipo: "refrao" },  // 36–38 s: MÃO NA MASSA
  { de: 19, ate: 28, tipo: "verso" },   // 38–56 s: depoimentos
  { de: 28, ate: 29, tipo: "subida" },  // 56–58 s
  { de: 29, ate: 30, tipo: "final" },   // 58–60 s: @aleguimas
];
const SECOES = VERSAO === "60" ? SECOES_60 : SECOES_90;
const TOTAL_COMPASSOS = SECOES[SECOES.length - 1].ate;
const INICIO_REFRAO = SECOES.find((x) => x.tipo === "refrao").de;
const N = Math.ceil(TOTAL_COMPASSOS * COMPASSO * SR);
const tipoDo = (c) => SECOES.find((s) => c >= s.de && c < s.ate)?.tipo;

// progressão por compasso: Mi5 Mi5 Dó5 Ré5 (verso) | Mi5 Sol5 Ré5 Dó5 (refrão, meio compasso cada)
const E2 = 82.41, G2 = 98.0, C3 = 130.81, D3 = 146.83;
const VERSO = [E2, E2, C3, D3];
const REFRAO = [E2, G2, D3, C3];

let semente = 7;
const rnd = () => ((semente = (semente * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;

// pistas mono, mixadas no fim com pan
const pista = () => new Float32Array(N);
const bateria = { L: pista(), R: pista() };
const guitarra1 = pista();
const guitarra2 = pista();
const baixo = pista();

const somar = (buf, t, amostras, ganho = 1) => {
  const i0 = Math.round(t * SR);
  for (let i = 0; i < amostras.length && i0 + i < N; i++) if (i0 + i >= 0) buf[i0 + i] += amostras[i] * ganho;
};
const somarBateria = (t, amostras, ganho = 1, pan = 0) => {
  somar(bateria.L, t, amostras, ganho * Math.min(1, 1 - pan));
  somar(bateria.R, t, amostras, ganho * Math.min(1, 1 + pan));
};

// ---------- bateria
function bumbo() {
  const n = Math.round(0.45 * SR);
  const s = new Float32Array(n);
  let fase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 45 + 110 * Math.exp(-t * 28);
    fase += (2 * Math.PI * f) / SR;
    s[i] = Math.sin(fase) * Math.exp(-t * 7) + (t < 0.004 ? rnd() * 0.6 * (1 - t / 0.004) : 0);
  }
  return s;
}
function caixa() {
  const n = Math.round(0.3 * SR);
  const s = new Float32Array(n);
  let lp = 0, hpPrev = 0, hpOut = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const r = rnd();
    hpOut = 0.92 * (hpOut + r - hpPrev); hpPrev = r; // passa-altas
    lp += 0.45 * (hpOut - lp);                        // passa-baixas
    s[i] = lp * 1.4 * Math.exp(-t * 16) + Math.sin(2 * Math.PI * 185 * t) * 0.7 * Math.exp(-t * 30);
  }
  return s;
}
function chimbal(aberto = false) {
  const n = Math.round((aberto ? 0.32 : 0.05) * SR);
  const s = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const r = rnd();
    s[i] = (r - prev) * 0.5 * Math.exp((-i / SR) * (aberto ? 9 : 70));
    prev = r;
  }
  return s;
}
function prato() {
  const n = Math.round(2.2 * SR);
  const s = new Float32Array(n);
  let prev = 0, lp = 0;
  for (let i = 0; i < n; i++) {
    const r = rnd();
    const hp = r - prev; prev = r;
    lp += 0.6 * (hp - lp);
    s[i] = lp * Math.exp((-i / SR) * 1.8);
  }
  return s;
}
function tom(freq) {
  const n = Math.round(0.35 * SR);
  const s = new Float32Array(n);
  let fase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    fase += (2 * Math.PI * freq * (1 + 0.6 * Math.exp(-t * 25))) / SR;
    s[i] = Math.sin(fase) * Math.exp(-t * 9);
  }
  return s;
}
const BUMBO = bumbo(), CAIXA = caixa(), HH = chimbal(), HHA = chimbal(true), PRATO = prato();
const TONS = [tom(180), tom(140), tom(105)];

// ---------- cordas (Karplus-Strong)
function corda(freq, dur, abafada) {
  const n = Math.round(dur * SR);
  const p = Math.max(2, Math.round(SR / freq));
  const linha = new Float32Array(p);
  for (let i = 0; i < p; i++) linha[i] = rnd();
  const perda = abafada ? 0.982 : 0.9985;
  const s = new Float32Array(n);
  let idx = 0, lp = 0;
  for (let i = 0; i < n; i++) {
    const a = linha[idx];
    const b = linha[(idx + 1) % p];
    linha[idx] = perda * 0.5 * (a + b);
    idx = (idx + 1) % p;
    lp += (abafada ? 0.35 : 0.8) * (a - lp);
    // soltura no fim da nota (evita clique)
    const env = Math.min(1, (n - i) / (0.012 * SR));
    s[i] = lp * env;
  }
  return s;
}
// power chord: tônica, quinta, oitava (com leve "strum")
function acorde(buf, t, raiz, dur, abafado, ganho, detune = 1) {
  [raiz, raiz * 1.4983, raiz * 2].forEach((f, k) => somar(buf, t + k * 0.004, corda(f * detune, dur, abafado), ganho));
}

// ---------- sequência
for (let c = 0; c < TOTAL_COMPASSOS; c++) {
  const t0 = c * COMPASSO;
  const tipo = tipoDo(c);
  const raizVerso = VERSO[c % 4];

  if (tipo === "intro") {
    if (c === 0) {
      acorde(guitarra1, t0, E2, 3.9, false, 0.5);
      acorde(guitarra2, t0 + 0.01, E2, 3.9, false, 0.5, 1.003);
      for (let b = 0; b < 8; b++) somarBateria(t0 + b * BEAT / 2, HH, 0.25 + b * 0.04, 0.3);
    } else {
      // virada de tons e caixa crescendo
      for (let k = 0; k < 8; k++) somarBateria(t0 + k * BEAT / 2, TONS[Math.min(2, Math.floor(k / 3))], 0.55 + k * 0.05, -0.3 + k * 0.08);
      for (let k = 0; k < 8; k++) somarBateria(t0 + COMPASSO / 2 + k * BEAT / 4, CAIXA, 0.25 + k * 0.07);
    }
  }

  if (tipo === "verso" || tipo === "refrao") {
    const refrao = tipo === "refrao";
    if ((c - 2) % 8 === 0 || (refrao && c === INICIO_REFRAO)) somarBateria(t0, PRATO, 0.55, 0.4);
    for (let b = 0; b < 4; b++) {
      const tb = t0 + b * BEAT;
      if (b === 0 || b === 2) somarBateria(tb, BUMBO, 1);
      if (b === 1) somarBateria(tb + BEAT / 2, BUMBO, 0.8);
      if (refrao && b === 3) somarBateria(tb + BEAT / 2, BUMBO, 0.8);
      if (b === 1 || b === 3) somarBateria(tb, CAIXA, 0.9);
      for (let e = 0; e < 2; e++) somarBateria(tb + e * BEAT / 2, refrao && e === 1 ? HHA : HH, e ? 0.3 : 0.42, 0.35);
    }
    if (refrao) {
      // acordes soltos, meio compasso cada
      for (let h = 0; h < 2; h++) {
        const raiz = REFRAO[((c - INICIO_REFRAO) * 2 + h) % 4];
        acorde(guitarra1, t0 + h * COMPASSO / 2, raiz, COMPASSO / 2 + 0.05, false, 0.55);
        acorde(guitarra2, t0 + h * COMPASSO / 2 + 0.012, raiz, COMPASSO / 2 + 0.05, false, 0.55, 1.003);
        for (let e = 0; e < 4; e++) somar(baixo, t0 + h * COMPASSO / 2 + e * BEAT / 2, corda(raiz / 2, BEAT / 2, true), 0.9);
      }
    } else {
      // palhetada abafada em colcheias, com acento no 1 e no "e" do 2
      for (let e = 0; e < 8; e++) {
        const acento = e === 0 || e === 3 ? 1 : 0.7;
        acorde(guitarra1, t0 + e * BEAT / 2, raizVerso, BEAT / 2, true, 0.5 * acento);
        acorde(guitarra2, t0 + e * BEAT / 2 + 0.008, raizVerso, BEAT / 2, true, 0.5 * acento, 1.003);
        somar(baixo, t0 + e * BEAT / 2, corda(raizVerso / 2, BEAT / 2, true), 0.85);
      }
    }
  }

  if (tipo === "subida") {
    // caixa em semicolcheias crescendo + guitarra em tremolo
    for (let k = 0; k < 16; k++) {
      const g = 0.25 + (k / 15) * 0.75;
      somarBateria(t0 + k * BEAT / 4, CAIXA, g * 0.9);
      if (k % 4 === 0) somarBateria(t0 + k * BEAT / 4, BUMBO, 0.8);
      acorde(guitarra1, t0 + k * BEAT / 4, E2, BEAT / 4, true, 0.35 * g);
      acorde(guitarra2, t0 + k * BEAT / 4 + 0.006, E2, BEAT / 4, true, 0.35 * g, 1.003);
      somar(baixo, t0 + k * BEAT / 4, corda(E2 / 2, BEAT / 4, true), 0.6 * g);
    }
  }

  if (tipo === "final") {
    somarBateria(t0, PRATO, 0.8, 0.4);
    somarBateria(t0, PRATO, 0.6, -0.4);
    somarBateria(t0, BUMBO, 1.1);
    acorde(guitarra1, t0, E2, COMPASSO, false, 0.6);
    acorde(guitarra2, t0 + 0.012, E2, COMPASSO, false, 0.6, 1.003);
    somar(baixo, t0, corda(E2 / 2, COMPASSO, false), 0.9);
  }
}

// ---------- saturação + caixa de guitarra (passa-altas 90 Hz, passa-baixas ~3,4 kHz)
function distorcer(buf, drive) {
  const aHp = Math.exp((-2 * Math.PI * 90) / SR);
  const aLp = 1 - Math.exp((-2 * Math.PI * 3400) / SR);
  let hpPrevIn = 0, hpOut = 0, lp1 = 0, lp2 = 0;
  for (let i = 0; i < N; i++) {
    hpOut = aHp * (hpOut + buf[i] - hpPrevIn);
    hpPrevIn = buf[i];
    const sat = Math.tanh(hpOut * drive);
    lp1 += aLp * (sat - lp1);
    lp2 += aLp * (lp1 - lp2);
    buf[i] = lp2;
  }
}
distorcer(guitarra1, 9);
distorcer(guitarra2, 9);
// baixo: leve saturação e passa-baixas 900 Hz
{
  const a = 1 - Math.exp((-2 * Math.PI * 900) / SR);
  let lp = 0;
  for (let i = 0; i < N; i++) {
    lp += a * (Math.tanh(baixo[i] * 2) - lp);
    baixo[i] = lp;
  }
}

// ---------- mix
const L = new Float32Array(N), R = new Float32Array(N);
for (let i = 0; i < N; i++) {
  L[i] = bateria.L[i] * 0.9 + guitarra1[i] * 0.42 + guitarra2[i] * 0.16 + baixo[i] * 0.55;
  R[i] = bateria.R[i] * 0.9 + guitarra1[i] * 0.16 + guitarra2[i] * 0.42 + baixo[i] * 0.55;
}
// ambiência curta (eco de sala) para colar a mixagem
for (const [buf, atraso] of [[L, 0.031], [R, 0.043]]) {
  const d = Math.round(atraso * SR);
  for (let i = N - 1; i >= d; i--) buf[i] += buf[i - d] * 0.18;
}
// fade-out no último compasso
const iniFade = Math.round((TOTAL_COMPASSOS - 0.6) * COMPASSO * SR);
for (let i = iniFade; i < N; i++) {
  const g = 1 - (i - iniFade) / (N - iniFade);
  L[i] *= g; R[i] *= g;
}
// normaliza o pico em -1 dBFS
let pico = 0;
for (let i = 0; i < N; i++) pico = Math.max(pico, Math.abs(L[i]), Math.abs(R[i]));
const k = Math.pow(10, -1 / 20) / pico;

const dados = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  dados.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * k)) * 32767), i * 4);
  dados.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * k)) * 32767), i * 4 + 2);
}
const cab = Buffer.alloc(44);
cab.write("RIFF", 0); cab.writeUInt32LE(36 + dados.length, 4); cab.write("WAVE", 8);
cab.write("fmt ", 12); cab.writeUInt32LE(16, 16); cab.writeUInt16LE(1, 20); cab.writeUInt16LE(2, 22);
cab.writeUInt32LE(SR, 24); cab.writeUInt32LE(SR * 4, 28); cab.writeUInt16LE(4, 32); cab.writeUInt16LE(16, 34);
cab.write("data", 36); cab.writeUInt32LE(dados.length, 40);
writeFileSync(SAIDA, Buffer.concat([cab, dados]));
console.log(`${SAIDA}: ${(N / SR).toFixed(1)} s, ${BPM} BPM`);
