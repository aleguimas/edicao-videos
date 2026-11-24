import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COR_CRM, Icone, TelaCrm } from "./Kit";

// Simplí Chat: lista de conversas à esquerda e a conversa aberta à direita.
const AZUL_ENVIADA = "#1E3A8A";
const FUNDO_CONVERSA = "#F4F6F6";
const LARGURA_LISTA = 320;

const TAGS: Record<string, { fundo: string; cor: string }> = {
  bot_atendendo: { fundo: "#DDD6FE", cor: "#3B2A8C" },
  aguardando_humano: { fundo: "#FECACA", cor: "#991B1B" },
  humano_atendendo: { fundo: "#D1F5C4", cor: "#14532D" },
};

export type Conversa = {
  iniciais: string;
  nome: string;
  canal: "whatsapp" | "instagram";
  previa: string;
  retorno?: boolean;
  tag: keyof typeof TAGS;
  tempo: string;
  dono?: string;
  naoLidas?: number;
};

export type Mensagem =
  | { tipo: "nota"; autor: string; texto: string; hora: string; de?: number }
  | { tipo: "cliente"; autor: string; texto: string; hora: string; de?: number }
  | { tipo: "clienteAudio"; autor: string; duracao: string; hora: string; progresso?: number; de?: number }
  | { tipo: "enviada"; autor: string; texto: string; hora: string; de?: number }
  | { tipo: "sistema"; texto: string; de?: number };

const Tag: React.FC<{ nome: keyof typeof TAGS }> = ({ nome }) => (
  <span style={{ background: TAGS[nome].fundo, color: TAGS[nome].cor, fontSize: 11, fontWeight: 500, padding: "1px 6px", borderRadius: 4 }}>{nome}</span>
);

const Abas: React.FC<{ ativa: string; pendentes: number; minhas: number; todas: number }> = ({ ativa, pendentes, minhas, todas }) => (
  <div style={{ display: "flex", height: 43, borderBottom: `1px solid ${COR_CRM.borda}`, alignItems: "stretch" }}>
    {[
      ["Pendentes", pendentes],
      ["Minhas", minhas],
      ["Todas", todas],
    ].map(([nome, n]) => (
      <div
        key={nome}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          fontSize: 15.5,
          color: nome === ativa ? COR_CRM.texto : COR_CRM.suave,
          borderBottom: nome === ativa ? `2px solid ${COR_CRM.texto}` : "2px solid transparent",
          position: "relative",
        }}
      >
        {nome}
        <span style={{ position: "relative", top: -9, background: "#EF4444", color: "#FFFFFF", fontSize: 9.5, fontWeight: 600, minWidth: 15, height: 15, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
      </div>
    ))}
    <div style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: `1px solid ${COR_CRM.borda}` }}>
      <Icone nome="estrela" tam={15} cor={COR_CRM.suave} />
    </div>
  </div>
);

const ItemConversa: React.FC<{ c: Conversa; aberta?: boolean }> = ({ c, aberta }) => {
  const insta = c.canal === "instagram";
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "13px 9px 11px 17px",
        position: "relative",
        borderBottom: `1px solid ${COR_CRM.borda}`,
        background: aberta ? "#F2F3F4" : insta ? "#FDF2F8" : "#FFFFFF",
        boxShadow: aberta ? `inset 2px 0 0 ${COR_CRM.texto}` : "none",
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 20, background: "#EAECEF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#344054", flexShrink: 0, position: "relative" }}>
        {c.iniciais}
        {c.naoLidas ? (
          <span style={{ position: "absolute", top: -3, right: -5, background: "#EF4444", color: "#FFFFFF", fontSize: 10, fontWeight: 600, width: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.naoLidas}</span>
        ) : null}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {c.dono ? (
          <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11.5, color: COR_CRM.suave, marginBottom: 1 }}>
            <Icone nome="pessoa" tam={11} /> {c.dono}
          </div>
        ) : null}
        <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: insta ? "#DB2777" : "#1D4ED8", marginBottom: 1 }}>
          {insta ? <Icone nome="instagram" tam={11} cor="#DB2777" /> : null}
          {insta ? "INSTAGRAM-LOJA-MODELO" : "WHATSAPP-LOJA-MODELO"}
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.nome}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13.5, color: COR_CRM.suave, marginBottom: 4 }}>
          {c.retorno ? <Icone nome="retorno" tam={12} cor="#10B981" /> : null}
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.previa}</span>
        </div>
        <Tag nome={c.tag} />
      </div>
      <div style={{ position: "absolute", top: 8, right: 8, fontSize: 10.5, color: COR_CRM.suave }}>{c.tempo}</div>
      <div style={{ position: "absolute", bottom: 9, right: 9, display: "flex", alignItems: "center", gap: 3, fontSize: 11.5, fontWeight: 600, color: "#16A34A" }}><Icone nome="temporizador" tam={12} cor="#16A34A" /> 23h58</div>
    </div>
  );
};

