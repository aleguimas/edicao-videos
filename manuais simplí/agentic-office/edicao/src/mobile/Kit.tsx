import type React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Icone } from "../agentic/App";
import type { Cena } from "../ana/voz";
import { Avatar } from "../apresentacao/comum";
import { fonteMonoSistema, fonteSistema } from "../fonte";
import { LARGURA } from "../cortes/Vertical";

// Kit das telas mobile do Agentic Office, para os cortes 9:16. Tudo é desenhado em pixels de CSS do
// celular (412 de largura), com os mesmos valores do sistema, e escalado para a largura do vídeo.
// Referência: manuais simplí/agentic-office/referencia-mobile (capturas internas, com dados reais).
// Nas telas entram só dados fictícios da Loja Modelo.
export const M = {
  fundo: "#0C140F",
  card: "rgba(15,29,21,0.88)",
  cardSolido: "#0F1D15",
  destaque: "#1A2A20",
  borda: "rgba(255,255,255,0.12)",
  texto: "#FFFFFF",
  suave: "#98A09B",
  verde: "#86EFAC",
  verdeForte: "#16A34A",
  amarelo: "#F5B82E",
  vermelho: "#F87171",
  laranja: "#FF8A3D",
  azul: "#60A5FA",
};
export const CSS_LARGURA = 412;
export const ESCALA = LARGURA / CSS_LARGURA;
// a tela mobile ocupa a largura toda e vai até logo acima da legenda
export const TELA = { y: 360, h: 1120 };
const BARRA = 61;
// altura útil abaixo da barra branca, em pixels de CSS
export const VISIVEL = TELA.h / ESCALA - BARRA;

// ---------- quadro do celular: barra branca fixa e conteúdo que rola
export type Rolagem = readonly (readonly [number, number])[];
// [palavra (frame), y]: fica parada até 16 frames antes da palavra e rola até y
export const rolagem = (c: Cena, inicio: number, alvos: readonly (readonly [number, number])[]): Rolagem => {
  const q: [number, number][] = [[0, inicio]];
  let y = inicio;
  alvos.forEach(([f, a]) => {
    const parte = Math.max(q[q.length - 1][0] + 1, f - 16);
    q.push([parte, y], [parte + 16, a]);
    y = a;
  });
  q.push([Math.max(c.dur, q[q.length - 1][0] + 1), y]);
  return q;
};
// quadro: onde a tela fica no vídeo (padrão = largura toda do 9:16); no 16:9 ela vai dentro de um celular.
// sobre: camada por cima de tudo, inclusive da barra branca (folhas em tela cheia, como a da Decisão)
export type QuadroTela = { readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly raio?: number };
export const TelaM: React.FC<{ readonly rola?: Rolagem; readonly menuBadge?: number; readonly fixo?: React.ReactNode; readonly sobre?: React.ReactNode; readonly quadro?: QuadroTela; readonly children: React.ReactNode }> = ({ rola, menuBadge, fixo, sobre, quadro, children }) => {
  const frame = useCurrentFrame();
  const q = quadro ?? { x: 0, y: TELA.y, w: LARGURA, h: TELA.h };
  const esc = q.w / CSS_LARGURA;
  const y = !rola || rola.length < 2 ? (rola?.[0]?.[1] ?? 0) : interpolate(frame, rola.map((q) => q[0]), rola.map((q) => q[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: q.x, top: q.y, width: q.w, height: q.h, overflow: "hidden", borderRadius: q.raio ?? 0, ...(quadro ? {} : { WebkitMaskImage: "linear-gradient(black calc(100% - 40px), transparent)", maskImage: "linear-gradient(black calc(100% - 40px), transparent)" }) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: CSS_LARGURA, height: q.h / esc, transform: `scale(${esc})`, transformOrigin: "0 0", overflow: "hidden", fontFamily: fonteSistema, color: M.texto, background: M.fundo, backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "44px 44px" }}>
        <div style={{ position: "absolute", left: 0, top: BARRA, right: 0, bottom: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: -y, width: CSS_LARGURA, boxSizing: "border-box", padding: 16 }}>{children}</div>
          {fixo}
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: BARRA, background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", boxSizing: "border-box" }}>
          <Img src={staticFile("midia/logo-agentic-office-fundo-claro.png")} style={{ width: 150, marginLeft: -4 }} />
          <div style={{ position: "relative", width: 36, height: 36, boxSizing: "border-box", borderRadius: 4, border: "1px solid #0A0A0A", display: "grid", placeItems: "center" }}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth={2} strokeLinecap="round">
              <path d="M4 5h16M4 12h16M4 19h16" />
            </svg>
            {menuBadge ? <div style={{ position: "absolute", right: -7, top: -7, width: 16, height: 16, borderRadius: "50%", background: "#1F6B2A", color: "white", fontSize: 10, display: "grid", placeItems: "center" }}>{menuBadge}</div> : null}
          </div>
        </div>
        {sobre}
      </div>
    </div>
  );
};

