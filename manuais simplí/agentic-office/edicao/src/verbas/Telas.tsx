import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, Digitando, Icone } from "../agentic/App";
import { fonteMono, VERDE } from "../fonte";
import { type Acordo, NOVO, PAINEL, type Situacao } from "./dados";

// Telas do módulo Verbas e Acordos. Posições fixas (px da área do módulo, que começa em x=300,
// y=44 da janela) para o cursor e a câmera acertarem os botões.
export const AREA = { x: 300, y: 44, largura: 1340 };
// abas com largura fixa (para o cursor e a câmera acharem cada uma)
const ABAS: [string, number][] = [
  ["Painel", 80],
  ["Acordos", 100],
  ["Verbas", 90],
  ["Recebimentos", 150],
  ["Caixa do ERP", 150],
  ["Fornecedores", 150],
  ["Pendências", 130],
  ["Configurações", 160],
];
const VAO_ABA = 22;
// centro de uma aba, em coordenadas da janela
export const ABA = (nome: string) => {
  let x = AREA.x + 40;
  for (const [n, w] of ABAS) {
    if (n === nome) return { x: x + w / 2, y: AREA.y + 186 + 27 };
    x += w + VAO_ABA;
  }
  throw new Error(`aba ${nome} não existe`);
};

const Botao: React.FC<{ readonly icone?: string; readonly children: React.ReactNode; readonly cheio?: boolean; readonly style?: React.CSSProperties }> = ({ icone, children, cheio, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      height: 52,
      padding: "0 22px",
      borderRadius: 8,
      fontSize: 20,
      fontWeight: 600,
      background: cheio ? "white" : "transparent",
      color: cheio ? "#0B0B0C" : COR.texto,
      border: `1px solid ${cheio ? "white" : COR.borda}`,
      ...style,
    }}
  >
    {icone && <Icone nome={icone} />}
    {children}
  </div>
);

export const Cabecalho: React.FC<{ readonly aba: string; readonly acesa?: string }> = ({ aba, acesa }) => (
  <>
    <div style={{ position: "absolute", left: 40, top: 10, fontSize: 15, color: COR.suave }}>Inteligência Comercial</div>
    <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 16 }}>
      <Icone nome="verbas" tam={36} />
      <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 9 }}>VERBAS E ACORDOS</div>
    </div>
    <div style={{ position: "absolute", right: 40, top: 28, display: "flex", gap: 14 }}>
      <Botao icone="play">Como funciona</Botao>
      <Botao icone="importar">Importar planilha</Botao>
      <Botao icone="exportar">Exportar Excel</Botao>
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 98, fontSize: 19, lineHeight: 1.5, color: COR.suave }}>
      O que cada fornecedor se comprometeu a dar — verba, bonificação em mercadoria, desconto ou depósito — e o que já chegou. Saldo, situação e alertas são
      calculados sozinhos.
    </div>
    {/* abas num quadro, a ativa em botão branco (como no sistema desde nov/2026) */}
    <div style={{ position: "absolute", left: 40 - 14, right: 40 - 14, top: 182, height: 62, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 12, background: "rgba(60,224,30,0.03)" }} />
    <div style={{ position: "absolute", left: 40, right: 40, top: 192, height: 42, display: "flex", gap: VAO_ABA }}>
      {ABAS.map(([a, w]) => (
        <div
          key={a}
          style={{
            width: w,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 19,
            fontWeight: a === aba || a === acesa ? 600 : 500,
            color: a === acesa ? VERDE : a === aba ? "#0B0B0C" : COR.suave,
            borderRadius: 8,
            background: a === aba ? "white" : a === acesa ? "rgba(60,224,30,0.12)" : "transparent",
            boxShadow: a === acesa ? `0 0 0 2px ${VERDE}, 0 0 24px rgba(60,224,30,0.35)` : "none",
          }}
        >
          {a}
        </div>
      ))}
    </div>
  </>
);

// ---------- Painel: 6 cartões; `destaque` acende um cartão; os números contam a partir de `conta`
export const CARTAO_PAINEL = (i: number) => ({ x: 40 + (i % 2) * 640, y: 300 + Math.floor(i / 2) * 156, w: 620, h: 136 });
const real = (v: number) => "R$ " + Math.round(v).toLocaleString("pt-BR");