const ListaConversas: React.FC<{ conversas: Conversa[]; aberta: number; aba: string }> = ({ conversas, aberta, aba }) => (
  <div style={{ width: LARGURA_LISTA, height: "100%", background: "#FFFFFF", borderRight: `1px solid ${COR_CRM.borda}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
    <div style={{ display: "flex", alignItems: "center", height: 74, padding: "0 16px", gap: 10, color: "#475467" }}>
      <span style={{ flex: 1, fontSize: 16, color: COR_CRM.texto, textAlign: "center", lineHeight: 1.45 }}>Todos os canais</span>
      <Icone nome="seta" tam={13} />
      <Icone nome="mais" tam={15} />
      <Icone nome="robo" tam={15} />
      <Icone nome="filtro" tam={14} />
      <Icone nome="pessoaMais" tam={15} />
      <Icone nome="atualizar" tam={14} />
    </div>
    <div style={{ display: "flex", gap: 6, padding: "0 16px 13px" }}>
      <div style={{ flex: 1, height: 38, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, display: "flex", alignItems: "center", gap: 7, padding: "0 12px", fontSize: 15, color: COR_CRM.suave, background: "#FAFBFB", overflow: "hidden", whiteSpace: "nowrap" }}>
        <Icone nome="busca" tam={14} /> Buscar por nome, telefon
      </div>
      <div style={{ width: 34, height: 38, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#475467" }}>
        <Icone nome="linhas" tam={14} />
      </div>
    </div>
    <Abas ativa={aba} pendentes={8} minhas={2} todas={8} />
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, padding: "7px 13px" }}>
      {[
        ["ordenar", "Ordenar"],
        ["atividade", "Atividades"],
      ].map(([i, t]) => (
        <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: COR_CRM.suave, border: `1px solid ${COR_CRM.borda}`, borderRadius: 999, padding: "2px 10px" }}>
          <Icone nome={i} tam={12} /> {t}
        </span>
      ))}
    </div>
    <div style={{ flex: 1, overflow: "hidden", borderTop: `1px solid ${COR_CRM.borda}` }}>
      {conversas.map((c, i) => (
        <ItemConversa key={c.nome} c={c} aberta={i === aberta} />
      ))}
    </div>
    <div style={{ fontSize: 11, color: COR_CRM.suave, padding: "9px 17px", borderTop: `1px solid ${COR_CRM.borda}` }}>{conversas.length} exibidas</div>
  </div>
);

const Botao: React.FC<{ icone: string; children?: React.ReactNode; seta?: boolean }> = ({ icone, children, seta }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4, height: 37, padding: "0 10px", fontSize: 16, color: "#344054", border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, background: "#FFFFFF" }}>
    <Icone nome={icone} tam={14} />
    {children}
    {seta ? <Icone nome="seta" tam={11} /> : null}
  </div>
);

const Audio: React.FC<{ duracao: string; progresso: number; claro?: boolean }> = ({ duracao, progresso, claro }) => {
  const cor = claro ? "#475467" : "#FFFFFF";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{ width: 32, height: 32, borderRadius: 16, background: claro ? "#E4E7EC" : "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill={cor}>
          <path d="M6 3l15 9-15 9z" />
        </svg>
      </div>
      <div>
        <div style={{ width: 170, height: 6, borderRadius: 3, background: claro ? "#D0D5DD" : "rgba(255,255,255,0.3)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progresso * 100}%`, background: claro ? "#10B981" : "#FFFFFF" }} />
        </div>
        <div style={{ fontSize: 10.5, color: claro ? COR_CRM.suave : "rgba(255,255,255,0.75)", marginTop: 4 }}>{duracao}</div>
      </div>
      <div style={{ width: 27, height: 27, borderRadius: 4, background: claro ? "#EAECEF" : "rgba(255,255,255,0.15)", fontSize: 12, color: cor, display: "flex", alignItems: "center", justifyContent: "center" }}>1×</div>
    </div>
  );
};

