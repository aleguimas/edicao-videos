import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Abertura, duracaoAbertura } from "./Abertura";
import { Camera, type Plano } from "./Camera";
import ganhosJson from "./dados/ganhos.json";
import planosJson from "./dados/planos.json";
import { Encerramento } from "./Encerramento";
import { Capitulo, Marca, PalavraGigante, Tarja } from "./Grafismos";
import { PESSOAS, type Pessoa } from "./tema";
import { CHEIA, COMPASSO, DROP, Trilha } from "./Trilha";

// Vídeo completo 16:9: abertura do festival → conversa inteira (câmera virtual, voz
// equalizada por turno, tarjas, capítulos e palavras gigantes) → encerramento.
export const INICIO = 27.5; // segundo da gravação em que a conversa começa
export const FIM = 4341.0; // logo após "Obrigado a cada um de vocês"
export const ENCERRAMENTO_S = 8;
export const ABERTURA_S = duracaoAbertura();
export const duracaoCompleto = (fps: number) => Math.round((ABERTURA_S + FIM - INICIO + ENCERRAMENTO_S) * fps);

const planos = (planosJson as Plano[])
  .filter((p) => p.fim > INICIO && p.ini < FIM)
  .map((p) => ({ ...p, ini: Math.max(p.ini, INICIO), fim: Math.min(p.fim, FIM) }));

type Ganho = { ini: number; fim: number; quem: string; ganho: number };
const ganhos = ganhosJson as Ganho[];

const ganhoEm = (t: number) => {
  // rampa de 0,4 s entre turnos para a troca de ganho não "pular"
  const i = ganhos.findIndex((g) => t >= g.ini && t < g.fim);
  if (i < 0) return ganhos[ganhos.length - 1].ganho;
  const g = ganhos[i];
  const ant = ganhos[i - 1];
  if (ant && t - g.ini < 0.4) return interpolate(t - g.ini, [0, 0.4], [ant.ganho, g.ganho]);
  return g.ganho;
};

export const CAPITULOS: { t: number; palavra: string; pergunta: string }[] = [
  { t: 467, palavra: "Identidade", pergunta: "Com IA, a gente está produzindo mais ou só mais do mesmo?" },
  { t: 1354, palavra: "Produtividade", pergunta: "Como ganhar produtividade sem deixar as pessoas de lado?" },
  { t: 1692, palavra: "Senso crítico", pergunta: "Os profissionais vão ficar dependentes da IA?" },
  { t: 2030, palavra: "Resultado", pergunta: "Como não cair na armadilha de produzir muito e entregar pouco?" },
  { t: 2361, palavra: "Competências", pergunta: "O que desenvolver para trabalhar com IA nesse novo mercado?" },
  { t: 3212, palavra: "Plateia", pergunta: "O público entra na conversa" },
  { t: 3810, palavra: "Recado final", pergunta: "O que fica para quem quer continuar construindo?" },
];

export const PALAVRAS: { t: number; texto: string; dur?: number }[] = [
  { t: 612.1, texto: "CONTEXTO" },
  { t: 729.4, texto: "USAR A IA\nOU SER USADO", dur: 3 },
  { t: 809.3, texto: "BANCO OU\nBANDO DE DADOS?", dur: 2.6 },
  { t: 1109.8, texto: "A CRIATIVIDADE\nÉ HUMANA", dur: 2.6 },
  { t: 1142.2, texto: "SEIS DEDOS" },
  { t: 1404.4, texto: "QUAL PROBLEMA\nVOCÊ QUER RESOLVER?", dur: 2.8 },
  { t: 1838.4, texto: "10 MINUTOS" },
  { t: 1962.2, texto: "O HUMANO\nNO PROCESSO", dur: 2.4 },
  { t: 2253.7, texto: "ESTRATÉGIA\nDE NEGÓCIO", dur: 2.6 },
  { t: 2487.0, texto: "ESCADA,\nNÃO MULETA", dur: 2.4 },
  { t: 2673.0, texto: "SEJAM\nCURIOSOS", dur: 2.4 },
  { t: 2932.1, texto: "E SE?" },
  { t: 2994.4, texto: "METAMORFOSE\nAMBULANTE", dur: 2.6 },
  { t: 3230.7, texto: "REPERTÓRIO" },
  { t: 4087.2, texto: "GESTOR\nDE PESSOAS", dur: 2.4 },
  { t: 4224.3, texto: "PESSOAS" },
  { t: 4262.0, texto: "CORAGEM" },
];

