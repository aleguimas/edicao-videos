import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Flash } from "../Flash";
import { Gancho } from "../corte/Gancho";
import { PalavrasCineticas } from "../corte/PalavrasCineticas";
import { BarraProgresso, Capitulo, Clipe, Encerramento, LogoEm, MarcaSimpli, Tarja, TituloViagem } from "./Elementos";

// Missão Simplí na Revestir Home Center (Fortaleza-CE): letramento em IA com os gestores e
// implantação do Agentic Office. Vídeo puxado pela música (viagem, loja, sala) com 4 falas
// do Guimas no meio. Nenhum número interno da Revestir aparece.
const FPS = 30;

// ---------- Música (Ruff Money, 101,25 BPM): os cortes das montagens caem na batida.
const BATIDA = 0.5926 * FPS; // frames por tempo
const PRIMEIRO_TEMPO = 0.255; // s, primeiro tempo forte da música

// ---------- Falas (segundos dentro do arquivo preparado em public/midia/). Cortes nas pausas.
// `ganho` linear iguala as falas perto de -18 LUFS (a dos agentes já sai em -18,5 limitada pelo pico).
const FALAS = {
  gancho: { arq: "gancho", ini: 2.48, fim: 9.95, ganho: 0.91 }, // a gente vai colocar IA dentro da empresa… mas não é bem assim
  agentes: { arq: "agentes", ini: 0.15, fim: 10.75, ganho: 1 }, // a IA vai entender… três agentes… tudo conversacional
  juntos: { arq: "juntos", ini: 0.0, fim: 11.6, ganho: 0.75 }, // é onde a gente vai entrar… pegar na mão e vamos juntos, vamos aqui, vamos ali
  gestores: { arq: "gestores", ini: 0.15, fim: 6.5, ganho: 0.75 }, // por que juntamos os gestores… a equipe não compra
} as const;
type Fala = keyof typeof FALAS;
const dur = (id: Fala) => Math.round((FALAS[id].fim - FALAS[id].ini) * FPS);

// Montagens em tempos de música: [arquivo, tempos, início no arquivo (s)]
type Tomada = readonly [string, number, number];
const VIAGEM: readonly Tomada[] = [
  ["aeroporto-1", 4, 0],
  ["aeroporto-2", 2, 0],
  ["aviao", 2, 0],
  ["carro", 2, 0],
];
const LOJA: readonly Tomada[] = [
  ["fachada", 4, 0],
  ["loja-entrada", 2, 0],
  ["loja-dentro", 4, 0],
];
const LETRAMENTO: readonly Tomada[] = [
  ["experimentacao", 3, 0],
  ["slide-ia", 3, 0],
  ["caio", 3, 0.2],
  ["como-usar", 3, 0],
];
const tempos = (t: readonly Tomada[]) => t.reduce((s, x) => s + x[1], 0);

// ---------- Linha do tempo (frames)
const ENCERRAMENTO = 130;
const T = (() => {
  const gancho = 0;
  const viagem = gancho + dur("gancho");
  const fb = (k: number) => viagem + Math.round(k * BATIDA); // frame do k-ésimo tempo depois da vinheta
  const loja = fb(tempos(VIAGEM));
  const letramento = fb(tempos(VIAGEM) + tempos(LOJA));
  const agentes = fb(tempos(VIAGEM) + tempos(LOJA) + tempos(LETRAMENTO));
  const juntos = agentes + dur("agentes");
  const gestores = juntos + dur("juntos");
  const fim = gestores + dur("gestores");
  return { gancho, viagem, loja, letramento, agentes, juntos, gestores, fim, fb };
})();
export const DURACAO_MISSAO = T.fim + ENCERRAMENTO;
// a música começa de forma que um tempo forte (início de compasso) caia no primeiro corte da viagem
const INICIO_MUSICA = PRIMEIRO_TEMPO + 16 * (BATIDA / FPS) - T.viagem / FPS;

