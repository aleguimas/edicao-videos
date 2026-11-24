import type React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ALTURA, Camera, caminho, Cursor, LARGURA, type Quadro, rota } from "../agentic/App";
import { TarjaAna } from "../ana/Ana";
import { type Cena, marca } from "../ana/voz";
import { Chip, Selo } from "../apresentacao/comum";
import { CINZA, fontFamily, textoDegrade, TITULO, VERDE } from "../fonte";
import { Etiqueta, FotoAna, Surge } from "../verbas/Montagem";
import { Moldura, TelaVendedor } from "./Celular";
import { LARGURA_CRM } from "./Kit";
import { TelaAgenteIA } from "./TelaAgente";
import { type Conversa, CONVERSAS_NOITE, type Mensagem, MENSAGENS_NOITE, TelaChat } from "./TelaChat";
import { TelaFaq } from "./TelaFaq";

type P = { readonly c: Cena };
export const BARRA = 44;
export const K = LARGURA / LARGURA_CRM;
// ponto da tela do CRM em coordenadas da janela (para câmera e cursor)
export const J = (x: number, y: number): [number, number] => [x * K, BARRA + y * K];
export const CENTRO: readonly [number, number, number] = [0.97, 820, 470];

// ---------- janela do navegador com o sistema dentro, no mesmo enquadramento dos outros vídeos
export const JanelaCrm: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", width: LARGURA, height: ALTURA, borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,0.55)", background: "#FFFFFF" }}>
    <div style={{ height: BARRA, background: "#E9ECEF", display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
      ))}
    </div>
    <div style={{ transform: `scale(${K})`, transformOrigin: "0 0" }}>{children}</div>
  </div>
);

export const CenaCrm: React.FC<{ readonly quadros: readonly Quadro[]; readonly fora?: React.ReactNode; readonly children: React.ReactNode }> = ({ quadros, fora, children }) => (
  <AbsoluteFill>
    <Camera quadros={quadros}>
      <JanelaCrm>{children}</JanelaCrm>
      {fora}
    </Camera>
  </AbsoluteFill>
);

// ---------- abertura-1: os dois clientes que a empresa perde sem perceber
const CartaoPerda: React.FC<{ readonly x: number; readonly de: number; readonly rotulo: string; readonly destaque: string; readonly children: React.ReactNode }> = ({ x, de, rotulo, destaque, children }) => (
  <Surge de={de} style={{ left: x, top: 270 }}>
    <div style={{ width: 760, height: 560, boxSizing: "border-box", padding: "46px 52px", borderRadius: 22, background: "#141815", border: "1px solid #2A2F2B" }}>
      <Etiqueta>{rotulo}</Etiqueta>
      <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.1, marginTop: 14, whiteSpace: "nowrap", ...textoDegrade }}>{destaque}</div>
      {children}
    </div>
  </Surge>
);
const LinhaPerda: React.FC<{ readonly de: number; readonly top: number; readonly x: number; readonly cor?: string; readonly children: React.ReactNode }> = ({ de, top, x, cor = "white", children }) => (
  <Surge de={de} style={{ left: x, top }}>
    <div style={{ ...TITULO, fontSize: 42, lineHeight: 1.12, color: cor, whiteSpace: "nowrap" }}>{children}</div>
  </Surge>
);
export const Abertura1: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("dois") - 4} style={{ left: 0, right: 0, top: 110, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 68, color: "white" }}>DOIS CLIENTES PERDIDOS SEM PERCEBER</div>
      </Surge>
      <CartaoPerda x={170} de={m("novo") - 4} rotulo="O CLIENTE NOVO" destaque="23h07">
        <div style={{ fontFamily, fontWeight: 600, fontSize: 34, color: CINZA, marginTop: 6 }}>pergunta o preço</div>
      </CartaoPerda>
      <LinhaPerda de={m("resposta") - 4} x={222} top={640}>Sem resposta</LinhaPerda>
      <LinhaPerda de={m("concorrente") - 4} x={222} top={712} cor="#FF8A80">Comprou no concorrente</LinhaPerda>
      <CartaoPerda x={990} de={m("antigo") - 4} rotulo="O CLIENTE ANTIGO" destaque="Já comprou">
        <div style={{ fontFamily, fontWeight: 600, fontSize: 34, color: CINZA, marginTop: 6 }}>com a sua empresa</div>
      </CartaoPerda>
      <LinhaPerda de={m("chamar") - 4} x={1042} top={640}>Volta a chamar</LinhaPerda>
      <LinhaPerda de={m("desconhecido") - 6} x={1042} top={712} cor="#FF8A80">Atendido como desconhecido</LinhaPerda>
    </>
  );
};

