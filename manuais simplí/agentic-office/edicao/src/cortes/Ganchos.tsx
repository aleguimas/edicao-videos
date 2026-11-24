import type React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Icone } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { Avatar, OUTROS, rampa, useMola } from "../apresentacao/comum";
import { Banco } from "../apresentacao/Erp";
import { fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Fundo, Surge } from "../verbas/Montagem";
import { ALTURA, LARGURA } from "./Vertical";

// Ganchos dos cortes: o texto da abertura (a palavra riscada fica na tela, em cinza, e a nova entra
// em degradê logo abaixo) e um visual do tema. A capa de cada corte é o mesmo gancho já pronto.
export type TextoG = {
  readonly rotulo: string;
  readonly linhas: readonly string[];
  readonly riscada: string;
  readonly novo: string;
  readonly tam?: number;
  readonly tamRiscada?: number;
  readonly tamNovo?: number;
  // palavras da fala em que a risca passa e a palavra nova entra
  readonly risca: string;
  readonly vira: string;
};
// k: 0 antes da virada, 1 depois
export type Visual = React.FC<{ readonly k: number }>;

const TextoGancho: React.FC<{ readonly g: TextoG; readonly risca: number; readonly vira: number; readonly atraso: number }> = ({ g, risca, vira, atraso }) => {
  const { tam = 118, tamRiscada = 100, tamNovo = 118 } = g;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...TITULO, lineHeight: 1, textTransform: "uppercase" }}>
      <Surge de={atraso} style={{ position: "relative" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 34, letterSpacing: 5, color: VERDE, textAlign: "center", marginBottom: 16 }}>{g.rotulo}</div>
      </Surge>
      {g.linhas.map((l, i) => (
        <Surge key={l} de={atraso + 2 + i * 2} style={{ position: "relative" }}>
          <div style={{ fontSize: tam, color: "white", letterSpacing: -4 }}>{l}</div>
        </Surge>
      ))}
      <Surge de={atraso + 4 + g.linhas.length * 2} style={{ position: "relative" }}>
        <div style={{ position: "relative", fontSize: tamRiscada, letterSpacing: -3, color: "#8A8A8A", marginTop: 8 }}>
          {g.riscada}
          <div style={{ position: "absolute", left: -12, top: "46%", height: 12, borderRadius: 6, width: `calc(${risca} * (100% + 24px))`, background: "white", opacity: risca > 0 ? 1 : 0 }} />
        </div>
      </Surge>
      <div style={{ fontSize: tamNovo, letterSpacing: -4, lineHeight: 1.16, opacity: vira, transform: `scale(${0.7 + 0.3 * vira})` }}>
        <span style={textoDegrade}>{g.novo}</span>
      </div>
    </div>
  );
};

export const GanchoV: React.FC<{ readonly c: Cena; readonly g: TextoG; readonly V: Visual }> = ({ c, g, V }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const risca = rampa(frame, m(g.risca) - 2, 10);
  const vira = useMola(m(g.vira) - 2);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 1300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 50 }}>
      <TextoGancho g={g} risca={risca} vira={vira} atraso={0} />
      <V k={vira} />
    </div>
  );
};

export const CapaV: React.FC<{ readonly g: TextoG; readonly V: Visual; readonly logo?: string }> = ({ g, V, logo = "midia/logo-agentic-office.png" }) => (
  <AbsoluteFill style={{ width: LARGURA, height: ALTURA }}>
    <Fundo />
    <div style={{ position: "absolute", left: 0, right: 0, top: 240, height: 1440, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.85))" }}>
      <Img src={staticFile(logo)} style={{ width: 360 }} />
      <TextoGancho g={g} risca={1} vira={1} atraso={-60} />
      <V k={1} />
    </div>
  </AbsoluteFill>
);

// ---------- visuais
const Ondas: React.FC<{ readonly n?: number; readonly h?: number }> = ({ n = 22, h = 90 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: h }}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ width: 10, borderRadius: 5, background: VERDE, height: h * (0.3 + 0.7 * Math.abs(Math.sin(frame / 5 + i * 1.3) * Math.sin(i * 0.7 + 1))) }} />
      ))}
    </div>
  );
};

export const VisualOlho: Visual = ({ k }) => {
  const frame = useCurrentFrame();
  const pulso = 1 + 0.05 * Math.sin(frame / 7);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      <div style={{ width: 300, height: 300, borderRadius: "50%", display: "grid", placeItems: "center", background: "#141815", border: `3px solid ${VERDE}`, boxShadow: `0 0 ${50 + 40 * k}px rgba(60,224,30,${0.25 + 0.3 * k})`, transform: `scale(${pulso})` }}>
        <Icone nome="olho" tam={170} cor={VERDE} />
      </div>
      <Ondas />
    </div>
  );
};

export const VisualRelatorio: Visual = ({ k }) => (
  <div style={{ position: "relative", width: 900, height: 320, fontFamily }}>
    <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", borderRadius: 24, border: "2px solid #2A2F2B", background: "#141815", padding: 36, opacity: 1 - k }}>
      <div style={{ fontFamily: fonteMono, fontSize: 30, color: "#9AA19C" }}>aguardando o relatório...</div>
      <div style={{ height: 22, borderRadius: 11, background: "#1F2420", marginTop: 30 }}>
        <div style={{ width: "34%", height: "100%", borderRadius: 11, background: "#5A615C" }} />
      </div>
    </div>
    <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", borderRadius: 24, border: `2px solid ${VERDE}`, background: "#141815", padding: 32, opacity: k, boxShadow: "0 0 60px rgba(60,224,30,0.25)" }}>
      <div style={{ background: "white", color: "#111", borderRadius: 14, padding: "16px 22px", fontSize: 36, fontWeight: 600, width: "fit-content", marginLeft: "auto" }}>Quanto vendemos ontem?</div>
      <div style={{ fontSize: 40, fontWeight: 600, color: "white", marginTop: 24, lineHeight: 1.25 }}>
        <b style={{ color: VERDE }}>R$ 247 mil</b>, 4% acima
        <br />
        do sábado passado.
      </div>
    </div>
  </div>
);

