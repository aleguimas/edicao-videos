import { loadFont as loadExo } from "@remotion/google-fonts/Exo2";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { continueRender, delayRender, staticFile } from "remotion";

// Identidade da Simplí nos vídeos: títulos em Montserrat 900 (branco + verde Simplí), etiquetas em
// JetBrains Mono, fundo quase preto. As telas recriadas do Agentic Office usam Exo 2 (a mais
// próxima da fonte do sistema).
const { fontFamily: montserrat } = loadMontserrat("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin", "latin-ext"] });
const { fontFamily: exo } = loadExo("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });

if (typeof document !== "undefined") {
  const espera = delayRender("Carregando JetBrains Mono");
  const face = new FontFace("JetBrains Mono", `url(${staticFile("fontes/jetbrainsmono-latin.woff2")}) format("woff2")`, { weight: "100 800" });
  document.fonts.add(face);
  face
    .load()
    .then(() => continueRender(espera))
    .catch((e) => {
      console.error(e);
      continueRender(espera);
    });
}

// fontes reais do sistema, usadas nas telas mobile (src/mobile)
const { fontFamily: geistMono } = loadGeistMono("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
if (typeof document !== "undefined") {
  const espera = delayRender("Carregando Octosquares");
  const faces = [400, 500, 600, 700].map((w) => new FontFace("Octosquares", `url(${staticFile(`fontes/octosquares-${w}.woff2`)}) format("woff2")`, { weight: String(w) }));
  faces.forEach((f) => document.fonts.add(f));
  Promise.all(faces.map((f) => f.load()))
    .then(() => continueRender(espera))
    .catch((e) => {
      console.error(e);
      continueRender(espera);
    });
}
export const fonteSistema = "Octosquares";
export const fonteMonoSistema = geistMono;

export const fontFamily = montserrat;
export const fonteApp = exo;
export const fonteMono = "JetBrains Mono";
export const TITULO: React.CSSProperties = { fontFamily: montserrat, fontWeight: 900 };

// Paleta Simplí
export const VERDE = "#3CE01E";
export const FUNDO = "#0B0B0C";
export const CINZA = "#C9CCC9";
export const DEGRADE_TEXTO = "linear-gradient(90deg, #3CE01E, #9DF57F)";

// texto com degradê (background-clip). O padding estende a caixa para os acentos não sumirem.
export const textoDegrade: React.CSSProperties = {
  backgroundImage: DEGRADE_TEXTO,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  padding: "0.2em 0.06em 0.06em",
  margin: "-0.2em -0.06em -0.06em",
};
