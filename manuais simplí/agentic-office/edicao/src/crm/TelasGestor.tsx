import type React from "react";
import { CabecaEvento, FundoEventos } from "./TelasRelacionamento";
import { AbasLinha, Avatar, BotaoCrm, Cabecalho, CampoCrm, CartaoCrm, COR_CRM, DEGRADE_ATIVO, FONTE_CRM, Icone, ModalCrm, SeletorCrm, SeloCrm, TelaCrm } from "./Kit";

// ---------- Gestão de tarefas: nova tarefa de distribuição
const Pilula: React.FC<{ t: string; on?: boolean }> = ({ t, on }) => <span style={{ padding: "6px 14px", borderRadius: 999, fontSize: 14.5, border: `1px solid ${on ? "#10B981" : COR_CRM.borda}`, background: on ? "#ECFDF5" : "#FFFFFF", color: on ? "#047857" : "#475467" }}>{t}</span>;

const FundoGestao: React.FC = () => <Cabecalho sobre="Distribuição da base do CRM para os vendedores de loja física e digitais" titulo="Gestão de tarefas" direita={<BotaoCrm icone="mais" primario>Nova tarefa</BotaoCrm>} />;

export const TelaNovaTarefa: React.FC<{ base?: string; classe?: boolean; quantidade?: string; frequencia?: string; nome?: string }> = ({ base = "Classificação do CRM", classe, quantidade = "20", frequencia = "Todo dia", nome = "Reativação - Clientes em risco" }) => (
  <TelaCrm
    ativo="gestao-tarefas"
    sobre={
      <ModalCrm largura={860} topo={26} titulo="Nova tarefa de distribuição" sub="Escolha a base, a frequência e as metas">
        <div style={{ padding: "13px 24px 18px" }}>
          <CampoCrm rotulo="Nome" valor={nome} estilo={{ marginBottom: 4 }} />
          <div style={{ fontSize: 12.5, color: COR_CRM.suave, marginBottom: 11 }}>Funil automático: Tarefa - nome da tarefa</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>Para quem</div>
          <div style={{ display: "flex", gap: 7, marginBottom: 13 }}><Pilula t="Loja física" on /><Pilula t="Digital" /></div>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>Base</div>
          <div style={{ display: "inline-flex", background: "#F6F8F7", borderRadius: 8, padding: 3, marginBottom: 9 }}>
            {["Classificação do CRM", "Ciclo da Obra", "Planilha"].map((t) => <div key={t} style={{ padding: "6px 13px", borderRadius: 6, fontSize: 14.5, color: t === base ? "#047857" : "#475467", background: t === base ? "#FFFFFF" : "transparent", boxShadow: t === base ? "0 1px 2px rgba(16,24,40,0.12)" : "none" }}>{t}</div>)}
          </div>
          <div style={{ display: "flex", gap: 7, marginBottom: 14, height: 36 }}>
            {base === "Classificação do CRM" ? ["Novo", "Ativo", "Recorrente", "VIP", "Em risco", "Inativo"].map((t) => <Pilula key={t} t={t} on={classe && t === "Em risco"} />) : null}
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 5 }}>Frequência de distribuição</div><SeletorCrm texto={frequencia} estilo={{ width: "100%" }} /></div>
            <CampoCrm rotulo="Quantidade total por vendedor/rodada" valor={quantidade} estilo={{ flex: 1, marginBottom: 0 }} />
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, margin: "13px 0 6px" }}>Percentual de follow-up na lista (%)</div>
          <div style={{ background: "#F6F8F7", borderRadius: 9, padding: "11px 15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, marginBottom: 9 }}><span style={{ color: "#047857" }}>50% novos</span><span style={{ color: "#6D28D9" }}>50% follow-up</span></div>
            <div style={{ height: 8, borderRadius: 4, background: "#E4E7EC", position: "relative" }}><div style={{ width: "50%", height: "100%", background: "#6D28D9", borderRadius: 4 }} /><div style={{ position: "absolute", left: "50%", top: -5, width: 18, height: 18, marginLeft: -9, borderRadius: 9, background: "#6D28D9" }} /></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: COR_CRM.suave, marginTop: 11 }}>{["0% retornos", "25%", "50%", "75%", "100% retornos"].map((t) => <span key={t}>{t}</span>)}</div>
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "#047857", marginTop: 9 }}>{Number(quantidade) / 2} novos + {Number(quantidade) / 2} retornos por vendedor</div>
        </div>
      </ModalCrm>
    }
  >
    <FundoGestao />
  </TelaCrm>
);

const Ind: React.FC<{ r: string; v: string; s?: string; c?: string }> = ({ r, v, s, c }) => (
  <CartaoCrm estilo={{ flex: 1, padding: "11px 16px" }}>
    <div style={{ fontSize: 13.5, color: COR_CRM.suave }}>{r}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: c ?? COR_CRM.texto, lineHeight: 1.25 }}>{v}</div>
    <div style={{ fontSize: 12.5, color: COR_CRM.suave, minHeight: 16 }}>{s}</div>
  </CartaoCrm>
);

