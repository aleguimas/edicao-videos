import type React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { AbasLinha, Avatar, BotaoCrm, Cabecalho, CampoCrm, CartaoCrm, COR_CRM, DEGRADE_ATIVO, FONTE_CRM, Icone, ModalCrm, SeletorCrm, SeloCrm, TelaCrm } from "./Kit";

// ---------- Kanban: colunas com a cor no topo, como no sistema
export type CardKanban = { nome: string; id: string; fone: string; valor?: string; canal?: string; dono?: string; nota?: string; aceso?: boolean };

const CARD_LARGURA = 214;
const Card: React.FC<{ c: CardKanban; estilo?: React.CSSProperties }> = ({ c, estilo }) => (
  <div style={{ background: "#FFFFFF", borderRadius: 11, padding: "11px 13px", marginBottom: 11, boxShadow: c.aceso ? "0 0 0 2px #10B981, 0 8px 20px rgba(16,24,40,0.14)" : "0 1px 3px rgba(16,24,40,0.1)", ...estilo }}>
    <div style={{ display: "flex", flexWrap: "wrap", width: 122, gap: "9px 13px", color: "#667085", marginBottom: 9 }}>
      {["check", "xis", "girar", "lapis", "lixeira"].map((i) => (
        <Icone key={i} nome={i} tam={14} />
      ))}
    </div>
    <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.25 }}>
      {c.nome} <span style={{ fontWeight: 400, fontSize: 12.5, color: COR_CRM.suave }}>#{c.id}</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: COR_CRM.suave, marginTop: 3 }}>
      <Icone nome="telefone" tam={11} /> {c.fone}
    </div>
    {c.nota ? <div style={{ fontSize: 12.5, fontStyle: "italic", color: COR_CRM.suave, border: `1px solid ${COR_CRM.borda}`, background: "#FAFBFB", borderRadius: 5, padding: "6px 8px", marginTop: 7, lineHeight: 1.3 }}>{c.nota}</div> : null}
    {c.valor ? <div style={{ display: "inline-block", fontFamily: "monospace", fontWeight: 700, fontSize: 13, background: COR_CRM.cinza, borderRadius: 4, padding: "2px 7px", marginTop: 7 }}>{c.valor}</div> : null}
    <div style={{ fontSize: 12.5, color: "#475467", background: COR_CRM.cinza, borderRadius: 4, padding: "3px 8px", marginTop: 7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.canal ?? "whatsapp-loja-modelo"}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: `1px solid ${COR_CRM.borda}`, paddingTop: 8, marginTop: 9, fontSize: 12.5, color: COR_CRM.suave }}>
      {c.dono ? <Avatar nome={c.dono} tam={24} /> : null}
      {c.dono ?? "Nenhum responsável"}
    </div>
  </div>
);

const COLUNAS = [
  ["Novo Lead", "#22C55E", "#D5EFDD", "Oportunidades: 42 | R$ 18.260,00"],
  ["Em andamento", "#3B82F6", "#DBE7FB", "Oportunidades: 31 | R$ 46.120,00"],
  ["Proposta enviada", "#F59E0B", "#F7E8CD", "Oportunidades: 18 | R$ 64.930,00"],
  ["Follow-up", "#EF4444", "#F8D9D9", "Oportunidades: 12 | R$ 38.400,00"],
  ["Finalizado", "#8B5CF6", "#E5DCFB", "Oportunidades: 96 | R$ 212.640,00"],
] as const;

const DEMAIS: CardKanban[][] = [
  [
    { nome: "Patrícia Souza", id: "2214", fone: "+558190000212", canal: "instagram-loja-modelo" },
    { nome: "João Almeida", id: "2209", fone: "+558190000377", dono: "Camila Torres" },
    { nome: "Vera Nunes", id: "2201", fone: "+558190000918" },
  ],
  [
    { nome: "Carla Ribeiro", id: "2196", fone: "+558190000541", dono: "Bruno Nunes", valor: "R$ 2.180,00" },
    { nome: "Otávio Reis", id: "2188", fone: "+558190000466", dono: "Camila Torres", canal: "instagram-loja-modelo" },
  ],
  [
    { nome: "Renata Dias", id: "2150", fone: "+558190000733", dono: "Rafael Lima", valor: "R$ 3.940,00" },
    { nome: "Sérgio Moura", id: "2142", fone: "+558190000155", dono: "Juliana Prado", valor: "R$ 1.260,00" },
  ],
  [{ nome: "Helena Costa", id: "2118", fone: "+558190000609", dono: "Rafael Lima", valor: "R$ 5.320,00" }],
  [{ nome: "Diego Lins", id: "2087", fone: "+558190000820", dono: "Bruno Nunes", valor: "R$ 910,00" }],
];

