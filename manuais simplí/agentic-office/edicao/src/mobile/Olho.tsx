import type React from "react";
import { useCurrentFrame } from "remotion";
import { Icone } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { useMola } from "../apresentacao/comum";
import { BotaoM, ChipM, DescricaoM, M, rolagem, type Rolagem, SeletorM, TelaM, TituloM, VISIVEL } from "./Kit";

// Olho de Deus no celular: seletores, caixa da conversa e campo fixo embaixo
type P = { readonly c: Cena };
const marcas = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
export const ALTURA_CAMPO = 66;
export const CampoOlho: React.FC<{ readonly texto?: string }> = ({ texto }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: ALTURA_CAMPO, boxSizing: "border-box", padding: "10px 16px", display: "flex", gap: 8, alignItems: "center", background: M.fundo, borderTop: `1px solid ${M.borda}` }}>
    <BotaoM style={{ width: 36, padding: 0, justifyContent: "center" }}>⌕</BotaoM>
    <BotaoM style={{ width: 36, padding: 0, justifyContent: "center" }}>
      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round">
        <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
    </BotaoM>
    <div style={{ flex: 1, height: 44, boxSizing: "border-box", padding: "0 12px", borderRadius: 4, border: `1px solid ${M.borda}`, fontSize: 13.5, color: texto ? "white" : M.suave, display: "flex", alignItems: "center" }}>{texto ?? "Pergunte ao Olho de Deus..."}</div>
    <div style={{ width: 36, height: 36, borderRadius: 4, background: "#6B726D", color: "#111", display: "grid", placeItems: "center" }}>➤</div>
  </div>
);
const Cabeca: React.FC<{ readonly escopo: string; readonly escopoAceso?: boolean; readonly voz?: boolean }> = ({ escopo, escopoAceso, voz }) => (
  <>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <TituloM icone="olho">Olho de Deus</TituloM>
      <Icone nome="config" tam={18} cor="white" />
    </div>
    <DescricaoM>O agente com visão total da sua operação: agentes, tarefas, base de conhecimento e quem fez o quê.</DescricaoM>
    <SeletorM aceso={escopoAceso} style={{ marginTop: 12 }}>
      {escopo}
    </SeletorM>
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <SeletorM style={{ flex: 1, color: M.suave }}>Sessões anteriores</SeletorM>
      <BotaoM style={{ width: 36, padding: 0, justifyContent: "center" }}>+</BotaoM>
      <BotaoM tipo={voz ? "verde" : "contorno"} aceso={voz} style={{ width: 36, padding: 0, justifyContent: "center" }}>
        🔊
      </BotaoM>
    </div>
  </>
);
const Caixa: React.FC<{ readonly altura?: number; readonly centro?: boolean; readonly children?: React.ReactNode }> = ({ altura = 560, centro, children }) => (
  <div style={{ marginTop: 8, height: altura, boxSizing: "border-box", padding: 12, borderRadius: 4, border: `1px solid ${M.borda}`, display: "flex", flexDirection: "column", gap: 10, alignItems: centro ? "center" : "stretch", justifyContent: centro ? "center" : "flex-start" }}>{children}</div>
);
export const Pergunta: React.FC<{ readonly de: number; readonly children: React.ReactNode }> = ({ de, children }) => {
  const s = useMola(de);
  if (s <= 0) return null;
  return <div style={{ alignSelf: "flex-end", maxWidth: 300, background: "white", color: M.fundo, borderRadius: 6, padding: "8px 12px", fontSize: 14, lineHeight: 1.4, opacity: s, transform: `translateY(${(1 - s) * 12}px)` }}>{children}</div>;
};
export const Resposta: React.FC<{ readonly de: number; readonly children: React.ReactNode }> = ({ de, children }) => {
  const s = useMola(de);
  if (s <= 0) return null;
  return <div style={{ alignSelf: "flex-start", width: 340, boxSizing: "border-box", background: "#1B261F", borderRadius: 6, padding: "8px 12px", fontSize: 14, lineHeight: 1.45, opacity: s, transform: `translateY(${(1 - s) * 12}px)` }}>{children}</div>;
};