const VENDEDORES = [
  ["Rafael Lima", "50", "12", "6", "46", "41", "22", "7", "R$ 18.940,00"],
  ["Camila Torres", "50", "14", "8", "41", "37", "19", "5", "R$ 12.310,00"],
  ["Bruno Nunes", "50", "11", "9", "38", "29", "21", "4", "R$ 9.280,00"],
  ["Juliana Prado", "50", "9", "—", "33", "21", "18", "3", "R$ 6.770,00"],
  ["Diego Alves", "50", "10", "—", "29", "14", "16", "2", "R$ 3.120,00"],
] as const;
export const TelaTarefaDetalhe: React.FC<{ tabela?: boolean; acesa?: string }> = ({ tabela, acesa }) => (
  <TelaCrm ativo="gestao-tarefas">
    <div style={{ marginTop: -6 }}>
      <div style={{ fontSize: 14.5, color: COR_CRM.suave }}>← Gestão de tarefas</div>
      <Cabecalho titulo="Reativação - Clientes em risco" descricao="Ativa · Todo dia · 50/vendedor · meta 30 abordagens" direita={<><BotaoCrm icone="colunas">Abrir funil</BotaoCrm><BotaoCrm icone="enviar" primario>Distribuir agora</BotaoCrm></>} />
      {tabela ? null : (
        <>
          <div style={{ display: "flex", gap: 13, marginBottom: 13 }}>
            <Ind r="Leads novos distribuídos" v="250" s="Clientes entregues pela primeira vez" />
            <Ind r="Leads redistribuídos" v="56" s="31 clientes distintos" c="#6D28D9" />
            <Ind r="Média de dias até converter" v="7,5" s="21 com hora · 0 só com data" />
            <Ind r="Follow-ups em aberto" v="64" s="18 aguardam rodada · 46 entregues" />
          </div>
          <div style={{ display: "flex", gap: 13, marginBottom: 13 }}>
            <Ind r="Distribuído" v="306" s="250 esta semana · 286 na fila" />
            <Ind r="Dias rodando" v="9" s="9 rodadas" />
            <Ind r="Cliques no WhatsApp" v="187" />
            <Ind r="Aberturas da lista" v="96" s="clique para ver por vendedor" />
          </div>
        </>
      )}
      <div style={{ display: "flex", gap: 13, marginBottom: 13 }}>
        <Ind r="Contatos marcados" v="142" c="#059669" />
        <Ind r="Leads com venda" v="21" s="8,4% de conversão" c="#059669" />
        <Ind r="Meta em R$" v="R$ 50.420,00" s="/ R$ 40.000,00" />
        <Ind r="Meta em %" v="8,4%" s="/ 5%" />
      </div>
      <div style={{ display: "flex", gap: 13, marginBottom: 13 }}>
        <CartaoCrm estilo={{ flex: 3, padding: "13px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475467", marginBottom: 6 }}>Sugestão de mensagem <span style={{ color: "#047857", fontWeight: 600 }}>Editar</span></div>
          <div style={{ fontSize: 15, lineHeight: 1.4 }}>Oi, tudo certo? Aqui é da Loja Modelo. Como ficou a obra? Chegaram louças e metais novos, posso te mostrar?</div>
        </CartaoCrm>
        <Ind r="Cópias da mensagem" v="124" s="5 vendedores copiaram · clique para ver por vendedor" />
      </div>
      {tabela ? (
        <div style={{ display: "flex", gap: 13, marginBottom: 13 }}>
          {[["Top conversão (R$)", "Rafael Lima", "R$ 18.940,00"], ["Top cliques", "Rafael Lima", "46 cliques"], ["Top aberturas", "Rafael Lima", "22 aberturas"]].map(([r, n, v]) => <CartaoCrm key={r} estilo={{ flex: 1, padding: "11px 16px" }}><div style={{ fontSize: 13.5, color: COR_CRM.suave }}>{r}</div><div style={{ fontSize: 16, fontWeight: 600 }}>{n}</div><div style={{ fontSize: 14, color: "#047857" }}>{v}</div></CartaoCrm>)}
        </div>
      ) : null}
      <CartaoCrm estilo={{ overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr .8fr .8fr 1fr .8fr .9fr .9fr .7fr 1.2fr", padding: "11px 18px", fontSize: 12, fontWeight: 600, color: "#475467", borderBottom: `1px solid ${COR_CRM.borda}` }}>
          {["VENDEDOR", "RECEBIDOS", "RETORNOS", "DIAS ATÉ CONVERTER", "CLIQUES", "CONTATADOS", "ABERTURAS", "VENDAS", "VALOR"].map((t) => <span key={t}>{t}</span>)}
        </div>
        {VENDEDORES.map((l) => (
          <div key={l[0]} style={{ display: "grid", gridTemplateColumns: "2fr .8fr .8fr 1fr .8fr .9fr .9fr .7fr 1.2fr", alignItems: "center", height: 49, padding: "0 18px", fontSize: 15, borderBottom: `1px solid ${COR_CRM.borda}`, background: l[0] === acesa ? "#F0FDF4" : "#FFFFFF" }}>
            {l.map((c, i) => <span key={i} style={{ fontWeight: i === 0 ? 500 : 400 }}>{c}</span>)}
          </div>
        ))}
      </CartaoCrm>
    </div>
  </TelaCrm>
);

const ROXO = "#7C22FF";

// ---------- Dashboard: gráfico por hora, cockpits, indicadores e lista de atendimentos
const HORAS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}h`);
const SERIES = [
  { nome: "whatsapp-loja-modelo", cor: "#F59E0B", v: [0, 0, 0, 0, 0, 0, 0, 2, 9, 14, 11, 4], novos: [0, 0, 0, 0, 0, 0, 0, 1, 6, 9, 7, 2] },
  { nome: "loja-modelo-televendas", cor: "#3B82F6", v: [0, 0, 0, 0, 0, 0, 0, 1, 5, 10, 8, 2], novos: [0, 0, 0, 0, 0, 0, 0, 1, 3, 7, 5, 1] },
  { nome: "instagram-loja-modelo", cor: "#10B981", v: [1, 0, 0, 0, 0, 0, 1, 3, 7, 5, 3, 1], novos: [0, 0, 0, 0, 0, 0, 1, 2, 4, 3, 2, 0] },
] as const;
const G_L = 1190;
const G_A = 250;
const px = (i: number) => 34 + (i * (G_L - 44)) / 23;
const py = (v: number) => G_A - 24 - (v / 16) * (G_A - 40);
const curva = (vals: readonly number[]) => {
  const p = HORAS.map((_, i) => [px(i), py(vals[i] ?? 0)]);
  return p.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`;
    const [ax, ay] = p[i - 1];
    const m = (ax + x) / 2;
    return `${d} C${m} ${ay} ${m} ${y} ${x} ${y}`;
  }, "");
};
const GraficoCanais: React.FC = () => (
  <>
    <svg width={G_L} height={G_A} style={{ display: "block", fontFamily: FONTE_CRM }}>
      {[0, 4, 8, 12, 16].map((t) => (
        <g key={t}>
          <line x1={34} x2={G_L - 10} y1={py(t)} y2={py(t)} stroke="#E8ECEF" strokeDasharray="3 3" />
          <text x={26} y={py(t) + 4} textAnchor="end" fontSize={11} fill="#667085">{t}</text>
        </g>
      ))}
      {HORAS.map((h, i) => (
        <g key={h}>
          <line x1={px(i)} x2={px(i)} y1={py(16)} y2={py(0)} stroke="#EEF1F4" strokeDasharray="3 3" />
          <text x={px(i)} y={G_A - 6} textAnchor="middle" fontSize={11} fill="#667085">{h}</text>
        </g>
      ))}
      {SERIES.map((s) => <path key={`${s.nome}n`} d={curva(s.novos)} fill="none" stroke="#98A2B3" strokeWidth={1.6} strokeDasharray="4 3" />)}
      {SERIES.map((s) => <path key={s.nome} d={curva(s.v)} fill="none" stroke={s.cor} strokeWidth={2} />)}
      {SERIES.map((s) => HORAS.map((h, i) => <circle key={s.nome + h} cx={px(i)} cy={py(s.v[i] ?? 0)} r={2.8} fill="#FFFFFF" stroke={s.cor} strokeWidth={1.8} />))}
    </svg>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 16px", fontSize: 12.5, marginTop: 8 }}>
      {SERIES.flatMap((s) => [
        <span key={s.nome} style={{ color: s.cor }}>● {s.nome}</span>,
        <span key={`${s.nome}n`} style={{ color: "#98A2B3" }}>● {s.nome} · novos</span>,
      ])}
    </div>
  </>
);

