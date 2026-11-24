import type React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { marca } from "../ana/voz";
import type { Visual } from "../cortes/Ganchos";
import type { TelaV } from "../cortes/Vertical";
import { TelaVendedor } from "../crm/Celular";
import { CartaoCrm, COR_CRM, FONTE_CRM, Icone, SeloCrm } from "../crm/Kit";
import { SeloClasse } from "../crm/TelasVenda";
import { CINZA, fontFamily, textoDegrade, TITULO, VERDE } from "../fonte";
import { Surge } from "../verbas/Montagem";

// Telas do Simplí CRM na versão de celular, em tela cheia, para os cortes 9:16. Barra branca com a
// logo e rodapé preto como no aplicativo real; escritas em pixels de CSS e escaladas para o quadro.
const LARG = 430;
const K = 1080 / LARG;
const ALT = 1120 / K;
export const clampF = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type M = (p: string, n?: number) => number;

const ABAS = [["dashboard", "Dashboard"], ["tarefas", "Tarefas"], ["chat", "Simplí Chat"], ["gestaoTarefas", "Gestão de ta..."], ["linhas", "Mais"]] as const;
const Rodape: React.FC<{ ativo?: string }> = ({ ativo }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 56, background: "#000000", display: "flex", alignItems: "center", justifyContent: "space-around", color: "#FFFFFF", fontSize: 11, zIndex: 5 }}>
    {ABAS.map(([i, t]) => (
      <div key={t} style={{ textAlign: "center", width: 76 }}>
        <div style={{ width: i === "chat" ? 40 : 46, height: i === "chat" ? 40 : 26, marginTop: i === "chat" ? -18 : 0, borderRadius: i === "chat" ? 20 : 12, background: t === ativo ? "#22C55E" : i === "chat" ? "#2A2A2A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", margin: i === "chat" ? "-16px auto 1px" : "0 auto 2px" }}>
          <Icone nome={i} tam={i === "chat" ? 21 : 18} cor="#FFFFFF" />
        </div>
        <span style={{ fontWeight: t === "Simplí Chat" ? 600 : 400, whiteSpace: "nowrap" }}>{t}</span>
      </div>
    ))}
  </div>
);

export const TelaCel: React.FC<{ ativo?: string; rola?: number; children: React.ReactNode; fixo?: React.ReactNode }> = ({ ativo, rola = 0, children, fixo }) => (
  <div style={{ position: "absolute", left: 0, top: 360, width: 1080, height: 1120, overflow: "hidden", background: COR_CRM.fundo }}>
    <div style={{ width: LARG, height: ALT, transform: `scale(${K})`, transformOrigin: "0 0", position: "relative", fontFamily: FONTE_CRM, color: COR_CRM.texto }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 48, bottom: 56, overflow: "hidden" }}>
        <div style={{ padding: "11px 13px", transform: `translateY(${-rola}px)` }}>{children}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 48, background: "#FFFFFF", display: "flex", alignItems: "center", paddingLeft: 17, borderBottom: `1px solid ${COR_CRM.borda}`, zIndex: 5 }}>
        <Img src={staticFile("midia/logo-simpli-crm-claro.png")} style={{ height: 25 }} />
      </div>
      {fixo}
      <Rodape ativo={ativo} />
    </div>
  </div>
);

const Titulo: React.FC<{ sobre?: string; t: string; d?: string }> = ({ sobre, t, d }) => (
  <div style={{ marginBottom: 10 }}>
    {sobre ? <div style={{ fontSize: 12, color: COR_CRM.suave }}>{sobre}</div> : null}
    <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.2 }}>{t}</div>
    {d ? <div style={{ fontSize: 12.5, color: COR_CRM.suave, lineHeight: 1.3 }}>{d}</div> : null}
  </div>
);
const Ind: React.FC<{ r: string; v: string; s?: string; c?: string; aceso?: boolean }> = ({ r, v, s, c, aceso }) => (
  <CartaoCrm estilo={{ padding: "9px 12px", marginBottom: 8, border: aceso ? "2px solid #10B981" : `1px solid ${COR_CRM.borda}` }}>
    <div style={{ fontSize: 12, color: COR_CRM.suave }}>{r}</div>
    <div style={{ fontSize: 20, fontWeight: 700, color: c ?? COR_CRM.texto, lineHeight: 1.25, whiteSpace: "nowrap" }}>{v}</div>
    {s ? <div style={{ fontSize: 11.5, color: COR_CRM.suave }}>{s}</div> : null}
  </CartaoCrm>
);

