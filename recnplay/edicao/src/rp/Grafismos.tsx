import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonteMono, fonteTexto } from "../fonte";
import { CONDENSADA, DEGRADE_FESTIVAL, LARANJA, PRETO, ROSA, textoFestival } from "./tema";

const sai = (frame: number, dur: number, fps: number, t = 0.35) =>
  interpolate(frame, [dur - t * fps, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const entra = (frame: number, fps: number, ini = 0, t = 0.5) =>
  interpolate(frame, [ini, ini + t * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

// Logo do Rec'n Play. O PNG oficial é 500x500 com muita margem: o recorte útil é
// x 20–478, y 172–322 (proporção ~3,05:1).
export const LogoRP: React.FC<{ largura: number; claro?: boolean; style?: React.CSSProperties }> = ({
  largura,
  claro = false,
  style,
}) => {
  const s = largura / 458;
  return (
    <div style={{ width: largura, height: 150 * s, overflow: "hidden", position: "relative", ...style }}>
      <Img
        src={staticFile(`midia/recnplay-fundo-${claro ? "claro" : "escuro"}.png`)}
        style={{ position: "absolute", width: 500 * s, height: 500 * s, left: -20 * s, top: -172 * s }}
      />
    </div>
  );
};

// Marca discreta no canto durante a conversa.
export const Marca: React.FC<{ escala?: number }> = ({ escala = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <LogoRP largura={190 * escala} style={{ position: "absolute", right: 52 * escala, top: 40 * escala, opacity: 0.88 }} />
  </AbsoluteFill>
);

// Tarja de nome no estilo do card oficial: "Palestrante" em serifa itálica, nome em
// condensada laranja, cargo em branco; fundo preto com faixa em degradê roxo.
export const Tarja: React.FC<{
  nome: string;
  cargo: string;
  papel?: string;
  escala?: number;
  esquerda?: number;
  baixo?: number;
}> = ({ nome, cargo, papel = "Palestrante", escala = 1, esquerda = 90, baixo = 96 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const a = entra(frame, fps, 0, 0.6);
  const b = entra(frame, fps, 4, 0.6);
  const s = sai(frame, durationInFrames, fps);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: esquerda * escala,
          bottom: baixo * escala,
          opacity: 1 - s,
          translate: `${-40 * s * escala}px 0`,
          clipPath: `inset(0 ${(1 - a) * 100}% 0 0)`,
        }}
      >
        <div
          style={{
            position: "relative",
            padding: `${18 * escala}px ${34 * escala}px ${22 * escala}px ${30 * escala}px`,
            background: `linear-gradient(90deg, ${PRETO} 0%, rgba(8,6,12,0.94) 70%, rgba(60,20,110,0.92) 100%)`,
            borderRadius: 22 * escala,
            whiteSpace: "nowrap",
            boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 8 * escala,
              borderRadius: `${22 * escala}px 0 0 ${22 * escala}px`,
              backgroundImage: "linear-gradient(180deg, #FF6A1F, #FF2E93, #A24BFF)",
            }}
          />
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: 26 * escala,
              color: "rgba(255,255,255,0.82)",
              opacity: b,
            }}
          >
            {papel}
          </div>
          <div style={{ ...CONDENSADA, fontSize: 76 * escala, lineHeight: 0.95, color: LARANJA }}>{nome}</div>
          <div
            style={{
              fontFamily: fonteTexto,
              fontWeight: 600,
              fontSize: 30 * escala,
              color: "#FFFFFF",
              marginTop: 6 * escala,
              opacity: b,
              translate: `${(1 - b) * 20}px 0`,
            }}
          >
            {cargo}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Cartela de capítulo por cima da conversa (o áudio continua): vídeo escurecido com
// tinta roxa, etiqueta rosa, palavra gigante em degradê e a pergunta embaixo.
export const Capitulo: React.FC<{ numero: number; palavra: string; pergunta: string; escala?: number }> = ({
  numero,
  palavra,
  pergunta,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const a = entra(frame, fps, 0, 0.45);
  const s = sai(frame, durationInFrames, fps, 0.45);
  const zoom = interpolate(frame, [0, durationInFrames], [1.12, 1], { easing: Easing.out(Easing.cubic) });
  const p = entra(frame, fps, 8, 0.6);
  const tam = Math.min(300 * escala, (width * 0.86) / (palavra.length * 0.42));
  return (
    <AbsoluteFill style={{ opacity: a * (1 - s), pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(30,8,50,0.55) 0%, rgba(8,6,12,0.86) 75%), linear-gradient(0deg, rgba(138,59,255,0.35), rgba(0,0,0,0))",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26 * escala }}>
        <div
          style={{
            fontFamily: fonteMono,
            fontWeight: 700,
            fontSize: 26 * escala,
            letterSpacing: 8 * escala,
            color: ROSA,
            textTransform: "uppercase",
          }}
        >
          ✳ Parte {numero}
        </div>
        <div
          style={{
            ...CONDENSADA,
            ...textoFestival,
            fontSize: tam,
            lineHeight: 0.9,
            scale: String(zoom),
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {palavra}
        </div>
        <div
          style={{
            fontFamily: fonteTexto,
            fontWeight: 600,
            fontSize: 40 * escala,
            color: "#FFFFFF",
            maxWidth: width * 0.8,
            textAlign: "center",
            lineHeight: 1.25,
            opacity: p,
            translate: `0 ${(1 - p) * 24}px`,
          }}
        >
          {pergunta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Palavra gigante no estilo do aftermovie do festival: enorme, condensada, degradê claro
// e levemente translúcida por cima da imagem, entrando com zoom.
export const PalavraGigante: React.FC<{ texto: string; escala?: number; y?: number }> = ({
  texto,
  escala = 1,
  y = 0.64,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const a = entra(frame, fps, 0, 0.3);
  const s = sai(frame, durationInFrames, fps, 0.3);
  const zoom = interpolate(frame, [0, durationInFrames], [1.08, 1], { easing: Easing.out(Easing.quad) });
  const linhas = texto.split("\n");
  const maior = Math.max(...linhas.map((l) => l.length));
  const tam = Math.min((linhas.length > 1 ? 170 : 230) * escala, (width * 0.8) / (maior * 0.43));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * y,
          translate: "0 -50%",
          textAlign: "center",
          opacity: (0.94 * a) * (1 - s),
          scale: String(zoom),
        }}
      >
        {linhas.map((l) => (
          <div
            key={l}
            style={{
              ...CONDENSADA,
              fontSize: tam,
              lineHeight: 0.88,
              whiteSpace: "nowrap",
              backgroundImage: "linear-gradient(100deg, #FFD2B8 0%, #FFFFFF 35%, #FFC0E0 70%, #E2C6FF 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.45))",
              padding: "0.2em 0.06em 0.06em",
              margin: "-0.2em -0.06em -0.06em",
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const FaixaDegrade: React.FC = () => (
  <AbsoluteFill style={{ backgroundImage: DEGRADE_FESTIVAL }} />
);
