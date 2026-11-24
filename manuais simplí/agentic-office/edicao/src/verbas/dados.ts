// Dados FICTÍCIOS das telas recriadas (empresa "Loja Modelo"). Nunca usar nomes ou números reais
// de cliente — os prints do manual vieram da base da Revestir.
export type Situacao = "Vencido" | "Vence em breve" | "No prazo" | "Parcial – vencido" | "Pendente – sem prazo" | "Em aprovação";

export type Acordo = {
  codigo: string;
  fornecedor: string;
  situacao: Situacao;
  descricao: string;
  saldo: string;
  negociado: string;
  recebido: string;
  prazo: string;
  comprador: string;
  alertas?: string[];
};

export const PAINEL = [
  { rotulo: "Valor negociado", valor: 1284600, nota: "418 acordos ativos", cor: "branco" },
  { rotulo: "Recebido", valor: 1012350, nota: "78,8% de realização", cor: "branco" },
  { rotulo: "Pendente de recebimento", valor: 272250, nota: "54 acordos em aberto", cor: "amarelo" },
  { rotulo: "Vencido e não recebido", valor: 46800, nota: "7 acordo(s) com o prazo passado", cor: "vermelho" },
  { rotulo: "Vencem em breve", valor: 18000, nota: "3 acordo(s) nos próximos 15 dias", cor: "branco" },
  { rotulo: "Abertos sem comprador", valor: 9, nota: "definir o responsável", cor: "amarelo", contagem: true },
] as const;

export const ACORDOS: Record<string, Acordo> = {
  a214: {
    codigo: "ACD-0214",
    fornecedor: "Tintas Horizonte",
    situacao: "Vencido",
    descricao: "Cota aniversário da loja · parcela 2/6 (6x R$ 6.500,00)",
    saldo: "R$ 6.500,00",
    negociado: "R$ 6.500,00",
    recebido: "—",
    prazo: "Prazo 30/09/2026 (30d)",
    comprador: "Marina Costa",
  },
  a209: {
    codigo: "ACD-0209",
    fornecedor: "Metais Prisma",
    situacao: "Vence em breve",
    descricao: "Bonificação em mercadoria · linha banho",
    saldo: "R$ 12.000,00",
    negociado: "R$ 12.000,00",
    recebido: "—",
    prazo: "Prazo 10/11/2026 (11d)",
    comprador: "Rafael Lima",
  },
  a198: {
    codigo: "ACD-0198",
    fornecedor: "Louças Serena",
    situacao: "No prazo",
    descricao: "Rapel trimestral · 3% sobre compras",
    saldo: "R$ 9.850,00",
    negociado: "R$ 9.850,00",
    recebido: "—",
    prazo: "Prazo 31/12/2026",
    comprador: "Marina Costa",
  },
  a187: {
    codigo: "ACD-0187",
    fornecedor: "Pisos Atlântico",
    situacao: "Parcial – vencido",
    descricao: "Cota Black Friday · 2x R$ 5.000,00",
    saldo: "R$ 4.300,00",
    negociado: "R$ 10.000,00",
    recebido: "R$ 5.700,00",
    prazo: "Prazo 15/10/2026 (15d)",
    comprador: "Rafael Lima",
    alertas: ["Sem evidência"],
  },
  a215: {
    codigo: "ACD-0215",
    fornecedor: "Cerâmica Aurora",
    situacao: "No prazo",
    descricao: "Cota Fim de Ano · NF de bonificação em dezembro",
    saldo: "R$ 24.000,00",
    negociado: "R$ 24.000,00",
    recebido: "—",
    prazo: "Prazo 30/12/2026",
    comprador: "Marina Costa",
  },
};

// formulário do Novo acordo
export const NOVO = {
  fornecedor: "Cerâmica Aurora",
  modalidade: "Cota de patrocínio de campanha",
  forma: "Bonificação em mercadoria (NF)",
  comprador: "Marina Costa",
  descricao: "Cota Fim de Ano — R$ 24 mil, NF de bonificação em dezembro",
  negociacao: "30/10/2026",
  competencia: "dezembro de 2026",
  valor: "R$ 24.000,00",
  prevista: "30/12/2026",
  evidencia: "E-mail de 28/10",
  anexo: "email-cota-fim-de-ano.eml",
};

// acordo parcelado (cena do parcelamento), no mesmo formulário do Novo acordo
export const NOVO_PARCELADO: typeof NOVO = {
  fornecedor: "Tintas Horizonte",
  modalidade: "Cota de patrocínio de campanha",
  forma: "Bonificação em mercadoria (NF)",
  comprador: "Marina Costa",
  descricao: "Cota de verão — 10x R$ 12 mil, NF de bonificação no fim de cada mês",
  negociacao: "30/10/2026",
  competencia: "",
  valor: "R$ 12.000,00",
  prevista: "30/11/2026",
  evidencia: "Contrato de 29/10",
  anexo: "contrato-cota-verao.pdf",
};

