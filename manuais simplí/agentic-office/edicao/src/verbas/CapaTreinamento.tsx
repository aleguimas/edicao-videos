import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FUNDO, fontFamily, fonteApp, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";

// Capa do YouTube (still 1920x1080) do treinamento do Verbas e Acordos. Mesmo padrão da CapaContasVerba:
// Ana à direita, "passo a passo de ponta a ponta" e o caminho do acordo embaixo.
const PASSOS = ["Cadastrar", "Acompanhar", "Receber", "Resolver"];

export const CapaTreinamento: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: FUNDO }}>
    <Img src={staticFile("midia/ana-bracos.jpg")} style={{ position: "absolute", right: -60, top: -40, height: 1300, width: 1260, objectFit: "cover", objectPosition: "62% 8%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,11,12,1) 0%, rgba(11,11,12,1) 44%, rgba(11,11,12,0.7) 54%, rgba(11,11,12,0.2) 63%, transparent 70%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 18% 58%, rgba(60,224,30,0.17), transparent 45%)" }} />
    <Img src={staticFile("midia/logo-agentic-office.png")} style={{ position: "absolute", left: 100, top: 74, width: 330 }} />
    <div style={{ position: "absolute", left: 100, top: 240, ...TITULO, lineHeight: 0.95, whiteSpace: "nowrap", filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.8))" }}>
      <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: VERDE, marginBottom: 30 }}>TREINAMENTO · VERBAS E ACORDOS</div>
      <div style={{ position: "relative", display: "inline-block", fontSize: 76, letterSpacing: -2, color: "#8A8A8A" }}>
        COMO EU USO?
        <div style={{ position: "absolute", left: -10, right: -10, top: "46%", height: 12, borderRadius: 6, backgroundColor: "white" }} />
      </div>
      <div style={{ fontSize: 138, letterSpacing: -5, color: "white", marginTop: 26 }}>PASSO A PASSO</div>
      <div style={{ fontSize: 132, letterSpacing: -5, marginTop: 4, ...textoDegrade }}>DE PONTA A PONTA</div>
    </div>
    <div style={{ position: "absolute", left: 100, top: 870, display: "flex", alignItems: "center", gap: 14 }}>
      {PASSOS.map((p, i) => (
        <div key={p} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {i > 0 && <div style={{ fontFamily: fonteApp, fontWeight: 800, fontSize: 34, color: VERDE }}>→</div>}
          <div style={{ padding: "14px 26px", borderRadius: 14, border: "2px solid #2A2A2E", background: "#141416", fontFamily: fonteApp, fontWeight: 800, fontSize: 34, color: "white" }}>{p}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 100, top: 1000, fontFamily, fontWeight: 800, fontSize: 30, color: "white" }}>
      <span style={{ color: VERDE }}>12 capítulos</span> com a Ana, a Assistente de IA da Simplí
    </div>
  </AbsoluteFill>
);
