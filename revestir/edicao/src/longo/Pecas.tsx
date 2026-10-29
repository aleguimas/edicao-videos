import { Video } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Flash } from "../Flash";
import { DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO, VERDE_SIMPLI } from "../fonte";
import { suave } from "./Graficos";
import { LogoRevestir } from "../LogoRevestir";

export const FILTRO_LONGO = "contrast(1.05) saturate(0.95)";

// Palavras-chave embaixo, no tempo da fala (versão 16:9 do PalavrasCineticas): linha 1 branca,
// linha 2 em verde com batida na hora em que é dita (`em2`, frames na Sequence).
export const Frase16: React.FC<{ readonly linha1: string; readonly linha2: string; readonly em2: number }> = ({ linha1, linha2, em2 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const saida = interpolate(frame, [durationInFrames - 0.3 * fps, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const caber = (t: string, max: number) => Math.min(max, 1500 / (t.length * 0.74));
  const palavra = (texto: string, atraso: number, verde: boolean, chave: string) => {
    const p = interpolate(frame, [atraso, atraso + 0.35 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
    const batida = verde ? interpolate(frame, [atraso, atraso + 0.12 * fps, atraso + 0.35 * fps], [0.6, 1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
    return (
      <span key={chave} style={{ display: "inline-block", color: "#FFFFFF", ...(verde ? textoDegrade : {}), opacity: p, translate: `0px ${(1 - p) * 50}px`, filter: `blur(${(1 - p) * 10}px)`, scale: String(batida) }}>
        {texto}
      </span>
    );
  };
  const linha = (t: string, ini: number, max: number, verde: boolean, chave: string) => (
    <div style={{ fontSize: caber(t, max), display: "flex", gap: "0.3em", justifyContent: "center", filter: "drop-shadow(0 5px 18px rgba(0,0,0,0.9)) drop-shadow(0 1px 3px rgba(0,0,0,0.8))" }}>
      {t.split(" ").map((p, i) => palavra(p, ini + i * 0.07 * fps, verde, `${chave}-${i}`))}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 110,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...TITULO,
        lineHeight: 1,
        letterSpacing: "-2px",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        opacity: 1 - saida,
        translate: `0px ${-saida * 50}px`,
        filter: `blur(${saida * 8}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          top: -60,
          bottom: -60,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(11,11,12,0.8) 0%, rgba(11,11,12,0.5) 45%, transparent 74%)",
          filter: "blur(20px)",
          opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        {linha(linha1, 0, 74, false, "l1")}
        {linha(linha2, em2, 110, true, "l2")}
      </div>
    </div>
  );
};

// Tomada de apoio 16:9 (viagem, loja) com zoom lento e clarão na entrada.
export const Tomada: React.FC<{ readonly arquivo: string; readonly inicioS?: number }> = ({ arquivo, inicioS = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entrada = interpolate(frame, [0, 0.35 * fps], [1.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const z = interpolate(frame, [0, durationInFrames], [1.03, 1.1]) * entrada;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: NAVY }}>
      <Video src={staticFile(`longo/${arquivo}.mp4`)} trimBefore={Math.round(inicioS * fps)} muted style={{ width: 1920, height: 1080, scale: String(z), filter: FILTRO_LONGO }} />
      <Sequence durationInFrames={6}>
        <Flash intensidade={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Título do vídeo sobre a vinheta da viagem.
export const TituloVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const saida = interpolate(frame, [durationInFrames - 8, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const e = (de: number) => suave(frame, de, 14);
  const batida = interpolate(frame, [10, 14, 24], [0.6, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: 1 - saida }}>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(11,11,12,0.88) 0%, rgba(11,11,12,0.6) 45%, rgba(11,11,12,0.1) 80%)" }} />
      <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 28, letterSpacing: "9px", color: VERDE_SIMPLI, opacity: e(0) }}>MISSÃO SIMPLÍ · FORTALEZA</div>
        <div style={{ ...TITULO, fontSize: 118, color: "#FFFFFF", letterSpacing: "-4px", lineHeight: 0.98, marginTop: 14, opacity: e(4), translate: `${(1 - e(4)) * -40}px 0px` }}>IA NA EMPRESA</div>
        <div style={{ ...TITULO, fontSize: 150, letterSpacing: "-6px", lineHeight: 0.98, ...textoDegrade, opacity: e(10), scale: String(batida), transformOrigin: "left center" }}>DE VERDADE</div>
        <div style={{ width: 160 * e(18), height: 8, borderRadius: 4, backgroundImage: DEGRADE_BARRA, margin: "26px 0 22px" }} />
        <div style={{ fontFamily: TITULO.fontFamily, fontWeight: 700, fontSize: 38, color: "#E6E6E6", opacity: e(20), maxWidth: 1000, lineHeight: 1.3 }}>
          Bastidores do letramento em IA e da implantação do Agentic Office na Revestir Home Center
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 40, opacity: e(28) }}>
          <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 380 }} />
          <div style={{ width: 3, height: 70, backgroundImage: DEGRADE_BARRA }} />
          <LogoRevestir largura={220} style={{ boxShadow: "none" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Encerramento: recado final, chamada para comentar/inscrever e as logos.
export const EncerramentoLongo: React.FC = () => {
  const frame = useCurrentFrame();
  const e = (de: number) => suave(frame, de, 14);
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, opacity: e(0) }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle at 25% 45%, rgba(60,224,30,0.16), transparent 50%)" }} />
      <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 28, letterSpacing: "9px", color: VERDE_SIMPLI, opacity: e(4) }}>RESUMO DA MISSÃO</div>
        <div style={{ ...TITULO, fontSize: 104, color: "#FFFFFF", letterSpacing: "-4px", lineHeight: 1, marginTop: 20, opacity: e(8) }}>DO LETRAMENTO</div>
        <div style={{ ...TITULO, fontSize: 130, letterSpacing: "-5px", lineHeight: 1, ...textoDegrade, opacity: e(14) }}>À IMPLANTAÇÃO</div>
        <div style={{ width: 160 * e(20), height: 8, borderRadius: 4, backgroundImage: DEGRADE_BARRA, margin: "34px 0 30px" }} />
        <div style={{ fontFamily: TITULO.fontFamily, fontWeight: 800, fontSize: 44, color: "#FFFFFF", opacity: e(26), maxWidth: 860, lineHeight: 1.25 }}>Na sua empresa, por qual processo a IA começaria?</div>
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 26, letterSpacing: "5px", color: "#C9CCC9", marginTop: 18, opacity: e(32) }}>COMENTA AQUI · INSCREVA-SE</div>
      </div>
      <div style={{ position: "absolute", right: 140, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40 }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 560, opacity: e(38), scale: String(0.9 + 0.1 * e(38)) }} />
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 24, letterSpacing: "7px", color: "#C9CCC9", opacity: e(44) }}>UMA PLATAFORMA</div>
        <Img src={staticFile("midia/logo-simpli-fundo-escuro.png")} style={{ width: 400, marginTop: -16, opacity: e(48), scale: String(0.9 + 0.1 * e(48)) }} />
        <div style={{ fontFamily: fonteMono, fontWeight: 600, fontSize: 30, letterSpacing: "4px", color: VERDE_SIMPLI, opacity: e(54) }}>simpli.ia.br</div>
      </div>
    </AbsoluteFill>
  );
};