// acordo com cadastro incompleto (cena dos alertas)
export const A221: Acordo = {
  codigo: "ACD-0221",
  fornecedor: "Vidros Cristal",
  situacao: "Pendente – sem prazo",
  descricao: "Rapel semestral · 2% sobre compras (estimado)",
  saldo: "R$ 7.200,00",
  negociado: "R$ 7.200,00",
  recebido: "—",
  prazo: "Sem prazo",
  comprador: "(sem comprador)",
  alertas: ["Sem prazo", "Sem comprador"],
};

// Caixa do ERP: notas pendentes, agrupadas por fornecedor. O valor que conta é o dos produtos; a NF
// vem com os impostos. Cada nota traz a sugestão (da IA ou da regra) com motivo e confiança.
export type Confianca = "alta" | "média" | "palpite";
export type NotaErp = {
  emissao: string;
  doc: string;
  erp: string;
  acao?: string;
  produtos: string;
  nf: string;
  impostos: string;
  sugestao: string;
  ia: boolean;
  confianca: Confianca;
  motivo: string;
  acordo: string;
};
export type GrupoErp = { fornecedor: string; comprador: string; total: string; notas: NotaErp[] };
export const GRUPOS: GrupoErp[] = [
  {
    fornecedor: "Cerâmica Aurora",
    comprador: "Marina Costa",
    total: "R$ 20.000,00",
    notas: [
      {
        emissao: "28/10/2026",
        doc: "NF 4821 · filial 01",
        erp: "ERP: CERAMICA AURORA IND. LTDA (AURORA)",
        acao: "Ação: cota fim de ano - 1ª NF",
        produtos: "R$ 14.000,00",
        nf: "R$ 14.980,00",
        impostos: "R$ 980,00",
        sugestao: "Lançar no ACD-0215",
        ia: true,
        confianca: "alta",
        motivo: "A ação e o valor batem com a Cota Fim de Ano, que tem saldo de R$ 24.000.",
        acordo: "★ ACD-0215 · saldo R$ 24.000 · Cota Fim de Ano",
      },
      {
        emissao: "29/10/2026",
        doc: "NF 4822 · filial 01",
        erp: "ERP: CERAMICA AURORA IND. LTDA (AURORA)",
        acao: "Ação: cota fim de ano - 2ª NF",
        produtos: "R$ 6.000,00",
        nf: "R$ 6.420,00",
        impostos: "R$ 420,00",
        sugestao: "Lançar no ACD-0215",
        ia: false,
        confianca: "alta",
        motivo: "Segunda NF da mesma cota: o saldo do ACD-0215 comporta a nota.",
        acordo: "★ ACD-0215 · saldo R$ 24.000 · Cota Fim de Ano",
      },
    ],
  },
  {
    fornecedor: "Tintas Horizonte",
    comprador: "Marina Costa",
    total: "R$ 9.380,00",
    notas: [
      {
        emissao: "26/10/2026",
        doc: "NF 3310 · filial 01",
        erp: "ERP: TINTAS HORIZONTE S.A. (HORIZONTE)",
        acao: "Ação: cota aniversário + vitrine de outubro",
        produtos: "R$ 9.000,00",
        nf: "R$ 9.630,00",
        impostos: "R$ 630,00",
        sugestao: "Dividir entre ACD-0214 e ACD-0216",
        ia: true,
        confianca: "média",
        motivo: "Os saldos dos dois acordos somam o valor da nota: R$ 6.500 + R$ 2.500.",
        acordo: "★ ACD-0214 · saldo R$ 6.500 · Cota aniversário",
      },
      {
        emissao: "25/10/2026",
        doc: "NF 3318 · filial 02",
        erp: "ERP: TINTAS HORIZONTE S.A. (HORIZONTE)",
        acao: "Ação: brindes do evento de lojistas",
        produtos: "R$ 380,00",
        nf: "R$ 406,60",
        impostos: "R$ 26,60",
        sugestao: "Ignorar (brinde de evento)",
        ia: true,
        confianca: "palpite",
        motivo: "Brinde de evento não costuma ser verba, e nenhum acordo combina com a ação.",
        acordo: "ACD-0216 · saldo R$ 2.500 · Vitrine de outubro",
      },
    ],
  },
];

