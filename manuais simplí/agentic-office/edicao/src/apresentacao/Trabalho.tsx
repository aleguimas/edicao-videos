import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COR, rota } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { CINZA, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Surge } from "../verbas/Montagem";
import { CENTRO } from "./Agentes";
import { Avatar, Botao, Cartao, CenaJanela, Chip, DIRETORIA, EXECUTORES, MENU_INICIO, OUTROS, rampa, Titulo } from "./comum";

type P = { readonly c: Cena };
const ag = (nome: string) => [...EXECUTORES, ...DIRETORIA, ...Object.values(OUTROS)].find((a) => a.nome === nome)!;

// chip com foto e nome do agente, como nos cartões do sistema
// `claro`: dentro dos cartões brancos do quadro de tarefas
const Pessoa: React.FC<{ readonly nome: string; readonly aceso?: boolean; readonly claro?: boolean }> = ({ nome, aceso, claro }) => {
  const a = ag(nome);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 12px 4px 4px",
        borderRadius: 99,
        border: `${aceso ? 2 : 1}px solid ${aceso ? VERDE : claro ? "#D5D9D6" : COR.borda}`,
        boxShadow: aceso ? "0 0 16px rgba(60,224,30,0.6)" : "none",
        background: claro ? "white" : "#0E110F",
        color: claro ? "#111" : COR.texto,
        fontSize: 17,
        fontWeight: 600,
      }}
    >
      <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={30} />
      {a.nome}
    </div>
  );
};

