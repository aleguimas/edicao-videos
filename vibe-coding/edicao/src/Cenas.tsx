import type React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Cantos } from "./Cantos";
import { confianca, ENTRADA_ITENS, T, xCarrinho, XP } from "./curva";
import { AZUL_GUIMAS, DEGRADE_BARRA, fonteMono, fonteTexto, NAVY_VIDRO, textoDegrade, TITULO } from "./fonte";

export const VERMELHO = "#FF4D6A";
const DEGRADE_VERMELHO = "linear-gradient(90deg, #FF8FA3, #FF3D5A)";
const textoVermelho: React.CSSProperties = { ...textoDegrade, backgroundImage: DEGRADE_VERMELHO };

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.16, 1, 0.3, 1);

// entrada (0→1) e saída (0→1) de um elemento que vive de `de` até `ate`
const vida = (f: number, de: number, ate: number, entra = 10, sai = 8) => ({
  e: interpolate(f, [de, de + entra], [0, 1], { ...cl, easing: suave }),
  s: interpolate(f, [ate - sai, ate], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) }),
});

const LARGURA_UTIL = 900;
const caber = (texto: string, tamanho: number, largura = LARGURA_UTIL) =>
  Math.min(tamanho, largura / (texto.length * 0.6));

// ---------- Fundo ----------
export const Fundo: React.FC = () => {
  const f = useCurrentFrame();
  const naQueda = f >= T.queda && f < T.rebobinar;
  const vermelho = interpolate(f, [T.queda - 5, T.queda + 10, T.rebobinar, T.virada], [0, 1, 1, 0], cl);
  const pulso = naQueda ? 0.75 + 0.25 * Math.sin(f * 0.25) : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F24" }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 15% 12%, rgba(63,88,184,0.45), transparent 55%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 90% 88%, rgba(91,75,196,0.40), transparent 55%)" }} />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(255,40,80,0.45), transparent 65%)",
          opacity: vermelho * pulso,
        }}
      />
    </AbsoluteFill>
  );
};

export const Vinheta: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(4,6,18,0.7) 100%)" }} />
);

// ---------- Barra de progresso, medidor de confiança e assinatura ----------
export const Hud: React.FC<{ readonly fimAssinatura?: number }> = ({ fimAssinatura = T.fechamento }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const x = xCarrinho(f);
  const c = Math.round(confianca(x) * 100);
  const caindo = x > XP + 10 && f < T.rebobinar;
  const vis = interpolate(f, [95, 110, T.rebobinar - 4, T.rebobinar + 6], [0, 1, 1, 0], cl);
  const assinatura = interpolate(f, [fimAssinatura - 10, fimAssinatura], [0.7, 0], cl);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(f / durationInFrames) * 100}%`, backgroundImage: DEGRADE_BARRA }} />
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 96,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: vis,
          fontFamily: fonteMono,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 3,
          color: caindo ? "#FF8FA3" : AZUL_GUIMAS,
        }}
      >
        <span>CONFIANÇA</span>
        <div style={{ flex: 1, height: 14, borderRadius: 7, backgroundColor: "rgba(143,169,230,0.18)", overflow: "hidden" }}>
          <div
            style={{
              width: `${c}%`,
              height: "100%",
              borderRadius: 7,
              backgroundImage: caindo ? DEGRADE_VERMELHO : DEGRADE_BARRA,
            }}
          />
        </div>
        <span style={{ width: 90, textAlign: "right", color: "#FFFFFF" }}>{c}%</span>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 70,
          width: "100%",
          textAlign: "center",
          fontFamily: fonteMono,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 2,
          color: AZUL_GUIMAS,
          opacity: assinatura,
        }}
      >
        @aleguimas
      </div>
    </AbsoluteFill>
  );
};

// ---------- Cartão de frase (padrão @aleguimas) ----------
export const Cartao: React.FC<{
  readonly f: number;
  readonly de: number;
  readonly ate: number;
  readonly etiqueta: string;
  readonly linha1: string;
  readonly linha2: string;
  readonly tamanho?: number;
  readonly topo?: number;
  readonly queda?: boolean;
}> = ({ f, de, ate, etiqueta, linha1, linha2, tamanho = 112, topo = 190, queda = false }) => {
  if (f < de || f >= ate) return null;
  const { e, s } = vida(f, de, ate);
  const p2 = interpolate(f, [de + 6, de + 16], [0, 1], { ...cl, easing: suave });
  const bate = interpolate(f, [de + 6, de + 11, de + 18], [0.6, 1.12, 1], cl);
  const cor = queda ? VERMELHO : AZUL_GUIMAS;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: topo,
        display: "flex",
        justifyContent: "center",
        opacity: e * (1 - s),
        scale: String((0.86 + 0.14 * e) * (1 + s * 0.06)),
        translate: `0px ${(1 - e) * 50 - s * 30}px`,
        filter: `blur(${s * 8}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          padding: "30px 46px 38px",
          borderRadius: 24,
          backgroundColor: NAVY_VIDRO,
          border: `1.5px solid ${queda ? "rgba(255,77,106,0.45)" : "rgba(143,169,230,0.35)"}`,
          boxShadow: "0 24px 70px rgba(5,8,25,0.55)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          ...TITULO,
          lineHeight: 1.02,
          textTransform: "uppercase",
          letterSpacing: "-1px",
          whiteSpace: "nowrap",
        }}
      >
        <Cantos margem={-14} tamanho={[70, 52]} espessura={4} style={queda ? { borderColor: VERMELHO } : undefined} />
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: cor, marginBottom: 6 }}>{etiqueta}</div>
        <div style={{ color: "#FFFFFF", fontSize: caber(linha1, tamanho * 0.82) }}>{linha1}</div>
        <div
          style={{
            fontSize: caber(linha2, tamanho),
            opacity: p2,
            scale: String(bate),
            ...(queda ? textoVermelho : textoDegrade),
          }}
        >
          {linha2}
        </div>
      </div>
    </div>
  );
};

