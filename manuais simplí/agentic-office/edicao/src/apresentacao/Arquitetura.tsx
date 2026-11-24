import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COR, Icone, rota } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { CINZA, fontFamily, fonteApp, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Etiqueta, Surge } from "../verbas/Montagem";
import { CENTRO } from "./Agentes";
import { Abas, atual, Avatar, Botao, Cartao, CenaJanela, Chip, EXECUTORES, MENU_AGENTES, MENU_ORGANIZACAO, rampa, Selo, Titulo } from "./comum";

type P = { readonly c: Cena; readonly extras?: boolean };
const ag = (nome: string) => EXECUTORES.find((a) => a.nome === nome)!;

// linha que se desenha de (x1,y1) até (x2,y2) a partir do frame `de`
const Traco: React.FC<{ readonly x1: number; readonly y1: number; readonly x2: number; readonly y2: number; readonly de: number; readonly opacidade?: number }> = ({ x1, y1, x2, y2, de, opacidade = 0.8 }) => {
  const frame = useCurrentFrame();
  const k = rampa(frame, de, 12);
  if (k <= 0) return null;
  return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke={VERDE} strokeOpacity={opacidade} strokeWidth={4} strokeLinecap="round" />;
};

// ---------- arquitetura-1: pedido → orquestrador → três decisões
const DECISOES = [
  { palavra: "formato", rotulo: "FORMATO DA ENTREGA", texto: "Post + e-mail + arte", y: 230 },
  { palavra: "responsável", rotulo: "RESPONSÁVEL", texto: "Vicente · copy", y: 420 },
  { palavra: "equipe", rotulo: "EQUIPE", texto: "Rafael, Íris e Vicente", y: 610 },
];
export const Arquitetura1: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const orq = m("orquestrador");
  const giro = useCurrentFrame() * 1.2;
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 90, textAlign: "center" }}>
        <Etiqueta>POR DENTRO</Etiqueta>
      </Surge>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <Traco x1={640} y1={480} x2={830} y2={480} de={orq - 6} />
        {DECISOES.map((d) => (
          <Traco key={d.palavra} x1={1090} y1={480} x2={1230} y2={d.y + 75} de={m(d.palavra) - 8} />
        ))}
      </svg>
      <Surge de={m("pede") - 6} style={{ left: 110, top: 360 }}>
        <div style={{ width: 520, boxSizing: "border-box", padding: "26px 30px", borderRadius: 18, background: "#141815", border: "1px solid #2A2F2B" }}>
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: VERDE }}>PEDIDO</div>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 32, color: "white", lineHeight: 1.3, marginTop: 10 }}>“Prepare a campanha do Dia do Cliente da Loja Modelo”</div>
        </div>
      </Surge>
      <Surge de={orq - 4} style={{ left: 830, top: 350 }}>
        <div style={{ position: "relative", width: 260, height: 260 }}>
          <svg width={260} height={260} style={{ position: "absolute", transform: `rotate(${giro}deg)` }}>
            <circle cx={130} cy={130} r={122} fill="none" stroke={VERDE} strokeWidth={4} strokeDasharray="40 18" />
          </svg>
          <div style={{ position: "absolute", inset: 24, borderRadius: "50%", background: "radial-gradient(circle, rgba(60,224,30,0.35), #141815 70%)", display: "grid", placeItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <Icone nome="integracoes" tam={56} cor="white" />
              <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 18, letterSpacing: 2, color: "white", marginTop: 6 }}>ORQUESTRADOR</div>
            </div>
          </div>
        </div>
      </Surge>
      {DECISOES.map((d, i) => (
        <Surge key={d.palavra} de={m(d.palavra) - 4} style={{ left: 1230, top: d.y }}>
          <div style={{ width: 560, height: 150, boxSizing: "border-box", padding: "22px 28px", borderRadius: 16, background: "#141815", border: `2px solid ${VERDE}`, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 44, color: VERDE }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: CINZA }}>{d.rotulo}</div>
              <div style={{ fontFamily, fontWeight: 800, fontSize: 32, color: "white", marginTop: 6 }}>{d.texto}</div>
            </div>
            {i === 1 && <Avatar nome="Vicente" cor={ag("Vicente").cor} foto={ag("Vicente").foto} tam={72} />}
            {i === 2 && (
              <div style={{ display: "flex" }}>
                {["Rafael", "Íris", "Vicente"].map((n, k) => (
                  <div key={n} style={{ marginLeft: k ? -18 : 0 }}>
                    <Avatar nome={n} cor={ag(n).cor} foto={ag(n).foto} tam={64} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Surge>
      ))}
    </>
  );
};

// ---------- arquitetura-2: as três partes rodam ao mesmo tempo
const FAIXAS = [
  { nome: "Rafael", tarefa: "Pesquisa de tendências do varejo", vel: 1 },
  { nome: "Íris", tarefa: "Arte do post e do e-mail", vel: 0.8 },
  { nome: "Vicente", tarefa: "Texto do e-mail e da legenda", vel: 0.9 },
];
export const Arquitetura2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const corre = m("rodar") - 6;
  const junta = m("especialista") - 6;
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 110, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 70, color: "white" }}>
          tudo <span style={textoDegrade}>ao mesmo tempo</span>
        </div>
      </Surge>
      {FAIXAS.map((f, i) => {
        const a = ag(f.nome);
        const k = Math.min(1, Math.max(0, (frame - corre) / (95 * f.vel)));
        const y = 290 + i * 170;
        return (
          <Surge key={f.nome} de={m(["pesquisa", "imagem", "texto"][i]) - 6} style={{ left: 150, top: y }}>
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={110} />
              <div style={{ width: 300 }}>
                <div style={{ fontFamily, fontWeight: 800, fontSize: 34, color: "white" }}>{a.nome}</div>
                <div style={{ fontFamily, fontWeight: 600, fontSize: 22, color: CINZA }}>{f.tarefa}</div>
              </div>
              <div style={{ width: 640, height: 22, borderRadius: 11, background: "#1F2420", overflow: "hidden" }}>
                <div style={{ width: `${k * 100}%`, height: "100%", background: a.cor, borderRadius: 11, boxShadow: `0 0 20px ${a.cor}` }} />
              </div>
              <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 24, color: k >= 1 ? VERDE : CINZA, width: 80 }}>{k >= 1 ? "✓" : `${Math.round(k * 100)}%`}</div>
            </div>
          </Surge>
        );
      })}
      <Surge de={junta} style={{ left: 1500, top: 420 }}>
        <div style={{ ...TITULO, fontSize: 30, color: "#0B0B0C", background: VERDE, padding: "18px 26px", borderRadius: 14, boxShadow: "0 0 50px rgba(60,224,30,0.4)" }}>ENTREGA PRONTA</div>
      </Surge>
    </>
  );
};