// ---------- Simplí Chat
export type Msg = { t: "cliente" | "enviada" | "sistema" | "audio"; a?: string; x?: string; h?: string; de?: number; prog?: number };
const Bolha: React.FC<{ m: Msg }> = ({ m }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [m.de ?? -99, (m.de ?? -99) + 8], [0, 1], clampF);
  if (k <= 0) return null;
  const est = { opacity: k, transform: `translateY(${(1 - k) * 12}px)` };
  if (m.t === "sistema") return <div style={{ textAlign: "center", fontSize: 10.5, color: "#475467", margin: "6px 0", ...est }}>{m.x}</div>;
  const env = m.t === "enviada";
  return (
    <div style={{ display: "flex", justifyContent: env ? "flex-end" : "flex-start", margin: "7px 0", ...est }}>
      <div style={{ maxWidth: 346, background: env ? "#1E3A8A" : "#FFFFFF", color: env ? "#FFFFFF" : COR_CRM.texto, borderRadius: 8, padding: "7px 11px", boxShadow: "0 1px 2px rgba(16,24,40,0.1)" }}>
        <div style={{ fontSize: 10.5, fontWeight: 500, opacity: 0.75, marginBottom: 2 }}>{m.a}</div>
        {m.t === "audio" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: "#E4E7EC", display: "flex", alignItems: "center", justifyContent: "center", color: "#475467", fontSize: 11 }}>▶</div>
            <div style={{ width: 170 }}><div style={{ height: 5, borderRadius: 3, background: "#D0D5DD", overflow: "hidden" }}><div style={{ width: `${(m.prog ?? 0) * 100}%`, height: "100%", background: "#10B981" }} /></div><div style={{ fontSize: 10, color: COR_CRM.suave, marginTop: 3 }}>0:06</div></div>
          </div>
        ) : <div style={{ fontSize: 13, lineHeight: 1.36, whiteSpace: "pre-line" }}>{m.x}</div>}
        <div style={{ fontSize: 9.5, opacity: 0.7, textAlign: "right", marginTop: 2 }}>{m.h}{env ? " ✓✓" : ""}</div>
      </div>
    </div>
  );
};
export const Conversa: React.FC<{ msgs: Msg[]; rola?: number; atribuido?: string }> = ({ msgs, rola = 0, atribuido }) => (
  <TelaCel ativo="Simplí Chat" fixo={
    <div style={{ position: "absolute", left: 0, right: 0, top: 48, height: 46, background: "#FFFFFF", borderBottom: `1px solid ${COR_CRM.borda}`, display: "flex", alignItems: "center", gap: 8, padding: "0 11px", zIndex: 4 }}>
      <Icone nome="voltar" tam={16} cor={COR_CRM.suave} />
      <div style={{ width: 30, height: 30, borderRadius: 15, background: "#EAECEF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>MO</div>
      <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.15 }}>Marcos Oliveira</div><div style={{ fontSize: 10.5, color: COR_CRM.suave }}>+5581900001234</div></div>
      <span style={{ fontSize: 11, border: `1px solid ${COR_CRM.borda}`, borderRadius: 6, padding: "3px 7px", color: "#344054" }}>{atribuido ?? "Atribuir"}</span>
    </div>
  }>
    <div style={{ paddingTop: 44, transform: `translateY(${-rola}px)` }}>{msgs.map((m, i) => <Bolha key={i} m={m} />)}</div>
  </TelaCel>
);
const AUDIO: Msg = { t: "audio", a: "Marcos Oliveira", h: "02/07, 23:07" };
const RESPOSTA = "Oi, Marcos! Para banheiro, eu recomendo os porcelanatos acetinados, que são mais seguros em área molhada. Temos estas opções:\n\n• Porcelanato Acetinado Areia 60x60: R$ 89,90 o m²\n• Porcelanato Acetinado Cinza 60x60: R$ 79,90 o m²\n\nQuantos metros quadrados tem o seu banheiro?";

