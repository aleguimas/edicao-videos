import type React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { TarjaAna } from "../ana/Ana";
import { type Cena, marca, type Vozes } from "../ana/voz";
import { CINZA, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { CapaApresentacao } from "../apresentacao/CapaApresentacao";
import { Avatar, Chip, DIRETORIA, EXECUTORES, rampa, useMola } from "../apresentacao/comum";
import vozesApresentacao from "../voz-apresentacao.json";
import vozesCortes from "../voz-cortes.json";
import { Etiqueta, Fundo, montarRoteiro, Surge } from "../verbas/Montagem";
import { AgentesM } from "../mobile/Modulos";
import { Cabecalho, LARGURA, MontagemVertical, PALCO } from "./Vertical";

// Corte 1 (estreia do @agenticoffice.ia): uma diretoria inteira de IA. Gancho com a diretoria
// riscando "pessoas", a Ana se apresenta, o time de executores, a diretoria e as revisões.
type P = { readonly c: Cena };
const TITULO_CORTE = (
  <>
    uma diretoria
    <br />
    inteira de <span style={textoDegrade}>IA</span>
  </>
);

// ---------- gancho: "uma diretoria inteira de ~~pessoas~~ agentes de IA" sobre a grade dos diretores
const LADO = 250;
const grade = (i: number) => ({ x: (LARGURA - 3 * LADO - 2 * 26) / 2 + (i % 3) * (LADO + 26), y: 780 + Math.floor(i / 3) * (LADO + 26) });
export const Gancho1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const risca = rampa(frame, m("nenhum") - 2, 10);
  const ia = m("pessoa") - 2;
  const viraIa = useMola(ia);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center", ...TITULO, lineHeight: 0.98, textTransform: "uppercase" }}>
        <Surge de={0} style={{ position: "relative" }}>
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: VERDE, textAlign: "center", marginBottom: 18 }}>E SE A SUA EMPRESA TIVESSE</div>
        </Surge>
        <Surge de={2} style={{ position: "relative" }}>
          <div style={{ fontSize: 122, color: "white", letterSpacing: -4 }}>UMA DIRETORIA</div>
        </Surge>
        <Surge de={4} style={{ position: "relative" }}>
          <div style={{ fontSize: 122, color: "white", letterSpacing: -4 }}>INTEIRA DE</div>
        </Surge>
        <div style={{ position: "relative", height: 150, width: LARGURA, marginTop: 8 }}>
          {/* "PESSOAS" é riscado e sai; "AGENTES DE IA" entra no lugar */}
          <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: 140, letterSpacing: -5, color: "#8A8A8A", opacity: frame < 6 ? 0 : 1 - viraIa }}>
            <span style={{ position: "relative" }}>
              PESSOAS
              <span style={{ position: "absolute", left: -14, top: "46%", height: 14, borderRadius: 7, width: `calc(${risca} * (100% + 28px))`, background: "white", opacity: risca > 0 ? 1 : 0 }} />
            </span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: 122, letterSpacing: -4, opacity: viraIa, transform: `scale(${0.7 + 0.3 * viraIa})` }}>
            <span style={textoDegrade}>AGENTES DE IA</span>
          </div>
        </div>
      </div>
      {DIRETORIA.map((d, i) => {
        const g = grade(i);
        const s = useMolaLocal(frame, 3 + i * 2);
        return (
          <div key={d.sigla} style={{ position: "absolute", left: g.x, top: g.y, width: LADO, height: LADO, borderRadius: 22, overflow: "hidden", border: `3px solid ${frame >= ia + i ? VERDE : "rgba(255,255,255,0.12)"}`, opacity: s, transform: `scale(${0.8 + 0.2 * s})`, boxShadow: frame >= ia + i ? "0 0 30px rgba(60,224,30,0.45)" : "none" }}>
            <Img src={staticFile(`midia/avatars/${d.foto}`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: frame >= ia + i ? "none" : "grayscale(0.6) brightness(0.8)" }} />
            <div style={{ position: "absolute", left: 10, bottom: 10, fontFamily: fonteMono, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: "#0B0B0C", background: frame >= ia + i ? VERDE : "white", borderRadius: 6, padding: "3px 10px" }}>
              {frame >= ia + i ? `${d.sigla} · IA` : d.sigla}
            </div>
          </div>
        );
      })}
    </>
  );
};
const useMolaLocal = (frame: number, de: number) => interpolate(frame, [de, de + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---------- abertura-1: foto da Ana em tela cheia; em "Imagina", ela vai para o cabeçalho
export const AberturaV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const troca = m("Imagina") - 6;
  const foto = interpolate(frame, [troca, troca + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const z = interpolate(frame, [0, troca], [1.02, 1.1], { extrapolateRight: "clamp" });
  return (
    <>
      {foto > 0 && (
        <AbsoluteFill style={{ opacity: foto }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: LARGURA, height: 1500, overflow: "hidden", WebkitMaskImage: "linear-gradient(black 62%, transparent)", maskImage: "linear-gradient(black 62%, transparent)" }}>
            <Img src={staticFile("midia/ana-verde.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%", transform: `scale(${z})`, transformOrigin: "50% 30%" }} />
          </div>
          <Surge de={m("Oi") - 4} ate={m("Ana") - 6} style={{ left: 80, top: 980 }}>
            <div style={{ ...TITULO, fontSize: 170, ...textoDegrade }}>Oi!</div>
          </Surge>
          <Sequence from={m("Ana") - 4} layout="none">
            <TarjaAna x={80} y={1040} />
          </Sequence>
        </AbsoluteFill>
      )}
      {frame >= troca && (
        <>
          <Sequence from={troca} layout="none">
            <Cabecalho fala={c.fala} titulo={TITULO_CORTE} entra={0} />
          </Sequence>
          <Surge de={troca + 4} style={{ left: 0, right: 0, top: 470, textAlign: "center" }}>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 42, color: CINZA, marginBottom: 14 }}>Imagina a sua empresa com</div>
            <div style={{ ...TITULO, fontSize: 104, lineHeight: 1.02, color: "white" }}>UM ESCRITÓRIO</div>
            <div style={{ ...TITULO, fontSize: 104, lineHeight: 1.02, color: "white" }}>INTEIRO DE</div>
            <div style={{ ...TITULO, fontSize: 104, lineHeight: 1.14, ...textoDegrade }}>AGENTES DE IA</div>
          </Surge>
          {EXECUTORES.map((a, i) => (
            <Surge key={a.nome} de={m("lado") - 6 + i * 4} style={{ left: 70 + i * 190, top: 1010 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 180 }}>
                <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={130} />
                <div style={{ fontFamily, fontWeight: 800, fontSize: 28, color: "white" }}>{a.nome}</div>
              </div>
            </Surge>
          ))}
        </>
      )}
    </>
  );
};

