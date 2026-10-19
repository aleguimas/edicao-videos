import { AbsoluteFill, Img, staticFile } from "remotion";
import { Cantos } from "./Cantos";
import { FILTRO_COR } from "./Clipe";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO } from "./fonte";

// Ponto do quadro (origem 1080x1920) que fica no centro da foto e zoom aplicado.
// Foto: 2:05:00.2 do workshop, Guimas perto da câmera, falando com a turma.
const FOCO = { x: 680, y: 627, zoom: 1.35 };

const Pin: React.FC<{ readonly tamanho: number }> = ({ tamanho }) => (
  <svg width={tamanho * 0.74} height={tamanho} viewBox="0 0 24 32">
    <defs>
      <linearGradient id="pin-capa" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8DB0FF" />
        <stop offset="1" stopColor="#9A7BF0" />
      </linearGradient>
    </defs>
    <path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 32 12 32s12-11.2 12-20.1C24 5.3 18.6 0 12 0z" fill="url(#pin-capa)" />
    <circle cx="12" cy="11.8" r="4.6" fill={NAVY} />
  </svg>
);

// Capa 1080x1920 (Reels, Shorts, TikTok) no padrão do Guimas. O título fica dentro
// da área que o Instagram mostra no grid do perfil (recorte 3:4, y≈240–1680).
export const Capa: React.FC = () => {
  const z = FOCO.zoom;
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      {/* Foto do workshop: Guimas perto da câmera, gesticulando para a turma */}
      <Img
        src={staticFile("resumo/capa-frame-perto.png")}
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          scale: String(z),
          translate: `${z * (540 - FOCO.x)}px ${z * (820 - FOCO.y)}px`,
          filter: FILTRO_COR,
        }}
      />
      {/* tinta navy: foto viva em cima, fundo escuro embaixo para o título */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.55), transparent 50%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.6), transparent 55%), linear-gradient(180deg, rgba(12,17,40,0.55) 0%, rgba(12,17,40,0.05) 22%, rgba(12,17,40,0.15) 45%, rgba(12,17,40,0.88) 62%, #0C1128 80%)",
        }}
      />
      <Cantos margem={56} />

      {/* etiqueta do topo */}
      <div style={{ position: "absolute", top: 112, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 30, letterSpacing: "9px", color: "#C9D4FF", textShadow: "0 2px 12px rgba(5,8,25,0.9)" }}>
          IA NA PRÁTICA
        </div>
        <div style={{ width: 64, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
      </div>

      {/* título */}
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...TITULO,
          textTransform: "uppercase",
          letterSpacing: "-2px",
          lineHeight: 1.0,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontSize: 104, color: "#FFFFFF" }}>WORKSHOP DE IA</div>
        <div style={{ fontSize: 90, color: "#FFFFFF" }}>PARA EMPRESÁRIOS</div>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 18 }}>
          <Pin tamanho={140} />
          <span style={{ fontSize: 184, letterSpacing: "-4px", ...textoDegrade }}>CUIABÁ</span>
        </div>
      </div>

      {/* selo e assinatura */}
      <div style={{ position: "absolute", top: 1575, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: fonteMono,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: "4px",
            color: "#C9D4FF",
            padding: "14px 30px",
            borderRadius: 999,
            border: "1.5px solid #34438A",
            backgroundColor: "rgba(111,143,242,0.08)",
          }}
        >
          CDL CUIABÁ + SEBRAE MT
        </div>
      </div>
      <div style={{ position: "absolute", right: 92, bottom: 84, fontFamily: fonteMono, fontWeight: 500, fontSize: 28, letterSpacing: "2px", color: AZUL_GUIMAS }}>
        @aleguimas
      </div>
    </AbsoluteFill>
  );
};
