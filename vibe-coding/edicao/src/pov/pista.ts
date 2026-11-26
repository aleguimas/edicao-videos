import { Easing, interpolate } from "remotion";
import { CHAO, confianca, PICO, T, X0, XP, yNova } from "../curva";

// ---------- Linha do tempo da versão POV (até o rebobinar é a mesma do vídeo original) ----------
export const V = {
  itens: [968, 1038, 1108, 1178],
  drone: 1240,
  fechamento: 1310,
  fim: 1430,
} as const;

// ---------- Pista em 3D (metros). O carrinho anda para -Z ----------
export const K = 0.12; // metros por unidade do gráfico
export const ALTURA = 75;
export const S_PICO = (XP - X0) * K;
export const xDeS = (s: number) => X0 + s / K;
export const sDeX = (x: number) => (x - X0) * K;

const lateral = (s: number) => 9 * Math.sin((s * 2 * Math.PI) / 170) * Math.min(1, Math.max(0, s / 40));

export type V3 = [number, number, number];

export const pista = (s: number): V3 => [lateral(s), 1.4 + ALTURA * confianca(xDeS(s)), -s];

// pista nova (virada): à direita, sobe sempre e nunca despenca
export const DESLOCAMENTO_NOVA = 26;
export const pistaNova = (s: number): V3 => [
  DESLOCAMENTO_NOVA + lateral(s) * 0.6,
  1.4 + ALTURA * ((CHAO - yNova(xDeS(Math.max(0, s)))) / (CHAO - PICO)),
  -s,
];

export const tangente = (fn: (s: number) => V3, s: number): V3 => {
  const a = fn(s - 0.5);
  const b = fn(s + 0.5);
  const d: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const n = Math.hypot(...d);
  return [d[0] / n, d[1] / n, d[2] / n];
};

// inclinação lateral nas curvas (segunda derivada da lateral)
export const rolagem = (s: number) => {
  const d = 2;
  return (lateral(s + d) - 2 * lateral(s) + lateral(s - d)) / (d * d);
};

// percurso na pista nova: cada arco passa no quadro em que o item entra
const io = Easing.inOut(Easing.cubic);
export const sNovo = (f: number) =>
  interpolate(f, [T.virada, V.itens[0], V.itens[1], V.itens[2], V.itens[3], V.drone + 40], [4, 60, 125, 190, 255, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t,
  });
export const ARCOS_NOVOS = V.itens.map((f) => sNovo(f) + 1.5);
export const suavizar = io;
