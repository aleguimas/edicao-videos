import { Video } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Filtro de cor único para todas as fontes: mais contraste, saturação levemente
// menor e um toque quente para tirar o azulado da luz fria da sala.
export const FILTRO_COR = "contrast(1.08) saturate(0.9) sepia(0.07) brightness(1.03)";

type ClipeProps = {
  readonly arquivo: string;
  // zoom e ponto da origem (coordenadas 1080x1920) que fica no centro da tela,
  // do início [0] ao fim [1] do clipe: a câmera acompanha o apresentador.
  readonly zoom: readonly [number, number];
  readonly x: readonly [number, number];
  readonly y: readonly [number, number];
  readonly trimBefore?: number;
  readonly punch?: boolean;
  readonly mudo?: boolean;
  readonly style?: React.CSSProperties;
};

// Um trecho de vídeo vertical com câmera virtual (zoom + enquadramento) e "punch-in"
// na entrada. O ponto central é limitado para nunca mostrar a borda do quadro.
export const Clipe: React.FC<ClipeProps> = ({
  arquivo,
  zoom,
  x,
  y,
  trimBefore = 0,
  punch = true,
  mudo = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const entrada = punch
    ? interpolate(frame, [0, 0.35 * fps], [1.12, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    : 1;
  const z = (zoom[0] + (zoom[1] - zoom[0]) * p) * entrada;
  const limite = (v: number, metade: number, total: number) =>
    Math.min(total - metade / z, Math.max(metade / z, v));
  const cx = limite(x[0] + (x[1] - x[0]) * p, 540, 1080);
  const cy = limite(y[0] + (y[1] - y[0]) * p, 960, 1920);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0B0B0C", ...style }}>
      <Video
        src={staticFile(`resumo/${arquivo}`)}
        trimBefore={trimBefore}
        muted={mudo}
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          scale: String(z),
          translate: `${z * (540 - cx)}px ${z * (960 - cy)}px`,
          filter: FILTRO_COR,
        }}
      />
    </AbsoluteFill>
  );
};
