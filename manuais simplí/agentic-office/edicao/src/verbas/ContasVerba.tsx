import type React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { TarjaAna } from "../ana/Ana";
import { type Cena, marca, type Vozes } from "../ana/voz";
import { Camera, caminho, COR, Cursor, Digitando, Icone, rota } from "../agentic/App";
import { Balao, Cabeca as CabecaOlho, Controles, Entrada, Resposta } from "../apresentacao/Olho";
import { CINZA, FUNDO, fontFamily, fonteApp, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import vozes from "../voz-contas-verba.json";
import { ACORDOS } from "./dados";
import { Email, LogoLojaModelo } from "./Emails";
import { Janela } from "./JanelaVerbas";
import { Etiqueta, FotoAna, Montagem, montarRoteiro, Surge } from "./Montagem";
import { ABA, AREA, Aviso, Cabecalho, CartaoAcordo } from "./Telas";
import { SEM_PIP } from "./VerbasAcordos";

// Vídeo das verbas em conta corrente (aba Verbas do Verbas e Acordos), apresentado pela Ana.
// Telas recriadas das capturas reais (verbas e acordos/capturas-contas-de-verba) com dados
// fictícios da Loja Modelo. Cada movimento acontece na palavra em que a Ana fala dele.
type P = { readonly c: Cena };
const usaMarca = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
const MODULO = "Verbas e Acordos";
const w = (x: number, y: number) => ({ x: AREA.x + x, y: AREA.y + y });
const entre = (f: number, de: number, ate: number) => f >= de && f < ate;
const agora = <T,>(frame: number, passos: readonly (readonly [number, T])[], padrao: T): T => passos.reduce<T>((v, [f, x]) => (frame >= f ? x : v), padrao);
const luz = (aceso: boolean | undefined, cor = VERDE): React.CSSProperties => (aceso ? { boxShadow: `0 0 0 2px ${cor}, 0 0 28px ${cor}55`, borderRadius: 8 } : {});
const VAZIO = "#6B726D";

// ---------- peças pequenas
const Botao: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h?: number; readonly cheio?: boolean; readonly icone?: string; readonly clique?: number; readonly aceso?: boolean; readonly apagado?: boolean; readonly children: React.ReactNode }> = ({
  x,
  y,
  w: largura,
  h = 46,
  cheio,
  icone,
  clique,
  aceso,
  apagado,
  children,
}) => {
  const frame = useCurrentFrame();
  const apertado = clique !== undefined && frame >= clique && frame < clique + 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: largura,
        height: h,
        boxSizing: "border-box",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontSize: 18,
        fontWeight: 600,
        background: cheio ? (apagado ? "#8A8F8B" : "white") : "transparent",
        color: cheio ? "#0B0B0C" : COR.texto,
        border: `1px solid ${cheio ? (apagado ? "#8A8F8B" : "white") : COR.borda}`,
        transform: apertado ? "scale(0.94)" : "none",
        boxShadow: apertado ? `0 0 0 4px ${VERDE}` : aceso ? `0 0 0 2px ${VERDE}, 0 0 26px rgba(60,224,30,0.4)` : "none",
        whiteSpace: "nowrap",
      }}
    >
      {icone && <Icone nome={icone} />}
      {children}
    </div>
  );
};

const Campo: React.FC<{ readonly rotulo: string; readonly x: number; readonly y: number; readonly w: number; readonly h?: number; readonly valor?: React.ReactNode; readonly vazio?: string; readonly ativo?: boolean; readonly select?: boolean; readonly erro?: boolean }> = ({
  rotulo,
  x,
  y,
  w: largura,
  h = 44,
  valor,
  vazio = "",
  ativo,
  select,
  erro,
}) => (
  <>
    <div style={{ position: "absolute", left: x, top: y - 25, fontSize: 17, fontWeight: 600 }}>{rotulo}</div>
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: largura,
        height: h,
        boxSizing: "border-box",
        borderRadius: 7,
        background: "#1C201D",
        border: `${ativo || erro ? 2 : 1}px solid ${erro ? COR.vermelho : ativo ? VERDE : COR.borda}`,
        boxShadow: ativo ? "0 0 18px rgba(60,224,30,0.3)" : "none",
        padding: h > 44 ? "10px 14px" : "0 14px",
        display: "flex",
        alignItems: h > 44 ? "flex-start" : "center",
        fontSize: 18,
        whiteSpace: h > 44 ? "normal" : "nowrap",
        overflow: "hidden",
      }}
    >
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{valor ?? <span style={{ color: VAZIO }}>{vazio}</span>}</span>
      {select && <span style={{ color: COR.suave }}>⌄</span>}
    </div>
  </>
);

// texto que aparece digitado a partir de `de`, ou o vazio antes disso
const tipo = (frame: number, de: number, texto: string, vel = 1.6) => (frame >= de ? <Digitando texto={texto} de={de} porFrame={vel} /> : undefined);
const se = (frame: number, de: number, texto: string) => (frame >= de ? texto : undefined);

