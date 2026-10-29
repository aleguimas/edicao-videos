import { AbsoluteFill, Img, staticFile } from "remotion";
import { DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO, VERDE_SIMPLI } from "../fonte";
import { FILTRO_LONGO } from "./Pecas";
import { LogoRevestir } from "../LogoRevestir";

// Thumbnail do YouTube (1920x1080, exportada também em 1280x720): o Guimas de braços para cima
// à direita e o título à esquerda, com a pergunta do gancho riscada.
export const CapaLongo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
    <Img src={staticFile("longo/thumb-foto.jpg")} style={{ position: "absolute", right: 0, top: 0, width: 960, height: 1080, objectFit: "cover", objectPosition: "50% 30%", filter: FILTRO_LONGO }} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, #0B0B0C 0%, #0B0B0C 50%, rgba(11,11,12,0.55) 58%, transparent 68%)" }} />
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 18% 50%, rgba(60,224,30,0.16), transparent 45%)" }} />
    <div style={{ position: "absolute", left: 100, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", ...TITULO, textTransform: "uppercase", whiteSpace: "nowrap", lineHeight: 0.95 }}>
      <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 34, letterSpacing: "8px", color: VERDE_SIMPLI, marginBottom: 26 }}>BASTIDORES · AGENTIC OFFICE</div>
      <div style={{ position: "relative", fontSize: 72, color: "#8A8A8A", letterSpacing: "-2px", alignSelf: "flex-start" }}>
        VOU PERDER MEU EMPREGO?
        <div style={{ position: "absolute", left: -10, right: -10, top: "46%", height: 12, borderRadius: 6, backgroundColor: "#FFFFFF" }} />
      </div>
      <div style={{ fontSize: 128, color: "#FFFFFF", letterSpacing: "-5px", marginTop: 26 }}>IA NA EMPRESA</div>
      <div style={{ fontSize: 158, letterSpacing: "-7px", ...textoDegrade }}>DE VERDADE</div>
      <div style={{ width: 180, height: 10, borderRadius: 5, backgroundImage: DEGRADE_BARRA, margin: "34px 0 34px" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <Img src={staticFile("midia/logo-simpli-fundo-escuro.png")} style={{ width: 300 }} />
        <div style={{ width: 3, height: 70, backgroundImage: DEGRADE_BARRA }} />
        <LogoRevestir largura={230} style={{ boxShadow: "none" }} />
      </div>
    </div>
  </AbsoluteFill>
);
