import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cantos } from "./Cantos";
import { fonteMono } from "./fonte";

// Assinatura fixa do Guimas sobre o vídeo: molduras de canto e @aleguimas em mono.
export const Assinatura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const opacidade = interpolate(
    frame,
    [0, 0.4 * fps, durationInFrames - 0.4 * fps, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ opacity: opacidade }}>
      <Cantos margem={56} style={{ filter: "drop-shadow(0 2px 6px rgba(5,8,25,0.6))" }} />
      <div
        style={{
          position: "absolute",
          right: 92,
          bottom: 84,
          fontFamily: fonteMono,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: "2px",
          color: "#FFFFFF",
          opacity: 0.85,
          textShadow: "0 2px 10px rgba(5,8,25,0.8)",
        }}
      >
        @aleguimas
      </div>
    </AbsoluteFill>
  );
};
