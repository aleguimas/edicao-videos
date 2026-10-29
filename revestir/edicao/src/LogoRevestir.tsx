import type React from "react";
import { Img, staticFile } from "remotion";

// Cores oficiais da Revestir Home Center (arquivos em logos/revestir-*.svg)
export const REVESTIR_CEREJA = "#761450";
export const REVESTIR_AMARELO = "#DAE931";

// Logo da Revestir no par da própria marca: home center amarelo sobre cartão cereja intensa
// (as cores da sala deles). Usar no lugar da logo magenta sobre branco.
export const LogoRevestir: React.FC<{ readonly largura: number; readonly style?: React.CSSProperties }> = ({ largura, style }) => (
  <div
    style={{
      backgroundColor: REVESTIR_CEREJA,
      borderRadius: largura * 0.08,
      padding: `${largura * 0.1}px ${largura * 0.12}px`,
      boxShadow: "0 16px 50px rgba(0,0,0,0.5)",
      ...style,
    }}
  >
    <Img src={staticFile("midia/revestir-home-center-amarelo.svg")} style={{ width: largura, display: "block" }} />
  </div>
);
