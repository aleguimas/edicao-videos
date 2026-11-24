import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TarjaAna } from "../ana/Ana";
import { ANTES, type Cena, FPS, marca, type Palavra, type Vozes } from "../ana/voz";
import { Camera, caminho, COR, Cursor, Digitando, rota } from "../agentic/App";
import { CINZA, FUNDO, fontFamily, fonteApp, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import vozes from "../voz-treinamento-verbas.json";
import { Ajuste, Alertas, Config, Config2, OlhoVerbas, Planilha, Produtos, RolaEmail, Saidas, secao, Selo, Tratativas } from "./CenasCompleto";
import { TelaContas } from "./ContasVerba";
import { ACORDOS, FORNECEDORES, NOVO_TREIN } from "./dados";
import { EmailComprador, EmailFornecedor, type FocoComprador } from "./Emails";
import { ITEM_MENU_VERBAS, Janela } from "./JanelaVerbas";
import { Etiqueta, FotoAna, Montagem, montarRoteiro, Surge } from "./Montagem";
import { ABA, AREA, Aviso, BarraAcordos, BOTAO_NOVO, Cabecalho, CartaoAcordo, camposForm, COLUNA_X, DY_EXPLICA, MODAL, ModalNovoAcordo, ROLA_FORM, TelaPainel } from "./Telas";
import {
  BOTAO_LANCAR_REC,
  BOTAO_TESTE,
  BotaoP,
  Caixa,
  type EstadoNota,
  janela,
  luz,
  Modal,
  ModalRecebimento,
  NOTA,
  PAGINA,
  PaginaAcordo,
  PEND,
  RECEB,
  REC,
  ROLA_GRUPO,
  Seletor,
  TelaCaixa,
  TelaFornecedores,
  TelaParametros,
  TelaPendencias2,
  TelaRecebimentos,
  type FocoPend,
} from "./Telas2";
import { Conceito, centroAcordo, centroPainel, SEM_PIP } from "./VerbasAcordos";

// Treinamento (16:9) do Verbas e Acordos: o processo todo, passo a passo, para quem usa o módulo no
// dia a dia. Genérico (empresa fictícia Loja Modelo). Reaproveita as telas e várias cenas do vídeo de
// apresentação; cada movimento acontece na palavra em que a Ana fala dele.
type P = { readonly c: Cena };
const usaMarca = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
const MODULO = "Verbas e Acordos";
const J = -100; // já aconteceu antes da cena
const NUNCA = 100000; // não acontece nesta cena
const agora = <T,>(frame: number, passos: readonly (readonly [number, T])[], padrao: T): T => passos.reduce<T>((v, [f, x]) => (frame >= f ? x : v), padrao);
const acesas = (frame: number, faixas: readonly (readonly [number, number, readonly string[]])[]) => faixas.flatMap(([de, ate, l]) => (frame >= de && frame < ate ? l : []));

// ---------- adaptador: usa uma cena da apresentação com a fala do treinamento. Cada palavra que a
// cena espera aponta para uma palavra da fala nova ([palavra, n]) ou para um frame fixo (número ou
// função da cena). `durExtra` estica a duração que a cena enxerga (para ações do fim não acontecerem).
type Alvo = string | readonly [string, number] | number | ((c: Cena) => number);
const normal = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
const adapta =
  (Tela: React.FC<P>, mapa: Record<string, readonly Alvo[]>, durExtra = 0): React.FC<P> =>
  ({ c }) => {
    const chaves = new Set(Object.keys(mapa).map(normal));
    const palavras: Palavra[] = c.fala.palavras.filter((p) => !chaves.has(normal(p[2])));
    for (const [chave, alvos] of Object.entries(mapa)) {
      for (const a of alvos) {
        const f = typeof a === "number" ? a : typeof a === "function" ? a(c) : typeof a === "string" ? marca(c.fala, a) : marca(c.fala, a[0], a[1]);
        const s = (f - ANTES) / FPS;
        palavras.push([s, s, chave]);
      }
    }
    return <Tela c={{ ...c, dur: c.dur + durExtra, fala: { ...c.fala, palavras } }} />;
  };
const depois = (c: Cena) => c.dur + 40;

// ---------- peças comuns
// contorno aceso por cima de uma área da tela (coordenadas do módulo)
const Brilho: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly de: number; readonly ate?: number }> = ({ x, y, w, h, de, ate = NUNCA }) => {
  const frame = useCurrentFrame();
  if (frame < de || frame >= ate) return null;
  const k = interpolate(frame - de, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: x - 5, top: y - 5, width: w + 10, height: h + 10, boxSizing: "border-box", border: `3px solid ${VERDE}`, borderRadius: 10, boxShadow: "0 0 30px rgba(60,224,30,0.45)", opacity: k, zIndex: 7, pointerEvents: "none" }} />;
};
// cartão de explicação por cima da tela (fora da câmera)
const Cartao: React.FC<{ readonly de: number; readonly ate?: number; readonly x: number; readonly y: number; readonly w?: number; readonly rotulo?: string; readonly titulo: React.ReactNode; readonly texto?: React.ReactNode }> = ({ de, ate, x, y, w = 520, rotulo, titulo, texto }) => (
  <Surge de={de} ate={ate} style={{ left: x, top: y, width: w, zIndex: 40 }}>
    <div style={{ background: "rgba(11,11,12,0.94)", border: "2px solid rgba(60,224,30,0.55)", borderRadius: 16, padding: "20px 24px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
      {rotulo && <Etiqueta>{rotulo}</Etiqueta>}
      <div style={{ fontFamily, fontWeight: 800, fontSize: 32, color: "white", lineHeight: 1.15, marginTop: rotulo ? 8 : 0 }}>{titulo}</div>
      {texto && <div style={{ fontFamily, fontWeight: 600, fontSize: 24, color: CINZA, lineHeight: 1.3, marginTop: 8 }}>{texto}</div>}
    </div>
  </Surge>
);
const LISTA = [ACORDOS.a214, ACORDOS.a209, ACORDOS.a215, ACORDOS.a187];
const RESUMO = "55 acordo(s) · saldo R$ 296.250,00";

// ---------- formulário do treinamento: Bonificação em mercadoria (NF) mostra "Entra no estoque."
const EXPLICA = ["Entra no estoque."];
const DY = DY_EXPLICA(EXPLICA.length);
const CF = camposForm(DY);
const CFE = camposForm(DY, true);
const CONTATO = { email: "carla@tintashorizonte.com.br", nome: "Carla Mendes" };
const PRONTO = { abre: J, fornecedor: J, modalidade: J, forma: J, descricao: J, valor: J, prevista: J, anexa: J, salvar: NUNCA };
const FundoAcordos: React.FC = () => (
  <>
    <Cabecalho aba="Acordos" />
    <BarraAcordos resumo="54 acordo(s) · saldo R$ 272.250,00" />
    {[ACORDOS.a214, ACORDOS.a209, ACORDOS.a198, ACORDOS.a187].map((a, i) => (
      <CartaoAcordo key={a.codigo} a={a} i={i} apagado />
    ))}
  </>
);

// ======================= abertura
const AberturaT: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <>
      <FotoAna arquivo="ana-verde.jpg" x={120} dur={c.dur} />
      <Surge de={m("Oi") - 4} ate={m("Ana") - 6} style={{ left: 940, top: 300 }}>
        <div style={{ ...TITULO, fontSize: 150, ...textoDegrade }}>Oi!</div>
      </Surge>
      <Sequence from={m("Ana") - 4} layout="none">
        <TarjaAna x={940} y={230} />
      </Sequence>
      <Surge de={m("treinamento") - 4} style={{ left: 940, top: 420 }}>
        <Etiqueta>TREINAMENTO · PASSO A PASSO</Etiqueta>
      </Surge>
      <Surge de={m("Verbas") - 4} style={{ left: 940, top: 470 }}>
        <div style={{ ...TITULO, fontSize: 104, lineHeight: 1, color: "white" }}>VERBAS E</div>
        <div style={{ ...TITULO, fontSize: 104, lineHeight: 1.05, ...textoDegrade }}>ACORDOS</div>
      </Surge>
      <Surge de={m("Agentic") - 4} style={{ left: 940, top: 720 }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 420, marginLeft: -24 }} />
      </Surge>
      <Surge de={m("cadastro") - 4} style={{ left: 940, top: 850, width: 860 }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 34, color: CINZA }}>
          do cadastro do acordo até a <span style={{ color: VERDE }}>verba no caixa</span>
        </div>
      </Surge>
    </>
  );
};

// ======================= 1. Onde fica
const AbasT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const ic = ITEM_MENU_VERBAS("Inteligência Comercial");
  const menu = ITEM_MENU_VERBAS(MODULO);
  const alvos = [m("negociado"), m("recebido"), m("saldo"), m("venceu")];
  const destaque = alvos.reduce((d, f, i) => (frame >= f - 4 ? i : d), -1);
  const meioAbas = ABA("Caixa do ERP");
  const aceso = frame >= m("Inteligência") - 4 && frame < m("Verbas") - 2 ? "Inteligência Comercial" : frame >= m("Verbas") - 2 && frame < m("abas") ? MODULO : undefined;
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.15, 600, 560],
          [
            [m("menu"), 1.5, 360, (ic.y + menu.y) / 2],
            [m("abas"), 1.4, meioAbas.x + 60, meioAbas.y + 90],
            [m("Painel"), 1.05, 820, 500],
            ...alvos.map((f, i) => [f, 1.45, centroPainel(i)[0], centroPainel(i)[1]] as const),
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO} aceso={aceso}>
          <Cabecalho aba="Painel" acesa={frame >= m("Painel") - 4 && frame < alvos[0] - 6 ? "Painel" : undefined} />
          <TelaPainel conta={m("Painel")} destaque={destaque} />
        </Janela>
        <Cursor
          pontos={caminho(
            [700, 760],
            [
              [m("Inteligência"), ic.x, ic.y],
              [m("Verbas"), menu.x - 20, menu.y],
            ],
          )}
          cliques={[m("Inteligência"), m("Verbas")]}
        />
      </Camera>
    </AbsoluteFill>
  );
};

