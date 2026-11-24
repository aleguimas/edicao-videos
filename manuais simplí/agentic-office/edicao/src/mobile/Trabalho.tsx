import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Icone } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { Avatar, DIRETORIA, EXECUTORES, OUTROS, rampa } from "../apresentacao/comum";
import { BotaoM, CartaoM, ChipM, DescricaoM, M, PessoaM, RotuloM, rolagem, SeletorM, TelaM, TituloM } from "./Kit";

type P = { readonly c: Cena };
const marcas = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
export const ag = (nome: string) => [...EXECUTORES, ...DIRETORIA, ...Object.values(OUTROS)].find((a) => a.nome === nome)!;
const Pessoa: React.FC<{ readonly nome: string; readonly aceso?: boolean }> = ({ nome, aceso }) => {
  const a = ag(nome);
  return <PessoaM nome={a.nome} cor={a.cor} foto={a.foto} aceso={aceso} />;
};

// ---------- Gestão de tarefas: no celular as colunas passam de lado, uma de cada vez
type Tarefa = { titulo: string; desc: string; nome: string; selos?: [string, string, string][]; botao: "Executar" | "Resultado"; aprovar?: boolean; revisao?: string; por: string; quando: string };
const COLUNAS: [string, string, string, Tarefa[]][] = [
  ["Pendentes", M.amarelo, "⏳", [{ titulo: "Mapa de orçamentos em aberto por loja", desc: "Relatório com os orçamentos abertos, por loja e vendedor...", nome: "César", selos: [["DELEGADA POR HELENA", "#0B0B0C", "white"]], botao: "Executar", por: "Paula Moreira", quando: "04/11/2026, 08:01" }]],
  ["Em Execução", "#22C55E", "⚡", [{ titulo: "Campanha do Dia do Cliente", desc: "Textos de e-mail e redes para a campanha de novembro...", nome: "Vicente", botao: "Executar", por: "Marina Costa", quando: "04/11/2026, 09:12" }]],
  ["Em Análise", M.azul, "🔎", [{ titulo: "Análise do fornecedor Cerâmica Aurora", desc: "Comparativo de prazo, preço e histórico de entrega...", nome: "César", selos: [["requer aprovação", M.verde, M.fundo], ["OTÁVIO REVISOU", "#0B0B0C", "white"]], botao: "Resultado", aprovar: true, revisao: "Otávio: conferi os números e as fontes. A análise está pronta para a sua decisão.", por: "Ricardo Lima", quando: "04/11/2026, 08:40" }]],
  ["Concluídas", "#22C55E", "✅", [{ titulo: "Observação diária · Diretoria", desc: "Resumo do dia de cada área, assinado pela diretoria...", nome: "Helena", botao: "Resultado", por: "Paula Moreira", quando: "05/11/2026, 08:00" }]],
];
const LARG_COL = 338;
const PASSO_COL = LARG_COL + 8;
const CartaoTarefa: React.FC<{ readonly t: Tarefa; readonly dono: boolean; readonly entrega: boolean }> = ({ t, dono, entrega }) => (
  <div style={{ marginTop: 8, background: "white", color: "#111", borderRadius: 8, padding: 12 }}>
    <div style={{ display: "flex", gap: 8 }}>
      <div style={{ flex: 1, fontSize: 13.5, fontWeight: 700, lineHeight: 1.25 }}>{t.titulo}</div>
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={2} strokeLinecap="round">
        <path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15" />
      </svg>
    </div>
    <div style={{ fontSize: 11.5, color: "#555", lineHeight: 1.35, marginTop: 7 }}>{t.desc}</div>
    <div style={{ marginTop: 9 }}>
      <Pessoa nome={t.nome} aceso={dono} />
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
      {t.selos?.map(([s, bg, cor]) => (
        <span key={s} style={{ fontSize: 10, letterSpacing: "0.03em", padding: "3px 7px", borderRadius: 2, background: bg, color: cor }}>
          {s}
        </span>
      ))}
    </div>
    {t.revisao && <div style={{ fontSize: 11.5, lineHeight: 1.35, marginTop: 8, color: "#333" }}>{t.revisao}</div>}
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 9, fontSize: 13 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 30, padding: "0 12px", borderRadius: 4, background: M.verde, boxShadow: entrega ? "0 0 0 2px #16A34A, 0 0 12px rgba(22,163,74,0.6)" : "none" }}>{t.botao === "Executar" ? "▷" : "👁"} {t.botao}</span>
      {t.aprovar ? <span>✓ Aprovar</span> : null}
      <span>⚯ Vincular</span>
    </div>
    <div style={{ textAlign: "right", fontSize: 10, color: "#666", marginTop: 8, lineHeight: 1.4 }}>
      Criado por: {t.por}
      <br />
      Criada em {t.quando}
    </div>
  </div>
);
export const TarefasM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const trocas = [m("visível"), m("situação"), m("responsável")];
  const x = interpolate(frame, [...trocas.flatMap((f) => [f - 2, f + 12]), c.dur], [0, 1, 1, 2, 2, 3, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <TelaM rola={rolagem(c, 0, [[m("visível"), 120]])}>
      <TituloM>Gestão de tarefas</TituloM>
      <DescricaoM>O pipeline de trabalho dos seus agentes: o que está por fazer, em execução, aguardando análise e o que já aconteceu.</DescricaoM>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <BotaoM icone="templates" tam={13}>Timeline</BotaoM>
        <BotaoM tipo="verde" tam={13}>✦ Criar com IA</BotaoM>
        <BotaoM tipo="branco" tam={13}>+ Nova tarefa</BotaoM>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, fontSize: 11, letterSpacing: "0.2em", color: M.suave }}>
        SETOR
        <SeletorM style={{ width: 150, color: "white", letterSpacing: 0, fontSize: 12, height: 30 }}>Todos os setores</SeletorM>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, transform: `translateX(${-x * PASSO_COL}px)` }}>
        {COLUNAS.map(([nome, cor, ic, ts]) => (
          <div key={nome} style={{ width: LARG_COL, flexShrink: 0 }}>
            <div style={{ height: 44, boxSizing: "border-box", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", color: "#111", fontWeight: 600, fontSize: 13.5, borderRadius: "4px 4px 0 0", borderBottom: `3px solid ${cor}` }}>
              <span>
                {ic} {nome}
              </span>
              <span>{ts.length + (nome === "Concluídas" ? 53 : 0)}</span>
            </div>
            {ts.map((t) => (
              <CartaoTarefa key={t.titulo} t={t} dono={frame >= m("responsável") - 4 && frame < m("entrega") - 4} entrega={frame >= m("entrega") - 4} />
            ))}
          </div>
        ))}
      </div>
    </TelaM>
  );
};

