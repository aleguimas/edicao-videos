import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Cartao,
  Confete,
  Contador,
  Cronometro,
  Fatura,
  Fechamento,
  Gancho,
  Hud,
  Impacto,
  Notificacoes,
  Pilha,
  Rebobinar,
  Rotulos,
  Terminal,
  Vibra,
  Vinheta,
} from "../Cenas";
import { T, xCarrinho, XP } from "../curva";
import { AZUL_GUIMAS, fonteMono } from "../fonte";
import "../fonte";
import { V } from "./pista";
import { misturaPov, Pov3D } from "./Pov3D";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const tremor = (f: number, s: number) => Math.sin(f * 1.7 + s) * 0.6 + Math.sin(f * 3.1 + s * 2) * 0.4;

// ---------- Frente do carrinho (em primeiro plano) ----------
export const Frente: React.FC = () => {
  const f = useCurrentFrame();
  const b = misturaPov(f);
  if (b <= 0.01) return null;
  const naQueda = f >= T.queda && f < T.rebobinar;
  const solavanco = naQueda
    ? [T.queda, T.chave, T.fatura, T.chao].map((q) => interpolate(f - q, [0, 4, 26], [0, 1, 0], cl)).reduce((a, v) => Math.max(a, v), 0) +
      interpolate(f, [796, 800, 830], [0, 2, 0], cl)
    : 0;
  const amp = naQueda ? 3 + 16 * solavanco : f > T.subida && f < T.topo ? 1.5 : 0.6;
  const dx = tremor(f, 2) * amp;
  const dy = tremor(f, 7) * amp + (1 - b) * 520;
  const vermelho = f < T.virada && xCarrinho(f) > XP + 10;
  const tela = vermelho ? ["#FF6B81", "#C7193F"] : ["#8DB0FF", "#9A7BF0"];
  return (
    <AbsoluteFill style={{ translate: `${dx}px ${dy}px`, rotate: `${tremor(f, 4) * amp * 0.05}deg` }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="lataria" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2A3478" />
            <stop offset="1" stopColor="#0A0E26" />
          </linearGradient>
          <linearGradient id="borda" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6F8FF2" />
            <stop offset="0.5" stopColor="#B4A3F7" />
            <stop offset="1" stopColor="#6F8FF2" />
          </linearGradient>
          <linearGradient id="telaPov" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={tela[0]} />
            <stop offset="1" stopColor={tela[1]} />
          </linearGradient>
          <filter id="brilhoFrente" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation={10} />
          </filter>
        </defs>
        {/* laterais do carrinho */}
        <path d="M-40,1330 L95,1430 L175,2000 L-40,2000 Z" fill="url(#lataria)" />
        <path d="M-40,1330 L95,1430 L175,2000" fill="none" stroke="url(#borda)" strokeWidth={5} />
        <path d="M1120,1330 L985,1430 L905,2000 L1120,2000 Z" fill="url(#lataria)" />
        <path d="M1120,1330 L985,1430 L905,2000" fill="none" stroke="url(#borda)" strokeWidth={5} />
        {/* capô */}
        <path d="M-40,1735 Q540,1615 1120,1735 L1120,2000 L-40,2000 Z" fill="url(#lataria)" />
        <path d="M-40,1735 Q540,1615 1120,1735" fill="none" stroke="url(#borda)" strokeWidth={14} opacity={0.5} filter="url(#brilhoFrente)" />
        <path d="M-40,1735 Q540,1615 1120,1735" fill="none" stroke="url(#borda)" strokeWidth={5} />
        {/* notebook no painel */}
        <path d="M430,1700 L650,1700 L668,1712 L412,1712 Z" fill="#C9D4FF" opacity={0.9} />
        <path d="M444,1596 L636,1596 L648,1700 L432,1700 Z" fill="#11173A" stroke="#C9D4FF" strokeWidth={4} />
        <path d="M456,1606 L624,1606 L634,1690 L446,1690 Z" fill="url(#telaPov)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={470 + (i % 2) * 14} y={1622 + i * 16} width={70 + ((i * 37) % 60)} height={6} rx={3} fill="#FFFFFF" opacity={0.6} />
        ))}
        {/* barra de segurança */}
        <rect x={210} y={1790} width={660} height={52} rx={26} fill="#1E2660" stroke="#8FA9E6" strokeOpacity={0.6} strokeWidth={3} />
        <rect x={240} y={1798} width={600} height={10} rx={5} fill="#FFFFFF" opacity={0.18} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Virada: um item por arco ----------