// ---------- arquitetura-3: os quatro recursos + a Base de conhecimento
const RECURSOS = ["CONHECIMENTO", "MEMÓRIA", "HABILIDADES", "FERRAMENTAS"];
const ESFERAS: [string, number, number, number][] = [
  ["Comercial e Marketing", 360, 470, 100],
  ["Compras e Estoque", 640, 380, 80],
  ["Financeiro", 880, 560, 70],
  ["Atendimento e Pós-venda", 560, 680, 64],
  ["Recursos Humanos", 1090, 410, 56],
  ["Lojas", 200, 700, 52],
];
const TelaBase: React.FC<{ readonly busca: number; readonly resposta: number }> = ({ busca, resposta }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Titulo icone="base" titulo="BASE DE CONHECIMENTO" descricao="Os documentos da empresa, organizados por setor, que os agentes consultam antes de responder." direita={<Botao cheio>Nova base</Botao>} />
      {[
        ["Bases", "14"],
        ["Setores", "8"],
        ["Documentos", "326"],
      ].map(([r, v], i) => (
        <Cartao key={r} x={40 + i * 430} y={170} w={410} h={84} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, color: COR.suave }}>{r}</span>
          <span style={{ fontSize: 36, fontWeight: 700 }}>{v}</span>
        </Cartao>
      ))}
      {ESFERAS.map(([nome, x, y, r], i) => {
        const dy = Math.sin(frame / 25 + i) * 8;
        return (
          <div key={nome} style={{ position: "absolute", left: x - r, top: y - r + dy, width: r * 2, height: r * 2 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #9DF57F, #2FB344 45%, #0E3B16 100%)", boxShadow: `0 0 ${i === 0 ? 70 : 30}px rgba(60,224,30,${i === 0 ? 0.55 : 0.3})`, opacity: 0.9 }} />
            <div style={{ position: "absolute", top: r * 2 + 8, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap", fontSize: 17, color: COR.texto, background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: 6 }}>{nome}</div>
          </div>
        );
      })}
      {frame >= busca && (
        <Cartao x={700} y={300} w={600} h={380} aceso style={{ background: "#141815" }}>
          <div style={{ fontFamily: fonteMono, fontSize: 15, letterSpacing: 2, color: VERDE }}>BUSCA INTELIGENTE</div>
          <div style={{ marginTop: 12, border: `1px solid ${COR.borda}`, borderRadius: 8, padding: "12px 14px", fontSize: 20 }}>Qual o prazo de troca de um porcelanato com defeito?</div>
          {frame >= resposta && (
            <div style={{ marginTop: 18, opacity: rampa(frame, resposta, 10) }}>
              <div style={{ fontSize: 15, color: COR.suave }}>Política de Trocas 2026 · Atendimento · pág. 3</div>
              <div style={{ fontSize: 21, lineHeight: 1.5, marginTop: 8 }}>
                “Produtos com defeito de fabricação podem ser trocados em até <b style={{ color: VERDE }}>90 dias</b>, com a nota fiscal, em qualquer loja da rede.”
              </div>
            </div>
          )}
        </Cartao>
      )}
    </>
  );
};
export const Arquitetura3: React.FC<P> = ({ c, extras = true }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const troca = m("primeiro") - 4;
  const saiTiles = interpolate(frame, [troca, troca + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entraJanela = interpolate(frame, [troca, troca + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      {extras && saiTiles > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: saiTiles }}>
          <Surge de={0} style={{ left: 0, right: 0, top: 200, textAlign: "center" }}>
            <div style={{ ...TITULO, fontSize: 70, color: "white" }}>
              cada agente tem <span style={textoDegrade}>quatro recursos</span>
            </div>
          </Surge>
          {RECURSOS.map((r, i) => (
            <Surge key={r} de={m("recursos") - 6 + i * 5} style={{ left: 150 + i * 420, top: 420 }}>
              <div style={{ width: 380, height: 220, boxSizing: "border-box", borderRadius: 18, border: `2px solid ${VERDE}`, background: "#141815", padding: 30 }}>
                <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 46, color: VERDE }}>0{i + 1}</div>
                <div style={{ ...TITULO, fontSize: 36, color: "white", marginTop: 30 }}>{r}</div>
              </div>
            </Surge>
          ))}
        </div>
      )}
      {entraJanela > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: entraJanela }}>
          <CenaJanela ativo="Base de conhecimento" menu={MENU_AGENTES} quadros={rota(CENTRO, [[m("busca"), 1.15, 1150, 540]], c.dur)}>
            <TelaBase busca={m("busca") - 4} resposta={m("casa") - 4} />
          </CenaJanela>
          {extras && <Selo de={troca + 4} numero="01" texto="CONHECIMENTO" />}
        </div>
      )}
    </>
  );
};

