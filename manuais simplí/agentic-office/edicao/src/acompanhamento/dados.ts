// Dados FICTÍCIOS das telas recriadas (empresa "Loja Modelo"). Nunca usar nomes ou números reais
// de cliente: os prints do manual vieram da base do Grupo BCI.
export const DEMANDA = {
  titulo: "Inauguração da Loja Sul",
  setor: "Expansão",
  email: "expansao@lojamodelo.com.br",
  autora: "Marina Costa",
  emailAutora: "marina.costa@lojamodelo.com.br",
  criada: "03/11/2026",
  prazo: "11/12/2026",
};

export const ATA = {
  arquivo: "Ata reunião Loja Sul - 03-11-2026.pdf",
  resumo:
    "Reunião sobre a inauguração da Loja Sul: estoque de abertura, campanha, equipe e cronograma da obra. O plano de ação define responsáveis e datas para cada frente até a abertura.",
  linhas: [
    "ATA DE REUNIÃO",
    "Assunto: Inauguração da Loja Sul",
    "Data: 3 de novembro de 2026",
    "Participantes: Marina Costa; Rafael Lima; Helena Duarte; Pedro Alves; Sérgio Nunes.",
    "1. Objetivo da reunião",
    "Alinhar as frentes de trabalho da inauguração e definir quem responde por cada entrega",
    "até a abertura da loja.",
    "2. Assuntos tratados",
    "2.1. Estoque de abertura",
    "Foram revisados os itens da primeira compra e as condições com os fornecedores.",
  ],
};

export type Proposta = {
  grupo: string;
  emailGrupo?: string;
  texto: string;
  trecho: string;
  secao: string;
  noDocumento: string;
  responsavel: string;
  prazo: string;
  notaPrazo?: string;
  alertas?: readonly string[];
};

export const PROPOSTAS: readonly Proposta[] = [
  {
    grupo: "Rafael Lima",
    emailGrupo: "rafael.lima@lojamodelo.com.br",
    texto: "Enviar o pedido de abertura de estoque aos fornecedores.",
    trecho: "Rafael vai enviar o pedido de abertura de estoque aos fornecedores até 13/11.",
    secao: "4. Plano de ação",
    noDocumento: "Rafael",
    responsavel: "Rafael Lima",
    prazo: "13/11/2026",
  },
  {
    grupo: "Pedro Alves",
    emailGrupo: "pedro.alves@lojamodelo.com.br",
    texto: "Aprovar a campanha de inauguração.",
    trecho: "Pedro e Sérgio ficam de aprovar a campanha de inauguração até 19/11.",
    secao: "4. Plano de ação",
    noDocumento: "Pedro e Sérgio",
    responsavel: "Pedro Alves",
    prazo: "19/11/2026",
  },
  {
    grupo: "Helena Duarte",
    emailGrupo: "helena.duarte@lojamodelo.com.br",
    texto: "Contratar a equipe da loja.",
    trecho: "Helena fica com a contratação da equipe da loja, logo depois da obra.",
    secao: "4. Plano de ação",
    noDocumento: "Helena",
    responsavel: "Helena Duarte",
    prazo: "dd/mm/aaaa",
    notaPrazo: "Prazo no documento: logo depois da obra",
    alertas: ['Prazo não reconhecido: "logo depois da obra".'],
  },
  {
    grupo: "Sem responsável",
    texto: "Confirmar a data com a arquitetura.",
    trecho: "A equipe de Obras deveria confirmar a data com a arquitetura até 30/10.",
    secao: "2.3. Cronograma da obra",
    noDocumento: "Equipe Obras",
    responsavel: "Sem responsável",
    prazo: "dd/mm/aaaa",
    notaPrazo: "Prazo no documento: até 30/10",
    alertas: ["O prazo 30/10/2026 já passou; defina uma nova data."],
  },
  {
    grupo: "Sem responsável",
    texto: "Revisar as licenças da obra.",
    trecho: "A equipe de Obras comentou que talvez seja preciso revisar as licenças da obra.",
    secao: "2.3. Cronograma da obra",
    noDocumento: "Equipe Obras",
    responsavel: "Sem responsável",
    prazo: "dd/mm/aaaa",
  },
];

// ---------- Lista de ações da demanda ativa
export type Linha = { acao: string; resp: string; area: string; prazo: string; era?: string; situacao: string; nota?: string; cobranca: string; proximo: string };