// o balão entra no frame `de`, subindo de leve
const Entrada: React.FC<{ de?: number; children: React.ReactNode }> = ({ de = -99, children }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [de, de + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>{children}</div>;
};

const Balao: React.FC<{ m: Mensagem }> = ({ m }) => {
  if (m.tipo === "sistema") {
    return (
      <div style={{ textAlign: "center", margin: "9px 0" }}>
        <span style={{ fontSize: 12, color: "#475467", background: "#F0F2F3", borderRadius: 999, padding: "3px 15px" }}>{m.texto}</span>
      </div>
    );
  }
  if (m.tipo === "nota") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "11px 0" }}>
        <div style={{ maxWidth: 775, background: "#FEF3C7", border: "1px solid #FCD34D", color: "#78350F", borderRadius: 8, padding: "9px 16px 8px" }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{m.autor} · nota privada</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.4 }}>{m.texto}</div>
          <div style={{ fontSize: 10.5, textAlign: "right", marginTop: 4 }}>{m.hora}</div>
        </div>
      </div>
    );
  }
  if (m.tipo === "enviada") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "11px 0" }}>
        <div style={{ maxWidth: 775, background: AZUL_ENVIADA, color: "#FFFFFF", borderRadius: 8, padding: "9px 16px 8px" }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.72)", marginBottom: 3 }}>{m.autor}</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.4, whiteSpace: "pre-line" }}>{m.texto}</div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.72)", textAlign: "right", marginTop: 4 }}>{m.hora} ✓✓</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", margin: "11px 0" }}>
      <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "9px 16px 8px", boxShadow: "0 1px 2px rgba(16,24,40,0.1)" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#475467", marginBottom: 3 }}>{m.autor}</div>
        {m.tipo === "cliente" ? <div style={{ fontSize: 14.5 }}>{m.texto}</div> : <Audio duracao={m.duracao} progresso={m.progresso ?? 0} claro />}
        <div style={{ fontSize: 10.5, color: COR_CRM.suave, textAlign: "right", marginTop: 4 }}>{m.hora}</div>
      </div>
    </div>
  );
};

export type Compositor = { nota?: boolean; texto?: string; frases?: boolean; acesoFrases?: boolean };

const FRASES = [
  ["/horario", "Atendemos de segunda a sexta, das 8h às 18h, e sábado até as 13h."],
  ["/entrega", "Entregamos em toda a Região Metropolitana em até 2 dias úteis."],
  ["/pagamento", "Parcelamos em até 10x sem juros no cartão."],
  ["/orcamento", "Vou montar o seu orçamento agora e já te envio aqui."],
];

