import type React from "react";
import { Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { TarjaAna } from "../ana/Ana";
import { type Cena, marca } from "../ana/voz";
import { COR, Cursor, Digitando, caminho, rota } from "../agentic/App";
import { CenaJanela, MENU_INICIO, rampa } from "../apresentacao/comum";
import { CINZA, FUNDO, fontFamily, fonteApp, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Etiqueta, FotoAna, Surge } from "../verbas/Montagem";
import { DEMANDA, PROPOSTAS } from "./dados";
import { BOTAO_DOCUMENTO, ModalDocumento, PaginaDemanda, PaginaLendo, Revisao, topoProposta } from "./Telas";

const MENU = MENU_INICIO;
export const Tela: React.FC<{ readonly quadros: Parameters<typeof CenaJanela>[0]["quadros"]; readonly fora?: React.ReactNode; readonly children: React.ReactNode }> = ({ quadros, fora, children }) => (
  <CenaJanela ativo="Acompanhamento" menu={MENU} quadros={quadros} fora={fora}>
    {children}
  </CenaJanela>
);
export const CENTRO = [1, 820, 480] as const;

// ---------- Abertura e encerramento (a Ana em tela grande)
export const Abertura: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <FotoAna arquivo="ana-verde.jpg" x={120} dur={c.dur} />
      <Surge de={m("Oi") - 4} ate={m("Ana") - 6} style={{ left: 940, top: 300 }}>
        <div style={{ ...TITULO, fontSize: 150, ...textoDegrade }}>Oi!</div>
      </Surge>
      <Sequence from={m("Ana") - 4} layout="none">
        <TarjaAna x={940} y={250} />
      </Sequence>
      <Surge de={m("Acompanhamento") - 4} style={{ left: 940, top: 500 }}>
        <div style={{ ...TITULO, fontSize: 88, lineHeight: 1.05, letterSpacing: -2, ...textoDegrade }}>ACOMPANHAMENTO</div>
      </Surge>
      <Surge de={m("módulo") - 4} style={{ left: 940, top: 640 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 30, color: CINZA, marginBottom: 6 }}>um módulo do</div>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 460, marginLeft: -26 }} />
      </Surge>
    </>
  );
};

export const Fim: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <FotoAna arquivo="ana-bracos.jpg" x={1080} dur={c.dur} />
      <Sequence from={10} layout="none">
        <TarjaAna x={1120} y={810} />
      </Sequence>
      <Surge de={m("Reunião") - 4} style={{ left: 120, top: 180 }}>
        <div style={{ ...TITULO, fontSize: 92, color: "white", lineHeight: 1.05 }}>REUNIÃO BOA</div>
      </Surge>
      <Surge de={m("termina") - 4} style={{ left: 120, top: 284 }}>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.1, ...textoDegrade }}>TERMINA</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.1, ...textoDegrade }}>EM ENTREGA.</div>
      </Surge>
      <Surge de={m("Fala") - 4} style={{ left: 120, top: 530 }}>
        <Img src={staticFile("midia/logo-simpli-fundo-escuro.png")} style={{ width: 380, marginLeft: -20 }} />
        <div style={{ fontFamily: fonteMono, fontSize: 30, color: CINZA, marginTop: 4, letterSpacing: 1 }}>simpli.ia.br</div>
      </Surge>
      <Surge de={m("bora") - 4} style={{ left: 120, top: 760 }}>
        <div style={{ background: VERDE, color: FUNDO, ...TITULO, fontSize: 44, padding: "14px 28px", borderRadius: 12 }}>BORA SIMPLIFICAR?</div>
      </Surge>
    </>
  );
};

