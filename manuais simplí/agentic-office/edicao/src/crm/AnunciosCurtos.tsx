import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { marca, type Vozes } from "../ana/voz";
import { MontagemVertical, type TelaV } from "../cortes/Vertical";
import { clampF, Conversa, type Msg } from "../cortes-crm/Telas";
import { CINZA, fontFamily, textoDegrade, TITULO, VERDE } from "../fonte";
import { Fundo, montarRoteiro, Surge } from "../verbas/Montagem";
import vozes from "../voz-anuncios-curtos-crm.json";

// Dois anúncios curtos do Simplí CRM, tirados do anúncio de 30 s:
// AnuncioVerticalCrm (9:16, ~18 s, Shorts e feed) e BumperCrm (16:9, 6 s, não pulável).
const V = vozes as unknown as Vozes;
const LOGO = "midia/logo-simpli-crm-escuro.png";
const URL_CRM = "simpli.ia.br/solucoes/simpli-crm";

// a mesma conversa nos dois: o cliente pergunta às 23h07 e a IA responde
const PERGUNTA: Msg[] = [
  { t: "cliente", a: "Marcos Oliveira", x: "Oi! Vi o porcelanato areia 60x60 no Instagram.", h: "23:06" },
  { t: "cliente", a: "Marcos Oliveira", x: "Qual o valor?", h: "23:07" },
];
const RESPOSTA = (de: number): Msg => ({ t: "enviada", a: "Ana · Agente de IA", x: "Oi, Marcos! O Porcelanato Acetinado Areia 60x60 sai por R$ 89,90 o m². Quantos metros quadrados você precisa?", h: "23:07", de });

const Selo: React.FC<{ children: React.ReactNode; vermelho?: boolean; tam?: number }> = ({ children, vermelho, tam = 64 }) => (
  <div style={{ boxSizing: "border-box", padding: "26px 30px", borderRadius: 18, textAlign: "center", ...TITULO, fontSize: tam, lineHeight: 1.05, ...(vermelho ? { background: "#141815", border: "3px solid #FF6B6B", color: "#FF8A80" } : { background: "#141815", border: "3px solid #3A3F3B", color: "white" }) }}>{children}</div>
);

const Botao: React.FC<{ de: number; tam?: number }> = ({ de, tam = 56 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - de, fps, config: { damping: 14, stiffness: 130 } });
  const pulso = frame > de + 24 ? 1 + 0.025 * Math.sin(((frame - de) / fps) * Math.PI * 2) : 1;
  if (frame < de) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", opacity: s }}>
      <div style={{ transform: `scale(${pulso * (0.9 + 0.1 * s)})`, background: VERDE, color: "#0B0B0C", borderRadius: 14, padding: "24px 58px", ...TITULO, fontSize: tam, boxShadow: "0 0 50px rgba(60,224,30,0.45)" }}>VEJA NA SUA EMPRESA</div>
    </div>
  );
};

// a conversa de celular, recortada da tela 9:16 (y 360 a 1480) e reduzida
const Chat: React.FC<{ msgs: Msg[]; x: number; y: number; k: number }> = ({ msgs, x, y, k }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 1080 * k, height: 1120 * k, borderRadius: 28, overflow: "hidden", boxShadow: "0 0 0 2px #3A3F3B, 0 30px 80px rgba(0,0,0,0.6)" }}>
    <div style={{ position: "absolute", left: 0, top: -360 * k, width: 1080, height: 1920, transform: `scale(${k})`, transformOrigin: "0 0" }}>
      <Conversa msgs={msgs} />
    </div>
  </div>
);

// ---------- vertical: no Shorts, o título, o botão e os ícones cobrem a base e a direita da tela,
// então marca no topo, conversa reduzida no meio e legenda a 65% da altura
const Y_LEG = 1270;
const ChatV: React.FC<{ msgs: Msg[] }> = ({ msgs }) => <Chat msgs={msgs} x={108} y={345} k={0.8} />;
const MarcaTopo: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 48, display: "flex", justifyContent: "center" }}>
    <Img src={staticFile(LOGO)} style={{ width: 400 }} />
  </div>
);
const Av1: TelaV = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <MarcaTopo />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", ...TITULO, fontSize: 170, lineHeight: 1, ...textoDegrade }}>23h07</div>
      <ChatV msgs={PERGUNTA} />
      <Surge de={m("resposta") - 4} ate={m("comprou") - 6} style={{ left: 160, right: 160, top: 900, zIndex: 20 }}>
        <Selo>SEM RESPOSTA</Selo>
      </Surge>
      <Surge de={m("comprou") - 4} style={{ left: 160, right: 160, top: 900, zIndex: 20 }}>
        <Selo vermelho tam={76}>VENDA PERDIDA</Selo>
      </Surge>
    </>
  );
};

