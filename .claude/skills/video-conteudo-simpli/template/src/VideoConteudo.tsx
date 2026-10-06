import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import { Apresentacao } from "./Apresentacao";
import { Encerramento } from "./Encerramento";

export const VideoConteudo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <TransitionSeries name="Linha do tempo">
        <TransitionSeries.Sequence
          name="Apresentação"
          durationInFrames={300}
          premountFor={fps}
        >
          <Apresentacao />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence
          name="Encerramento"
          durationInFrames={75}
          premountFor={fps}
        >
          <Encerramento corFundo="#0B0B0C" />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {/* Trilha original: ~12 dB abaixo da voz, sobe na entrada da logo.
          Keyframes: [0, transição - 6, transição + 12], onde
          transição = duração da Apresentação - 18 (aqui 300 - 18 = 282) */}
      <Audio
        name="Trilha"
        src={staticFile("trilha.wav")}
        premountFor={fps}
        volume={(f) =>
          interpolate(f, [0, 276, 294], [0.42, 0.42, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </>
  );
};