const Modal: React.FC<{ readonly de: number; readonly fecha?: number; readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly titulo: string; readonly sub?: string; readonly children: React.ReactNode }> = ({ de, fecha, x, y, w: largura, h, titulo, sub, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - de, fps, config: { damping: 18, stiffness: 160 } });
  const f = fecha === undefined ? 1 : interpolate(frame, [fecha, fecha + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < de || f <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.55 * s * f})`, zIndex: 20 }}>
      <div style={{ position: "absolute", left: x, top: y, width: largura, height: h, borderRadius: 14, background: "#141815", border: `1px solid ${COR.borda}`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)", opacity: s * f, transform: `translateY(${(1 - s) * 30}px) scale(${0.96 + 0.04 * s})` }}>
        <div style={{ position: "absolute", left: 28, top: 24, fontSize: 26, fontWeight: 700 }}>{titulo}</div>
        <div style={{ position: "absolute", right: 26, top: 22, fontSize: 24, color: COR.suave }}>×</div>
        {sub && <div style={{ position: "absolute", left: 28, right: 28, top: 64, fontSize: 17, color: COR.suave, lineHeight: 1.45 }}>{sub}</div>}
        {children}
      </div>
    </div>
  );
};

// aviso no canto (verde = feito, vermelho = recusado)
const Toast: React.FC<{ readonly de: number; readonly ate?: number; readonly texto: string; readonly erro?: boolean }> = ({ de, ate, texto, erro }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - de, fps, config: { damping: 16 } });
  if (frame < de || (ate !== undefined && frame >= ate)) return null;
  return (
    <div style={{ position: "absolute", right: 30, bottom: 30, width: 560, zIndex: 40, opacity: s, transform: `translateY(${(1 - s) * 30}px)`, background: erro ? "#3A1414" : "#14301A", border: `1px solid ${erro ? COR.vermelho : VERDE}`, borderRadius: 12, padding: "16px 20px", display: "flex", gap: 12, fontSize: 18, lineHeight: 1.4, color: erro ? "#FFB4B4" : "white" }}>
      <span style={{ color: erro ? COR.vermelho : VERDE, fontSize: 22 }}>{erro ? "⊗" : "✓"}</span>
      <span>{texto}</span>
    </div>
  );
};

// cartão de número (as telas da aba Verbas e do Painel usam o mesmo)
const Cartao: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h?: number; readonly rotulo: string; readonly valor: string; readonly nota?: string; readonly cor?: string; readonly aceso?: boolean; readonly apagado?: boolean }> = ({
  x,
  y,
  w: largura,
  h = 150,
  rotulo,
  valor,
  nota,
  cor = "white",
  aceso,
  apagado,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: largura,
      height: h,
      boxSizing: "border-box",
      padding: "16px 20px",
      borderRadius: 12,
      background: COR.cartao,
      border: `${aceso ? 2 : 1}px solid ${aceso ? VERDE : COR.borda}`,
      boxShadow: aceso ? "0 0 40px rgba(60,224,30,0.28)" : "none",
      opacity: apagado ? 0.5 : 1,
    }}
  >
    <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${COR.borda}`, display: "grid", placeItems: "center", color: VERDE }}>
      <Icone nome="carteira" tam={18} />
    </div>
    <div style={{ fontSize: 16, color: COR.suave, marginTop: 10 }}>{rotulo}</div>
    <div style={{ fontSize: 32, fontWeight: 700, color: cor, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{valor}</div>
    {nota && <div style={{ fontSize: 14, color: COR.suave, marginTop: 2 }}>{nota}</div>}
  </div>
);

// ======================= Dados fictícios
type Mov = { data: string; tipo: string; sub: string; titulo?: string; linha2?: string; detalhe: string; valor: string; saldo: string; comp?: string; estornado?: boolean; estornar?: boolean };
const M = {
  credito: { data: "01/10/2026", tipo: "Crédito", sub: "ACD-0230 · Marina Costa", detalhe: "ACD-0230: valor disponibilizado", valor: "+R$ 8.000,00", saldo: "R$ 8.000,00" },
  evento: { data: "15/10/2026", tipo: "Gasto", sub: "Pedro Alves", titulo: "Evento / ação na loja", linha2: "Equipe da loja · Filial 02", detalhe: "Sorteio do Dia das Crianças", valor: "−R$ 1.050,00", saldo: "R$ 6.950,00", comp: "nota-sorteio.pdf", estornar: true },
  cafe: { data: "27/10/2026", tipo: "Gasto", sub: "Marina Costa", titulo: "Café da manhã / alimentação", linha2: "Equipe da loja · Matriz", detalhe: "Café do lançamento da linha piscina", valor: "−R$ 450,00", saldo: "R$ 6.500,00", comp: "nota-cafe.jpg", estornar: true },
  cafe2: { data: "27/10/2026", tipo: "Gasto", sub: "Marina Costa", titulo: "Café da manhã / alimentação", linha2: "Equipe da loja · Matriz", detalhe: "Café do lançamento da linha piscina", valor: "−R$ 450,00", saldo: "R$ 6.050,00", comp: "nota-cafe.jpg", estornar: true },
  premio: { data: "05/11/2026", tipo: "Gasto", sub: "Bruna Teixeira", titulo: "Premiação de vendedor", linha2: "Rafael (vendedor) · Matriz", detalhe: "Campeão de vendas de outubro", valor: "−R$ 800,00", saldo: "R$ 5.250,00", comp: "recibo-premiacao.pdf", estornar: true },
  estorno: { data: "06/11/2026", tipo: "Estorno", sub: "Júlia Rocha", detalhe: "Estorno: lançado em duplicidade", valor: "+R$ 450,00", saldo: "R$ 5.700,00" },
} satisfies Record<string, Mov>;

// ======================= Aba Verbas (lista de contas)
type Conta = { codigo: string; nome: string; forn: string; saldo: string; creditado: string; gasto: string };
const CONTAS: Conta[] = [
  { codigo: "VRB-0001", nome: "Fachadas", forn: "Cerâmica Aurora", saldo: "R$ 4.200,00", creditado: "R$ 6.000", gasto: "R$ 1.800" },
  { codigo: "VRB-0002", nome: "Verba de loja 2026", forn: "Metais Prisma", saldo: "R$ 0,00", creditado: "R$ 3.000", gasto: "R$ 3.000" },
];
const NOVA: Conta = { codigo: "VRB-0003", nome: "Verba de marketing 2026", forn: "Tintas Horizonte", saldo: "R$ 0,00", creditado: "R$ 0", gasto: "R$ 0" };
const BOTAO_NOVA_CONTA = w(1080 + 110, 432 + 23);
const LinhaConta: React.FC<{ readonly c: Conta; readonly i: number; readonly entra?: number; readonly aceso?: boolean }> = ({ c, i, entra, aceso }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = entra === undefined ? 1 : spring({ frame: frame - entra, fps, config: { damping: 14 } });
  return (
    <div style={{ position: "absolute", left: 40 + (i % 2) * 640, top: 512 + Math.floor(i / 2) * 104, width: 620, height: 88, boxSizing: "border-box", padding: "14px 20px", borderRadius: 12, background: COR.cartao, border: `${aceso ? 2 : 1}px solid ${aceso ? VERDE : COR.borda}`, boxShadow: aceso ? "0 0 36px rgba(60,224,30,0.3)" : "none", opacity: s, transform: `scale(${0.92 + 0.08 * s})` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 600 }}>
        <span>
          {c.codigo} · {c.nome}
        </span>
        <span>{c.saldo}</span>
      </div>
      <div style={{ fontSize: 16, color: COR.suave, marginTop: 8 }}>
        {c.forn} · creditado {c.creditado} · gasto {c.gasto}
      </div>
    </div>
  );
};
export const TelaContas: React.FC<{ readonly criada?: number; readonly clique?: number }> = ({ criada, clique }) => {
  const frame = useCurrentFrame();
  const tem = criada !== undefined && frame >= criada;
  return (
    <>
      <Cabecalho aba="Verbas" />
      <Cartao x={40} y={262} w={305} rotulo="Disponível para gastar" valor="R$ 4.200" nota="2 conta(s) ativa(s)" />
      <Cartao x={358} y={262} w={305} rotulo="Creditado" valor="R$ 9.000" nota="valor disponibilizado pelos fornecedores" />
      <Cartao x={676} y={262} w={305} rotulo="Gasto" valor="R$ 4.800" nota="com comprovante" />
      <Cartao x={994} y={262} w={306} rotulo="Contas sem saldo" valor={tem ? "2" : "1"} nota="ativas e zeradas" />
      <div style={{ position: "absolute", left: 28, top: 424, width: 520, height: 66, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
      <Campo rotulo="" x={40} y={435} w={250} select valor="Todo fornecedor" />
      <div style={{ position: "absolute", left: 304, top: 447, display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: COR.suave }}>
        <span style={{ width: 14, height: 14, border: "2px solid #666", borderRadius: 3 }} /> mostrar desativadas
      </div>
      <Botao x={448} y={434} w={90} cheio>
        Filtrar
      </Botao>
      <Botao x={1080} y={432} w={220} cheio icone="mais" clique={clique}>
        Nova conta de verba
      </Botao>
      {CONTAS.map((c, i) => (
        <LinhaConta key={c.codigo} c={c} i={i} />
      ))}
      {tem && <LinhaConta c={NOVA} i={2} entra={criada} aceso />}
    </>
  );
};

// ======================= Página da conta
const BOTOES_CONTA: [string, number, string][] = [
  ["Registrar gasto", 210, "mais"],
  ["Novo crédito", 180, "mais"],
  ["Prestar contas", 190, "enviar"],
  ["Editar", 110, "editar"],
  ["Extrato em Excel", 210, "exportar"],
];
export const BOTAO_CONTA = (nome: string) => {
  let x = 40;
  for (const [n, l] of BOTOES_CONTA) {
    if (n === nome) return w(x + l / 2, 104 + 23);
    x += l + 10;
  }
  throw new Error(nome);
};
const COLS = [125, 180, 360, 135, 140, 200, 120];
const cx = (k: number) => 40 + COLS.slice(0, k).reduce((a, b) => a + b, 0);
const TAB_Y = 400;
const ROW = 92;
export const LINHA = (i: number) => w(640, TAB_Y + 44 + i * ROW + ROW / 2);
export const ESTORNAR = (i: number) => w(cx(6) + 40, TAB_Y + 44 + i * ROW + ROW / 2);
type FocoConta = "saldo" | "comprovante" | "registrou" | "disponivel" | null;
const PaginaConta: React.FC<{
  readonly movs: readonly Mov[];
  readonly disp: string;
  readonly cred: string;
  readonly gasto: string;
  readonly n: number;
  readonly foco?: FocoConta;
  readonly acesos?: readonly string[];
  readonly cliques?: Record<string, number | undefined>;
  readonly novaLinha?: number;
}> = ({ movs, disp, cred, gasto, n, foco, acesos = [], cliques = {}, novaLinha }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let x = 40;
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 20, fontSize: 15, color: COR.suave }}>Verbas e Acordos · Verbas</div>
      <div style={{ position: "absolute", left: 40, top: 44, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 10, border: `1px solid ${COR.borda}`, display: "grid", placeItems: "center", color: VERDE }}>
          <Icone nome="carteira" tam={24} />
        </div>
        <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: 7 }}>VRB-0003 · VERBA DE MARKETING 2026</span>
      </div>
      {BOTOES_CONTA.map(([nome, l, ic], i) => {
        const b = (
          <Botao key={nome} x={x} y={104} w={l} cheio={i === 0} icone={ic} clique={cliques[nome]} aceso={acesos.includes(nome)}>
            {nome}
          </Botao>
        );
        x += l + 10;
        return b;
      })}
      <div style={{ position: "absolute", left: 40, top: 164, fontSize: 17, color: COR.suave }}>Tintas Horizonte · R$ 8 mil para ações de loja em 2026, reposição por depósito</div>
      <Cartao x={40} y={198} w={305} h={140} rotulo="Disponível para gastar" valor={disp} aceso={foco === "disponivel"} />
      <Cartao x={358} y={198} w={305} h={140} rotulo="Creditado" valor={cred} nota="valor disponibilizado" />
      <Cartao x={676} y={198} w={305} h={140} rotulo="Gasto" valor={gasto} nota="com comprovante" />
      <Cartao x={994} y={198} w={306} h={140} rotulo="Movimentos" valor={String(n)} nota={n ? "último em 06/11/2026" : "—"} />
      <div style={{ position: "absolute", left: 40, top: 356, fontSize: 22, fontWeight: 700 }}>Extrato</div>
      {movs.length === 0 ? (
        <div style={{ position: "absolute", left: 40, top: TAB_Y, width: 1260, height: 90, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 12, display: "grid", placeItems: "center", fontSize: 18, color: COR.suave, padding: "0 40px", textAlign: "center" }}>
          Sem movimento ainda. Comece pelo Novo crédito: o valor que o fornecedor disponibilizou entra na conta como saldo para gastar.
        </div>
      ) : (
        <div style={{ position: "absolute", left: 40, top: TAB_Y, width: 1260, borderRadius: 12, border: `1px solid ${COR.borda}`, overflow: "hidden" }}>
          <div style={{ height: 44, display: "flex", alignItems: "center", fontSize: 16, fontWeight: 600, borderBottom: `1px solid ${COR.borda}` }}>
            {["Data", "Movimento", "Detalhe", "Valor", "Saldo", "Comprovante", ""].map((t, k) => (
              <div key={k} style={{ width: COLS[k], padding: "0 12px", boxSizing: "border-box", textAlign: k === 3 || k === 4 ? "right" : "left", ...(k === 4 ? luz(foco === "saldo") : k === 5 ? luz(foco === "comprovante") : k === 1 ? luz(foco === "registrou") : {}) }}>
                {t}
              </div>
            ))}
          </div>
          {movs.map((m, i) => {
            const s = i === 0 && novaLinha !== undefined ? spring({ frame: frame - novaLinha, fps, config: { damping: 16 } }) : 1;
            const neg = m.valor.startsWith("−");
            const dim = m.estornado ? 0.5 : 1;
            return (
              <div key={m.tipo + m.saldo + i} style={{ height: ROW * s, overflow: "hidden", display: "flex", alignItems: "center", fontSize: 16, borderBottom: `1px solid ${COR.borda}`, background: i === 0 && novaLinha !== undefined && frame < novaLinha + 40 ? "rgba(60,224,30,0.07)" : "transparent" }}>
                <div style={{ width: COLS[0], padding: "0 12px", boxSizing: "border-box", opacity: dim }}>{m.data}</div>
                <div style={{ width: COLS[1], padding: "0 12px", boxSizing: "border-box", lineHeight: 1.35, opacity: dim }}>
                  <div>{m.estornado ? "Gasto (estornado)" : m.tipo}</div>
                  <div style={{ fontSize: 14, color: foco === "registrou" ? VERDE : COR.suave, fontWeight: foco === "registrou" ? 700 : 400 }}>{m.sub}</div>
                </div>
                <div style={{ width: COLS[2], padding: "0 12px", boxSizing: "border-box", lineHeight: 1.35, opacity: dim }}>
                  {m.titulo && <div style={{ fontWeight: 600 }}>{m.titulo}</div>}
                  {m.linha2 && <div style={{ fontSize: 14 }}>{m.linha2}</div>}
                  <div style={{ fontSize: 14, color: COR.suave }}>{m.detalhe}</div>
                </div>
                <div style={{ width: COLS[3], padding: "0 12px", boxSizing: "border-box", textAlign: "right", color: neg ? COR.vermelho : COR.texto, opacity: dim }}>{m.valor}</div>
                <div style={{ width: COLS[4], padding: "0 12px", boxSizing: "border-box", textAlign: "right", fontWeight: 700, opacity: dim, color: foco === "saldo" ? VERDE : COR.texto }}>{m.saldo}</div>
                <div style={{ width: COLS[5], padding: "0 12px", boxSizing: "border-box", fontSize: 14, color: foco === "comprovante" ? VERDE : COR.suave, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.comp ? `📎 ${m.comp}` : ""}</div>
                <div style={{ width: COLS[6], padding: "0 8px", boxSizing: "border-box", fontSize: 15, whiteSpace: "nowrap", ...luz(acesos.includes(`estornar${i}`)) }}>{m.estornar && !m.estornado ? "↶ Estornar" : ""}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

// ======================= Modais
const MNC = { x: 400, y: 170, w: 540, h: 480 };
const ModalNovaConta: React.FC<{ readonly m: { abre: number; forn: number; nome: number; comb: number; salvar: number } }> = ({ m }) => {
  const frame = useCurrentFrame();
  return (
    <Modal de={m.abre} fecha={m.salvar + 6} x={MNC.x} y={MNC.y} w={MNC.w} h={MNC.h} titulo="Nova conta de verba" sub="O dinheiro que o fornecedor disponibiliza para a empresa gastar, sem vencimento. Um fornecedor pode ter várias contas.">
      <Campo rotulo="Fornecedor" x={28} y={176} w={484} select valor={se(frame, m.forn, "Tintas Horizonte")} vazio="Escolha…" ativo={entre(frame, m.forn - 8, m.nome - 6)} />
      <Campo rotulo="Nome da conta" x={28} y={256} w={484} valor={tipo(frame, m.nome, NOVA.nome, 1.2)} vazio="Ex.: Verba MKT 2026, Fachadas" ativo={entre(frame, m.nome - 6, m.comb - 6)} />
      <Campo rotulo="Combinado com o fornecedor (opcional)" x={28} y={336} w={484} h={60} valor={tipo(frame, m.comb, "R$ 8 mil para ações de loja em 2026, reposição por depósito", 2)} vazio="Ex.: R$ 20 mil para ações de loja em 2026, reposição por NF de bonificação" ativo={entre(frame, m.comb - 6, m.salvar)} />
      <Botao x={MNC.w - 28 - 100 - 12 - 110} y={MNC.h - 62} w={110} h={42}>
        Cancelar
      </Botao>
      <Botao x={MNC.w - 28 - 100} y={MNC.h - 62} w={100} h={42} cheio clique={m.salvar}>
        Salvar
      </Botao>
    </Modal>
  );
};
const CAMPO_NC = { forn: w(MNC.x + 270, MNC.y + 198), nome: w(MNC.x + 270, MNC.y + 278), comb: w(MNC.x + 270, MNC.y + 366), salvar: w(MNC.x + MNC.w - 78, MNC.y + MNC.h - 41) };

// Novo acordo aberto pelo Novo crédito (o mesmo cadastro, com o Destino na conta)
const MNA = { x: 320, y: 24, w: 700, h: 880 };
type Quando = "agora" | "pagar" | null;
const Radio: React.FC<{ readonly x: number; readonly y: number; readonly marcado: boolean; readonly aceso?: boolean; readonly titulo: string; readonly texto: string }> = ({ x, y, marcado, aceso, titulo, texto }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 644, display: "flex", gap: 12, fontSize: 17, lineHeight: 1.4, padding: "6px 8px", boxSizing: "border-box", ...luz(aceso) }}>
    <span style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2, borderRadius: "50%", border: `2px solid ${marcado ? "#7FB2FF" : "#777"}`, display: "grid", placeItems: "center" }}>{marcado && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#7FB2FF" }} />}</span>
    <span>
      <b>{titulo}</b> {texto}
    </span>
  </div>
);
const ModalCredito: React.FC<{ readonly de: number; readonly quando: Quando; readonly destinoAceso?: boolean; readonly acesoAgora?: boolean; readonly acesoPagar?: boolean; readonly notaAcesa?: boolean; readonly valor?: number }> = ({ de, quando, destinoAceso, acesoAgora, acesoPagar, notaAcesa, valor }) => {
  const frame = useCurrentFrame();
  return (
    <Modal de={de} x={MNA.x} y={MNA.y} w={MNA.w} h={MNA.h} titulo="Novo acordo" sub="O que, quanto, como e quando o fornecedor se comprometeu a dar. Competência é o mês do acordo.">
      <Campo rotulo="Fornecedor" x={28} y={146} w={644} select valor="Tintas Horizonte" />
      <Campo rotulo="Modalidade" x={28} y={226} w={312} select valor="Verba de marketing / VPC" />
      <Campo rotulo="Forma de recebimento prevista" x={360} y={226} w={312} select valor="Depósito / PIX" />
      <Campo rotulo="Destino" x={28} y={306} w={644} select valor="Conta de verba VRB-0003 · Verba de marketing 2026" ativo={destinoAceso} />
      <Radio x={20} y={362} marcado={quando !== "pagar"} aceso={acesoAgora} titulo="Agora" texto="(valor disponibilizado): o valor entra na conta como saldo para gastar no cadastro (com acordo em aprovação, quando a diretoria aprovar)." />
      <Radio x={20} y={436} marcado={quando === "pagar"} aceso={acesoPagar} titulo="Quando o fornecedor pagar:" texto="cada recebimento do acordo (lançado à mão ou pela Caixa do ERP) vira saldo na conta." />
      <div style={{ position: "absolute", left: 28, top: 500, fontSize: 15, color: notaAcesa ? VERDE : COR.suave, fontWeight: notaAcesa ? 700 : 400 }}>O acordo continua cobrando o fornecedor (prazo, recebimentos, Caixa do ERP).</div>
      <Campo rotulo="Comprador responsável" x={28} y={556} w={644} select valor="Marina Costa" />
      <Campo rotulo="Descrição / condições negociadas" x={28} y={636} w={644} h={60} valor="Verba de marketing 2026 · R$ 8 mil para ações de loja" />
      <Campo rotulo="Valor negociado" x={28} y={746} w={312} valor={valor !== undefined ? tipo(frame, valor, "R$ 8.000,00", 0.8) : "R$ 8.000,00"} ativo={valor !== undefined && entre(frame, valor - 6, valor + 24)} />
      <Campo rotulo="Data prevista de recebimento" x={360} y={746} w={312} valor="01/10/2026" />
      <Botao x={MNA.w - 28 - 100 - 12 - 110} y={MNA.h - 64} w={110} h={42}>
        Cancelar
      </Botao>
      <Botao x={MNA.w - 28 - 100} y={MNA.h - 64} w={100} h={42} cheio>
        Salvar
      </Botao>
    </Modal>
  );
};

const MG = { x: 380, y: 90, w: 580, h: 660 };
type MarcasGasto = { abre: number; data: number; valor: number; cat: number; quem: number; loja: number; desc: number; comp: number; registrar?: number; valorTexto?: string };
const ModalGasto: React.FC<{ readonly m: MarcasGasto; readonly disp: string; readonly erro?: number }> = ({ m, disp, erro }) => {
  const frame = useCurrentFrame();
  const comErro = erro !== undefined && frame >= erro;
  const anexado = frame >= m.comp + 4;
  return (
    <Modal de={m.abre} fecha={m.registrar !== undefined ? m.registrar + 6 : undefined} x={MG.x} y={MG.y} w={MG.w} h={MG.h} titulo="Registrar gasto da verba" sub={`Disponível na conta: ${disp}. O gasto não passa do saldo, e o comprovante é obrigatório.`}>
      <Campo rotulo="Data do gasto" x={28} y={150} w={252} valor={se(frame, m.data, "05/11/2026")} vazio="dd/mm/aaaa" ativo={entre(frame, m.data - 6, m.valor - 6)} />
      <Campo rotulo="Valor (R$)" x={300} y={150} w={252} valor={tipo(frame, m.valor, m.valorTexto ?? "800,00", 0.6)} ativo={entre(frame, m.valor - 6, m.cat - 6) && !comErro} erro={comErro} />
      {comErro && <div style={{ position: "absolute", left: 300, top: 200, width: 252, fontSize: 15, color: COR.vermelho, lineHeight: 1.3 }}>Passa do saldo disponível ({disp}).</div>}
      <Campo rotulo="Categoria" x={28} y={262} w={524} select valor={se(frame, m.cat, "Premiação de vendedor")} vazio="Escolha…" ativo={entre(frame, m.cat - 6, m.quem - 6)} />
      <Campo rotulo="Quem recebeu" x={28} y={346} w={252} valor={tipo(frame, m.quem, "Rafael (vendedor)", 1)} vazio="Ex.: João (vendedor), equipe" ativo={entre(frame, m.quem - 6, m.loja - 6)} />
      <Campo rotulo="Loja" x={300} y={346} w={252} select valor={se(frame, m.loja, "Matriz")} vazio="—" ativo={entre(frame, m.loja - 6, m.desc - 6)} />
      <Campo rotulo="Descrição" x={28} y={430} w={524} h={60} valor={tipo(frame, m.desc, "Campeão de vendas de outubro", 1.4)} vazio="Ex.: café da manhã do lançamento da linha piscina" ativo={entre(frame, m.desc - 6, m.comp - 6)} />
      <div style={{ position: "absolute", left: 28, top: 506, fontSize: 17, fontWeight: 600 }}>Comprovante</div>
      {anexado ? (
        <div style={{ position: "absolute", left: 28, top: 536, display: "flex", gap: 10, alignItems: "center", fontSize: 17, opacity: interpolate(frame - m.comp - 4, [0, 8], [0, 1], { extrapolateRight: "clamp" }) }}>
          📎 recibo-premiacao.pdf <span style={{ color: COR.suave, fontSize: 15 }}>212 KB ×</span>
        </div>
      ) : (
        <div style={{ position: "absolute", left: 28, top: 532, height: 38, padding: "0 14px", borderRadius: 7, border: `${entre(frame, m.comp - 8, m.comp + 4) ? 2 : 1}px solid ${entre(frame, m.comp - 8, m.comp + 4) ? VERDE : COR.borda}`, display: "flex", alignItems: "center", gap: 8, fontSize: 17, fontWeight: 600 }}>📎 Anexar nota, recibo ou foto</div>
      )}
      <div style={{ position: "absolute", left: 28, top: 578, fontSize: 14, color: COR.suave }}>PDF, imagem, e-mail (.eml), planilha ou Word, até 4 MB.</div>
      <Botao x={MG.w - 28 - 190 - 12 - 120} y={MG.h - 58} w={120} h={42}>
        Cancelar
      </Botao>
      <Botao x={MG.w - 28 - 190} y={MG.h - 58} w={190} h={42} cheio apagado={comErro} clique={m.registrar}>
        Registrar gasto
      </Botao>
    </Modal>
  );
};
const CAMPO_G = {
  data: w(MG.x + 28 + 126, MG.y + 172),
  valor: w(MG.x + 300 + 126, MG.y + 172),
  cat: w(MG.x + 290, MG.y + 284),
  quem: w(MG.x + 28 + 126, MG.y + 368),
  loja: w(MG.x + 300 + 126, MG.y + 368),
  desc: w(MG.x + 290, MG.y + 460),
  comp: w(MG.x + 28 + 150, MG.y + 551),
  registrar: w(MG.x + MG.w - 28 - 95, MG.y + MG.h - 37),
};

// ======================= Cenas
// ---------- Abertura
export const AberturaV: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <>
      <FotoAna arquivo="ana-verde.jpg" x={120} dur={c.dur} />
      <Surge de={m("Oi") - 4} ate={m("Ana") - 6} style={{ left: 940, top: 300 }}>
        <div style={{ ...TITULO, fontSize: 150, ...textoDegrade }}>Oi!</div>
      </Surge>
      <Sequence from={m("Ana") - 4} layout="none">
        <TarjaAna x={940} y={250} />
      </Sequence>
      <Surge de={m("verbas") - 4} style={{ left: 940, top: 470 }}>
        <div style={{ ...TITULO, fontSize: 96, lineHeight: 1, color: "white" }}>VERBAS EM</div>
        <div style={{ ...TITULO, fontSize: 96, lineHeight: 1.05, ...textoDegrade }}>CONTA CORRENTE</div>
      </Surge>
      <Surge de={m("aba") - 4} style={{ left: 940, top: 710 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 30, color: CINZA, marginBottom: 6 }}>a aba nova do Verbas e Acordos, no</div>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 440, marginLeft: -26 }} />
      </Surge>
    </>
  );
};