const RECURSOS: [string, string][] = [
  ["base", "CONHECIMENTO"],
  ["memoria", "MEMÓRIA"],
  ["varinha", "SKILLS"],
  ["integracoes", "FERRAMENTAS"],
];
export const VisualRecursos: Visual = ({ k }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, width: 920 }}>
    {RECURSOS.map(([ic, t]) => (
      <div key={t} style={{ height: 170, boxSizing: "border-box", borderRadius: 20, border: `2px solid ${k > 0.5 ? VERDE : "#2A2F2B"}`, background: "#141815", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Icone nome={ic} tam={62} cor={k > 0.5 ? VERDE : "#6B726D"} />
        <div style={{ ...TITULO, fontSize: 34, color: "white" }}>{t}</div>
      </div>
    ))}
  </div>
);

export const VisualReuniao: Visual = ({ k }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <Avatar nome={OUTROS.cora.nome} cor={OUTROS.cora.cor} foto={OUTROS.cora.foto} tam={200} brilho={k} />
      <Ondas n={18} h={120} />
    </div>
    <div style={{ display: "flex", gap: 14 }}>
      {["DECISÕES", "PRÓXIMOS PASSOS", "RESPONSÁVEIS"].map((t) => (
        <div key={t} style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 24, color: k > 0.5 ? "#0B0B0C" : VERDE, background: k > 0.5 ? VERDE : "transparent", border: `2px solid ${VERDE}`, borderRadius: 10, padding: "12px 16px" }}>
          {t}
        </div>
      ))}
    </div>
  </div>
);

const AREAS: [string, string][] = [
  ["estoque", "Estoque"],
  ["comercial", "Preços"],
  ["verbas", "Verbas"],
  ["conciliacao", "Conciliação"],
  ["prospeccao", "Prospecção"],
];
export const VisualAreas: Visual = ({ k }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, width: 960 }}>
      {AREAS.map(([ic, t], i) => {
        const s = k >= 1 ? 1 : interpolate(frame, [i * 6, i * 6 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, height: 120, boxSizing: "border-box", padding: "0 30px", borderRadius: 18, background: "#141815", border: `2px solid ${k > 0.5 ? VERDE : "#2A2F2B"}`, opacity: s }}>
            <Icone nome={ic} tam={54} cor={VERDE} />
            <span style={{ ...TITULO, fontSize: 40, color: "white" }}>{t}</span>
          </div>
        );
      })}
    </div>
  );
};

export const VisualCofre: Visual = ({ k }) => (
  <div style={{ position: "relative", width: 340, height: 340, borderRadius: "50%", display: "grid", placeItems: "center", background: "#141815", border: `3px solid ${k > 0.5 ? VERDE : "#2A2F2B"}`, boxShadow: `0 0 ${70 * k}px rgba(60,224,30,0.4)` }}>
    <Banco tam={180} cor={k > 0.5 ? VERDE : "#6B726D"} />
    <div style={{ position: "absolute", right: 6, bottom: 6, width: 110, height: 110, borderRadius: "50%", background: VERDE, display: "grid", placeItems: "center", transform: `scale(${k})` }}>
      <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke="#0B0B0C" strokeWidth={2.2} strokeLinecap="round">
        <rect x={5} y={11} width={14} height={10} rx={2} />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    </div>
  </div>
);

export const VisualApp: Visual = ({ k }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
    <div style={{ width: 400, background: "white", borderRadius: 10, overflow: "hidden", display: "grid", gridTemplateColumns: "1.3fr 1fr", fontFamily: "Arial, sans-serif", fontSize: 26, opacity: 1 - 0.5 * k }}>
      {["Obra", "Vendedor", "Aurora", "Paula", "Mirante", "Ricardo", "Jardins", "Marina", "Alto Verde", "Paula"].map((v, i) => (
        <div key={i} style={{ height: 66, padding: "0 12px", display: "flex", alignItems: "center", borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd", background: i < 2 ? "#1F6B2A" : "white", color: i < 2 ? "white" : "#222", fontWeight: i < 2 ? 700 : 400 }}>
          {v}
        </div>
      ))}
    </div>
    <svg width={80} height={60} viewBox="0 0 80 60" style={{ opacity: k }}>
      <path d="M4 30 H70 M50 10 L72 30 L50 50" fill="none" stroke={VERDE} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{ width: 240, height: 450, boxSizing: "border-box", borderRadius: 34, background: "#0E110F", border: "8px solid #2A2F2B", padding: "34px 18px", display: "flex", flexDirection: "column", gap: 14, opacity: k, transform: `translateY(${(1 - k) * 40}px)`, fontFamily }}>
      <div style={{ fontWeight: 800, fontSize: 24, color: "white" }}>Visitas às obras</div>
      {["Obra", "Vendedor", "Data"].map((f) => (
        <div key={f} style={{ height: 52, boxSizing: "border-box", padding: "0 12px", borderRadius: 8, border: "1px solid #2A2F2B", color: "#9AA19C", fontSize: 19, display: "flex", alignItems: "center" }}>
          {f}
        </div>
      ))}
      <div style={{ height: 58, borderRadius: 10, background: VERDE, color: "#0B0B0C", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 20, marginTop: "auto" }}>Registrar</div>
    </div>
  </div>
);
