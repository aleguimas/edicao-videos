import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Assinatura } from "../Assinatura";
import { Flash } from "../Flash";
import { BarraProgresso, ChamadaFinal } from "../corte/Elementos";
import { Gancho } from "../corte/Gancho";
import { PalavrasCineticas } from "../corte/PalavrasCineticas";
import { Apoio, Capitulo, FILTRO_VISITA, FotoGrupo, Numero, TarjaRealizacao, Vinheta } from "./Elementos";

const FPS = 30;

// ---------- Roteiro: trechos das falas (segundos no arquivo preparado), na ordem do vídeo.
// O gancho é a frase mais forte da fala 02 e não se repete depois.
const TRECHOS = {
  gancho: { arq: "fala02", ini: 13.75, fim: 19.9 }, // apesar de toda a automação, a empresa só fez crescer em número de colaboradores
  a: { arq: "fala01", ini: 1.0, fim: 86.6 }, // Estive visitando aqui a Tramontina hoje […] quando tem uma manutenção ali dentro.
  b: { arq: "fala02", ini: 3.2, fim: 9.9 }, // Desde 2006 […] Então, não é nada novo.
  c: { arq: "fala02", ini: 20.6, fim: 30.9 }, // Esse mês agora, eles estão chegando a mil colaboradores […] muito bacana, né?
  d: { arq: "fala01", ini: 87.7, fim: 143.6 }, // Muito bacana, empresa brasileira […] e está dando certo.
} as const;
type Id = keyof typeof TRECHOS;

const VINHETA = 75;
const FOTO = 140;
const CHAMADA = 90;
const dur = (id: Id) => Math.round((TRECHOS[id].fim - TRECHOS[id].ini) * FPS);
const INICIO: Record<Id, number> = (() => {
  const g = 0;
  const a = dur("gancho") + VINHETA;
  const b = a + dur("a");
  const c = b + dur("b");
  const d = c + dur("c");
  return { gancho: g, a, b, c, d };
})();
const FIM_FALA = INICIO.d + dur("d");
export const DURACAO_VISITA = FIM_FALA + FOTO + CHAMADA;

// frame do vídeo final em que cai o segundo `s` da fala original do trecho
const em = (id: Id, s: number) => INICIO[id] + Math.round((s - TRECHOS[id].ini) * FPS);

// ---------- Câmera da fala (selfie): enquadramento alterna entre aberto e fechado a cada
// frase (corte seco, ritmo de vídeo longo), respira devagar e dá "punch-in" nas palavras fortes.
const FOCO: [number, number] = [540, 1000]; // centro da câmera na origem: rosto no terço de cima, peito livre para as frases
const FECHADOS: readonly [Id, number, number][] = [
  // [trecho, de, até] em segundos da fala: enquadramento fechado (1,14)
  ["gancho", 17.2, 19.9],
  ["a", 10.5, 16.9],
  ["a", 27.5, 36.8],
  ["a", 43.4, 51.0],
  ["a", 55.4, 67.6],
  ["c", 20.6, 30.9],
  ["d", 95.4, 101.7],
  ["d", 116.3, 124.4],
  ["d", 138.1, 143.6],
];
const PUNCH: readonly [Id, number, number][] = [
  ["gancho", 18.28, 0.16], // crescer
  ["a", 25.64, 0.1], // automatizado
  ["a", 40.42, 0.12], // valida
  ["a", 43.76, 0.16], // máquina
  ["a", 59.02, 0.14], // 80 robôs
  ["a", 65.64, 0.12], // 24 horas
  ["b", 4.22, 0.14], // 2006
  ["c", 23.8, 0.16], // mil colaboradores
  ["d", 92.64, 0.12], // 100% familiar
  ["d", 107.9, 0.12], // inovar
  ["d", 125.84, 0.14], // 4 mil itens
  ["d", 134.18, 0.12], // é bom
  ["d", 143.16, 0.12], // dando certo
];

