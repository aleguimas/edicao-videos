import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { CINZA, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Fundo } from "../verbas/Montagem";

// Capa do vídeo "Sistema de decisão" (YouTube, 1920x1080). Também aparece no fim dos cortes.
export const CapaDecisao: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <div style={{ position: "absolute", right: 0, top: 0, width: 760, height: 1080, overflow: "hidden" }}>
      <Img src={staticFile("midia/ana-bracos.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #0B0B0C 0%, rgba(11,11,12,0) 35%)" }} />
    </div>
    <div style={{ position: "absolute", left: 110, top: 110 }}>
      <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 460 }} />
    </div>
    <div style={{ position: "absolute", left: 110, top: 300, ...TITULO, lineHeight: 1.0 }}>
      <div style={{ fontSize: 100, color: "white" }}>A AÇÃO</div>
      <div style={{ fontSize: 100, color: "white" }}>CHEGA PRONTA.</div>
      <div style={{ fontSize: 100, ...textoDegrade }}>VOCÊ SÓ APROVA.</div>
    </div>
    <div style={{ position: "absolute", left: 110, top: 760, display: "flex", alignItems: "center", gap: 20, padding: "22px 30px", borderRadius: 22, background: "rgba(240,244,241,0.92)", color: "#101412", fontFamily, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
      <div style={{ width: 64, height: 64, borderRadius: 14, background: "#0C140F", display: "grid", placeItems: "center", color: "#86EFAC", fontWeight: 800, fontSize: 24 }}>AO</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Agentic Office · Diretoria de IA</div>
        <div style={{ fontSize: 34, fontWeight: 600 }}>3 ações prontas para aprovar</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 110, top: 940, fontFamily: fonteMono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: VERDE }}>
      SISTEMA DE DECISÃO <span style={{ color: CINZA }}>· VAREJO · INDÚSTRIA · SERVIÇOS</span>
    </div>
  </AbsoluteFill>
);

// Capa do vídeo principal para o Instagram (1080x1920). O texto fica no miolo 3:4 (y 240 a 1680),
// que é o que aparece na grade do perfil.
export const CapaDecisaoInsta: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1240, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, black 60%, transparent 100%)", maskImage: "linear-gradient(180deg, black 60%, transparent 100%)" }}>
      <Img src={staticFile("midia/ana-bracos.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,11,12,0.55) 0%, rgba(11,11,12,0) 30%, rgba(11,11,12,0) 55%, rgba(11,11,12,0.6) 100%)" }} />
    </div>
    <div style={{ position: "absolute", left: 80, top: 1590 }}>
      <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 340 }} />
    </div>
    <div style={{ position: "absolute", left: 80, top: 720, display: "flex", alignItems: "center", gap: 20, padding: "22px 30px", borderRadius: 22, background: "rgba(240,244,241,0.94)", color: "#101412", fontFamily, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
      <div style={{ width: 64, height: 64, borderRadius: 14, background: "#0C140F", display: "grid", placeItems: "center", color: "#86EFAC", fontWeight: 800, fontSize: 24 }}>AO</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Agentic Office · Diretoria de IA</div>
        <div style={{ fontSize: 34, fontWeight: 600 }}>3 ações prontas para aprovar</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 80, top: 1000, ...TITULO, lineHeight: 1.0 }}>
      <div style={{ fontSize: 104, color: "white" }}>A AÇÃO</div>
      <div style={{ fontSize: 104, color: "white" }}>CHEGA PRONTA.</div>
      <div style={{ fontSize: 104, ...textoDegrade }}>VOCÊ SÓ</div>
      <div style={{ fontSize: 104, ...textoDegrade }}>APROVA.</div>
    </div>
    <div style={{ position: "absolute", left: 80, top: 1475, fontFamily: fonteMono, fontWeight: 700, fontSize: 30, letterSpacing: 4, lineHeight: 1.5, color: VERDE }}>
      SISTEMA DE DECISÃO
      <div style={{ color: CINZA, fontSize: 26 }}>VAREJO · INDÚSTRIA · SERVIÇOS</div>
    </div>
  </AbsoluteFill>
);