// ---------- Gancho: a verba na planilha
export const GanchoV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const virada = m("ninguém") - 4;
  const borra = interpolate(frame, [virada, virada + 10], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const linhas = [
    ["Data", "Gasto", "Valor", "Nota?"],
    ["10/09", "Café equipe", "380", "?"],
    ["22/09", "Prêmio vend.", "500", "cadê?"],
    ["05/10", "Evento loja", "1.200", "?"],
    ["", "SOBROU", "???", ""],
  ];
  const notas: [string, string, number, number, number][] = [
    ["Café da manhã", "café", 300, 220, -6],
    ["Premiação", "premiação", 1240, 300, 5],
    ["Evento", "evento", 680, 740, -3],
  ];
  return (
    <>
      <Surge de={m("planilha") - 8} style={{ left: 400, top: 200 }}>
        <div style={{ filter: `blur(${borra}px)`, opacity: 1 - borra / 14, transform: "perspective(1600px) rotateX(14deg) rotateZ(-2deg)", display: "grid", gridTemplateColumns: "180px 320px 200px 200px", background: "#E9ECEA", border: "2px solid #9AA19C", fontFamily: "Arial, sans-serif", fontSize: 30 }}>
          {linhas.flatMap((l, i) =>
            l.map((v, j) => (
              <div key={`${i}-${j}`} style={{ height: 84, padding: "0 16px", display: "flex", alignItems: "center", borderRight: "1px solid #B8BDB9", borderBottom: "1px solid #B8BDB9", fontWeight: i === 0 || v.includes("?") || i === 4 ? 700 : 400, color: v.includes("?") ? "#C62828" : "#1B1E1C", background: i === 0 ? "#C9D3CC" : v.includes("?") ? "#FFE3E0" : "white" }}>
                {v}
              </div>
            )),
          )}
        </div>
      </Surge>
      {notas.map(([t, p, x, y, r]) => (
        <Surge key={t} de={m(p) - 3} ate={virada} style={{ left: x, top: y }}>
          <div style={{ transform: `rotate(${r}deg)`, background: "#FFD84D", color: "#1B1E1C", fontFamily, fontWeight: 800, fontSize: 42, padding: "18px 28px", borderRadius: 6, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>{t}</div>
        </Surge>
      ))}
      <Surge de={virada} style={{ left: 0, right: 0, top: 330, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 92, color: "white", lineHeight: 1.05 }}>QUANTO SOBROU?</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.15, ...textoDegrade }}>ONDE FOI PARAR?</div>
      </Surge>
    </>
  );
};