// Lista de acordos que abre no seletor de uma nota da Cerâmica Aurora (busca por código, descrição,
// mês ou valor), em três grupos como no sistema
export type ItemLista = { codigo: string; nome: string; linha2: string };
export const LISTA_AURORA: { grupo: "Sugerido" | "Com saldo" | "Liquidados: lançar deixa o acordo recebido a maior"; itens: ItemLista[] }[] = [
  { grupo: "Sugerido", itens: [{ codigo: "ACD-0215", nome: "Cota Fim de Ano", linha2: "saldo R$ 10.000,00 · acordo R$ 24.000 · 12/26" }] },
  {
    grupo: "Com saldo",
    itens: [
      { codigo: "ACD-0222", nome: "Vitrine de novembro", linha2: "saldo R$ 6.000,00 · acordo R$ 6.000 · 11/26" },
      { codigo: "ACD-0219", nome: "Promotora - outubro", linha2: "saldo R$ 3.500,00 · acordo R$ 3.500 · 10/26" },
    ],
  },
  {
    grupo: "Liquidados: lançar deixa o acordo recebido a maior",
    itens: [
      { codigo: "ACD-0201", nome: "Vitrine de outubro", linha2: "Liquidado · acordo R$ 6.000 · 10/26" },
      { codigo: "ACD-0188", nome: "Cota aniversário da loja", linha2: "Liquidado · acordo R$ 12.000 · 08/26" },
    ],
  },
];

// Recebimentos (aba A resolver): cada linha mostra o acordo, o saldo e a situação dele
export type Recebimento = {
  data: string;
  acordo: string;
  resumo: string;
  situacao: "Liquidado" | "No prazo" | "Parcial – vencido";
  fornecedor: string;
  doc: string;
  tipo: string;
  produtos: string;
  nf: string;
  fin: "Aguardando" | "Divergente" | "Conferido";
  aviso?: string;
  usar?: string;
};
export const RECEBIMENTOS: Recebimento[] = [
  { data: "30/10/2026", acordo: "ACD-0198", resumo: "acordo R$ 9.850,00 · saldo R$ 0,00", situacao: "Liquidado", fornecedor: "Louças Serena", doc: "NF 5530", tipo: "NF de bonificação", produtos: "R$ 10.539,50", nf: "total da NF, com impostos", fin: "Aguardando", aviso: "Lançado com os impostos da NF", usar: "R$ 9.850,00" },
  { data: "28/10/2026", acordo: "ACD-0215", resumo: "acordo R$ 24.000,00 · saldo R$ 4.000,00", situacao: "No prazo", fornecedor: "Cerâmica Aurora", doc: "NF 4821", tipo: "NF de bonificação", produtos: "R$ 14.000,00", nf: "NF R$ 14.980,00 · impostos R$ 980,00", fin: "Aguardando" },
  { data: "20/10/2026", acordo: "ACD-0187", resumo: "acordo R$ 10.000,00 · saldo R$ 4.300,00", situacao: "Parcial – vencido", fornecedor: "Pisos Atlântico", doc: "Boleto 55120/02", tipo: "Duplicata / boleto", produtos: "R$ 5.700,00", nf: "desconto em boleto", fin: "Divergente" },
  { data: "14/10/2026", acordo: "ACD-0176", resumo: "acordo R$ 3.150,00 · saldo R$ 0,00", situacao: "Liquidado", fornecedor: "Louças Serena", doc: "Depósito 0931", tipo: "Depósito / PIX", produtos: "R$ 3.150,00", nf: "depósito em conta", fin: "Aguardando" },
];

// Fornecedores (tabela)
export const FORNECEDORES = [
  { nome: "Tintas Horizonte", codigo: "FOR-034", comprador: "Marina Costa", negociado: "R$ 88.000", recebido: "R$ 66.600", pendente: "R$ 21.400", vencido: "R$ 6.500", aberto: 6, ultimo: "26/10/2026", erp: true },
  { nome: "Metais Prisma", codigo: "FOR-047", comprador: "Rafael Lima", negociado: "R$ 54.300", recebido: "R$ 42.300", pendente: "R$ 12.000", vencido: "—", aberto: 2, ultimo: "09/10/2026", erp: true },
  { nome: "Cerâmica Aurora", codigo: "FOR-021", comprador: "Marina Costa", negociado: "R$ 96.400", recebido: "R$ 92.400", pendente: "R$ 4.000", vencido: "—", aberto: 1, ultimo: "29/10/2026", erp: true },
  { nome: "Vidros Cristal", codigo: "FOR-088", comprador: "—", negociado: "R$ 7.200", recebido: "R$ 0", pendente: "R$ 7.200", vencido: "—", aberto: 1, ultimo: "—", erp: false },
  { nome: "Pisos Atlântico", codigo: "FOR-052", comprador: "Rafael Lima", negociado: "R$ 61.000", recebido: "R$ 56.700", pendente: "R$ 4.300", vencido: "R$ 4.300", aberto: 1, ultimo: "20/10/2026", erp: true },
  { nome: "Louças Serena", codigo: "FOR-063", comprador: "Marina Costa", negociado: "R$ 41.850", recebido: "R$ 41.850", pendente: "R$ 0", vencido: "—", aberto: 0, ultimo: "30/10/2026", erp: true },
];