export const Rotulos: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Cartao f={f} de={100} ate={186} etiqueta="DIA 1 · 09:00" linha1="ABRI O" linha2="CURSOR." />
      <Cartao f={f} de={190} ate={292} etiqueta="DIA 1 · 09:04" linha1="APP PRONTO" linha2="EM 4 MINUTOS." />
      <Cartao f={f} de={298} ate={T.topo + 4} etiqueta="DIA 3" linha1="LANCEI MEU" linha2="SAAS!" />
      <Cartao f={f} de={T.queda + 4} ate={T.chave} etiqueta="DIA 4 · 02:13" linha1="O LOGIN" linha2="QUEBROU." queda />
      <Cartao f={f} de={T.chave + 4} ate={T.fatura} etiqueta="DIA 9" linha1="VAZEI A CHAVE" linha2="DA API." queda />
      <Cartao f={f} de={T.fatura + 4} ate={T.chao} etiqueta="DIA 30" linha1="R$ 2.340" linha2="DE API?!" queda />
      <Cartao f={f} de={T.chao + 16} ate={T.rebobinar} etiqueta="DIA 31" linha1="QUEM VAI PAGAR" linha2="ESSA CONTA?" queda />
    </AbsoluteFill>
  );
};

// ---------- Gancho ----------
export const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= 100) return null;
  const { e, s } = vida(f, 0, 100, 12, 14);
  const l2 = interpolate(f, [12, 22], [0, 1], { ...cl, easing: suave });
  const bate = interpolate(f, [12, 17, 24], [0.6, 1.12, 1], cl);
  const pergunta = interpolate(f, [34, 46], [0, 1], { ...cl, easing: suave });
  return (
    <AbsoluteFill style={{ opacity: 1 - s, filter: `blur(${s * 10}px)`, translate: `0px ${-s * 40}px` }}>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", ...TITULO, textTransform: "uppercase", lineHeight: 1.02, letterSpacing: "-1px" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: AZUL_GUIMAS, opacity: e, marginBottom: 22 }}>VIDA DE VIBE CODER</div>
        <div style={{ fontSize: 104, color: "#FFFFFF", opacity: e, translate: `0px ${(1 - e) * 30}px` }}>TODO VIBE CODER</div>
        <div style={{ fontSize: 112, opacity: l2, scale: String(bate), ...textoDegrade }}>PASSA POR</div>
        <div style={{ fontSize: 112, opacity: l2, scale: String(bate), ...textoDegrade }}>ESSA CURVA.</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1560,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonteTexto,
          fontWeight: 600,
          fontSize: 50,
          color: "#FFFFFF",
          opacity: pergunta,
          translate: `0px ${(1 - pergunta) * 24}px`,
        }}
      >
        Em qual ponto você está?
      </div>
    </AbsoluteFill>
  );
};