const LISTA = [["MO", "Marcos Oliveira", "w", "[áudio]", "bot_atendendo", "1m"], ["PS", "Patrícia Souza", "i", "Vocês entregam em Olinda?", "bot_atendendo", "22m"], ["JA", "João Almeida", "w", "Obrigado, até amanhã", "bot_atendendo", "1h"], ["CR", "Carla Ribeiro", "w", "Quero falar com o vendedor", "aguardando_humano", "2h"]] as const;
export const ListaChatV: TelaV = () => (
  <TelaCel ativo="Simplí Chat">
    <div style={{ margin: "-11px -13px 0", background: "#FFFFFF" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "9px 13px", fontSize: 15, color: COR_CRM.texto }}><span style={{ flex: 1 }}>Todos os canais ⌄</span><span style={{ display: "flex", gap: 11, color: "#475467" }}>{["mais", "robo", "filtro", "pessoaMais", "atualizar"].map((i) => <Icone key={i} nome={i} tam={15} />)}</span></div>
      <div style={{ display: "flex", borderTop: `1px solid ${COR_CRM.borda}`, borderBottom: `1px solid ${COR_CRM.borda}`, fontSize: 14 }}>{["Pendentes", "Minhas", "Todas"].map((t, i) => <div key={t} style={{ flex: 1, textAlign: "center", padding: "8px 0", color: i ? COR_CRM.suave : COR_CRM.texto, borderBottom: i ? "none" : "2px solid #101828" }}>{t}</div>)}</div>
      {LISTA.map(([ini, n, c, p, tag, t]) => (
        <div key={n} style={{ display: "flex", gap: 10, padding: "9px 13px", borderBottom: `1px solid ${COR_CRM.borda}`, background: c === "i" ? "#FDF2F8" : "#FFFFFF", position: "relative" }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: "#EAECEF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{ini}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: c === "i" ? "#DB2777" : "#1D4ED8" }}>{c === "i" ? "INSTAGRAM-LOJA-MODELO" : "WHATSAPP-LOJA-MODELO"}</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{n}</div>
            <div style={{ fontSize: 12, color: COR_CRM.suave }}>{p}</div>
            <span style={{ fontSize: 10, fontWeight: 500, padding: "1px 6px", borderRadius: 4, background: tag === "bot_atendendo" ? "#DDD6FE" : "#FECACA", color: tag === "bot_atendendo" ? "#3B2A8C" : "#991B1B" }}>{tag}</span>
          </div>
          <span style={{ position: "absolute", right: 11, top: 8, fontSize: 10, color: COR_CRM.suave }}>{t}</span>
        </div>
      ))}
    </div>
  </TelaCel>
);
export const AudioChegaV: TelaV = ({ c }) => <Conversa msgs={[{ ...AUDIO, de: marca(c.fala, "áudio") - 4 }]} />;
export const AudioTocaV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  return <Conversa msgs={[{ ...AUDIO, prog: interpolate(frame, [8, c.dur - 14], [0, 1], clampF) }]} />;
};
export const RespondeV: TelaV = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Conversa msgs={[{ ...AUDIO, prog: 1 }, { t: "enviada", a: "Bot_lojamodelo", x: RESPOSTA, h: "02/07, 23:07", de: m("responde") }]} />
      {["texto", "áudio", "PDF"].map((f, i) => (
        <Surge key={f} de={m(f) - 3} ate={m("chatbot") - 10} style={{ left: 660, top: 640 + i * 62, zIndex: 20 }}>
          <div style={{ background: VERDE, color: "#0B0B0C", borderRadius: 10, padding: "6px 22px", ...TITULO, fontSize: 32 }}>{f.toUpperCase()}</div>
        </Surge>
      ))}
      <Surge de={m("chatbot") - 4} ate={m("consulta") - 12} style={{ left: 630, right: 36, top: 640, zIndex: 20 }}>
        <div style={{ background: "#0B0B0C", border: "2px solid #FF6B6B", borderRadius: 14, padding: "16px 18px", textAlign: "center", ...TITULO, fontSize: 38, lineHeight: 1.12, color: "white" }}>NADA DE OPÇÃO 1, 2 OU 3</div>
      </Surge>
      <Surge de={m("consulta") - 4} style={{ left: 630, right: 36, top: 640, zIndex: 20 }}>
        <div style={{ background: VERDE, color: "#0B0B0C", borderRadius: 14, padding: "16px 18px", textAlign: "center", ...TITULO, fontSize: 38, lineHeight: 1.12 }}>BASE DA EMPRESA + CATÁLOGO</div>
      </Surge>
    </>
  );
};
export const TransfereV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const a = m("atendente");
  return <Conversa atribuido={frame >= a ? "Rafael Lima" : undefined} msgs={[
    { t: "cliente", a: "Marcos Oliveira", x: "Quero fechar. Consigo desconto?", h: "03/07, 08:12" },
    { t: "enviada", a: "Bot_lojamodelo", x: "Vou lhe transferir para o atendimento humano, só um momento...", h: "03/07, 08:12", de: m("transfere") - 6 },
    { t: "sistema", x: "Sistema de Automação adicionou aguardando_humano", de: m("transfere") + 10 },
    { t: "enviada", a: "Rafael Lima", x: "Bom dia, Marcos! Aqui é o Rafael. Vou ver a melhor condição para você.", h: "03/07, 08:15", de: a },
    { t: "sistema", x: "Rafael Lima atribuiu a si mesmo essa conversa", de: a + 8 },
  ]} />;
};