const ESTOQUE = PROPOSTAS[0].texto.replace(".", "");
// logo depois de ativar
export const LINHAS_INICIO: readonly Linha[] = [
  { acao: ESTOQUE, resp: "Rafael Lima", area: "Compras", prazo: "13/11/2026", situacao: "A vencer", cobranca: "Aviso inicial enviado 03/11, 15:12", proximo: "Próximo: lembrete do prazo em 12/11" },
  { acao: "Aprovar a campanha de inauguração", resp: "Pedro Alves + 1", area: "Marketing", prazo: "19/11/2026", situacao: "A vencer", nota: "ação: 0 de 2 entregaram", cobranca: "Aviso inicial enviado 03/11, 15:12", proximo: "Próximo: lembrete do prazo em 18/11" },
  { acao: "Contratar a equipe da loja", resp: "Helena Duarte", area: "RH", prazo: "a definir", situacao: "Aguardando", nota: "pedimos a data", cobranca: "Pedido de data enviado 03/11, 15:12", proximo: "Próximo: lembrete em 04/11" },
  { acao: "Confirmar a data com a arquitetura", resp: "Equipe Obras", area: "Obras", prazo: "06/11/2026", situacao: "A vencer", cobranca: "Aviso inicial enviado 03/11, 15:12", proximo: "Próximo: lembrete do prazo em 05/11" },
];
export const LINHA_MANUAL: Linha = { acao: "Instalar a rede e os caixas", resp: "Área de TI", area: "TI", prazo: "12/11/2026", situacao: "A vencer", cobranca: "Aviso inicial enviado 03/11, 15:20", proximo: "Próximo: lembrete do prazo em 11/11" };
// duas semanas depois, em 17/11/2026
export const LINHAS_ANDAMENTO: readonly Linha[] = [
  { ...LINHAS_INICIO[0], situacao: "Concluída", cobranca: "Aprovada por Marina Costa em 13/11", proximo: "Sem novas cobranças" },
  { ...LINHAS_INICIO[1], nota: "ação: 1 de 2 entregaram", cobranca: "Lembrete enviado 17/11, 08:00", proximo: "Próximo: aviso do dia em 19/11" },
  { ...LINHAS_INICIO[2], prazo: "04/12/2026", era: "era 27/11/2026", situacao: "A vencer", nota: undefined, cobranca: "Novo prazo aprovado em 10/11", proximo: "Próximo: lembrete do prazo em 03/12" },
  { ...LINHAS_INICIO[3], situacao: "Atrasada", cobranca: "Cobrança de atraso enviada 11/11, 08:00", proximo: "Próximo: cobrança de atraso em 18/11" },
  { ...LINHA_MANUAL, situacao: "Concluída", cobranca: "Aprovada por Marina Costa em 11/11", proximo: "Sem novas cobranças" },
];
export const INDICADORES_ANDAMENTO = { acoes: 5, concluidas: 2, noPrazo: 66.7, atrasadas: 1, reagendadas: 1, aguardando: 0 };

export const POR_PESSOA: readonly (readonly [string, number, number, number, string, number])[] = [
  ["Rafael Lima", 0, 0, 1, "100%", 0],
  ["Pedro Alves", 1, 0, 0, "—", 0],
  ["Sérgio Nunes", 1, 0, 0, "—", 0],
  ["Helena Duarte", 1, 0, 0, "—", 1],
  ["Equipe Obras", 1, 1, 0, "—", 0],
  ["Área de TI", 0, 0, 1, "100%", 0],
];
export const POR_AREA: readonly (readonly [string, number, number, number, string, number])[] = [
  ["Compras", 0, 0, 1, "100%", 0],
  ["Marketing", 1, 0, 0, "—", 0],
  ["RH", 1, 0, 0, "—", 1],
  ["Obras", 1, 1, 0, "—", 0],
  ["TI", 0, 0, 1, "100%", 0],
];
export const EVOLUCAO = { semanas: ["03/11", "10/11", "17/11", "24/11", "01/12", "08/12"], previstas: [1, 3, 4, 4, 5, 5], concluidas: [0, 2, 2] };
export const DEMANDAS_CARTOES: readonly (readonly [string, string, number, number, string, string])[] = [
  ["Inauguração da Loja Sul", "Ativa", 0, 4, "—", "06/11"],
  ["Inventário do almoxarifado", "Ativa", 3, 7, "80%", "10/11"],
  ["Renegociação de fretes", "Ativa", 1, 5, "100%", "12/11"],
  ["Campanha de Natal", "Rascunho", 0, 0, "—", "—"],
];
