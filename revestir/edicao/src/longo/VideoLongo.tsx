import { Audio, Video } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Flash } from "../Flash";
import { Barras, Cena, CartelaCapitulo, Citacao, Comparativo, Iceberg, Lista, MarcaCanto, Notificacao, Organograma, Passos, RotuloCapitulo, TarjaNome, Verde } from "./Graficos";
import { EncerramentoLongo, FILTRO_LONGO, Frase16, Tomada, TituloVideo } from "./Pecas";
import { ABERTURA, BLOCOS_ORIGEM, CAMERA, CAPITULOS, type Trecho } from "./roteiro";

// Vídeo longo (YouTube, 16:9): bastidores do letramento em IA e da implantação do Agentic Office
// na Revestir. Abertura fria com 4 frases fortes → título sobre a viagem → 9 capítulos com
// cartela, câmera virtual multicâmera (aberto/médio/fechado a partir do 4K) e gráficos no tempo
// da fala → encerramento. Nenhum número interno da Revestir.
const FPS = 30;
const CARTELA = 96;
const VINHETA = 330;
const ENCERRAMENTO = 330;

// ganho linear por bloco para igualar as falas (medidas no preparar-longo.py)
const GANHO: Record<string, number> = {};

// ---------- Linha do tempo
type Item =
  | { tipo: "trecho"; t: Trecho; de: number; dur: number; cap: number; abertura: boolean; planos: readonly Plano[] }
  | { tipo: "cartela"; cap: number; de: number; dur: number }
  | { tipo: "vinheta"; de: number; dur: number }
  | { tipo: "fim"; de: number; dur: number };
type Plano = "aberto" | "medio" | "fechado";
const CICLO: readonly Plano[] = ["medio", "fechado", "aberto", "fechado", "medio", "aberto", "fechado"];

const ITENS: Item[] = (() => {
  const out: Item[] = [];
  let f = 0;
  let k = 0;
  const trecho = (t: Trecho, cap: number, abertura: boolean) => {
    const dur = Math.round((t.fim - t.ini) * FPS);
    const planos = Array.from({ length: t.trocas.length + 1 }, () => CICLO[k++ % CICLO.length]);
    out.push({ tipo: "trecho", t, de: f, dur, cap, abertura, planos: abertura ? planos.map(() => "fechado" as const) : planos });
    f += dur;
  };
  ABERTURA.forEach((t) => trecho(t, -1, true));
  out.push({ tipo: "vinheta", de: f, dur: VINHETA });
  f += VINHETA;
  CAPITULOS.forEach((c, i) => {
    out.push({ tipo: "cartela", cap: i, de: f, dur: CARTELA });
    f += CARTELA;
    c.trechos.forEach((t) => trecho(t, i, false));
  });
  out.push({ tipo: "fim", de: f, dur: ENCERRAMENTO });
  return out;
})();
export const DURACAO_LONGO = ITENS[ITENS.length - 1].de + ENCERRAMENTO;
const trechos = ITENS.filter((i): i is Extract<Item, { tipo: "trecho" }> => i.tipo === "trecho");
const inicioCap = (cap: number) => (ITENS.find((i) => i.tipo === "cartela" && i.cap === cap) as Item).de;
const fimCap = (cap: number) => {
  const ts = trechos.filter((t) => t.cap === cap);
  const u = ts[ts.length - 1];
  return u.de + u.dur;
};

// frame do vídeo em que cai o segundo `s` do ORIGINAL (revestir-1/2) no bloco — nos capítulos
export const quando = (bloco: string, s: number): number => {
  const rel = s - BLOCOS_ORIGEM[bloco];
  // folga de 0,4 s: os cortes foram ajustados às pausas e podem ter andado um pouco
  const it = trechos.find((i) => !i.abertura && i.t.bloco === bloco && rel >= i.t.ini - 0.4 && rel <= i.t.fim + 0.4);
  if (!it) throw new Error(`instante ${s} do bloco ${bloco} não está em nenhum trecho`);
  return it.de + Math.min(it.dur, Math.max(0, Math.round((rel - it.t.ini) * FPS)));
};

