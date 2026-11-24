// Renderiza vários quadros de uma composição com um bundle só (para conferir telas).
// Uso: node scripts/quadros.mjs <Composicao> <pasta-saida> <frame1> <frame2> ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { mkdirSync } from "node:fs";

const [id, saida, ...frames] = process.argv.slice(2);
mkdirSync(saida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id });
for (const f of frames) {
  const output = path.join(saida, `${id}-${f}.png`);
  await renderStill({ serveUrl, composition, frame: Number(f), output, scale: 0.5 });
  console.log(output);
}
