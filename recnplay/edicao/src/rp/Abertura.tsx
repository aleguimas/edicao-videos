import { Video } from "@remotion/media";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fonteMono, fonteTexto } from "../fonte";
import { LogoRP, PalavraGigante } from "./Grafismos";
import { CONDENSADA, FILTRO_RUA, LARANJA, PESSOAS, PRETO, ROSA, TITULO_PAINEL, type Pessoa } from "./tema";

// Abertura no estilo do aftermovie do festival: cortes rápidos dos clipes do Bairro do Recife
// com palavras gigantes, a placa do auditório e a cartela da conversa (igual ao card oficial).
export type Tomada = { clipe: string; de: number; dur: number; palavra?: string; y?: number };

// Durações em compassos da trilha (1,6724 s): a 1ª tomada vai até o drop (2,90 s),
// as outras trocam na batida.
const C = 1.6724;
export const TOMADAS: Tomada[] = [
  { clipe: "150216", de: 1.0, dur: 2.9, palavra: "O FUTURO" },
  { clipe: "170915", de: 2.0, dur: C, palavra: "NASCE" },
  { clipe: "171743", de: 2.0, dur: C, palavra: "AQUI" },
  { clipe: "150426", de: 3.0, dur: 2 * C, palavra: "BAIRRO\nDO RECIFE" },
  { clipe: "171013", de: 1.0, dur: C },
  { clipe: "150253", de: 4.0, dur: C },
  { clipe: "150524", de: 5.0, dur: C },
  { clipe: "171918", de: 0.5, dur: 2 * C, palavra: "REC'N'PLAY 26" },
  { clipe: "170951", de: 2.0, dur: C },
  { clipe: "150830", de: 2.0, dur: 2 * C },
  { clipe: "151646", de: 0.5, dur: 2 * C, palavra: "13 NOV" },
];
export const CARTELA_S = 4 * 1.6724;
export const duracaoAbertura = () => TOMADAS.reduce((s, t) => s + t.dur, 0) + CARTELA_S;

const TomadaRua: React.FC<{ t: Tomada; vertical: boolean }> = ({ t, vertical }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, 0.3 * fps, durationInFrames], [1.14, 1.04, 1.0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: PRETO }}>
      <Video
        src={staticFile(`broll/${t.clipe}.mp4`)}
        trimBefore={Math.round(t.de * fps)}
        volume={0.12}
        style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(z), filter: FILTRO_RUA }}
      />
      {t.palavra ? <PalavraGigante texto={t.palavra} escala={vertical ? 0.8 : 1} y={vertical ? 0.42 : 0.5} /> : null}
    </AbsoluteFill>
  );
};

// Placa do auditório: só realça a legenda do local por cima do clipe da placa.
const Local: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: vertical ? "center" : "flex-start", padding: vertical ? "0 0 330px" : "0 0 90px 90px" }}>
      <div
        style={{
          opacity: a,
          translate: `${(1 - a) * -30}px 0`,
          background: PRETO,
          borderRadius: 18,
          padding: "16px 28px 18px",
          textAlign: vertical ? "center" : "left",
        }}
      >
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: ROSA }}>✳ 13 NOV · 15:20H</div>
        <div style={{ ...CONDENSADA, fontSize: vertical ? 64 : 60, lineHeight: 1, color: "#FFFFFF", marginTop: 6 }}>
          Secretaria da Mulher de PE · Auditório
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ORDEM: Pessoa[] = ["C", "A", "B", "D"];
const RETRATO: Record<Pessoa, string> = { A: "raissa", B: "malu", C: "zenuel", D: "guimas" };

