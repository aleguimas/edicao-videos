import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cantos } from "../Cantos";
import { AZUL_GUIMAS, CINZA_RODAPE, DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO } from "../fonte";

export type CitacaoPessoa = {
  readonly nome: string;
  readonly cargo: string;
  // frase literal da pessoa, em linhas; a partir de `citacaoInicioDegrade` vai em degradê
  readonly citacao: readonly string[];
  readonly citacaoInicioDegrade: number;
};

// Encerramento de depoimento com mais de uma pessoa: uma citação curta de cada,
// empilhadas e assinadas, no fundo navy do Guimas.
export const CitacaoDupla: React.FC<{ readonly pessoas: readonly CitacaoPessoa[] }> = ({ pessoas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = (ini: number) =>
    interpolate(frame, [ini, ini + 0.45 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
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
        gap: 90,
      }}
    >
      <Cantos margem={56} />
      {pessoas.map((p, k) => {
        const ini = (0.2 + k * 0.7) * fps;
        // cada linha precisa caber em 888 px (Archivo 800 condensada ≈ 0,62 do tamanho por caractere)
        const tamanho = Math.min(62, 888 / (Math.max(...p.citacao.map((l) => l.length)) * 0.62));
        return (
          <div key={p.nome} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...TITULO, fontSize: 170, lineHeight: 0.6, height: 70, ...textoDegrade, opacity: anim(ini) }}>“</div>
            <div style={{ ...TITULO, fontSize: tamanho, lineHeight: 1.05, letterSpacing: "-1px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {p.citacao.map((l, i) => (
                <div
                  key={l}
                  style={{
                    color: "#FFFFFF",
                    ...(i >= p.citacaoInicioDegrade ? textoDegrade : {}),
                    opacity: anim(ini + (0.1 + i * 0.1) * fps),
                    translate: `${(1 - anim(ini + (0.1 + i * 0.1) * fps)) * -40}px 0px`,
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, opacity: anim(ini + 0.45 * fps) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 48, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
                <div style={{ ...TITULO, fontSize: 44, color: "#FFFFFF", letterSpacing: "-1px", whiteSpace: "nowrap" }}>{p.nome}</div>
              </div>
              <div style={{ marginLeft: 66, fontFamily: fonteMono, fontWeight: 500, fontSize: 22, letterSpacing: "4px", color: AZUL_GUIMAS, textTransform: "uppercase" }}>
                {p.cargo}
              </div>
            </div>
          </div>
        );
      })}
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
          opacity: anim(1.4 * fps),
        }}
      >
        @aleguimas
      </div>
    </AbsoluteFill>
  );
};
