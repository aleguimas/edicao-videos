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
import { DestaqueFrente } from "./DestaqueFrente";

// Resolução de public/apresentacao.mp4. Com origem 2160x3840 (iPhone 4K
// vertical) a janela 1080x1920 é um zoom 2x sem perda de nitidez.
// Se a origem for 1080x1920, use 1080/1920 aqui e a câmera fica fixa.
const LARGURA_ORIGEM = 1080;
const ALTURA_ORIGEM = 1920;

// Corte do original: começa quando ele começa a falar e termina logo depois
// da última palavra ("certo", 49,2 s)
const INICIO_ORIGINAL = 210; // 7,0 s

// Keyframes gerados por scripts/calcular-camera.py (cole a saída aqui).
// Centro horizontal do apresentador (0–1 da largura original) por frame.
// Apresentador sentado e quase parado: enquadramento fixo (seguir a máscara
// faria a câmera tremer com os gestos). Média medida: 0,44; cabeça em ~0,47.
const CAMERA_FRAMES = [0, 1307];
const CAMERA_CENTRO_X = [0.47, 0.47];
// Zoom extra quando o apresentador vai para a borda do quadro
// Origem 1080x1920: zoom leve só para centralizar (acima disso perde nitidez)
const ZOOM_FRAMES = [0, 1307];
const ZOOM = [1.06, 1.06];

// Centro vertical fixo: cabeça no terço superior, enquadramento até a cintura
const CAMERA_CENTRO_Y = 0.5;

// Correção de cor aplicada igualmente ao vídeo base e ao recorte
const FILTRO_IMAGEM = "saturate(0.95) contrast(1.03)";

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
      {/* 1. Vídeo (com a voz) */}
      <Video
        name="Vídeo base"
        src={staticFile("apresentacao.mp4")}
        trimBefore={INICIO_ORIGINAL}
        premountFor={fps}
        style={camera}
      />

      {/* 2. Frases em destaque, na frente do apresentador */}
      <DestaqueFrente
        name="O melhor carro de corrida"
        from={12}
        durationInFrames={78}
        premountFor={fps}
        linha1="O melhor carro"
        linha2="de corrida"
        tamanho1={90}
        tamanho2={124}
        opacidadeTexto={0.85}
        atrasoLinha2={0.55}
      />
      <DestaqueFrente
        name="Um ótimo freio"
        from={245}
        durationInFrames={55}
        premountFor={fps}
        linha1="Um ótimo"
        linha2="freio"
        tamanho1={110}
        tamanho2={170}
        opacidadeTexto={0.85}
        atrasoLinha2={0.75}
      />
      <DestaqueFrente
        name="Na medida, na hora certa"
        from={364}
        durationInFrames={74}
        premountFor={fps}
        linha1="Na medida,"
        linha2="na hora certa"
        tamanho1={100}
        tamanho2={98}
        opacidadeTexto={0.85}
        atrasoLinha2={0.66}
      />
      <DestaqueFrente
        name="A mesma coisa com a IA"
        from={596}
        durationInFrames={82}
        premountFor={fps}
        linha1="A mesma coisa"
        linha2="com a IA"
        tamanho1={92}
        tamanho2={150}
        opacidadeTexto={0.85}
        atrasoLinha2={0.76}
      />
      <DestaqueFrente
        name="Vamos acelerar"
        from={733}
        durationInFrames={77}
        premountFor={fps}
        linha1="Vamos"
        linha2="acelerar!"
        tamanho1={110}
        tamanho2={140}
        opacidadeTexto={0.85}
        atrasoLinha2={0.22}
      />
      <DestaqueFrente
        name="Vai bater, acabou o projeto?"
        from={938}
        durationInFrames={70}
        premountFor={fps}
        linha1="Vai bater,"
        linha2="acabou o projeto?"
        tamanho1={110}
        tamanho2={76}
        opacidadeTexto={0.85}
        atrasoLinha2={1.16}
      />
      <DestaqueFrente
        name="O freio: governança"
        from={1052}
        durationInFrames={61}
        premountFor={fps}
        linha1="O freio:"
        linha2="governança"
        tamanho1={110}
        tamanho2={130}
        opacidadeTexto={0.85}
        atrasoLinha2={0.98}
      />
      <DestaqueFrente
        name="No rumo certo"
        from={1202}
        durationInFrames={86}
        premountFor={fps}
        linha1="Colocar o projeto"
        linha2="no rumo certo"
        tamanho1={76}
        tamanho2={98}
        opacidadeTexto={0.85}
        atrasoLinha2={1.48}
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