const Medidor: React.FC<{ valor: string; pct: number; cor: string; rotulo: string; nota: string }> = ({ valor, pct, cor, rotulo, nota }) => {
  const r = 58;
  const pol = (g: number) => [78 + r * Math.cos((g * Math.PI) / 180), 76 - r * Math.sin((g * Math.PI) / 180)];
  const [ax, ay] = pol(200);
  const [bx, by] = pol(-20);
  const d = `M${ax} ${ay} A${r} ${r} 0 1 1 ${bx} ${by}`;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", borderRight: `1px solid ${COR_CRM.borda}` }}>
      <svg width={156} height={108} style={{ fontFamily: FONTE_CRM }}>
        <path d={d} fill="none" stroke="#E4E7EC" strokeWidth={11} strokeLinecap="round" />
        <path d={d} fill="none" stroke={cor} strokeWidth={11} strokeLinecap="round" pathLength={100} strokeDasharray={`${pct} 100`} />
        <text x={78} y={96} textAnchor="middle" fontSize={23} fontWeight={700} fill={cor}>{valor}</text>
      </svg>
      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{rotulo}</div>
      <div style={{ fontSize: 12, color: COR_CRM.suave }}>{nota}</div>
    </div>
  );
};
const Contador: React.FC<{ valor: string; rotulo: string; nota: string; perigo?: boolean }> = ({ valor, rotulo, nota, perigo }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 6 }}>
    <div style={{ width: 66, height: 66, borderRadius: 33, background: perigo ? "#FEE2E2" : "#EEF2F7", color: perigo ? "#DC2626" : "#64748B", fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>{valor}</div>
    {perigo ? <div style={{ fontSize: 12, fontWeight: 500, color: "#DC2626" }}>△ Atenção!</div> : null}
    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{rotulo}</div>
    <div style={{ fontSize: 12, color: COR_CRM.suave }}>{nota}</div>
  </div>
);
const Cockpit: React.FC<{ icone: string; titulo: string; rodape: string; children: React.ReactNode }> = ({ icone, titulo, rodape, children }) => (
  <CartaoCrm estilo={{ marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 18px", borderBottom: `1px solid ${COR_CRM.borda}` }}>
      <div style={{ width: 26, height: 26, borderRadius: 6, background: "#EFE7FF", display: "flex", alignItems: "center", justifyContent: "center" }}><Icone nome={icone} tam={14} cor={ROXO} /></div>
      <span style={{ fontSize: 15.5, fontWeight: 600 }}>{titulo}</span>
      <span style={{ fontSize: 13.5, color: COR_CRM.suave, flex: 1 }}>— hoje</span>
      <span style={{ fontSize: 15, color: ROXO }}>Ver análise completa →</span>
    </div>
    <div style={{ display: "flex", padding: "12px 18px 8px" }}>{children}</div>
    <div style={{ textAlign: "right", fontSize: 12.5, color: COR_CRM.suave, padding: "0 18px 10px" }}>{rodape}</div>
  </CartaoCrm>
);
const ATENDIMENTOS = [
  ["Renata Dias", "+558190000733", "humano_atendendo", "Rafael Lima", "05/11, 10:58"],
  ["Otávio Reis", "+558190000466", "bot_atendendo", "—", "05/11, 10:57"],
  ["Helena Costa", "+558190000609", "aguardando_humano", "—", "05/11, 10:55"],
  ["Sérgio Moura", "+558190000155", "resolvido", "—", "05/11, 10:52"],
  ["Vera Nunes", "+558190000918", "humano_atendendo", "Camila Torres", "05/11, 10:49"],
  ["Diego Lins", "+558190000820", "resolvido", "—", "05/11, 10:44"],
  ["Luiza Ramos", "+558190000917", "humano_atendendo", "Bruno Nunes", "05/11, 10:41"],
] as const;
const COR_TAG: Record<string, string> = { humano_atendendo: "#CFF0E3", bot_atendendo: "#E4DEFA", aguardando_humano: "#FEE2E2", resolvido: "#DBE7FB" };
export const TelaDashboard: React.FC<{ rolagem?: number }> = ({ rolagem = 0 }) => (
  <TelaCrm ativo="dashboard">
    <div style={{ transform: `translateY(${-rolagem}px)` }}>
      <Cabecalho titulo="Dashboard" direita={<><BotaoCrm icone="girar" /><div style={{ display: "flex", background: "#FFFFFF", borderRadius: 8, padding: 3, border: `1px solid ${COR_CRM.borda}` }}>{["Hoje", "Mês", "Personalizado"].map((t, i) => <div key={t} style={{ padding: "5px 13px", borderRadius: 6, fontSize: 14.5, color: i ? COR_CRM.suave : "#FFFFFF", background: i ? "transparent" : "#101828" }}>{t}</div>)}</div></>} />
      <CartaoCrm estilo={{ padding: "14px 24px 14px", marginBottom: 14 }}>
        <div style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 10 }}>Atendimentos por canal (por hora)</div>
        <GraficoCanais />
      </CartaoCrm>
      <Cockpit icone="relogio" titulo="Cockpit de Sentimentos" rodape="Baseado em 86 conversas analisadas hoje">
        <Medidor valor="7.8" pct={78} cor="#16A34A" rotulo="Score de Satisfação" nota="/10" />
        <Medidor valor="67%" pct={67} cor="#16A34A" rotulo="Taxa de Intenção" nota="de compra" />
        <Medidor valor="6.4" pct={64} cor="#D97706" rotulo="Empatia Média" nota="/10" />
        <Contador valor="0" rotulo="Alertas" nota="conv. muito negativas" />
      </Cockpit>
      <Cockpit icone="estrela" titulo="Cockpit de CSAT" rodape="Baseado em 42 respostas de CSAT hoje">
        <Medidor valor="4.3" pct={86} cor="#16A34A" rotulo="Score Médio" nota="/5" />
        <Medidor valor="83%" pct={83} cor="#16A34A" rotulo="Satisfeitos" nota="notas 4 e 5" />
        <Contador valor="1" rotulo="Insatisfeitos" nota="notas 1 e 2" perigo />
      </Cockpit>
      <div style={{ display: "flex", gap: 13, marginBottom: 14 }}>
        {[["robo", "Agente atendendo", "12", "#EDE9FE", "#6D28D9"], ["ajuda", "Aguardando humano", "7", "#FEF3C7", "#D97706"], ["pessoa", "Humano atendendo", "23", "#D1FAE5", "#059669"], ["resolver", "Resolvidos", "86", "#DBEAFE", "#2563EB"]].map(([i, r, v, f, c]) => (
          <CartaoCrm key={r} estilo={{ flex: 1, padding: "13px 16px", display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: f, display: "flex", alignItems: "center", justifyContent: "center" }}><Icone nome={i} tam={22} cor={c} /></div>
            <div><div style={{ fontSize: 14.5, color: COR_CRM.suave }}>{r}</div><div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.15 }}>{v}</div></div>
          </CartaoCrm>
        ))}
      </div>
      <CartaoCrm estilo={{ overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "11px 18px", borderBottom: `1px solid ${COR_CRM.borda}`, gap: 8 }}>
          <span style={{ flex: 1, fontSize: 15.5, fontWeight: 600 }}>Atendimentos (128)</span>
          {["Todos canais", "Todos agentes", "Todas etiquetas"].map((t) => <BotaoCrm key={t} icone="filtro" estilo={{ height: 34, fontSize: 14, color: COR_CRM.suave }}>{t}</BotaoCrm>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1.2fr 1.2fr 1.1fr .8fr", padding: "9px 18px", fontSize: 13, fontWeight: 600, color: "#475467" }}>
          {["Nome", "Celular", "Etiqueta", "Agente"].map((t) => <span key={t}>{t}</span>)}<span style={{ textAlign: "right" }}>Última Msg</span>
        </div>
        {ATENDIMENTOS.map(([n, c, e, a, u]) => (
          <div key={n} style={{ display: "grid", gridTemplateColumns: "1.7fr 1.2fr 1.2fr 1.1fr .8fr", alignItems: "center", height: 46, padding: "0 18px", fontSize: 14.5, borderTop: `1px solid ${COR_CRM.borda}` }}>
            <span style={{ fontWeight: 500 }}>{n}</span><span style={{ color: COR_CRM.suave }}>{c}</span>
            <span><SeloCrm fundo={COR_TAG[e]} cor="#101828">{e}</SeloCrm></span>
            <span style={{ color: COR_CRM.suave }}>{a}</span><span style={{ textAlign: "right", color: COR_CRM.suave, fontSize: 13.5 }}>{u}</span>
          </div>
        ))}
      </CartaoCrm>
    </div>
  </TelaCrm>
);

// ---------- Relatórios
const POR_AGENTE = [["Rafael", 142, 128], ["Camila", 131, 119], ["Bruno", 118, 104], ["Juliana", 96, 88], ["Diego", 84, 71]] as const;
export const TelaRelatorios: React.FC<{ visao?: string; aba?: string }> = ({ visao = "Geral", aba = "Visão Geral" }) => (
  <TelaCrm ativo="relatorios">
    <Cabecalho titulo="Relatórios" direita={<>{["Geral", "Digital", "Loja física"].map((t) => <div key={t} style={{ padding: "6px 13px", borderRadius: 7, fontSize: 14.5, color: t === visao ? "#FFFFFF" : COR_CRM.texto, background: t === visao ? "#101828" : "#FFFFFF", border: `1px solid ${COR_CRM.borda}` }}>{t}</div>)}<SeletorCrm texto={visao === "Loja física" ? "Equipe Loja 1" : "Todas as equipes"} /></>} />
    <div style={{ display: "flex", gap: 7, marginBottom: 13 }}>
      {["Hoje", "Semana", "Mês", "Ano", "Personalizado"].map((t) => <div key={t} style={{ padding: "5px 12px", borderRadius: 7, fontSize: 14, color: t === "Mês" ? "#FFFFFF" : COR_CRM.texto, background: t === "Mês" ? "#101828" : "#FFFFFF", border: `1px solid ${COR_CRM.borda}` }}>{t}</div>)}
      <BotaoCrm icone="girar" estilo={{ height: 32, padding: "0 9px" }} />
      <BotaoCrm icone="subir" estilo={{ height: 32, fontSize: 14 }}>PDF</BotaoCrm>
    </div>
    <div style={{ display: "flex", gap: 6, borderBottom: `1px solid ${COR_CRM.borda}`, marginBottom: 14 }}>
      {["Visão Geral", "Agentes", "Times", "Canais", "Orçamentos", "Auditoria"].map((t) => <div key={t} style={{ padding: "7px 14px", fontSize: 14.5, color: t === aba ? COR_CRM.texto : COR_CRM.suave, borderBottom: t === aba ? "2px solid #101828" : "2px solid transparent", marginBottom: -1 }}>{t}</div>)}
    </div>
    <div style={{ display: "flex", gap: 11, marginBottom: 14 }}>
      {[["chat", "571", "Conversas", "#2563EB"], ["resolver", "510", "Resoluções", "#059669"], ["relogio", "3min", "Tempo 1ª Resposta", "#E11D48"], ["sobe", "42min", "Tempo Resolução", "#0891B2"], ["estrela", "4,6", "CSAT", "#D97706"]].map(([i, v, r, c]) => (
        <CartaoCrm key={r} estilo={{ flex: 1, padding: "10px 14px" }}><Icone nome={i} tam={17} cor={c} /><div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>{v}</div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>{r}</div></CartaoCrm>
      ))}
    </div>
    <div style={{ display: "flex", gap: 13, marginBottom: 14 }}>
      <CartaoCrm estilo={{ flex: 1.3, padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 9 }}><span style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>Conversas por Agente</span><div style={{ display: "flex", border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, padding: 2, fontSize: 12.5 }}>{["Todos", "Conversas", "Resoluções"].map((t, i) => <span key={t} style={{ padding: "2px 9px", borderRadius: 5, color: i ? COR_CRM.suave : "#FFFFFF", background: i ? "transparent" : "#101828" }}>{t}</span>)}</div></div>
        {POR_AGENTE.map(([n, c, r]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, height: 33 }}>
            <span style={{ width: 62, textAlign: "right", color: "#475467" }}>{n}</span>
            <div style={{ flex: 1 }}><div style={{ height: 8, width: `${(c / 150) * 100}%`, background: "#3B82F6", borderRadius: 2, marginBottom: 2 }} /><div style={{ height: 8, width: `${(r / 150) * 100}%`, background: "#10B981", borderRadius: 2 }} /></div>
          </div>
        ))}
      </CartaoCrm>
      <CartaoCrm estilo={{ flex: 1, padding: "12px 16px" }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 7 }}>Conversas por Canal</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width="160" height="160" viewBox="0 0 42 42"><circle cx="21" cy="21" r="10.5" fill="none" stroke="#10B981" strokeWidth="21" pathLength={100} strokeDasharray="72 28" transform="rotate(-90 21 21)" /><circle cx="21" cy="21" r="10.5" fill="none" stroke="#DB2777" strokeWidth="21" pathLength={100} strokeDasharray="28 72" strokeDashoffset={-72} transform="rotate(-90 21 21)" /></svg>
        </div>
      </CartaoCrm>
    </div>
    <CartaoCrm estilo={{ overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", fontSize: 15, fontWeight: 600 }}>Resumo por Agente <span style={{ fontWeight: 400, fontSize: 13, color: COR_CRM.suave }}>Clique no agente para detalhes</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "0 16px 6px", fontSize: 12.5, fontWeight: 600, color: "#475467" }}><span>Agente</span><span>Conversas</span><span>Resoluções</span><span>Tempo 1ª Resposta</span></div>
      {POR_AGENTE.slice(0, 3).map(([n, c, r]) => <div key={n} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", alignItems: "center", height: 34, padding: "0 16px", fontSize: 14, borderTop: `1px solid ${COR_CRM.borda}` }}><span>{n}</span><span>{c}</span><span>{r}</span><span>3min</span></div>)}
    </CartaoCrm>
  </TelaCrm>
);

// ---------- Painel do Instagram
export const TelaIgPainel: React.FC = () => (
  <TelaCrm ativo="ig-painel" relacionamento>
    <Cabecalho sobre="Instagram" titulo="Painel" descricao="Gestão da conta conectada: seguidores, alcance, engajamento e os posts que mais performaram no período." />
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
      <SeletorCrm texto="@lojamodelo" estilo={{ minWidth: 170 }} />
      <div style={{ display: "flex", background: "#FFFFFF", borderRadius: 9, padding: 4 }}>{["Hoje", "Últimos 7 dias", "Mês", "Personalizado"].map((t, i) => <div key={t} style={{ padding: "6px 13px", borderRadius: 6, fontSize: 15, color: i === 1 ? "#FFFFFF" : "#475467", background: i === 1 ? DEGRADE_ATIVO : "transparent" }}>{t}</div>)}</div>
      <span style={{ flex: 1 }} />
      <BotaoCrm icone="girar" estilo={{ color: COR_CRM.suave }}>Atualizar</BotaoCrm>
    </div>
    <CartaoCrm estilo={{ padding: "13px 20px", display: "flex", alignItems: "center", gap: 14, marginBottom: 13 }}>
      <Avatar nome="Loja Modelo" tam={54} />
      <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 700 }}>@lojamodelo</div><div style={{ fontSize: 14, color: COR_CRM.suave }}>Loja Modelo | Materiais de construção</div></div>
      {[["18.420", "seguidores"], ["312", "seguindo"], ["846", "publicações"]].map(([v, r]) => <div key={r} style={{ textAlign: "center", width: 104 }}><div style={{ fontSize: 18, fontWeight: 700 }}>{v}</div><div style={{ fontSize: 13, color: COR_CRM.suave }}>{r}</div></div>)}
    </CartaoCrm>
    <div style={{ display: "flex", gap: 13, marginBottom: 13 }}>
      <Ind r="Alcance" v="42.310" s="no período" c="#059669" />
      <Ind r="Engajamento" v="4,8%" s="no período" />
    </div>
    <CartaoCrm estilo={{ padding: "12px 20px", marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15.5, fontWeight: 600, marginBottom: 7 }}>Automações no período <span style={{ fontSize: 13.5, fontWeight: 500, color: "#047857" }}>Gerenciar automações</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", fontSize: 13.5, color: COR_CRM.suave, padding: "3px 0" }}><span>Automação</span><span style={{ textAlign: "right" }}>Enviadas</span><span style={{ textAlign: "right" }}>Seguradas</span><span style={{ textAlign: "right" }}>Erros</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", fontSize: 15, padding: "5px 0" }}><span>Porcelanato</span><b style={{ textAlign: "right" }}>38</b><span style={{ textAlign: "right" }}>0</span><span style={{ textAlign: "right" }}>0</span></div>
    </CartaoCrm>
    <CartaoCrm estilo={{ padding: "13px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15.5, fontWeight: 600, marginBottom: 11 }}>Melhores posts do período <span style={{ fontSize: 13, fontWeight: 400, color: COR_CRM.suave }}>Por curtidas + comentários. Clique para ver métricas e comentários.</span></div>
      <div style={{ display: "flex", gap: 13 }}>
        {[["#E8DFD2", "#CDBFAC", "1.284"], ["#DCE6EA", "#B7C7CF", "982"], ["#E6E1EC", "#C5BBD1", "761"], ["#E5EADF", "#C1CBB4", "644"]].map(([a, b, n]) => (
          <div key={n} style={{ flex: 1, height: 170, borderRadius: 8, background: `linear-gradient(135deg, ${a}, ${b})`, position: "relative" }}><span style={{ position: "absolute", left: 9, bottom: 8, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,0.85)", borderRadius: 5, padding: "2px 7px" }}>♥ {n}</span></div>
        ))}
      </div>
    </CartaoCrm>
  </TelaCrm>
);

// ---------- Gestão à Vista: painel escuro da TV
const PESSOAS = [["Rafael Lima", "5", "vendas"], ["Camila Torres", "3", "vendas"], ["Bruno Nunes", "2", "vendas"], ["Juliana Prado", "2", "vendas"], ["Diego Alves", "1", "vendas"], ["Paula Reis", "0", "vendas"], ["Lucas Melo", "0", "vendas"], ["Marina Sá", "0", "vendas"], ["Tiago Rocha", "0", "ADMIN"], ["Helena Maia", "0", "sdr"]] as const;
const Bloco: React.FC<{ titulo: string; cor: string; n: string; a: string; b: string; c: string }> = ({ titulo, cor, n, a, b, c }) => (
  <div style={{ flex: 1, background: "#10152A", border: "1px solid #20263F", borderRadius: 16, padding: "24px 32px", display: "flex", flexDirection: "column" }}>
    <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 6, color: cor }}>{titulo}</div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 190, fontWeight: 800, color: "#FFFFFF", lineHeight: 1 }}>{n}</div>
    <div style={{ display: "flex", gap: 14 }}>
      {[[a, "#34D399", "#0F2C31", "-10m"], [b, "#FBBF24", "#35291F", "+10m"], [c, "#F87171", "#351728", "+30m"]].map(([q, tc, f, r]) => (
        <div key={r} style={{ flex: 1, background: f, borderRadius: 11, padding: "12px 0", textAlign: "center" }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: tc, lineHeight: 1.1 }}>{q}</div>
          <div style={{ fontSize: 19, fontWeight: 600, color: tc }}>● {r}</div>
        </div>
      ))}
    </div>
  </div>
);
const CardPessoa: React.FC<{ p: readonly [string, string, string] }> = ({ p: [n, q, t] }) => (
  <div style={{ flex: 1, minWidth: 0, border: "1.5px solid #10B981", borderRadius: 12, padding: "9px 13px", display: "flex", alignItems: "center" }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#94A3B8" }}><span style={{ color: "#10B981" }}>●</span> Online <span style={{ background: t === "ADMIN" ? "#2E2A6B" : "#20263F", color: t === "ADMIN" ? "#C4B5FD" : "#CBD5E1", borderRadius: 999, padding: "0 8px", fontSize: 11, fontWeight: t === "ADMIN" ? 700 : 500 }}>{t}</span></div>
    </div>
    <div style={{ fontSize: 31, fontWeight: 800 }}>{q}</div>
  </div>
);
export const TelaGestaoVista: React.FC<{ escala?: number }> = () => (
  <div style={{ width: 1600, height: 900, background: "#04081C", fontFamily: FONTE_CRM, padding: "22px 30px", boxSizing: "border-box", display: "flex", flexDirection: "column", color: "#FFFFFF" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
      <div style={{ width: 52, height: 52, borderRadius: 7, background: "#FFFFFF", color: "#047857", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>LM</div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 26, fontWeight: 700 }}>Loja Modelo</div><div style={{ fontSize: 14, letterSpacing: 2, color: "#94A3B8" }}>GESTÃO A VISTA</div></div>
      <div style={{ display: "flex", background: "#10152A", borderRadius: 999, padding: 5, fontSize: 14, marginRight: 22 }}><span style={{ background: "#10B981", borderRadius: 999, padding: "4px 16px" }}>Tela 1</span><span style={{ padding: "4px 16px", color: "#94A3B8" }}>Tela 2</span></div>
      <div style={{ textAlign: "right" }}><div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>10:58</div><div style={{ fontSize: 14, color: "#94A3B8" }}><span style={{ color: "#10B981" }}>●</span> Atualizado há 27s</div></div>
    </div>
    <div style={{ display: "flex", gap: 9, marginBottom: 9 }}>{PESSOAS.slice(0, 7).map((p) => <CardPessoa key={p[0]} p={p} />)}</div>
    <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>{PESSOAS.slice(7).map((p) => <CardPessoa key={p[0]} p={p} />)}<div style={{ flex: 1.2 }} /></div>
    <div style={{ flex: 1, display: "flex", gap: 22 }}>
      <Bloco titulo="AGUARDANDO" cor="#FBBF24" n="7" a="3" b="3" c="1" />
      <Bloco titulo="EM ATENDIMENTO" cor="#10D49B" n="13" a="9" b="3" c="1" />
    </div>
  </div>
);

// ---------- Análise de Sentimentos
const BARRAS_HORA = [["08h", 6, 2, 0], ["09h", 9, 3, 1], ["10h", 14, 4, 1], ["11h", 12, 6, 2], ["12h", 8, 3, 0]] as const;
const IndInfo: React.FC<{ r: string; v: string; s: string; c?: string }> = ({ r, v, s, c }) => (
  <CartaoCrm estilo={{ flex: 1, padding: "13px 18px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: COR_CRM.suave }}>{r} <Icone nome="info" tam={12} cor={COR_CRM.apagado} /></div>
    <div style={{ fontSize: 24, fontWeight: 700, color: c ?? COR_CRM.texto, lineHeight: 1.35 }}>{v}</div>
    <div style={{ fontSize: 13.5, color: COR_CRM.suave }}>{s}</div>
  </CartaoCrm>
);
export const TelaSentimentos: React.FC<{ aba?: string }> = ({ aba = "Visão geral" }) => (
  <TelaCrm ativo="sentimentos">
    <div style={{ marginTop: -16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 9, background: "#EFE7FF", display: "flex", alignItems: "center", justifyContent: "center" }}><Icone nome="sentimentos" tam={21} cor={ROXO} /></div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.2 }}>Análise de Sentimentos</div><div style={{ fontSize: 13.5, color: COR_CRM.suave }}>Baseado nas conversas do Simplí Chat</div></div>
        <SeletorCrm texto="Hoje" estilo={{ width: 170 }} />
      </div>
      <div style={{ display: "inline-flex", background: "#FFFFFF", borderRadius: 11, padding: 5, marginBottom: 14, boxShadow: "0 1px 3px rgba(16,24,40,0.08)" }}>
        {["Visão geral", "Leads", "Intenção de Compra", "Agentes", "Insights", "Tópicos", "CSAT"].map((t) => <div key={t} style={{ padding: "7px 15px", borderRadius: 7, fontSize: 15, color: t === aba ? "#FFFFFF" : "#475467", background: t === aba ? ROXO : "transparent" }}>{t}</div>)}
      </div>
      <div style={{ display: "flex", gap: 13, marginBottom: 14 }}>
        <IndInfo r="Score de satisfação" v="7.8/10" s="86 conversas analisadas" c="#059669" />
        <IndInfo r="Conversas negativas" v="6%" s="5 de 86 conversas" c="#D97706" />
        <IndInfo r="Equipe positiva" v="82%" s="Tom dos atendentes" />
        <IndInfo r="Alertas" v="2" s="conversas muito negativas" c="#DC2626" />
      </div>
      <CartaoCrm estilo={{ padding: "13px 20px", marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 5 }}>Sentimento por hora — hoje</div>
        <div style={{ display: "flex", gap: 14, fontSize: 13.5, color: "#475467", marginBottom: 9 }}><span><span style={{ color: "#22C55E" }}>●</span> Positivo</span><span><span style={{ color: "#94A3B8" }}>●</span> Neutro</span><span><span style={{ color: "#F87171" }}>●</span> Negativo</span></div>
        <div style={{ borderLeft: "1px solid #475467", marginLeft: 38, position: "relative" }}>
          {BARRAS_HORA.map(([h, p, n, g]) => (
            <div key={h} style={{ display: "flex", alignItems: "center", height: 58, position: "relative" }}>
              <span style={{ position: "absolute", left: -38, fontSize: 13, color: "#475467" }}>{h}</span>
              <div style={{ width: p * 44, height: 28, background: "#22C55E" }} /><div style={{ width: n * 44, height: 28, background: "#94A3B8" }} /><div style={{ width: g * 44, height: 28, background: "#F87171" }} />
            </div>
          ))}
        </div>
      </CartaoCrm>
      <CartaoCrm estilo={{ padding: "13px 20px" }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 7 }}>Distribuição por canal</div>
        {[["Instagram", 28], ["WhatsApp", 72]].map(([n, q]) => <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 15, height: 34 }}><span style={{ width: 110 }}>{n}</span><div style={{ flex: 1, height: 22, background: COR_CRM.cinza, borderRadius: 5 }}><div style={{ width: `${q}%`, height: "100%", background: "#94A3B8", borderRadius: 5 }} /></div><b style={{ width: 42, textAlign: "right" }}>{q}%</b></div>)}
      </CartaoCrm>
    </div>
  </TelaCrm>
);