// ---------- ponte e lista de passos sobre a tela
const PASSOS = ["ATENDE", "VENDE", "GERENCIA"];
export const PonteV: TelaV = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("Simplí") - 6} style={{ left: 0, right: 0, top: 480, display: "flex", justifyContent: "center" }}><Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 760 }} /></Surge>
      {[m("atendimento"), m("vendas"), m("gestão")].map((d, i) => (
        <Surge key={i} de={d - 3} style={{ left: 0, right: 0, top: 730 + i * 170, textAlign: "center" }}>
          <div style={{ ...TITULO, fontSize: 118, ...(i === 2 ? textoDegrade : { color: "white" }) }}>{PASSOS[i]}</div>
        </Surge>
      ))}
    </>
  );
};
export const Marcas: React.FC<{ itens: readonly (readonly [number, string])[]; y?: number }> = ({ itens, y = 860 }) => (
  <>
    {itens.map(([d, t], i) => (
      <Surge key={t} de={d} style={{ left: 60, right: 60, top: y + i * 118, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(11,11,12,0.95)", border: "2px solid rgba(60,224,30,0.6)", borderRadius: 16, padding: "20px 30px" }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: VERDE, flexShrink: 0 }} />
          <div style={{ ...TITULO, fontSize: 48, color: "white" }}>{t}</div>
        </div>
      </Surge>
    ))}
  </>
);

// ---------- orçamentos e tarefas
const CardOrc: React.FC = () => (
  <CartaoCrm estilo={{ padding: "10px 12px", border: "2px solid #10B981" }}>
    <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 6 }}><SeloCrm fundo={COR_CRM.cinza} cor="#344054">Loja 1</SeloCrm><SeloCrm fundo="#DBEAFE" cor="#1D4ED8">fisico</SeloCrm></div>
    <div style={{ fontSize: 14.5, fontWeight: 600 }}>MARCOS OLIVEIRA <span style={{ fontWeight: 400, fontSize: 12, color: COR_CRM.suave }}>#48213</span></div>
    <div style={{ fontSize: 12, fontStyle: "italic", color: COR_CRM.suave, margin: "5px 0" }}>"Orcamento ERP 48213"</div>
    <div style={{ display: "inline-block", fontFamily: "monospace", fontWeight: 700, fontSize: 14, background: COR_CRM.cinza, borderRadius: 4, padding: "2px 7px" }}>R$ 6.840,00</div>
    <div style={{ fontSize: 12, color: "#344054", marginTop: 6 }}>RAFAEL LIMA · 10/07/2026</div>
  </CartaoCrm>
);
const OrcamentosM: React.FC<{ rola: number; follow: boolean }> = ({ rola, follow }) => (
  <TelaCel rola={rola}>
    <Titulo sobre="Acompanhe seus orçamentos do envio até o fechamento" t="Orçamentos" />
    <div style={{ display: "flex", gap: 8 }}><div style={{ flex: 1 }}><Ind r="Total Vendido" v="R$ 921.380" c="#059669" /></div><div style={{ flex: 1 }}><Ind r="Ticket Médio" v="R$ 3.418,20" /></div></div>
    <div style={{ background: "#EEF1F4", borderRadius: 10, borderTop: `3px solid ${follow ? "#8B5CF6" : "#3B82F6"}`, padding: "9px 10px" }}>
      <div style={{ background: follow ? "#DDD6F3" : "#D6E2F5", borderRadius: 6, padding: "6px 10px", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{follow ? "Follow-up 1" : "Orçamento Enviado"}</div>
      <CardOrc />
    </div>
  </TelaCel>
);
const Tarefas: React.FC<{ rola?: number; aceso?: boolean }> = ({ rola = 0, aceso }) => (
  <TelaCel ativo="Tarefas" rola={rola}>
    <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 21, fontWeight: 700, lineHeight: 1.1, marginBottom: 3 }}><Icone nome="relogio" tam={17} cor="#EA580C" /> <span style={{ flex: 1 }}>Tarefas pendentes</span></div>
    <div style={{ fontSize: 12, color: COR_CRM.suave, marginBottom: 9 }}>Todas as tarefas que ainda nao foram concluidas.</div>
    <div style={{ background: "#FFFFFF", borderRadius: 11, borderTop: "3px solid #EF4444", padding: "10px 13px" }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>Alta</div>
      <div style={{ fontSize: 12, color: COR_CRM.suave, marginBottom: 8 }}>1 tarefas</div>
      <div style={{ border: `${aceso ? 2 : 1}px solid ${aceso ? "#10B981" : COR_CRM.borda}`, borderRadius: 10, padding: "9px 11px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, color: "#475467", marginBottom: 6 }}>{["enviar", "chat", "resolver", "lapis", "lixeira"].map((x) => <Icone key={x} nome={x} tam={14} />)}</div>
        <div style={{ fontSize: 14, lineHeight: 1.4 }}>Follow-up 1 - Orçamento em aberto: Marcos, porcelanato do banheiro, R$ 6.840,00, 5 dias em aberto</div>
        <div style={{ background: "#F6F8F7", borderRadius: 7, padding: "6px 9px", marginTop: 8 }}><div style={{ fontSize: 13, fontWeight: 600 }}>Marcos Oliveira</div><div style={{ fontSize: 12, color: COR_CRM.suave }}>+5581900001234</div></div>
      </div>
    </div>
  </TelaCel>
);
export const OrcamentoV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const troca = m("tarefa") - 6;
  if (frame >= troca) return <Tarefas aceso />;
  return (
    <>
      <OrcamentosM follow={frame >= m("cadência") - 4} rola={interpolate(frame, [m("cadência") - 14, m("cadência") + 6], [0, 60], clampF)} />
      <Marcas y={1280} itens={[[m("definidos") - 4, "Definido com você"]]} />
    </>
  );
};
export const LembraV: TelaV = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Tarefas aceso />
      <Marcas y={900} itens={[[m("chama") - 4, "Chama o cliente"], [m("personalizado") - 4, "Atende de um jeito pessoal"], [m("fecha") - 4, "Fecha a venda"]]} />
    </>
  );
};

