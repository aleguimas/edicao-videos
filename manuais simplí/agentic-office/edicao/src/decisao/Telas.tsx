import type React from "react";
import { Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icone } from "../agentic/App";
import { TarjaAna } from "../ana/Ana";
import { type Cena, marca } from "../ana/voz";
import { Avatar, DIRETORIA, EXECUTORES, rampa } from "../apresentacao/comum";
import { CINZA, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { ChipM, DescricaoM, M, TelaM, rolagem } from "../mobile/Kit";
import { FotoAna, Surge } from "../verbas/Montagem";
import { BotaoFolha, Celular, DECISOES, FolhaDecisao, ListaDecisoes, Quadradinho, Rotulo, TEL, Toque } from "./Celular";

// Telas do vídeo "Sistema de decisão" (16:9). Roteiro: manuais simplí/agentic-office/sistema-de-decisao/roteiro.md.
// Empresa fictícia: Loja Modelo. Nada de dado real de cliente.
type P = { readonly c: Cena };
const marcas = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
const VERMELHO = "#FF5A5A";
const AMARELO = "#F5B82E";
const ESC = (TEL.w as number) / 412; // px do vídeo por px de CSS do celular
const naTela = (x: number, y: number) => [TEL.x + x * ESC, TEL.y + y * ESC] as const;

// ======================================================================================
// 1. Gancho: a fadiga de abas
// ======================================================================================
type Aba = { nome: string; palavra: string; cor: string; corpo: "tabela" | "planilha" | "grafico" | "extrato" | "email" };
const ABAS: Aba[] = [
  { nome: "Sistema de gestão", palavra: "sistema", cor: "#4C8DFF", corpo: "tabela" },
  { nome: "vendas_semana_v3.xlsx", palavra: "planilha", cor: "#2EC4B6", corpo: "planilha" },
  { nome: "Painel de indicadores", palavra: "painel", cor: "#C46BFF", corpo: "grafico" },
  { nome: "Extrato bancário", palavra: "extrato", cor: "#F5B82E", corpo: "extrato" },
  { nome: "Caixa de entrada (148)", palavra: "email", cor: "#FF8A3D", corpo: "email" },
];
const POS = (i: number) => ({ x: 150 + i * 150, y: 90 + i * 70 });

const Linhas: React.FC<{ readonly n: number; readonly larg?: number[]; readonly cor?: string }> = ({ n, larg = [60, 20, 14], cor = "rgba(255,255,255,0.16)" }) => (
  <>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ display: "flex", gap: 14, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {larg.map((l, j) => (
          <div key={j} style={{ height: 12, borderRadius: 3, width: `${l * (0.8 + ((i * 7 + j * 3) % 5) * 0.08)}%`, background: cor }} />
        ))}
      </div>
    ))}
  </>
);

const CorpoAba: React.FC<{ readonly a: Aba }> = ({ a }) => {
  if (a.corpo === "grafico")
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 300, padding: "20px 10px" }}>
        {[42, 70, 55, 88, 64, 30, 76, 50, 92, 38].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "6px 6px 0 0", background: i === 5 ? VERMELHO : `${a.cor}AA` }} />
        ))}
      </div>
    );
  if (a.corpo === "planilha")
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 1, background: "rgba(255,255,255,0.08)", marginTop: 6 }}>
        {Array.from({ length: 48 }, (_, i) => (
          <div key={i} style={{ height: 34, background: i < 6 ? "#1B2A26" : "#121715", fontFamily: fonteMono, fontSize: 15, color: i % 11 === 4 ? VERMELHO : "rgba(255,255,255,0.45)", display: "grid", placeItems: "center" }}>
            {i < 6 ? "ABCDEF"[i] : i % 6 === 0 ? `${i / 6}` : `${(i * 397) % 9000}`}
          </div>
        ))}
      </div>
    );
  if (a.corpo === "extrato")
    return (
      <div style={{ fontFamily: fonteMono, fontSize: 17, marginTop: 6 }}>
        {["14/11  CARTÃO CRÉDITO   +12.480,00", "14/11  CARTÃO DÉBITO     +3.915,40", "14/11  TARIFA            -38,90", "15/11  PIX RECEBIDO      +2.200,00", "15/11  BOLETO FORNEC.    -8.740,00", "16/11  CARTÃO CRÉDITO   +9.630,00", "16/11  TED ENVIADA       -1.450,00"].map((l, i) => (
          <div key={l} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", color: l.includes("-") && i % 2 ? AMARELO : "rgba(255,255,255,0.6)", whiteSpace: "pre" }}>
            {l}
          </div>
        ))}
      </div>
    );
  if (a.corpo === "email") return <Linhas n={8} larg={[22, 50, 10]} />;
  return <Linhas n={8} />;
};

