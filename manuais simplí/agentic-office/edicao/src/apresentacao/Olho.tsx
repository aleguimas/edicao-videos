import type React from "react";
import { useCurrentFrame } from "remotion";
import { caminho, COR, Cursor, Digitando, Icone, rota } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { fontFamily, VERDE } from "../fonte";
import { Surge } from "../verbas/Montagem";
import { CENTRO } from "./Agentes";
import { AREA, Barras, Botao, CenaJanela, Chip, MENU_INICIO, useMola } from "./comum";

type P = { readonly c: Cena; readonly extras?: boolean };

// ---------- Tela do Olho de Deus: controles, área da conversa e campo de mensagem
export const Controles: React.FC<{ readonly escopo: string; readonly escopoAceso?: boolean; readonly voz?: boolean }> = ({ escopo, escopoAceso, voz }) => (
  <div style={{ position: "absolute", left: 40, top: 150, display: "flex", gap: 12 }}>
    <div style={{ width: 330, height: 50, boxSizing: "border-box", padding: "0 16px", display: "flex", alignItems: "center", borderRadius: 8, fontSize: 19, background: "#0E110F", border: `${escopoAceso ? 2 : 1}px solid ${escopoAceso ? VERDE : COR.borda}`, boxShadow: escopoAceso ? "0 0 24px rgba(60,224,30,0.3)" : "none" }}>
      {escopo} <span style={{ marginLeft: "auto", color: COR.suave }}>⌄</span>
    </div>
    <div style={{ width: 420, height: 50, boxSizing: "border-box", padding: "0 16px", display: "flex", alignItems: "center", borderRadius: 8, fontSize: 19, color: COR.suave, background: "#0E110F", border: `1px solid ${COR.borda}` }}>
      Sessões anteriores <span style={{ marginLeft: "auto" }}>⌄</span>
    </div>
    <Botao style={{ height: 50, background: voz ? VERDE : "transparent", color: voz ? "#0B0B0C" : COR.texto, border: `1px solid ${voz ? VERDE : COR.borda}` }}>🔊 Modo Voz</Botao>
  </div>
);
export const Entrada: React.FC<{ readonly children?: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top: 836, height: 56, boxSizing: "border-box", padding: "0 18px", display: "flex", alignItems: "center", borderRadius: 10, background: "#0E110F", border: `1px solid ${COR.borda}`, fontSize: 20 }}>
    <span style={{ flex: 1 }}>{children ?? <span style={{ color: "#6B726D" }}>Pergunte ao Olho de Deus...</span>}</span>
    <span style={{ width: 38, height: 38, borderRadius: 8, background: "#2A2F2B", display: "grid", placeItems: "center" }}>➤</span>
  </div>
);
export const Cabeca: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 16 }}>
      <Icone nome="olho" tam={38} />
      <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 9 }}>OLHO DE DEUS</div>
    </div>
    <div style={{ position: "absolute", left: 40, top: 96, fontSize: 19, color: COR.suave }}>O agente com visão total da sua operação: agentes, tarefas, base de conhecimento e quem fez o quê.</div>
  </>
);
export const Balao: React.FC<{ readonly de: number; readonly y: number; readonly direita?: number; readonly children: React.ReactNode }> = ({ de, y, direita = 60, children }) => {
  const s = useMola(de);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", right: direita, top: y, maxWidth: 760, background: "white", color: "#111", borderRadius: 12, padding: "14px 20px", fontSize: 21, opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>{children}</div>
  );
};
export const Resposta: React.FC<{ readonly de: number; readonly y: number; readonly w?: number; readonly children: React.ReactNode }> = ({ de, y, w = 1180, children }) => {
  const s = useMola(de);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 60, top: y, width: w, boxSizing: "border-box", background: "#171B18", border: `1px solid ${COR.borda}`, borderRadius: 12, padding: "18px 22px", fontSize: 21, lineHeight: 1.5, opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>
      {children}
    </div>
  );
};

// olho-1: a tela vazia, com sugestões
export const Olho1: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <CenaJanela ativo="Olho de Deus" menu={MENU_INICIO} quadros={rota([1.06, 900, 470], [[m("central"), ...CENTRO]], c.dur)}>
      <Cabeca />
      <Controles escopo="Geral (a empresa toda)" />
      <div style={{ position: "absolute", left: 40, right: 40, top: 220, height: 590, border: `1px solid ${COR.borda}`, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <Icone nome="olho" tam={60} cor={VERDE} />
        <div style={{ fontSize: 22, color: COR.suave, marginBottom: 10 }}>Pergunte qualquer coisa sobre a operação da sua empresa.</div>
        {["O que os agentes fizeram hoje?", "Quais tarefas estão paradas em análise?", "Como foram as vendas da semana?", "Crie um agente de atendimento ao cliente."].map((s) => (
          <div key={s} style={{ fontSize: 19, padding: "8px 16px", borderRadius: 8, border: `1px solid ${COR.borda}`, background: "#171B18" }}>
            {s}
          </div>
        ))}
      </div>
      <Entrada />
    </CenaJanela>
  );
};

