import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fontFamily, fonteMono, FUNDO, textoDegrade, TITULO, VERDE } from "../fonte";

// capa do vídeo de apresentação do Simplí CRM, no mesmo desenho da capa do Agentic Office
export const CapaCrm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: FUNDO }}>
    <Img src={staticFile("midia/ana-verde.jpg")} style={{ position: "absolute", right: -110, top: -60, height: 1340, width: 1000, objectFit: "cover", objectPosition: "top", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 30%)", maskImage: "linear-gradient(90deg, transparent 0%, black 30%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,11,12,1) 0%, rgba(11,11,12,0.9) 46%, rgba(11,11,12,0.4) 58%, transparent 70%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 18% 60%, rgba(60,224,30,0.16), transparent 45%)" }} />
    <Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ position: "absolute", left: 100, top: 74, width: 430 }} />
    <div style={{ position: "absolute", left: 100, top: 228, ...TITULO, lineHeight: 1.08, whiteSpace: "nowrap", filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.8))" }}>
      <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: VERDE, marginBottom: 26 }}>UM CRM QUE</div>
      <div style={{ fontSize: 150, letterSpacing: -5, color: "white" }}>ATENDE,</div>
      <div style={{ fontSize: 150, letterSpacing: -5, color: "white" }}>VENDE E</div>
      <div style={{ fontSize: 150, letterSpacing: -5, marginTop: 6, ...textoDegrade }}>GERENCIA</div>
    </div>
    <div style={{ position: "absolute", left: 100, top: 860, display: "flex", alignItems: "center", gap: 40 }}>
      <Img src={staticFile("midia/meta-tech-provider-fundo-escuro.webp")} style={{ height: 96 }} />
      <div style={{ fontFamily, fontWeight: 800, fontSize: 40, color: "white", lineHeight: 1.1 }}>
        do primeiro contato
        <br />
        <span style={{ color: VERDE }}>à recompra</span>
      </div>
    </div>
  </AbsoluteFill>
);