// ---------- Conceito: crédito → gasto → saldo
const No: React.FC<{ readonly rotulo: string; readonly titulo: string; readonly linha: string; readonly valor: string; readonly cor?: string; readonly destaque?: boolean }> = ({ rotulo, titulo, linha, valor, cor = "white", destaque }) => (
  <div style={{ width: 460, height: 300, boxSizing: "border-box", borderRadius: 20, padding: "34px 36px", background: "#141815", border: `2px solid ${destaque ? VERDE : "#2A2F2B"}`, boxShadow: destaque ? "0 0 60px rgba(60,224,30,0.25)" : "none" }}>
    <Etiqueta>{rotulo}</Etiqueta>
    <div style={{ ...TITULO, fontSize: 52, color: "white", marginTop: 14 }}>{titulo}</div>
    <div style={{ fontFamily, fontWeight: 600, fontSize: 26, color: CINZA, marginTop: 10 }}>{linha}</div>
    <div style={{ fontFamily, fontWeight: 800, fontSize: 42, color: cor, marginTop: 4, whiteSpace: "nowrap" }}>{valor}</div>
  </div>
);
const Seta: React.FC<{ readonly de: number; readonly x: number }> = ({ de, x }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [de, de + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg style={{ position: "absolute", left: x, top: 500 }} width={110} height={40} viewBox="0 0 110 40">
      <line x1={6} y1={20} x2={6 + 86 * k} y2={20} stroke={VERDE} strokeWidth={5} strokeLinecap="round" />
      {k > 0.95 && <path d="M88 8 L104 20 L88 32" fill="none" stroke={VERDE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};
export const ConceitoV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const conta = m("calculado");
  const saldo = interpolate(frame, [conta, conta + 30], [8000, 7550], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Surge de={m("conta") - 8} style={{ left: 0, right: 0, top: 150, textAlign: "center" }}>
        <Etiqueta>COMO FUNCIONA</Etiqueta>
        <div style={{ ...TITULO, fontSize: 64, color: "white", marginTop: 10 }}>
          Uma <span style={textoDegrade}>conta corrente</span> da verba
        </div>
      </Surge>
      <Surge de={m("crédito") - 6} style={{ left: 110, top: 370 }}>
        <No rotulo="01 · ENTRA" titulo="Crédito" linha="Tintas Horizonte" valor="+R$ 8.000" />
      </Surge>
      <Seta de={m("sai") - 4} x={585} />
      <Surge de={m("gasto") - 6} style={{ left: 730, top: 370 }}>
        <No rotulo="02 · SAI" titulo="Gasto" linha="📎 com comprovante" valor="−R$ 450" cor={COR.vermelho} />
      </Surge>
      <Seta de={m("saldo") - 8} x={1205} />
      <Surge de={m("saldo") - 4} style={{ left: 1350, top: 370 }}>
        <No rotulo="03 · SOBRA" titulo="Saldo" linha="calculado sozinho" valor={`R$ ${Math.round(saldo).toLocaleString("pt-BR")}`} cor={VERDE} destaque={frame >= conta} />
      </Surge>
      <Surge de={m("nunca") - 4} style={{ left: 1350, top: 700, width: 460, textAlign: "center" }}>
        <div style={{ fontFamily: fonteMono, fontSize: 24, color: VERDE, letterSpacing: 2 }}>NUNCA FICA NEGATIVO</div>
      </Surge>
    </>
  );
};

// ---------- 1. Criar a conta
export const ContaV: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  const aba = ABA("Verbas");
  const clique = m("Nova") + 2;
  const f = { abre: clique + 4, forn: m("fornecedor"), nome: m("nome") + 4, comb: m("anota"), salvar: m("Um", 1) - 4 };
  const criada = f.salvar + 12;
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.1, 820, 500],
          [
            [m("aba"), 1.4, aba.x + 200, aba.y + 120],
            [clique, 1.3, BOTAO_NOVA_CONTA.x - 300, BOTAO_NOVA_CONTA.y],
            [f.abre + 8, 1.35, CAMPO_NC.forn.x, CAMPO_NC.nome.y],
            [f.salvar, 1.25, 960, 640],
            [m("finalidade"), 1.2, 960, 620],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <TelaContas clique={clique} criada={criada} />
          <ModalNovaConta m={f} />
          <Aviso de={criada} texto="Conta VRB-0003 criada" />
        </Janela>
        <Cursor
          pontos={caminho(
            [700, 760],
            [
              [m("aba"), aba.x, aba.y],
              [clique, BOTAO_NOVA_CONTA.x, BOTAO_NOVA_CONTA.y],
              [f.forn, CAMPO_NC.forn.x, CAMPO_NC.forn.y],
              [f.nome, CAMPO_NC.nome.x, CAMPO_NC.nome.y],
              [f.comb, CAMPO_NC.comb.x, CAMPO_NC.comb.y],
              [f.salvar, CAMPO_NC.salvar.x, CAMPO_NC.salvar.y],
            ],
          )}
          cliques={[m("aba"), clique, f.forn, f.nome, f.comb, f.salvar]}
        />
      </Camera>
      <Surge de={m("várias") - 4} style={{ left: 1100, top: 600 }}>
        <div style={{ background: VERDE, color: "#0B0B0C", ...TITULO, fontSize: 32, padding: "14px 22px", borderRadius: 12, lineHeight: 1.15 }}>
          Uma conta
          <br />
          por finalidade
        </div>
      </Surge>
    </AbsoluteFill>
  );
};

