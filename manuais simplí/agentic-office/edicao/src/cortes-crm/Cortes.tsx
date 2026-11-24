import type React from "react";
import type { Vozes } from "../ana/voz";
import { CapaV, GanchoV, type TextoG, type Visual } from "../cortes/Ganchos";
import { MontagemVertical, type TelaV } from "../cortes/Vertical";
import { textoDegrade } from "../fonte";
import { montarRoteiro } from "../verbas/Montagem";
import vozesCortes from "../voz-cortes-crm.json";
import vozesCrm from "../voz-crm.json";
import * as T from "./Telas";

// Cortes 9:16 do Simplí CRM para captar clientes: gancho próprio, ponte, falas do vídeo longo com a
// tela de celular e o mesmo fim ("comenta CRM"). A voz vem de voz/crm ou voz/cortes-crm pelo id.
type Def = {
  readonly n: number;
  readonly rotulo: string;
  readonly titulo: React.ReactNode;
  readonly g: TextoG;
  readonly V: Visual;
  readonly ponte?: readonly [string, TelaV];
  readonly telas: readonly (readonly [string, TelaV])[];
  readonly fim?: number;
};
const DEFS: readonly Def[] = [
  {
    n: 1,
    rotulo: "SIMPLÍ CRM · AGENTE DE IA",
    titulo: (<>atende às<br /><span style={textoDegrade}>23h</span></>),
    g: { rotulo: "SUA LOJA FECHA", linhas: ["SEU CLIENTE, NÃO"], riscada: "SEM RESPOSTA", novo: "O AGENTE DE IA ATENDE", tam: 88, tamRiscada: 92, tamNovo: 74, risca: "resposta", vira: "agente" },
    V: T.V1,
    ponte: ["corc1-ponte", T.ListaChatV],
    telas: [["cap2-1", T.AudioChegaV], ["cap2-1b", T.AudioTocaV], ["cap2-2", T.RespondeV], ["cap2-5", T.TransfereV]],
    fim: 6,
  },
  {
    n: 2,
    rotulo: "SIMPLÍ CRM · ORÇAMENTOS",
    titulo: (<>orçamento<br /><span style={textoDegrade}>não fica parado</span></>),
    g: { rotulo: "ORÇAMENTO ENVIADO", linhas: [], riscada: "NINGUÉM COBROU", novo: "VIRA TAREFA", tamRiscada: 96, tamNovo: 122, risca: "ninguém", vira: "tarefa" },
    V: T.V2,
    telas: [["cap4-3", T.OrcamentoV], ["cap4-4", T.LembraV]],
  },
  {
    n: 3,
    rotulo: "SIMPLÍ CRM · CLIENTES",
    titulo: (<>quem está<br /><span style={textoDegrade}>do outro lado</span></>),
    g: { rotulo: "ELE JÁ COMPROU COM VOCÊ", linhas: [], riscada: "VENDEDOR NÃO SABE", novo: "A FICHA MOSTRA TUDO", tamRiscada: 80, tamNovo: 84, risca: "sabe", vira: "ficha" },
    V: T.V3,
    telas: [["cap5-2", T.CrmV], ["cap5-3", T.FichaV]],
  },
  {
    n: 4,
    rotulo: "SIMPLÍ CRM · APP DO VENDEDOR",
    titulo: (<>a lista no<br /><span style={textoDegrade}>celular dele</span></>),
    g: { rotulo: "VENDER MAIS NA LOJA", linhas: [], riscada: "SÓ NO COMPUTADOR", novo: "NO CELULAR DELE", tamRiscada: 84, tamNovo: 100, risca: "computador", vira: "celular" },
    V: T.V4,
    ponte: ["cap7-2", T.AppV],
    telas: [["cap7-4", T.FluxoV], ["cap7-6", T.VoltouV]],
  },
  {
    n: 5,
    rotulo: "SIMPLÍ CRM · EVENTOS",
    titulo: (<>quanto a<br /><span style={textoDegrade}>campanha vendeu</span></>),
    g: { rotulo: "SUA ÚLTIMA CAMPANHA VENDEU?", linhas: [], riscada: "ACHISMO", novo: "RESULTADO EM REAIS", tamRiscada: 120, tamNovo: 88, risca: "achismo", vira: "resultado" },
    V: T.V5,
    ponte: ["corc5-ponte", T.EventoV],
    telas: [["corc5-campanha", T.CampanhasV]],
  },
];

const VOZES = { ...vozesCrm, ...vozesCortes } as unknown as Vozes;
const pastaVoz = (id: string) => (id.startsWith("corc") ? "voz/cortes-crm" : "voz/crm");
export const CORTES_CRM = DEFS.map((d) => {
  const gancho = `corc${d.n}-gancho`;
  const ponte = d.ponte ?? (["corc-ponte", T.PonteV] as const);
  const roteiro = montarRoteiro(VOZES, [gancho, ponte[0], ...d.telas.map(([id]) => id), ["corc-fim", d.fim ?? 30]]);
  const Gancho: TelaV = ({ c }) => <GanchoV c={c} g={d.g} V={d.V} />;
  const telas = { [gancho]: Gancho, [ponte[0]]: ponte[1], ...Object.fromEntries(d.telas), "corc-fim": T.FimV };
  const Corte: React.FC = () => <MontagemVertical itens={roteiro.itens} duracao={roteiro.duracao} telas={telas} semCabecalho={[gancho, "corc-fim"]} semLegenda={[gancho]} titulo={d.titulo} pastaVoz={pastaVoz} rotulo={d.rotulo} />;
  const Capa: React.FC = () => <CapaV g={d.g} V={d.V} logo="midia/logo-simpli-crm-escuro.png" />;
  const inicios = Object.fromEntries(roteiro.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, [i.c.de, i.c.dur]]] : [])));
  return { n: d.n, duracao: roteiro.duracao, Corte, Capa, inicios };
});