// ---------- Eventos: resumo e detalhamento
const Ic: React.FC<{ i: string; v: string; r: string; c: string }> = ({ i, v, r, c }) => <div style={{ flex: 1, border: `1px solid ${COR_CRM.borda}`, borderRadius: 10, padding: "9px 13px" }}><Icone nome={i} tam={16} cor={c} /><div style={{ fontSize: 19, fontWeight: 700, color: c, lineHeight: 1.35, whiteSpace: "nowrap" }}>{v}</div><div style={{ fontSize: 12, color: COR_CRM.suave }}>{r}</div></div>;
const RANKING = [["1", "RAFAEL LIMA", "212", "164", "R$ 142.380,00", "R$ 671,60", "21%"], ["2", "CAMILA TORRES", "198", "151", "R$ 128.940,00", "R$ 651,21", "19%"], ["3", "BRUNO NUNES", "187", "139", "R$ 111.260,00", "R$ 594,97", "16%"], ["4", "JULIANA PRADO", "164", "128", "R$ 96.710,00", "R$ 589,70", "14%"], ["5", "DIEGO ALVES", "151", "117", "R$ 84.120,00", "R$ 557,09", "12%"]] as const;
const PRODUTOS = [["1", "PORCELANATO ACETINADO AREIA 60X60", "4.126", "R$ 92.640,00"], ["2", "ARGAMASSA AC-III CINZA 20KG", "3.378", "R$ 58.310,00"], ["3", "BACIA COM CAIXA ACOPLADA", "412", "R$ 44.920,00"]] as const;
export const TelaEvento: React.FC<{ aba?: string; rolagem?: number }> = ({ aba = "Resumo", rolagem = 0 }) => (
  <TelaCrm
    ativo="eventos"
    sobre={
      <ModalCrm largura={900} topo={30}>
        <div style={{ height: 838, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <CabecaEvento nome="SEMANA DO PISO" datas="28/10/2026 → 31/10/2026 · Todas as lojas" dias={["28/10", "29/10", "30/10", "31/10"]} filtros={["Vendedor", "Equipe", "Loja", "Produto"]} />
          <div style={{ flex: 1, overflow: "hidden", padding: "9px 22px" }}>
            <div style={{ transform: `translateY(${-rolagem}px)` }}>
              <AbasLinha abas={["Resumo", "Detalhamento", "Campanhas", "Gráficos", "Público"]} ativa={aba} estilo={{ marginBottom: 12 }} />
              {aba === "Resumo" ? (
                <>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#475467", marginBottom: 7 }}>VOLUME</div>
                  <div style={{ display: "flex", gap: 9, marginBottom: 13 }}>
                    <Ic i="orcamentos" v="1.284" r="Vendas · pedidos faturados" c="#101828" />
                    <Ic i="contatos" v="812" r="Clientes únicos" c="#0891B2" />
                    <Ic i="pacote" v="946" r="Produtos positivados" c="#0D9488" />
                    <Ic i="pessoaMais" v="214" r="Clientes novos · 1ª compra na loja" c="#4F46E5" />
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#475467", marginBottom: 7 }}>CLIENTES POR CLASSIFICAÇÃO <span style={{ fontWeight: 400 }}>— 812 no total (clientes do evento)</span></div>
                  <div style={{ display: "flex", gap: 9, marginBottom: 13 }}>
                    <Ic i="contatos" v="214" r="Novos" c="#0284C7" /><Ic i="contatos" v="186" r="Ativos" c="#059669" /><Ic i="contatos" v="172" r="Recorrentes" c="#7C3AED" /><Ic i="contatos" v="48" r="VIP" c="#D97706" /><Ic i="contatos" v="73" r="Em risco" c="#EA580C" /><Ic i="contatos" v="119" r="Inativos" c="#475467" />
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#475467", marginBottom: 7 }}>FINANCEIRO <span style={{ fontWeight: 400 }}>— faturado real (NF) no período</span></div>
                  <div style={{ display: "flex", gap: 9, marginBottom: 13 }}>
                    <Ic i="dolar" v="R$ 684.210,00" r="Faturado" c="#101828" />
                    <Ic i="dolar" v="R$ 532,90" r="Ticket médio" c="#7C3AED" />
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#475467", marginBottom: 7 }}>COMPARATIVO VS PERÍODO ANTERIOR <span style={{ fontWeight: 400 }}>— base: 24/10/2026 a 27/10/2026</span></div>
                  <div style={{ display: "flex", gap: 9 }}>
                    <Ic i="sobe" v="+38%" r="Faturado · base: R$ 495.800,00" c="#059669" />
                    <Ic i="sobe" v="+21%" r="Vendas · base: 1.061" c="#059669" />
                    <Ic i="sobe" v="+14%" r="Clientes · base: 712" c="#059669" />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 9 }}>Ranking de vendedores <span style={{ fontSize: 13, fontWeight: 400, color: COR_CRM.suave }}>— 12 ativos</span></div>
                  <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 10, overflow: "hidden", marginBottom: 15 }}>
                    <div style={{ display: "grid", gridTemplateColumns: ".4fr 2.2fr .7fr .7fr 1.3fr 1fr .7fr", padding: "9px 14px", fontSize: 12.5, fontWeight: 600, color: "#475467" }}><span>#</span><span>Vendedor</span><span>Vendas</span><span>Clientes</span><span style={{ textAlign: "right" }}>Faturamento L.</span><span style={{ textAlign: "right" }}>Ticket</span><span style={{ textAlign: "right" }}>% do total</span></div>
                    {RANKING.map((l) => <div key={l[0]} style={{ display: "grid", gridTemplateColumns: ".4fr 2.2fr .7fr .7fr 1.3fr 1fr .7fr", alignItems: "center", height: 37, padding: "0 14px", fontSize: 13.5, borderTop: `1px solid ${COR_CRM.borda}` }}>{l.map((c, i) => <span key={i} style={{ textAlign: i > 3 ? "right" : "left", fontFamily: i === 4 || i === 5 ? "monospace" : undefined, fontWeight: i === 1 ? 500 : 400 }}>{c}</span>)}</div>)}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 9 }}>Ranking de produtos</div>
                  <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 10, overflow: "hidden" }}>
                    {PRODUTOS.map((l) => <div key={l[0]} style={{ display: "grid", gridTemplateColumns: ".4fr 3.4fr .8fr 1.3fr", alignItems: "center", height: 37, padding: "0 14px", fontSize: 13.5, borderTop: l[0] === "1" ? "none" : `1px solid ${COR_CRM.borda}` }}>{l.map((c, i) => <span key={i} style={{ textAlign: i > 1 ? "right" : "left", fontFamily: i === 3 ? "monospace" : undefined }}>{c}</span>)}</div>)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </ModalCrm>
    }
  >
    <FundoEventos />
  </TelaCrm>
);

