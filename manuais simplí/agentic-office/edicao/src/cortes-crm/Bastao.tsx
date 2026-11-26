import type React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { marca, type Vozes } from "../ana/voz";
import { CapaV, GanchoV, type TextoG, type Visual } from "../cortes/Ganchos";
import { MontagemVertical, type TelaV } from "../cortes/Vertical";
import { CINZA, fontFamily, textoDegrade, TITULO, VERDE } from "../fonte";
import { montarRoteiro, Surge } from "../verbas/Montagem";
import vozes from "../voz-bastao-crm.json";
import { clampF, Conversa, L1, L2, type Msg, Pilha } from "./Telas";

// Corte 9:16 do Simplí CRM: a passagem de bastão da IA para o humano. Em toda transferência a IA
// deixa um resumo em nota privada para quem vai assumir. Dados fictícios da Loja Modelo.
const V = vozes as unknown as Vozes;
const ANA = "Ana · Agente de IA";
const MARCOS = "Marcos Oliveira";

const RESUMO = [
  "📋 Resumo da IA para quem vai assumir",
  "",
  "• Cliente recorrente: 2 compras, a última em 18/07.",
  "• Quer: Porcelanato Acetinado Areia 60x60 para o banheiro, 12 m².",
  "• Já informado: a IA confirmou o estoque e passou R$ 89,90 o m².",
  "• Motivo da transferência: o cliente pediu desconto para fechar hoje.",
  "• Próximo passo: oferecer a condição de pagamento e fechar o pedido.",
].join("\n");

const ANTES_MSGS: Msg[] = [
  { t: "enviada", a: ANA, x: "Temos sim! O Porcelanato Acetinado Areia 60x60 sai por R$ 89,90 o m², com estoque para entrega.", h: "14:30" },
  { t: "cliente", a: MARCOS, x: "Quero fechar hoje os 12 m². Consigo desconto?", h: "14:32" },
];
const transferencia = (de: number): Msg[] => [
  { t: "enviada", a: ANA, x: "Vou lhe transferir para o atendimento humano, só um momento...", h: "14:32", de },
  { t: "sistema", x: "Sistema de Automação adicionou aguardando_humano", de: de + 14 },
];

const Selo: React.FC<{ de: number; ate?: number; children: React.ReactNode; vermelho?: boolean; top?: number }> = ({ de, ate, children, vermelho, top = 1290 }) => (
  <Surge de={de} ate={ate} style={{ left: 90, right: 90, top, zIndex: 20 }}>
    <div style={{ boxSizing: "border-box", padding: "18px 24px", borderRadius: 16, textAlign: "center", ...TITULO, fontSize: 48, lineHeight: 1.08, ...(vermelho ? { background: "#141815", border: "3px solid #FF6B6B", color: "#FF8A80" } : { background: VERDE, color: "#0B0B0C", boxShadow: "0 0 40px rgba(60,224,30,0.35)" }) }}>{children}</div>
  </Surge>
);

// ---------- gancho
const G: TextoG = { rotulo: "DA IA PARA O SEU TIME", linhas: [], riscada: "LER A CONVERSA TODA", novo: "RESUMO PRONTO", tamRiscada: 76, tamNovo: 112, risca: "ler", vira: "inteira" };
const VisualBastao: Visual = ({ k }) => <Pilha k={k} antes={<><L1>47 mensagens</L1><L2>Para ler antes de responder</L2></>} depois={<><L1 c={VERDE}>Resumo em 5 linhas</L1><L2>Na nota privada, para quem assume</L2></>} />;
const Gancho: TelaV = ({ c }) => <GanchoV c={c} g={G} V={VisualBastao} />;