const PapelT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const altera = m("altera");
  const yTab = centroAcordo(1)[1];
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 480], [[altera, 1.3, AREA.x + COLUNA_X("comprador") + 40, yTab - 40], [m("assistente"), 1.05, 820, 440]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Acordos" />
          <BarraAcordos resumo={RESUMO} />
          {LISTA.map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} coluna={frame >= altera - 4 && frame < m("assistente") - 4 ? "comprador" : undefined} />
          ))}
        </Janela>
      </Camera>
      <Cartao de={m("vê") - 4} x={110} y={690} w={540} rotulo="COMPRADOR" titulo="Vê todos os acordos" texto={frame >= altera - 4 ? <>e altera só os que estão <span style={{ color: VERDE }}>no nome dele</span></> : undefined} />
      <Cartao de={m("assistente") - 4} x={690} y={690} w={540} rotulo="ASSISTENTE DE COMPRAS" titulo="Altera os acordos" texto="de todos os compradores" />
      <Cartao de={m("papel") - 4} x={1270} y={690} w={360} rotulo="SEM PAPEL" titulo="Só consulta" />
    </AbsoluteFill>
  );
};

// ======================= 2. Cadastrar um acordo
const NovoT: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  const clique = m("Novo") + 4;
  const f = { abre: clique + 4, fornecedor: m("fornecedor", 1), modalidade: m("modalidade"), forma: m("forma"), descricao: NUNCA, valor: NUNCA, prevista: NUNCA, anexa: NUNCA, salvar: NUNCA };
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1, 820, 480],
          [
            [clique, 1.3, BOTAO_NOVO.x - 200, BOTAO_NOVO.y + 120],
            [f.abre + 14, 1.32, 960, 400],
            [m("Embaixo"), 1.6, CF.explica.x - 40, CF.explica.y],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Acordos" />
          <BarraAcordos clique={clique} resumo="54 acordo(s) · saldo R$ 272.250,00" />
          {[ACORDOS.a214, ACORDOS.a209, ACORDOS.a198, ACORDOS.a187].map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} />
          ))}
          <ModalNovoAcordo m={f} dados={NOVO_TREIN} extras={{ explicacao: { de: f.forma + 6, linhas: EXPLICA } }} />
        </Janela>
        <Cursor
          pontos={caminho(
            [1150, 760],
            [
              [clique, BOTAO_NOVO.x, BOTAO_NOVO.y],
              [f.fornecedor, CF.fornecedor.x, CF.fornecedor.y],
              [f.modalidade, CF.modalidade.x, CF.modalidade.y],
              [f.forma, CF.forma.x, CF.forma.y],
            ],
          )}
          cliques={[clique, f.fornecedor, f.modalidade, f.forma]}
        />
      </Camera>
      <Cartao de={m("cota") - 4} ate={m("forma") - 6} x={1330} y={300} w={460} rotulo="MODALIDADE" titulo="Cota, bonificação, rapel…" texto="o tipo de verba combinada" />
    </AbsoluteFill>
  );
};

const Novo2T: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  const f = { ...PRONTO, descricao: m("escreve"), valor: m("valor"), prevista: m("prevista"), anexa: NUNCA };
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.32, 960, 400],
          [
            [m("escreve"), 1.45, CF.descricao.x, CF.descricao.y + 10],
            [m("negociação"), 1.45, 960, CF.valor.y - 70],
            [m("valor"), 1.5, CF.valor.x + 160, CF.valor.y],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <FundoAcordos />
          <ModalNovoAcordo m={f} dados={NOVO_TREIN} extras={{ explicacao: { de: J, linhas: EXPLICA }, evid: NUNCA }} />
        </Janela>
        <Cursor
          pontos={caminho(
            [1250, 820],
            [
              [m("escreve"), CF.descricao.x, CF.descricao.y],
              [f.valor, CF.valor.x, CF.valor.y],
              [f.prevista, CF.prevista.x, CF.prevista.y],
            ],
          )}
          cliques={[m("escreve"), f.valor, f.prevista]}
        />
      </Camera>
    </AbsoluteFill>
  );
};

const EvidenciaT: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  const f = { ...PRONTO, anexa: m("cada") - 4 };
  const evid = m("email");
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.32, 960, 480], [[m("Evidência"), 1.5, CF.evid().x, CF.evid().y], [m("Anexar"), 1.45, CF.anexarEm().x + 230, CF.anexarEm().y - 110]], c.dur)}>
        <Janela ativo={MODULO}>
          <FundoAcordos />
          <ModalNovoAcordo m={f} dados={NOVO_TREIN} extras={{ explicacao: { de: J, linhas: EXPLICA }, evid }} />
        </Janela>
        <Cursor
          pontos={caminho(
            [1250, 820],
            [
              [m("Evidência"), CF.evid().x, CF.evid().y],
              [m("Anexar"), CF.anexarEm().x, CF.anexarEm().y],
            ],
          )}
          cliques={[m("Evidência"), m("Anexar")]}
        />
      </Camera>
    </AbsoluteFill>
  );
};

const FORMAS = ["Bonificação em mercadoria (NF)", "Desconto em boleto / duplicata", "Depósito / PIX", "Desconto no pedido (NF de compra com desconto)", "Crédito / compensação", "Outro"];
const DescontoT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const abre = m("escolhe");
  const fecha = m("Nesse");
  const opcao = m("desconto", 1);
  const aberta = frame >= abre + 2 && frame < fecha;
  const item = { x: AREA.x + MODAL.x + 352 + 160, y: AREA.y + MODAL.y + 276 + 3 * 38 + 19 };
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.3, 960, 420], [[abre, 1.45, CF.forma.x - 40, CF.forma.y + 110], [fecha, 1, 960, 480]], c.dur)}>
        <Janela ativo={MODULO}>
          <FundoAcordos />
          <ModalNovoAcordo m={PRONTO} dados={NOVO_TREIN} extras={{ explicacao: { de: J, linhas: EXPLICA } }} />
          {aberta && (
            <div style={{ position: "absolute", left: MODAL.x + 352, top: MODAL.y + 276, width: 330, borderRadius: 8, background: "#1C201D", border: `1px solid ${COR.borda}`, boxShadow: "0 20px 50px rgba(0,0,0,0.6)", zIndex: 9, overflow: "hidden", fontFamily: fonteApp }}>
              {FORMAS.map((t, i) => {
                const aceso = i === 3 && frame >= opcao - 4;
                return (
                  <div key={t} style={{ height: 38, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", background: aceso ? "rgba(60,224,30,0.18)" : i === 0 ? "rgba(255,255,255,0.06)" : "transparent", boxShadow: aceso ? `inset 0 0 0 2px ${VERDE}` : "none" }}>
                    {t}
                  </div>
                );
              })}
            </div>
          )}
        </Janela>
        <Cursor pontos={caminho([1250, 820], [[abre, CF.forma.x, CF.forma.y], [opcao, item.x, item.y]])} cliques={[abre]} />
      </Camera>
      <Surge de={fecha - 6} style={{ left: 1350, top: 200, width: 530, zIndex: 40 }}>
        <div style={{ background: "rgba(11,11,12,0.94)", border: "2px solid rgba(60,224,30,0.55)", borderRadius: 16, padding: "22px 26px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
          <Etiqueta>DESCONTO NO PEDIDO</Etiqueta>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 22, color: CINZA, lineHeight: 1.35, marginTop: 10 }}>O fornecedor dá o desconto no preço do pedido; chega a NF de compra normal, já com o desconto. Reduz o custo da compra.</div>
          <div style={{ position: "relative", display: "inline-block", marginTop: 20, fontFamily, fontWeight: 800, fontSize: 30, color: frame >= m("não") ? "#8A8A8A" : "white" }}>
            NF de bonificação
            <div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 5, borderRadius: 3, background: COR.vermelho, transform: `scaleX(${interpolate(frame - m("não"), [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`, transformOrigin: "0 50%" }} />
          </div>
          {frame >= m("compra", 1) - 4 && (
            <div style={{ marginTop: 14, border: `2px solid ${VERDE}`, borderRadius: 12, padding: "14px 18px", fontFamily: fonteApp, opacity: interpolate(frame - m("compra", 1) + 4, [0, 8], [0, 1], { extrapolateRight: "clamp" }) }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "white" }}>NF de compra 4512</div>
              <div style={{ fontSize: 19, color: CINZA, marginTop: 4 }}>Produtos R$ 10.000,00</div>
              <div style={{ fontSize: 19, color: VERDE, fontWeight: 700 }}>− desconto da verba R$ 800,00</div>
            </div>
          )}
        </div>
      </Surge>
    </AbsoluteFill>
  );
};

