import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import type React from "react";
import { Img, staticFile } from "remotion";

// Telas do Simplí CRM recriadas em React a partir das capturas (nada de print: nomes e números
// são fictícios, da Loja Modelo). Tema claro do sistema, no tamanho da janela de captura.
const { fontFamily: poppins } = loadPoppins("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });

export const FONTE_CRM = poppins;
export const LARGURA_CRM = 1596;
export const ALTURA_CRM = 898;
export const LATERAL_CRM = 207;

export const COR_CRM = {
  fundo: "#F6F8F7",
  cartao: "#FFFFFF",
  borda: "#E8ECEF",
  texto: "#101828",
  suave: "#667085",
  apagado: "#98A2B3",
  verde: "#10B981",
  verdeEscuro: "#059669",
  verdeClaro: "#D1FAE5",
  chave: "#22C55E",
  cinza: "#EEF1F4",
};

export const DEGRADE_ATIVO = "linear-gradient(90deg, #10B981 0%, #064E3B 50%, #000000 100%)";

// ícones de traço (24x24), no desenho do Lucide usado pelo sistema
const ICONES: Record<string, string> = {
  dashboard: "M3 3v18h18M8 17v-5M13 17V8M18 17v-8",
  tarefas: "M21 11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11M9 11l3 3L22 4",
  gestaoTarefas: "M3 6l1.5 1.5L7 5M3 17l1.5 1.5L7 16M11 6h10M11 12h10M11 18h10",
  kanban: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  automacao: "M13 2L3 14h9l-1 8 10-12h-9z",
  coracao: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8zM8 12h2l1.5-2 2 4 1.5-2h2",
  campanha: "M22 2L11 13M22 2l-7 20-4-9-9-4z",
  grupos: "M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-6a8.4 8.4 0 1 1 16.1-3.5z",
  email: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7",
  sms: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5",
  segmentacao: "M22 3H2l8 9.5V19l4 2v-8.5z",
  conexoes: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  chat: "M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-6a8.4 8.4 0 1 1 16.1-3.5z",
  contatos: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  robo: "M12 8V4H8M4 8h16a0 0 0 0 1 0 0v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8zM2 14h2M20 14h2M15 13v2M9 13v2",
  orcamentos: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6",
  crm: "M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.500 21l2-7.500L2 9h7z",
  eventos: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  obra: "M2 20h20M4 20V10l8-6 8 6v10M10 20v-6h4v6",
  sentimentos: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 14s1.500 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
  relatorios: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  olho: "M2 12s3.500-7 10-7 10 7 10 7-3.500 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  etiqueta: "M12 2H2v10l9.300 9.300a2.400 2.400 0 0 0 3.400 0l6.600-6.600a2.400 2.400 0 0 0 0-3.400zM7 7h.01",
  ajuda: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9.100 9a3 3 0 0 1 5.800 1c0 2-3 3-3 3M12 17h.01",
  config: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.400 15a1.650 1.650 0 0 0 .3 1.800l.1.100a2 2 0 1 1-2.800 2.800l-.1-.1a1.650 1.650 0 0 0-2.700 1.200V21a2 2 0 0 1-4 0v-.2a1.650 1.650 0 0 0-2.800-1.100l-.1.100a2 2 0 1 1-2.800-2.800l.1-.1a1.650 1.650 0 0 0-1.200-2.700H3a2 2 0 0 1 0-4h.2a1.650 1.650 0 0 0 1.100-2.800l-.1-.1a2 2 0 1 1 2.800-2.800l.1.100a1.650 1.650 0 0 0 2.700-1.200V3a2 2 0 0 1 4 0v.2a1.650 1.650 0 0 0 2.800 1.100l.1-.1a2 2 0 1 1 2.800 2.800l-.1.100a1.650 1.650 0 0 0 1.200 2.700H21a2 2 0 0 1 0 4h-.2a1.650 1.650 0 0 0-1.400 1z",
  sair: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  seta: "M6 9l6 6 6-6",
  voltar: "M15 18l-6-6 6-6",
  atualizar: "M21 12a9 9 0 0 0-15-6.700L3 8M3 3v5h5M3 12a9 9 0 0 0 15 6.700L21 16M21 21v-5h-5",
  relogio: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
  instagram: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM17.500 6.500h.01",
  copiar: "M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2zM4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2",
  busca: "M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM21 21l-4.300-4.300",
  mais: "M12 5v14M5 12h14",
  filtro: "M22 3H2l8 9.500V19l4 2v-8.500z",
  pessoaMais: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM19 8v6M22 11h-6",
  pessoa: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  linhas: "M4 6h16M4 12h16M4 18h16",
  ordenar: "M21 16l-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16",
  atividade: "M22 12h-4l-3 9L9 3l-3 9H2",
  microfone: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
  estrela: "M12 2l3.100 6.300 6.900 1-5 4.900 1.200 6.900L12 17.800l-6.200 3.300L7 14.200l-5-4.900 6.900-1z",
  resolver: "M21 11v1a9 9 0 1 1-5.300-8.200M9 11l3 3L22 4",
  anexo: "M21.400 11l-9.200 9.200a6 6 0 0 1-8.500-8.500l9.200-9.200a4 4 0 0 1 5.700 5.700l-9.200 9.200a2 2 0 0 1-2.900-2.900l8.500-8.500",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  brilho: "M12 3l1.900 5.800L20 11l-6.100 2.200L12 19l-1.900-5.800L4 11l6.100-2.200zM19 3v4M21 5h-4",
  rosto: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8 14s1.500 2 4 2 4-2 4-2M9 9h.01M15 9h.01",
  cadeado: "M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 9.900-1",
  enviar: "M22 2L11 13M22 2l-7 20-4-9-9-4z",
  retorno: "M9 14L4 9l5-5M4 9h11a5 5 0 0 1 5 5v6",
  temporizador: "M10 2h4M12 14l3-3M12 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16z",
  arquivo: "M3 3h18v5H3zM4 8v13h16V8M10 12h4",
  documento: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6",
  ligar: "M12 2v10M18.400 6.600a9 9 0 1 1-12.800 0",
  hash: "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
  arroba: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",
  linkFora: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",
  subir: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  lapis: "M12 20h9M16.500 3.500a2.100 2.100 0 0 1 3 3L7 19l-4 1 1-4z",
  lixeira: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6",
  telefone: "M22 16.900v3a2 2 0 0 1-2.200 2 19.800 19.800 0 0 1-8.600-3.100 19.500 19.500 0 0 1-6-6A19.800 19.800 0 0 1 2.100 4.200 2 2 0 0 1 4.100 2h3a2 2 0 0 1 2 1.700c.1 1 .4 1.900.7 2.800a2 2 0 0 1-.5 2.100L8.100 9.900a16 16 0 0 0 6 6l1.300-1.300a2 2 0 0 1 2.100-.4c.9.300 1.800.6 2.800.7a2 2 0 0 1 1.700 2z",
  info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 16v-4M12 8h.01",
  check: "M20 6L9 17l-5-5",
  xis: "M18 6L6 18M6 6l12 12",
  girar: "M21 2v6h-6M3 22v-6h6M21 8a9 9 0 0 0-15-3L3 8M3 16a9 9 0 0 0 15 3l3-3",
  globo: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  dolar: "M12 2v20M17 6H9.500a3.500 3.500 0 0 0 0 7h5a3.500 3.500 0 0 1 0 7H6",
  sobe: "M22 7l-8.500 8.500-5-5L2 17M16 7h6v6",
  desce: "M22 17l-8.500-8.500-5 5L2 7M16 17h6v-6",
  loja: "M3 9l1.500-5h15L21 9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 12v8h14v-8",
  ampulheta: "M6 2h12M6 22h12M7 2v4l5 6 5-6V2M7 22v-4l5-6 5 6v4",
  partilha: "M18 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM8.600 13.500l6.800 4M15.400 6.500l-6.800 4",
  grade: "M3 3h18v18H3zM3 12h18M12 3v18",
  colunas: "M3 3h18v18H3zM9 3v18M15 3v18",
  sino: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.700 21a2 2 0 0 1-3.400 0",
  calendario: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM12 14v3l2 1",
  pacote: "M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8",
  chave: "M15 7a4 4 0 1 1-3.900 4.900L3 20v-3l2-1v-2h2l1.700-1.700A4 4 0 0 1 15 7zM16 10h.01",
  escudo: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  ramo: "M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9",
  bandeira: "M4 22V4s1-1 4-1 5 2 8 2 4-1 4-1v11s-1 1-4 1-5-2-8-2-4 1-4 1",
  imagem: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.500 7a1.500 1.500 0 1 0 0 3 1.500 1.500 0 0 0 0-3zM21 15l-5-5L5 21",
  titulo: "M4 7V4h16v3M9 20h6M12 4v16",
  texto: "M17 10H3M21 6H3M21 14H3M17 18H3",
  cursor: "M3 3l7 18 2.500-7.500L20 11zM13 13l6 6",
  lista: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  divisor: "M5 12h14",
  espaco: "M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4",
  video: "M23 7l-7 5 7 5zM3 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  modelo: "M3 3h18v7H3zM3 14h8v7H3zM15 14h6v7h-6z",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  celular: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01",
  enviarEntrada: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
  meta: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  predio: "M4 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M16 10h2a2 2 0 0 1 2 2v10M2 22h20M8 7h4M8 11h4M8 15h4",
  fala: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h.01M12 9h.01M16 9h.01",
};

export const Icone: React.FC<{ nome: string; tam?: number; cor?: string; traco?: number }> = ({ nome, tam = 20, cor = "currentColor", traco = 1.8 }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={traco} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={ICONES[nome] ?? ""} />
  </svg>
);

// ordem real do menu de um home center, sem Diagnóstico e BOT piloto
type ItemMenu = { id: string; nome: string; icone?: string; nivel?: 1 | 2; seta?: boolean };

const MENU: ItemMenu[] = [
  { id: "dashboard", nome: "Dashboard", icone: "dashboard" },
  { id: "tarefas", nome: "Tarefas", icone: "tarefas" },
  { id: "gestao-tarefas", nome: "Gestão de tarefas", icone: "gestaoTarefas" },
  { id: "kanban", nome: "Kanban", icone: "kanban" },
  { id: "automacao", nome: "Automação", icone: "automacao" },
  { id: "relacionamento", nome: "Relacionamento", icone: "coracao", seta: true },
  { id: "conexoes", nome: "Conexões", icone: "conexoes", seta: true },
  { id: "contatos", nome: "Contatos", icone: "contatos" },
  { id: "chat", nome: "Simplí Chat", icone: "chat" },
  { id: "prospeccao", nome: "Prospecção", icone: "globo" },
  { id: "agente-ia", nome: "Agente de IA", icone: "robo" },
  { id: "orcamentos", nome: "Orçamentos", icone: "orcamentos" },
  { id: "crm", nome: "CRM", icone: "crm" },
  { id: "eventos", nome: "Eventos", icone: "eventos" },
  { id: "ciclo-obra", nome: "Ciclo da Obra", icone: "obra" },
  { id: "sentimentos", nome: "Sentimentos", icone: "sentimentos" },
  { id: "relatorios", nome: "Relatórios", icone: "relatorios" },
];

// menu da empresa de serviços, como na conta da Simplí
const MENU_SERVICOS: ItemMenu[] = [
  { id: "gestao", nome: "Gestão", icone: "dashboard" },
  { id: "aprovacoes", nome: "Aprovações", icone: "escudo" },
  { id: "kanban", nome: "Kanban", icone: "kanban" },
  { id: "automacao", nome: "Automação", icone: "automacao" },
  { id: "relacionamento", nome: "Relacionamento", icone: "coracao", seta: true },
  { id: "conexoes", nome: "Conexões", icone: "conexoes", seta: true },
  { id: "contatos", nome: "Contatos", icone: "contatos" },
  { id: "chat", nome: "Simplí Chat", icone: "chat" },
  { id: "prospeccao", nome: "Prospecção", icone: "globo" },
  { id: "agente-ia", nome: "Agente de IA", icone: "robo" },
  { id: "projetos", nome: "Projetos", icone: "colunas" },
  { id: "contratos", nome: "Contratos", icone: "orcamentos" },
  { id: "metas", nome: "Metas", icone: "sobe" },
  { id: "financeiro", nome: "Financeiro", icone: "dolar" },
];

const RELACIONAMENTO: ItemMenu[] = [
  { id: "campanha", nome: "Campanha", icone: "campanha", nivel: 1, seta: true },
  { id: "templates", nome: "Templates", nivel: 2 },
  { id: "disparos", nome: "Disparos", nivel: 2 },
  { id: "historico", nome: "Histórico", nivel: 2 },
  { id: "grupos", nome: "Grupos WhatsApp", icone: "grupos", nivel: 1 },
  { id: "email", nome: "E-mail Marketing", icone: "email", nivel: 1 },
  { id: "sms", nome: "SMS", icone: "sms", nivel: 1 },
  { id: "segmentacao", nome: "Segmentação de Base", icone: "segmentacao", nivel: 1 },
  { id: "instagram", nome: "Instagram", icone: "instagram", nivel: 1, seta: true },
  { id: "ig-painel", nome: "Painel", nivel: 2 },
  { id: "ig-automacoes", nome: "Automações", nivel: 2 },
  { id: "ig-sequencias", nome: "Sequências", nivel: 2 },
];

const CONEXOES: ItemMenu[] = [
  { id: "whatsapp-api", nome: "WhatsApp API", nivel: 2 },
  { id: "instagram-api", nome: "Instagram API", nivel: 2 },
];

const RODAPE = [
  { nome: "Ocultar valores", icone: "olho" },
  { nome: "Frases Rápidas", icone: "automacao" },
  { nome: "Tags", icone: "etiqueta" },
  { nome: "FAQ", icone: "ajuda" },
  { nome: "Configurações", icone: "config" },
  { nome: "Sair", icone: "sair" },
];

const LinhaMenu: React.FC<{ item: ItemMenu; ativo: boolean; abertoSeta?: boolean }> = ({ item, ativo, abertoSeta }) => {
  const recuo = item.nivel === 2 ? 58 : item.nivel === 1 ? 38 : 10;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 11,
        height: 36,
        margin: "2px 8px",
        paddingLeft: recuo,
        paddingRight: 12,
        borderRadius: 7,
        fontSize: 15,
        whiteSpace: "nowrap",
        color: ativo ? "#FFFFFF" : "#344054",
        background: ativo ? DEGRADE_ATIVO : "transparent",
      }}
    >
      {item.icone ? <Icone nome={item.icone} tam={item.nivel === 1 ? 17 : 19} /> : null}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{item.nome}</span>
      {item.seta ? (
        <span style={{ display: "flex", transform: abertoSeta ? "none" : "rotate(-90deg)" }}>
          <Icone nome="seta" tam={13} cor="#667085" />
        </span>
      ) : null}
    </div>
  );
};