const Av2: TelaV = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <MarcaTopo />
      <ChatV msgs={[...PERGUNTA, RESPOSTA(m("responde") - 2)]} />
      {["WhatsApp", "Instagram"].map((p, i) => (
        <Surge key={p} de={m(p) - 3} style={{ left: 150 + i * 400, top: 1052, zIndex: 20 }}>
          <div style={{ width: 380, boxSizing: "border-box", background: "#0B0B0C", border: `2px solid ${VERDE}`, borderRadius: 12, padding: "8px 0", textAlign: "center", ...TITULO, fontSize: 36, color: "white" }}>{p.toUpperCase()}</div>
        </Surge>
      ))}
    </>
  );
};

const Av3: TelaV = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile(LOGO)} style={{ width: 760 }} />
      </Surge>
      <Surge de={4} style={{ left: 40, right: 40, top: 570, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 96, lineHeight: 1.1, color: "white" }}>A IA ATENDE,</div>
        <div style={{ ...TITULO, fontSize: 96, lineHeight: 1.1, ...textoDegrade }}>VOCÊ VENDE.</div>
      </Surge>
      <div style={{ position: "absolute", left: 0, right: 0, top: 900 }}>
        <Botao de={m("Clique") - 4} />
      </div>
      <Surge de={m("Clique") + 6} style={{ left: 0, right: 0, top: 1060, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 52, color: "white" }}>{URL_CRM}</div>
      </Surge>
    </>
  );
};

const ROTEIRO_V = montarRoteiro(V, ["av-1", "av-2", ["av-3", 45]]);
export const DURACAO_ANUNCIO_V_CRM = ROTEIRO_V.duracao;
export const AnuncioVerticalCrm: React.FC = () => (
  <MontagemVertical
    itens={ROTEIRO_V.itens}
    duracao={ROTEIRO_V.duracao}
    telas={{ "av-1": Av1, "av-2": Av2, "av-3": Av3 }}
    semCabecalho={["av-1", "av-3"]}
    titulo={(<>responde<br /><span style={textoDegrade}>na hora</span></>)}
    rotulo="SIMPLÍ CRM · AGENTE DE IA"
    pastaVoz={() => "voz/anuncios-curtos-crm"}
    yLegenda={Y_LEG}
    semIcone
    abreDireto
  />
);

// ---------- bumper 16:9, 6 s: 0–2 s pergunta sem resposta, 2–4 s a IA responde, 4–6 s logo e frase
export const DURACAO_BUMPER_CRM = 178;
const F_IA = 60;
const F_LOGO = 120;


export const BumperCrm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = interpolate(frame, [F_LOGO - 6, F_LOGO + 4], [0, 1], clampF);
  const s = spring({ frame: frame - F_LOGO, fps, config: { damping: 15, stiffness: 140 } });
  const fala = (id: string, de: number) => (
    <Sequence from={de} layout="none">
      <Audio src={staticFile(`voz/anuncios-curtos-crm/${id}.mp3`)} />
    </Sequence>
  );
  return (
    <AbsoluteFill>
      <Fundo />
      <AbsoluteFill style={{ opacity: 1 - logo }}>
        <Chat msgs={[...PERGUNTA, RESPOSTA(F_IA)]} x={1000} y={70} k={0.84} />
        <Surge de={0} ate={F_IA - 4} style={{ left: 110, top: 300 }}>
          <div style={{ ...TITULO, fontSize: 210, lineHeight: 1, ...textoDegrade }}>23h07</div>
          <div style={{ marginTop: 40, width: 760 }}><Selo vermelho tam={62}>SEM RESPOSTA?</Selo></div>
        </Surge>
        <Surge de={F_IA} style={{ left: 100, top: 330 }}>
          <div style={{ ...TITULO, fontSize: 90, lineHeight: 1.05, color: "white" }}>A IA RESPONDE</div>
          <div style={{ ...TITULO, fontSize: 90, lineHeight: 1.05, ...textoDegrade }}>NA HORA</div>
          <div style={{ marginTop: 50 }}><Img src={staticFile(LOGO)} style={{ width: 420 }} /></div>
        </Surge>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: logo, alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", transform: `scale(${0.94 + 0.06 * s})` }}>
          <Img src={staticFile(LOGO)} style={{ width: 900 }} />
          <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.1, color: "white", marginTop: 50 }}>
            A IA ATENDE, <span style={textoDegrade}>VOCÊ VENDE.</span>
          </div>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 36, color: CINZA, marginTop: 34 }}>{URL_CRM}</div>
        </div>
      </AbsoluteFill>
      {fala("bp-1", 0)}
      {fala("bp-2", 55)}
      <Audio src={staticFile("trilha.mp3")} volume={(f) => 0.09 * interpolate(f, [0, 6, 168, 178], [0.6, 1, 1, 0], clampF)} />
    </AbsoluteFill>
  );
};