// ---------- 2. Colocar dinheiro
const contaVazia = { movs: [] as Mov[], disp: "R$ 0,00", cred: "R$ 0,00", gasto: "R$ 0,00", n: 0 };
export const CreditoV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const clique = m("Novo") + 2;
  const b = BOTAO_CONTA("Novo crédito");
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 480], [[clique, 1.4, b.x + 120, b.y + 80], [m("Abre") + 6, 1.15, 820, 420], [m("destino"), 1.5, w(MNA.x + 350, 0).x, w(0, MNA.y + 330).y], [m("escolhe"), 1.4, w(MNA.x + 350, 0).x, w(0, MNA.y + 440).y]], c.dur)}>
        <Janela ativo={MODULO}>
          <PaginaConta {...contaVazia} cliques={{ "Novo crédito": clique }} acesos={frame < clique + 2 && frame >= clique - 14 ? ["Novo crédito"] : []} />
          <ModalCredito de={clique + 4} quando={null} destinoAceso={entre(frame, m("destino") - 6, m("escolhe") - 4)} acesoAgora={frame >= m("escolhe") - 4} acesoPagar={frame >= m("escolhe") - 4} />
        </Janela>
        <Cursor pontos={caminho([1100, 700], [[clique, b.x, b.y]])} cliques={[clique]} />
      </Camera>
    </AbsoluteFill>
  );
};
export const QuandoV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const agoraF = m("Agora");
  const pagar = m("Quando");
  const quando: Quando = frame >= pagar ? "pagar" : "agora";
  const rAgora = w(MNA.x + 40, MNA.y + 380);
  const rPagar = w(MNA.x + 40, MNA.y + 454);
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.4, w(MNA.x + 350, 0).x, w(0, MNA.y + 440).y], [[m("valor"), 1.25, w(MNA.x + 350, 0).x, w(0, MNA.y + 560).y], [pagar, 1.45, w(MNA.x + 350, 0).x, w(0, MNA.y + 450).y], [m("Nos"), 1.45, w(MNA.x + 350, 0).x, w(0, MNA.y + 470).y]], c.dur)}>
        <Janela ativo={MODULO}>
          <PaginaConta {...contaVazia} />
          <ModalCredito de={-20} quando={quando} acesoAgora={entre(frame, agoraF - 6, m("Se", 1) - 4)} acesoPagar={entre(frame, pagar - 6, m("Nos") - 4)} notaAcesa={frame >= m("continua") - 4} valor={m("valor")} />
        </Janela>
        <Cursor pontos={caminho([1100, 760], [[agoraF, rAgora.x, rAgora.y], [m("valor"), w(MNA.x + 180, 0).x, w(0, MNA.y + 768).y], [pagar, rPagar.x, rPagar.y]])} cliques={[agoraF, pagar]} />
      </Camera>
      <Surge de={m("hora") - 4} ate={pagar - 4} style={{ left: 60, top: 380 }}>
        <div style={{ background: VERDE, color: "#0B0B0C", ...TITULO, fontSize: 32, padding: "14px 22px", borderRadius: 12, lineHeight: 1.15 }}>
          Agora: vira
          <br />
          saldo na hora
        </div>
      </Surge>
      <Surge de={m("recebimento") - 4} ate={m("Nos") - 4} style={{ left: 60, top: 380 }}>
        <div style={{ background: "#7FB2FF", color: "#0B0B0C", ...TITULO, fontSize: 30, padding: "14px 22px", borderRadius: 12, lineHeight: 1.2 }}>
          Cada recebimento
          <br />
          vira saldo:
          <div style={{ fontSize: 22, marginTop: 8, fontFamily: fonteApp, fontWeight: 700 }}>
            à mão · Caixa do ERP · planilha
          </div>
        </div>
      </Surge>
    </AbsoluteFill>
  );
};
export const DestinoV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = usaMarca(c);
  const abre = m("Destino");
  const s = spring({ frame: frame - abre - 4, fps, config: { damping: 16 } });
  const opcoes = ["Receber do fornecedor (acordo comum)", "Conta de verba VRB-0001 · Fachadas", "Conta de verba VRB-0003 · Verba de marketing 2026"];
  const sel = w(MNA.x + 350, MNA.y + 328);
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 480], [[abre, 1.45, sel.x, sel.y + 70]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Acordos" />
          {[ACORDOS.a215, ACORDOS.a214, ACORDOS.a209, ACORDOS.a198].map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} apagado />
          ))}
          <Modal de={-20} x={MNA.x} y={MNA.y} w={MNA.w} h={520} titulo="Novo acordo" sub="O que, quanto, como e quando o fornecedor se comprometeu a dar. Competência é o mês do acordo.">
            <Campo rotulo="Fornecedor" x={28} y={146} w={644} select valor="Tintas Horizonte" />
            <Campo rotulo="Modalidade" x={28} y={226} w={312} select valor="Campanha promocional / evento" />
            <Campo rotulo="Forma de recebimento prevista" x={360} y={226} w={312} select valor="Depósito / PIX" />
            <Campo rotulo="Destino" x={28} y={306} w={644} select valor={frame >= m("conta") ? opcoes[2] : opcoes[0]} ativo={frame >= abre - 6} />
            {frame >= abre + 4 && frame < m("conta") + 4 && (
              <div style={{ position: "absolute", left: 28, top: 352, width: 644, borderRadius: 8, background: "#1C201D", border: `1px solid ${COR.borda}`, boxShadow: "0 20px 50px rgba(0,0,0,0.6)", opacity: s, overflow: "hidden" }}>
                {opcoes.map((o, i) => (
                  <div key={o} style={{ height: 46, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 18, background: i === 2 && frame >= m("verba") - 4 ? "rgba(60,224,30,0.18)" : i === 0 ? "rgba(255,255,255,0.05)" : "transparent" }}>
                    {o}
                  </div>
                ))}
              </div>
            )}
          </Modal>
        </Janela>
        <Cursor pontos={caminho([1100, 760], [[abre, sel.x, sel.y], [m("conta"), sel.x, sel.y + 24 + 46 * 2 + 23]])} cliques={[abre, m("conta")]} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- 3. Registrar gastos
const ANTES_GASTO = { movs: [M.cafe2, M.cafe, M.evento, M.credito], disp: "R$ 6.050,00", cred: "R$ 8.000,00", gasto: "R$ 1.950,00", n: 4 };
const DEPOIS_GASTO = { movs: [M.premio, M.cafe2, M.cafe, M.evento, M.credito], disp: "R$ 5.250,00", cred: "R$ 8.000,00", gasto: "R$ 2.750,00", n: 5 };
export const GastoV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const clique = m("Registrar") + 2;
  const f: MarcasGasto = { abre: clique + 4, data: m("data"), valor: m("valor"), cat: m("categoria"), quem: m("recebeu"), loja: m("loja"), desc: m("descrição"), comp: m("comprovante"), registrar: m("comprador") - 4 };
  const feito = (f.registrar ?? 0) + 12;
  const b = BOTAO_CONTA("Registrar gasto");
  const conta = frame >= feito ? DEPOIS_GASTO : ANTES_GASTO;
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.05, 820, 480],
          [
            [clique, 1.35, b.x + 200, b.y + 80],
            [f.data, 1.35, 960, CAMPO_G.valor.y + 60],
            [f.quem, 1.35, 960, CAMPO_G.quem.y + 20],
            [f.comp, 1.35, 960, CAMPO_G.comp.y - 40],
            [feito, 1.1, 820, 520],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <PaginaConta {...conta} cliques={{ "Registrar gasto": clique }} novaLinha={frame >= feito ? feito : undefined} />
          <ModalGasto m={f} disp="R$ 6.050,00" />
          <Toast de={feito} texto="Gasto registrado. Saldo da conta: R$ 5.250,00." />
        </Janela>
        <Cursor
          pontos={caminho(
            [1100, 700],
            [
              [clique, b.x, b.y],
              [f.data, CAMPO_G.data.x, CAMPO_G.data.y],
              [f.valor, CAMPO_G.valor.x, CAMPO_G.valor.y],
              [f.cat, CAMPO_G.cat.x, CAMPO_G.cat.y],
              [f.quem, CAMPO_G.quem.x, CAMPO_G.quem.y],
              [f.loja, CAMPO_G.loja.x, CAMPO_G.loja.y],
              [f.desc, CAMPO_G.desc.x, CAMPO_G.desc.y],
              [f.comp, CAMPO_G.comp.x, CAMPO_G.comp.y],
              [f.registrar ?? 0, CAMPO_G.registrar.x, CAMPO_G.registrar.y],
            ],
          )}
          cliques={[clique, f.data, f.valor, f.cat, f.quem, f.loja, f.desc, f.comp, f.registrar ?? 0]}
        />
      </Camera>
      <Surge de={m("comprador") - 2} style={{ left: 110, top: 160 }}>
        <div style={{ background: VERDE, color: "#0B0B0C", ...TITULO, fontSize: 28, padding: "14px 22px", borderRadius: 12, lineHeight: 1.25 }}>
          Comprador · Assistente
          <br />
          de compras · Trade
          <div style={{ fontFamily: fonteApp, fontWeight: 700, fontSize: 20, marginTop: 6 }}>sem aprovação</div>
        </div>
      </Surge>
    </AbsoluteFill>
  );
};
export const TravaV: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  const f: MarcasGasto = { abre: 6, data: -90, valor: m("Se") - 6, cat: -90, quem: -90, loja: -90, desc: -90, comp: -90, valorTexto: "9.000,00" };
  const erro = m("avisa") - 2;
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.1, 820, 480], [[m("Se") - 6, 1.55, CAMPO_G.valor.x - 60, CAMPO_G.valor.y + 30]], c.dur)}>
        <Janela ativo={MODULO}>
          <PaginaConta {...DEPOIS_GASTO} />
          <ModalGasto m={f} disp="R$ 5.250,00" erro={erro} />
        </Janela>
        <Cursor pontos={caminho([1100, 700], [[f.valor, CAMPO_G.valor.x, CAMPO_G.valor.y]])} cliques={[f.valor]} />
      </Camera>
      <Surge de={m("tranquilo") - 6} style={{ left: 0, right: 0, top: 70, textAlign: "center" }}>
        <Etiqueta>O SALDO NUNCA FICA NEGATIVO</Etiqueta>
      </Surge>
    </AbsoluteFill>
  );
};

