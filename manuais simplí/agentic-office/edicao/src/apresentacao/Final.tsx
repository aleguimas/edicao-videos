import type React from "react";
import { Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COR, Icone, rota } from "../agentic/App";
import { TarjaAna } from "../ana/Ana";
import { type Cena, marca } from "../ana/voz";
import { CINZA, FUNDO, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Etiqueta, FotoAna, Surge } from "../verbas/Montagem";
import { CENTRO } from "./Agentes";
import { Avatar, Cartao, CenaJanela, Chip, MENU_ORGANIZACAO, rampa, Titulo } from "./comum";

type P = { readonly c: Cena };

const Bloco: React.FC<{ readonly de: number; readonly x: number; readonly titulo: string; readonly sub: string; readonly children: React.ReactNode }> = ({ de, x, titulo, sub, children }) => (
  <Surge de={de} style={{ left: x, top: 420 }}>
    <div style={{ width: 460, height: 380, boxSizing: "border-box", borderRadius: 22, background: "#141815", border: `2px solid ${VERDE}`, padding: 34, display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ height: 120, display: "flex", alignItems: "center", gap: 12 }}>{children}</div>
      <div style={{ ...TITULO, fontSize: 44, color: "white" }}>{titulo}</div>
      <div style={{ fontFamily, fontWeight: 600, fontSize: 24, color: CINZA, lineHeight: 1.3 }}>{sub}</div>
    </div>
  </Surge>
);

// ---------- criar-1: sem programar, a equipe cria agentes, habilidades e rotinas
export const Criar1: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <Surge de={m("fechado") - 8} style={{ left: 0, right: 0, top: 130, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 70, color: "white" }}>
          não é um sistema <span style={textoDegrade}>fechado</span>
        </div>
      </Surge>
      <Surge de={m("programar") - 4} style={{ left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: "#0B0B0C", background: VERDE, padding: "10px 24px", borderRadius: 10 }}>SEM PROGRAMAR</div>
      </Surge>
      <Bloco de={m("agentes") - 4} x={160} titulo="Agentes" sub="com a função que a empresa precisar">
        {["atlas", "kai", "nova"].map((r) => (
          <Img key={r} src={staticFile(`midia/avatars/${r}.svg`)} style={{ width: 104, height: 104 }} />
        ))}
      </Bloco>
      <Bloco de={m("habilidades") - 4} x={730} titulo="Habilidades" sub="que ensinam os processos internos">
        <Icone nome="varinha" tam={100} cor={VERDE} />
      </Bloco>
      <Bloco de={m("rotinas") - 4} x={1300} titulo="Rotinas" sub="que fazem o trabalho repetitivo sozinhas">
        <Icone nome="rotinas" tam={100} cor={VERDE} />
      </Bloco>
    </>
  );
};