// ---------- dor: conversa genérica, sem marca, rolando sem fim
const Dor: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const rola = interpolate(frame, [0, c.dur], [0, 1500], clampF);
  const n = Math.round(interpolate(frame, [m("rola") - 6, m("rola") + 30], [3, 47], clampF));
  return (
    <>
      <div style={{ position: "absolute", left: 150, right: 150, top: 380, height: 1080, borderRadius: 36, overflow: "hidden", background: "#1A1F1B", border: "2px solid #2A2F2B" }}>
        <div style={{ transform: `translateY(${-rola}px)`, padding: "30px 34px" }}>
          {Array.from({ length: 40 }, (_, i) => {
            const cli = i % 3 !== 1;
            return (
              <div key={i} style={{ display: "flex", justifyContent: cli ? "flex-start" : "flex-end", marginBottom: 22 }}>
                <div style={{ width: [420, 560, 300, 500, 380][i % 5], height: [70, 110, 70, 150, 90][i % 5], borderRadius: 18, background: cli ? "#3A403B" : "#2D4A36" }} />
              </div>
            );
          })}
        </div>
      </div>
      <Surge de={m("rola") - 6} style={{ left: 0, right: 0, top: 560, textAlign: "center", zIndex: 20 }}>
        <div style={{ display: "inline-block", background: "#0B0B0C", border: "2px solid #3A3F3B", borderRadius: 20, padding: "20px 40px" }}>
          <div style={{ ...TITULO, fontSize: 150, lineHeight: 1, color: "white" }}>{n}</div>
          <div style={{ ...TITULO, fontSize: 52, color: CINZA }}>MENSAGENS</div>
        </div>
      </Surge>
      <Selo de={m("contexto") - 4} ate={m("rola") - 8} vermelho top={1000}>SEM CONTEXTO</Selo>
      <Selo de={m("pergunta") - 4} vermelho top={1000}>PERGUNTA DE NOVO</Selo>
    </>
  );
};

// ---------- ponte
const Ponte: TelaV = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("Simplí") - 6} style={{ left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}><Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 760 }} /></Surge>
      <Surge de={m("diferente") - 6} style={{ left: 0, right: 0, top: 800, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 96, lineHeight: 1.08, color: "white" }}>A PASSAGEM</div>
        <div style={{ ...TITULO, fontSize: 96, lineHeight: 1.08, ...textoDegrade }}>DE BASTÃO</div>
      </Surge>
    </>
  );
};

// ---------- telas do Simplí Chat
const Transfere: TelaV = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  const frame = useCurrentFrame();
  return (
    <>
      <Conversa composer rola={interpolate(frame, [m("transfere") - 6, m("transfere") + 10], [0, 40], clampF)} msgs={[...ANTES_MSGS.map((x, i) => (i === 1 ? { ...x, de: m("desconto") - 8 } : x)), ...transferencia(m("transfere") - 6)]} />
      <Selo de={m("pessoa") - 4}>A IA CHAMA UMA PESSOA</Selo>
    </>
  );
};

const PALAVRAS_RESUMO = ["comprou", "quer", "informado", "transferido", "passo"];
const ROLA_ITEM = [175, 205, 245, 285, 325];
const Resumo: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const marcas = PALAVRAS_RESUMO.map((p) => m(p) - 3);
  const atual = marcas.filter((f) => frame >= f).length - 1;
  const alvo = atual < 0 ? interpolate(frame, [m("nota") - 6, m("nota") + 14], [40, 120], clampF) : interpolate(frame, [marcas[atual], marcas[atual] + 10], [atual ? ROLA_ITEM[atual - 1] : 120, ROLA_ITEM[atual]], clampF);
  return (
    <>
      <Conversa composer rola={alvo} msgs={[...ANTES_MSGS, ...transferencia(-99), { t: "nota", a: ANA, x: RESUMO, h: "14:32", de: m("nota") - 4, acesos: atual >= 0 ? [atual] : [] }]} />
      <Selo de={m("toda") - 4} ate={m("comprou") - 10}>EM TODA TRANSFERÊNCIA</Selo>
    </>
  );
};

