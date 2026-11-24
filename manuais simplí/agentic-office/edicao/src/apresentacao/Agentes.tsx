import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { caminho, COR, Cursor, Digitando, Icone, rota } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Etiqueta, Surge } from "../verbas/Montagem";
import { AREA, Avatar, Botao, CenaJanela, Chip, DIRETORIA, EXECUTORES, MENU_AGENTES, rampa, Titulo, useMola } from "./comum";

type P = { readonly c: Cena };
// um pouco afastada e mais baixa, para a etiqueta do capítulo não cobrir a barra da janela
export const CENTRO: readonly [number, number, number] = [0.97, 820, 455];

// ---------- Tela AI Agents: os cinco executores lado a lado
const CARTAO = (i: number) => ({ x: 40 + i * 256, y: 290, w: 236, h: 560 });
// centro do cartão em coordenadas da janela (para a câmera)
const centroCartao = (i: number) => ({ x: AREA.x + CARTAO(i).x + 118, y: AREA.y + CARTAO(i).y + 250 });
const BOTAO_NOVO = { x: AREA.x + AREA.largura - 40 - 92, y: AREA.y + 28 + 26 };

const Pilar: React.FC<{ readonly icone: string; readonly nome: string; readonly n: number }> = ({ icone, nome, n }) => (
  <div style={{ border: `1px solid ${COR.borda}`, borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, fontSize: 15, color: COR.suave }}>
    <Icone nome={icone} tam={16} cor={VERDE} />
    <span style={{ flex: 1, color: COR.texto, fontWeight: 600 }}>{nome}</span>
    <span>{n}</span>
  </div>
);

const TelaAgentes: React.FC<{ readonly entra: number; readonly aceso: number }> = ({ entra, aceso }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Titulo
        icone="agentes"
        titulo="AI AGENTS"
        descricao="O time padrão vem pronto com a plataforma; os personalizados são criados por você."
        direita={
          <>
            <Botao>Ver modelos</Botao>
            <Botao cheio icone="mais">
              Novo agente
            </Botao>
          </>
        }
      />
      <div style={{ position: "absolute", left: 40, top: 190, fontSize: 28, fontWeight: 700 }}>Agentes executores</div>
      <div style={{ position: "absolute", left: 40, top: 232, fontSize: 18, color: COR.suave }}>Quem faz o trabalho: cada um com a sua especialidade, pronto desde o primeiro dia.</div>
      {EXECUTORES.map((a, i) => {
        const p = CARTAO(i);
        const s = interpolate(frame, [entra + i * 5, entra + i * 5 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const ligado = aceso === i;
        return (
          <div
            key={a.nome}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
              boxSizing: "border-box",
              padding: 22,
              borderRadius: 14,
              background: COR.cartao,
              border: `${ligado ? 2 : 1}px solid ${ligado ? a.cor : COR.borda}`,
              borderTop: `3px solid ${a.cor}`,
              boxShadow: ligado ? `0 0 50px ${a.cor}55` : "none",
              opacity: s * (aceso >= 0 && !ligado ? 0.5 : 1),
              transform: `translateY(${(1 - s) * 40}px)`,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={84} brilho={ligado ? 1 : 0} />
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>
              <span style={{ color: VERDE }}>0{i + 1}</span> {a.nome.toUpperCase()}
            </div>
            <div style={{ fontFamily: fonteMono, fontSize: 16, letterSpacing: 2, color: a.cor, fontWeight: 700 }}>{a.papel.toUpperCase()}</div>
            <div style={{ fontSize: 19, lineHeight: 1.4, color: COR.texto, minHeight: 106 }}>{a.descricao}</div>
            <Chip style={{ alignSelf: "flex-start" }}>AGENTE PADRÃO</Chip>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              <Pilar icone="varinha" nome="Habilidades" n={2 + i} />
              <Pilar icone="livro" nome="Conhecimento" n={1 + (i % 3)} />
              <Pilar icone="integracoes" nome="Ferramentas" n={4 + i * 2} />
            </div>
          </div>
        );
      })}
    </>
  );
};

// agentes-1: o time aparece
export const Agentes1: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <CenaJanela ativo="AI Agents" menu={MENU_AGENTES} quadros={rota([1.06, 900, 470], [[m("especialistas"), ...CENTRO]], c.dur)}>
      <TelaAgentes entra={m("time") - 6} aceso={-1} />
    </CenaJanela>
  );
};

