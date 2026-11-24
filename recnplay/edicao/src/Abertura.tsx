import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Cantos } from "./Cantos";
import { Clipe } from "./Clipe";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono, textoDegrade, TITULO } from "./fonte";

const Pin: React.FC = () => (
  <svg width="170" height="230" viewBox="0 0 24 32">
    <defs>
      <linearGradient id="pin-degrade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8DB0FF" />
        <stop offset="1" stopColor="#9A7BF0" />
      </linearGradient>
    </defs>
    <path
      d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 32 12 32s12-11.2 12-20.1C24 5.3 18.6 0 12 0z"
      fill="url(#pin-degrade)"
    />
    <circle cx="12" cy="11.8" r="4.6" fill="#0C1128" />
  </svg>
);

// Abertura no padrão do Guimas: sala do workshop tingida de navy com os brilhos
// azul e roxo, pin em degradê caindo e CUIABÁ passando pela tela (entra pela
// direita, desacelera no centro e sai pela esquerda).
export const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const queda = interpolate(frame, [0.15 * fps, 0.75 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bounce,
  });
  const passagem = interpolate(
    frame,
    [0.2 * fps, 1.1 * fps, 3.3 * fps, 4 * fps],
    [1300, 40, -40, -1500],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.33, 0, 0.2, 1),
    },
  );
  const sub = (ini: number) =>
    interpolate(frame, [ini, ini + 0.4 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  const saida = interpolate(frame, [3.4 * fps, 3.9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // pulso do brilho do pin
  const brilho = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      <Sequence name="Sala" premountFor={fps}>
        <Clipe arquivo="abertura-sala.mp4" zoom={[1.05, 1.35]} x={[560, 600]} y={[760, 700]} punch={false} mudo />
      </Sequence>
      {/* tinta navy + brilhos do padrão do Guimas */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.55), transparent 55%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.55), transparent 55%), linear-gradient(180deg, rgba(12,17,40,0.55) 0%, rgba(12,17,40,0.35) 40%, rgba(12,17,40,0.88) 100%)",
        }}
      />
      <Cantos margem={56} />
      <AbsoluteFill style={{ alignItems: "center" }}>
        {/* etiqueta do topo */}
        <div
          style={{
            position: "absolute",
            top: 150,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            opacity: sub(0.1 * fps) * (1 - saida),
          }}
        >
          <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 28, letterSpacing: "9px", color: AZUL_GUIMAS }}>
            IA NA PRÁTICA
          </div>
          <div style={{ width: 64 * sub(0.2 * fps), height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
        </div>
        {/* sombra do pin */}
        <div
          style={{
            position: "absolute",
            top: 778,
            width: 120,
            height: 26,
            borderRadius: "50%",
            backgroundColor: "rgba(5,8,25,0.6)",
            filter: "blur(6px)",
            opacity: queda * (1 - saida),
            scale: String(0.4 + 0.6 * queda),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 560,
            translate: `0px ${(1 - queda) * -700 - saida * 40}px`,
            opacity: 1 - saida,
            filter: `drop-shadow(0 0 ${24 + brilho * 26}px rgba(141,176,255,0.75))`,
          }}
        >
          <Pin />
        </div>
        <div
          style={{
            position: "absolute",
            top: 820,
            ...TITULO,
            fontSize: 250,
            letterSpacing: "-4px",
            whiteSpace: "nowrap",
            translate: `${passagem}px 0px`,
            filter: "drop-shadow(0 10px 40px rgba(5,8,25,0.7))",
          }}
        >
          <span style={{ color: "#FFFFFF" }}>CUIA</span>
          <span style={textoDegrade}>BÁ</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 1105,
            fontFamily: fonteMono,
            fontWeight: 500,
            fontSize: 34,
            letterSpacing: "14px",
            color: "#C9D4FF",
            textShadow: "0 2px 14px rgba(5,8,25,0.9)",
            opacity: sub(0.9 * fps) * (1 - saida),
            translate: `0px ${(1 - sub(0.9 * fps)) * 30}px`,
          }}
        >
          MATO GROSSO
        </div>
        <div
          style={{
            position: "absolute",
            top: 1300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            opacity: sub(1.5 * fps) * (1 - saida),
            translate: `0px ${(1 - sub(1.5 * fps)) * 40}px`,
          }}
        >
          <div style={{ ...TITULO, fontSize: 92, color: "#FFFFFF", textAlign: "center", lineHeight: 1.02, letterSpacing: "-1px" }}>
            WORKSHOP IA
            <br />
            <span style={textoDegrade}>PARA EMPRESÁRIOS</span>
          </div>
          <div
            style={{
              fontFamily: fonteMono,
              fontWeight: 500,
              fontSize: 28,
              letterSpacing: "4px",
              color: "#C9D4FF",
              padding: "12px 26px",
              borderRadius: 999,
              border: "1.5px solid #34438A",
              backgroundColor: "rgba(12,17,40,0.75)",
            }}
          >
            CDL CUIABÁ + SEBRAE MT
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