// ---------- Rotinas: os cartões do sistema e, abaixo, o fluxo que encadeia agentes
const ROTINAS: [string, string, string, string, string, number][] = [
  ["Relatório semanal de vendas", "Vendas da semana por loja, comparadas com a meta, em PDF para a diretoria.", "Semanal (segunda) às 08h · conclui direto", "César", "Próxima: 09/11, 08:00 · Última: 02/11, 08:01 (ok)", 44],
  ["Observação diária da diretoria", "Um documento só, pela diretoria inteira, com o que aconteceu em cada área.", "Diária às 08h · aguarda aprovação", "Helena", "Próxima: 06/11, 08:00 · Última: 05/11, 08:00 (ok)", 212],
];
const FLUXO: [string, string][] = [
  ["Rafael", "pesquisa"],
  ["César", "analisa"],
  ["Vicente", "resume"],
  ["Helena", "aprova"],
];
export const RotinasM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const fluxo = m("fluxo") - 6;
  const aceso = frame >= m("relatório") - 4 && frame < fluxo;
  return (
    <TelaM rola={rolagem(c, 0, [[m("relatório"), 118], [fluxo, 640]])}>
      <TituloM>Rotinas</TituloM>
      <DescricaoM>Agendamentos recorrentes que ativam seus agentes automaticamente — as entregas chegam na Gestão de tarefas e em Resultados.</DescricaoM>
      <BotaoM tipo="branco" style={{ marginTop: 12 }}>+ Criar rotina</BotaoM>
      {ROTINAS.map(([t, d, q, a, p, n], i) => (
        <CartaoM key={t} aceso={i === 0 && aceso} style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{t}</div>
            <ChipM cheio style={{ alignSelf: "flex-start" }}>Pronta</ChipM>
          </div>
          <div style={{ fontSize: 12.5, color: M.suave, marginTop: 8, lineHeight: 1.4 }}>{d}</div>
          <div style={{ fontSize: 12.5, marginTop: 14, display: "flex", gap: 7, alignItems: "center" }}>
            <Icone nome="cronograma" tam={13} cor={M.suave} /> {q}
          </div>
          <div style={{ fontSize: 12, color: M.suave, marginTop: 6 }}>◍ {a}</div>
          <div style={{ fontSize: 12, color: M.suave, marginTop: 6 }}>↻ Executada {n} vezes</div>
          <div style={{ fontSize: 11.5, color: M.suave, marginTop: 6 }}>{p}</div>
          <div style={{ borderTop: `1px solid ${M.borda}`, marginTop: 12, paddingTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <div style={{ width: 28, height: 16, borderRadius: 8, background: "white", position: "relative" }}>
              <div style={{ position: "absolute", right: 2, top: 2, width: 12, height: 12, borderRadius: "50%", background: M.fundo }} />
            </div>
            Ativa
          </div>
        </CartaoM>
      ))}
      <CartaoM aceso={frame >= fluxo} style={{ marginTop: 16, opacity: rampa(frame, fluxo - 10, 10) }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Fluxo · Preços da concorrência</div>
        <div style={{ fontSize: 12.5, color: M.suave, marginTop: 4 }}>Um agente entrega para o próximo, sem ninguém precisar repassar.</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          {FLUXO.map(([n, f], i) => {
            const a = ag(n);
            return (
              <div key={n} style={{ width: 76, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: rampa(frame, fluxo + 8 + i * 9, 8) }}>
                <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={50} />
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{a.nome}</div>
                <div style={{ fontSize: 11, color: M.suave }}>{f}</div>
              </div>
            );
          })}
        </div>
      </CartaoM>
    </TelaM>
  );
};

// ---------- Calls: a Cora transcreve e entrega o relatório da call
const FALAS: [string, string, string][] = [
  ["Paula", "A verba da Cerâmica Aurora entra até sexta?", M.azul],
  ["Ricardo", "Confirmei com eles ontem, vem em depósito.", M.laranja],
  ["Marina", "Então fechamos a vitrine do Dia do Cliente com porcelanato.", "#C084FC"],
];
const RELATORIO: [string, string, string[]][] = [
  ["decisões", "Decisões", ["Vitrine do Dia do Cliente com porcelanato"]],
  ["próximos", "Próximos passos", ["Confirmar o depósito da Cerâmica Aurora", "Montar a vitrine nas 4 lojas"]],
  ["responsáveis", "Responsáveis", ["Ricardo Lima · até sexta", "Marina Costa · até 10/11"]],
];
export const CallM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const resumo = m("resumo") - 4;
  const pronta = frame >= resumo;
  const cora = OUTROS.cora;
  return (
    <TelaM rola={rolagem(c, 0, [[m("próximos"), 110], [m("responsáveis"), 190]])}>
      <div style={{ fontSize: 13, color: M.suave }}>← Calls</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
        <TituloM tam={22}>Comercial</TituloM>
        <ChipM cor={pronta ? M.verde : M.amarelo}>{pronta ? "Pronta" : "Transcrevendo"}</ChipM>
      </div>
      <DescricaoM>04/11/2026, 10:00 · 42 min · 5 participantes</DescricaoM>
      {!pronta ? (
        <CartaoM style={{ marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar nome={cora.nome} cor={cora.cor} foto={cora.foto} tam={38} />
            <div style={{ fontSize: 14, fontWeight: 500 }}>A Cora entrou na chamada</div>
            <div style={{ marginLeft: "auto", width: 9, height: 9, borderRadius: "50%", background: M.vermelho, opacity: Math.floor(frame / 15) % 2 ? 1 : 0.3 }} />
          </div>
          <div style={{ marginTop: 16 }}>
            <RotuloM>Transcrição</RotuloM>
          </div>
          {FALAS.map(([q, t, cor], i) => (
            <div key={t} style={{ marginTop: 12, fontSize: 13.5, lineHeight: 1.4, opacity: rampa(frame, m("transcreve") - 6 + i * 10, 8) }}>
              <b style={{ color: cor, fontWeight: 600 }}>{q}:</b> {t}
            </div>
          ))}
        </CartaoM>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <BotaoM tam={13}>Renomear falantes</BotaoM>
            <BotaoM tam={13}>Gerar relatório de novo</BotaoM>
          </div>
          <CartaoM style={{ marginTop: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Relatório da call</div>
            <div style={{ fontSize: 12.5, color: M.suave, lineHeight: 1.4, marginTop: 6 }}>Gerado por IA a partir da transcrição automática em 04/11/2026, 10:44. Confira nomes e números antes de repassar.</div>
            {RELATORIO.map(([p, t, ls]) => (
              <div key={t} style={{ marginTop: 18, opacity: rampa(frame, m(p) - 4, 8) }}>
                <RotuloM>{t}</RotuloM>
                {ls.map((l) => (
                  <div key={l} style={{ fontSize: 13.5, lineHeight: 1.4, marginTop: 7, paddingLeft: 12 }}>
                    • {l}
                  </div>
                ))}
              </div>
            ))}
          </CartaoM>
        </>
      )}
    </TelaM>
  );
};
