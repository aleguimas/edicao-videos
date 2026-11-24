import type React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { fonteMono, fonteTexto } from "../fonte";
import { LogoRP } from "./Grafismos";
import { CONDENSADA, LARANJA, PRETO, ROSA, textoFestival } from "./tema";

// Capas no estilo do card oficial: preto, foto do Guimas falando, título em condensada
// (2ª linha em degradê laranja→rosa→roxo), etiqueta rosa e a mesa.
export const CapaRP: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const nomes = "Zenuel Lins · Raíssa Gonçalves · Malu · Alexandre Guimarães";
  if (vertical) {
    return (
      <AbsoluteFill style={{ backgroundColor: PRETO }}>
        <Img
          src={staticFile("midia/capa-guimas.jpg")}
          style={{ position: "absolute", top: 0, left: -60, width: 1200, height: 1350, objectFit: "cover", objectPosition: "50% 20%" }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(8,6,12,0.55) 0%, rgba(8,6,12,0) 18%, rgba(8,6,12,0) 42%, rgba(8,6,12,0.92) 62%, #08060C 69%)",
          }}
        />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(138,59,255,0.55) 0%, rgba(0,0,0,0) 55%)" }} />
        <div style={{ position: "absolute", left: 70, top: 260, display: "flex", alignItems: "flex-end", gap: 12 }}>
          <LogoRP largura={360} />
          <div style={{ ...CONDENSADA, fontWeight: 500, fontSize: 96, lineHeight: 0.8, color: "#fff", marginBottom: 18 }}>26</div>
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 1130 }}>
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 30, letterSpacing: 7, color: ROSA }}>✳ CONVERSA NO REC'N'PLAY</div>
          <div style={{ ...CONDENSADA, fontSize: 168, lineHeight: 0.9, color: "#fff", marginTop: 18 }}>Marketing</div>
          <div style={{ ...CONDENSADA, ...textoFestival, fontSize: 168, lineHeight: 0.9, display: "inline-block" }}>na era da IA</div>
          <div style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 36, color: "#fff", marginTop: 26, lineHeight: 1.3 }}>
            Criatividade, design e estratégia em um novo mercado
          </div>
          <div style={{ fontFamily: fonteTexto, fontSize: 28, color: "rgba(255,255,255,0.7)", marginTop: 18 }}>{nomes}</div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO }}>
      <Img
        src={staticFile("midia/capa-guimas.jpg")}
        style={{ position: "absolute", left: 600, top: 0, width: 1320, height: 1080, objectFit: "cover", objectPosition: "60% 30%" }}
      />
      <AbsoluteFill
        style={{ background: "linear-gradient(90deg, #08060C 0%, #08060C 48%, rgba(8,6,12,0.7) 58%, rgba(8,6,12,0) 74%)" }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(138,59,255,0.6) 0%, rgba(0,0,0,0) 55%)" }} />
      <div style={{ position: "absolute", left: 90, top: 80, display: "flex", alignItems: "flex-end", gap: 12 }}>
        <LogoRP largura={330} />
        <div style={{ ...CONDENSADA, fontWeight: 500, fontSize: 88, lineHeight: 0.8, color: "#fff", marginBottom: 16 }}>26</div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 330, width: 1060 }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 30, letterSpacing: 7, color: ROSA }}>✳ CONVERSA COMPLETA</div>
        <div style={{ ...CONDENSADA, fontSize: 196, lineHeight: 0.88, color: "#fff", marginTop: 18 }}>Marketing</div>
        <div style={{ ...CONDENSADA, ...textoFestival, fontSize: 196, lineHeight: 0.88, display: "inline-block" }}>na era da IA</div>
        <div style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 40, color: LARANJA, marginTop: 26 }}>
          Criatividade, design e estratégia em um novo mercado
        </div>
        <div style={{ fontFamily: fonteTexto, fontSize: 30, color: "rgba(255,255,255,0.75)", marginTop: 16 }}>{nomes}</div>
      </div>
    </AbsoluteFill>
  );
};

// Capa de cada corte 9:16: mesmo modelo da capa do resumo, com o título do corte
// e um quadro do Guimas falando (public/midia/cortes/corteNN.jpg).
export const CapaCorte: React.FC<{ id: string; linhas: string[] }> = ({ id, linhas }) => {
  const maior = Math.max(...linhas.map((l) => l.length));
  const tam = Math.min(168, 940 / (maior * 0.44));
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO }}>
      <Img
        src={staticFile(`midia/cortes/${id}.jpg`)}
        style={{ position: "absolute", top: 0, left: -60, width: 1200, height: 1350, objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(8,6,12,0.55) 0%, rgba(8,6,12,0) 18%, rgba(8,6,12,0) 42%, rgba(8,6,12,0.92) 62%, #08060C 69%)",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(138,59,255,0.55) 0%, rgba(0,0,0,0) 55%)" }} />
      <div style={{ position: "absolute", left: 70, top: 260, display: "flex", alignItems: "flex-end", gap: 12 }}>
        <LogoRP largura={300} />
        <div style={{ ...CONDENSADA, fontWeight: 500, fontSize: 80, lineHeight: 0.8, color: "#fff", marginBottom: 15 }}>26</div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1150 }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: ROSA }}>
          ✳ MARKETING NA ERA DA IA
        </div>
        <div style={{ ...CONDENSADA, fontSize: tam, lineHeight: 0.92, color: "#fff", marginTop: 18, whiteSpace: "nowrap" }}>{linhas[0]}</div>
        <div style={{ ...CONDENSADA, ...textoFestival, fontSize: tam, lineHeight: 0.92, whiteSpace: "nowrap", display: "inline-block" }}>
          {linhas[1]}
        </div>
        <div style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: 32, color: "rgba(255,255,255,0.8)", marginTop: 26 }}>
          Alexandre Guimarães · Fundador da Simplí
        </div>
      </div>
    </AbsoluteFill>
  );
};