// ---------- CRM e ficha do cliente
const CLASSES: readonly (readonly [string, string, string, string])[] = [["Novos", "612", "#0284C7", "novo"], ["Ativos", "1.184", "#059669", "ativo"], ["Recorrentes", "943", "#7C3AED", "recorrente"], ["VIP", "218", "#D97706", "VIP"], ["Em risco", "536", "#EA580C", "risco"], ["Inativos", "4.927", "#475467", "inativo"]];
export const CrmV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m: M = (p, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <TelaCel>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 21, fontWeight: 700, marginBottom: 9 }}><Icone nome="contatos" tam={19} /> CRM Clientes</div>
        <Ind r="Total" v="8.420" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
          {CLASSES.map(([r, v, cor, p]) => <Ind key={r} r={r} v={v} c={cor} aceso={frame >= m(p) - 3 && frame < m(p) + 30} />)}
        </div>
      </TelaCel>
      <Marcas y={1348} itens={[[m("critérios") - 4, "Critérios definidos com você"]]} />
    </>
  );
};
const LINHA = [["pessoaMais", "Entrou na base", "", "02/07/26"], ["sobe", "Classificado como", "Novo", "11/07/26"], ["orcamentos", "Primeira compra", "", "11/07/26"], ["sobe", "Classificado como", "Ativo", "18/07/26"], ["eventos", "Participou do evento", "", "18/07/26"]] as const;
export const FichaV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  return (
    <TelaCel rola={interpolate(frame, [m("linha") - 14, m("linha") + 6, m("histórico") - 14, m("histórico") + 6], [0, 150, 150, 340], clampF)}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, fontWeight: 700 }}>MARCOS OLIVEIRA <SeloClasse c="Ativo" /></div>
      <div style={{ fontSize: 12, color: COR_CRM.suave, marginBottom: 9 }}>Cód. 14284 · +5581900001234</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
        <Ind r="Compras" v="2" /><Ind r="Total Comprado" v="R$ 8.055,40" c="#059669" /><Ind r="Ticket Médio" v="R$ 4.027,70" c="#0284C7" /><Ind r="Total Orçado" v="R$ 6.840,00" c="#EA580C" />
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, margin: "4px 0 6px" }}>Linha do tempo (5)</div>
      {LINHA.map(([i, t, cl, d]) => <div key={t + d + cl} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, height: 30 }}><Icone nome={i} tam={14} cor="#667085" /><span style={{ fontWeight: 500 }}>{t}</span>{cl ? <SeloClasse c={cl} /> : null}<span style={{ flex: 1 }} /><span style={{ fontSize: 11.5, color: COR_CRM.suave }}>{d}</span></div>)}
      <div style={{ fontSize: 15, fontWeight: 600, margin: "12px 0 6px" }}>Compras (2)</div>
      {[["#57909", "18/07/2026", "R$ 6.840,00"], ["#57412", "11/07/2026", "R$ 1.215,40"]].map(([p, d, v]) => <CartaoCrm key={p} estilo={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", marginBottom: 7, fontSize: 13.5 }}><span>{p} · {d}<br /><span style={{ fontSize: 11.5, color: COR_CRM.suave }}>RAFAEL LIMA · Loja 1</span></span><b style={{ color: "#059669" }}>{v}</b></CartaoCrm>)}
    </TelaCel>
  );
};

// ---------- app do vendedor: a tela real, em largura total, com rolagem
const VK = 1080 / 390;
const Vendedor: React.FC<{ rola: number; children: React.ReactNode }> = ({ rola, children }) => (
  <div style={{ position: "absolute", left: 0, top: 360, width: 1080, height: 1120, overflow: "hidden" }}>
    <div style={{ width: 390, height: 844, position: "relative", fontFamily: FONTE_CRM, transform: `scale(${VK}) translateY(${-rola}px)`, transformOrigin: "0 0" }}>{children}</div>
  </div>
);
export const AppV: TelaV = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Vendedor rola={0}><TelaVendedor /></Vendedor>
      <Marcas y={1290} itens={[[m("instala") - 4, "Instala no celular"]]} />
    </>
  );
};
const ROLA_LISTA = 300;
export const FluxoV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  return (
    <Vendedor rola={interpolate(frame, [4, 22], [0, ROLA_LISTA], clampF)}>
      <TelaVendedor comprasDe={m("comprou") - 14} comprasAte={m("copia") - 8} copiado={frame >= m("copia")} feito={frame >= m("marca")} abordagens={frame >= m("marca") ? 1 : 0} />
    </Vendedor>
  );
};
const RANK = [["Rafael Lima", "41 contatos", "R$ 18.940,00"], ["Camila Torres", "37 contatos", "R$ 12.310,00"], ["Bruno Nunes", "29 contatos", "R$ 9.280,00"], ["Juliana Prado", "21 contatos", "R$ 6.770,00"]] as const;
export const VoltouV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const gestor = m("gestor") - 6;
  if (frame >= gestor)
    return (
      <TelaCel ativo="Gestão de ta...">
        <Titulo sobre="Gestão de tarefas" t="Reativação - Clientes em risco" d="Ativa · Todo dia · 50/vendedor" />
        {RANK.map(([n, q, v], i) => <CartaoCrm key={n} estilo={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", marginBottom: 7, border: i ? `1px solid ${COR_CRM.borda}` : "2px solid #10B981" }}><span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25 }}>{n}<br /><span style={{ fontWeight: 400, fontSize: 12, color: COR_CRM.suave }}>{q}</span></span><b style={{ fontSize: 14.5, color: "#059669" }}>{v}</b></CartaoCrm>)}
      </TelaCel>
    );
  return (
    <Surge de={6} style={{ left: 60, right: 60, top: 540 }}>
      <div style={{ background: "#141815", border: `2px solid ${VERDE}`, borderRadius: 24, padding: "50px 44px", fontFamily, color: "white" }}>
        <div style={{ ...TITULO, fontSize: 42, color: VERDE }}>O MARCOS VOLTOU</div>
        <div style={{ ...TITULO, fontSize: 78, lineHeight: 1.05, marginTop: 14 }}>LOUÇAS E METAIS</div>
        <div style={{ fontSize: 38, fontWeight: 600, color: CINZA, marginTop: 34 }}>Venda vinda do ERP</div>
        <div style={{ ...TITULO, fontSize: 90, ...textoDegrade }}>R$ 4.280,00</div>
        <div style={{ fontSize: 38, fontWeight: 600, color: CINZA, marginTop: 20 }}>Na conta de Rafael Lima</div>
      </div>
    </Surge>
  );
};

// ---------- Eventos
const CabecaEv: React.FC<{ aba: string }> = ({ aba }) => (
  <>
    <div style={{ fontSize: 17, fontWeight: 700 }}>REATIVAÇÃO EM RISCO <SeloCrm fundo={COR_CRM.cinza} cor="#475467">Encerrado</SeloCrm></div>
    <div style={{ fontSize: 11.5, color: COR_CRM.suave, marginBottom: 8 }}>20/10/2026 → 05/11/2026 · Todas as lojas</div>
    <div style={{ display: "flex", gap: 12, fontSize: 13, borderBottom: `1px solid ${COR_CRM.borda}`, marginBottom: 10 }}>{["Resumo", "Detalhamento", "Campanhas", "Gráficos"].map((t) => <span key={t} style={{ paddingBottom: 6, color: t === aba ? "#16A34A" : "#475467", borderBottom: t === aba ? "2px solid #16A34A" : "none" }}>{t}</span>)}</div>
  </>
);
export const EventoV: TelaV = () => (
  <TelaCel>
    <CabecaEv aba="Resumo" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
      <Ind r="Vendas · pedidos faturados" v="1.284" /><Ind r="Clientes únicos" v="812" c="#0891B2" />
      <Ind r="Faturado" v="R$ 684.210" /><Ind r="Ticket médio" v="R$ 532,90" c="#7C3AED" />
      <Ind r="Produtos positivados" v="946" c="#0D9488" /><Ind r="Clientes novos" v="214" c="#4F46E5" />
    </div>
  </TelaCel>
);
export const CampanhasV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const k = interpolate(frame, [m("compraram") - 6, m("financeiro")], [0, 1], clampF);
  return (
    <>
      <TelaCel rola={interpolate(frame, [m("mostra") - 14, m("mostra") + 4], [0, 62], clampF)}>
        <CabecaEv aba="Campanhas" />
        <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 7 }}>Campanhas vinculadas <span style={{ fontSize: 11.5, fontWeight: 400, color: COR_CRM.suave }}>— 3 disparo(s)</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
          <Ind r="Enviados" v="1.608" c="#0284C7" />
          <Ind r="Compraram" v={String(Math.round(48 * k))} c="#059669" />
          <Ind r="Valor gerado" v={`R$ ${Math.round(61420 * k).toLocaleString("pt-BR")},00`} c="#059669" aceso={k >= 1} />
          <Ind r="Conversão" v="3,0%" c="#EA580C" />
        </div>
        {[["sentimos_sua_falta", "29 compraram", "R$ 38.210,00"], ["Reativação em risco", "12 compraram", "R$ 15.640,00"], ["SMS Reativação", "7 compraram", "R$ 7.570,00"]].map(([n, q, v]) => <CartaoCrm key={n} estilo={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", marginBottom: 6, fontSize: 13 }}><span style={{ lineHeight: 1.25 }}>{n}<br /><span style={{ fontSize: 11, color: "#16A34A" }}>{q}</span></span><b style={{ color: "#059669" }}>{v}</b></CartaoCrm>)}
      </TelaCel>
      <Marcas y={1348} itens={[[m("atrela") - 4, "Campanhas atreladas ao evento"]]} />
    </>
  );
};

// ---------- fim
export const FimV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const brilho = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}><Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 620 }} /></Surge>
      <Surge de={m("Comenta") - 6} style={{ left: 60, right: 60, top: 560, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 70, color: "white" }}>COMENTA</div>
        <div style={{ margin: "16px auto 0", width: "fit-content", background: VERDE, color: "#0B0B0C", borderRadius: 18, padding: "16px 70px", ...TITULO, fontSize: 150, boxShadow: `0 0 ${40 + brilho * 30}px rgba(60,224,30,0.5)` }}>CRM</div>
      </Surge>
      <Surge de={m("apresentação") - 6} style={{ left: 0, right: 0, top: 1000, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 48, color: CINZA }}>apresentação completa</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.15, ...textoDegrade }}>JÁ NO AR</div>
      </Surge>
    </>
  );
};