// ---------- arquitetura-4: Memória por setor, atualizada toda madrugada
const SETORES_MEMORIA: [string, number][] = [
  ["Comercial e Marketing", 7],
  ["Compras e Estoque", 5],
  ["Financeiro", 4],
  ["Atendimento e Pós-venda", 6],
  ["Lojas", 3],
  ["Diretoria", 8],
];
export const Arquitetura4: React.FC<P> = ({ c, extras = true }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const tarefa = m("tarefa");
  const dias = m("dias");
  return (
    <>
      <CenaJanela ativo="Memória" menu={MENU_ORGANIZACAO} quadros={rota(CENTRO, [[m("lembra"), 1.12, 980, 560]], c.dur)}>
        <Titulo
          icone="memoria"
          titulo="MEMÓRIA"
          descricao="O que cada setor viveu, resumido toda madrugada a partir do que as pessoas e os agentes fizeram, e o que a empresa quer que todo agente saiba."
        />
        <Cartao x={40} y={170} w={1260} h={150}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Memória da empresa</div>
          <div style={{ fontSize: 19, color: COR.texto, lineHeight: 1.5, marginTop: 8 }}>
            A Loja Modelo tem 4 lojas e um centro de distribuição. Margem mínima de 22% em qualquer promoção. Campanhas passam pela aprovação do diretor comercial.
          </div>
        </Cartao>
        <div style={{ position: "absolute", left: 40, top: 350, fontSize: 26, fontWeight: 700 }}>Setores</div>
        {SETORES_MEMORIA.map(([nome, v], i) => {
          const x = 40 + (i % 3) * 425;
          const y = 400 + Math.floor(i / 3) * 210;
          const sobe = i === 0 && frame >= tarefa;
          const aceso = (i === 0 && frame >= tarefa - 4 && frame < dias - 4) || frame >= dias - 4;
          return (
            <Cartao key={nome} x={x} y={y} w={405} h={190} aceso={aceso}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{nome}</div>
              <div style={{ fontSize: 18, color: COR.suave, marginTop: 8 }}>
                Memória v{sobe ? v + 1 : v} · até {sobe ? "02" : "01"}/11/2026
              </div>
              <Chip cheio style={{ marginTop: 14 }}>
                {sobe ? "ATUALIZADA AGORA" : "EM DIA"}
              </Chip>
              <div style={{ fontSize: 16, color: aceso ? VERDE : COR.suave, marginTop: 14 }}>gerada em 02/11/2026, 00:00</div>
            </Cartao>
          );
        })}
      </CenaJanela>
      {extras && <Selo de={m("memória") - 4} numero="02" texto="MEMÓRIA" />}
    </>
  );
};

