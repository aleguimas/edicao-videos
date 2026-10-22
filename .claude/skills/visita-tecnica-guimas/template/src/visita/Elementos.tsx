import { Video } from "@remotion/media";
import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Cantos } from "../Cantos";
import { Flash } from "../Flash";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono, NAVY, textoDegrade, TITULO } from "../fonte";

// Cor da visita: contraste leve, saturação um pouco abaixo de 1 e um toque quente que
// segura o céu claro e o bege da camisa sem estourar. Igual para fala e imagens de apoio.
export const FILTRO_VISITA = "contrast(1.07) saturate(0.94) sepia(0.06) brightness(1.01)";

const suave = (frame: number, de: number, ate: number) =>
  interpolate(frame, [de, ate], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

// Logo oficial da Tramontina (SVG: faixa azul #00529A com letras brancas).
export const LogoTramontina: React.FC<{ readonly largura: number; readonly style?: React.CSSProperties }> = ({ largura, style }) => (
  <Img src={staticFile("midia/logo-tramontina.svg")} style={{ width: largura, ...style }} />
);

// Imagem de apoio em tela cheia por cima da fala (a voz continua por baixo): entra com
// clarão e um zoom que assenta, depois aproxima devagar até o fim.
export const Apoio: React.FC<{ readonly arquivo: string; readonly inicioS?: number; readonly foco?: readonly [number, number] }> = ({
  arquivo,
  inicioS = 0,
  foco = [540, 960],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entrada = interpolate(frame, [0, 0.4 * fps], [1.14, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const z = (1.04 + 0.08 * (frame / durationInFrames)) * entrada;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: NAVY }}>
      <Video
        src={staticFile(`midia/${arquivo}.mp4`)}
        trimBefore={Math.round(inicioS * fps)}
        muted
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          scale: String(z),
          transformOrigin: `${foco[0]}px ${foco[1]}px`,
          filter: FILTRO_VISITA,
        }}
      />
      <Sequence durationInFrames={6}>
        <Flash intensidade={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Vinheta logo depois do gancho: cortes rápidos da Tramontina no tempo da música, com a
// logo e o nome da visita no centro. Tira o vídeo do "selfie" e mostra onde estamos.
export const Vinheta: React.FC<{ readonly tomadas: readonly { arquivo: string; inicioS: number }[] }> = ({ tomadas }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const porTomada = Math.ceil(durationInFrames / tomadas.length);
  const saida = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logo = suave(frame, 4, 4 + 0.45 * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {tomadas.map((t, i) => (
        <Sequence key={t.arquivo} from={i * porTomada} durationInFrames={porTomada}>
          <Apoio arquivo={t.arquivo} inicioS={t.inicioS} />
        </Sequence>
      ))}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(12,17,40,0.82) 0%, rgba(12,17,40,0.55) 45%, rgba(12,17,40,0.25) 80%)",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34, opacity: saida }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 34, letterSpacing: "10px", color: AZUL_GUIMAS, opacity: suave(frame, 0, 10) }}>
          VISITA TÉCNICA
        </div>
        <div style={{ scale: String(0.8 + 0.2 * logo), opacity: logo, filter: "drop-shadow(0 8px 26px rgba(5,8,25,0.8))" }}>
          <LogoTramontina largura={820} />
        </div>
        <div style={{ width: 120 * suave(frame, 12, 24), height: 6, borderRadius: 3, backgroundImage: DEGRADE_BARRA }} />
        <div style={{ ...TITULO, fontSize: 64, letterSpacing: "-1px", color: "#FFFFFF", opacity: suave(frame, 16, 28), translate: `0px ${(1 - suave(frame, 16, 28)) * 30}px` }}>
          FARROUPILHA <span style={textoDegrade}>· RS</span>
        </div>
      </AbsoluteFill>
      <Cantos margem={56} />
    </AbsoluteFill>
  );
};

// Número grande que conta até o valor quando é dito (80 robôs, 30 mil posições...).
export const Numero: React.FC<{
  readonly antes: string;
  readonly valor: number;
  readonly depois: string;
  readonly emNumero: number; // s dentro da sequência em que o número é dito
  readonly topo?: number;
}> = ({ antes, valor, depois, emNumero, topo = 1180 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const f0 = emNumero * fps;
  const conta = interpolate(frame, [f0 - 4, f0 + 0.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const batida = interpolate(frame, [f0 + 0.6 * fps, f0 + 0.7 * fps, f0 + 0.9 * fps], [1, 1.1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const saida = interpolate(frame, [durationInFrames - 0.3 * fps, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const texto = Math.round(valor * conta).toLocaleString("pt-BR");
  const entra = (de: number) => suave(frame, de, de + 0.35 * fps);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: topo,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...TITULO,
        textTransform: "uppercase",
        letterSpacing: "-2px",
        lineHeight: 0.95,
        whiteSpace: "nowrap",
        opacity: 1 - saida,
        translate: `0px ${-saida * 80}px`,
        filter: `blur(${saida * 10}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: -50,
          bottom: -50,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(12,17,40,0.85) 0%, rgba(12,17,40,0.55) 45%, transparent 74%)",
          filter: "blur(18px)",
          opacity: entra(0),
        }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, filter: "drop-shadow(0 5px 18px rgba(5,8,25,0.9))" }}>
        <div style={{ fontSize: 84, color: "#FFFFFF", opacity: entra(0), translate: `0px ${(1 - entra(0)) * 40}px` }}>{antes}</div>
        <div style={{ fontSize: Math.min(250, 940 / (Math.max(texto.length, 3) * 0.62)), fontVariantNumeric: "tabular-nums", ...textoDegrade, opacity: entra(f0 - 6), scale: String(batida) }}>
          {texto}
        </div>
        <div style={{ fontSize: Math.min(96, 940 / (depois.length * 0.62)), color: "#FFFFFF", opacity: entra(f0 + 0.3 * fps), translate: `0px ${(1 - entra(f0 + 0.3 * fps)) * 40}px` }}>
          {depois}
        </div>
      </div>
    </div>
  );
};

// Capítulo no topo: diz em que parte da visita estamos (vídeo longo, quem chega no meio se acha).
export const Capitulo: React.FC<{ readonly numero: number; readonly linha1: string; readonly linha2: string }> = ({ numero, linha1, linha2 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = suave(frame, 0, 0.45 * fps);
  const saida = interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: p * (1 - saida), translate: `0px ${(1 - p) * -30}px` }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          padding: "18px 34px 22px",
          borderRadius: 20,
          backgroundColor: "rgba(12,17,40,0.8)",
          border: "1.5px solid rgba(143,169,230,0.3)",
          boxShadow: "0 18px 50px rgba(5,8,25,0.45)",
        }}
      >
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 21, letterSpacing: "6px", color: AZUL_GUIMAS }}>
          TRAMONTINA · PARTE {numero}
        </div>
        <div style={{ ...TITULO, fontSize: Math.min(52, 900 / ((linha1.length + linha2.length + 1) * 0.6)), lineHeight: 1, letterSpacing: "-1px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          <span style={{ color: "#FFFFFF" }}>{linha1} </span>
          <span style={textoDegrade}>{linha2}</span>
        </div>
      </div>
    </div>
  );
};

// Tarja de abertura: quem realizou a visita.
export const TarjaRealizacao: React.FC<{ readonly etiqueta: string; readonly nomes: string; readonly local: string }> = ({ etiqueta, nomes, local }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = suave(frame, 0, 0.45 * fps);
  const saida = interpolate(frame, [durationInFrames - 0.3 * fps, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 84, top: 1330, opacity: p * (1 - saida), translate: `${(1 - p) * -60}px 0px` }}>
      <div style={{ position: "relative", padding: "26px 40px 30px", borderRadius: 18, backgroundColor: "rgba(12,17,40,0.86)", boxShadow: "0 18px 50px rgba(5,8,25,0.5)" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 22, letterSpacing: "6px", color: AZUL_GUIMAS }}>{etiqueta}</div>
        <div style={{ width: 64 * p, height: 5, borderRadius: 3, backgroundImage: DEGRADE_BARRA, margin: "14px 0 16px" }} />
        <div style={{ ...TITULO, fontSize: 68, lineHeight: 1, letterSpacing: "-1px", color: "#FFFFFF", whiteSpace: "nowrap" }}>{nomes}</div>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 24, letterSpacing: "4px", color: "#C9D4FF", marginTop: 14 }}>{local}</div>
      </div>
    </div>
  );
};

// Encerramento com a foto oficial do grupo: aproximação lenta, logo e quem realizou.
export const FotoGrupo: React.FC<{ readonly etiqueta: string; readonly realizacao: string }> = ({ etiqueta, realizacao }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], [1.0, 1.08]);
  const entra = (de: number) => suave(frame, de, de + 0.45 * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      <Img
        src={staticFile("midia/foto-grupo.jpg")}
        style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover", scale: String(z), transformOrigin: "50% 55%", filter: FILTRO_VISITA }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,17,40,0.85) 0%, rgba(12,17,40,0.35) 24%, transparent 40%, transparent 68%, rgba(12,17,40,0.9) 86%)" }} />
      <div style={{ position: "absolute", top: 180, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: entra(4) }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 30, letterSpacing: "9px", color: AZUL_GUIMAS }}>{etiqueta}</div>
        <LogoTramontina largura={640} style={{ filter: "drop-shadow(0 6px 20px rgba(5,8,25,0.7))" }} />
      </div>
      <div style={{ position: "absolute", bottom: 210, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: entra(14), translate: `0px ${(1 - entra(14)) * 40}px` }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 500, fontSize: 24, letterSpacing: "6px", color: "#C9D4FF" }}>REALIZAÇÃO</div>
        <div style={{ ...TITULO, fontSize: 84, letterSpacing: "-2px", whiteSpace: "nowrap", ...textoDegrade }}>{realizacao}</div>
      </div>
      <Cantos margem={56} />
      <Sequence durationInFrames={6}>
        <Flash intensidade={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};
