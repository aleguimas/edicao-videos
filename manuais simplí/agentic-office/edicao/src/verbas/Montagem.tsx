import { Audio } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AnaPip, Legenda } from "../ana/Ana";
import { ANTES, type Cena, DEPOIS, FPS, type Vozes } from "../ana/voz";
import { CINZA, FUNDO, fonteMono, TITULO, VERDE } from "../fonte";

// Peças comuns dos vídeos do módulo e a montagem da linha do tempo: falas da Ana em sequência,
// cartelas de capítulo (sem voz) entre elas, avatar no canto, legenda, etiqueta do capítulo e trilha.

export const Fundo: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: FUNDO,
      backgroundImage: [
        "radial-gradient(circle at 12% 18%, rgba(60,224,30,0.13), transparent 42%)",
        "radial-gradient(circle at 88% 85%, rgba(60,224,30,0.10), transparent 45%)",
        "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
        "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      ].join(","),
      backgroundSize: "auto, auto, 64px 64px, 64px 64px",
    }}
  />
);

// cena com entrada e saída suaves
export const Transicao: React.FC<{ readonly dur: number; readonly children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Surge: React.FC<{ readonly de: number; readonly children: React.ReactNode; readonly style?: React.CSSProperties; readonly ate?: number }> = ({ de, ate, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - de, fps, config: { damping: 15, stiffness: 130 } });
  const sai = ate === undefined ? 1 : interpolate(frame, [ate, ate + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < de) return null;
  return <div style={{ position: "absolute", opacity: s * sai, transform: `translateY(${(1 - s) * 40}px)`, ...style }}>{children}</div>;
};

export const Etiqueta: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: VERDE }}>{children}</div>
);

// foto da Ana em painel, com aproximação lenta
export const FotoAna: React.FC<{ readonly arquivo: string; readonly x: number; readonly dur: number }> = ({ arquivo, x, dur }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, dur], [1, 1.07]);
  return (
    <div style={{ position: "absolute", left: x, top: 60, width: 720, height: 960, borderRadius: 24, overflow: "hidden", border: "1px solid rgba(60,224,30,0.35)", boxShadow: "0 0 80px rgba(60,224,30,0.18)" }}>
      <Img src={staticFile(`midia/${arquivo}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", transform: `scale(${z})`, transformOrigin: "50% 30%" }} />
      {/* sombra embaixo para a tarja ler bem sobre fundo claro */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "linear-gradient(transparent, rgba(11,11,12,0.75))" }} />
    </div>
  );
};

// ---------- Linha do tempo
export type Capitulo = { readonly cap: number; readonly titulo: string };
export type Entrada = string | readonly [string, number] | Capitulo;
export type Item = { tipo: "fala"; c: Cena; cap: Capitulo | null } | { tipo: "cartela"; de: number; dur: number; cap: Capitulo };
export const CARTELA = 54;

export const montarRoteiro = (vozes: Vozes, ordem: readonly Entrada[]): { itens: Item[]; duracao: number } => {
  const itens: Item[] = [];
  let f = 0;
  let cap: Capitulo | null = null;
  for (const o of ordem) {
    if (typeof o === "object" && "cap" in o) {
      // capítulo 0: só encerra a etiqueta do capítulo anterior, sem cartela
      if (o.cap === 0) {
        cap = null;
        continue;
      }
      cap = o;
      itens.push({ tipo: "cartela", de: f, dur: CARTELA, cap: o });
      f += CARTELA;
      continue;
    }
    const [id, extra] = typeof o === "string" ? [o, 0] : o;
    const fala = vozes[id];
    if (!fala) throw new Error(`fala ${id} não existe no JSON de voz`);
    const dur = ANTES + Math.ceil(fala.dur * FPS) + DEPOIS + extra;
    itens.push({ tipo: "fala", c: { id, de: f, dur, fala, extra }, cap });
    f += dur;
  }
  return { itens, duracao: f };
};

// cartela de capítulo: número grande + título
const Cartela: React.FC<{ readonly cap: Capitulo; readonly dur: number }> = ({ cap, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const sai = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barra = interpolate(frame, [4, dur - 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 200, opacity: sai }}>
      <div style={{ fontFamily: fonteMono, fontSize: 34, letterSpacing: 6, color: VERDE, opacity: s }}>CAPÍTULO {String(cap.cap).padStart(2, "0")}</div>
      <div style={{ ...TITULO, fontSize: 110, lineHeight: 1.05, color: "white", marginTop: 14, transform: `translateX(${(1 - s) * -60}px)`, opacity: s }}>{cap.titulo}</div>
      <div style={{ width: 900 * barra, height: 8, borderRadius: 4, marginTop: 30, background: VERDE, boxShadow: "0 0 24px rgba(60,224,30,0.6)" }} />
    </AbsoluteFill>
  );
};

// etiqueta do capítulo no canto de cima durante as falas
const EtiquetaCapitulo: React.FC<{ readonly cap: Capitulo }> = ({ cap }) => (
  <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 12, background: "rgba(11,11,12,0.85)", border: "1px solid rgba(60,224,30,0.4)", borderRadius: 8, padding: "8px 16px", zIndex: 60 }}>
    <span style={{ fontFamily: fonteMono, fontSize: 20, color: VERDE, fontWeight: 700 }}>{String(cap.cap).padStart(2, "0")}</span>
    <span style={{ ...TITULO, fontSize: 20, color: CINZA, fontWeight: 800 }}>{cap.titulo}</span>
  </div>
);

export const Montagem: React.FC<{
  readonly itens: readonly Item[];
  readonly duracao: number;
  readonly telas: Record<string, React.FC<{ readonly c: Cena }>>;
  readonly pastaVoz: string;
  // falas em que a Ana aparece grande (sem avatar no canto) e onde fica a legenda nelas
  readonly semPip: Record<string, readonly [number, number]>;
}> = ({ itens, duracao, telas, pastaVoz, semPip }) => {
  const { fps } = useVideoConfig();
  const falas = itens.filter((i): i is Extract<Item, { tipo: "fala" }> => i.tipo === "fala");
  const primeiraPip = falas.find((i) => !(i.c.id in semPip))?.c.id;
  return (
    <AbsoluteFill>
      <Fundo />
      {itens.map((it) => {
        if (it.tipo === "cartela")
          return (
            <Sequence key={`cap${it.cap.cap}`} name={`Capítulo ${it.cap.cap}`} from={it.de} durationInFrames={it.dur}>
              <Cartela cap={it.cap} dur={it.dur} />
            </Sequence>
          );
        const { c, cap } = it;
        const Tela = telas[c.id];
        const pip = !(c.id in semPip);
        const [esq, dir] = semPip[c.id] ?? [0, 0];
        return (
          <Sequence key={c.id} name={c.id} from={c.de} durationInFrames={c.dur} premountFor={fps}>
            <Transicao dur={c.dur}>
              <Tela c={c} />
            </Transicao>
            {pip && <AnaPip fala={c.fala} entra={c.id === primeiraPip ? 10 : -30} />}
            {cap && <EtiquetaCapitulo cap={cap} />}
            <Legenda fala={c.fala} esquerda={esq} direita={dir + (pip ? 300 : 0)} />
            <Sequence from={ANTES} layout="none">
              <Audio src={staticFile(`${pastaVoz}/${c.id}.mp3`)} />
            </Sequence>
          </Sequence>
        );
      })}
      {/* trilha baixa por baixo da voz */}
      <Audio
        src={staticFile("trilha.mp3")}
        loop
        volume={(f) => 0.07 * interpolate(f, [0, FPS, duracao - 2 * FPS, duracao], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};
