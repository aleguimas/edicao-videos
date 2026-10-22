// Converte a transcrição por palavra (JSON do transcrever-curtos.mts) num arquivo TS de
// legendas para o componente Depoimento, com quebra de página no fim de cada frase.
// Uso: node scripts/gerar-legendas.mjs public/depoimentos/transcricoes/<nome>.json src/depoimento/legendas-<nome>.ts LEGENDAS_<NOME>
// Depois REVISE o arquivo gerado: nomes próprios, siglas (CDL, Sebrae, IA) e pontuação.
import { readFileSync, writeFileSync } from "node:fs";

const [entrada, saida, constante = "LEGENDAS"] = process.argv.slice(2);
const legendas = JSON.parse(readFileSync(entrada, "utf8"));
const linhas = legendas.map((c) => {
  const texto = " " + c.text.trim();
  const fimDeFrase = /[.?!]$/.test(c.text.trim());
  return `  { text: ${JSON.stringify(texto)}, startMs: ${c.startMs}, endMs: ${c.endMs}, timestampMs: ${c.timestampMs ?? null}, confidence: null${fimDeFrase ? ", pageBreakAfter: true" : ""} },`;
});
writeFileSync(
  saida,
  `import type { Caption } from "@remotion/captions";

// Legendas por palavra do depoimento (Whisper large-v3-turbo), revisadas.
// pageBreakAfter no fim de cada frase: uma frase nunca divide tela com a seguinte.
export const ${constante}: Caption[] = [
${linhas.join("\n")}
];
`,
);
console.log(`${saida}: ${legendas.length} palavras`);
