import type React from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { rota } from "../agentic/App";
import { type Cena, marca, type Vozes } from "../ana/voz";
import { CINZA, fontFamily, textoDegrade, TITULO, VERDE } from "../fonte";
import { Montagem, montarRoteiro, Surge } from "../verbas/Montagem";
import vozes from "../voz-anuncio-crm.json";
import { CenaCrm, CENTRO } from "./Cenas";
import { Foco, Tarja, Troca } from "./Cenas2";
import { CONVERSAS_NOITE, MENSAGENS_NOITE, TelaChat } from "./TelaChat";
import { MARCOS, TelaKanban } from "./TelasEntrada";
import { TelaCrmClientes, TelaTarefas } from "./TelasVenda";

// Anúncio pulável do YouTube: gancho e marca antes de 5 s, solução em quatro telas e chamada final.
type P = { readonly c: Cena };

const An1: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={0} style={{ left: 90, top: 66 }}>
        <Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 340 }} />
      </Surge>
      <Surge de={2} style={{ left: 0, right: 0, top: 215, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 230, lineHeight: 1, ...textoDegrade }}>23h07</div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 48, color: CINZA, marginTop: 12 }}>mensagem no WhatsApp ou no Instagram</div>
      </Surge>
      <Surge de={m("resposta") - 4} style={{ left: 250, top: 620 }}>
        <div style={{ width: 660, boxSizing: "border-box", padding: "38px 30px", borderRadius: 18, background: "#141815", border: "1px solid #2A2F2B", textAlign: "center", ...TITULO, fontSize: 60, color: "white" }}>SEM RESPOSTA</div>
      </Surge>
      <Surge de={m("concorrente") - 6} style={{ left: 1010, top: 620 }}>
        <div style={{ width: 660, boxSizing: "border-box", padding: "38px 30px", borderRadius: 18, background: "#141815", border: "2px solid #FF6B6B", textAlign: "center", ...TITULO, fontSize: 60, color: "#FF8A80" }}>VENDA PERDIDA</div>
      </Surge>
    </>
  );
};

const An2: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const card = m("conversa") - 6;
  const tarefa = m("orçamento") - 6;
  const vendas = m("vendas") - 6;
  return (
    <Troca cortes={[card, tarefa, vendas]}>
      {[
        <AbsoluteFill key="a">
          <CenaCrm quadros={rota(CENTRO, [Foco(4, 1.14, 860, 330)], card)}>
            <TelaChat conversas={CONVERSAS_NOITE} telefone="+5581900001234" topo mensagens={[MENSAGENS_NOITE[0], { ...MENSAGENS_NOITE[1], de: m("agente") - 2 }]} />
          </CenaCrm>
          <Tarja de={m("agente") - 4} x={1130} y={840}>O AGENTE DE IA ATENDE NA HORA</Tarja>
        </AbsoluteFill>,
        <AbsoluteFill key="b">
          <CenaCrm quadros={rota(CENTRO, [Foco(card + 8, 1.28, 640, 430)], tarefa)}>
            <TelaKanban marcos={{ ...MARCOS, aceso: true }} entra={card + 8} />
          </CenaCrm>
          <Tarja de={card + 6}>A CONVERSA VIRA CARD NO FUNIL</Tarja>
        </AbsoluteFill>,
        <AbsoluteFill key="c">
          <CenaCrm quadros={rota(CENTRO, [Foco(tarefa + 8, 1.3, 600, 560)], vendas)}>
            <TelaTarefas acao />
          </CenaCrm>
          <Tarja de={tarefa + 6} x={1180}>ORÇAMENTO PARADO VIRA TAREFA</Tarja>
        </AbsoluteFill>,
        <AbsoluteFill key="d">
          <CenaCrm quadros={rota(CENTRO, [Foco(vendas + 8, 1.2, 800, 240)], c.dur)}>
            <TelaCrmClientes />
          </CenaCrm>
          <Tarja de={vendas + 6}>AS VENDAS DO ERP MOSTRAM O RESULTADO</Tarja>
        </AbsoluteFill>,
      ]}
    </Troca>
  );
};

const Botao: React.FC<{ readonly de: number }> = ({ de }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulso = frame > de + 30 ? 1 + 0.025 * Math.sin(((frame - de) / fps) * Math.PI * 2) : 1;
  const s = spring({ frame: frame - de, fps, config: { damping: 14, stiffness: 130 } });
  if (frame < de) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: s }}>
      <div style={{ transform: `scale(${pulso * (0.9 + 0.1 * s)})`, background: VERDE, color: "#0B0B0C", borderRadius: 14, padding: "24px 58px", ...TITULO, fontSize: 56, boxShadow: "0 0 50px rgba(60,224,30,0.45)" }}>VEJA NA SUA EMPRESA</div>
    </div>
  );
};

const An3: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={2} style={{ left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 760 }} />
      </Surge>
      <Surge de={m("plataforma") - 8} style={{ left: 0, right: 0, top: 350, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 78, color: "white" }}>
          TUDO EM <span style={textoDegrade}>UMA PLATAFORMA SÓ</span>
        </div>
      </Surge>
      <Surge de={m("plataforma") - 2} style={{ left: 0, right: 0, top: 480, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/meta-tech-provider-fundo-escuro.webp")} style={{ height: 110 }} />
      </Surge>
      <Botao de={m("Clique") - 4} />
      <Surge de={m("Clique") + 6} style={{ left: 0, right: 0, top: 800, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 38, color: CINZA }}>simpli.ia.br/solucoes/simpli-crm</div>
      </Surge>
    </>
  );
};

const ROTEIRO = montarRoteiro(vozes as unknown as Vozes, ["an-1", "an-2", ["an-3", 96]]);
export const DURACAO_ANUNCIO_CRM = ROTEIRO.duracao;
export const AnuncioCrm: React.FC = () => <Montagem itens={ROTEIRO.itens} duracao={ROTEIRO.duracao} telas={{ "an-1": An1, "an-2": An2, "an-3": An3 }} pastaVoz="voz/anuncio-crm" semPip={{ "an-1": [0, 0] }} />;
