import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { fontFamily, VERDE_SIMPLI } from "./fonte";

type DestaqueProps = {
  readonly linha1: string;
  readonly linha2: string;
  readonly tamanho1: number;
  readonly tamanho2: number;
  readonly corDestaque: string;
  readonly atrasoLinha2: number;
  readonly style?: React.CSSProperties;
};

// Frase em destaque, em duas linhas. A segunda linha leva a cor da marca.
// Entra palavra a palavra e sai com fade no fim da própria sequência.
const DestaqueInner: React.FC<DestaqueProps> = ({
  linha1,
  linha2,
  tamanho1,
  tamanho2,
  corDestaque,
  atrasoLinha2,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrada = (atraso: number) =>
    interpolate(frame, [atraso, atraso + 0.4 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

  const saida = interpolate(
    frame,
    [durationInFrames - 0.3 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const p1 = entrada(0);
  const p2 = entrada(atrasoLinha2 * fps);

  return (
    <Interactive.Div
      style={{
        position: "absolute",
        inset: 0,
        paddingTop: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily,
        fontWeight: 900,
        lineHeight: 0.92,
        textTransform: "uppercase",
        letterSpacing: "-0.02em",
        textAlign: "center",
        whiteSpace: "nowrap",
        color: "white",
        textShadow: "0 8px 40px rgba(0,0,0,0.45)",
        opacity: saida,
        ...style,
      }}
    >
      {/* Escurece o fundo atrás da frase para dar leitura */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: p1,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 70%)",
        }}
      />
      <div
        style={{
          position: "relative",
          fontSize: tamanho1,
          opacity: p1,
          translate: `0px ${(1 - p1) * 60}px`,
          scale: String(0.85 + 0.15 * p1),
        }}
      >
        {linha1}
      </div>
      <div
        style={{
          position: "relative",
          fontSize: tamanho2,
          color: corDestaque,
          opacity: p2,
          translate: `0px ${(1 - p2) * 60}px`,
          scale: String(0.85 + 0.15 * p2),
        }}
      >
        {linha2}
      </div>
    </Interactive.Div>
  );
};

const destaqueSchema = {
  linha1: { type: "text-content", default: "", description: "Linha 1" },
  linha2: { type: "text-content", default: "", description: "Linha 2 (destaque)" },
  tamanho1: { type: "number", default: 170, min: 40, max: 400, hiddenFromList: false, description: "Tamanho linha 1" },
  tamanho2: { type: "number", default: 170, min: 40, max: 400, hiddenFromList: false, description: "Tamanho linha 2" },
  corDestaque: { type: "color", default: VERDE_SIMPLI, description: "Cor de destaque" },
  atrasoLinha2: {
    type: "number",
    default: 0.12,
    min: 0,
    max: 5,
    step: 0.05,
    hiddenFromList: false,
    description: "Atraso da linha 2 (s)",
  },
} as const satisfies InteractivitySchema;

export const Destaque = Interactive.withSchema({
  Component: DestaqueInner,
  componentName: "<Destaque>",
  schema: destaqueSchema,
  wrapInSequence: true,
});