const Janela: React.FC<{ readonly a: Aba; readonly i: number; readonly k: number; readonly apaga?: number }> = ({ a, i, k, apaga = 0 }) => {
  const p = POS(i);
  return (
    <div
      style={{
        position: "absolute",
        left: p.x,
        top: p.y,
        width: 940,
        height: 600,
        borderRadius: 16,
        overflow: "hidden",
        background: "#101412",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 30px 70px rgba(0,0,0,0.65)",
        opacity: k * (1 - apaga * 0.55),
        transform: `translateY(${(1 - k) * 60}px) scale(${0.94 + k * 0.06})`,
      }}
    >
      <div style={{ height: 56, background: "#1A1F1C", display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
        ))}
        <div style={{ marginLeft: 18, height: 40, alignSelf: "flex-end", padding: "0 22px", display: "flex", alignItems: "center", gap: 10, borderRadius: "10px 10px 0 0", background: "#101412", fontFamily, fontWeight: 600, fontSize: 20, color: "white" }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: a.cor }} />
          {a.nome}
        </div>
      </div>
      <div style={{ padding: "16px 26px" }}>
        <CorpoAba a={a} />
      </div>
    </div>
  );
};

// pilha de janelas; `ate` = quantas já abriram (cada uma na sua palavra)
const Pilha: React.FC<{ readonly entradas: number[]; readonly apaga?: number }> = ({ entradas, apaga = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {ABAS.map((a, i) => {
        const de = entradas[i];
        if (frame < de) return null;
        const k = de < 0 ? 1 : spring({ frame: frame - de, fps, config: { damping: 16, stiffness: 140 } });
        return <Janela key={a.nome} a={a} i={i} k={k} apaga={apaga} />;
      })}
    </>
  );
};

// contador de abas no alto, que dispara
const Contador: React.FC<{ readonly n: number }> = ({ n }) => (
  <div style={{ position: "absolute", right: 90, top: 70, display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderRadius: 14, background: "rgba(255,90,90,0.12)", border: `2px solid ${VERMELHO}` }}>
    <div style={{ ...TITULO, fontSize: 54, color: VERMELHO, lineHeight: 1 }}>{n}</div>
    <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "white", lineHeight: 1.2 }}>
      ABAS
      <br />
      ABERTAS
    </div>
  </div>
);

export const A1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const entradas = ABAS.map((a) => (a.palavra === "email" ? m("e-mail") : m(a.palavra)) - 6);
  const n = Math.round(interpolate(frame, [entradas[0], c.dur - 10], [1, 23], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <>
      <Surge de={0} ate={entradas[0] - 4} style={{ left: 0, right: 0, top: 360, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 110, color: "white", lineHeight: 1.05 }}>
          QUANTAS <span style={textoDegrade}>ABAS</span>
        </div>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 40, color: CINZA, marginTop: 14 }}>você abre por dia?</div>
      </Surge>
      <Pilha entradas={entradas} />
      {frame >= entradas[0] && <Contador n={n} />}
    </>
  );
};

// alertas soltos por cima das abas
const ALERTAS = [
  { palavra: "estoque", texto: "Estoque parado", nota: "38 itens há 90 dias", cor: VERMELHO, x: 300, y: 230, vai: [-120, -60] },
  { palavra: "cliente", texto: "Cliente atrasou", nota: "título vencido há 12 dias", cor: AMARELO, x: 860, y: 420, vai: [160, -90] },
  { palavra: "meta", texto: "Meta da semana", nota: "6% abaixo na loja Centro", cor: VERMELHO, x: 520, y: 640, vai: [-60, 110] },
] as const;
export const A2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = marcas(c);
  const espalha = rampa(frame, m("espalhada") - 4, 24);
  const cruzar = m("cruzar");
  return (
    <>
      <Pilha entradas={[-1, -1, -1, -1, -1]} apaga={rampa(frame, m("estoque") - 10, 12)} />
      <Contador n={23} />
      {ALERTAS.map((a, i) => {
        const de = m(a.palavra) - 4;
        if (frame < de) return null;
        const s = spring({ frame: frame - de, fps, config: { damping: 12, stiffness: 160 } });
        return (
          <div
            key={a.texto}
            style={{
              position: "absolute",
              left: a.x + a.vai[0] * espalha,
              top: a.y + a.vai[1] * espalha,
              transform: `scale(${0.6 + s * 0.4}) rotate(${(i - 1) * 2 * espalha}deg)`,
              opacity: s,
              padding: "20px 28px",
              borderRadius: 14,
              background: "#160E0E",
              border: `3px solid ${a.cor}`,
              boxShadow: `0 0 40px ${a.cor}55`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: a.cor }} />
              <div style={{ ...TITULO, fontSize: 42, color: "white" }}>{a.texto}</div>
            </div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 26, color: CINZA, marginTop: 6, marginLeft: 30 }}>{a.nota}</div>
          </div>
        );
      })}
      {/* linhas tentando ligar os alertas, que não fecham */}
      {frame >= cruzar - 6 && (
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {[
            [330, 260, 1050, 360],
            [1050, 360, 520, 790],
          ].map(([x1, y1, x2, y2], i) => {
            const k = rampa(frame, cruzar - 6 + i * 6, 14);
            return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * k * 0.62} y2={y1 + (y2 - y1) * k * 0.62} stroke="white" strokeOpacity={0.6} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />;
          })}
        </svg>
      )}
    </>
  );
};

