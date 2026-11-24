import type React from "react";
import type { Vozes } from "../ana/voz";
import vozes from "../voz-apresentacao.json";
import { Montagem, montarRoteiro } from "../verbas/Montagem";
import { Abertura1, Abertura2, Abertura3 } from "./Abertura";
import { Agentes1, Agentes2, Agentes3, Agentes4, Agentes5, Agentes6 } from "./Agentes";
import { Arquitetura1, Arquitetura2, Arquitetura3, Arquitetura4, Arquitetura5, Arquitetura6, Arquitetura7 } from "./Arquitetura";
import { Erp1, Erp2, Erp3, Erp4, Erp5, Erp6 } from "./Erp";
import { Criar1, Criar2, Criar3, Fechamento1, Fechamento2, Seguranca1, Seguranca2 } from "./Final";
import { Modulos1, Modulos2, Modulos3, Modulos4, Modulos5 } from "./Modulos";
import { Olho1, Olho2, Olho3 } from "./Olho";
import { Trabalho1, Trabalho2, Trabalho3, Trabalho4, Trabalho5 } from "./Trabalho";

// Vídeo de apresentação do Agentic Office (16:9, YouTube), apresentado pela Ana, a Assistente de IA
// da Simplí. Falas em scripts/falas-apresentacao.json; telas recriadas com dados fictícios.
const TELAS = {
  "abertura-1": Abertura1,
  "abertura-2": Abertura2,
  "abertura-3": Abertura3,
  "agentes-1": Agentes1,
  "agentes-2": Agentes2,
  "agentes-3": Agentes3,
  "agentes-4": Agentes4,
  "agentes-5": Agentes5,
  "agentes-6": Agentes6,
  "arquitetura-1": Arquitetura1,
  "arquitetura-2": Arquitetura2,
  "arquitetura-3": Arquitetura3,
  "arquitetura-4": Arquitetura4,
  "arquitetura-5": Arquitetura5,
  "arquitetura-6": Arquitetura6,
  "arquitetura-7": Arquitetura7,
  "olho-1": Olho1,
  "olho-2": Olho2,
  "olho-3": Olho3,
  "trabalho-1": Trabalho1,
  "trabalho-2": Trabalho2,
  "trabalho-3": Trabalho3,
  "trabalho-4": Trabalho4,
  "trabalho-5": Trabalho5,
  "erp-1": Erp1,
  "erp-2": Erp2,
  "erp-3": Erp3,
  "erp-4": Erp4,
  "erp-6": Erp6,
  "modulos-1": Modulos1,
  "modulos-vendas": Erp5,
  "modulos-2": Modulos2,
  "modulos-3": Modulos3,
  "modulos-4": Modulos4,
  "modulos-5": Modulos5,
  "criar-1": Criar1,
  "criar-2": Criar2,
  "criar-3": Criar3,
  "seguranca-1": Seguranca1,
  "seguranca-2": Seguranca2,
  "fechamento-1": Fechamento1,
  "fechamento-2": Fechamento2,
};
// a Ana aparece grande na abertura e no fim: legenda à direita da foto na abertura, à esquerda no fim
const SEM_PIP: Record<string, readonly [number, number]> = { "abertura-1": [860, 0], "fechamento-2": [0, 860] };

const ROTEIRO = montarRoteiro(vozes as unknown as Vozes, [
  "abertura-1",
  "abertura-2",
  "abertura-3",
  { cap: 1, titulo: "UM TIME DE AGENTES" },
  "agentes-1",
  "agentes-2",
  "agentes-3",
  "agentes-4",
  "agentes-5",
  "agentes-6",
  { cap: 2, titulo: "COMO FUNCIONA POR DENTRO" },
  "arquitetura-1",
  "arquitetura-2",
  "arquitetura-3",
  "arquitetura-4",
  "arquitetura-5",
  "arquitetura-6",
  "arquitetura-7",
  { cap: 3, titulo: "OLHO DE DEUS" },
  "olho-1",
  "olho-2",
  "olho-3",
  { cap: 4, titulo: "O TRABALHO ORGANIZADO" },
  "trabalho-1",
  "trabalho-2",
  "trabalho-3",
  "trabalho-4",
  "trabalho-5",
  { cap: 5, titulo: "CONECTADO AOS SEUS DADOS" },
  "erp-1",
  "erp-2",
  "erp-3",
  "erp-4",
  "erp-6",
  { cap: 6, titulo: "MÓDULOS DE NEGÓCIO" },
  "modulos-1",
  "modulos-vendas",
  "modulos-2",
  "modulos-3",
  "modulos-4",
  "modulos-5",
  { cap: 7, titulo: "O QUE VOCÊ CRIA" },
  "criar-1",
  "criar-2",
  "criar-3",
  { cap: 8, titulo: "SEGURANÇA" },
  "seguranca-1",
  "seguranca-2",
  { cap: 0, titulo: "" },
  "fechamento-1",
  ["fechamento-2", 75],
]);
export const DURACAO_APRESENTACAO = ROTEIRO.duracao;
export const Apresentacao: React.FC = () => <Montagem itens={ROTEIRO.itens} duracao={ROTEIRO.duracao} telas={TELAS} pastaVoz="voz/apresentacao" semPip={SEM_PIP} />;
// início de cada fala (para conferir quadros no render de teste)
export const INICIOS = Object.fromEntries(ROTEIRO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));

// piloto para aprovar o visual: abertura + capítulo dos agentes
const PILOTO = montarRoteiro(vozes as unknown as Vozes, [
  "abertura-1",
  "abertura-2",
  "abertura-3",
  { cap: 1, titulo: "UM TIME DE AGENTES" },
  "agentes-1",
  "agentes-2",
  "agentes-3",
  "agentes-4",
  "agentes-5",
  "agentes-6",
]);
export const DURACAO_PILOTO = PILOTO.duracao;
export const ApresentacaoPiloto: React.FC = () => <Montagem itens={PILOTO.itens} duracao={PILOTO.duracao} telas={TELAS} pastaVoz="voz/apresentacao" semPip={SEM_PIP} />;

// início de cada fala (para conferir quadros no render de teste)
export const INICIOS_PILOTO = Object.fromEntries(PILOTO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));
