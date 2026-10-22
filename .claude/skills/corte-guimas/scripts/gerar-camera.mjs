// Converte o rastreio do apresentador (rastrear-apresentador.swift) num caminho de câmera
// suave para o Remotion: preenche os buracos por interpolação, suaviza com média móvel
// (~2,5 s) e grava um TS com pontos a cada 0,5 s.
// Pontos de emenda (onde o corte junta momentos diferentes do workshop) separam os trechos:
// a suavização e o preenchimento não atravessam a emenda, e o componente troca a posição
// de uma vez na emenda (corte seco de câmera, em vez de deslizar).
// Uso: node scripts/gerar-camera.mjs public/cortes/<nome>-camera.json <duração s> src/corte/camera-<nome>.ts CAMERA_<NOME> [emendas s, ex.: 5,13.5,17.3]
import { readFileSync, writeFileSync } from "node:fs";

const [entrada, duracaoStr, saida, constante, emendasStr = ""] = process.argv.slice(2);
const duracao = Number(duracaoStr);
const emendas = emendasStr.split(",").filter(Boolean).map(Number).sort((a, b) => a - b);
const trechoDe = (t) => emendas.filter((e) => t >= e).length;
// descarta "picos": ponto isolado a mais de 250 px dos dois vizinhos do mesmo trecho
// (detecção errada num único quadro, ex.: alguém passando na frente)
const lidos = JSON.parse(readFileSync(entrada, "utf8"));
const pontos = lidos.filter((p, i) => {
  const a = lidos[i - 1], b = lidos[i + 1];
  if (!a || !b || trechoDe(a.t) !== trechoDe(p.t) || trechoDe(b.t) !== trechoDe(p.t)) return true;
  return !(Math.abs(p.x - a.x) > 250 && Math.abs(p.x - b.x) > 250);
});
if (lidos.length !== pontos.length) console.log(`${lidos.length - pontos.length} pico(s) descartado(s)`);
const PASSO = 0.5;
const n = Math.floor(duracao / PASSO) + 1;

// valor no instante t usando só pontos do mesmo trecho (se o trecho não tiver ponto, usa o mais próximo)
const valor = (campo, t) => {
  const mesmos = pontos.filter((p) => trechoDe(p.t) === trechoDe(t));
  const base = mesmos.length ? mesmos : pontos;
  const depois = base.findIndex((p) => p.t >= t);
  if (depois === -1) return base[base.length - 1][campo];
  if (depois === 0) return base[0][campo];
  const a = base[depois - 1], b = base[depois];
  return a[campo] + ((b[campo] - a[campo]) * (t - a.t)) / (b.t - a.t);
};
const bruto = Array.from({ length: n }, (_, i) => ({ t: i * PASSO, x: valor("x", i * PASSO), y: valor("y", i * PASSO) }));
const JANELA = 2; // pontos de cada lado (2 x 0,5 s)
const suave = bruto.map((p, i) => {
  const viz = bruto.slice(Math.max(0, i - JANELA), i + JANELA + 1).filter((q) => trechoDe(q.t) === trechoDe(p.t));
  return { x: Math.round(viz.reduce((s, q) => s + q.x, 0) / viz.length), y: Math.round(viz.reduce((s, q) => s + q.y, 0) / viz.length) };
});
writeFileSync(
  saida,
  `// Caminho da câmera (centro do apresentador na origem 1080x1920), a cada ${PASSO} s.
// Gerado por scripts/gerar-camera.mjs a partir do rastreio com Apple Vision.
// emendas: instantes (s) em que a câmera troca de posição de uma vez (corte seco).
export const ${constante} = {
  passo: ${PASSO},
  emendas: [${emendas.join(", ")}] as number[],
  x: [${suave.map((p) => p.x).join(", ")}],
  y: [${suave.map((p) => p.y).join(", ")}],
};
`,
);
console.log(`${saida}: ${n} pontos, ${emendas.length} emendas`);
