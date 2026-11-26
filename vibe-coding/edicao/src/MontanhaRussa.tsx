import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import {
  Confete,
  Contador,
  Cronometro,
  Fatura,
  Fechamento,
  Fundo,
  Gancho,
  Hud,
  Impacto,
  Notificacoes,
  Pilha,
  Rebobinar,
  Rotulos,
  Terminal,
  Vibra,
  Vinheta,
  Virada,
} from "./Cenas";
import { ENTRADA_ITENS, T } from "./curva";
import { Mundo } from "./Mundo";
import "./fonte";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Efeito sonoro num quadro do vídeo
const Som: React.FC<{ readonly arquivo: string; readonly em: number; readonly volume?: number }> = ({ arquivo, em, volume = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={em} premountFor={fps} name={arquivo}>
      <Audio src={staticFile(`audio/${arquivo}`)} volume={volume} />
    </Sequence>
  );
};

export const DURACAO = T.fim;

export const MontanhaRussa: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F24" }}>
      <Fundo />
      <Mundo />
      <Vinheta />
      <Confete />
      <Gancho />
      <Rotulos />
      <Terminal />
      <Cronometro />
      <Contador />
      <Vibra />
      <Notificacoes />
      <Fatura />
      <Pilha />
      <Impacto />
      <Rebobinar />
      <Virada />
      <Fechamento />
      <Hud />

      {/* Trilha 1 (Invisible, Anno Domini Beats): a virada da música, no segundo 12, cai no início da queda */}
      <Sequence from={T.subida} durationInFrames={T.virada - T.subida} premountFor={fps} name="trilha-queda">
        <Audio
          src={staticFile("audio/trilha-queda.wav")}
          volume={(f) =>
            interpolate(
              f + T.subida,
              [T.subida, T.subida + 20, T.topo - 8, T.topo + 4, T.queda - 2, T.queda, T.rebobinar, T.rebobinar + 14],
              [0, 1, 1, 0, 0, 0.42, 0.42, 0],
              cl,
            )
          }
        />
      </Sequence>
      {/* Trilha 2 (Scale The Wall, Everet Almond): a virada e o fechamento */}
      <Sequence from={T.virada - 4} premountFor={fps} name="trilha-virada">
        <Audio
          src={staticFile("audio/trilha-virada.wav")}
          volume={(f) => interpolate(f + T.virada - 4, [T.virada - 4, T.virada + 10, T.fim - 30, T.fim], [0, 1, 1, 0], cl)}
        />
      </Sequence>

      {/* Efeitos */}
      <Som arquivo="riser.wav" em={0} volume={0.45} />
      <Som arquivo="whoosh.wav" em={62} volume={0.6} />
      <Sequence from={T.subida + 4} durationInFrames={T.topo - T.subida - 4} premountFor={fps} name="catraca">
        <Audio src={staticFile("audio/catraca.wav")} volume={0.22} />
      </Sequence>
      <Som arquivo="pop.wav" em={100} volume={0.5} />
      <Som arquivo="pop.wav" em={190} volume={0.5} />
      <Som arquivo="sucesso.wav" em={254} volume={0.45} />
      <Som arquivo="sucesso.wav" em={300} volume={0.5} />
      <Som arquivo="vibra.wav" em={400} volume={0.3} />
      <Som arquivo="vibra.wav" em={425} volume={0.3} />
      <Som arquivo="queda.wav" em={T.queda} volume={0.7} />
      <Som arquivo="ding.wav" em={T.queda + 8} volume={0.6} />
      <Som arquivo="whoosh.wav" em={T.chave} volume={0.6} />
      <Som arquivo="ding.wav" em={T.chave + 8} volume={0.6} />
      <Som arquivo="whoosh.wav" em={T.fatura} volume={0.6} />
      <Som arquivo="tiques.wav" em={T.fatura + 12} volume={0.5} />
      <Som arquivo="queda.wav" em={T.chao} volume={0.7} />
      <Som arquivo="impacto.wav" em={797} volume={0.9} />
      <Som arquivo="ding.wav" em={T.chao + 20} volume={0.35} />
      <Som arquivo="ding.wav" em={T.chao + 30} volume={0.35} />
      <Som arquivo="rebobinar.wav" em={T.rebobinar} volume={0.55} />
      <Som arquivo="pop.wav" em={ENTRADA_ITENS[0]} volume={0.6} />
      <Som arquivo="pop.wav" em={ENTRADA_ITENS[1]} volume={0.6} />
      <Som arquivo="pop.wav" em={ENTRADA_ITENS[2]} volume={0.6} />
      <Som arquivo="pop.wav" em={ENTRADA_ITENS[3]} volume={0.6} />
      <Som arquivo="whoosh.wav" em={T.fechamento - 6} volume={0.5} />
    </AbsoluteFill>
  );
};
