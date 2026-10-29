import { Video } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Flash } from "../Flash";
import { DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO, VERDE_SIMPLI } from "../fonte";
import { LogoRevestir } from "../LogoRevestir";

// Cor da missão: contraste leve e saturação um pouco abaixo de 1 (a parede vinho/amarela da
// sala da Revestir estoura fácil). Igual em falas e imagens de apoio.
export const FILTRO_MISSAO = "contrast(1.05) saturate(0.95)";

export const suave = (frame: number, de: number, ate: number) =>
  interpolate(frame, [de, ate], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

// Trecho de vídeo (já recortado em 9:16 pelo preparar-midia.py) em tela cheia. Entra com um zoom
// que assenta e um clarão (corte no tempo da música), depois aproxima devagar. Nas falas, `punch`
// dá uma aproximação rápida nas palavras fortes e o volume tem rampas de 3 frames nas emendas.
export const Clipe: React.FC<{
  readonly arquivo: string;
  readonly inicioS?: number;
  readonly fimS?: number;
  readonly comSom?: boolean;
  readonly ganho?: number;
  readonly zoom?: readonly [number, number];
  readonly foco?: readonly [number, number];
  readonly punch?: readonly number[]; // frames (no clipe) das palavras fortes
  readonly clarao?: number;
}> = ({ arquivo, inicioS = 0, fimS, comSom = false, ganho = 1, zoom = [1.04, 1.12], foco = [540, 800], punch = [], clarao = 0.35 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: n } = useVideoConfig();
  const entrada = interpolate(frame, [0, 0.35 * fps], [1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const batida = punch.reduce(
    (s, p) => s + interpolate(frame, [p - 2, p + 3, p + 0.7 * fps], [0, 0.07, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    0,
  );
  const z = (interpolate(frame, [0, n], [zoom[0], zoom[1]]) + batida) * entrada;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: NAVY }}>
      <Video
        src={staticFile(`midia/${arquivo}.mp4`)}
        trimBefore={Math.round(inicioS * fps)}
        trimAfter={fimS === undefined ? undefined : Math.round(fimS * fps)}
        muted={!comSom}
        volume={(f) => ganho * interpolate(f, [0, 3, n - 3, n], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          scale: String(z),
          transformOrigin: `${foco[0]}px ${foco[1]}px`,
          filter: FILTRO_MISSAO,
        }}
      />
      {clarao > 0 ? (
        <Sequence durationInFrames={6}>
          <Flash intensidade={clarao} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

// Halo escuro desfocado atrás de textos sobre o vídeo.
const Halo: React.FC<{ readonly opacidade: number; readonly margem?: number }> = ({ opacidade, margem = 60 }) => (
  <div
    style={{
      position: "absolute",
      left: margem,
      right: margem,
      top: -70,
      bottom: -70,
      borderRadius: "50%",
      background: "radial-gradient(ellipse at center, rgba(11,11,12,0.85) 0%, rgba(11,11,12,0.55) 45%, transparent 74%)",
      filter: "blur(18px)",
      opacity: opacidade,
    }}
  />
);

const saidaDe = (frame: number, n: number, fps: number) =>
  interpolate(frame, [n - 0.25 * fps, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });

// Título da viagem: "MISSÃO SIMPLÍ" + destino, sobre os cortes do aeroporto/avião/estrada.
export const TituloViagem: React.FC<{ readonly etiqueta: string; readonly linha1: string; readonly linha2: string; readonly rodape: string }> = ({
  etiqueta,
  linha1,
  linha2,
  rodape,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: n } = useVideoConfig();
  const saida = saidaDe(frame, n, fps);
  const e = (de: number) => suave(frame, de, de + 0.4 * fps);
  const batida = interpolate(frame, [8, 12, 20], [0.5, 1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: 1 - saida,
        translate: `0px ${-saida * 70}px`,
        filter: `blur(${saida * 10}px)`,
      }}
    >
      <Halo opacidade={e(0)} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, filter: "drop-shadow(0 5px 18px rgba(0,0,0,0.9))" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 34, letterSpacing: "10px", color: VERDE_SIMPLI, opacity: e(0), marginBottom: 10 }}>{etiqueta}</div>
        <div style={{ ...TITULO, fontSize: 96, letterSpacing: "-3px", color: "#FFFFFF", lineHeight: 0.95, opacity: e(3), translate: `0px ${(1 - e(3)) * 40}px` }}>{linha1}</div>
        <div style={{ ...TITULO, fontSize: 150, letterSpacing: "-5px", lineHeight: 0.95, ...textoDegrade, opacity: e(8), scale: String(batida) }}>{linha2}</div>
        <div style={{ width: 120 * e(14), height: 7, borderRadius: 4, backgroundImage: DEGRADE_BARRA, margin: "18px 0 10px" }} />
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 30, letterSpacing: "8px", color: "#FFFFFF", opacity: e(16) }}>{rodape}</div>
      </div>
    </div>
  );
};

// Logo de parceiro/produto com etiqueta mono em cima e linha de apoio embaixo. `cartao` usa a logo
// da Revestir no par da marca (amarelo sobre cereja).
export const LogoEm: React.FC<{
  readonly arquivo: string;
  readonly largura: number;
  readonly etiqueta: string;
  readonly apoio?: string;
  readonly cartao?: boolean; // logo da Revestir (LogoRevestir) em vez de imagem solta
  readonly topo?: number;
}> = ({ arquivo, largura, etiqueta, apoio, cartao = false, topo = 1150 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: n } = useVideoConfig();
  const saida = saidaDe(frame, n, fps);
  const e = (de: number) => suave(frame, de, de + 0.4 * fps);
  const batida = interpolate(frame, [4, 9, 18], [0.6, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: topo,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
        opacity: 1 - saida,
        translate: `0px ${-saida * 70}px`,
        filter: `blur(${saida * 10}px)`,
      }}
    >
      <Halo opacidade={e(0)} margem={20} />
      <div style={{ position: "relative", fontFamily: fonteMono, fontWeight: 600, fontSize: 30, letterSpacing: "9px", color: VERDE_SIMPLI, opacity: e(0), filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.9))" }}>
        {etiqueta}
      </div>
      <div
        style={{
          position: "relative",
          opacity: e(4),
          scale: String(batida),
          ...(cartao ? {} : { filter: "drop-shadow(0 8px 26px rgba(0,0,0,0.85))" }),
        }}
      >
        {cartao ? <LogoRevestir largura={largura} /> : <Img src={staticFile(`midia/${arquivo}`)} style={{ width: largura, display: "block" }} />}
      </div>
      {apoio ? (
        <div
          style={{
            position: "relative",
            ...TITULO,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: "-0.5px",
            color: "#FFFFFF",
            textTransform: "uppercase",
            opacity: e(12),
            translate: `0px ${(1 - e(12)) * 30}px`,
            filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.9))",
          }}
        >
          {apoio}
        </div>
      ) : null}
    </div>
  );
};