// olho-2: pergunta por texto ou voz, responde com dado do ERP e gráfico
export const CAPACIDADES = [
  ["cria", "Cria tarefas"],
  ["aciona", "Aciona agentes"],
  ["consulta", "Consulta dados"],
  ["gráficos", "Gráficos e documentos"],
  ["aplicativos", "Monta aplicativos"],
  ["painéis", "Monta painéis"],
];
export const Olho2: React.FC<P> = ({ c, extras = true }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const digita = m("texto") - 4;
  const pergunta = "Me traga o faturamento da última semana, por dia";
  const enviada = digita + Math.ceil(pergunta.length / 2.4) + 6;
  const voz = frame >= m("voz") - 4 && frame < m("empresa") - 4;
  const escopoAceso = frame >= m("empresa") - 4 && frame < m("ele");
  const escopo = frame >= m("projeto") - 4 ? "Projeto: Dia do Cliente" : "Geral (a empresa toda)";
  return (
    <>
      <CenaJanela ativo="Olho de Deus" menu={MENU_INICIO} quadros={rota(CENTRO, [[m("cria"), 1.08, 860, 520]], c.dur)}>
        <Cabeca />
        <Controles escopo={escopo} escopoAceso={escopoAceso} voz={voz} />
        <div style={{ position: "absolute", left: 40, right: 40, top: 220, height: 590, border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
        <Balao de={enviada} y={250} direita={extras ? 60 : 450}>
          {pergunta}
        </Balao>
        <Resposta de={enviada + 12} y={330} w={820}>
          Na última semana a Loja Modelo faturou <b>R$ 1,84 milhão</b>, 6% acima da semana anterior. O pico foi na sexta, com <b>R$ 362 mil</b>.
          <div style={{ fontSize: 17, color: COR.suave, marginTop: 4 }}>Fonte: banco de dados da Loja Modelo · vendas por dia</div>
          <div style={{ marginTop: 16, display: "flex", gap: 30, alignItems: "flex-end" }}>
            <Barras valores={[248, 271, 259, 296, 362, 247, 157]} rotulos={["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]} w={760} h={220} de={m("gráficos") - 10} />
          </div>
        </Resposta>
        <Entrada>{frame < enviada ? <Digitando texto={pergunta} de={digita} porFrame={2.4} /> : undefined}</Entrada>
      </CenaJanela>
      {extras && CAPACIDADES.map(([p, t], i) => (
        <Surge key={t} de={m(p) - 4} style={{ left: 1500, top: 380 + i * 64 }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 26, color: "#0B0B0C", background: VERDE, borderRadius: 10, padding: "10px 18px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>✓ {t}</div>
        </Surge>
      ))}
    </>
  );
};

// olho-3: ação que altera algo só roda depois da aprovação
const APROVAR = { x: AREA.x + 60 + 22 + 70, y: AREA.y + 572 };
export const Olho3: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const clique = m("aprovação");
  return (
    <CenaJanela
      ativo="Olho de Deus"
      menu={MENU_INICIO}
      quadros={rota(CENTRO, [[m("ação"), 1.15, 820, 470]], c.dur)}
      fora={<Cursor pontos={caminho([1100, 760], [[clique, APROVAR.x, APROVAR.y]])} cliques={[clique]} />}
    >
      <Cabeca />
      <Controles escopo="Geral (a empresa toda)" />
      <div style={{ position: "absolute", left: 40, right: 40, top: 220, height: 590, border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
      <Balao de={-30} y={250}>
        Cria uma rotina pra mandar o relatório de vendas toda segunda às 8h
      </Balao>
      <Resposta de={-20} y={330}>
        <Chip cor="#F5B82E">AÇÃO QUE ALTERA O SISTEMA · PRECISA DA SUA APROVAÇÃO</Chip>
        <div style={{ marginTop: 12 }}>
          <b>Plano:</b> criar a rotina <b>Relatório semanal de vendas</b>, toda segunda-feira às 8h, com o agente <b>César</b> e a habilidade de mesmo nome. O PDF vai por e-mail para a diretoria.
        </div>
        <div style={{ marginTop: 10 }}>Confirma que pode criar?</div>
        <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
          <Botao verde style={{ boxShadow: frame >= clique - 2 ? "0 0 0 3px rgba(60,224,30,0.6)" : "none" }}>Aprovar</Botao>
          <Botao>Ajustar</Botao>
        </div>
      </Resposta>
      {frame >= clique + 8 && (
        <Resposta de={clique + 8} y={660}>
          <span style={{ color: VERDE, fontWeight: 700 }}>✓ Rotina criada.</span> A primeira execução é na segunda, 09/11, às 8h.
        </Resposta>
      )}
      <Entrada />
    </CenaJanela>
  );
};