// ---------- Widgets da parte de baixo ----------
const Painel: React.FC<{ readonly f: number; readonly de: number; readonly ate: number; readonly children: React.ReactNode; readonly borda?: string; readonly topo?: number }> = ({
  f,
  de,
  ate,
  children,
  borda = "rgba(143,169,230,0.35)",
  topo = 1380,
}) => {
  if (f < de || f >= ate) return null;
  const { e, s } = vida(f, de, ate, 12, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        top: topo,
        borderRadius: 26,
        backgroundColor: "rgba(10,14,34,0.9)",
        border: `1.5px solid ${borda}`,
        boxShadow: "0 24px 70px rgba(5,8,25,0.6)",
        opacity: e * (1 - s),
        translate: `0px ${(1 - e) * 80 + s * 30}px`,
        scale: String(0.94 + 0.06 * e),
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

const PROMPT = "cria um SaaS de agendamento com login e pagamento";

export const Terminal: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [112, 150], [0, PROMPT.length], cl));
  const cursor = Math.floor(f / 8) % 2 === 0 ? "▍" : " ";
  const linha = (de: number, texto: string) => (
    <div style={{ opacity: interpolate(f, [de, de + 6], [0, 1], cl), color: "#8DE0B5" }}>{texto}</div>
  );
  return (
    <Painel f={f} de={104} ate={186}>
      <div style={{ display: "flex", gap: 10, padding: "18px 24px", borderBottom: "1px solid rgba(143,169,230,0.2)", alignItems: "center" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: c }} />
        ))}
        <div style={{ marginLeft: 14, fontFamily: fonteMono, fontSize: 22, color: "#8E97BD" }}>agente · novo projeto</div>
      </div>
      <div style={{ padding: "26px 32px 32px", fontFamily: fonteMono, fontSize: 34, lineHeight: 1.45, color: "#FFFFFF" }}>
        <div>
          <span style={{ color: "#B4A3F7" }}>&gt; </span>
          {PROMPT.slice(0, n)}
          {f < 156 ? cursor : ""}
        </div>
        {linha(156, "✓ 47 arquivos gerados")}
        {linha(166, "✓ login e pagamento: ok")}
      </div>
    </Painel>
  );
};

export const Cronometro: React.FC = () => {
  const f = useCurrentFrame();
  const seg = Math.round(interpolate(f, [196, 250], [0, 239], { ...cl, easing: Easing.out(Easing.quad) }));
  const mm = String(Math.floor(seg / 60)).padStart(2, "0");
  const ss = String(seg % 60).padStart(2, "0");
  const ok = interpolate(f, [254, 262], [0, 1], { ...cl, easing: suave });
  return (
    <Painel f={f} de={194} ate={292}>
      <div style={{ padding: "30px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: fonteMono, fontSize: 24, letterSpacing: 3, color: AZUL_GUIMAS }}>TEMPO DE DESENVOLVIMENTO</div>
          <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 120, color: "#FFFFFF", lineHeight: 1.1 }}>
            {mm}:{ss}
          </div>
        </div>
        <div
          style={{
            opacity: ok,
            scale: String(0.6 + 0.4 * ok),
            padding: "16px 22px",
            borderRadius: 16,
            backgroundColor: "rgba(40,200,120,0.16)",
            border: "1.5px solid rgba(80,220,150,0.6)",
            fontFamily: fonteMono,
            fontWeight: 700,
            fontSize: 26,
            color: "#8DE0B5",
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          ✓ NO AR
        </div>
      </div>
    </Painel>
  );
};

export const Contador: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [304, 372], [0, 1248], { ...cl, easing: Easing.out(Easing.cubic) }));
  return (
    <Painel f={f} de={300} ate={T.topo + 4}>
      <div style={{ padding: "28px 36px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: fonteMono, fontSize: 24, letterSpacing: 3, color: AZUL_GUIMAS }}>NOVOS CADASTROS</div>
          <div style={{ ...TITULO, fontSize: 130, lineHeight: 1, ...textoDegrade }}>{n.toLocaleString("pt-BR")}</div>
        </div>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 30, color: "#8DE0B5", marginBottom: 18 }}>↑ +{Math.min(99, Math.round(n / 14))} agora</div>
      </div>
    </Painel>
  );
};

