import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { fontFamily } from "./fonte";

type DestaqueFrenteProps = {
  readonly linha1: string;
  readonly linha2: string;
  readonly tamanho1: number;
  readonly tamanho2: number;
  readonly opacidadeTexto: number;
  readonly atrasoLinha2: number;
  readonly style?: React.CSSProperties;
};

// Frase em destaque NA FRENTE do apresentador: branca com leve transparência.
// Cada palavra sobe e entra em foco; o bloco flutua devagar enquanto está na
// tela e sai subindo com desfoque.
const DestaqueFrenteInner: React.FC<DestaqueFrenteProps> = ({
  linha1,
  linha2,
  tamanho1,
  tamanho2,
  opacidadeTexto,
  atrasoLinha2,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const saida = interpolate(
    frame,
    [durationInFrames - 0.4 * fps, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.cubic),
    },
  );

  const palavra = (texto: string, atraso: number, chave: string) => {
    const p = interpolate(frame, [atraso, atraso + 0.45 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    return (
      <span
        key={chave}
        style={{
          display: "inline-block",
          opacity: p,
          translate: `0px ${(1 - p) * 70}px`,
          filter: `blur(${(1 - p) * 14}px)`,
        }}
      >
        {texto}
      </span>
    );
  };

  const linha = (texto: string, inicio: number, tamanho: number, chave: string) => (
    <div
      style={{
        fontSize: tamanho,
        display: "flex",
        gap: "0.24em",
        justifyContent: "center",
      }}
    >
      {texto
        .split(" ")
        .map((p, i) => palavra(p, inicio + i * 0.1 * fps, `${chave}-${i}`))}
    </div>
  );

  const palavras1 = linha1.split(" ").length;

  return (
    <Interactive.Div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1080,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily,
        fontWeight: 900,
        lineHeight: 0.95,
        textTransform: "uppercase",
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
        color: `rgba(255, 255, 255, ${opacidadeTexto})`,
        textShadow: "0 6px 30px rgba(0,0,0,0.35)",
        // flutuação lenta enquanto a frase está na tela
        translate: `0px ${interpolate(frame, [0, durationInFrames], [0, -40]) - saida * 80}px`,
        scale: String(interpolate(frame, [0, durationInFrames], [1, 1.04])),
        opacity: 1 - saida,
        filter: `blur(${saida * 12}px)`,
        ...style,
      }}
    >
      {linha(linha1, 0, tamanho1, "l1")}
      {linha2 ? linha(linha2, Math.max(atrasoLinha2 * fps, palavras1 * 0.1 * fps), tamanho2, "l2") : null}
    </Interactive.Div>
  );
};

const destaqueFrenteSchema = {
  linha1: { type: "text-content", default: "", description: "Linha 1" },
  linha2: { type: "text-content", default: "", description: "Linha 2" },
  tamanho1: { type: "number", default: 110, min: 40, max: 400, hiddenFromList: false, description: "Tamanho linha 1" },
  tamanho2: { type: "number", default: 130, min: 40, max: 400, hiddenFromList: false, description: "Tamanho linha 2" },
  opacidadeTexto: {
    type: "number",
    default: 0.85,
    min: 0.3,
    max: 1,
    step: 0.05,
    hiddenFromList: false,
    description: "Opacidade do texto",
  },
  atrasoLinha2: {
    type: "number",
    default: 0.3,
    min: 0,
    max: 5,
    step: 0.05,
    hiddenFromList: false,
    description: "Atraso da linha 2 (s)",
  },
} as const satisfies InteractivitySchema;

export const DestaqueFrente = Interactive.withSchema({
  Component: DestaqueFrenteInner,
  componentName: "<DestaqueFrente>",
  schema: destaqueFrenteSchema,
  wrapInSequence: true,
});