// agentes-2 e agentes-3: a câmera vai de agente em agente na hora do nome
const Apresenta: React.FC<P & { readonly nomes: readonly string[]; readonly fecha?: string }> = ({ c, nomes, fecha }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const idx = nomes.map((n) => EXECUTORES.findIndex((a) => a.nome === n));
  const alvos = idx.map((i, k) => [m(nomes[k]), 1.5, centroCartao(i).x, centroCartao(i).y] as const);
  const fim = fecha ? [[m(fecha), ...CENTRO] as const] : [];
  const atual = [...nomes].reverse().find((n) => frame >= m(n) - 6);
  const aceso = fecha && frame >= m(fecha) - 4 ? -1 : atual ? EXECUTORES.findIndex((a) => a.nome === atual) : -1;
  return (
    <CenaJanela ativo="AI Agents" menu={MENU_AGENTES} quadros={rota(CENTRO, [...alvos, ...fim], c.dur)}>
      <TelaAgentes entra={-100} aceso={aceso} />
    </CenaJanela>
  );
};
export const Agentes2: React.FC<P> = ({ c }) => <Apresenta c={c} nomes={["Rafael", "Íris", "Vicente"]} />;
export const Agentes3: React.FC<P> = ({ c }) => <Apresenta c={c} nomes={["César", "Mei"]} fecha="organização" />;

// ---------- Diretoria: organograma (diretores em cima, executores embaixo)
const X_DIRETOR = (i: number) => 160 + i * 200;
const Y_DIRETOR = 420;
const X_EXECUTOR = (i: number) => 560 + i * 200;
const Y_EXECUTOR = 770;

const NoDiretor: React.FC<{ readonly i: number; readonly de: number; readonly brilho: number }> = ({ i, de, brilho }) => {
  const d = DIRETORIA[i];
  const s = useMola(de);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: X_DIRETOR(i) - 90, top: Y_DIRETOR - 70, width: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: s, transform: `scale(${0.6 + 0.4 * s})` }}>
      <Avatar nome={d.nome} cor={d.cor} foto={d.foto} tam={110} brilho={brilho} />
      <div style={{ fontFamily, fontWeight: 800, fontSize: 26, color: "white" }}>{d.nome}</div>
      <Chip cor={d.cor}>{d.sigla}</Chip>
      <div style={{ fontFamily, fontWeight: 600, fontSize: 20, color: "#9AA19C" }}>{d.cargo}</div>
    </div>
  );
};

const NoExecutor: React.FC<{ readonly i: number; readonly de: number; readonly revisado: number }> = ({ i, de, revisado }) => {
  const a = EXECUTORES[i];
  const s = useMola(de);
  const v = useMola(revisado, 12);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: X_EXECUTOR(i) - 80, top: Y_EXECUTOR - 50, width: 160, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: s }}>
      <div style={{ position: "relative" }}>
        <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={92} />
        {v > 0 && (
          <div style={{ position: "absolute", right: -12, top: -8, width: 40, height: 40, borderRadius: "50%", background: VERDE, display: "grid", placeItems: "center", transform: `scale(${v})` }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0B0B0C" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5 9-10" />
            </svg>
          </div>
        )}
      </div>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 24, color: "white" }}>{a.nome}</div>
      <div style={{ fontFamily: fonteMono, fontSize: 15, letterSpacing: 2, color: a.cor, fontWeight: 700 }}>{a.papel.toUpperCase()}</div>
    </div>
  );
};

