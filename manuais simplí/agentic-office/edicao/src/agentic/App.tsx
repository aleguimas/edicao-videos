import type React from "react";
import { createContext, useContext } from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonteApp, VERDE } from "../fonte";

// Telas do Agentic Office recriadas em React (nada de print: nomes e números são fictícios).
// Janela com barra do macOS, menu lateral e área do módulo, no tamanho LARGURA x ALTURA.
export const LARGURA = 1640;
export const ALTURA = 960;

export const COR = {
  fundo: "#111412",
  lateral: "#0D0F0E",
  cartao: "#161A17",
  borda: "#2A2F2B",
  texto: "#E9ECEA",
  suave: "#9AA19C",
  vermelho: "#FF6B6B",
  amarelo: "#F5B82E",
  verde: VERDE,
};

// ícones de traço simples (24x24)
const ICONES: Record<string, string> = {
  painel: "M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z",
  olho: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  tarefas: "M5 4h14v16H5zM9 8v8M15 8v5",
  decisoes: "M8 4h8v3H8zM6 6H5v15h14V6h-1M9 14l2 2 4-4",
  projetos: "M3 6h7l2 2h9v12H3z",
  cronograma: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
  rotinas: "M4 6h16v14H4zM8 3v5M16 3v5M12 12v3l2 2",
  apps: "M3 5h18v14H3zM3 9h18",
  calls: "M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4",
  conciliacao: "M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18",
  verbas: "M3 13l4-4 4 3 4-5 6 6M3 18h18",
  resultados: "M4 4h16v5H4zM6 9v11h12V9M10 13h4",
  config: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2",
  importar: "M12 16V4M7 9l5-5 5 5M4 20h16",
  exportar: "M12 4v12M7 11l5 5 5-5M4 20h16",
  mais: "M12 5v14M5 12h14",
  agentes: "M6 8h12v11H6zM9 4h6M12 4v4M9 13h.01M15 13h.01M10 16h4",
  coroa: "M3 8l4 4 5-7 5 7 4-4-2 11H5z",
  varinha: "M4 20L16 8M14 4v3M18 6h3M19 10v3M11 3l1 2",
  estoque: "M3 9l9-5 9 5v11H3zM7 20v-6h10v6M7 17h10",
  comercial: "M4 12l5-5 4 4 7-7M14 4h6v6",
  gestao: "M5 18a8 8 0 1 1 14 0M12 14l4-5",
  livro: "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11",
  memoria: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  integracoes: "M7 7h4v4H7zM13 13h4v4h-4zM11 9h4v4M9 11v4h4",
  logs: "M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4M12 8v4l3 2",
  prospeccao: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2",
  rastreio: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
  acompanhamento: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  base: "M4 5v14M8 5v14M13 5l5 14",
  templates: "M4 4h16v6H4zM4 14h7v6H4zM15 14h5v6h-5z",
  carteira: "M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1zM4 7l11-3v3M16 13h4",
  enviar: "M21 3L3 10l7 3 3 7zM10 13l11-10",
  editar: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  play: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM10 8.5v7l6-3.5z",
  aperto: "M3 12l4-4 4 2 3-2 7 5-3 3M8 15l2 2M11 14l2 2M3 12l5 5",
};
export const Icone: React.FC<{ readonly nome: string; readonly tam?: number; readonly cor?: string }> = ({ nome, tam = 20, cor = "currentColor" }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={ICONES[nome]} />
  </svg>
);

// [ícone, nome, badge]: ícone "" = rótulo de seção; "sub" = item de submenu (recuado, sem ícone);
// badge "v"/"^" = seta de grupo fechado/aberto, outro texto = contador
export type ItemMenu = [string, string, string?];
const MENU: ItemMenu[] = [
  ["painel", "Dashboard"],
  ["olho", "Olho de Deus"],
  ["tarefas", "Gestão de tarefas"],
  ["decisoes", "Decisões", "3"],
  ["projetos", "Projetos"],
  ["", "TRABALHO"],
  ["cronograma", "Cronograma"],
  ["rotinas", "Rotinas"],
  ["apps", "Mini APPS"],
  ["calls", "Calls"],
  ["conciliacao", "Conciliação"],
  ["verbas", "Verbas e Acordos"],
  ["resultados", "Resultados"],
];

// alturas fixas do menu (para o cursor achar cada item)
const TOPO_MENU = 125;
const ITEM = 52;
const ROTULO = 44;
const SUB = 40;
const alturaItem = (ic: string) => (ic === "" ? ROTULO : ic === "sub" ? SUB : ITEM);
// centro de um item do menu lateral, em coordenadas da janela
export const ITEM_MENU = (nome: string, menu: readonly ItemMenu[] = MENU) => {
  let y = 44 + TOPO_MENU;
  for (const [ic, n] of menu) {
    const h = alturaItem(ic);
    if (n === nome) return { x: 150, y: y + h / 2 };
    y += h;
  }
  throw new Error(`item ${nome} não está no menu`);
};