// ---------- agentes-1: a tela AI Agents do celular
const AgentesV: React.FC<P> = AgentesM;

// ---------- agentes-4: diretoria em grade 3x3, cada diretor acende no cargo falado
const COL = (i: number) => 200 + (i % 3) * 340;
const LIN = (i: number) => PALCO.y + 190 + Math.floor(i / 3) * 245;
export const DiretoriaV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const atual = [...DIRETORIA].reverse().find((d) => frame >= m(d.palavra) - 4);
  return (
    <>
      <Surge de={m("Diretoria") - 6} style={{ left: 0, right: 0, top: PALCO.y + 10, textAlign: "center" }}>
        <Etiqueta>A DIRETORIA</Etiqueta>
        <div style={{ ...TITULO, fontSize: 56, color: "white", marginTop: 6 }}>
          agentes no papel de <span style={textoDegrade}>diretores</span>
        </div>
      </Surge>
      {DIRETORIA.map((d, i) => (
        <Diretor key={d.sigla} i={i} de={m(d.palavra) - 4} aceso={atual === d} />
      ))}
    </>
  );
};
const Diretor: React.FC<{ readonly i: number; readonly de: number; readonly aceso: boolean }> = ({ i, de, aceso }) => {
  const d = DIRETORIA[i];
  const s = useMola(de);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: COL(i) - 150, top: LIN(i), width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: s, transform: `scale(${0.6 + 0.4 * s})` }}>
      <Avatar nome={d.nome} cor={d.cor} foto={d.foto} tam={130} brilho={aceso ? 1 : 0} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily, fontWeight: 800, fontSize: 30, color: "white" }}>{d.nome}</span>
        <Chip cor={d.cor}>{d.sigla}</Chip>
      </div>
    </div>
  );
};

