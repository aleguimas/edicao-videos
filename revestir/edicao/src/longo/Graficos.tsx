import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO, VERDE_SIMPLI } from "../fonte";

// Peças gráficas do vídeo longo (1920x1080, identidade Simplí). Os tempos `em` são frames
// dentro da Sequence de cada peça (o VideoLongo converte dos segundos da fala).

export const suave = (frame: number, de: number, dur = 12) =>
  interpolate(frame, [de, de + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const useSaida = (dur = 8) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - dur, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const Rotulo: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 24, letterSpacing: "7px", color: VERDE_SIMPLI, textTransform: "uppercase", ...style }}>{children}</div>
);

// Cena gráfica em tela cheia por cima da fala: o vídeo continua atrás, desfocado e escuro
// (a voz segue). Título no alto à esquerda e o conteúdo no centro.
export const Cena: React.FC<{ readonly rotulo: string; readonly titulo: React.ReactNode; readonly children: React.ReactNode }> = ({ rotulo, titulo, children }) => {
  const frame = useCurrentFrame();
  const entra = suave(frame, 0, 10);
  const saida = useSaida();
  return (
    <AbsoluteFill style={{ opacity: entra * (1 - saida) }}>
      <AbsoluteFill style={{ backdropFilter: "blur(26px) brightness(0.32) saturate(0.7)", backgroundColor: "rgba(11,11,12,0.35)" }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 85% 10%, rgba(60,224,30,0.12), transparent 45%)" }} />
      <div style={{ position: "absolute", left: 140, top: 110, translate: `0px ${(1 - entra) * -20}px` }}>
        <Rotulo>{rotulo}</Rotulo>
        <div style={{ ...TITULO, fontSize: 64, color: "#FFFFFF", letterSpacing: "-2px", lineHeight: 1.02, marginTop: 14, textTransform: "uppercase" }}>{titulo}</div>
        <div style={{ width: 110 * entra, height: 7, borderRadius: 4, backgroundImage: DEGRADE_BARRA, marginTop: 22 }} />
      </div>
      <div style={{ position: "absolute", top: 300, bottom: 100, left: 140, right: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    </AbsoluteFill>
  );
};

// Destaque verde em parte do título.
export const Verde: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => <span style={textoDegrade}>{children}</span>;

// Cartão que aparece com mola leve.
const Cartao: React.FC<{ readonly em: number; readonly destaque?: boolean; readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({
  em,
  destaque = false,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = suave(frame, em, 14);
  return (
    <div
      style={{
        opacity: p,
        translate: `0px ${(1 - p) * 40}px`,
        scale: String(0.92 + 0.08 * p),
        borderRadius: 26,
        padding: "34px 34px 38px",
        backgroundColor: destaque ? "rgba(60,224,30,0.12)" : "rgba(255,255,255,0.06)",
        border: `2px solid ${destaque ? "rgba(60,224,30,0.7)" : "rgba(255,255,255,0.14)"}`,
        boxShadow: destaque ? "0 0 60px rgba(60,224,30,0.18)" : "0 20px 50px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Passos ligados por setas (fluxo, linha do tempo, escada).
export const Passos: React.FC<{ readonly itens: readonly { titulo: string; sub?: string; em: number; destaque?: boolean }[] }> = ({ itens }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 18, width: "100%" }}>
      {itens.map((it, i) => (
        <div key={it.titulo} style={{ display: "flex", alignItems: "center", gap: 18, flex: 1 }}>
          {i > 0 ? (
            <div style={{ ...TITULO, fontSize: 54, color: VERDE_SIMPLI, opacity: suave(frame, it.em - 4, 8) }}>→</div>
          ) : null}
          <Cartao em={it.em} destaque={it.destaque} style={{ flex: 1, minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 26, color: VERDE_SIMPLI, letterSpacing: "4px" }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ ...TITULO, fontSize: 40, color: "#FFFFFF", lineHeight: 1.08, marginTop: 18, textTransform: "uppercase", letterSpacing: "-1px" }}>{it.titulo}</div>
            {it.sub ? <div style={{ fontFamily: TITULO.fontFamily, fontWeight: 600, fontSize: 27, color: "#C9CCC9", lineHeight: 1.3, marginTop: 16 }}>{it.sub}</div> : null}
          </Cartao>
        </div>
      ))}
    </div>
  );
};

// Dois lados: o que não é × o que é.
export const Comparativo: React.FC<{
  readonly esquerda: { titulo: string; itens: readonly string[]; em: number };
  readonly direita: { titulo: string; itens: readonly string[]; em: number };
}> = ({ esquerda, direita }) => {
  const frame = useCurrentFrame();
  const lado = (l: { titulo: string; itens: readonly string[]; em: number }, bom: boolean) => (
    <Cartao em={l.em} destaque={bom} style={{ flex: 1, minHeight: 470 }}>
      <div style={{ ...TITULO, fontSize: 50, letterSpacing: "-1.5px", textTransform: "uppercase", color: bom ? VERDE_SIMPLI : "#9A9A9A" }}>{l.titulo}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 30 }}>
        {l.itens.map((t, i) => {
          const p = suave(frame, l.em + 10 + i * 8, 10);
          return (
            <div key={t} style={{ display: "flex", gap: 18, alignItems: "baseline", opacity: p, translate: `${(1 - p) * 30}px 0px` }}>
              <span style={{ ...TITULO, fontSize: 30, color: bom ? VERDE_SIMPLI : "#7A7A7A" }}>{bom ? "✓" : "×"}</span>
              <span style={{ fontFamily: TITULO.fontFamily, fontWeight: 700, fontSize: 34, color: bom ? "#FFFFFF" : "#B5B5B5", lineHeight: 1.25 }}>{t}</span>
            </div>
          );
        })}
      </div>
    </Cartao>
  );
  return (
    <div style={{ display: "flex", gap: 44, width: "100%", alignItems: "stretch" }}>
      {lado(esquerda, false)}
      <div style={{ ...TITULO, fontSize: 70, color: "#FFFFFF", alignSelf: "center", opacity: suave(frame, direita.em - 6, 8) }}>×</div>
      {lado(direita, true)}
    </div>
  );
};

// Barras horizontais com porcentagem que conta.
export const Barras: React.FC<{ readonly itens: readonly { rotulo: string; valor: number; em: number; destaque?: boolean }[]; readonly fonte?: string }> = ({ itens, fonte }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 54 }}>
      {itens.map((it) => {
        const p = interpolate(frame, [it.em, it.em + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const cor = it.destaque ? VERDE_SIMPLI : "#FFFFFF";
        return (
          <div key={it.rotulo} style={{ opacity: suave(frame, it.em - 4, 8) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <span style={{ fontFamily: TITULO.fontFamily, fontWeight: 800, fontSize: 40, color: "#FFFFFF", textTransform: "uppercase" }}>{it.rotulo}</span>
              <span style={{ ...TITULO, fontSize: 96, color: cor, fontVariantNumeric: "tabular-nums", letterSpacing: "-3px" }}>{Math.round(it.valor * p)}%</span>
            </div>
            <div style={{ height: 34, borderRadius: 17, backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${it.valor * p}%`, borderRadius: 17, backgroundImage: it.destaque ? DEGRADE_BARRA : "linear-gradient(90deg, #8A8A8A, #D0D0D0)" }} />
            </div>
          </div>
        );
      })}
      {fonte ? <div style={{ fontFamily: fonteMono, fontSize: 20, letterSpacing: "3px", color: "#8A8A8A" }}>{fonte}</div> : null}
    </div>
  );
};

// Lista de itens que entram em sequência (com ícone de bolinha verde).
export const Lista: React.FC<{ readonly itens: readonly { texto: string; em: number; destaque?: boolean }[]; readonly colunas?: number }> = ({ itens, colunas = 2 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${colunas}, 1fr)`, gap: 28, width: "100%" }}>
    {itens.map((it) => (
      <Cartao key={it.texto} em={it.em} destaque={it.destaque} style={{ display: "flex", alignItems: "center", gap: 24, padding: "30px 34px" }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: VERDE_SIMPLI, boxShadow: "0 0 18px rgba(60,224,30,0.7)", flexShrink: 0 }} />
        <div style={{ ...TITULO, fontSize: 40, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "-1px", lineHeight: 1.1 }}>{it.texto}</div>
      </Cartao>
    ))}
  </div>
);

// Iceberg: a ponta visível (ChatGPT) e o que está embaixo da linha d'água.
export const Iceberg: React.FC<{ readonly ponta: string; readonly emPonta: number; readonly abaixo: readonly { texto: string; em: number }[] }> = ({ ponta, emPonta, abaixo }) => {
  const frame = useCurrentFrame();
  const p = suave(frame, emPonta, 14);
  return (
    <div style={{ position: "relative", width: 1100, height: 640 }}>
      {/* linha d'água */}
      <div style={{ position: "absolute", left: -200, right: -200, top: 180, height: 3, backgroundImage: "linear-gradient(90deg, transparent, rgba(60,224,30,0.8), transparent)", opacity: p }} />
      {/* ponta */}
      <div style={{ position: "absolute", left: 450, top: 40, width: 200, height: 140, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", backgroundColor: "#FFFFFF", opacity: p, translate: `0px ${(1 - p) * 40}px` }} />
      <div style={{ position: "absolute", left: 680, top: 70, ...TITULO, fontSize: 56, color: "#FFFFFF", opacity: p, letterSpacing: "-1px" }}>{ponta}</div>
      <Rotulo style={{ position: "absolute", left: 682, top: 140, fontSize: 20, opacity: p }}>o que todo mundo vê</Rotulo>
      {/* base submersa */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 183,
          width: 800,
          height: 440,
          clipPath: "polygon(37.5% 0, 62.5% 0, 100% 60%, 70% 100%, 25% 100%, 0 55%)",
          backgroundImage: "linear-gradient(180deg, rgba(60,224,30,0.35), rgba(60,224,30,0.05))",
          opacity: suave(frame, abaixo[0]?.em ?? emPonta, 16),
        }}
      />
      <div style={{ position: "absolute", left: 250, right: 250, top: 270, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        {abaixo.map((a) => {
          const q = suave(frame, a.em, 12);
          return (
            <div key={a.texto} style={{ ...TITULO, fontSize: 42, color: "#FFFFFF", textTransform: "uppercase", opacity: q, translate: `0px ${(1 - q) * 24}px`, letterSpacing: "-1px" }}>
              {a.texto}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Organograma de agentes (como na tela do Olho de Deus): níveis que aparecem em sequência.
export const Organograma: React.FC<{ readonly niveis: readonly { em: number; nos: readonly { nome: string; papel: string; destaque?: boolean }[] }[] }> = ({ niveis }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, width: "100%" }}>
      {niveis.map((n, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {i > 0 ? <div style={{ width: 4, height: 36 * suave(frame, n.em - 6, 8), backgroundColor: VERDE_SIMPLI, borderRadius: 2 }} /> : null}
          <div style={{ display: "flex", gap: 40 }}>
            {n.nos.map((no) => (
              <Cartao key={no.nome} em={n.em} destaque={no.destaque} style={{ minWidth: 330, padding: "16px 30px 18px", textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                  <div style={{ width: 54, height: 54, borderRadius: 27, border: `3px solid ${VERDE_SIMPLI}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: VERDE_SIMPLI }} />
                  </div>
                  <div style={{ ...TITULO, fontSize: 38, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "-1px" }}>{no.nome}</div>
                </div>
                <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 20, letterSpacing: "3px", color: "#C9CCC9", marginTop: 12, textTransform: "uppercase" }}>{no.papel}</div>
              </Cartao>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Notificação de e-mail (relatório automático do Olho de Deus).
export const Notificacao: React.FC<{ readonly em: number; readonly remetente: string; readonly assunto: string; readonly hora: string; readonly linhas: readonly { texto: string; em: number }[] }> = ({
  em,
  remetente,
  assunto,
  hora,
  linhas,
}) => {
  const frame = useCurrentFrame();
  return (
    <Cartao em={em} destaque style={{ width: 1100, padding: "36px 44px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 70, height: 70, borderRadius: 18, backgroundColor: VERDE_SIMPLI, display: "flex", alignItems: "center", justifyContent: "center", ...TITULO, fontSize: 40, color: NAVY }}>✉</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...TITULO, fontSize: 36, color: "#FFFFFF" }}>{remetente}</div>
          <div style={{ fontFamily: TITULO.fontFamily, fontWeight: 600, fontSize: 28, color: "#C9CCC9", marginTop: 4 }}>{assunto}</div>
        </div>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 34, color: VERDE_SIMPLI }}>{hora}</div>
      </div>
      <div style={{ height: 2, backgroundColor: "rgba(255,255,255,0.12)", margin: "30px 0 26px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 40px" }}>
        {linhas.map((l) => {
          const p = suave(frame, l.em, 10);
          return (
            <div key={l.texto} style={{ display: "flex", alignItems: "center", gap: 16, opacity: p, translate: `${(1 - p) * 24}px 0px` }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: VERDE_SIMPLI }} />
              <div style={{ fontFamily: TITULO.fontFamily, fontWeight: 800, fontSize: 32, color: "#FFFFFF", textTransform: "uppercase" }}>{l.texto}</div>
            </div>
          );
        })}
      </div>
    </Cartao>
  );
};

// Frase grande em tela cheia (citação).
export const Citacao: React.FC<{ readonly linha1: string; readonly linha2: string; readonly em2: number; readonly autor?: string }> = ({ linha1, linha2, em2, autor }) => {
  const frame = useCurrentFrame();
  const saida = useSaida();
  const p1 = suave(frame, 0, 12);
  const p2 = suave(frame, em2, 10);
  const batida = interpolate(frame, [em2, em2 + 4, em2 + 12], [0.6, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const caber = (t: string, max: number) => Math.min(max, 1640 / (t.length * 0.74));
  return (
    <AbsoluteFill style={{ opacity: p1 * (1 - saida) }}>
      <AbsoluteFill style={{ backdropFilter: "blur(26px) brightness(0.3) saturate(0.7)", backgroundColor: "rgba(11,11,12,0.4)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 10, ...TITULO, textTransform: "uppercase", whiteSpace: "nowrap", lineHeight: 1 }}>
        <div style={{ ...TITULO, fontSize: 160, color: VERDE_SIMPLI, height: 90, marginBottom: 10, opacity: p1 }}>“</div>
        <div style={{ fontSize: caber(linha1, 100), color: "#FFFFFF", letterSpacing: "-3px", translate: `0px ${(1 - p1) * 30}px` }}>{linha1}</div>
        <div style={{ fontSize: caber(linha2, 140), letterSpacing: "-4px", ...textoDegrade, opacity: p2, scale: String(batida) }}>{linha2}</div>
        {autor ? <Rotulo style={{ marginTop: 34, color: "#C9CCC9", opacity: suave(frame, em2 + 10, 10) }}>{autor}</Rotulo> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Cartela de capítulo (tela cheia, ~3 s): número grande, título e subtítulo.
export const CartelaCapitulo: React.FC<{ readonly numero: number; readonly titulo: string; readonly sub: string }> = ({ numero, titulo, sub }) => {
  const frame = useCurrentFrame();
  const saida = useSaida(10);
  const e = (de: number) => suave(frame, de, 14);
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, opacity: 1 - saida }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(60,224,30,0.16), transparent 50%)" }} />
      <div style={{ position: "absolute", left: 160, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 70 }}>
        <div
          style={{
            ...TITULO,
            fontSize: 380,
            lineHeight: 1,
            letterSpacing: "-16px",
            color: "transparent",
            WebkitTextStroke: `4px ${VERDE_SIMPLI}`,
            opacity: e(0),
            scale: String(0.85 + 0.15 * e(0)),
          }}
        >
          {String(numero).padStart(2, "0")}
        </div>
        <div>
          <Rotulo style={{ opacity: e(4) }}>Capítulo {numero}</Rotulo>
          <div style={{ ...TITULO, fontSize: 92, color: "#FFFFFF", letterSpacing: "-3px", lineHeight: 1, marginTop: 18, textTransform: "uppercase", opacity: e(7), translate: `${(1 - e(7)) * 40}px 0px`, maxWidth: 1200 }}>
            {titulo}
          </div>
          <div style={{ width: 130 * e(12), height: 8, borderRadius: 4, backgroundImage: DEGRADE_BARRA, margin: "30px 0 26px" }} />
          <div style={{ fontFamily: TITULO.fontFamily, fontWeight: 600, fontSize: 38, color: "#C9CCC9", opacity: e(14), maxWidth: 1200 }}>{sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Rótulo fixo do capítulo no canto superior esquerdo.
export const RotuloCapitulo: React.FC<{ readonly numero: number; readonly titulo: string }> = ({ numero, titulo }) => {
  const frame = useCurrentFrame();
  const p = suave(frame, 0, 12);
  const saida = useSaida(6);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 52,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 22px 12px 14px",
        borderRadius: 14,
        backgroundColor: "rgba(11,11,12,0.72)",
        border: "1.5px solid rgba(60,224,30,0.35)",
        opacity: p * (1 - saida),
        translate: `${(1 - p) * -30}px 0px`,
      }}
    >
      <div style={{ ...TITULO, fontSize: 24, color: NAVY, backgroundColor: VERDE_SIMPLI, borderRadius: 8, padding: "4px 10px" }}>{String(numero).padStart(2, "0")}</div>
      <div style={{ ...TITULO, fontSize: 24, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "-0.3px" }}>{titulo}</div>
    </div>
  );
};

// Tarja de nome (embaixo à esquerda).
export const TarjaNome: React.FC<{ readonly nome: string; readonly papel: string }> = ({ nome, papel }) => {
  const frame = useCurrentFrame();
  const p = suave(frame, 0, 12);
  const saida = useSaida(8);
  return (
    <div style={{ position: "absolute", left: 90, bottom: 110, opacity: p * (1 - saida), translate: `${(1 - p) * -60}px 0px` }}>
      <div style={{ padding: "22px 34px 26px", borderRadius: 18, backgroundColor: "rgba(11,11,12,0.86)", boxShadow: "0 18px 50px rgba(0,0,0,0.5)", borderLeft: `6px solid ${VERDE_SIMPLI}` }}>
        <div style={{ ...TITULO, fontSize: 46, lineHeight: 1, letterSpacing: "-1px", color: "#FFFFFF", whiteSpace: "nowrap" }}>{nome}</div>
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 20, letterSpacing: "4px", color: VERDE_SIMPLI, marginTop: 12 }}>{papel}</div>
      </div>
    </div>
  );
};

// Marca d'água da Simplí no canto inferior direito.
export const MarcaCanto: React.FC = () => {
  const frame = useCurrentFrame();
  const saida = useSaida(10);
  return (
    <Img
      src={staticFile("midia/logo-simpli-fundo-escuro.png")}
      style={{ position: "absolute", right: 56, bottom: 44, width: 150, opacity: 0.8 * suave(frame, 0, 15) * (1 - saida), filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.7))" }}
    />
  );
};