export const TelaPainel: React.FC<{ readonly conta: number; readonly destaque: number }> = ({ conta, destaque }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame - conta, [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <>
      <Cabecalho aba="Painel" />
      <div style={{ position: "absolute", left: 40, top: 262, fontSize: 17, color: COR.suave }}>
        Posição em 30/10/2026 · valores dos acordos ativos
      </div>
      {PAINEL.map((c, i) => {
        const p = CARTAO_PAINEL(i);
        const aceso = i === destaque;
        const cor = c.cor === "vermelho" ? COR.vermelho : c.cor === "amarelo" ? COR.amarelo : "white";
        return (
          <div
            key={c.rotulo}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
              boxSizing: "border-box",
              padding: "20px 26px",
              borderRadius: 12,
              background: COR.cartao,
              border: `${aceso ? 2 : 1}px solid ${aceso ? VERDE : COR.borda}`,
              boxShadow: aceso ? "0 0 40px rgba(60,224,30,0.28)" : "none",
              opacity: destaque >= 0 && !aceso ? 0.55 : 1,
            }}
          >
            <div style={{ fontSize: 19, color: COR.suave }}>{c.rotulo}</div>
            <div style={{ fontSize: 44, fontWeight: 700, color: cor, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
              {"contagem" in c ? Math.round(c.valor * k) : real(c.valor * k)}
            </div>
            <div style={{ fontSize: 17, color: COR.suave, marginTop: 2 }}>{c.nota}</div>
          </div>
        );
      })}
    </>
  );
};

// ---------- Acordos: barra de filtros + tabela (como no sistema desde nov/2026)
export const BOTAO_NOVO = { x: AREA.x + 1130 + 85, y: AREA.y + 262 + 26 };
// linha i da tabela de acordos (px da área do módulo); o cabeçalho da tabela fica logo acima da linha 0
const TAB_Y = 416;
const LINHA_H = 68;
export const CARTAO_ACORDO = (i: number) => ({ x: 40, y: TAB_Y + i * LINHA_H, w: 1280, h: LINHA_H });
export type ColunaAcordo = "saldo" | "prazo" | "comprador" | "situacao";
const COLS: [string, number, ("dir" | "esq")?, ColunaAcordo?][] = [
  ["Acordo", 100],
  ["Fornecedor", 140],
  ["Descrição", 130],
  ["Situação", 180, "esq", "situacao"],
  ["Negociado", 120, "dir"],
  ["Recebido", 110, "dir"],
  ["Saldo", 120, "dir", "saldo"],
  ["Prazo", 140, "esq", "prazo"],
  ["Comprador", 115, "esq", "comprador"],
  ["Alertas", 125],
];
// x (px da área do módulo) do centro de uma coluna
export const COLUNA_X = (c: ColunaAcordo) => {
  let x = 40;
  for (const [, w, , k] of COLS) {
    if (k === c) return x + w / 2;
    x += w;
  }
  return x;
};

const CHIP: Record<Situacao, [string, string]> = {
  Vencido: ["#3A1616", COR.vermelho],
  "Parcial – vencido": ["#3A1616", COR.vermelho],
  "Vence em breve": ["#3A2E12", COR.amarelo],
  "No prazo": ["#14301A", VERDE],
  "Pendente – sem prazo": ["#3A2E12", COR.amarelo],
  "Em aprovação": ["#2A2D2B", "#C9CCC9"],
};
export const chipSituacao = (s: Situacao) => CHIP[s];

const Celula: React.FC<{ readonly w: number; readonly lado?: "dir" | "esq"; readonly luz?: boolean; readonly children: React.ReactNode }> = ({ w, lado, luz, children }) => (
  <div
    style={{
      width: w,
      flexShrink: 0,
      boxSizing: "border-box",
      padding: "0 8px",
      textAlign: lado === "dir" ? "right" : "left",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      alignSelf: "stretch",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: lado === "dir" ? "flex-end" : "flex-start",
      background: luz ? "rgba(60,224,30,0.10)" : "transparent",
      boxShadow: luz ? `inset 2px 0 0 ${VERDE}, inset -2px 0 0 ${VERDE}` : "none",
    }}
  >
    {children}
  </div>
);

export const CabecalhoTabelaAcordos: React.FC<{ readonly coluna?: ColunaAcordo }> = ({ coluna }) => (
  <div style={{ position: "absolute", left: 40, top: TAB_Y - 46, width: 1280, height: 46, display: "flex", alignItems: "center", borderTop: `1px solid ${COR.borda}`, borderBottom: `1px solid ${COR.borda}`, fontSize: 17, fontWeight: 600 }}>
    {COLS.map(([n, w, lado, k]) => (
      <Celula key={n} w={w} lado={lado} luz={!!k && k === coluna}>
        <span style={{ color: k && k === coluna ? VERDE : COR.texto }}>{n}</span>
      </Celula>
    ))}
  </div>
);

