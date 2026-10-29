// Gerado por scripts/gerar-roteiro-longo.mjs a partir de scripts/roteiro-longo.json. Não editar à mão.
// Tempos em segundos dentro de public/longo/<bloco>.mp4 (ajustados às pausas).
export type Trecho = { id: string; bloco: string; ini: number; fim: number; trocas: readonly number[] };
export const BLOCOS_ORIGEM: Record<string, number> = {"v1":55,"olho":14,"ferrari":203,"agentes":802,"maturidade":1043,"manha":1178,"confianca":1286,"compras":1402,"dores":1506,"gestores":1632,"foco":1722,"sempre":1984};
export const ABERTURA: readonly Trecho[] = [
  { id: "c1", bloco: "v1", ini: 16.96, fim: 24.8, trocas: [] }, // a gente vai colocar IA dentro da empresa… vou perder meu emprego. Mas não é bem assim.
  { id: "c2", bloco: "ferrari", ini: 2.06, fim: 8.59, trocas: [] }, // Você tem uma Ferrari e um Fusca… mas tu sabe dirigir a Ferrari?
  { id: "c3", bloco: "v1", ini: 449.21, fim: 454.29, trocas: [] }, // Botei IA na operação, mas a IA não ajudou em nada. Só fez piorar.
  { id: "c4", bloco: "gestores", ini: 5.37, fim: 10.25, trocas: [] }, // Vocês são os cabeças da equipe. Se vocês não comprarem a ideia, a equipe não compra.
];
export const CAPITULOS: readonly { titulo: string; curto: string; sub: string; trechos: readonly Trecho[] }[] = [
  { titulo: "Antes da ferramenta, o letramento", curto: "Letramento", sub: "Por que começamos nivelando a IA com os gestores", trechos: [
    { id: "a1", bloco: "v1", ini: 5.31, fim: 24.44, trocas: [11.88, 20.41] }, // Antes da gente mostrar a ferramenta… não é bem assim.
    { id: "a2", bloco: "v1", ini: 24.82, fim: 38.84, trocas: [32.38] }, // a gente veio para começar a provocar vocês… Caio, fundador e sócio da Simplí
    { id: "a3", bloco: "v1", ini: 39.34, fim: 71.61, trocas: [45.44, 52.84, 60.19, 66.25] }, // 20 anos de gestão… atendimento, CRM, Televendas… agora a gestão
    { id: "a4", bloco: "v1", ini: 95.85, fim: 101.16, trocas: [] }, // A provocação é pensar diferente.
    { id: "a5", bloco: "v1", ini: 117.52, fim: 157.91, trocas: [124.28, 130.45, 137.33, 144.21, 150.24] }, // E se…? … provocar toda a minha equipe.
  ] },
  { titulo: "O ChatGPT é só a pontinha", curto: "A pontinha", sub: "A IA já está no seu dia a dia, e não é de agora", trechos: [
    { id: "b1", bloco: "v1", ini: 162.18, fim: 167.89, trocas: [] }, // Quem usou inteligência artificial aqui hoje?
    { id: "b2", bloco: "v1", ini: 171.14, fim: 182.07, trocas: [] }, // qual é a primeira coisa que vem na cabeça? Clássico, né?
    { id: "b3", bloco: "v1", ini: 184.47, fim: 232.74, trocas: [190.97, 199.73, 208.9, 215.24, 221.33, 227.52] }, // ChatGPT é a pontinha… celular, previsão do tempo… década de 50
    { id: "b4", bloco: "v1", ini: 234.11, fim: 261.5, trocas: [240.16, 248.98, 255.96] }, // OpenAI democratizou em 2022… entender o que cada ferramenta faz
  ] },
  { titulo: "O hype acabou", curto: "O hype acabou", sub: "Da experimentação à IA como infraestrutura do negócio", trechos: [
    { id: "d1", bloco: "v1", ini: 262.14, fim: 311.98, trocas: [269.36, 277.95, 284.41, 291.07, 299.53, 305.84] }, // fase de experimentação já passou… uso recreativo
    { id: "d2", bloco: "v1", ini: 322.16, fim: 336.82, trocas: [329.85] }, // gerar lucro… infraestrutura operacional
    { id: "d3", bloco: "v1", ini: 354.05, fim: 414.16, trocas: [362.67, 369.98, 376.38, 385.2, 391.67, 400.39, 407.63] }, // 70% usam, 15% têm ROI… dados estruturados… estagiário
  ] },
  { titulo: "Sem dados, a IA só piora", curto: "Dados primeiro", sub: "A pavimentação que vem antes de qualquer ferramenta", trechos: [
    { id: "e1", bloco: "v1", ini: 415.66, fim: 466.13, trocas: [421.85, 429.75, 438.16, 446.54, 453.22, 459.83] }, // a maioria falhou… pavimentação… botei IA e só piorou
    { id: "e2", bloco: "v1", ini: 467.97, fim: 521.52, trocas: [474.62, 481.19, 487.7, 493.78, 500.65, 507.18, 514.94] }, // IA é ferramenta como o ERP… trabalhar em conjunto
  ] },
  { titulo: "O humano no processo", curto: "Humano + IA", sub: "O que uma fábrica automatizada ensina sobre IA", trechos: [
    { id: "f1", bloco: "v1", ini: 521.34, fim: 582.95, trocas: [528.39, 535.83, 542.71, 549.33, 556.02, 562.65, 570.27, 577.64] }, // Tramontina… tem o humano no processo
  ] },
  { titulo: "Agentic Office na prática", curto: "Agentic Office", sub: "Agentes de IA trabalhando como funcionários digitais", trechos: [
    { id: "g1", bloco: "olho", ini: 1.82, fim: 20.91, trocas: [12.67] }, // Olho de Deus… relatório todo dia às 9h… dispara automático
    { id: "g2", bloco: "olho", ini: 28.14, fim: 57.24, trocas: [34.64, 41.67, 48.16] }, // Torre de controle… devoluções, auditoria, batida de caixa, prevenção
    { id: "g3", bloco: "agentes", ini: 2.49, fim: 23.38, trocas: [10.53, 17.66] }, // estrutura de agentes por trás… uma gama de agentes no processo
    { id: "g4", bloco: "agentes", ini: 29.44, fim: 36.94, trocas: [] }, // O agente de IA é o funcionário digital
    { id: "g6", bloco: "agentes", ini: 43.26, fim: 131.07, trocas: [50.45, 58.54, 68.22, 74.46, 82.2, 91.15, 98.34, 104.74, 112.76, 120.56, 127.79] }, // diretoria valida… Rafael, Larissa… três agentes… conversacional… automatiza
    { id: "g7", bloco: "agentes", ini: 140.27, fim: 175.69, trocas: [146.91, 155.43, 163.64, 169.97] }, // Uma vez criado o processo, já foi… agente da manhã
    { id: "g8", bloco: "manha", ini: 2.01, fim: 31.66, trocas: [8.66, 15.55, 21.58] }, // análise de uma manhã em 30 minutos… isso é produtividade
  ] },
  { titulo: "Comece pequeno", curto: "Comece pequeno", sub: "Maturidade se constrói processo a processo", trechos: [
    { id: "h1", bloco: "ferrari", ini: 2.06, fim: 13.2, trocas: [8.85] }, // Ferrari e Fusca… a estrada é de terra
    { id: "h2", bloco: "ferrari", ini: 15.83, fim: 40.57, trocas: [22.32, 31.36] }, // a gente não vai só trazer a plataforma… pegar na mão
    { id: "h3", bloco: "maturidade", ini: 2.1, fim: 16.92, trocas: [8.54] }, // maturidade junto com vocês… de acordo com o andar da empresa
    { id: "h4", bloco: "confianca", ini: 1.81, fim: 18.7, trocas: [8.93] }, // maturidade de uso… 3, 5… ganhar confiança
    { id: "h5", bloco: "confianca", ini: 20.41, fim: 35.11, trocas: [27.38] }, // ganhar confiança na ferramenta… nem tudo deve ser automatizado
    { id: "h6", bloco: "dores", ini: 1.62, fim: 14.97, trocas: [9.22] }, // pense em cinco processos… não é que amanhã já vai estar funcionando
  ] },
  { titulo: "Compras é a alma do negócio", curto: "Foco em compras", sub: "Um setor de cada vez, antes de abraçar a empresa inteira", trechos: [
    { id: "i1", bloco: "compras", ini: 1.63, fim: 26.87, trocas: [8.56, 17.17, 23.82] }, // Abre a cabeça… conciliação bancária… compras é o coração
    { id: "i2", bloco: "compras", ini: 53.8, fim: 86.35, trocas: [59.96, 66.91, 74.58, 80.73] }, // controlar a verba… tudo na planilha… N coisas
    { id: "i3", bloco: "foco", ini: 19.25, fim: 24.98, trocas: [] }, // foque em compras, isso vai ser um mundo gigantesco
    { id: "i4", bloco: "foco", ini: 27.49, fim: 34.8, trocas: [] }, // Compras. É a alma do negócio.
    { id: "i5", bloco: "foco", ini: 69.5, fim: 78.1, trocas: [] }, // Tem que ter um foco… otimizar uma coisa só
  ] },
  { titulo: "Gestores na frente", curto: "Gestores na frente", sub: "Sem a liderança comprando a ideia, a equipe não compra", trechos: [
    { id: "j1", bloco: "gestores", ini: 0.57, fim: 30.04, trocas: [7.22, 13.47, 20.5] }, // por que juntamos os gestores… empresa sem gestor
    { id: "j2", bloco: "sempre", ini: 2.08, fim: 5.13, trocas: [] }, // A gente vai estar sempre por aqui.
  ] },
];
// centro do apresentador [s no bloco, x, topo da cabeça] em 2560x1440
export const CAMERA: Record<string, readonly (readonly [number, number, number])[]> = {
  v1: [[5,1306,619],[15,1101,533],[25,1178,590],[35,1203,576],[45,1075,619],[55,1075,619],[65,1075,634],[75,1203,648],[85,1101,590],[95,1178,619],[105,1203,648],[115,1306,634],[125,1280,648],[135,1357,662],[145,1280,677],[155,1331,662],[165,1382,590],[175,1357,590],[185,1382,634],[195,1357,634],[205,1306,619],[215,1280,619],[225,1408,619],[235,1408,634],[245,1408,634],[255,1229,634],[265,1178,590],[275,1280,590],[285,1306,648],[295,1254,648],[305,1254,662],[315,1280,648],[325,1331,619],[335,1382,619],[345,1306,634],[355,1254,634],[365,1254,619],[375,1229,619],[385,1382,634],[395,1331,619],[405,1306,619],[415,1229,619],[425,1331,619],[435,1331,619],[445,1306,648],[455,1229,648],[465,1229,648],[475,1331,648],[485,1280,619],[495,1408,648],[505,1408,648],[515,1280,619],[525,1357,619],[535,1408,634],[545,1408,648],[555,1382,634],[565,1382,634],[575,1280,634],[585,1357,634]],
  olho: [[2,742,590],[10,768,590],[18,794,576],[26,768,562],[34,742,605],[42,742,605],[50,768,619],[58,768,605]],
  ferrari: [[2,768,619],[10,794,590],[18,794,590],[26,794,590],[34,819,590]],
  agentes: [[2,1075,706],[34,1101,648],[42,973,619],[50,1126,619],[58,1152,590],[66,896,619],[74,1075,590],[82,922,634],[90,922,605],[98,870,648],[106,870,648],[114,870,634],[122,819,634],[130,819,619],[138,819,619],[146,819,590],[154,794,562],[162,960,590],[170,1126,590]],
  maturidade: [[2,819,590],[10,896,605]],
  manha: [[2,794,590],[10,896,590],[18,896,590],[26,922,590]],
  confianca: [[2,794,634],[10,614,634],[18,742,562],[26,691,576],[34,666,576],[42,666,590]],
  compras: [[2,666,547],[10,717,533],[18,691,547],[26,896,562],[34,922,605],[42,896,590],[50,896,619],[58,691,605],[66,717,605],[74,614,605],[82,717,533]],
  dores: [[2,512,590],[10,563,619],[18,589,562],[26,589,590]],
  gestores: [[1,563,547],[9,563,547],[17,819,619],[25,794,605]],
  foco: [[19,589,547],[27,614,547],[35,614,576],[43,614,619],[51,640,576],[59,640,576],[67,640,605],[75,614,576]],
  sempre: [],
};
