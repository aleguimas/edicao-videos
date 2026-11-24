import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Icone } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { ARQUIVOS, SkillImportada } from "../apresentacao/Arquitetura";
import { rampa, Selo } from "../apresentacao/comum";
import { Banco, INDICADORES } from "../apresentacao/Erp";
import { CAMINHO, EMPRESAS, PAPEIS } from "../apresentacao/Final";
import { CAPACIDADES } from "../apresentacao/Olho";
import { CINZA, FUNDO, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Etiqueta, Surge } from "../verbas/Montagem";
import { BaseM, DiversasM, EstoqueM, GrafoM, IntegracoesM, KpisM, LogsM, MemoriaM, MiniAppsM, PriceWatchM, ProspeccaoM, SkillsM, VerbasConciliacaoM } from "../mobile/Modulos";
import { OlhoAprovaM, OlhoConversaM, OlhoVazioM } from "../mobile/Olho";
import { CallM, RotinasM, TarefasM } from "../mobile/Trabalho";
import { type Foco, LARGURA, PALCO, type QuadroV, type TelaV } from "./Vertical";

// Telas dos cortes 2 a 8. As telas do sistema são as do vídeo principal, no Palco, com a câmera indo
// de um ponto a outro; as cenas livres 16:9 (dados, segurança, o que você cria) foram remontadas em pé.
// a câmera fica parada até perto da palavra e leva 16 frames para chegar ao próximo ponto
export const cam = (c: Cena, inicio: Foco, alvos: readonly (readonly [number, Foco])[]) => {
  const q: QuadroV[] = [[0, ...inicio]];
  let foco = inicio;
  alvos.forEach(([f, a]) => {
    const ultimo = q[q.length - 1][0];
    const parte = Math.max(ultimo + 1, f - 16);
    q.push([parte, ...foco], [parte + 16, ...a]);
    foco = a;
  });
  q.push([Math.max(c.dur, q[q.length - 1][0] + 1), ...foco]);
  return q;
};
const marcas = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);

