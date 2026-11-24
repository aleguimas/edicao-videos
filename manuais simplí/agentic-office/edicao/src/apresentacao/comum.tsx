import type React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, COR, Icone, type ItemMenu, Janela, type Quadro } from "../agentic/App";
import { fontFamily, fonteMono, VERDE } from "../fonte";

// Peças comuns do vídeo de apresentação do Agentic Office: menus do sistema, avatares dos agentes,
// cabeçalho das telas e botões. Empresa fictícia "Loja Modelo" (os prints vieram de cliente real).

// área do módulo dentro da janela (o menu lateral ocupa os primeiros 300 px)
export const AREA = { x: 300, y: 44, largura: 1340, altura: 916 };

// o menu real rola: cada cena mostra o trecho em que está o módulo da vez
export const MENU_INICIO: ItemMenu[] = [
  ["painel", "Dashboard"],
  ["olho", "Olho de Deus"],
  ["tarefas", "Gestão de tarefas"],
  ["decisoes", "Decisões", "3"],
  ["projetos", "Projetos"],
  ["", "TRABALHO"],
  ["cronograma", "Cronograma"],
  ["rotinas", "Rotinas"],
  ["apps", "Mini APPS"],
  ["acompanhamento", "Acompanhamento"],
  ["calls", "Calls"],
  ["estoque", "Inteligência de Estoque"],
];
export const MENU_AGENTES: ItemMenu[] = [
  ["conciliacao", "Conciliação"],
  ["verbas", "Verbas e Acordos"],
  ["comercial", "Inteligência Comercial"],
  ["gestao", "Gestão Avançada"],
  ["resultados", "Resultados"],
  ["", "AGENTES"],
  ["agentes", "AI Agents"],
  ["coroa", "Diretoria"],
  ["varinha", "Habilidades"],
  ["", "CONHECIMENTO"],
  ["livro", "Biblioteca"],
  ["base", "Base de conhecimento"],
];

// ---------- Agentes (time padrão da plataforma)
// fotos em public/midia/avatars/ (as do sistema; executores sem foto própria usam a pasta pessoas/)
export type Agente = { nome: string; papel: string; descricao: string; cor: string; foto: string };
export const EXECUTORES: Agente[] = [
  { nome: "Rafael", papel: "Pesquisa", descricao: "Busca na web e traz fatos, fontes e números.", cor: "#4C8DFF", foto: "pessoas/p92.webp" },
  { nome: "Íris", papel: "Design", descricao: "Transforma um briefing em peça visual.", cor: "#C46BFF", foto: "iris.webp" },
  { nome: "Vicente", papel: "Copy", descricao: "Posts, e-mails e campanhas na voz da marca.", cor: "#FF8A3D", foto: "pessoas/p72.webp" },
  { nome: "César", papel: "Análise", descricao: "Lê documentos e planilhas, cruza números e recomenda.", cor: "#2EC4B6", foto: "pessoas/p84.webp" },
  { nome: "Mei", papel: "Execução", descricao: "Listas, resumos e organização, com rapidez.", cor: "#F5B82E", foto: "pessoas/p52.webp" },
];
// ordem em que a Ana fala os cargos; `palavra` é a palavra da fala que acende cada um
export type Diretor = { nome: string; sigla: string; cargo: string; palavra: string; cor: string; foto: string };
export const DIRETORIA: Diretor[] = [
  { nome: "Helena", sigla: "CEO", cargo: "Executivo", palavra: "executivo", cor: "#3CE01E", foto: "ceo.webp" },
  { nome: "Otávio", sigla: "CFO", cargo: "Financeiro", palavra: "financeiro", cor: "#2EC4B6", foto: "cfo.webp" },
  { nome: "Marcos", sigla: "CMO", cargo: "Marketing", palavra: "marketing", cor: "#FF8A3D", foto: "cmo.webp" },
  { nome: "Renata", sigla: "COO", cargo: "Operações", palavra: "operações", cor: "#4C8DFF", foto: "coo.webp" },
  { nome: "Gustavo", sigla: "CTO", cargo: "Tecnologia", palavra: "tecnologia", cor: "#8FA2FF", foto: "cto.webp" },
  { nome: "Beatriz", sigla: "CHRO", cargo: "Pessoas", palavra: "pessoas", cor: "#FF6BA8", foto: "chro.webp" },
  { nome: "Diego", sigla: "CRO", cargo: "Receita", palavra: "comercial", cor: "#F5B82E", foto: "cro.webp" },
  { nome: "Adriana", sigla: "CLO", cargo: "Jurídico", palavra: "jurídico", cor: "#C46BFF", foto: "clo.webp" },
  { nome: "Larissa", sigla: "CCO", cargo: "Clientes", palavra: "relacionamento", cor: "#5ED3F3", foto: "cco.webp" },
];