// ---------- Conexão MCP e permissões por família de ação
const FAMILIAS = [["Leads / Kanban", "Age sozinho"], ["E-mail marketing", "Pede aprovação"], ["SimpliChat", "Pede aprovação"], ["Grupos de WhatsApp", "Age sozinho"]] as const;
export const TelaMcp: React.FC<{ mudou?: boolean }> = ({ mudou }) => (
  <TelaCrm ativo="configurações" perfil="servicos">
    <div style={{ width: 880, margin: "-14px auto 0" }}>
      <div style={{ background: "#FFFFFF", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 19, fontWeight: 700, marginBottom: 7 }}><Icone nome="chave" tam={18} cor="#059669" /> Conexão MCP (Agentic Office)</div>
        <div style={{ fontSize: 14, color: COR_CRM.suave, lineHeight: 1.4, marginBottom: 13 }}>Gere um token e cole em Integrações → Diversas → Simplí CRM, no Agentic Office de <b>Loja Modelo</b>. Os agentes passam a criar contatos e cards no Kanban desta empresa.</div>
        <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 9, padding: "11px 13px", marginBottom: 13, display: "flex", gap: 9, alignItems: "flex-end" }}>
          <CampoCrm rotulo="Nome do token" valor="Agentic Office" estilo={{ flex: 1, marginBottom: 0 }} />
          <BotaoCrm icone="mais" primario>Gerar token</BotaoCrm>
        </div>
        <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 9, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 9 }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 600 }}>Agentic Office</div><div style={{ fontSize: 13, color: COR_CRM.suave }}>Último uso: 05/11/2026, 09:33:09</div></div>
            <BotaoCrm icone="ligar" perigo>Revogar</BotaoCrm>
          </div>
          <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 8, padding: "11px 14px" }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 7 }}>O que o agente pode fazer sozinho</div>
            {FAMILIAS.map(([f, v], i) => (
              <div key={f} style={{ display: "flex", alignItems: "center", height: 46, fontSize: 15.5 }}>
                <span style={{ flex: 1 }}>{f}</span>
                <SeletorCrm texto={mudou && i === 3 ? "Pede aprovação" : v} estilo={{ width: 190, borderColor: mudou && i === 3 ? "#10B981" : COR_CRM.borda }} />
              </div>
            ))}
            <div style={{ fontSize: 13, color: COR_CRM.suave, lineHeight: 1.35, marginTop: 7 }}>"Pede aprovação" só funciona com a aba Aprovações ligada para esta empresa — sem ela, a ação fica pendente e ninguém consegue decidir.</div>
          </div>
        </div>
      </div>
    </div>
  </TelaCrm>
);