const ITENS = [
  { l1: "LOGIN TESTADO", l2: "ANTES DE LANÇAR.", evita: "o login quebrou" },
  { l1: "CHAVE NO .ENV,", l2: "NUNCA NO CÓDIGO.", evita: "vazei a chave da API" },
  { l1: "LIMITE DE GASTO", l2: "NA API.", evita: "R$ 2.340 de API" },
  { l1: "COBRANÇA ANTES", l2: "DO 1º USUÁRIO.", evita: "quem vai pagar essa conta?" },
];

const Evita: React.FC<{ readonly de: number; readonly ate: number; readonly texto: string }> = ({ de, ate, texto }) => {
  const f = useCurrentFrame();
  if (f < de || f >= ate) return null;
  const e = interpolate(f, [de + 8, de + 18], [0, 1], cl);
  const risco = interpolate(f, [de + 20, de + 34], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const s = interpolate(f, [ate - 8, ate], [0, 1], cl);
  return (
    <div style={{ position: "absolute", top: 540, width: "100%", display: "flex", justifyContent: "center", opacity: e * (1 - s) }}>
      <div
        style={{
          position: "relative",
          padding: "12px 24px",
          borderRadius: 14,
          backgroundColor: "rgba(10,14,34,0.85)",
          fontFamily: fonteMono,
          fontWeight: 600,
          fontSize: 34,
          color: "#FF8FA3",
        }}
      >
        {texto}
        <div style={{ position: "absolute", left: 20, top: "50%", height: 4, width: `calc(${risco} * (100% - 40px))`, backgroundColor: "#FF8FA3" }} />
      </div>
    </div>
  );
};

const ViradaPov: React.FC = () => {
  const f = useCurrentFrame();
  const fins = [V.itens[1] - 4, V.itens[2] - 4, V.itens[3] - 4, V.drone];
  return (
    <AbsoluteFill>
      {ITENS.map((it, i) => (
        <Cartao key={it.l1} f={f} de={V.itens[i] - 6} ate={fins[i]} etiqueta={`O QUE FALTOU · ${i + 1}/4`} linha1={it.l1} linha2={it.l2} tamanho={104} />
      ))}
      {ITENS.map((it, i) => (
        <Evita key={it.evita} de={V.itens[i] - 6} ate={fins[i]} texto={it.evita} />
      ))}
      <Cartao f={f} de={V.drone + 8} ate={V.fechamento + 4} etiqueta="A CURVA CERTA" linha1="DÁ PRA SUBIR" linha2="SEM CAIR." tamanho={116} />
    </AbsoluteFill>
  );
};

const Etiqueta: React.FC = () => {
  const f = useCurrentFrame();
  // marca que identifica a pista nova logo depois do rebobinar
  const o = interpolate(f, [T.virada, T.virada + 10, V.itens[0] - 12, V.itens[0] - 4], [0, 1, 1, 0], cl);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 260, width: "100%", textAlign: "center", fontFamily: fonteMono, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: AZUL_GUIMAS, opacity: o }}>
      DIA 1 · DE NOVO, COM FUNDAMENTO
    </div>
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

export const DURACAO_POV = V.fim;

