// Gera src/longo/roteiro.ts a partir de scripts/roteiro-longo.json:
// 1. ajusta início/fim de cada trecho para a pausa mais próxima (silencedetect no bloco),
// 2. escolhe pontos de troca de plano dentro do trecho, sempre em pausas, a cada ~6–9 s,
// 3. monta o caminho da câmera (centro do apresentador em pé, coordenadas 2560x1440) a partir
//    das marcações à mão em scripts/roteiro-longo.json ("camera"); o Vision não acha o apresentador.
// Uso (de dentro de edicao/): node scripts/gerar-roteiro-longo.mjs
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const R = JSON.parse(readFileSync("scripts/roteiro-longo.json", "utf8"));
const W = 2560;
const H = 1440;

// pausas [início, fim] do bloco (o ffmpeg escreve o silencedetect no stderr)
const silencios = {};
const silenciosDe = (bloco) => {
  if (silencios[bloco]) return silencios[bloco];
  const log = spawnSync(
    "npx",
    ["remotion", "ffmpeg", "-hide_banner", "-i", `public/longo/${bloco}.mp4`, "-vn", "-af", "silencedetect=noise=-34dB:d=0.12", "-f", "null", "-"],
    { encoding: "utf8", maxBuffer: 1 << 28 },
  ).stderr;
  const ini = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const fim = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  silencios[bloco] = ini.map((s, i) => [s, fim[i] ?? s + 0.3]);
  return silencios[bloco];
};

const ajustar = (bloco, ini, fim) => {
  const s = silenciosDe(bloco);
  let a = ini - 0.12;
  let b = fim + 0.2;
  // início: fim de uma pausa logo antes da primeira palavra
  const pa = s.filter(([, e]) => e >= a - 0.5 && e <= a + 0.35).sort((x, y) => Math.abs(x[1] - a) - Math.abs(y[1] - a))[0];
  if (pa) a = Math.max(pa[0], pa[1] - 0.1);
  // fim: começo de uma pausa logo depois da última palavra
  const pb = s.filter(([st]) => st >= b - 0.4 && st <= b + 0.6).sort((x, y) => Math.abs(x[0] - b) - Math.abs(y[0] - b))[0];
  if (pb) b = Math.min(pb[1], pb[0] + 0.15);
  return [Math.max(0, +a.toFixed(2)), +b.toFixed(2)];
};

// pontos de troca de plano: pausas dentro do trecho, a cada 6–9 s
const trocas = (bloco, a, b) => {
  const s = silenciosDe(bloco)
    .map(([st, e]) => (st + e) / 2)
    .filter((m) => m > a + 4 && m < b - 3);
  const out = [];
  let ultimo = a;
  for (const m of s) {
    if (m - ultimo >= 6) {
      out.push(+m.toFixed(2));
      ultimo = m;
    }
  }
  // trecho longo sem pausas boas: corta no meio
  if (!out.length && b - a > 14) out.push(+((a + b) / 2).toFixed(2));
  return out;
};

// caminho da câmera por bloco: marcações à mão do roteiro (centro da cabeça → topo da cabeça)
const camera = (bloco) => (R.camera?.[bloco] ?? []).map(([t, x, y]) => [t, Math.round(x * W), Math.round((y - 0.03) * H)]);

const linhas = [];
const trecho = ([id, bloco, ini, fim, texto]) => {
  const base = R.blocos[bloco];
  const [a, b] = ajustar(bloco, ini - base, fim - base);
  return `  { id: "${id}", bloco: "${bloco}", ini: ${a}, fim: ${b}, trocas: [${trocas(bloco, a, b).join(", ")}] }, // ${texto}`;
};
linhas.push("// Gerado por scripts/gerar-roteiro-longo.mjs a partir de scripts/roteiro-longo.json. Não editar à mão.");
linhas.push("// Tempos em segundos dentro de public/longo/<bloco>.mp4 (ajustados às pausas).");
linhas.push("export type Trecho = { id: string; bloco: string; ini: number; fim: number; trocas: readonly number[] };");
linhas.push(`export const BLOCOS_ORIGEM: Record<string, number> = ${JSON.stringify(R.blocos)};`);
linhas.push("export const ABERTURA: readonly Trecho[] = [");
R.abertura.forEach((t) => linhas.push(trecho(t)));
linhas.push("];");
linhas.push("export const CAPITULOS: readonly { titulo: string; curto: string; sub: string; trechos: readonly Trecho[] }[] = [");
for (const c of R.capitulos) {
  linhas.push(`  { titulo: ${JSON.stringify(c.titulo)}, curto: ${JSON.stringify(c.curto)}, sub: ${JSON.stringify(c.sub)}, trechos: [`);
  c.trechos.forEach((t) => linhas.push("  " + trecho(t)));
  linhas.push("  ] },");
}
linhas.push("];");
linhas.push("// centro do apresentador [s no bloco, x, topo da cabeça] em 2560x1440");
linhas.push("export const CAMERA: Record<string, readonly (readonly [number, number, number])[]> = {");
for (const bloco of Object.keys(R.blocos)) linhas.push(`  ${bloco}: ${JSON.stringify(camera(bloco))},`);
linhas.push("};");
writeFileSync("src/longo/roteiro.ts", linhas.join("\n") + "\n");
console.log("src/longo/roteiro.ts gerado");
