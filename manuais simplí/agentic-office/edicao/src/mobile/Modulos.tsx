import type React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Icone } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { Avatar, EXECUTORES, OUTROS, rampa, useMola } from "../apresentacao/comum";
import { fonteMonoSistema } from "../fonte";
import { AbasM, BotaoM, CaminhoM, CartaoM, ChipM, DescricaoM, M, NumeroM, RotuloM, rolagem, SegM, SeletorM, TelaM, TituloM } from "./Kit";

type P = { readonly c: Cena };
const marcas = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
const Grade: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14, ...style }}>{children}</div>;

// ---------- AI Agents: o seletor troca de agente e o cartão acompanha
const PAPEIS: Record<string, string> = {
  Rafael: "Pesquisa: busca na internet e traz fatos, fontes e números.",
  Íris: "Design: transforma um briefing em peça visual.",
  Vicente: "Texto: posts, e-mails e campanhas no estilo da marca.",
  César: "Análise: lê documentos e planilhas e recomenda o próximo passo.",
  Mei: "Execução: resolve listas, resumos e organização.",
};
export const AgentesM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const i = Math.min(EXECUTORES.length - 1, Math.floor(Math.max(0, frame - 10) / Math.max(1, (c.dur - 20) / EXECUTORES.length)));
  const a = EXECUTORES[i];
  return (
    <TelaM rola={[[0, 0], [12, 0], [30, 150]]}>
      <CaminhoM a="agentes" />
      <RotuloM>Platform variants</RotuloM>
      <div style={{ marginTop: 8 }}>
        <TituloM>AI Agents</TituloM>
      </div>
      <DescricaoM>O time padrão vem pronto com a plataforma; os personalizados são criados por você.</DescricaoM>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <BotaoM>Ver modelos</BotaoM>
        <BotaoM tipo="branco">Novo agente</BotaoM>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 16 }}>Agentes executores</div>
      <SeletorM style={{ marginTop: 8 }} aceso>
        {a.nome}
      </SeletorM>
      <div style={{ marginTop: 12, boxSizing: "border-box", padding: 14, borderRadius: 6, background: M.card, border: `1px solid ${M.borda}`, borderTop: `2px solid ${M.verde}` }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={50} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "0.1em" }}>
              <span style={{ color: M.verde }}>0{i + 1}</span> {a.nome.toUpperCase()}
            </div>
            <div style={{ fontSize: 11.5, color: M.suave, lineHeight: 1.35, marginTop: 3 }}>{PAPEIS[a.nome]}</div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <ChipM>AGENTE PADRÃO</ChipM>
        </div>
        <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 4, border: `1px solid ${M.verdeForte}`, background: "rgba(22,163,74,0.08)" }}>
          <div style={{ fontFamily: fonteMonoSistema, fontSize: 9.5, letterSpacing: "0.2em", color: M.suave }}>★ MODELO</div>
          <div style={{ fontSize: 13, marginTop: 2 }}>Nova</div>
        </div>
      </div>
    </TelaM>
  );
};

