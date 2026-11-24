import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Clarão curto na troca de cena, no tempo forte da música.
export const Flash: React.FC<{ readonly intensidade?: number }> = ({ intensidade = 0.7 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFFFFF",
        opacity: interpolate(frame, [0, durationInFrames], [intensidade, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};
