import { Audio } from "@remotion/media";
import type React from "react";
import { staticFile, useVideoConfig } from "remotion";

// Trilha: Beachborn_002 (143,5 BPM). A bateria entra em 2,90 s; compasso de 1,6724 s.
// A faixa está em -9 LUFS: 0,45 a deixa em ~-16 LUFS; 0,10 fica ~12 dB abaixo das vozes.
export const DROP = 2.9;
export const COMPASSO = 1.6724;
export const CHEIA = 0.45;
export const SOB_VOZ = 0.1;

// `de`: segundo da música em que este trecho começa; `volume(frame)` relativo ao trecho.
export const Trilha: React.FC<{ de: number; volume: (f: number) => number }> = ({ de, volume }) => {
  const { fps } = useVideoConfig();
  return <Audio src={staticFile("trilha/beachborn.wav")} trimBefore={Math.round(de * fps)} volume={volume} />;
};