// frame do vídeo em que cai o segundo `s` do arquivo da fala
const em = (id: Fala, s: number) => T[id] + Math.round((s - FALAS[id].ini) * FPS);

// ---------- Peças
const FalaClipe: React.FC<{ readonly id: Fala; readonly punch?: readonly number[]; readonly foco?: readonly [number, number] }> = ({ id, punch = [], foco }) => {
  const { arq, ini, fim, ganho } = FALAS[id];
  return (
    <Sequence name={`Fala ${id}`} from={T[id]} durationInFrames={dur(id)} premountFor={FPS}>
      <Clipe arquivo={arq} inicioS={ini} fimS={fim} comSom ganho={ganho} zoom={[1.0, 1.08]} foco={foco} punch={punch.map((s) => Math.round((s - ini) * FPS))} clarao={id === "gancho" ? 0 : 0.3} />
    </Sequence>
  );
};

const Montagem: React.FC<{ readonly nome: string; readonly k0: number; readonly tomadas: readonly Tomada[] }> = ({ nome, k0, tomadas }) => {
  let k = k0; // tempos de música contados desde o primeiro corte da viagem
  return (
    <>
      {tomadas.map(([arq, n, ini]) => {
        const a = T.fb(k);
        k += n;
        return (
          <Sequence key={arq} name={`${nome}: ${arq}`} from={a} durationInFrames={T.fb(k) - a} premountFor={FPS}>
            <Clipe arquivo={arq} inicioS={ini} zoom={[1.04, 1.14]} />
          </Sequence>
        );
      })}
    </>
  );
};

