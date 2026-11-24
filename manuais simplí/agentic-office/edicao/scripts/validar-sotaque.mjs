// Confere se a Ana fala em português em cada trecho: o Whisper diz a probabilidade de cada
// trecho (blocos separados por pausa, como na legenda) ser português ou inglês.
// Uso: node scripts/validar-sotaque.mjs <pasta-dos-mp3> <voz.json>
// Modelo: MODELO_WHISPER (pasta com config.json e onnx/), padrão = cache do projeto da Revestir.
import { AutoProcessor, env, Tensor, WhisperForConditionalGeneration } from "@huggingface/transformers";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const [pasta, arqVoz] = process.argv.slice(2);
const modelo = process.env.MODELO_WHISPER ?? path.resolve("../../../revestir/edicao/node_modules/@huggingface/transformers/.cache/whisper-large-v3-turbo_timestamped-v1");
env.allowRemoteModels = false;
env.localModelPath = path.dirname(modelo);
const id = path.basename(modelo);

const processor = await AutoProcessor.from_pretrained(id);
const model = await WhisperForConditionalGeneration.from_pretrained(id, { dtype: { encoder_model: "fp32", decoder_model_merged: "q4" }, device: "cpu" });
// ids dos tokens especiais direto do tokenizer.json (os de idioma são <|pt|>, <|en|>…)
const especiais = new Map(JSON.parse(readFileSync(path.join(modelo, "tokenizer.json"), "utf8")).added_tokens.map((t) => [t.content, t.id]));
const sot = especiais.get("<|startoftranscript|>");
const LINGUAS = ["pt", "en", "es"].map((l) => [l, especiais.get(`<|${l}|>`)]);
const TODAS = [...especiais.entries()].filter(([t]) => /^<\|[a-z]{2,3}\|>$/.test(t)).map(([, i]) => i);

// mp3 -> PCM 16 kHz mono float32 (afconvert vem no macOS)
const pcm = (arq) => {
  const wav = path.join(tmpdir(), `sotaque-${process.pid}.wav`);
  execFileSync("afconvert", ["-f", "WAVE", "-d", "LEF32@16000", "-c", "1", arq, wav]);
  const buf = readFileSync(wav);
  const dados = buf.indexOf("data") + 8; // pula o cabeçalho até o bloco de áudio
  return new Float32Array(buf.buffer.slice(buf.byteOffset + dados, buf.byteOffset + dados + Math.floor((buf.length - dados) / 4) * 4));
};

const idioma = async (audio) => {
  const { input_features } = await processor(audio);
  const out = await model({ input_features, decoder_input_ids: new Tensor("int64", [BigInt(sot)], [1, 1]) });
  const logits = out.logits.data;
  const v = out.logits.dims[2];
  const base = logits.length - v;
  // softmax só entre os tokens de idioma
  const max = Math.max(...TODAS.map((i) => logits[base + i]));
  const soma = TODAS.reduce((s, i) => s + Math.exp(logits[base + i] - max), 0);
  return Object.fromEntries(LINGUAS.map(([l, i]) => [l, Math.exp(logits[base + i] - max) / soma]));
};

// SOTAQUE_MAX_PALAVRAS limita o teste aos trechos curtos, onde o sotaque aparece, quando a máquina está sem memória
const MAX_PALAVRAS = Number(process.env.SOTAQUE_MAX_PALAVRAS ?? Infinity);
const vozes = JSON.parse(readFileSync(arqVoz, "utf8"));
const piores = [];
for (const [fala, v] of Object.entries(vozes)) {
  const audio = pcm(path.join(pasta, `${fala}.mp3`));
  // blocos separados por pausa (mesma regra da legenda), com folga de 0,15 s
  const blocos = [];
  let atual = [];
  v.palavras.forEach((p, i) => {
    const ant = v.palavras[i - 1];
    if (atual.length && p[0] - ant[1] > 0.28) {
      blocos.push(atual);
      atual = [];
    }
    atual.push(p);
  });
  if (atual.length) blocos.push(atual);
  for (const b of blocos) {
    if (b.length > MAX_PALAVRAS) continue;
    const ini = Math.max(0, Math.floor((b[0][0] - 0.15) * 16000));
    const fim = Math.min(audio.length, Math.ceil((b[b.length - 1][1] + 0.15) * 16000));
    const p = await idioma(audio.slice(ini, fim));
    const texto = b.map((x) => x[2]).join(" ");
    piores.push({ fala, texto, ...p });
    const marca = p.pt < 0.5 ? "  <-- SOTAQUE" : "";
    console.log(`${fala.padEnd(9)} pt ${(p.pt * 100).toFixed(0).padStart(3)}%  en ${(p.en * 100).toFixed(0).padStart(3)}%  es ${(p.es * 100).toFixed(0).padStart(3)}%  ${texto}${marca}`);
  }
}
const ruins = piores.filter((p) => p.pt < 0.5);
console.log(ruins.length ? `\n${ruins.length} trecho(s) abaixo de 50% português` : "\nTodos os trechos acima de 50% português");
process.exit(0);
