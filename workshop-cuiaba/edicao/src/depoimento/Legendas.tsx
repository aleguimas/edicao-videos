import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { textoDegrade, TITULO } from "../fonte";

type LegendasProps = {
  readonly legendas: Caption[];
  // palavras-chave (sem acento/pontuação não importa) que ficam no degradê depois de ditas
  readonly destaques: readonly string[];
  // ms cortados do início do vídeo (as legendas são do arquivo inteiro)
  readonly deslocamentoMs: number;
  readonly topo: number;
};

const normalizar = (t: string) =>
  t
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z0-9]/g, "");

// Legenda do depoimento no padrão do Guimas: frase inteira na tela, palavras ainda
// não ditas apagadas, a palavra falada acende em degradê azul → lavanda e cresce de
// leve; as palavras-chave ficam no degradê depois de ditas.
export const Legendas: React.FC<LegendasProps> = ({
  legendas,
  destaques,
  deslocamentoMs,
  topo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const agoraMs = (frame / fps) * 1000 + deslocamentoMs;

  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: legendas,
        combineTokensWithinMilliseconds: 1400,
      }),
    [legendas],
  );
  const chaves = useMemo(() => new Set(destaques.map(normalizar)), [destaques]);

  const indice = pages.findIndex((p, i) => {
    const fim = Math.max(
      p.startMs + p.durationMs,
      pages[i + 1]?.startMs ?? Infinity,
    );
    return (
      agoraMs >= p.startMs &&
      agoraMs < Math.min(fim, p.startMs + p.durationMs + 600)
    );
  });
  if (indice < 0) return null;
  const pagina = pages[indice];

  const entrada = interpolate(
    agoraMs,
    [pagina.startMs - 60, pagina.startMs + 180],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: topo,
        display: "flex",
        justifyContent: "center",
        opacity: entrada,
        translate: `0px ${(1 - entrada) * 24}px`,
      }}
    >
      <div
        style={{
          maxWidth: 940,
          padding: "20px 34px 24px",
          borderRadius: 22,
          backgroundColor: "rgba(12,17,40,0.72)",
          border: "1.5px solid rgba(143,169,230,0.28)",
          boxShadow: "0 18px 50px rgba(5,8,25,0.45)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "0.24em",
          rowGap: 4,
          ...TITULO,
          fontSize: 62,
          lineHeight: 1.08,
          letterSpacing: "-1px",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {pagina.tokens.map((t, i) => {
          const dita = agoraMs >= t.fromMs;
          const falando = dita && agoraMs < t.toMs;
          const chave = chaves.has(normalizar(t.text));
          const pulso = falando
            ? interpolate(agoraMs, [t.fromMs, t.fromMs + 120], [1, 1.08], {
                extrapolateRight: "clamp",
              })
            : 1;
          return (
            <span
              key={`${pagina.startMs}-${i}`}
              style={{
                display: "inline-block",
                color: "#FFFFFF",
                ...(dita && (falando || chave) ? textoDegrade : {}),
                opacity: dita ? 1 : 0.38,
                scale: String(pulso),
              }}
            >
              {t.text.trim()}
            </span>
          );
        })}
      </div>
    </div>
  );
};