// ---------- visuais dos ganchos
const Pilha: React.FC<{ k: number; antes: React.ReactNode; depois: React.ReactNode }> = ({ k, antes, depois }) => (
  <div style={{ position: "relative", width: 900, height: 310, fontFamily }}>
    <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", borderRadius: 22, border: "2px solid #2A2F2B", background: "#141815", padding: "36px 40px", opacity: 1 - k, display: "flex", flexDirection: "column", justifyContent: "center" }}>{antes}</div>
    <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", borderRadius: 22, border: `2px solid ${VERDE}`, background: "#141815", padding: "36px 40px", opacity: k, transform: `scale(${0.94 + 0.06 * k})`, boxShadow: "0 0 60px rgba(60,224,30,0.25)", display: "flex", flexDirection: "column", justifyContent: "center" }}>{depois}</div>
  </div>
);
const L1: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = "white" }) => <div style={{ ...TITULO, fontSize: 62, lineHeight: 1.12, color: c }}>{children}</div>;
const L2: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ fontWeight: 600, fontSize: 40, color: CINZA, marginTop: 12 }}>{children}</div>;
export const V1: Visual = ({ k }) => <Pilha k={k} antes={<><L1 c="#FF8A80">23h07</L1><L2>Cliente sem resposta</L2></>} depois={<><L1 c={VERDE}>23h07</L1><L2>Respondido pelo agente de IA</L2></>} />;
export const V2: Visual = ({ k }) => <Pilha k={k} antes={<><L1>R$ 6.840,00</L1><L2>Orçamento parado há 5 dias</L2></>} depois={<><L1 c={VERDE}>Follow-up 1</L1><L2>Tarefa na lista do vendedor</L2></>} />;
export const V3: Visual = ({ k }) => <Pilha k={k} antes={<><L1>Quem é esse cliente?</L1><L2>Nenhum histórico à mão</L2></>} depois={<><L1 c={VERDE}>R$ 8.055,40</L1><L2>2 compras · linha do tempo completa</L2></>} />;
export const V4: Visual = ({ k }) => <Pilha k={k} antes={<><L1>Cliente parado</L1><L2>Vendedor longe do computador</L2></>} depois={<><L1 c={VERDE}>50 clientes</L1><L2>Para contatar, pelo celular</L2></>} />;
export const V5: Visual = ({ k }) => <Pilha k={k} antes={<><L1>Campanha enviada</L1><L2>E quanto ela vendeu?</L2></>} depois={<><L1 c={VERDE}>R$ 61.420,00</L1><L2>48 clientes compraram</L2></>} />;

