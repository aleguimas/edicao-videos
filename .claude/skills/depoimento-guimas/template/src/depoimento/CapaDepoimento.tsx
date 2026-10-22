import { AbsoluteFill, Img, staticFile } from "remotion";
import { Cantos } from "../Cantos";
import {
  AZUL_GUIMAS,
  CINZA_RODAPE,
  DEGRADE_BARRA,
  fonteMono,
  NAVY,
  textoDegrade,
  TITULO,
} from "../fonte";
import { FILTRO_DEPOIMENTO } from "./Depoimento";

export type CapaDepoimentoProps = {
  readonly foto: string; // quadro do depoimento em public/depoimentos/ (1080x1920)
  // ponto da foto (coordenadas 1080x1920) no centro do cartão e escala da foto
  readonly centro: { readonly x: number; readonly y: number };
  readonly escala: number;
  // frase da pessoa (literal), em linhas; a partir de `inicioDegrade` vai em degradê
  readonly frase: readonly string[];
  readonly inicioDegrade: number;
  readonly nome: string;
  readonly cargo: string;
  readonly evento: string;
};

const CARTAO = { largura: 800, altura: 860, topo: 250 };

// Capa de depoimento no padrão do Guimas: rosto da pessoa num cartão com molduras de
// canto, a frase dela em destaque (entre aspas) e nome + empresa. Título e nome ficam
// dentro do recorte 3:4 do grid do Instagram (y ≈ 240–1680).
export const CapaDepoimento: React.FC<CapaDepoimentoProps> = ({
  foto,
  centro,
  escala,
  frase,
  inicioDegrade,
  nome,
  cargo,
  evento,
}) => {
  const tamanhoFrase = Math.min(118, 900 / (Math.max(...frase.map((l) => l.length)) * 0.62));
  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.55), transparent 55%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.6), transparent 55%)",
      }}
    >
      <Cantos margem={56} />

      {/* etiqueta do topo */}
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 30, letterSpacing: "12px", color: "#FFFFFF" }}>DEPOIMENTO</div>
        <div style={{ width: 64, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
      </div>

      {/* rosto */}
      <div
        style={{
          position: "absolute",
          left: (1080 - CARTAO.largura) / 2,
          top: CARTAO.topo,
          width: CARTAO.largura,
          height: CARTAO.altura,
          borderRadius: 32,
          border: "2px solid rgba(143,169,230,0.45)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        }}
      >
        <Cantos margem={-22} tamanho={[110, 88]} espessura={4} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden" }}>
          <Img
            src={staticFile(`depoimentos/${foto}`)}
            style={{
              position: "absolute",
              width: 1080 * escala,
              height: 1920 * escala,
              left: CARTAO.largura / 2 - centro.x * escala,
              top: CARTAO.altura / 2 - centro.y * escala,
              filter: FILTRO_DEPOIMENTO,
            }}
          />
          {/* base navy para a frase encostar na foto */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: "linear-gradient(180deg, transparent, rgba(12,17,40,0.85))" }} />
        </div>
      </div>

      {/* frase entre aspas, sobrepondo a base do cartão */}
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...TITULO, fontSize: 220, lineHeight: 0.6, height: 100, ...textoDegrade }}>“</div>
        <div
          style={{
            ...TITULO,
            fontSize: tamanhoFrase,
            lineHeight: 1.0,
            letterSpacing: "-2px",
            textTransform: "uppercase",
            textAlign: "center",
            whiteSpace: "nowrap",
            filter: "drop-shadow(0 6px 24px rgba(5,8,25,0.7))",
          }}
        >
          {frase.map((l, i) => (
            <div key={l} style={{ color: "#FFFFFF", ...(i >= inicioDegrade ? textoDegrade : {}) }}>
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* quem disse */}
      <div style={{ position: "absolute", top: 1340, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ ...TITULO, fontSize: 58, color: "#FFFFFF", letterSpacing: "-1px" }}>{nome}</div>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 28, letterSpacing: "6px", color: AZUL_GUIMAS, textTransform: "uppercase" }}>{cargo}</div>
        <div
          style={{
            marginTop: 18,
            fontFamily: fonteMono,
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: "4px",
            color: "#C9D4FF",
            padding: "12px 26px",
            borderRadius: 999,
            border: "1.5px solid #34438A",
            backgroundColor: "rgba(111,143,242,0.08)",
          }}
        >
          {evento}
        </div>
      </div>

      <div style={{ position: "absolute", right: 92, bottom: 84, fontFamily: fonteMono, fontWeight: 500, fontSize: 28, letterSpacing: "2px", color: CINZA_RODAPE }}>
        @aleguimas
      </div>
    </AbsoluteFill>
  );
};
