import type React from "react";
import type { Vozes } from "../ana/voz";
import { type Entrada, Montagem, montarRoteiro } from "../verbas/Montagem";
import vozes from "../voz-crm.json";
import { Abertura1, Abertura2, Abertura3, Cap21, Cap21b, Cap22, Cap23, Cap24, Cap25, Cap27, Cap72, Cap74, Quem1 } from "./Cenas";
import * as C from "./Cenas2";

// Vídeo de apresentação do Simplí CRM (16:9, YouTube), apresentado pela Ana. Falas em
// scripts/falas-crm.json; telas recriadas com dados fictícios da Loja Modelo.
const TELAS = {
  "abertura-1": Abertura1,
  "abertura-2": Abertura2,
  "abertura-3": Abertura3,
  "quem-1": Quem1,
  "quem-2": C.Quem2,
  "quem-3": C.Quem3,
  "quem-4": C.Quem4,
  "cap1-1": C.Cap11,
  "cap1-2": C.Cap12,
  "cap1-3": C.Cap13,
  "cap1-4": C.Cap14,
  "cap1-5": C.Cap15,
  "cap1-6": C.comJornada(C.Cap16, 1),
  "cap2-1": Cap21,
  "cap2-1b": Cap21b,
  "cap2-2": Cap22,
  "cap2-3": Cap23,
  "cap2-4": Cap24,
  "cap2-5": Cap25,
  "cap2-7": C.comJornada(Cap27, 2, [860, 0]),
  "cap3-1": C.Cap31,
  "cap3-2": C.Cap32,
  "cap3-3": C.Cap33,
  "cap3-4": C.comJornada(C.Cap34, 3),
  "cap4-1": C.Cap41,
  "cap4-2": C.Cap42,
  "cap4-3": C.Cap43,
  "cap4-4": C.Cap44,
  "cap4-5": C.Cap45,
  "cap4-6": C.comJornada(C.Cap46, 4, [0, 860]),
  "cap5-1": C.Cap51,
  "cap5-2": C.Cap52,
  "cap5-3": C.Cap53,
  "cap5-4": C.comJornada(C.Cap54, 5),
  "cap6-1": C.Cap61,
  "cap6-2": C.Cap62,
  "cap6-3": C.Cap63,
  "cap6-4": C.Cap64,
  "cap6-5": C.Cap65,
  "cap6-6": C.Cap66,
  "cap6-7": C.Cap67,
  "cap6-8": C.comJornada(C.Cap68, 6),
  "cap7-1": C.Cap71,
  "cap7-2": Cap72,
  "cap7-3": C.Cap73,
  "cap7-4": Cap74,
  "cap7-5": C.Cap75,
  "cap7-6": C.Cap76,
  "cap7-7": C.comJornada(C.Cap77, 7, [780, 0]),
  "cap8-1": C.Cap81,
  "cap8-2": C.Cap82,
  "cap8-3": C.Cap83,
  "cap8-4": C.Cap84,
  "cap8-5": C.Cap85,
  "cap8-6": C.Cap86,
  "cap9-1": C.Cap91,
  "cap9-2": C.Cap92,
  "cap9-3": C.Cap93,
  "cap10-1": C.Cap101,
  "cap10-2": C.Cap102,
  "fim-1": C.Fim1,
  "fim-2": C.Fim2,
  "fim-3": C.Fim3,
  "fim-4": C.Fim4,
  "fim-5": C.Fim5,
};
// a Ana só aparece no canto depois de se apresentar; nas cenas com a foto, a legenda fica ao lado dela
const SEM_PIP: Record<string, readonly [number, number]> = {
  "abertura-1": [0, 0],
  "abertura-2": [0, 0],
  "abertura-3": [0, 0],
  "quem-1": [860, 0],
  "cap2-7": [860, 0],
  "cap2-1b": [0, 0],
  "fim-4": [860, 0],
  "fim-5": [0, 0],
};

// vídeo completo; capítulo 0 encerra a etiqueta do capítulo no fechamento
const CAPITULOS: Entrada[] = [
  "abertura-1", "abertura-2", "abertura-3", "quem-1", "quem-2", "quem-3", "quem-4",
  { cap: 1, titulo: "O LEAD CHEGA POR QUALQUER CANAL" },
  "cap1-1", "cap1-2", "cap1-3", "cap1-4", "cap1-5", "cap1-6",
  { cap: 2, titulo: "O AGENTE DE IA ATENDE ÀS 23H" },
  "cap2-1", "cap2-1b", "cap2-2", "cap2-3", "cap2-4", "cap2-5", "cap2-7",
  { cap: 3, titulo: "O TIME ASSUME NO SIMPLÍ CHAT" },
  "cap3-1", "cap3-2", "cap3-3", "cap3-4",
  { cap: 4, titulo: "KANBAN, ORÇAMENTO E FOLLOW-UP" },
  "cap4-1", "cap4-2", "cap4-3", "cap4-4", "cap4-5", "cap4-6",
  { cap: 5, titulo: "DEPOIS DA VENDA: CRM LIGADO AO ERP" },
  "cap5-1", "cap5-2", "cap5-3", "cap5-4",
  { cap: 6, titulo: "RELACIONAMENTO EM TODOS OS CANAIS" },
  "cap6-1", "cap6-2", "cap6-3", "cap6-4", "cap6-5", "cap6-6", "cap6-7", "cap6-8",
  { cap: 7, titulo: "APP DO VENDEDOR DE LOJA" },
  "cap7-1", "cap7-2", "cap7-3", "cap7-4", "cap7-5", "cap7-6", "cap7-7",
  { cap: 8, titulo: "A VISÃO DO GESTOR" },
  "cap8-1", "cap8-2", "cap8-3", "cap8-4", "cap8-5", "cap8-6",
  { cap: 9, titulo: "AGENTES DE IA COM APROVAÇÃO HUMANA" },
  "cap9-1", "cap9-2", "cap9-3",
  { cap: 10, titulo: "PARA EMPRESAS DE SERVIÇO" },
  "cap10-1", "cap10-2",
  { cap: 0, titulo: "" },
  "fim-1", "fim-2", "fim-3", "fim-4", ["fim-5", 60],
];
const COMPLETO = montarRoteiro(vozes as unknown as Vozes, CAPITULOS);
export const DURACAO_CRM = COMPLETO.duracao;
export const ApresentacaoCrm: React.FC = () => <Montagem itens={COMPLETO.itens} duracao={COMPLETO.duracao} telas={TELAS} pastaVoz="voz/crm" semPip={SEM_PIP} />;
export const INICIOS_CRM = Object.fromEntries(COMPLETO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, { de: i.c.de, dur: i.c.dur }]] : [])));
export const CAPITULOS_CRM = COMPLETO.itens.flatMap((i) => (i.tipo === "cartela" ? [{ cap: i.cap.cap, titulo: i.cap.titulo, de: i.de }] : []));