// ---------- 4. Extrato e estorno
const DEPOIS_ESTORNO = {
  movs: [M.estorno, M.premio, { ...M.cafe2, estornado: true }, M.cafe, M.evento, M.credito],
  disp: "R$ 5.700,00",
  cred: "R$ 8.000,00",
  gasto: "R$ 2.300,00",
  n: 6,
};
export const ExtratoV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const foco = agora<FocoConta>(frame, [[m("saldo") - 6, "saldo"], [m("comprovante") - 6, "comprovante"], [m("registrou") - 6, "registrou"], [m("ordem") - 4, null]], null);
  const est = ESTORNAR(1);
  const clique = m("estorna");
  const abre = clique + 4;
  const motivo = m("motivo");
  const confirma = m("apaga");
  const feito = confirma + 8;
  const conta = frame >= feito ? DEPOIS_ESTORNO : DEPOIS_GASTO;
  const ok = w(420 + 520 - 28 - 60, 300 + 300 - 50);
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.05, 820, 520],
          [
            [m("saldo"), 1.3, w(cx(4) + 75, 0).x, LINHA(2).y],
            [m("comprovante"), 1.3, w(cx(5) + 100, 0).x - 60, LINHA(2).y],
            [m("registrou"), 1.3, w(cx(1) + 95, 0).x + 160, LINHA(2).y],
            [m("ordem"), 1.05, 820, 560],
            [m("Lançou"), 1.3, 1100, LINHA(1).y],
            [abre + 6, 1.25, 960, 520],
            [feito, 1.15, 820, 560],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <PaginaConta {...conta} foco={foco} acesos={entre(frame, m("Lançou") - 4, clique + 2) ? ["estornar1"] : []} novaLinha={frame >= feito ? feito : undefined} />
          <Modal de={abre} fecha={confirma + 4} x={420} y={300} w={520} h={300} titulo="Estornar gasto de R$ 450,00?" sub="Entra um movimento de sentido contrário no extrato; o original fica, marcado como estornado.">
            <div style={{ position: "absolute", left: 28, top: 124, fontSize: 17, fontWeight: 600 }}>Motivo</div>
            <div style={{ position: "absolute", left: 28, top: 150, width: 464, height: 60, boxSizing: "border-box", borderRadius: 7, background: "#1C201D", border: `2px solid ${frame >= motivo - 4 ? VERDE : COR.borda}`, padding: "10px 14px", fontSize: 18 }}>
              {frame >= motivo ? <Digitando texto="lançado em duplicidade" de={motivo} porFrame={1.2} /> : <span style={{ color: VAZIO }}>Ex.: lançado em duplicidade</span>}
            </div>
            <Botao x={520 - 28 - 120 - 12 - 120} y={300 - 70} w={120} h={42}>
              Cancelar
            </Botao>
            <div style={{ position: "absolute", left: 520 - 28 - 120, top: 300 - 70, width: 120, height: 42, borderRadius: 8, background: "#7A2A2A", display: "grid", placeItems: "center", fontSize: 18, fontWeight: 600, transform: entre(frame, confirma, confirma + 6) ? "scale(0.94)" : "none" }}>Estornar</div>
          </Modal>
          <Toast de={feito} texto="Estornado. O original fica no extrato, marcado como estornado." />
        </Janela>
        <Cursor pontos={caminho([1100, 760], [[clique, est.x, est.y], [motivo, w(420 + 260, 0).x, w(0, 300 + 180).y], [confirma, ok.x, ok.y]])} cliques={[clique, confirma]} />
      </Camera>
    </AbsoluteFill>
  );
};
export const Trava2V: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const clique = m("cancelar") - 2;
  const confirma = m("mostra") - 6;
  const cancelar = w(1300 - 90, 30 + 23);
  const ok = w(420 + 520 - 28 - 80, 300 + 280 - 49);
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 480], [[clique, 1.2, 1000, 400], [confirma + 6, 1.3, 1150, 760]], c.dur)}>
        <Janela ativo={MODULO}>
          <div style={{ position: "absolute", left: 40, top: 26, fontSize: 17, color: COR.suave }}>← Acordos</div>
          <div style={{ position: "absolute", left: 40, top: 56, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: 6 }}>ACD-0230 · TINTAS HORIZONTE</span>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 3, color: VERDE, background: "#14301A", padding: "3px 10px", borderRadius: 5 }}>NO PRAZO</span>
          </div>
          <div style={{ position: "absolute", left: 40, top: 106, fontSize: 18 }}>Verba de marketing 2026 · R$ 8 mil para ações de loja</div>
          <Botao x={1300 - 180 - 12 - 110} y={30} w={110} icone="editar">
            Editar
          </Botao>
          <Botao x={1300 - 180} y={30} w={180} clique={clique} aceso={entre(frame, clique - 14, clique + 2)}>
            Cancelar acordo
          </Botao>
          <Cartao x={40} y={150} w={305} h={130} rotulo="Negociado" valor="R$ 8.000,00" />
          <Cartao x={358} y={150} w={305} h={130} rotulo="Recebido" valor="R$ 0,00" />
          <Cartao x={676} y={150} w={305} h={130} rotulo="Saldo" valor="R$ 8.000,00" cor={COR.amarelo} />
          <Cartao x={994} y={150} w={306} h={130} rotulo="Prazo" valor="31/12/2026" />
          <div style={{ position: "absolute", left: 40, top: 304, width: 820, height: 140, boxSizing: "border-box", borderRadius: 12, background: COR.cartao, border: `1px solid ${COR.borda}`, padding: "18px 22px" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Dados do acordo</div>
            <div style={{ fontSize: 17, color: COR.suave, marginTop: 12 }}>Destino</div>
            <div style={{ fontSize: 18 }}>Conta de verba VRB-0003 · Verba de marketing 2026 (o valor entrou na conta)</div>
          </div>
          <Modal de={clique + 4} fecha={confirma + 8} x={420} y={300} w={520} h={280} titulo="Cancelar este acordo?" sub="O acordo e os recebimentos ficam no histórico; o saldo deixa de ser cobrado.">
            <div style={{ position: "absolute", left: 28, top: 124, fontSize: 17, fontWeight: 600 }}>Motivo</div>
            <div style={{ position: "absolute", left: 28, top: 150, width: 464, height: 46, boxSizing: "border-box", borderRadius: 7, background: "#1C201D", border: `1px solid ${COR.borda}`, padding: "0 14px", display: "flex", alignItems: "center", fontSize: 18 }}>Fornecedor pediu para reduzir a verba</div>
            <Botao x={520 - 28 - 160 - 12 - 120} y={280 - 70} w={120} h={42}>
              Cancelar
            </Botao>
            <Botao x={520 - 28 - 160} y={280 - 70} w={160} h={42} cheio clique={confirma}>
              Cancelar acordo
            </Botao>
          </Modal>
          <Toast de={confirma + 8} erro texto="A conta já gastou parte desta verba: Saldo insuficiente na conta (disponível: R$ 5.700,00). Nada foi alterado." />
        </Janela>
        <Cursor pontos={caminho([1000, 700], [[clique, cancelar.x, cancelar.y], [confirma, ok.x, ok.y]])} cliques={[clique, confirma]} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- 5. Prestar contas
const MP = { x: 370, y: 150, w: 600, h: 560 };
const EmailPrestacao: React.FC<{ readonly foco: "resumo" | "botao" | null }> = ({ foco }) => {
  const linhas: [string, string][] = [
    ["Verba", "VRB-0003 · Verba de marketing 2026"],
    ["Período", "de 01/10/2026 a 31/10/2026"],
    ["Saldo no início", "R$ 0,00"],
    ["Créditos (valor disponibilizado)", "R$ 8.000,00"],
    ["Gastos com comprovante", "R$ 1.950,00 em 3 lançamento(s)"],
    ["Saldo disponível ao fim", "R$ 6.050,00"],
  ];
  return (
    <Email de="Verbas e Acordos <verbas@lojamodelo.com.br> para carla@tintashorizonte.com.br" assunto="Prestação de contas · Verba de marketing 2026" hora="qua, 05/11" largura={900}>
      <LogoLojaModelo />
      <div style={{ fontSize: 20, marginTop: 20 }}>Olá, Carla.</div>
      <div style={{ fontSize: 19, marginTop: 12, lineHeight: 1.5 }}>Segue a prestação de contas da verba que a Tintas Horizonte disponibilizou à Loja Modelo, de 01/10/2026 a 31/10/2026. No link abaixo estão todos os lançamentos, com o comprovante de cada gasto e o extrato em Excel.</div>
      <div style={{ marginTop: 18, outline: foco === "resumo" ? `3px solid ${VERDE}` : "none", outlineOffset: 6, borderRadius: 6 }}>
        {linhas.map(([r, v]) => (
          <div key={r} style={{ display: "flex", borderBottom: "1px solid #E5E7EB", padding: "10px 0", fontSize: 18 }}>
            <span style={{ width: 380, color: "#6B7280" }}>{r}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "inline-block", marginTop: 22, background: "#2B3A8F", color: "white", fontWeight: 700, fontSize: 20, padding: "14px 26px", borderRadius: 8, boxShadow: foco === "botao" ? `0 0 0 4px ${VERDE}` : "none" }}>Ver o extrato e os comprovantes</div>
      <div style={{ fontSize: 15, color: "#6B7280", marginTop: 14 }}>O link vale por 180 dias e só mostra esta verba.</div>
    </Email>
  );
};
const PaginaFornecedor: React.FC<{ readonly foco: "excel" | "comp" | "quem" | null }> = ({ foco }) => {
  const movs = [M.cafe2, M.cafe, M.evento, M.credito];
  const C2 = [150, 190, 420, 150, 150, 220];
  return (
    <div style={{ width: 1340, height: 820, borderRadius: 16, overflow: "hidden", background: COR.fundo, border: "1px solid #333", boxShadow: "0 40px 120px rgba(0,0,0,0.7)", fontFamily: fonteApp, color: COR.texto, position: "relative", backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px" }}>
      <div style={{ height: 40, background: "#1B1E1C", display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: `1px solid ${COR.borda}` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((k) => (
          <div key={k} style={{ width: 12, height: 12, borderRadius: "50%", background: k }} />
        ))}
        <div style={{ marginLeft: 14, fontSize: 15, color: COR.suave }}>agenticoffice.simpli.ia.br/prestacao/…</div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 76, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 10, border: `1px solid ${COR.borda}`, display: "grid", placeItems: "center", color: VERDE }}>
          <Icone nome="carteira" tam={26} />
        </div>
        <div>
          <div style={{ fontSize: 16, color: COR.suave, letterSpacing: 1 }}>LOJA MODELO · PRESTAÇÃO DE CONTAS</div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: 5, marginTop: 4 }}>TINTAS HORIZONTE · VRB-0003 · VERBA DE MARKETING 2026</div>
          <div style={{ fontSize: 17, color: COR.suave, marginTop: 4 }}>Verba de 01/10/2026 a 31/10/2026. Posição em 05/11/2026.</div>
        </div>
      </div>
      {(
        [
          ["Saldo no início", "R$ 0,00"],
          ["Créditos", "R$ 8.000,00"],
          ["Gastos", "R$ 1.950,00"],
          ["Saldo ao fim", "R$ 6.050,00"],
        ] as const
      ).map(([r, v], i) => (
        <div key={r} style={{ position: "absolute", left: 60 + i * 308, top: 196, width: 290, height: 92, boxSizing: "border-box", padding: "14px 18px", borderRadius: 12, background: COR.cartao, border: `1px solid ${COR.borda}` }}>
          <div style={{ fontSize: 15, color: COR.suave }}>{r}</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{v}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 60, top: 316, fontSize: 22, fontWeight: 700 }}>Lançamentos (4)</div>
      <div style={{ position: "absolute", right: 60, top: 306, height: 42, padding: "0 16px", borderRadius: 8, border: `1px solid ${COR.borda}`, display: "flex", alignItems: "center", gap: 8, fontSize: 17, ...luz(foco === "excel") }}>
        <Icone nome="exportar" /> Extrato em Excel
      </div>
      <div style={{ position: "absolute", left: 60, top: 364, width: 1220, borderRadius: 12, border: `1px solid ${COR.borda}`, overflow: "hidden" }}>
        <div style={{ height: 42, display: "flex", alignItems: "center", fontSize: 15, fontWeight: 600, borderBottom: `1px solid ${COR.borda}`, color: COR.suave }}>
          {["Data", "Movimento", "Detalhe", "Valor", "Saldo", "Comprovante"].map((t, k) => (
            <div key={t} style={{ width: C2[k] - (k === 5 ? 60 : 0), padding: "0 12px", boxSizing: "border-box", textAlign: k === 3 || k === 4 ? "right" : "left", ...(k === 1 ? luz(foco === "quem") : k === 5 ? luz(foco === "comp") : {}) }}>
              {t}
            </div>
          ))}
        </div>
        {movs.map((mv) => (
          <div key={mv.saldo} style={{ height: 84, display: "flex", alignItems: "center", fontSize: 16, borderBottom: `1px solid ${COR.borda}` }}>
            <div style={{ width: C2[0], padding: "0 12px", boxSizing: "border-box" }}>{mv.data}</div>
            {/* o fornecedor não vê quem registrou: só o tipo do movimento */}
            <div style={{ width: C2[1], padding: "0 12px", boxSizing: "border-box", background: foco === "quem" ? "rgba(60,224,30,0.08)" : "transparent", alignSelf: "stretch", display: "flex", alignItems: "center" }}>{mv.tipo}</div>
            <div style={{ width: C2[2], padding: "0 12px", boxSizing: "border-box", lineHeight: 1.35 }}>
              {(mv as Mov).titulo && <div style={{ fontWeight: 600 }}>{(mv as Mov).titulo}</div>}
              <div style={{ fontSize: 14, color: COR.suave }}>{mv.detalhe}</div>
            </div>
            <div style={{ width: C2[3], padding: "0 12px", boxSizing: "border-box", textAlign: "right", color: mv.valor.startsWith("−") ? COR.vermelho : COR.texto }}>{mv.valor}</div>
            <div style={{ width: C2[4], padding: "0 12px", boxSizing: "border-box", textAlign: "right", fontWeight: 700 }}>{mv.saldo}</div>
            <div style={{ width: C2[5] - 60, padding: "0 12px", boxSizing: "border-box", fontSize: 14, color: foco === "comp" ? VERDE : COR.suave }}>{(mv as Mov).comp ? `📎 ${(mv as Mov).comp}` : ""}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 26, fontSize: 15, color: COR.suave }}>Esta página mostra só esta verba e é enviada pela Loja Modelo. Dúvidas? Responda ao e-mail da prestação de contas.</div>
    </div>
  );
};
export const PrestarV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = usaMarca(c);
  const clique = m("Prestar") + 2;
  const b = BOTAO_CONTA("Prestar contas");
  const email = m("email") + 2;
  const periodo = m("período");
  const enviar = m("Sai") - 6;
  const sEmail = spring({ frame: frame - enviar - 8, fps, config: { damping: 18 } });
  const pagina = m("onde");
  const sPag = spring({ frame: frame - pagina + 4, fps, config: { damping: 18 } });
  const focoEmail = agora<"resumo" | "botao" | null>(frame, [[m("resumo") - 4, "resumo"], [m("link") - 4, "botao"]], null);
  const focoPag = agora<"excel" | "comp" | "quem" | null>(frame, [[m("comprovantes") - 4, "comp"], [m("Excel") - 4, "excel"], [m("registrou") - 4, "quem"]], null);
  const campoEmail = w(MP.x + 28 + 130, MP.y + 192);
  const campoPer = w(MP.x + 28 + 130, MP.y + 282);
  const btEnviar = w(MP.x + MP.w - 28 - 60, MP.y + MP.h - 49);
  return (
    <AbsoluteFill>
      {frame < pagina && (
        <Camera quadros={rota([1.05, 820, 480], [[clique, 1.4, b.x + 120, b.y + 80], [clique + 10, 1.25, 960, 460]], c.dur)}>
          <Janela ativo={MODULO}>
            <PaginaConta {...ANTES_GASTO} cliques={{ "Prestar contas": clique }} acesos={entre(frame, clique - 14, clique + 2) ? ["Prestar contas"] : []} />
            <Modal de={clique + 4} fecha={enviar + 6} x={MP.x} y={MP.y} w={MP.w} h={MP.h} titulo="Prestar contas ao fornecedor" sub="Sai um e-mail pela caixa corporativa da empresa com o resumo do período e um link (válido por 180 dias) para o fornecedor ver cada lançamento, baixar os comprovantes e o extrato em Excel. Quem registrou cada gasto não aparece.">
              <Campo rotulo="E-mail do fornecedor" x={28} y={192} w={260} valor={tipo(frame, email, "carla@tintashorizonte.com.br", 2)} vazio="contato@fornecedor.com.br" ativo={entre(frame, email - 6, periodo - 4)} />
              <Campo rotulo="Nome do contato (opcional)" x={308} y={192} w={264} valor={se(frame, email + 20, "Carla Mendes")} />
              <Campo rotulo="Período: de" x={28} y={282} w={260} valor={se(frame, periodo, "01/10/2026")} vazio="dd/mm/aaaa" ativo={entre(frame, periodo - 4, enviar)} />
              <Campo rotulo="até" x={308} y={282} w={264} valor={se(frame, periodo + 6, "31/10/2026")} vazio="dd/mm/aaaa" ativo={entre(frame, periodo - 4, enviar)} />
              <div style={{ position: "absolute", left: 28, right: 28, top: 338, fontSize: 14, color: COR.suave, lineHeight: 1.4 }}>Sem datas, vai o extrato desde o início. Com o início, o resumo traz o saldo que a conta tinha antes dele.</div>
              <Campo rotulo="Recado (opcional)" x={28} y={410} w={544} h={60} vazio="Ex.: Segue o uso da verba no 3º trimestre. Podemos combinar o próximo crédito?" />
              <Botao x={MP.w - 28 - 120 - 12 - 120} y={MP.h - 70} w={120} h={42}>
                Cancelar
              </Botao>
              <Botao x={MP.w - 28 - 120} y={MP.h - 70} w={120} h={42} cheio icone="enviar" clique={enviar}>
                Enviar
              </Botao>
            </Modal>
          </Janela>
          <Cursor pontos={caminho([1100, 700], [[clique, b.x, b.y], [email, campoEmail.x, campoEmail.y], [periodo, campoPer.x, campoPer.y], [enviar, btEnviar.x, btEnviar.y]])} cliques={[clique, email, periodo, enviar]} />
        </Camera>
      )}
      {frame >= enviar + 8 && frame < pagina + 10 && <div style={{ position: "absolute", inset: 0, background: `rgba(11,11,12,${0.8 * sEmail})` }} />}
      {frame >= enviar + 8 && frame < pagina + 10 && (
        <div style={{ position: "absolute", left: 960 - 450 * 1.12, top: 60 + (1 - sEmail) * 80, opacity: sEmail * interpolate(frame, [pagina, pagina + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: "scale(1.12)", transformOrigin: "0 0" }}>
          <EmailPrestacao foco={focoEmail} />
        </div>
      )}
      {frame >= pagina - 4 && (
        <div style={{ position: "absolute", left: 960 - 670 * 1.0, top: 120 + (1 - sPag) * 80, opacity: sPag }}>
          <PaginaFornecedor foco={focoPag} />
        </div>
      )}
      {frame >= m("registrou") - 4 && (
        <Surge de={m("registrou") - 4} style={{ left: 1430, top: 40 }}>
          <div style={{ background: VERDE, color: "#0B0B0C", ...TITULO, fontSize: 26, padding: "12px 20px", borderRadius: 12, lineHeight: 1.2 }}>
            Sem o nome de
            <br />
            quem registrou
          </div>
        </Surge>
      )}
      <Surge de={m("cento") - 4} ate={pagina - 4} style={{ left: 80, top: 420 }}>
        <div style={{ background: VERDE, color: "#0B0B0C", ...TITULO, fontSize: 30, padding: "14px 22px", borderRadius: 12, lineHeight: 1.15 }}>
          Link válido
          <br />
          por 180 dias
        </div>
      </Surge>
    </AbsoluteFill>
  );
};
export const LinkV: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  const itens: [number, string, string][] = [
    [m("envios"), "Envios", "cada prestação enviada, com data e período"],
    [m("aberto"), "Link aberto", "se o fornecedor já abriu o link"],
    [m("desativar"), "Desativar link", "corta o acesso quando você quiser"],
  ];
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1, 820, 480], [], c.dur)}>
        <Janela ativo={MODULO}>
          <PaginaConta {...ANTES_GASTO} acesos={["Prestar contas"]} />
        </Janela>
      </Camera>
      <div style={{ position: "absolute", inset: 0, background: "rgba(11,11,12,0.78)" }} />
      <Surge de={2} style={{ left: 0, right: 0, top: 250, textAlign: "center" }}>
        <Etiqueta>NA PRÓPRIA CONTA</Etiqueta>
      </Surge>
      {itens.map(([f, t, d], i) => (
        <Surge key={t} de={f - 4} style={{ left: 150 + i * 560, top: 330 }}>
          <div style={{ width: 500, height: 300, boxSizing: "border-box", borderRadius: 22, background: "#141815", border: "2px solid rgba(60,224,30,0.5)", padding: "40px 40px", boxShadow: "0 0 60px rgba(60,224,30,0.15)" }}>
            <div style={{ fontSize: 56 }}>{["📨", "👁", "⛔"][i]}</div>
            <div style={{ ...TITULO, fontSize: 46, color: "white", marginTop: 16 }}>{t}</div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 24, color: CINZA, marginTop: 10, lineHeight: 1.3 }}>{d}</div>
          </div>
        </Surge>
      ))}
    </AbsoluteFill>
  );
};

