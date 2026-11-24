import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraFixa } from "../agentic/App";
import { AnaPip } from "../ana/Ana";
import { CENTRO } from "../apresentacao/Agentes";
import { ANTES, type Cena, type Fala, FPS } from "../ana/voz";
import { fonteMono, TITULO, VERDE } from "../fonte";
import { Fundo, type Item } from "../verbas/Montagem";

// Cortes 9:16 (Reels e Shorts) a partir do vídeo de apresentação. 1080x1920, com área segura:
// nada importante acima de y=120 nem abaixo da legenda (y=1500; os botões das redes ficam embaixo e
// à direita). Layout: cabeçalho com a Ana e o título do corte, palco no meio, legenda logo abaixo.
export const LARGURA = 1080;
export const ALTURA = 1920;
export const PALCO = { y: 360, h: 940 };
export const Y_LEGENDA = 1500;

// ---------- palco: mostra uma cena 16:9 do vídeo principal com câmera vertical
// quadro = [frame, escala, x, y]: o ponto (x, y) da cena 1920x1080 fica no centro do palco
export type QuadroV = readonly [number, number, number, number];
export const Palco: React.FC<{ readonly quadros: readonly QuadroV[]; readonly children: React.ReactNode }> = ({ quadros, children }) => {
  const frame = useCurrentFrame();
  const fs = quadros.map((q) => q[0]);
  const v = (i: 1 | 2 | 3) =>
    quadros.length === 1 ? quadros[0][i] : interpolate(frame, fs, quadros.map((q) => q[i]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const k = v(1);
  const x = LARGURA / 2 - v(2) * k;
  const y = PALCO.h / 2 - v(3) * k;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: PALCO.y,
        width: LARGURA,
        height: PALCO.h,
        overflow: "hidden",
        WebkitMaskImage: "linear-gradient(transparent, black 50px, black calc(100% - 50px), transparent)",
        maskImage: "linear-gradient(transparent, black 50px, black calc(100% - 50px), transparent)",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${x}px, ${y}px) scale(${k})`, transformOrigin: "0 0" }}>
        <CameraFixa.Provider value={CENTRO}>{children}</CameraFixa.Provider>
      </div>
    </div>
  );
};

// foco = [escala, x, y]. `alvo` recebe coordenadas de dentro da janela do sistema (as dos Cartao) e
// devolve o ponto da cena, já com a câmera da cena parada em CENTRO
export type Foco = readonly [number, number, number];
export const alvo = (escala: number, x: number, y: number): Foco => [escala, 432 + 1.016 * x, 122 + 1.016 * y];
export const GERAL = alvo(0.84, 670, 440);

// ---------- cabeçalho: Ana no círculo + marca + título fixo do corte
export const Cabecalho: React.FC<{ readonly fala: Fala; readonly titulo: React.ReactNode; readonly entra?: number; readonly rotulo?: string }> = ({ fala, titulo, entra = -30, rotulo = "AGENTIC OFFICE" }) => (
  <>
    <div style={{ position: "absolute", left: 50, top: 150, width: 176 + 56, height: 176 + 56 }}>
      <AnaPip fala={fala} entra={entra} tamanho={176} />
    </div>
    <div style={{ position: "absolute", left: 290, top: 158, right: 50 }}>
      <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: VERDE }}>{rotulo}</div>
      <div style={{ ...TITULO, fontSize: 60, lineHeight: 1.02, color: "white", marginTop: 10, textTransform: "uppercase" }}>{titulo}</div>
    </div>
  </>
);

// ---------- legenda: blocos de até 4 palavras (e 24 letras, para caber numa linha), grandes, palavra da vez em verde
type Bloco = { ini: number; fim: number; palavras: readonly [number, number, string][] };
const blocos = (fala: Fala): Bloco[] => {
  const out: Bloco[] = [];
  let atual: [number, number, string][] = [];
  fala.palavras.forEach((p, i) => {
    const ant = fala.palavras[i - 1];
    const letras = atual.reduce((n, x) => n + x[2].length + 1, 0) + p[2].length;
    if (atual.length && (atual.length >= 4 || letras > 24 || p[0] - ant[1] > 0.28)) {
      out.push({ ini: atual[0][0], fim: atual[atual.length - 1][1], palavras: atual });
      atual = [];
    }
    atual.push([...p]);
  });
  if (atual.length) out.push({ ini: atual[0][0], fim: atual[atual.length - 1][1], palavras: atual });
  return out;
};
export const LegendaV: React.FC<{ readonly fala: Fala; readonly y?: number }> = ({ fala, y = Y_LEGENDA }) => {
  const frame = useCurrentFrame();
  const s = (frame - ANTES) / FPS;
  const bs = blocos(fala);
  const i = bs.findIndex((b, k) => s >= b.ini - 0.05 && s < (bs[k + 1]?.ini ?? b.fim + 0.5) - 0.05);
  if (i < 0) return null;
  const b = bs[i];
  const entrada = interpolate(s - b.ini, [-0.05, 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", justifyContent: "center", pointerEvents: "none", zIndex: 50 }}>
      <div
        style={{
          ...TITULO,
          fontSize: 66,
          lineHeight: 1.12,
          textAlign: "center",
          color: "white",
          textShadow: "0 4px 24px rgba(0,0,0,0.9)",
          opacity: entrada,
          transform: `scale(${0.92 + 0.08 * entrada})`,
        }}
      >
        {b.palavras.map((p, k) => {
          const dita = s >= p[0] - 0.03;
          const agora = dita && (k === b.palavras.length - 1 || s < b.palavras[k + 1][0] - 0.03);
          return (
            <span key={k} style={{ color: agora ? VERDE : dita ? "white" : "rgba(255,255,255,0.5)" }}>
              {p[2]}
              {k < b.palavras.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- montagem do corte (o cabeçalho já aparece pronto; a cena que o apresenta desenha o próprio): falas em sequência com corte seco suave, barra de progresso e trilha
export type TelaV = React.FC<{ readonly c: Cena }>;
export const MontagemVertical: React.FC<{
  readonly itens: readonly Item[];
  readonly duracao: number;
  readonly telas: Record<string, TelaV>;
  // falas cuja cena desenha o próprio cabeçalho (ou não tem cabeçalho) e falas sem legenda
  readonly semCabecalho?: readonly string[];
  readonly semLegenda?: readonly string[];
  readonly titulo: React.ReactNode;
  // pasta da voz de cada fala, para os cortes de outros vídeos
  readonly pastaVoz?: (id: string) => string;
  readonly rotulo?: string;
  // anúncios: legenda mais alta (fora dos botões do Shorts), sem o ícone no canto e sem fade no primeiro quadro
  readonly yLegenda?: number;
  readonly semIcone?: boolean;
  readonly abreDireto?: boolean;
}> = ({ itens, duracao, telas, semCabecalho = [], semLegenda = [], titulo, pastaVoz, rotulo, yLegenda, semIcone, abreDireto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const falas = itens.filter((i): i is Extract<Item, { tipo: "fala" }> => i.tipo === "fala");
  return (
    <AbsoluteFill style={{ width: LARGURA, height: ALTURA }}>
      <Fundo />
      {falas.map(({ c }) => {
        const Tela = telas[c.id];
        const pasta = pastaVoz?.(c.id) ?? (c.id.startsWith("corte") || c.id === "fim" ? "voz/cortes" : "voz/apresentacao");
        return (
          <Sequence key={c.id} name={c.id} from={c.de} durationInFrames={c.dur} premountFor={fps}>
            <Entrada dur={c.dur} direto={abreDireto && c.de === 0}>
              <Tela c={c} />
            </Entrada>
            {!semCabecalho.includes(c.id) && <Cabecalho fala={c.fala} titulo={titulo} rotulo={rotulo} />}
            {!semLegenda.includes(c.id) && <LegendaV fala={c.fala} y={yLegenda} />}
            <Sequence from={ANTES} layout="none">
              <Audio src={staticFile(`${pasta}/${c.id}.mp3`)} />
            </Sequence>
          </Sequence>
        );
      })}
      {/* ícone da Simplí, em todos os cortes */}
      {!semIcone && <Img src={staticFile("midia/ico-simpli-fundo-escuro.png")} style={{ position: "absolute", right: 44, bottom: 44, width: 120, height: 120, zIndex: 70 }} />}
      {/* barra de progresso no topo */}
      <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${(frame / duracao) * 100}%`, background: VERDE, boxShadow: "0 0 16px rgba(60,224,30,0.7)", zIndex: 80 }} />
      <Audio
        src={staticFile("trilha.mp3")}
        loop
        volume={(f) => 0.09 * interpolate(f, [0, 10, duracao - 2 * FPS, duracao], [0.6, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};

// troca de cena rápida (4 frames), para o corte não "piscar" preto
const Entrada: React.FC<{ readonly dur: number; readonly children: React.ReactNode; readonly direto?: boolean }> = ({ dur, children, direto }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4, dur - 4, dur], [direto ? 1 : 0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
