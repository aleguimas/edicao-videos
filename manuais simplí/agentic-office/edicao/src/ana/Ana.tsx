import type React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily, fonteMono, VERDE } from "../fonte";
import { ANTES, type Fala, falando, FPS } from "./voz";

// Ana, a Assistente de IA da Simplí: avatar no canto com anel que pulsa enquanto ela fala,
// tarja de apresentação e legenda palavra a palavra.

// brilho do anel: sobe rápido quando ela fala e cai devagar nas pausas
const energia = (fala: Fala, frame: number) => {
  let e = 0;
  for (let k = 8; k >= 0; k--) {
    const f = frame - k;
    e = falando(fala, f) ? Math.min(1, e + 0.35) : e * 0.8;
  }
  return e * (0.75 + 0.25 * Math.abs(Math.sin(frame * 0.7)));
};

export const AnaPip: React.FC<{ readonly fala: Fala; readonly entra?: number; readonly tamanho?: number }> = ({ fala, entra = 0, tamanho = 230 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - entra, fps, config: { damping: 16, stiffness: 120 } });
  const e = energia(fala, frame);
  return (
    <div
      style={{
        position: "absolute",
        right: 56,
        bottom: 56,
        width: tamanho,
        height: tamanho,
        transform: `scale(${s})`,
        transformOrigin: "100% 100%",
        opacity: s,
      }}
    >
      {/* aura verde */}
      <div style={{ position: "absolute", inset: -26, borderRadius: "50%", background: `radial-gradient(circle, rgba(60,224,30,${0.1 + e * 0.35}) 40%, rgba(60,224,30,0) 70%)` }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          border: `5px solid ${VERDE}`,
          boxShadow: `0 0 ${18 + e * 40}px rgba(60,224,30,${0.35 + e * 0.5}), 0 18px 40px rgba(0,0,0,0.6)`,
          background: "#1a1d1b",
        }}
      >
        <Img src={staticFile("midia/ana-verde-2.0.jpg")} style={{ width: "100%", height: "auto", transform: "translateY(-4%) scale(1.75)", transformOrigin: "50% 18%" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -16,
          transform: "translateX(-50%)",
          background: VERDE,
          color: "#0B0B0C",
          fontFamily: fonteMono,
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: 3,
          padding: "4px 14px",
          borderRadius: 6,
        }}
      >
        ANA
      </div>
    </div>
  );
};

// tarja: "ANA · Assistente de IA da Simplí"
export const TarjaAna: React.FC<{ readonly x?: number; readonly y?: number }> = ({ x = 0, y = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const s2 = spring({ frame: frame - 6, fps, config: { damping: 18, stiffness: 140 } });
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ overflow: "hidden" }}>
        <div style={{ fontFamily, fontWeight: 900, fontSize: 66, color: "white", lineHeight: 1, transform: `translateY(${(1 - s) * 100}%)` }}>Ana</div>
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          background: VERDE,
          color: "#0B0B0C",
          fontFamily: fonteMono,
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: 2,
          padding: "8px 16px",
          borderRadius: 6,
          transform: `scaleX(${s2})`,
          transformOrigin: "0 50%",
        }}
      >
        ASSISTENTE DE IA DA SIMPLÍ
      </div>
    </div>
  );
};

// ---------- Legenda: blocos curtos (corta em pausa ou a cada 6 palavras), palavra da vez em verde
type Bloco = { ini: number; fim: number; palavras: readonly [number, number, string][] };
const blocos = (fala: Fala): Bloco[] => {
  const out: Bloco[] = [];
  let atual: [number, number, string][] = [];
  fala.palavras.forEach((p, i) => {
    const ant = fala.palavras[i - 1];
    if (atual.length && (atual.length >= 6 || p[0] - ant[1] > 0.28)) {
      out.push({ ini: atual[0][0], fim: atual[atual.length - 1][1], palavras: atual });
      atual = [];
    }
    atual.push([...p]);
  });
  if (atual.length) out.push({ ini: atual[0][0], fim: atual[atual.length - 1][1], palavras: atual });
  return out;
};

export const Legenda: React.FC<{ readonly fala: Fala; readonly esquerda?: number; readonly direita?: number }> = ({ fala, esquerda = 0, direita = 0 }) => {
  const frame = useCurrentFrame();
  const s = (frame - ANTES) / FPS;
  const bs = blocos(fala);
  const i = bs.findIndex((b, k) => s >= b.ini - 0.05 && s < (bs[k + 1]?.ini ?? b.fim + 0.5) - 0.05);
  if (i < 0) return null;
  const b = bs[i];
  const entrada = interpolate(s - b.ini, [-0.05, 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: esquerda, right: direita, bottom: 70, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div
        style={{
          background: "rgba(11,11,12,0.82)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: "12px 26px",
          fontFamily,
          fontWeight: 800,
          fontSize: 44,
          color: "white",
          display: "flex",
          gap: 13,
          opacity: entrada,
          transform: `translateY(${(1 - entrada) * 12}px)`,
        }}
      >
        {b.palavras.map((p, k) => {
          const dita = s >= p[0] - 0.03;
          const agora = dita && (k === b.palavras.length - 1 || s < b.palavras[k + 1][0] - 0.03);
          return (
            <span key={k} style={{ color: agora ? VERDE : dita ? "white" : "rgba(255,255,255,0.55)" }}>
              {p[2]}
            </span>
          );
        })}
      </div>
    </div>
  );
};