// agentes-4: os diretores aparecem um a um, no cargo falado
export const Agentes4: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const atual = [...DIRETORIA].reverse().find((d) => frame >= m(d.palavra) - 4);
  return (
    <>
      <Surge de={m("Diretoria") - 6} style={{ left: 0, right: 0, top: 110, textAlign: "center" }}>
        <Etiqueta>A DIRETORIA</Etiqueta>
        <div style={{ ...TITULO, fontSize: 62, color: "white", marginTop: 8 }}>
          agentes no papel de <span style={textoDegrade}>diretores</span>
        </div>
      </Surge>
      {DIRETORIA.map((d, i) => (
        <NoDiretor key={d.nome} i={i} de={m(d.palavra) - 4} brilho={atual === d ? 1 : 0} />
      ))}
    </>
  );
};

// agentes-5: a diretoria supervisiona os executores, revisa as entregas e reporta
export const Agentes5: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const liga = rampa(frame, m("supervisionam") - 4, 20);
  const reporta = m("reportam");
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        {DIRETORIA.flatMap((d, i) =>
          EXECUTORES.map((a, j) => {
            const x1 = X_DIRETOR(i);
            const y1 = Y_DIRETOR + 140;
            const x2 = X_EXECUTOR(j);
            const y2 = Y_EXECUTOR - 60;
            // pulso que sobe do executor ao diretor quando ela fala "reportam"
            const t = ((frame - reporta - ((i + j) % 5) * 4) % 40) / 40;
            const pulsa = frame >= reporta - 2 && t >= 0;
            return (
              <g key={`${i}-${j}`}>
                <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * liga} y2={y1 + (y2 - y1) * liga} stroke={VERDE} strokeOpacity={0.22} strokeWidth={2} />
                {pulsa && <circle cx={x2 + (x1 - x2) * t} cy={y2 + (y1 - y2) * t} r={4} fill={VERDE} opacity={0.9 * (1 - t)} />}
              </g>
            );
          }),
        )}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}>
        <Etiqueta>A DIRETORIA</Etiqueta>
      </div>
      {DIRETORIA.map((d, i) => (
        <NoDiretor key={d.nome} i={i} de={-30} brilho={0} />
      ))}
      <Surge de={m("executores") - 8} style={{ left: 150, top: Y_EXECUTOR - 20 }}>
        <Etiqueta>EXECUTORES</Etiqueta>
      </Surge>
      {EXECUTORES.map((a, i) => (
        <NoExecutor key={a.nome} i={i} de={m("executores") - 6 + i * 3} revisado={m("revisam") + i * 4} />
      ))}
      <Surge de={reporta - 4} style={{ left: 1370, top: 160 }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: "#0B0B0C", background: VERDE, padding: "10px 18px", borderRadius: 8 }}>RELATÓRIO DIÁRIO · 08H</div>
      </Surge>
    </>
  );
};