export const TelaAprovacoes: React.FC<{ estado?: "pendente" | "aprovada" }> = ({ estado = "pendente" }) => (
  <TelaCrm ativo="aprovacoes" perfil="servicos">
    <div style={{ padding: "0 8px" }}>
      <Cabecalho titulo="Aprovações" descricao="Ações que o agente de IA do Agentic Office pede no CRM e que a empresa exige aval humano para executar. Sem decisão, vencem em 24 horas." />
      <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.4, color: "#475467", marginBottom: 11 }}>AGUARDANDO DECISÃO</div>
      {estado === "pendente" ? (
        <CartaoCrm estilo={{ padding: "18px 22px", display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 18, fontWeight: 500 }}><Icone nome="robo" tam={18} cor="#22C55E" /> Disparar campanha de e-mail: Reativação em risco</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: COR_CRM.suave, margin: "6px 0 9px" }}>#12 · email <SeloCrm fundo="#FEF3C7" cor="#B45309">AGUARDANDO</SeloCrm></div>
            <div style={{ fontSize: 15, color: "#475467", lineHeight: 1.55 }}>Assunto: Faz tempo que a gente não se vê<br />Remetente: contato@mkt.lojamodelo.com.br<br />Público estimado: 536 (pode mudar até o disparo)</div>
          </div>
          <BotaoCrm perigo>Recusar</BotaoCrm>
          <BotaoCrm primario>Aprovar</BotaoCrm>
        </CartaoCrm>
      ) : <div style={{ fontSize: 15, color: COR_CRM.suave, marginBottom: 20 }}>Nenhuma ação aguardando aprovação no momento.</div>}
      <div style={{ height: 1, background: COR_CRM.borda, marginBottom: 16 }} />
      <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.4, color: "#475467", marginBottom: 11 }}>HISTÓRICO — ÚLTIMAS {estado === "aprovada" ? 2 : 1} DECISÕES</div>
      {estado === "aprovada" ? <CartaoCrm estilo={{ padding: "13px 22px", marginBottom: 11, fontSize: 15.5 }}>Disparar campanha de e-mail: Reativação em risco <SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857">APROVADA</SeloCrm></CartaoCrm> : null}
      <CartaoCrm estilo={{ padding: "13px 22px", fontSize: 15.5, color: "#475467" }}>Criar card: Construtora Horizonte <SeloCrm fundo={COR_CRM.cinza} cor="#475467">RECUSADA</SeloCrm></CartaoCrm>
    </div>
  </TelaCrm>
);

