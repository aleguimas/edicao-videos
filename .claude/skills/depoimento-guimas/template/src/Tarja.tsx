import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { AZUL_GUIMAS, CANTO_SUP, DEGRADE_BARRA, fonteMono, NAVY_VIDRO, TITULO } from "./fonte";

type TarjaProps = {
  readonly nome: string;
  readonly cargo: string;
  readonly topo: number;
  readonly style?: React.CSSProperties;
};

// Crédito do depoimento no padrão do Guimas: cartão navy, barrinha em degradê,
// nome em Archivo e cargo em etiqueta mono azul.
const TarjaInner: React.FC<TarjaProps> = ({ nome, cargo, topo, style }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const anim = (ini: number) =>
    interpolate(frame, [ini, ini + 0.4 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  const saida = interpolate(frame, [durationInFrames - 0.3 * fps, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Interactive.Div
      style={{
        position: "absolute",
        left: 64,
        top: topo,
        opacity: anim(0) * (1 - saida),
        translate: `${(1 - anim(0)) * -60 - saida * 60}px 0px`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "24px 34px 26px",
          borderRadius: 18,
          backgroundColor: NAVY_VIDRO,
          border: "1.5px solid rgba(143,169,230,0.3)",
          boxShadow: "0 18px 50px rgba(5,8,25,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -10,
            top: -10,
            width: 56,
            height: 42,
            borderTop: `4px solid ${CANTO_SUP}`,
            borderLeft: `4px solid ${CANTO_SUP}`,
          }}
        />
        <div style={{ width: 64 * anim(0.1 * fps), height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
        <div
          style={{
            ...TITULO,
            fontSize: 58,
            color: "#FFFFFF",
            letterSpacing: "-1px",
            opacity: anim(0.12 * fps),
            translate: `${(1 - anim(0.12 * fps)) * -30}px 0px`,
          }}
        >
          {nome}
        </div>
        <div
          style={{
            fontFamily: fonteMono,
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: AZUL_GUIMAS,
            opacity: anim(0.25 * fps),
            translate: `${(1 - anim(0.25 * fps)) * -30}px 0px`,
          }}
        >
          {cargo}
        </div>
      </div>
    </Interactive.Div>
  );
};

const tarjaSchema = {
  nome: { type: "text-content", default: "", description: "Nome" },
  cargo: { type: "text-content", default: "", description: "Cargo / empresa" },
  topo: { type: "number", default: 1420, min: 0, max: 1800, hiddenFromList: false, description: "Posição vertical (px)" },
} as const satisfies InteractivitySchema;

export const Tarja = Interactive.withSchema({
  Component: TarjaInner,
  componentName: "<Tarja>",
  schema: tarjaSchema,
  wrapInSequence: true,
});
