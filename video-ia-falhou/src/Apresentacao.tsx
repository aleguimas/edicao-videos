import { Video } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Destaque } from "./Destaque";
import { VERDE_SIMPLI } from "./fonte";

// O vídeo original é 2160x3840. Mostramos uma janela de 1080x1920 (zoom 2x,
// sem perda de resolução) que acompanha o apresentador.
const LARGURA_ORIGEM = 2160;
const ALTURA_ORIGEM = 3840;

// Centro horizontal do apresentador (0–1 da largura original) ao longo do
// tempo, em frames. Calculado a partir da máscara de segmentação e suavizado.
const CAMERA_FRAMES = [
  0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240,
  255, 270, 285, 300, 315, 330, 345, 360, 375, 390, 393,
];
const CAMERA_CENTRO_X = [
  0.321, 0.324, 0.321, 0.318, 0.311, 0.308, 0.306, 0.297, 0.286, 0.274, 0.271,
  0.258, 0.229, 0.186, 0.144, 0.132, 0.156, 0.192, 0.227, 0.236, 0.241, 0.254,
  0.267, 0.275, 0.272, 0.269, 0.268, 0.268,
];
// Centro vertical fixo: cabeça no terço superior, enquadramento até a cintura
const CAMERA_CENTRO_Y = 0.55;

// Correção de cor aplicada igualmente ao vídeo base e ao recorte
export const FILTRO_IMAGEM = "saturate(0.78) contrast(1.03)";

// Zoom extra quando o apresentador vai para a borda esquerda do quadro
const ZOOM_FRAMES = [0, 170, 205, 255, 300, 393];
const ZOOM = [1, 1, 1.2, 1.2, 1, 1];

const limitar = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

const usarCamera = (): React.CSSProperties => {
  const frame = useCurrentFrame();
  const cx = interpolate(frame, CAMERA_FRAMES, CAMERA_CENTRO_X, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, ZOOM_FRAMES, ZOOM, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const largura = LARGURA_ORIGEM * zoom;
  const altura = ALTURA_ORIGEM * zoom;
  const x = limitar(540 - cx * largura, 1080 - largura, 0);
  const y = limitar(960 - CAMERA_CENTRO_Y * altura, 1920 - altura, 0);
  return {
    position: "absolute",
    width: LARGURA_ORIGEM,
    height: ALTURA_ORIGEM,
    maxWidth: "none",
    transformOrigin: "0 0",
    filter: FILTRO_IMAGEM,
    translate: `${x}px ${y}px`,
    scale: String(zoom),
  };
};

type ApresentacaoProps = {
  readonly style?: React.CSSProperties;
};

const ApresentacaoInner: React.FC<ApresentacaoProps> = ({ style }) => {
  const { fps } = useVideoConfig();
  const camera = usarCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden", ...style }}>
      {/* 1. Vídeo completo (com a voz) */}
      <Video
        name="Vídeo base"
        src={staticFile("apresentacao.mp4")}
        premountFor={fps}
        style={camera}
      />

      {/* 2. Frases em destaque, atrás das pessoas */}
      <Destaque
        name="IA falhou"
        from={0}
        durationInFrames={75}
        premountFor={fps}
        linha1="IA"
        linha2="Falhou"
        tamanho1={190}
        tamanho2={180}
        corDestaque={VERDE_SIMPLI}
        atrasoLinha2={0.45}
        style={{ paddingTop: 225 }}
      />
      <Destaque
        name="Falhou o processo"
        from={102}
        durationInFrames={66}
        premountFor={fps}
        linha1="Falhou o"
        linha2="Processo"
        tamanho1={140}
        tamanho2={146}
        corDestaque={VERDE_SIMPLI}
        atrasoLinha2={0.35}
        style={{ paddingTop: 195 }}
      />
      <Destaque
        name="Falta de dados estruturados"
        from={313}
        durationInFrames={57}
        premountFor={fps}
        linha1="Falta de dados"
        linha2="Estruturados"
        tamanho1={92}
        tamanho2={108}
        corDestaque={VERDE_SIMPLI}
        atrasoLinha2={0.95}
        style={{ paddingTop: 330 }}
      />

      {/* 3. Recorte das pessoas por cima das frases (sem áudio) */}
      <Video
        name="Apresentador (recorte)"
        src={staticFile("apresentador-recorte.webm")}
        premountFor={fps}
        muted
        style={camera}
      />
    </AbsoluteFill>
  );
};

const apresentacaoSchema = {} as const satisfies InteractivitySchema;

export const Apresentacao = Interactive.withSchema({
  Component: ApresentacaoInner,
  componentName: "<Apresentacao>",
  schema: apresentacaoSchema,
  wrapInSequence: true,
});
