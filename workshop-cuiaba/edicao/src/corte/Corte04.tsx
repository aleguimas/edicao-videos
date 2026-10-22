import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Assinatura } from "../Assinatura";
import { FILTRO_COR } from "../Clipe";
import { Flash } from "../Flash";
import { CAMERA_CORTE04 } from "./camera-corte04";
import { BarraProgresso, ChamadaFinal, TituloFixo } from "./Elementos";
import { Gancho } from "./Gancho";
import { PalavrasCineticas } from "./PalavrasCineticas";

const VIDEO = 1330; // frames do corte preparado (44,35 s)
const ZOOM_BASE = 1.7;
// punch-ins (frame da palavra, intensidade): a câmera "bate" junto com a palavra forte
const PUNCH: readonly [number, number][] = [
  [73, 0.18], // erra mesmo (gancho)
  [130, 0.28], // VALENDO (gancho)
  [387, 0.12], // pode errar
  [505, 0.16], // achando que está certo
  [749, 0.18], // estagiário
  [1124, 0.12], // acompanha
  [1178, 0.16], // dê uma função
  [1327, 0.18], // vai dar ruim
];

// Câmera virtual: segue o apresentador (rastreio com Apple Vision, suavizado) com zoom
// base 1,7 e "punch-ins" rápidos nas palavras de impacto. Abre já em movimento (2,0 → 1,7).
const useCamera = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const segundos = frame / fps;
  const t = segundos / CAMERA_CORTE04.passo;
  const i = Math.min(CAMERA_CORTE04.x.length - 2, Math.floor(t));
  // se houver uma emenda entre os dois pontos, segura o ponto do lado em que estamos
  const emenda = CAMERA_CORTE04.emendas.find((e) => e > i * CAMERA_CORTE04.passo && e <= (i + 1) * CAMERA_CORTE04.passo);
  const f = emenda === undefined ? Math.min(1, t - i) : segundos < emenda ? 0 : 1;
  const x = CAMERA_CORTE04.x[i] * (1 - f) + CAMERA_CORTE04.x[i + 1] * f;
  const y = CAMERA_CORTE04.y[i] * (1 - f) + CAMERA_CORTE04.y[i + 1] * f;
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

export const Corte04: React.FC = () => {
  const { fps } = useVideoConfig();
  const { z, cx, cy } = useCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      <Sequence name="Vídeo" durationInFrames={VIDEO} premountFor={fps}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile("cortes/corte04.mp4")}
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

      {/* ---------- Gancho: "não é que ele pode… ele erra valendo" logo no 1º segundo */}
      <Sequence name="Gancho" durationInFrames={150} premountFor={fps}>
        <Gancho topo="NÃO É QUE A IA" riscada="PODE" destaque="ERRA" fim="VALENDO" emTopo={0} emRiscada={22} emDestaque={73} emFim={130} />
      </Sequence>
      <Sequence name="Flash gancho" from={130} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.5} />
      </Sequence>
      <Sequence name="Flash entrada" from={150} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.35} />
      </Sequence>

      {/* ---------- Título fixo depois do gancho */}
      <Sequence name="Título fixo" from={150} durationInFrames={VIDEO - 150} premountFor={fps}>
        <TituloFixo etiqueta="IA NA PRÁTICA" linha1="A IA ERRA VALENDO," linha2="VOCÊ VALIDA" />
      </Sequence>

      {/* ---------- Palavras-chave, no tempo da fala */}
      <PalavrasCineticas name="Pode errar" from={335} durationInFrames={70} premountFor={fps} linha1="FERRAMENTA QUE" linha2="PODE ERRAR" tamanho1={100} tamanho2={140} atrasoLinha2={1.53} topo={1160} />
      <PalavrasCineticas name="Achando que está certo" from={435} durationInFrames={85} premountFor={fps} linha1="ERRA VALENDO" linha2="ACHANDO QUE ESTÁ CERTO" tamanho1={110} tamanho2={96} atrasoLinha2={1.5} topo={1160} />
      <PalavrasCineticas name="Validar" from={525} durationInFrames={128} premountFor={fps} linha1="VOCÊ TEM QUE" linha2="VALIDAR" tamanho1={110} tamanho2={180} atrasoLinha2={2.67} topo={1140} />
      <PalavrasCineticas name="Estagiário" from={686} durationInFrames={120} premountFor={fps} linha1="A IA É UM" linha2="ESTAGIÁRIO" tamanho1={120} tamanho2={150} atrasoLinha2={2.1} topo={1140} />
      <PalavrasCineticas name="Excelente estagiário" from={810} durationInFrames={60} premountFor={fps} linha1="UM EXCELENTE" linha2="ESTAGIÁRIO" tamanho1={110} tamanho2={150} atrasoLinha2={0.8} topo={1140} />
      <PalavrasCineticas name="Ensina, treina" from={955} durationInFrames={120} premountFor={fps} linha1="ENSINA," linha2="TREINA" tamanho1={140} tamanho2={190} atrasoLinha2={0.93} topo={1130} />
      <PalavrasCineticas name="Acompanha" from={1080} durationInFrames={70} premountFor={fps} linha1="VOCÊ" linha2="ACOMPANHA" tamanho1={130} tamanho2={160} atrasoLinha2={1.47} topo={1140} />
      <PalavrasCineticas name="Dê uma função" from={1150} durationInFrames={50} premountFor={fps} linha1="DÊ UMA" linha2="FUNÇÃO" tamanho1={140} tamanho2={190} atrasoLinha2={0.93} topo={1130} />
      <PalavrasCineticas name="Vai dar ruim" from={1210} durationInFrames={120} premountFor={fps} linha1="MAIS DE UMA FUNÇÃO" linha2="VAI DAR RUIM" tamanho1={90} tamanho2={140} atrasoLinha2={3.5} topo={1150} />

      <Sequence name="Assinatura" durationInFrames={VIDEO} premountFor={fps}>
        <Assinatura />
      </Sequence>
      <BarraProgresso />

      {/* ---------- Chamada final: devolve a pergunta */}
      <Sequence name="Chamada final" from={VIDEO} premountFor={fps}>
        <ChamadaFinal linha1="E NA SUA EMPRESA?" linha2="QUEM VALIDA A IA?" acao="COMENTA AQUI E SEGUE" />
      </Sequence>

      {/* trilha bem baixa sob a fala, sobe na chamada final */}
      <Audio
        name="Trilha"
        src={staticFile("cortes/trilha-corte04.wav")}
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
