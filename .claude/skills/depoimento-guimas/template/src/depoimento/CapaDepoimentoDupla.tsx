import { AbsoluteFill, Img, staticFile } from "remotion";
import { Cantos } from "../Cantos";
import { AZUL_GUIMAS, CINZA_RODAPE, DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO } from "../fonte";
import { FILTRO_DEPOIMENTO } from "./Depoimento";

type Rosto = {
  readonly foto: string; // em public/depoimentos/ (1080x1920)
  readonly centro: { readonly x: number; readonly y: number };
  readonly escala: number;
  readonly nome: string;
  readonly cargo: string;
};

export type CapaDepoimentoDuplaProps = {
  readonly rostos: readonly [Rosto, Rosto];
  // frase literal (de uma das pessoas), em linhas; a partir de `inicioDegrade` vai em degradê
  readonly frase: readonly string[];
  readonly inicioDegrade: number;
  readonly evento: string;
};

const CARTAO = { largura: 430, altura: 600, topo: 300, vao: 40 };

// Capa de depoimento com duas pessoas: dois rostos lado a lado, nome e empresa embaixo
// de cada um, frase em destaque e selo do evento (dentro do recorte 3:4 do grid).
export const CapaDepoimentoDupla: React.FC<CapaDepoimentoDuplaProps> = ({ rostos, frase, inicioDegrade, evento }) => {
  const tamanhoFrase = Math.min(118, 900 / (Math.max(...frase.map((l) => l.length)) * 0.62));
  const esquerda = (1080 - 2 * CARTAO.largura - CARTAO.vao) / 2;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.55), transparent 55%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.6), transparent 55%)",
      }}
    >
      <Cantos margem={56} />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 30, letterSpacing: "12px", color: "#FFFFFF" }}>DEPOIMENTOS</div>
        <div style={{ width: 64, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
      </div>

      {rostos.map((r, k) => (
        <div key={r.nome} style={{ position: "absolute", top: CARTAO.topo, left: esquerda + k * (CARTAO.largura + CARTAO.vao), width: CARTAO.largura }}>
          <div
            style={{
              position: "relative",
              width: CARTAO.largura,
              height: CARTAO.altura,
              borderRadius: 28,
              border: "2px solid rgba(143,169,230,0.45)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ position: "absolute", inset: 0, borderRadius: 26, overflow: "hidden" }}>
              <Img
                src={staticFile(`depoimentos/${r.foto}`)}
                style={{
                  position: "absolute",
                  width: 1080 * r.escala,
                  height: 1920 * r.escala,
                  left: CARTAO.largura / 2 - r.centro.x * r.escala,
                  top: CARTAO.altura / 2 - r.centro.y * r.escala,
                  filter: FILTRO_DEPOIMENTO,
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ ...TITULO, fontSize: 44, color: "#FFFFFF", letterSpacing: "-1px", whiteSpace: "nowrap" }}>{r.nome}</div>
            <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 22, letterSpacing: "4px", color: AZUL_GUIMAS, textTransform: "uppercase" }}>{r.cargo}</div>
          </div>
        </div>
      ))}
      {/* molduras de canto em volta do par de rostos */}
      <div style={{ position: "absolute", left: esquerda, top: CARTAO.topo, width: 2 * CARTAO.largura + CARTAO.vao, height: CARTAO.altura }}>
        <Cantos margem={-22} tamanho={[110, 88]} espessura={4} />
      </div>

      <div style={{ position: "absolute", top: 1100, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...TITULO, fontSize: 200, lineHeight: 0.6, height: 90, ...textoDegrade }}>“</div>
        <div style={{ ...TITULO, fontSize: tamanhoFrase, lineHeight: 1.0, letterSpacing: "-2px", textTransform: "uppercase", textAlign: "center", whiteSpace: "nowrap" }}>
          {frase.map((l, i) => (
            <div key={l} style={{ color: "#FFFFFF", ...(i >= inicioDegrade ? textoDegrade : {}) }}>
              {l}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 50,
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