const PARCELAS_T = [
  ["1/3", "30/11/26"],
  ["2/3", "31/12/26"],
  ["3/3", "31/01/27"],
] as const;
const ParceladoT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const marcaP = m("abaixo") + 6;
  const R0 = ROLA_FORM(false, DY);
  const R1 = ROLA_FORM(true, DY);
  const rola = interpolate(frame, [marcaP - 2, marcaP + 12], [R0, R1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cria = m("cria");
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.25, 960, 520],
          [
            [marcaP, 1.45, CF.parcelado(R1).x + 260, CF.parcelado(R1).y + 10],
            [m("número"), 1.5, CF.valorParc(R1).x, CF.parcelas(R1).y - 10],
            [cria, 1, 820, 480],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <FundoAcordos />
          <ModalNovoAcordo m={PRONTO} dados={NOVO_TREIN} rola={rola} parcelas={{ marca: marcaP, numero: m("número"), qtd: "3", valorDe: m("valor"), vencDe: m("vencimentos") }} extras={{ explicacao: { de: J, linhas: EXPLICA } }} />
        </Janela>
        <Cursor
          pontos={caminho(
            [1250, 820],
            [
              [marcaP, CF.parcelado(R0).x, CF.parcelado(R0).y],
              [m("número"), CF.parcelas(R1).x, CF.parcelas(R1).y],
              [m("valor"), CF.valorParc(R1).x, CF.valorParc(R1).y],
              [m("vencimentos"), CF.vencParc(R1).x, CF.vencParc(R1).y],
            ],
          )}
          cliques={[marcaP, m("número"), m("valor"), m("vencimentos")]}
        />
      </Camera>
      <Surge de={cria - 4} style={{ left: 1330, top: 200, zIndex: 40 }}>
        <div style={{ background: "rgba(11,11,12,0.94)", borderRadius: 16, padding: "20px 22px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", border: "2px solid rgba(60,224,30,0.55)" }}>
          <Etiqueta>UMA PARCELA POR MÊS</Etiqueta>
          {PARCELAS_T.map(([n, d], i) => {
            const s = interpolate(frame - cria - i * 5, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={n} style={{ opacity: s, transform: `scale(${0.8 + 0.2 * s})`, marginTop: 12, width: 420, border: `1px solid ${VERDE}`, background: "#14301A", borderRadius: 10, padding: "10px 16px", fontFamily: fonteApp, color: COR.texto, display: "flex", alignItems: "baseline", gap: 14 }}>
                <span style={{ fontSize: 18, color: VERDE, fontFamily: fonteMono }}>{n}</span>
                <span style={{ fontSize: 24, fontWeight: 700 }}>R$ 5.000,00</span>
                <span style={{ fontSize: 18, color: COR.suave, marginLeft: "auto" }}>{d}</span>
              </div>
            );
          })}
        </div>
      </Surge>
    </AbsoluteFill>
  );
};

const EMAIL_TREIN = {
  para: CONTATO.email,
  nome: "Carla",
  linhas: [
    ["Fornecedor", "Tintas Horizonte"],
    ["Modalidade", "Verba de aniversário de loja"],
    ["Combinado", "Cota de aniversário — 3x R$ 5 mil, NF de bonificação no fim do mês"],
    ["Valor negociado", "3x R$ 5.000,00"],
    ["Previsto para", "30/11/2026, 31/12/2026 e 31/01/2027"],
  ],
  recusa: "Combinamos 3x R$ 4 mil, não R$ 5 mil.",
} as const;
const AprovacaoT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = usaMarca(c);
  const sim = m("sim");
  const salva = m("salva");
  const recebe = m("recebe", 1);
  const R1 = ROLA_FORM(true, DY);
  const R2 = ROLA_FORM(true, DY, true);
  const rola = interpolate(frame, [sim + 2, sim + 16], [R1, R2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = interpolate(frame, [recebe - 8, recebe], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = spring({ frame: frame - recebe, fps, config: { damping: 18 } });
  const naoAprovar = m("não", 1);
  const dif = m("diferente");
  const sh = spring({ frame: frame - dif - 10, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill>
      {k > 0 && (
        <AbsoluteFill style={{ opacity: k }}>
          <Camera quadros={rota([1.3, 960, 560], [[m("pergunta"), 1.45, CF.aprov(R1, true).x, CF.aprov(R1, true).y], [m("confere"), 1.45, CFE.email(R2, true).x + 80, CFE.email(R2, true).y], [salva, 1.2, 960, 560]], c.dur)}>
            <Janela ativo={MODULO}>
              <FundoAcordos />
              <ModalNovoAcordo
                m={{ ...PRONTO, salvar: salva }}
                dados={NOVO_TREIN}
                rola={rola}
                parcelas={{ marca: J, numero: J, qtd: "3" }}
                extras={{ explicacao: { de: J, linhas: EXPLICA }, aprovSim: sim, contato: CONTATO, luzAprov: frame >= m("pergunta") - 4 && frame < sim - 4, luzEmail: frame >= m("confere") - 4 && frame < salva - 4 }}
              />
              <Aviso de={salva + 16} texto="Acordo ACD-0230 salvo · pedido de aprovação enviado à Carla" />
            </Janela>
            <Cursor
              pontos={caminho(
                [1250, 820],
                [
                  [sim, CF.sim(R1, true).x, CF.sim(R1, true).y],
                  [m("confere"), CFE.email(R2, true).x, CFE.email(R2, true).y],
                  [salva, CFE.salvarEm(R2, true).x, CFE.salvarEm(R2, true).y],
                ],
              )}
              cliques={[sim, salva]}
            />
          </Camera>
        </AbsoluteFill>
      )}
      {frame >= recebe - 2 && (
        <>
          <Surge de={recebe} style={{ left: 100, top: 96 }}>
            <Etiqueta>O QUE O FORNECEDOR RECEBE</Etiqueta>
          </Surge>
          <div style={{ position: "absolute", left: 100, top: 146, transform: `scale(${1.08 * (0.9 + 0.1 * s)})`, transformOrigin: "0 0", opacity: s }}>
            <EmailFornecedor naoAprovar={naoAprovar} loginAceso={frame >= m("login") - 4 && frame < naoAprovar - 4} dados={EMAIL_TREIN} />
          </div>
          {frame >= dif - 10 && (
            <div style={{ position: "absolute", right: 50, top: 540, width: 540, zIndex: 5, opacity: sh, transform: `translateX(${(1 - sh) * 80}px)`, background: COR.cartao, border: `2px solid ${VERDE}`, borderRadius: 14, padding: "24px 26px", fontFamily: fonteApp, color: COR.texto, boxShadow: "0 0 50px rgba(60,224,30,0.25)" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>ACD-0230 · Tratativas e histórico</div>
              <div style={{ borderLeft: `3px solid ${COR.vermelho}`, paddingLeft: 12, marginTop: 18 }}>
                <div style={{ fontSize: 15, color: COR.vermelho }}>13/11/26, 16:20 · Fornecedor não aprovou</div>
                <div style={{ fontSize: 19, marginTop: 4 }}>“{EMAIL_TREIN.recusa}” — Carla, Tintas Horizonte</div>
              </div>
            </div>
          )}
        </>
      )}
    </AbsoluteFill>
  );
};

const LimiteT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = usaMarca(c);
  const aprovado = frame >= m("aprovar") + 4;
  const s = spring({ frame: frame - 4, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1, 820, 480], [], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Acordos" />
          <BarraAcordos resumo={RESUMO} />
          {LISTA.map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} apagado />
          ))}
          <div style={{ position: "absolute", left: 370, top: 230, width: 600, boxSizing: "border-box", padding: "26px 30px", borderRadius: 14, background: COR.cartao, border: `2px solid ${aprovado ? VERDE : COR.amarelo}`, boxShadow: `0 0 50px ${aprovado ? "rgba(60,224,30,0.3)" : "rgba(245,184,46,0.3)"}`, opacity: s, transform: `scale(${0.9 + 0.1 * s})`, zIndex: 30 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 26, fontWeight: 600 }}>ACD-0231</span>
              <span style={{ fontSize: 19, fontWeight: 700, padding: "4px 12px", borderRadius: 6, background: aprovado ? "#14301A" : "#3A2E12", color: aprovado ? VERDE : COR.amarelo }}>{aprovado ? "No prazo" : "Em aprovação"}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 10 }}>Metais Prisma</div>
            <div style={{ fontSize: 18, color: COR.suave, marginTop: 4 }}>Cota de verão · NF de bonificação em janeiro</div>
            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 14 }}>R$ 60.000,00</div>
            <div style={{ marginTop: 16, fontSize: 18, padding: "10px 14px", borderRadius: 8, background: aprovado ? "#14301A" : "#3A2E12", color: aprovado ? VERDE : COR.amarelo, fontWeight: 600, ...luz(frame >= m("limite") - 4 && frame < m("aprovar"), COR.amarelo) }}>
              {aprovado ? "✓ Aprovado pela diretoria · Helena Duarte" : "Acima do limite de R$ 50.000 · aguardando a diretoria"}
            </div>
            {frame >= m("saldo") - 4 && <div style={{ marginTop: 12, fontSize: 18, color: VERDE, fontWeight: 700 }}>+ R$ 60.000,00 no saldo a receber</div>}
            {frame >= m("email") - 4 && <div style={{ marginTop: 8, fontSize: 18, color: COR.texto, fontWeight: 600 }}>✉ Pedido de aprovação ao fornecedor: enviado agora</div>}
          </div>
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= 3. Acompanhar
const SituacaoT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const col = m("situação", 1);
  const yTab = centroAcordo(1)[1];
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.05, 820, 520],
          [
            [m("busca"), 1.4, AREA.x + 200, AREA.y + 300],
            [m("filtros"), 1.3, AREA.x + 680, AREA.y + 330],
            [col, 1.3, AREA.x + COLUNA_X("situacao") + 160, yTab],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Acordos" />
          <BarraAcordos resumo={RESUMO} busca={frame >= m("busca") - 4 && frame < m("filtros") - 4} filtros={frame >= m("filtros") - 4 && frame < col - 4} />
          {LISTA.map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} coluna={frame >= col - 4 ? "situacao" : undefined} />
          ))}
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};

