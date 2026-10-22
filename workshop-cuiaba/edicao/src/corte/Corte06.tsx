import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Assinatura } from "../Assinatura";
import { FILTRO_COR } from "../Clipe";
import { Flash } from "../Flash";
import { CAMERA_CORTE06 } from "./camera-corte06";
import { BarraProgresso, ChamadaFinal, TituloFixo } from "./Elementos";
import { Gancho } from "./Gancho";
import { PalavrasCineticas } from "./PalavrasCineticas";

const VIDEO = 1677; // frames do corte preparado (55,9 s)
const ZOOM_BASE = 1.7;
// punch-ins (frame da palavra, intensidade): a câmera "bate" junto com a palavra forte
const PUNCH: readonly [number, number][] = [
  [97, 0.28], // FREIO (gancho)
  [151, 0.14], // pior coisa
  [379, 0.12], // curva
  [533, 0.12], // melhor motor
  [770, 0.16], // o freio já foi
  [952, 0.12], // frear
  [1237, 0.16], // Ferrari
  [1505, 0.12], // configurar
  [1661, 0.2], // sair do lugar
];

// Câmera virtual: segue o apresentador (rastreio com Apple Vision, suavizado) com zoom
// base 1,7 e "punch-ins" rápidos nas palavras de impacto. Abre já em movimento (2,0 → 1,7).
const useCamera = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const segundos = frame / fps;
  const t = segundos / CAMERA_CORTE06.passo;
  const i = Math.min(CAMERA_CORTE06.x.length - 2, Math.floor(t));
  // se houver uma emenda entre os dois pontos, segura o ponto do lado em que estamos
  const emenda = CAMERA_CORTE06.emendas.find((e) => e > i * CAMERA_CORTE06.passo && e <= (i + 1) * CAMERA_CORTE06.passo);
  const f = emenda === undefined ? Math.min(1, t - i) : segundos < emenda ? 0 : 1;
  const x = CAMERA_CORTE06.x[i] * (1 - f) + CAMERA_CORTE06.x[i + 1] * f;
  const y = CAMERA_CORTE06.y[i] * (1 - f) + CAMERA_CORTE06.y[i + 1] * f;
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

export const Corte06: React.FC = () => {
  const { fps } = useVideoConfig();
  const { z, cx, cy } = useCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      <Sequence name="Vídeo" durationInFrames={VIDEO} premountFor={fps}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile("cortes/corte06.mp4")}
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

      {/* ---------- Gancho: "o melhor motor… mas também o melhor freio" logo no 1º segundo */}
      <Sequence name="Gancho" durationInFrames={150} premountFor={fps}>
        <Gancho topo="NÃO É SÓ O MELHOR" riscada="MOTOR" destaque="FREIO" fim="TAMBÉM GANHA CORRIDA" emTopo={0} emRiscada={32} emDestaque={97} emFim={102} />
      </Sequence>
      <Sequence name="Flash gancho" from={97} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.5} />
      </Sequence>
      <Sequence name="Flash entrada" from={150} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.35} />
      </Sequence>

      {/* ---------- Título fixo depois do gancho */}
      <Sequence name="Título fixo" from={150} durationInFrames={VIDEO - 150} premountFor={fps}>
        <TituloFixo etiqueta="IA NA PRÁTICA" linha1="MELHOR MOTOR" linha2="+ MELHOR FREIO" />
      </Sequence>

      {/* ---------- Palavras-chave, no tempo da fala */}
      <PalavrasCineticas name="Pior coisa" from={150} durationInFrames={45} premountFor={fps} linha1="FREAR É A" linha2="PIOR COISA" tamanho1={120} tamanho2={150} atrasoLinha2={0.05} topo={1150} />
      <PalavrasCineticas name="Reduzir a velocidade" from={240} durationInFrames={60} premountFor={fps} linha1="REDUZIR A" linha2="VELOCIDADE" tamanho1={120} tamanho2={150} atrasoLinha2={1.23} topo={1150} />
      <PalavrasCineticas name="Acelerar depois da curva" from={325} durationInFrames={85} premountFor={fps} linha1="ACELERAR DEPOIS" linha2="DA CURVA" tamanho1={100} tamanho2={170} atrasoLinha2={1.63} topo={1140} />
      <PalavrasCineticas name="Mesma coisa com a IA" from={410} durationInFrames={35} premountFor={fps} linha1="É A MESMA COISA" linha2="COM A IA" tamanho1={100} tamanho2={150} atrasoLinha2={0.67} topo={1150} />
      <PalavrasCineticas name="Melhor motor" from={447} durationInFrames={133} premountFor={fps} linha1="NÃO É O MELHOR" linha2="MOTOR" tamanho1={110} tamanho2={200} atrasoLinha2={2.87} topo={1130} />
      <PalavrasCineticas name="Conjunto" from={668} durationInFrames={37} premountFor={fps} linha1="É UM" linha2="CONJUNTO" tamanho1={130} tamanho2={180} atrasoLinha2={0.67} topo={1130} />
      <PalavrasCineticas name="Freio já foi" from={745} durationInFrames={100} premountFor={fps} linha1="PERDE PORQUE" linha2="O FREIO JÁ FOI" tamanho1={110} tamanho2={130} atrasoLinha2={0.63} topo={1150} />
      <PalavrasCineticas name="Momento certo" from={925} durationInFrames={60} premountFor={fps} linha1="O MOMENTO CERTO" linha2="DE FREAR" tamanho1={100} tamanho2={170} atrasoLinha2={0.7} topo={1140} />
      <PalavrasCineticas name="Freio muito bom" from={990} durationInFrames={85} premountFor={fps} linha1="O FREIO TEM QUE" linha2="SER MUITO BOM" tamanho1={100} tamanho2={130} atrasoLinha2={0.53} topo={1150} />
      <PalavrasCineticas name="Fusquinha ou Ferrari" from={1195} durationInFrames={60} premountFor={fps} linha1="FUSQUINHA" linha2="OU FERRARI?" tamanho1={140} tamanho2={150} atrasoLinha2={1.1} topo={1140} />
      <PalavrasCineticas name="Pilotar a Ferrari" from={1262} durationInFrames={100} premountFor={fps} linha1="VOCÊ SABE" linha2="PILOTAR A FERRARI?" tamanho1={120} tamanho2={110} atrasoLinha2={0.47} topo={1150} />
      <PalavrasCineticas name="Configurar" from={1455} durationInFrames={140} premountFor={fps} linha1="VOCÊ SABE" linha2="CONFIGURAR?" tamanho1={120} tamanho2={150} atrasoLinha2={1.67} topo={1140} />
      <PalavrasCineticas name="Sair do lugar" from={1640} durationInFrames={37} premountFor={fps} linha1="PODE NEM" linha2="SAIR DO LUGAR" tamanho1={130} tamanho2={140} atrasoLinha2={0.7} topo={1140} />

      <Sequence name="Assinatura" durationInFrames={VIDEO} premountFor={fps}>
        <Assinatura />
      </Sequence>
      <BarraProgresso />

      {/* ---------- Chamada final: devolve a pergunta */}
      <Sequence name="Chamada final" from={VIDEO} premountFor={fps}>
        <ChamadaFinal linha1="E NA SUA EMPRESA?" linha2="A IA TEM FREIO?" acao="COMENTA AQUI E SEGUE" />
      </Sequence>

      {/* trilha bem baixa sob a fala, sobe na chamada final */}
      <Audio
        name="Trilha"
        src={staticFile("cortes/trilha-corte06.wav")}
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