// ---------- trabalho-1: Gestão de tarefas (quadro por situação)
type Tarefa = { titulo: string; nome: string; selo?: [string, string]; resultado?: boolean; aprovacao?: boolean };
const COLUNAS: [string, string, Tarefa[]][] = [
  ["Pendentes", "#F5B82E", [{ titulo: "Mapa de orçamentos em aberto por loja", nome: "César", selo: ["DELEGADA POR HELENA", "#0B0B0C"] }]],
  ["Bloqueadas", "#FF8A3D", []],
  [
    "Em execução",
    "#3CE01E",
    [
      { titulo: "Campanha do Dia do Cliente", nome: "Vicente" },
      { titulo: "Arte do encarte de novembro", nome: "Íris" },
    ],
  ],
  ["Em análise", "#4C8DFF", [{ titulo: "Análise do fornecedor Cerâmica Aurora", nome: "César", aprovacao: true, selo: ["OTÁVIO REVISOU", "#3A1212"] }]],
  [
    "Concluídas",
    "#3CE01E",
    [
      { titulo: "Observação diária · Diretoria", nome: "Helena", resultado: true },
      { titulo: "Preços de porcelanato na concorrência", nome: "Rafael", resultado: true },
    ],
  ],
  ["Canceladas", "#FF6B6B", []],
];
export const Trabalho1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const situacao = frame >= m("situação") - 4 && frame < m("responsável") - 4;
  const responsavel = frame >= m("responsável") - 4 && frame < m("entrega") - 4;
  const entrega = frame >= m("entrega") - 4;
  return (
    <CenaJanela ativo="Gestão de tarefas" menu={MENU_INICIO} quadros={rota(CENTRO, [[m("visível"), 1.12, 980, 520]], c.dur)}>
      <Titulo icone="tarefas" titulo="GESTÃO DE TAREFAS" descricao="O pipeline de trabalho dos seus agentes: o que está por fazer, em execução, aguardando análise e o que já aconteceu." />
      <div style={{ position: "absolute", left: 40, top: 150, display: "flex", gap: 12 }}>
        <Botao>Timeline</Botao>
        <Botao verde>✦ Criar com IA</Botao>
        <Botao cheio icone="mais">
          Nova tarefa
        </Botao>
      </div>
      {COLUNAS.map(([nome, cor, tarefas], i) => {
        const x = 40 + i * 212;
        return (
          <div key={nome} style={{ position: "absolute", left: x, top: 230, width: 200 }}>
            <div style={{ height: 50, boxSizing: "border-box", padding: "0 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 8, background: "white", color: "#111", fontWeight: 700, fontSize: 17, borderBottom: `5px solid ${cor}`, boxShadow: situacao ? `0 0 0 3px ${VERDE}, 0 0 24px rgba(60,224,30,0.5)` : "none" }}>
              <span>{nome}</span>
              <span>{tarefas.length + (nome === "Concluídas" ? 53 : 0)}</span>
            </div>
            {tarefas.length === 0 && <div style={{ textAlign: "center", color: COR.suave, fontSize: 16, marginTop: 20 }}>vazio</div>}
            {tarefas.map((t, k) => {
              const s = rampa(frame, 4 + i * 4 + k * 3, 10);
              return (
                <div key={t.titulo} style={{ marginTop: 12, background: "white", color: "#111", borderRadius: 10, padding: 14, opacity: s, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}>{t.titulo}</div>
                  <Pessoa nome={t.nome} aceso={responsavel} claro />
                  {t.aprovacao && <Chip cor="#1F6B2A" cheio>REQUER APROVAÇÃO</Chip>}
                  {t.selo && <div style={{ fontFamily: fonteMono, fontSize: 13, fontWeight: 700, letterSpacing: 1, color: "white", background: t.selo[1], padding: "4px 8px", borderRadius: 4 }}>{t.selo[0]}</div>}
                  {t.resultado && (
                    <div style={{ background: "#9DF57F", borderRadius: 8, padding: "6px 14px", fontWeight: 700, fontSize: 16, boxShadow: entrega ? `0 0 0 3px ${VERDE}, 0 0 20px rgba(60,224,30,0.6)` : "none" }}>👁 Resultado</div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </CenaJanela>
  );
};

// ---------- trabalho-2: Projetos e Cronograma
const ETAPAS: [string, number, number, string][] = [
  ["Obra e layout da loja", 0, 5, "#4C8DFF"],
  ["Compra do mix inicial", 2, 4, "#F5B82E"],
  ["Contratação da equipe", 3, 4, "#C46BFF"],
  ["Campanha de inauguração", 5, 3, "#FF8A3D"],
  ["Inauguração", 8, 1, "#3CE01E"],
];
const CHECKLIST = ["Aprovar o layout com a diretoria", "Fechar o pedido de porcelanatos", "Treinar a equipe de vendas", "Publicar a campanha"];
export const Trabalho2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const etapas = m("etapas") - 6;
  const check = m("checklist") - 4;
  const planilha = frame >= m("planilha") - 4 && frame < m("avisos") - 4;
  const aviso = m("prazo") - 6;
  const semanas = ["02/11", "09/11", "16/11", "23/11", "30/11", "07/12", "14/12", "21/12", "28/12"];
  return (
    <CenaJanela ativo="Cronograma" menu={MENU_INICIO} quadros={rota(CENTRO, [], c.dur)}>
      <Titulo icone="cronograma" titulo="CRONOGRAMA" descricao="Projeto: Inauguração da loja Centro · etapas, responsáveis e prazos." direita={<Botao style={planilha ? { border: `2px solid ${VERDE}`, color: VERDE, boxShadow: "0 0 24px rgba(60,224,30,0.4)" } : {}}>⇪ Importar planilha</Botao>} />
      <Cartao x={40} y={160} w={860} h={520}>
        <div style={{ display: "flex", marginLeft: 250 }}>
          {semanas.map((s) => (
            <div key={s} style={{ width: 62, fontSize: 14, color: COR.suave }}>
              {s}
            </div>
          ))}
        </div>
        {ETAPAS.map(([nome, ini, dur, cor], i) => {
          const k = rampa(frame, etapas + i * 5, 14);
          return (
            <div key={nome} style={{ position: "relative", height: 84, display: "flex", alignItems: "center", borderBottom: `1px solid ${COR.borda}` }}>
              <div style={{ width: 250, fontSize: 18, fontWeight: 600 }}>{nome}</div>
              <div style={{ position: "absolute", left: 250 + ini * 62, width: dur * 62 * k, height: 30, borderRadius: 6, background: cor }} />
            </div>
          );
        })}
      </Cartao>
      <Cartao x={920} y={160} w={380} h={520}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Checklist</div>
        {CHECKLIST.map((t, i) => {
          const k = i < 2 ? rampa(frame, check + i * 8, 6) : 0;
          return (
            <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 22, fontSize: 18 }}>
              <div style={{ width: 26, height: 26, flexShrink: 0, borderRadius: 6, border: `2px solid ${k > 0.5 ? VERDE : COR.borda}`, background: k > 0.5 ? VERDE : "transparent", color: "#0B0B0C", display: "grid", placeItems: "center", fontWeight: 800 }}>{k > 0.5 ? "✓" : ""}</div>
              <span style={{ color: k > 0.5 ? COR.suave : COR.texto, textDecoration: k > 0.5 ? "line-through" : "none" }}>{t}</span>
            </div>
          );
        })}
      </Cartao>
      {frame >= aviso && (
        <div style={{ position: "absolute", left: 40, top: 700, width: 860, boxSizing: "border-box", padding: "16px 20px", borderRadius: 10, background: "rgba(245,184,46,0.12)", border: "2px solid #F5B82E", fontSize: 20, color: "#F5B82E", opacity: rampa(frame, aviso, 8) }}>
          ⚠ Prazo: “Compra do mix inicial” vence em 2 dias · responsável: Paula Moreira
        </div>
      )}
    </CenaJanela>
  );
};

// ---------- trabalho-3: Rotinas e um fluxo que encadeia agentes
const ROTINAS: [string, string, string][] = [
  ["Relatório semanal de vendas", "Toda segunda-feira às 08:00", "César"],
  ["Observação diária da diretoria", "Todo dia às 08:00", "Helena"],
  ["Preços da concorrência", "Toda quarta-feira às 07:00", "Rafael"],
];
const FLUXO = ["Rafael", "César", "Vicente", "Helena"];
export const Trabalho3: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const relatorio = m("relatório");
  const fluxo = m("fluxo") - 6;
  return (
    <CenaJanela ativo="Rotinas" menu={MENU_INICIO} quadros={rota(CENTRO, [[fluxo, 1.1, 960, 520]], c.dur)}>
      <Titulo
        icone="rotinas"
        titulo="ROTINAS"
        descricao="Agendamentos recorrentes que acionam os seus agentes sozinhos; as entregas chegam na Gestão de tarefas."
        direita={
          <Botao cheio icone="mais">
            Criar rotina
          </Botao>
        }
      />
      {ROTINAS.map(([nome, quando, quem], i) => (
        <Cartao key={nome} x={40} y={160 + i * 100} w={1260} h={88} aceso={i === 0 && frame >= relatorio - 4 && frame < fluxo} style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 23, fontWeight: 700 }}>{nome}</div>
            <div style={{ fontSize: 18, color: COR.suave, marginTop: 4 }}>⏱ {quando}</div>
          </div>
          <Pessoa nome={quem} />
          <Chip cheio>ATIVA</Chip>
        </Cartao>
      ))}
      <Cartao x={40} y={470} w={1260} h={300} aceso={frame >= fluxo} style={{ opacity: rampa(frame, fluxo, 10) }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Fluxo · Preços da concorrência</div>
        <div style={{ fontSize: 17, color: COR.suave, marginTop: 4 }}>Um agente entrega para o próximo, sem ninguém precisar repassar.</div>
        {FLUXO.map((n, i) => {
          const a = ag(n);
          const k = rampa(frame, fluxo + 8 + i * 9, 8);
          return (
            <div key={n}>
              <div style={{ position: "absolute", left: 60 + i * 300, top: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 140, opacity: k }}>
                <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={84} />
                <div style={{ fontSize: 19, fontWeight: 700 }}>{a.nome}</div>
                <div style={{ fontSize: 15, color: COR.suave }}>{["pesquisa", "analisa", "resume", "aprova"][i]}</div>
              </div>
              {i > 0 && <div style={{ position: "absolute", left: 60 + (i - 1) * 300 + 150, top: 160, width: 140 * rampa(frame, fluxo + 4 + i * 9, 8), height: 4, background: VERDE, borderRadius: 2 }} />}
            </div>
          );
        })}
      </Cartao>
    </CenaJanela>
  );
};

// ---------- trabalho-4: Acompanhamento (ações com prazo e responsável); depois, documentos com a marca da empresa
const ACOES: [string, string, string, string, string][] = [
  ["Cobrar a verba de outubro da Cerâmica Aurora", "Paula Moreira", "05/11", "EM ANDAMENTO", "#F5B82E"],
  ["Treinar as lojas na nova política de trocas", "Ricardo Lima", "10/11", "NO PRAZO", VERDE],
  ["Revisar o mix de porcelanatos da loja Norte", "Fernanda Costa", "31/10", "ATRASADA", "#FF6B6B"],
  ["Fechar o plano do Dia do Cliente", "Diretoria comercial", "07/11", "NO PRAZO", VERDE],
  ["Homologar o novo fornecedor de argamassa", "Compras", "28/10", "CONCLUÍDA", "#8FA2FF"],
];
const MARCA = "#2B3A8F";
const Doc: React.FC<{ readonly tipo: string; readonly children: React.ReactNode }> = ({ tipo, children }) => (
  <div>
    <div style={{ width: 420, height: 300, borderRadius: 12, overflow: "hidden", background: "white", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", position: "relative" }}>{children}</div>
    <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: VERDE, marginTop: 16, textAlign: "center" }}>{tipo}</div>
  </div>
);
const LogoLM: React.FC<{ readonly tam?: number }> = ({ tam = 34 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: tam, height: tam, borderRadius: 6, background: MARCA, color: "white", display: "grid", placeItems: "center", fontFamily, fontWeight: 800, fontSize: tam * 0.42 }}>LM</div>
    <span style={{ fontFamily, fontWeight: 800, fontSize: tam * 0.5, color: MARCA }}>Loja Modelo</span>
  </div>
);
export const Trabalho4: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const docs = m("relatórios") - 6;
  const sai = interpolate(frame, [docs, docs + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const prazo = m("prazo") - 4;
  const situacao = m("situação") - 4;
  return (
    <>
      {sai > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: sai }}>
          <CenaJanela ativo="Acompanhamento" menu={MENU_INICIO} quadros={rota(CENTRO, [], c.dur)}>
            <Titulo
              icone="acompanhamento"
              titulo="ACOMPANHAMENTO"
              descricao="Cada ação com o prazo, o responsável e a situação."
              direita={
                <Botao cheio icone="mais">
                  Nova ação
                </Botao>
              }
            />
            <div style={{ position: "absolute", left: 40, top: 170, width: 1260, display: "grid", gridTemplateColumns: "1fr 260px 140px 200px", padding: "0 24px", boxSizing: "border-box", fontSize: 16, color: COR.suave, letterSpacing: 1 }}>
              <span>AÇÃO</span>
              <span style={{ color: frame >= prazo ? VERDE : COR.suave }}>RESPONSÁVEL</span>
              <span style={{ color: frame >= prazo ? VERDE : COR.suave }}>PRAZO</span>
              <span style={{ color: frame >= situacao ? VERDE : COR.suave }}>SITUAÇÃO</span>
            </div>
            {ACOES.map(([t, r, d, st, cor], i) => (
              <Surge key={t} de={4 + i * 4} style={{ left: 40, top: 205 + i * 104 }}>
                <div style={{ width: 1260, height: 90, boxSizing: "border-box", borderRadius: 12, background: COR.cartao, border: `1px solid ${COR.borda}`, display: "grid", gridTemplateColumns: "1fr 260px 140px 200px", alignItems: "center", padding: "0 24px", fontSize: 21 }}>
                  <b>{t}</b>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>{r}</span>
                  <span style={{ fontWeight: 700, color: frame >= prazo ? "white" : COR.suave }}>{d}</span>
                  <span>
                    <Chip cor={frame >= situacao ? cor : COR.suave} cheio={frame >= situacao && st === "ATRASADA"}>
                      {st}
                    </Chip>
                  </span>
                </div>
              </Surge>
            ))}
          </CenaJanela>
        </div>
      )}
      {frame >= docs && (
        <>
          <Surge de={docs + 2} style={{ left: 0, right: 0, top: 120, textAlign: "center" }}>
            <div style={{ ...TITULO, fontSize: 62, color: "white" }}>
              com a <span style={textoDegrade}>identidade visual</span> da sua empresa
            </div>
          </Surge>
          <Surge de={m("relatórios") - 2} style={{ left: 150, top: 330 }}>
            <Doc tipo="RELATÓRIO">
              <div style={{ background: MARCA, height: 120, padding: 24, boxSizing: "border-box" }}>
                <div style={{ fontFamily, fontWeight: 800, fontSize: 28, color: "white" }}>Relatório semanal de vendas</div>
                <div style={{ fontFamily, fontSize: 16, color: "#C9D1FF", marginTop: 6 }}>26/10 a 01/11 · todas as lojas</div>
              </div>
              <div style={{ padding: 24 }}>
                <LogoLM />
                {[0.9, 0.7, 0.8].map((w, i) => (
                  <div key={i} style={{ height: 10, width: `${w * 100}%`, background: "#E3E6F2", borderRadius: 5, marginTop: 14 }} />
                ))}
              </div>
            </Doc>
          </Surge>
          <Surge de={m("apresentações") - 2} style={{ left: 750, top: 330 }}>
            <Doc tipo="APRESENTAÇÃO">
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${MARCA}, #121A4D)`, padding: 30, boxSizing: "border-box" }}>
                <div style={{ fontFamily, fontWeight: 900, fontSize: 34, color: "white", lineHeight: 1.1 }}>Plano do Dia do Cliente</div>
                <div style={{ width: 80, height: 6, background: "#FFC94D", marginTop: 16, borderRadius: 3 }} />
                <div style={{ position: "absolute", left: 30, bottom: 26, background: "white", borderRadius: 8, padding: "6px 10px" }}>
                  <LogoLM tam={28} />
                </div>
              </div>
            </Doc>
          </Surge>
          <Surge de={m("planilhas") - 2} style={{ left: 1350, top: 330 }}>
            <Doc tipo="PLANILHA">
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", fontFamily: "Arial, sans-serif", fontSize: 15 }}>
                {["Loja", "Vendas", "Meta", "Centro", "412 mil", "400 mil", "Norte", "356 mil", "380 mil", "Sul", "298 mil", "300 mil", "Shopping", "511 mil", "480 mil", "On-line", "263 mil", "250 mil"].map((v, i) => (
                  <div key={i} style={{ height: 42, padding: "0 10px", display: "flex", alignItems: "center", borderBottom: "1px solid #E3E6F2", background: i < 3 ? MARCA : "white", color: i < 3 ? "white" : "#222", fontWeight: i < 3 ? 700 : 400 }}>
                    {v}
                  </div>
                ))}
              </div>
            </Doc>
          </Surge>
        </>
      )}
    </>
  );
};

// ---------- trabalho-5: Calls Intelligence com a Cora
const FALAS_CALL: [string, string][] = [
  ["Paula", "A verba da Cerâmica Aurora entra até sexta?"],
  ["Ricardo", "Confirmei com eles ontem, vem em depósito."],
  ["Marina", "Então fechamos a vitrine do Dia do Cliente com porcelanato."],
];
const RESUMO: [string, string[]][] = [
  ["Decisões", ["Vitrine do Dia do Cliente com porcelanato"]],
  ["Próximos passos", ["Confirmar o depósito da Cerâmica Aurora", "Montar a vitrine nas 4 lojas"]],
  ["Responsáveis", ["Ricardo Lima · até sexta", "Marina Costa · até 10/11"]],
];
export const Trabalho5: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const transcreve = m("transcreve") - 6;
  const resumo = m("resumo") - 4;
  const itens = [m("decisões"), m("próximos"), m("responsáveis")];
  const cora = OUTROS.cora;
  return (
    <CenaJanela ativo="Calls" menu={MENU_INICIO} quadros={rota(CENTRO, [[resumo, 1.1, 1080, 500]], c.dur)}>
      <Titulo icone="calls" titulo="CALLS INTELLIGENCE" descricao="A Cora entra na reunião, transcreve a conversa e entrega o resumo com decisões e responsáveis." />
      <Cartao x={40} y={170} w={600} h={660}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", opacity: Math.floor(frame / 15) % 2 ? 1 : 0.3 }} />
          <div style={{ fontSize: 22, fontWeight: 700 }}>Reunião comercial semanal</div>
        </div>
        <div style={{ fontSize: 17, color: COR.suave, marginTop: 6 }}>Google Meet · 42 min · 5 participantes</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          <Avatar nome={cora.nome} cor={cora.cor} foto={cora.foto} tam={44} />
          <span style={{ fontSize: 18, color: COR.texto }}>A Cora entrou na chamada</span>
        </div>
        <div style={{ fontFamily: fonteMono, fontSize: 15, letterSpacing: 2, color: VERDE, marginTop: 24 }}>TRANSCRIÇÃO</div>
        {FALAS_CALL.map(([q, t], i) => {
          const k = rampa(frame, transcreve + i * 10, 8);
          return (
            <div key={t} style={{ marginTop: 16, opacity: k, fontSize: 19, lineHeight: 1.4 }}>
              <b style={{ color: ["#4C8DFF", "#FF8A3D", "#C46BFF"][i] }}>{q}:</b> {t}
            </div>
          );
        })}
      </Cartao>
      <Cartao x={670} y={170} w={630} h={660} aceso={frame >= resumo} style={{ opacity: rampa(frame, resumo, 10) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar nome={cora.nome} cor={cora.cor} foto={cora.foto} tam={50} />
          <div style={{ fontSize: 24, fontWeight: 700 }}>Resumo da Cora</div>
        </div>
        {RESUMO.map(([t, linhas], i) => (
          <div key={t} style={{ marginTop: 26, opacity: rampa(frame, itens[i] - 4, 8) }}>
            <div style={{ fontFamily: fonteMono, fontSize: 16, letterSpacing: 2, color: VERDE, fontWeight: 700 }}>{t.toUpperCase()}</div>
            {linhas.map((l) => (
              <div key={l} style={{ fontSize: 20, marginTop: 8, color: CINZA }}>
                • {l}
              </div>
            ))}
          </div>
        ))}
      </Cartao>
    </CenaJanela>
  );
};
