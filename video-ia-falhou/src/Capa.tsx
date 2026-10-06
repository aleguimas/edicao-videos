import { Video } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Interactive,
  staticFile,
  type InteractivitySchema,
} from "remotion";
import { FILTRO_IMAGEM } from "./Apresentacao";
import { fontFamily, VERDE_SIMPLI } from "./fonte";

// Capa (Still 1080x1920). O grid do Instagram corta para 4:5 no centro
// (y de 285 a 1635): título, selo e logo ficam dentro dessa faixa.
const LARGURA_ORIGEM = 2160;
const ALTURA_ORIGEM = 3840;
const QUADRO_ORIGEM = 144; // 4,8 s: olhando para a câmera, mão aberta
const ZOOM = 1.15;
const CENTRO_X = 0.272;
const CENTRO_Y = 0.4835;

const largura = LARGURA_ORIGEM * ZOOM;
const altura = ALTURA_ORIGEM * ZOOM;
const camera: React.CSSProperties = {
  position: "absolute",
  width: LARGURA_ORIGEM,
  height: ALTURA_ORIGEM,
  maxWidth: "none",
  transformOrigin: "0 0",
  filter: FILTRO_IMAGEM,
  translate: `${Math.min(Math.max(540 - CENTRO_X * largura, 1080 - largura), 0)}px ${Math.min(Math.max(960 - CENTRO_Y * altura, 1920 - altura), 0)}px`,
  scale: String(ZOOM),
};

type CapaProps = {
  readonly linha1: string;
  readonly linha2: string;
  readonly selo: string;
  readonly style?: React.CSSProperties;
};

const CapaInner: React.FC<CapaProps> = ({ linha1, linha2, selo, style }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden", fontFamily, ...style }}>
      <Video name="Quadro base" src={staticFile("apresentacao.mp4")} trimBefore={QUADRO_ORIGEM} muted style={camera} />

      {/* Escurece topo e base para o título e o selo */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Título atrás do apresentador */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 305,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontWeight: 900,
          lineHeight: 0.92,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
          color: "white",
          textShadow: "0 8px 40px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ fontSize: 240 }}>{linha1}</div>
        <div style={{ fontSize: 186, color: VERDE_SIMPLI }}>{linha2}</div>
      </div>

      {/* Pessoas por cima do título */}
      <Video name="Apresentador (recorte)" src={staticFile("apresentador-recorte.webm")} trimBefore={QUADRO_ORIGEM} muted style={camera} />

      {/* Selo e logo, na frente de tudo */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1360,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: VERDE_SIMPLI,
            color: "#0B0B0C",
            fontWeight: 900,
            fontSize: 62,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            padding: "18px 40px",
            borderRadius: 18,
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          {selo}
        </div>
      </div>
      <CanvasImage
        name="Logo Simplí"
        src={staticFile("logo-simpli-fundo-escuro.png")}
        style={{ position: "absolute", left: 390, top: 1500, width: 300, height: 120 }}
      />
    </AbsoluteFill>
  );
};

const capaSchema = {
  linha1: { type: "text-content", default: "A IA", description: "Título linha 1" },
  linha2: { type: "text-content", default: "Falhou?", description: "Título linha 2" },
  selo: { type: "text-content", default: "Ou foi o processo?", description: "Selo" },
} as const satisfies InteractivitySchema;

export const Capa = Interactive.withSchema({
  Component: CapaInner,
  componentName: "<Capa>",
  schema: capaSchema,
  wrapInSequence: true,
});