// palavras-chave: de/ate/l2 em segundos do arquivo da fala
const Frase: React.FC<{
  readonly id: Fala;
  readonly de: number;
  readonly ate: number;
  readonly l2: number;
  readonly linha1: string;
  readonly linha2: string;
  readonly tamanho1?: number;
  readonly tamanho2?: number;
  readonly topo?: number;
}> = ({ id, de, ate, l2, linha1, linha2, tamanho1 = 84, tamanho2 = 140, topo = 1240 }) => (
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

// texto sobre as montagens (sem fala): de/ate em tempos de música desde o início da viagem
const TextoMontagem: React.FC<{ readonly de: number; readonly ate: number; readonly linha1: string; readonly linha2: string; readonly topo?: number }> = ({
  de,
  ate,
  linha1,
  linha2,
  topo = 1150,
}) => (
  <PalavrasCineticas
    name={linha2}
    from={T.fb(de) + 2}
    durationInFrames={T.fb(ate) - T.fb(de) - 2}
    premountFor={FPS}
    linha1={linha1}
    linha2={linha2}
    tamanho1={84}
    tamanho2={130}
    atrasoLinha2={0.35}
    topo={topo}
  />
);

const CapituloEm: React.FC<{ readonly de: number; readonly ate: number; readonly etiqueta: string; readonly linha1: string; readonly linha2: string }> = ({
  de,
  ate,
  etiqueta,
  linha1,
  linha2,
}) => (
  <Sequence name={etiqueta} from={de} durationInFrames={ate - de} premountFor={FPS}>
    <Capitulo etiqueta={etiqueta} linha1={linha1} linha2={linha2} />
  </Sequence>
);

const tv = tempos(VIAGEM);
const tl = tv + tempos(LOJA);

export const MissaoRevestir: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B0C" }}>
      {/* ---------- Gancho: a fala abre o vídeo */}
      <FalaClipe id="gancho" punch={[74.8 - 69.6, 78.56 - 69.6]} foco={[540, 700]} />

      {/* ---------- Viagem, loja e letramento: montagens no tempo da música */}
      <Montagem nome="Viagem" k0={0} tomadas={VIAGEM} />
      <Montagem nome="Loja" k0={tv} tomadas={LOJA} />
      <Montagem nome="Letramento" k0={tl} tomadas={LETRAMENTO} />

      {/* ---------- Falas do meio */}
      <FalaClipe id="agentes" punch={[915.16 - 911.3, 921.34 - 911.3]} foco={[540, 760]} />
      <FalaClipe id="juntos" punch={[236.18 - 229.3, 239.0 - 229.3]} foco={[540, 700]} />
      <FalaClipe id="gestores" punch={[1641.62 - 1635.8]} foco={[540, 700]} />

      {/* leitura: topo e base levemente escurecidos */}
      <Sequence name="Escurecer topo/base" durationInFrames={T.fim}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,11,12,0.5) 0%, transparent 20%, transparent 56%, rgba(11,11,12,0.6) 100%)" }} />
      </Sequence>

      {/* ---------- Gancho (tempos em s do arquivo gancho.mp4, que começa em 69,6 s do revestir-1) */}
      <Frase id="gancho" de={2.48} ate={6.1} l2={3.62} linha1="A GENTE VAI COLOCAR" linha2="IA NA EMPRESA" tamanho1={74} tamanho2={130} />
      <Sequence name="Gancho" from={em("gancho", 6.1)} durationInFrames={T.viagem - em("gancho", 6.1)} premountFor={fps}>
        <Gancho
          topo="VOU PERDER MEU"
          riscada="EMPREGO"
          destaque="NÃO É"
          fim="BEM ASSIM"
          emTopo={0}
          emRiscada={Math.round((6.88 - 6.1) * FPS)}
          emDestaque={Math.round((8.96 - 6.1) * FPS)}
          emFim={Math.round((9.3 - 6.1) * FPS)}
          y={1060}
        />
      </Sequence>
      <Sequence name="Flash não é" from={em("gancho", 8.96)} durationInFrames={6}>
        <Flash intensidade={0.4} />
      </Sequence>

      {/* ---------- Viagem → Revestir → Agentic Office */}
      <Sequence name="Título viagem" from={T.fb(0)} durationInFrames={T.fb(tv) - T.fb(0)} premountFor={fps}>
        <TituloViagem etiqueta="MISSÃO SIMPLÍ" linha1="DESTINO" linha2="FORTALEZA" rodape="CEARÁ" />
      </Sequence>
      <Sequence name="Logo Revestir" from={T.fb(tv)} durationInFrames={T.fb(tv + 6) - T.fb(tv)} premountFor={fps}>
        <LogoEm arquivo="revestir-home-center-amarelo.svg" largura={520} cartao etiqueta="IMPLANTAÇÃO NA" apoio="Letramento + Agentic Office" topo={1180} />
      </Sequence>
      <Sequence name="Logo Agentic Office" from={T.fb(tv + 6)} durationInFrames={T.fb(tl) - T.fb(tv + 6)} premountFor={fps}>
        <LogoEm arquivo="logo-agentic-office.png" largura={820} etiqueta="AGENTES DE IA PARA EMPRESAS" apoio="Plataforma da Simplí" topo={1180} />
      </Sequence>

      {/* ---------- Letramento */}
      <CapituloEm de={T.letramento} ate={T.agentes} etiqueta="REVESTIR · PARTE 1" linha1="LETRAMENTO" linha2="EM IA" />
      <TextoMontagem de={tl} ate={tl + 6} linha1="LETRAMENTO EM IA" linha2="COM OS GESTORES" />
      <TextoMontagem de={tl + 6} ate={tl + 12} linha1="PENSAR DIFERENTE PARA" linha2="GANHAR PRODUTIVIDADE" />
      <Sequence name="Tarja Guimas" from={T.fb(tl)} durationInFrames={T.fb(tl + 3) - T.fb(tl)} premountFor={fps}>
        <Tarja nome="Alexandre Guimarães" papel="SÓCIO-FUNDADOR · SIMPLÍ" />
      </Sequence>
      <Sequence name="Tarja Caio" from={T.fb(tl + 6)} durationInFrames={T.fb(tl + 9) - T.fb(tl + 6)} premountFor={fps}>
        <Tarja nome="Caio Souza" papel="SÓCIO-FUNDADOR · SIMPLÍ" />
      </Sequence>

      {/* ---------- Agentic Office (tempos em s do agentes.mp4, que começa em 911,3 s do revestir-2) */}
      <CapituloEm de={T.agentes} ate={T.juntos} etiqueta="REVESTIR · PARTE 2" linha1="AGENTIC" linha2="OFFICE" />
      <Frase id="agentes" de={0.15} ate={3.0} l2={1.14} linha1="A IA VAI" linha2="ENTENDER" />
      <Frase id="agentes" de={3.0} ate={7.2} l2={3.86} linha1="VOU CRIAR" linha2="3 AGENTES PRA VOCÊ" tamanho2={120} />
      <Frase id="agentes" de={7.2} ate={9.5} l2={8.96} linha1="VOCÊ NÃO PRECISA" linha2="SE PREOCUPAR" />
      <Frase id="agentes" de={9.5} ate={10.75} l2={10.04} linha1="É TUDO" linha2="CONVERSACIONAL" />

      {/* ---------- Implantação (s do juntos.mp4, que começa em 229,3 s do revestir-2) */}
      <CapituloEm de={T.juntos} ate={T.gestores} etiqueta="REVESTIR · PARTE 3" linha1="IMPLANTAÇÃO" linha2="LADO A LADO" />
      <Frase id="juntos" de={0.0} ate={2.5} l2={1.4} linha1="É ONDE A GENTE" linha2="VAI ENTRAR" />
      <Frase id="juntos" de={2.5} ate={6.6} l2={4.26} linha1="NÃO É SÓ TRAZER" linha2="A PLATAFORMA" />
      <Frase id="juntos" de={6.6} ate={9.4} l2={7.4} linha1="É PEGAR" linha2="NA MÃO" tamanho2={170} />
      <Frase id="juntos" de={9.4} ate={11.6} l2={9.7} linha1="E VAMOS" linha2="JUNTOS" tamanho2={190} />

      {/* ---------- Gestores (s do gestores.mp4, que começa em 1635,8 s do revestir-2) */}
      <CapituloEm de={T.gestores} ate={T.fim} etiqueta="REVESTIR · PARTE 4" linha1="GESTORES" linha2="NA FRENTE" />
      <Frase id="gestores" de={0.15} ate={2.0} l2={1.32} linha1="POR QUE JUNTAMOS" linha2="OS GESTORES?" />
      <Frase id="gestores" de={2.0} ate={4.4} l2={2.32} linha1="VOCÊS SÃO OS" linha2="CABEÇAS DA EQUIPE" tamanho2={120} />
      <Frase id="gestores" de={4.4} ate={5.8} l2={4.98} linha1="SE VOCÊS NÃO" linha2="COMPRAREM" />
      <Frase id="gestores" de={5.8} ate={6.5} l2={6.1} linha1="A EQUIPE" linha2="NÃO COMPRA" tamanho2={160} />

      {/* ---------- Marca, progresso e encerramento */}
      <Sequence name="Marca Simplí" from={T.letramento} durationInFrames={T.fim - T.letramento}>
        <MarcaSimpli />
      </Sequence>
      <BarraProgresso />
      <Sequence name="Encerramento" from={T.fim} premountFor={fps}>
        <Encerramento chamada1="DO LETRAMENTO" chamada2="À IMPLANTAÇÃO" />
      </Sequence>

      {/* trilha baixa sob as falas; sobe nas montagens e no encerramento */}
      <Audio
        name="Trilha"
        src={staticFile("midia/trilha.wav")}
        volume={(f) =>
          interpolate(
            f,
            [0, T.viagem - 6, T.viagem + 2, T.agentes - 8, T.agentes + 8, T.fim - 8, T.fim + 8, DURACAO_MISSAO - 30, DURACAO_MISSAO],
            [0.12, 0.12, 0.6, 0.6, 0.12, 0.12, 0.6, 0.6, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
    </AbsoluteFill>
  );
};

export const MUSICA = { inicio: INICIO_MUSICA, duracao: DURACAO_MISSAO / FPS };
