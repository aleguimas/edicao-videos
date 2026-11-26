import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Cantos } from "../Cantos";
import { Cartao } from "../Cenas";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono, textoDegrade, TITULO } from "../fonte";
import "../fonte";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.16, 1, 0.3, 1);
const VERMELHO = "#FF4D6A";
const TINTA = "#1A1F3A";
const PAPEL = "#F4F2EC";

// ---------- Linha do tempo ----------
export const F = {
  cabecalho: 18,
  itens: [110, 230, 350, 470, 590, 710],
  total: 830,
  carimbo: 862,
  rasgo: 915,
  cabecalho2: 960,
  itens2: [992, 1020, 1048, 1076, 1104, 1132],
  total2: 1162,
  carimbo2: 1188,
  fechamento: 1235,
  fim: 1355,
} as const;

// ---------- Conteúdo ----------
const ITENS = [
  { nome: "IA CHAMADA A CADA CLIQUE", det: "1,2 mi req. sem cache", valor: 480, tag: "LINHA 1 · SEM CACHE", l1: "CHAMOU A IA", l2: "A CADA CLIQUE." },
  { nome: "AGENTE EM LOOP", det: "3 h rodando sem parar", valor: 612, tag: "LINHA 2 · SEM LIMITE", l1: "AGENTE EM LOOP", l2: "POR 3 HORAS." },
  { nome: "CHAVE DA API VAZADA", det: "uso por terceiros", valor: 890, tag: "LINHA 3 · CHAVE NO CÓDIGO", l1: "A CHAVE DA API", l2: "FOI PRO GITHUB." },
  { nome: "PROMPT GIGANTE", det: "40 mil tokens por chamada", valor: 214, tag: "LINHA 4 · CONTEXTO INTEIRO", l1: "MANDOU TUDO", l2: "EM TODA CHAMADA." },
  { nome: "MODELO MAIS CARO P/ TUDO", det: "até pra responder \"oi\"", valor: 144, tag: "LINHA 5 · MODELO ERRADO", l1: "MODELO TOP", l2: "PRA DIZER \"OI\"." },
  { nome: "BANCO SEM REGRA DE ACESSO", det: "dados de 312 clientes", valor: null, tag: "LINHA 6 · BANCO ABERTO", l1: "BANCO ABERTO", l2: "PRA QUALQUER UM." },
] as const;

const EVITAR = [
  "Cache nas respostas",
  "Limite de passos no agente",
  "Chave no .env, fora do código",
  "Só o contexto necessário",
  "Modelo certo pra cada tarefa",
  "Regra de acesso no banco",
];

const brl = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---------- Papel que sai da impressora ----------
const FENDA = 600; // y da saída da impressora
type Bloco = { altura: number; em: number; conteudo: React.ReactNode };

// comprimento de papel já impresso
const impresso = (f: number, blocos: Bloco[]) =>
  blocos.reduce((a, b) => a + b.altura * interpolate(f, [b.em, b.em + 14], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) }), 0);

const Papel: React.FC<{ readonly blocos: Bloco[]; readonly style?: React.CSSProperties; readonly extra?: (topo: (i: number) => number) => React.ReactNode }> = ({
  blocos,
  style,
  extra,
}) => {
  const f = useCurrentFrame();
  const L = impresso(f, blocos);
  const acumulado = blocos.map((_, i) => blocos.slice(0, i + 1).reduce((a, b) => a + b.altura, 0));
  const topo = (i: number) => L - acumulado[i]; // relativo à fenda
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: FENDA, height: 1920 - FENDA, overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", left: 120, right: 120, top: 0, height: L, backgroundColor: PAPEL, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}>
        {/* serrilha do começo do papel */}
        <svg width={840} height={18} style={{ position: "absolute", left: 0, bottom: -17 }} viewBox="0 0 840 18">
          <path d={`M0,0 ${Array.from({ length: 30 }, (_, i) => `L${i * 28 + 14},18 L${(i + 1) * 28},0`).join(" ")} Z`} fill={PAPEL} />
        </svg>
        {blocos.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: topo(i), height: b.altura, padding: "0 44px" }}>
            {b.conteudo}
          </div>
        ))}
        {extra ? extra(topo) : null}
      </div>
    </div>
  );
};

const Tracejado: React.FC = () => <div style={{ borderTop: `3px dashed ${TINTA}`, opacity: 0.35 }} />;