// ---------- agentes-5: diretoria em cima, executores embaixo; supervisiona, revisa e reporta
const X_DIR = (i: number) => 70 + i * 117.5;
const Y_DIR = PALCO.y + 120;
const X_EXE = (i: number) => 150 + i * 195;
const Y_EXE = PALCO.y + 560;
export const SupervisaoV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const liga = rampa(frame, m("supervisionam") - 4, 20);
  const reporta = m("reportam");
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: PALCO.y + 10, textAlign: "center" }}>
        <Etiqueta>A DIRETORIA</Etiqueta>
      </div>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={LARGURA} height={1920}>
        {DIRETORIA.flatMap((_, i) =>
          EXECUTORES.map((__, j) => {
            const x1 = X_DIR(i);
            const y1 = Y_DIR + 60;
            const x2 = X_EXE(j);
            const y2 = Y_EXE - 70;
            const t = ((frame - reporta - ((i + j) % 5) * 4) % 40) / 40;
            const pulsa = frame >= reporta - 2 && t >= 0;
            return (
              <g key={`${i}-${j}`}>
                <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * liga} y2={y1 + (y2 - y1) * liga} stroke={VERDE} strokeOpacity={0.22} strokeWidth={2} />
                {pulsa && <circle cx={x2 + (x1 - x2) * t} cy={y2 + (y1 - y2) * t} r={5} fill={VERDE} opacity={0.9 * (1 - t)} />}
              </g>
            );
          }),
        )}
      </svg>
      {DIRETORIA.map((d, i) => (
        <div key={d.sigla} style={{ position: "absolute", left: X_DIR(i) - 50, top: Y_DIR - 50, width: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Avatar nome={d.nome} cor={d.cor} foto={d.foto} tam={96} />
          <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 18, color: d.cor }}>{d.sigla}</div>
        </div>
      ))}
      {EXECUTORES.map((a, i) => (
        <Executor key={a.nome} i={i} de={m("executores") - 6 + i * 3} revisado={m("revisam") + i * 4} />
      ))}
      <Surge de={reporta - 4} style={{ left: 0, right: 0, top: Y_EXE + 200, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 32, letterSpacing: 2, color: "#0B0B0C", background: VERDE, padding: "14px 26px", borderRadius: 10 }}>RELATÓRIO DIÁRIO · 08H</div>
      </Surge>
    </>
  );
};
const Executor: React.FC<{ readonly i: number; readonly de: number; readonly revisado: number }> = ({ i, de, revisado }) => {
  const a = EXECUTORES[i];
  const s = useMola(de);
  const v = useMola(revisado, 12);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: X_EXE(i) - 90, top: Y_EXE - 70, width: 180, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: s }}>
      <div style={{ position: "relative" }}>
        <Avatar nome={a.nome} cor={a.cor} foto={a.foto} tam={130} />
        {v > 0 && (
          <div style={{ position: "absolute", right: -10, top: -6, width: 48, height: 48, borderRadius: "50%", background: VERDE, display: "grid", placeItems: "center", transform: `scale(${v})` }}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#0B0B0C" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5 9-10" />
            </svg>
          </div>
        )}
      </div>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 28, color: "white" }}>{a.nome}</div>
      <div style={{ fontFamily: fonteMono, fontSize: 18, letterSpacing: 2, color: a.cor, fontWeight: 700 }}>{a.papel.toUpperCase()}</div>
    </div>
  );
};