const SITUACOES: [string, string, string, string, string][] = [
  ["Vencido", "#3A1616", COR.vermelho, "O prazo passou e nada chegou", "Cobrar e registrar a cobrança"],
  ["Parcial – vencido", "#3A1616", COR.vermelho, "Chegou só uma parte", "Cobrar o restante"],
  ["Vence em breve", "#3A2E12", COR.amarelo, "O prazo está chegando", "Lembrar o fornecedor"],
  ["Pendente – sem prazo", "#3A2512", "#F5922E", "O acordo não tem data", "Combinar e preencher a data"],
  ["No prazo", "#14301A", VERDE, "Ainda dentro do combinado", "Nada por enquanto"],
  ["Liquidado", "#14301A", VERDE, "Chegou tudo", "Nada"],
  ["Recebido a maior", "#16243A", "#7FB2FF", "Chegou mais que o negociado", "Conferir se está no acordo certo"],
];
// quadro "o que fazer em cada situação": linhas [de, açãoDe] por índice; as que não estão em `marcas` ficam apagadas
const QuadroSituacoes: React.FC<{ readonly marcas: Record<number, readonly [number, number]> }> = ({ marcas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const atual = Object.entries(marcas).reduce((d, [i, [de]]) => (frame >= de - 4 ? Number(i) : d), -1);
  return (
    <>
      <Surge de={0} style={{ left: 140, top: 96 }}>
        <Etiqueta>O QUE FAZER EM CADA SITUAÇÃO</Etiqueta>
      </Surge>
      {SITUACOES.map(([t, fundo, cor, sig, acao], i) => {
        const mk = marcas[i];
        const sRow = mk ? spring({ frame: frame - mk[0] + 6, fps, config: { damping: 16 } }) : 1;
        const comAcao = mk ? frame >= mk[1] - 4 : true;
        const ativo = atual === i;
        const vivo = !!mk && frame >= mk[0] - 6;
        return (
          <div
            key={t}
            style={{
              position: "absolute",
              left: 120,
              top: 150 + i * 92,
              width: 1660,
              height: 80,
              boxSizing: "border-box",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              gap: 30,
              background: ativo ? "rgba(60,224,30,0.08)" : "rgba(255,255,255,0.03)",
              border: `2px solid ${ativo ? VERDE : "transparent"}`,
              opacity: !mk ? 0 : mk[0] < -100 ? 0.45 : vivo ? sRow : 0,
              transform: mk ? `translateX(${(1 - sRow) * -40}px)` : "none",
              fontFamily: fonteApp,
            }}
          >
            <span style={{ width: 320, flexShrink: 0 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: cor, background: fundo, padding: "6px 14px", borderRadius: 8, whiteSpace: "nowrap" }}>{t}</span>
            </span>
            <span style={{ width: 560, fontSize: 28, color: COR.texto }}>{sig}</span>
            <span style={{ fontSize: 30, fontWeight: 800, color: comAcao ? (ativo ? VERDE : "white") : "transparent", fontFamily }}>→ {acao}</span>
          </div>
        );
      })}
    </>
  );
};
const Situacao2T: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <QuadroSituacoes
      marcas={{
        0: [m("Vencido"), m("cobra")],
        1: [m("Parcial"), m("cobra", 1)],
        2: [m("breve"), m("lembra")],
        3: [m("sem"), m("combina")],
      }}
    />
  );
};
const Situacao3T: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <QuadroSituacoes
      marcas={{
        0: [-200, -200],
        1: [-200, -200],
        2: [-200, -200],
        3: [-200, -200],
        4: [m("prazo"), m("nada")],
        5: [m("liquidado"), m("tudo")],
        6: [m("recebido"), m("confere")],
      }}
    />
  );
};

// ======================= 4. Dentro do acordo
const PaginaT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const clique = m("código") + 4;
  const abre = clique + 6;
  const ev = m("evidências");
  const foco = agora<"recebimentos" | "saldo" | "aprovacao" | "evidencias" | null>(
    frame,
    [
      [m("recebimentos") - 6, "recebimentos"],
      [m("saldo") - 6, "saldo"],
      [ev - 6, "evidencias"],
      [m("aprovação") - 6, "aprovacao"],
    ],
    null,
  );
  const k = interpolate(frame, [abre - 6, abre, abre + 8], [1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const codigo = { x: AREA.x + 40 + 50, y: centroAcordo(0)[1] - 14 };
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.3, 640, 520],
          [
            [m("página"), 1, 820, 480],
            [m("recebimentos"), 1.45, PAGINA.recebimentos.x, PAGINA.recebimentos.y],
            [m("saldo"), 1.45, PAGINA.saldo.x + 200, PAGINA.saldo.y],
            [ev, 1.45, PAGINA.evidencias.x, PAGINA.evidencias.y],
            [m("aprovação"), 1.45, PAGINA.aprovacao.x, PAGINA.aprovacao.y],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <div style={{ position: "absolute", inset: 0, opacity: k }}>
            {frame < abre ? (
              <>
                <Cabecalho aba="Acordos" />
                <BarraAcordos resumo={RESUMO} />
                {LISTA.map((a, i) => (
                  <CartaoAcordo key={a.codigo} a={a} i={i} aceso={i === 0 && frame >= clique - 10} />
                ))}
              </>
            ) : (
              <PaginaAcordo foco={foco} anexos={[ev, ev + 5, ev + 10]} />
            )}
          </div>
        </Janela>
        <Cursor pontos={caminho([700, 700], [[clique, codigo.x, codigo.y]])} cliques={[clique]} />
      </Camera>
    </AbsoluteFill>
  );
};

const TratativasT = adapta(Tratativas, { histórico: ["Registrar"], substitui: [depois], velha: [depois], observações: [depois] });

const APROV_BOX = { x: 40, y: 456, w: 760, h: 150 };
const BTN_PEDIR = { x: AREA.x + APROV_BOX.x + 22 + 160, y: AREA.y + APROV_BOX.y + 96 + 20 };
const BTN_REENVIAR = { x: AREA.x + APROV_BOX.x + 360 + 170, y: BTN_PEDIR.y };
const Aprovacao2T: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const estados: [number, string, string, string][] = [
    [m("aprovou"), "✓ Aprovou", VERDE, "#14301A"],
    [m("aprovou", 1), "✗ Não aprovou", COR.vermelho, "#3A1616"],
    [m("respondeu"), "… Ainda não respondeu", COR.amarelo, "#3A2E12"],
  ];
  const atual = estados.reduce((d, [f], i) => (frame >= f - 4 ? i : d), -1);
  const pedir = m("Pedir");
  const reenviar = m("Reenviar");
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1, 820, 480], [[m("aprovação"), 1.55, PAGINA.aprovacao.x + 20, PAGINA.aprovacao.y + 20]], c.dur)}>
        <Janela ativo={MODULO}>
          <PaginaAcordo foco={null} anexos={[J, J, J]} />
          <Caixa x={APROV_BOX.x} y={APROV_BOX.y} w={APROV_BOX.w} h={APROV_BOX.h} aceso style={{ zIndex: 5 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Aprovação do fornecedor</div>
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              {estados.map(([f, t, cor, fundo], i) => (
                <span key={t} style={{ fontSize: 17, fontWeight: 700, padding: "5px 12px", borderRadius: 6, color: cor, background: fundo, opacity: frame >= f - 4 ? (atual === i ? 1 : 0.45) : 0.15, ...luz(atual === i, cor) }}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ position: "absolute", left: 22, top: 96, ...luz(frame >= pedir - 4 && frame < reenviar - 4) }}>
              <BotaoP x={0} y={0} w={320} h={40} clique={pedir}>
                Pedir aprovação do fornecedor
              </BotaoP>
            </div>
            <div style={{ position: "absolute", left: 360, top: 96, ...luz(frame >= reenviar - 4) }}>
              <BotaoP x={0} y={0} w={340} h={40} clique={reenviar}>
                Reenviar pedido de aprovação
              </BotaoP>
            </div>
          </Caixa>
        </Janela>
        <Cursor pontos={caminho([1100, 820], [[pedir, BTN_PEDIR.x, BTN_PEDIR.y], [reenviar, BTN_REENVIAR.x, BTN_REENVIAR.y]])} cliques={[pedir, reenviar]} />
      </Camera>
    </AbsoluteFill>
  );
};

const BTN_CANCELAR = { x: AREA.x + 1110 + 95, y: AREA.y + 30 + 24 };
const CancelarT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const clique = m("Cancelar");
  const confirma = m("apagado");
  const cancelado = frame >= confirma + 6;
  const reativa = m("reativado");
  const hist = m("histórico");
  const MC = { x: 380, y: 230, w: 600, h: 340 };
  const btnConfirma = { x: AREA.x + MC.x + MC.w - 28 - 95, y: AREA.y + MC.y + MC.h - 28 - 24 };
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.1, 960, 440], [[confirma + 8, 1.35, AREA.x + 700, AREA.y + 120], [hist, 1.45, PAGINA.tratativas.x, AREA.y + 290 + 230], [reativa, 1.45, BTN_CANCELAR.x - 160, BTN_CANCELAR.y + 80]], c.dur)}>
        <Janela ativo={MODULO}>
          <PaginaAcordo
            foco={frame >= hist - 4 && frame < reativa - 4 ? "tratativas" : null}
            anexos={[J, J, J]}
            status={cancelado ? { texto: "CANCELADO", cor: COR.suave, fundo: "#2A2D2B" } : undefined}
            botao={frame >= reativa - 4 ? { texto: "Reativar acordo", aceso: true } : { texto: "Cancelar acordo", clique }}
          />
          {frame >= hist - 4 && (
            <div style={{ position: "absolute", left: 842, top: 516, width: 436, height: 360, background: COR.cartao, zIndex: 6, opacity: interpolate(frame - hist + 4, [0, 8], [0, 1], { extrapolateRight: "clamp" }) }}>
              {(
                [
                  ["13/11/26, 11:40 · Marina Costa", "Acordo cancelado: fornecedor desistiu da campanha.", VERDE],
                  ["02/09/26, 16:40 · Fornecedor", "Carla Mendes aprovou o acordo pelo e-mail.", COR.borda],
                  ["28/08/26, 11:02 · Marina Costa", "Acordo cadastrado: 6 parcelas, vencimento no último dia do mês.", COR.borda],
                ] as const
              ).map(([d, t, cor]) => (
                <div key={d} style={{ borderLeft: `3px solid ${cor}`, paddingLeft: 12, marginBottom: 18 }}>
                  <div style={{ fontSize: 15, color: cor === VERDE ? VERDE : COR.suave }}>{d}</div>
                  <div style={{ fontSize: 18, marginTop: 4 }}>{t}</div>
                </div>
              ))}
            </div>
          )}
          <Modal de={clique + 4} fecha={confirma} x={MC.x} y={MC.y} w={MC.w} h={MC.h} titulo="Cancelar o acordo ACD-0214?" sub="O acordo não é apagado: fica no histórico e deixa de ser cobrado. Pode ser reativado depois.">
            <div style={{ position: "absolute", left: 28, top: 140, fontSize: 17, fontWeight: 600 }}>Motivo</div>
            <div style={{ position: "absolute", left: 28, top: 168, width: 544, height: 48, boxSizing: "border-box", border: `2px solid ${VERDE}`, borderRadius: 8, background: "#1C201D", padding: "0 14px", display: "flex", alignItems: "center", fontSize: 18 }}>
              <Digitando texto="Fornecedor desistiu da campanha" de={clique + 14} porFrame={1.4} />
            </div>
            <BotaoP x={MC.w - 28 - 190 - 140} y={MC.h - 28 - 48} w={130}>
              Voltar
            </BotaoP>
            <BotaoP x={MC.w - 28 - 190} y={MC.h - 28 - 48} w={190} cheio clique={confirma - 6}>
              Cancelar acordo
            </BotaoP>
          </Modal>
        </Janela>
        <Cursor pontos={caminho([1100, 700], [[clique, BTN_CANCELAR.x, BTN_CANCELAR.y], [confirma - 6, btnConfirma.x, btnConfirma.y], [reativa, BTN_CANCELAR.x, BTN_CANCELAR.y]])} cliques={[clique, confirma - 6]} />
      </Camera>
      <Cartao de={m("cobrado") - 4} x={110} y={700} w={560} titulo="Sai da cobrança" texto="e do e-mail semanal do comprador" />
    </AbsoluteFill>
  );
};