// ---------- Integrações: sistema de gestão por banco ou MCP, sem citar nomes de ERP
const CONEXOES: [string, string, string][] = [
  ["banco", "Banco de dados", "Conexão direta ao banco do seu sistema de gestão, com um usuário somente leitura."],
  ["MCP", "Conexão MCP", "O sistema de gestão entrega os dados por um servidor MCP, no formato que os agentes entendem."],
];
export const IntegracoesM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const seguro = m("seguro") - 4;
  const leitura = m("leitura") - 4;
  const aceso = frame < seguro ? (frame >= m("MCP") - 4 ? 1 : frame >= m("banco") - 4 ? 0 : -1) : -1;
  return (
    <TelaM rola={rolagem(c, 0, [[m("banco"), 150], [seguro, 360]])}>
      <TituloM>Integrações</TituloM>
      <DescricaoM>Conecte os sistemas e contas da empresa para os agentes trabalharem com os seus dados.</DescricaoM>
      <div style={{ marginTop: 14 }}>
        <SegM abas={["Sistema de gestão", "Diversas", "Redes sociais"]} ativa="Sistema de gestão" />
      </div>
      <CartaoM style={{ marginTop: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Sistema de gestão</div>
        <div style={{ fontSize: 12.5, color: M.suave, lineHeight: 1.4, marginTop: 4 }}>Escolha como o Agentic Office vai ler os dados do seu sistema.</div>
        {CONEXOES.map(([, t, d], i) => (
          <CartaoM key={t} pad={13} aceso={i === aceso} style={{ marginTop: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{t}</div>
            <div style={{ fontSize: 12.5, color: M.suave, lineHeight: 1.4, marginTop: 5 }}>{d}</div>
            <BotaoM tam={13} style={{ marginTop: 10, height: 32 }}>⏻ Conectar</BotaoM>
          </CartaoM>
        ))}
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 16 }}>
          Integrações conectadas <span style={{ color: M.suave, fontWeight: 400 }}>1 conectada</span>
        </div>
        <CartaoM pad={13} aceso={frame >= seguro} style={{ marginTop: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Loja Modelo-BD</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            <ChipM cheio cor="white">Mapa pronto</ChipM>
            <ChipM cor={M.suave}>Banco direto</ChipM>
            <ChipM cheio={frame >= seguro}>Canal seguro</ChipM>
            <ChipM cheio={frame >= leitura}>🔒 Somente leitura</ChipM>
          </div>
          <div style={{ fontSize: 12, color: M.suave, marginTop: 8 }}>Mapeada em 18/09/2026, 15:37 · levou 1 min</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <BotaoM tam={12.5} style={{ height: 32 }}>Ver mapa do banco</BotaoM>
            <BotaoM tam={12.5} style={{ height: 32 }}>Ver gráfico do banco</BotaoM>
          </div>
        </CartaoM>
      </CartaoM>
    </TelaM>
  );
};

// ---------- Gráfico do banco + pergunta em português
const SETORES = ["Cadastros", "Comercial", "Compras", "Estoque e Logística", "Financeiro", "Fiscal", "Outros", "Produção"];
const aleatorio = (s: number) => {
  const x = Math.sin(s * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const Grafo: React.FC<{ readonly de: number }> = ({ de }) => {
  const frame = useCurrentFrame();
  const k = rampa(frame, de, 30);
  const cx = 174;
  const cy = 176;
  const R = 112;
  const giro = frame * 0.002;
  return (
    <svg width={348} height={352} style={{ display: "block" }}>
      <circle cx={cx} cy={cy} r={R + 56} fill="none" stroke={M.verde} strokeOpacity={0.3} />
      {SETORES.map((s, i) => {
        const a = (i / SETORES.length) * Math.PI * 2 - Math.PI / 2 + giro;
        const sx = cx + Math.cos(a) * R * k;
        const sy = cy + Math.sin(a) * R * k;
        return (
          <g key={s}>
            <line x1={cx} y1={cy} x2={sx} y2={sy} stroke={M.verde} strokeOpacity={0.45} />
            {Array.from({ length: 30 }, (_, j) => {
              const r = 7 + aleatorio(i * 100 + j) * 26;
              const b = aleatorio(i * 300 + j) * Math.PI * 2;
              const px = sx + Math.cos(b) * r * k;
              const py = sy + Math.sin(b) * r * k;
              const alvo = (i + 1 + (j % 3)) % SETORES.length;
              const aa = (alvo / SETORES.length) * Math.PI * 2 - Math.PI / 2 + giro;
              return (
                <g key={j}>
                  {j % 4 === 0 && <line x1={px} y1={py} x2={cx + Math.cos(aa) * R * k} y2={cy + Math.sin(aa) * R * k} stroke={M.verde} strokeOpacity={0.1} />}
                  <circle cx={px} cy={py} r={1.2} fill={M.verde} opacity={0.8 * k} />
                </g>
              );
            })}
            <circle cx={sx} cy={sy} r={4} fill={M.verde} />
            <text x={sx} y={sy + 16} fill={M.verde} fontSize={9.5} textAnchor="middle" opacity={k}>
              {s}
            </text>
          </g>
        );
      })}
      <rect x={cx - 42} y={cy - 12} width={84} height={24} rx={12} fill={M.fundo} stroke="white" />
      <text x={cx} y={cy + 4} fill="white" fontSize={10.5} textAnchor="middle" fontWeight={600}>
        LojaModelo-BD
      </text>
    </svg>
  );
};
export const GrafoM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const pergunta = m("pergunta") - 6;
  const resposta = m("resposta") - 4;
  const s = useMola(pergunta);
  return (
    <TelaM
      rola={rolagem(c, 0, [[m("mapa"), 118]])}
      fixo={
        s > 0 ? (
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, transform: `translateY(${(1 - s) * 240}px)` }}>
            <CartaoM aceso pad={14} style={{ background: M.cardSolido }}>
              <RotuloM>Pergunta em português</RotuloM>
              <div style={{ marginTop: 8, background: "white", color: M.fundo, borderRadius: 6, padding: "8px 12px", fontSize: 14 }}>Quanto vendemos de porcelanato em outubro?</div>
              {frame >= resposta && (
                <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.45, opacity: rampa(frame, resposta, 8) }}>
                  <b style={{ color: M.verde }}>R$ 412 mil</b> em porcelanato, 8% acima de setembro. A loja Shopping puxou o resultado.
                  <div style={{ fontSize: 11, color: M.suave, marginTop: 2 }}>Fonte: banco de dados da Loja Modelo</div>
                </div>
              )}
            </CartaoM>
          </div>
        ) : null
      }
    >
      <CaminhoM a="LojaModelo-BD" />
      <RotuloM>Grafo de relações</RotuloM>
      <div style={{ marginTop: 8 }}>
        <TituloM>Gráfico do banco</TituloM>
      </div>
      <DescricaoM>Cada ponto é uma tabela do banco e cada linha, uma relação extraída do próprio banco.</DescricaoM>
      <CartaoM pad={12} style={{ marginTop: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[["1.248", "TABELAS"], ["2.410", "RELAÇÕES"], ["8", "SETORES"]].map(([v, r]) => (
            <div key={r} style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: 4, border: `1px solid ${M.borda}` }}>
              <div style={{ fontSize: 17, fontWeight: 600, color: M.verde }}>{v}</div>
              <div style={{ fontFamily: fonteMonoSistema, fontSize: 9, letterSpacing: "0.14em", color: M.suave }}>{r}</div>
            </div>
          ))}
        </div>
        <Grafo de={m("mapa") - 10} />
      </CartaoM>
    </TelaM>
  );
};