// ---------- fim (igual em todos os cortes): a capa do vídeo completo + "já está no ar"
export const FimV: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const s = useMola(m("apresentação") - 6);
  const brilho = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 520 }} />
      </Surge>
      <div style={{ position: "absolute", left: 90, top: 570, width: 900, height: 506, borderRadius: 24, overflow: "hidden", border: `3px solid ${VERDE}`, boxShadow: `0 0 ${40 + brilho * 30}px rgba(60,224,30,0.45)`, opacity: s, transform: `scale(${0.85 + 0.15 * s})` }}>
        <div style={{ width: 1920, height: 1080, transform: `scale(${900 / 1920})`, transformOrigin: "0 0" }}>
          <CapaApresentacao />
        </div>
      </div>
      <Surge de={m("ar") - 4} style={{ left: 0, right: 0, top: 1110, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 64, color: "white", lineHeight: 1.05 }}>APRESENTAÇÃO COMPLETA</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.1, ...textoDegrade }}>JÁ NO AR</div>
      </Surge>
    </>
  );
};

// ---------- linha do tempo
const VOZES = { ...vozesApresentacao, ...vozesCortes } as unknown as Vozes;
const ROTEIRO = montarRoteiro(VOZES, ["corte1-gancho", "abertura-1", "agentes-1", "agentes-4", "agentes-5", ["fim", 30]]);
export const DURACAO_CORTE1 = ROTEIRO.duracao;
const TELAS = { "corte1-gancho": Gancho1, "abertura-1": AberturaV, "agentes-1": AgentesV, "agentes-4": DiretoriaV, "agentes-5": SupervisaoV, fim: FimV };
export const Corte1: React.FC = () => (
  <MontagemVertical itens={ROTEIRO.itens} duracao={ROTEIRO.duracao} telas={TELAS} semCabecalho={["corte1-gancho", "abertura-1", "fim"]} semLegenda={["corte1-gancho"]} titulo={TITULO_CORTE} />
);
export const INICIOS_CORTE1 = Object.fromEntries(ROTEIRO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));

// ---------- capa do corte (1080x1920): o texto principal fica na faixa 3:4 do meio (y 240 a 1680),
// que é o que aparece na grade do perfil do Instagram
export const CapaCorte1: React.FC = () => (
  <AbsoluteFill style={{ width: LARGURA, height: 1920 }}>
    <Fundo />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", flexDirection: "column", alignItems: "center", ...TITULO, lineHeight: 0.98, textTransform: "uppercase", filter: "drop-shadow(0 6px 22px rgba(0,0,0,0.85))" }}>
      <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 380, marginBottom: 40 }} />
      <div style={{ fontSize: 108, color: "white", letterSpacing: -3 }}>UMA DIRETORIA</div>
      <div style={{ fontSize: 108, color: "white", letterSpacing: -3 }}>INTEIRA DE</div>
      <div style={{ position: "relative", fontSize: 104, letterSpacing: -3, color: "#8A8A8A", marginTop: 6 }}>
        PESSOAS
        <div style={{ position: "absolute", left: -12, right: -12, top: "46%", height: 13, borderRadius: 7, background: "white" }} />
      </div>
      <div style={{ fontSize: 116, letterSpacing: -4, marginTop: 6, ...textoDegrade }}>AGENTES DE IA</div>
    </div>
    {DIRETORIA.map((d, i) => {
      const lado = 200;
      const x = (LARGURA - 3 * lado - 2 * 22) / 2 + (i % 3) * (lado + 22);
      const y = 1010 + Math.floor(i / 3) * (lado + 22);
      return (
        <div key={d.sigla} style={{ position: "absolute", left: x, top: y, width: lado, height: lado, borderRadius: 20, overflow: "hidden", border: `3px solid ${VERDE}`, boxShadow: "0 0 26px rgba(60,224,30,0.4)" }}>
          <Img src={staticFile(`midia/avatars/${d.foto}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 8, bottom: 8, fontFamily: fonteMono, fontWeight: 800, fontSize: 19, color: "#0B0B0C", background: VERDE, borderRadius: 5, padding: "2px 8px" }}>{d.sigla} · IA</div>
        </div>
      );
    })}
  </AbsoluteFill>
);