export const MARCOS: CardKanban = { nome: "Marcos Oliveira", id: "2231", fone: "+5581900001234", dono: "Rafael Lima", nota: "Reforma do banheiro, pediu porcelanato acetinado" };

export const TelaKanban: React.FC<{ marcos?: CardKanban; coluna?: number; desloca?: number; subida?: number; funis?: boolean; entra?: number }> = ({ marcos = MARCOS, coluna = 0, desloca = 0, subida = 0, funis, entra }) => {
  const frame = useCurrentFrame();
  const k = entra === undefined ? 1 : interpolate(frame, [entra, entra + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <TelaCrm ativo="kanban">
      <Cabecalho
        sobre="Gerencie seu funil de vendas com kanban"
        titulo="Kanban"
        descricao="Acompanhe oportunidades, etapas e proximos movimentos com leitura clara do pipeline."
        direita={
          <>
            <SeletorCrm texto="whatsapp-loja-modelo" estilo={{ minWidth: 210, background: "transparent", border: "none" }} />
            {["lapis", "lixeira", "conexoes"].map((i) => <BotaoCrm key={i} icone={i} estilo={{ width: 34, height: 34, padding: 0 }} />)}
            <BotaoCrm icone="mais">Novo funil</BotaoCrm>
            <BotaoCrm icone="mais" primario>Novo Lead</BotaoCrm>
          </>
        }
      />
      <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
        {[["Ticket medio", "R$ 3.418,20"], ["Total faturado", "R$ 212.640,00"]].map(([r, v]) => (
          <CartaoCrm key={r} estilo={{ flex: 1, padding: "9px 16px", display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: COR_CRM.suave }}>{r}</div>
              <div style={{ fontSize: 21, fontWeight: 700 }}>{v}</div>
            </div>
            <Icone nome="info" tam={15} cor={COR_CRM.suave} />
          </CartaoCrm>
        ))}
      </div>
      <CartaoCrm estilo={{ display: "flex", gap: 11, padding: "10px 14px", marginBottom: 14 }}>
        <div style={{ flex: 1, height: 38, background: "#F6F8F7", borderRadius: 7, display: "flex", alignItems: "center", gap: 9, padding: "0 13px", fontSize: 14.5, color: COR_CRM.suave }}><Icone nome="busca" tam={15} /> Pesquisar por nome ou telefone...</div>
        <SeletorCrm texto="Todos os dias" estilo={{ width: 150 }} />
        <SeletorCrm texto="Qualquer contato" estilo={{ width: 180 }} />
        <SeletorCrm texto="Todos os membros" estilo={{ width: 230 }} />
      </CartaoCrm>
      <div style={{ display: "flex", gap: 12 }}>
        {COLUNAS.map(([nome, cor, fundo, resumo], i) => (
          <div key={nome} style={{ width: 246, height: 560, flexShrink: 0, background: "#EEF1F4", borderRadius: 11, borderTop: `3px solid ${cor}`, padding: "10px 13px", overflow: desloca !== 0 ? "visible" : "hidden", boxSizing: "border-box", position: "relative", zIndex: i === coluna ? 3 : 1 }}>
            <div style={{ background: fundo, borderRadius: 6, padding: "8px 11px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14.5, fontWeight: 600, marginBottom: 6 }}>
              {nome}
              <span style={{ fontSize: 11.5, fontWeight: 400, color: "#475467" }}>{[23, 17, 10, 7, 43][i]}%</span>
            </div>
            <div style={{ fontSize: 11, color: COR_CRM.suave, marginBottom: 8, whiteSpace: "nowrap" }}>{resumo}</div>
            {i === coluna ? (
              <div style={{ opacity: k, transform: `translate(${desloca}px, ${subida + (1 - k) * -16}px) rotate(${desloca !== 0 ? 2 : 0}deg)`, width: CARD_LARGURA + 6 }}>
                <Card c={marcos} />
              </div>
            ) : null}
            {DEMAIS[i].map((c) => (
              <Card key={c.nome} c={c} />
            ))}
          </div>
        ))}
      </div>
      {funis ? (
        <div style={{ position: "absolute", left: 720, top: 78, width: 250, background: "#FFFFFF", borderRadius: 9, border: `1px solid ${COR_CRM.borda}`, boxShadow: "0 12px 30px rgba(16,24,40,0.16)", padding: "6px 0", zIndex: 9 }}>
          {["whatsapp-loja-modelo", "instagram-loja-modelo", "Orçamentos", "Reformas", "Construtoras", "Pós-venda"].map((f, i) => (
            <div key={f} style={{ padding: "8px 14px", fontSize: 15, background: i === 0 ? "#ECFDF5" : "transparent", color: i === 0 ? "#047857" : COR_CRM.texto }}>{f}</div>
          ))}
        </div>
      ) : null}
    </TelaCrm>
  );
};

// ---------- detalhe do card: cabeçalho em degradê verde e abas
export const TelaCard: React.FC<{ aba?: string; ia?: boolean }> = ({ aba = "Resumo", ia }) => {
  const Dado: React.FC<{ r: string; v: string }> = ({ r, v }) => (
    <div>
      <div style={{ fontSize: 12.5, color: "#5EEAD4" }}>{r}</div>
      <div style={{ fontSize: 15 }}>{v}</div>
    </div>
  );
  const Quadro: React.FC<{ r: string; v: string; extra?: string }> = ({ r, v, extra }) => (
    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "8px 11px", width: 208, boxSizing: "border-box", marginBottom: 8 }}>
      <div style={{ fontSize: 12.5, marginBottom: 4 }}>{r}</div>
      <div style={{ height: 32, border: "1px solid #2DD4BF", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 9px", fontSize: 12.5, whiteSpace: "nowrap" }}>
        {v} <Icone nome="seta" tam={12} />
      </div>
      {extra ? <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, marginTop: 5 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "#22C55E" }} />{extra}</div> : null}
    </div>
  );
  return (
    <TelaCrm ativo="kanban">
      <div style={{ padding: "0 90px", marginTop: -14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14.5, color: "#475467", marginBottom: 12 }}>← Voltar</div>
        <div style={{ borderRadius: 13, padding: "22px 24px", color: "#FFFFFF", display: "flex", background: "linear-gradient(100deg, #047A70 0%, #064E47 55%, #0F2E2B 100%)" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30, fontWeight: 700 }}>Marcos Oliveira</div>
            <span style={{ display: "inline-block", fontSize: 14, border: "1px solid rgba(255,255,255,0.4)", borderRadius: 999, padding: "2px 11px", margin: "9px 0 14px" }}>+ Adicionar tag</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 11 }}>
              <Dado r="Telefone" v="+5581900001234" />
              <Dado r="E-mail" v="marcos@email.com" />
              <Dado r="Empresa" v="Não informado" />
              <Dado r="Valor" v="R$ 6.840,00" />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Quadro r="Funil" v="whatsapp-loja-modelo" extra="Etapa: Em andamento" />
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#14B8A6", borderRadius: 7, padding: "7px 13px", fontSize: 14.5, marginBottom: 8 }}><Icone nome="enviar" tam={14} /> Abrir Conversa</div>
            <Quadro r="Responsável" v="Rafael Lima" />
          </div>
        </div>
        <div style={{ display: "flex", background: "#FFFFFF", borderRadius: 9, padding: 5, margin: "14px 0", gap: 2 }}>
          {["Resumo", "Histórico", "Observações", "Anexos", "Orçamentos", "Tarefas", "Conversas", "Lembretes"].map((t) => (
            <div key={t} style={{ padding: "7px 12px", fontSize: 14.5, color: t === aba ? COR_CRM.texto : COR_CRM.suave, background: t === aba ? COR_CRM.cinza : "transparent", borderRadius: 6 }}>{t}</div>
          ))}
        </div>
        <CartaoCrm estilo={{ padding: "17px 22px" }}>
          {aba === "Resumo" ? (
            <>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Resumo do Contexto</div>
              <div style={{ fontSize: 13, color: COR_CRM.suave, marginBottom: 11 }}>Resumo do contato com o cliente nesta etapa, gerado pela IA.</div>
              <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, padding: "11px 13px", fontSize: 15, lineHeight: 1.45, height: 86 }}>Marcos está reformando o banheiro e pediu porcelanato acetinado para área molhada. O agente de IA fez o primeiro atendimento e transferiu para o Rafael negociar a condição.</div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 11 }}><BotaoCrm estilo={{ background: "#101828", color: "#FFFFFF" }}>Salvar Resumo</BotaoCrm></div>
            </>
          ) : (
            <>
              {[
                ...(ia ? [["03/07, 08:21", "IA atualizou o card de acordo com a conversa"]] : []),
                ["03/07, 08:15", "Rafael Lima assumiu a conversa"],
                ["03/07, 08:12", "Agente de IA transferiu para o atendimento humano"],
                ["02/07, 23:09", "Agente de IA enviou opções do catálogo"],
                ["02/07, 23:07", "Card criado pela conversa do WhatsApp"],
              ].map(([d, t]) => (
                <div key={d} style={{ display: "flex", gap: 14, padding: "9px 8px", fontSize: 15, borderBottom: `1px solid ${COR_CRM.borda}`, background: t.startsWith("IA") ? "#ECFDF5" : "transparent", color: t.startsWith("IA") ? "#047857" : COR_CRM.texto, fontWeight: t.startsWith("IA") ? 500 : 400 }}>
                  <span style={{ color: COR_CRM.suave, width: 104, flexShrink: 0 }}>{d}</span>
                  {t}
                </div>
              ))}
            </>
          )}
        </CartaoCrm>
      </div>
    </TelaCrm>
  );
};

