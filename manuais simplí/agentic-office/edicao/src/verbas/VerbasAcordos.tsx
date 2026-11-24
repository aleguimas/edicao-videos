import type React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { TarjaAna } from "../ana/Ana";
import { type Cena, marca, type Vozes } from "../ana/voz";
import { Camera, Cursor, type Quadro } from "../agentic/App";
import { CINZA, FUNDO, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import vozes from "../voz-verbas.json";
import { ACORDOS } from "./dados";
import { Janela } from "./JanelaVerbas";
import { Etiqueta, FotoAna, Montagem, montarRoteiro, Surge } from "./Montagem";
import { AREA, Aviso, BarraAcordos, BOTAO_NOVO, CAMPO, CARTAO_ACORDO, CARTAO_PAINEL, Cabecalho, CartaoAcordo, type ColunaAcordo, COLUNA_X, ModalNovoAcordo, ROLA_FORM, TelaPainel } from "./Telas";

// Piloto do vídeo de demonstração (16:9) do módulo Verbas e Acordos do Agentic Office, apresentado
// pela Ana, a Assistente de IA da Simplí. Telas recriadas com dados fictícios; cada movimento de
// câmera, clique e campo preenchido acontece na palavra em que a Ana fala dele.
const ROTEIRO = montarRoteiro(vozes as unknown as Vozes, ["abertura", "gancho", "conceito", "painel", "novo", "situacao", ["fim", 75]]);
export const DURACAO_VERBAS = ROTEIRO.duracao;

// ---------- 1. Abertura: a Ana se apresenta
export const Abertura: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <FotoAna arquivo="ana-verde.jpg" x={120} dur={c.dur} />
      <Surge de={m("Oi") - 4} ate={m("Ana") - 6} style={{ left: 940, top: 300 }}>
        <div style={{ ...TITULO, fontSize: 150, ...textoDegrade }}>Oi!</div>
      </Surge>
      <Sequence from={m("Ana") - 4} layout="none">
        <TarjaAna x={940} y={250} />
      </Sequence>
      <Surge de={m("Verbas") - 4} style={{ left: 940, top: 470 }}>
        <div style={{ ...TITULO, fontSize: 104, lineHeight: 1, color: "white" }}>VERBAS E</div>
        <div style={{ ...TITULO, fontSize: 104, lineHeight: 1.05, ...textoDegrade }}>ACORDOS</div>
      </Surge>
      <Surge de={m("módulo") - 4} style={{ left: 940, top: 730 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 30, color: CINZA, marginBottom: 6 }}>um módulo do</div>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 460, marginLeft: -26 }} />
      </Surge>
    </>
  );
};

// ---------- 2. Gancho: a planilha de verbas
const CELULAS = [
  ["Fornecedor", "Verba", "Prometido", "Chegou?", "Obs."],
  ["Tintas Horiz.", "Cota aniv.", "6.500", "???", "cobrar"],
  ["Metais Prisma", "Bonif.", "12.000", "NF?", "ver c/ fin."],
  ["Louças Serena", "Rapel 3%", "~9.850", "", "confirmar"],
  ["Pisos Atlânt.", "Cota BF", "10.000", "5.700", "falta 1"],
  ["Cer. Aurora", "Fim de ano", "24.000", "?", "e-mail??"],
  ["???", "Desc. boleto", "1.200", "", ""],
];
export const Gancho: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const virada = m("ninguém", 1) - 4;
  const borra = interpolate(frame, [virada, virada + 10], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const treme = frame > m("desconto") && frame < virada ? Math.sin(frame * 1.7) * 3 : 0;
  const notas: [string, string, number, number, number][] = [
    ["Verba prometida", "Verba", 300, 230, -6],
    ["Nota que chega", "nota", 1180, 300, 5],
    ["Desconto no boleto", "desconto", 640, 720, -3],
  ];
  return (
    <>
      <Surge de={m("planilha") - 6} style={{ left: 260, top: 170 }}>
        <div style={{ filter: `blur(${borra}px)`, opacity: 1 - borra / 14, transform: `perspective(1600px) rotateX(14deg) rotateZ(-2deg) translateX(${treme}px)` }}>
          <div style={{ display: "grid", gridTemplateColumns: "260px 220px 200px 180px 200px", background: "#E9ECEA", border: "2px solid #9AA19C", fontFamily: "Arial, sans-serif", fontSize: 26 }}>
            {CELULAS.flatMap((linha, i) =>
              linha.map((v, j) => (
                <div
                  key={`${i}-${j}`}
                  style={{
                    height: 76,
                    borderRight: "1px solid #B8BDB9",
                    borderBottom: "1px solid #B8BDB9",
                    padding: "0 14px",
                    display: "flex",
                    alignItems: "center",
                    color: v.includes("?") ? "#C62828" : "#1B1E1C",
                    fontWeight: i === 0 || v.includes("?") ? 700 : 400,
                    background: i === 0 ? "#C9D3CC" : v.includes("?") ? "#FFE3E0" : (i + j) % 7 === 3 ? "#FFF6C9" : "white",
                  }}
                >
                  {v}
                </div>
              )),
            )}
          </div>
        </div>
      </Surge>
      {notas.map(([t, p, x, y, r]) => (
        <Surge key={t} de={m(p) - 3} ate={virada} style={{ left: x, top: y }}>
          <div style={{ transform: `rotate(${r}deg)`, background: "#FFD84D", color: "#1B1E1C", fontFamily, fontWeight: 800, fontSize: 40, padding: "18px 28px", borderRadius: 6, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>{t}</div>
        </Surge>
      ))}
      <Surge de={virada} style={{ left: 0, right: 0, top: 330, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 92, color: "white", lineHeight: 1.05 }}>NO FIM DO MÊS,</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.15, ...textoDegrade }}>NINGUÉM SABE O SALDO</div>
      </Surge>
    </>
  );
};