// ---------- Painel de KPIs (Gestão Avançada)
const Sparkline: React.FC<{ readonly v: readonly number[]; readonly k: number }> = ({ v, k }) => {
  const min = Math.min(...v);
  const max = Math.max(...v);
  const n = Math.max(2, Math.ceil(v.length * k));
  return <polyline points={v.slice(0, n).map((y, i) => `${(i / (v.length - 1)) * 86},${28 - ((y - min) / (max - min || 1)) * 26}`).join(" ")} fill="none" stroke={M.verdeForte} strokeWidth={1.5} />;
};
const KPIS: [string, number, (v: number) => string, string, boolean, number[]][] = [
  ["Faturamento do mês", 1840000, (v) => "R$ " + (v / 1e6).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " mi", "6,0%", true, [4, 5, 5, 6, 6, 7, 8]],
  ["Margem líquida comercial %", 29.4, (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%", "2,1%", true, [5, 4, 5, 6, 5, 6, 7]],
  ["Ticket médio", 587, (v) => "R$ " + Math.round(v), "3,4%", true, [6, 5, 6, 6, 7, 6, 7]],
];
export const KpisM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const dizer = m("dizer");
  const hora = m("hora") - 4;
  const credito = m("crédito") - 4;
  const s = useMola(m("monta") - 6);
  const sai = rampa(frame, dizer - 8, 10);
  const aceso = frame >= hora && frame < credito;
  return (
    <TelaM
      rola={rolagem(c, 0, [[dizer, 76]])}
      fixo={
        sai < 1 && s > 0 ? (
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, opacity: s * (1 - sai) }}>
            <CartaoM aceso pad={14} style={{ background: M.cardSolido }}>
              <RotuloM>Olho de Deus</RotuloM>
              <div style={{ marginTop: 8, background: "white", color: M.fundo, borderRadius: 6, padding: "8px 12px", fontSize: 14, lineHeight: 1.4 }}>Quero acompanhar faturamento, margem, ticket médio, ruptura, pedidos do dia e devoluções.</div>
            </CartaoM>
          </div>
        ) : null
      }
    >
      <TituloM icone="gestao">Gestão Avançada</TituloM>
      <div style={{ fontSize: 15, fontWeight: 500, marginTop: 6 }}>Painel principal</div>
      <DescricaoM>LojaModelo-BD · atualizado há 2 min · próxima às 15h</DescricaoM>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <BotaoM tam={13} aceso={aceso}>⟳ Atualizar agora</BotaoM>
        <BotaoM tam={13}>Customizar</BotaoM>
      </div>
      {KPIS.map(([r, v, f, d, sobe, sp], i) => {
        const k = rampa(frame, m("conversa") + 4 + i * 6, 20);
        return (
          <CartaoM key={r} pad={14} aceso={aceso} style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, color: M.suave }}>{r}</div>
            <div style={{ fontSize: 24, fontWeight: 600, marginTop: 8 }}>{f(v * k)}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 6 }}>
              <span style={{ fontSize: 12, color: M.suave }}>
                <span style={{ color: sobe ? M.verdeForte : M.vermelho }}>▲ {d}</span> vs mês anterior
              </span>
              <svg width={86} height={30}>
                <Sparkline v={sp} k={k} />
              </svg>
            </div>
            <div style={{ fontSize: 11, color: M.suave, marginTop: 6 }}>Fonte: LojaModelo-BD</div>
          </CartaoM>
        );
      })}
    </TelaM>
  );
};

// ---------- Base de conhecimento
export const BaseM: React.FC<{ readonly c: Cena; readonly de: number }> = ({ c, de }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const busca = m("busca") - 4;
  const resposta = m("casa") - 4;
  const s = useMola(busca);
  return (
    <TelaM
      fixo={
        frame >= busca ? (
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, opacity: s, transform: `translateY(${(1 - s) * 120}px)` }}>
            <CartaoM aceso pad={14} style={{ background: M.cardSolido }}>
              <RotuloM>Busca inteligente</RotuloM>
              <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 4, border: `1px solid ${M.borda}`, fontSize: 14 }}>Qual o prazo de troca de um porcelanato com defeito?</div>
              {frame >= resposta && (
                <div style={{ marginTop: 8, opacity: rampa(frame, resposta, 8), fontSize: 13.5, lineHeight: 1.45 }}>
                  <div style={{ fontSize: 11, color: M.suave }}>Política de Trocas 2026 · pág. 3</div>
                  Trocas por defeito de fabricação em até <b style={{ color: M.verde }}>90 dias</b>, com a nota fiscal.
                </div>
              )}
            </CartaoM>
          </div>
        ) : null
      }
    >
      <div style={{ opacity: rampa(frame, de, 10) }}>
        <TituloM>Base de conhecimento</TituloM>
        <DescricaoM>Visão geral do ecossistema</DescricaoM>
        <BotaoM tipo="branco" style={{ marginTop: 10 }}>Nova base</BotaoM>
        {[["Bases", "14", "base"], ["Setores", "8", "agentes"], ["Relacionamentos", "12", "integracoes"]].map(([r, v, ic]) => (
          <CartaoM key={r} pad={12} style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <Icone nome={ic} tam={20} cor={M.suave} />
            <span style={{ fontSize: 14, color: M.suave, flex: 1 }}>{r}</span>
            <span style={{ fontSize: 20, fontWeight: 600 }}>{v}</span>
          </CartaoM>
        ))}
        <div style={{ display: "grid", placeItems: "center", marginTop: 8 }}>
          <Img src={staticFile("midia/cerebro-base.png")} style={{ width: 190, transform: `translateY(${Math.sin(frame / 20) * 3}px)` }} />
        </div>
      </div>
    </TelaM>
  );
};

