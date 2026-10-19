import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cantos } from "./Cantos";
import { CINZA_RODAPE, DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO } from "./fonte";

// Ícone de linha dentro de círculo (componente de apoio do padrão do Guimas).
const IconeInstagram: React.FC = () => (
  <div
    style={{
      width: 150,
      height: 150,
      borderRadius: "50%",
      border: "2px solid #3F58B8",
      backgroundColor: "rgba(111,143,242,0.10)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="#A9BFFF" strokeWidth="1.5">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="#A9BFFF" stroke="none" />
    </svg>
  </div>
);

// Encerramento: @aleguimas no fundo navy com os brilhos e molduras de canto;
// entra com fade e "bate" no impacto final da música (impacto = frame local).
export const Encerramento: React.FC<{ readonly impacto: number }> = ({ impacto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = interpolate(frame, [0, Math.min(0.6 * fps, Math.max(impacto, 6))], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bate = interpolate(frame, [impacto, impacto + 0.5 * fps], [1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const apoio = interpolate(frame, [impacto, impacto + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const escala = frame < impacto ? 0.94 + 0.06 * fade : bate;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.55), transparent 55%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.55), transparent 55%)",
        opacity: fade,
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
      }}
    >
      <Cantos margem={56} />
      <div style={{ scale: String(escala) }}>
        <IconeInstagram />
      </div>
      <div style={{ ...TITULO, fontSize: 150, letterSpacing: "-3px", scale: String(escala) }}>
        <span style={textoDegrade}>@aleguimas</span>
      </div>
      <div style={{ width: 64 * apoio, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
      <div
        style={{
          fontFamily: fonteMono,
          fontWeight: 500,
          fontSize: 30,
          letterSpacing: "9px",
          color: CINZA_RODAPE,
          opacity: apoio,
          translate: `0px ${(1 - apoio) * 30}px`,
        }}
      >
        ALEXANDRE GUIMARÃES
      </div>
    </AbsoluteFill>
  );
};
