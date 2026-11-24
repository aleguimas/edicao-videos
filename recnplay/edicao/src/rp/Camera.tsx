import { Video } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FILTRO_SALA, PESSOAS, type Pessoa } from "./tema";

// Câmera virtual sobre a gravação fixa da conversa (1920x1080).
// Cada plano é um recorte com um leve avanço (push-in) durante o plano; as trocas são cortes secos,
// como numa edição multicâmera.
export type TipoPlano = "geral" | "duplaEsq" | "duplaDir" | "close";
export type Plano = { ini: number; fim: number; tipo: TipoPlano; pessoa?: Pessoa };

const W = 1920;
const H = 1080;

export const enquadramento = (p: Plano): { x: number; y: number; z: number } => {
  if (p.tipo === "geral") return { x: 960, y: 540, z: 1.0 };
  if (p.tipo === "duplaEsq") return { x: 600, y: 590, z: 1.55 };
  if (p.tipo === "duplaDir") return { x: 1190, y: 560, z: 1.5 };
  const pe = PESSOAS[p.pessoa ?? "D"];
  // afasta o centro do vizinho mais próximo para o plano não parecer uma dupla
  const desvio = { A: -50, B: 40, C: -70, D: 60 }[p.pessoa ?? "D"];
  return { x: pe.x + desvio, y: pe.y + 112, z: 2.3 };
};

const QuadroPlano: React.FC<{ plano: Plano; origemFps: number }> = ({ plano, origemFps }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const e = enquadramento(plano);
  const avanco = interpolate(frame, [0, durationInFrames], [1, plano.tipo === "geral" ? 1.05 : 1.04]);
  const z = e.z * avanco;
  const lim = (v: number, metade: number, total: number) => Math.min(total - metade / z, Math.max(metade / z, v));
  const cx = lim(e.x, W / 2, W);
  const cy = lim(e.y, H / 2, H);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Video
        src={staticFile("conversa.mp4")}
        trimBefore={Math.round(plano.ini * origemFps)}
        muted
        style={{
          position: "absolute",
          width: W,
          height: H,
          scale: String(z),
          translate: `${z * (W / 2 - cx)}px ${z * (H / 2 - cy)}px`,
          filter: FILTRO_SALA,
        }}
      />
    </AbsoluteFill>
  );
};

// Renderiza uma lista de planos a partir do segundo `inicio` da gravação.
export const Camera: React.FC<{ planos: Plano[]; inicio: number }> = ({ planos, inicio }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {planos.map((p) => (
        <Sequence
          key={`${p.ini}`}
          from={Math.round((p.ini - inicio) * fps)}
          durationInFrames={Math.round((p.fim - p.ini) * fps)}
          premountFor={fps}
        >
          <QuadroPlano plano={p} origemFps={fps} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
