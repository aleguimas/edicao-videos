import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Assinatura } from "../Assinatura";
import { FILTRO_COR } from "../Clipe";
import { Flash } from "../Flash";
import { CAMERA_CORTE10 } from "./camera-corte10";
import { BarraProgresso, ChamadaFinal, TituloFixo } from "./Elementos";
import { Gancho } from "./Gancho";
import { PalavrasCineticas } from "./PalavrasCineticas";

const VIDEO = 1557; // frames do corte preparado (51,9 s)
const ZOOM_BASE = 1.7;
// punch-ins (frame da palavra, intensidade): a câmera "bate" junto com a palavra forte
const PUNCH: readonly [number, number][] = [
  [214, 0.28], // TREINAR (gancho)
  [323, 0.14], // desligar
  [503, 0.12], // dados
  [842, 0.14], // estratégia
  [962, 0.16], // puxou
  [1343, 0.14], // três dias
  [1393, 0.12], // recuperar
  [1532, 0.18], // a marca
];

// Câmera virtual: segue o apresentador (rastreio com Apple Vision, suavizado) com zoom
// base 1,7 e "punch-ins" rápidos nas palavras de impacto. Abre já em movimento (2,0 → 1,7).
const useCamera = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const segundos = frame / fps;
  const t = segundos / CAMERA_CORTE10.passo;
  const i = Math.min(CAMERA_CORTE10.x.length - 2, Math.floor(t));
  // se houver uma emenda entre os dois pontos, segura o ponto do lado em que estamos
  const emenda = CAMERA_CORTE10.emendas.find((e) => e > i * CAMERA_CORTE10.passo && e <= (i + 1) * CAMERA_CORTE10.passo);
  const f = emenda === undefined ? Math.min(1, t - i) : segundos < emenda ? 0 : 1;
  const x = CAMERA_CORTE10.x[i] * (1 - f) + CAMERA_CORTE10.x[i + 1] * f;
  const y = CAMERA_CORTE10.y[i] * (1 - f) + CAMERA_CORTE10.y[i + 1] * f;
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

export const Corte10: React.FC = () => {
  const { fps } = useVideoConfig();
  const { z, cx, cy } = useCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      <Sequence name="Vídeo" durationInFrames={VIDEO} premountFor={fps}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile("cortes/corte10.mp4")}
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

      {/* ---------- Gancho: "tudo que você coloca é usado para treinar a ferramenta" */}
      <Sequence name="Gancho" durationInFrames={250} premountFor={fps}>
        <Gancho topo="O QUE VOCÊ COLOCA NA IA" riscada="É SÓ SEU" destaque="TREINA" fim="A FERRAMENTA" emTopo={0} emRiscada={79} emDestaque={214} emFim={226} />
      </Sequence>
      <Sequence name="Flash gancho" from={214} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.5} />
      </Sequence>
      <Sequence name="Flash entrada" from={250} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.35} />
      </Sequence>

      {/* ---------- Título fixo depois do gancho */}
      <Sequence name="Título fixo" from={250} durationInFrames={VIDEO - 250} premountFor={fps}>
        <TituloFixo etiqueta="IA NA PRÁTICA" linha1="O QUE VOCÊ COLOCA" linha2="TREINA A IA" />
      </Sequence>

      {/* ---------- Palavras-chave, no tempo da fala */}
      <PalavrasCineticas name="Desligar" from={305} durationInFrames={60} premountFor={fps} linha1="VOCÊ PODE" linha2="DESLIGAR ISSO" tamanho1={130} tamanho2={140} atrasoLinha2={0.6} topo={1140} />
      <PalavrasCineticas name="Pegar os dados" from={440} durationInFrames={105} premountFor={fps} linha1="QUANDO ALGUÉM VAI" linha2="PEGAR OS DADOS?" tamanho1={96} tamanho2={120} atrasoLinha2={1.6} topo={1150} />
      <PalavrasCineticas name="Mundo inteiro" from={645} durationInFrames={70} premountFor={fps} linha1="É O MUNDO" linha2="INTEIRO USANDO" tamanho1={130} tamanho2={130} atrasoLinha2={0.7} topo={1140} />
      <PalavrasCineticas name="Sua estratégia" from={790} durationInFrames={105} premountFor={fps} linha1="A SUA" linha2="ESTRATÉGIA" tamanho1={140} tamanho2={170} atrasoLinha2={1.73} topo={1130} />
      <PalavrasCineticas name="Puxou de alguém" from={910} durationInFrames={150} premountFor={fps} linha1="A IA INVENTOU" linha2="OU PUXOU DE ALGUÉM?" tamanho1={110} tamanho2={110} atrasoLinha2={1.73} topo={1150} />
      <PalavrasCineticas name="Equipe" from={1095} durationInFrames={60} premountFor={fps} linha1="TRABALHO" linha2="COM A EQUIPE" tamanho1={140} tamanho2={140} atrasoLinha2={0.47} topo={1140} />
      <PalavrasCineticas name="Três dias" from={1275} durationInFrames={90} premountFor={fps} linha1="ACELERAR EM" linha2="TRÊS DIAS" tamanho1={120} tamanho2={180} atrasoLinha2={2.27} topo={1130} />
      <PalavrasCineticas name="Meses para recuperar" from={1370} durationInFrames={95} premountFor={fps} linha1="MESES PARA" linha2="RECUPERAR" tamanho1={130} tamanho2={170} atrasoLinha2={0.77} topo={1130} />
      <PalavrasCineticas name="Sua empresa" from={1465} durationInFrames={92} premountFor={fps} linha1="O NOME DA" linha2="SUA EMPRESA" tamanho1={130} tamanho2={150} atrasoLinha2={0.57} topo={1140} />

      <Sequence name="Assinatura" durationInFrames={VIDEO} premountFor={fps}>
        <Assinatura />
      </Sequence>
      <BarraProgresso />

      {/* ---------- Chamada final: devolve a pergunta */}
      <Sequence name="Chamada final" from={VIDEO} premountFor={fps}>
        <ChamadaFinal linha1="E NA SUA EMPRESA?" linha2="JÁ DESLIGOU O TREINO?" acao="COMENTA AQUI E SEGUE" />
      </Sequence>

      {/* trilha bem baixa sob a fala, sobe na chamada final */}
      <Audio
        name="Trilha"
        src={staticFile("cortes/trilha-corte10.wav")}
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