// Tarja quando a pessoa começa a falar e não teve tarja nos últimos 12 minutos.
const TARJAS: { t: number; quem: Pessoa }[] = (() => {
  const ultima: Partial<Record<Pessoa, number>> = {};
  const out: { t: number; quem: Pessoa }[] = [];
  for (const g of ganhos) {
    if (!("ABCD".includes(g.quem)) || g.fim - g.ini < 15) continue;
    const q = g.quem as Pessoa;
    const t = Math.max(g.ini, INICIO) + 1.5;
    if (ultima[q] === undefined || t - (ultima[q] as number) > 720) {
      if (CAPITULOS.some((c) => Math.abs(c.t - t) < 6) || PALAVRAS.some((p) => Math.abs(p.t - t) < 5)) continue;
      out.push({ t, quem: q });
      ultima[q] = t;
    }
  }
  return out;
})();

export const Conversa: React.FC = () => {
  const { fps } = useVideoConfig();
  const f = (t: number) => Math.round((t - INICIO) * fps);
  return (
    <AbsoluteFill>
      <Camera planos={planos} inicio={INICIO} />
      <Marca />
      {TARJAS.map((x) => (
        <Sequence key={`t${x.t}`} from={f(x.t)} durationInFrames={6 * fps}>
          <Tarja nome={PESSOAS[x.quem].nome} cargo={PESSOAS[x.quem].cargo} papel={x.quem === "C" ? "Mediador" : "Palestrante"} />
        </Sequence>
      ))}
      {PALAVRAS.map((p) => (
        <Sequence key={`p${p.t}`} from={f(p.t - 0.15)} durationInFrames={Math.round((p.dur ?? 2.2) * fps)}>
          <PalavraGigante texto={p.texto} />
        </Sequence>
      ))}
      {CAPITULOS.map((c, i) => (
        <Sequence key={`c${c.t}`} from={f(c.t - 0.3)} durationInFrames={Math.round(4.2 * fps)}>
          <Capitulo numero={i + 1} palavra={c.palavra} pergunta={c.pergunta} />
        </Sequence>
      ))}
      <Audio
        src={staticFile("conversa.mp4")}
        trimBefore={Math.round(INICIO * fps)}
        trimAfter={Math.round(FIM * fps)}
        volume={(fr) => {
          const t = INICIO + fr / fps;
          const entrada = interpolate(fr, [0, 0.5 * fps], [0, 1], { extrapolateRight: "clamp" });
          return ganhoEm(t) * entrada;
        }}
      />
    </AbsoluteFill>
  );
};

export const Completo: React.FC = () => {
  const { fps } = useVideoConfig();
  const a = Math.round(ABERTURA_S * fps);
  const c = Math.round((FIM - INICIO) * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={a}>
        <Abertura />
        {/* música da abertura: começa no início da faixa e some no fim da cartela */}
        <Trilha
          de={0}
          volume={(f) => CHEIA * interpolate(f, [a - 1.2 * fps, a], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
      <Sequence from={a} durationInFrames={c}>
        <Conversa />
      </Sequence>
      <Sequence from={a + c} durationInFrames={Math.round(ENCERRAMENTO_S * fps)}>
        <Encerramento />
        <Trilha
          de={DROP + 127 * COMPASSO}
          volume={(f) =>
            CHEIA *
            interpolate(f, [0, 0.3 * fps, (ENCERRAMENTO_S - 1.2) * fps, ENCERRAMENTO_S * fps], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </Sequence>
    </AbsoluteFill>
  );
};