// ---------- corte 2: Olho de Deus (telas mobile; as capacidades entram acima do campo de mensagem)
export const Olho1V: TelaV = OlhoVazioM;
export const Olho2V: TelaV = ({ c }) => {
  const m = marcas(c);
  return (
    <>
      <OlhoConversaM c={c} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 1160, height: 140, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", alignContent: "flex-end" }}>
        {CAPACIDADES.map(([p, t]) => (
          <Surge key={t} de={m(p) - 4} style={{ position: "relative" }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 25, color: "#0B0B0C", background: VERDE, borderRadius: 10, padding: "8px 14px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>✓ {t}</div>
          </Surge>
        ))}
      </div>
    </>
  );
};
export const Olho3V: TelaV = OlhoAprovaM;

// ---------- corte 3: sistema de gestão
export const Erp2V: TelaV = IntegracoesM;
export const Erp3V: TelaV = GrafoM;
export const Erp4V: TelaV = ({ c }) => {
  const m = marcas(c);
  return (
    <>
      <KpisM c={c} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1350, display: "flex", justifyContent: "center", gap: 16 }}>
        <Surge de={m("crédito") - 4} style={{ position: "relative" }}>
          <div style={{ background: VERDE, color: "#0B0B0C", borderRadius: 14, padding: "16px 22px", fontFamily, fontWeight: 900, fontSize: 32, lineHeight: 1.1, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            0 CRÉDITO
            <br />
            DE IA
          </div>
        </Surge>
        <Surge de={m("digitar") - 4} style={{ position: "relative" }}>
          <div style={{ background: "#0B0B0C", color: VERDE, border: `2px solid ${VERDE}`, borderRadius: 14, padding: "16px 22px", fontFamily, fontWeight: 900, fontSize: 32, lineHeight: 1.1, boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}>
            NÚMEROS
            <br />
            DIRETO DO ERP
          </div>
        </Surge>
      </div>
    </>
  );
};

// erp-6 em pé: o sistema em cima, a plataforma embaixo; a consulta sobe e só os indicadores descem
const Y_ERP = PALCO.y + 170;
const Y_AO = PALCO.y + 590;
export const DadosV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const nunca = m("nunca") - 4;
  const volta = m("indicadores") - 6;
  const ida = rampa(frame, m("consulta") - 4, 18);
  const desce = rampa(frame, volta, 16);
  const yIni = Y_AO - 6;
  const yFim = Y_ERP + 276;
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: PALCO.y + 10, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 62, lineHeight: 1.08, color: "white" }}>
          os dados continuam
          <br />
          <span style={textoDegrade}>na sua empresa</span>
        </div>
      </Surge>
      <Surge de={4} style={{ left: 90, top: Y_ERP }}>
        <div style={{ width: 900, height: 270, boxSizing: "border-box", borderRadius: 24, background: "#141815", border: `2px solid ${VERDE}`, display: "flex", alignItems: "center", gap: 30, padding: "0 40px" }}>
          <Banco tam={120} />
          <div style={{ flex: 1 }}>
            <div style={{ ...TITULO, fontSize: 42, color: "white" }}>ERP da Loja Modelo</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginTop: 16, position: "relative" }}>
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} style={{ height: 16, borderRadius: 3, background: "#2A2F2B" }} />
              ))}
              {frame >= nunca && <div style={{ position: "absolute", inset: -9, border: "3px solid #FF6B6B", borderRadius: 8, opacity: rampa(frame, nunca, 6) }} />}
            </div>
            <div style={{ fontFamily: fonteMono, fontSize: 26, marginTop: 18, color: frame >= nunca ? "#FF6B6B" : CINZA }}>as linhas ficam aqui</div>
          </div>
        </div>
      </Surge>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={LARGURA} height={1920}>
        <line x1={380} y1={yIni} x2={380} y2={yIni - (yIni - yFim) * ida} stroke={VERDE} strokeWidth={6} strokeDasharray="14 12" />
        {ida >= 1 && <text x={350} y={(yIni + yFim) / 2 + 10} fill={CINZA} fontSize={30} textAnchor="end" fontFamily={fonteMono}>consulta</text>}
        {frame >= volta && <line x1={700} y1={yFim} x2={700} y2={yFim + (yIni - yFim) * desce} stroke={VERDE} strokeWidth={6} />}
        {desce >= 1 && <text x={730} y={(yIni + yFim) / 2 + 10} fill={VERDE} fontSize={30} fontFamily={fonteMono}>só indicadores</text>}
      </svg>
      <Surge de={6} style={{ left: 90, top: Y_AO }}>
        <div style={{ width: 900, height: 320, boxSizing: "border-box", borderRadius: 24, background: "#141815", border: "1px solid #2A2F2B", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 340 }} />
          {INDICADORES.map((t, i) => (
            <div key={t} style={{ fontFamily, fontWeight: 800, fontSize: 28, color: "#0B0B0C", background: VERDE, borderRadius: 10, padding: "6px 16px", opacity: rampa(frame, volta + 16 + i * 6, 8) }}>
              {t}
            </div>
          ))}
        </div>
      </Surge>
    </>
  );
};

