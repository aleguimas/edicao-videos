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

// Resolução de public/apresentacao.mp4. Com origem 2160x3840 (iPhone 4K
// vertical) a janela 1080x1920 é um zoom 2x sem perda de nitidez.
// Se a origem for 1080x1920, use 1080/1920 aqui e a câmera fica fixa.
const LARGURA_ORIGEM = 2160;
const ALTURA_ORIGEM = 3840;

// Keyframes gerados por scripts/calcular-camera.py (cole a saída aqui).
// Centro horizontal do apresentador (0–1 da largura original) por frame.
const CAMERA_FRAMES = [0, 299];
const CAMERA_CENTRO_X = [0.5, 0.5];
// Zoom extra quando o apresentador vai para a borda do quadro
const ZOOM_FRAMES = [0, 299];
const ZOOM = [1, 1];

// Centro vertical fixo: cabeça no terço superior, enquadramento até a cintura
const CAMERA_CENTRO_Y = 0.55;

// Correção de cor aplicada igualmente ao vídeo base e ao recorte
const FILTRO_IMAGEM = "saturate(0.78) contrast(1.03)";

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

      {/* 2. Frases em destaque, atrás das pessoas.
          Uma <Destaque> por frase, cada uma como nó próprio (editável no Studio).
          from = início da fala da frase (frames); a frase sai antes da logo.
          paddingTop: a cabeça deve cobrir só ~1/3 da altura das letras da
          linha 2. Nunca uma letra inteira. Conferir com stills. */}
      <Destaque
        name="Frase 1"
        from={0}
        durationInFrames={75}
        premountFor={fps}
        linha1="Linha um"
        linha2="Destaque"
        tamanho1={150}
        tamanho2={160}
        corDestaque={VERDE_SIMPLI}
        atrasoLinha2={0.4}
        style={{ paddingTop: 220 }}
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
