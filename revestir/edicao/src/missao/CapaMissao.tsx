import { AbsoluteFill, Img, staticFile } from "remotion";
import { DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO, VERDE_SIMPLI } from "../fonte";
import { FILTRO_MISSAO } from "./Elementos";
import { LogoRevestir } from "../LogoRevestir";

// Capa da missão (still 1080x1920): o Guimas de braços para cima no "vou perder meu emprego?",
// Revestir no topo e o gancho do vídeo embaixo, com Agentic Office e Simplí no rodapé.
export const CapaMissao: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
    <Img src={staticFile("midia/capa-foto.jpg")} style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover", filter: FILTRO_MISSAO }} />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(11,11,12,0.88) 0%, rgba(11,11,12,0.35) 16%, transparent 26%, transparent 46%, rgba(11,11,12,0.8) 60%, rgba(11,11,12,0.97) 76%)",
      }}
    />
    <div style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 30, letterSpacing: "10px", color: VERDE_SIMPLI }}>MISSÃO SIMPLÍ</div>
      <LogoRevestir largura={300} />
    </div>
    <div
      style={{
        position: "absolute",
        top: 1170,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...TITULO,
        textTransform: "uppercase",
        lineHeight: 0.95,
        whiteSpace: "nowrap",
        filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.85))",
      }}
    >
      <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 44, letterSpacing: "6px", color: "#FFFFFF", marginBottom: 18 }}>IA NA EMPRESA: VOU PERDER MEU</div>
      <div style={{ position: "relative", fontSize: 150, letterSpacing: "-5px", color: "#8A8A8A" }}>
        EMPREGO?
        <div style={{ position: "absolute", left: -10, right: -10, top: "47%", height: 12, borderRadius: 6, backgroundColor: "#FFFFFF" }} />
      </div>
      <div style={{ fontSize: 190, letterSpacing: "-7px", marginTop: 12, ...textoDegrade }}>NÃO É</div>
      <div style={{ fontSize: 120, letterSpacing: "-4px", color: "#FFFFFF" }}>BEM ASSIM</div>
    </div>
    <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 380 }} />
      <div style={{ width: 3, height: 70, backgroundImage: DEGRADE_BARRA }} />
      <Img src={staticFile("midia/logo-simpli-fundo-escuro.png")} style={{ width: 260 }} />
    </div>
  </AbsoluteFill>
);