// Capítulo no topo: em que parte da missão estamos.
export const Capitulo: React.FC<{ readonly etiqueta: string; readonly linha1: string; readonly linha2: string }> = ({ etiqueta, linha1, linha2 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = suave(frame, 0, 0.45 * fps);
  const saida = interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p * (1 - saida), translate: `0px ${(1 - p) * -30}px` }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          padding: "18px 34px 22px",
          borderRadius: 20,
          backgroundColor: "rgba(11,11,12,0.82)",
          border: "1.5px solid rgba(60,224,30,0.35)",
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 21, letterSpacing: "6px", color: VERDE_SIMPLI }}>{etiqueta}</div>
        <div style={{ ...TITULO, fontSize: Math.min(50, 900 / ((linha1.length + linha2.length + 1) * 0.72)), lineHeight: 1, letterSpacing: "-1px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          <span style={{ color: "#FFFFFF" }}>{linha1} </span>
          <span style={textoDegrade}>{linha2}</span>
        </div>
      </div>
    </div>
  );
};

// Tarja com nome e papel de quem aparece.
export const Tarja: React.FC<{ readonly nome: string; readonly papel: string; readonly topo?: number }> = ({ nome, papel, topo = 1560 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = suave(frame, 0, 0.4 * fps);
  const saida = interpolate(frame, [durationInFrames - 0.25 * fps, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 70, top: topo, opacity: p * (1 - saida), translate: `${(1 - p) * -60}px 0px` }}>
      <div style={{ padding: "20px 32px 24px", borderRadius: 18, backgroundColor: "rgba(11,11,12,0.86)", boxShadow: "0 18px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ ...TITULO, fontSize: 50, lineHeight: 1, letterSpacing: "-1px", color: "#FFFFFF", whiteSpace: "nowrap" }}>{nome}</div>
        <div style={{ width: 56 * p, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA, margin: "12px 0 12px" }} />
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 21, letterSpacing: "4px", color: VERDE_SIMPLI }}>{papel}</div>
      </div>
    </div>
  );
};

// Barra de progresso fina no topo (verde Simplí).
export const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, backgroundImage: DEGRADE_BARRA }} />;
};

// Logo pequena da Simplí no rodapé durante as falas.
export const MarcaSimpli: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [0, 0.4 * fps, durationInFrames - 0.4 * fps, durationInFrames], [0, 0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Img
      src={staticFile("midia/logo-simpli-fundo-escuro.png")}
      style={{ position: "absolute", left: 455, bottom: 70, width: 170, opacity: o, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.7))" }}
    />
  );
};

// Encerramento: Agentic Office + Simplí sobre o fundo escuro com brilho verde.
export const Encerramento: React.FC<{ readonly chamada1: string; readonly chamada2: string }> = ({ chamada1, chamada2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = (de: number) => suave(frame, de, de + 0.45 * fps);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        backgroundImage: "radial-gradient(circle at 50% 38%, rgba(60,224,30,0.16), transparent 55%)",
        opacity: e(0),
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      <div style={{ ...TITULO, fontSize: 70, color: "#FFFFFF", letterSpacing: "-2px", textTransform: "uppercase", opacity: e(4), translate: `0px ${(1 - e(4)) * 30}px` }}>{chamada1}</div>
      <div style={{ ...TITULO, fontSize: 96, letterSpacing: "-3px", textTransform: "uppercase", ...textoDegrade, opacity: e(9), scale: String(0.86 + 0.14 * e(9)) }}>{chamada2}</div>
      <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 720, marginTop: 50, opacity: e(18), scale: String(0.9 + 0.1 * e(18)) }} />
      <div style={{ width: 90, height: 6, borderRadius: 3, backgroundImage: DEGRADE_BARRA, opacity: e(26) }} />
      <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 26, letterSpacing: "7px", color: "#C9CCC9", opacity: e(28) }}>UMA PLATAFORMA</div>
      <Img src={staticFile("midia/logo-simpli-fundo-escuro.png")} style={{ width: 420, marginTop: -10, opacity: e(32), scale: String(0.9 + 0.1 * e(32)) }} />
      <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 30, letterSpacing: "4px", color: VERDE_SIMPLI, opacity: e(38) }}>simpli.ia.br</div>
    </AbsoluteFill>
  );
};
