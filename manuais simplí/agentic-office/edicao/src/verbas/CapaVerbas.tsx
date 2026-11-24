import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FUNDO, fontFamily, fonteApp, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";

// Capa do YouTube (still 1920x1080) do vídeo completo do Verbas e Acordos: a Ana de braços cruzados
// à direita, "planilha de verbas" riscada e "cada verba no caixa" à esquerda, os selos de situação
// do módulo embaixo. Mesmo padrão da CapaApresentacao (série do Agentic Office).
const SELOS: [string, string, string][] = [
  ["Vencido", "#3A1616", "#FF6B6B"],
  ["Vence em breve", "#3A2E12", "#F5B82E"],
  ["No prazo", "#14301A", VERDE],
];

export const CapaVerbas: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: FUNDO }}>
    <Img src={staticFile("midia/ana-bracos.jpg")} style={{ position: "absolute", right: -60, top: -40, height: 1300, width: 1260, objectFit: "cover", objectPosition: "62% 8%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,11,12,1) 0%, rgba(11,11,12,1) 44%, rgba(11,11,12,0.7) 54%, rgba(11,11,12,0.2) 63%, transparent 70%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 18% 58%, rgba(60,224,30,0.17), transparent 45%)" }} />
    <Img src={staticFile("midia/logo-agentic-office.png")} style={{ position: "absolute", left: 100, top: 74, width: 330 }} />
    <div style={{ position: "absolute", left: 100, top: 250, ...TITULO, lineHeight: 0.95, whiteSpace: "nowrap", filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.8))" }}>
      <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: VERDE, marginBottom: 30 }}>MÓDULO VERBAS E ACORDOS</div>
      <div style={{ position: "relative", alignSelf: "flex-start", display: "inline-block", fontSize: 76, letterSpacing: -2, color: "#8A8A8A" }}>
        PLANILHA DE VERBAS
        <div style={{ position: "absolute", left: -10, right: -10, top: "46%", height: 12, borderRadius: 6, backgroundColor: "white" }} />
      </div>
      <div style={{ fontSize: 138, letterSpacing: -5, color: "white", marginTop: 26 }}>CADA VERBA</div>
      <div style={{ fontSize: 170, letterSpacing: -7, marginTop: 4, ...textoDegrade }}>NO CAIXA</div>
    </div>
    <div style={{ position: "absolute", left: 100, top: 880, display: "flex", alignItems: "center", gap: 16 }}>
      {SELOS.map(([t, fundo, cor]) => (
        <div key={t} style={{ fontFamily: fonteApp, fontWeight: 700, fontSize: 34, color: cor, background: fundo, border: `2px solid ${cor}`, borderRadius: 10, padding: "10px 22px" }}>
          {t}
        </div>
      ))}
      <div style={{ marginLeft: 18, fontFamily, fontWeight: 800, fontSize: 36, color: "white", lineHeight: 1.1 }}>
        o sistema avisa
        <br />
        <span style={{ color: VERDE }}>o que cobrar</span>
      </div>
    </div>
  </AbsoluteFill>
);