// Pendências
export const PENDENCIAS = [
  { n: 1, prioridade: "Alta", tipo: "Acordo sem evidência", fornecedor: "Pisos Atlântico", valor: "R$ 10.000,00", texto: "Cota Black Friday sem e-mail ou contrato que comprove o combinado.", acao: "Anexar o e-mail de negociação na página do acordo." },
  { n: 2, prioridade: "Alta", tipo: "Nota sem acordo", fornecedor: "Tintas Horizonte", valor: "R$ 2.400,00", texto: "NF 3310 de bonificação chegou sem acordo cadastrado.", acao: "Criar o acordo retroativo na Caixa do ERP." },
  { n: 3, prioridade: "Média", tipo: "Fornecedor sem vínculo", fornecedor: "Vidros Cristal", valor: "R$ 7.200,00", texto: "Fornecedor sem vínculo com o cadastro do ERP: as notas chegam sem dono.", acao: "Vincular o fornecedor ao cadastro do ERP." },
];

// Pendências da migração das planilhas antigas (vídeo de treinamento), como no sistema
export const PENDENCIAS_MIG = [
  {
    n: 1,
    prioridade: "Alta",
    tipo: "Parcelas sem data",
    fornecedor: "Tintas Horizonte",
    valor: "R$ 24.000,00",
    texto: "Cota de verão “6x R$ 4 mil” estava na planilha sem as datas das parcelas.",
    tratamento: "Migradas as 6 parcelas, sem data prevista.",
    acao: "Confirmar o cronograma com o fornecedor e preencher as datas.",
    origem: "Acordos Comerciais 2026.xlsx · aba Tintas Horizonte!B12",
  },
  {
    n: 2,
    prioridade: "Alta",
    tipo: "Acordo fora do resumo",
    fornecedor: "Pisos Atlântico",
    valor: "R$ 15.000,00",
    texto: "Aba 'Pisos 26' (R$ 15.000,00 a receber) não estava no resumo 'Geral'.",
    tratamento: "Migrados 2 acordos.",
    acao: "Conferir com o comprador se os acordos continuam valendo.",
    origem: "Acordos Comerciais 2026.xlsx · aba Pisos 26",
  },
  {
    n: 3,
    prioridade: "Média",
    tipo: "Valor a confirmar",
    fornecedor: "Metais Prisma",
    valor: "R$ 3.200,00",
    texto: "Rapel de 3% sobre compras, com valor estimado na planilha.",
    tratamento: "Migrado como acordo com valor estimado.",
    acao: "Confirmar o valor com o fornecedor no fim do trimestre.",
    origem: "Acordos Comerciais 2026.xlsx · aba Rapel!C4",
  },
];

// acordo do treinamento: o comprador cadastra do começo ao fim
export const NOVO_TREIN = {
  fornecedor: "Tintas Horizonte",
  modalidade: "Verba de inauguração / aniversário de loja",
  forma: "Bonificação em mercadoria (NF)",
  comprador: "Marina Costa",
  descricao: "Cota de aniversário — 3x R$ 5 mil, NF de bonificação no fim do mês",
  negociacao: "13/11/2026",
  competencia: "novembro de 2026",
  valor: "R$ 5.000,00",
  prevista: "30/11/2026",
  evidencia: "E-mail de 12/11 com a Carla",
  anexo: "email-cota-aniversario.eml",
};

// Configurações: papéis
export const PAPEIS = ["Comprador", "Assistente de Compras", "Financeiro", "Marketing / Trade", "Diretoria"] as const;
export const PESSOAS: [string, (typeof PAPEIS)[number][]][] = [
  ["Bruna Teixeira", ["Assistente de Compras"]],
  ["Helena Duarte", ["Diretoria"]],
  ["Júlia Rocha", ["Financeiro"]],
  ["Marina Costa", ["Comprador"]],
  ["Pedro Alves", ["Marketing / Trade"]],
  ["Rafael Lima", ["Comprador"]],
  ["Sérgio Nunes", ["Diretoria"]],
];