// ---------- Memória
const SETORES_MEM: [string, number][] = [["Comercial e Marketing", 7], ["Compras e Estoque", 5], ["Financeiro", 4]];
export const MemoriaM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const tarefa = m("tarefa");
  const dias = m("dias") - 4;
  return (
    <TelaM rola={rolagem(c, 0, [[m("lembra"), 260]])}>
      <TituloM>Memória</TituloM>
      <DescricaoM>O que cada setor viveu, resumido toda madrugada a partir do que as pessoas e os agentes fizeram.</DescricaoM>
      <CartaoM style={{ marginTop: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Memória da empresa</div>
        <div style={{ fontSize: 13, color: M.suave, lineHeight: 1.45, marginTop: 6 }}>A Loja Modelo tem 4 lojas e um centro de distribuição. Margem mínima de 22% em qualquer promoção. Campanhas passam pela aprovação do diretor comercial.</div>
      </CartaoM>
      <div style={{ fontSize: 16, fontWeight: 600, marginTop: 18 }}>Setores</div>
      {SETORES_MEM.map(([n, v], i) => {
        const sobe = i === 0 && frame >= tarefa;
        const aceso = (i === 0 && frame >= tarefa - 4) || frame >= dias;
        return (
          <CartaoM key={n} aceso={aceso} style={{ marginTop: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{n}</div>
            <div style={{ fontSize: 13, color: M.suave, marginTop: 6 }}>
              Memória v{sobe ? v + 1 : v} · até {sobe ? "02" : "01"}/11/2026
            </div>
            <div style={{ marginTop: 8 }}>
              <ChipM cheio>{sobe ? "atualizada agora" : "em dia"}</ChipM>
            </div>
            <div style={{ fontSize: 12, color: M.suave, marginTop: 8 }}>gerado em 02/11/2026, 00:00</div>
          </CartaoM>
        );
      })}
    </TelaM>
  );
};

// ---------- Habilidades (skills)
const PASSOS = ["Buscar as vendas da semana no ERP", "Comparar com a semana anterior e com a meta", "Destacar as lojas abaixo da meta", "Gerar o PDF com a marca da Loja Modelo"];
export const SkillsM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const passo = m("executar") - 10;
  const importa = frame >= m("importar") - 6;
  return (
    <TelaM rola={rolagem(c, 0, [[m("procedimentos"), 170], [m("importar") - 10, 60]])}>
      <CaminhoM a="habilidades" />
      <RotuloM>Árvore de capacidades</RotuloM>
      <div style={{ marginTop: 8 }}>
        <TituloM>Habilidades</TituloM>
      </div>
      <DescricaoM>Processos destilados de tarefas concluídas: navegue pelas categorias e veja cada habilidade.</DescricaoM>
      <BotaoM style={{ width: "100%", justifyContent: "center", marginTop: 12, fontFamily: fonteMonoSistema, fontSize: 12, letterSpacing: "0.1em" }}>VER EM MODO GRÁFICO</BotaoM>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <BotaoM tipo="branco" style={{ flex: 1, justifyContent: "center", fontFamily: fonteMonoSistema, fontSize: 12, letterSpacing: "0.1em" }}>CRIAR SKILL</BotaoM>
        <BotaoM aceso={importa} icone="importar" style={{ flex: 1, justifyContent: "center", fontFamily: fonteMonoSistema, fontSize: 12, letterSpacing: "0.1em" }}>IMPORTAR SKILL</BotaoM>
      </div>
      <CartaoM aceso style={{ marginTop: 14 }}>
        <ChipM>HABILIDADE · CÉSAR</ChipM>
        <div style={{ fontSize: 17, fontWeight: 600, marginTop: 10 }}>Relatório semanal de vendas</div>
        <div style={{ fontSize: 12.5, color: M.suave, marginTop: 4 }}>Usada toda segunda-feira pela rotina das 8h.</div>
        {PASSOS.map((p, i) => {
          const k = rampa(frame, passo + i * 9, 8);
          return (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, fontSize: 13.5 }}>
              <div style={{ width: 24, height: 24, flexShrink: 0, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 12, background: k > 0.5 ? M.verde : M.destaque, color: k > 0.5 ? M.fundo : M.suave }}>{k > 0.5 ? "✓" : i + 1}</div>
              <span style={{ color: k > 0.5 ? "white" : M.suave, lineHeight: 1.3 }}>{p}</span>
            </div>
          );
        })}
      </CartaoM>
    </TelaM>
  );
};