// ---------- agentes-6: a empresa cria o próprio agente
const MODAL = { x: 270, y: 70, w: 800, h: 720 };
const Campo: React.FC<{ readonly rotulo: string; readonly y: number; readonly h?: number; readonly ativo: boolean; readonly children: React.ReactNode }> = ({ rotulo, y, h = 56, ativo, children }) => (
  <div style={{ position: "absolute", left: 36, right: 36, top: y }}>
    <div style={{ fontSize: 17, color: COR.suave, marginBottom: 8 }}>{rotulo}</div>
    <div
      style={{
        height: h,
        boxSizing: "border-box",
        padding: "14px 16px",
        borderRadius: 8,
        background: "#0E110F",
        border: `${ativo ? 2 : 1}px solid ${ativo ? VERDE : COR.borda}`,
        boxShadow: ativo ? "0 0 24px rgba(60,224,30,0.25)" : "none",
        fontSize: 20,
        lineHeight: 1.45,
        color: COR.texto,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

export const Agentes6: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const abre = m("criar");
  const s = useMola(abre + 4);
  const funcao = m("função");
  const instr = m("instruções");
  const modelo = m("modelo");
  const ferr = m("ferramentas");
  const ativo = (de: number, ate: number) => frame >= de - 4 && frame < ate - 4;
  const ferramentas = ["Gmail", "WhatsApp", "Base de conhecimento", "Banco de dados"];
  const centroModal = { x: AREA.x + MODAL.x + MODAL.w / 2, y: AREA.y + MODAL.y + MODAL.h / 2 };
  return (
    <CenaJanela
      ativo="AI Agents"
      menu={MENU_AGENTES}
      quadros={rota(CENTRO, [[funcao - 4, 1.12, centroModal.x, centroModal.y + 50]], c.dur)}
      fora={<Cursor pontos={caminho([1200, 600], [[abre, BOTAO_NOVO.x, BOTAO_NOVO.y], [funcao + 30, AREA.x + MODAL.x + 700, AREA.y + MODAL.y + 690]])} cliques={[abre]} />}
    >
      <TelaAgentes entra={-100} aceso={-1} />
      {s > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.6 * s})` }} />
          <div
            style={{
              position: "absolute",
              left: MODAL.x,
              top: MODAL.y,
              width: MODAL.w,
              height: MODAL.h,
              borderRadius: 16,
              background: "#151916",
              border: `1px solid ${COR.borda}`,
              boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
              opacity: s,
              transform: `scale(${0.94 + 0.06 * s})`,
            }}
          >
            <div style={{ position: "absolute", left: 36, top: 30, fontSize: 30, fontWeight: 700 }}>Novo agente</div>
            <div style={{ position: "absolute", left: 36, top: 74, fontSize: 18, color: COR.suave }}>Um agente da sua empresa, com função, instruções e ferramentas próprias.</div>
            <Campo rotulo="Nome" y={110} ativo={false}>
              Lia
            </Campo>
            <Campo rotulo="Função" y={200} ativo={ativo(funcao, instr)}>
              <Digitando texto="Atendimento ao cliente" de={funcao} porFrame={1.2} />
            </Campo>
            <Campo rotulo="Instruções" y={290} h={120} ativo={ativo(instr, modelo)}>
              <Digitando
                texto="Responda os clientes no tom da Loja Modelo. Consulte a política de trocas na base de conhecimento e passe para um humano quando o cliente pedir."
                de={instr}
                porFrame={3.2}
              />
            </Campo>
            <Campo rotulo="Modelo de IA" y={450} ativo={ativo(modelo, ferr)}>
              {frame >= modelo ? (
                <span>
                  Automático <span style={{ color: COR.suave }}>· o mais adequado para cada tarefa</span>
                </span>
              ) : (
                <span style={{ color: "#6B726D" }}>Escolha o modelo</span>
              )}
            </Campo>
            <div style={{ position: "absolute", left: 36, right: 36, top: 548 }}>
              <div style={{ fontSize: 17, color: COR.suave, marginBottom: 10 }}>Ferramentas</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {ferramentas.map((f, i) => {
                  const k = rampa(frame, ferr + i * 5, 8);
                  return (
                    <div key={f} style={{ fontSize: 18, padding: "8px 14px", borderRadius: 8, border: `1px solid ${k > 0.5 ? VERDE : COR.borda}`, color: k > 0.5 ? VERDE : COR.suave, background: k > 0.5 ? "rgba(60,224,30,0.1)" : "transparent" }}>
                      {k > 0.5 ? "✓ " : "+ "}
                      {f}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ position: "absolute", right: 36, bottom: 30 }}>
              <Botao cheio>Criar agente</Botao>
            </div>
          </div>
        </>
      )}
    </CenaJanela>
  );
};