// ---------- abertura-2: cada informação em um lugar
const LUGARES = [
  ["WhatsApp", "WHATSAPP", "em um lugar"],
  ["funil", "FUNIL", "em outro"],
  ["ERP", "ERP", "as vendas"],
  ["planilha", "PLANILHA", "o relatório"],
] as const;
export const Abertura2: React.FC<P> = ({ c }) => (
  <>
    {LUGARES.map(([p, t, n], i) => (
      <Surge key={p} de={marca(c.fala, p) - 4} style={{ left: 170 + (i % 2) * 830, top: 170 + Math.floor(i / 2) * 340 }}>
        <div style={{ width: 750, height: 290, boxSizing: "border-box", padding: "60px 56px", borderRadius: 22, background: "#141815", border: "1px solid #2A2F2B", transform: `rotate(${[-1.5, 1.2, 1, -1][i]}deg)` }}>
          <div style={{ ...TITULO, fontSize: 84, color: "white" }}>{t}</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 34, color: CINZA, marginTop: 8 }}>{n}</div>
        </div>
      </Surge>
    ))}
  </>
);

// ---------- abertura-3: tudo em uma plataforma só
export const Abertura3: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("Simplí") - 6} style={{ left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 860 }} />
      </Surge>
      <Surge de={m("plataforma") - 4} style={{ left: 0, right: 0, top: 470, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 72, color: "white" }}>
          tudo em <span style={textoDegrade}>uma plataforma só</span>
        </div>
      </Surge>
      <Surge de={m("primeira") - 4} style={{ left: 0, right: 0, top: 620, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 40, color: CINZA }}>da primeira mensagem até a recompra</div>
      </Surge>
    </>
  );
};

// ---------- quem-1: a Ana se apresenta
export const Quem1: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <FotoAna arquivo="ana-verde.jpg" x={120} dur={c.dur} />
      <Sequence from={m("Ana") - 4} layout="none">
        <TarjaAna x={940} y={170} />
      </Sequence>
      <Surge de={m("Se") - 4} style={{ left: 940, top: 400 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 36, color: CINZA, marginBottom: 14 }}>Este vídeo é para quem</div>
        <div style={{ ...TITULO, fontSize: 64, lineHeight: 1.12, color: "white" }}>vende pelo WhatsApp</div>
      </Surge>
      <Surge de={m("time") - 4} style={{ left: 940, top: 560 }}>
        <div style={{ ...TITULO, fontSize: 64, lineHeight: 1.12, color: "white" }}>tem um time atendendo</div>
      </Surge>
      <Surge de={m("quer") - 4} style={{ left: 940, top: 650 }}>
        <div style={{ ...TITULO, fontSize: 64, lineHeight: 1.12, ...textoDegrade }}>e quer ver o caminho</div>
        <div style={{ ...TITULO, fontSize: 64, lineHeight: 1.12, ...textoDegrade }}>até o faturamento</div>
      </Surge>
    </>
  );
};

const AUDIO: Mensagem = { tipo: "clienteAudio", autor: "Marcos Oliveira", duracao: "0:06", hora: "02/07, 23:07", progresso: 0 };

// ---------- cap2-1: o áudio chega com a loja fechada
export const Cap21: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  const chega = m("áudio") - 4;
  const lista: Conversa[] = CONVERSAS_NOITE.map((x, i) => (i === 0 ? { ...x, tempo: "agora" } : x));
  const q = rota(CENTRO, [[m("áudio"), 1.75, ...J(740, 200)]], c.dur);
  return (
    <CenaCrm quadros={q}>
      <TelaChat conversas={lista} telefone="+5581900001234" topo mensagens={[{ ...AUDIO, de: chega }]} />
    </CenaCrm>
  );
};