const Linha: React.FC<{ readonly nome: string; readonly det: string; readonly valor: React.ReactNode; readonly corValor?: string }> = ({ nome, det, valor, corValor = TINTA }) => (
  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `2px dotted rgba(26,31,58,0.25)`, fontFamily: fonteMono, color: TINTA }}>
    <div>
      <div style={{ fontSize: 30, fontWeight: 800 }}>{nome}</div>
      <div style={{ fontSize: 23, fontWeight: 500, opacity: 0.6, marginTop: 4 }}>{det}</div>
    </div>
    <div style={{ fontSize: 36, fontWeight: 800, color: corValor }}>{valor}</div>
  </div>
);

// valor que "imprime" contando
const Valor: React.FC<{ readonly v: number; readonly em: number }> = ({ v, em }) => {
  const f = useCurrentFrame();
  return <>{brl(Math.round(interpolate(f, [em + 4, em + 22], [0, v], { ...cl, easing: Easing.out(Easing.cubic) }) * 100) / 100)}</>;
};

const Carimbo: React.FC<{ readonly em: number; readonly texto: string; readonly cor: string; readonly topo: number }> = ({ em, texto, cor, topo }) => {
  const f = useCurrentFrame();
  if (f < em) return null;
  const p = interpolate(f, [em, em + 6], [0, 1], { ...cl, easing: Easing.in(Easing.quad) });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: topo,
        display: "flex",
        justifyContent: "center",
        opacity: p,
        scale: String(2.2 - 1.2 * p),
        rotate: "-9deg",
      }}
    >
      <div
        style={{
          border: `7px solid ${cor}`,
          borderRadius: 14,
          padding: "10px 26px",
          fontFamily: fonteMono,
          fontWeight: 800,
          fontSize: 50,
          letterSpacing: 4,
          color: cor,
          backgroundColor: "rgba(244,242,236,0.6)",
          whiteSpace: "nowrap",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// círculo vermelho "à mão" em volta da linha cobrada
const Marcacao: React.FC<{ readonly em: number; readonly topo: number }> = ({ em, topo }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [em, em + 16], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  if (p <= 0) return null;
  const comp = 2600;
  return (
    <svg width={860} height={150} viewBox="0 0 860 150" style={{ position: "absolute", left: -10, top: topo - 18, overflow: "visible" }}>
      <path
        d="M560,22 C700,8 850,30 845,76 C840,128 640,140 430,136 C220,132 20,126 16,78 C12,30 200,14 470,16 C560,17 640,22 700,30"
        fill="none"
        stroke={VERMELHO}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={comp}
        strokeDashoffset={comp * (1 - p)}
      />
    </svg>
  );
};

const Cabecalho: React.FC<{ readonly titulo: string; readonly sub: string }> = ({ titulo, sub }) => (
  <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8, fontFamily: fonteMono, color: TINTA }}>
    <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 2 }}>{titulo}</div>
    <div style={{ fontSize: 24, opacity: 0.65 }}>{sub}</div>
    <div style={{ width: "100%", marginTop: 18 }}>
      <Tracejado />
    </div>
  </div>
);

const BLOCOS_1: Bloco[] = [
  { altura: 200, em: F.cabecalho, conteudo: <Cabecalho titulo="FATURA DE API" sub="MEU SAAS · FEITO EM 4 MIN · NOV" /> },
  ...ITENS.map((it, i) => ({
    altura: 118,
    em: F.itens[i],
    conteudo: (
      <Linha
        nome={it.nome}
        det={it.det}
        valor={it.valor === null ? "???" : <Valor v={it.valor} em={F.itens[i]} />}
        corValor={it.valor === null ? VERMELHO : TINTA}
      />
    ),
  })),
  {
    altura: 190,
    em: F.total,
    conteudo: (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, fontFamily: fonteMono, color: TINTA }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 36, fontWeight: 800 }}>TOTAL</span>
          <span style={{ fontSize: 60, fontWeight: 800 }}>
            R$ <Valor v={2340} em={F.total} />
          </span>
        </div>
        <div style={{ textAlign: "right", fontSize: 26, fontWeight: 700, color: VERMELHO }}>+ ??? em dados de clientes</div>
      </div>
    ),
  },
];