const Lateral: React.FC<{ readonly ativo: string; readonly aceso?: string; readonly menu: readonly ItemMenu[] }> = ({ ativo, aceso, menu }) => (
  <div style={{ width: 300, background: COR.lateral, borderRight: `1px solid ${COR.borda}`, display: "flex", flexDirection: "column" }}>
    <div style={{ height: TOPO_MENU - 15, boxSizing: "border-box", padding: "26px 22px 0" }}>
      <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 230, marginLeft: -14 }} />
    </div>
    <div style={{ height: 1, background: COR.borda, margin: "0 0 14px" }} />
    {menu.map(([ic, nome, badge]) =>
      ic === "" ? (
        <div key={nome} style={{ height: ROTULO, boxSizing: "border-box", fontSize: 14, letterSpacing: 2, color: COR.suave, padding: "18px 26px 0" }}>
          {nome}
        </div>
      ) : ic === "sub" ? (
        <div key={nome} style={{ height: SUB, boxSizing: "border-box", margin: "0 12px 0 38px", padding: "2px 0 2px 10px", borderLeft: `1px solid ${COR.borda}` }}>
          <div
            style={{
              height: SUB - 4,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              borderRadius: 8,
              fontSize: 17,
              fontWeight: nome === ativo ? 700 : 500,
              color: COR.texto,
              background: nome === ativo ? "#000" : "transparent",
              border: nome === ativo ? `1px solid ${COR.borda}` : "1px solid transparent",
              boxShadow: nome === aceso ? `0 0 0 2px ${VERDE}, 0 0 24px rgba(60,224,30,0.4)` : "none",
            }}
          >
            {nome}
          </div>
        </div>
      ) : (
        <div
          key={nome}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            height: ITEM - 4,
            boxSizing: "border-box",
            margin: "2px 12px",
            padding: "0 14px",
            boxShadow: nome === aceso ? `0 0 0 2px ${VERDE}, 0 0 24px rgba(60,224,30,0.4)` : "none",
            borderRadius: 8,
            fontSize: 19,
            fontWeight: nome === ativo ? 700 : 500,
            color: COR.texto,
            background: nome === ativo ? "#000" : "transparent",
            border: nome === ativo ? `1px solid ${COR.borda}` : "1px solid transparent",
          }}
        >
          <Icone nome={ic} />
          <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nome}</span>
          {(badge === "v" || badge === "^") && <span style={{ color: COR.suave, fontSize: 16 }}>{badge === "v" ? "⌄" : "⌃"}</span>}
          {badge && badge !== "v" && badge !== "^" && (
            <span style={{ background: "#1F6B2A", color: "white", borderRadius: 99, width: 26, height: 26, display: "grid", placeItems: "center", fontSize: 14, fontWeight: 700 }}>{badge}</span>
          )}
        </div>
      ),
    )}
    <div style={{ flex: 1 }} />
    <div style={{ borderTop: `1px solid ${COR.borda}`, padding: "16px 22px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 8, background: "#2B3A8F", color: "white", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 18 }}>LM</div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, color: COR.texto }}>Loja Modelo</div>
        <div style={{ fontSize: 14, color: COR.suave }}>Business</div>
      </div>
    </div>
  </div>
);

// janela completa: barra do macOS + menu lateral + conteúdo do módulo
// `menu` troca a lista do menu lateral (a apresentação mostra outros módulos que o vídeo do Verbas)
export const Janela: React.FC<{ readonly ativo: string; readonly aceso?: string; readonly menu?: readonly ItemMenu[]; readonly children: React.ReactNode }> = ({
  ativo,
  aceso,
  menu = MENU,
  children,
}) => (
  <div
    style={{
      width: LARGURA,
      height: ALTURA,
      borderRadius: 16,
      overflow: "hidden",
      background: COR.fundo,
      border: "1px solid #333",
      boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
      fontFamily: fonteApp,
      color: COR.texto,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ height: 44, background: "#1B1E1C", display: "flex", alignItems: "center", gap: 9, padding: "0 18px", borderBottom: `1px solid ${COR.borda}` }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
      ))}
      <div style={{ marginLeft: 16, fontSize: 16, fontWeight: 500 }}>Agentic Office - Gestão empresarial com IA</div>
    </div>
    <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
      <Lateral ativo={ativo} aceso={aceso} menu={menu} />
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          // grade sutil do fundo do sistema
          backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