// ---------- criar-2: Mini Apps (planilha ou ideia → aplicativo no celular)
export const VISUAIS = [
  ["formulário", "Formulário"],
  ["tabela", "Tabela"],
  ["quadro", "Quadro"],
  ["painel", "Painel"],
];
export const Criar2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const app = m("aplicativo") - 6;
  const celular = rampa(frame, app, 14);
  const acesa = [...VISUAIS].reverse().find(([p]) => frame >= m(p) - 4)?.[1];
  return (
    <>
      <Surge de={0} style={{ left: 120, top: 110 }}>
        <Etiqueta>MINI APPS</Etiqueta>
      </Surge>
      <Surge de={m("planilha") - 4} style={{ left: 120, top: 190 }}>
        <div style={{ width: 560, background: "white", borderRadius: 10, overflow: "hidden", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", fontFamily: "Arial, sans-serif", fontSize: 19 }}>
          {["Obra", "Vendedor", "Data", "Residencial Aurora", "Paula", "03/11", "Ed. Mirante", "Ricardo", "04/11", "Casa Jardins", "Marina", "05/11"].map((v, i) => (
            <div key={i} style={{ height: 52, padding: "0 12px", display: "flex", alignItems: "center", borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd", background: i < 3 ? "#1F6B2A" : "white", color: i < 3 ? "white" : "#222", fontWeight: i < 3 ? 700 : 400 }}>
              {v}
            </div>
          ))}
        </div>
      </Surge>
      <Surge de={m("ideia") - 4} style={{ left: 120, top: 470 }}>
        <div style={{ width: 560, boxSizing: "border-box", borderRadius: 14, border: `2px solid ${VERDE}`, background: "#141815", padding: "20px 24px" }}>
          <div style={{ fontFamily: fonteMono, fontSize: 18, letterSpacing: 2, color: VERDE }}>OU UMA IDEIA</div>
          <div style={{ fontFamily, fontWeight: 700, fontSize: 28, color: "white", marginTop: 8, lineHeight: 1.3 }}>“Quero controlar as visitas dos vendedores às obras, com foto.”</div>
        </div>
      </Surge>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <line x1={720} y1={470} x2={720 + 230 * celular} y2={470} stroke={VERDE} strokeWidth={6} strokeLinecap="round" />
        {celular >= 1 && <path d="M935 450 L960 470 L935 490" fill="none" stroke={VERDE} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      {celular > 0 && (
        <div style={{ position: "absolute", left: 1010, top: 130, width: 380, height: 780, borderRadius: 50, background: "#0E110F", border: "10px solid #2A2F2B", boxShadow: "0 30px 90px rgba(0,0,0,0.7)", opacity: celular, transform: `translateY(${(1 - celular) * 60}px)`, overflow: "hidden", fontFamily }}>
          <div style={{ padding: "50px 26px 0", color: "white" }}>
            <div style={{ fontWeight: 800, fontSize: 28 }}>Visitas às obras</div>
            <div style={{ fontSize: 16, color: CINZA, marginTop: 4 }}>Loja Modelo · equipe de vendas</div>
            {acesa === "Formulário" || !acesa ? (
              <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
                {["Obra", "Vendedor", "Data da visita"].map((f) => (
                  <div key={f}>
                    <div style={{ fontSize: 15, color: CINZA }}>{f}</div>
                    <div style={{ height: 44, borderRadius: 8, border: "1px solid #2A2F2B", marginTop: 6 }} />
                  </div>
                ))}
                <div style={{ height: 100, borderRadius: 8, border: "2px dashed #2A2F2B", display: "grid", placeItems: "center", color: CINZA, fontSize: 16 }}>📷 Foto da obra</div>
                <div style={{ height: 50, borderRadius: 10, background: VERDE, color: FUNDO, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 20 }}>Registrar visita</div>
              </div>
            ) : acesa === "Tabela" ? (
              <div style={{ marginTop: 26 }}>
                {["Residencial Aurora · Paula", "Ed. Mirante · Ricardo", "Casa Jardins · Marina", "Cond. Alto Verde · Paula"].map((l) => (
                  <div key={l} style={{ padding: "16px 0", borderBottom: "1px solid #2A2F2B", fontSize: 18 }}>
                    {l}
                  </div>
                ))}
              </div>
            ) : acesa === "Quadro" ? (
              <div style={{ marginTop: 26, display: "flex", gap: 10 }}>
                {["A visitar", "Visitada", "Pedido"].map((col, i) => (
                  <div key={col} style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: CINZA }}>{col}</div>
                    {Array.from({ length: 3 - i }, (_, k) => (
                      <div key={k} style={{ height: 70, borderRadius: 8, background: "#1B201C", marginTop: 8, border: "1px solid #2A2F2B" }} />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  ["Visitas no mês", "48"],
                  ["Viraram pedido", "17"],
                  ["Conversão", "35%"],
                ].map(([r, v]) => (
                  <div key={r} style={{ borderRadius: 10, border: "1px solid #2A2F2B", padding: "14px 16px" }}>
                    <div style={{ fontSize: 15, color: CINZA }}>{r}</div>
                    <div style={{ fontSize: 34, fontWeight: 800, color: VERDE }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 1450, top: 260, display: "flex", flexDirection: "column", gap: 16 }}>
        {VISUAIS.map(([p, t]) => (
          <Surge key={t} de={m(p) - 4} style={{ position: "relative" }}>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 28, padding: "12px 22px", borderRadius: 12, border: `2px solid ${VERDE}`, color: acesa === t ? FUNDO : VERDE, background: acesa === t ? VERDE : "transparent" }}>{t}</div>
          </Surge>
        ))}
      </div>
      <Surge de={m("compartilhado") - 4} style={{ left: 1450, top: 640 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {["pessoas/p12.webp", "pessoas/p65.webp", "pessoas/p45.webp"].map((f, i) => (
            <div key={f} style={{ marginLeft: i ? -20 : 0 }}>
              <Avatar nome="P" cor={VERDE} foto={f} tam={64} />
            </div>
          ))}
          <span style={{ fontFamily, fontWeight: 700, fontSize: 22, color: "white", marginLeft: 8 }}>compartilhado</span>
        </div>
      </Surge>
    </>
  );
};

// ---------- criar-3: módulos sob medida
export const CAMINHO = [
  ["processo", "Processo real de um cliente"],
  ["módulo", "Vira módulo do Agentic Office"],
  ["empresas", "Fica disponível para outras empresas"],
];
export const Criar3: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const proximo = m("próximo") - 20;
  const sai = interpolate(frame, [proximo, proximo + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const marcas = [m("processo"), m("módulo"), m("empresas")];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: sai }}>
        <Surge de={m("medida") - 8} style={{ left: 0, right: 0, top: 150, textAlign: "center" }}>
          <div style={{ ...TITULO, fontSize: 76, color: "white" }}>
            módulos <span style={textoDegrade}>sob medida</span>
          </div>
        </Surge>
        {CAMINHO.map(([, t], i) => (
          <Surge key={t} de={marcas[i] - 4} style={{ left: 170 + i * 560, top: 440 }}>
            <div style={{ width: 460, height: 220, boxSizing: "border-box", borderRadius: 20, background: "#141815", border: `2px solid ${VERDE}`, padding: 30 }}>
              <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 40, color: VERDE }}>0{i + 1}</div>
              <div style={{ ...TITULO, fontSize: 34, color: "white", lineHeight: 1.15, marginTop: 14 }}>{t}</div>
            </div>
          </Surge>
        ))}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {[0, 1].map((i) => {
            const k = rampa(frame, marcas[i + 1] - 8, 8);
            const x = 640 + i * 560;
            return <line key={i} x1={x} y1={550} x2={x + 80 * k} y2={550} stroke={VERDE} strokeWidth={6} strokeLinecap="round" />;
          })}
        </svg>
      </div>
      {frame >= proximo && (
        <Surge de={proximo + 4} style={{ left: 0, right: 0, top: 330, textAlign: "center" }}>
          <div style={{ ...TITULO, fontSize: 110, color: "white", lineHeight: 1.05 }}>O SEU PROCESSO</div>
          <div style={{ ...TITULO, fontSize: 110, lineHeight: 1.15, ...textoDegrade }}>PODE SER O PRÓXIMO</div>
        </Surge>
      )}
    </>
  );
};

// ---------- seguranca-1: dados isolados por empresa + papéis
export const EMPRESAS = ["Loja Modelo", "Empresa B", "Empresa C"];
export const PAPEIS: [string, string, string][] = [
  ["administrador", "Admin", "vê e configura tudo"],
  ["gestor", "Gestor", "vê os setores que lidera"],
  ["colaborador", "Colaborador", "vê o próprio setor"],
];
export const Seguranca1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const papel = [...PAPEIS].reverse().find(([p]) => frame >= m(p) - 4)?.[1];
  return (
    <>
      <Surge de={m("segurança") - 8} style={{ left: 0, right: 0, top: 100, textAlign: "center" }}>
        <Etiqueta>SEGURANÇA E GOVERNANÇA</Etiqueta>
      </Surge>
      {EMPRESAS.map((e, i) => (
        <Surge key={e} de={m("isolados") - 8 + i * 4} style={{ left: 250 + i * 500, top: 180 }}>
          <div style={{ width: 420, height: 230, boxSizing: "border-box", borderRadius: 20, background: "#141815", border: `2px solid ${i === 0 ? VERDE : "#2A2F2B"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, opacity: i === 0 ? 1 : 0.6 }}>
            <svg width={70} height={70} viewBox="0 0 24 24" fill="none" stroke={i === 0 ? VERDE : "#9AA19C"} strokeWidth={1.5}>
              <ellipse cx={12} cy={5} rx={8} ry={3} />
              <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
            </svg>
            <div style={{ ...TITULO, fontSize: 32, color: "white" }}>{e}</div>
            <div style={{ fontFamily: fonteMono, fontSize: 18, color: i === 0 ? VERDE : "#9AA19C" }}>🔒 banco próprio</div>
          </div>
        </Surge>
      ))}
      {PAPEIS.map(([p, t, d], i) => (
        <Surge key={t} de={m(p) - 4} style={{ left: 250 + i * 500, top: 500 }}>
          <div style={{ width: 420, height: 190, boxSizing: "border-box", borderRadius: 20, padding: 30, background: papel === t ? VERDE : "#141815", border: `2px solid ${VERDE}` }}>
            <div style={{ ...TITULO, fontSize: 44, color: papel === t ? FUNDO : "white" }}>{t}</div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 24, color: papel === t ? FUNDO : CINZA, marginTop: 10 }}>{d}</div>
          </div>
        </Surge>
      ))}
    </>
  );
};

// ---------- seguranca-2: cada setor vê o que é dele, log de tudo e limite de consumo
const LOGS: [string, string, string, string, string][] = [
  ["14:32", "Paula Moreira", "Gestor", "Compras", "Aprovou a sugestão de compra da semana"],
  ["14:28", "Ricardo Lima", "Colaborador", "Comercial", "Abriu o Painel de KPIs"],
  ["14:21", "Marina Costa", "Gestor", "Marketing", "Pediu ao Olho de Deus o resumo da campanha"],
  ["14:05", "Jorge Almeida", "Admin", "Todos", "Convidou um novo membro"],
  ["13:52", "Paula Moreira", "Gestor", "Compras", "Exportou a lista de ruptura"],
];
export const Seguranca2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const setor = frame >= m("setor") - 4 && frame < m("histórico") - 4;
  const historico = frame >= m("histórico") - 4 && frame < m("limite") - 4;
  const limite = m("consumo") - 4;
  return (
    <CenaJanela ativo="Logs" menu={MENU_ORGANIZACAO} quadros={rota(CENTRO, [], c.dur)}>
      <Titulo icone="logs" titulo="LOGS" descricao="O que as pessoas fizeram nos últimos 60 dias, por setor, pessoa e tipo de ação." />
      <div style={{ position: "absolute", left: 40, top: 150, display: "flex", gap: 12 }}>
        {["Período: 7 dias", setor ? "Setor: Compras" : "Setor: todos", "Pessoa: todas"].map((f, i) => (
          <div key={i} style={{ fontSize: 18, padding: "10px 16px", borderRadius: 8, border: `${i === 1 && setor ? 2 : 1}px solid ${i === 1 && setor ? VERDE : COR.borda}`, color: i === 1 && setor ? VERDE : COR.texto }}>
            {f} ⌄
          </div>
        ))}
      </div>
      {LOGS.filter((l) => !setor || l[3] === "Compras").map(([h, q, p, s, a], i) => (
        <Cartao key={h} x={40} y={220 + i * 106} w={850} h={92} aceso={historico} style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 20px" }}>
          <span style={{ fontSize: 17, color: COR.suave, width: 56 }}>{h}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <b style={{ fontSize: 19 }}>{q}</b>
              <Chip cor={COR.suave}>{p.toUpperCase()}</Chip>
              <Chip>{s.toUpperCase()}</Chip>
            </div>
            <div style={{ fontSize: 18, color: COR.texto, marginTop: 6 }}>{a}</div>
          </div>
        </Cartao>
      ))}
      <Cartao x={920} y={220} w={380} h={300} aceso={frame >= limite} style={{ opacity: rampa(frame, limite, 10) }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Consumo de IA no mês</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: VERDE, marginTop: 16 }}>18%</div>
        <div style={{ fontSize: 17, color: COR.suave }}>do limite definido pela empresa</div>
        <div style={{ height: 12, borderRadius: 6, background: "#1F2420", marginTop: 20 }}>
          <div style={{ width: `${18 * rampa(frame, limite + 6, 20)}%`, height: "100%", borderRadius: 6, background: VERDE }} />
        </div>
      </Cartao>
    </CenaJanela>
  );
};

// ---------- fechamento-1: agentes + dados + jeito de trabalhar, num lugar só
const JUNTA = [
  ["agentes", "AGENTES DE IA"],
  ["dados", "OS DADOS DA EMPRESA"],
  ["jeito", "O SEU JEITO DE TRABALHAR"],
];
export const Fechamento1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const lugar = m("lugar") - 6;
  const junta = rampa(frame, lugar, 16);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 150, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 640 }} />
      </Surge>
      {JUNTA.map(([p, t], i) => {
        const x = interpolate(junta, [0, 1], [180 + i * 540, 660]);
        const y = interpolate(junta, [0, 1], [480, 460 + i * 6]);
        return (
          <Surge key={t} de={m(p) - 4} style={{ left: x, top: y }}>
            <div style={{ width: 520, boxSizing: "border-box", textAlign: "center", padding: "26px 10px", borderRadius: 16, border: `2px solid ${VERDE}`, background: "#141815", fontFamily, fontWeight: 900, fontSize: 30, color: "white", opacity: 1 - junta * 0.7 }}>{t}</div>
          </Surge>
        );
      })}
      {frame >= lugar + 10 && (
        <Surge de={lugar + 10} style={{ left: 0, right: 0, top: 640, textAlign: "center" }}>
          <div style={{ ...TITULO, fontSize: 96, ...textoDegrade }}>NUM LUGAR SÓ</div>
        </Surge>
      )}
    </>
  );
};

// ---------- fechamento-2: próximos vídeos + Simplí
const SERIE = ["Olho de Deus", "Agentes e Diretoria", "Integração com o ERP e KPIs", "Inteligência de Estoque", "Verbas e Acordos", "Mini Apps"];
export const Fechamento2: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <FotoAna arquivo="ana-bracos.jpg" x={1080} dur={c.dur} />
      <Sequence from={10} layout="none">
        <TarjaAna x={1120} y={810} />
      </Sequence>
      <Surge de={m("próximos") - 6} style={{ left: 120, top: 110 }}>
        <Etiqueta>NOS PRÓXIMOS VÍDEOS</Etiqueta>
      </Surge>
      {SERIE.map((s, i) => (
        <Surge key={s} de={m("aprofundar") - 4 + i * 5} style={{ left: 120, top: 170 + i * 74 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 28, color: VERDE }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontFamily, fontWeight: 800, fontSize: 40, color: "white" }}>{s}</span>
          </div>
        </Surge>
      ))}
      <Surge de={m("Até") - 4} style={{ left: 120, top: 640 }}>
        <Img src={staticFile("midia/logo-simpli-fundo-escuro.png")} style={{ width: 340, marginLeft: -18 }} />
        <div style={{ fontFamily: fonteMono, fontSize: 28, color: CINZA, marginTop: 4, letterSpacing: 1 }}>simpli.ia.br</div>
      </Surge>
      <Surge de={m("bora") - 4} style={{ left: 120, top: 830 }}>
        <div style={{ background: VERDE, color: FUNDO, ...TITULO, fontSize: 44, padding: "14px 28px", borderRadius: 12 }}>BORA SIMPLIFICAR?</div>
      </Surge>
    </>
  );
};