// ======================= 5. Caixa do ERP
const CaixaT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const luzes = acesas(frame, [[m("notas") - 4, m("Pendentes") - 4, ["grupo0", "grupo1"]]]);
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1, 820, 480],
          [
            [m("Caixa"), 1.05, 820, 500],
            [m("busca"), 1.3, 760, AREA.y + 600],
            [m("Pendentes"), 1.5, AREA.x + 300, AREA.y + 300],
            [m("nada"), 1.05, 820, 520],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Caixa do ERP" acesa={frame >= m("Caixa") - 4 && frame < m("Você") ? "Caixa do ERP" : undefined} />
          <TelaCaixa luzes={luzes} />
          <Brilho x={40} y={262} w={190} h={48} de={m("Pendentes") - 4} ate={m("nada") - 4} />
        </Janela>
      </Camera>
      <Cartao de={m("nada") - 4} x={110} y={690} w={620} rotulo="IMPORTANTE" titulo="Nada entra no saldo" texto="antes de alguém decidir" />
    </AbsoluteFill>
  );
};

const Caixa2T: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const luzes = acesas(frame, [
    [m("bonificação") - 4, m("descontos") - 4, ["sub0"]],
    [m("descontos") - 4, m("outros") - 4, ["sub1"]],
    [m("outros") - 4, m("agrupadas") - 4, ["sub2"]],
    [m("agrupadas") - 4, m("filtrar") - 4, ["grupo0", "grupo1"]],
  ]);
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.05, 820, 500],
          [
            [m("três"), 1.45, AREA.x + 420, AREA.y + 360],
            [m("agrupadas"), 1.2, 820, AREA.y + 600],
            [m("filtrar"), 1.5, AREA.x + 340, AREA.y + 300],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Caixa do ERP" />
          <TelaCaixa luzes={luzes} />
          <Brilho x={240} y={262} w={190} h={48} de={m("filtrar") - 4} />
        </Janela>
      </Camera>
      <Cartao de={m("fora") - 4} ate={m("agrupadas") - 4} x={1240} y={540} w={560} rotulo="OUTROS DESCONTOS" titulo="Ficam fora da fila" texto="desconto comercial ou de pontualidade, de fornecedor sem acordo" />
    </AbsoluteFill>
  );
};

const ProdutosT = adapta(Produtos, { produtos: ["produtos"], nota: ["impostos"], Por: ["total"], conta: ["produtos"], total: ["total"], acordo: ["valor"] });