// ---------- arquitetura-5: Habilidades
const PASSOS = ["Buscar as vendas da semana no ERP", "Comparar com a semana anterior e com a meta", "Destacar as lojas abaixo da meta", "Gerar o PDF com a marca da Loja Modelo"];
const OUTRAS_HAB = ["Análise de fornecedor", "Briefing de campanha", "Política de trocas", "Cotação de compras"];
export const Arquitetura5: React.FC<P> = ({ c, extras = true }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const passo = m("executar") - 10;
  const importa = frame >= m("importar") - 6;
  const chega = m("skill") + 4;
  return (
    <>
      <CenaJanela ativo="Habilidades" menu={MENU_AGENTES} quadros={rota(CENTRO, [[m("procedimentos"), 1.15, 760, 560], [m("importar") - 14, ...CENTRO]], c.dur)}>
        <Titulo
          icone="varinha"
          titulo="HABILIDADES"
          descricao="Procedimentos que ensinam o agente a executar um processo do jeito da sua empresa."
          direita={
            <div style={{ display: "flex", gap: 12 }}>
              <Botao icone="importar" style={importa ? { borderColor: VERDE, color: VERDE, boxShadow: "0 0 24px rgba(60,224,30,0.45)" } : undefined}>
                Importar skill
              </Botao>
              <Botao cheio icone="mais">
                Nova habilidade
              </Botao>
            </div>
          }
        />
        <Cartao x={40} y={180} w={760} h={600} aceso>
          <Chip>HABILIDADE · CÉSAR</Chip>
          <div style={{ fontSize: 30, fontWeight: 700, marginTop: 14 }}>Relatório semanal de vendas</div>
          <div style={{ fontSize: 19, color: COR.suave, marginTop: 6 }}>Usada toda segunda-feira pela rotina das 8h.</div>
          {PASSOS.map((p, i) => {
            const k = rampa(frame, passo + i * 9, 8);
            return (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 26, fontSize: 22 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", background: k > 0.5 ? VERDE : "#1F2420", color: k > 0.5 ? "#0B0B0C" : COR.suave, fontWeight: 800 }}>{k > 0.5 ? "✓" : i + 1}</div>
                <span style={{ color: k > 0.5 ? "white" : COR.suave }}>{p}</span>
              </div>
            );
          })}
        </Cartao>
        {OUTRAS_HAB.map((h, i) => (
          <Cartao key={h} x={830} y={180 + i * 150} w={470} h={130}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{h}</div>
            <div style={{ fontSize: 17, color: COR.suave, marginTop: 8 }}>{3 + i} passos · {["César", "Vicente", "Clara", "Mei"][i]}</div>
          </Cartao>
        ))}
      </CenaJanela>
      {extras && <Selo de={m("habilidades") - 4} numero="03" texto="HABILIDADES · SKILLS" />}
      {/* skill criada em outra IA chegando pela importação */}
      {extras && (
        <Surge de={chega} style={{ left: 1150, top: 330 }}>
          <SkillImportada />
        </Surge>
      )}
    </>
  );
};
export const SkillImportada: React.FC = () => (
        <div style={{ width: 560, boxSizing: "border-box", padding: "28px 32px", borderRadius: 20, background: "#141815", border: `2px solid ${VERDE}`, boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(60,224,30,0.25)" }}>
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: VERDE }}>SKILL IMPORTADA</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
            <div style={{ width: 56, height: 68, borderRadius: 8, background: "#1F2420", border: `1px solid ${COR.borda}`, display: "grid", placeItems: "center", fontFamily: fonteMono, fontSize: 15, color: COR.suave }}>.md</div>
            <div>
              <div style={{ fontFamily: fonteApp, fontSize: 26, fontWeight: 700, color: "white" }}>Análise de curva ABC</div>
              <div style={{ fontFamily: fonteApp, fontSize: 18, color: COR.suave, marginTop: 4 }}>criada em outra IA · 6 passos</div>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <Chip cheio>✓ PRONTA PARA OS AGENTES</Chip>
          </div>
        </div>
);

