import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Assinatura } from "../Assinatura";
import { FILTRO_COR } from "../Clipe";
import { Flash } from "../Flash";
import { CAMERA_CORTE03 } from "./camera-corte03";
import { BarraProgresso, ChamadaFinal, TituloFixo } from "./Elementos";
import { Gancho } from "./Gancho";
import { PalavrasCineticas } from "./PalavrasCineticas";

const VIDEO = 1359; // frames do corte preparado (45,3 s)
const ZOOM_BASE = 1.7;
// punch-ins (frame da palavra, intensidade): a câmera "bate" junto com a palavra forte
const PUNCH: readonly [number, number][] = [
  [39, 0.16], // humano (gancho)
  [68, 0.28], // ROBOTIZADO (gancho)
  [586, 0.12], // a mesma coisa
  [728, 0.14], // automação
  [1107, 0.18], // como um robô
  [1225, 0.14], // sem uso
  [1330, 0.16], // tempo enorme
];

// Câmera virtual: segue o apresentador (rastreio com Apple Vision, suavizado) com zoom
// base 1,7 e "punch-ins" rápidos nas palavras de impacto. Abre já em movimento (2,0 → 1,7).
const useCamera = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps / CAMERA_CORTE03.passo;
  const i = Math.min(CAMERA_CORTE03.x.length - 2, Math.floor(t));
  const f = Math.min(1, t - i);
  const x = CAMERA_CORTE03.x[i] * (1 - f) + CAMERA_CORTE03.x[i + 1] * f;
  const y = CAMERA_CORTE03.y[i] * (1 - f) + CAMERA_CORTE03.y[i + 1] * f;
  const abertura = interpolate(frame, [0, 1.2 * fps], [0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const punch = PUNCH.reduce(
    (s, [pf, k]) => s + interpolate(frame, [pf - 2, pf + 3, pf + 0.7 * fps], [0, k, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    0,
  );
  const z = ZOOM_BASE + abertura + punch;
  const cx = Math.min(1080 - 540 / z, Math.max(540 / z, x));
  const cy = Math.min(1920 - 960 / z, Math.max(960 / z, y));
  return { z, cx, cy };
};

export const Corte03: React.FC = () => {
  const { fps } = useVideoConfig();
  const { z, cx, cy } = useCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      <Sequence name="Vídeo" durationInFrames={VIDEO} premountFor={fps}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile("cortes/corte03.mp4")}
            style={{
              position: "absolute",
              width: 1080,
              height: 1920,
              scale: String(z),
              translate: `${z * (540 - cx)}px ${z * (960 - cy)}px`,
              filter: FILTRO_COR,
            }}
          />
          {/* topo e base levemente escurecidos para título e palavras */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(12,17,40,0.55) 0%, transparent 22%, transparent 55%, rgba(12,17,40,0.5) 100%)",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ---------- Gancho: "muito humano robotizado" logo no 1º segundo */}
      <Sequence name="Gancho" durationInFrames={118} premountFor={fps}>
        <Gancho topo="NAS EMPRESAS TEM MUITO" riscada="ROBÔ" destaque="HUMANO" fim="ROBOTIZADO" emTopo={0} emRiscada={20} emDestaque={39} emFim={68} />
      </Sequence>
      <Sequence name="Flash gancho" from={68} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.5} />
      </Sequence>
      <Sequence name="Flash entrada" from={118} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.35} />
      </Sequence>

      {/* ---------- Título fixo depois do gancho */}
      <Sequence name="Título fixo" from={118} durationInFrames={VIDEO - 118} premountFor={fps}>
        <TituloFixo etiqueta="IA NA PRÁTICA" linha1="ROBÔ SEM USO," linha2="HUMANO ROBOTIZADO" />
      </Sequence>

      {/* ---------- Palavras-chave, no tempo da fala */}
      <PalavrasCineticas name="Apoiado pela IA" from={165} durationInFrames={95} premountFor={fps} linha1="O SER HUMANO" linha2="APOIADO PELA IA" tamanho1={100} tamanho2={120} atrasoLinha2={1.37} topo={1160} />
      <PalavrasCineticas name="Gerenciar o negócio" from={360} durationInFrames={68} premountFor={fps} linha1="GERENCIAR" linha2="O MEU NEGÓCIO" tamanho1={130} tamanho2={130} atrasoLinha2={0.57} topo={1160} />
      <PalavrasCineticas name="Rotina" from={458} durationInFrames={70} premountFor={fps} linha1="AQUELA ROTINA" linha2="DO DIA A DIA" tamanho1={110} tamanho2={130} atrasoLinha2={0.93} topo={1160} />
      <PalavrasCineticas name="Mesma coisa" from={550} durationInFrames={100} premountFor={fps} linha1="TODA VEZ É" linha2="A MESMA COISA" tamanho1={120} tamanho2={130} atrasoLinha2={0.63} topo={1160} />
      <PalavrasCineticas name="É automação" from={662} durationInFrames={100} premountFor={fps} linha1="NÃO É NEM INTELIGÊNCIA" linha2="É UMA AUTOMAÇÃO" tamanho1={80} tamanho2={110} atrasoLinha2={1.5} topo={1160} />
      <PalavrasCineticas name="Clico aqui" from={890} durationInFrames={88} premountFor={fps} linha1="EU CLICO AQUI" linha2="PEGO AQUI, FAÇO ISSO" tamanho1={110} tamanho2={100} atrasoLinha2={1.23} topo={1160} />
      <PalavrasCineticas name="Isso é automação" from={980} durationInFrames={62} premountFor={fps} linha1="ISSO É UMA" linha2="AUTOMAÇÃO" tamanho1={120} tamanho2={170} atrasoLinha2={0.4} topo={1140} />
      <PalavrasCineticas name="Como um robô" from={1060} durationInFrames={70} premountFor={fps} linha1="POR QUE TRABALHAR" linha2="COMO UM ROBÔ?" tamanho1={96} tamanho2={130} atrasoLinha2={1.13} topo={1160} />
      <PalavrasCineticas name="Sem uso" from={1162} durationInFrames={100} premountFor={fps} linha1="O ROBÔ AUTOMAÇÃO" linha2="TÁ SEM USO" tamanho1={96} tamanho2={150} atrasoLinha2={1.53} topo={1150} />
      <PalavrasCineticas name="Tempo enorme" from={1305} durationInFrames={54} premountFor={fps} linha1="UM TEMPO" linha2="ENORME" tamanho1={130} tamanho2={200} atrasoLinha2={0.83} topo={1130} />

      <Sequence name="Assinatura" durationInFrames={VIDEO} premountFor={fps}>
        <Assinatura />
      </Sequence>
      <BarraProgresso />

      {/* ---------- Chamada final: devolve a pergunta */}
      <Sequence name="Chamada final" from={VIDEO} premountFor={fps}>
        <ChamadaFinal linha1="E NA SUA EMPRESA?" linha2="QUAL TAREFA É DE ROBÔ?" acao="COMENTA AQUI E SEGUE" />
      </Sequence>

      {/* trilha bem baixa sob a fala, sobe na chamada final */}
      <Audio
        name="Trilha"
        src={staticFile("cortes/trilha-corte03.wav")}
        premountFor={fps}
        volume={(f) =>
          interpolate(f, [0, VIDEO - 8, VIDEO + 6, VIDEO + 50, VIDEO + 75], [0.12, 0.12, 0.6, 0.6, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};