// ---------- Conexões: WhatsApp API
export const TelaConexoes: React.FC = () => (
  <TelaCrm ativo="whatsapp-api" conexoes>
    <Cabecalho sobre="Conexões" titulo="WhatsApp API" descricao="Conecte seu WhatsApp Business à Cloud API oficial da Meta via Embedded Signup." />
    <CartaoCrm estilo={{ padding: "22px 25px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>WhatsApp Business</div>
          <div style={{ fontSize: 14, color: COR_CRM.suave }}>1 conexões cadastradas</div>
        </div>
        <BotaoCrm icone="girar">Sincronizar</BotaoCrm>
        <BotaoCrm icone="conexoes">Habilitar Coexistência</BotaoCrm>
        <BotaoCrm icone="conexoes" primario>Nova conexao Meta</BotaoCrm>
      </div>
      <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 10, padding: "15px 18px", display: "flex", alignItems: "center", gap: 13 }}>
        <div style={{ position: "relative" }}>
          <Avatar nome="Loja Modelo" tam={54} />
          <div style={{ position: "absolute", right: -3, bottom: -3, width: 21, height: 21, borderRadius: 11, background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center" }}><Icone nome="mais" tam={12} cor="#FFFFFF" /></div>
        </div>
        <Icone nome="resolver" tam={19} cor={COR_CRM.verdeEscuro} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Loja Modelo</div>
          <div style={{ fontSize: 14, color: COR_CRM.suave }}>+55 81 90000-0000</div>
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#047857", background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 999, padding: "2px 10px" }}>SIMPLICHAT #42</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#475467", border: `1px solid ${COR_CRM.borda}`, borderRadius: 999, padding: "2px 10px" }}>ACTIVE</span>
        <Icone nome="seta" tam={15} />
      </div>
    </CartaoCrm>
    <CartaoCrm estilo={{ marginTop: 20, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 20px", background: "#FAFBFB", borderBottom: `1px solid ${COR_CRM.borda}` }}>
        <div style={{ width: 40, height: 40, borderRadius: 9, background: COR_CRM.verdeClaro, display: "flex", alignItems: "center", justifyContent: "center" }}><Icone nome="chat" tam={20} cor={COR_CRM.verdeEscuro} /></div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>WhatsApp comum</div>
          <div style={{ fontSize: 14, color: COR_CRM.suave }}>Conexões de WhatsApp gerenciadas pela Simplí para sua empresa.</div>
        </div>
      </div>
      <div style={{ padding: "13px 20px", display: "flex", alignItems: "center", gap: 13 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>loja-modelo-televendas</div>
          <div style={{ fontSize: 14, color: COR_CRM.suave }}>558190000000</div>
        </div>
        <SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857">Conectado</SeloCrm>
        <span style={{ fontSize: 13.5, color: COR_CRM.suave }}>há 20 min</span>
        <BotaoCrm>Verificar</BotaoCrm>
      </div>
    </CartaoCrm>
  </TelaCrm>
);

// ---------- Instagram: automações e sequências
const ROSA = "#DB2777";
const Conta: React.FC = () => <SeletorCrm texto="@lojamodelo" estilo={{ minWidth: 170 }} />;
const Duplo: React.FC<{ a: string; b: string; ativa: string }> = ({ a, b, ativa }) => (
  <div style={{ display: "flex", background: "#FFFFFF", borderRadius: 9, padding: 4, boxShadow: "0 1px 3px rgba(16,24,40,0.08)" }}>
    {[a, b].map((n) => (
      <div key={n} style={{ padding: "7px 13px", borderRadius: 6, fontSize: 15, color: n === ativa ? "#FFFFFF" : "#475467", background: n === ativa ? DEGRADE_ATIVO : "transparent" }}>{n}</div>
    ))}
  </div>
);

const LinhaAutomacao: React.FC<{ icone: string; nome: string; tipo: string; linhas: readonly (readonly [string, string])[]; rodape: string; aceso?: boolean }> = ({ icone, nome, tipo, linhas, rodape, aceso }) => (
  <div style={{ border: `1px solid ${aceso ? "#10B981" : COR_CRM.borda}`, borderRadius: 10, padding: "15px 18px", marginBottom: 12, display: "flex", background: aceso ? "#F6FEF9" : "#FFFFFF" }}>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
        <Icone nome={icone} tam={17} cor={ROSA} />
        <span style={{ fontSize: 16.5, fontWeight: 600 }}>{nome}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#047857", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 999, padding: "1px 9px" }}>ATIVA</span>
        <span style={{ fontSize: 13, color: COR_CRM.suave }}>{tipo}</span>
      </div>
      {linhas.map(([r, v]) => (
        <div key={r} style={{ fontSize: 14.5, color: COR_CRM.suave, lineHeight: 1.45 }}>
          <b style={{ color: COR_CRM.texto, fontWeight: 500 }}>{r}</b> {v}
        </div>
      ))}
      <div style={{ fontSize: 12.5, color: COR_CRM.suave, marginTop: 3 }}>{rodape}</div>
    </div>
    <div style={{ display: "flex", gap: 7 }}>
      <BotaoCrm icone="ligar">Pausar</BotaoCrm>
      <BotaoCrm icone="lapis">Editar</BotaoCrm>
      <BotaoCrm icone="lixeira" perigo>Excluir</BotaoCrm>
    </div>
  </div>
);

export const TelaIgAutomacoes: React.FC<{ aba?: "minhas" | "modelos"; aceso?: string }> = ({ aba = "minhas", aceso }) => (
  <TelaCrm ativo="ig-automacoes" relacionamento>
    <Cabecalho sobre="Instagram" titulo="Automações" descricao="Respostas automáticas no Instagram: comentários, mensagens diretas, menções no story, iniciadores de conversa e menu." />
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
      <Conta />
      <Duplo a="Minhas automações (3)" b="Modelos" ativa={aba === "minhas" ? "Minhas automações (3)" : "Modelos"} />
      <span style={{ flex: 1 }} />
      <BotaoCrm icone="mais" primario>Nova automação</BotaoCrm>
    </div>
    {aba === "minhas" ? (
      <CartaoCrm estilo={{ padding: "16px 18px 6px" }}>
        <LinhaAutomacao aceso icone="chat" nome="Porcelanato" tipo="Comentário com palavra-chave" linhas={[["Gatilho:", "Contém a palavra-chave — porcelanato"], ["Ações:", "responder comentário + enviar DM"]]} rodape="38 envios · último em 01/07 19:12" />
        <LinhaAutomacao icone="hash" nome="Orçamento" tipo="Palavra-chave na DM" linhas={[["Gatilho:", "Contém a palavra-chave — orçamento"], ["Mensagem:", "Oi! Me conta qual é a sua obra que eu te ajudo a montar o orçamento."]]} rodape="112 envios · último em 01/07 17:40" />
        <LinhaAutomacao icone="arroba" nome="Menção no story" tipo="Menção no story" linhas={[["Mensagem:", "Obrigada por nos mencionar! Se quiser conhecer as novidades da loja, é só chamar por aqui."]]} rodape="24 envios" />
      </CartaoCrm>
    ) : (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
        {[
          ["chat", "Comentário com palavra-chave", "Quem comentar a palavra-chave numa publicação recebe uma resposta no comentário e/ou uma DM."],
          ["hash", "Palavra-chave na DM", "Quando a mensagem direta tiver a palavra-chave, uma resposta pronta é enviada na hora."],
          ["retorno", "Resposta padrão", "Se nenhuma palavra-chave for reconhecida na DM, envia esta resposta (no máximo uma vez a cada intervalo por pessoa)."],
          ["arroba", "Menção no story", "Quando alguém mencionar a sua conta nos stories, envia uma mensagem de agradecimento."],
          ["fala", "Iniciadores de conversa", "Perguntas prontas que aparecem quando alguém abre a conversa pela primeira vez. Cada uma tem a sua resposta."],
          ["linhas", "Menu principal", "Menu fixo no Direct: cada item envia uma resposta pronta ou abre um link."],
        ].map(([i, t, d]) => (
          <CartaoCrm key={t} estilo={{ padding: "15px 18px", display: "flex", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "#FDF2F8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icone nome={i} tam={19} cor={ROSA} />
            </div>
            <div>
              <div style={{ fontSize: 15.5, fontWeight: 600 }}>{t}</div>
              <div style={{ fontSize: 13.5, color: COR_CRM.suave, lineHeight: 1.35, margin: "2px 0 9px" }}>{d}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                {["Comentário com palavra-chave", "Palavra-chave na DM", "Menção no story"].includes(t) ? <><BotaoCrm primario estilo={{ height: 33, fontSize: 14 }}>Editar</BotaoCrm><span style={{ fontSize: 13, color: COR_CRM.suave }}>Já configurada e ativa</span></> : <BotaoCrm primario estilo={{ height: 33, fontSize: 14 }}>Configurar</BotaoCrm>}
              </div>
            </div>
          </CartaoCrm>
        ))}
      </div>
    )}
  </TelaCrm>
);

export const TelaIgSequencia: React.FC = () => (
  <TelaCrm
    ativo="ig-sequencias"
    relacionamento
    sobre={
      <ModalCrm largura={660} topo={24} titulo="Editar sequência" sub="Mensagens enviadas em série no Direct, com espera entre elas. Começa quando uma automação a inicia.">
        <div style={{ padding: "16px 24px 18px" }}>
          <CampoCrm rotulo="Nome" valor="Reforma do banheiro" />
          {[
            ["MENSAGEM 1", "2", "minutos", "Oi! Separei as opções de porcelanato para banheiro. Quer ver os mais vendidos?"],
            ["MENSAGEM 2", "3", "horas", "Se preferir, me manda a metragem que eu já calculo as caixas para você."],
          ].map(([t, n, u, m]) => (
            <div key={t} style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 8, padding: "11px 13px", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: COR_CRM.suave, marginBottom: 4 }}>
                <b style={{ fontWeight: 600 }}>{t}</b> · <Icone nome="relogio" tam={12} /> enviar
                <span style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 6, padding: "3px 12px", color: COR_CRM.texto }}>{n}</span>
                <span style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 6, padding: "3px 10px", color: COR_CRM.texto }}>{u}</span>
              </div>
              <div style={{ fontSize: 12.5, color: COR_CRM.suave, marginBottom: 7 }}>{t === "MENSAGEM 1" ? "depois da resposta da automação (2 min do início)" : "depois da mensagem anterior (3 h 2 min do início)"}</div>
              <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, padding: "8px 11px", fontSize: 14.5 }}>{m}</div>
            </div>
          ))}
          <BotaoCrm icone="mais">Adicionar mensagem</BotaoCrm>
          <div style={{ background: "#F6F8F7", borderRadius: 8, padding: "9px 12px", marginTop: 11, fontSize: 12.5, color: COR_CRM.suave }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: COR_CRM.texto, fontWeight: 500, marginBottom: 3 }}>Duração total: 3 h 2 min <span style={{ fontWeight: 400, color: COR_CRM.suave }}>limite 23 h</span></div>
            O Instagram só permite mensagem até 24h depois da última mensagem da pessoa. Se ela responder no meio, o prazo renova; se a janela fechar antes, a sequência para e isso aparece nos números.
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 11 }}>
            <span style={{ width: 16, height: 16, borderRadius: 3, background: "#16A34A", color: "#FFFFFF", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8 }}>✓</span>
            <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>Sequência ativa</span>
            <BotaoCrm>Cancelar</BotaoCrm>
            <BotaoCrm primario estilo={{ marginLeft: 9 }}>Salvar</BotaoCrm>
          </div>
        </div>
      </ModalCrm>
    }
  >
    <Cabecalho sobre="Instagram" titulo="Sequências" descricao="Séries de mensagens no Direct com espera entre elas, para nutrir quem pediu algo numa automação." />
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><SeletorCrm texto="@lojamodelo" estilo={{ minWidth: 170 }} /><BotaoCrm icone="mais" primario>Nova sequência</BotaoCrm></div>
    <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 9, padding: "11px 15px", fontSize: 14, color: "#1E40AF", lineHeight: 1.4 }}>Uma sequência começa quando uma automação a inicia: palavra-chave na DM, menção no story ou um botão dos iniciadores de conversa / menu. Comentário não inicia sequência (o Instagram não abre conversa por comentário). Cada mensagem só sai dentro da janela de 24h da última mensagem da pessoa.</div>
  </TelaCrm>
);