const SugestaoT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const R = ROLA_GRUPO(1);
  const azul = m("Azul");
  const trac = m("tracejado");
  const rola = interpolate(frame, [azul - 14, azul], [0, R], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const luzes = acesas(frame, [
    [m("sugestão") - 4, m("motivo") - 4, ["sug0"]],
    [m("motivo") - 4, m("confiança") - 4, ["mot0"]],
    [m("confiança") - 4, m("Verde") - 4, ["conf0"]],
    [m("Verde") - 4, azul - 4, ["sug0", "conf0"]],
    [azul - 4, trac - 4, ["sug2", "conf2"]],
    [trac - 4, NUNCA, ["sug3", "conf3"]],
  ]);
  const chips: [number, string, string, boolean][] = [
    [m("Verde"), "Confiança alta", VERDE, false],
    [azul, "Confiança média", "#7FB2FF", false],
    [trac, "Palpite: decida você", COR.suave, true],
  ];
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.1, 820, 560],
          [
            [m("sugestão"), 1.5, NOTA.sugestao(0).x - 60, NOTA.sugestao(0).y + 10],
            [azul, 1.45, NOTA.sugestao(2, R).x - 80, NOTA.sugestao(2, R).y + 20],
            [trac, 1.45, NOTA.sugestao(3, R).x - 80, NOTA.sugestao(3, R).y + 20],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Caixa do ERP" />
          <TelaCaixa luzes={luzes} rola={rola} />
        </Janela>
      </Camera>
      <div style={{ position: "absolute", left: 80, top: 790, display: "flex", gap: 16, zIndex: 40 }}>
        {chips.map(([f, t, cor, tracejado]) => (
          <Surge key={t} de={f - 4} style={{ position: "relative" }}>
            <div style={{ background: "rgba(11,11,12,0.94)", border: `3px ${tracejado ? "dashed" : "solid"} ${cor}`, borderRadius: 12, padding: "12px 20px", fontFamily, fontWeight: 800, fontSize: 28, color: cor }}>{t}</div>
          </Surge>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const AceitarT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const aceita = m("Aceitar");
  const todas = m("aceita");
  const ia = m("inteligência");
  const estados: EstadoNota[] = [frame >= aceita + 6 ? { tipo: "aceito", de: aceita + 6 } : { tipo: "pendente" }, frame >= todas + 6 ? { tipo: "aceito", de: todas + 6 } : { tipo: "pendente" }];
  const luzes = acesas(frame, [
    [m("certa") - 4, aceita, ["sug0"]],
    [m("cabeçalho") - 4, todas + 4, ["gac0"]],
  ]);
  const a0 = NOTA.aceitar(0);
  const g0 = NOTA.grupoAceitar(0);
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.15, 820, 600],
          [
            [aceita, 1.4, a0.x - 180, a0.y + 70],
            [m("cabeçalho"), 1.35, g0.x - 260, NOTA.grupo(0).y + 170],
            [ia, 1.3, 820, AREA.y + 420],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Caixa do ERP" />
          <TelaCaixa estados={estados} luzes={luzes} cliques={{ aceitar0: aceita, grupo0: todas }} />
          {frame < todas && <Aviso de={aceita + 8} texto="ACD-0215: saldo de R$ 24.000 para R$ 10.000" />}
          {frame >= todas && frame < ia && <Aviso de={todas + 8} texto="ACD-0215: saldo de R$ 10.000 para R$ 4.000" />}
          <Brilho x={40} y={378} w={1260} h={56} de={ia - 4} />
        </Janela>
        <Cursor pontos={caminho([1100, 820], [[aceita, a0.x, a0.y], [todas, g0.x, g0.y]])} cliques={[aceita, todas]} />
      </Camera>
      <Cartao de={ia - 4} x={110} y={640} w={560} rotulo="✦ INTELIGÊNCIA ARTIFICIAL" titulo="Analisa as notas novas de 30 em 30 min" texto={frame >= m("aprende") - 4 ? "e aprende com as suas decisões" : undefined} />
    </AbsoluteFill>
  );
};

const SaidasT = adapta(Saidas, {
  Aceitar: [-60],
  todas: [-50],
  sugestão: [-80],
  alta: [-70],
  preferir: ["preferir"],
  lança: ["Lançar"],
  divide: ["Dividir"],
  retroativo: ["retroativo"],
  ignora: ["Ignorar"],
  motivo: ["motivo"],
  ensina: [depois],
});

const AjusteT = adapta(Ajuste, { existe: [depois], cadastra: [depois], retroativo: [depois] });

// nota sem fornecedor no módulo: a sugestão de vínculo, o seletor e o Vincular
const VincularT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const escolhe = m("escolhe");
  const vincula = m("Vincular");
  const feito = frame >= vincula + 6;
  const lanc = m("Lançadas");
  const aberta = frame >= lanc - 6;
  const G = { y: 444 };
  const N = { y: 496 };
  const DX = 810;
  const sel = { x: AREA.x + 40 + DX + 200, y: AREA.y + N.y + 128 + 19 };
  const btnV = { x: AREA.x + 40 + DX + 474 - 60, y: AREA.y + N.y + 174 + 17 };
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.1, 900, 560], [[m("sem"), 1.4, 760, AREA.y + 560], [escolhe, 1.45, sel.x - 100, sel.y - 40], [m("próximas"), 1.2, 900, 560], [lanc, 1.4, AREA.x + 260, AREA.y + 400]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Caixa do ERP" />
          <div style={{ position: "absolute", left: 28, top: 250, width: 724, height: 72, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
          <Seletor x={40} y={262} w={190} texto="Pendentes" aceso={aberta} />
          <Seletor x={240} y={262} w={190} texto="(Sem fornecedor no módulo)" />
          <Seletor x={440} y={262} w={190} texto="Todo comprador" />
          <BotaoP x={640} y={262} w={100} cheio>
            Filtrar
          </BotaoP>
          <div style={{ position: "absolute", left: 40, top: 340, fontSize: 18, lineHeight: 1.4, width: 1260 }}>
            <b>1</b> nota(s) pendentes de fornecedor que ainda não está no módulo. Vincule ao fornecedor certo: vale para as próximas notas dele.
          </div>
          <div style={{ position: "absolute", left: 40, top: G.y, width: 1260, height: 52, borderTop: `1px solid ${COR.borda}`, background: "rgba(255,255,255,0.025)", fontSize: 19, fontWeight: 700, padding: "14px 16px", boxSizing: "border-box" }}>
            Metalúrgica Vale S/A (sem fornecedor no módulo)
            <span style={{ position: "absolute", right: 16, top: 16, fontSize: 15, fontWeight: 400, color: COR.suave }}>1 nota(s) · R$ 2.150,00</span>
          </div>
          <div style={{ position: "absolute", left: 40, top: N.y, width: 1260, height: 236, borderTop: `1px solid ${COR.borda}`, background: feito ? "rgba(60,224,30,0.06)" : "transparent" }}>
            <div style={{ position: "absolute", left: 16, top: 14, fontSize: 19 }}>05/11/2026</div>
            <div style={{ position: "absolute", left: 16, top: 42, fontSize: 15, color: COR.suave }}>NF 77812 · filial 01</div>
            <div style={{ position: "absolute", left: 160, top: 12, fontSize: 19, fontWeight: 700, color: feito ? COR.texto : COR.amarelo, padding: "1px 6px", ...luz(frame >= m("sem") - 4 && frame < escolhe - 4, COR.amarelo) }}>{feito ? "Metais Prisma" : "Sem fornecedor no módulo"}</div>
            <div style={{ position: "absolute", left: 166, top: 44, fontSize: 14, color: COR.suave }}>ERP: METALURGICA VALE S/A</div>
            <div style={{ position: "absolute", right: 1260 - 750, top: 14, fontSize: 21, fontWeight: 700 }}>R$ 2.150,00</div>
            {feito ? (
              <div style={{ position: "absolute", left: DX, top: 74, width: 440, fontSize: 19, fontWeight: 700, color: VERDE }}>✓ Vinculada a Metais Prisma · vale para as próximas notas</div>
            ) : (
              <>
                <div style={{ position: "absolute", left: DX, top: 10, width: 474, height: 108, boxSizing: "border-box", borderRadius: 8, border: `1px solid ${VERDE}`, background: `${VERDE}14` }}>
                  <div style={{ position: "absolute", left: 12, top: 9, fontSize: 15 }}>
                    <b>Vincular a Metais Prisma</b> <span style={{ color: COR.suave }}>· confiança alta</span>
                  </div>
                  <BotaoP x={474 - 12 - 92} y={6} w={92} h={36} cheio>
                    Aceitar
                  </BotaoP>
                  <div style={{ position: "absolute", left: 12, right: 12, top: 52, fontSize: 14, color: COR.suave, lineHeight: 1.35 }}>Mesma raiz de CNPJ de Metais Prisma (outra filial do mesmo fornecedor).</div>
                </div>
                <Seletor x={DX} y={128} w={474} h={38} texto={frame >= escolhe + 4 ? "Metais Prisma" : "Fornecedor no módulo…"} aceso={frame >= escolhe - 4 && frame < vincula} />
                {frame >= escolhe + 4 && (
                  <BotaoP x={DX} y={174} w={474} h={34} cheio clique={vincula}>
                    Vincular
                  </BotaoP>
                )}
                <div style={{ position: "absolute", left: DX, top: 216, fontSize: 15, color: COR.suave }}>Ignorar</div>
              </>
            )}
          </div>
          {aberta && (
            <div style={{ position: "absolute", left: 40, top: 312, width: 190, borderRadius: 8, background: "#1C201D", border: `1px solid ${COR.borda}`, boxShadow: "0 20px 50px rgba(0,0,0,0.6)", zIndex: 9, overflow: "hidden" }}>
              {["Pendentes", "Lançadas", "Ignoradas", "Todas"].map((t, i) => {
                const aceso = (i === 1 && frame >= lanc - 4) || (i === 2 && frame >= m("Ignoradas") - 4);
                return (
                  <div key={t} style={{ height: 40, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 17, background: aceso ? "rgba(60,224,30,0.18)" : "transparent", boxShadow: aceso ? `inset 0 0 0 2px ${VERDE}` : "none" }}>
                    {t}
                  </div>
                );
              })}
            </div>
          )}
        </Janela>
        <Cursor pontos={caminho([1200, 820], [[escolhe, sel.x, sel.y], [vincula, btnV.x, btnV.y], [lanc, AREA.x + 135, AREA.y + 286]])} cliques={[escolhe, vincula, lanc]} />
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= 6. Recebimentos
const ManualT: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  const clique = m("Lançar");
  const desconto = m("desconto");
  const f = { abre: clique + 4, acordo: m("acordo"), valor: m("valor"), forma: m("tipo"), numero: m("número"), dividir: NUNCA, lancar: desconto - 14 };
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 480], [[clique, 1.3, BOTAO_LANCAR_REC.x - 260, BOTAO_LANCAR_REC.y + 140], [f.acordo, 1.22, 960, 430], [f.forma, 1.22, 960, 540], [desconto, 1, 820, 480]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Recebimentos" />
          <TelaRecebimentos clique={clique} />
          <ModalRecebimento m={f} />
          <Aviso de={f.lancar + 12} texto="Recebimento lançado no ACD-0187" />
        </Janela>
        <Cursor
          pontos={caminho(
            [1300, 700],
            [
              [clique, BOTAO_LANCAR_REC.x, BOTAO_LANCAR_REC.y],
              [f.acordo, REC.acordo.x, REC.acordo.y],
              [f.valor, REC.valor.x, REC.valor.y],
              [f.forma, REC.forma.x, REC.forma.y],
              [f.numero, REC.numero.x, REC.numero.y],
              [f.lancar, REC.lancar.x, REC.lancar.y],
            ],
          )}
          cliques={[clique, f.acordo, f.valor, f.forma, f.numero, f.lancar]}
        />
      </Camera>
      <Cartao de={desconto - 4} x={1220} y={250} w={600} rotulo="DESCONTO NO PEDIDO" titulo="Tipo: NF de compra com desconto (pedido)" texto="e o valor é o do desconto" />
    </AbsoluteFill>
  );
};

const RecebimentosT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const entre = (de: number, ate: number) => frame >= de && frame < ate;
  const avisosX = janela(40 + 100 + 240 + 140 + 150 + 180 + 110 + 75, 0).x;
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.05, 820, 520],
          [
            [m("resolver"), 1.45, RECEB.aba.x + 300, RECEB.aba.y + 60],
            [m("conferência"), 1.4, RECEB.financeiro.x - 220, RECEB.financeiro.y - 80],
            [m("divergente"), 1.35, 900, RECEB.linha(2).y],
            [m("avisos"), 1.4, avisosX - 100, RECEB.linha(1).y],
            [m("Todos"), 1.45, RECEB.aba.x + 250, RECEB.aba.y + 60],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Recebimentos" acesa={frame < m("resolver") - 4 ? "Recebimentos" : undefined} />
          <TelaRecebimentos abaAcesa={entre(m("resolver") - 4, m("conferência") - 4)} finAceso={entre(m("conferência") - 4, m("divergente") - 4)} linhaAcesa={entre(m("divergente") - 4, m("avisos") - 4) ? 2 : undefined} avisoAceso={entre(m("avisos") - 4, m("certo") - 4)} />
          <Brilho x={196} y={378} w={128} h={38} de={m("Todos") - 4} />
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};

const UsarT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const corrige = m("clique");
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 520], [[m("acordo"), 1.4, AREA.x + 360, RECEB.linha(1).y], [m("impostos"), 1.45, RECEB.usar.x - 260, RECEB.usar.y + 20]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Recebimentos" />
          <TelaRecebimentos avisoAceso={frame >= m("impostos") - 4 && frame < corrige} corrige={corrige} />
          <Brilho x={140} y={512} w={240} h={396} de={m("acordo") - 4} ate={m("impostos") - 4} />
          <Aviso de={corrige + 10} texto="Corrigido para o valor dos produtos" />
        </Janela>
        <Cursor pontos={caminho([1300, 820], [[corrige, RECEB.usar.x, RECEB.usar.y]])} cliques={[corrige]} />
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= 7. Fornecedores e Pendências
const FornecedoresT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const contato = m("contato");
  const nome = { x: AREA.x + 40 + 80, y: AREA.y + 436 + 31 };
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 520], [[m("posição"), 1.3, AREA.x + 720, AREA.y + 560], [m("comprador"), 1.45, AREA.x + 440, AREA.y + 560], [contato, 1.1, 860, 520]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Fornecedores" acesa={frame < m("posição") - 4 ? "Fornecedores" : undefined} />
          <TelaFornecedores compradorAceso={frame >= m("comprador") - 4 && frame < contato - 4} />
          <Brilho x={440} y={392} w={570} h={44 + 62 * FORNECEDORES.length} de={m("posição") - 4} ate={m("comprador") - 4} />
          {frame >= contato && (
            <Caixa x={640} y={470} w={620} h={190} aceso style={{ zIndex: 8, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{FORNECEDORES[0].nome} · Contato</div>
              <div style={{ fontSize: 20, marginTop: 16 }}>Carla Mendes · comercial</div>
              <div style={{ fontSize: 20, marginTop: 6, color: VERDE }}>✉ {CONTATO.email}</div>
              <div style={{ fontSize: 16, marginTop: 12, color: COR.suave }}>É para este e-mail que vai o pedido de aprovação dos acordos.</div>
            </Caixa>
          )}
        </Janela>
        <Cursor pontos={caminho([1200, 820], [[contato - 4, nome.x, nome.y]])} cliques={[contato - 4]} />
      </Camera>
    </AbsoluteFill>
  );
};

const PendenciasT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const foco = agora<FocoPend>(
    frame,
    [
      [m("tipo") - 4, "tipo"],
      [m("prioridade") - 4, "prioridade"],
      [m("impacto") - 4, "valor"],
      [m("veio") - 4, "origem"],
      [m("feito") - 4, "tratamento"],
      [m("ação") - 4, "acao"],
    ],
    null,
  );
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 520], [[m("tipo"), 1.5, AREA.x + 400, AREA.y + 440], [m("veio"), 1.5, AREA.x + 400, AREA.y + 500]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Pendências" acesa={frame < m("tipo") - 10 ? "Pendências" : undefined} />
          <TelaPendencias2 foco={foco} />
        </Janela>
      </Camera>
      <Cartao de={m("migração") - 4} ate={m("tipo") - 8} x={1180} y={640} w={620} rotulo="PENDÊNCIAS" titulo="Pontos da migração das planilhas antigas" texto="que o sistema não conseguiu resolver sozinho" />
    </AbsoluteFill>
  );
};