// ---------- cap2-1b: a voz do próprio Marcos, tocando no player da conversa
export const Cap21b: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const toca = interpolate(frame, [8, c.dur - 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lista: Conversa[] = CONVERSAS_NOITE.map((x, i) => (i === 0 ? { ...x, tempo: "agora" } : x));
  const alvo = J(740, 200);
  return (
    <CenaCrm quadros={[[0, 1.75, ...alvo], [c.dur, 1.75, ...alvo]]}>
      <TelaChat conversas={lista} telefone="+5581900001234" topo mensagens={[{ ...AUDIO, progresso: toca }]} />
    </CenaCrm>
  );
};

// ---------- cap2-2: o agente responde; não é chatbot de menu
const FORMATOS = ["texto", "áudio", "PDF"];
export const Cap22: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const resposta = MENSAGENS_NOITE[1];
  const q = rota(
    CENTRO,
    [
      [m("Agente"), 1.3, ...J(905, 300)],
      [m("consulta"), 1.45, ...J(980, 320)],
    ],
    c.dur,
  );
  const chatbot = frame >= m("chatbot") - 4 && frame < m("consulta") - 6;
  return (
    <>
      <CenaCrm quadros={q}>
        <TelaChat conversas={CONVERSAS_NOITE} telefone="+5581900001234" topo mensagens={[{ ...AUDIO, progresso: 1 }, { ...resposta, de: m("responde") }]} />
      </CenaCrm>
      {FORMATOS.map((f, i) => (
        <Surge key={f} de={m(f) - 3} ate={m("chatbot") - 10} style={{ left: 560 + i * 170, top: 730 }}>
          <Chip cheio cor={VERDE} style={{ fontSize: 26, padding: "8px 18px" }}>
            {f.toUpperCase()}
          </Chip>
        </Surge>
      ))}
      {chatbot ? (
        <Surge de={m("chatbot") - 4} ate={m("consulta") - 14} style={{ left: 620, top: 240 }}>
          <div style={{ width: 680, boxSizing: "border-box", padding: "34px 44px", borderRadius: 20, background: "#141815", border: "2px solid #FF6B6B" }}>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 28, color: CINZA, marginBottom: 12 }}>Chatbot de menu</div>
            {["1. Falar com vendas", "2. Ver produtos", "3. Outros assuntos"].map((t) => (
              <div key={t} style={{ ...TITULO, fontSize: 38, color: "white", textDecoration: frame > m("obriga") ? "line-through" : "none", textDecorationColor: "#FF6B6B", lineHeight: 1.35 }}>
                {t}
              </div>
            ))}
          </div>
        </Surge>
      ) : null}
    </>
  );
};

// ---------- cap2-3: FAQ com PDF e, depois, a busca de produtos pelas palavras do cliente
const BUSCA: Mensagem[] = [
  { tipo: "cliente", autor: "Marcos Oliveira", texto: "Queria um piso clarinho que não escorregue, para o box", hora: "02/07, 23:09" },
  { tipo: "enviada", autor: "Bot_lojamodelo", hora: "02/07, 23:09", texto: "Para o box, o mais indicado é um antiderrapante. Achei estes dois:\n\n• Porcelanato Externo Areia Antiderrapante 60x60: R$ 94,90 o m²\n• Piso Cerâmico Off White Antiderrapante 45x45: R$ 49,90 o m²" },
];
export const Cap23: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const troca = m("busca") - 6;
  const pdf: [number, number] = J(1016, 417);
  if (frame < troca) {
    return (
      <CenaCrm quadros={rota(CENTRO, [[m("PDFs"), 1.4, pdf[0] - 180, pdf[1]]], troca)}>
        <TelaFaq />
      </CenaCrm>
    );
  }
  const alvo = J(905, 200);
  return (
    <>
      <CenaCrm quadros={[[0, 1.3, ...alvo], [c.dur, 1.3, ...alvo]]}>
        <TelaChat conversas={CONVERSAS_NOITE} telefone="+5581900001234" topo mensagens={[{ ...BUSCA[0], de: troca + 4 }, { ...BUSCA[1], de: m("localiza") - 4 }]} />
      </CenaCrm>
      <Selo de={m("semântica") - 4} texto="BUSCA SEMÂNTICA" x={960} y={120} />
    </>
  );
};

