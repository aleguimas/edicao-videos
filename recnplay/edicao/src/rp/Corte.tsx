import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonteMono } from "../fonte";
import cortesJson from "./dados/cortes.json";
import ganhosJson from "./dados/ganhos.json";
import { Encerramento } from "./Encerramento";
import { LogoRP, PalavraGigante, Tarja } from "./Grafismos";
import { CONDENSADA, DEGRADE_FESTIVAL, PESSOAS, ROSA, textoFestival, type Pessoa } from "./tema";
import { CameraV, Legenda, type Palavra } from "./Vertical";
import { CHEIA, COMPASSO, DROP, SOB_VOZ, Trilha } from "./Trilha";

// Corte 9:16 para a semana: gancho (a frase mais forte) → fala completa com título fixo,
// legenda palavra a palavra, tarja na primeira aparição e barra de progresso → encerramento.
type PlanoV = { ini: number; fim: number; h: number };
type TrechoC = { ini: number; fim: number; quem: Pessoa; palavras: Palavra[]; planos?: PlanoV[] };
type DadosCorte = { titulo: string[]; gancho: TrechoC & { palavra: string }; trechos: TrechoC[] };
export const CORTES = cortesJson as unknown as Record<string, DadosCorte>;

const ganhos = ganhosJson as { ini: number; fim: number; ganho: number }[];
const ganhoVoz = (t: number) => ganhos.find((g) => t >= g.ini && t < g.fim)?.ganho ?? 0.5;
const FIM_S = 3.5;

const durS = (c: DadosCorte) =>
  c.gancho.fim - c.gancho.ini + c.trechos.reduce((s, t) => s + t.fim - t.ini, 0) + FIM_S;
export const duracaoCorte = (id: string, fps: number) => Math.round(durS(CORTES[id]) * fps) + 2;

const Voz: React.FC<{ ini: number; fim: number }> = ({ ini, fim }) => {
  const { fps } = useVideoConfig();
  const dur = Math.round((fim - ini) * fps);
  const g = ganhoVoz((ini + fim) / 2);
  return (
    <Audio
      src={staticFile("conversa.mp4")}
      trimBefore={Math.round(ini * fps)}
      trimAfter={Math.round(fim * fps)}
      volume={(f) => g * interpolate(f, [0, 3, dur - 4, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
  );
};

// Título fixo no topo: etiqueta do festival + 2 linhas (a 2ª em degradê).
const Titulo: React.FC<{ linhas: string[] }> = ({ linhas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const maior = Math.max(...linhas.map((l) => l.length));
  const tam = Math.min(104, 960 / (maior * 0.44));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ height: 560, background: "linear-gradient(180deg, rgba(8,6,12,0.92) 0%, rgba(8,6,12,0.7) 55%, rgba(8,6,12,0) 100%)" }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 110, opacity: a, translate: `0 ${(1 - a) * -20}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LogoRP largura={190} />
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: ROSA }}>✳ MARKETING NA ERA DA IA</div>
        </div>
        <div style={{ ...CONDENSADA, fontSize: tam, lineHeight: 0.95, color: "#fff", marginTop: 18, whiteSpace: "nowrap" }}>{linhas[0]}</div>
        <div style={{ ...CONDENSADA, ...textoFestival, fontSize: tam, lineHeight: 0.95, whiteSpace: "nowrap", display: "inline-block" }}>
          {linhas[1]}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Progresso: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, bottom: 0, height: 10, width: `${(frame / total) * 100}%`, backgroundImage: DEGRADE_FESTIVAL }} />
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(frame, [0, 6], [0.85, 0], { extrapolateRight: "clamp" }) }} />;
};

export const Corte: React.FC<{ id: string }> = ({ id }) => {
  const { fps } = useVideoConfig();
  const c = CORTES[id];
  const g = c.gancho;
  const fG = Math.round((g.fim - g.ini) * fps);
  let acc = fG;
  const vistos = new Set<Pessoa>();
  const corpoIni = fG;
  const corpoDur = Math.round(c.trechos.reduce((s, t) => s + t.fim - t.ini, 0) * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* gancho */}
      <Sequence durationInFrames={fG}>
        <CameraV ini={g.ini} quem={g.quem} />
        <PalavraGigante texto={g.palavra} y={0.36} escala={1.15} />
        <Legenda palavras={g.palavras} inicio={g.ini} />
        <Voz ini={g.ini} fim={g.fim} />
      </Sequence>
      {/* fala completa */}
      {c.trechos.map((t, i) => {
        const from = acc;
        const d = Math.round((t.fim - t.ini) * fps);
        acc += d;
        const tarja = !vistos.has(t.quem);
        vistos.add(t.quem);
        return (
          <Sequence key={i} from={from} durationInFrames={d} premountFor={fps}>
            {(t.planos ?? [{ ini: t.ini, fim: t.fim, h: 720 }]).map((p) => (
              <Sequence key={p.ini} from={Math.round((p.ini - t.ini) * fps)} durationInFrames={Math.round((p.fim - p.ini) * fps)} premountFor={fps}>
                <CameraV ini={p.ini} quem={t.quem} hOrigem={p.h} />
              </Sequence>
            ))}
            <Legenda palavras={t.palavras} inicio={t.ini} />
            {tarja ? (
              <Sequence from={Math.round(0.3 * fps)} durationInFrames={Math.min(d - 6, Math.round(4 * fps))}>
                <Tarja nome={PESSOAS[t.quem].nome} cargo={PESSOAS[t.quem].cargo} papel={t.quem === "C" ? "Mediador" : "Palestrante"} escala={1.05} esquerda={56} baixo={300} />
              </Sequence>
            ) : null}
            <Voz ini={t.ini} fim={t.fim} />
          </Sequence>
        );
      })}
      <Sequence from={corpoIni} durationInFrames={corpoDur}>
        <Titulo linhas={c.titulo} />
        <Progresso total={corpoDur} />
      </Sequence>
      <Sequence from={corpoIni} durationInFrames={8}>
        <Flash />
      </Sequence>
      <Sequence from={acc} durationInFrames={Math.round(FIM_S * fps) + 2}>
        <Encerramento vertical />
      </Sequence>
      {/* trilha baixa sob as falas, cheia no encerramento; cada corte começa num ponto da música */}
      <Trilha
        de={DROP + (Number(id.replace("corte", "")) - 1) * 8 * COMPASSO}
        volume={(f) =>
          interpolate(
            f,
            [0, acc, acc + 6, acc + Math.round((FIM_S - 0.8) * fps), acc + Math.round(FIM_S * fps)],
            [SOB_VOZ, SOB_VOZ, CHEIA * 0.9, CHEIA * 0.9, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
    </AbsoluteFill>
  );
};