// ---------- 6. Acompanhar: Painel e alertas
type FocoPainel = "disp" | "gasto" | "sem" | "parado" | "cat" | "maiores" | null;
const PainelVerbas: React.FC<{ readonly foco: FocoPainel }> = ({ foco }) => (
  <>
    <Cabecalho aba="Painel" />
    <div style={{ position: "absolute", left: 40, top: 262, fontSize: 22, fontWeight: 700 }}>Verbas em conta corrente</div>
    <div style={{ position: "absolute", right: 40, top: 266, fontSize: 17 }}>Abrir as contas</div>
    <Cartao x={40} y={306} w={305} rotulo="Disponível para gastar" valor="R$ 9.900" nota="3 conta(s) ativa(s)" aceso={foco === "disp"} apagado={foco !== null && foco !== "disp"} />
    <Cartao x={358} y={306} w={305} rotulo="Gasto no período" valor="R$ 2.300" nota="3 gasto(s) com comprovante · desde o início" aceso={foco === "gasto"} apagado={foco !== null && foco !== "gasto"} />
    <Cartao x={676} y={306} w={305} rotulo="Contas sem saldo" valor="1" nota="pedir novo crédito ao fornecedor" aceso={foco === "sem"} apagado={foco !== null && foco !== "sem"} />
    <Cartao x={994} y={306} w={306} rotulo="Saldo parado" valor="R$ 4.200" cor={COR.amarelo} nota="1 conta(s) sem movimento há 90+ dias" aceso={foco === "parado"} apagado={foco !== null && foco !== "parado"} />
    {(
      [
        ["Gastos por categoria", 40, "cat", [["Evento / ação na loja", "1 gasto(s)", "R$ 1.050,00"], ["Premiação de vendedor", "1 gasto(s)", "R$ 800,00"], ["Café da manhã / alimentação", "1 gasto(s)", "R$ 450,00"]]],
        ["Maiores saldos para gastar", 676, "maiores", [["VRB-0003", "Tintas Horizonte · Verba de marketing 2026", "R$ 5.700,00"], ["VRB-0001", "Cerâmica Aurora · Fachadas", "R$ 4.200,00"]]],
      ] as const
    ).map(([t, x, k, linhas]) => (
      <div key={t} style={{ position: "absolute", left: x, top: 476, width: 624, height: 330, boxSizing: "border-box", padding: "22px 24px", borderRadius: 12, background: COR.cartao, border: `${foco === k ? 2 : 1}px solid ${foco === k ? VERDE : COR.borda}`, boxShadow: foco === k ? "0 0 40px rgba(60,224,30,0.28)" : "none", opacity: foco !== null && foco !== k ? 0.5 : 1 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{t}</div>
        {linhas.map(([a, b, v]) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", marginTop: 22, borderBottom: `1px solid ${COR.borda}`, paddingBottom: 12 }}>
            <div>
              <div style={{ fontSize: 19 }}>{a}</div>
              <div style={{ fontSize: 15, color: COR.suave }}>{b}</div>
            </div>
            <div style={{ fontSize: 19 }}>{v}</div>
          </div>
        ))}
      </div>
    ))}
  </>
);
export const PainelV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const foco = agora<FocoPainel>(frame, [[m("disponível") - 6, "disp"], [m("gasto") - 6, "gasto"], [m("sem") - 6, "sem"], [m("parado") - 6, "parado"], [m("categoria") - 6, "cat"], [m("maiores") - 6, "maiores"]], null);
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 520], [[m("cartões"), 1.25, 820, 420], [m("parado"), 1.35, w(994 + 153, 0).x - 300, w(0, 380).y], [m("categoria"), 1.2, 820, 640]], c.dur)}>
        <Janela ativo={MODULO}>
          <PainelVerbas foco={foco} />
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};
export const AlertasV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const troca = m("E", 0) - 2;
  const pergunta = "Quanto ainda tem na verba de marketing da Tintas Horizonte?";
  const digita = m("perguntar") - 4;
  const enviada = digita + Math.ceil(pergunta.length / 2.4) + 4;
  const responde = Math.max(enviada + 12, m("exemplo") + 4);
  return (
    <AbsoluteFill>
      {frame < troca ? (
        <>
          <Camera quadros={rota([1.35, w(994 + 153, 0).x - 300, w(0, 380).y], [], c.dur)}>
            <Janela ativo={MODULO}>
              <PainelVerbas foco="parado" />
            </Janela>
          </Camera>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(11,11,12,0.9) 0%, rgba(11,11,12,0.6) 45%, rgba(11,11,12,0) 70%)" }} />
          {(
            [
              ["comprador", "Comprador"],
              ["assistente", "Assistente"],
              ["diretoria", "Diretoria"],
            ] as const
          ).map(([p, t], i) => (
            <Surge key={t} de={m(p) - 4} style={{ left: 120, top: 330 + i * 110 }}>
              <div style={{ background: VERDE, color: "#0B0B0C", ...TITULO, fontSize: 34, padding: "14px 24px", borderRadius: 12 }}>✉ {t}</div>
            </Surge>
          ))}
          <Surge de={m("semanal") - 4} style={{ left: 120, top: 250 }}>
            <Etiqueta>NO E-MAIL SEMANAL</Etiqueta>
          </Surge>
        </>
      ) : (
        <Camera quadros={rota([1.05, 900, 520], [[m("exemplo"), 1.15, 960, 560]], c.dur)}>
          <Janela ativo="Olho de Deus">
            <CabecaOlho />
            <Controles escopo="Geral (a empresa toda)" />
            <div style={{ position: "absolute", left: 40, right: 40, top: 220, height: 590, border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
            <Balao de={enviada} y={250}>
              {pergunta}
            </Balao>
            <Resposta de={responde} y={330} w={900}>
              A conta <b>VRB-0003 · Verba de marketing 2026</b>, da Tintas Horizonte, tem <b style={{ color: VERDE }}>R$ 5.700,00</b> disponíveis. Foram creditados R$ 8.000,00 e gastos R$ 2.300,00, com comprovante. O último gasto foi a premiação de vendedor, em 05/11.
              <div style={{ fontSize: 17, color: COR.suave, marginTop: 8 }}>Fonte: Verbas e Acordos · contas de verba e extrato</div>
            </Resposta>
            <Entrada>{frame < enviada ? <Digitando texto={pergunta} de={digita} porFrame={2.4} /> : undefined}</Entrada>
          </Janela>
        </Camera>
      )}
    </AbsoluteFill>
  );
};

