import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Assinatura } from "../Assinatura";
import { FILTRO_COR } from "../Clipe";
import { Flash } from "../Flash";
import { CAMERA_CORTE07 } from "./camera-corte07";
import { BarraProgresso, ChamadaFinal, TituloFixo } from "./Elementos";
import { Gancho } from "./Gancho";
import { PalavrasCineticas } from "./PalavrasCineticas";

const VIDEO = 1425; // frames do corte preparado (47,5 s)
const ZOOM_BASE = 1.7;
// punch-ins (frame da palavra, intensidade): a câmera "bate" junto com a palavra forte
const PUNCH: readonly [number, number][] = [
  [41, 0.28], // VERMELHO (gancho)
  [88, 0.16], // não entra
  [167, 0.14], // CPF
  [301, 0.12], // copia e cola
  [523, 0.14], // semáforo
  [848, 0.12], // amarelo
  [1058, 0.12], // ambiente seguro
  [1403, 0.18], // pare e pergunte
];

// Câmera virtual: segue o apresentador (rastreio com Apple Vision, suavizado) com zoom
// base 1,7 e "punch-ins" rápidos nas palavras de impacto. Abre já em movimento (2,0 → 1,7).
const useCamera = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const segundos = frame / fps;
  const t = segundos / CAMERA_CORTE07.passo;
  const i = Math.min(CAMERA_CORTE07.x.length - 2, Math.floor(t));
  // se houver uma emenda entre os dois pontos, segura o ponto do lado em que estamos
  const emenda = CAMERA_CORTE07.emendas.find((e) => e > i * CAMERA_CORTE07.passo && e <= (i + 1) * CAMERA_CORTE07.passo);
  const f = emenda === undefined ? Math.min(1, t - i) : segundos < emenda ? 0 : 1;
  const x = CAMERA_CORTE07.x[i] * (1 - f) + CAMERA_CORTE07.x[i + 1] * f;
  const y = CAMERA_CORTE07.y[i] * (1 - f) + CAMERA_CORTE07.y[i + 1] * f;
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

export const Corte07: React.FC = () => {
  const { fps } = useVideoConfig();
  const { z, cx, cy } = useCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      <Sequence name="Vídeo" durationInFrames={VIDEO} premountFor={fps}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          <Video
            src={staticFile("cortes/corte07.mp4")}
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

      {/* ---------- Gancho: "e o nunca, vermelho: não entra" logo no 1º segundo */}
      <Sequence name="Gancho" durationInFrames={106} premountFor={fps}>
        <Gancho topo="NA IA, O SINAL NÃO É" riscada="VERDE" destaque="VERMELHO" fim="NÃO ENTRA" emTopo={0} emRiscada={16} emDestaque={41} emFim={88} />
      </Sequence>
      <Sequence name="Flash gancho" from={41} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.5} />
      </Sequence>
      <Sequence name="Flash entrada" from={222} durationInFrames={6} premountFor={fps}>
        <Flash intensidade={0.35} />
      </Sequence>
      <PalavrasCineticas name="Senhas, CPF" from={108} durationInFrames={110} premountFor={fps} linha1="SENHAS, DADOS BANCÁRIOS" linha2="CPF" tamanho1={80} tamanho2={220} atrasoLinha2={1.97} topo={1120} />

      {/* ---------- Título fixo depois do gancho */}
      <Sequence name="Título fixo" from={222} durationInFrames={VIDEO - 222} premountFor={fps}>
        <TituloFixo etiqueta="IA NA PRÁTICA" linha1="O SEMÁFORO" linha2="DA IA" />
      </Sequence>

      {/* ---------- Palavras-chave, no tempo da fala */}
      <PalavrasCineticas name="Copia e cola" from={270} durationInFrames={125} premountFor={fps} linha1="CUIDADO COM O" linha2="COPIA E COLA" tamanho1={110} tamanho2={140} atrasoLinha2={1.03} topo={1150} />
      <PalavrasCineticas name="Semáforo" from={515} durationInFrames={70} premountFor={fps} linha1="O SEMÁFORO" linha2="DA IA" tamanho1={120} tamanho2={190} atrasoLinha2={0.73} topo={1130} />
      <PalavrasCineticas name="Uso livre" from={585} durationInFrames={40} premountFor={fps} linha1="PODE," linha2="USO LIVRE" tamanho1={140} tamanho2={170} atrasoLinha2={0.53} topo={1130} />
      <PalavrasCineticas name="Texto público" from={625} durationInFrames={210} premountFor={fps} linha1="TEXTO PÚBLICO," linha2="IDEIAS, RASCUNHOS" tamanho1={110} tamanho2={120} atrasoLinha2={1.13} topo={1150} />
      <PalavrasCineticas name="Amarelo" from={835} durationInFrames={55} premountFor={fps} linha1="SINAL AMARELO," linha2="CUIDADO" tamanho1={110} tamanho2={180} atrasoLinha2={1.1} topo={1130} />
      <PalavrasCineticas name="Sem identificar pessoas" from={890} durationInFrames={80} premountFor={fps} linha1="DADOS DA EMPRESA" linha2="SEM IDENTIFICAR PESSOAS" tamanho1={100} tamanho2={90} atrasoLinha2={1.27} topo={1150} />
      <PalavrasCineticas name="Ambiente seguro" from={975} durationInFrames={100} premountFor={fps} linha1="SÓ COM" linha2="AMBIENTE SEGURO" tamanho1={130} tamanho2={130} atrasoLinha2={1.93} topo={1140} />
      <PalavrasCineticas name="Conta corporativa" from={1075} durationInFrames={75} premountFor={fps} linha1="CONTA" linha2="CORPORATIVA" tamanho1={140} tamanho2={160} atrasoLinha2={0.27} topo={1140} />
      <PalavrasCineticas name="Pare e pergunte" from={1365} durationInFrames={60} premountFor={fps} linha1="NA DÚVIDA," linha2="PARE E PERGUNTE" tamanho1={120} tamanho2={130} atrasoLinha2={1.27} topo={1140} />

      <Sequence name="Assinatura" durationInFrames={VIDEO} premountFor={fps}>
        <Assinatura />
      </Sequence>
      <BarraProgresso />

      {/* ---------- Chamada final: devolve a pergunta */}
      <Sequence name="Chamada final" from={VIDEO} premountFor={fps}>
        <ChamadaFinal linha1="E NA SUA EMPRESA?" linha2="QUAL É O SINAL?" acao="COMENTA AQUI E SEGUE" />
      </Sequence>

      {/* trilha bem baixa sob a fala, sobe na chamada final */}
      <Audio
        name="Trilha"
        src={staticFile("cortes/trilha-corte07.wav")}
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