// ---------- arquitetura-6: ferramentas e mais de mil aplicativos
const APPS: [string, string, number][] = [
  ["Gmail", "#EA4335", 61],
  ["Google Drive", "#1FA463", 48],
  ["Slack", "#611F69", 152],
  ["Notion", "#FFFFFF", 39],
  ["Microsoft Teams", "#5059C9", 222],
  ["Asana", "#F06A6A", 157],
  ["Shopify", "#5E8E3E", 315],
  ["LinkedIn", "#0A66C2", 25],
  ["Google Maps", "#34A853", 20],
  ["HubSpot", "#FF7A59", 208],
  ["Trello", "#0079BF", 74],
  ["Google Agenda", "#4285F4", 31],
  ["Dropbox", "#0061FF", 56],
  ["Zoom", "#2D8CFF", 44],
  ["Pipedrive", "#1A1A1A", 96],
];
export const ARQUIVOS = [
  ["PDF", "pdf"],
  ["PLANILHA", "planilha"],
  ["DOCUMENTO", "documento"],
];
export const Arquitetura6: React.FC<P> = ({ c, extras = true }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const ditos = ["Gmail", "Drive", "Slack", "Notion"].map((p) => m(p));
  const aceso = atual(frame, ditos);
  const rola = interpolate(frame, [m("Notion") + 10, c.dur], [0, -330], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const conecta = m("conecta");
  return (
    <>
      <CenaJanela ativo="Integrações" menu={MENU_ORGANIZACAO} quadros={rota(CENTRO, [], c.dur)}>
        <Titulo icone="integracoes" titulo="INTEGRAÇÕES" descricao="Conecte os sistemas e as contas da empresa para os agentes trabalharem com os seus dados." />
        <Abas x={40} y={150} abas={["Sistema de gestão", "Diversas", "Redes sociais"]} ativa="Diversas" />
        <div style={{ position: "absolute", left: 0, top: 220, right: 0, bottom: 0, overflow: "hidden" }}>
          <div style={{ transform: `translateY(${rola}px)` }}>
            {APPS.map(([nome, cor, acoes], i) => {
              const ligado = i === aceso && frame < m("mil") + 40;
              return (
                <Cartao key={nome} x={40 + (i % 3) * 425} y={10 + Math.floor(i / 3) * 170} w={405} h={150} aceso={ligado}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: cor, color: cor === "#FFFFFF" ? "#111" : "white", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 22 }}>{nome[0]}</div>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{nome}</div>
                  </div>
                  <div style={{ fontSize: 16, color: COR.suave, marginTop: 10 }}>{acoes} ações</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <Botao style={{ height: 36, fontSize: 16, padding: "0 12px" }}>Conectar</Botao>
                    <Botao style={{ height: 36, fontSize: 16, padding: "0 12px" }}>Para a empresa</Botao>
                  </div>
                </Cartao>
              );
            })}
          </div>
        </div>
      </CenaJanela>
      {extras && (
        <>
      <Selo de={m("ferramentas") - 4} numero="04" texto="FERRAMENTAS E INTEGRAÇÕES" />
      {/* arquivos que o agente gera, antes de falar das integrações */}
      {ARQUIVOS.map(([t, p], i) => (
        <Surge key={t} de={m(p) - 4} ate={conecta - 6} style={{ left: 480 + i * 340, top: 420 }}>
          <div style={{ width: 300, height: 200, borderRadius: 18, background: "#141815", border: `2px solid ${VERDE}`, display: "grid", placeItems: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ textAlign: "center" }}>
              <svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke={VERDE} strokeWidth={1.6}>
                <path d="M6 2h9l5 5v15H6zM15 2v5h5" />
              </svg>
              <div style={{ ...TITULO, fontSize: 32, color: "white", marginTop: 8 }}>{t}</div>
            </div>
          </div>
        </Surge>
      ))}
      <Surge de={m("mil") - 6} style={{ left: 1290, top: 190 }}>
        <div style={{ background: "#0B0B0C", border: `2px solid ${VERDE}`, borderRadius: 16, padding: "18px 26px", boxShadow: "0 0 50px rgba(60,224,30,0.3)" }}>
          <div style={{ ...TITULO, fontSize: 64, lineHeight: 1, ...textoDegrade }}>+1.000</div>
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: "white", marginTop: 6 }}>APLICATIVOS</div>
        </div>
      </Surge>
      <Surge de={m("banco") - 6} style={{ left: 1290, top: 380 }}>
        <div style={{ background: VERDE, color: "#0B0B0C", fontFamily, fontWeight: 900, fontSize: 26, borderRadius: 12, padding: "14px 22px" }}>+ BANCO DE DADOS DA EMPRESA</div>
      </Surge>
        </>
      )}
    </>
  );
};

