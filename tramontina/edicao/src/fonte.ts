import { continueRender, delayRender, staticFile } from "remotion";

// Identidade visual do Guimas (@aleguimas), a mesma dos posts do Instagram:
// títulos em Archivo 800 condensada (wdth 92), apoio em Inter Tight, etiquetas em JetBrains Mono.
// As fontes ficam em public/fontes (variáveis, baixadas do Google Fonts) para o render
// não depender de internet.
const FONTES: { familia: string; arquivo: string; peso: string; largura?: string; faixa: string }[] = [
  { familia: "Archivo", arquivo: "archivo-latin.woff2", peso: "100 900", largura: "62% 125%", faixa: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  { familia: "Archivo", arquivo: "archivo-latin-ext.woff2", peso: "100 900", largura: "62% 125%", faixa: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF" },
  { familia: "Inter Tight", arquivo: "intertight-latin.woff2", peso: "100 900", faixa: "U+0000-00FF, U+2000-206F" },
  { familia: "JetBrains Mono", arquivo: "jetbrainsmono-latin.woff2", peso: "100 800", faixa: "U+0000-00FF, U+2000-206F" },
];

if (typeof document !== "undefined") {
  const espera = delayRender("Carregando fontes locais");
  Promise.all(
    FONTES.map((f) => {
      const face = new FontFace(f.familia, `url(${staticFile(`fontes/${f.arquivo}`)}) format("woff2")`, {
        weight: f.peso,
        stretch: f.largura ?? "100%",
        unicodeRange: f.faixa,
      });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(espera))
    .catch((e) => {
      console.error(e);
      continueRender(espera);
    });
}

export const fontFamily = "Archivo";
export const fonteTexto = "Inter Tight";
export const fonteMono = "JetBrains Mono";
export const TITULO: React.CSSProperties = { fontFamily, fontWeight: 800, fontStretch: "92%" };

// Paleta do Guimas
export const NAVY = "#0C1128";
export const NAVY_VIDRO = "rgba(12,17,40,0.84)";
export const DEGRADE_TEXTO = "linear-gradient(90deg, #8DB0FF, #B4A3F7)"; // destaque (azul claro → lavanda)
export const DEGRADE_BARRA = "linear-gradient(90deg, #6F8FF2, #9A7BF0)";
export const LAVANDA = "#B4A3F7";
export const AZUL_GUIMAS = "#8FA9E6"; // etiqueta mono
export const CANTO_SUP = "#3F58B8";
export const CANTO_INF = "#5B4BC4";
export const CINZA_SUB = "#A9B1CC";
export const CINZA_RODAPE = "#8E97BD";

// texto com degradê (background-clip). O fundo só é pintado dentro da caixa do elemento:
// com linhas justas (line-height < 1) os acentos (Ô, Á, Í…) ficam acima da caixa e somem.
// O padding estende a caixa para cima/lados e a margem negativa devolve o espaço no layout.
export const textoDegrade: React.CSSProperties = {
  backgroundImage: DEGRADE_TEXTO,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  padding: "0.2em 0.06em 0.06em",
  margin: "-0.2em -0.06em -0.06em",
};
