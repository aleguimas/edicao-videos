import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const MyVideo = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b1020",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "sans-serif",
        fontSize: 100,
      }}
    >
      <div style={{ opacity }}>Olá, Remotion!</div>
    </AbsoluteFill>
  );
};
