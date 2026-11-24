import type React from "react";
import type { Vozes } from "../ana/voz";
import vozes from "../voz-completo.json";
import { Abas, Ajuste, Alertas, Aprovacao, CaixaErp, Config, Config2, EmailCompradorCena, EmailDiretoriaCena, OlhoVerbas, Outras, Pagina, Parcelado, Planilha, Produtos, Recebimento, Regras, Rotina, Saidas, Tratativas } from "./CenasCompleto";
import { Montagem, montarRoteiro } from "./Montagem";
import { SEM_PIP, TELAS_PILOTO } from "./VerbasAcordos";

// Vídeo completo (16:9) do manual do Verbas e Acordos, apresentado pela Ana, a Assistente de IA
// da Simplí: abertura, 9 capítulos na ordem do manual e encerramento. Telas com dados fictícios.
const ROTEIRO = montarRoteiro(vozes as unknown as Vozes, [
  "abertura",
  "gancho",
  "conceito",
  "abas",
  "painel",
  { cap: 1, titulo: "CADASTRAR UM ACORDO" },
  "novo",
  "parcelado",
  "aprovacao",
  { cap: 2, titulo: "ACOMPANHAR OS ACORDOS" },
  "situacao",
  "alertas",
  { cap: 3, titulo: "CAIXA DO ERP" },
  "caixa",
  "saidas",
  "ajuste",
  "produtos",
  { cap: 4, titulo: "AS OUTRAS ABAS" },
  "outras",
  { cap: 5, titulo: "DENTRO DO ACORDO" },
  "pagina",
  "tratativas",
  "recebimento",
  { cap: 6, titulo: "VÁRIOS DE UMA VEZ" },
  "planilha",
  "regras",
  { cap: 7, titulo: "OS E-MAILS SEMANAIS" },
  "emailcomprador",
  "emaildiretoria",
  { cap: 8, titulo: "A ROTINA DA SEMANA" },
  "olho",
  "rotina",
  { cap: 9, titulo: "CONFIGURAÇÕES" },
  "config",
  "config2",
  ["fim", 75],
]);
export const DURACAO_COMPLETO = ROTEIRO.duracao;

const TELAS = {
  ...TELAS_PILOTO,
  abas: Abas,
  parcelado: Parcelado,
  aprovacao: Aprovacao,
  alertas: Alertas,
  caixa: CaixaErp,
  saidas: Saidas,
  ajuste: Ajuste,
  produtos: Produtos,
  olho: OlhoVerbas,
  outras: Outras,
  pagina: Pagina,
  tratativas: Tratativas,
  recebimento: Recebimento,
  planilha: Planilha,
  regras: Regras,
  emailcomprador: EmailCompradorCena,
  emaildiretoria: EmailDiretoriaCena,
  rotina: Rotina,
  config: Config,
  config2: Config2,
};

export const VerbasCompleto: React.FC = () => <Montagem itens={ROTEIRO.itens} duracao={ROTEIRO.duracao} telas={TELAS} pastaVoz="voz/completo" semPip={SEM_PIP} />;

// início de cada fala (para conferir quadros no render de teste)
export const INICIOS = Object.fromEntries(ROTEIRO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));