// ---------- arquitetura-7: o modelo certo para cada tarefa
const TAREFAS = ["Pesquisa na web", "Texto de campanha", "Arte do post", "Análise de planilha"];
const MODELOS = ["Modelo rápido", "Modelo de escrita", "Modelo de imagem", "Modelo de raciocínio"];
export const Arquitetura7: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const escolhe = m("escolhe");
  return (
    <>
      <Surge de={m("vários") - 6} style={{ left: 0, right: 0, top: 110, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 66, color: "white" }}>
          o <span style={textoDegrade}>modelo certo</span> para cada tarefa
        </div>
      </Surge>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        {TAREFAS.map((t, i) => (
          <Traco key={t} x1={640} y1={330 + i * 130} x2={1180} y2={330 + i * 130} de={escolhe + i * 5} opacidade={0.6} />
        ))}
      </svg>
      {TAREFAS.map((t, i) => (
        <Surge key={t} de={6 + i * 4} style={{ left: 200, top: 290 + i * 130 }}>
          <div style={{ width: 440, boxSizing: "border-box", padding: "20px 26px", borderRadius: 14, background: "#141815", border: "1px solid #2A2F2B", fontFamily, fontWeight: 700, fontSize: 28, color: "white" }}>{t}</div>
        </Surge>
      ))}
      {MODELOS.map((t, i) => (
        <Surge key={t} de={escolhe + 6 + i * 5} style={{ left: 1180, top: 290 + i * 130 }}>
          <div style={{ width: 460, boxSizing: "border-box", padding: "20px 26px", borderRadius: 14, background: "rgba(60,224,30,0.1)", border: `2px solid ${VERDE}`, fontFamily, fontWeight: 800, fontSize: 28, color: VERDE }}>{t}</div>
        </Surge>
      ))}
    </>
  );
};