const Pendencias2T: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const reg = m("registrar");
  const status = m("status");
  const resp = m("responsável");
  const luzP = agora<"decisao" | "status" | "resp" | null>(frame, [[reg - 4, "decisao"], [status - 4, "status"], [resp - 4, "resp"]], null);
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 520], [[reg, 1.5, AREA.x + 1000, AREA.y + 470], [resp, 1.45, AREA.x + 1040, AREA.y + 450]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Pendências" />
          <TelaPendencias2 acao={{ decisao: reg + 6, status: status + 8, resp: resp + 8, luz: luzP }} />
        </Janela>
        <Cursor pontos={caminho([1200, 820], [[reg, PEND.decisao.x, PEND.decisao.y], [status, PEND.status.x, PEND.status.y], [resp, PEND.resp.x, PEND.resp.y]])} cliques={[reg, status, resp]} />
      </Camera>
      <Cartao de={m("correção") - 4} ate={m("volta") - 4} x={1180} y={620} w={620} rotulo="1 · CORRIGE NO LUGAR CERTO" titulo="No acordo ou no recebimento" texto="ex.: as datas das parcelas no ACD-0208" />
    </AbsoluteFill>
  );
};

// ======================= 8. Verbas em conta corrente
const ContasT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const video = m("vídeo");
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 500], [[m("Verbas"), 1.15, 820, 480], [video, 1, 820, 480]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Verbas" acesa={frame >= m("Verbas") - 4 && frame < video - 4 ? "Verbas" : undefined} />
          <TelaContas criada={J} />
        </Janela>
      </Camera>
      <Cartao de={m("café") - 4} ate={m("Verbas") - 4} x={110} y={620} w={560} rotulo="VERBA PARA GASTAR" titulo="Café da manhã, premiação…" texto="conforme a necessidade, sem vencimento" />
      <Surge de={video - 4} style={{ left: 1060, top: 300, width: 760, zIndex: 40 }}>
        <div style={{ background: "rgba(11,11,12,0.95)", border: "2px solid rgba(60,224,30,0.6)", borderRadius: 18, padding: 18, boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}>
          <Etiqueta>TEM UM VÍDEO SÓ SOBRE ELA</Etiqueta>
          <Img src={staticFile("midia/capa-contas-de-verba.png")} style={{ width: 724, borderRadius: 10, marginTop: 12, display: "block" }} />
          <div style={{ fontFamily, fontWeight: 800, fontSize: 28, color: "white", marginTop: 12 }}>Verbas em conta corrente · passo a passo</div>
        </div>
      </Surge>
    </AbsoluteFill>
  );
};

// ======================= 9. Vários de uma vez
const PlanilhaBase = adapta(Planilha, { Exporta: ["Exportar"], Antes: [depois], cadastrar: [depois], alterar: [depois], mudança: [depois], erro: [depois] }, 100);
const PlanilhaT: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <>
      <PlanilhaBase c={c} />
      <Cartao de={m("código") - 4} x={1250} y={620} w={570} rotulo="LINHA COM CÓDIGO" titulo="ACD-0221 → altera o que já existe" />
      <Cartao de={m("código", 1) - 4} x={1250} y={780} w={570} rotulo="LINHA SEM CÓDIGO" titulo="cadastra um novo" />
    </>
  );
};
const ConferirBase = adapta(
  Planilha,
  { Exporta: [-300], importa: [-200], volta: [-150], acordos: [-400, -390], recebimentos: [-380], Antes: ["Conferir"], cadastrar: ["cadastrar"], alterar: ["alterar"], mudança: ["mudança"], erro: ["erro"] },
  100,
);
const ConferirT: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <>
      <ConferirBase c={c} />
      <Cartao de={m("Célula") - 4} x={110} y={700} w={560} rotulo="PODE FICAR TRANQUILO" titulo="Célula vazia não apaga nada" />
      <Cartao de={m("importado") - 4} x={700} y={700} w={620} rotulo="ACORDO IMPORTADO" titulo="Não manda e-mail de aprovação" texto="se precisar, peça pela página do acordo" />
    </>
  );
};

// ======================= 10. E-mail e rotina
const EmailT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const botao = m("botão");
  const foco = agora<FocoComprador>(frame, [[m("vencidos") - 6, "vencidos"], [m("vencem") - 6, "breve"], [m("prazo") - 6, "semprazo"], [m("respostas") - 6, "respostas"], [m("notas") - 6, "notas"], [botao - 4, null]], null);
  return (
    <>
      <RolaEmail quadros={[[0, 0.95, 470], ...secao(m("vencidos"), 1.25, 380), ...secao(m("vencem"), 1.25, 495), ...secao(m("prazo"), 1.25, 615), ...secao(m("respostas"), 1.25, 740), ...secao(m("notas"), 1.25, 865), ...secao(botao, 0.95, 500)]}>
        <EmailComprador foco={foco} />
      </RolaEmail>
      <Selo de={m("oito") - 4} y={160}>
        Toda semana,
        <br />
        às 8h
      </Selo>
      <Selo de={botao - 4} y={420}>
        O botão abre
        <br />o módulo filtrado
      </Selo>
    </>
  );
};

const OlhoT = adapta(OlhoVerbas, { enxerga: ["consulta"] });

