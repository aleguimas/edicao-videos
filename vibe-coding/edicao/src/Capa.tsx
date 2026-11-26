import { AbsoluteFill } from "remotion";
import { Cantos } from "./Cantos";
import { Fundo, Vinheta } from "./Cenas";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono, textoDegrade, TITULO } from "./fonte";
import { Mundo } from "./Mundo";
import { MontanhaRussaPovFrente } from "./pov/capaPov";
import "./fonte";

const textoVermelho: React.CSSProperties = { ...textoDegrade, backgroundImage: "linear-gradient(90deg, #FF8FA3, #FF3D5A)" };

// Capa 1080x1920, renderizada num quadro do vídeo (POV: 600, 2D: 905). O título fica entre y 300 e 1000, dentro do recorte 3:4 do perfil (y 240 a 1680).
export const Capa: React.FC<{ readonly versao: "pov" | "2d" }> = ({ versao }) => (
  <AbsoluteFill style={{ backgroundColor: "#070B1E" }}>
    {versao === "pov" ? (
      <MontanhaRussaPovFrente />
    ) : (
      <>
        <Fundo />
        <AbsoluteFill style={{ translate: "0px 400px" }}>
          <Mundo />
        </AbsoluteFill>
      </>
    )}
    <Vinheta />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,11,30,0.92) 0%, rgba(7,11,30,0.75) 38%, rgba(7,11,30,0) 58%)" }} />
    <div
      style={{
        position: "absolute",
        left: 84,
        right: 84,
        top: 300,
        ...TITULO,
        textTransform: "uppercase",
        lineHeight: 0.98,
        letterSpacing: "-1px",
      }}
    >
      <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 30, letterSpacing: 9, color: AZUL_GUIMAS }}>VIDA DE VIBE CODER</div>
      <div style={{ width: 64, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA, margin: "18px 0 34px" }} />
      <div style={{ fontSize: 150, color: "#FFFFFF" }}>APP EM</div>
      <div style={{ fontSize: 150, ...textoDegrade }}>4 MINUTOS.</div>
      <div style={{ height: 26 }} />
      <div style={{ fontSize: 150, color: "#FFFFFF" }}>CONTA DE</div>
      <div style={{ fontSize: 150, ...textoVermelho }}>R$ 2.340.</div>
    </div>
    <Cantos margem={56} />
  </AbsoluteFill>
);