// ---------- Integrações · Diversas
const APPS: [string, string, number][] = [
  ["Gmail", "#EA4335", 61], ["Google Drive", "#1FA463", 48], ["Slack", "#611F69", 152], ["Notion", "#FFFFFF", 39], ["Microsoft Teams", "#5059C9", 222], ["Asana", "#F06A6A", 157], ["Shopify", "#5E8E3E", 315], ["HubSpot", "#FF7A59", 208], ["Trello", "#0079BF", 74], ["Google Agenda", "#4285F4", 31],
];
export const DiversasM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const y = interpolate(frame, [m("Notion") + 10, c.dur], [120, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ditos = ["Gmail", "Drive", "Slack", "Notion"].map((p) => m(p));
  const atual = ditos.reduce((a, f, i) => (frame >= f - 3 ? i : a), -1);
  return (
    <TelaM rola={[[0, y]]}>
      <TituloM>Integrações</TituloM>
      <DescricaoM>Conecte os sistemas e contas da empresa para os agentes trabalharem com os seus dados.</DescricaoM>
      <div style={{ marginTop: 14 }}>
        <SegM abas={["Sistema de gestão", "Diversas", "Redes sociais"]} ativa="Diversas" />
      </div>
      {APPS.map(([n, cor, a], i) => (
        <CartaoM key={n} pad={13} aceso={i === atual && frame < m("mil") + 40} style={{ marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: cor, color: cor === "#FFFFFF" ? "#111" : "white", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 14 }}>{n[0]}</div>
            <div style={{ fontSize: 15, fontWeight: 500, flex: 1 }}>{n}</div>
            <BotaoM tam={12.5} style={{ height: 30 }}>⏻ Conectar</BotaoM>
          </div>
          <div style={{ fontSize: 12, color: M.suave, marginTop: 8 }}>{a} ações</div>
        </CartaoM>
      ))}
    </TelaM>
  );
};

// ---------- Inteligência de Estoque: as abas seguem a fala
const PREVISTO = [62, 58, 71, 66, 80, 77, 85, 82, 90, 88];
const REAL = [60, 61, 69, 70, 76, 79, 83, 86, 87];
const Linha: React.FC<{ readonly v: readonly number[]; readonly k: number; readonly cor: string; readonly tracejada?: boolean }> = ({ v, k, cor, tracejada }) => (
  <polyline points={v.slice(0, Math.max(2, Math.ceil(v.length * k))).map((y, i) => `${(i / 9) * 330},${130 - ((y - 50) / 45) * 130}`).join(" ")} fill="none" stroke={cor} strokeWidth={2} strokeDasharray={tracejada ? "6 5" : undefined} strokeLinecap="round" />
);
export const EstoqueM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const abas: [string, number][] = [["Previsão", m("demanda")], ["Validação", m("acerto")], ["Ações", m("compras")], ["Sortimento", m("sortimento")]];
  const aba = [...abas].reverse().find(([, f]) => frame >= f - 4)?.[0] ?? "Ações";
  return (
    <TelaM rola={rolagem(c, 0, [[m("demanda"), 128]])}>
      <TituloM icone="estoque">Inteligência de Estoque</TituloM>
      <DescricaoM>O que comprar e remanejar hoje, a previsão de venda por produto e loja e quanto ela acertou.</DescricaoM>
      <div style={{ marginTop: 10 }}>
        <AbasM abas={["Ações", "Previsão", "Validação", "Sortimento"]} ativa={aba} />
      </div>
      {aba === "Ações" && (
        <>
          {[["Comprar", "412 linhas", "R$ 1.284.300 · 96 urgentes"], ["CD → lojas", "238 linhas", "R$ 205.410 · 61 urgentes"], ["Entre lojas", "151 linhas", "R$ 98.770 · 33 urgentes"]].map(([r, v, n], i) => (
            <div key={r} style={{ marginTop: 12 }}>
              <NumeroM rotulo={r} valor={v} nota={n} aceso={i === 0} />
            </div>
          ))}
        </>
      )}
      {aba === "Previsão" && (
        <>
          <Grade>
            <NumeroM rotulo="Publicada em" valor="02/11/2026" nota="dados até 01/11" tam={19} />
            <NumeroM rotulo="Erro em 4 semanas (lojas)" valor="25%" nota="referência 19%" />
          </Grade>
          <CartaoM pad={14} aceso style={{ marginTop: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Porcelanato Areia 60x60 · loja Centro</div>
            <div style={{ fontSize: 11.5, color: M.suave, marginTop: 3 }}>
              <span style={{ color: M.verdeForte }}>━</span> venda real <span style={{ color: M.amarelo, marginLeft: 10 }}>┅</span> previsão
            </div>
            <svg width={330} height={140} style={{ marginTop: 10, overflow: "visible" }}>
              <Linha v={PREVISTO} k={rampa(frame, m("demanda") - 4, 26)} cor={M.amarelo} tracejada />
              <Linha v={REAL} k={rampa(frame, m("demanda") - 4, 26)} cor={M.verdeForte} />
            </svg>
          </CartaoM>
        </>
      )}
      {aba === "Validação" && (
        <>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 14 }}>Semana de 26/10 a 01/11</div>
          <Grade>
            <NumeroM rotulo="Acerto do total · empresa" valor="87%" nota="por produto 71%" cor={M.verde} aceso tam={26} />
            <NumeroM rotulo="Acerto do total · lojas" valor="82%" nota="por produto 64%" tam={26} />
            <NumeroM rotulo="Vendido na semana" valor="R$ 1,8 mi" nota="12.133 produtos avaliados" />
            <NumeroM rotulo="Viés da empresa" valor="-2,3%" nota="previu um pouco abaixo" />
          </Grade>
        </>
      )}
      {aba === "Sortimento" && (
        <>
          <Grade>
            <NumeroM rotulo="Venda" valor="R$ 4,2 mi" />
            <NumeroM rotulo="Margem" valor="29,4%" />
            <NumeroM rotulo="Parados há 90 dias" valor="38 itens" cor={M.amarelo} aceso />
            <NumeroM rotulo="Liberados se cortar" valor="R$ 64 mil" />
          </Grade>
        </>
      )}
    </TelaM>
  );
};

