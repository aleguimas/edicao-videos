import { AbsoluteFill } from "remotion";
import { Cantos } from "../Cantos";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono, textoDegrade, TITULO } from "../fonte";
import { Faturas, Fundo, Impressora } from "./FaturaAoVivo";
import "../fonte";

const textoVermelho: React.CSSProperties = { ...textoDegrade, backgroundImage: "linear-gradient(90deg, #FF8FA3, #FF3D5A)" };

// Capa 1080x1920, renderizada no quadro 900 (total impresso e carimbo "PAGO POR VOCÊ")
export const CapaFatura: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0F24" }}>
    <Fundo />
    <AbsoluteFill style={{ translate: "0px 190px" }}>
      <Faturas />
      <Impressora />
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 84, right: 84, top: 170, ...TITULO, textTransform: "uppercase", lineHeight: 0.98, letterSpacing: "-1px" }}>
      <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 30, letterSpacing: 9, color: AZUL_GUIMAS }}>VIDA DE VIBE CODER</div>
      <div style={{ width: 64, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA, margin: "18px 0 26px" }} />
      <div style={{ display: "flex", gap: "0.25em", fontSize: 150 }}>
        <span style={{ color: "#FFFFFF" }}>A FATURA</span>
      </div>
      <div style={{ fontSize: 150, ...textoVermelho }}>CHEGOU.</div>
    </div>
    <Cantos margem={56} />
  </AbsoluteFill>
);
