import type React from "react";
import type { Vozes } from "../ana/voz";
import { textoDegrade } from "../fonte";
import { montarRoteiro } from "../verbas/Montagem";
import vozesApresentacao from "../voz-apresentacao.json";
import vozesCortes from "../voz-cortes.json";
import { FimV } from "./Corte1";
import { CapaV, GanchoV, type TextoG, type Visual, VisualApp, VisualAreas, VisualCofre, VisualOlho, VisualRecursos, VisualRelatorio, VisualReuniao } from "./Ganchos";
import * as T from "./Telas";
import { MontagemVertical, type TelaV } from "./Vertical";

// Cortes 2 a 8, um por tema: gancho próprio, falas do vídeo principal e o mesmo fim do corte 1.
// O corte 4 tem falas próprias, mais curtas, porque as originais passariam de 60 s.
type Def = {
  readonly n: number;
  readonly titulo: React.ReactNode;
  readonly g: TextoG;
  readonly V: Visual;
  readonly telas: readonly (readonly [string, TelaV])[];
  // segundo a mais no fim; os cortes 3 e 4 têm menos para ficar abaixo de 60 s
  readonly fim?: number;
};
const DEFS: readonly Def[] = [
  {
    n: 2,
    titulo: (<>converse com<br />a <span style={textoDegrade}>sua empresa</span></>),
    g: { rotulo: "IMAGINA CONVERSAR COM A SUA", linhas: [], riscada: "SISTEMA", novo: "EMPRESA", tamRiscada: 130, tamNovo: 170, risca: "empresa", vira: "inteira" },
    V: VisualOlho,
    telas: [["olho-1", T.Olho1V], ["olho-2", T.Olho2V], ["olho-3", T.Olho3V]],
  },
  {
    n: 3,
    titulo: (<>pergunte ao<br /><span style={textoDegrade}>seu sistema</span></>),
    g: { rotulo: "PARA SABER", linhas: ["QUANTO VENDEU", "ONTEM?"], riscada: "ESPERAR O RELATÓRIO", novo: "É SÓ PERGUNTAR", tam: 100, tamRiscada: 66, tamNovo: 94, risca: "saber", vira: "ontem" },
    V: VisualRelatorio,
    telas: [["erp-2", T.Erp2V], ["erp-3", T.Erp3V], ["erp-4", T.Erp4V], ["erp-6", T.DadosV]],
    fim: 15,
  },
  {
    n: 4,
    titulo: (<>os 4 recursos<br />de <span style={textoDegrade}>cada agente</span></>),
    g: { rotulo: "POR QUE OS AGENTES DÃO", linhas: ["RESPOSTA"], riscada: "GENÉRICA", novo: "DA SUA EMPRESA", tamNovo: 96, risca: "genérica", vira: "agentes" },
    V: VisualRecursos,
    telas: [["corte4-conhecimento", T.ConhecimentoV], ["corte4-memoria", T.MemoriaV], ["corte4-skills", T.SkillsV], ["corte4-ferramentas", T.FerramentasV]],
    fim: 15,
  },
  {
    n: 5,
    titulo: (<>a IA que entra<br />na <span style={textoDegrade}>reunião</span></>),
    g: { rotulo: "NINGUÉM DA SUA EQUIPE FAZ MAIS", linhas: [], riscada: "ATA DE REUNIÃO", novo: "A IA ENTREGA", tamRiscada: 104, tamNovo: 130, risca: "ata", vira: "reunião" },
    V: VisualReuniao,
    telas: [["trabalho-5", T.ReuniaoV], ["trabalho-3", T.RotinasV], ["trabalho-1", T.TarefasV]],
  },
  {
    n: 6,
    titulo: (<>módulos<br />de <span style={textoDegrade}>negócio</span></>),
    g: { rotulo: "E SE A IA RESOLVESSE", linhas: ["PROBLEMA"], riscada: "DE TESTE", novo: "DE VERDADE", tamNovo: 130, risca: "problema", vira: "verdade" },
    V: VisualAreas,
    telas: [["modulos-2", T.EstoqueV], ["modulos-3", T.ComercialV], ["modulos-4", T.VerbasV], ["modulos-5", T.ProspeccaoV]],
  },
  {
    n: 7,
    titulo: (<>e os dados<br />da <span style={textoDegrade}>empresa?</span></>),
    g: { rotulo: "A PRIMEIRA PERGUNTA DE TODO DIRETOR", linhas: ["E OS DADOS DA", "MINHA EMPRESA?"], riscada: "EXPOSTOS", novo: "FICAM COM VOCÊ", tam: 96, tamRiscada: 88, tamNovo: 96, risca: "dados", vira: "empresa" },
    V: VisualCofre,
    telas: [["erp-6", T.DadosV], ["seguranca-1", T.SegurancaV], ["seguranca-2", T.LogsV]],
  },
  {
    n: 8,
    titulo: (<>sem programar<br /><span style={textoDegrade}>nada</span></>),
    g: { rotulo: "NINGUÉM PRECISOU PROGRAMAR", linhas: ["UMA"], riscada: "PLANILHA", novo: "VIROU APP", tamNovo: 130, risca: "planilha", vira: "aplicativo" },
    V: VisualApp,
    telas: [["criar-2", T.MiniAppsV], ["criar-1", T.CriarV], ["criar-3", T.SobMedidaV]],
  },
];

const VOZES = { ...vozesApresentacao, ...vozesCortes } as unknown as Vozes;
export const CORTES = DEFS.map((d) => {
  const gancho = `corte${d.n}-gancho`;
  const roteiro = montarRoteiro(VOZES, [gancho, ...d.telas.map(([id]) => id), ["fim", d.fim ?? 30]]);
  const Gancho: TelaV = ({ c }) => <GanchoV c={c} g={d.g} V={d.V} />;
  const telas = { [gancho]: Gancho, ...Object.fromEntries(d.telas), fim: FimV };
  const Corte: React.FC = () => <MontagemVertical itens={roteiro.itens} duracao={roteiro.duracao} telas={telas} semCabecalho={[gancho, "fim"]} semLegenda={[gancho]} titulo={d.titulo} />;
  const Capa: React.FC = () => <CapaV g={d.g} V={d.V} />;
  const inicios = Object.fromEntries(roteiro.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));
  return { n: d.n, duracao: roteiro.duracao, Corte, Capa, inicios };
});
