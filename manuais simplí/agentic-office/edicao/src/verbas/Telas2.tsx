import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, Digitando, Icone } from "../agentic/App";
import { fonteMono, VERDE } from "../fonte";
import { type Confianca, FORNECEDORES, GRUPOS, LISTA_AURORA, type NotaErp, PAPEIS, PENDENCIAS, PENDENCIAS_MIG, PESSOAS, type Recebimento, RECEBIMENTOS } from "./dados";
import { AREA } from "./Telas";

// Mais telas do Verbas e Acordos (Caixa do ERP, Recebimentos, Fornecedores, Pendências, página do
// acordo, modais e Configurações). Posições fixas, em px da área do módulo; as constantes
// exportadas já estão em coordenadas da janela (para cursor e câmera).
export const janela = (x: number, y: number) => ({ x: AREA.x + x, y: AREA.y + y });
export const luz = (aceso: boolean | undefined, cor = VERDE): React.CSSProperties =>
  aceso ? { boxShadow: `0 0 0 2px ${cor}, 0 0 30px ${cor}55`, borderRadius: 8 } : {};

export const Caixa: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly children?: React.ReactNode; readonly aceso?: boolean; readonly style?: React.CSSProperties }> = ({
  x,
  y,
  w,
  h,
  children,
  aceso,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: "border-box",
      borderRadius: 12,
      background: COR.cartao,
      border: `${aceso ? 2 : 1}px solid ${aceso ? VERDE : COR.borda}`,
      boxShadow: aceso ? "0 0 40px rgba(60,224,30,0.25)" : "none",
      padding: "18px 22px",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Seletor: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly texto: React.ReactNode; readonly h?: number; readonly aceso?: boolean }> = ({ x, y, w, texto, h = 48, aceso }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: "border-box",
      border: `${aceso ? 2 : 1}px solid ${aceso ? VERDE : COR.borda}`,
      boxShadow: aceso ? "0 0 18px rgba(60,224,30,0.35)" : "none",
      borderRadius: 8,
      background: "#1C201D",
      padding: "0 14px",
      display: "flex",
      alignItems: "center",
      fontSize: 18,
      whiteSpace: "nowrap",
      overflow: "hidden",
    }}
  >
    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{texto}</span>
    <span style={{ color: COR.suave, marginLeft: 8 }}>⌄</span>
  </div>
);

export const BotaoP: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h?: number; readonly cheio?: boolean; readonly clique?: number; readonly children: React.ReactNode; readonly icone?: string }> = ({
  x,
  y,
  w,
  h = 48,
  cheio,
  clique,
  children,
  icone,
}) => {
  const frame = useCurrentFrame();
  const apertado = clique !== undefined && frame >= clique && frame < clique + 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontSize: 18,
        fontWeight: 600,
        background: cheio ? "white" : "transparent",
        color: cheio ? "#0B0B0C" : COR.texto,
        border: `1px solid ${cheio ? "white" : COR.borda}`,
        transform: apertado ? "scale(0.94)" : "none",
        boxShadow: apertado ? `0 0 0 4px ${VERDE}` : "none",
      }}
    >
      {icone && <Icone nome={icone} />}
      {children}
    </div>
  );
};

// modal genérico (abre com mola, fecha em `fecha`)
export const Modal: React.FC<{ readonly de: number; readonly fecha?: number; readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly titulo: string; readonly sub?: string; readonly children: React.ReactNode }> = ({
  de,
  fecha,
  x,
  y,
  w,
  h,
  titulo,
  sub,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - de, fps, config: { damping: 18, stiffness: 160 } });
  const f = fecha === undefined ? 1 : interpolate(frame, [fecha, fecha + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < de || f <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${0.55 * s * f})`, zIndex: 20 }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: 14,
          background: "#141815",
          border: `1px solid ${COR.borda}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          opacity: s * f,
          transform: `translateY(${(1 - s) * 30}px) scale(${0.96 + 0.04 * s})`,
        }}
      >
        <div style={{ position: "absolute", left: 28, top: 24, fontSize: 28, fontWeight: 700 }}>{titulo}</div>
        <div style={{ position: "absolute", right: 28, top: 24, fontSize: 24, color: COR.suave }}>×</div>
        {sub && <div style={{ position: "absolute", left: 28, right: 28, top: 66, fontSize: 17, color: COR.suave, lineHeight: 1.4 }}>{sub}</div>}
        {children}
      </div>
    </div>
  );
};

const Rotulo: React.FC<{ readonly x: number; readonly y: number; readonly children: React.ReactNode }> = ({ x, y, children }) => (
  <div style={{ position: "absolute", left: x, top: y, fontSize: 17, fontWeight: 600 }}>{children}</div>
);

// ======================= Caixa do ERP (desde nov/2026: abas por tipo, notas agrupadas por fornecedor e
// sugestão com motivo e confiança em cada nota)
export type EstadoNota = { tipo: "pendente" } | { tipo: "aceito"; de: number; texto?: string } | { tipo: "dividida"; de: number } | { tipo: "motivo"; de: number } | { tipo: "ignorado"; de: number };
const NOTAS = GRUPOS.flatMap((g) => g.notas);
const PROD = [14000, 6000, 9000, 380];
const NF = [14980, 6420, 9630, 406.6];
const RESULTADO_NOTA = ["✓ Lançada no ACD-0215 · saldo R$ 10.000", "✓ Lançada no ACD-0215 · saldo R$ 4.000", "✓ Dividida: ACD-0214 R$ 6.500 + ACD-0216 R$ 2.500", "Ignorada · motivo: brinde de evento"];
const dinheiro = (v: number) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// geometria (px da área do módulo): a lista rola dentro da caixa que começa em LISTA_Y
const TAB_X = 40;
const DEC_X = 770; // coluna Decisão, relativa à tabela
const DEC_W = 474;
const VAL_FIM = 750; // borda direita da coluna Valor dos produtos
const LISTA_Y = 480;
const GRUPO_H = 52;
const NOTA_H = 236;
const SEL_Y = 128; // seletor do acordo (largura toda), com o Lançar embaixo
const LANCAR_Y = 174;
const LINKS_Y = 216;
const yGrupo = (g: number) => GRUPOS.slice(0, g).reduce((y, gr) => y + GRUPO_H + gr.notas.length * NOTA_H, 0);
const yNota = (i: number) => {
  let k = i;
  for (let g = 0; g < GRUPOS.length; g++) {
    if (k < GRUPOS[g].notas.length) return yGrupo(g) + GRUPO_H + k * NOTA_H;
    k -= GRUPOS[g].notas.length;
  }
  return 0;
};
export const ROLA_GRUPO = (g: number) => yGrupo(g);
// rolagem que deixa a nota i perto do topo da lista (com um pedaço da nota de cima à mostra)
export const ROLA_NOTA = (i: number) => yNota(i) - 70;
// pontos para cursor e câmera, em coordenadas da janela, com a lista rolada `rola` px
const naLista = (x: number, y: number, rola: number) => janela(TAB_X + x, LISTA_Y + y - rola);
export const NOTA = {
  aceitar: (i: number, rola = 0) => naLista(DEC_X + DEC_W - 12 - 46, yNota(i) + 10 + 25, rola),
  sugestao: (i: number, rola = 0) => naLista(DEC_X + DEC_W / 2, yNota(i) + 64, rola),
  lancar: (i: number, rola = 0) => naLista(DEC_X + 44, yNota(i) + LANCAR_Y + 17, rola),
  seletor: (i: number, rola = 0) => naLista(DEC_X + 200, yNota(i) + SEL_Y + 19, rola),
  dividir: (i: number, rola = 0) => naLista(DEC_X + 250 + 70, yNota(i) + LINKS_Y + 10, rola),
  retro: (i: number, rola = 0) => naLista(DEC_X + 100, yNota(i) + LINKS_Y + 10, rola),
  ignorar: (i: number, rola = 0) => naLista(DEC_X + 430 + 26, yNota(i) + LINKS_Y + 10, rola),
  valor: (i: number, rola = 0) => naLista(VAL_FIM - 90, yNota(i) + 44, rola),
  centro: (i: number, rola = 0) => naLista(630, yNota(i) + NOTA_H / 2, rola),
  grupoAceitar: (g: number, rola = 0) => naLista(1260 - 16 - 130, yGrupo(g) + GRUPO_H / 2, rola),
  grupo: (g: number, rola = 0) => naLista(300, yGrupo(g) + GRUPO_H / 2, rola),
};
const COR_CONF: Record<Confianca, string> = { alta: VERDE, média: "#7FB2FF", palpite: COR.suave };

