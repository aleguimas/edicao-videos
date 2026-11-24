import type React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonteMono, fonteTexto } from "../fonte";
import { LogoRP } from "./Grafismos";
import { CONDENSADA, PRETO, ROSA, textoFestival } from "./tema";

// Encerramento: "O futuro nasce aqui" (lema do festival), logo e o perfil do Guimas.
export const Encerramento: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const ent = (ini: number, t = 0.6) =>
    interpolate(frame, [ini * fps, (ini + t) * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  const fim = interpolate(frame, [durationInFrames - 0.8 * fps, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const linhas = ["O FUTURO", "NASCE AQUI"];
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO, opacity: fim }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 120%, rgba(192,75,224,0.75) 0%, rgba(122,43,226,0.45) 35%, rgba(0,0,0,0) 70%)",
          opacity: ent(0, 1),
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: vertical ? 40 : 26 }}>
        {linhas.map((l, i) => (
          <div
            key={l}
            style={{
              ...CONDENSADA,
              ...textoFestival,
              fontSize: vertical ? 220 : 200,
              lineHeight: 0.86,
              opacity: ent(0.15 + i * 0.25),
              scale: String(1.1 - 0.1 * ent(0.15 + i * 0.25)),
            }}
          >
            {l}
          </div>
        ))}
        <div style={{ opacity: ent(1.0), marginTop: vertical ? 50 : 30 }}>
          <LogoRP largura={vertical ? 520 : 420} />
        </div>
        <div
          style={{
            opacity: ent(1.6),
            fontFamily: fonteMono,
            fontWeight: 700,
            fontSize: vertical ? 36 : 30,
            letterSpacing: 6,
            color: ROSA,
            marginTop: vertical ? 70 : 30,
          }}
        >
          @ALEGUIMAS
        </div>
        <div style={{ opacity: ent(1.9), fontFamily: fonteTexto, fontSize: vertical ? 30 : 24, color: "rgba(255,255,255,0.75)" }}>
          Alexandre Guimarães · Fundador da Simplí
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