// ---------- 3. Conceito: acordo → recebimento → saldo
const No: React.FC<{ readonly rotulo: string; readonly titulo: string; readonly linha: string; readonly valor: string; readonly destaque?: boolean }> = ({ rotulo, titulo, linha, valor, destaque }) => (
  <div style={{ width: 460, height: 300, boxSizing: "border-box", borderRadius: 20, padding: "34px 36px", background: "#141815", border: `2px solid ${destaque ? VERDE : "#2A2F2B"}`, boxShadow: destaque ? "0 0 60px rgba(60,224,30,0.25)" : "none" }}>
    <Etiqueta>{rotulo}</Etiqueta>
    <div style={{ ...TITULO, fontSize: 52, color: "white", marginTop: 14 }}>{titulo}</div>
    <div style={{ fontFamily, fontWeight: 600, fontSize: 26, color: CINZA, marginTop: 10 }}>{linha}</div>
    <div style={{ fontFamily, fontWeight: 800, fontSize: 42, color: destaque ? VERDE : "white", marginTop: 4, whiteSpace: "nowrap" }}>{valor}</div>
  </div>
);
const Seta: React.FC<{ readonly de: number; readonly x: number }> = ({ de, x }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [de, de + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg style={{ position: "absolute", left: x, top: 500 }} width={110} height={40} viewBox="0 0 110 40">
      <line x1={6} y1={20} x2={6 + 86 * k} y2={20} stroke={VERDE} strokeWidth={5} strokeLinecap="round" />
      {k > 0.95 && <path d="M88 8 L104 20 L88 32" fill="none" stroke={VERDE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};
export const Conceito: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const conta = m("calcula");
  const saldo = interpolate(frame, [conta, conta + 30], [24000, 10000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Surge de={m("simples") - 8} style={{ left: 0, right: 0, top: 150, textAlign: "center" }}>
        <Etiqueta>COMO FUNCIONA</Etiqueta>
        <div style={{ ...TITULO, fontSize: 64, color: "white", marginTop: 10 }}>
          Aqui é <span style={textoDegrade}>simples</span>
        </div>
      </Surge>
      <Surge de={m("acordo") - 6} style={{ left: 110, top: 370 }}>
        <No rotulo="01 · PROMETEU" titulo="Acordo" linha="Cota Fim de Ano" valor="R$ 24.000" />
      </Surge>
      <Seta de={m("Cada", 1) - 4} x={585} />
      <Surge de={m("recebimento") - 6} style={{ left: 730, top: 370 }}>
        <No rotulo="02 · CHEGOU" titulo="Recebimento" linha="NF de bonificação" valor="R$ 14.000" />
      </Surge>
      <Seta de={m("saldo") - 8} x={1205} />
      <Surge de={m("saldo") - 4} style={{ left: 1350, top: 370 }}>
        <No rotulo="03 · FALTA" titulo="Saldo" linha="Acordo − recebido" valor={`R$ ${Math.round(saldo).toLocaleString("pt-BR")}`} destaque={frame >= conta} />
      </Surge>
      <Surge de={m("sozinho") - 4} style={{ left: 1350, top: 700, width: 460, textAlign: "center" }}>
        <div style={{ fontFamily: fonteMono, fontSize: 24, color: VERDE, letterSpacing: 2 }}>CALCULADO SOZINHO</div>
      </Surge>
    </>
  );
};

// ---------- 4. Painel
export const centroPainel = (i: number) => {
  const p = CARTAO_PAINEL(i);
  return [AREA.x + p.x + p.w / 2, AREA.y + p.y + p.h / 2] as const;
};
export const Painel: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const alvos = [m("negociado"), m("entrou"), m("receber"), m("venceu")];
  const destaque = alvos.reduce((d, f, i) => (frame >= f - 4 ? i : d), -1);
  const q: Quadro[] = [[0, 1, 820, 480], [m("Painel"), 1.05, 820, 500]];
  alvos.forEach((f, i) => {
    const [x, y] = centroPainel(i);
    // fica no cartão até a hora de ir para o próximo (12 frames de deslocamento)
    q.push([f - 8, 1.45, x, y], [Math.max(f - 7, alvos[i + 1] === undefined ? c.dur : alvos[i + 1] - 20), 1.47, x, y]);
  });
  return (
    <AbsoluteFill>
      <Camera quadros={q}>
        <Janela ativo="Verbas e Acordos">
          <TelaPainel conta={m("Painel")} destaque={destaque} />
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- 5. Novo acordo (interativo)
export const centroAcordo = (i: number) => {
  const p = CARTAO_ACORDO(i);
  return [AREA.x + p.x + p.w / 2, AREA.y + p.y + p.h / 2] as const;
};
export const NovoAcordo: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const clique = m("Novo", 1) + 4;
  const f = {
    abre: clique + 4,
    fornecedor: m("fornecedor"),
    modalidade: m("modalidade"),
    forma: m("forma"),
    descricao: m("Descreve"),
    valor: m("valor"),
    prevista: m("data"),
    anexa: m("anexa"),
    salvar: m("Salvou"),
  };
  const salvo = f.salvar + 16;
  const lista = frame >= salvo ? [ACORDOS.a215, ACORDOS.a214, ACORDOS.a209, ACORDOS.a198] : [ACORDOS.a214, ACORDOS.a209, ACORDOS.a198, ACORDOS.a187];
  const [nx, ny] = centroAcordo(0);
  const q: Quadro[] = [
    [0, 1, 820, 480],
    [clique - 20, 1.3, BOTAO_NOVO.x - 200, BOTAO_NOVO.y + 120],
    [f.abre + 6, 1.32, 960, 420],
    [f.descricao, 1.32, 960, 480],
    [f.valor - 6, 1.36, 960, 620],
    [f.anexa - 6, 1.36, 960, CAMPO.anexar.y + 40],
    [f.salvar - 4, 1.36, 960, CAMPO.salvar.y - 140],
    [salvo + 4, 1.3, nx - 60, ny + 60],
    [c.dur, 1.32, nx - 60, ny + 60],
  ];
  const ponto = (de: number, alvo: { x: number; y: number }) => [[de - 10, alvo.x, alvo.y] as const, [de, alvo.x, alvo.y] as const];
  const pontos = [
    [0, 1150, 760] as const,
    [clique - 26, 1150, 760] as const,
    [clique - 4, BOTAO_NOVO.x, BOTAO_NOVO.y] as const,
    ...ponto(f.fornecedor, CAMPO.fornecedor),
    ...ponto(f.modalidade, CAMPO.modalidade),
    ...ponto(f.forma, CAMPO.forma),
    ...ponto(f.descricao, CAMPO.descricao),
    ...ponto(f.valor, CAMPO.valor),
    ...ponto(f.prevista, CAMPO.prevista),
    ...ponto(f.anexa, CAMPO.anexar),
    ...ponto(f.salvar, CAMPO.salvar),
    [salvo + 20, CAMPO.salvar.x + 140, CAMPO.salvar.y + 40] as const,
  ];
  return (
    <AbsoluteFill>
      <Camera quadros={q}>
        <Janela ativo="Verbas e Acordos">
          <Cabecalho aba="Acordos" />
          <BarraAcordos clique={clique} resumo={frame >= salvo ? "55 acordo(s) · saldo R$ 296.250,00" : "54 acordo(s) · saldo R$ 272.250,00"} />
          {lista.map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} entra={a.codigo === "ACD-0215" ? salvo : undefined} aceso={a.codigo === "ACD-0215"} />
          ))}
          <Aviso de={salvo} texto="Acordo ACD-0215 salvo" />
          <ModalNovoAcordo m={f} rola={interpolate(frame, [f.prevista + 8, Math.max(f.prevista + 9, f.anexa - 6)], [0, ROLA_FORM()], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        </Janela>
        <Cursor pontos={pontos} cliques={[clique, f.fornecedor, f.modalidade, f.forma, f.descricao, f.valor, f.prevista, f.anexa, f.salvar]} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- 6. Situação: o que fazer com cada acordo
export const Situacao: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const lista = [ACORDOS.a214, ACORDOS.a209, ACORDOS.a215, ACORDOS.a187];
  const passos: [number, number, string][] = [
    [0, m("Vencido"), "Cobrar o fornecedor"],
    [1, m("Vence"), "Lembrar o fornecedor"],
    [2, m("prazo", 1), "Nada por enquanto"],
  ];
  const acoes = [m("Cobra"), m("Lembra"), m("relaxar")];
  const atual = passos.reduce((d, [i, f]) => (frame >= f - 6 ? i : d), -1);
  const coluna = frame < passos[0][1] - 6 ? (([[m("saldo"), "saldo"], [m("prazo"), "prazo"], [m("comprador"), "comprador"], [m("Situação"), "situacao"]] as const).reduce<ColunaAcordo | undefined>((v, [f, k]) => (frame >= f - 4 ? k : v), undefined)) : undefined;
  const yTab = centroAcordo(1)[1];
  const q: Quadro[] = [
    [0, 1.05, 820, 560],
    [m("tabela") - 6, 1.12, 920, yTab],
    [m("saldo") - 8, 1.35, AREA.x + COLUNA_X("saldo") + 120, yTab],
    [m("comprador") - 6, 1.35, AREA.x + COLUNA_X("comprador") - 160, yTab],
    [m("Situação") - 8, 1.3, AREA.x + COLUNA_X("situacao") + 200, yTab],
  ];
  passos.forEach(([i, f], k) => {
    const [x, y] = centroAcordo(i);
    const proximo = passos[k + 1]?.[1];
    q.push([f - 10, 1.32, x, y], [Math.max(f - 9, proximo === undefined ? c.dur : proximo - 22), 1.34, x, y]);
  });
  return (
    <AbsoluteFill>
      <Camera quadros={q}>
        <Janela ativo="Verbas e Acordos">
          <Cabecalho aba="Acordos" />
          <BarraAcordos resumo="55 acordo(s) · saldo R$ 296.250,00" />
          {lista.map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} coluna={coluna} aceso={i === atual} apagado={atual >= 0 && i !== atual} acao={i < 3 && frame >= acoes[i] - 4 ? passos[i][2] : undefined} acaoDe={(acoes[i] ?? 0) - 4} />
          ))}
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- 7. Encerramento
export const Fim: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <FotoAna arquivo="ana-bracos.jpg" x={1080} dur={c.dur} />
      <Sequence from={10} layout="none">
        <TarjaAna x={1120} y={810} />
      </Sequence>
      <Surge de={m("Menos") - 4} style={{ left: 120, top: 210 }}>
        <div style={{ ...TITULO, fontSize: 92, color: "white", lineHeight: 1.05 }}>MENOS PLANILHA,</div>
      </Surge>
      <Surge de={m("mais") - 4} style={{ left: 120, top: 310 }}>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.15, ...textoDegrade }}>MAIS VERBA</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.05, ...textoDegrade }}>NO CAIXA.</div>
      </Surge>
      <Surge de={m("Fala") - 4} style={{ left: 120, top: 560 }}>
        <Img src={staticFile("midia/logo-simpli-fundo-escuro.png")} style={{ width: 380, marginLeft: -20 }} />
        <div style={{ fontFamily: fonteMono, fontSize: 30, color: CINZA, marginTop: 4, letterSpacing: 1 }}>simpli.ia.br</div>
      </Surge>
      <Surge de={m("Bora") - 4} style={{ left: 120, top: 790 }}>
        <div style={{ background: VERDE, color: FUNDO, ...TITULO, fontSize: 44, padding: "14px 28px", borderRadius: 12 }}>BORA SIMPLIFICAR?</div>
      </Surge>
    </>
  );
};

export const TELAS_PILOTO: Record<string, React.FC<{ readonly c: Cena }>> = {
  abertura: Abertura,
  gancho: Gancho,
  conceito: Conceito,
  painel: Painel,
  novo: NovoAcordo,
  situacao: Situacao,
  fim: Fim,
};
// a Ana aparece grande na abertura e no fim: legenda à direita da foto na abertura, à esquerda no fim
export const SEM_PIP: Record<string, readonly [number, number]> = { abertura: [860, 0], fim: [0, 860] };

export const VerbasAcordos: React.FC = () => <Montagem itens={ROTEIRO.itens} duracao={ROTEIRO.duracao} telas={TELAS_PILOTO} pastaVoz="voz/verbas" semPip={SEM_PIP} />;
