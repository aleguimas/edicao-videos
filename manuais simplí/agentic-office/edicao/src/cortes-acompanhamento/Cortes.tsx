import type React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { CapaAcompanhamento } from "../acompanhamento/CapaAcompanhamento";
import { marca, type Vozes } from "../ana/voz";
import { useMola } from "../apresentacao/comum";
import { CapaV, GanchoV, type TextoG, type Visual } from "../cortes/Ganchos";
import { MontagemVertical, type TelaV } from "../cortes/Vertical";
import { textoDegrade, TITULO, VERDE } from "../fonte";
import { montarRoteiro, Surge } from "../verbas/Montagem";
import vozesAcompanhamento from "../voz-acompanhamento.json";
import vozesCortes from "../voz-cortes-acompanhamento.json";
import * as T from "./Telas";

// Cortes 9:16 do módulo Acompanhamento: gancho próprio, a ponte que apresenta o módulo, falas do vídeo
// longo (ou regravadas, quando dependem do que veio antes) e o mesmo fim. O rótulo do cabeçalho mantém
// o nome do módulo na tela o corte inteiro.
const FimA: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const s = useMola(m("módulo") - 6);
  const brilho = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 520 }} />
      </Surge>
      <div style={{ position: "absolute", left: 90, top: 570, width: 900, height: 506, borderRadius: 24, overflow: "hidden", border: `3px solid ${VERDE}`, boxShadow: `0 0 ${40 + brilho * 30}px rgba(60,224,30,0.45)`, opacity: s, transform: `scale(${0.85 + 0.15 * s})` }}>
        <div style={{ width: 1920, height: 1080, transform: `scale(${900 / 1920})`, transformOrigin: "0 0" }}>
          <CapaAcompanhamento />
        </div>
      </div>
      <Surge de={m("ar") - 4} style={{ left: 0, right: 0, top: 1110, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 64, color: "white", lineHeight: 1.05 }}>VÍDEO COMPLETO</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.1, ...textoDegrade }}>JÁ NO AR</div>
      </Surge>
    </>
  );
};