// ---------- Serviços: contratos, projeto, página pública, financeiro e gestão
const CONTRATOS = [["Gestão de Tráfego - Clínica Vida", "Saúde", "Ativo", "R$ 3.200,00", "/mês", "8 meses", "Início: 12/03/2026 · Próx. call: 12/11"], ["Social Media - Café Central", "Alimentação", "Ativo", "R$ 2.400,00", "/mês", "5 meses", "Início: 14/06/2026 · Próx. call: 14/11"], ["Site + SEO - Prado Advogados", "Serviços", "Ativo", "R$ 4.800,00", "/mês", "11 meses", "Início: 18/10/2026 · Próx. call: 18/11"], ["Consultoria Comercial - Metalúrgica Sul", "Indústria", "Entregue", "R$ 12.000,00", "· 2x", "Único", "2 parcelas"], ["Gestão de CRM - Rede Boa Compra", "Varejo", "Ativo", "R$ 5.900,00", "/mês", "2 meses", "Início: 20/01/2026 · Próx. call: 20/11"]] as const;
export const TelaContratos: React.FC = () => (
  <TelaCrm ativo="contratos" perfil="servicos">
    <Cabecalho titulo="Gestão de Contratos" descricao="Carteira de contratos e clientes ativos" direita={<BotaoCrm icone="mais" primario>Novo Contrato</BotaoCrm>} />
    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
      <Ind r="Clientes ativos" v="14" c="#059669" /><Ind r="Entregues" v="6" c="#0284C7" /><Ind r="Receita mensal" v="R$ 42.800,00" c="#059669" /><Ind r="Inativos" v="1" c="#D97706" /><Ind r="Total carteira" v="21" />
    </div>
    <CartaoCrm estilo={{ padding: "12px 18px", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}><div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600 }}>Previsão de Receita 2026</div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>Receita recorrente projetada por mês (contratos ativos)</div></div><div style={{ textAlign: "right", fontSize: 12, color: COR_CRM.suave }}>Projeção no ano<div style={{ fontSize: 15, fontWeight: 700, color: COR_CRM.texto }}>R$ 462.400,00</div></div></div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 96, borderBottom: "1px solid #475467", marginTop: 7, paddingLeft: 8 }}>{[31, 33, 34, 35, 37, 38, 39, 40, 40, 41, 42.8, 43].map((v, i) => <div key={i} style={{ flex: 1, height: v * 2, background: "#10B981", borderRadius: "3px 3px 0 0" }} />)}</div>
      <div style={{ display: "flex", gap: 18, paddingLeft: 8, fontSize: 11.5, color: COR_CRM.suave, marginTop: 4 }}>{["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m) => <span key={m} style={{ flex: 1, textAlign: "center" }}>{m}</span>)}</div>
    </CartaoCrm>
    <div style={{ display: "flex", gap: 9, marginBottom: 12 }}><div style={{ flex: 1, height: 38, background: "#FFFFFF", borderRadius: 7, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 14.5, color: COR_CRM.suave }}><Icone nome="busca" tam={14} /> Buscar por nome ou nicho...</div><SeletorCrm texto="Todos os status" /></div>
    <CartaoCrm estilo={{ overflow: "hidden" }}>
      {CONTRATOS.map(([n, s, st, v, u, m, c]) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 13, padding: "0 20px", height: 62, borderBottom: `1px solid ${COR_CRM.borda}` }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: COR_CRM.verdeClaro, color: "#047857", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{n[0]}</div>
          <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 600 }}>{n} <SeloCrm fundo={st === "Ativo" ? COR_CRM.verdeClaro : "#E0F2FE"} cor={st === "Ativo" ? "#047857" : "#0369A1"}>{st}</SeloCrm></div><div style={{ fontSize: 13.5, color: COR_CRM.suave }}>{s}</div></div>
          <div style={{ textAlign: "right", width: 260 }}><div style={{ fontSize: 15.5, fontWeight: 600 }}>{v}<span style={{ fontWeight: 400, color: COR_CRM.suave }}>{u}</span></div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>{c}</div></div>
          <div style={{ textAlign: "right", width: 90 }}><div style={{ fontSize: 15, fontWeight: 500, color: "#059669" }}>{m}</div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>restantes</div></div>
          <Icone nome="lapis" tam={15} cor={COR_CRM.suave} /><Icone nome="lixeira" tam={15} cor={COR_CRM.suave} />
        </div>
      ))}
    </CartaoCrm>
  </TelaCrm>
);