const Erp: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const privada = frame >= m("cliente") - 4;
  return (
    <>
      <Conversa composer rola={privada ? 110 : 175} msgs={[...ANTES_MSGS, ...transferencia(-99), { t: "nota", a: ANA, x: RESUMO, h: "14:32", acesos: privada ? [] : [0], cadeado: privada }]} />
      <Selo de={m("base") - 4} ate={m("cliente") - 8}>BASE DO CRM + ERP</Selo>
      <Selo de={m("cliente") - 4}>O CLIENTE NÃO VÊ A NOTA</Selo>
    </>
  );
};

const Assume: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const entra = m("continua") - 4;
  return (
    <>
      <Conversa
        composer
        atribuido={frame >= m("Rafael") ? "Rafael Lima" : undefined}
        rola={interpolate(frame, [entra - 4, entra + 12], [325, 420], clampF)}
        msgs={[
          ...ANTES_MSGS,
          ...transferencia(-99),
          { t: "nota", a: ANA, x: RESUMO, h: "14:32" },
          { t: "sistema", x: "Rafael Lima atribuiu a si mesmo essa conversa", de: m("Rafael") + 2 },
          { t: "enviada", a: "Rafael Lima", x: "Oi, Marcos! Aqui é o Rafael. Para os 12 m², consigo 5% de desconto no Pix. Posso fechar o pedido?", h: "14:33", de: entra },
        ]}
      />
      <Selo de={m("repetir") - 4}>SEM O CLIENTE REPETIR NADA</Selo>
    </>
  );
};

// ---------- fim: chamada genérica, vale para todos os canais (o "comenta AGENDA" fica só na copy)
const Fim: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const brilho = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}><Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 620 }} /></Surge>
      <Surge de={m("Agende") - 6} style={{ left: 40, right: 40, top: 560, textAlign: "center" }}>
        <div style={{ margin: "0 auto", width: "fit-content", background: VERDE, color: "#0B0B0C", borderRadius: 18, padding: "20px 54px", ...TITULO, fontSize: 104, lineHeight: 1.05, boxShadow: `0 0 ${40 + brilho * 30}px rgba(60,224,30,0.5)` }}>AGENDE<br />AGORA</div>
      </Surge>
      <Surge de={m("apresentação") - 6} style={{ left: 0, right: 0, top: 900, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 48, color: CINZA }}>uma apresentação do</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.15, ...textoDegrade }}>SIMPLÍ CRM</div>
      </Surge>
      <Surge de={m("conheça") - 2} style={{ left: 0, right: 0, top: 1130, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 44, color: "white" }}>simpli.ia.br/solucoes/simpli-crm</div>
      </Surge>
    </>
  );
};

const ROTEIRO = montarRoteiro(V, ["bas-gancho", "bas-dor", "bas-ponte", "bas-transfere", "bas-resumo", "bas-erp", "bas-assume", ["bas-fim", 12]]);
export const DURACAO_BASTAO_CRM = ROTEIRO.duracao;
export const CorteBastaoCrm: React.FC = () => (
  <MontagemVertical
    itens={ROTEIRO.itens}
    duracao={ROTEIRO.duracao}
    telas={{ "bas-gancho": Gancho, "bas-dor": Dor, "bas-ponte": Ponte, "bas-transfere": Transfere, "bas-resumo": Resumo, "bas-erp": Erp, "bas-assume": Assume, "bas-fim": Fim }}
    semCabecalho={["bas-gancho", "bas-ponte", "bas-fim"]}
    semLegenda={["bas-gancho"]}
    titulo={(<>a IA passa o bastão<br /><span style={textoDegrade}>com resumo</span></>)}
    rotulo="SIMPLÍ CRM · SIMPLÍ CHAT"
    pastaVoz={() => "voz/bastao-crm"}
  />
);
export const CapaBastaoCrm: React.FC = () => <CapaV g={G} V={VisualBastao} logo="midia/logo-simpli-crm-escuro.png" />;
