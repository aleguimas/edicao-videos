import type React from "react";
import type { Vozes } from "../ana/voz";
import vozes from "../voz-acompanhamento.json";
import { Montagem, montarRoteiro } from "../verbas/Montagem";
import { Abertura, Alertas, Conceito, Documento, Fim, Gancho, Lendo, Resultado, Trecho } from "./Cenas";
import * as C from "./Capitulos";

// Vídeo (16:9) do módulo Acompanhamento do Agentic Office, apresentado pela Ana, a Assistente de IA
// da Simplí. Telas com dados fictícios; o caso é um só do começo ao fim: a inauguração da Loja Sul.
const TELAS = { abertura: Abertura, gancho: Gancho, conceito: Conceito, documento: Documento, lendo: Lendo, resultado: Resultado, trecho: Trecho, alertas: Alertas, fim: Fim,
  semacesso: C.SemAcesso, abas: C.AbasCena, nova: C.Nova, opcoes: C.Opcoes, rascunho: C.Rascunho,
  revisar: C.Revisar, cadastrar: C.Cadastrar, varios: C.Varios, ativar: C.Ativar, ativa: C.Ativa, manual: C.Manual,
  aviso: C.Aviso, cadencia: C.Cadencia, escala: C.Escala, janela: C.Janela, setor: C.Setor,
  email: C.Email, concluida: C.Concluida, prazo: C.Prazo, analise: C.Analise, dois: C.Dois,
  paraaprovar: C.ParaAprovar, aprovar: C.Aprovar, recusar: C.Recusar, quem: C.Quem,
  numeros: C.NumerosCena, lista: C.Lista, painelacao: C.PainelCena, porpessoa: C.PorPessoa, painelgeral: C.PainelGeralCena,
  encerrar: C.Encerrar, excluir: C.Excluir,
  umavez: C.UmaVez, pessoas: C.Pessoas, aprovacfg: C.AprovaCfg, cadenciacfg: C.CadenciaCfg, ajuste: C.Ajuste,
};
const SEM_PIP: Record<string, readonly [number, number]> = { abertura: [860, 0], fim: [0, 860] };

const PILOTO = montarRoteiro(vozes as unknown as Vozes, ["abertura", "gancho", "conceito", { cap: 2, titulo: "A CLARA LÊ A ATA" }, "documento", "lendo", "resultado", "trecho", "alertas", { cap: 0, titulo: "" }, ["fim", 75]]);
export const DURACAO_PILOTO_ACOMP = PILOTO.duracao;

export const AcompanhamentoPiloto: React.FC = () => <Montagem itens={PILOTO.itens} duracao={PILOTO.duracao} telas={TELAS} pastaVoz="voz/acompanhamento" semPip={SEM_PIP} />;

const COMPLETO = montarRoteiro(vozes as unknown as Vozes, [
  "abertura", "gancho", "conceito", "semacesso", "abas",
  { cap: 1, titulo: "CRIAR UMA DEMANDA" }, "nova", "opcoes", "rascunho",
  { cap: 2, titulo: "A CLARA LÊ A ATA" }, "documento", "lendo", "resultado", "trecho", "alertas",
  { cap: 3, titulo: "REVISAR E ATIVAR" }, "revisar", "cadastrar", "varios", "ativar", "ativa", "manual",
  { cap: 4, titulo: "A COBRANÇA SAI SOZINHA" }, "aviso", "cadencia", "escala", "janela", "setor",
  { cap: 5, titulo: "O RESPONSÁVEL RESPONDE" }, "email", "concluida", "prazo", "analise", "dois",
  { cap: 6, titulo: "APROVAR OU RECUSAR" }, "paraaprovar", "aprovar", "recusar", "quem",
  { cap: 7, titulo: "ACOMPANHAR O ANDAMENTO" }, "numeros", "lista", "painelacao", "porpessoa", "painelgeral",
  { cap: 8, titulo: "ENCERRAR OU EXCLUIR" }, "encerrar", "excluir",
  { cap: 9, titulo: "PREPARAR O MÓDULO" }, "umavez", "pessoas", "aprovacfg", "cadenciacfg", "ajuste",
  { cap: 0, titulo: "" }, ["fim", 75],
]);
export const DURACAO_COMPLETO_ACOMP = COMPLETO.duracao;
export const AcompanhamentoCompleto: React.FC = () => <Montagem itens={COMPLETO.itens} duracao={COMPLETO.duracao} telas={TELAS} pastaVoz="voz/acompanhamento" semPip={SEM_PIP} />;

export const INICIOS_PILOTO = Object.fromEntries(PILOTO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));
export const INICIOS_COMPLETO = Object.fromEntries(COMPLETO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c] as const] : [])));
