import { Audio } from "@remotion/media";
import {
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Apresentacao } from "./Apresentacao";
import { Encerramento } from "./Encerramento";

// Final: o vídeo do apresentador toca até o fim sem ser remontado, e a logo
// entra POR CIMA dele em 43,0 s (frame 1290) com fade de 18 frames. Assim não
// há quadro preto entre as cenas (a TransitionSeries remontava o vídeo).
export const VideoConteudo: React.FC = () => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <>
      <Apresentacao
        name="Apresentação"
        durationInFrames={1308}
        premountFor={fps}
      />
      <Encerramento
        name="Encerramento"
        from={1290}
        durationInFrames={75}
        premountFor={fps}
        corFundo="#0B0B0C"
        style={{
          opacity: interpolate(frame, [1290, 1308], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      {/* Trilha original: ~12 dB abaixo da voz, sobe na entrada da logo
          (keyframes: [0, entrada da logo - 6, entrada da logo + 12]) */}
      <Audio
        name="Trilha"
        src={staticFile("trilha.wav")}
        premountFor={fps}
        volume={(f) =>
          interpolate(f, [0, 1284, 1302], [0.42, 0.42, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </>
  );
};
