import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FUNDO, fontFamily, fonteApp, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";

// Capa do YouTube (still 1920x1080) do vídeo das verbas em conta corrente. Mesmo padrão da CapaVerbas:
// Ana à direita, a pergunta da planilha riscada, "cada real no extrato" e um extrato resumido embaixo.
const LINHAS: [string, string, string][] = [
  ["Crédito", "+ R$ 8.000", VERDE],
  ["Gastos", "− R$ 2.300", "#FF6B6B"],
  ["Saldo", "R$ 5.700", "white"],
];

export const CapaContasVerba: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: FUNDO }}>
    <Img src={staticFile("midia/ana-bracos.jpg")} style={{ position: "absolute", right: -60, top: -40, height: 1300, width: 1260, objectFit: "cover", objectPosition: "62% 8%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,11,12,1) 0%, rgba(11,11,12,1) 44%, rgba(11,11,12,0.7) 54%, rgba(11,11,12,0.2) 63%, transparent 70%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 18% 58%, rgba(60,224,30,0.17), transparent 45%)" }} />
    <Img src={staticFile("midia/logo-agentic-office.png")} style={{ position: "absolute", left: 100, top: 74, width: 330 }} />
    <div style={{ position: "absolute", left: 100, top: 240, ...TITULO, lineHeight: 0.95, whiteSpace: "nowrap", filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.8))" }}>
      <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: VERDE, marginBottom: 30 }}>VERBAS EM CONTA CORRENTE</div>
      <div style={{ position: "relative", display: "inline-block", fontSize: 76, letterSpacing: -2, color: "#8A8A8A" }}>
        QUANTO SOBROU?
        <div style={{ position: "absolute", left: -10, right: -10, top: "46%", height: 12, borderRadius: 6, backgroundColor: "white" }} />
      </div>
      <div style={{ fontSize: 138, letterSpacing: -5, color: "white", marginTop: 26 }}>CADA REAL</div>
      <div style={{ fontSize: 150, letterSpacing: -6, marginTop: 4, ...textoDegrade }}>NO EXTRATO</div>
    </div>
    <div style={{ position: "absolute", left: 100, top: 860, display: "flex", alignItems: "stretch", gap: 0, borderRadius: 14, border: "2px solid #2A2A2E", background: "#141416", overflow: "hidden" }}>
      {LINHAS.map(([t, v, cor], i) => (
        <div key={t} style={{ padding: "14px 30px", borderLeft: i ? "2px solid #2A2A2E" : undefined }}>
          <div style={{ fontFamily: fonteApp, fontWeight: 600, fontSize: 24, color: "#9A9AA0" }}>{t}</div>
          <div style={{ fontFamily: fonteApp, fontWeight: 800, fontSize: 40, color: cor }}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 100 + 0, top: 1000, fontFamily, fontWeight: 800, fontSize: 30, color: "white" }}>
      e o saldo <span style={{ color: VERDE }}>nunca fica negativo</span>
    </div>
  </AbsoluteFill>
);