const CardProj: React.FC<{ t: string; p: string; d: string; prazo: string; atraso?: boolean }> = ({ t, p, d, prazo, atraso }) => (
  <div style={{ background: "#FFFFFF", borderRadius: 11, padding: "13px 15px", marginBottom: 11, boxShadow: "0 1px 3px rgba(16,24,40,0.1)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15.5, fontWeight: 600 }}>{t}<span style={{ color: COR_CRM.suave, letterSpacing: 1 }}>⠿</span></div>
    <div style={{ fontSize: 13, color: COR_CRM.suave, margin: "3px 0 5px" }}>{p}</div>
    <div style={{ fontSize: 14, color: "#475467", lineHeight: 1.35 }}>{d}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 9, borderTop: `1px solid ${COR_CRM.borda}`, marginTop: 9, paddingTop: 9, fontSize: 13.5 }}><Avatar nome="Paula Reis" tam={28} /> Paula Reis</div>
    <div style={{ fontSize: 13, color: atraso ? "#DC2626" : COR_CRM.suave, marginTop: 7 }}>{prazo}</div>
  </div>
);
export const TelaProjeto: React.FC = () => (
  <TelaCrm ativo="projetos" perfil="servicos">
    <CartaoCrm estilo={{ padding: "16px 22px", display: "flex", alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{ flex: 1 }}><div style={{ fontSize: 25, fontWeight: 700 }}>Clínica Vida</div><div style={{ fontSize: 14, color: COR_CRM.suave }}>contato@clinicavida.com.br</div><div style={{ fontSize: 14.5, marginTop: 5 }}>• Gestão de tráfego pago e captação de pacientes</div></div>
      <div style={{ display: "flex", gap: 8 }}><BotaoCrm icone="partilha">Compartilhar</BotaoCrm><BotaoCrm icone="lapis">Editar projeto</BotaoCrm><BotaoCrm icone="mais" primario>Nova tarefa</BotaoCrm></div>
    </CartaoCrm>
    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, background: "#047857", color: "#FFFFFF", fontSize: 15 }}><Icone nome="colunas" tam={15} /> Kanban</div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, background: "#FFFFFF", fontSize: 15 }}><Icone nome="grade" tam={15} /> Matriz de prioridade</div>
    </div>
    <div style={{ display: "flex", gap: 14 }}>
      {[["Pendente", "#F59E0B", "ampulheta", "2"], ["Executando", "#3B82F6", "girar", "1"], ["Finalizado", "#10B981", "resolver", "4"], ["Cancelado", "#EF4444", "xis", "0"]].map(([n, c, i, q], x) => (
        <div key={n} style={{ width: 350, flexShrink: 0, height: 560, background: "#EEF1F4", borderRadius: 11, borderTop: `3px solid ${c}`, padding: "11px 13px", boxSizing: "border-box", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15.5, fontWeight: 600, marginBottom: 11 }}><Icone nome={i} tam={17} cor={c} /> <span style={{ flex: 1 }}>{n}</span><span style={{ width: 24, height: 24, borderRadius: 12, background: "#FFFFFF", fontSize: 12, fontWeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>{q}</span></div>
          {x === 0 ? <><CardProj t="Campanha de novembro" p="P2" d="Criar peças e públicos da campanha de exames." prazo="Prazo: 12/11/2026" /><CardProj t="Relatório mensal" p="P3" d="Consolidar resultados de outubro." prazo="1d em atraso" atraso /></> : x === 1 ? <CardProj t="Landing page de exames" p="P1" d="Ajustar formulário e ligar ao funil." prazo="Prazo: 08/11/2026" /> : x === 3 ? null : <><CardProj t="Tag de conversão" p="P2" d="Instalar a tag no site." prazo="Prazo encerrado" /><CardProj t="Pixel e públicos" p="P3" d="Criar públicos de remarketing." prazo="Prazo encerrado" /></>}
        </div>
      ))}
    </div>
  </TelaCrm>
);

export const TelaPaginaPublica: React.FC = () => (
  <div style={{ width: 1596, height: 898, background: "#000000", color: "#FFFFFF", fontFamily: FONTE_CRM, overflow: "hidden" }}>
    <div style={{ height: 34, background: "#FFFFFF", color: COR_CRM.suave, display: "flex", alignItems: "center", paddingLeft: 20, fontSize: 13 }}>projeto.compartilhado/clinica-vida</div>
    <div style={{ padding: "26px 34px" }}>
      <div style={{ textAlign: "center", fontSize: 31, fontWeight: 600 }}>CLÍNICA VIDA</div>
      <div style={{ width: 400, margin: "13px auto 22px", fontSize: 13.5, color: "#A1A1AA" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>Andamento do projeto <span>57%</span></div>
        <div style={{ height: 5, background: "#27272A", borderRadius: 3 }}><div style={{ width: "57%", height: "100%", background: "#FFFFFF", borderRadius: 3 }} /></div>
        <div style={{ textAlign: "center", marginTop: 7 }}>4 de 7 tarefas concluídas</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 17 }}>
        <div style={{ padding: "7px 14px", borderRadius: 9, border: "1px solid #3F3F46", fontSize: 15 }}>Kanban</div>
        <div style={{ padding: "7px 14px", borderRadius: 9, background: "#FFFFFF", color: "#000000", fontSize: 15 }}>Matriz de prioridade</div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 5 }}>Matriz de prioridade</div>
      <div style={{ fontSize: 14, color: "#A1A1AA", marginBottom: 2 }}>P1 é a prioridade mais alta e P4 é a mais baixa. Cada tarefa aparece na linha da sua prioridade e na coluna do seu andamento.</div>
      <div style={{ fontSize: 12.5, color: "#71717A", marginBottom: 11 }}>No celular, deslize a matriz para os lados para acompanhar todas as etapas.</div>
      <div style={{ border: "1px solid #3F3F46", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "170px repeat(4, 1fr)" }}>
          <div style={{ padding: "11px 14px", fontSize: 13.5, color: "#A1A1AA" }}>Prioridade / Etapa</div>
          {[["Pendente", "#FEF9C3", "#422006", "2"], ["Executando", "#DBEAFE", "#172554", "1"], ["Finalizado", "#DCFCE7", "#052E16", "4"], ["Cancelado", "#FEE2E2", "#450A0A", "0"]].map(([n, f, c, q]) => <div key={n} style={{ display: "flex", justifyContent: "space-between", padding: "11px 14px", background: f, color: c, fontSize: 15, fontWeight: 600 }}>{n}<span style={{ fontSize: 12, background: "#FFFFFF", borderRadius: 5, padding: "1px 7px" }}>{q}</span></div>)}
          {[["P1", ["", "Landing page de exames", "", ""]], ["P2", ["Campanha de novembro", "", "Tag de conversão", ""]], ["P3", ["Relatório mensal", "", "Pixel e públicos", ""]]].map(([p, cs]) => (
            <div key={p as string} style={{ display: "contents" }}>
              <div style={{ padding: "11px 14px", borderTop: "1px solid #3F3F46", fontWeight: 600 }}>{p as string}<div style={{ fontWeight: 400, fontSize: 13, color: "#A1A1AA" }}>{(cs as string[]).filter(Boolean).length} tarefa{(cs as string[]).filter(Boolean).length === 1 ? "" : "s"}</div></div>
              {(cs as string[]).map((c, i) => <div key={i} style={{ borderTop: "1px solid #3F3F46", borderLeft: "1px solid #3F3F46", height: 86, padding: 8, boxSizing: "border-box", fontSize: 13.5, color: "#71717A", display: "flex", alignItems: "center", justifyContent: "center" }}>{c ? <div style={{ width: "100%", background: ["#FEF9C3", "#DBEAFE", "#DCFCE7"][i], color: ["#422006", "#172554", "#052E16"][i], borderRadius: 9, padding: "11px 13px", fontWeight: 600, fontSize: 14.5 }}>{c}</div> : "Nenhuma tarefa"}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Fin: React.FC<{ i: string; v: string; r: string; s: string; c: string; f: string }> = ({ i, v, r, s, c, f }) => <CartaoCrm estilo={{ flex: 1, padding: "13px 16px" }}><div style={{ width: 34, height: 34, borderRadius: 8, background: f, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 7 }}><Icone nome={i} tam={17} cor={c} /></div><div style={{ fontSize: 21, fontWeight: 700, color: c }}>{v}</div><div style={{ fontSize: 13.5, color: COR_CRM.suave }}>{r}</div><div style={{ fontSize: 12, color: COR_CRM.suave }}>{s}</div></CartaoCrm>;
export const TelaFinanceiro: React.FC = () => (
  <TelaCrm ativo="financeiro" perfil="servicos">
    <Cabecalho titulo="Financeiro" descricao="Controle de receita, custos e lucro por competência" direita={<><div style={{ fontSize: 15, padding: "7px 15px", background: "#FFFFFF", borderRadius: 7 }}>‹  Nov/2026  ›</div><BotaoCrm icone="mais" primario>Novo custo</BotaoCrm></>} />
    <div style={{ display: "flex", gap: 13, marginBottom: 13 }}>
      <Fin i="dolar" v="R$ 42.800,00" r="Receita Mensal" s="14 contratos ativos" c="#059669" f="#ECFDF5" />
      <Fin i="desce" v="R$ 14.260,00" r="Custo do mês" s="11 custos cadastrados" c="#DC2626" f="#FEF2F2" />
      <Fin i="documento" v="R$ 2.568,00" r="Impostos" s="sobre receita dos projetos" c="#7C3AED" f="#F5F3FF" />
    </div>
    <div style={{ display: "flex", gap: 13, marginBottom: 13 }}>
      <Fin i="sobe" v="R$ 25.972,00" r="Lucro Líquido" s="Receita − Custos" c="#059669" f="#ECFDF5" />
      <Fin i="sobe" v="60,7%" r="Margem de Lucro" s="Lucro Líquido ÷ Receita" c="#059669" f="#ECFDF5" />
      <div style={{ flex: 1 }} />
    </div>
    <CartaoCrm estilo={{ overflow: "hidden" }}>
      <div style={{ padding: "11px 18px", borderBottom: `1px solid ${COR_CRM.borda}` }}><div style={{ fontSize: 15, fontWeight: 600 }}>Clientes ativos</div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>Receita, custo rateado e lucro por projeto — nov/2026</div></div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr .8fr", padding: "9px 18px", fontSize: 13, color: COR_CRM.suave, background: "#F6F8F7" }}><span>Cliente</span><span>Receita</span><span>Custos (rateio)</span><span>Lucro</span><span>Contrato</span></div>
      {[["Clínica Vida", "Saúde", "R$ 3.200,00", "R$ 980,00", "R$ 2.220,00", "8 meses"], ["Café Central", "Alimentação", "R$ 2.400,00", "R$ 720,00", "R$ 1.680,00", "5 meses"], ["Prado Advogados", "Serviços", "R$ 4.800,00", "R$ 1.340,00", "R$ 3.460,00", "11 meses"]].map(([n, s, a, b, c, m]) => <div key={n} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr .8fr", alignItems: "center", height: 50, padding: "0 18px", fontSize: 14.5, borderBottom: `1px solid ${COR_CRM.borda}` }}><span style={{ fontWeight: 500, lineHeight: 1.2 }}>{n}<br /><span style={{ fontWeight: 400, fontSize: 12.5, color: COR_CRM.suave }}>{s}</span></span><span style={{ color: "#059669", fontWeight: 600 }}>{a}</span><span style={{ color: "#DC2626", fontWeight: 600 }}>{b}</span><span style={{ color: "#059669", fontWeight: 600 }}>{c}</span><span style={{ color: "#059669", fontWeight: 600 }}>{m}</span></div>)}
    </CartaoCrm>
  </TelaCrm>
);

export const TelaGestao: React.FC = () => (
  <TelaCrm ativo="gestao" perfil="servicos">
    <div style={{ padding: "0 8px", marginTop: -8 }}>
      <Cabecalho titulo="Gestão" descricao="Visão geral de contatos, contratos e financeiro" direita={<><div style={{ display: "flex", background: "#FFFFFF", borderRadius: 8, padding: 3 }}>{["Mês", "Ano"].map((t, i) => <div key={t} style={{ padding: "5px 13px", borderRadius: 6, fontSize: 15, color: i ? "#475467" : "#FFFFFF", background: i ? "transparent" : DEGRADE_ATIVO }}>{t}</div>)}</div><div style={{ fontSize: 15, padding: "7px 15px", background: "#FFFFFF", borderRadius: 7 }}>‹  2026  ›</div></>} />
      <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
        {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m) => <div key={m} style={{ padding: "4px 11px", borderRadius: 6, fontSize: 14.5, color: m === "Nov" ? "#FFFFFF" : COR_CRM.texto, background: m === "Nov" ? "#10B981" : "#FFFFFF" }}>{m}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 13, marginBottom: 14 }}>
        <Fin i="contatos" v="3.240" r="Contatos" s="cadastrados" c="#0284C7" f="#E0F2FE" />
        <Fin i="predio" v="21" r="Empresas" s="cadastradas" c="#4F46E5" f="#EEF2FF" />
        <Fin i="pessoa" v="14" r="Clientes ativos" s="13 faturando no mês" c="#059669" f="#ECFDF5" />
        <Fin i="dolar" v="R$ 42.800,00" r="Faturamento" s="Nov/2026" c="#059669" f="#ECFDF5" />
        <Fin i="desce" v="R$ 14.260,00" r="Custos" s="Nov/2026" c="#DC2626" f="#FEF2F2" />
        <Fin i="sobe" v="R$ 25.972,00" r="Lucro" s="Faturamento − Custos" c="#059669" f="#ECFDF5" />
      </div>
      <CartaoCrm estilo={{ padding: "11px 20px", marginBottom: 13 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Faturamento, custos e lucro — 2026</div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>Realizado por mês</div>
      </CartaoCrm>
      <CartaoCrm>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "12px 20px", borderBottom: `1px solid ${COR_CRM.borda}`, fontSize: 16, fontWeight: 600 }}><Icone nome="meta" tam={17} cor="#059669" /> Metas em andamento</div>
        {[["Novos contratos", "5 / 8", 62], ["META FATURAMENTO RECORRENTE", "R$ 42.800,00 / R$ 50.000,00", 86]].map(([n, q, p]) => (
          <div key={n as string} style={{ padding: "10px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, marginBottom: 6 }}>{n}<span style={{ color: COR_CRM.suave }}>{q}</span></div>
            <div style={{ height: 7, background: COR_CRM.cinza, borderRadius: 4 }}><div style={{ width: `${p}%`, height: "100%", background: "#10B981", borderRadius: 4 }} /></div>
          </div>
        ))}
      </CartaoCrm>
    </div>
  </TelaCrm>
);