export const A3: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const risca = rampa(frame, m("dado") + 4, 10);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 200, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 42, color: CINZA }}>O problema nunca foi</div>
      </Surge>
      <Surge de={m("falta") - 4} style={{ left: 0, right: 0, top: 270, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", ...TITULO, fontSize: 104, color: "white", opacity: 1 - risca * 0.45 }}>
          FALTA DE DADO
          <div style={{ position: "absolute", left: -10, top: "52%", height: 12, borderRadius: 6, width: `calc(${risca * 100}% + ${risca * 20}px)`, opacity: risca > 0 ? 1 : 0, background: VERMELHO }} />
        </div>
      </Surge>
      <Surge de={m("falta", 1) - 4} style={{ left: 0, right: 0, top: 440, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 42, color: CINZA }}>É a falta de</div>
        <div style={{ ...TITULO, fontSize: 150, lineHeight: 1.05, ...textoDegrade }}>BRAÇO</div>
      </Surge>
      <div style={{ position: "absolute", left: 0, right: 0, top: 730, display: "flex", justifyContent: "center", gap: 26 }}>
        {[
          ["cruzar", "CRUZAR TUDO"],
          ["agir", "AGIR"],
          ["mesmo", "NO MESMO DIA"],
        ].map(([p, t]) => (
          <div key={p} style={{ position: "relative", width: t.length * 25 + 70, height: 80 }}>
            <Surge de={m(p) - 4} style={{ left: 0, top: 0 }}>
              <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: VERDE, padding: "16px 30px", borderRadius: 12, border: `2px solid ${VERDE}`, background: "rgba(60,224,30,0.08)", whiteSpace: "nowrap" }}>{t}</div>
            </Surge>
          </div>
        ))}
      </div>
    </>
  );
};

// ======================================================================================
// 2. Apresentação: a Ana e o que o Agentic Office faz
// ======================================================================================
const VERBOS = [
  ["lê", "LÊ"],
  ["cruza", "CRUZA"],
  ["decide", "DECIDE"],
  ["executa", "EXECUTA"],
] as const;
export const A4: React.FC<P> = ({ c }) => {
  const m = marcas(c);
  return (
    <>
      <FotoAna arquivo="ana-verde.jpg" x={120} dur={c.dur} />
      <Sequence from={m("Ana") - 4} layout="none">
        <TarjaAna x={940} y={110} />
      </Sequence>
      <Surge de={m("Agentic") - 6} style={{ left: 940, top: 330 }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 620 }} />
      </Surge>
      <div style={{ position: "absolute", left: 940, top: 520, display: "flex", gap: 16 }}>
        {VERBOS.map(([p, t]) => (
          <div key={p} style={{ position: "relative", width: t.length * 30 + 60, height: 80 }}>
            <Surge de={m(p) - 4} style={{ left: 0, top: 0 }}>
              <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 36, letterSpacing: 3, color: VERDE, padding: "14px 26px", borderRadius: 12, border: `2px solid ${VERDE}`, background: "rgba(60,224,30,0.08)" }}>{t}</div>
            </Surge>
          </div>
        ))}
      </div>
      <Surge de={m("aprova") - 4} style={{ left: 940, top: 650 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 38, color: CINZA }}>e você</div>
        <div style={{ ...TITULO, fontSize: 104, lineHeight: 1.02, ...textoDegrade }}>SÓ APROVA</div>
      </Surge>
    </>
  );
};