const BLOCOS_2: Bloco[] = [
  { altura: 170, em: F.cabecalho2, conteudo: <Cabecalho titulo="QUANTO CUSTAVA EVITAR" sub="O MESMO SAAS · COM FUNDAMENTO" /> },
  ...EVITAR.map((t, i) => ({
    altura: 92,
    em: F.itens2[i],
    conteudo: (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px dotted rgba(26,31,58,0.25)", fontFamily: fonteMono, color: TINTA }}>
        <span style={{ fontSize: 28, fontWeight: 700 }}>
          <span style={{ color: "#6B4FD8" }}>✓</span> {t}
        </span>
        <span style={{ fontSize: 30, fontWeight: 800 }}>0,00</span>
      </div>
    ),
  })),
  {
    altura: 150,
    em: F.total2,
    conteudo: (
      <div style={{ height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fonteMono, color: TINTA }}>
        <span style={{ fontSize: 36, fontWeight: 800 }}>TOTAL</span>
        <span style={{ fontSize: 60, fontWeight: 800, color: "#6B4FD8" }}>R$ 0,00</span>
      </div>
    ),
  },
];

// ---------- Impressora ----------
export const Impressora: React.FC = () => {
  const f = useCurrentFrame();
  const parcial =
    ITENS.reduce((a, it, i) => a + (it.valor ?? 0) * interpolate(f, [F.itens[i] + 4, F.itens[i] + 22], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) }), 0);
  const segunda = f >= F.cabecalho2 - 10;
  const imprimindo = [F.cabecalho, ...F.itens, F.total, F.cabecalho2, ...F.itens2, F.total2].some((e) => f >= e && f < e + 16);
  const entra = interpolate(f, [0, 16], [0, 1], { ...cl, easing: suave });
  const visor = segunda ? "R$ 0,00" : `R$ ${brl(Math.round(parcial * 100) / 100)}`;
  const corVisor = segunda ? "#B4A3F7" : parcial > 0 ? VERMELHO : "#8DB0FF";
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: FENDA - 128, height: 140, opacity: entra, translate: `0px ${(1 - entra) * -60}px` }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          background: "linear-gradient(180deg, #232C66 0%, #121838 100%)",
          border: "2px solid rgba(143,169,230,0.45)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
        }}
      />
      {/* luz de imprimindo */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 38,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: imprimindo ? "#8DE0B5" : "#3A4473",
          boxShadow: imprimindo ? "0 0 18px #8DE0B5" : "none",
        }}
      />
      <div style={{ position: "absolute", left: 76, top: 34, fontFamily: fonteMono, fontSize: 24, letterSpacing: 4, color: AZUL_GUIMAS }}>FATURA AO VIVO</div>
      {/* visor */}
      <div
        style={{
          position: "absolute",
          right: 34,
          top: 22,
          padding: "8px 20px",
          borderRadius: 12,
          backgroundColor: "#070A1C",
          border: "1.5px solid rgba(143,169,230,0.3)",
          fontFamily: fonteMono,
          fontWeight: 800,
          fontSize: 40,
          color: corVisor,
          textShadow: `0 0 14px ${corVisor}`,
          minWidth: 300,
          textAlign: "right",
        }}
      >
        {visor}
      </div>
      {/* fenda */}
      <div style={{ position: "absolute", left: 90, right: 90, bottom: 8, height: 14, borderRadius: 7, backgroundColor: "#04060F" }} />
    </div>
  );
};

// ---------- Fundo ----------
export const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const tensao = interpolate(f, [F.itens[0], F.carimbo, F.rasgo, F.rasgo + 30], [0, 1, 1, 0], cl);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F24" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 15% 10%, rgba(63,88,184,0.45), transparent 55%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 90% 90%, rgba(91,75,196,0.40), transparent 55%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,40,80,0.40), transparent 65%)", opacity: tensao }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(4,6,18,0.7) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------- Cartões de cima ----------
const Cartoes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Cartao f={f} de={6} ate={F.itens[0] - 4} etiqueta="VIDA DE VIBE CODER" linha1="MEU APP FEITO COM IA" linha2="MANDOU A FATURA." tamanho={100} topo={130} />
      {ITENS.map((it, i) => (
        <Cartao
          key={it.tag}
          f={f}
          de={F.itens[i] + 8}
          ate={(i < 5 ? F.itens[i + 1] : F.total) - 2}
          etiqueta={it.tag}
          linha1={it.l1}
          linha2={it.l2}
          tamanho={104}
          topo={130}
          queda
        />
      ))}
      <Cartao f={f} de={F.total + 4} ate={F.rasgo} etiqueta="TOTAL DO MÊS" linha1="QUEM VAI PAGAR" linha2="ESSA CONTA?" tamanho={104} topo={130} queda />
      <Cartao f={f} de={F.cabecalho2 - 8} ate={F.total2} etiqueta="A OUTRA FATURA" linha1="QUANTO CUSTAVA" linha2="EVITAR?" tamanho={110} topo={130} />
      <Cartao f={f} de={F.total2 + 2} ate={F.fechamento} etiqueta="SEM PAGAR NADA" linha1="CADA ERRO TINHA" linha2="SOLUÇÃO DE GRAÇA." tamanho={100} topo={130} />
    </AbsoluteFill>
  );
};

