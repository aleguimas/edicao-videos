import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FUNDO, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Avatar, DIRETORIA } from "./comum";

// Capa do YouTube (still 1920x1080): a Ana à direita sobre o fundo verde, o gancho "um escritório
// inteiro de agentes de IA" à esquerda, a diretoria de agentes embaixo e as logos no topo.
export const CapaApresentacao: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: FUNDO }}>
    <Img src={staticFile("midia/ana-verde.jpg")} style={{ position: "absolute", right: -110, top: -60, height: 1340, width: 1000, objectFit: "cover", objectPosition: "top", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 30%)", maskImage: "linear-gradient(90deg, transparent 0%, black 30%)" }} />
    <AbsoluteFill
      style={{
        background: "linear-gradient(90deg, rgba(11,11,12,1) 0%, rgba(11,11,12,0.9) 46%, rgba(11,11,12,0.4) 58%, transparent 70%)",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 18% 60%, rgba(60,224,30,0.16), transparent 45%)" }} />
    <div style={{ position: "absolute", left: 100, top: 74, display: "flex", alignItems: "center", gap: 34 }}>
      <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 330 }} />
    </div>
    <div style={{ position: "absolute", left: 100, top: 250, ...TITULO, lineHeight: 0.95, whiteSpace: "nowrap", filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.8))" }}>
      <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: VERDE, marginBottom: 26 }}>SUA EMPRESA COM</div>
      <div style={{ fontSize: 132, letterSpacing: -4, color: "white" }}>UM ESCRITÓRIO</div>
      <div style={{ fontSize: 132, letterSpacing: -4, color: "white" }}>INTEIRO DE</div>
      <div style={{ fontSize: 150, letterSpacing: -6, marginTop: 6, ...textoDegrade }}>AGENTES DE IA</div>
    </div>
    <div style={{ position: "absolute", left: 100, top: 850, display: "flex", alignItems: "center" }}>
      {DIRETORIA.slice(0, 6).map((d, i) => (
        <div key={d.sigla} style={{ marginLeft: i === 0 ? 0 : -22, borderRadius: "50%", border: `5px solid ${FUNDO}` }}>
          <Avatar nome={d.nome} cor={d.cor} foto={d.foto} tam={116} />
        </div>
      ))}
      <div style={{ marginLeft: 30, fontFamily, fontWeight: 800, fontSize: 40, color: "white", lineHeight: 1.1 }}>
        um time inteiro,
        <br />
        <span style={{ color: VERDE }}>num lugar só</span>
      </div>
    </div>
  </AbsoluteFill>
);
