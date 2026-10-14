import type React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";

type EncerramentoProps = {
  readonly corFundo: string;
  readonly style?: React.CSSProperties;
};

// Cartela final com a logo da Simplí sobre fundo escuro
const EncerramentoInner: React.FC<EncerramentoProps> = ({ corFundo, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: corFundo,
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <CanvasImage
        name="Logo Simplí"
        src={staticFile("logo-simpli-fundo-escuro.png")}
        premountFor={fps}
        style={{
          width: 640,
          height: 256,
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 1 * fps], [0.92, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
    </AbsoluteFill>
  );
};

const encerramentoSchema = {
  corFundo: { type: "color", default: "#0B0B0C", description: "Cor de fundo" },
} as const satisfies InteractivitySchema;

export const Encerramento = Interactive.withSchema({
  Component: EncerramentoInner,
  componentName: "<Encerramento>",
  schema: encerramentoSchema,
  wrapInSequence: true,
});