const RotinaT: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = usaMarca(c);
  const itens: [number, string][] = [
    [m("lê"), "Ler o e-mail semanal"],
    [m("cobra"), "Cobrar os vencidos e registrar a cobrança"],
    [m("combina"), "Combinar a data dos acordos sem prazo"],
    [m("resolve"), "Resolver a Caixa do ERP"],
    [m("vê"), "Ver as respostas dos fornecedores"],
    [m("corrige"), "Corrigir o que está em A resolver"],
    [m("cadastra"), "Cadastrar no mesmo dia todo acordo novo"],
  ];
  return (
    <>
      <Surge de={0} style={{ left: 120, top: 150 }}>
        <Etiqueta>ROTINA DA SEMANA</Etiqueta>
        <div style={{ ...TITULO, fontSize: 150, lineHeight: 1, marginTop: 14, ...textoDegrade }}>10 min</div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 34, color: CINZA, marginTop: 6 }}>por semana, no dia do e-mail</div>
      </Surge>
      <div style={{ position: "absolute", left: 780, top: 120, width: 1040 }}>
        {itens.map(([f, t], i) => {
          const s = spring({ frame: frame - 4 - i * 3, fps, config: { damping: 18 } });
          const feito = frame >= f;
          const k = spring({ frame: frame - f, fps, config: { damping: 12, stiffness: 180 } });
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 24, height: 96, borderBottom: "1px solid rgba(255,255,255,0.08)", opacity: s }}>
              <div style={{ width: 58, height: 58, flexShrink: 0, borderRadius: 14, border: `3px solid ${feito ? VERDE : "#444"}`, background: feito ? VERDE : "transparent", display: "grid", placeItems: "center", color: "#0B0B0C", fontSize: 38, fontWeight: 900, transform: `scale(${feito ? 0.8 + 0.2 * k : 1})`, boxShadow: feito ? "0 0 26px rgba(60,224,30,0.5)" : "none" }}>
                {feito ? "✓" : ""}
              </div>
              <div style={{ fontFamily, fontWeight: 800, fontSize: 34, color: feito ? "white" : "rgba(255,255,255,0.45)" }}>{t}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ======================= 11. Dúvidas comuns
const Duvida: React.FC<{ readonly de: number; readonly deResp: number; readonly y: number; readonly pergunta: string; readonly resposta: React.ReactNode; readonly extra?: React.ReactNode }> = ({ de, deResp, y, pergunta, resposta, extra }) => {
  const frame = useCurrentFrame();
  return (
    <Surge de={de} style={{ left: 140, top: y, width: 1640 }}>
      <div style={{ display: "flex", gap: 30, background: "#141815", border: "2px solid rgba(60,224,30,0.35)", borderRadius: 22, padding: "30px 36px" }}>
        <div style={{ width: 76, height: 76, flexShrink: 0, borderRadius: 38, background: VERDE, color: FUNDO, display: "grid", placeItems: "center", ...TITULO, fontSize: 50 }}>?</div>
        <div>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 44, color: "white", lineHeight: 1.1 }}>{pergunta}</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 30, color: CINZA, lineHeight: 1.35, marginTop: 14, opacity: interpolate(frame - deResp, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{resposta}</div>
          {extra}
        </div>
      </div>
    </Surge>
  );
};
const Chip: React.FC<{ readonly de: number; readonly children: React.ReactNode }> = ({ de, children }) => {
  const frame = useCurrentFrame();
  if (frame < de) return null;
  return <div style={{ display: "inline-block", marginTop: 14, background: VERDE, color: FUNDO, fontFamily, fontWeight: 800, fontSize: 26, padding: "8px 18px", borderRadius: 10, opacity: interpolate(frame - de, [0, 6], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</div>;
};
const DuvidasT: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <>
      <Surge de={m("dúvidas") - 6} style={{ left: 140, top: 110 }}>
        <Etiqueta>DÚVIDAS COMUNS</Etiqueta>
      </Surge>
      <Duvida de={m("consegue") - 6} deResp={m("edita") - 4} y={170} pergunta="Não consigo editar um acordo" resposta={<>Você só edita os seus. Se o acordo é seu e está com outro nome, <span style={{ color: VERDE }}>peça ao Admin para trocar</span>.</>} />
      <Duvida
        de={m("lançou") - 6}
        deResp={m("avisa") - 4}
        y={400}
        pergunta="Lancei uma nota no acordo errado"
        resposta={<>Avise o financeiro ou o Admin: ele corrige, com o motivo registrado.</>}
        extra={
          <div>
            <Chip de={m("nada") - 4}>Nada no módulo é apagado</Chip>
          </div>
        }
      />
    </>
  );
};
const Duvidas2T: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <>
      <Surge de={0} style={{ left: 140, top: 110 }}>
        <Etiqueta>DÚVIDAS COMUNS</Etiqueta>
      </Surge>
      <Duvida de={m("nota") - 6} deResp={m("busca") - 4} y={170} pergunta="A nota não apareceu na Caixa do ERP" resposta={<>O sistema busca as notas algumas vezes por dia. Olhe também as outras abas e as <span style={{ color: VERDE }}>Ignoradas</span> antes de avisar o Admin.</>} />
      <Duvida de={m("fornecedor") - 6} deResp={m("confere") - 4} y={430} pergunta="O fornecedor não recebeu o e-mail de aprovação" resposta={<>Confira o endereço, use <span style={{ color: VERDE }}>Reenviar pedido de aprovação</span> e peça para ele olhar o spam.</>} />
    </>
  );
};

// ======================= 12. Configurações
const Config2T = adapta(Config2, { emails: [depois], teste: [depois] });
const Config3T: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  const teste = m("teste");
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 560], [[m("aprovação"), 1.45, AREA.x + 330, AREA.y + 760], [m("alertas"), 1.45, AREA.x + 900, AREA.y + 760], [teste, 1.35, AREA.x + 420, AREA.y + 800]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Configurações" />
          <TelaParametros foco="emails" teste={teste} />
          <Brilho x={58} y={698} w={540} h={96} de={m("aprovação") - 4} ate={m("alertas") - 4} />
          <Brilho x={676} y={698} w={480} h={96} de={m("alertas") - 4} ate={teste - 4} />
        </Janela>
        <Cursor pontos={caminho([1100, 900], [[teste, BOTAO_TESTE.x, BOTAO_TESTE.y]])} cliques={[teste]} />
      </Camera>
    </AbsoluteFill>
  );
};

// ======================= encerramento
const FimT: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <>
      <FotoAna arquivo="ana-bracos.jpg" x={1080} dur={c.dur} />
      <Sequence from={10} layout="none">
        <TarjaAna x={1120} y={810} />
      </Sequence>
      <Surge de={m("Pronto") - 4} style={{ left: 120, top: 170 }}>
        <div style={{ ...TITULO, fontSize: 120, lineHeight: 1, ...textoDegrade }}>PRONTO!</div>
      </Surge>
      <Surge de={m("Verbas") - 4} style={{ left: 120, top: 320 }}>
        <div style={{ ...TITULO, fontSize: 72, color: "white", lineHeight: 1.05 }}>VERBAS E ACORDOS</div>
        <div style={{ ...TITULO, fontSize: 72, lineHeight: 1.1, ...textoDegrade }}>DE PONTA A PONTA</div>
      </Surge>
      <Surge de={m("dúvida") - 4} style={{ left: 120, top: 520, width: 860 }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 36, color: CINZA, lineHeight: 1.3 }}>
          Dúvida? Pergunte ao <span style={{ color: VERDE }}>Olho de Deus</span>
          <br />
          ou fale com o Admin da sua empresa.
        </div>
      </Surge>
      <Surge de={m("bora") - 4} style={{ left: 120, top: 700 }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 380, marginLeft: -20, display: "block" }} />
        <div style={{ display: "inline-block", marginTop: 26, background: VERDE, color: FUNDO, ...TITULO, fontSize: 44, padding: "14px 28px", borderRadius: 12 }}>BORA SIMPLIFICAR JUNTOS!</div>
      </Surge>
    </>
  );
};

// ======================= roteiro
const ROTEIRO = montarRoteiro(vozes as unknown as Vozes, [
  "abertura",
  "conceito",
  { cap: 1, titulo: "ONDE FICA" },
  "abas",
  "papel",
  { cap: 2, titulo: "CADASTRAR UM ACORDO" },
  "novo",
  "novo2",
  "evidencia",
  "desconto",
  "parcelado",
  "aprovacao",
  "limite",
  { cap: 3, titulo: "ACOMPANHAR OS ACORDOS" },
  "situacao",
  "situacao2",
  "situacao3",
  "alertas",
  { cap: 4, titulo: "DENTRO DO ACORDO" },
  "pagina",
  "tratativas",
  "aprovacao2",
  "cancelar",
  { cap: 5, titulo: "CAIXA DO ERP" },
  "caixa",
  "caixa2",
  "produtos",
  "sugestao",
  "aceitar",
  "saidas",
  "ajuste",
  "vincular",
  { cap: 6, titulo: "RECEBIMENTOS" },
  "manual",
  "recebimentos",
  "usar",
  { cap: 7, titulo: "FORNECEDORES E PENDÊNCIAS" },
  "fornecedores",
  "pendencias",
  "pendencias2",
  { cap: 8, titulo: "VERBAS EM CONTA CORRENTE" },
  "contas",
  { cap: 9, titulo: "VÁRIOS DE UMA VEZ" },
  "planilha",
  "conferir",
  { cap: 10, titulo: "E-MAIL E ROTINA" },
  "email",
  "olho",
  "rotina",
  { cap: 11, titulo: "DÚVIDAS COMUNS" },
  "duvidas",
  "duvidas2",
  { cap: 12, titulo: "CONFIGURAÇÕES" },
  "config",
  "config2",
  "config3",
  ["fim", 75],
]);
export const DURACAO_TREINAMENTO = ROTEIRO.duracao;

const TELAS: Record<string, React.FC<P>> = {
  abertura: AberturaT,
  conceito: adapta(Conceito, { simples: ["funciona"] }),
  abas: AbasT,
  papel: PapelT,
  novo: NovoT,
  novo2: Novo2T,
  evidencia: EvidenciaT,
  desconto: DescontoT,
  parcelado: ParceladoT,
  aprovacao: AprovacaoT,
  limite: LimiteT,
  situacao: SituacaoT,
  situacao2: Situacao2T,
  situacao3: Situacao3T,
  alertas: Alertas,
  pagina: PaginaT,
  tratativas: TratativasT,
  aprovacao2: Aprovacao2T,
  cancelar: CancelarT,
  caixa: CaixaT,
  caixa2: Caixa2T,
  produtos: ProdutosT,
  sugestao: SugestaoT,
  aceitar: AceitarT,
  saidas: SaidasT,
  ajuste: AjusteT,
  vincular: VincularT,
  manual: ManualT,
  recebimentos: RecebimentosT,
  usar: UsarT,
  fornecedores: FornecedoresT,
  pendencias: PendenciasT,
  pendencias2: Pendencias2T,
  contas: ContasT,
  planilha: PlanilhaT,
  conferir: ConferirT,
  email: EmailT,
  olho: OlhoT,
  rotina: RotinaT,
  duvidas: DuvidasT,
  duvidas2: Duvidas2T,
  config: Config,
  config2: Config2T,
  config3: Config3T,
  fim: FimT,
};

export const TreinamentoVerbas: React.FC = () => <Montagem itens={ROTEIRO.itens} duracao={ROTEIRO.duracao} telas={TELAS} pastaVoz="voz/treinamento-verbas" semPip={SEM_PIP} />;
export const INICIOS_TREINAMENTO = Object.fromEntries(ROTEIRO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));