// ---------- Gancho: o combinado que se perde depois da reunião
const NOTAS: [string, number, number, number][] = [
  ["Pedido de estoque", 170, 170, -6],
  ["Campanha", 620, 300, 4],
  ["Contratar equipe", 1100, 150, -3],
  ["Falar c/ arquitetura", 1370, 360, 5],
];
const COBRANCAS: [string, number, number][] = [
  ["Cadê aquilo?", 260, 300],
  ["Viu meu e-mail?", 760, 210],
  ["E aí, saiu?", 1260, 320],
  ["Quem ficou com isso?", 480, 520],
  ["Tem previsão?", 1100, 540],
];
export const Gancho: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const ata = m("ata");
  const correr = m("correr");
  return (
    <>
      {NOTAS.map(([t, x, y, r], i) => (
        <Surge key={t} de={m("combinados") - 6 + i * 5} ate={ata - 10} style={{ left: x, top: y }}>
          <div style={{ transform: `rotate(${r}deg)`, background: "#FFD84D", color: "#1B1E1C", fontFamily, fontWeight: 800, fontSize: 38, padding: "18px 28px", borderRadius: 6, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>{t}</div>
        </Surge>
      ))}
      <Surge de={6} ate={m("ninguém") - 8} style={{ left: 0, right: 0, top: 640, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 86, color: "white" }}>
          A REUNIÃO <span style={{ ...textoDegrade }}>ACABOU...</span>
        </div>
      </Surge>
      <Surge de={m("ninguém") - 4} ate={ata - 10} style={{ left: 0, right: 0, top: 600, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 86, color: "white", lineHeight: 1.05 }}>QUEM FICOU</div>
        <div style={{ ...TITULO, fontSize: 86, lineHeight: 1.15, ...textoDegrade }}>COM O QUÊ?</div>
      </Surge>
      {/* a ata vai para a pasta e o prazo passa */}
      <Surge de={ata - 4} ate={correr - 8} style={{ left: 330, top: 270 }}>
        <div style={{ position: "relative", width: 420, height: 400 }}>
          <div style={{ position: "absolute", left: 90, top: interpolate(frame, [m("pasta") - 8, m("pasta") + 8], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), width: 240, height: 300, background: "#F2F2EE", borderRadius: 6, padding: 20, boxSizing: "border-box", color: "#1B1E1C", fontFamily, fontWeight: 800, fontSize: 30 }}>
            ATA
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ height: 8, marginTop: 14, width: `${95 - i * 9}%`, background: "#C9CCC9", borderRadius: 4 }} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, top: 180, width: 420, height: 220, background: "linear-gradient(180deg, #E9B949, #C9962F)", borderRadius: "10px 10px 16px 16px", boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }} />
        </div>
      </Surge>
      <Surge de={m("prazo") - 4} ate={correr - 8} style={{ left: 1040, top: 300 }}>
        <div style={{ position: "relative", width: 400, height: 340, background: "#F2F2EE", borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}>
          <div style={{ height: 84, background: "#E5484D", color: "white", display: "grid", placeItems: "center", fontFamily, fontWeight: 800, fontSize: 34, letterSpacing: 3 }}>PRAZO</div>
          <div style={{ ...TITULO, fontSize: 130, color: "#1B1E1C", textAlign: "center", marginTop: 40 }}>15</div>
          <div style={{ position: "absolute", left: 40, top: 190, width: 320 * rampa(frame, m("passou"), 8), height: 14, borderRadius: 7, background: "#E5484D", transform: "rotate(-14deg)" }} />
        </div>
      </Surge>
      {COBRANCAS.map(([t, x, y], i) => (
        <Surge key={t} de={correr - 4 + i * 9} style={{ left: x, top: y }}>
          <div style={{ background: "#1F2A22", color: "white", border: "1px solid #3A4A3E", fontFamily, fontWeight: 700, fontSize: 40, padding: "18px 30px", borderRadius: "22px 22px 22px 4px", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>{t}</div>
        </Surge>
      ))}
      <Surge de={m("uma", 2) - 4} style={{ left: 0, right: 0, top: 740, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 64, ...textoDegrade, display: "inline-block" }}>UMA POR UMA</div>
      </Surge>
    </>
  );
};

// ---------- Conceito: demanda > ações > responsável e prazo > cobrança
const No: React.FC<{ readonly rotulo: string; readonly titulo: string; readonly linhas: readonly string[]; readonly destaque?: boolean }> = ({ rotulo, titulo, linhas, destaque }) => (
  <div style={{ width: 480, height: 340, boxSizing: "border-box", borderRadius: 20, padding: "30px 32px", background: "#141815", border: `2px solid ${destaque ? VERDE : "#2A2F2B"}`, boxShadow: destaque ? "0 0 60px rgba(60,224,30,0.25)" : "none" }}>
    <Etiqueta>{rotulo}</Etiqueta>
    <div style={{ ...TITULO, fontSize: 46, color: "white", marginTop: 12, lineHeight: 1.05 }}>{titulo}</div>
    {linhas.map((l) => (
      <div key={l} style={{ fontFamily, fontWeight: 600, fontSize: 25, color: CINZA, marginTop: 10 }}>
        {l}
      </div>
    ))}
  </div>
);
const Seta: React.FC<{ readonly de: number; readonly x: number }> = ({ de, x }) => {
  const k = rampa(useCurrentFrame(), de, 10);
  if (k <= 0) return null;
  return (
    <svg style={{ position: "absolute", left: x, top: 400 }} width={80} height={40} viewBox="0 0 80 40">
      <line x1={4} y1={20} x2={4 + 62 * k} y2={20} stroke={VERDE} strokeWidth={5} strokeLinecap="round" />
      {k > 0.95 && <path d="M58 8 L74 20 L58 32" fill="none" stroke={VERDE} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};
export const Conceito: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const prazo = m("prazo");
  return (
    <>
      <Surge de={m("assunto") - 4} style={{ left: 100, top: 250 }}>
        <No rotulo="DEMANDA" titulo="O assunto" linhas={[DEMANDA.titulo]} />
      </Surge>
      <Seta de={m("ações") - 12} x={590} />
      <Surge de={m("ações") - 4} style={{ left: 680, top: 250 }}>
        <No rotulo="AÇÕES" titulo="As tarefas" linhas={["Pedido de estoque", "Campanha", "Equipe da loja"]} />
      </Surge>
      <Seta de={m("responsável") - 12} x={1170} />
      <Surge de={m("responsável") - 4} style={{ left: 1260, top: 250 }}>
        <No rotulo="DONO" titulo="Responsável" linhas={["Rafael Lima"]} />
      </Surge>
      <Surge de={prazo - 4} style={{ left: 1292, top: 480 }}>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 38, color: VERDE }}>prazo 13/11</div>
      </Surge>
      <Surge de={m("cobra") - 4} style={{ left: 100, right: 100, top: 640, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 62, color: "white" }}>
          COBRANÇA POR E-MAIL <span style={{ ...textoDegrade }}>ATÉ RESOLVER</span>
        </div>
      </Surge>
    </>
  );
};