export const Confete: React.FC = () => {
  const f = useCurrentFrame();
  const t = f - 300;
  if (t < 0 || t > 70) return null;
  const cores = ["#8DB0FF", "#B4A3F7", "#FFFFFF", "#9A7BF0", "#FFE48A"];
  return (
    <AbsoluteFill>
      {Array.from({ length: 70 }, (_, i) => {
        const a = random(`a${i}`) * Math.PI * 2;
        const v = 9 + random(`v${i}`) * 16;
        const x = 520 + Math.cos(a) * v * t;
        const y = 1000 + Math.sin(a) * v * t * 0.8 + 0.45 * t * t;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 14,
              height: 24,
              borderRadius: 3,
              backgroundColor: cores[i % cores.length],
              rotate: `${t * (8 + random(`r${i}`) * 14)}deg`,
              opacity: interpolate(t, [50, 70], [1, 0], cl),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Topo: o celular vibra ----------
export const Vibra: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.topo + 6 || f >= T.queda + 2) return null;
  const e = interpolate(f, [T.topo + 6, T.topo + 16], [0, 1], { ...cl, easing: suave });
  const tremendo = (f >= 400 && f < 410) || (f >= 425 && f < 435);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 1440,
        display: "flex",
        justifyContent: "center",
        opacity: e,
        translate: `${tremendo ? Math.sin(f * 3) * 12 : 0}px ${(1 - e) * 40}px`,
      }}
    >
      <div
        style={{
          padding: "22px 36px",
          borderRadius: 999,
          backgroundColor: "rgba(245,246,252,0.96)",
          color: "#0C1128",
          fontFamily: fonteTexto,
          fontWeight: 700,
          fontSize: 38,
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
        }}
      >
        <span style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: VERMELHO }} />1 nova notificação
      </div>
    </div>
  );
};

// ---------- Notificações da queda ----------
const Notificacao: React.FC<{
  readonly f: number;
  readonly de: number;
  readonly ate: number;
  readonly icone: string;
  readonly app: string;
  readonly titulo: string;
  readonly corpo: string;
}> = ({ f, de, ate, icone, app, titulo, corpo }) => {
  if (f < de || f >= ate) return null;
  const { e, s } = vida(f, de, ate, 10, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1390,
        padding: "26px 30px",
        borderRadius: 30,
        backgroundColor: "rgba(245,246,252,0.97)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        display: "flex",
        gap: 24,
        opacity: e * (1 - s),
        translate: `0px ${(1 - e) * -120 + s * 30}px`,
        scale: String(0.92 + 0.08 * e),
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          flexShrink: 0,
          borderRadius: 20,
          backgroundColor: VERMELHO,
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...TITULO,
          fontSize: 50,
        }}
      >
        {icone}
      </div>
      <div style={{ flex: 1, minWidth: 0, fontFamily: fonteTexto, color: "#0C1128" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#5A6285", fontWeight: 600 }}>
          <span>{app}</span>
          <span>agora</span>
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, marginTop: 4 }}>{titulo}</div>
        <div style={{ fontSize: 31, fontWeight: 500, color: "#2B3358", marginTop: 4, lineHeight: 1.25 }}>{corpo}</div>
      </div>
    </div>
  );
};

export const Notificacoes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Notificacao f={f} de={T.queda + 8} ate={T.chave} icone="!" app="Monitor do app" titulo="Erro 500 em /login" corpo="Sessão inválida. 312 usuários sem acesso." />
      <Notificacao
        f={f}
        de={T.chave + 8}
        ate={T.fatura}
        icone="⚠"
        app="Alerta de segurança"
        titulo="Chave de API exposta"
        corpo="API_KEY=sk-live-•••• encontrada em repositório público."
      />
    </AbsoluteFill>
  );
};

export const Fatura: React.FC = () => {
  const f = useCurrentFrame();
  const valor = interpolate(f, [T.fatura + 12, T.fatura + 92], [47, 2340], { ...cl, easing: Easing.in(Easing.cubic) });
  const req = interpolate(f, [T.fatura + 12, T.fatura + 92], [0.2, 18.4], { ...cl, easing: Easing.in(Easing.cubic) });
  const fim = f >= T.fatura + 92;
  const pulso = fim ? interpolate(f, [T.fatura + 92, T.fatura + 97, T.fatura + 104], [1, 1.08, 1], cl) : 1;
  return (
    <Painel f={f} de={T.fatura + 6} ate={T.chao + 2} borda="rgba(255,77,106,0.6)">
      <div style={{ padding: "26px 36px 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonteMono, fontSize: 24, letterSpacing: 3, color: "#FF8FA3" }}>
          <span>FATURA DE API</span>
          <span>NOVEMBRO</span>
        </div>
        <div style={{ ...TITULO, fontSize: 132, lineHeight: 1.05, color: fim ? VERMELHO : "#FFFFFF", scale: String(pulso), transformOrigin: "left center" }}>
          R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonteMono, fontSize: 26, color: "#C9D0EA", marginTop: 6 }}>
          <span>{req.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} mi de requisições</span>
          <span style={{ color: "#FF8FA3" }}>sem limite</span>
        </div>
      </div>
    </Painel>
  );
};