// ---------- peças
export const TituloM: React.FC<{ readonly icone?: string; readonly children: React.ReactNode; readonly tam?: number }> = ({ icone, children, tam = 24 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {icone && <Icone nome={icone} tam={22} cor="white" />}
    <div style={{ fontSize: tam, fontWeight: 600, letterSpacing: "0.14em", lineHeight: 1.33, textTransform: "uppercase" }}>{children}</div>
  </div>
);
export const DescricaoM: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => <div style={{ fontSize: 13.5, lineHeight: 1.45, color: M.suave, marginTop: 4 }}>{children}</div>;
export const CaminhoM: React.FC<{ readonly a: string }> = ({ a }) => (
  <div style={{ fontSize: 11, letterSpacing: "0.06em", color: M.suave, marginBottom: 12 }}>
    agentic-office <span style={{ opacity: 0.6 }}>/</span> <span style={{ color: "white" }}>{a}</span>
  </div>
);
export const RotuloM: React.FC<{ readonly children: React.ReactNode; readonly cor?: string }> = ({ children, cor = M.suave }) => (
  <div style={{ fontFamily: fonteMonoSistema, fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", color: cor, textTransform: "uppercase" }}>
    <span style={{ color: M.verde }}>//</span> {children}
  </div>
);
export const BotaoM: React.FC<{ readonly tipo?: "branco" | "verde" | "contorno" | "vermelho"; readonly icone?: string; readonly tam?: number; readonly aceso?: boolean; readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ tipo = "contorno", icone, tam = 14, aceso, children, style }) => {
  const bg = tipo === "branco" ? "white" : tipo === "verde" ? M.verde : tipo === "vermelho" ? "#B23A3A" : "rgba(15,29,21,0.6)";
  const cor = tipo === "branco" || tipo === "verde" ? M.fundo : "white";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 36, boxSizing: "border-box", padding: "0 13px", borderRadius: 4, fontSize: tam, fontWeight: 500, whiteSpace: "nowrap", background: bg, color: cor, border: tipo === "contorno" ? `1px solid ${M.borda}` : "none", boxShadow: aceso ? `0 0 0 2px ${M.verde}, 0 0 16px rgba(134,239,172,0.5)` : "none", ...style }}>
      {icone && <Icone nome={icone} tam={15} />}
      {children}
    </div>
  );
};
export const CartaoM: React.FC<{ readonly aceso?: boolean; readonly pad?: number; readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({ aceso, pad = 20, style, children }) => (
  <div style={{ boxSizing: "border-box", borderRadius: 10, background: M.card, border: `1px solid ${aceso ? M.verde : M.borda}`, boxShadow: aceso ? "0 0 18px rgba(134,239,172,0.3)" : "none", padding: pad, ...style }}>{children}</div>
);
export const ChipM: React.FC<{ readonly cheio?: boolean; readonly cor?: string; readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ cheio, cor = M.verde, children, style }) => (
  <span style={{ display: "inline-block", fontSize: 11, lineHeight: "16px", padding: "2px 9px", borderRadius: 99, whiteSpace: "nowrap", background: cheio ? cor : "transparent", color: cheio ? M.fundo : cor, border: cheio ? `1px solid ${cor}` : `1px solid ${M.borda}`, ...style }}>{children}</span>
);
export const AbasM: React.FC<{ readonly abas: readonly string[]; readonly ativa: string }> = ({ abas, ativa }) => (
  <div style={{ display: "flex", gap: 20, borderBottom: `1px solid ${M.borda}`, overflow: "hidden", fontSize: 13 }}>
    {abas.map((a) => (
      <div key={a} style={{ padding: "10px 4px", whiteSpace: "nowrap", color: a === ativa ? "white" : M.suave, borderBottom: `2px solid ${a === ativa ? "white" : "transparent"}`, marginBottom: -1 }}>
        {a}
      </div>
    ))}
  </div>
);
export const SegM: React.FC<{ readonly abas: readonly string[]; readonly ativa: string }> = ({ abas, ativa }) => (
  <div style={{ display: "inline-flex", gap: 4, padding: 3, borderRadius: 6, background: "rgba(15,29,21,0.7)", fontSize: 13 }}>
    {abas.map((a) => (
      <div key={a} style={{ padding: "6px 8px", borderRadius: 4, color: a === ativa ? "white" : M.suave, background: a === ativa ? M.destaque : "transparent", border: `1px solid ${a === ativa ? M.borda : "transparent"}` }}>
        {a}
      </div>
    ))}
  </div>
);
export const NumeroM: React.FC<{ readonly rotulo: string; readonly valor: React.ReactNode; readonly nota?: string; readonly cor?: string; readonly aceso?: boolean; readonly tam?: number }> = ({ rotulo, valor, nota, cor = "white", aceso, tam = 22 }) => (
  <CartaoM pad={14} aceso={aceso}>
    <div style={{ fontSize: 12, color: M.suave, lineHeight: 1.3 }}>{rotulo}</div>
    <div style={{ fontSize: tam, fontWeight: 600, color: cor, marginTop: 6 }}>{valor}</div>
    {nota && <div style={{ fontSize: 11, color: M.suave, marginTop: 4, lineHeight: 1.35 }}>{nota}</div>}
  </CartaoM>
);
export const SeletorM: React.FC<{ readonly children: React.ReactNode; readonly aceso?: boolean; readonly style?: React.CSSProperties }> = ({ children, aceso, style }) => (
  <div style={{ height: 36, boxSizing: "border-box", padding: "0 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 4, fontSize: 13, background: "rgba(15,29,21,0.6)", border: `1px solid ${aceso ? M.verde : M.borda}`, boxShadow: aceso ? "0 0 14px rgba(134,239,172,0.35)" : "none", ...style }}>
    <span>{children}</span>
    <span style={{ color: M.suave, fontSize: 11 }}>⌄</span>
  </div>
);
export const PessoaM: React.FC<{ readonly nome: string; readonly cor: string; readonly foto?: string; readonly aceso?: boolean }> = ({ nome, cor, foto, aceso }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px 3px 3px", borderRadius: 99, background: "white", color: "#111", border: `1px solid ${aceso ? M.verdeForte : "#C9CFCB"}`, boxShadow: aceso ? "0 0 10px rgba(22,163,74,0.6)" : "none", fontSize: 12, fontWeight: 500 }}>
    <Avatar nome={nome} cor={cor} foto={foto} tam={20} />
    {nome}
  </div>
);
