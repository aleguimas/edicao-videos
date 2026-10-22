import type React from "react";
import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { textoDegrade, TITULO } from "../fonte";

type PalavrasCineticasProps = {
  readonly linha1: string;
  readonly linha2: string;
  readonly tamanho1: number;
  readonly tamanho2: number;
  readonly atrasoLinha2: number; // s, quando a palavra da linha 2 é dita
  readonly topo: number;
  readonly style?: React.CSSProperties;
};

// folga para a batida (escala 1,12) não encostar nas bordas
const caber = (texto: string, tamanho: number) => Math.min(tamanho, 900 / (texto.length * 0.66));

// Palavras-chave do corte no padrão @aleguimas (versão do "destaque na frente" da Simplí):
// grandes, sem cartão, cada palavra sobe e entra em foco na hora em que é dita; linha 1
// branca, linha 2 em degradê azul → lavanda com impacto (escala). Um halo navy desfocado
// por trás garante leitura sobre a sala clara. O bloco flutua e sai subindo com desfoque.
const PalavrasCineticasInner: React.FC<PalavrasCineticasProps> = ({
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
  const saida = interpolate(frame, [durationInFrames - 0.3 * fps, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const halo = interpolate(frame, [0, 0.25 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const palavra = (texto: string, atraso: number, degrade: boolean, chave: string) => {
    const p = interpolate(frame, [atraso, atraso + 0.35 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    // a linha 2 entra com "batida": passa de 1,25 e assenta em 1
    const batida = degrade
      ? interpolate(frame, [atraso, atraso + 0.12 * fps, atraso + 0.35 * fps], [0.6, 1.12, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
    return (
      <span
        key={chave}
        style={{
          display: "inline-block",
          color: "#FFFFFF",
          ...(degrade ? textoDegrade : {}),
          opacity: p,
          translate: `0px ${(1 - p) * 60}px`,
          filter: `blur(${(1 - p) * 12}px)`,
          scale: String(batida),
        }}
      >
        {texto}
      </span>
    );
  };

  const linha = (texto: string, inicio: number, tamanho: number, degrade: boolean, chave: string) => (
    <div
      style={{
        fontSize: caber(texto, tamanho),
        display: "flex",
        gap: "0.32em",
        justifyContent: "center",
        // sombra que funciona também no texto em degradê (background-clip)
        filter: "drop-shadow(0 5px 18px rgba(5,8,25,0.9)) drop-shadow(0 1px 3px rgba(5,8,25,0.8))",
      }}
    >
      {texto.split(" ").map((p, i) => palavra(p, inicio + i * 0.08 * fps, degrade, `${chave}-${i}`))}
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
        flexDirection: "column",
        alignItems: "center",
        ...TITULO,
        lineHeight: 0.98,
        letterSpacing: "-2px",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        translate: `0px ${interpolate(frame, [0, durationInFrames], [0, -30]) - saida * 80}px`,
        opacity: 1 - saida,
        filter: `blur(${saida * 10}px)`,
        ...style,
      }}
    >
      {/* halo navy por trás das palavras */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: -40,
          bottom: -40,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(12,17,40,0.82) 0%, rgba(12,17,40,0.55) 45%, transparent 74%)",
          filter: "blur(18px)",
          opacity: halo,
        }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {linha1 ? linha(linha1, 0, tamanho1, false, "l1") : null}
        {linha2 ? linha(linha2, atrasoLinha2 * fps, tamanho2, true, "l2") : null}
      </div>
    </Interactive.Div>
  );
};

const schema = {
  linha1: { type: "text-content", default: "", description: "Linha 1 (branca)" },
  linha2: { type: "text-content", default: "", description: "Linha 2 (degradê, com batida)" },
  tamanho1: { type: "number", default: 96, min: 40, max: 300, hiddenFromList: false, description: "Tamanho linha 1" },
  tamanho2: { type: "number", default: 140, min: 40, max: 300, hiddenFromList: false, description: "Tamanho linha 2" },
  atrasoLinha2: { type: "number", default: 0.3, min: 0, max: 6, step: 0.05, hiddenFromList: false, description: "Atraso da linha 2 (s)" },
  topo: { type: "number", default: 1180, min: 0, max: 1800, hiddenFromList: false, description: "Posição vertical (px)" },
} as const satisfies InteractivitySchema;

export const PalavrasCineticas = Interactive.withSchema({
  Component: PalavrasCineticasInner,
  componentName: "<PalavrasCineticas>",
  schema,
  wrapInSequence: true,
});
