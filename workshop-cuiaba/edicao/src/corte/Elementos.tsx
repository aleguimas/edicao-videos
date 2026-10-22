import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cantos } from "../Cantos";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO } from "../fonte";

// Barra de progresso fina no topo (degradê): mostra que o vídeo é curto e segura até o fim.
export const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, backgroundImage: DEGRADE_BARRA }} />
  );
};

// Título fixo do corte (tema), no topo, depois do gancho: quem chega no meio sabe do que se trata.
export const TituloFixo: React.FC<{ readonly etiqueta: string; readonly linha1: string; readonly linha2: string }> = ({
  etiqueta,
  linha1,
  linha2,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p, translate: `0px ${(1 - p) * -30}px` }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          padding: "20px 34px 24px",
          borderRadius: 20,
          backgroundColor: "rgba(12,17,40,0.78)",
          border: "1.5px solid rgba(143,169,230,0.3)",
          boxShadow: "0 18px 50px rgba(5,8,25,0.45)",
        }}
      >
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 22, letterSpacing: "7px", color: AZUL_GUIMAS }}>{etiqueta}</div>
        <div style={{ ...TITULO, fontSize: 50, lineHeight: 1, letterSpacing: "-1px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          <span style={{ color: "#FFFFFF" }}>{linha1} </span>
          <span style={textoDegrade}>{linha2}</span>
        </div>
      </div>
    </div>
  );
};

// Chamada final: devolve a pergunta para quem assiste (comentário) e pede para seguir.
export const ChamadaFinal: React.FC<{ readonly linha1: string; readonly linha2: string; readonly acao: string }> = ({ linha1, linha2, acao }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = (ini: number) =>
    interpolate(frame, [ini, ini + 0.4 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.55), transparent 55%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.55), transparent 55%)",
        opacity: anim(0),
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <Cantos margem={56} />
      <div style={{ ...TITULO, fontSize: 84, color: "#FFFFFF", letterSpacing: "-2px", textTransform: "uppercase", opacity: anim(0.1 * fps) }}>{linha1}</div>
      <div
        style={{
          ...TITULO,
          fontSize: Math.min(132, 920 / (linha2.length * 0.62)),
          letterSpacing: "-3px",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          ...textoDegrade,
          opacity: anim(0.25 * fps),
          scale: String(0.85 + 0.15 * anim(0.25 * fps)),
        }}
      >
        {linha2}
      </div>
      <div style={{ width: 64, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA, marginTop: 24, opacity: anim(0.5 * fps) }} />
      <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 28, letterSpacing: "6px", color: "#C9D4FF", opacity: anim(0.6 * fps) }}>{acao}</div>
      <div style={{ ...TITULO, fontSize: 76, letterSpacing: "-2px", marginTop: 30, ...textoDegrade, opacity: anim(0.8 * fps) }}>@aleguimas</div>
    </AbsoluteFill>
  );
};