// ---------- corte 4: os quatro recursos
const RECURSOS = ["CONHECIMENTO", "MEMÓRIA", "SKILLS", "FERRAMENTAS"];
export const ConhecimentoV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const troca = m("primeiro") - 4;
  const sai = interpolate(frame, [troca, troca + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      {sai > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: sai }}>
          <Surge de={0} style={{ left: 0, right: 0, top: PALCO.y + 60, textAlign: "center" }}>
            <div style={{ ...TITULO, fontSize: 70, lineHeight: 1.08, color: "white" }}>
              cada agente tem
              <br />
              <span style={textoDegrade}>quatro recursos</span>
            </div>
          </Surge>
          {RECURSOS.map((r, i) => (
            <Surge key={r} de={m("recursos") - 6 + i * 3} style={{ left: 60 + (i % 2) * 490, top: PALCO.y + 290 + Math.floor(i / 2) * 290 }}>
              <div style={{ width: 470, height: 270, boxSizing: "border-box", borderRadius: 18, border: `2px solid ${VERDE}`, background: "#141815", padding: 32 }}>
                <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 52, color: VERDE }}>0{i + 1}</div>
                <div style={{ ...TITULO, fontSize: 42, color: "white", marginTop: 50 }}>{r}</div>
              </div>
            </Surge>
          ))}
        </div>
      )}
      {frame >= troca && (
        <>
          <BaseM c={c} de={troca} />
          <Selo de={troca + 4} numero="01" texto="CONHECIMENTO" x={LARGURA - 240} y={PALCO.y + 180} />
        </>
      )}
    </>
  );
};
export const MemoriaV: TelaV = ({ c }) => {
  const m = marcas(c);
  return (
    <>
      <MemoriaM c={c} />
      <Selo de={m("memória") - 4} numero="02" texto="MEMÓRIA" x={LARGURA - 200} y={PALCO.y + 180} />
    </>
  );
};
export const SkillsV: TelaV = ({ c }) => {
  const m = marcas(c);
  return (
    <>
      <SkillsM c={c} />
      <Selo de={m("habilidades") - 4} numero="03" texto="SKILLS" x={LARGURA - 170} y={PALCO.y + 180} />
      <Surge de={m("skill") + 4} style={{ left: 260, top: 1040 }}>
        <SkillImportada />
      </Surge>
    </>
  );
};
export const FerramentasV: TelaV = ({ c }) => {
  const m = marcas(c);
  const conecta = m("conecta");
  return (
    <>
      <DiversasM c={c} />
      <Selo de={m("ferramentas") - 4} numero="04" texto="FERRAMENTAS" x={LARGURA - 240} y={PALCO.y + 180} />
      {ARQUIVOS.map(([t, p], i) => (
        <Surge key={t} de={m(p) - 4} ate={conecta - 6} style={{ left: 40 + i * 340, top: PALCO.y + 320 }}>
          <div style={{ width: 320, height: 240, borderRadius: 18, background: "#141815", border: `2px solid ${VERDE}`, display: "grid", placeItems: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ textAlign: "center" }}>
              <svg width={72} height={72} viewBox="0 0 24 24" fill="none" stroke={VERDE} strokeWidth={1.6}>
                <path d="M6 2h9l5 5v15H6zM15 2v5h5" />
              </svg>
              <div style={{ ...TITULO, fontSize: 40, color: "white", marginTop: 8 }}>{t}</div>
            </div>
          </div>
        </Surge>
      ))}
      <Surge de={m("mil") - 6} style={{ left: 0, right: 0, top: PALCO.y + 560, display: "flex", justifyContent: "center" }}>
        <div style={{ textAlign: "center", background: "#0B0B0C", border: `2px solid ${VERDE}`, borderRadius: 16, padding: "20px 40px", boxShadow: "0 0 50px rgba(60,224,30,0.3)" }}>
          <div style={{ ...TITULO, fontSize: 96, lineHeight: 1, ...textoDegrade }}>+1.000</div>
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: "white", marginTop: 6 }}>APLICATIVOS</div>
        </div>
      </Surge>
      <Surge de={m("banco") - 6} style={{ left: 0, right: 0, top: PALCO.y + 810, display: "flex", justifyContent: "center" }}>
        <div style={{ background: VERDE, color: "#0B0B0C", fontFamily, fontWeight: 900, fontSize: 32, borderRadius: 12, padding: "14px 22px" }}>+ BANCO DE DADOS DA EMPRESA</div>
      </Surge>
    </>
  );
};

// ---------- corte 5: reunião, rotinas e tarefas (telas mobile)
export const ReuniaoV: TelaV = CallM;
export const RotinasV: TelaV = RotinasM;
export const TarefasV: TelaV = TarefasM;

// ---------- corte 6: módulos de negócio
export const EstoqueV: TelaV = EstoqueM;
export const ComercialV: TelaV = PriceWatchM;
export const VerbasV: TelaV = VerbasConciliacaoM;
export const ProspeccaoV: TelaV = ProspeccaoM;