export const CartaoAcordo: React.FC<{
  readonly a: Acordo;
  readonly i: number;
  readonly aceso?: boolean;
  readonly apagado?: boolean;
  readonly acao?: string;
  readonly acaoDe?: number;
  readonly entra?: number;
  readonly alertaAceso?: boolean;
  readonly coluna?: ColunaAcordo;
}> = ({
  a,
  i,
  alertaAceso,
  aceso,
  apagado,
  acao,
  acaoDe = 0,
  entra,
  coluna,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = CARTAO_ACORDO(i);
  const [fundoChip, corChip] = CHIP[a.situacao];
  const s = entra === undefined ? 1 : spring({ frame: frame - entra, fps, config: { damping: 14, stiffness: 120 } });
  const sa = spring({ frame: frame - acaoDe, fps, config: { damping: 16, stiffness: 140 } });
  const corPrazo = a.situacao === "Vencido" || a.situacao === "Parcial – vencido" ? COR.vermelho : a.situacao === "Vence em breve" ? COR.amarelo : COR.suave;
  const prazo = a.prazo.replace(/^Prazo /, "").replace("Sem prazo", "—");
  const [w] = COLS.map((c) => c[1]);
  return (
    <>
      {i === 0 && <CabecalhoTabelaAcordos coluna={coluna} />}
      <div
        style={{
          position: "absolute",
          left: p.x,
          top: p.y,
          width: p.w,
          height: p.h,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${COR.borda}`,
          fontSize: 17,
          background: aceso ? `${corChip}1A` : "transparent",
          boxShadow: aceso ? `inset 0 0 0 2px ${corChip}, 0 0 34px ${corChip}44` : "none",
          borderRadius: aceso ? 6 : 0,
          opacity: (apagado ? 0.35 : 1) * s,
          transform: `translateY(${(1 - s) * -24}px)`,
          overflow: "hidden",
        }}
      >
        <Celula w={w}>{a.codigo}</Celula>
        <Celula w={COLS[1][1]}>{a.fornecedor}</Celula>
        <Celula w={COLS[2][1]}>
          <span style={{ maxWidth: COLS[2][1] - 16, overflow: "hidden", textOverflow: "ellipsis" }}>{a.descricao}</span>
        </Celula>
        <Celula w={COLS[3][1]} luz={coluna === "situacao"}>
          <span style={{ background: fundoChip, color: corChip, fontSize: 15, fontWeight: 600, padding: "3px 9px", borderRadius: 5 }}>{a.situacao}</span>
        </Celula>
        <Celula w={COLS[4][1]} lado="dir">
          {a.negociado}
        </Celula>
        <Celula w={COLS[5][1]} lado="dir">
          <span style={{ color: COR.suave }}>{a.recebido}</span>
        </Celula>
        <Celula w={COLS[6][1]} lado="dir" luz={coluna === "saldo"}>
          <b>{a.saldo}</b>
        </Celula>
        <Celula w={COLS[7][1]} luz={coluna === "prazo"}>
          <span style={{ color: corPrazo, fontSize: 16 }}>{prazo}</span>
        </Celula>
        <Celula w={COLS[8][1]} luz={coluna === "comprador"}>
          <span style={{ fontSize: 16 }}>{a.comprador.replace("(sem comprador)", "—")}</span>
        </Celula>
        <Celula w={COLS[9][1]}>
          {(a.alertas ?? []).map((al) => (
            <span key={al} style={{ border: `1px solid ${alertaAceso ? COR.amarelo : COR.borda}`, color: alertaAceso ? COR.amarelo : COR.suave, fontSize: 13, padding: "1px 6px", borderRadius: 4, marginTop: 2, boxShadow: alertaAceso ? "0 0 12px rgba(245,184,46,0.4)" : "none" }}>
              {al}
            </span>
          ))}
        </Celula>
        {/* faixa "o que fazer" (cena da Situação): entra pela direita, sobre as colunas de valores */}
        {acao && (
          <div
            style={{
              position: "absolute",
              left: 580,
              right: 0,
              top: 8,
              bottom: 8,
              borderRadius: 6,
              background: corChip,
              color: "#0B0B0C",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 22px",
              transform: `translateX(${(1 - sa) * 105}%)`,
            }}
          >
            <span style={{ fontFamily: fonteMono, fontSize: 15, fontWeight: 800, letterSpacing: 2 }}>O QUE FAZER</span>
            <span style={{ fontSize: 23, fontWeight: 700 }}>{acao}</span>
          </div>
        )}
      </div>
    </>
  );
};

// barra da aba Acordos como no sistema: busca e 4 filtros num quadro, Filtrar e o Novo acordo fora
export const FILTRO_ACORDOS = { busca: { x: 40, w: 280 }, aberto: { x: 332, w: 140 }, alerta: { x: 484, w: 140 }, situacao: { x: 636, w: 150 }, comprador: { x: 798, w: 170 } };
export const BarraAcordos: React.FC<{ readonly clique?: number; readonly resumo: string; readonly busca?: boolean; readonly filtros?: boolean }> = ({ clique, resumo, busca, filtros }) => {
  const frame = useCurrentFrame();
  const apertado = clique !== undefined && frame >= clique && frame < clique + 5;
  const brilho = (a?: boolean) => (a ? { border: `2px solid ${VERDE}`, boxShadow: "0 0 22px rgba(60,224,30,0.35)" } : {});
  const sel = (t: string, x: number, w: number) => (
    <div key={t} style={{ position: "absolute", left: x, top: 262, width: w, height: 48, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 8, background: "#1C201D", padding: "0 12px", display: "flex", alignItems: "center", fontSize: 17, whiteSpace: "nowrap", ...brilho(filtros) }}>
      {t} <span style={{ marginLeft: "auto", color: COR.suave }}>⌄</span>
    </div>
  );
  const F = FILTRO_ACORDOS;
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 250, width: 1086, height: 72, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
      <div style={{ position: "absolute", left: F.busca.x, top: 262, width: F.busca.w, height: 48, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 8, background: "#1C201D", padding: "0 14px", display: "flex", alignItems: "center", fontSize: 17, color: "#6B726D", whiteSpace: "nowrap", overflow: "hidden", ...brilho(busca) }}>
        Buscar código, fornecedor, descrição…
      </div>
      {sel("Em aberto", F.aberto.x, F.aberto.w)}
      {sel("Todo alerta", F.alerta.x, F.alerta.w)}
      {sel("Toda situação", F.situacao.x, F.situacao.w)}
      {sel("Todo comprador", F.comprador.x, F.comprador.w)}
      <div style={{ position: "absolute", left: 980, top: 262, width: 122, height: 48, borderRadius: 8, background: "white", color: "#0B0B0C", display: "grid", placeItems: "center", fontSize: 18, fontWeight: 600 }}>Filtrar</div>
      <Botao icone="mais" cheio style={{ position: "absolute", left: 1130, top: 262, width: 170, padding: 0, transform: apertado ? "scale(0.95)" : "none", boxShadow: apertado ? `0 0 0 4px ${VERDE}` : "none" }}>
        Novo acordo
      </Botao>
      <div style={{ position: "absolute", left: 40, top: 332, fontSize: 18, color: COR.suave }}>{resumo}</div>
    </>
  );
};

// ---------- Modal "Novo acordo" (como no sistema): campos, Evidência + Anexar arquivo, o quadro
// "Acordo parcelado" (abre Parcelas / O valor é / Vencimentos) e o quadro "Aprovação do fornecedor",
// tudo no mesmo formulário, que rola. Cada campo se preenche no frame indicado em `m`.
export type MarcasForm = { abre: number; fornecedor: number; modalidade: number; forma: number; descricao: number; valor: number; prevista: number; anexa: number; salvar: number };
export type DadosForm = typeof NOVO;
export type Parcelamento = { readonly marca: number; readonly numero: number; readonly qtd: string; readonly valorDe?: number; readonly vencDe?: number };
export const MODAL = { x: 320, y: 30, w: 700, h: 880 };
// posições no conteúdo do formulário (rola dentro do modal)
const F = { evid: 690, anexar: 744, parc: 800, parcFechado: 50, parcAberto: 124 };
// altura extra do quadro de aprovação quando a resposta é "Sim" (e-mail e nome do responsável + nota)
export const APROV_EMAIL_H = 150;
// `dy`: quanto a explicação da forma empurra o formulário para baixo; `email`: o quadro de aprovação aberto
const fimForm = (aberto: boolean, dy = 0, email = false) => {
  const aprov = dy + F.parc + (aberto ? F.parcAberto : F.parcFechado) + 18;
  const botoes = aprov + 96 + (email ? APROV_EMAIL_H : 0) + 18;
  return { aprov, botoes, total: botoes + 46 + 22 };
};
// quanto rolar para os botões caberem no modal
export const ROLA_FORM = (aberto = false, dy = 0, email = false) => Math.max(0, fimForm(aberto, dy, email).total - MODAL.h);
// altura da explicação curta embaixo da forma escolhida (como no sistema)
export const DY_EXPLICA = (linhas: number) => (linhas ? linhas * 17 + 8 : 0);
// centro de um campo, em coordenadas da janela, com o formulário rolado `rola` px
const naJanela = (x: number, y: number, rola = 0) => ({ x: AREA.x + MODAL.x + x, y: AREA.y + MODAL.y + y - rola });
export const camposForm = (dy = 0, email = false) => ({
  fornecedor: naJanela(28 + 322, 148 + 22),
  modalidade: naJanela(28 + 156, 230 + 22),
  forma: naJanela(352 + 156, 230 + 22),
  explica: naJanela(352 + 156, 282 + dy / 2),
  descricao: naJanela(28 + 322, dy + 394 + 35),
  valor: naJanela(28 + 156, dy + 584 + 22),
  prevista: naJanela(28 + 488, dy + 584 + 22),
  evid: (rola = 0) => naJanela(28 + 322, dy + F.evid + 22, rola),
  anexar: naJanela(28 + 80, dy + F.anexar + 18, ROLA_FORM(false, dy, email)),
  anexarEm: (rola = 0) => naJanela(28 + 80, dy + F.anexar + 18, rola),
  salvar: naJanela(MODAL.w - 28 - 55, fimForm(false, dy, email).botoes + 23, ROLA_FORM(false, dy, email)),
  salvarEm: (rola: number, aberto = false) => naJanela(MODAL.w - 28 - 55, fimForm(aberto, dy, email).botoes + 23, rola),
  parcelado: (rola: number) => naJanela(28 + 30, dy + F.parc + 25, rola),
  parcelas: (rola: number) => naJanela(28 + 13 + 95, dy + F.parc + 70 + 20, rola),
  valorParc: (rola: number) => naJanela(28 + 13 + 203 + 95, dy + F.parc + 70 + 20, rola),
  vencParc: (rola: number) => naJanela(28 + 13 + 406 + 95, dy + F.parc + 70 + 20, rola),
  aprov: (rola: number, aberto = false) => naJanela(28 + 322, fimForm(aberto, dy).aprov + 40, rola),
  sim: (rola: number, aberto = false) => naJanela(28 + 14 + 50, fimForm(aberto, dy).aprov + 68, rola),
  email: (rola: number, aberto = false) => naJanela(28 + 14 + 200, fimForm(aberto, dy).aprov + 96 + 44, rola),
});
export const CAMPO = camposForm();

const Campo: React.FC<{ readonly rotulo: string; readonly x: number; readonly y: number; readonly w: number; readonly h?: number; readonly valor: React.ReactNode; readonly ativo?: boolean; readonly select?: boolean; readonly apagado?: boolean }> = ({
  rotulo,
  x,
  y,
  w,
  h = 44,
  valor,
  ativo,
  select,
  apagado,
}) => (
  <>
    <div style={{ position: "absolute", left: x, top: y - 24, fontSize: 17, fontWeight: 600 }}>{rotulo}</div>
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: 7,
        background: apagado ? "#161917" : "#1C201D",
        border: `${ativo ? 2 : 1}px solid ${ativo ? VERDE : COR.borda}`,
        boxShadow: ativo ? "0 0 18px rgba(60,224,30,0.3)" : "none",
        padding: h > 44 ? "10px 14px" : "0 14px",
        display: "flex",
        alignItems: h > 44 ? "flex-start" : "center",
        fontSize: 18,
        color: apagado ? "#6B726D" : COR.texto,
      }}
    >
      <span style={{ flex: 1, overflow: "hidden", whiteSpace: h > 44 ? "normal" : "nowrap" }}>{valor}</span>
      {select && <span style={{ color: COR.suave }}>⌄</span>}
    </div>
  </>
);

const Caixinha: React.FC<{ readonly marcada: boolean; readonly tam?: number }> = ({ marcada, tam = 20 }) => (
  <span style={{ width: tam, height: tam, flexShrink: 0, borderRadius: 4, border: `2px solid ${marcada ? "#7FB2FF" : "#666"}`, background: marcada ? "#7FB2FF" : "transparent", color: "#0B0B0C", display: "grid", placeItems: "center", fontSize: tam - 6, fontWeight: 900 }}>{marcada ? "✓" : ""}</span>
);

// extras do treinamento: explicação embaixo da forma, aprovação com o e-mail do responsável,
// evidência preenchida num frame próprio e destaques nos quadros
export type ExtrasForm = {
  readonly explicacao?: { readonly de: number; readonly linhas: readonly string[] };
  readonly aprovSim?: number;
  readonly contato?: { readonly email: string; readonly nome: string };
  readonly evid?: number;
  readonly luzAprov?: boolean;
  readonly luzEmail?: boolean;
};
export const ModalNovoAcordo: React.FC<{ readonly m: MarcasForm; readonly dados?: DadosForm; readonly rola?: number; readonly parcelas?: Parcelamento; readonly aprovacao?: "sim" | "nao"; readonly extras?: ExtrasForm }> = ({
  m,
  dados = NOVO,
  rola = 0,
  parcelas,
  aprovacao = "sim",
  extras = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - m.abre, fps, config: { damping: 18, stiffness: 160 } });
  const fecha = interpolate(frame, [m.salvar + 6, m.salvar + 14], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < m.abre || fecha <= 0) return null;
  const ativo = (de: number, ate: number) => frame >= de && frame < ate;
  const ou = (de: number, v: string, vazio = "—") => (frame >= de ? v : <span style={{ color: "#6B726D" }}>{vazio}</span>);
  const L = 28;
  const meio = 332;
  const apertado = frame >= m.salvar && frame < m.salvar + 5;
  const parcelado = !!parcelas && frame >= parcelas.marca;
  const ex = extras.explicacao && frame >= extras.explicacao.de ? extras.explicacao.linhas : [];
  const dy = DY_EXPLICA(ex.length);
  const comEmail = extras.aprovSim !== undefined && frame >= extras.aprovSim;
  const resposta = extras.aprovSim === undefined ? aprovacao : comEmail ? "sim" : "nao";
  const { aprov, botoes } = fimForm(parcelado, dy, comEmail);
  const anexado = frame >= m.anexa + 4;
  const evid = extras.evid ?? m.prevista + 12;
  const borda = (a: boolean) => ({ border: `${a ? 2 : 1}px solid ${a ? VERDE : COR.borda}`, boxShadow: a ? "0 0 18px rgba(60,224,30,0.3)" : "none" });
  const pa = (de: number | undefined) => de !== undefined && frame >= de - 6 && frame < de + 40;
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.55 * s * fecha})` }}>
      <div
        style={{
          position: "absolute",
          left: MODAL.x,
          top: MODAL.y,
          width: MODAL.w,
          height: MODAL.h,
          borderRadius: 14,
          background: "#141815",
          border: `1px solid ${COR.borda}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          opacity: s * fecha,
          transform: `translateY(${(1 - s) * 30}px) scale(${0.96 + 0.04 * s})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: -rola, width: MODAL.w, height: botoes + 80 }}>
          <div style={{ position: "absolute", left: L, top: 26, fontSize: 28, fontWeight: 700 }}>Novo acordo</div>
          <div style={{ position: "absolute", right: L, top: 26, fontSize: 24, color: COR.suave }}>×</div>
          <div style={{ position: "absolute", left: L, right: L, top: 66, fontSize: 17, color: COR.suave, lineHeight: 1.4 }}>
            O que, quanto, como e quando o fornecedor se comprometeu a dar. Competência é o mês do acordo.
          </div>
          <Campo rotulo="Fornecedor" x={L} y={148} w={644} select valor={ou(m.fornecedor, dados.fornecedor, "Escolha…")} ativo={ativo(m.fornecedor - 8, m.modalidade - 8)} />
          <Campo rotulo="Modalidade" x={L} y={230} w={312} select valor={ou(m.modalidade, dados.modalidade)} ativo={ativo(m.modalidade - 8, m.forma - 8)} />
          <Campo rotulo="Forma de recebimento prevista" x={meio + 20} y={230} w={312} select valor={ou(m.forma, dados.forma)} ativo={ativo(m.forma - 8, m.descricao - 8)} />
          {ex.length > 0 && (
            <div style={{ position: "absolute", left: meio + 20, top: 280, width: 312, fontSize: 14, lineHeight: "17px", color: COR.suave, opacity: interpolate(frame - (extras.explicacao?.de ?? 0), [0, 8], [0, 1], { extrapolateRight: "clamp" }) }}>
              {ex.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          )}
          {/* daqui para baixo, tudo desce quando a explicação da forma aparece */}
          <div style={{ position: "absolute", left: 0, top: dy, width: MODAL.w, height: botoes + 80 - dy }}>
            <Campo rotulo="Comprador responsável" x={L} y={312} w={644} select valor={dados.comprador} />
            <Campo
              rotulo="Descrição / condições negociadas"
              x={L}
              y={394}
              w={644}
              h={70}
              valor={<Digitando texto={dados.descricao} de={m.descricao} porFrame={2.2} placeholder="Ex.: Cota Copa — 10x R$ 8 mil, NF de bonificação no fim de cada mês" />}
              ativo={ativo(m.descricao - 8, m.valor - 8)}
            />
            <Campo rotulo="Data da negociação" x={L} y={502} w={312} valor={dados.negociacao} />
            <Campo rotulo="Competência" x={meio + 20} y={502} w={312} apagado={parcelado} valor={parcelado ? "--------- de ----" : ou(m.descricao + 10, dados.competencia, "--------- de ----")} />
            <Campo rotulo={parcelado ? "Valor de cada parcela" : "Valor negociado"} x={L} y={584} w={312} valor={<Digitando texto={dados.valor} de={m.valor} porFrame={1} />} ativo={ativo(m.valor - 8, m.prevista - 8)} />
            <Campo rotulo={parcelado ? "Prazo da 1ª parcela" : "Data prevista de recebimento"} x={meio + 20} y={584} w={312} valor={<Digitando texto={dados.prevista} de={m.prevista} porFrame={1} placeholder="dd/mm/aaaa" />} ativo={ativo(m.prevista - 8, Math.min(m.anexa, evid) - 8)} />
            <div style={{ position: "absolute", left: L, top: 636, display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: COR.suave }}>
              <Caixinha marcada={false} tam={16} /> valor estimado (% sobre compras, a confirmar)
            </div>
            <Campo rotulo="Evidência / documento do acordo" x={L} y={F.evid} w={644} valor={ou(evid, dados.evidencia, "E-mail de 12/10, contrato, OC 4512, WhatsApp salvo…")} ativo={extras.evid !== undefined && ativo(evid - 8, m.anexa - 8)} />
            <div style={{ position: "absolute", left: L, top: F.anexar, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ height: 36, padding: "0 14px", borderRadius: 7, ...borda(ativo(m.anexa - 8, m.salvar - 4)), display: "flex", alignItems: "center", gap: 8, fontSize: 17, fontWeight: 600 }}>📎 Anexar arquivo</div>
              {anexado ? (
                <span style={{ border: `1px solid ${VERDE}`, background: "#14301A", borderRadius: 7, padding: "5px 12px", fontSize: 16, opacity: interpolate(frame - m.anexa - 4, [0, 8], [0, 1], { extrapolateRight: "clamp" }) }}>📎 {dados.anexo}</span>
              ) : (
                <span style={{ fontSize: 15, color: COR.suave }}>PDF, imagem, e-mail (.eml), planilha ou Word, até 4 MB cada{parcelado ? "; vão na 1ª parcela." : "."}</span>
              )}
            </div>
            {/* Acordo parcelado: no próprio formulário */}
            <div
              style={{
                position: "absolute",
                left: L,
                top: F.parc,
                width: 644,
                height: parcelado ? F.parcAberto : F.parcFechado,
                boxSizing: "border-box",
                ...borda(!!parcelas && ativo(parcelas.marca - 8, parcelas.marca + 10)),
                borderRadius: 8,
                padding: "0 13px",
              }}
            >
              <div style={{ height: 48, display: "flex", alignItems: "center", gap: 12, fontSize: 17 }}>
                <Caixinha marcada={parcelado} /> Acordo parcelado (uma linha por parcela)
              </div>
              {parcelado && parcelas && (
                <>
                  {(
                    [
                      ["Parcelas", 0, 190, <Digitando key="n" texto={parcelas.qtd} de={parcelas.numero} porFrame={0.3} />, ativo(parcelas.numero - 6, parcelas.numero + 20), false],
                      ["O valor é", 203, 190, "de cada parcela", pa(parcelas.valorDe), true],
                      ["Vencimentos", 406, 190, "último dia de cada mês", pa(parcelas.vencDe), true],
                    ] as const
                  ).map(([r, x, w, v, a, sel]) => (
                    <div key={r} style={{ position: "absolute", left: 13 + x, top: 48 }}>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{r}</div>
                      <div style={{ marginTop: 4, width: w, height: 40, boxSizing: "border-box", borderRadius: 7, background: "#1C201D", ...borda(a), padding: "0 12px", display: "flex", alignItems: "center", fontSize: 17, whiteSpace: "nowrap", overflow: "hidden" }}>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span>
                        {sel && <span style={{ color: COR.suave }}>⌄</span>}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          {/* Aprovação do fornecedor: também no formulário (posições já com o dy) */}
          <div style={{ position: "absolute", left: L, top: aprov + 10, width: 644, height: 86 + (comEmail ? APROV_EMAIL_H : 0), boxSizing: "border-box", ...borda(!!extras.luzAprov), borderRadius: 8 }} />
          <div style={{ position: "absolute", left: L + 12, top: aprov, padding: "0 6px", background: "#141815", fontSize: 17, fontWeight: 600 }}>Aprovação do fornecedor</div>
          <div style={{ position: "absolute", left: L + 14, top: aprov + 32, fontSize: 17 }}>Enviar e-mail ao fornecedor para aprovar o que foi negociado?</div>
          <div style={{ position: "absolute", left: L + 14, top: aprov + 60, display: "flex", gap: 22, fontSize: 17 }}>
            {(["sim", "nao"] as const).map((k) => (
              <span key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${resposta === k ? VERDE : "#777"}`, display: "grid", placeItems: "center" }}>
                  {resposta === k && <span style={{ width: 8, height: 8, borderRadius: "50%", background: VERDE }} />}
                </span>
                {k === "sim" ? "Sim, enviar" : "Não"}
              </span>
            ))}
          </div>
          {comEmail && (
            <div style={{ position: "absolute", left: L + 14, top: aprov + 96, width: 616, opacity: interpolate(frame - (extras.aprovSim ?? 0), [0, 8], [0, 1], { extrapolateRight: "clamp" }) }}>
              <div style={{ display: "flex", gap: 14, fontSize: 16, fontWeight: 600 }}>
                <span style={{ width: 384 }}>E-mail do responsável no fornecedor</span>
                <span>Nome (opcional)</span>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                <div style={{ width: 384, height: 40, boxSizing: "border-box", borderRadius: 7, background: "#1C201D", ...borda(!!extras.luzEmail), padding: "0 12px", display: "flex", alignItems: "center", fontSize: 17 }}>{extras.contato?.email}</div>
                <div style={{ width: 218, height: 40, boxSizing: "border-box", borderRadius: 7, background: "#1C201D", ...borda(!!extras.luzEmail), padding: "0 12px", display: "flex", alignItems: "center", fontSize: 17 }}>{extras.contato?.nome}</div>
              </div>
              <div style={{ fontSize: 14, color: COR.suave, lineHeight: 1.35, marginTop: 10 }}>
                Sai pela caixa de e-mail corporativa da empresa, com a logo e um link para Aprovar ou Não aprovar (não precisa de acesso à plataforma). A resposta aparece no histórico do acordo.
              </div>
            </div>
          )}
          <Botao style={{ position: "absolute", right: L + 126, top: botoes, height: 46, fontSize: 18 }}>Cancelar</Botao>
          <Botao cheio style={{ position: "absolute", right: L, top: botoes, width: 110, height: 46, padding: 0, fontSize: 18, transform: apertado ? "scale(0.94)" : "none", boxShadow: apertado ? `0 0 0 4px ${VERDE}` : "none" }}>
            Salvar
          </Botao>
        </div>
      </div>
    </div>
  );
};

// aviso de sucesso
export const Aviso: React.FC<{ readonly de: number; readonly texto: string }> = ({ de, texto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - de, fps, config: { damping: 16, stiffness: 140 } });
  if (frame < de) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        top: 262 - 70,
        transform: `translateY(${(1 - s) * -30}px)`,
        opacity: s,
        background: "#14301A",
        border: `1px solid ${VERDE}`,
        color: "white",
        borderRadius: 10,
        padding: "12px 20px",
        fontSize: 19,
        fontWeight: 600,
        display: "flex",
        gap: 10,
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <span style={{ color: VERDE, fontSize: 22 }}>✓</span> {texto}
    </div>
  );
};