// No chão: as notificações se empilham
export const Pilha: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.chao + 20 || f >= T.rebobinar) return null;
  const itens = [
    { t: "Erro 500 em /login", d: 0 },
    { t: "Chave de API exposta", d: 5 },
    { t: "Fatura: R$ 2.340,00", d: 10 },
    { t: "Cliente pediu reembolso", d: 15 },
  ];
  const s = interpolate(f, [T.rebobinar - 8, T.rebobinar], [0, 1], cl);
  return (
    <AbsoluteFill style={{ opacity: 1 - s }}>
      {itens.map((it, i) => {
        const e = interpolate(f, [T.chao + 20 + it.d, T.chao + 30 + it.d], [0, 1], { ...cl, easing: suave });
        return (
          <div
            key={it.t}
            style={{
              position: "absolute",
              left: 90 + i * 10,
              right: 90 - i * 10,
              top: 1340 + i * 82,
              padding: "18px 26px",
              borderRadius: 22,
              backgroundColor: "rgba(245,246,252,0.96)",
              boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
              fontFamily: fonteTexto,
              fontWeight: 700,
              fontSize: 32,
              color: "#0C1128",
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: e,
              rotate: `${(i % 2 ? 1 : -1) * (1.5 + i * 0.6)}deg`,
              translate: `0px ${(1 - e) * -90}px`,
            }}
          >
            <span style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: VERMELHO, flexShrink: 0 }} />
            {it.t}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 1330,
          padding: "10px 20px",
          borderRadius: 999,
          backgroundColor: VERMELHO,
          color: "#FFFFFF",
          fontFamily: fonteMono,
          fontWeight: 800,
          fontSize: 30,
          opacity: interpolate(f, [T.chao + 42, T.chao + 48], [0, 1], cl),
          scale: String(interpolate(f, [T.chao + 42, T.chao + 47, T.chao + 54], [0.4, 1.2, 1], cl)),
        }}
      >
        +38
      </div>
    </AbsoluteFill>
  );
};

// Clarão vermelho no impacto
export const Impacto: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [797, 799, 812], [0, 0.55, 0], cl);
  return o > 0 ? <AbsoluteFill style={{ backgroundColor: VERMELHO, opacity: o, mixBlendMode: "screen" }} /> : null;
};

// ---------- Rebobinar ----------
export const Rebobinar: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.rebobinar || f >= T.virada + 4) return null;
  const o = interpolate(f, [T.rebobinar, T.rebobinar + 4, T.virada - 6, T.virada + 4], [0, 1, 1, 0], cl);
  const faixa = ((f - T.rebobinar) * 61) % 1920;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 6px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1920 - faixa, height: 90, background: "linear-gradient(180deg, transparent, rgba(200,210,255,0.22), transparent)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: (1920 - faixa * 1.7 + 3840) % 1920, height: 30, backgroundColor: "rgba(255,255,255,0.10)" }} />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 150,
          fontFamily: fonteMono,
          fontWeight: 800,
          fontSize: 48,
          letterSpacing: 4,
          color: "#FFFFFF",
          textShadow: "3px 0 0 rgba(255,60,90,0.8), -3px 0 0 rgba(80,160,255,0.8)",
          opacity: Math.floor(f / 6) % 2 === 0 ? 1 : 0.55,
        }}
      >
        ◀◀ VOLTANDO AO DIA 1
      </div>
    </AbsoluteFill>
  );
};

// ---------- Virada: o checklist ----------
const ITENS = [
  { titulo: "LOGIN TESTADO ANTES DE LANÇAR", evita: "o login quebrou" },
  { titulo: "CHAVE NO .ENV, NUNCA NO CÓDIGO", evita: "vazei a chave da API" },
  { titulo: "LIMITE DE GASTO NA API", evita: "R$ 2.340 de API" },
  { titulo: "COBRANÇA ANTES DO 1º USUÁRIO", evita: "quem vai pagar essa conta?" },
];

