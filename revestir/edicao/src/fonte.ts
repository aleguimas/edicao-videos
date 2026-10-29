import { loadFont } from "@remotion/google-fonts/Montserrat";
import { continueRender, delayRender, staticFile } from "remotion";

// Identidade visual da Simplí: títulos em Montserrat 900 (branco + verde Simplí), etiquetas em
// JetBrains Mono, fundo quase preto. Os componentes do modelo de visita (Gancho, PalavrasCineticas)
// usam estes nomes; a paleta do Guimas foi trocada pela da Simplí.
const { fontFamily: montserrat } = loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin", "latin-ext"] });

const FONTES: { familia: string; arquivo: string; peso: string; faixa: string }[] = [
  { familia: "JetBrains Mono", arquivo: "jetbrainsmono-latin.woff2", peso: "100 800", faixa: "U+0000-00FF, U+2000-206F" },
];

if (typeof document !== "undefined") {
  const espera = delayRender("Carregando fontes locais");
  Promise.all(
    FONTES.map((f) => {
      const face = new FontFace(f.familia, `url(${staticFile(`fontes/${f.arquivo}`)}) format("woff2")`, {
        weight: f.peso,
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

export const fontFamily = montserrat;
export const fonteMono = "JetBrains Mono";
export const TITULO: React.CSSProperties = { fontFamily: montserrat, fontWeight: 900 };

// Paleta Simplí
export const VERDE_SIMPLI = "#3CE01E";
export const NAVY = "#0B0B0C"; // fundo (nome mantido dos componentes do modelo)
export const DEGRADE_TEXTO = "linear-gradient(90deg, #3CE01E, #9DF57F)";
export const DEGRADE_BARRA = "linear-gradient(90deg, #2BB512, #3CE01E)";
export const AZUL_GUIMAS = VERDE_SIMPLI; // etiqueta mono
export const CINZA_SUB = "#C9CCC9";

// texto com degradê (background-clip). O padding estende a caixa para os acentos não sumirem.
export const textoDegrade: React.CSSProperties = {
  backgroundImage: DEGRADE_TEXTO,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  padding: "0.2em 0.06em 0.06em",
  margin: "-0.2em -0.06em -0.06em",
};
