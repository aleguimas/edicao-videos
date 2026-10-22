import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Assinatura } from "../Assinatura";
import { FILTRO_COR } from "../Clipe";
import { Flash } from "../Flash";
import { CAMERA_CORTE02 } from "./camera-corte02";
import { BarraProgresso, ChamadaFinal, TituloFixo } from "./Elementos";
import { Gancho } from "./Gancho";
import { PalavrasCineticas } from "./PalavrasCineticas";

const VIDEO = 1375; // frames do corte preparado (45,85 s)
const ZOOM_BASE = 1.7;
// punch-ins (frame da palavra, intensidade): a câmera "bate" junto com a palavra forte
const PUNCH: readonly [number, number][] = [
  [112, 0.28], // CHUTE (gancho)
  [599, 0.14], // não vai ser certa
  [800, 0.12], // seis meses
  [920, 0.14], // cinco anos
  [1021, 0.16], // gigantesca
  [1247, 0.2], // vai dar ruim
  [1319, 0.14], // ruim no final das contas
];

// Câmera virtual: segue o apresentador (rastreio com Apple Vision, suavizado) com zoom
// base 1,7 e "punch-ins" rápidos nas palavras de impacto. Abre já em movimento (2,0 → 1,7).
const useCamera = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps / CAMERA_CORTE02.passo;
  const i = Math.min(CAMERA_CORTE02.x.length - 2, Math.floor(t));
  const f = Math.min(1, t - i);
  const x = CAMERA_CORTE02.x[i] * (1 - f) + CAMERA_CORTE02.x[i + 1] * f;
  const y = CAMERA_CORTE02.y[i] * (1 - f) + CAMERA_CORTE02.y[i + 1] * f;
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

export const Corte02: React.FC = () => {
  const { fps } = useVideoConfig();
  const { z, cx, cy } = useCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      <Sequence name="Vídeo" durationInFrames={VIDEO} premountFor={fps}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile("cortes/corte02.mp4")}
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

      {/* ---------- Gancho: a pergunta + "chute muito bem escrito" logo no 1º segundo */}
      <Sequence name="Gancho" durationInFrames={170} premountFor={fps}>
        <Gancho topo="QUANTO VOU VENDER EM NOVEMBRO?" riscada="PREVISÃO" destaque="CHUTE" fim="MUITO BEM ESCRITO" emTopo={0} emRiscada={82} emDestaque={112} emFim={129} />
      </Sequence>
      <Sequence name="Flash gancho" from={112} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.5} />
      </Sequence>
      <Sequence name="Flash entrada" from={168} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.35} />
      </Sequence>

      {/* ---------- Título fixo depois do gancho */}
      <Sequence name="Título fixo" from={170} durationInFrames={VIDEO - 170} premountFor={fps}>
        <TituloFixo etiqueta="IA NA PRÁTICA" linha1="UMA CRIA," linha2="A OUTRA CALCULA" />
      </Sequence>

      {/* ---------- Palavras-chave, no tempo da fala */}
      <PalavrasCineticas name="Criar / calcular" from={172} durationInFrames={88} premountFor={fps} linha1="UMA VAI CRIAR" linha2="A OUTRA VAI CALCULAR" tamanho1={100} tamanho2={96} atrasoLinha2={0.97} topo={1160} />
      <PalavrasCineticas name="Planilha de vendas" from={280} durationInFrames={90} premountFor={fps} linha1="A PLANILHA COM" linha2="SUAS VENDAS" tamanho1={96} tamanho2={130} atrasoLinha2={0.93} topo={1160} />
      <PalavrasCineticas name="Novembro" from={392} durationInFrames={70} premountFor={fps} linha1="QUANTO VOU VENDER" linha2="EM NOVEMBRO?" tamanho1={90} tamanho2={120} atrasoLinha2={0.8} topo={1160} />
      <PalavrasCineticas name="Não vai ser certa" from={555} durationInFrames={62} premountFor={fps} linha1="MAS ESSA INFORMAÇÃO" linha2="NÃO VAI SER CERTA" tamanho1={84} tamanho2={110} atrasoLinha2={0.83} topo={1160} />
      <PalavrasCineticas name="Seis meses" from={708} durationInFrames={125} premountFor={fps} linha1="NÃO É UMA BASE" linha2="DE SEIS MESES" tamanho1={100} tamanho2={130} atrasoLinha2={3.07} topo={1160} />
      <PalavrasCineticas name="Cinco anos" from={900} durationInFrames={50} premountFor={fps} linha1="UMA BASE DE" linha2="CINCO ANOS" tamanho1={110} tamanho2={160} atrasoLinha2={0.67} topo={1140} />
      <PalavrasCineticas name="Gigantesca" from={995} durationInFrames={60} premountFor={fps} linha1="A MASSA DE DADOS" linha2="É GIGANTESCA" tamanho1={96} tamanho2={140} atrasoLinha2={0.7} topo={1160} />
      <PalavrasCineticas name="Papel de análise" from={1185} durationInFrames={47} premountFor={fps} linha1="O SEU PAPEL DE" linha2="ANÁLISE" tamanho1={100} tamanho2={170} atrasoLinha2={0.67} topo={1140} />
      <PalavrasCineticas name="Vai dar ruim" from={1234} durationInFrames={136} premountFor={fps} linha1="VAI DAR" linha2="RUIM" tamanho1={130} tamanho2={230} atrasoLinha2={0.43} topo={1120} />

      <Sequence name="Assinatura" durationInFrames={VIDEO} premountFor={fps}>
        <Assinatura />
      </Sequence>
      <BarraProgresso />

      {/* ---------- Chamada final: devolve a pergunta */}
      <Sequence name="Chamada final" from={VIDEO} premountFor={fps}>
        <ChamadaFinal linha1="E NA SUA EMPRESA?" linha2="PREVISÃO OU CHUTE?" acao="COMENTA AQUI E SEGUE" />
      </Sequence>

      {/* trilha bem baixa sob a fala, sobe na chamada final */}
      <Audio
        name="Trilha"
        src={staticFile("cortes/trilha-corte02.wav")}
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