const NotaLinha: React.FC<{ readonly n: NotaErp; readonly i: number; readonly e: EstadoNota; readonly luzes: readonly string[]; readonly cliques: Record<string, number | undefined>; readonly selecao?: string }> = ({ n, i, e, luzes, cliques, selecao }) => {
  const frame = useCurrentFrame();
  const feito = e.tipo === "aceito" || e.tipo === "dividida" || e.tipo === "ignorado";
  const k = feito ? interpolate(frame - e.de, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const tem = (c: string) => luzes.includes(c + i);
  const cor = COR_CONF[n.confianca];
  return (
    <div style={{ position: "absolute", left: 0, top: yNota(i), width: 1260, height: NOTA_H, borderTop: `1px solid ${COR.borda}`, background: feito && e.tipo !== "ignorado" ? `rgba(60,224,30,${0.06 * k})` : "transparent", opacity: e.tipo === "ignorado" ? 1 - 0.45 * k : 1 }}>
      <div style={{ position: "absolute", left: 16, top: 14, fontSize: 19 }}>{n.emissao}</div>
      <div style={{ position: "absolute", left: 16, top: 42, fontSize: 15, color: COR.suave }}>{n.doc}</div>
      <div style={{ position: "absolute", left: 160, top: 14, fontSize: 19, fontWeight: 700 }}>{GRUPOS.find((g) => g.notas.includes(n))?.fornecedor}</div>
      <div style={{ position: "absolute", left: 160, top: 42, fontSize: 14, color: COR.suave }}>{n.erp}</div>
      {n.acao && <div style={{ position: "absolute", left: 160, top: 64, fontSize: 15 }}>{n.acao}</div>}
      <div style={{ position: "absolute", right: 1260 - VAL_FIM, top: 10, textAlign: "right", padding: "4px 8px", ...luz(tem("prod")) }}>
        <div style={{ fontSize: 21, fontWeight: 700 }}>{n.produtos}</div>
      </div>
      <div style={{ position: "absolute", right: 1260 - VAL_FIM, top: 46, textAlign: "right", fontSize: 15, color: COR.suave, lineHeight: 1.35, padding: "2px 8px", ...luz(tem("imp"), COR.amarelo) }}>
        <div>NF {n.nf}</div>
        <div>impostos {n.impostos}</div>
      </div>
      {feito ? (
        <div style={{ position: "absolute", left: DEC_X, top: 74, width: DEC_W, fontSize: 19, fontWeight: 700, color: e.tipo === "ignorado" ? COR.suave : VERDE, opacity: k }}>{(e.tipo === "aceito" && e.texto) || RESULTADO_NOTA[i]}</div>
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              left: DEC_X,
              top: 10,
              width: DEC_W,
              height: 108,
              boxSizing: "border-box",
              borderRadius: 8,
              border: `${n.confianca === "palpite" ? "1px dashed" : "1px solid"} ${cor}`,
              background: n.confianca === "palpite" ? "transparent" : `${cor}14`,
              ...luz(tem("sug"), cor),
            }}
          >
            <div style={{ position: "absolute", left: 12, top: 9, right: 112, fontSize: 15, lineHeight: 1.3 }}>
              {n.ia && <span style={{ color: VERDE }}>✦ </span>}
              <b>{n.sugestao}</b>
              <span style={{ color: COR.suave, marginLeft: 6, padding: "0 4px", ...luz(tem("conf"), cor) }}>· {n.confianca === "palpite" ? "palpite" : `confiança ${n.confianca}`}</span>
            </div>
            <BotaoP x={DEC_W - 12 - 92} y={6} w={92} h={36} cheio clique={cliques[`aceitar${i}`]}>
              Aceitar
            </BotaoP>
            <div style={{ position: "absolute", left: 12, right: 12, top: 52, fontSize: 14, lineHeight: 1.35, color: COR.suave, padding: "1px 4px", ...luz(tem("mot")) }}>{n.motivo}</div>
          </div>
          <div style={{ position: "absolute", left: DEC_X, top: SEL_Y, width: DEC_W, height: 38, ...luz(tem("sel")) }}>
            <Seletor x={0} y={0} w={DEC_W} h={38} texto={selecao ?? n.acordo} aceso={tem("selab")} />
          </div>
          <div style={{ position: "absolute", left: DEC_X, top: LANCAR_Y, width: 88, height: 34, ...luz(tem("lan")) }}>
            <BotaoP x={0} y={0} w={88} h={34} cheio clique={cliques[`lancar${i}`]}>
              Lançar
            </BotaoP>
          </div>
          {e.tipo === "motivo" ? (
            <div style={{ position: "absolute", left: DEC_X, top: LINKS_Y - 2, width: DEC_W, height: 26, boxSizing: "border-box", border: `2px solid ${VERDE}`, borderRadius: 6, padding: "0 10px", display: "flex", alignItems: "center", fontSize: 15 }}>
              <span style={{ whiteSpace: "pre" }}>Motivo: </span><Digitando texto="brinde de evento" de={e.de} porFrame={1.2} />
            </div>
          ) : (
            <div style={{ position: "absolute", left: DEC_X, top: LINKS_Y, width: DEC_W, fontSize: 15, color: COR.suave, whiteSpace: "nowrap" }}>
              <span style={{ padding: "1px 4px", ...luz(tem("retro")) }}>Sem acordo: criar retroativo</span>
              <span style={{ position: "absolute", left: 250, padding: "1px 4px", ...luz(tem("div")) }}>Dividir entre acordos</span>
              <span style={{ position: "absolute", left: 430, padding: "1px 4px", ...luz(tem("ign")) }}>Ignorar</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// lista de acordos do seletor de uma nota (abre para cima, com a busca no topo)
const ListaAcordos: React.FC<{ readonly lista: ListaAberta; readonly topo: number; readonly luzes: readonly string[] }> = ({ lista, topo, luzes }) => {
  const f = (lista.filtro ?? "").toLowerCase();
  const grupos = LISTA_AURORA.map((g) => ({ ...g, itens: g.itens.filter((it) => !f || `${it.codigo} ${it.nome} ${it.linha2}`.toLowerCase().includes(f)) })).filter((g) => g.itens.length);
  const altura = 50 + grupos.reduce((h, g) => h + 30 + g.itens.length * 52, 0) + 8;
  return (
    <div style={{ position: "absolute", left: TAB_X + DEC_X, top: topo - altura - 6, width: DEC_W, height: altura, boxSizing: "border-box", borderRadius: 10, background: "#141815", border: `1px solid ${COR.borda}`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", zIndex: 8, overflow: "hidden" }}>
      <div style={{ height: 48, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderBottom: `1px solid ${COR.borda}`, fontSize: 17, ...luz(luzes.includes("busca")) }}>
        <span style={{ color: COR.suave }}>⌕</span>
        {lista.busca ?? <span style={{ color: "#6B726D" }}>Código, descrição, mês ou valor</span>}
      </div>
      {grupos.map((g) => (
        <div key={g.grupo} style={{ padding: "0 6px", ...luz(luzes.includes(`pg-${g.grupo.slice(0, 5)}`)) }}>
          <div style={{ height: 30, display: "flex", alignItems: "flex-end", padding: "0 8px 4px", fontSize: 13, color: COR.suave }}>{g.grupo}</div>
          {g.itens.map((it) => {
            const sug = g.grupo === "Sugerido";
            const aceso = lista.item === it.codigo;
            return (
              <div key={it.codigo} style={{ height: 52, boxSizing: "border-box", padding: "6px 8px 0 30px", borderRadius: 6, position: "relative", background: aceso ? "rgba(60,224,30,0.14)" : sug ? "rgba(255,255,255,0.05)" : "transparent", boxShadow: aceso ? `inset 0 0 0 2px ${VERDE}` : "none" }}>
                {sug && <span style={{ position: "absolute", left: 10, top: 14, fontSize: 14 }}>✓</span>}
                <div style={{ fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {sug ? "★ " : ""}
                  {it.codigo} · {it.nome}
                </div>
                <div style={{ fontSize: 13, color: COR.suave }}>{it.linha2}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export type ListaAberta = { readonly i: number; readonly busca?: React.ReactNode; readonly filtro?: string; readonly item?: string };
export const TelaCaixa: React.FC<{ readonly estados?: readonly EstadoNota[]; readonly luzes?: readonly string[]; readonly rola?: number; readonly cliques?: Record<string, number | undefined>; readonly lista?: ListaAberta; readonly selecoes?: Record<number, string> }> = ({ estados = [], luzes = [], rola = 0, cliques = {}, lista, selecoes = {} }) => {
  const est = NOTAS.map((_, i) => estados[i] ?? { tipo: "pendente" as const });
  const abertas = est.map((e) => e.tipo === "pendente" || e.tipo === "motivo");
  const n = abertas.filter(Boolean).length;
  const prod = PROD.reduce((s, v, i) => s + (abertas[i] ? v : 0), 0);
  const nf = NF.reduce((s, v, i) => s + (abertas[i] ? v : 0), 0);
  let base = 0;
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 250, width: 724, height: 72, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
      <Seletor x={40} y={262} w={190} texto="Pendentes" />
      <Seletor x={240} y={262} w={190} texto="Todo fornecedor" />
      <Seletor x={440} y={262} w={190} texto="Todo comprador" />
      <BotaoP x={640} y={262} w={100} cheio>
        Filtrar
      </BotaoP>
      <div style={{ position: "absolute", right: 40, top: 288, fontSize: 14, color: COR.suave }}>22 mês(es) lidos do ERP, de jan/25 a out/26 · o mês corrente é relido de 2 em 2 h</div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 326, height: 42, borderBottom: `1px solid ${COR.borda}`, display: "flex", gap: 30, fontSize: 18 }}>
        {[`Notas de bonificação (${n})`, "Descontos de fornecedor com verba (2)", "Outros descontos (5)"].map((t, k) => (
          <div key={t} style={{ padding: "6px 12px 0", color: k === 0 ? "white" : COR.suave, fontWeight: k === 0 ? 600 : 400, borderBottom: k === 0 ? "3px solid white" : "3px solid transparent", ...luz((luzes.includes("sub") && k < 2) || luzes.includes(`sub${k}`)) }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 382, fontSize: 18, lineHeight: 1.4 }}>
        <b>{n}</b> nota(s) pendentes, {dinheiro(prod)} em produtos ({dinheiro(nf)} nas NFs, com impostos). {n} com sugestão (aceite com um clique ou decida embaixo); a IA analisa as notas novas de 30 em 30 min.
      </div>
      <div style={{ position: "absolute", left: TAB_X, top: 444, width: 1260, height: 36, borderTop: `1px solid ${COR.borda}`, fontSize: 16, color: COR.suave }}>
        <span style={{ position: "absolute", left: 16, top: 8 }}>Emissão · NF</span>
        <span style={{ position: "absolute", left: 160, top: 8 }}>Fornecedor</span>
        <span style={{ position: "absolute", right: 1260 - VAL_FIM + 8, top: 8 }}>Valor dos produtos</span>
        <span style={{ position: "absolute", left: DEC_X, top: 8 }}>Decisão</span>
      </div>
      <div style={{ position: "absolute", left: TAB_X, top: LISTA_Y, width: 1260, height: 916 - LISTA_Y, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -rola, width: 1260 }}>
          {GRUPOS.map((g, gi) => {
            const ids = g.notas.map((_, j) => base + j);
            base += g.notas.length;
            const altas = ids.filter((i) => NOTAS[i].confianca === "alta" && est[i].tipo === "pendente").length;
            return (
              <div key={g.fornecedor}>
                <div style={{ position: "absolute", left: 0, top: yGrupo(gi), width: 1260, height: GRUPO_H, borderTop: `1px solid ${COR.borda}`, background: "rgba(255,255,255,0.025)", ...luz(luzes.includes(`grupo${gi}`)) }}>
                  <span style={{ position: "absolute", left: 16, top: 14, fontSize: 19, fontWeight: 700 }}>
                    {g.fornecedor} <span style={{ fontSize: 15, fontWeight: 400, color: COR.suave, marginLeft: 8 }}>comprador {g.comprador}</span>
                    <span style={{ fontSize: 15, fontWeight: 400, color: COR.suave, marginLeft: 14, textDecoration: "underline" }}>só este fornecedor</span>
                  </span>
                  <span style={{ position: "absolute", right: altas ? 290 : 16, top: 16, fontSize: 15, color: COR.suave }}>
                    {g.notas.length} nota(s) · {g.total}
                  </span>
                  {altas > 0 && (
                    <div style={{ position: "absolute", right: 16, top: 7, width: 260, height: 38, ...luz(luzes.includes(`gac${gi}`)) }}>
                      <BotaoP x={0} y={0} w={260} h={38} clique={cliques[`grupo${gi}`]}>
                        Aceitar {altas} de confiança alta
                      </BotaoP>
                    </div>
                  )}
                </div>
                {ids.map((i) => (
                  <NotaLinha key={i} n={NOTAS[i]} i={i} e={est[i]} luzes={luzes} cliques={cliques} selecao={selecoes[i]} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {lista && <ListaAcordos lista={lista} topo={LISTA_Y + yNota(lista.i) + SEL_Y - rola} luzes={luzes} />}
    </>
  );
};

// ======================= Recebimentos (abre em "A resolver"; cada linha mostra o acordo junto; avisos
// em coluna própria e as ações empilhadas à direita, como no sistema)
export const BOTAO_LANCAR_REC = janela(1060 + 120, 306 + 24);
const REC_Y = 510;
const REC_H = 100;
const RCOLS = [100, 240, 140, 150, 180, 110, 150, 190];
const rcx = (k: number) => 40 + RCOLS.slice(0, k).reduce((a, b) => a + b, 0);
export const RECEB = {
  usar: janela(rcx(7) + 95, REC_Y + 28),
  linha: (i: number) => janela(640, REC_Y + i * REC_H + REC_H / 2),
  financeiro: janela(rcx(5) + 55, REC_Y + 2 * REC_H),
  aba: janela(110, 370 + 20),
};
const CHIP_REC: Record<Recebimento["situacao"], [string, string]> = { Liquidado: ["#14301A", VERDE], "No prazo": ["#14301A", VERDE], "Parcial – vencido": ["#3A1616", COR.vermelho] };
const AcaoRec: React.FC<{ readonly y: number; readonly borda?: boolean; readonly children: React.ReactNode }> = ({ y, borda, children }) => (
  <div style={{ position: "absolute", left: 10, top: y, width: 160, height: 26, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 15, fontWeight: 600, border: borda ? `1px solid ${COR.borda}` : "1px solid transparent", borderRadius: 6 }}>{children}</div>
);
export const TelaRecebimentos: React.FC<{ readonly finAceso?: boolean; readonly clique?: number; readonly abaAcesa?: boolean; readonly linhaAcesa?: number; readonly avisoAceso?: boolean; readonly corrige?: number }> = ({
  finAceso,
  clique,
  abaAcesa,
  linhaAcesa,
  avisoAceso,
  corrige,
}) => {
  const frame = useCurrentFrame();
  const corrigido = corrige !== undefined && frame >= corrige + 4;
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 250, width: 1000, height: 116, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
      <div style={{ position: "absolute", left: 40, top: 262, width: 440, height: 44, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 8, padding: "0 16px", display: "flex", alignItems: "center", fontSize: 17, color: "#6B726D" }}>
        Nº do documento, fornecedor, acordo…
      </div>
      <Seletor x={492} y={262} w={250} h={44} texto="Toda conferência" />
      <Seletor x={754} y={262} w={262} h={44} texto="Todo aviso" />
      <Seletor x={40} y={312} w={214} h={44} texto="Todo fornecedor" />
      <Seletor x={266} y={312} w={214} h={44} texto="Toda natureza" />
      <BotaoP x={492} y={312} w={250} h={44} cheio>
        Filtrar
      </BotaoP>
      <BotaoP x={1060} y={306} w={240} icone="mais" clique={clique}>
        Lançar recebimento
      </BotaoP>
      <div style={{ position: "absolute", left: 40, right: 40, top: 376, height: 40, borderBottom: `1px solid ${COR.borda}`, display: "flex", gap: 24, fontSize: 18 }}>
        <div style={{ padding: "6px 12px 0", fontWeight: 700, borderBottom: "3px solid white", ...luz(abaAcesa) }}>A resolver ({corrigido ? 3 : 4})</div>
        <div style={{ padding: "6px 12px 0", color: COR.suave }}>Todos (318)</div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 424, fontSize: 14, color: COR.suave }}>
        Aguardando ou divergente na conferência, ou com aviso que pede ação (lançado com os impostos, sem acordo, possível duplicidade, fornecedor diferente). O que está conferido e certo fica em Todos.
      </div>
      <div style={{ position: "absolute", left: 40, top: 446, fontSize: 14, color: COR.suave }}>4 lançamento(s) · R$ 33.389,50 no saldo · 3 aguardando o financeiro conferir no contas a pagar / estoque.</div>
      <div style={{ position: "absolute", left: TAB_X, top: 470, width: 1260, height: 40, borderTop: `1px solid ${COR.borda}`, borderBottom: `1px solid ${COR.borda}`, display: "flex", alignItems: "center", fontSize: 16, fontWeight: 600 }}>
        {["Data", "Acordo", "Fornecedor", "Documento", "Recebido (produtos)", "Financeiro", "Avisos", ""].map((t, k) => (
          <div key={k} style={{ width: RCOLS[k], padding: "0 10px", boxSizing: "border-box", textAlign: k === 4 ? "right" : "left", whiteSpace: "nowrap", ...(k === 5 ? luz(finAceso) : {}) }}>
            {t}
          </div>
        ))}
      </div>
      {RECEBIMENTOS.map((r, i) => {
        const c0 = i === 0 && corrigido;
        const [fundo, cor] = CHIP_REC[r.situacao];
        const aceso = linhaAcesa === i;
        return (
          <div key={r.doc} style={{ position: "absolute", left: TAB_X, top: REC_Y + i * REC_H, width: 1260, height: REC_H, borderBottom: `1px solid ${COR.borda}`, display: "flex", alignItems: "center", fontSize: 16, boxShadow: aceso ? `inset 0 0 0 2px ${r.fin === "Divergente" ? COR.vermelho : VERDE}` : "none", borderRadius: aceso ? 6 : 0 }}>
            <div style={{ width: RCOLS[0], padding: "0 10px", boxSizing: "border-box" }}>{r.data}</div>
            <div style={{ width: RCOLS[1], padding: "0 10px", boxSizing: "border-box", lineHeight: 1.35 }}>
              <div>{r.acordo}</div>
              <div style={{ fontSize: 13, color: COR.suave }}>{r.resumo}</div>
              <span style={{ fontSize: 13, background: fundo, color: cor, padding: "1px 7px", borderRadius: 4 }}>{r.situacao}</span>
            </div>
            <div style={{ width: RCOLS[2], padding: "0 10px", boxSizing: "border-box" }}>{r.fornecedor}</div>
            <div style={{ width: RCOLS[3], padding: "0 10px", boxSizing: "border-box", lineHeight: 1.35 }}>
              <div>{r.doc}</div>
              <div style={{ fontSize: 13, color: COR.suave }}>{r.tipo}</div>
            </div>
            <div style={{ width: RCOLS[4], padding: "0 10px", boxSizing: "border-box", textAlign: "right", lineHeight: 1.35 }}>
              <div style={{ fontWeight: 700, color: c0 ? VERDE : COR.texto }}>{c0 ? r.usar : r.produtos}</div>
              {(c0 ? "NF R$ 10.539,50 · impostos R$ 689,50" : r.nf).split(" · ").map((t) => (
                <div key={t} style={{ fontSize: 13, color: COR.suave }}>
                  {t}
                </div>
              ))}
            </div>
            <div style={{ width: RCOLS[5], padding: "0 10px", boxSizing: "border-box", color: r.fin === "Divergente" ? COR.vermelho : r.fin === "Aguardando" ? COR.amarelo : COR.texto, alignSelf: "stretch", display: "flex", alignItems: "center", ...(finAceso ? { background: "rgba(60,224,30,0.08)" } : {}) }}>{r.fin}</div>
            <div style={{ width: RCOLS[6], padding: "0 10px", boxSizing: "border-box", fontSize: 13, lineHeight: 1.35, color: avisoAceso && r.aviso ? COR.amarelo : COR.suave, fontWeight: avisoAceso && r.aviso ? 700 : 400 }}>{c0 ? "" : r.aviso}</div>
            <div style={{ width: RCOLS[7], boxSizing: "border-box", position: "relative", height: REC_H }}>
              {r.usar && !c0 ? (
                <>
                  <div style={{ position: "absolute", left: 10, top: 4, width: 170, height: 40, ...luz(avisoAceso, COR.amarelo) }}>
                    <BotaoP x={0} y={0} w={170} h={40} cheio clique={corrige}>
                      <span style={{ lineHeight: 1.1, fontSize: 15, textAlign: "left" }}>
                        Usar produtos
                        <br />
                        {r.usar}
                      </span>
                    </BotaoP>
                  </div>
                  <AcaoRec y={48} borda>
                    ✓ Conferir
                  </AcaoRec>
                  <AcaoRec y={74}>× Divergente</AcaoRec>
                </>
              ) : r.fin === "Divergente" ? (
                <>
                  <AcaoRec y={24} borda>
                    ✓ Conferir
                  </AcaoRec>
                  <AcaoRec y={54}>Tirar do saldo</AcaoRec>
                </>
              ) : (
                <>
                  <AcaoRec y={12} borda>
                    ✓ Conferir
                  </AcaoRec>
                  <AcaoRec y={40}>× Divergente</AcaoRec>
                  <AcaoRec y={66}>Tirar do saldo</AcaoRec>
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ======================= Fornecedores (tabela)
const FCOLS = [240, 160, 120, 120, 120, 110, 100, 160, 130];
export const FORN_COMPRADOR_X = AREA.x + 40 + 240 + 80;
export const TelaFornecedores: React.FC<{ readonly compradorAceso?: boolean }> = ({ compradorAceso }) => (
  <>
    <div style={{ position: "absolute", left: 40, top: 262, width: 420, height: 48, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 8, padding: "0 16px", display: "flex", alignItems: "center", fontSize: 18, color: "#6B726D" }}>
      Nome, código, CNPJ ou grupo…
    </div>
    <Seletor x={476} y={262} w={240} texto="Todo comprador" />
    <BotaoP x={732} y={262} w={110} cheio>
      Buscar
    </BotaoP>
    <BotaoP x={1010} y={262} w={290} icone="mais" cheio>
      Novo fornecedor do ERP
    </BotaoP>
    <div style={{ position: "absolute", left: 40, right: 40, top: 328, fontSize: 16, color: COR.suave, lineHeight: 1.4 }}>
      48 fornecedor(es) · <span style={{ color: COR.amarelo, fontWeight: 700 }}>3 sem vínculo com o cadastro do ERP</span> (sem ele, as notas do fornecedor chegam na Caixa do ERP sem dono). Clique no nome para ver acordos e recebimentos.
    </div>
    <div style={{ position: "absolute", left: TAB_X, top: 392, width: 1260, height: 44, borderTop: `1px solid ${COR.borda}`, borderBottom: `1px solid ${COR.borda}`, display: "flex", alignItems: "center", fontSize: 16, fontWeight: 600 }}>
      {["Fornecedor", "Comprador", "Negociado", "Recebido", "Pendente", "Vencido", "Em aberto", "Último recebimento", "ERP"].map((t, k) => (
        <div key={t} style={{ width: FCOLS[k], padding: "0 10px", boxSizing: "border-box", textAlign: k >= 2 && k <= 6 ? "right" : "left", whiteSpace: "nowrap", ...(k === 1 ? luz(compradorAceso) : {}) }}>
          {t}
        </div>
      ))}
    </div>
    {FORNECEDORES.map((f, i) => (
      <div key={f.nome} style={{ position: "absolute", left: TAB_X, top: 436 + i * 62, width: 1260, height: 62, borderBottom: `1px solid ${COR.borda}`, display: "flex", alignItems: "center", fontSize: 17 }}>
        {(
          [
            <span key="n">
              {f.nome} <span style={{ fontSize: 13, color: COR.suave, marginLeft: 6 }}>{f.codigo}</span>
            </span>,
            <span key="c" style={{ fontSize: 16, color: compradorAceso ? VERDE : COR.texto, fontWeight: compradorAceso ? 700 : 400 }}>{f.comprador}</span>,
            f.negociado,
            f.recebido,
            <b key="p">{f.pendente}</b>,
            <span key="v" style={{ color: f.vencido === "—" ? COR.suave : COR.vermelho }}>{f.vencido}</span>,
            f.aberto,
            <span key="u" style={{ fontSize: 16 }}>{f.ultimo}</span>,
            f.erp ? (
              <span key="e" style={{ fontSize: 14, color: COR.suave }}>vinculado</span>
            ) : (
              <span key="e" style={{ fontSize: 14, border: `1px solid ${COR.borda}`, borderRadius: 6, padding: "4px 10px" }}>
                🔗 Vincular
              </span>
            ),
          ] as React.ReactNode[]
        ).map((v, k) => (
          <div key={k} style={{ width: FCOLS[k], padding: "0 10px", boxSizing: "border-box", textAlign: k >= 2 && k <= 6 ? "right" : "left", whiteSpace: "nowrap", overflow: "hidden", ...(k === 1 && compradorAceso ? { background: "rgba(60,224,30,0.08)", alignSelf: "stretch", display: "flex", alignItems: "center" } : {}) }}>
            {v}
          </div>
        ))}
      </div>
    ))}
  </>
);

// ======================= Pendências
export const TelaPendencias: React.FC<{ readonly acesa?: "prioridade" | "valor" | "acao" }> = ({ acesa }) => (
  <>
    <Seletor x={40} y={262} w={300} texto="Abertas e em andamento" />
    <BotaoP x={356} y={262} w={110}>
      Filtrar
    </BotaoP>
    <div style={{ position: "absolute", left: 40, top: 332, fontSize: 18, color: COR.suave }}>3 pendência(s) · prioridade alta soma R$ 12.400,00 de impacto. Cada uma precisa de uma decisão: registre o comentário com a data.</div>
    {PENDENCIAS.map((p, i) => {
      const y = 376 + i * 180;
      const alta = p.prioridade === "Alta";
      return (
        <Caixa key={p.n} x={40} y={y} w={1260} h={164}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 18 }}>
            <span style={{ color: COR.suave }}>#{p.n}</span>
            <span style={{ background: alta ? "#3A1616" : "#3A2E12", color: alta ? COR.vermelho : COR.amarelo, padding: "2px 10px", borderRadius: 5, fontWeight: 700, ...luz(acesa === "prioridade", alta ? COR.vermelho : COR.amarelo) }}>
              {p.prioridade}
            </span>
            <span style={{ color: COR.suave }}>{p.tipo}</span>
            <span>{p.fornecedor}</span>
            <span style={{ fontWeight: 700, padding: "0 6px", ...luz(acesa === "valor") }}>{p.valor}</span>
          </div>
          <div style={{ fontSize: 20, marginTop: 10, width: 820 }}>{p.texto}</div>
          <div style={{ fontSize: 17, marginTop: 10, display: "inline-block", padding: "2px 6px", ...luz(acesa === "acao") }}>
            <span style={{ color: COR.suave }}>Ação recomendada: </span>
            <span style={{ color: VERDE }}>{p.acao}</span>
          </div>
          <Seletor x={890} y={16} w={160} h={42} texto="Aberto" />
          <Seletor x={1062} y={16} w={176} h={42} texto="Sem responsável" />
          <div style={{ position: "absolute", left: 890, top: 70, width: 348, height: 76, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 8, background: "#1C201D", padding: 10, fontSize: 16, color: "#6B726D" }}>
            Decisão tomada, com data
          </div>
        </Caixa>
      );
    })}
  </>
);

// ======================= Pendências como no sistema (treinamento): cada uma com o tratamento na
// migração, a ação recomendada e a origem na planilha; status, responsável e a decisão com data
export type FocoPend = "tipo" | "prioridade" | "valor" | "origem" | "tratamento" | "acao" | null;
export type AcaoPend = { readonly decisao?: number; readonly status?: number; readonly resp?: number; readonly luz?: "decisao" | "status" | "resp" | null };
export const PEND = {
  decisao: janela(40 + 868 + 185, 376 + 70 + 46),
  status: janela(40 + 868 + 80, 376 + 16 + 21),
  resp: janela(40 + 1040 + 99, 376 + 16 + 21),
};
export const TelaPendencias2: React.FC<{ readonly foco?: FocoPend; readonly acao?: AcaoPend }> = ({ foco = null, acao = {} }) => {
  const frame = useCurrentFrame();
  const ja = (f?: number) => f !== undefined && frame >= f;
  const DEC = "13/11: parcelas confirmadas com a Carla por e-mail; datas preenchidas no ACD-0208.";
  return (
    <>
      <div style={{ position: "absolute", left: 28, top: 250, width: 1284, height: 72, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
      <Seletor x={40} y={262} w={1120} texto="Abertas e em andamento" />
      <BotaoP x={1176} y={262} w={124} cheio>
        Filtrar
      </BotaoP>
      <div style={{ position: "absolute", left: 40, top: 334, fontSize: 17, color: COR.suave }}>3 pendência(s) · prioridade alta soma R$ 39.000,00 de impacto. Cada uma precisa de uma decisão: registre o comentário com a data.</div>
      {PENDENCIAS_MIG.map((p, i) => {
        const y = 376 + i * 200;
        const alta = p.prioridade === "Alta";
        const a = (k: FocoPend) => i === 0 && foco === k;
        const resolvido = i === 0 && ja(acao.status);
        return (
          <Caixa key={p.n} x={40} y={y} w={1260} h={184} style={{ opacity: resolvido ? 0.75 : 1 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 17 }}>
              <span style={{ color: COR.suave }}>#{p.n}</span>
              <span style={{ background: alta ? "#3A1616" : "#3A2E12", color: alta ? COR.vermelho : COR.amarelo, padding: "2px 10px", borderRadius: 5, fontWeight: 700, ...luz(a("prioridade"), alta ? COR.vermelho : COR.amarelo) }}>{p.prioridade}</span>
              <span style={{ color: COR.suave, padding: "0 4px", ...luz(a("tipo")) }}>{p.tipo}</span>
              <span>{p.fornecedor}</span>
              <span style={{ fontWeight: 700, padding: "0 6px", ...luz(a("valor")) }}>{p.valor}</span>
            </div>
            <div style={{ fontSize: 19, marginTop: 8, width: 820 }}>{p.texto}</div>
            <div style={{ fontSize: 16, marginTop: 8, color: COR.suave, display: "inline-block", padding: "1px 6px", ...luz(a("tratamento")) }}>Tratamento na migração: {p.tratamento}</div>
            <div style={{ fontSize: 16, marginTop: 4, padding: "1px 6px", width: "fit-content", ...luz(a("acao")) }}>
              <span style={{ color: COR.suave }}>Ação recomendada: </span>
              <span>{p.acao}</span>
            </div>
            <div style={{ fontSize: 14, marginTop: 4, color: COR.suave, padding: "1px 6px", width: "fit-content", ...luz(a("origem")) }}>{p.origem}</div>
            <div style={{ position: "absolute", left: 868, top: 16, ...luz(i === 0 && acao.luz === "status") }}>
              <Seletor x={0} y={0} w={160} h={42} texto={resolvido ? <span style={{ color: VERDE, fontWeight: 700 }}>Resolvido</span> : "Aberto"} />
            </div>
            <div style={{ position: "absolute", left: 1040, top: 16, ...luz(i === 0 && acao.luz === "resp") }}>
              <Seletor x={0} y={0} w={198} h={42} texto={i === 0 && ja(acao.resp) ? "Marina Costa" : "Sem responsável"} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 868,
                top: 70,
                width: 370,
                height: 92,
                boxSizing: "border-box",
                border: `${i === 0 && acao.luz === "decisao" ? 2 : 1}px solid ${i === 0 && acao.luz === "decisao" ? VERDE : COR.borda}`,
                borderRadius: 8,
                background: "#1C201D",
                padding: 10,
                fontSize: 15,
                lineHeight: 1.35,
                color: COR.texto,
              }}
            >
              {i === 0 && acao.decisao !== undefined ? <Digitando texto={DEC} de={acao.decisao} porFrame={2} placeholder="Decisão tomada, com data" /> : <span style={{ color: "#6B726D" }}>Decisão tomada, com data</span>}
            </div>
          </Caixa>
        );
      })}
    </>
  );
};

// ======================= Página do acordo (ACD-0214)
export type FocoPagina = "recebimentos" | "saldo" | "aprovacao" | "evidencias" | "tratativas" | null;
export const TRAT_TEXTO = janela(820 + 220, 290 + 110);
export const TRAT_REGISTRAR = janela(820 + 394, 290 + 183);
export const PAGINA = {
  recebimentos: janela(420, 365),
  saldo: janela(520, 205),
  aprovacao: janela(420, 531),
  evidencias: janela(420, 717),
  tratativas: janela(1040, 560),
};
export const PaginaAcordo: React.FC<{
  readonly foco: FocoPagina;
  readonly anexos?: readonly number[];
  readonly digita?: number;
  readonly registra?: number;
  readonly cobrancaAntiga?: boolean;
  readonly status?: { readonly texto: string; readonly cor: string; readonly fundo: string };
  readonly botao?: { readonly texto: string; readonly aceso?: boolean; readonly clique?: number };
}> = ({ foco, anexos = [], digita, registra, status = { texto: "VENCIDO", cor: COR.vermelho, fundo: "#3A1616" }, botao = { texto: "Cancelar acordo" } }) => {
  const frame = useCurrentFrame();
  const ARQS = ["contrato-aniversario.pdf", "e-mail 28-08.eml", "whatsapp-carla.png"];
  const registrado = registra !== undefined && frame >= registra;
  const TEXTO = "Cobrado por e-mail, prometeu a NF até 20/11";
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 26, fontSize: 18, color: COR.suave }}>← Acordos</div>
      <div style={{ position: "absolute", left: 40, top: 56, display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 38, fontWeight: 700, letterSpacing: 5 }}>ACD-0214 · TINTAS HORIZONTE</span>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3, color: status.cor, background: status.fundo, padding: "3px 10px", borderRadius: 5 }}>{status.texto}</span>
      </div>
      <div style={{ position: "absolute", left: 40, top: 106, fontSize: 19 }}>Cota aniversário da loja · parcela 2/6 (6x R$ 6.500,00)</div>
      <BotaoP x={990} y={30} w={110} icone="tarefas">
        Editar
      </BotaoP>
      <div style={{ position: "absolute", left: 1110, top: 30, width: 190, height: 48, ...luz(botao.aceso) }}>
        <BotaoP x={0} y={0} w={190} clique={botao.clique}>
          {botao.texto}
        </BotaoP>
      </div>
      {(
        [
          ["Negociado", "R$ 6.500,00", "white", false],
          ["Recebido", "R$ 0,00", "white", false],
          ["Saldo", "R$ 6.500,00", COR.vermelho, foco === "saldo"],
          ["Em atraso", "30 dias", COR.vermelho, foco === "saldo"],
        ] as const
      ).map(([r, v, c, a], i) => (
        <Caixa key={r} x={40 + i * 320} y={150} w={300} h={110} aceso={a}>
          <div style={{ fontSize: 17, color: COR.suave }}>{r}</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: c, marginTop: 6 }}>{v}</div>
        </Caixa>
      ))}
      <Caixa x={40} y={290} w={760} h={150} aceso={foco === "recebimentos"}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Recebimentos</div>
        <BotaoP x={510} y={14} w={228} h={44} cheio icone="mais">
          Lançar recebimento
        </BotaoP>
        <div style={{ marginTop: 26, height: 60, border: `1px dashed ${COR.borda}`, borderRadius: 8, display: "grid", placeItems: "center", color: COR.suave, fontSize: 18 }}>Nada recebido ainda.</div>
      </Caixa>
      <Caixa x={40} y={456} w={760} h={150} aceso={foco === "aprovacao"}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Aprovação do fornecedor</div>
        <div style={{ marginTop: 16, fontSize: 19, color: VERDE, fontWeight: 600 }}>✓ Aprovado por Carla Mendes (Tintas Horizonte) em 02/09/2026</div>
        <div style={{ marginTop: 10, fontSize: 17, color: COR.suave }}>Reenviar pedido de aprovação</div>
      </Caixa>
      <Caixa x={40} y={622} w={760} h={190} aceso={foco === "evidencias"}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Evidências</div>
        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          {ARQS.map((a, i) => {
            const de = anexos[i];
            if (de === undefined || frame < de) return null;
            const s = interpolate(frame - de, [0, 8], [0, 1], { extrapolateRight: "clamp" });
            return (
              <div key={a} style={{ opacity: s, transform: `scale(${0.8 + 0.2 * s})`, border: `1px solid ${VERDE}`, color: COR.texto, borderRadius: 8, padding: "8px 14px", fontSize: 17, background: "#14301A" }}>
                📎 {a}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 22, bottom: 18, border: `1px solid ${COR.borda}`, borderRadius: 8, padding: "8px 14px", fontSize: 17 }}>📎 Anexar evidência</div>
      </Caixa>
      <Caixa x={820} y={290} w={480} h={600} aceso={foco === "tratativas"}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Tratativas e histórico</div>
        <div style={{ position: "absolute", left: 22, top: 66, width: 436, height: 84, boxSizing: "border-box", border: `${digita !== undefined && !registrado && frame >= digita ? 2 : 1}px solid ${digita !== undefined && !registrado && frame >= digita ? VERDE : COR.borda}`, borderRadius: 8, background: "#1C201D", padding: 12, fontSize: 17 }}>
          {registrado ? <span style={{ color: "#6B726D" }}>Ex.: cobrado por e-mail, prometeu NF até 20/11</span> : digita !== undefined ? <Digitando texto={TEXTO} de={digita} porFrame={1.4} placeholder="Ex.: cobrado por e-mail, prometeu NF até 20/11" /> : <span style={{ color: "#6B726D" }}>Ex.: cobrado por e-mail, prometeu NF até 20/11</span>}
        </div>
        <Seletor x={22} y={162} w={290} h={42} texto="Cobrança ao fornecedor" />
        <BotaoP x={330} y={162} w={128} h={42} cheio clique={registra}>
          Registrar
        </BotaoP>
        <div style={{ position: "absolute", left: 22, right: 22, top: 230 }}>
          {registrado && (
            <div style={{ borderLeft: `3px solid ${VERDE}`, paddingLeft: 12, marginBottom: 18, opacity: interpolate(frame - (registra ?? 0), [0, 10], [0, 1], { extrapolateRight: "clamp" }) }}>
              <div style={{ fontSize: 15, color: VERDE }}>30/10/26, 10:14 · Cobrança · Marina Costa</div>
              <div style={{ fontSize: 18, marginTop: 4 }}>{TEXTO}</div>
            </div>
          )}
          <div style={{ borderLeft: `3px solid ${COR.borda}`, paddingLeft: 12, marginBottom: 18 }}>
            <div style={{ fontSize: 15, color: COR.suave }}>02/09/26, 16:40 · Fornecedor</div>
            <div style={{ fontSize: 18, marginTop: 4 }}>Carla Mendes aprovou o acordo pelo e-mail.</div>
          </div>
          <div style={{ borderLeft: `3px solid ${COR.borda}`, paddingLeft: 12 }}>
            <div style={{ fontSize: 15, color: COR.suave }}>28/08/26, 11:02 · Marina Costa</div>
            <div style={{ fontSize: 18, marginTop: 4 }}>Acordo cadastrado: 6 parcelas, vencimento no último dia do mês.</div>
          </div>
        </div>
      </Caixa>
    </>
  );
};

// ======================= Modal Lançar recebimento
export type MarcasRec = { abre: number; acordo: number; valor: number; forma: number; numero: number; dividir: number; lancar: number };
const MR = { x: 290, y: 40, w: 760, h: 820 };
export const REC = {
  acordo: janela(MR.x + 28 + 230, MR.y + 150 + 24),
  valor: janela(MR.x + 28 + 600, MR.y + 150 + 24),
  dividir: janela(MR.x + 28 + 100, MR.y + 210),
  forma: janela(MR.x + 28 + 168, MR.y + 330 + 24),
  numero: janela(MR.x + 28 + 168, MR.y + 412 + 24),
  lancar: janela(MR.x + MR.w - 28 - 60, MR.y + MR.h - 28 - 24),
};
export const ModalRecebimento: React.FC<{ readonly m: MarcasRec }> = ({ m }) => {
  const frame = useCurrentFrame();
  const L = 28;
  const meio = 356;
  const ja = (f: number) => frame >= f;
  const vazio = (t: string) => <span style={{ color: "#6B726D" }}>{t}</span>;
  const dividido = ja(m.dividir + 4);
  const desloc = dividido ? 62 : 0; // a segunda linha empurra o resto para baixo
  return (
    <Modal de={m.abre} fecha={m.lancar + 8} x={MR.x} y={MR.y} w={MR.w} h={MR.h} titulo="Lançar recebimento" sub="Lance só o que chegou. Se o documento paga mais de um acordo, some uma parte por acordo.">
      <Rotulo x={L} y={124}>
        Acordo e valor
      </Rotulo>
      <Seletor x={L} y={150} w={460} texto={ja(m.acordo) ? "ACD-0187 · Pisos Atlântico · saldo R$ 4.300" : vazio("Escolha o acordo…")} aceso={ja(m.acordo - 6) && !ja(m.valor - 6)} />
      <Seletor x={L + 476} y={150} w={228} texto={ja(m.valor) ? <Digitando texto="3.100,00" de={m.valor} porFrame={0.8} /> : vazio("Valor (R$)")} aceso={ja(m.valor - 6) && !ja(m.forma - 6)} />
      {dividido && (
        <>
          <Seletor x={L} y={212} w={460} texto="ACD-0198 · Louças Serena · saldo R$ 9.850" aceso={!ja(m.lancar - 10)} />
          <Seletor x={L + 476} y={212} w={228} texto={<Digitando texto="1.200,00" de={m.dividir + 14} porFrame={0.8} />} />
        </>
      )}
      <div style={{ position: "absolute", left: L, top: 208 + desloc, fontSize: 16, color: COR.suave, textDecoration: "underline" }}>+ dividir com outro acordo</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: desloc, height: MR.h }}>
        <Rotulo x={L} y={300}>
          Forma
        </Rotulo>
        <Seletor x={L} y={330} w={336} texto={ja(m.forma) ? "Desconto em boleto / duplicata" : vazio("Escolha…")} aceso={ja(m.forma - 6) && !ja(m.numero - 6)} />
        <Rotulo x={meio + 20} y={300}>
          Tipo de documento
        </Rotulo>
        <Seletor x={meio + 20} y={330} w={336} texto={ja(m.forma + 8) ? "Boleto" : vazio("—")} />
        <Rotulo x={L} y={386}>
          Nº do documento
        </Rotulo>
        <Seletor x={L} y={412} w={336} texto={ja(m.numero) ? <Digitando texto="Boleto 55120/03" de={m.numero} porFrame={1} /> : vazio("NF 260706, Dup. 252392/3…")} aceso={ja(m.numero - 6) && !ja(m.dividir - 6)} />
        <Rotulo x={meio + 20} y={386}>
          Loja / destino
        </Rotulo>
        <Seletor x={meio + 20} y={412} w={336} texto="Matriz" />
        <Rotulo x={L} y={472}>
          Data do recebimento
        </Rotulo>
        <Seletor x={L} y={498} w={336} texto="30/10/2026" />
        <Rotulo x={meio + 20} y={472}>
          Competência
        </Rotulo>
        <Seletor x={meio + 20} y={498} w={336} texto={vazio("--------- de ----")} />
        <Rotulo x={L} y={560}>
          Observações
        </Rotulo>
        <div style={{ position: "absolute", left: L, top: 586, width: 704, height: 76, boxSizing: "border-box", border: `1px solid ${COR.borda}`, borderRadius: 8, background: "#1C201D" }} />
      </div>
      <BotaoP x={MR.w - L - 120 - 140} y={MR.h - L - 48} w={130}>
        Cancelar
      </BotaoP>
      <BotaoP x={MR.w - L - 120} y={MR.h - L - 48} w={120} cheio clique={m.lancar}>
        Lançar
      </BotaoP>
    </Modal>
  );
};

// ======================= Modal Importar planilha
export type MarcasImp = { abre: number; arquivo: number; conferir: number; linhas: readonly number[]; importar: number };
const MI = { x: 200, y: 60, w: 940, h: 800 };
export const IMP = { conferir: janela(MI.x + 560 + 70, MI.y + 300 + 24), importar: janela(MI.x + MI.w - 28 - 70, MI.y + MI.h - 28 - 24) };
const RESULTADO: [string, string, string, string, string][] = [
  ["Acordos", "linha 8 · sem ID", "Cota Natal · Cerâmica Aurora · R$ 18.000", "Cadastrar", VERDE],
  ["Acordos", "ACD-0221", "Data prevista: vazia → 30/11/2026", "Alterar", "#7FB2FF"],
  ["Fornecedores", "FOR-034", "Tintas Horizonte", "Sem mudança", "#9AA19C"],
  ["Fornecedores", "linha 12 · sem código", "CNPJ obrigatório para cadastrar", "Com erro", "#FF6B6B"],
];
export const ModalImportar: React.FC<{ readonly m: MarcasImp }> = ({ m }) => {
  const frame = useCurrentFrame();
  const conferido = frame >= m.conferir + 6;
  return (
    <Modal de={m.abre} fecha={m.importar + 10} x={MI.x} y={MI.y} w={MI.w} h={MI.h} titulo="Importar planilha" sub="Use o Exportar Excel como modelo: altere ou acrescente linhas nas abas Fornecedores, Acordos e Recebimentos e importe de volta.">
      <div style={{ position: "absolute", left: 28, right: 28, top: 140, fontSize: 16, lineHeight: 1.55, color: COR.texto }}>
        • <b>Fornecedores</b>: com Código, altera o que mudou; sem Código, cadastra (CNPJ obrigatório).
        <br />• <b>Acordos</b>: com ID, altera; sem ID, cadastra. Saldo, situação e alertas são calculados.
        <br />• <b>Recebimentos</b>: o mesmo documento com o mesmo valor não entra duas vezes.
        <br />• Célula vazia não apaga nada. Acordo importado não dispara e-mail ao fornecedor.
      </div>
      <BotaoP x={28} y={300} w={190}>
        Escolher arquivo
      </BotaoP>
      <div style={{ position: "absolute", left: 236, top: 312, fontSize: 18, color: frame >= m.arquivo ? COR.texto : COR.suave }}>{frame >= m.arquivo ? "📗 verbas-e-acordos.xlsx" : "Nenhum arquivo escolhido"}</div>
      <BotaoP x={560} y={300} w={140} cheio={frame >= m.arquivo} clique={m.conferir}>
        Conferir
      </BotaoP>
      {conferido && (
        <div style={{ position: "absolute", left: 28, right: 28, top: 380 }}>
          <div style={{ fontSize: 17, color: COR.suave, marginBottom: 10 }}>Resultado da conferência · 4 linhas</div>
          {RESULTADO.map(([aba, id, desc, st, cor], i) => {
            const de = m.linhas[i] ?? m.conferir + 6;
            if (frame < de) return null;
            const s = interpolate(frame - de, [0, 8], [0, 1], { extrapolateRight: "clamp" });
            return (
              <div key={id} style={{ display: "flex", alignItems: "center", height: 64, borderTop: `1px solid ${COR.borda}`, opacity: s, transform: `translateX(${(1 - s) * 30}px)` }}>
                <span style={{ width: 150, fontSize: 17, color: COR.suave }}>{aba}</span>
                <span style={{ width: 210, fontSize: 17, fontFamily: fonteMono }}>{id}</span>
                <span style={{ flex: 1, fontSize: 18 }}>{desc}</span>
                <span style={{ fontSize: 17, fontWeight: 700, color: cor, border: `1px solid ${cor}`, borderRadius: 6, padding: "4px 12px" }}>{st}</span>
              </div>
            );
          })}
        </div>
      )}
      <BotaoP x={MI.w - 28 - 140} y={MI.h - 28 - 48} w={140} cheio={conferido} clique={m.importar}>
        Importar
      </BotaoP>
    </Modal>
  );
};

// ======================= Configurações
export const TelaPapeis: React.FC<{ readonly coluna?: (typeof PAPEIS)[number] }> = ({ coluna }) => (
  <Caixa x={40} y={262} w={1260} h={620}>
    <div style={{ fontSize: 24, fontWeight: 700 }}>Papéis no módulo</div>
    <div style={{ fontSize: 16, color: COR.suave, marginTop: 10, lineHeight: 1.45 }}>
      Todos com o módulo leem tudo. Comprador cadastra acordos e edita os seus (e assume os sem comprador); Assistente de Compras opera por todos os compradores (cadastra e edita qualquer acordo, decide a Caixa do ERP, lança, cobra e anexa) e recebe o e-mail semanal de todos; Financeiro lança, confere e tira do saldo; Marketing / Trade registra tratativas; Diretoria aprova acordos acima do limite. O Admin pode tudo.
    </div>
    {PESSOAS.map(([nome, papeis], i) => (
      <div key={nome} style={{ position: "absolute", left: 22, right: 22, top: 156 + i * 64, height: 64, borderTop: i ? `1px solid ${COR.borda}` : "none", display: "flex", alignItems: "center" }}>
        <span style={{ flex: 1, fontSize: 20 }}>{nome}</span>
        {PAPEIS.map((p) => {
          const marcado = papeis.includes(p);
          const aceso = coluna === p;
          return (
            <span key={p} style={{ width: p === "Assistente de Compras" ? 270 : p === "Marketing / Trade" ? 210 : 160, display: "flex", alignItems: "center", gap: 10, fontSize: 18, color: aceso ? VERDE : COR.texto, fontWeight: aceso ? 700 : 400 }}>
              <span style={{ width: 22, height: 22, borderRadius: 5, border: `2px solid ${marcado ? (aceso ? VERDE : "#7FB2FF") : "#555"}`, background: marcado ? (aceso ? VERDE : "#7FB2FF") : "transparent", color: "#0B0B0C", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 900, boxShadow: aceso && marcado ? "0 0 14px rgba(60,224,30,0.6)" : "none" }}>
                {marcado ? "✓" : ""}
              </span>
              {p}
            </span>
          );
        })}
      </div>
    ))}
  </Caixa>
);

export type FocoParam = "tolerancia" | "limite" | "listas" | "emails" | null;
export const BOTAO_TESTE = janela(40 + 22 + 150, 602 + 226 + 22);
export const TelaParametros: React.FC<{ readonly foco: FocoParam; readonly teste?: number }> = ({ foco, teste }) => {
  const frame = useCurrentFrame();
  const enviado = teste !== undefined && frame >= teste + 4;
  return (
    <>
      <Caixa x={40} y={262} w={620} h={320} aceso={foco === "tolerancia" || foco === "limite"}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Parâmetros</div>
        {(
          [
            ["Tolerância (R$)", "1,00", "Faltando até isso, o acordo conta como liquidado.", "tolerancia"],
            ["“Vence em breve” (dias)", "15", "Dias antes do prazo para o aviso.", null],
            ["Aprovação acima de (R$)", "50.000,00", "Acima disso, o acordo espera a diretoria.", "limite"],
          ] as const
        ).map(([r, v, d, k], i) => (
          <div key={r} style={{ position: "absolute", left: 22, right: 22, top: 70 + i * 82, padding: "4px 8px", ...luz(foco === k) }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
              <span style={{ fontWeight: 600 }}>{r}</span>
              <span style={{ fontFamily: fonteMono, fontSize: 20, color: foco === k ? VERDE : COR.texto }}>{v}</span>
            </div>
            <div style={{ fontSize: 15, color: COR.suave, marginTop: 4 }}>{d}</div>
          </div>
        ))}
      </Caixa>
      <Caixa x={680} y={262} w={620} h={320} aceso={foco === "listas"}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Listas</div>
        {(
          [
            ["Modalidades", ["Cota de campanha", "Bonificação", "Rapel", "Desconto"]],
            ["Formas de recebimento", ["NF de bonificação", "Desconto em boleto", "Depósito"]],
            ["Lojas / destino", ["Matriz", "Filial 02", "CD"]],
          ] as const
        ).map(([r, ops], i) => (
          <div key={r} style={{ position: "absolute", left: 22, right: 22, top: 70 + i * 82 }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>{r}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              {ops.map((o) => (
                <span key={o} style={{ fontSize: 15, border: `1px solid ${COR.borda}`, borderRadius: 99, padding: "3px 12px" }}>
                  {o}
                </span>
              ))}
              <span style={{ fontSize: 15, color: VERDE, padding: "3px 4px" }}>+ Nova opção</span>
            </div>
          </div>
        ))}
      </Caixa>
      <Caixa x={40} y={602} w={1260} h={290} aceso={foco === "emails"}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>E-mails do módulo</div>
        <div style={{ fontSize: 16, color: COR.suave, marginTop: 6 }}>Todos os e-mails saem de verbas@lojamodelo.com.br, a caixa corporativa padrão da empresa.</div>
        <div style={{ position: "absolute", left: 22, top: 100, fontSize: 18, lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700 }}>Aprovação do fornecedor por e-mail</div>
          <div>
            <span style={{ color: VERDE }}>●</span> O comprador decide em cada cadastro
          </div>
          <div style={{ color: COR.suave }}>○ Automático · ○ Desabilitado</div>
        </div>
        <div style={{ position: "absolute", left: 640, top: 100, fontSize: 18, lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700 }}>Alertas semanais</div>
          <div>
            <span style={{ color: VERDE }}>☑</span> Ligados, toda segunda às 8h
          </div>
          <div>
            <span style={{ color: VERDE }}>☑</span> Compradores · <span style={{ color: VERDE }}>☑</span> Diretoria
          </div>
        </div>
        <BotaoP x={22} y={226} w={300} h={44} clique={teste}>
          ✉ Mandar um teste para mim
        </BotaoP>
        {enviado && <div style={{ position: "absolute", left: 340, top: 236, fontSize: 18, color: VERDE, fontWeight: 600 }}>✓ Teste enviado para helena@lojamodelo.com.br</div>}
      </Caixa>
    </>
  );
};