// ---------- site da loja com o popup criado na plataforma
const PISOS = Array.from({ length: 36 }, (_, i) => i);
export const TelaSitePopup: React.FC<{ popup?: number; nome?: string; whats?: string; site?: string }> = ({ popup = 1, nome = "", whats = "", site = "www.lojamodelo.com.br" }) => (
  <div style={{ width: 1596, height: 898, background: "#10201B", fontFamily: FONTE_CRM, position: "relative", overflow: "hidden" }}>
    <div style={{ height: 34, background: "#FFFFFF", display: "flex", alignItems: "center", paddingLeft: 20, fontSize: 13, color: COR_CRM.suave }}>{site}</div>
    <div style={{ height: 70, display: "flex", alignItems: "center", padding: "0 70px", gap: 34, color: "rgba(255,255,255,0.75)", fontSize: 15.5, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <b style={{ color: "#FFFFFF", fontSize: 23, letterSpacing: 2, flex: 1 }}>LOJA MODELO</b>
      {["Pisos", "Louças", "Metais", "Tintas", "Ofertas"].map((t) => <span key={t}>{t}</span>)}
    </div>
    <div style={{ padding: "96px 70px", color: "#FFFFFF" }}>
      <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>Tudo para a sua<br />reforma, em um lugar só</div>
      <div style={{ fontSize: 19, opacity: 0.7, marginTop: 14 }}>Pisos, louças, metais e acabamento para cada fase da obra.</div>
    </div>
    <div style={{ position: "absolute", inset: 34, top: 34, background: `rgba(0,0,0,${0.5 * popup})` }} />
    <div style={{ position: "absolute", left: 400, top: 170, width: 800, height: 470, background: "#FFFFFF", borderRadius: 14, display: "flex", overflow: "hidden", opacity: popup, transform: `scale(${0.94 + 0.06 * popup})`, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
      <div style={{ width: 330, background: "#D9CFC2", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3, padding: 3, boxSizing: "border-box" }}>
        {PISOS.map((i) => <div key={i} style={{ background: i % 3 === 0 ? "#EDE6DB" : i % 3 === 1 ? "#E3DACC" : "#F2ECE3" }} />)}
      </div>
      <div style={{ flex: 1, padding: "24px 27px", position: "relative" }}>
        <div style={{ position: "absolute", right: 14, top: 14 }}><Icone nome="xis" tam={15} cor="#475467" /></div>
        <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.18, paddingRight: 20 }}>Reformando o banheiro? A gente ajuda a escolher.</div>
        <div style={{ fontSize: 14.5, color: "#344054", margin: "8px 0 13px" }}>Deixe seu contato e receba as melhores opções para a sua obra.</div>
        {[["Nome *", nome], ["Whatsapp *", whats], ["E-mail *", ""]].map(([r, v]) => (
          <div key={r} style={{ marginBottom: 9 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{r}</div>
            <div style={{ height: 40, border: "1px solid #D0D5DD", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15 }}>{v}</div>
          </div>
        ))}
        <div style={{ height: 44, borderRadius: 8, background: "#34D399", color: "#FFFFFF", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15.5, marginTop: 11 }}>Quero receber</div>
      </div>
    </div>
  </div>
);

export { AbasLinha };