// ---------- AI Price Watch
const CONCORRENTES: [string, number][] = [["Casa & Obra", 74.9], ["Constrular", 77.5], ["Piso Fácil", 82.0]];
const preco = (v: number) => "R$ " + v.toFixed(2).replace(".", ",");
export const PriceWatchM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const conc = m("concorrência") - 6;
  const sugerido = m("sugerido") - 4;
  const margem = m("margem") - 4;
  return (
    <TelaM rola={rolagem(c, 0, [[conc, 110], [sugerido, 330]])}>
      <TituloM icone="comercial" tam={20}>AI Price Watch</TituloM>
      <DescricaoM>O preço dos concorrentes para os nossos produtos: quem está mais barato, na média ou mais caro.</DescricaoM>
      <Grade>
        <NumeroM rotulo="Produtos monitorados" valor="48" nota="curva A" aceso />
        <NumeroM rotulo="Mais barato" valor="19" nota="que a média do mercado" />
      </Grade>
      <CartaoM pad={14} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, color: M.suave }}>Produto</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>PORCELANATO AREIA 60X60</div>
        <div style={{ fontSize: 13, color: M.suave, marginTop: 6 }}>
          Meu preço: <b style={{ color: "white" }}>R$ 79,90</b>/m²
        </div>
        <div style={{ marginTop: 12 }}>
          <RotuloM>Concorrentes</RotuloM>
        </div>
        {CONCORRENTES.map(([n, v], i) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "9px 0", borderBottom: `1px solid ${M.borda}`, opacity: rampa(frame, conc + i * 6, 8) }}>
            <span>{n}</span>
            <b style={{ fontWeight: 600 }}>{preco(v)}</b>
          </div>
        ))}
      </CartaoM>
      <CartaoM aceso={frame >= sugerido} style={{ marginTop: 12, opacity: rampa(frame, sugerido, 10) }}>
        <div style={{ fontSize: 13, color: M.suave }}>Preço sugerido</div>
        <div style={{ fontSize: 34, fontWeight: 600, color: M.verde, marginTop: 4 }}>R$ 76,90</div>
        <div style={{ fontSize: 12.5, color: M.suave, marginTop: 4, lineHeight: 1.4 }}>abaixo da média dos concorrentes, sem sair da regra de margem</div>
      </CartaoM>
      <CartaoM aceso={frame >= margem} pad={14} style={{ marginTop: 12, opacity: rampa(frame, margem, 10), display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: M.verde, color: M.fundo, display: "grid", placeItems: "center", fontSize: 18 }}>✓</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Margem de 23,1%</div>
          <div style={{ fontSize: 12, color: M.suave }}>margem mínima da empresa: 22%</div>
        </div>
      </CartaoM>
    </TelaM>
  );
};