// ---------- Câmera: quadros-chave [frame, zoom, x, y] — (x, y) é o ponto da janela que fica no centro
export type Quadro = readonly [number, number, number, number];
// nos cortes 9:16 quem move a câmera é o Palco: dentro dele a câmera da cena fica parada neste ponto
export const CameraFixa = createContext<readonly [number, number, number] | null>(null);
export const Camera: React.FC<{ readonly quadros: readonly Quadro[]; readonly children: React.ReactNode }> = ({ quadros: pedidos, children }) => {
  const frame = useCurrentFrame();
  const fixa = useContext(CameraFixa);
  const quadros: readonly Quadro[] = fixa ? [[0, ...fixa], [1, ...fixa]] : pedidos;
  const fs = quadros.map((q) => q[0]);
  const op = { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const z = interpolate(frame, fs, quadros.map((q) => q[1]), op);
  const x = interpolate(frame, fs, quadros.map((q) => q[2]), op);
  const y = interpolate(frame, fs, quadros.map((q) => q[3]), op);
  // escala base: a janela inteira cabe no quadro 1920x1080 com folga
  const base = 0.98 * Math.min(1920 / LARGURA, 1080 / ALTURA) * 0.95;
  const k = base * z;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: LARGURA, height: ALTURA, transformOrigin: "0 0", transform: `translate(${960 - x * k}px, ${540 - y * k}px) scale(${k})` }}>
      {children}
    </div>
  );
};

// câmera que vai de alvo em alvo: chega 10 frames antes da palavra e fica até a hora do próximo
export const rota = (inicio: readonly [number, number, number], alvos: readonly (readonly [number, number, number, number])[], dur: number): Quadro[] => {
  const q: Quadro[] = [[0, ...inicio]];
  alvos.forEach(([f, z, x, y], i) => {
    const prox = alvos[i + 1]?.[0];
    const chega = Math.max(q[q.length - 1][0] + 1, f - 10);
    q.push([chega, z, x, y], [Math.max(chega + 1, prox === undefined ? dur : prox - 24), z, x, y]);
  });
  return q;
};

// cursor que vai de alvo em alvo: chega 2 frames antes do clique e fica parado até sair para o próximo
export const caminho = (inicio: readonly [number, number], alvos: readonly (readonly [number, number, number])[]) => {
  const p: [number, number, number][] = [[0, ...inicio]];
  alvos.forEach(([f, x, y]) => {
    const ultimo = p[p.length - 1];
    const sai = Math.max(ultimo[0] + 1, f - 16);
    p.push([sai, ultimo[1], ultimo[2]], [Math.max(sai + 1, f - 2), x, y]);
  });
  return p;
};

// ---------- Cursor: pontos [frame, x, y] em coordenadas da janela; cliques nos frames de `cliques`
export const Cursor: React.FC<{ readonly pontos: readonly (readonly [number, number, number])[]; readonly cliques?: readonly number[] }> = ({ pontos, cliques = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fs = pontos.map((p) => p[0]);
  const op = { easing: Easing.inOut(Easing.quad), extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const x = interpolate(frame, fs, pontos.map((p) => p[1]), op);
  const y = interpolate(frame, fs, pontos.map((p) => p[2]), op);
  const ultimo = [...cliques].reverse().find((c) => frame >= c);
  const t = ultimo === undefined ? 99 : frame - ultimo;
  const aperto = t < 6 ? 1 - 0.18 * Math.sin((t / 6) * Math.PI) : 1;
  const onda = spring({ frame: t, fps, config: { damping: 30 }, durationInFrames: 18 });
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 50, pointerEvents: "none" }}>
      {t < 18 && (
        <div
          style={{
            position: "absolute",
            left: -40 * onda,
            top: -40 * onda,
            width: 80 * onda,
            height: 80 * onda,
            borderRadius: "50%",
            border: `3px solid ${VERDE}`,
            opacity: 1 - onda,
          }}
        />
      )}
      <svg width={34} height={40} viewBox="0 0 17 20" style={{ transform: `scale(${aperto})`, transformOrigin: "0 0", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.6))" }}>
        <path d="M1 1 L1 16 L5 12.5 L8 19 L10.5 18 L7.6 11.6 L13 11.6 Z" fill="white" stroke="#111" strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// texto que vai sendo digitado a partir do frame `de`
export const Digitando: React.FC<{ readonly texto: string; readonly de: number; readonly porFrame?: number; readonly placeholder?: string }> = ({
  texto,
  de,
  porFrame = 1.6,
  placeholder = "",
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor((frame - de) * porFrame));
  if (frame < de) return <span style={{ color: "#6B726D" }}>{placeholder}</span>;
  const cursor = n < texto.length || Math.floor(frame / 15) % 2 === 0;
  return (
    <span>
      {texto.slice(0, n)}
      {n < texto.length + 8 && cursor && <span style={{ color: VERDE }}>|</span>}
    </span>
  );
};
