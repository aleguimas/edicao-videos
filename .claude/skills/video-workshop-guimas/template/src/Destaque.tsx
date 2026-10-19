import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Cantos } from "./Cantos";
import { DEGRADE_BARRA, NAVY_VIDRO, textoDegrade, TITULO } from "./fonte";

type DestaqueProps = {
  readonly linha1: string;
  readonly linha2: string;
  readonly tamanho1: number;
  readonly tamanho2: number;
  readonly atrasoLinha2: number;
  readonly topo: number;
  readonly style?: React.CSSProperties;
};

// Largura útil do texto dentro do cartão e largura média de um caractere da
// Archivo 800 condensada (fração do tamanho da fonte), para a frase nunca vazar.
const LARGURA_UTIL = 860;
const LARGURA_CARACTERE = 0.64;
const caber = (texto: string, tamanho: number) =>
  Math.min(tamanho, LARGURA_UTIL / (texto.length * LARGURA_CARACTERE));

// Frase em destaque no padrão do Guimas: cartão navy translúcido com molduras de
// canto, barrinha em degradê, linha 1 branca e linha 2 em degradê azul → lavanda.
// O cartão entra com impacto; as palavras aparecem sincronizadas com a fala.
const DestaqueInner: React.FC<DestaqueProps> = ({
  linha1,
  linha2,
  tamanho1,
  tamanho2,
  atrasoLinha2,
  topo,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entrada = interpolate(frame, [0, 0.35 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const saida = interpolate(frame, [durationInFrames - 0.25 * fps, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const palavra = (texto: string, atraso: number, degrade: boolean, chave: string) => {
    const p = interpolate(frame, [atraso, atraso + 0.28 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    return (
      <span
        key={chave}
        style={{
          display: "inline-block",
          color: "#FFFFFF",
          ...(degrade ? textoDegrade : {}),
          opacity: p,
          translate: `0px ${(1 - p) * 40}px`,
          filter: `blur(${(1 - p) * 8}px)`,
        }}
      >
        {texto}
      </span>
    );
  };

  const linha = (texto: string, inicio: number, tamanho: number, degrade: boolean, chave: string) => (
    <div style={{ fontSize: caber(texto, tamanho), display: "flex", gap: "0.22em", justifyContent: "center" }}>
      {texto.split(" ").map((p, i) => palavra(p, inicio + i * 0.07 * fps, degrade, `${chave}-${i}`))}
    </div>
  );

  return (
    <Interactive.Div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: topo,
        display: "flex",
        justifyContent: "center",
        opacity: entrada * (1 - saida),
        scale: String((0.86 + 0.14 * entrada) * (1 + saida * 0.06)),
        translate: `0px ${(1 - entrada) * 50 - saida * 30}px`,
        filter: `blur(${saida * 8}px)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "34px 48px 40px",
          borderRadius: 24,
          backgroundColor: NAVY_VIDRO,
          border: "1.5px solid rgba(143,169,230,0.35)",
          boxShadow: "0 24px 70px rgba(5,8,25,0.55)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          ...TITULO,
          lineHeight: 1.02,
          textTransform: "uppercase",
          letterSpacing: "-1px",
          whiteSpace: "nowrap",
        }}
      >
        <Cantos margem={-14} tamanho={[70, 52]} espessura={4} />
        <div
          style={{
            width: 64 * entrada,
            height: 5,
            borderRadius: 3,
            backgroundImage: DEGRADE_BARRA,
            marginBottom: 8,
          }}
        />
        {linha1 ? linha(linha1, 0.1 * fps, tamanho1, false, "l1") : null}
        {linha2 ? linha(linha2, Math.max(0.1 * fps, atrasoLinha2 * fps), tamanho2, true, "l2") : null}
      </div>
    </Interactive.Div>
  );
};

const destaqueSchema = {
  linha1: { type: "text-content", default: "", description: "Linha 1 (branca)" },
  linha2: { type: "text-content", default: "", description: "Linha 2 (degradê azul → lavanda)" },
  tamanho1: { type: "number", default: 96, min: 40, max: 300, hiddenFromList: false, description: "Tamanho linha 1" },
  tamanho2: { type: "number", default: 120, min: 40, max: 300, hiddenFromList: false, description: "Tamanho linha 2" },
  atrasoLinha2: { type: "number", default: 0.3, min: 0, max: 6, step: 0.05, hiddenFromList: false, description: "Atraso da linha 2 (s)" },
  topo: { type: "number", default: 1300, min: 0, max: 1800, hiddenFromList: false, description: "Posição vertical (px)" },
} as const satisfies InteractivitySchema;

export const Destaque = Interactive.withSchema({
  Component: DestaqueInner,
  componentName: "<Destaque>",
  schema: destaqueSchema,
  wrapInSequence: true,
});
