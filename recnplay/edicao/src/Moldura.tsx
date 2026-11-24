import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Cantos } from "./Cantos";
import { Clipe, FILTRO_COR } from "./Clipe";

// Região limpa do vídeo da Maíra (sem as legendas e figurinhas do Instagram):
// x 108–972, y 570–1440 da origem 1080x1920. As legendas automáticas ficam no
// canto superior esquerdo até y≈560 e as figurinhas começam em y≈1478.
const REGIAO = { x: 108, y: 570, w: 864, h: 870 };
const LARGURA = 880;
const S = LARGURA / REGIAO.w;
const ALTURA = REGIAO.h * S;

const TrechoMaira: React.FC<{ readonly arquivo: string; readonly trimBefore?: number }> = ({
  arquivo,
  trimBefore = 0,
}) => (
  <Video
    src={staticFile(`resumo/${arquivo}`)}
    trimBefore={trimBefore}
    style={{
      position: "absolute",
      left: -REGIAO.x * S,
      top: -REGIAO.y * S,
      width: 1080 * S,
      height: 1920 * S,
      filter: FILTRO_COR,
    }}
  />
);

// Depoimento da Maíra dentro de uma moldura, com a sala do workshop desfocada atrás.
export const Moldura: React.FC<{
  readonly duracao1: number;
  readonly duracao2: number;
  // frames cortados do início do primeiro trecho (versão de 60 s)
  readonly inicio1?: number;
}> = ({ duracao1, duracao2, inicio1 = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entrada = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B0C" }}>
      <Sequence name="Sala desfocada" premountFor={fps}>
        <Clipe
          arquivo="broll-sala-maira.mp4"
          zoom={[1.3, 1.45]}
          x={[560, 600]}
          y={[700, 680]}
          punch={false}
          mudo
          style={{ filter: "blur(18px) brightness(0.6)" }}
        />
      </Sequence>
      {/* tinta navy + brilhos do padrão do Guimas */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(52,86,178,0.5), transparent 55%), radial-gradient(circle at 100% 100%, rgba(92,66,190,0.5), transparent 55%), rgba(12,17,40,0.45)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 300,
            width: LARGURA,
            height: ALTURA,
            borderRadius: 28,
            overflow: "visible",
            border: "2px solid rgba(143,169,230,0.45)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            opacity: entrada,
            scale: String(
              (0.85 + 0.15 * entrada) *
                interpolate(frame, [0, durationInFrames], [1, 1.04]),
            ),
            rotate: `${(1 - entrada) * -4}deg`,
          }}
        >
          <Cantos margem={-22} tamanho={[110, 88]} espessura={4} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 26,
              overflow: "hidden",
            }}
          >
            <Sequence
              name="Maíra 1"
              durationInFrames={duracao1}
              premountFor={fps}
            >
              <TrechoMaira arquivo="maira-1.mp4" trimBefore={inicio1} />
            </Sequence>
            <Sequence
              name="Maíra 2"
              from={duracao1}
              durationInFrames={duracao2}
              premountFor={fps}
            >
              <TrechoMaira arquivo="maira-2.mp4" />
            </Sequence>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