type Def = {
  readonly n: number;
  readonly titulo: React.ReactNode;
  readonly g: TextoG;
  readonly V: Visual;
  readonly telas: readonly (readonly [string, TelaV])[];
  // segundo a mais no fim; menos nos cortes que ficam perto de 60 s
  readonly fim?: number;
  readonly ponte?: string;
};
const DEFS: readonly Def[] = [
  {
    n: 2,
    titulo: (<>a cobrança<br /><span style={textoDegrade}>sai sozinha</span></>),
    g: { rotulo: "VOCÊ AINDA COBRA", linhas: ["AS PESSOAS"], riscada: "UMA POR UMA", novo: "O SISTEMA COBRA", tam: 112, tamRiscada: 100, tamNovo: 104, risca: "uma", vira: "sistema" },
    V: T.VisualCobranca,
    telas: [["cortea2-aviso", T.AvisoV], ["cadencia", T.CadenciaV], ["escala", T.EscalaV]],
    fim: 15,
  },
  {
    n: 1,
    titulo: (<>cada ação<br /><span style={textoDegrade}>tem dono</span></>),
    g: { rotulo: "QUEM FICOU COM O QUÊ?", linhas: [], riscada: "NINGUÉM SABE", novo: "CADA AÇÃO TEM DONO", tamRiscada: 110, tamNovo: 80, risca: "ninguém", vira: "dono" },
    V: T.VisualDono,
    telas: [["conceito", T.ConceitoV], ["semacesso", T.SemAcessoV]],
    ponte: "cortea1-ponte",
  },
  {
    n: 3,
    titulo: (<>da ata ao<br /><span style={textoDegrade}>plano de ação</span></>),
    g: { rotulo: "A ATA DA REUNIÃO", linhas: [], riscada: "PARADA NA PASTA", novo: "VIRA PLANO DE AÇÃO", tamRiscada: 92, tamNovo: 84, risca: "parada", vira: "plano" },
    V: T.VisualAta,
    telas: [["cortea3-documento", T.DocumentoV], ["cortea3-lendo", T.LendoV], ["resultado", T.ResultadoV]],
  },
  {
    n: 4,
    titulo: (<>você revisa<br /><span style={textoDegrade}>antes de cobrar</span></>),
    g: { rotulo: "E SE A IA ENTENDER", linhas: [], riscada: "ERRADO?", novo: "VOCÊ REVISA ANTES", tamRiscada: 130, tamNovo: 92, risca: "errado", vira: "revisão" },
    V: T.VisualRevisa,
    telas: [["trecho", T.TrechoV], ["cortea4-alertas", T.AlertasV], ["ativar", T.AtivarV]],
  },
  {
    n: 5,
    titulo: (<>resposta<br /><span style={textoDegrade}>sem login</span></>),
    g: { rotulo: "RESPONDER A COBRANÇA", linhas: [], riscada: "EM MAIS UM SISTEMA", novo: "DIRETO NO E-MAIL", tamRiscada: 76, tamNovo: 104, risca: "sistema", vira: "direto" },
    V: T.VisualEmail,
    telas: [["semacesso", T.SemAcessoV], ["cortea5-email", T.EmailV], ["cortea5-botoes", T.BotoesV]],
  },
  {
    n: 6,
    titulo: (<>entrega<br /><span style={textoDegrade}>com aprovação</span></>),
    g: { rotulo: "NÃO BASTA", linhas: [], riscada: "DIZER QUE FEZ", novo: "PASSA POR APROVAÇÃO", tamRiscada: 104, tamNovo: 76, risca: "Dizer", vira: "aprovação" },
    V: T.VisualAprova,
    telas: [["cortea6-concluida", T.ConcluidaV], ["cortea6-aprovar", T.AprovarV], ["recusar", T.RecusarV], ["quem", T.QuemV]],
  },
  {
    n: 7,
    titulo: (<>onde está<br /><span style={textoDegrade}>travando</span></>),
    g: { rotulo: "ONDE ESTÃO TRAVANDO", linhas: ["OS COMBINADOS?"], riscada: "ACHISMO", novo: "O PAINEL MOSTRA", tam: 96, tamRiscada: 100, tamNovo: 104, risca: "achismo", vira: "painel" },
    V: T.VisualPainel,
    telas: [["numeros", T.NumerosV], ["porpessoa", T.PorPessoaV], ["painelgeral", T.PainelGeralV]],
  },
];

const VOZES = { ...vozesAcompanhamento, ...vozesCortes } as unknown as Vozes;
const pastaVoz = (id: string) => (id.startsWith("cortea") ? "voz/cortes-acompanhamento" : "voz/acompanhamento");
export const CORTES_ACOMP = DEFS.map((d) => {
  const gancho = `cortea${d.n}-gancho`;
  const ponte = d.ponte ?? "cortea-ponte";
  const roteiro = montarRoteiro(VOZES, [gancho, ponte, ...d.telas.map(([id]) => id), ["cortea-fim", d.fim ?? 30]]);
  const Gancho: TelaV = ({ c }) => <GanchoV c={c} g={d.g} V={d.V} />;
  const telas = { [gancho]: Gancho, [ponte]: T.PonteV, ...Object.fromEntries(d.telas), "cortea-fim": FimA };
  const Corte: React.FC = () => <MontagemVertical itens={roteiro.itens} duracao={roteiro.duracao} telas={telas} semCabecalho={[gancho, "cortea-fim"]} semLegenda={[gancho]} titulo={d.titulo} pastaVoz={pastaVoz} rotulo="AGENTIC OFFICE · ACOMPANHAMENTO" />;
  const Capa: React.FC = () => <CapaV g={d.g} V={d.V} />;
  const inicios = Object.fromEntries(roteiro.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));
  return { n: d.n, duracao: roteiro.duracao, Corte, Capa, inicios };
});