// ---------- As duas faturas ----------
export const Faturas: React.FC = () => {
  const f = useCurrentFrame();
  // a primeira é arrancada e cai
  const r = interpolate(f, [F.rasgo, F.rasgo + 34], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const puxao = interpolate(f, [F.rasgo - 6, F.rasgo], [0, 1], cl);
  const tremor = f >= F.carimbo && f < F.carimbo + 12 ? Math.sin(f * 3.3) * (F.carimbo + 12 - f) * 1.2 : 0;
  return (
    <AbsoluteFill>
      {f < F.rasgo + 36 ? (
        <AbsoluteFill style={{ translate: `${tremor + r * 160}px ${puxao * 14 + r * 1400}px`, rotate: `${r * 14}deg`, opacity: 1 - r * 0.3 }}>
          <Papel
            blocos={BLOCOS_1}
            style={{ overflow: f >= F.rasgo ? "visible" : "hidden" }}
            extra={(topo) => (
              <>
                {ITENS.map((_, i) => (
                  <Marcacao key={i} em={F.itens[i] + 26} topo={topo(i + 1)} />
                ))}
                <Carimbo em={F.carimbo} texto="PAGO POR VOCÊ" cor={VERMELHO} topo={topo(4) + 60} />
              </>
            )}
          />
        </AbsoluteFill>
      ) : null}
      {f >= F.cabecalho2 - 2 ? (
        <Papel blocos={BLOCOS_2} extra={(topo) => <Carimbo em={F.carimbo2} texto="PAGO COM FUNDAMENTO" cor="#6B4FD8" topo={topo(4) + 50} />} />
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- Fechamento ----------
const Fechamento: React.FC = () => {
  const f = useCurrentFrame();
  if (f < F.fechamento - 6) return null;
  const fundo = interpolate(f, [F.fechamento - 6, F.fechamento + 10], [0, 0.9], cl);
  const e = interpolate(f, [F.fechamento + 4, F.fechamento + 16], [0, 1], { ...cl, easing: suave });
  const l2 = interpolate(f, [F.fechamento + 26, F.fechamento + 36], [0, 1], { ...cl, easing: suave });
  const bate = interpolate(f, [F.fechamento + 26, F.fechamento + 31, F.fechamento + 38], [0.6, 1.12, 1], cl);
  const assina = interpolate(f, [F.fechamento + 50, F.fechamento + 62], [0, 1], cl);
  const fim = interpolate(f, [F.fim - 12, F.fim], [0, 1], cl);
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(8,11,30,${fundo})` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: 1 - fim }}>
        <div
          style={{
            position: "relative",
            padding: "50px 60px 56px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            ...TITULO,
            textTransform: "uppercase",
            lineHeight: 1.0,
            letterSpacing: "-1px",
            textAlign: "center",
          }}
        >
          <Cantos margem={0} tamanho={[90, 70]} espessura={5} />
          <div style={{ width: 64 * e, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA, marginBottom: 26 }} />
          <div style={{ fontSize: 116, color: "#FFFFFF", opacity: e, translate: `0px ${(1 - e) * 30}px` }}>A IA NÃO</div>
          <div style={{ fontSize: 116, color: "#FFFFFF", opacity: e, translate: `0px ${(1 - e) * 30}px` }}>SAI CARO.</div>
          <div style={{ height: 30 }} />
          <div style={{ fontSize: 104, opacity: l2, scale: String(bate), ...textoDegrade }}>FALTA DE</div>
          <div style={{ fontSize: 104, opacity: l2, scale: String(bate), ...textoDegrade }}>FUNDAMENTO SAI.</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1330,
          width: "100%",
          textAlign: "center",
          fontFamily: fonteMono,
          fontWeight: 700,
          fontSize: 36,
          letterSpacing: 3,
          color: AZUL_GUIMAS,
          opacity: assina * (1 - fim),
        }}
      >
        @aleguimas
      </div>
    </AbsoluteFill>
  );
};

const Moldura: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const assinatura = interpolate(f, [F.fechamento - 10, F.fechamento], [0.7, 0], cl);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(f / durationInFrames) * 100}%`, backgroundImage: DEGRADE_BARRA }} />
      <div style={{ position: "absolute", bottom: 70, width: "100%", textAlign: "center", fontFamily: fonteMono, fontWeight: 600, fontSize: 26, letterSpacing: 2, color: AZUL_GUIMAS, opacity: assinatura }}>
        @aleguimas
      </div>
    </AbsoluteFill>
  );
};

const Som: React.FC<{ readonly arquivo: string; readonly em: number; readonly volume?: number }> = ({ arquivo, em, volume = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={em} premountFor={fps} name={arquivo}>
      <Audio src={staticFile(`audio/${arquivo}`)} volume={volume} />
    </Sequence>
  );
};

export const DURACAO_FATURA = F.fim;

export const FaturaAoVivo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // aproximação lenta da câmera, com um leve empurrão a cada linha
  const empurrao = F.itens.reduce((a, e) => a + interpolate(f - e, [0, 4, 20], [0, 0.02, 0], cl), 0);
  const zoom = interpolate(f, [0, F.rasgo, F.rasgo + 40, F.fechamento], [1, 1.05, 1, 1.04], cl) + empurrao;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F24" }}>
      <Fundo />
      <AbsoluteFill style={{ scale: String(zoom), transformOrigin: "50% 40%" }}>
        <Faturas />
        <Impressora />
      </AbsoluteFill>
      <Cartoes />
      <Fechamento />
      <Moldura />

      <Sequence from={0} durationInFrames={F.fim} premountFor={fps} name="trilha">
        <Audio
          src={staticFile("audio/trilha-fatura.wav")}
          volume={(q) =>
            interpolate(
              q,
              [0, 20, F.carimbo - 4, F.carimbo, F.rasgo + 4, F.rasgo + 30, F.fechamento, F.fim - 30, F.fim],
              [0, 0.55, 0.55, 0.18, 0.18, 0.55, 0.6, 0.6, 0],
              cl,
            )
          }
        />
      </Sequence>

      <Som arquivo="whoosh.wav" em={4} volume={0.5} />
      <Som arquivo="impressora.wav" em={F.cabecalho} volume={0.55} />
      <Som arquivo="impressora.wav" em={F.itens[0]} volume={0.55} />
      <Som arquivo="impressora.wav" em={F.itens[1]} volume={0.55} />
      <Som arquivo="impressora.wav" em={F.itens[2]} volume={0.55} />
      <Som arquivo="impressora.wav" em={F.itens[3]} volume={0.55} />
      <Som arquivo="impressora.wav" em={F.itens[4]} volume={0.55} />
      <Som arquivo="impressora.wav" em={F.itens[5]} volume={0.55} />
      <Som arquivo="ding.wav" em={F.itens[0] + 26} volume={0.35} />
      <Som arquivo="ding.wav" em={F.itens[1] + 26} volume={0.35} />
      <Som arquivo="ding.wav" em={F.itens[2] + 26} volume={0.35} />
      <Som arquivo="ding.wav" em={F.itens[3] + 26} volume={0.35} />
      <Som arquivo="ding.wav" em={F.itens[4] + 26} volume={0.35} />
      <Som arquivo="ding.wav" em={F.itens[5] + 26} volume={0.35} />
      <Som arquivo="impressora.wav" em={F.total} volume={0.55} />
      <Som arquivo="tiques.wav" em={F.total + 2} volume={0.35} />
      <Som arquivo="carimbo.wav" em={F.carimbo + 5} volume={0.9} />
      <Som arquivo="impacto.wav" em={F.carimbo + 5} volume={0.4} />
      <Som arquivo="rasgo.wav" em={F.rasgo - 6} volume={0.8} />
      <Som arquivo="queda.wav" em={F.rasgo + 4} volume={0.45} />
      <Som arquivo="impressora.wav" em={F.cabecalho2} volume={0.55} />
      <Som arquivo="pop.wav" em={F.itens2[0]} volume={0.5} />
      <Som arquivo="pop.wav" em={F.itens2[1]} volume={0.5} />
      <Som arquivo="pop.wav" em={F.itens2[2]} volume={0.5} />
      <Som arquivo="pop.wav" em={F.itens2[3]} volume={0.5} />
      <Som arquivo="pop.wav" em={F.itens2[4]} volume={0.5} />
      <Som arquivo="pop.wav" em={F.itens2[5]} volume={0.5} />
      <Som arquivo="impressora.wav" em={F.total2} volume={0.55} />
      <Som arquivo="carimbo.wav" em={F.carimbo2 + 5} volume={0.8} />
      <Som arquivo="sucesso.wav" em={F.carimbo2 + 6} volume={0.5} />
      <Som arquivo="whoosh.wav" em={F.fechamento - 6} volume={0.5} />
    </AbsoluteFill>
  );
};