// outros agentes do time padrão que aparecem nos módulos
export const OUTROS = {
  clara: { nome: "Clara", cor: "#5ED3F3", foto: "pessoas/p54.webp" },
  cora: { nome: "Cora", cor: "#FF6BA8", foto: "pessoas/p28.webp" },
  bruna: { nome: "Bruna", cor: "#F5B82E", foto: "pessoas/p39.webp" },
};

// avatar de agente: foto redonda com anel na cor do agente (sem foto, a inicial)
export const Avatar: React.FC<{ readonly nome: string; readonly cor: string; readonly foto?: string; readonly tam?: number; readonly brilho?: number }> = ({
  nome,
  cor,
  foto,
  tam = 64,
  brilho = 0,
}) => (
  <div
    style={{
      width: tam,
      height: tam,
      borderRadius: "50%",
      flexShrink: 0,
      display: "grid",
      placeItems: "center",
      background: `radial-gradient(circle at 35% 30%, ${cor}55, #141815 70%)`,
      border: `${Math.max(2, tam / 22)}px solid ${cor}`,
      boxShadow: `0 0 ${10 + brilho * 40}px ${cor}${brilho > 0 ? "AA" : "55"}`,
      fontFamily,
      fontWeight: 800,
      fontSize: tam * 0.42,
      color: "white",
      overflow: "hidden",
    }}
  >
    {foto ? <Img src={staticFile(`midia/avatars/${foto}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : nome[0]}
  </div>
);

export const Botao: React.FC<{ readonly icone?: string; readonly children: React.ReactNode; readonly cheio?: boolean; readonly verde?: boolean; readonly style?: React.CSSProperties }> = ({
  icone,
  children,
  cheio,
  verde,
  style,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      height: 52,
      padding: "0 22px",
      borderRadius: 8,
      fontSize: 20,
      fontWeight: 600,
      whiteSpace: "nowrap",
      background: verde ? "#9DF57F" : cheio ? "white" : "transparent",
      color: cheio || verde ? "#0B0B0C" : COR.texto,
      border: `1px solid ${verde ? "#9DF57F" : cheio ? "white" : COR.borda}`,
      ...style,
    }}
  >
    {icone && <Icone nome={icone} />}
    {children}
  </div>
);

// título da página do módulo, como no sistema: ícone + nome espaçado + descrição
export const Titulo: React.FC<{ readonly icone?: string; readonly titulo: string; readonly descricao: string; readonly direita?: React.ReactNode }> = ({ icone, titulo, descricao, direita }) => (
  <>
    <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 16 }}>
      {icone && <Icone nome={icone} tam={36} />}
      <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 9 }}>{titulo}</div>
    </div>
    {direita && <div style={{ position: "absolute", right: 40, top: 28, display: "flex", gap: 14 }}>{direita}</div>}
    <div style={{ position: "absolute", left: 40, right: 420, top: 96, fontSize: 19, lineHeight: 1.5, color: COR.suave }}>{descricao}</div>
  </>
);

export const Chip: React.FC<{ readonly children: React.ReactNode; readonly cor?: string; readonly cheio?: boolean; readonly style?: React.CSSProperties }> = ({ children, cor = VERDE, cheio, style }) => (
  <span
    style={{
      display: "inline-block",
      fontFamily: fonteMono,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: 1.5,
      padding: "4px 10px",
      borderRadius: 6,
      color: cheio ? "#0B0B0C" : cor,
      background: cheio ? cor : "transparent",
      border: `1px solid ${cor}`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

// cena padrão com a janela do sistema e a câmera; `fora` fica por cima da janela, em coordenadas
// da janela (cursor, balões)
export const CenaJanela: React.FC<{
  readonly ativo: string;
  readonly menu: readonly ItemMenu[];
  readonly quadros: readonly Quadro[];
  readonly fora?: React.ReactNode;
  readonly children: React.ReactNode;
}> = ({ ativo, menu, quadros, fora, children }) => (
  <AbsoluteFill>
    <Camera quadros={quadros}>
      <Janela ativo={ativo} menu={menu}>
        {children}
      </Janela>
      {fora}
    </Camera>
  </AbsoluteFill>
);

// entrada com mola a partir do frame `de` (0 antes, 1 depois)
export const useMola = (de: number, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - de, fps, config: { damping, stiffness: 130 } });
};

// 0→1 linear entre dois frames
export const rampa = (frame: number, de: number, dur: number) => interpolate(frame, [de, de + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const MENU_ORGANIZACAO: ItemMenu[] = [
  ["coroa", "Diretoria"],
  ["varinha", "Habilidades"],
  ["", "CONHECIMENTO"],
  ["livro", "Biblioteca"],
  ["base", "Base de conhecimento"],
  ["templates", "Templates"],
  ["memoria", "Memória"],
  ["", "ORGANIZAÇÃO"],
  ["resultados", "Relatórios"],
  ["logs", "Logs"],
  ["integracoes", "Integrações"],
  ["config", "Configurações"],
];
export const MENU_MODULOS: ItemMenu[] = [
  ["apps", "Mini APPS"],
  ["acompanhamento", "Acompanhamento"],
  ["calls", "Calls"],
  ["prospeccao", "Prospecção"],
  ["estoque", "Inteligência de Estoque"],
  ["conciliacao", "Conciliação"],
  ["verbas", "Verbas e Acordos"],
  ["comercial", "Inteligência Comercial"],
  ["gestao", "Gestão Avançada"],
  ["resultados", "Resultados"],
  ["", "AGENTES"],
  ["agentes", "AI Agents"],
];

// cartão do sistema (fundo, borda e cantos), em posição absoluta
export const Cartao: React.FC<{ readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly aceso?: boolean; readonly style?: React.CSSProperties; readonly children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  aceso,
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      boxSizing: "border-box",
      padding: "20px 24px",
      borderRadius: 12,
      background: COR.cartao,
      border: `${aceso ? 2 : 1}px solid ${aceso ? VERDE : COR.borda}`,
      boxShadow: aceso ? "0 0 40px rgba(60,224,30,0.28)" : "none",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

// indicador: rótulo, valor (que conta a partir de `conta`) e nota
export const Kpi: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly rotulo: string;
  readonly valor: number;
  readonly formato: (v: number) => string;
  readonly nota?: string;
  readonly conta: number;
  readonly aceso?: boolean;
  readonly cor?: string;
}> = ({ x, y, w, rotulo, valor, formato, nota, conta, aceso, cor = "white" }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame - conta, [0, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <Cartao x={x} y={y} w={w} h={132} aceso={aceso}>
      <div style={{ fontSize: 16, letterSpacing: 1.5, color: COR.suave, textTransform: "uppercase" }}>{rotulo}</div>
      <div style={{ fontSize: 40, fontWeight: 700, color: cor, marginTop: 6, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{formato(valor * k)}</div>
      {nota && <div style={{ fontSize: 15, color: COR.suave, marginTop: 2 }}>{nota}</div>}
    </Cartao>
  );
};
export const reais = (v: number) => "R$ " + Math.round(v).toLocaleString("pt-BR");
export const mil = (v: number) => "R$ " + (v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 0 }) + " mil";

// barras verticais que crescem a partir de `de` (uma depois da outra)
export const Barras: React.FC<{
  readonly valores: readonly number[];
  readonly rotulos: readonly string[];
  readonly w: number;
  readonly h: number;
  readonly de: number;
  readonly cor?: string;
  readonly cor2?: string;
  readonly valores2?: readonly number[];
}> = ({ valores, rotulos, w, h, de, cor = "#2FB344", cor2 = "#B8F5A8", valores2 }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...valores, ...(valores2 ?? []));
  const passo = w / valores.length;
  const largura = valores2 ? passo * 0.3 : passo * 0.42;
  return (
    <div style={{ position: "relative", width: w, height: h + 30 }}>
      {valores.map((v, i) => {
        const k = rampa(frame, de + i * 3, 14);
        const v2 = valores2?.[i];
        const k2 = rampa(frame, de + 6 + i * 3, 14);
        return (
          <div key={i}>
            <div style={{ position: "absolute", left: i * passo + (passo - largura * (v2 ? 2.15 : 1)) / 2, bottom: 30, width: largura, height: (h * v * k) / max, background: cor, borderRadius: "4px 4px 0 0" }} />
            {v2 !== undefined && (
              <div style={{ position: "absolute", left: i * passo + (passo - largura * 2.15) / 2 + largura * 1.15, bottom: 30, width: largura, height: (h * v2 * k2) / max, background: cor2, borderRadius: "4px 4px 0 0" }} />
            )}
            <div style={{ position: "absolute", left: i * passo, width: passo, bottom: 0, textAlign: "center", fontSize: 15, color: COR.suave }}>{rotulos[i]}</div>
          </div>
        );
      })}
    </div>
  );
};

// selo grande por cima da cena: número + nome do recurso / tema (fora da janela, em px da tela)
export const Selo: React.FC<{ readonly de: number; readonly numero?: string; readonly texto: string; readonly x?: number; readonly y?: number }> = ({ de, numero, texto, x = 960, y = 70 }) => {
  const s = useMola(de);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translateX(-50%) scale(${0.8 + 0.2 * s})`, opacity: s, zIndex: 40, display: "flex", alignItems: "center", gap: 14, background: VERDE, color: "#0B0B0C", borderRadius: 10, padding: "10px 22px", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
      {numero && <span style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 26 }}>{numero}</span>}
      <span style={{ fontFamily, fontWeight: 900, fontSize: 30, letterSpacing: 1 }}>{texto}</span>
    </div>
  );
};

// abas do sistema; `ativa` sublinhada, `acesa` com contorno verde
export const Abas: React.FC<{ readonly x: number; readonly y: number; readonly abas: readonly string[]; readonly ativa: string; readonly acesa?: string }> = ({ x, y, abas, ativa, acesa }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 10 }}>
    {abas.map((a) => (
      <div
        key={a}
        style={{
          fontSize: 19,
          padding: "8px 14px",
          borderRadius: 8,
          fontWeight: a === ativa || a === acesa ? 700 : 500,
          color: a === acesa ? VERDE : a === ativa ? "white" : COR.suave,
          borderBottom: a === ativa ? "3px solid white" : "3px solid transparent",
          background: a === acesa ? "rgba(60,224,30,0.12)" : "transparent",
          boxShadow: a === acesa ? `0 0 0 2px ${VERDE}` : "none",
        }}
      >
        {a}
      </div>
    ))}
  </div>
);

// qual item de uma lista de palavras já foi dito por último (índice) — para acender na hora da fala
export const atual = (frame: number, marcas: readonly number[]) => {
  let i = -1;
  marcas.forEach((m, k) => {
    if (frame >= m - 4) i = k;
  });
  return i;
};
