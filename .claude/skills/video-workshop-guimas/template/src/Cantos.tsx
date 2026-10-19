import type React from "react";
import { CANTO_INF, CANTO_SUP } from "./fonte";

// Molduras de canto em "L" do padrão do Guimas: superior esquerda azul,
// inferior direita roxa. `margem` é a distância da borda do elemento pai.
export const Cantos: React.FC<{
  readonly margem: number;
  readonly tamanho?: readonly [number, number];
  readonly espessura?: number;
  readonly style?: React.CSSProperties;
}> = ({ margem, tamanho = [110, 88], espessura = 3, style }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: margem,
        top: margem,
        width: tamanho[0],
        height: tamanho[1],
        borderTop: `${espessura}px solid ${CANTO_SUP}`,
        borderLeft: `${espessura}px solid ${CANTO_SUP}`,
        ...style,
      }}
    />
    <div
      style={{
        position: "absolute",
        right: margem,
        bottom: margem,
        width: tamanho[0] * 1.36,
        height: tamanho[1] * 0.8,
        borderBottom: `${espessura}px solid ${CANTO_INF}`,
        borderRight: `${espessura}px solid ${CANTO_INF}`,
        ...style,
      }}
    />
  </>
);