export const Virada: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.virada || f >= T.fechamento + 12) return null;
  const sai = interpolate(f, [T.fechamento - 4, T.fechamento + 12], [0, 1], cl);
  const e = interpolate(f, [T.virada + 2, T.virada + 14], [0, 1], { ...cl, easing: suave });
  const l2 = interpolate(f, [T.virada + 10, T.virada + 20], [0, 1], { ...cl, easing: suave });
  const bate = interpolate(f, [T.virada + 10, T.virada + 15, T.virada + 22], [0.6, 1.12, 1], cl);
  return (
    <AbsoluteFill style={{ opacity: 1 - sai, filter: `blur(${sai * 8}px)` }}>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", ...TITULO, textTransform: "uppercase", lineHeight: 1.02, letterSpacing: "-1px" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: AZUL_GUIMAS, opacity: e, marginBottom: 14 }}>O QUE FALTOU NA SUBIDA</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.25em", fontSize: 86 }}>
          <span style={{ color: "#FFFFFF", opacity: e, translate: `0px ${(1 - e) * 30}px` }}>DÁ PRA SUBIR</span>
          <span style={{ opacity: l2, scale: String(bate), ...textoDegrade }}>SEM CAIR.</span>
        </div>
      </div>
      {ITENS.map((it, i) => {
        const de = ENTRADA_ITENS[i];
        const p = interpolate(f, [de, de + 12], [0, 1], { ...cl, easing: suave });
        const risco = interpolate(f, [de + 12, de + 24], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
        return (
          <div
            key={it.titulo}
            style={{
              position: "absolute",
              left: 70,
              right: 70,
              top: 980 + i * 158,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "20px 28px",
              borderRadius: 22,
              backgroundColor: NAVY_VIDRO,
              border: "1.5px solid rgba(143,169,230,0.3)",
              opacity: p,
              translate: `${(1 - p) * 80}px 0px`,
            }}
          >
            <div
              style={{
                width: 66,
                height: 66,
                flexShrink: 0,
                borderRadius: 33,
                backgroundImage: DEGRADE_BARRA,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontFamily: fonteTexto,
                fontWeight: 800,
                fontSize: 38,
                scale: String(interpolate(f, [de + 2, de + 8, de + 14], [0.4, 1.2, 1], cl)),
              }}
            >
              ✓
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ ...TITULO, fontSize: caber(it.titulo, 50, 760), color: "#FFFFFF", textTransform: "uppercase", whiteSpace: "nowrap", lineHeight: 1.1 }}>
                {it.titulo}
              </div>
              <div style={{ position: "relative", display: "inline-block", fontFamily: fonteMono, fontSize: 26, color: "#FF8FA3", marginTop: 4 }}>
                {it.evita}
                <div style={{ position: "absolute", left: 0, top: "52%", height: 3, width: `${risco * 100}%`, backgroundColor: "#FF8FA3" }} />
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Fechamento ----------
export const Fechamento: React.FC<{ readonly de?: number; readonly ate?: number }> = ({ de = T.fechamento, ate = T.fim }) => {
  const f = useCurrentFrame();
  const D = { fechamento: de, fim: ate };
  if (f < D.fechamento - 6) return null;
  const fundo = interpolate(f, [D.fechamento - 6, D.fechamento + 10], [0, 0.88], cl);
  const e = interpolate(f, [D.fechamento + 4, D.fechamento + 16], [0, 1], { ...cl, easing: suave });
  const l2 = interpolate(f, [D.fechamento + 26, D.fechamento + 36], [0, 1], { ...cl, easing: suave });
  const bate = interpolate(f, [D.fechamento + 26, D.fechamento + 31, D.fechamento + 38], [0.6, 1.12, 1], cl);
  const assina = interpolate(f, [D.fechamento + 50, D.fechamento + 62], [0, 1], cl);
  const fim = interpolate(f, [D.fim - 12, D.fim], [0, 1], cl);
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(8,11,30,${fundo})` }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 20% 25%, rgba(63,88,184,0.35), transparent 55%)", opacity: fundo }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 85% 80%, rgba(91,75,196,0.35), transparent 55%)", opacity: fundo }} />
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
          <div style={{ fontSize: 110, color: "#FFFFFF", opacity: e, translate: `0px ${(1 - e) * 30}px` }}>A IA ACELERA</div>
          <div style={{ fontSize: 110, color: "#FFFFFF", opacity: e, translate: `0px ${(1 - e) * 30}px` }}>A SUBIDA.</div>
          <div style={{ height: 30 }} />
          <div style={{ fontSize: 118, opacity: l2, scale: String(bate), ...textoDegrade }}>FUNDAMENTO</div>
          <div style={{ fontSize: 118, opacity: l2, scale: String(bate), ...textoDegrade }}>EVITA A QUEDA.</div>
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
