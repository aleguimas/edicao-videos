import type React from "react";
import { ITEM_MENU, type ItemMenu, Janela as JanelaBase } from "../agentic/App";

// Menu lateral do sistema desde nov/2026: o Verbas e Acordos fica dentro de Inteligência Comercial
// (aberto, com Sugestão de vendas e AI Price Watch). A lista é a do sistema, sem os itens que não
// cabem na altura da janela (Dashboard, Mini APPS, Inteligência de Estoque, Gestão Avançada…).
export const MENU_VERBAS: ItemMenu[] = [
  ["olho", "Olho de Deus"],
  ["tarefas", "Gestão de tarefas"],
  ["decisoes", "Decisões", "3"],
  ["projetos", "Projetos", "v"],
  ["", "TRABALHO"],
  ["cronograma", "Cronograma"],
  ["rotinas", "Rotinas"],
  ["acompanhamento", "Acompanhamento"],
  ["calls", "Calls"],
  ["conciliacao", "Conciliação"],
  ["aperto", "Inteligência Comercial", "^"],
  ["sub", "Sugestão de vendas"],
  ["sub", "AI Price Watch"],
  ["sub", "Verbas e Acordos"],
];

export const ITEM_MENU_VERBAS = (nome: string) => ITEM_MENU(nome, MENU_VERBAS);

export const Janela: React.FC<{ readonly ativo: string; readonly aceso?: string; readonly children: React.ReactNode }> = (p) => <JanelaBase menu={MENU_VERBAS} {...p} />;
