import { AbsoluteFill, Img, staticFile } from "remotion";
import { Cantos } from "../Cantos";
import { FILTRO_COR } from "../Clipe";
import { DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO } from "../fonte";

export type CapaCorteProps = {
  readonly foto: string; // em public/ (1080x1920), de preferência o Guimas perto da câmera
  readonly foco: { readonly x: number; readonly y: number; readonly zoom: number };
  readonly etiqueta: string;
  // o gancho do corte: linha pequena, palavra riscada, palavra em degradê e complemento
  readonly topo: string;
  readonly riscada: string;
  readonly destaque: string;
  readonly fim: string;
};

// Capa do corte no padrão @aleguimas: foto do Guimas em cima, o gancho do corte em
// tipografia grande embaixo (palavra riscada em lilás + palavra em degradê), dentro do
// recorte 3:4 do grid do Instagram (y ≈ 240–1680).
export const CapaCorte: React.FC<CapaCorteProps> = ({ foto, foco, etiqueta, topo, riscada, destaque, fim }) => {
  const z = foco.zoom;
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      <Img
        src={staticFile(foto)}
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          scale: String(z),
          translate: `${z * (540 - foco.x)}px ${z * (820 - foco.y)}px`,
          filter: FILTRO_COR,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.55), transparent 50%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.6), transparent 55%), linear-gradient(180deg, rgba(12,17,40,0.5) 0%, rgba(12,17,40,0.05) 20%, rgba(12,17,40,0.2) 40%, rgba(12,17,40,0.9) 58%, #0C1128 76%)",
        }}
      />
      <Cantos margem={56} />
      <div style={{ position: "absolute", top: 112, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 30, letterSpacing: "9px", color: "#C9D4FF", textShadow: "0 2px 12px rgba(5,8,25,0.9)" }}>{etiqueta}</div>
        <div style={{ width: 64, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 1000,
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
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: Math.min(44, 940 / (topo.length * 0.78)), letterSpacing: "6px", color: "#FFFFFF", marginBottom: 20 }}>{topo}</div>
        <div style={{ position: "relative", fontSize: Math.min(190, 900 / (riscada.length * 0.62)), color: "#6C779F" }}>
          {riscada}
          <div style={{ position: "absolute", left: -12, right: -12, top: "48%", height: 16, borderRadius: 8, backgroundColor: "#9A7BF0" }} />
        </div>
        <div style={{ fontSize: Math.min(250, 920 / (destaque.length * 0.62)), ...textoDegrade }}>{destaque}</div>
        <div style={{ fontSize: Math.min(130, 920 / (fim.length * 0.62)), color: "#FFFFFF" }}>{fim}</div>
      </div>

      <div style={{ position: "absolute", right: 92, bottom: 84, fontFamily: fonteMono, fontWeight: 500, fontSize: 28, letterSpacing: "2px", color: "#8E97BD" }}>@aleguimas</div>
    </AbsoluteFill>
  );
};
