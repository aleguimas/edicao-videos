import { Easing, interpolate } from "remotion";

// ---------- Linha do tempo (quadros a 30 fps) ----------
export const T = {
  subida: 90, // fim do gancho, começa a subida
  topo: 390, // carrinho chega ao topo (silêncio)
  queda: 450, // começa a queda (a trilha vira aqui)
  chave: 560,
  fatura: 670,
  chao: 780,
  rebobinar: 880,
  virada: 935,
  fechamento: 1200,
  fim: 1320,
} as const;

// ---------- Geometria do mundo (unidades do SVG) ----------
export const X0 = 200; // início da curva
export const XP = 1900; // pico
export const XF = 2700; // chão da queda
export const XE = 3050; // fim
export const CHAO = 2100;
export const PICO = 500;

const g0 = Math.exp(-(2.3 ** 2));
const g1 = Math.exp(-(2.1 ** 2));
const limita = (v: number) => Math.max(0, Math.min(1, v));

// confiança de 0 a 1 em função de x (gaussiana assimétrica: sobe devagar, despenca rápido)
export const confianca = (x: number) => {
  if (x <= XP) {
    const u = limita((x - X0) / (XP - X0));
    return Math.max(0, (Math.exp(-(((1 - u) * 2.3) ** 2)) - g0) / (1 - g0));
  }
  const v = limita((x - XP) / (XF - XP));
  return Math.max(0, (Math.exp(-((v * 2.1) ** 2)) - g1) / (1 - g1));
};

export const yCurva = (x: number) => CHAO - (CHAO - PICO) * confianca(x);

export const angulo = (x: number) => {
  const d = 4;
  return Math.atan2(yCurva(x + d) - yCurva(x - d), 2 * d);
};

export const caminho = (de: number, ate: number, passo = 8) => {
  if (ate <= de) return "";
  const pts: string[] = [];
  for (let x = de; x < ate; x += passo) pts.push(`${x.toFixed(1)},${yCurva(x).toFixed(1)}`);
  pts.push(`${ate.toFixed(1)},${yCurva(ate).toFixed(1)}`);
  return `M${pts.join("L")}`;
};