// ---------- Câmera virtual
// janelas sobre o quadro 2560x1440: aberto = inteiro, médio = 1920x1080 (sem ampliar), fechado = 1280x720
const JANELA: Record<Plano, number> = { aberto: 2560, medio: 1920, fechado: 1280 };
// Caio Souza em pé à direita no revestir-1 (o rastreio segue o Guimas)
const CAIO = { bloco: "v1", de: 89.3 - 55, ate: 93.8 - 55, x: 2225, topo: 490 };

const posicao = (bloco: string, t: number) => {
  if (bloco === CAIO.bloco && t >= CAIO.de && t <= CAIO.ate) return { x: CAIO.x, topo: CAIO.topo };
  const pts = CAMERA[bloco] ?? [];
  if (!pts.length) return { x: 1280, topo: 380 };
  const i = pts.findIndex((p) => p[0] >= t);
  if (i <= 0) return { x: pts[Math.max(0, i)][1], topo: pts[Math.max(0, i)][2] };
  const a = pts[i - 1];
  const b = pts[i];
  const k = (t - a[0]) / (b[0] - a[0]);
  return { x: a[1] + (b[1] - a[1]) * k, topo: a[2] + (b[2] - a[2]) * k };
};

const FalaTrecho: React.FC<{ readonly item: Extract<Item, { tipo: "trecho" }> }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { t, dur, planos } = item;
  const s = t.ini + frame / FPS;
  const idx = t.trocas.filter((x) => s >= x).length;
  // sem marcação do apresentador (ele está fora do quadro): fica no aberto
  const semApresentador = !(CAMERA[t.bloco] ?? []).length;
  const plano: Plano = semApresentador ? "aberto" : t.bloco === CAIO.bloco && s >= CAIO.de && s <= CAIO.ate ? "fechado" : planos[idx];
  const inicioPlano = idx === 0 ? t.ini : t.trocas[idx - 1];
  const p = posicao(t.bloco, s);
  // aproximação lenta dentro de cada plano (nunca fica parado)
  const deriva = 1 + 0.035 * Math.min(1, (s - inicioPlano) / 8);
  const jw = JANELA[plano] / (plano === "aberto" ? 1 : deriva);
  const jh = (jw * 9) / 16;
  const cx = plano === "aberto" ? 1280 + (p.x - 1280) * 0.3 : p.x;
  const cy = plano === "aberto" ? 720 : p.topo + jh * 0.22; // cabeça no terço de cima
  const x0 = Math.min(2560 - jw, Math.max(0, cx - jw / 2));
  const y0 = Math.min(1440 - jh, Math.max(0, cy - jh * (plano === "aberto" ? 0.5 : 0.42)));
  const escala = 1920 / jw;
  const ganho = GANHO[t.bloco] ?? 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0B0B0C" }}>
      <Video
        src={staticFile(`longo/${t.bloco}.mp4`)}
        trimBefore={Math.round(t.ini * FPS)}
        trimAfter={Math.round(t.fim * FPS)}
        volume={(f) => ganho * interpolate(f, [0, 3, dur - 3, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 2560,
          height: 1440,
          transformOrigin: "0 0",
          transform: `translate(${-x0 * escala}px, ${-y0 * escala}px) scale(${escala})`,
          filter: FILTRO_LONGO,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Gráficos no tempo da fala: de/ate em segundos do original; `e(s)` dá o frame local
const G: React.FC<{ readonly bloco: string; readonly de: number; readonly ate: number; readonly nome: string; readonly children: (e: (s: number) => number) => React.ReactNode }> = ({
  bloco,
  de,
  ate,
  nome,
  children,
}) => {
  const a = quando(bloco, de);
  const b = quando(bloco, ate);
  return (
    <Sequence name={nome} from={a} durationInFrames={Math.max(1, b - a)} premountFor={FPS}>
      {children((s) => quando(bloco, s) - a)}
    </Sequence>
  );
};
const F: React.FC<{ readonly bloco: string; readonly de: number; readonly ate: number; readonly em2: number; readonly l1: string; readonly l2: string }> = ({ bloco, de, ate, em2, l1, l2 }) => (
  <G bloco={bloco} de={de} ate={ate} nome={l2}>
    {(e) => <Frase16 linha1={l1} linha2={l2} em2={e(em2)} />}
  </G>
);

// frase da abertura fria (por cima do trecho da abertura)
const fraseAbertura = (i: number, l1: string, l2: string, em2Abs: number) => {
  const it = trechos.filter((t) => t.abertura)[i];
  const em2 = Math.round((em2Abs - BLOCOS_ORIGEM[it.t.bloco] - it.t.ini) * FPS);
  return (
    <Sequence key={`ab${i}`} name={`Abertura: ${l2}`} from={it.de} durationInFrames={it.dur}>
      <Frase16 linha1={l1} linha2={l2} em2={em2} />
    </Sequence>
  );
};

export const VideoLongo: React.FC = () => {
  const { fps } = useVideoConfig();
  const vinheta = ITENS.find((i) => i.tipo === "vinheta") as Item;
  const fim = ITENS[ITENS.length - 1];
  const fimAbertura = vinheta.de;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B0C" }}>
      {/* ---------- Falas (câmera virtual) */}
      {trechos.map((it) => (
        <Sequence key={`${it.t.id}-${it.de}`} name={`Fala ${it.t.id}`} from={it.de} durationInFrames={it.dur} premountFor={fps}>
          <FalaTrecho item={it} />
        </Sequence>
      ))}

      {/* ---------- Abertura fria */}
      {fraseAbertura(0, "VOU PERDER MEU EMPREGO?", "NÃO É BEM ASSIM", 78.56)}
      {fraseAbertura(1, "FERRARI OU FUSCA?", "TU SABE DIRIGIR A FERRARI?", 210.38)}
      {fraseAbertura(2, "BOTEI IA NA OPERAÇÃO", "SÓ FEZ PIORAR", 508.44)}
      {fraseAbertura(3, "SE VOCÊS NÃO COMPRAREM A IDEIA", "A EQUIPE NÃO COMPRA", 1641.62)}
      {trechos
        .filter((t) => t.abertura)
        .slice(1)
        .map((t) => (
          <Sequence key={`fl${t.de}`} from={t.de} durationInFrames={6}>
            <Flash intensidade={0.5} />
          </Sequence>
        ))}

      {/* ---------- Vinheta: viagem e loja com o título */}
      <Sequence name="Vinheta" from={vinheta.de} durationInFrames={VINHETA} premountFor={fps}>
        {[
          ["viagem-aeroporto-1", 0.2, 45],
          ["viagem-aeroporto-2", 0, 36],
          ["viagem-aviao", 0.4, 45],
          ["viagem-carro", 0.3, 45],
          ["viagem-fachada", 0.3, 63],
          ["viagem-loja", 16.8, 96],
        ].reduce<{ els: React.ReactNode[]; f: number }>(
          (acc, [arq, ini, n]) => {
            acc.els.push(
              <Sequence key={arq as string} from={acc.f} durationInFrames={n as number} premountFor={fps}>
                <Tomada arquivo={arq as string} inicioS={ini as number} />
              </Sequence>,
            );
            acc.f += n as number;
            return acc;
          },
          { els: [], f: 0 },
        ).els}
        <Sequence from={20} durationInFrames={VINHETA - 20}>
          <TituloVideo />
        </Sequence>
      </Sequence>

      {/* ---------- Cartelas e rótulos dos capítulos */}
      {CAPITULOS.map((c, i) => (
        <Sequence key={`cart${i}`} name={`Capítulo ${i + 1}`} from={inicioCap(i)} durationInFrames={CARTELA} premountFor={fps}>
          <CartelaCapitulo numero={i + 1} titulo={c.titulo} sub={c.sub} />
        </Sequence>
      ))}
      {CAPITULOS.map((c, i) => (
        <Sequence key={`rot${i}`} name={`Rótulo ${i + 1}`} from={inicioCap(i) + CARTELA} durationInFrames={fimCap(i) - inicioCap(i) - CARTELA}>
          <RotuloCapitulo numero={i + 1} titulo={c.curto} />
        </Sequence>
      ))}

      {/* ---------- 1. Letramento */}
      <F bloco="v1" de={60.66} ate={67.98} em2={65.3} l1="ANTES DA FERRAMENTA" l2="NIVELAMENTO DE IA" />
      <G bloco="v1" de={85.12} ate={89.2} nome="Tarja Guimas">
        {() => <TarjaNome nome="Alexandre Guimarães" papel="SÓCIO-FUNDADOR · SIMPLÍ" />}
      </G>
      <G bloco="v1" de={89.4} ate={93.6} nome="Tarja Caio">
        {() => <TarjaNome nome="Caio Souza" papel="SÓCIO-FUNDADOR · SIMPLÍ" />}
      </G>
      <G bloco="v1" de={111.5} ate={126.4} nome="O que a Simplí já faz">
        {(e) => (
          <Cena rotulo="Simplí na Revestir" titulo={<>A parceria já <Verde>começou</Verde></>}>
            <Lista
              colunas={2}
              itens={[
                { texto: "Atendimento", em: e(113.9) },
                { texto: "CRM", em: e(114.7) },
                { texto: "Televendas", em: e(118.5) },
                { texto: "Agora: a gestão", em: e(125.7), destaque: true },
              ]}
            />
          </Cena>
        )}
      </G>
      <F bloco="v1" de={151.02} ate={155.94} em2={155.0} l1="A PROVOCAÇÃO É" l2="PENSAR DIFERENTE" />
      <G bloco="v1" de={179.4} ate={185.0} nome="E se">
        {(e) => <Citacao linha1="E SE EU COLOCAR" linha2="A TECNOLOGIA PRA FAZER ISSO?" em2={e(181.68)} />}
      </G>
      <F bloco="v1" de={197.04} ate={202.46} em2={200.4} l1="COMO FAZER DIFERENTE NO MEU SETOR" l2="PARA GANHAR PRODUTIVIDADE?" />

      {/* ---------- 2. A pontinha */}
      <G bloco="v1" de={239.72} ate={259.0} nome="Iceberg">
        {(e) => (
          <Cena rotulo="O que é IA de verdade" titulo={<>O ChatGPT é <Verde>só a pontinha</Verde></>}>
            <Iceberg
              ponta="ChatGPT"
              emPonta={e(240.1)}
              abaixo={[
                { texto: "Celular", em: e(246.1) },
                { texto: "Previsão do tempo", em: e(250.9) },
                { texto: "Você já usa IA", em: e(256.3) },
              ]}
            />
          </Cena>
        )}
      </G>
      <F bloco="v1" de={259.06} ate={268.74} em2={264.3} l1="NÃO É SE VAMOS USAR IA" l2="É POR QUE AINDA NÃO USAMOS" />
      <G bloco="v1" de={270.46} ate={316.32} nome="Linha do tempo">
        {(e) => (
          <Cena rotulo="Linha do tempo" titulo={<>A IA <Verde>não é de agora</Verde></>}>
            <Passos
              itens={[
                { titulo: "Anos 40 e 50", sub: "IA só para quem tinha dinheiro no bolso", em: e(279) },
                { titulo: "2022", sub: "A OpenAI democratiza com o ChatGPT", em: e(296.5) },
                { titulo: "Hoje", sub: "ChatGPT, Claude, Gemini e um monte de ferramenta", em: e(302) },
                { titulo: "O desafio", sub: "Entender o que cada ferramenta faz", em: e(311.4), destaque: true },
              ]}
            />
          </Cena>
        )}
      </G>

      {/* ---------- 3. O hype acabou */}
      <F bloco="v1" de={328.44} ate={333.36} em2={331.1} l1="A FASE DE EXPERIMENTAÇÃO" l2="JÁ PASSOU" />
      <F bloco="v1" de={338.38} ate={345.84} em2={341.84} l1="POTENCIALIZAR O NEGÓCIO" l2="POTENCIALIZAR O SER HUMANO" />
      <G bloco="v1" de={346.92} ate={391.62} nome="Recreativo x estruturado">
        {(e) => (
          <Cena rotulo="O hype acabou" titulo={<>Do brinquedo à <Verde>infraestrutura</Verde></>}>
            <Comparativo
              esquerda={{ titulo: "Uso recreativo", itens: ["Foto do sofá no ChatGPT", "Onde colocar o jarro", "Qual é o meu treino"], em: e(348.6) }}
              direita={{ titulo: "Uso estruturado", itens: ["Gerar lucro", "Infraestrutura operacional", "Retorno sobre o investimento"], em: e(377.4) }}
            />
          </Cena>
        )}
      </G>
      <G bloco="v1" de={414.66} ate={429.4} nome="70 x 15">
        {(e) => (
          <Cena rotulo="Pesquisa recente · empresas no Brasil" titulo={<>Usar IA não é <Verde>ter retorno</Verde></>}>
            <Barras
              itens={[
                { rotulo: "Já utilizam IA", valor: 70, em: e(416.4) },
                { rotulo: "Conseguem extrair o ROI", valor: 15, em: e(421.6), destaque: true },
              ]}
              fonte="DADO DE MERCADO CITADO NO WORKSHOP"
            />
          </Cena>
        )}
      </G>
      <F bloco="v1" de={429.6} ate={436.0} em2={430.0} l1="O MOTIVO?" l2="FALTA DE DADOS ESTRUTURADOS" />
      <F bloco="v1" de={458.04} ate={464.9} em2={460.6} l1="ELE NUNCA VAI DIZER" l2="QUE O DADO ESTÁ ERRADO" />
      <F bloco="v1" de={466.12} ate={469.0} em2={467.6} l1="É MELHOR QUE O ESTAGIÁRIO" l2="PORQUE AINDA SE ENTREGA" />

      {/* ---------- 4. Dados primeiro */}
      <G bloco="v1" de={477.48} ate={503.8} nome="Pavimentação">
        {(e) => (
          <Cena rotulo="Antes da ferramenta" titulo={<>A <Verde>pavimentação</Verde> dos dados</>}>
            <Passos
              itens={[
                { titulo: "Dados estruturados", sub: "Sem eles, a maioria falhou", em: e(477.6) },
                { titulo: "Pavimentação", sub: "Uma base de dados sólida", em: e(481.6) },
                { titulo: "Entender o sistema", sub: "Como funciona o banco de dados", em: e(489.4) },
                { titulo: "Informação que ajuda", sub: "Em vez de piorar a operação", em: e(498.3), destaque: true },
              ]}
            />
          </Cena>
        )}
      </G>
      <F bloco="v1" de={504.44} ate={509.22} em2={508.44} l1="BOTEI IA NA OPERAÇÃO" l2="SÓ FEZ PIORAR" />
      <F bloco="v1" de={511.54} ate={514.6} em2={512.6} l1="GASTEI TANTO PRA COMPRAR" l2="E NÃO TEVE RETORNO" />
      <F bloco="v1" de={523.48} ate={534.82} em2={527.5} l1="ASSIM COMO O ERP" l2="INTELIGÊNCIA ARTIFICIAL É FERRAMENTA" />
      <F bloco="v1" de={551.22} ate={555.4} em2={553.6} l1="ONDE VOCÊ ENTRA" l2="E ONDE A IA OPERA" />
      <F bloco="v1" de={562.98} ate={576.32} em2={575.14} l1="IA + SER HUMANO" l2="TRABALHANDO EM CONJUNTO" />

      {/* ---------- 5. Humano + IA */}
      <G bloco="v1" de={587.2} ate={629.4} nome="Tramontina">
        {(e) => (
          <Cena rotulo="Visita técnica · Tramontina, Farroupilha-RS" titulo={<>Automação com <Verde>o humano no final</Verde></>}>
            <Passos
              itens={[
                { titulo: "Processo automatizado", sub: "A panela é feita pelas máquinas", em: e(590.2) },
                { titulo: "Humano valida", sub: "Olha, parafusa, valida e embala", em: e(599.9) },
                { titulo: "Avisa a produção", sub: "Se estiver errado, corrige lá na frente", em: e(609.9) },
                { titulo: "Robô leva ao CD", sub: "Mas tem o humano no processo", em: e(621.6), destaque: true },
              ]}
            />
          </Cena>
        )}
      </G>
      <G bloco="v1" de={630.16} ate={637.6} nome="Onde o humano entra">
        {(e) => <Citacao linha1="ONDE O HUMANO ENTRA" linha2="NO PROCESSO COM A IA" em2={e(633.4)} />}
      </G>

      {/* ---------- 6. Agentic Office */}
      <F bloco="olho" de={16.3} ate={31.9} em2={25.6} l1="PEÇA AO OLHO DE DEUS" l2="UM RELATÓRIO TODO DIA ÀS 9H" />
      <G bloco="olho" de={42.36} ate={70.96} nome="Torre de controle">
        {(e) => (
          <Cena rotulo="Agentic Office · relatório automático" titulo={<>A <Verde>torre de controle</Verde> no seu e-mail</>}>
            <Notificacao
              em={e(42.6)}
              remetente="Olho de Deus · Torre de Controle"
              assunto="Resumo enviado automaticamente"
              hora="09:00"
              linhas={[
                { texto: "Devoluções por loja", em: e(52.0) },
                { texto: "Tipo de devolução", em: e(55.6) },
                { texto: "Lojas auditadas", em: e(59.4) },
                { texto: "Batida de caixa", em: e(63.7) },
                { texto: "Prevenção", em: e(67.6) },
              ]}
            />
          </Cena>
        )}
      </G>
      <F bloco="agentes" de={804.68} ate={812.0} em2={809.4} l1="UMA ESTRUTURA DE" l2="AGENTES DE IA POR TRÁS" />
      <F bloco="agentes" de={813.18} ate={825.18} em2={823.3} l1="NUM PROCESSO NÃO É UM AGENTE SÓ" l2="É UMA GAMA DE AGENTES" />
      <F bloco="agentes" de={831.62} ate={838.68} em2={834.6} l1="O AGENTE DE IA É" l2="O FUNCIONÁRIO DIGITAL" />
      <G bloco="agentes" de={845.38} ate={893.1} nome="Organograma">
        {(e) => (
          <Cena rotulo="Agentic Office · estrutura de agentes" titulo={<>Funcionários digitais, <Verde>cada um com uma função</Verde></>}>
            <Organograma
              niveis={[
                { em: e(845.6), nos: [{ nome: "Olho de Deus", papel: "conductor · super agente" }] },
                { em: e(868.4), nos: [{ nome: "Larissa", papel: "diretora comercial · valida" }] },
                { em: e(857.2), nos: [{ nome: "Rafael", papel: "analisa as compras", destaque: true }] },
              ]}
            />
          </Cena>
        )}
      </G>
      <G bloco="agentes" de={900.74} ate={932.88} nome="Fluxo conversacional">
        {(e) => (
          <Cena rotulo="Tudo conversacional" titulo={<>Do pedido ao <Verde>processo automatizado</Verde></>}>
            <Passos
              itens={[
                { titulo: "Você descreve o processo", sub: "Conversando com o Olho de Deus", em: e(900.9) },
                { titulo: "A IA cria os agentes", sub: "“Pra isso eu vou criar três agentes pra você”", em: e(912.6) },
                { titulo: "Você acompanha e valida", sub: "Sem se preocupar com a parte técnica", em: e(926.8) },
                { titulo: "Processo automatizado", sub: "Uma vez validado, já foi", em: e(930.4), destaque: true },
              ]}
            />
          </Cena>
        )}
      </G>
      <G bloco="agentes" de={955.58} ate={977.5} nome="Agente da manhã">
        {(e) => (
          <Cena rotulo="Exemplo real · rotina do Guimas" titulo={<>Uma cadeia de agentes <Verde>toda manhã</Verde></>}>
            <Passos
              itens={[
                { titulo: "Agente da manhã", sub: "Manda as principais informações", em: e(957.9) },
                { titulo: "Você escolhe", sub: "Qual conteúdo criar", em: e(962.3) },
                { titulo: "Agente de conteúdo", sub: "Cria o conteúdo", em: e(967.3) },
                { titulo: "Diretor aprova", sub: "E manda para a aprovação final", em: e(972.9), destaque: true },
              ]}
            />
          </Cena>
        )}
      </G>
      <G bloco="manha" de={1187.46} ate={1209.38} nome="Manhã x 30 min">
        {(e) => (
          <Cena rotulo="Produtividade" titulo={<>Concorda que eu já <Verde>ganhei minha manhã?</Verde></>}>
            <Comparativo
              esquerda={{ titulo: "Antes", itens: ["Uma manhã inteira", "Relatório de um lado", "Relatório do outro"], em: e(1187.6) }}
              direita={{ titulo: "Com o Agentic Office", itens: ["Uns 30 minutos", "Direto para a equipe", "Isso é produtividade"], em: e(1195.8) }}
            />
          </Cena>
        )}
      </G>

      {/* ---------- 7. Comece pequeno */}
      <G bloco="ferrari" de={205.18} ate={215.7} nome="Ferrari x Fusca">
        {(e) => (
          <Cena rotulo="Quem chega primeiro em Fortaleza?" titulo={<>Ferrari ou <Verde>Fusca?</Verde></>}>
            <Comparativo
              esquerda={{ titulo: "Ferrari", itens: ["Tecnicamente chega primeiro", "Mas você sabe dirigir?", "E a estrada é de terra"], em: e(205.4) }}
              direita={{ titulo: "Fusca", itens: ["Começar pequeno", "Pegar na mão", "Ir juntos"], em: e(212.4) }}
            />
          </Cena>
        )}
      </G>
      <F bloco="ferrari" de={229.32} ate={234.24} em2={233.3} l1="NÃO É SÓ CHEGAR" l2="E TRAZER A PLATAFORMA" />
      <F bloco="ferrari" de={235.82} ate={242.86} em2={238.6} l1="É PEGAR NA MÃO" l2="E VAMOS JUNTOS" />
      <F bloco="maturidade" de={1045.22} ate={1059.72} em2={1049.6} l1="A MATURIDADE SE CRIA" l2="JUNTO COM VOCÊS" />
      <G bloco="confianca" de={1288.14} ate={1320.45} nome="Escada da maturidade">
        {(e) => (
          <Cena rotulo="Maturidade de uso" titulo={<>Comece com poucos, <Verde>ganhe confiança</Verde></>}>
            <Passos
              itens={[
                { titulo: "3 a 5 processos", sub: "Comece pequeno", em: e(1291.8) },
                { titulo: "Ganhe confiança", sub: "Na ferramenta e no resultado", em: e(1297.9) },
                { titulo: "Faça mais", sub: "“Acho que posso fazer até mais”", em: e(1301.0) },
                { titulo: "Nem tudo se automatiza", sub: "Escolha o que tem impacto", em: e(1318.6), destaque: true },
              ]}
            />
          </Cena>
        )}
      </G>
      <F bloco="dores" de={1507.8} ate={1520.8} em2={1516.7} l1="PENSE EM CINCO PROCESSOS" l2="NÃO É PRA FUNCIONAR AMANHÃ" />

      {/* ---------- 8. Foco em compras */}
      <G bloco="compras" de={1403.92} ate={1428.6} nome="Abre a cabeça">
        {(e) => (
          <Cena rotulo="Possibilidades" titulo={<>Abre a cabeça: <Verde>são várias</Verde></>}>
            <Lista
              colunas={3}
              itens={[
                { texto: "Conciliação bancária", em: e(1405.7) },
                { texto: "Financeiro", em: e(1409.1) },
                { texto: "Compras: o coração", em: e(1416.9), destaque: true },
              ]}
            />
          </Cena>
        )}
      </G>
      <F bloco="compras" de={1474.82} ate={1488.24} em2={1480.3} l1="A VERBA DO FORNECEDOR" l2="JÁ CHEGA NA ANÁLISE" />
      <F bloco="foco" de={1741.48} ate={1746.9} em2={1741.74} l1="FOQUE EM COMPRAS" l2="UM MUNDO GIGANTESCO" />
      <G bloco="foco" de={1749.76} ate={1756.6} nome="Alma do negócio">
        {(e) => <Citacao linha1="COMPRAS" linha2="É A ALMA DO NEGÓCIO" em2={e(1752.82)} />}
      </G>
      <F bloco="foco" de={1791.62} ate={1800.0} em2={1797.6} l1="TEM QUE TER UM FOCO" l2="OTIMIZAR UMA COISA SÓ" />

      {/* ---------- 9. Gestores na frente */}
      <F bloco="gestores" de={1633.04} ate={1637.4} em2={1636.9} l1="POR QUE A GENTE JUNTOU" l2="OS GESTORES?" />
      <G bloco="gestores" de={1637.5} ate={1643.0} nome="Equipe não compra">
        {(e) => <Citacao linha1="SE VOCÊS NÃO COMPRAREM A IDEIA" linha2="A EQUIPE NÃO COMPRA" em2={e(1641.62)} />}
      </G>
      <F bloco="sempre" de={1986.3} ate={1988.88} em2={1987.3} l1="A GENTE VAI ESTAR" l2="SEMPRE POR AQUI" />

      {/* ---------- Marca, encerramento e trilha */}
      <Sequence name="Marca" from={fimAbertura + VINHETA} durationInFrames={fim.de - fimAbertura - VINHETA}>
        <MarcaCanto />
      </Sequence>
      <Sequence name="Encerramento" from={fim.de} durationInFrames={ENCERRAMENTO} premountFor={fps}>
        <EncerramentoLongo />
      </Sequence>

      {/* trilha: baixa na abertura fria, cheia na vinheta, batida curta em cada cartela e no fim */}
      <Sequence name="Trilha abertura" durationInFrames={vinheta.de + VINHETA}>
        <Audio
          src={staticFile("longo/trilha.wav")}
          volume={(f) => interpolate(f, [0, vinheta.de - 8, vinheta.de + 4, vinheta.de + VINHETA - 30, vinheta.de + VINHETA], [0.1, 0.1, 0.55, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
      {CAPITULOS.map((_, i) => (
        <Sequence key={`tc${i}`} name={`Trilha cartela ${i + 1}`} from={inicioCap(i) - 6} durationInFrames={CARTELA + 12}>
          <Audio
            src={staticFile("longo/trilha.wav")}
            trimBefore={Math.round((24 + i * 14.22) * FPS)}
            volume={(f) => interpolate(f, [0, 6, CARTELA - 10, CARTELA + 12], [0, 0.45, 0.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />
        </Sequence>
      ))}
      <Sequence name="Trilha fim" from={fim.de - 6} durationInFrames={ENCERRAMENTO + 6}>
        <Audio
          src={staticFile("longo/trilha.wav")}
          trimBefore={Math.round(150 * FPS)}
          volume={(f) => interpolate(f, [0, 10, ENCERRAMENTO - 60, ENCERRAMENTO + 6], [0, 0.55, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