// ======================================================================================
// 3. A virada: 8h da manhã (Observação diária) e a ação que chega pronta
// ======================================================================================
const Relogio: React.FC<{ readonly hora: string; readonly k?: number }> = ({ hora, k = 1 }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: 18, opacity: k }}>
    <div style={{ ...TITULO, fontSize: 170, lineHeight: 1, color: "white", letterSpacing: -4 }}>{hora}</div>
  </div>
);

// Resultados › Observações do dia, com a observação da Diretoria aberta
const B: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => <b style={{ fontWeight: 700 }}>{children}</b>;
const PANORAMA: React.ReactNode[] = [
  <>
    <B>Tarefas (24h):</B> 6 — 4 concluídas, 2 em andamento. <B>Rotinas que falharam: nenhuma.</B>
  </>,
  <>
    <B>Estoque:</B> 38 itens sem giro há 90 dias, somando <B>R$ 64 mil</B>.
  </>,
  <>
    <B>Financeiro:</B> a conciliação de ontem achou <B>1 divergência</B> nos recebíveis de cartão.
  </>,
  <>
    <B>Plano de ação:</B> 3 pedidos de novo prazo aguardando decisão.
  </>,
];
const SETORES = [
  ["Comercial e Lojas — CRO · Diego", "A loja Centro fechou a semana 6% abaixo da meta; o restante da rede segue no ritmo previsto."],
  ["Operações e Estoque — COO · Renata", "38 itens estão sem giro há 90 dias. A promoção foi delegada ao César, dentro da margem mínima."],
  ["Financeiro — CFO · Otávio", "A conciliação de 14/11 apontou uma diferença de R$ 1.450 nos recebíveis de cartão. A conferência foi delegada à Mei."],
];
export const Y_PANORAMA = 470;
export const Y_SETORES = 760;
const Observacoes: React.FC<{ readonly aberta: number; readonly acende?: "panorama" | "setores" | null }> = ({ aberta, acende }) => (
  <>
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <Quadradinho>
        <Icone nome="resultados" tam={18} cor={M.verde} />
      </Quadradinho>
      <div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.25 }}>Resultados</div>
        <DescricaoM>Tudo que os seus agentes já produziram nas tarefas da Gestão de Tarefas, catalogado e ligado à tarefa de origem.</DescricaoM>
      </div>
    </div>
    <div style={{ marginTop: 18, padding: 14, borderRadius: 10, border: `1px solid ${M.borda}`, background: M.card, display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
      <span style={{ color: M.suave, padding: "0 12px" }}>Peças produzidas 12</span>
      <span style={{ background: "white", color: M.fundo, padding: "7px 10px", borderRadius: 4 }}>Observações do dia 31</span>
    </div>
    <div style={{ marginTop: 16, padding: 16, borderRadius: 10, background: M.card, border: `1px solid ${aberta > 0 ? "rgba(134,239,172,0.35)" : M.borda}` }}>
      <div style={{ display: "flex", gap: 12 }}>
        <Quadradinho>
          <Icone nome="templates" tam={18} cor={M.verde} />
        </Quadradinho>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Observação diária da D...</div>
            <ChipM cheio style={{ fontSize: 12 }}>
              Texto
            </ChipM>
          </div>
          <div style={{ fontSize: 12.5, color: M.suave, marginTop: 4 }}>⌂ Helena</div>
          <div style={{ fontSize: 12.5, color: M.suave, marginTop: 4 }}>tarefa: Observação diária · ...</div>
          <div style={{ fontSize: 12.5, color: M.suave, marginTop: 4 }}>17/11/2026</div>
        </div>
      </div>
      <div style={{ overflow: "hidden", height: aberta * 900 }}>
        <div style={{ marginTop: 18, padding: "20px 18px", borderRadius: 8, background: "#111A15", fontSize: 13.5, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5, lineHeight: 1.5 }}>Observação diária da Diretoria — 17/11/2026 (terça-feira)</div>
          <div style={{ marginTop: 16, padding: acende === "panorama" ? "6px 8px" : 0, margin: acende === "panorama" ? "10px -8px 0" : "16px 0 0", borderRadius: 6, border: acende === "panorama" ? `1px solid ${M.verde}` : "1px solid transparent" }}>
            <div style={{ fontWeight: 600 }}>Panorama</div>
            {PANORAMA.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <span>•</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: acende === "setores" ? "6px 8px" : 0, margin: acende === "setores" ? "14px -8px 0" : "20px 0 0", borderRadius: 6, border: acende === "setores" ? `1px solid ${M.verde}` : "1px solid transparent" }}>
            <div style={{ fontWeight: 600 }}>Setores</div>
            {SETORES.map(([t, d]) => (
              <div key={t} style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600 }}>{t}</div>
                <div>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export const V1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const abre = m("observação") - 4;
  const panorama = m("panorama");
  const area = m("área");
  const rola = rolagem(c, 0, [
    [panorama, Y_PANORAMA - 140],
    [area, Y_SETORES - 120],
  ]);
  return (
    <>
      <Celular de={-1}>
        <TelaM quadro={TEL} rola={rola} menuBadge={3}>
          <Observacoes aberta={rampa(frame, abre, 14)} acende={frame >= area - 6 ? "setores" : frame >= panorama - 6 ? "panorama" : null} />
        </TelaM>
      </Celular>
      <Surge de={0} style={{ left: 1000, top: 130 }}>
        <Rotulo>TODO DIA</Rotulo>
        <Relogio hora="08:00" />
      </Surge>
      <Surge de={m("Diretoria") - 4} style={{ left: 1000, top: 380 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA, marginBottom: 14 }}>a Diretoria de IA entrega</div>
        <div style={{ display: "flex", gap: 10 }}>
          {DIRETORIA.slice(0, 6).map((d) => (
            <Avatar key={d.nome} nome={d.nome} cor={d.cor} foto={d.foto} tam={74} />
          ))}
        </div>
      </Surge>
      <Surge de={m("panorama") - 4} style={{ left: 1000, top: 560 }}>
        <div style={{ ...TITULO, fontSize: 60, lineHeight: 1.08, color: "white" }}>O PANORAMA</div>
        <div style={{ ...TITULO, fontSize: 60, lineHeight: 1.08, opacity: frame >= area - 4 ? 1 : 0, ...textoDegrade }}>E CADA ÁREA</div>
      </Surge>
    </>
  );
};

// tela de bloqueio do celular com a notificação
const Bloqueio: React.FC<{ readonly notif: number }> = ({ notif }) => (
  <div style={{ position: "absolute", left: TEL.x, top: TEL.y, width: TEL.w, height: TEL.h, borderRadius: TEL.raio, overflow: "hidden", background: "radial-gradient(circle at 30% 20%, #1D4A2A, #08100B 70%)" }}>
    <div style={{ textAlign: "center", marginTop: 90, fontFamily, color: "white" }}>
      <div style={{ fontWeight: 600, fontSize: 24, opacity: 0.85 }}>terça-feira, 17 de novembro</div>
      <div style={{ fontWeight: 700, fontSize: 130, lineHeight: 1.05, letterSpacing: -3 }}>8:02</div>
    </div>
    <div style={{ position: "absolute", left: 22, right: 22, top: 330, padding: "18px 20px", borderRadius: 24, background: "rgba(240,244,241,0.88)", color: "#101412", fontFamily, opacity: notif, transform: `translateY(${(1 - notif) * -40}px) scale(${0.96 + notif * 0.04})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 11, background: "#0C140F", display: "grid", placeItems: "center", overflow: "hidden" }}>
          <Img src={staticFile("midia/logo-agentic-office.png")} style={{ height: 30, objectFit: "cover", objectPosition: "0 50%", width: 30 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 700 }}>
            Agentic Office <span style={{ fontWeight: 500, color: "#5A615C", fontSize: 17 }}>agora</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 600, marginTop: 2 }}>3 ações prontas para aprovar</div>
        </div>
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.35, color: "#2E3531", marginTop: 8 }}>Diretoria de IA: promoção para itens parados, diferença nos recebíveis e 3 pedidos de novo prazo.</div>
    </div>
  </div>
);

// e-mail da Diretoria, do lado direito
const Email: React.FC = () => (
  <div style={{ width: 760, borderRadius: 18, overflow: "hidden", background: "#F4F6F5", color: "#141815", fontFamily, boxShadow: "0 30px 70px rgba(0,0,0,0.55)" }}>
    <div style={{ padding: "22px 30px", borderBottom: "1px solid #DADFDC" }}>
      <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2 }}>3 ações prontas para a sua aprovação</div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#0C140F", display: "grid", placeItems: "center", color: "#86EFAC", fontWeight: 800, fontSize: 18 }}>AO</div>
        <div style={{ fontSize: 20, lineHeight: 1.3 }}>
          <b>Diretoria de IA · Agentic Office</b>
          <div style={{ color: "#5A615C", fontSize: 18 }}>para você · 08:02</div>
        </div>
      </div>
    </div>
    <div style={{ padding: "18px 30px 26px", fontSize: 21, lineHeight: 1.45 }}>
      {["Promoção para 38 itens parados há 90 dias", "Diferença de R$ 1.450 nos recebíveis de cartão", "3 pedidos de novo prazo no plano de ação"].map((t, i) => (
        <div key={t} style={{ display: "flex", gap: 12, padding: "8px 0" }}>
          <span style={{ color: "#16A34A", fontWeight: 800 }}>{i + 1}.</span>
          {t}
        </div>
      ))}
      <div style={{ display: "inline-block", marginTop: 14, padding: "12px 24px", borderRadius: 6, background: "#0C140F", color: "white", fontWeight: 700, fontSize: 20 }}>Abrir em Decisões</div>
    </div>
  </div>
);

export const V2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = marcas(c);
  const notif = spring({ frame: frame - (m("notificação") - 6), fps, config: { damping: 14, stiffness: 150 } });
  const toque = m("aprovação") - 2;
  const abre = rampa(frame, toque + 6, 10);
  const [tx, ty] = naTela(206, 380);
  return (
    <>
      <Celular de={-1}>
        <Bloqueio notif={frame >= m("notificação") - 6 ? notif : 0} />
        {abre > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: abre }}>
            <TelaM quadro={TEL} menuBadge={3}>
              <ListaDecisoes />
            </TelaM>
          </div>
        )}
        <Toque x={tx} y={ty} em={toque} />
      </Celular>
      <Surge de={0} ate={m("e-mail") - 8} style={{ left: 1000, top: 200 }}>
        <Rotulo>QUANDO PRECISA DE AÇÃO</Rotulo>
        <div style={{ ...TITULO, fontSize: 84, lineHeight: 1.04, color: "white", marginTop: 14 }}>ELA NÃO</div>
        <div style={{ ...TITULO, fontSize: 84, lineHeight: 1.04, color: "white" }}>SÓ AVISA:</div>
        <div style={{ ...TITULO, fontSize: 84, lineHeight: 1.04, opacity: frame >= m("pronta") - 4 ? 1 : 0, ...textoDegrade }}>CHEGA PRONTA</div>
      </Surge>
      <Surge de={m("e-mail") - 6} style={{ left: 1000, top: 150 }}>
        <Email />
      </Surge>
    </>
  );
};

// ======================================================================================
// 4. Três ações prontas: estoque (delegação ao César → proposta para aprovar)
// ======================================================================================
const Numero: React.FC<{ readonly valor: string; readonly rotulo: string; readonly cor?: string }> = ({ valor, rotulo, cor = "white" }) => (
  <div>
    <div style={{ ...TITULO, fontSize: 92, lineHeight: 1, color: cor, whiteSpace: "nowrap" }}>{valor}</div>
    <div style={{ fontFamily, fontWeight: 600, fontSize: 28, color: CINZA, marginTop: 6, whiteSpace: "nowrap" }}>{rotulo}</div>
  </div>
);

const DESC_PROMO = (margem: boolean) => (
  <>
    Montar uma promoção para os 38 itens sem giro há 90 dias (R$ 64 mil em estoque), a partir do sortimento e dos preços atuais. Para cada item, trazer: preço atual, preço sugerido, desconto e a margem resultante. <span style={margem ? { color: M.verde, fontWeight: 600, textDecoration: "underline" } : undefined}>Respeitar a margem mínima de cada categoria</span>. Entregar a proposta para aprovação: não alterar preços nas lojas antes do ok.
  </>
);
const CESAR = EXECUTORES.find((e) => e.nome === "César")!;
const RENATA = DIRETORIA.find((d) => d.nome === "Renata")!;

export const D1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const toque = m("Diretoria") - 2;
  const k = rampa(frame, toque + 6, 10);
  const [tx, ty] = naTela(220, 330);
  return (
    <>
      <Celular de={-1}>
        <TelaM quadro={TEL} menuBadge={3} sobre={k > 0 ? <FolhaDecisao k={k} titulo={DECISOES[0].titulo} tipo="Delegação da diretoria" agente="César" descricao={DESC_PROMO(frame >= m("margem") - 4)} botoes={<><BotaoFolha branco>Iniciar</BotaoFolha><BotaoFolha>Cancelar tarefa</BotaoFolha></>} eventos={[{ texto: `Delegada pela diretoria (Renata) ao agente César: "${DECISOES[0].titulo}".`, quando: "17/11, 08:00 · Renata" }]} /> : null}>
          <ListaDecisoes aceso={frame >= m("estoque") - 6 ? 0 : -1} />
        </TelaM>
        <Toque x={tx} y={ty} em={toque} />
      </Celular>
      <Surge de={m("estoque") - 6} style={{ left: 1000, top: 110 }}>
        <Rotulo>NO ESTOQUE</Rotulo>
      </Surge>
      <div style={{ position: "absolute", left: 1000, top: 170, display: "flex", flexDirection: "column", gap: 34 }}>
        {[
          ["trinta", "38", "itens parados", "white"],
          ["noventa", "90 dias", "sem giro", "white"],
          ["sessenta", "R$ 64 mil", "empatados", VERMELHO],
        ].map(([p, v, r, cor]) => (
          <div key={p} style={{ position: "relative", height: 130 }}>
            <Surge de={m(p) - 4} ate={toque - 4} style={{ left: 0, top: 0 }}>
              <Numero valor={v} rotulo={r} cor={cor} />
            </Surge>
          </div>
        ))}
      </div>
      <Surge de={toque} style={{ left: 1000, top: 200 }}>
        <Rotulo>DELEGAÇÃO DA DIRETORIA</Rotulo>
        <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 30 }}>
          <div style={{ textAlign: "center" }}>
            <Avatar nome={RENATA.nome} cor={RENATA.cor} foto={RENATA.foto} tam={130} />
            <div style={{ fontFamily, fontWeight: 700, fontSize: 28, color: "white", marginTop: 10 }}>Renata</div>
            <div style={{ fontFamily, fontSize: 22, color: CINZA }}>Diretora de Operações</div>
          </div>
          <svg width={120} height={40}>
            <line x1={0} y1={20} x2={100} y2={20} stroke={VERDE} strokeWidth={5} strokeDasharray="2 12" strokeLinecap="round" />
            <path d="M98 8l16 12-16 12" fill="none" stroke={VERDE} strokeWidth={5} strokeLinecap="round" />
          </svg>
          <div style={{ textAlign: "center" }}>
            <Avatar nome={CESAR.nome} cor={CESAR.cor} foto={CESAR.foto} tam={130} brilho={0.6} />
            <div style={{ fontFamily, fontWeight: 700, fontSize: 28, color: "white", marginTop: 10 }}>César</div>
            <div style={{ fontFamily, fontSize: 22, color: CINZA }}>Agente de análise</div>
          </div>
        </div>
      </Surge>
      <Surge de={m("margem") - 4} style={{ left: 1000, top: 560 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA }}>uma promoção que respeite a</div>
        <div style={{ ...TITULO, fontSize: 72, lineHeight: 1.05, ...textoDegrade }}>MARGEM MÍNIMA</div>
      </Surge>
    </>
  );
};

// a proposta do César, de volta para aprovação
const PROPOSTA = [
  ["Ventilador de coluna 40 cm", "R$ 249,90", "R$ 199,90", "22%"],
  ["Jogo de panelas 5 peças", "R$ 389,00", "R$ 319,00", "24%"],
  ["Luminária LED de mesa", "R$ 129,90", "R$ 99,90", "21%"],
  ["Cadeira de escritório", "R$ 599,00", "R$ 499,00", "25%"],
];
const Entrega: React.FC = () => (
  <>
    <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", marginTop: 24 }}>ENTREGA</div>
    <div style={{ marginTop: 10, padding: "14px 14px", borderRadius: 8, background: "#141C17" }}>
      <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.4 }}>Promoção dos itens parados — proposta</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5, marginTop: 6 }}>
        <b>38 itens</b>, desconto médio de <b>19%</b>. Todos acima da margem mínima. Recuperação estimada: <b>R$ 51 mil</b> em 30 dias.
      </div>
      <div style={{ marginTop: 10, fontSize: 11.5 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.9fr 1fr 1fr 0.7fr", gap: 6, color: M.suave, paddingBottom: 6, borderBottom: `1px solid ${M.borda}` }}>
          <span>Item</span>
          <span>Atual</span>
          <span>Promo</span>
          <span>Margem</span>
        </div>
        {PROPOSTA.map((l) => (
          <div key={l[0]} style={{ display: "grid", gridTemplateColumns: "1.9fr 1fr 1fr 0.7fr", gap: 6, padding: "6px 0", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
            <span>{l[0]}</span>
            <span style={{ color: M.suave }}>{l[1]}</span>
            <span style={{ color: M.verde }}>{l[2]}</span>
            <span>{l[3]}</span>
          </div>
        ))}
      </div>
    </div>
  </>
);
const Revisao: React.FC = () => (
  <div style={{ marginTop: 18, padding: "12px 14px", borderRadius: 6, border: "1px solid #7A5A1E", background: "#1C1A12" }}>
    <div style={{ fontSize: 12.5, fontWeight: 700 }}>Renata revisou — aprovar</div>
    <div style={{ fontSize: 12, lineHeight: 1.5, color: M.suave, marginTop: 4 }}>A proposta cobre os 38 itens e nenhum preço fica abaixo da margem mínima da categoria. Pronta para a sua decisão.</div>
  </div>
);

export const D2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const inicia = m("Iniciar");
  const monta = m("monta");
  const volta = m("volta") - 4;
  const aprova = m("aprovação");
  const [ix, iy] = naTela(48, 432);
  const k2 = rampa(frame, volta, 12);
  const eventos1 = [
    { texto: `Delegada pela diretoria (Renata) ao agente César: "${DECISOES[0].titulo}".`, quando: "17/11, 08:00 · Renata" },
    ...(frame >= inicia + 4 ? [{ texto: "Iniciada por você.", quando: "17/11, 08:14 · você", novo: true }] : []),
    ...(frame >= monta ? [{ texto: "César está montando a proposta com os preços.", quando: "17/11, 08:14 · César", novo: true }] : []),
  ];
  return (
    <>
      <Celular de={-1}>
        <TelaM
          quadro={TEL}
          menuBadge={3}
          sobre={
            <>
              <FolhaDecisao k={1} titulo={DECISOES[0].titulo} tipo="Delegação da diretoria" agente="César" descricao={DESC_PROMO(false)} botoes={frame < inicia + 4 ? <><BotaoFolha branco aceso={frame >= inicia - 8}>Iniciar</BotaoFolha><BotaoFolha>Cancelar tarefa</BotaoFolha></> : <ChipM style={{ fontSize: 12.5, padding: "6px 12px" }}>Em andamento · César</ChipM>} eventos={eventos1} />
              {k2 > 0 && (
                <FolhaDecisao
                  k={k2}
                  y={interpolate(frame, [aprova + 12, Math.max(aprova + 13, c.dur - 12)], [0, 250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                  titulo="Promoção para 38 itens parados — proposta"
                  tipo="Aprovação"
                  agente="César"
                  descricao="Entregar a proposta de promoção dos 38 itens parados, com preço atual, preço sugerido e margem de cada item, para a sua aprovação."
                  revisao={<Revisao />}
                  botoes={
                    <>
                      <BotaoFolha branco aceso={frame >= aprova - 6}>
                        Aprovar
                      </BotaoFolha>
                      <BotaoFolha>Reprovar</BotaoFolha>
                    </>
                  }
                  entrega={<Entrega />}
                  eventos={[{ texto: "César entregou a proposta. Renata revisou.", quando: "17/11, 08:31 · César", novo: true }]}
                />
              )}
            </>
          }
        >
          <ListaDecisoes aceso={0} />
        </TelaM>
        <Toque x={ix} y={iy} em={inicia} />
      </Celular>
      <div style={{ position: "absolute", left: 1000, top: 150, display: "flex", flexDirection: "column", gap: 26 }}>
        {[
          [inicia - 4, "1", "Você toca em Iniciar"],
          [monta - 4, "2", "César monta a proposta"],
          [volta, "3", "Volta pra sua aprovação"],
        ].map(([de, n, t]) => (
          <div key={n} style={{ position: "relative", height: 110 }}>
            <Surge de={de as number} style={{ left: 0, top: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 84, height: 84, borderRadius: "50%", border: `3px solid ${VERDE}`, display: "grid", placeItems: "center", ...TITULO, fontSize: 40, color: VERDE }}>{n}</div>
                <div style={{ ...TITULO, fontSize: 50, color: "white", whiteSpace: "nowrap" }}>{t}</div>
              </div>
            </Surge>
          </div>
        ))}
      </div>
      <Surge de={m("lojas") - 6} style={{ left: 1000, top: 610 }}>
        <div style={{ padding: "18px 28px", borderRadius: 14, border: `2px solid ${VERDE}`, background: "rgba(60,224,30,0.08)", fontFamily, fontWeight: 700, fontSize: 34, color: "white" }}>
          Nada chega às lojas sem o seu ok
        </div>
      </Surge>
    </>
  );
};
