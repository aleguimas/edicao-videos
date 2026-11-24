import type React from "react";
import { Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { TarjaAna } from "../ana/Ana";
import { type Cena, marca } from "../ana/voz";
import { CINZA, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Etiqueta, FotoAna, Surge } from "../verbas/Montagem";
import { Avatar, EXECUTORES, rampa } from "./comum";

type P = { readonly c: Cena };

// ---------- abertura-1: a Ana se apresenta e lança a ideia do escritório de agentes
export const Abertura1: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <FotoAna arquivo="ana-verde.jpg" x={120} dur={c.dur} />
      <Surge de={m("Oi") - 4} ate={m("Ana") - 6} style={{ left: 940, top: 300 }}>
        <div style={{ ...TITULO, fontSize: 150, ...textoDegrade }}>Oi!</div>
      </Surge>
      <Sequence from={m("Ana") - 4} layout="none">
        <TarjaAna x={940} y={170} />
      </Sequence>
      <Surge de={m("escritório") - 4} style={{ left: 940, top: 380 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 34, color: CINZA, marginBottom: 8 }}>Imagina a sua empresa com</div>
        <div style={{ ...TITULO, fontSize: 84, lineHeight: 1.02, color: "white" }}>UM ESCRITÓRIO</div>
        <div style={{ ...TITULO, fontSize: 84, lineHeight: 1.02, color: "white" }}>INTEIRO DE</div>
        <div style={{ ...TITULO, fontSize: 84, lineHeight: 1.12, ...textoDegrade }}>AGENTES DE IA</div>
      </Surge>
      {EXECUTORES.map((a, i) => (
        <Surge key={a.nome} de={m("lado") - 6 + i * 4} style={{ left: 940 + i * 150, top: 760 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 120 }}>
            <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={84} />
            <div style={{ fontFamily, fontWeight: 700, fontSize: 22, color: "white" }}>{a.nome}</div>
          </div>
        </Surge>
      ))}
    </>
  );
};

// ---------- abertura-2: o que os agentes fazem + conversam com o ERP
const VERBOS = ["pesquisam", "escrevem", "analisam", "criam", "acompanham"];
export const Abertura2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const liga = m("conversam");
  const traco = rampa(frame, liga, 14);
  return (
    <>
      <Surge de={0} style={{ left: 200, top: 130 }}>
        <Etiqueta>OS AGENTES</Etiqueta>
      </Surge>
      {VERBOS.map((v, i) => {
        const de = m(v) - 3;
        const prox = i < VERBOS.length - 1 ? m(VERBOS[i + 1]) - 3 : liga;
        const agora = frame >= de && frame < prox;
        return (
          <Surge key={v} de={de} style={{ left: 200, top: 190 + i * 112 }}>
            <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.1, ...(agora ? textoDegrade : { color: "white" }), opacity: agora || frame < liga ? 1 : 0.55 }}>
              {v.toUpperCase()}
            </div>
          </Surge>
        );
      })}
      {/* linha dos verbos até o sistema de gestão */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <line x1={980} y1={470} x2={980 + 170 * traco} y2={470} stroke={VERDE} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 16" />
      </svg>
      <Surge de={m("sistema") - 6} style={{ left: 1180, top: 300 }}>
        <div style={{ width: 520, boxSizing: "border-box", padding: "40px 44px", borderRadius: 24, background: "#141815", border: `2px solid ${VERDE}`, boxShadow: "0 0 70px rgba(60,224,30,0.25)" }}>
          <svg width={74} height={74} viewBox="0 0 24 24" fill="none" stroke={VERDE} strokeWidth={1.6} strokeLinecap="round">
            <ellipse cx={12} cy={5} rx={8} ry={3} />
            <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
          </svg>
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: VERDE, marginTop: 20 }}>E AINDA CONVERSAM COM</div>
          <div style={{ ...TITULO, fontSize: 56, color: "white", lineHeight: 1.05, marginTop: 10 }}>o sistema de gestão da empresa</div>
        </div>
      </Surge>
    </>
  );
};

// ---------- abertura-3: "Esse é o Agentic Office" + os quatro pilares
const PILARES = [
  ["setores", "SETORES"],
  ["regras", "REGRAS"],
  ["memória", "MEMÓRIA"],
  ["responsabilidade", "RESPONSABILIDADE"],
] as const;
export const Abertura3: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const sobe = interpolate(frame, [m("plataforma") - 6, m("plataforma") + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Surge de={m("Agentic") - 8} style={{ left: 0, right: 0, top: 330 - sobe * 200, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 980 - sobe * 340 }} />
      </Surge>
      <Surge de={m("plataforma") - 2} style={{ left: 0, right: 0, top: 400, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 66, color: "white", lineHeight: 1.1 }}>
          a <span style={textoDegrade}>IA faz parte</span> da operação
        </div>
      </Surge>
      <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center", gap: 24 }}>
        {PILARES.map(([p, t]) => (
          <div key={p} style={{ position: "relative", width: t.length * 23.4 + 64, height: 84 }}>
            <Surge de={m(p) - 4} style={{ left: 0, top: 0 }}>
              <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: VERDE, padding: "18px 30px", borderRadius: 12, border: `2px solid ${VERDE}`, background: "rgba(60,224,30,0.08)" }}>
                {t}
              </div>
            </Surge>
          </div>
        ))}
      </div>
    </>
  );
};