// Cartela igual ao card oficial: preto, logo, etiqueta "Tecnologia", 4 retratos com nome
// laranja, faixa roxa e o título em condensada laranja.
export const Cartela: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const ent = (ini: number, t = 0.5) =>
    interpolate(frame, [ini * fps, (ini + t) * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  const cardW = vertical ? 470 : 360;
  const cardH = vertical ? 450 : 440;
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO }}>
      <AbsoluteFill
        style={{
          background: vertical
            ? "linear-gradient(180deg, rgba(0,0,0,0) 22%, rgba(122,43,226,0.95) 46%, rgba(192,75,224,0.9) 58%, rgba(0,0,0,0) 72%)"
            : "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(122,43,226,0.95) 58%, rgba(192,75,224,0.9) 70%, rgba(0,0,0,0) 80%)",
          opacity: ent(0.1, 0.8),
        }}
      />
      <div style={{ position: "absolute", left: vertical ? 70 : 90, top: vertical ? 120 : 60, opacity: ent(0) }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
          <LogoRP largura={vertical ? 420 : 380} />
          <div style={{ ...CONDENSADA, fontWeight: 500, fontSize: vertical ? 110 : 100, lineHeight: 0.8, color: "#fff", marginBottom: vertical ? 22 : 18 }}>
            26
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: vertical ? 330 : 230,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: vertical ? 28 : 36,
          padding: vertical ? "0 50px" : 0,
        }}
      >
        {ORDEM.map((p, i) => {
          const a = ent(0.25 + i * 0.12);
          const pe = PESSOAS[p];
          const [nome1, ...resto] = pe.nome.replace(" (Malu)", "").split(" ");
          return (
            <div
              key={p}
              style={{
                width: cardW,
                height: cardH,
                borderRadius: 34,
                overflow: "hidden",
                position: "relative",
                opacity: a,
                translate: `0 ${(1 - a) * 50}px`,
              }}
            >
              <Img
                src={staticFile(`midia/retrato-${RETRATO[p]}.jpg`)}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%" }}
              />
              <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 100%)" }} />
              <div style={{ position: "absolute", left: 22, right: 18, bottom: 18 }}>
                <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: vertical ? 24 : 20, color: "#fff" }}>
                  {p === "C" ? "Mediador" : "Palestrante"}
                </div>
                <div style={{ ...CONDENSADA, fontSize: vertical ? 64 : 50, lineHeight: 0.92, color: LARANJA }}>
                  {nome1}
                  <br />
                  {p === "B" ? "Luísa (Malu)" : resto.join(" ")}
                </div>
                <div style={{ fontFamily: fonteTexto, fontWeight: 600, fontSize: vertical ? 22 : 18, color: "#fff", marginTop: 6 }}>
                  {pe.cargo}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: vertical ? 60 : 90,
          right: vertical ? 60 : 90,
          bottom: vertical ? 150 : 70,
          opacity: ent(0.9),
          translate: `0 ${(1 - ent(0.9)) * 30}px`,
        }}
      >
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: vertical ? 30 : 24, letterSpacing: 6, color: ROSA }}>
          TECNOLOGIA ✳
        </div>
        <div
          style={{
            ...CONDENSADA,
            fontSize: vertical ? 74 : Math.min(76, width / 22),
            lineHeight: 0.98,
            color: LARANJA,
            marginTop: 10,
          }}
        >
          {vertical ? TITULO_PAINEL.join(" ") : `${TITULO_PAINEL[0]} ${TITULO_PAINEL[1]}`}
          {vertical ? null : (
            <>
              <br />
              {TITULO_PAINEL[2]}
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Abertura: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const { fps } = useVideoConfig();
  let acc = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: PRETO }}>
      {TOMADAS.map((t) => {
        const from = Math.round(acc * fps);
        acc += t.dur;
        return (
          <Sequence key={t.clipe} from={from} durationInFrames={Math.round(t.dur * fps)} premountFor={fps}>
            <TomadaRua t={t} vertical={vertical} />
            {t.clipe === "150830" ? <Local vertical={vertical} /> : null}
          </Sequence>
        );
      })}
      <Sequence from={Math.round(acc * fps)} durationInFrames={Math.round(CARTELA_S * fps)}>
        <Cartela vertical={vertical} />
      </Sequence>
    </AbsoluteFill>
  );
};
