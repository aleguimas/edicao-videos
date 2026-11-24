import { Audio, Video } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Cartela } from "./Abertura";
import ganhosJson from "./dados/ganhos.json";
import resumoJson from "./dados/resumo.json";
import { Encerramento } from "./Encerramento";
import { LogoRP, PalavraGigante, Tarja } from "./Grafismos";
import { FILTRO_RUA, PESSOAS, PRETO, type Pessoa } from "./tema";
import { CameraV, Legenda, type Palavra } from "./Vertical";
import { CHEIA, COMPASSO as C, DROP, SOB_VOZ, Trilha } from "./Trilha";

type Trecho = { ini: number; fim: number; quem: Pessoa; texto: string; palavras: Palavra[] };
const TRECHOS = (resumoJson as { resumo: Trecho[] }).resumo;
const ganhos = ganhosJson as { ini: number; fim: number; ganho: number }[];
export const ganhoVoz = (t: number) => ganhos.find((g) => t >= g.ini && t < g.fim)?.ganho ?? 0.5;

// Blocos do resumo, em ordem. "rua" = clipes do festival só com música.
type Bloco =
  | { tipo: "rua"; tomadas: { clipe: string; de: number; dur: number; palavra?: string }[] }
  | { tipo: "cartela"; dur: number }
  | { tipo: "fala"; trecho: number }
  | { tipo: "fim"; dur: number };

const BLOCOS: Bloco[] = [
  {
    tipo: "rua",
    tomadas: [
      { clipe: "150216", de: 1.2, dur: C, palavra: "O FUTURO" },
      { clipe: "171743", de: 2.0, dur: C, palavra: "NASCE" },
      { clipe: "150426", de: 3.0, dur: C, palavra: "AQUI" },
      { clipe: "150830", de: 2.2, dur: C },
    ],
  },
  { tipo: "cartela", dur: 2 * C },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ tipo: "fala" as const, trecho: i })),
  {
    tipo: "rua",
    tomadas: [
      { clipe: "171013", de: 1.5, dur: C },
      { clipe: "171918", de: 1.0, dur: C, palavra: "IA COM\nESTRATÉGIA" },
      { clipe: "151646", de: 0.8, dur: C },
    ],
  },
  ...[6, 7, 8, 9, 10, 11].map((i) => ({ tipo: "fala" as const, trecho: i })),
  { tipo: "fim", dur: 3 * C },
];

const durBloco = (b: Bloco) =>
  b.tipo === "rua" ? b.tomadas.reduce((s, t) => s + t.dur, 0) : b.tipo === "fala" ? TRECHOS[b.trecho].fim - TRECHOS[b.trecho].ini : b.dur;

export const duracaoResumo = (fps: number) => BLOCOS.reduce((s, b) => s + Math.round(durBloco(b) * fps), 0);

const RuaV: React.FC<{ clipe: string; de: number; palavra?: string }> = ({ clipe, de, palavra }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = interpolate(frame, [0, 0.3 * fps, 2 * fps], [1.16, 1.06, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO, overflow: "hidden" }}>
      <Video
        src={staticFile(`broll/${clipe}.mp4`)}
        trimBefore={Math.round(de * fps)}
        muted
        style={{ position: "absolute", height: 1920, width: 3413, left: (1080 - 3413) / 2, top: 0, scale: String(z), filter: FILTRO_RUA }}
      />
      {palavra ? <PalavraGigante texto={palavra} y={0.45} escala={1.1} /> : null}
    </AbsoluteFill>
  );
};

const Fala: React.FC<{ tr: Trecho; tarja: boolean }> = ({ tr, tarja }) => {
  const { fps } = useVideoConfig();
  const dur = Math.round((tr.fim - tr.ini) * fps);
  const g = ganhoVoz((tr.ini + tr.fim) / 2);
  return (
    <AbsoluteFill>
      <CameraV ini={tr.ini} quem={tr.quem} />
      <Legenda palavras={tr.palavras} inicio={tr.ini} />
      <LogoRP largura={230} style={{ position: "absolute", left: 50, top: 60, opacity: 0.9 }} />
      {tarja ? (
        <Sequence from={Math.round(0.2 * fps)} durationInFrames={Math.min(dur - 6, Math.round(3.6 * fps))}>
          <Tarja
            nome={PESSOAS[tr.quem].nome}
            cargo={PESSOAS[tr.quem].cargo}
            papel={tr.quem === "C" ? "Mediador" : "Palestrante"}
            escala={1.05}
            esquerda={56}
            baixo={300}
          />
        </Sequence>
      ) : null}
      <Audio
        src={staticFile("conversa.mp4")}
        trimBefore={Math.round(tr.ini * fps)}
        trimAfter={Math.round(tr.fim * fps)}
        volume={(f) =>
          g *
          interpolate(f, [0, 3, dur - 4, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
    </AbsoluteFill>
  );
};

// volume da trilha ao longo do resumo: cheia nas imagens/cartela/fim, baixa sob as falas.
// A descida termina antes da voz entrar; a subida começa depois que ela acaba.
const volumeTrilha = (fps: number) => {
  const pts: [number, number][] = [];
  let acc = 0;
  for (const b of BLOCOS) {
    const d = Math.round(durBloco(b) * fps);
    const v = b.tipo === "fala" ? SOB_VOZ : CHEIA;
    if (pts.length === 0) pts.push([0, v]);
    else if (pts[pts.length - 1][1] !== v) {
      if (v === SOB_VOZ) pts.push([acc - 8, CHEIA], [acc, SOB_VOZ]);
      else pts.push([acc, SOB_VOZ], [acc + 6, CHEIA]);
    }
    acc += d;
  }
  pts.push([acc - fps, CHEIA], [acc, 0]);
  return (f: number) =>
    interpolate(f, pts.map((p) => p[0]), pts.map((p) => p[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

export const Resumo90: React.FC = () => {
  const { fps } = useVideoConfig();
  let acc = 0;
  const vistos = new Set<Pessoa>();
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO }}>
      {BLOCOS.map((b, i) => {
        const from = acc;
        const d = Math.round(durBloco(b) * fps);
        acc += d;
        let conteudo: React.ReactNode = null;
        if (b.tipo === "rua") {
          let a2 = 0;
          conteudo = b.tomadas.map((t) => {
            const f0 = a2;
            a2 += Math.round(t.dur * fps);
            return (
              <Sequence key={t.clipe} from={f0} durationInFrames={Math.round(t.dur * fps)} premountFor={fps}>
                <RuaV clipe={t.clipe} de={t.de} palavra={t.palavra} />
              </Sequence>
            );
          });
        } else if (b.tipo === "cartela") {
          conteudo = <Cartela vertical />;
        } else if (b.tipo === "fala") {
          const tr = TRECHOS[b.trecho];
          const tarja = !vistos.has(tr.quem);
          vistos.add(tr.quem);
          conteudo = <Fala tr={tr} tarja={tarja} />;
        } else {
          conteudo = <Encerramento vertical />;
        }
        return (
          <Sequence key={i} from={from} durationInFrames={d} premountFor={fps}>
            {conteudo}
          </Sequence>
        );
      })}
      <Trilha de={DROP} volume={volumeTrilha(fps)} />
    </AbsoluteFill>
  );
};