export type Perfil = "varejo" | "servicos";
const LINHA = 40;
const VISIVEIS = 14;

export const MenuCrm: React.FC<{ ativo: string; relacionamento?: boolean; conexoes?: boolean; perfil?: Perfil; rolagem?: number }> = ({ ativo, relacionamento = false, conexoes = false, perfil = "varejo", rolagem }) => {
  const base = perfil === "servicos" ? MENU_SERVICOS : MENU;
  const itens = base.flatMap((m) => {
    if (m.id === "relacionamento" && relacionamento) return [m, ...RELACIONAMENTO];
    if (m.id === "conexoes" && conexoes) return [m, ...CONEXOES];
    return [m];
  });
  // o menu rola sozinho para o item ativo ficar à vista, como no sistema
  const indice = itens.findIndex((m) => m.id === ativo);
  const desce = rolagem ?? (indice >= VISIVEIS ? (indice - VISIVEIS + 3) * LINHA : 0);
  return (
    <div style={{ width: LATERAL_CRM, height: "100%", background: "#FFFFFF", display: "flex", flexDirection: "column", flexShrink: 0, borderRight: `1px solid ${COR_CRM.borda}` }}>
      <div style={{ height: 64, display: "flex", alignItems: "center", paddingLeft: 13, borderBottom: `1px solid ${COR_CRM.borda}`, flexShrink: 0 }}>
        <Img src={staticFile("midia/logo-simpli-crm-claro.png")} style={{ height: 31 }} />
      </div>
      <div style={{ flex: 1, overflow: "hidden", paddingTop: 12 }}>
        <div style={{ transform: `translateY(${-desce}px)` }}>
          {itens.map((m) => (
            <LinhaMenu key={m.id} item={m} ativo={m.id === ativo} abertoSeta={m.id === "relacionamento" ? relacionamento : m.id === "conexoes" ? conexoes : m.id === "campanha" || m.id === "instagram"} />
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${COR_CRM.borda}`, padding: "7px 0", flexShrink: 0 }}>
        {RODAPE.map((r) => (
          <div key={r.nome} style={{ display: "flex", alignItems: "center", gap: 11, height: 38, paddingLeft: 18, fontSize: 15.5, color: r.nome.toLowerCase() === ativo ? "#101828" : "#667085", fontWeight: r.nome.toLowerCase() === ativo ? 600 : 400 }}>
            <Icone nome={r.icone} tam={19} />
            {r.nome}
          </div>
        ))}
      </div>
    </div>
  );
};

// janela do sistema: menu à esquerda e o módulo à direita
export const TelaCrm: React.FC<{ ativo: string; relacionamento?: boolean; conexoes?: boolean; perfil?: Perfil; rolagemMenu?: number; children: React.ReactNode; semMargem?: boolean; sobre?: React.ReactNode }> = ({
  ativo,
  relacionamento,
  conexoes,
  perfil,
  rolagemMenu,
  children,
  semMargem,
  sobre,
}) => (
  <div style={{ position: "relative", width: LARGURA_CRM, height: ALTURA_CRM, background: COR_CRM.fundo, display: "flex", fontFamily: FONTE_CRM, color: COR_CRM.texto, overflow: "hidden" }}>
    <MenuCrm ativo={ativo} relacionamento={relacionamento} conexoes={conexoes} perfil={perfil} rolagem={rolagemMenu} />
    <div style={{ flex: 1, minWidth: 0, height: "100%", padding: semMargem ? 0 : "40px 50px", overflow: "hidden" }}>{children}</div>
    {sobre}
  </div>
);

export const CartaoCrm: React.FC<{ estilo?: React.CSSProperties; children: React.ReactNode }> = ({ estilo, children }) => (
  <div style={{ background: COR_CRM.cartao, borderRadius: 12, border: `1px solid ${COR_CRM.borda}`, boxShadow: "0 1px 3px rgba(16,24,40,0.08)", ...estilo }}>{children}</div>
);

export const SeloCrm: React.FC<{ fundo: string; cor: string; children: React.ReactNode }> = ({ fundo, cor, children }) => (
  <span style={{ display: "inline-block", background: fundo, color: cor, fontSize: 12, fontWeight: 600, padding: "2px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>{children}</span>
);

export const ChaveCrm: React.FC<{ ligada: number }> = ({ ligada }) => (
  <div style={{ width: 44, height: 24, borderRadius: 12, background: ligada > 0.5 ? COR_CRM.chave : "#D0D5DD", position: "relative", flexShrink: 0 }}>
    <div style={{ position: "absolute", top: 2, left: 2 + 20 * ligada, width: 20, height: 20, borderRadius: 10, background: "#FFFFFF", boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }} />
  </div>
);

// ---------- peças que se repetem nos módulos
export const Cabecalho: React.FC<{ sobre?: string; titulo: string; descricao?: string; direita?: React.ReactNode }> = ({ sobre, titulo, descricao, direita }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      {sobre ? <div style={{ fontSize: 13.5, color: COR_CRM.suave }}>{sobre}</div> : null}
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.25, letterSpacing: -0.3 }}>{titulo}</div>
      {descricao ? <div style={{ fontSize: 15, color: COR_CRM.suave, lineHeight: 1.35, marginTop: 2 }}>{descricao}</div> : null}
    </div>
    {direita ? <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>{direita}</div> : null}
  </div>
);

export const BotaoCrm: React.FC<{ icone?: string; primario?: boolean; perigo?: boolean; children?: React.ReactNode; estilo?: React.CSSProperties }> = ({ icone, primario, perigo, children, estilo }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: 38,
      padding: "0 15px",
      borderRadius: 7,
      fontSize: 15,
      whiteSpace: "nowrap",
      color: primario ? "#FFFFFF" : perigo ? "#DC2626" : "#101828",
      background: primario ? DEGRADE_ATIVO : "#FFFFFF",
      border: primario ? "none" : `1px solid ${COR_CRM.borda}`,
      ...estilo,
    }}
  >
    {icone ? <Icone nome={icone} tam={15} /> : null}
    {children}
  </div>
);

export const SeletorCrm: React.FC<{ texto: string; estilo?: React.CSSProperties }> = ({ texto, estilo }) => (
  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 10, height: 38, padding: "0 12px", borderRadius: 7, border: `1px solid ${COR_CRM.borda}`, background: "#FFFFFF", fontSize: 15, whiteSpace: "nowrap", boxSizing: "border-box", ...estilo }}>
    {texto}
    <Icone nome="seta" tam={13} />
  </div>
);

// abas em barra branca, com a ativa em degradê (Grupos, Prospecção, E-mail Marketing)
export const AbasCrm: React.FC<{ abas: readonly (readonly [string, string?])[]; ativa: string; estilo?: React.CSSProperties }> = ({ abas, ativa, estilo }) => (
  <div style={{ display: "flex", background: "#FFFFFF", borderRadius: 11, padding: 5, boxShadow: "0 1px 3px rgba(16,24,40,0.08)", marginBottom: 20, ...estilo }}>
    {abas.map(([nome, icone]) => (
      <div key={nome} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 40, borderRadius: 7, fontSize: 15, color: nome === ativa ? "#FFFFFF" : "#475467", background: nome === ativa ? DEGRADE_ATIVO : "transparent" }}>
        {icone ? <Icone nome={icone} tam={16} /> : null}
        {nome}
      </div>
    ))}
  </div>
);

// abas sublinhadas em verde (Histórico de campanhas, detalhe do evento)
export const AbasLinha: React.FC<{ abas: readonly string[]; ativa: string; estilo?: React.CSSProperties }> = ({ abas, ativa, estilo }) => (
  <div style={{ display: "flex", gap: 6, borderBottom: `1px solid ${COR_CRM.borda}`, marginBottom: 18, ...estilo }}>
    {abas.map((a) => (
      <div key={a} style={{ padding: "9px 15px", fontSize: 15, color: a === ativa ? "#16A34A" : "#475467", borderBottom: a === ativa ? "2px solid #16A34A" : "2px solid transparent", marginBottom: -1 }}>
        {a}
      </div>
    ))}
  </div>
);

// janela sobre a tela, com o fundo escurecido
export const ModalCrm: React.FC<{ largura: number; topo?: number; titulo?: string; sub?: string; children: React.ReactNode; alinhado?: "centro" | "direita" }> = ({ largura, topo = 40, titulo, sub, children }) => (
  <div style={{ position: "absolute", inset: 0, background: "rgba(90,96,108,0.55)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: topo, zIndex: 20 }}>
    <div style={{ width: largura, maxHeight: ALTURA_CRM - topo - 30, overflow: "hidden", background: "#FFFFFF", borderRadius: 14, boxShadow: "0 24px 60px rgba(16,24,40,0.3)" }}>
      {titulo ? (
        <div style={{ display: "flex", alignItems: "flex-start", padding: "20px 24px 14px", borderBottom: `1px solid ${COR_CRM.borda}` }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.2 }}>{titulo}</div>
            {sub ? <div style={{ fontSize: 14, color: COR_CRM.suave, marginTop: 2 }}>{sub}</div> : null}
          </div>
          <Icone nome="xis" tam={17} cor={COR_CRM.suave} />
        </div>
      ) : null}
      {children}
    </div>
  </div>
);

export const CampoCrm: React.FC<{ rotulo?: string; valor?: string; apagado?: boolean; estilo?: React.CSSProperties }> = ({ rotulo, valor, apagado, estilo }) => (
  <div style={{ marginBottom: 12, ...estilo }}>
    {rotulo ? <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 5 }}>{rotulo}</div> : null}
    <div style={{ height: 40, display: "flex", alignItems: "center", padding: "0 12px", border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, fontSize: 14.5, color: apagado ? COR_CRM.apagado : COR_CRM.texto, background: "#FFFFFF" }}>{valor}</div>
  </div>
);

export const Avatar: React.FC<{ nome: string; tam?: number }> = ({ nome, tam = 28 }) => {
  const iniciais = nome.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return <div style={{ width: tam, height: tam, borderRadius: tam / 2, background: "#EAECEF", color: "#344054", fontSize: tam * 0.36, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{iniciais}</div>;
};