const useCamera = () => {
  const frame = useCurrentFrame();
  const fechado = FECHADOS.some(([id, de, ate]) => frame >= em(id, de) && frame < em(id, ate));
  const respira = 0.025 * Math.sin(frame / (FPS * 4));
  const punch = PUNCH.reduce(
    (s, [id, t, k]) => s + interpolate(frame, [em(id, t) - 2, em(id, t) + 3, em(id, t) + 0.7 * FPS], [0, k, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    0,
  );
  // o gancho abre já em movimento (aproxima 1,3 → 1)
  const abertura = interpolate(frame, [0, 1.2 * FPS], [0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = (fechado ? 1.14 : 1.03) + respira + punch + abertura;
  const cx = Math.min(1080 - 540 / z, Math.max(540 / z, FOCO[0]));
  const cy = Math.min(1920 - 960 / z, Math.max(960 / z, FOCO[1]));
  return { z, cx, cy };
};

const Fala: React.FC<{ readonly id: Id; readonly z: number; readonly cx: number; readonly cy: number }> = ({ id, z, cx, cy }) => {
  const { arq, ini, fim } = TRECHOS[id];
  const n = dur(id);
  // só ganho linear: a fala 01 já bate o pico em -18,6 LUFS; a 02 desce 1 dB para igualar
  const ganho = arq === "fala02" ? 0.89 : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Video
        src={staticFile(`midia/${arq}.mp4`)}
        trimBefore={Math.round(ini * FPS)}
        trimAfter={Math.round(fim * FPS)}
        // rampas de 3 frames nas emendas: sem estalo no corte da voz
        volume={(f) => ganho * interpolate(f, [0, 3, n - 3, n], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          scale: String(z),
          translate: `${z * (540 - cx)}px ${z * (960 - cy)}px`,
          filter: FILTRO_VISITA,
        }}
      />
    </AbsoluteFill>
  );
};

// imagem de apoio entre dois segundos da fala do trecho
const ApoioEm: React.FC<{ readonly id: Id; readonly de: number; readonly ate: number; readonly arquivo: string; readonly inicioS?: number }> = ({
  id,
  de,
  ate,
  arquivo,
  inicioS,
}) => (
  <Sequence name={`Apoio ${arquivo}`} from={em(id, de)} durationInFrames={em(id, ate) - em(id, de)} premountFor={FPS}>
    <Apoio arquivo={arquivo} inicioS={inicioS} />
  </Sequence>
);

// palavras-chave: `l2` = segundo da fala em que a palavra da linha 2 é dita
const Frase: React.FC<{
  readonly id: Id;
  readonly de: number;
  readonly ate: number;
  readonly l2: number;
  readonly linha1: string;
  readonly linha2: string;
  readonly tamanho1?: number;
  readonly tamanho2?: number;
  readonly topo?: number;
}> = ({ id, de, ate, l2, linha1, linha2, tamanho1 = 100, tamanho2 = 150, topo = 1240 }) => (
  <PalavrasCineticas
    name={linha2}
    from={em(id, de)}
    durationInFrames={em(id, ate) - em(id, de)}
    premountFor={FPS}
    linha1={linha1}
    linha2={linha2}
    tamanho1={tamanho1}
    tamanho2={tamanho2}
    atrasoLinha2={Math.max(0, l2 - de)}
    topo={topo}
  />
);

const NumeroEm: React.FC<{ readonly id: Id; readonly de: number; readonly ate: number; readonly n: number; readonly antes: string; readonly valor: number; readonly depois: string }> = ({
  id,
  de,
  ate,
  n,
  antes,
  valor,
  depois,
}) => (
  <Sequence name={`${valor} ${depois}`} from={em(id, de)} durationInFrames={em(id, ate) - em(id, de)} premountFor={FPS}>
    <Numero antes={antes} valor={valor} depois={depois} emNumero={n - de} topo={1180} />
  </Sequence>
);

const CapituloEm: React.FC<{ readonly numero: number; readonly de: number; readonly ate: number; readonly linha1: string; readonly linha2: string }> = ({ numero, de, ate, linha1, linha2 }) => (
  <Sequence name={`Capítulo ${numero}`} from={de} durationInFrames={ate - de} premountFor={FPS}>
    <Capitulo numero={numero} linha1={linha1} linha2={linha2} />
  </Sequence>
);

export const VisitaTramontina: React.FC = () => {
  const { fps } = useVideoConfig();
  const { z, cx, cy } = useCamera();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C1128" }}>
      {/* ---------- Falas */}
      {(Object.keys(TRECHOS) as Id[]).map((id) => (
        <Sequence key={id} name={`Fala ${id}`} from={INICIO[id]} durationInFrames={dur(id)} premountFor={fps}>
          <Fala id={id} z={z} cx={cx} cy={cy} />
        </Sequence>
      ))}

      {/* ---------- Imagens de apoio (a voz segue por baixo) */}
      <ApoioEm id="gancho" de={13.75} ate={17.2} arquivo="grupo-entrada" inicioS={4.5} />
      <ApoioEm id="a" de={5.9} ate={10.5} arquivo="faixa-115-anos" inicioS={2.0} />
      <ApoioEm id="a" de={14.8} ate={16.9} arquivo="hall-loja" inicioS={9.0} />
      <ApoioEm id="a" de={19.5} ate={23.9} arquivo="grupo-entrando" inicioS={1.0} />
      <ApoioEm id="a" de={51.2} ate={55.4} arquivo="monumento" inicioS={1.0} />
      <ApoioEm id="a" de={67.6} ate={86.6} arquivo="armazem" inicioS={5.0} />
      <ApoioEm id="d" de={88.0} ate={91.9} arquivo="fachada-1911" inicioS={2.0} />
      <ApoioEm id="d" de={99.4} ate={104.2} arquivo="historia-1911" inicioS={0.5} />
      <ApoioEm id="d" de={111.9} ate={115.9} arquivo="hall-loja" inicioS={0.5} />
      <ApoioEm id="d" de={118.6} ate={124.2} arquivo="grupo-caminhando" inicioS={1.0} />

      {/* leitura: topo e base levemente escurecidos em navy */}
      <Sequence name="Escurecer topo/base" durationInFrames={FIM_FALA}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,17,40,0.5) 0%, transparent 20%, transparent 58%, rgba(12,17,40,0.55) 100%)" }} />
      </Sequence>

      {/* ---------- Gancho: a automação não tirou gente, a empresa cresceu */}
      <Sequence name="Gancho" durationInFrames={dur("gancho")} premountFor={fps}>
        <Gancho
          topo="APESAR DE TODA A AUTOMAÇÃO"
          riscada="DEMITIU"
          destaque="CRESCEU"
          fim="EM COLABORADORES"
          emTopo={0}
          emRiscada={em("gancho", 16.4)}
          emDestaque={em("gancho", 18.28)}
          emFim={em("gancho", 19.0)}
          y={1080}
        />
      </Sequence>
      <Sequence name="Flash crescer" from={em("gancho", 18.28)} durationInFrames={6}>
        <Flash intensidade={0.45} />
      </Sequence>

      {/* ---------- Vinheta da visita */}
      <Sequence name="Vinheta" from={dur("gancho")} durationInFrames={VINHETA} premountFor={fps}>
        <Vinheta
          tomadas={[
            { arquivo: "faixa-115-anos", inicioS: 4.0 },
            { arquivo: "fachada-1911", inicioS: 4.5 },
            { arquivo: "monumento", inicioS: 3.5 },
            { arquivo: "hall-loja", inicioS: 11.0 },
          ]}
        />
      </Sequence>

      {/* ---------- Quem realizou a visita */}
      <Sequence name="Tarja realização" from={em("a", 1.3)} durationInFrames={em("a", 5.8) - em("a", 1.3)} premountFor={fps}>
        <TarjaRealizacao etiqueta="VISITA TÉCNICA · REALIZAÇÃO" nomes="FIERGS · SEBRAE PE" local="TRAMONTINA · FARROUPILHA-RS" />
      </Sequence>

      {/* ---------- Capítulos no topo */}
      <CapituloEm numero={1} de={INICIO.a} ate={em("a", 16.88)} linha1="115 ANOS" linha2="DE HISTÓRIA" />
      <CapituloEm numero={2} de={em("a", 16.88)} ate={em("a", 55.4)} linha1="AUTOMAÇÃO COM" linha2="O HUMANO NO FINAL" />
      <CapituloEm numero={3} de={em("a", 55.4)} ate={INICIO.b} linha1="LOGÍSTICA" linha2="COM 80 ROBÔS" />
      <CapituloEm numero={4} de={INICIO.b} ate={INICIO.d} linha1="AUTOMAÇÃO" linha2="E MAIS GENTE" />
      <CapituloEm numero={5} de={INICIO.d} ate={em("d", 116.3)} linha1="FAMILIAR E" linha2="SEMPRE INOVANDO" />
      <CapituloEm numero={6} de={em("d", 116.3)} ate={FIM_FALA} linha1="FOCO NO QUE" linha2="É BOM" />

      {/* ---------- Frases destacadas, no tempo da fala */}
      <Frase id="a" de={10.9} ate={14.8} l2={13.18} linha1="EM FARROUPILHA HÁ" linha2="+ DE 50 ANOS" />
      <Frase id="a" de={24.0} ate={27.4} l2={25.3} linha1="PROCESSO MUITO" linha2="AUTOMATIZADO" tamanho2={140} />
      <Frase id="a" de={36.7} ate={39.8} l2={38.06} linha1="NO FINAL É O" linha2="HUMANO" tamanho2={180} />
      <Frase id="a" de={39.8} ate={43.4} l2={40.42} linha1="É O HUMANO" linha2="QUE VALIDA" tamanho2={160} />
      <Frase id="a" de={43.4} ate={45.5} l2={43.76} linha1="NÃO É A" linha2="MÁQUINA" tamanho2={180} />
      <Frase id="a" de={51.2} ate={55.3} l2={53.34} linha1="HUMANO + AUTOMAÇÃO" linha2="ROBÔ JUNTO" tamanho1={84} />
      <NumeroEm id="a" de={57.9} ate={62.4} n={59.02} antes="MAIS DE" valor={80} depois="ROBÔS NA LOGÍSTICA" />
      <Frase id="a" de={64.8} ate={67.5} l2={65.64} linha1="TRABALHANDO" linha2="24 HORAS POR DIA" tamanho2={120} />
      <Frase id="a" de={69.9} ate={73.2} l2={70.92} linha1="O GALPÃO É A" linha2="CAIXA PRETA" />
      <NumeroEm id="a" de={73.6} ate={77.5} n={74.86} antes="MAIS DE" valor={30000} depois="POSIÇÕES PALLETS" />
      <Frase id="a" de={78.0} ate={82.5} l2={80.32} linha1="ROBÔS SOZINHOS," linha2="SEM NENHUM HUMANO" tamanho2={110} />
      <Frase id="a" de={82.6} ate={86.5} l2={85.44} linha1="SÓ ENTRA HUMANO" linha2="NA MANUTENÇÃO" tamanho2={130} />

      <Frase id="b" de={3.4} ate={8.3} l2={4.22} linha1="AUTOMATIZANDO" linha2="DESDE 2006" tamanho2={170} />
      <Frase id="b" de={8.4} ate={9.9} l2={9.02} linha1="NÃO É" linha2="NADA NOVO" />
      <NumeroEm id="c" de={21.8} ate={26.4} n={23.8} antes="CHEGANDO A" valor={1000} depois="COLABORADORES" />

      <Frase id="d" de={89.6} ate={92.1} l2={90.62} linha1="EMPRESA" linha2="BRASILEIRA" tamanho2={170} />
      <Frase id="d" de={92.1} ate={95.4} l2={93.68} linha1="100% FAMILIAR" linha2="DUAS FAMÍLIAS" tamanho1={110} />
      <Frase id="d" de={99.4} ate={102.2} l2={101.16} linha1="É A HISTÓRIA" linha2="DO BRASIL" tamanho2={160} />
      <NumeroEm id="d" de={104.2} ate={106.5} n={105.42} antes="HÁ MAIS DE" valor={100} depois="ANOS" />
      <Frase id="d" de={106.5} ate={109.0} l2={107.9} linha1="PROCURANDO SEMPRE" linha2="INOVAR" tamanho2={190} />
      <Frase id="d" de={109.0} ate={111.9} l2={110.68} linha1="TECNOLOGIAS" linha2="NOVAS" tamanho2={190} />
      <NumeroEm id="d" de={124.4} ate={128.4} n={125.84} antes="NA PANDEMIA ERAM" valor={4000} depois="ITENS" />
      <Frase id="d" de={130.4} ate={134.6} l2={133.28} linha1="FAZER SOMENTE O QUE" linha2="A GENTE É BOM" tamanho1={84} tamanho2={130} />
      <Sequence name="4 mil → 1.500" from={em("d", 134.6)} durationInFrames={em("d", 138.1) - em("d", 134.6)} premountFor={fps}>
        <Gancho topo="ENXUGARAM PARA" riscada="4 MIL" destaque="1.500" fim="ITENS" emTopo={0} emRiscada={4} emDestaque={em("d", 136.92) - em("d", 134.6)} emFim={em("d", 137.64) - em("d", 134.6)} y={1140} />
      </Sequence>
      <Frase id="d" de={138.1} ate={141.3} l2={140.96} linha1="FOCO NO QUE" linha2="É BOM" tamanho2={190} />
      <Frase id="d" de={141.3} ate={143.6} l2={143.16} linha1="E ESTÁ" linha2="DANDO CERTO" tamanho2={160} />

      <Sequence name="Assinatura" durationInFrames={FIM_FALA} premountFor={fps}>
        <Assinatura />
      </Sequence>
      <BarraProgresso />

      {/* ---------- Encerramento: foto do grupo + chamada */}
      <Sequence name="Foto do grupo" from={FIM_FALA} durationInFrames={FOTO} premountFor={fps}>
        <FotoGrupo etiqueta="VISITA TÉCNICA" realizacao="FIERGS · SEBRAE PE" />
      </Sequence>
      <Sequence name="Chamada final" from={FIM_FALA + FOTO} premountFor={fps}>
        <ChamadaFinal linha1="E NA SUA EMPRESA?" linha2="O FOCO É NO QUE É BOM?" acao="COMENTA AQUI E SEGUE" />
      </Sequence>

      {/* trilha baixa sob a fala; sobe na vinheta e no encerramento */}
      <Audio
        name="Trilha"
        src={staticFile("midia/trilha.wav")}
        volume={(f) => {
          const v = INICIO.a - VINHETA;
          return interpolate(
            f,
            [0, v - 6, v + 4, INICIO.a - 8, INICIO.a + 10, FIM_FALA - 8, FIM_FALA + 8, DURACAO_VISITA - 40, DURACAO_VISITA],
            [0.13, 0.13, 0.55, 0.55, 0.11, 0.11, 0.55, 0.55, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
        }}
      />
    </AbsoluteFill>
  );
};