export const MontanhaRussaPov: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#070B1E" }}>
      <Pov3D />
      <Vinheta />
      <Frente />
      <Confete />
      <Gancho />
      <Rotulos />
      <Terminal />
      <Cronometro />
      <Contador />
      <Vibra />
      <Notificacoes />
      <Fatura />
      <Pilha />
      <Impacto />
      <Rebobinar />
      <Etiqueta />
      <ViradaPov />
      <Fechamento de={V.fechamento} ate={V.fim} />
      <Hud fimAssinatura={V.fechamento} />

      <Sequence from={T.subida} durationInFrames={T.virada - T.subida} premountFor={fps} name="trilha-queda">
        <Audio
          src={staticFile("audio/trilha-queda.wav")}
          volume={(f) =>
            interpolate(
              f + T.subida,
              [T.subida, T.subida + 20, T.topo - 8, T.topo + 4, T.queda - 2, T.queda, T.rebobinar, T.rebobinar + 14],
              [0, 1, 1, 0, 0, 0.42, 0.42, 0],
              cl,
            )
          }
        />
      </Sequence>
      <Sequence from={T.virada - 4} premountFor={fps} name="trilha-virada">
        <Audio src={staticFile("audio/trilha-virada-pov.wav")} volume={(f) => interpolate(f + T.virada - 4, [T.virada - 4, T.virada + 10, V.fim - 30, V.fim], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* vento: cresce na queda */}
      <Sequence from={T.topo} durationInFrames={T.rebobinar - T.topo + 10} premountFor={fps} name="vento">
        <Audio
          src={staticFile("audio/vento.wav")}
          volume={(f) => interpolate(f + T.topo, [T.topo, T.queda, T.queda + 10, T.chao + 20, T.rebobinar, T.rebobinar + 10], [0, 0.08, 0.5, 0.45, 0.2, 0], cl)}
        />
      </Sequence>

      <Som arquivo="riser.wav" em={0} volume={0.45} />
      <Som arquivo="whoosh.wav" em={58} volume={0.7} />
      <Sequence from={T.subida + 4} durationInFrames={T.topo - T.subida - 4} premountFor={fps} name="catraca">
        <Audio src={staticFile("audio/catraca.wav")} volume={0.3} />
      </Sequence>
      <Som arquivo="pop.wav" em={100} volume={0.5} />
      <Som arquivo="pop.wav" em={190} volume={0.5} />
      <Som arquivo="sucesso.wav" em={254} volume={0.45} />
      <Som arquivo="sucesso.wav" em={300} volume={0.5} />
      <Som arquivo="vibra.wav" em={400} volume={0.3} />
      <Som arquivo="vibra.wav" em={425} volume={0.3} />
      <Som arquivo="queda.wav" em={T.queda} volume={0.7} />
      <Som arquivo="ding.wav" em={T.queda + 8} volume={0.6} />
      <Som arquivo="whoosh.wav" em={T.chave} volume={0.6} />
      <Som arquivo="ding.wav" em={T.chave + 8} volume={0.6} />
      <Som arquivo="whoosh.wav" em={T.fatura} volume={0.6} />
      <Som arquivo="tiques.wav" em={T.fatura + 12} volume={0.5} />
      <Som arquivo="queda.wav" em={T.chao} volume={0.7} />
      <Som arquivo="impacto.wav" em={797} volume={0.9} />
      <Som arquivo="ding.wav" em={T.chao + 20} volume={0.35} />
      <Som arquivo="ding.wav" em={T.chao + 30} volume={0.35} />
      <Som arquivo="rebobinar.wav" em={T.rebobinar} volume={0.55} />
      <Som arquivo="pop.wav" em={V.itens[0]} volume={0.6} />
      <Som arquivo="pop.wav" em={V.itens[1]} volume={0.6} />
      <Som arquivo="pop.wav" em={V.itens[2]} volume={0.6} />
      <Som arquivo="pop.wav" em={V.itens[3]} volume={0.6} />
      <Som arquivo="whoosh.wav" em={V.drone} volume={0.6} />
      <Som arquivo="whoosh.wav" em={V.fechamento - 6} volume={0.5} />
    </AbsoluteFill>
  );
};