// Nova curva da virada: sobe com constância e não despenca
export const NOVO_TOPO = 760;
export const yNova = (x: number) => {
  const u = limita((x - X0) / (XE - X0));
  return CHAO - (CHAO - NOVO_TOPO) * (0.5 * u + 0.5 * u ** 1.6);
};
export const caminhoNovo = (de: number, ate: number, passo = 10) => {
  if (ate <= de) return "";
  const pts: string[] = [];
  for (let x = de; x < ate; x += passo) pts.push(`${x.toFixed(1)},${yNova(x).toFixed(1)}`);
  pts.push(`${ate.toFixed(1)},${yNova(ate).toFixed(1)}`);
  return `M${pts.join("L")}`;
};
export const PONTOS_NOVOS = [X0 + (XE - X0) * 0.22, X0 + (XE - X0) * 0.47, X0 + (XE - X0) * 0.72, XE - 40];
// quadro em que cada item do checklist entra (a linha nova passa pelo ponto)
export const DESENHO_NOVO = [945, 1130] as const;
export const xNovo = (f: number) =>
  interpolate(f, [...DESENHO_NOVO], [260, XE], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const ENTRADA_ITENS = PONTOS_NOVOS.map((p) =>
  Math.round(DESENHO_NOVO[0] + ((p - 260) / (XE - 260)) * (DESENHO_NOVO[1] - DESENHO_NOVO[0])),
);

// Paradas (pontos da curva original)
export const PARADAS = [520, 1250, 1890, 2050, 2210, 2390, 2720];

// ---------- Posição do carrinho ----------
const io = Easing.inOut(Easing.cubic);
const segmentos: [number, number, number, number, ((t: number) => number)?][] = [
  // [quadro inicial, quadro final, x inicial, x final, easing]
  [0, T.subida, 260, 260],
  [T.subida, 170, 260, 520, io],
  [170, 290, 520, 1250, io],
  [290, T.topo, 1250, 1885, Easing.out(Easing.cubic)],
  [T.topo, T.queda, 1885, 1902, Easing.inOut(Easing.sin)],
  [T.queda, 470, 1902, 2050, Easing.in(Easing.quad)],
  [470, T.chave, 2050, 2085, Easing.out(Easing.cubic)],
  [T.chave, 578, 2085, 2210, Easing.in(Easing.quad)],
  [578, T.fatura, 2210, 2240, Easing.out(Easing.cubic)],
  [T.fatura, 688, 2240, 2390, Easing.in(Easing.quad)],
  [688, T.chao, 2390, 2420, Easing.out(Easing.cubic)],
  [T.chao, 798, 2420, 2720, Easing.in(Easing.quad)],
  [798, T.rebobinar, 2720, 2830, Easing.out(Easing.cubic)],
  [T.rebobinar, 925, 2830, 260, Easing.inOut(Easing.quad)],
  [925, T.fim, 260, 260],
];

export const xCarrinho = (f: number) => {
  for (const [a, b, xa, xb, e] of segmentos) {
    if (f >= a && f < b) return interpolate(f, [a, b], [xa, xb], { easing: e });
  }
  return 260;
};

// Maior x já percorrido (a linha "acesa" não apaga no rebobinar)
export const xPercorrido = (f: number) => Math.max(xCarrinho(Math.min(f, T.rebobinar)), 260);

// ---------- Câmera ----------
// Visão geral: a curva inteira na largura do celular
const GERAL = { cx: (X0 + XE) / 2 + 20, cy: (CHAO + PICO) / 2, zoom: 1000 / (XE - X0 + 260) };

export type Camera = { cx: number; cy: number; zoom: number; rot: number; telaY: number };

// ruído suave determinístico para o tremor
const tremor = (f: number, s: number) => Math.sin(f * 1.7 + s) * 0.6 + Math.sin(f * 3.1 + s * 2) * 0.4;

export const camera = (f: number): Camera => {
  const x = xCarrinho(f);
  const y = yCurva(x);
  const ang = angulo(x);
  const naQueda = f >= T.queda && f < T.rebobinar;

  // mistura entre visão geral (0) e seguir o carrinho (1)
  const b = interpolate(f, [55, 100, T.rebobinar, 915], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // zoom ao seguir: aproxima na subida, abre um pouco no topo e na queda
  const zoomSeguir = interpolate(f, [100, 380, T.topo + 20, T.queda, T.chao, 800], [1.55, 1.75, 2.1, 1.45, 1.35, 1.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // olha um pouco à frente do carrinho
  const frente = naQueda ? 60 : 110;
  const seguir = { cx: x + frente * Math.cos(ang), cy: y + frente * Math.sin(ang) - 40, zoom: zoomSeguir };

  // na virada a visão geral sobe para abrir espaço ao checklist
  const telaY = interpolate(f, [T.rebobinar, T.virada], [1180, 650], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const lz = Math.log(GERAL.zoom) * (1 - b) + Math.log(seguir.zoom) * b;
  let cx = GERAL.cx * (1 - b) + seguir.cx * b;
  let cy = GERAL.cy * (1 - b) + seguir.cy * b;

  // inclinação: a câmera acompanha parte da inclinação do trilho
  const fator = naQueda ? 0.32 : 0.22;
  let rot = (-ang * 180) / Math.PI * fator * b;

  // tremor na queda, forte nos solavancos
  if (naQueda) {
    const solavanco = [T.queda, T.chave, T.fatura, T.chao]
      .map((q) => interpolate(f - q, [0, 4, 26], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
      .reduce((a, v) => Math.max(a, v), 0);
    const impacto = interpolate(f, [796, 800, 830], [0, 2.2, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const amp = 3 + 14 * solavanco + 20 * impacto;
    cx += tremor(f, 1) * amp;
    cy += tremor(f, 5) * amp;
    rot += tremor(f, 9) * (0.4 + 1.6 * solavanco + 2 * impacto);
  }
  return { cx, cy, zoom: Math.exp(lz), rot, telaY: telaY * (1 - b) + 1000 * b };
};
