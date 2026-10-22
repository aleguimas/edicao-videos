import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonteMono, textoDegrade, TITULO } from "../fonte";

type GanchoProps = {
  readonly topo: string; // linha pequena de abertura (ex.: "SUA EMPRESA TEM UM")
  readonly riscada: string; // palavra que é negada/riscada (ex.: "BANCO")
  readonly destaque: string; // palavra que entra no lugar, em degradê (ex.: "BANDO")
  readonly fim: string; // complemento (ex.: "DE DADOS?")
  // frames (no corte) em que cada parte é dita
  readonly emTopo: number;
  readonly emRiscada: number;
  readonly emDestaque: number;
  readonly emFim: number;
};

// Gancho dos primeiros segundos: a pergunta de impacto em tipografia grande. A palavra
// "riscada" aparece, é cortada por uma linha lilás e apaga (negação do padrão @aleguimas),
// e a palavra em degradê bate no lugar com tremida. Fica sobre o vídeo desde o frame 0.
// cada linha se ajusta para caber na tela (Archivo 800 condensada ≈ 0,62 do tamanho por
// caractere; mono com espaçamento ≈ 0,78)
const caber = (texto: string, max: number, fator = 0.62, largura = 940) => Math.min(max, largura / (texto.length * fator));

export const Gancho: React.FC<GanchoProps> = ({ topo, riscada, destaque, fim, emTopo, emRiscada, emDestaque, emFim }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entra = (f: number, dur = 0.3) =>
    interpolate(frame, [f, f + dur * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  const risco = interpolate(frame, [emDestaque - 4, emDestaque + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const batida = interpolate(frame, [emDestaque, emDestaque + 4, emDestaque + 12], [0.4, 1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // tremida curta quando o destaque bate
  const tremida = frame >= emDestaque && frame < emDestaque + 8 ? Math.sin(frame * 2.4) * 10 * (1 - (frame - emDestaque) / 8) : 0;
  const saida = interpolate(frame, [durationInFrames - 0.3 * fps, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 930,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...TITULO,
        textTransform: "uppercase",
        letterSpacing: "-3px",
        lineHeight: 0.95,
        whiteSpace: "nowrap",
        opacity: 1 - saida,
        translate: `${tremida}px ${-saida * 60}px`,
        filter: `blur(${saida * 10}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: -80,
          bottom: -80,
          background: "radial-gradient(ellipse at center, rgba(12,17,40,0.8) 0%, rgba(12,17,40,0.5) 45%, transparent 72%)",
          filter: "blur(20px)",
          opacity: entra(0, 0.2),
        }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, filter: "drop-shadow(0 6px 22px rgba(5,8,25,0.85))" }}>
        <div
          style={{
            fontFamily: fonteMono,
            fontWeight: 500,
            fontSize: caber(topo, 46, 0.78),
            letterSpacing: "6px",
            color: "#FFFFFF",
            textShadow: "0 3px 16px rgba(5,8,25,0.95), 0 1px 3px rgba(5,8,25,0.9)",
            marginBottom: 18,
            opacity: entra(emTopo),
            translate: `0px ${(1 - entra(emTopo)) * 30}px`,
          }}
        >
          {topo}
        </div>
        <div style={{ position: "relative", fontSize: caber(riscada, 190), color: risco > 0.5 ? "#6C779F" : "#FFFFFF", opacity: entra(emRiscada), scale: String(0.7 + 0.3 * entra(emRiscada)) }}>
          {riscada}
          {/* risco lilás que atravessa a palavra */}
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "48%",
              height: 16,
              width: `calc(${risco * 100}% + 20px)`,
              borderRadius: 8,
              backgroundColor: "#9A7BF0",
            }}
          />
        </div>
        <div style={{ fontSize: caber(destaque, 230), ...textoDegrade, opacity: entra(emDestaque, 0.15), scale: String(batida), marginTop: -6 }}>{destaque}</div>
        <div style={{ fontSize: caber(fim, 120), color: "#FFFFFF", opacity: entra(emFim), translate: `0px ${(1 - entra(emFim)) * 40}px` }}>{fim}</div>
      </div>
    </div>
  );
};
