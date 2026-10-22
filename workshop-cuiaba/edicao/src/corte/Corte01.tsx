import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Assinatura } from "../Assinatura";
import { FILTRO_COR } from "../Clipe";
import { Flash } from "../Flash";
import { CAMERA_CORTE01 } from "./camera-corte01";
import { BarraProgresso, ChamadaFinal, TituloFixo } from "./Elementos";
import { Gancho } from "./Gancho";
import { PalavrasCineticas } from "./PalavrasCineticas";

const VIDEO = 1582; // frames do corte preparado (52,75 s)
const ZOOM_BASE = 1.7;
// punch-ins (frame da palavra, intensidade): a câmera "bate" junto com a palavra forte
const PUNCH: readonly [number, number][] = [
  [98, 0.28], // BANDO (gancho)
  [1020, 0.22], // bando de dados
  [1132, 0.12], // planilha
  [1280, 0.14], // nada pra você
  [1337, 0.16], // realidade
  [1532, 0.14], // planilha que só eu entendo
];

// Câmera virtual: segue o apresentador (rastreio com Apple Vision, suavizado) com zoom
// base 1,7 e "punch-ins" rápidos nas palavras de impacto. Abre já em movimento (2,0 → 1,7).
const useCamera = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps / CAMERA_CORTE01.passo;
  const i = Math.min(CAMERA_CORTE01.x.length - 2, Math.floor(t));
  const f = Math.min(1, t - i);
  const x = CAMERA_CORTE01.x[i] * (1 - f) + CAMERA_CORTE01.x[i + 1] * f;
  const y = CAMERA_CORTE01.y[i] * (1 - f) + CAMERA_CORTE01.y[i + 1] * f;
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

export const Corte01: React.FC = () => {
  const { fps } = useVideoConfig();
  const { z, cx, cy } = useCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      <Sequence name="Vídeo" durationInFrames={VIDEO} premountFor={fps}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile("cortes/corte01.mp4")}
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

      {/* ---------- Gancho: a pergunta logo no 1º segundo */}
      <Sequence name="Gancho" durationInFrames={140} premountFor={fps}>
        <Gancho topo="SUA EMPRESA TEM UM" riscada="BANCO" destaque="BANDO" fim="DE DADOS?" emTopo={0} emRiscada={66} emDestaque={98} emFim={106} />
      </Sequence>
      <Sequence name="Flash gancho" from={98} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.5} />
      </Sequence>
      <Sequence name="Flash entrada" from={130} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.35} />
      </Sequence>

      {/* ---------- Título fixo depois do gancho */}
      <Sequence name="Título fixo" from={140} durationInFrames={VIDEO - 140} premountFor={fps}>
        <TituloFixo etiqueta="IA NA PRÁTICA" linha1="BANCO OU" linha2="BANDO DE DADOS?" />
      </Sequence>

      {/* ---------- Palavras-chave, no tempo da fala */}
      <PalavrasCineticas name="Coloca / tira" from={168} durationInFrames={92} premountFor={fps} linha1="O QUE VOCÊ COLOCA" linha2="DEFINE O QUE TIRA" tamanho1={84} tamanho2={110} atrasoLinha2={1.2} topo={1160} />
      <PalavrasCineticas name="Input / output" from={260} durationInFrames={96} premountFor={fps} linha1="INPUT" linha2="E OUTPUT" tamanho1={150} tamanho2={160} atrasoLinha2={0.55} topo={1140} />
      <PalavrasCineticas name="Prompt / resposta" from={410} durationInFrames={240} premountFor={fps} linha1="MELHOR O PROMPT" linha2="MELHOR A RESPOSTA" tamanho1={96} tamanho2={110} atrasoLinha2={5.9} topo={1160} />
      <PalavrasCineticas name="Dados estruturados" from={695} durationInFrames={250} premountFor={fps} linha1="DADOS" linha2="ESTRUTURADOS" tamanho1={150} tamanho2={140} atrasoLinha2={1.8} topo={1140} />
      <PalavrasCineticas name="Bando de dados" from={1012} durationInFrames={100} premountFor={fps} linha1="UM BANDO" linha2="DE DADOS" tamanho1={140} tamanho2={170} atrasoLinha2={0.75} topo={1140} />
      <PalavrasCineticas name="Planilha" from={1122} durationInFrames={78} premountFor={fps} linha1="A PLANILHA QUE" linha2="SÓ VOCÊ ENTENDE" tamanho1={96} tamanho2={110} atrasoLinha2={0.8} topo={1160} />
      <PalavrasCineticas name="Nada pra você" from={1240} durationInFrames={76} premountFor={fps} linha1="NÃO VAI FAZER" linha2="NADA PRA VOCÊ" tamanho1={100} tamanho2={120} atrasoLinha2={1.3} topo={1160} />
      <PalavrasCineticas name="Realidade" from={1316} durationInFrames={56} premountFor={fps} linha1="ESSA É A" linha2="REALIDADE" tamanho1={110} tamanho2={160} atrasoLinha2={0.7} topo={1140} />
      <PalavrasCineticas name="Só eu entendo" from={1522} durationInFrames={60} premountFor={fps} linha1="A PLANILHA QUE" linha2="SÓ EU ENTENDO" tamanho1={96} tamanho2={120} atrasoLinha2={0.7} topo={1160} />

      <Sequence name="Assinatura" durationInFrames={VIDEO} premountFor={fps}>
        <Assinatura />
      </Sequence>
      <BarraProgresso />

      {/* ---------- Chamada final: devolve a pergunta */}
      <Sequence name="Chamada final" from={VIDEO} premountFor={fps}>
        <ChamadaFinal linha1="E NA SUA EMPRESA?" linha2="BANCO OU BANDO?" acao="COMENTA AQUI E SEGUE" />
      </Sequence>

      {/* trilha bem baixa sob a fala, sobe na chamada final */}
      <Audio
        name="Trilha"
        src={staticFile("cortes/trilha-corte01.wav")}
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