// ---------- 7. Configurações: categorias de gasto
const CATEGORIAS = ["Café da manhã / alimentação", "Premiação de vendedor", "Evento / ação na loja", "Fardamento", "Mídia / marketing", "Brinde", "Viagem / feira", "Outros"];
export const ConfigV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const incluir = m("incluir");
  const adiciona = incluir + 34;
  const lista = frame >= adiciona ? [...CATEGORIAS, "Material de PDV"] : CATEGORIAS;
  const oito = frame >= m("oito") - 4 && frame < incluir - 4;
  const novaOpcao = w(40 + 22 + 240, 262 + 62 + 8 * 46 + 12 + 20);
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 520], [[m("Configurações"), 1.15, 820, 520], [m("oito"), 1.2, 880, 560], [incluir, 1.25, 820, 680]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Configurações" acesa={entre(frame, m("Configurações") - 6, m("Listas") + 10) ? "Configurações" : undefined} />
          <div style={{ position: "absolute", left: 40, top: 262, width: 780, height: 640, boxSizing: "border-box", borderRadius: 12, background: COR.cartao, border: `1px solid ${COR.borda}`, padding: "20px 22px" }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Categorias de gasto da verba</div>
            {lista.map((t, i) => (
              <div key={t} style={{ position: "absolute", left: 22, top: 62 + i * 46, width: 736, height: 38, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1, height: 36, boxSizing: "border-box", borderRadius: 7, background: "#1C201D", border: `1px solid ${oito ? VERDE : COR.borda}`, padding: "0 14px", display: "flex", alignItems: "center", fontSize: 17, boxShadow: i === 8 ? `0 0 0 2px ${VERDE}` : "none" }}>{t}</div>
                <span style={{ fontSize: 16, fontWeight: 600, width: 90 }}>Desativar</span>
              </div>
            ))}
            {frame < adiciona && (
              <div style={{ position: "absolute", left: 22, top: 62 + 8 * 46 + 12, display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 480, height: 40, boxSizing: "border-box", borderRadius: 7, background: "#1C201D", border: `${frame >= incluir ? 2 : 1}px solid ${frame >= incluir ? VERDE : COR.borda}`, padding: "0 14px", display: "flex", alignItems: "center", fontSize: 17 }}>
                  {frame >= incluir + 4 ? <Digitando texto="Material de PDV" de={incluir + 4} porFrame={0.8} /> : <span style={{ color: VAZIO }}>Nova opção</span>}
                </div>
                <div style={{ position: "relative", width: 120, height: 40 }}>
                  <Botao x={0} y={0} w={120} h={40} cheio clique={adiciona - 4}>
                    Adicionar
                  </Botao>
                </div>
              </div>
            )}
          </div>
          <Surge de={m("oito") - 4} style={{ left: 860, top: 330 }}>
            <div style={{ ...TITULO, fontSize: 120, lineHeight: 1, ...textoDegrade }}>8</div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 30, color: CINZA }}>categorias prontas</div>
          </Surge>
        </Janela>
        <Cursor pontos={caminho([1100, 760], [[incluir, novaOpcao.x - 200, novaOpcao.y], [adiciona - 4, novaOpcao.x + 310, novaOpcao.y]])} cliques={[incluir, adiciona - 4]} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Encerramento
export const FimV: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <>
      <FotoAna arquivo="ana-bracos.jpg" x={1080} dur={c.dur} />
      <Sequence from={10} layout="none">
        <TarjaAna x={1120} y={810} />
      </Sequence>
      <Surge de={m("Verba") - 4} style={{ left: 120, top: 200 }}>
        <div style={{ ...TITULO, fontSize: 88, color: "white", lineHeight: 1.05 }}>VERBA BEM USADA,</div>
      </Surge>
      <Surge de={m("comprovada") - 4} style={{ left: 120, top: 300 }}>
        <div style={{ ...TITULO, fontSize: 88, lineHeight: 1.15, ...textoDegrade }}>COMPROVADA</div>
        <div style={{ ...TITULO, fontSize: 88, lineHeight: 1.05, ...textoDegrade }}>E EM DIA.</div>
      </Surge>
      <Surge de={m("Fala") - 4} style={{ left: 120, top: 560 }}>
        <Img src={staticFile("midia/logo-simpli-fundo-escuro.png")} style={{ width: 380, marginLeft: -20 }} />
        <div style={{ fontFamily: fonteMono, fontSize: 30, color: CINZA, marginTop: 4, letterSpacing: 1 }}>simpli.ia.br</div>
      </Surge>
      <Surge de={m("bora") - 4} style={{ left: 120, top: 790 }}>
        <div style={{ background: VERDE, color: FUNDO, ...TITULO, fontSize: 44, padding: "14px 28px", borderRadius: 12 }}>BORA SIMPLIFICAR?</div>
      </Surge>
    </>
  );
};

// ======================= Montagem
const ROTEIRO = montarRoteiro(vozes as unknown as Vozes, [
  "abertura",
  "gancho",
  "conceito",
  { cap: 1, titulo: "CRIAR A CONTA" },
  "conta",
  { cap: 2, titulo: "COLOCAR DINHEIRO" },
  "credito",
  "quando",
  "destino",
  { cap: 3, titulo: "REGISTRAR GASTOS" },
  "gasto",
  "trava",
  { cap: 4, titulo: "O EXTRATO" },
  "extrato",
  "trava2",
  { cap: 5, titulo: "PRESTAR CONTAS" },
  "prestar",
  "link",
  { cap: 6, titulo: "ACOMPANHAR" },
  "painel",
  "alertas",
  { cap: 7, titulo: "CONFIGURAÇÕES" },
  "config",
  ["fim", 75],
]);
export const DURACAO_CONTAS_VERBA = ROTEIRO.duracao;
const TELAS: Record<string, React.FC<P>> = {
  abertura: AberturaV,
  gancho: GanchoV,
  conceito: ConceitoV,
  conta: ContaV,
  credito: CreditoV,
  quando: QuandoV,
  destino: DestinoV,
  gasto: GastoV,
  trava: TravaV,
  extrato: ExtratoV,
  trava2: Trava2V,
  prestar: PrestarV,
  link: LinkV,
  painel: PainelV,
  alertas: AlertasV,
  config: ConfigV,
  fim: FimV,
};
export const ContasVerba: React.FC = () => <Montagem itens={ROTEIRO.itens} duracao={ROTEIRO.duracao} telas={TELAS} pastaVoz="voz/contas-verba" semPip={SEM_PIP} />;
export const INICIOS_CONTAS = Object.fromEntries(ROTEIRO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));
