import { AbsoluteFill, Img, staticFile } from "remotion";
import { Cantos } from "../Cantos";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO } from "../fonte";
import { FILTRO_VISITA, LogoTramontina } from "./Elementos";

// Capa da visita (still 1080x1920): foto oficial do grupo na frente da fábrica, com a logo
// e quem realizou a visita em cima e o gancho do vídeo (palavra riscada + palavra em degradê)
// embaixo. Tudo que importa fica no recorte 3:4 do grid do Instagram (y ≈ 240–1680).
const FOTO = { arquivo: "midia/foto-grupo.jpg", subir: 170 }; // sobe a foto para o grupo ficar no meio do recorte

export const CapaVisita: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      <Img
        src={staticFile(FOTO.arquivo)}
        style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover", translate: `0px ${-FOTO.subir}px`, filter: FILTRO_VISITA }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.5), transparent 40%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.6), transparent 50%), linear-gradient(180deg, rgba(12,17,40,0.9) 0%, rgba(12,17,40,0.55) 17%, rgba(12,17,40,0.05) 30%, transparent 56%, rgba(12,17,40,0.85) 66%, #0C1128 78%)",
        }}
      />
      <Cantos margem={56} />

      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 30, letterSpacing: "9px", color: "#C9D4FF", textShadow: "0 2px 12px rgba(5,8,25,0.9)" }}>
          VISITA TÉCNICA
        </div>
        <LogoTramontina largura={480} style={{ filter: "drop-shadow(0 6px 20px rgba(5,8,25,0.7))" }} />
        <div style={{ width: 64, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 28, letterSpacing: "5px", color: AZUL_GUIMAS, textShadow: "0 2px 12px rgba(5,8,25,0.9)" }}>
          FIERGS · SEBRAE PE
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1245,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...TITULO,
          textTransform: "uppercase",
          letterSpacing: "-3px",
          lineHeight: 0.95,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 36, letterSpacing: "7px", color: "#FFFFFF", marginBottom: 14 }}>APESAR DE TODA A AUTOMAÇÃO</div>
        <div style={{ position: "relative", fontSize: 120, color: "#6C779F" }}>
          DEMITIU
          <div style={{ position: "absolute", left: -12, right: -12, top: "48%", height: 12, borderRadius: 6, backgroundColor: "#9A7BF0" }} />
        </div>
        <div style={{ fontSize: 180, ...textoDegrade }}>CRESCEU</div>
        <div style={{ fontSize: 84, color: "#FFFFFF" }}>EM COLABORADORES</div>
      </div>

      <div style={{ position: "absolute", right: 92, bottom: 84, fontFamily: fonteMono, fontWeight: 500, fontSize: 28, letterSpacing: "2px", color: "#8E97BD" }}>@aleguimas</div>
    </AbsoluteFill>
  );
};
