import type React from "react";
import { fontFamily } from "../fonte";

// Identidade do Rec'n Play 26 (card oficial da conversa e tela do palco):
// fundo preto, laranja nos títulos e nomes, rosa nas datas/local, faixa em degradê roxo,
// verde neon só no "26". Títulos em fonte condensada pesada (Archivo na largura mínima).
export const PRETO = "#08060C";
export const LARANJA = "#FF6A1F";
export const ROSA = "#FF2E93";
export const ROXO = "#8A3BFF";
export const LILAS = "#C77DFF";
export const VERDE = "#5CFF4A";
export const BRANCO = "#FFFFFF";

export const DEGRADE_FESTIVAL = "linear-gradient(90deg, #FF6A1F 0%, #FF2E93 55%, #B04BFF 100%)";
export const DEGRADE_FAIXA = "linear-gradient(180deg, rgba(138,59,255,0) 0%, rgba(138,59,255,0.85) 60%, #C04BE0 100%)";

export const CONDENSADA: React.CSSProperties = {
  fontFamily,
  fontWeight: 900,
  fontStretch: "62%",
  textTransform: "uppercase",
  letterSpacing: "-0.01em",
};

export const textoFestival: React.CSSProperties = {
  backgroundImage: DEGRADE_FESTIVAL,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  padding: "0.2em 0.06em 0.06em",
  margin: "-0.2em -0.06em -0.06em",
};

// Cor do vídeo: a sala tem luz fria e a gravação é de celular.
export const FILTRO_SALA = "contrast(1.07) saturate(1.05) brightness(1.03)";
export const FILTRO_RUA = "contrast(1.08) saturate(1.1)";

export type Pessoa = "A" | "B" | "C" | "D";
export const PESSOAS: Record<Pessoa, { nome: string; cargo: string; x: number; y: number }> = {
  A: { nome: "Raíssa Gonçalves", cargo: "Gerente de Marketing | Tambaú", x: 520, y: 463 },
  B: { nome: "Maria Luísa (Malu)", cargo: "Product Owner | Solar Coca-Cola", x: 655, y: 471 },
  C: { nome: "Zenuel Lins", cargo: "Diretor Executivo | Céos", x: 1077, y: 433 },
  D: { nome: "Alexandre Guimarães", cargo: "Fundador | Simplí", x: 1302, y: 413 },
};

export const TITULO_PAINEL = ["Marketing na era da IA:", "criatividade, design e estratégia", "em um novo mercado"];
