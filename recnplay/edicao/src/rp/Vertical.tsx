import { Video } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { staticFile } from "remotion";
import { CONDENSADA, FILTRO_SALA, LARANJA, PESSOAS, type Pessoa } from "./tema";

// Recorte vertical (9:16) de uma pessoa na gravação da conversa. A janela tem 840 px de altura
// na origem (cabeça no terço superior), ou seja, ~2,3x — o mesmo zoom do close do 16:9.
export const enquadramentoV = (quem: Pessoa | "dupla" | "geral") => {
  if (quem === "geral") return { x: 900, y: 540, h: 1080 };
  if (quem === "dupla") return { x: 1190, y: 560, h: 1000 };
  const pe = PESSOAS[quem];
  const desvio = { A: -40, B: 30, C: -50, D: 40 }[quem];
  return { x: pe.x + desvio, y: pe.y + 150, h: 720 };
};

export const CameraV: React.FC<{
  ini: number; // segundo da gravação
  quem: Pessoa | "dupla" | "geral";
  punch?: boolean;
  mudo?: boolean;
  volume?: number;
  hOrigem?: number; // altura da janela na origem (720 = fechado, ~930 = médio)
}> = ({ ini, quem, punch = true, mudo = true, volume = 1, hOrigem }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const e0 = enquadramentoV(quem);
  const e = hOrigem ? { ...e0, h: hOrigem, y: e0.y + (hOrigem - e0.h) * 0.2 } : e0;
  const entrada = punch
    ? interpolate(frame, [0, 0.35 * fps], [1.1, 1], {
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      })
    : 1;
  const avanco = interpolate(frame, [0, durationInFrames], [1, 1.05]);
  const s = (height / e.h) * entrada * avanco; // escala origem → tela
  const meiaW = width / 2 / s;
  const meiaH = height / 2 / s;
  const cx = Math.min(1920 - meiaW, Math.max(meiaW, e.x));
  const cy = Math.min(1080 - meiaH, Math.max(meiaH, e.y));
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Video
        src={staticFile("conversa.mp4")}
        trimBefore={Math.round(ini * fps)}
        muted={mudo}
        volume={volume}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          transform: `translate(${width / 2 - cx * s}px, ${height / 2 - cy * s}px) scale(${s})`,
          filter: FILTRO_SALA,
        }}
      />
    </AbsoluteFill>
  );
};

export type Palavra = { t: string; a: number; b: number };

// Legenda palavra a palavra: blocos curtos em condensada branca, palavra falada em laranja.
export const Legenda: React.FC<{ palavras: Palavra[]; inicio: number; y?: number; tamanho?: number }> = ({
  palavras,
  inicio,
  y = 1240,
  tamanho = 96,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const t = inicio + frame / fps;
  // agrupa em blocos de até 3 palavras / 16 caracteres, quebrando depois de pontuação
  const blocos: Palavra[][] = [];
  let atual: Palavra[] = [];
  for (const p of palavras) {
    const len = atual.reduce((s, x) => s + x.t.length + 1, 0) + p.t.length;
    if (atual.length && (atual.length >= 3 || len > 16)) {
      blocos.push(atual);
      atual = [];
    }
    atual.push(p);
    if (/[.,?!:]$/.test(p.t)) {
      blocos.push(atual);
      atual = [];
    }
  }
  if (atual.length) blocos.push(atual);
  const bloco = blocos.find((b, i) => {
    const prox = blocos[i + 1];
    return t >= b[0].a - 0.05 && (prox ? t < prox[0].a - 0.05 : t <= b[b.length - 1].b + 0.6);
  });
  if (!bloco) return null;
  const desde = t - (bloco[0].a - 0.05);
  const pop = interpolate(desde, [0, 0.12], [0.86, 1], { extrapolateRight: "clamp" });
  const texto = bloco.map((p) => p.t).join(" ");
  const tam = Math.min(tamanho, (width * 0.88) / (texto.length * 0.47));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y,
          translate: "0 -50%",
          textAlign: "center",
          scale: String(pop),
          whiteSpace: "nowrap",
        }}
      >
        {bloco.map((p) => {
          const ativa = t >= p.a - 0.03 && t < p.b + 0.15;
          return (
            <span
              key={`${p.a}`}
              style={{
                ...CONDENSADA,
                fontSize: tam,
                lineHeight: 1,
                color: ativa ? LARANJA : "#FFFFFF",
                WebkitTextStroke: `${tam * 0.045}px #000`,
                paintOrder: "stroke fill",
                textShadow: "0 6px 24px rgba(0,0,0,0.55)",
                margin: `0 ${tam * 0.1}px`,
              }}
            >
              {p.t.replace(/[.,:]$/, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