// ---------- Capítulo: a Clara lê a ata
export const Documento: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const abre = m("Adicionar") + 4;
  const ata = m("ata");
  const cola = m("cola");
  const nada = m("nada");
  const k = rampa(frame, abre, 8);
  const zoomModal = [1.5, 970, 470] as const;
  return (
    <Tela
      quadros={rota(CENTRO, [
        [m("Adicionar") - 12, 1.25, 1250, 540],
        [abre + 6, ...zoomModal],
        [nada, 1.55, 960, 400],
      ], c.dur)}
      fora={<Cursor pontos={caminho([900, 640], [[abre, BOTAO_DOCUMENTO.x, BOTAO_DOCUMENTO.y], [ata, 640, 480], [cola, 715, 416]])} cliques={[abre, ata, cola]} />}
    >
      <PaginaDemanda botaoAceso={frame >= m("Adicionar") - 8 && frame < abre + 2} />
      {frame >= abre && (
        <ModalDocumento
          k={k}
          aba={frame >= cola ? "Colar texto" : "Arquivo"}
          arquivo={frame >= ata + 2}
          formatosAcesos={frame >= m("PDF") - 4 && frame < cola}
          avisoAceso={frame >= nada - 2}
          textoColado={<Digitando texto="ATA DE REUNIÃO. Assunto: Inauguração da Loja Sul. Plano de ação: Rafael envia o pedido de estoque até 13/11..." de={cola + 6} porFrame={3} />}
        />
      )}
    </Tela>
  );
};