// ---------- cap2-4: configuração do gestor, fora da conversa do Marcos: horário e chave por canal
export const Cap24: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const modo = frame >= m("comercial") - 3 ? "Horário comercial" : frame >= m("fora") - 3 ? "Fora do horário" : "Full-time";
  const chave = J(1502, 502);
  const clique = m("liga");
  const liga = interpolate(frame, [clique, clique + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const q = rota(
    CENTRO,
    [
      [m("vinte"), 1.45, ...J(760, 430)],
      [clique, 1.45, chave[0] - 535, chave[1] - 60],
    ],
    c.dur,
  );
  return (
    <>
      <CenaCrm
        quadros={q}
        fora={
          <Cursor
            pontos={caminho([900, 620], [
              [m("vinte"), ...J(519, 437)],
              [m("fora"), ...J(620, 437)],
              [m("comercial"), ...J(408, 437)],
              [clique, ...chave],
            ])}
            cliques={[m("fora"), m("comercial"), clique]}
          />
        }
      >
        <TelaAgenteIA modo={modo} instagramLigada={liga} />
      </CenaCrm>
      <div style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [m("vinte") - 14, m("vinte") - 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <Selo de={m("módulo") - 4} texto="AGENTE DE IA" x={960} y={120} />
      </div>
    </>
  );
};

// ---------- cap2-5: de volta ao Marcos, o agente transfere para o time e a IA sai da conversa
export const Cap25: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const atende = m("atendente");
  const pedido: Mensagem[] = [
    { tipo: "cliente", autor: "Marcos Oliveira", texto: "Quero fechar. Consigo desconto?", hora: "03/07, 08:12" },
    { tipo: "enviada", autor: "Bot_lojamodelo", texto: "Vou lhe transferir para o atendimento humano, só um momento...", hora: "03/07, 08:12", de: m("transfere") - 6 },
    { tipo: "sistema", texto: "Sistema de Automação removeu bot_atendendo", de: m("transfere") + 6 },
    { tipo: "sistema", texto: "Sistema de Automação adicionou aguardando_humano", de: m("transfere") + 12 },
    { tipo: "enviada", autor: "Rafael Lima", texto: "Bom dia, Marcos! Aqui é o Rafael. Vou ver a melhor condição para você.", hora: "03/07, 08:15", de: atende },
    { tipo: "sistema", texto: "Rafael Lima atribuiu a si mesmo essa conversa", de: atende + 6 },
    { tipo: "sistema", texto: "Sistema de Automação adicionou humano_atendendo", de: atende + 12 },
  ];
  const tag = frame >= atende + 12 ? "humano_atendendo" : frame >= m("transfere") + 12 ? "aguardando_humano" : "bot_atendendo";
  const lista: Conversa[] = CONVERSAS_NOITE.map((x, i) => (i === 0 ? { ...x, tag, previa: "Quero fechar. Consigo desconto?", dono: frame >= atende ? "Rafael Lima" : undefined } : x));
  return (
    <CenaCrm quadros={rota(CENTRO, [[m("transfere"), 1.12, ...J(800, 330)]], c.dur)}>
      <TelaChat conversas={lista} telefone="+5581900001234" topo atribuido={frame >= atende ? "Rafael Lima" : undefined} mensagens={pedido} />
    </CenaCrm>
  );
};

// ---------- cap2-7: a virada, o agente é a própria Ana
export const Cap27: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <FotoAna arquivo="ana-verde.jpg" x={120} dur={c.dur} />
      <Surge de={m("primeiro") - 4} style={{ left: 940, top: 300 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 36, color: CINZA, marginBottom: 12 }}>O primeiro atendimento da Simplí</div>
      </Surge>
      <Surge de={m("Essa") - 4} style={{ left: 940, top: 370 }}>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.05, color: "white" }}>ESSA AGENTE</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.1, ...textoDegrade }}>SOU EU</div>
      </Surge>
    </>
  );
};

// celular em primeiro plano, à esquerda, e o texto ao lado (a Ana fica no canto direito)
export const CenaCelular: React.FC<{ readonly children: React.ReactNode; readonly tela: React.ReactNode }> = ({ children, tela }) => (
  <>
    <Moldura escala={0.9} estilo={{ left: 330, top: 94 }}>
      {tela}
    </Moldura>
    {children}
  </>
);

// ---------- cap7-2: o App do Vendedor de Loja
export const Cap72: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <CenaCelular tela={<TelaVendedor />}>
      <Surge de={m("App") - 6} style={{ left: 880, top: 280 }}>
        <Etiqueta>NOVIDADE</Etiqueta>
        <div style={{ ...TITULO, fontSize: 86, lineHeight: 1.05, color: "white", marginTop: 14 }}>APP DO VENDEDOR</div>
        <div style={{ ...TITULO, fontSize: 86, lineHeight: 1.1, ...textoDegrade }}>DE LOJA</div>
      </Surge>
      <Surge de={m("instala") - 4} style={{ left: 880, top: 540 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 38, color: CINZA }}>instala no celular como aplicativo</div>
      </Surge>
    </CenaCelular>
  );
};

// ---------- cap7-4: o Marcos na lista, compras, mensagem e contato feito
const PASSOS = [
  ["toque", "Abre o WhatsApp"],
  ["comprou", "Vê o que ele já comprou"],
  ["copia", "Copia a mensagem sugerida"],
  ["marca", "Marca o contato"],
] as const;
export const Cap74: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  return (
    <CenaCelular tela={<TelaVendedor comprasDe={m("comprou") - 14} comprasAte={m("copia") - 8} copiado={frame >= m("copia")} feito={frame >= m("marca")} abordagens={frame >= m("marca") ? 1 : 0} />}>
      {PASSOS.map(([p, t], i) => (
        <Surge key={p} de={m(p) - 4} style={{ left: 880, top: 240 + i * 118 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 66, height: 66, borderRadius: 33, background: VERDE, color: "#0B0B0C", ...TITULO, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ ...TITULO, fontSize: 46, color: "white" }}>{t}</div>
          </div>
        </Surge>
      ))}
    </CenaCelular>
  );
};