// ---------- corte 7: segurança
export const SegurancaV: TelaV = ({ c }) => {
  const m = marcas(c);
  const frame = useCurrentFrame();
  const papel = [...PAPEIS].reverse().find(([p]) => frame >= m(p) - 4)?.[1];
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: PALCO.y + 6, textAlign: "center" }}>
        <Etiqueta>SEGURANÇA E GOVERNANÇA</Etiqueta>
      </Surge>
      {EMPRESAS.map((e, i) => (
        <Surge key={e} de={m("empresa") - 4 + i * 4} style={{ left: 40 + i * 340, top: PALCO.y + 60 }}>
          <div style={{ width: 320, height: 250, boxSizing: "border-box", borderRadius: 20, background: "#141815", border: `2px solid ${i === 0 ? VERDE : "#2A2F2B"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: i === 0 ? 1 : 0.6 }}>
            <Banco tam={80} cor={i === 0 ? VERDE : "#9AA19C"} />
            <div style={{ ...TITULO, fontSize: 36, color: "white" }}>{e}</div>
            <div style={{ fontFamily: fonteMono, fontSize: 22, color: i === 0 ? VERDE : "#9AA19C" }}>🔒 banco próprio</div>
          </div>
        </Surge>
      ))}
      {PAPEIS.map(([p, t, d], i) => (
        <Surge key={t} de={m(p) - 4} style={{ left: 40, top: PALCO.y + 340 + i * 190 }}>
          <div style={{ width: 1000, height: 170, boxSizing: "border-box", borderRadius: 20, padding: "0 40px", display: "flex", flexDirection: "column", justifyContent: "center", background: papel === t ? VERDE : "#141815", border: `2px solid ${VERDE}` }}>
            <div style={{ ...TITULO, fontSize: 52, color: papel === t ? FUNDO : "white" }}>{t}</div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: papel === t ? FUNDO : CINZA, marginTop: 6 }}>{d}</div>
          </div>
        </Surge>
      ))}
    </>
  );
};
export const LogsV: TelaV = LogsM;

// ---------- corte 8: sem programar
export const MiniAppsV: TelaV = MiniAppsM;
const CRIA: [string, string, string, string][] = [
  ["agentes", "Agentes", "com a função que a empresa precisar", "agentes"],
  ["habilidades", "Habilidades", "que ensinam os processos internos", "varinha"],
  ["rotinas", "Rotinas", "que fazem o trabalho repetitivo sozinhas", "rotinas"],
];
export const CriarV: TelaV = ({ c }) => {
  const m = marcas(c);
  return (
    <>
      <Surge de={m("fechado") - 8} style={{ left: 0, right: 0, top: PALCO.y + 10, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 66, lineHeight: 1.06, color: "white" }}>
          não é um sistema <span style={textoDegrade}>fechado</span>
        </div>
      </Surge>
      <Surge de={m("programar") - 4} style={{ left: 0, right: 0, top: PALCO.y + 180, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 34, letterSpacing: 3, color: "#0B0B0C", background: VERDE, padding: "10px 24px", borderRadius: 10 }}>SEM PROGRAMAR</div>
      </Surge>
      {CRIA.map(([p, t, s, ic], i) => (
        <Surge key={t} de={m(p) - 4} style={{ left: 50, top: PALCO.y + 280 + i * 220 }}>
          <div style={{ width: 980, height: 200, boxSizing: "border-box", borderRadius: 22, background: "#141815", border: `2px solid ${VERDE}`, padding: "0 36px", display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ width: 120, display: "grid", placeItems: "center" }}>{i === 0 ? <Img src={staticFile("midia/avatars/atlas.svg")} style={{ width: 120, height: 120 }} /> : <Icone nome={ic} tam={100} cor={VERDE} />}</div>
            <div style={{ flex: 1 }}>
              <div style={{ ...TITULO, fontSize: 56, color: "white" }}>{t}</div>
              <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA, lineHeight: 1.2, marginTop: 6 }}>{s}</div>
            </div>
          </div>
        </Surge>
      ))}
    </>
  );
};
export const SobMedidaV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const proximo = m("próximo") - 20;
  const sai = interpolate(frame, [proximo, proximo + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ps = [m("processo"), m("módulo"), m("empresas")];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: sai }}>
        <Surge de={0} style={{ left: 0, right: 0, top: PALCO.y + 20, textAlign: "center" }}>
          <div style={{ ...TITULO, fontSize: 72, color: "white" }}>
            módulos <span style={textoDegrade}>sob medida</span>
          </div>
        </Surge>
        {CAMINHO.map(([, t], i) => (
          <Surge key={t} de={ps[i] - 4} style={{ left: 70, top: PALCO.y + 170 + i * 250 }}>
            <div style={{ width: 940, height: 200, boxSizing: "border-box", borderRadius: 20, background: "#141815", border: `2px solid ${VERDE}`, padding: "0 36px", display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 60, color: VERDE }}>0{i + 1}</div>
              <div style={{ ...TITULO, fontSize: 44, color: "white", lineHeight: 1.12 }}>{t}</div>
            </div>
          </Surge>
        ))}
      </div>
      {frame >= proximo && (
        <Surge de={proximo + 4} style={{ left: 0, right: 0, top: 620, textAlign: "center" }}>
          <div style={{ ...TITULO, fontSize: 116, color: "white", lineHeight: 1.04 }}>O SEU</div>
          <div style={{ ...TITULO, fontSize: 116, color: "white", lineHeight: 1.04 }}>PROCESSO</div>
          <div style={{ ...TITULO, fontSize: 116, lineHeight: 1.14, ...textoDegrade }}>PODE SER</div>
          <div style={{ ...TITULO, fontSize: 116, lineHeight: 1.14, ...textoDegrade }}>O PRÓXIMO</div>
        </Surge>
      )}
    </>
  );
};