// a Clara varrendo a ata e achando as ações (ilustração por cima da página)
export const Lendo: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const atualiza = m("atualiza");
  const sai = 1 - rampa(frame, atualiza - 6, 10);
  const entra = rampa(frame, 4, 12);
  const achou = (i: number) => frame > 30 + i * 34;
  const linhas = 12;
  const achadas = [2, 5, 8, 10];
  const barra = interpolate(frame, [12, atualiza - 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Tela
      quadros={rota(CENTRO, [[atualiza - 16, 1, 820, 480], [atualiza, 1.55, 960, 260]], c.dur)}
      fora={
        <div style={{ position: "absolute", left: 340, top: 330, width: 1260, height: 470, opacity: entra * sai, fontFamily: fonteApp }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 620, height: 470, background: "#F2F2EE", borderRadius: 10, overflow: "hidden", padding: "26px 34px", boxSizing: "border-box", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ fontWeight: 800, fontSize: 24, color: "#1B1E1C", marginBottom: 14 }}>ATA DE REUNIÃO</div>
            {Array.from({ length: linhas }, (_, i) => {
              const a = achadas.indexOf(i);
              const lit = a >= 0 && achou(a);
              return <div key={i} style={{ height: 14, marginBottom: 17, width: `${100 - ((i * 37) % 28)}%`, borderRadius: 4, background: lit ? VERDE : "#C9CCC9", boxShadow: lit ? "0 0 14px rgba(60,224,30,0.7)" : "none" }} />;
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 460 * barra, height: 4, background: VERDE, boxShadow: "0 0 26px 8px rgba(60,224,30,0.55)" }} />
          </div>
          <div style={{ position: "absolute", left: 670, top: 0, display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", border: "4px solid #5ED3F3", boxShadow: "0 0 30px rgba(94,211,243,0.5)" }}>
              <Img src={staticFile("midia/avatars/pessoas/p54.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 40, color: "white" }}>Clara</div>
              <div style={{ fontSize: 21, color: COR.suave }}>assistente do Acompanhamento</div>
            </div>
          </div>
          {PROPOSTAS.slice(0, 4).map((p, i) =>
            achou(i) ? (
              <div key={p.texto} style={{ position: "absolute", left: 670, top: 140 + i * 74, width: 590, height: 62, boxSizing: "border-box", padding: "0 20px", display: "flex", alignItems: "center", gap: 14, background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 10, fontSize: 21, opacity: rampa(frame, 30 + i * 34, 8) }}>
                <span style={{ color: VERDE, fontWeight: 800 }}>✓</span>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.texto}</span>
              </div>
            ) : null,
          )}
        </div>
      }
    >
      <PaginaLendo aviso={frame >= atualiza - 2} />
    </Tela>
  );
};

export const Resultado: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const separou = m("separou");
  const rol = interpolate(frame, [separou - 6, separou + 14], [0, topoProposta(0) - 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const acesos = [...(frame >= m("responsável") - 2 ? ["resp-0", "resp-1"] : []), ...(frame >= m("prazo") - 2 ? ["prazo-0", "prazo-1"] : [])];
  return (
    <Tela quadros={rota(CENTRO, [[m("resumiu"), 1.3, 900, 200], [separou, 1, 820, 480]], c.dur)}>
      <Revisao rolagem={rol} resumoAceso={frame >= m("resumiu") - 4 && frame < separou - 6} entradas={[0, 1, 2, 3, 4].map((i) => separou + 8 + i * 8)} acesos={acesos} />
    </Tela>
  );
};

export const Trecho: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const trecho = m("trecho");
  const k = rampa(frame, m("ata") - 4, 10);
  const acesos = [...(frame >= trecho - 2 ? ["trecho-0"] : []), ...(frame >= m("selo") - 2 ? ["selo-0"] : [])];
  return (
    <Tela
      quadros={rota(CENTRO, [[trecho, 1.7, 880, 300]], c.dur)}
      fora={
        <div style={{ position: "absolute", left: 450, top: 360, width: 700, boxSizing: "border-box", padding: "20px 26px", background: "#F2F2EE", borderRadius: 8, color: "#1B1E1C", fontFamily: fonteApp, opacity: k, transform: `translateY(${(1 - k) * 20}px)`, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>4. PLANO DE AÇÃO</div>
          <div style={{ fontSize: 20, lineHeight: 1.5, marginTop: 8 }}>
            <span style={{ background: "rgba(60,224,30,0.5)", padding: "2px 4px" }}>{PROPOSTAS[0].trecho}</span>
          </div>
        </div>
      }
    >
      <Revisao rolagem={topoProposta(0) - 40} entradas={[-99, -99, -99, -99]} acesos={acesos} />
    </Tela>
  );
};

export const Alertas: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const inicio = topoProposta(0) - 40;
  const fim = topoProposta(2) - 30;
  const rol = interpolate(frame, [m("avisa") - 8, m("avisa") + 12], [inicio, fim], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const passou = m("passou");
  const frase = m("frase");
  const vermelho = m("vermelho");
  const data = m("data", 1);
  const acesos = [...(frame >= passou - 4 ? ["alerta-3"] : []), ...(frame >= frase - 2 ? ["alerta-2"] : []), ...(frame >= data - 4 ? ["prazo-3"] : [])];
  return (
    <Tela quadros={rota(CENTRO, [[passou, 1.28, 980, 660], [frase, 1.28, 980, 300], [vermelho, 1.05, 860, 480], [data, 1.45, 880, 640]], c.dur)}>
      <Revisao rolagem={rol} entradas={[-99, -99, -99, -99]} acesos={acesos} prazos={{ 3: frame >= data ? <Digitando texto="06/11/2026" de={data} porFrame={0.6} /> : undefined }} />
    </Tela>
  );
};