// ---------- Verbas e Acordos + Conciliação bancária (troca na palavra "Conciliação")
const DIASC: [string, string, string, boolean][] = [["01/10/2026", "4.280,00", "4.280,00", true], ["02/10/2026", "6.060,00", "6.060,00", true], ["03/10/2026", "12.415,30", "12.415,30", true], ["06/10/2026", "9.180,10", "9.180,10", true], ["07/10/2026", "2.058,90", "2.000,00", false]];
export const VerbasConciliacaoM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const troca = m("Conciliação") - 8;
  const linha = m("confere") - 4;
  const conta = rampa(frame, m("controla") - 4, 26);
  if (frame < troca) {
    const n = (v: number) => "R$ " + Math.round(v * conta).toLocaleString("pt-BR");
    return (
      <TelaM rola={rolagem(c, 0, [[m("planilhas") - 30, 160]])}>
        <TituloM icone="verbas" tam={21}>Verbas e Acordos</TituloM>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <BotaoM tam={13} icone="importar" aceso={frame >= m("planilhas") - 6}>Importar planilha</BotaoM>
          <BotaoM tam={13} icone="exportar">Exportar Excel</BotaoM>
        </div>
        <DescricaoM>O que cada fornecedor se comprometeu a dar: verba, bonificação em mercadoria, desconto ou depósito, e o que já chegou.</DescricaoM>
        <div style={{ marginTop: 8 }}>
          <AbasM abas={["Painel", "Acordos", "Recebimentos", "Caixa do ERP"]} ativa="Painel" />
        </div>
        <Grade>
          <NumeroM rotulo="Valor negociado" valor={n(1284600)} nota="214 acordos ativos" tam={19} />
          <NumeroM rotulo="Recebido" valor={n(1012350)} nota="78,8% de realização" tam={19} />
          <NumeroM rotulo="Pendente de recebimento" valor={n(272250)} nota="38 acordos em aberto" cor={M.amarelo} tam={19} />
          <NumeroM rotulo="Vencido e não recebido" valor={n(46800)} nota="9 acordos com prazo passado" cor={M.vermelho} tam={19} />
        </Grade>
      </TelaM>
    );
  }
  return (
    <TelaM>
      <div style={{ opacity: rampa(frame, troca, 10) }}>
        <div style={{ fontSize: 13, color: M.suave }}>← Voltar para 12345-6</div>
        <div style={{ fontSize: 12.5, color: M.suave, marginTop: 8 }}>Banco Exemplo · ag. 1234 · cc 12345-6 · Corrente</div>
        <div style={{ marginTop: 4 }}>
          <TituloM icone="conciliacao" tam={20}>Outubro de 2026</TituloM>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <BotaoM tam={13}>Revisar conciliação</BotaoM>
          <BotaoM tam={13} icone="exportar">Exportar Excel</BotaoM>
        </div>
        <CartaoM pad={16} style={{ marginTop: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: M.vermelho, lineHeight: 1.35 }}>Com divergência: 1 dia não fecha, diferença de R$ 58,90.</div>
          <div style={{ fontSize: 12, color: M.suave, marginTop: 8, lineHeight: 1.4 }}>Banco: 214 de 215 linhas casadas (99,5%) · ERP: 214 de 214 (100%)</div>
        </CartaoM>
        <div style={{ marginTop: 10 }}>
          {DIASC.map(([d, b, e, ok], i) => {
            const k = rampa(frame, linha + i * 7, 6);
            return (
              <div key={d} style={{ padding: "9px 12px", borderRadius: 4, border: `1px solid ${k > 0.5 ? (ok ? M.verdeForte : M.vermelho) : M.borda}`, marginTop: 6, fontSize: 12.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{d}</span>
                  <span>Banco {b}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                  <span>ERP {e}</span>
                  <span style={{ color: ok ? M.verde : M.vermelho, opacity: k }}>{ok ? "✓ Fecha" : "Não fecha (58,90)"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TelaM>
  );
};

// ---------- Prospecção
const CAMPANHAS: [string, string, number, number][] = [["Lojas de acabamento · Recife", "Google Maps", 227, 41], ["Construtoras · Fortaleza", "LinkedIn", 180, 36]];
export type Campanha = [string, string, number, number];
export const ProspeccaoM: React.FC<P & { readonly campanhas?: readonly Campanha[] }> = ({ c, campanhas = CAMPANHAS }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const maps = frame >= m("Google") - 4 && frame < m("LinkedIn") - 4;
  const linkedin = frame >= m("LinkedIn") - 4 && frame < m("qualifica") - 4;
  const qualifica = frame >= m("qualifica") - 4;
  const crm = m("CRM") - 4;
  const bruna = OUTROS.bruna;
  return (
    <TelaM rola={rolagem(c, 0, [[m("Google"), 104]])}>
      <TituloM icone="prospeccao">Prospecção</TituloM>
      <DescricaoM>Cada campanha é uma busca de leads com filtros, ritmo e recorrência. Abra uma para ver as execuções e mandar ao CRM.</DescricaoM>
      <CartaoM pad={14} style={{ marginTop: 14 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Avatar nome={bruna.nome} cor={bruna.cor} foto={bruna.foto} tam={38} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Campanhas</div>
            <div style={{ fontSize: 12, color: M.suave, lineHeight: 1.35 }}>A Bruna monta a busca, você confere o resultado e decide quando mandar ao CRM.</div>
          </div>
        </div>
        <BotaoM tipo="branco" style={{ marginTop: 10 }}>+ Nova prospecção</BotaoM>
        {campanhas.map(([n, f, l, q], i) => {
          const acesa = (f === "Google Maps" && maps) || (f === "LinkedIn" && linkedin);
          const env = Math.round(q * rampa(frame, crm + i * 4, 16));
          return (
            <CartaoM key={n} pad={13} aceso={acesa} style={{ marginTop: 12 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{n}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 7 }}>
                <ChipM cheio>{f}</ChipM>
                <ChipM cor={M.suave}>Toda semana</ChipM>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center", marginTop: 12 }}>
                {[[String(l), "leads", false], [String(q), "qualificados", qualifica], [String(env), "no CRM", frame >= crm]].map(([v, r, on]) => (
                  <div key={String(r)}>
                    <div style={{ fontSize: 20, fontWeight: 600, color: on ? M.verde : "white" }}>{v}</div>
                    <div style={{ fontSize: 11, color: M.suave }}>{r}</div>
                  </div>
                ))}
              </div>
            </CartaoM>
          );
        })}
      </CartaoM>
    </TelaM>
  );
};

// ---------- Logs, com o consumo de IA subindo por cima no fim
const LOGS: [string, string, string, string, string][] = [
  ["14:32", "Paula Moreira", "Gestor", "Compras", "Aprovou a sugestão de compra da semana"],
  ["14:28", "Ricardo Lima", "Colaborador", "Comercial", "Abriu o Painel de KPIs"],
  ["14:21", "Marina Costa", "Gestor", "Marketing", "Pediu ao Olho de Deus o resumo da campanha"],
  ["14:05", "Jorge Almeida", "Admin", "Todos", "Convidou um novo membro"],
  ["13:52", "Paula Moreira", "Gestor", "Compras", "Exportou a lista de ruptura"],
];
export const LogsM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const setor = frame >= m("setor") - 4 && frame < m("histórico") - 4;
  const historico = frame >= m("histórico") - 4;
  const consumo = m("consumo") - 4;
  const s = useMola(consumo);
  return (
    <TelaM
      rola={rolagem(c, 0, [[m("setor"), 106]])}
      fixo={
        s > 0 ? (
          <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, transform: `translateY(${(1 - s) * 220}px)` }}>
            <CartaoM aceso style={{ background: M.cardSolido }}>
              <div style={{ fontSize: 13, color: M.suave }}>Créditos consumidos</div>
              <div style={{ fontSize: 28, fontWeight: 600, marginTop: 6, color: M.verde }}>18%</div>
              <div style={{ fontSize: 12, color: M.suave }}>do limite definido pela empresa</div>
              <div style={{ height: 8, borderRadius: 4, background: M.destaque, marginTop: 12 }}>
                <div style={{ width: `${18 * rampa(frame, consumo + 6, 20)}%`, height: "100%", borderRadius: 4, background: M.verde }} />
              </div>
            </CartaoM>
          </div>
        ) : null
      }
    >
      <TituloM icone="logs">Logs</TituloM>
      <DescricaoM>O que as pessoas fizeram nos últimos 60 dias. Registros mais antigos são apagados automaticamente.</DescricaoM>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <SeletorM style={{ flex: 1 }}>7 dias</SeletorM>
        <SeletorM aceso={setor} style={{ flex: 2 }}>{setor ? "Compras" : "Todos os setores"}</SeletorM>
      </div>
      <div style={{ fontSize: 12, letterSpacing: "0.04em", color: M.suave, marginTop: 14 }}>QUINTA-FEIRA, 05 DE NOVEMBRO</div>
      <div style={{ border: `1px solid ${historico ? M.verde : M.borda}`, borderRadius: 6, marginTop: 8 }}>
        {LOGS.filter((l) => !setor || l[3] === "Compras").map(([h, q, p, se, a], i) => (
          <div key={h} style={{ display: "flex", gap: 10, padding: "11px 12px", borderTop: i ? `1px solid ${M.borda}` : "none" }}>
            <span style={{ fontSize: 12, color: M.suave }}>{h}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
                <b style={{ fontWeight: 600 }}>{q}</b>
                <span style={{ color: M.suave, fontSize: 11 }}>{p}</span>
                <ChipM cor={M.suave} style={{ fontSize: 10 }}>{se}</ChipM>
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{a}</div>
            </div>
          </div>
        ))}
      </div>
    </TelaM>
  );
};

// ---------- Mini Apps: da planilha ou da ideia para o app no celular
const VISTAS: [string, string][] = [["formulário", "Formulário"], ["tabela", "Tabela"], ["quadro", "Quadro"], ["painel", "Painel"]];
export const MiniAppsM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const app = m("aplicativo") - 6;
  const planilha = frame >= m("planilha") - 4 && frame < m("ideia") - 4;
  const ideia = frame >= m("ideia") - 4;
  const vista = [...VISTAS].reverse().find(([p]) => frame >= m(p) - 4)?.[1] ?? "Formulário";
  if (frame < app) {
    return (
      <TelaM>
        <TituloM icone="apps">Mini Apps</TituloM>
        <DescricaoM>Apps feitos de uma planilha ou de uma ideia: formulário, tabela e compartilhamento por papel.</DescricaoM>
        <BotaoM tipo="branco" style={{ marginTop: 12 }}>+ Novo app</BotaoM>
        <CartaoM style={{ marginTop: 14, textAlign: "center" }}>
          <div style={{ fontSize: 14, color: M.suave, lineHeight: 1.45 }}>Transforme uma planilha ou descreva o que você quer controlar.</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
            <BotaoM tipo="branco" aceso={planilha}>Da planilha</BotaoM>
            <BotaoM aceso={ideia}>✦ Da ideia</BotaoM>
          </div>
          {ideia && <div style={{ marginTop: 12, padding: "9px 12px", textAlign: "left", fontSize: 13.5, lineHeight: 1.4, borderRadius: 4, border: `1px solid ${M.borda}`, opacity: rampa(frame, m("ideia") - 2, 8) }}>Quero controlar as visitas dos vendedores às obras, com foto.</div>}
        </CartaoM>
        {[["Planilha de visitas", "Cada linha vira um registro; o vendedor preenche pelo celular, com foto."], ["Pedidos de compra", "O comprador lança, o gestor consulta, o financeiro baixa a planilha."]].map(([t, d]) => (
          <CartaoM key={t} pad={13} style={{ marginTop: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div>
            <div style={{ fontSize: 12.5, color: M.suave, marginTop: 4, lineHeight: 1.4 }}>{d}</div>
          </CartaoM>
        ))}
      </TelaM>
    );
  }
  return (
    <TelaM>
      <div style={{ opacity: rampa(frame, app, 10) }}>
        <div style={{ fontSize: 13, color: M.suave }}>← Mini Apps</div>
        <div style={{ marginTop: 10 }}>
          <TituloM tam={21}>Visitas às obras</TituloM>
        </div>
        <DescricaoM>Loja Modelo · equipe de vendas</DescricaoM>
        <div style={{ marginTop: 10 }}>
          <AbasM abas={VISTAS.map(([, t]) => t)} ativa={vista} />
        </div>
        {vista === "Formulário" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {["Obra", "Vendedor", "Data da visita"].map((f) => (
              <div key={f}>
                <div style={{ fontSize: 12.5, color: M.suave, marginBottom: 4 }}>{f}</div>
                <SeletorM> </SeletorM>
              </div>
            ))}
            <div style={{ height: 64, borderRadius: 4, border: `1px dashed ${M.borda}`, color: M.suave, fontSize: 13, display: "grid", placeItems: "center" }}>Foto da obra</div>
            <BotaoM tipo="verde" style={{ justifyContent: "center" }}>Registrar visita</BotaoM>
          </div>
        )}
        {vista === "Tabela" && (
          <div style={{ marginTop: 10 }}>
            {["Residencial Aurora · Paula", "Ed. Mirante · Ricardo", "Casa Jardins · Marina", "Cond. Alto Verde · Paula"].map((l) => (
              <div key={l} style={{ padding: "12px 4px", fontSize: 14, borderBottom: `1px solid ${M.borda}` }}>
                {l}
              </div>
            ))}
          </div>
        )}
        {vista === "Quadro" && (
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {["A visitar", "Visitada", "Pedido"].map((col, i) => (
              <div key={col} style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, color: M.suave }}>{col}</div>
                {Array.from({ length: 3 - i }, (_, k) => (
                  <div key={k} style={{ height: 58, borderRadius: 4, background: "white", marginTop: 6 }} />
                ))}
              </div>
            ))}
          </div>
        )}
        {vista === "Painel" && (
          <Grade>
            <NumeroM rotulo="Visitas no mês" valor="48" />
            <NumeroM rotulo="Viraram pedido" valor="17" />
            <NumeroM rotulo="Conversão" valor="35%" cor={M.verde} />
          </Grade>
        )}
      </div>
    </TelaM>
  );
};