export const SUGESTOES = ["O que os agentes fizeram hoje?", "Quais tarefas estão paradas em análise?", "Quem alterou algo no sistema esta semana?", "Crie um agente de atendimento ao cliente."];
export const OlhoVazioM: React.FC<P> = ({ c }) => {
  const m = marcas(c);
  return (
    <TelaM rola={rolagem(c, 0, [[m("central"), 110]])} fixo={<CampoOlho />}>
      <Cabeca escopo="Geral (a empresa toda)" />
      <Caixa altura={Math.max(330, VISIVEL)} centro>
        <div style={{ marginTop: 6 }}>
          <Icone nome="olho" tam={34} cor={M.suave} />
        </div>
        <div style={{ fontSize: 13.5, color: M.suave, textAlign: "center", lineHeight: 1.45 }}>Pergunte qualquer coisa sobre a operação da sua empresa.</div>
        {SUGESTOES.map((s) => (
          <div key={s} style={{ fontSize: 12.5, color: M.suave, padding: "6px 10px", borderRadius: 4, border: `1px solid ${M.borda}` }}>
            {s}
          </div>
        ))}
      </Caixa>
    </TelaM>
  );
};

const DIAS: [string, number][] = [["seg", 248], ["ter", 271], ["qua", 259], ["qui", 296], ["sex", 362], ["sáb", 247], ["dom", 157]];
export const OlhoConversaM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const pergunta = "Me traga o faturamento da última semana, por dia";
  const digita = m("texto") - 4;
  const n = Math.max(0, Math.floor((frame - digita) * 2.4));
  const enviada = digita + Math.ceil(pergunta.length / 2.4) + 6;
  const voz = frame >= m("voz") - 4 && frame < m("empresa") - 4;
  const escopoAceso = frame >= m("empresa") - 4 && frame < m("ele");
  const escopo = frame >= m("projeto") - 4 ? "Projeto: Dia do Cliente" : "Geral (a empresa toda)";
  const graf = m("gráficos") - 10;
  return (
    <TelaM rola={rolagem(c, 0, [[m("ele"), 190], [m("cria"), 268]])} fixo={<CampoOlho texto={frame >= digita && frame < enviada ? pergunta.slice(0, n) : undefined} />}>
      <Cabeca escopo={escopo} escopoAceso={escopoAceso} voz={voz} />
      <Caixa>
        <Pergunta de={enviada}>{pergunta}</Pergunta>
        <Resposta de={enviada + 12}>
          Na última semana a Loja Modelo faturou <b>R$ 1,84 milhão</b>, 6% acima da semana anterior. O pico foi na sexta, com <b>R$ 362 mil</b>.
          <div style={{ fontSize: 11, color: M.suave, marginTop: 3 }}>Fonte: banco de dados da Loja Modelo</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 92, marginTop: 8 }}>
            {DIAS.map(([d, v], i) => {
              const k = Math.min(1, Math.max(0, (frame - graf - i * 2) / 10));
              return (
                <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 10, color: M.suave }}>
                  <div style={{ height: (v / 362) * 72 * k, background: M.verdeForte, borderRadius: "2px 2px 0 0" }} />
                  <div style={{ marginTop: 4 }}>{d}</div>
                </div>
              );
            })}
          </div>
        </Resposta>
      </Caixa>
    </TelaM>
  );
};

export const OlhoAprovaM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const clique = m("aprovação");
  const toque = useMola(clique - 4);
  return (
    <TelaM rola={[[0, 190]] as Rolagem} fixo={<CampoOlho />}>
      <Cabeca escopo="Geral (a empresa toda)" />
      <Caixa>
        <Pergunta de={-30}>Cria uma rotina pra mandar o relatório de vendas toda segunda às 8h</Pergunta>
        <Resposta de={-20}>
          <ChipM cor={M.amarelo} style={{ whiteSpace: "normal", fontSize: 10 }}>AÇÃO QUE ALTERA O SISTEMA · PRECISA DA SUA APROVAÇÃO</ChipM>
          <div style={{ marginTop: 8 }}>
            <b>Plano:</b> criar a rotina <b>Relatório semanal de vendas</b>, toda segunda-feira às 8h, com o agente <b>César</b>. O PDF vai por e-mail para a diretoria.
          </div>
          <div style={{ marginTop: 6 }}>Confirma que pode criar?</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <BotaoM tipo="verde" aceso={frame >= clique - 2}>Aprovar</BotaoM>
            <BotaoM>Ajustar</BotaoM>
          </div>
          {toque > 0 && frame < clique + 14 && <div style={{ position: "absolute", left: 38, bottom: 4, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.35)", transform: `scale(${toque})` }} />}
        </Resposta>
        <Resposta de={clique + 8}>
          <span style={{ color: M.verde, fontWeight: 600 }}>✓ Rotina criada.</span> A primeira execução é na segunda, 09/11, às 8h.
        </Resposta>
      </Caixa>
    </TelaM>
  );
};
