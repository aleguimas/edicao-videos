import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useVideoConfig } from "remotion";
import { Apresentacao } from "./Apresentacao";
import { Encerramento } from "./Encerramento";

export const VideoIAFalhou: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <>
      <TransitionSeries name="Linha do tempo">
        <TransitionSeries.Sequence
          name="Apresentação"
          durationInFrames={394}
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
      {/* Trilha original (v2: beat continua sob a logo; v1 = trilha.wav) */}
      <Audio
        name="Trilha"
        src={staticFile("trilha-v2.wav")}
        premountFor={fps}
        volume={(f) =>
          interpolate(f, [0, 12 * fps, 12.6 * fps], [0.42, 0.42, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </>
  );
};