const PainelFrases: React.FC = () => (
  <div style={{ background: "#FFFFFF", borderTop: `1px solid ${COR_CRM.borda}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", fontSize: 12, fontWeight: 600, letterSpacing: 0.4, color: "#475467", borderBottom: `1px solid ${COR_CRM.borda}` }}>
      <Icone nome="automacao" tam={13} /> RESPOSTAS RÁPIDAS · WHATSAPP
    </div>
    {FRASES.map(([a, f], i) => (
      <div key={a} style={{ display: "flex", gap: 14, padding: "9px 16px", fontSize: 14, background: i === 0 ? "#F2F3F4" : "#FFFFFF" }}>
        <span style={{ fontWeight: 600, width: 96, flexShrink: 0 }}>{a}</span>
        <span style={{ color: COR_CRM.suave }}>{f}</span>
      </div>
    ))}
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", fontSize: 14, color: COR_CRM.suave, borderTop: `1px solid ${COR_CRM.borda}` }}>
      <Icone nome="config" tam={13} /> Gerenciar respostas
    </div>
  </div>
);

const CampoTexto: React.FC<{ c?: Compositor }> = ({ c = {} }) => (
  <div style={{ background: c.nota ? "#FFFBEB" : "#FFFFFF", borderTop: `1px solid ${c.nota ? "#FDE68A" : COR_CRM.borda}`, padding: c.nota ? "7px 16px 13px" : "15px 16px", color: "#475467" }}>
    {c.nota ? (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "#B45309", marginBottom: 6 }}>
        <Icone nome="cadeado" tam={13} cor="#B45309" /> Nota privada — visível apenas para agentes
      </div>
    ) : null}
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      {["anexo", "camera", "automacao", "brilho", "rosto"].map((i) => (
        <div key={i} style={{ width: 37, height: 37, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", background: i === "automacao" && c.acesoFrases ? "#E4E7EC" : "#FFFFFF" }}>
          <Icone nome={i} tam={15} />
        </div>
      ))}
      <div style={{ flex: 1, height: 44, border: `1px solid ${c.nota ? "#FCD34D" : c.frases ? COR_CRM.texto : COR_CRM.borda}`, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 14px", fontSize: 15, color: c.texto ? COR_CRM.texto : COR_CRM.apagado, background: "#FFFFFF" }}>{c.texto ?? (c.nota ? "Nota privada..." : "Mensagem...")}</div>
      <Icone nome="cadeado" tam={17} cor={c.nota ? "#D97706" : "currentColor"} />
    <div style={{ width: 37, height: 37, borderRadius: 8, background: "#101828", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icone nome="enviar" tam={15} cor="#FFFFFF" />
    </div>
    </div>
  </div>
);

export const TelaChat: React.FC<{
  conversas: Conversa[];
  aberta?: number;
  aba?: string;
  telefone: string;
  atribuido?: string;
  tags?: number;
  mensagens: Mensagem[];
  rolagem?: number;
  topo?: boolean;
  compositor?: Compositor;
  sobre?: React.ReactNode;
}> = ({ conversas, aberta = 0, aba = "Pendentes", telefone, atribuido, tags = 1, mensagens, rolagem = 0, topo, compositor, sobre }) => {
  const c = conversas[aberta];
  return (
    <TelaCrm ativo="chat" semMargem sobre={sobre}>
      <div style={{ display: "flex", height: "100%" }}>
        <ListaConversas conversas={conversas} aberta={aberta} aba={aba} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ height: 69, background: "#FFFFFF", borderBottom: `1px solid ${COR_CRM.borda}`, display: "flex", alignItems: "center", padding: "0 16px 0 20px", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: "#EAECEF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "#344054" }}>{c.iniciais}</div>
            <div style={{ flex: 1, marginLeft: 3 }}>
              <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25 }}>{c.nome}</div>
              <div style={{ fontSize: 13, color: COR_CRM.suave }}>{telefone}</div>
            </div>
            <Icone nome="estrela" tam={17} cor="#475467" />
            <Botao icone="resolver">Resolver</Botao>
            <Botao icone="pessoa" seta>
              {atribuido ?? "Atribuir"}
            </Botao>
            <Botao icone="automacao">Macros</Botao>
            <Botao icone="etiqueta">
              Tags <span style={{ fontSize: 11, background: COR_CRM.cinza, borderRadius: 8, padding: "0 5px", marginLeft: 2 }}>{tags}</span>
            </Botao>
          </div>
          <div style={{ flex: 1, background: FUNDO_CONVERSA, padding: "0 22px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: topo ? "flex-start" : "flex-end", paddingTop: topo ? 12 : 0 }}>
            <div style={{ transform: `translateY(${rolagem}px)` }}>
              {mensagens.map((m, i) => (
                <Entrada key={i} de={m.de}>
                  <Balao m={m} />
                </Entrada>
              ))}
            </div>
          </div>
          {compositor?.frases ? <PainelFrases /> : null}
          <CampoTexto c={compositor} />
        </div>
      </div>
    </TelaCrm>
  );
};

// painel Informações do Contato, aberto pelo nome no cabeçalho da conversa
export const PainelContato: React.FC<{ rolagem?: number; carteirizado?: boolean; acesoLembrete?: boolean }> = ({ rolagem = 0, carteirizado, acesoLembrete }) => {
  const Dado: React.FC<{ r: string; v: string }> = ({ r, v }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11.5, letterSpacing: 0.3, color: COR_CRM.suave, marginBottom: 3 }}>{r}</div>
      <div style={{ height: 36, background: "#F4F6F6", border: `1px solid ${COR_CRM.borda}`, borderRadius: 6, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 14.5 }}>{v}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 20 }}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 320, background: "#FFFFFF", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: `1px solid ${COR_CRM.borda}`, fontSize: 15, fontWeight: 600, flexShrink: 0, background: "#FFFFFF", zIndex: 2 }}>
          Informações do Contato <Icone nome="xis" tam={15} cor={COR_CRM.suave} />
        </div>
        <div style={{ padding: "0 18px", transform: `translateY(${-rolagem}px)` }}>
          <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
            <div style={{ width: 62, height: 62, borderRadius: 31, background: "#EAECEF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, fontWeight: 600, margin: "0 auto 7px" }}>MO</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Marcos Oliveira</div>
            <div style={{ fontSize: 13, color: COR_CRM.suave }}>+5581900001234</div>
          </div>
          <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 8, padding: "11px 13px 2px", marginBottom: 14 }}>
            <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 10 }}>Dados do cliente</div>
            <Dado r="NOME" v="Marcos Oliveira" />
            <Dado r="TELEFONE" v="+5581900001234" />
            <Dado r="E-MAIL" v="marcos@email.com" />
            <Dado r="EMPRESA" v="" />
            <div style={{ display: "flex", gap: 9 }}><div style={{ flex: 1 }}><Dado r="TIPO" v="Cliente" /></div><div style={{ flex: 1 }}><Dado r="NASCIMENTO" v="dd/mm/aaaa" /></div></div>
            <div style={{ height: 36, border: `1px solid ${COR_CRM.borda}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", fontSize: 14, marginBottom: 12 }}>Endereço <Icone nome="seta" tam={12} /></div>
          </div>
          <div style={{ height: 44, borderRadius: 8, border: `1px solid ${acesoLembrete ? COR_CRM.texto : COR_CRM.borda}`, background: "#F2F3F4", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, marginBottom: 12 }}>
            <Icone nome="calendario" tam={16} /> Agendar lembrete
          </div>
          <div style={{ height: 44, borderRadius: 8, border: `1px solid ${COR_CRM.borda}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, marginBottom: 12, color: "#475467" }}>Exportar conversa</div>
          <div style={{ height: 44, borderRadius: 8, background: carteirizado ? "#FFEDD5" : "#EA580C", color: carteirizado ? "#C2410C" : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, marginBottom: 12 }}>
            <Icone nome="pessoa" tam={15} /> {carteirizado ? "Remover carteira" : "Carteirizar este lead"}
          </div>
        </div>
        {carteirizado ? (
          <div style={{ position: "absolute", left: 10, right: 10, bottom: 14, display: "flex", alignItems: "center", gap: 9, padding: "11px 13px", borderRadius: 10, background: "#ECFDF5", border: "1px solid #A7F3D0", fontSize: 14, fontWeight: 500, color: "#065F46" }}>
            <Icone nome="resolver" tam={16} /> Lead carteirizado para você.
          </div>
        ) : null}
      </div>
    </div>
  );
};

// botão Macros: funis da empresa e Ativar/Desativar IA
export const MenuMacros: React.FC = () => (
  <div style={{ position: "absolute", right: 122, top: 58, width: 272, background: "#FFFFFF", borderRadius: 9, border: `1px solid ${COR_CRM.borda}`, boxShadow: "0 12px 30px rgba(16,24,40,0.16)", padding: "6px 0", zIndex: 15 }}>
    {["Finalizar como comprador", "Finalizar como perdido", "whatsapp-loja-modelo", "Orçamentos", "Reformas", "Ativar IA", "Desativar IA", "instagram-loja-modelo"].map((m) => (
      <div key={m} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 14px", fontSize: 15, background: m === "whatsapp-loja-modelo" ? "#ECFDF5" : "transparent", color: m === "whatsapp-loja-modelo" ? "#047857" : COR_CRM.texto }}>
        <Icone nome="automacao" tam={13} />
        <span style={{ flex: 1 }}>{m}</span>
        {m === "whatsapp-loja-modelo" ? <span style={{ fontSize: 10.5, fontWeight: 600 }}>ATUAL</span> : null}
      </div>
    ))}
  </div>
);

export const ETAPAS: readonly (readonly [string, string])[] = [
  ["Novo Lead", "#22C55E"],
  ["Em andamento", "#3B82F6"],
  ["Proposta enviada", "#F59E0B"],
  ["Follow-up", "#EF4444"],
  ["Finalizado", "#8B5CF6"],
];

export const ModalEtapas: React.FC<{ acesa?: string }> = ({ acesa }) => (
  <div style={{ position: "absolute", inset: 0, background: "rgba(90,96,108,0.5)", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 460, background: "#FFFFFF", borderRadius: 14 }}>
      <div style={{ padding: "20px 24px 14px", borderBottom: `1px solid ${COR_CRM.borda}` }}>
        <div style={{ fontSize: 19, fontWeight: 700 }}>Mover para "whatsapp-loja-modelo"</div>
        <div style={{ fontSize: 14, color: COR_CRM.suave }}>Escolha a etapa do funil para inserir o lead.</div>
      </div>
      <div style={{ padding: "18px 24px 22px" }}>
        {ETAPAS.map(([e, cor]) => (
          <div key={e} style={{ display: "flex", alignItems: "center", gap: 10, height: 46, padding: "0 14px", border: `1px solid ${e === acesa ? COR_CRM.texto : COR_CRM.borda}`, background: e === acesa ? "#F2F3F4" : "#FFFFFF", borderRadius: 8, marginBottom: 7, fontSize: 15.5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: cor }} />
            <span style={{ flex: 1 }}>{e}</span>
            <span style={{ transform: "rotate(-90deg)", display: "flex" }}>
              <Icone nome="seta" tam={13} />
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CONVERSAS_NOITE: Conversa[] = [
  { iniciais: "MO", nome: "Marcos Oliveira", canal: "whatsapp", previa: "[áudio]", tag: "bot_atendendo", tempo: "1m" },
  { iniciais: "PS", nome: "Patrícia Souza", canal: "instagram", previa: "Vocês entregam em Olinda?", tag: "bot_atendendo", tempo: "22m" },
  { iniciais: "JA", nome: "João Almeida", canal: "whatsapp", previa: "Obrigado, até amanhã", retorno: true, tag: "bot_atendendo", tempo: "1h" },
  { iniciais: "CR", nome: "Carla Ribeiro", canal: "whatsapp", previa: "Quero falar com o vendedor", tag: "aguardando_humano", tempo: "2h" },
];

export const MENSAGENS_NOITE: Mensagem[] = [
  { tipo: "clienteAudio", autor: "Marcos Oliveira", duracao: "0:06", hora: "02/07, 23:07", progresso: 1 },
  {
    tipo: "enviada",
    autor: "Bot_lojamodelo",
    texto: "Oi, Marcos! Para banheiro, eu recomendo os porcelanatos acetinados, que são mais seguros em área molhada. Temos estas opções:\n\n• Porcelanato Acetinado Areia 60x60: R$ 89,90 o m²\n• Porcelanato Acetinado Cinza 60x60: R$ 79,90 o m²\n\nQuantos metros quadrados tem o seu banheiro?",
    hora: "02/07, 23:07",
  },
];

// conversa do capítulo 2: o Marcos manda um áudio às 23h e o agente responde com o catálogo
export const TelaChatNoite: React.FC = () => <TelaChat conversas={CONVERSAS_NOITE} telefone="+5581900001234" mensagens={MENSAGENS_NOITE} tags={1} />;
