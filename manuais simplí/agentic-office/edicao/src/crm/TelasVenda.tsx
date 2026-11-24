import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { AbasLinha, Avatar, BotaoCrm, Cabecalho, CampoCrm, CartaoCrm, COR_CRM, Icone, ModalCrm, SeletorCrm, SeloCrm, TelaCrm } from "./Kit";

// ---------- Orçamentos: colunas por estágio com a cadência de follow-up
const LOJA = "1";
type Orc = { nome: string; id: string; fone: string; valor: string; vendedor: string; data: string; aceso?: boolean };
const CardOrc: React.FC<{ o: Orc }> = ({ o }) => (
  <div style={{ background: "#FFFFFF", borderRadius: 11, padding: "11px 13px", marginBottom: 11, boxShadow: o.aceso ? "0 0 0 2px #10B981, 0 8px 20px rgba(16,24,40,0.14)" : "0 1px 3px rgba(16,24,40,0.1)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 8, color: COR_CRM.suave }}>
      <Icone nome="check" tam={14} />
      <Icone nome="xis" tam={14} />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 500, background: COR_CRM.cinza, color: "#344054", borderRadius: 6, padding: "2px 7px" }}><Icone nome="loja" tam={11} /> {LOJA}</span>
      <span style={{ fontSize: 13, fontWeight: 500, background: "#DBEAFE", color: "#1D4ED8", borderRadius: 6, padding: "2px 8px" }}>fisico</span>
    </div>
    <div style={{ fontSize: 14.5, fontWeight: 600 }}>{o.nome} <span style={{ fontWeight: 400, fontSize: 12.5, color: COR_CRM.suave }}>#{o.id}</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: COR_CRM.suave, marginTop: 2 }}><Icone nome="telefone" tam={11} /> {o.fone}</div>
    <div style={{ fontSize: 13, fontStyle: "italic", color: COR_CRM.suave, background: "#FAFBFB", border: `1px solid ${COR_CRM.borda}`, borderRadius: 5, padding: "6px 9px", marginTop: 7 }}>"Orcamento ERP {o.id}"</div>
    <div style={{ display: "inline-block", fontFamily: "monospace", fontWeight: 700, fontSize: 13.5, background: COR_CRM.cinza, borderRadius: 4, padding: "2px 7px", marginTop: 7 }}>{o.valor}</div>
    <div style={{ borderTop: `1px solid ${COR_CRM.borda}`, marginTop: 8, paddingTop: 7, fontSize: 12.5, color: "#344054", display: "flex", alignItems: "center", gap: 6 }}><Icone nome="pessoa" tam={12} /> {o.vendedor}</div>
    <div style={{ fontSize: 12.5, color: COR_CRM.suave, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}><Icone nome="eventos" tam={12} /> {o.data}</div>
  </div>
);
const MARCOS_ORC: Orc = { nome: "MARCOS OLIVEIRA", id: "48213", fone: "+5581900001234", valor: "R$ 6.840,00", vendedor: "RAFAEL LIMA", data: "10/07/2026", aceso: true };
const OUTROS: Orc[] = [
  { nome: "RENATA DIAS", id: "48197", fone: "+558190000733", valor: "R$ 3.940,00", vendedor: "RAFAEL LIMA", data: "09/07/2026" },
  { nome: "SÉRGIO MOURA", id: "48165", fone: "+558190000155", valor: "R$ 1.260,00", vendedor: "JULIANA PRADO", data: "07/07/2026" },
  { nome: "HELENA COSTA", id: "48140", fone: "+558190000609", valor: "R$ 5.320,00", vendedor: "CAMILA TORRES", data: "03/07/2026" },
  { nome: "DIEGO LINS", id: "48122", fone: "+558190000820", valor: "R$ 910,00", vendedor: "BRUNO NUNES", data: "01/07/2026" },
];
const COL_ORC = [
  ["Orçamento Enviado", "#3B82F6", "#D6E2F5", "Orçamentos: 38 | R$ 92.410,00", "6%"],
  ["Follow-up 1", "#8B5CF6", "#DDD6F3", "Orçamentos: 24 | R$ 61.230,00", "4%"],
  ["Follow-up 2", "#A855F7", "#E5D6F5", "Orçamentos: 15 | R$ 34.180,00", "2%"],
  ["Follow-up 3", "#D946EF", "#F0D6F5", "Orçamentos: 9 | R$ 18.760,00", "1%"],
] as const;

export const TelaOrcamentos: React.FC<{ coluna?: number }> = ({ coluna = 0 }) => (
  <TelaCrm ativo="orcamentos">
    <Cabecalho sobre="Acompanhe seus orçamentos do envio até o fechamento" titulo="Orçamentos" descricao="Gerencie o ciclo de vida dos seus orçamentos com acompanhamento por estágios." />
    <div style={{ display: "flex", gap: 14, marginBottom: 15 }}>
      {[
        ["Total Orçamentos", "R$ 1.482.640,00", COR_CRM.texto, ""],
        ["Total Vendido", "R$ 921.380,00", "#059669", "62% do total"],
        ["Total Perdido", "R$ 354.910,00", "#DC2626", "24% do total"],
        ["Ticket Médio", "R$ 3.418,20", COR_CRM.texto, ""],
      ].map(([r, v, c, s]) => (
        <CartaoCrm key={r} estilo={{ flex: 1, padding: "10px 15px", height: 86, boxSizing: "border-box" }}>
          <div style={{ fontSize: 13, color: COR_CRM.suave }}>{r}</div>
          <div style={{ fontSize: 21, fontWeight: 700, color: c }}>{v}</div>
          {s ? <SeloCrm fundo={c === "#059669" ? "#D1FAE5" : "#FEE2E2"} cor={c}>{s}</SeloCrm> : null}
        </CartaoCrm>
      ))}
    </div>
    <CartaoCrm estilo={{ display: "flex", gap: 11, padding: "10px 14px", marginBottom: 14 }}>
      <div style={{ width: 66, height: 38, background: "#F6F8F7", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}><Icone nome="busca" tam={15} cor={COR_CRM.suave} /></div>
      {["Todos os Dias", "Todas Equipes", "Todas as Lojas", "Todos vendedores"].map((t) => <SeletorCrm key={t} texto={t} estilo={{ flex: 1, background: "#F6F8F7" }} />)}
    </CartaoCrm>
    <div style={{ display: "flex", gap: 13 }}>
      {COL_ORC.map(([nome, cor, fundo, resumo, pct], i) => (
        <div key={nome} style={{ flex: 1, height: 566, background: "#EEF1F4", borderRadius: 11, borderTop: `3px solid ${cor}`, padding: "11px 13px", boxSizing: "border-box", overflow: "hidden" }}>
          <div style={{ background: fundo, borderRadius: 6, padding: "8px 11px", display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
            {nome} <span style={{ fontSize: 12, fontWeight: 400, color: "#475467" }}>{pct}</span>
          </div>
          <div style={{ fontSize: 11.5, color: COR_CRM.suave, marginBottom: 8 }}>{resumo}</div>
          {i === coluna ? <CardOrc o={MARCOS_ORC} /> : null}
          <CardOrc o={OUTROS[i]} />
        </div>
      ))}
    </div>
  </TelaCrm>
);

// ---------- Tarefas do vendedor: colunas por prioridade
const Vazia: React.FC = () => <div style={{ background: "#F6F8F7", borderRadius: 9, padding: "28px 0", textAlign: "center", fontSize: 14, color: COR_CRM.suave }}>Nenhuma tarefa nesta prioridade.</div>;
export const TelaTarefas: React.FC<{ acao?: boolean }> = ({ acao }) => (
  <TelaCrm ativo="tarefas">
    <Cabecalho sobre="Sua rotina operacional" titulo="Tarefas" direita={<><div style={{ display: "flex", background: "#FFFFFF", borderRadius: 8, padding: 3 }}>{["Tarefas", "Lembretes"].map((t, i) => <div key={t} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 14.5, color: i ? COR_CRM.suave : "#FFFFFF", background: i ? "transparent" : "#101828" }}>{t}</div>)}</div><BotaoCrm icone="mais" primario>Nova tarefa</BotaoCrm></>} />
    <div style={{ display: "flex", gap: 14, marginBottom: 15 }}>
      {[["Tarefas pendentes", "3"], ["Tarefas concluidas", "12"], ["% de conclusao", "80%"]].map(([r, v]) => (
        <CartaoCrm key={r} estilo={{ flex: 1, padding: "11px 16px" }}>
          <div style={{ fontSize: 13, color: COR_CRM.suave }}>{r}</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{v}</div>
        </CartaoCrm>
      ))}
    </div>
    <div style={{ display: "flex", gap: 7, background: "#FFFFFF", borderRadius: 10, padding: 9, marginBottom: 16 }}>
      {["Hoje", "Esta semana", "Personalizado"].map((t, i) => (
        <div key={t} style={{ padding: "6px 13px", borderRadius: 7, fontSize: 14.5, color: i === 0 ? "#FFFFFF" : COR_CRM.texto, background: i === 0 ? "#101828" : "#FFFFFF", border: `1px solid ${i === 0 ? "#101828" : COR_CRM.borda}` }}>{t}</div>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 24, fontWeight: 700 }}><Icone nome="relogio" tam={20} cor="#EA580C" /> <span style={{ flex: 1 }}>Tarefas pendentes</span><BotaoCrm icone="mais">Tarefa</BotaoCrm></div>
    <div style={{ fontSize: 14, color: COR_CRM.suave, margin: "3px 0 12px" }}>Todas as tarefas que ainda nao foram concluidas.</div>
    <div style={{ display: "flex", gap: 16 }}>
      {[["Alta", "#EF4444", "1 tarefas"], ["Media", "#F59E0B", "0 tarefas"], ["Baixa", "#3B82F6", "0 tarefas"]].map(([p, c, n], i) => (
        <div key={p} style={{ flex: 1, background: "#FFFFFF", borderRadius: 11, borderTop: `3px solid ${c}`, padding: "13px 15px", height: 286, boxSizing: "border-box" }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{p}</div>
          <div style={{ fontSize: 13, color: COR_CRM.suave, marginBottom: 11 }}>{n}</div>
          {i === 0 ? (
            <div style={{ border: `1px solid ${acao ? "#10B981" : COR_CRM.borda}`, borderRadius: 10, padding: "11px 13px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 13, color: "#475467", marginBottom: 7 }}>
                {["enviar", "chat", "resolver", "lapis", "lixeira"].map((x) => <Icone key={x} nome={x} tam={15} />)}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.4 }}>Follow-up 1 - Orçamento em aberto: Marcos, porcelanato do banheiro, R$ 6.840,00, 5 dias em aberto</div>
              <div style={{ background: "#F6F8F7", borderRadius: 7, padding: "7px 9px", marginTop: 9 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>Marcos Oliveira</div>
                <div style={{ fontSize: 12.5, color: COR_CRM.suave }}>+5581900001234</div>
              </div>
            </div>
          ) : <Vazia />}
        </div>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 24, fontWeight: 700, marginTop: 18 }}><Icone nome="resolver" tam={20} cor="#16A34A" /> Tarefas concluidas</div>
  </TelaCrm>
);

// ---------- CRM Clientes
export const CORES_CLASSE: Record<string, [string, string]> = {
  Novo: ["#E0F2FE", "#0284C7"],
  Ativo: ["#D1FAE5", "#059669"],
  Recorrente: ["#F3E8FF", "#7C3AED"],
  Vip: ["#FEF3C7", "#B45309"],
  "Em Risco": ["#FFEDD5", "#EA580C"],
  Inativo: [COR_CRM.cinza, "#667085"],
};
const CARTOES = [
  ["8.420", "Total", "#101828", "#EAECEF"],
  ["612", "Novos", "#0284C7", "#E0F2FE"],
  ["1.184", "Ativos", "#059669", "#D1FAE5"],
  ["943", "Recorrentes", "#7C3AED", "#F3E8FF"],
  ["218", "VIP", "#D97706", "#FEF3C7"],
  ["536", "Em risco", "#EA580C", "#FFEDD5"],
  ["4.927", "Inativos", "#475467", COR_CRM.cinza],
] as const;
const DICAS: Record<string, string> = {
  Novos: "Clientes ainda sem compra ou com 1 única compra recente.",
  Ativos: "Clientes com 2 a 4 compras realizadas.",
  Recorrentes: "Clientes com 5 ou mais compras realizadas.",
  VIP: "5 ou mais compras e R$ 30.000 ou mais comprados no histórico todo.",
  "Em risco": "Clientes sem compras entre 90 e 120 dias, ainda recuperáveis.",
  Inativos: "Clientes sem compras há mais de 120 dias.",
};
const CLIENTES = [
  ["Ana Beatriz Lemos", "Recorrente", "+558190000110", "9", "R$ 12.430,00", "28/10/2026", "2"],
  ["Bruno Cavalcanti", "Ativo", "+558190000274", "3", "R$ 2.190,00", "12/10/2026", "0"],
  ["Construtora Horizonte", "Vip", "+558190000302", "31", "R$ 148.620,00", "02/11/2026", "4"],
  ["Elaine Freitas", "Novo", "+558190000419", "1", "R$ 684,00", "21/10/2026", "0"],
  ["Fábio Gusmão", "Inativo", "+558190000523", "2", "R$ 1.340,00", "11/02/2026", "0"],
  ["Jéssica Matos", "Em Risco", "+558190000688", "2", "R$ 3.210,00", "22/07/2026", "1"],
] as const;

export const SeloClasse: React.FC<{ c: string; maior?: boolean }> = ({ c, maior }) => (
  <span style={{ display: "inline-block", background: CORES_CLASSE[c][0], color: CORES_CLASSE[c][1], fontSize: maior ? 13 : 12, fontWeight: 600, padding: "2px 10px", borderRadius: 999 }}>{c}</span>
);

export const TelaCrmClientes: React.FC<{ dica?: string; classeMarcos?: string; aceso?: number; sobre?: React.ReactNode; ultimaMarcos?: string }> = ({ dica, classeMarcos = "Ativo", aceso, sobre, ultimaMarcos = "18/07/2026" }) => {
  const linhas: (readonly [string, string, string, string, string, string, string])[] = [...CLIENTES.slice(0, 5), ["Marcos Oliveira", classeMarcos, "+5581900001234", "2", "R$ 8.055,40", ultimaMarcos, "1"], ...CLIENTES.slice(5)];
  return (
    <TelaCrm ativo="crm" sobre={sobre}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 21, fontWeight: 700, marginBottom: 14 }}><Icone nome="contatos" tam={20} /> CRM Clientes</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {CARTOES.map(([n, r, c, f], i) => (
          <div key={r} style={{ position: "relative", flex: 1, height: 100, boxSizing: "border-box", background: i === 0 ? "#E4E6E6" : "#FFFFFF", border: i === 0 ? "2px solid #101828" : aceso === i ? "2px solid #10B981" : `1px solid ${COR_CRM.borda}`, borderRadius: 12, padding: "10px 13px" }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: f, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 3 }}><Icone nome="contatos" tam={14} cor={c} /></div>
            <div style={{ fontSize: 20, fontWeight: 700, color: c, lineHeight: 1.15 }}>{n}</div>
            <div style={{ fontSize: 12, color: COR_CRM.suave }}>{r}</div>
            <div style={{ position: "absolute", right: 8, top: 8 }}><Icone nome="info" tam={13} cor={COR_CRM.apagado} /></div>
            {dica === r ? <div style={{ position: "absolute", top: 8, right: i > 4 ? 0 : "auto", left: i > 4 ? "auto" : 0, width: 256, background: "#FFFFFF", border: `1px solid ${COR_CRM.borda}`, borderRadius: 9, boxShadow: "0 8px 24px rgba(16,24,40,0.16)", padding: "9px 12px", fontSize: 13.5, lineHeight: 1.35, zIndex: 5 }}>{DICAS[r]}</div> : null}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, borderBottom: `1px solid ${COR_CRM.borda}`, marginBottom: 14 }}>
        {["Clientes", "Pesquisa de Produto", "Pesquisa por Período"].map((t, i) => <div key={t} style={{ padding: "8px 15px", fontSize: 15.5, color: i === 0 ? COR_CRM.texto : COR_CRM.suave, borderBottom: i === 0 ? "2px solid #101828" : "2px solid transparent", marginBottom: -1 }}>{t}</div>)}
      </div>
      <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 12 }}>
        <div style={{ flex: 1, height: 38, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, background: "#FFFFFF", display: "flex", alignItems: "center", gap: 7, padding: "0 11px", fontSize: 14.5, color: COR_CRM.suave }}><Icone nome="busca" tam={14} /> Buscar por nome...</div>
        <SeletorCrm texto="Todas as lojas" />
        <SeletorCrm texto="Todas classificações" />
        <Icone nome="ordenar" tam={15} cor={COR_CRM.suave} />
        <SeletorCrm texto="Nome" estilo={{ minWidth: 120 }} />
        <BotaoCrm icone="filtro" estilo={{ color: COR_CRM.suave }}>Todos</BotaoCrm>
        <span style={{ fontSize: 13, color: COR_CRM.suave }}>8.420 clientes</span>
        <BotaoCrm icone="anexo">Exportar</BotaoCrm>
      </div>
      <CartaoCrm estilo={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "26px 2.6fr 1.1fr 1.3fr .7fr 1.1fr 1fr .8fr", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#475467", borderBottom: `1px solid ${COR_CRM.borda}` }}>
          <span style={{ width: 15, height: 15, borderRadius: 3, border: "1.5px solid #98A2B3" }} /><span>Cliente</span><span>Classificação</span><span>Telefone</span><span style={{ textAlign: "right" }}>Compras</span><span style={{ textAlign: "right" }}>Total Comprado</span><span style={{ textAlign: "right" }}>Última Compra</span><span style={{ textAlign: "right" }}>Orçamentos</span>
        </div>
        {linhas.map(([n, cl, t, q, v, u, o]) => (
          <div key={n} style={{ display: "grid", gridTemplateColumns: "26px 2.6fr 1.1fr 1.3fr .7fr 1.1fr 1fr .8fr", alignItems: "center", height: 43, padding: "0 16px", fontSize: 14.5, borderBottom: `1px solid ${COR_CRM.borda}`, background: n === "Marcos Oliveira" ? "#F0FDF4" : "#FFFFFF" }}>
            <span style={{ width: 15, height: 15, borderRadius: 3, border: "1.5px solid #98A2B3" }} /><span style={{ fontWeight: 500 }}>{n}</span><span><SeloClasse c={cl} /></span><span>{t}</span>
            <span style={{ textAlign: "right", fontWeight: 600 }}>{q}</span><span style={{ textAlign: "right", fontFamily: "monospace" }}>{v}</span><span style={{ textAlign: "right", color: COR_CRM.suave }}>{u}</span><span style={{ textAlign: "right", color: COR_CRM.suave }}>{o}</span>
          </div>
        ))}
      </CartaoCrm>
    </TelaCrm>
  );
};

// ---------- ficha do cliente: indicadores, linha do tempo e compras
const LINHA_TEMPO = [
  ["pessoaMais", "#667085", "Entrou na base", "", "02/07/26", ""],
  ["sobe", "#667085", "Classificado como", "Novo", "11/07/26", ""],
  ["orcamentos", "#059669", "Primeira compra", "", "11/07/26", ""],
  ["sobe", "#667085", "Classificado como", "Ativo", "18/07/26", "(antes: Novo)"],
  ["eventos", "#7C3AED", "Participou do evento", "", "18/07/26", "Semana do Piso"],
] as const;
export const ModalCliente: React.FC<{ rolagem?: number }> = ({ rolagem = 0 }) => (
  <ModalCrm largura={880} topo={26}>
    <div style={{ height: 836, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "16px 22px", borderBottom: `1px solid ${COR_CRM.borda}`, background: "#FFFFFF", position: "relative", zIndex: 2 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 19, fontWeight: 700 }}>MARCOS OLIVEIRA <SeloClasse c="Ativo" /></div>
          <div style={{ fontSize: 13, color: COR_CRM.suave }}>Cód. 14284 · Origem: erp_lojamodelo</div>
        </div>
        <BotaoCrm icone="loja">É construtor</BotaoCrm>
        <BotaoCrm icone="anexo" estilo={{ margin: "0 7px" }}>PDF</BotaoCrm>
        <BotaoCrm icone="chat" estilo={{ background: "#101828", color: "#FFFFFF", marginRight: 12 }}>Chat</BotaoCrm>
        <Icone nome="xis" tam={17} cor={COR_CRM.suave} />
      </div>
      <div style={{ padding: "13px 22px", transform: `translateY(${-rolagem}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: "#344054", marginBottom: 11 }}><Icone nome="telefone" tam={13} /> +5581900001234</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
          {[
            ["orcamentos", "2", "Compras", COR_CRM.texto],
            ["estrela", "R$ 8.055,40", "Total Comprado", "#059669"],
            ["pacote", "R$ 4.027,70", "Ticket Médio", "#0284C7"],
            ["sobe", "R$ 8.055,40", "Últimos 12 meses", "#7C3AED"],
            ["documento", "1", "Orçamentos", "#7C3AED"],
            ["estrela", "R$ 6.840,00", "Total Orçado", "#EA580C"],
            ["orcamentos", "11/07/2026", "Primeira Compra", "#475467"],
          ].map(([i, v, r, c]) => (
            <div key={r} style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 10, padding: "9px 13px" }}>
              <Icone nome={i} tam={15} cor={c} />
              <div style={{ fontSize: 17, fontWeight: 700, color: c }}>{v}</div>
              <div style={{ fontSize: 12, color: COR_CRM.suave }}>{r}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 7 }}>Linha do tempo (5) <span style={{ fontSize: 12.5, fontWeight: 400, color: COR_CRM.suave }}>— a vida do cliente na empresa</span></div>
        {LINHA_TEMPO.map(([ic, cor, t, cl, d, x]) => (
          <div key={t + d + cl} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 14.5, height: 31 }}>
            <Icone nome={ic} tam={15} cor={cor} />
            <span style={{ fontWeight: 500 }}>{t}</span>
            {cl ? <SeloClasse c={cl} /> : null}
            <span style={{ fontSize: 12.5, color: COR_CRM.suave }}>{d}</span>
            <span style={{ fontSize: 12.5, color: COR_CRM.suave }}>{x}</span>
          </div>
        ))}
        <div style={{ fontSize: 15, fontWeight: 600, margin: "13px 0 7px" }}>Compras (2) <span style={{ fontSize: 12.5, fontWeight: 400, color: COR_CRM.suave }}>— clique numa linha para ver a venda</span></div>
        <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 9, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: ".9fr 1.1fr .6fr 1.9fr 1.1fr .5fr", padding: "8px 13px", fontSize: 12.5, fontWeight: 600, background: "#F9FAFB" }}>
            <span>Pedido</span><span>Data</span><span>Loja</span><span>Vendedor</span><span style={{ textAlign: "right" }}>Valor</span><span style={{ textAlign: "right" }}>Fat.</span>
          </div>
          {[["#57909", "18/07/2026", "R$ 6.840,00"], ["#57412", "11/07/2026", "R$ 1.215,40"]].map(([p, d, v]) => (
            <div key={p} style={{ display: "grid", gridTemplateColumns: ".9fr 1.1fr .6fr 1.9fr 1.1fr .5fr", padding: "9px 13px", fontSize: 13.5, borderTop: `1px solid ${COR_CRM.borda}` }}>
              <span style={{ color: COR_CRM.suave }}>{p}</span><span>{d}</span><span>1</span><span>RAFAEL LIMA</span><span style={{ textAlign: "right", fontFamily: "monospace" }}>{v}</span><span style={{ textAlign: "right", color: "#059669", fontWeight: 600 }}>Sim</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </ModalCrm>
);

// ---------- Ciclo da Obra
const FASES = [["1. Estrutura e Vedação", 214], ["2. Cobertura e Imperme...", 158], ["3. Instalações", 322], ["4. Revestimentos", 968], ["5. Acabamento", 416], ["6. Pintura e Decoração", 288]] as const;
// classe, janela e funil seguem a tela real
const OBRAS = [
  ["MARCOS OLIVEIRA", "14284", "Revestimentos", "No prazo", "25/08/2026", "Rafael Lima", "100"],
  ["ANA BEATRIZ LEMOS", "9812", "Acabamento", "No prazo", "02/08/2026", "Camila Torres", "100"],
  ["VALTER CAMPOS", "7321", "Revestimentos", "No prazo", "11/08/2026", "Bruno Nunes", "96"],
  ["LUCIANA PIRES", "6684", "Instalações", "Na janela", "28/07/2026", "Rafael Lima", "92"],
  ["CONSTRUTORA HORIZONTE", "2155", "Pintura e Decoração", "—", "—", "Juliana Prado", "100"],
  ["PEDRO HENRIQUE FALCÃO", "5120", "Revestimentos", "No prazo", "19/08/2026", "Diego Alves", "88"],
  ["KARLA MONTENEGRO", "4407", "Acabamento", "No prazo", "28/08/2026", "Camila Torres", "85"],
] as const;
export const TelaObra: React.FC<{ acesaFase?: string }> = ({ acesaFase }) => {
  const max = Math.max(...FASES.map((f) => f[1]));
  return (
    <TelaCrm ativo="ciclo-obra">
      <Cabecalho sobre="Inteligência de jornada de obra" titulo="Ciclo da Obra" descricao="Detecta em que fase da obra cada cliente está pelos produtos que compra, para antecipar o retorno e recuperar obra parada." direita={<><BotaoCrm icone="anexo">Baixar PDF</BotaoCrm><BotaoCrm icone="girar">Recalcular base</BotaoCrm></>} />
      <CartaoCrm estilo={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 18px", marginBottom: 11, fontSize: 14.5 }}><Icone nome="pacote" tam={15} /> <span style={{ color: COR_CRM.suave }}>Cobertura do catálogo:</span> <b>82%</b> <span style={{ color: COR_CRM.suave }}>6.150 de 7.500 SKUs classificados</span> <SeloCrm fundo="#FEF9C3" cor="#A16207">1.350 pendentes</SeloCrm></CartaoCrm>
      <div style={{ display: "flex", gap: 10, marginBottom: 11 }}>
        {[["pacote", "2366", "Em obra", "#101828", true], ["resolver", "1182", "Confirmada", "#059669"], ["sobe", "1184", "Provável", "#2563EB"], ["relogio", "1940", "Suspeita", "#D97706"], ["config", "3620", "Manutenção", "#475467"], ["info", "148", "Obra parada", "#DC2626"]].map(([i, n, r, c, sel]) => (
          <div key={r as string} style={{ flex: 1, background: sel ? "#E4E6E6" : "#FFFFFF", border: sel ? "2px solid #101828" : `1px solid ${COR_CRM.borda}`, borderRadius: 11, padding: "9px 13px" }}>
            <Icone nome={i as string} tam={15} cor={c as string} />
            <div style={{ fontSize: 20, fontWeight: 700, color: c as string, lineHeight: 1.2 }}>{n}</div>
            <div style={{ fontSize: 12.5, color: COR_CRM.suave }}>{r}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
        {[["contatos", "Clientes em obra"], ["predio", "Construtores"], ["loja", "Revendedores"], ["documento", "Tarefas de obra"]].map(([ic, t], i) => <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 7, fontSize: 14, color: i ? COR_CRM.suave : COR_CRM.texto, background: i === 0 ? "#E4E6E6" : "transparent", border: i === 0 ? "1px solid #98A2B3" : "1px solid transparent" }}><Icone nome={ic} tam={14} /> {t}</div>)}
      </div>
      <CartaoCrm estilo={{ display: "flex", gap: 9, padding: "8px 11px", marginBottom: 10 }}>
        <div style={{ flex: 1, height: 34, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, display: "flex", alignItems: "center", gap: 7, padding: "0 11px", fontSize: 14, color: COR_CRM.suave }}><Icone nome="busca" tam={14} /> Buscar por nome ou código do cliente</div>
        {["Todos os vendedores", "Todas as fases", "Qualquer janela"].map((t) => <SeletorCrm key={t} texto={t} estilo={{ height: 34, width: 200 }} />)}
      </CartaoCrm>
      <div style={{ display: "flex", gap: 13 }}>
        <CartaoCrm estilo={{ flex: 1, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.9fr 1.1fr 1.2fr .8fr 1fr 1.2fr .5fr", padding: "9px 13px", fontSize: 12, fontWeight: 600, color: "#475467", borderBottom: `1px solid ${COR_CRM.borda}` }}>
            <span>CLIENTE</span><span>CLASSE</span><span>FASE ATUAL</span><span>JANELA</span><span>PRÓX. TRANSIÇÃO</span><span>VENDEDOR</span><span>SCORE</span>
          </div>
          {OBRAS.slice(0, 6).map(([n, id, f, j, p, v, s]) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "1.9fr 1.1fr 1.2fr .8fr 1fr 1.2fr .5fr", alignItems: "center", height: 46, padding: "0 13px", fontSize: 13, borderBottom: `1px solid ${COR_CRM.borda}`, background: n === "MARCOS OLIVEIRA" ? "#F0FDF4" : "#FFFFFF" }}>
              <span style={{ lineHeight: 1.2 }}><b style={{ fontWeight: 600 }}>{n}</b><br /><span style={{ fontSize: 11.5, color: COR_CRM.suave }}>#{id}</span></span>
              <span><SeloCrm fundo="#ECFDF5" cor="#047857">Obra Confirmada</SeloCrm></span>
              <span>{f}</span>
              <span>{j === "—" ? "—" : <SeloCrm fundo={j === "Na janela" ? "#FEF3C7" : COR_CRM.cinza} cor={j === "Na janela" ? "#B45309" : "#475467"}>{j}</SeloCrm>}</span>
              <span>{p}</span><span style={{ color: "#475467" }}>{v}</span><span>{s}</span>
            </div>
          ))}
        </CartaoCrm>
        <CartaoCrm estilo={{ width: 306, padding: "14px 15px", flexShrink: 0, alignSelf: "flex-start" }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 11 }}>Funil de obra</div>
          {FASES.map(([n, q]) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, height: 31, background: n.includes(acesaFase ?? "§") ? "#ECFDF5" : "transparent", borderRadius: 5, padding: "0 3px" }}>
              <span style={{ width: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</span>
              <div style={{ flex: 1, height: 12, background: COR_CRM.cinza, borderRadius: 2 }}><div style={{ width: `${(q / max) * 100}%`, height: "100%", background: "#667085", borderRadius: 2 }} /></div>
              <b style={{ fontWeight: 600, width: 30, textAlign: "right" }}>{q}</b>
            </div>
          ))}
        </CartaoCrm>
      </div>
    </TelaCrm>
  );
};

// lembrete agendado pela conversa
export const ModalLembrete: React.FC = () => (
  <ModalCrm largura={480} topo={150} titulo="Novo lembrete">
    <div style={{ padding: "16px 24px 20px" }}>
      <CampoCrm rotulo="Título *" valor="Retornar para o Marcos sobre o porcelanato" />
      <CampoCrm rotulo="Data e hora *" valor="sexta-feira, 17/07/2026, 09:00" />
      <CampoCrm rotulo="Card vinculado (opcional)" valor="Marcos Oliveira #2231" />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 6 }}>
        <BotaoCrm>Cancelar</BotaoCrm>
        <BotaoCrm primario>Criar lembrete</BotaoCrm>
      </div>
    </div>
  </ModalCrm>
);

export { AbasLinha, Avatar, interpolate, useCurrentFrame };
