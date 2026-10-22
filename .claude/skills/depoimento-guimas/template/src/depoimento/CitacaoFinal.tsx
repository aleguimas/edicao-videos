import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cantos } from "../Cantos";
import { AZUL_GUIMAS, CINZA_RODAPE, DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO } from "../fonte";

type CitacaoFinalProps = {
  // linhas da frase do depoimento (texto literal); as linhas a partir de `inicioDegrade` vão em degradê
  readonly linhas: readonly string[];
  readonly inicioDegrade: number;
  readonly nome: string;
  readonly cargo: string;
};

// Encerramento do depoimento: a frase mais forte da pessoa, entre aspas, no fundo
// navy do Guimas, assinada com nome e empresa, e @aleguimas no rodapé.
export const CitacaoFinal: React.FC<CitacaoFinalProps> = ({ linhas, inicioDegrade, nome, cargo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = (ini: number) =>
    interpolate(frame, [ini, ini + 0.45 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  // cada linha precisa caber em 888 px (Archivo 800 condensada ≈ 0,62 do tamanho por caractere)
  const tamanho = Math.min(76, 888 / (Math.max(...linhas.map((l) => l.length)) * 0.62));
  const fundo = interpolate(frame, [0, 0.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.55), transparent 55%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.55), transparent 55%)",
        opacity: fundo,
        padding: "0 96px",
        justifyContent: "center",
      }}
    >
      <Cantos margem={56} />
      <div
        style={{
          ...TITULO,
          fontSize: 300,
          lineHeight: 0.6,
          height: 150,
          ...textoDegrade,
          opacity: anim(0.15 * fps),
          translate: `0px ${(1 - anim(0.15 * fps)) * 40}px`,
        }}
      >
        “
      </div>
      <div style={{ ...TITULO, fontSize: tamanho, lineHeight: 1.05, letterSpacing: "-1px", textTransform: "uppercase", whiteSpace: "nowrap", marginTop: 20 }}>
        {linhas.map((l, i) => (
          <div
            key={l}
            style={{
              color: "#FFFFFF",
              ...(i >= inicioDegrade ? textoDegrade : {}),
              opacity: anim((0.3 + i * 0.12) * fps),
              translate: `${(1 - anim((0.3 + i * 0.12) * fps)) * -40}px 0px`,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 14, opacity: anim(0.9 * fps) }}>
        <div style={{ width: 64 * anim(0.9 * fps), height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
        <div style={{ ...TITULO, fontSize: 52, color: "#FFFFFF", letterSpacing: "-1px" }}>{nome}</div>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 28, letterSpacing: "6px", color: AZUL_GUIMAS, textTransform: "uppercase" }}>
          {cargo}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 92,
          bottom: 84,
          fontFamily: fonteMono,
          fontWeight: 500,
          fontSize: 28,
          letterSpacing: "2px",
          color: CINZA_RODAPE,
          opacity: anim(1.1 * fps),
        }}
      >
        @aleguimas
      </div>
    </AbsoluteFill>
  );
};
