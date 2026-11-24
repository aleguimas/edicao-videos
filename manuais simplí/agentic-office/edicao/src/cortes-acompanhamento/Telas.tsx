import type React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { PROPOSTAS } from "../acompanhamento/dados";
import { CaixaEmail, EmailResponsavel, MiniRetorno } from "../acompanhamento/Emails";
import { type Cena, marca } from "../ana/voz";
import { Avatar, rampa, useMola } from "../apresentacao/comum";
import { CINZA, FUNDO, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Surge } from "../verbas/Montagem";
import type { Visual } from "../cortes/Ganchos";
import type { TelaV } from "../cortes/Vertical";
import { AlertasM, AtivarM, ConcluidaM, DocumentoM, NumerosM, ParaAprovarM, PainelGeralM, PorPessoaM, ResultadoM, TrechoM } from "../mobile/Acompanhamento";

// Telas desenhadas para o 9:16: a linha do tempo da cobrança vira uma lista de cima para baixo e a
// escalada vira uma escada que sobe. Mesmas regras do vídeo longo (manual revisado, seção 5).
const AMARELO = "#F5B82E";
const VERMELHO = "#FF6B6B";
const uso = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);

const Envelope: React.FC<{ readonly tam: number }> = ({ tam }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <path d="M3 6h18v12H3zM3 7l9 7 9-7" />
  </svg>
);

// ---------- gancho: mensagens de quem cobra na mão dão lugar aos envios do sistema
const MENSAGENS = ["Conseguiu ver aquilo?", "E aí, saiu?", "Cadê o que combinamos?"];
const ENVIOS: readonly [string, string][] = [
  ["Aviso enviado", VERDE],
  ["Lembrete enviado", VERDE],
  ["Cobrança enviada", VERMELHO],
];
export const VisualCobranca: Visual = ({ k }) => (
  <div style={{ position: "relative", width: 860, height: 330, fontFamily }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, opacity: 1 - k }}>
      {MENSAGENS.map((t, i) => (
        <div key={t} style={{ alignSelf: i === 1 ? "flex-end" : "flex-start", fontWeight: 600, fontSize: 40, color: "#C9CEC9", background: "#1F2420", borderRadius: 20, padding: "16px 28px" }}>
          {t}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, opacity: k, transform: `scale(${0.94 + 0.06 * k})` }}>
      {ENVIOS.map(([t, cor]) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 22, boxSizing: "border-box", height: 92, padding: "0 28px", borderRadius: 18, background: "#141815", border: `2px solid ${cor}`, color: cor }}>
          <Envelope tam={46} />
          <span style={{ fontWeight: 800, fontSize: 40, color: "white" }}>{t}</span>
        </div>
      ))}
    </div>
  </div>
);

// ---------- ponte: logo depois do gancho, diz o que é o módulo e onde ele fica
const ETAPAS: readonly (readonly [string, string])[] = [
  ["Demanda", "demanda"],
  ["Ações", "ações"],
  ["Responsável e prazo", "responsável"],
];
export const PonteV: TelaV = ({ c }) => {
  const m = uso(c);
  // a ponte curta (corte 1) só diz o nome: quem explica as etapas é a fala seguinte
  const comEtapas = c.fala.palavras.some((p) => p[2] === "demanda");
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: comEtapas ? 440 : 600, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 460 }} />
      </Surge>
      <Surge de={m("Acompanhamento") - 4} style={{ left: 0, right: 0, top: comEtapas ? 640 : 800, textAlign: "center" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 36, letterSpacing: 6, color: VERDE }}>MÓDULO</div>
        <div style={{ ...TITULO, fontSize: 86, lineHeight: 1.2, letterSpacing: -2, ...textoDegrade }}>ACOMPANHAMENTO</div>
      </Surge>
      <div style={{ position: "absolute", left: 90, right: 90, top: 850, display: "flex", flexDirection: "column", gap: 16, fontFamily }}>
        {comEtapas && ETAPAS.map(([t, p], i) => (
          <div key={t} style={{ height: 112, position: "relative" }}>
            <Surge de={m(p) - 4} style={{ left: 0, right: 0, top: 0, height: 112, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 24, padding: "0 32px", borderRadius: 18, background: "#141815", border: `2px solid ${VERDE}` }}>
              <span style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 36, color: VERDE }}>{i + 1}</span>
              <span style={{ fontWeight: 800, fontSize: 46, color: "white" }}>{t}</span>
            </Surge>
          </div>
        ))}
      </div>
    </>
  );
};

// ---------- aviso: o e-mail que o responsável recebe
export const AvisoV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const acesos = [...(frame >= m("ação") - 4 ? ["acao"] : []), ...(frame >= m("prazo") - 4 ? ["prazo"] : [])];
  return (
    <>
      <Surge de={0} style={{ left: 50, right: 50, top: 410, textAlign: "center" }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: VERDE }}>NA ATIVAÇÃO</div>
      </Surge>
      <Surge de={m("demanda") - 4} style={{ left: 40, top: 480 }}>
        <CaixaEmail assunto="Acompanhamento · Você recebeu 1 ação" para="rafael.lima@lojamodelo.com.br" hora="15:12" largura={1000}>
          <EmailResponsavel tam={29} acesos={acesos} />
        </CaixaEmail>
      </Surge>
    </>
  );
};

// ---------- cadência: um ponto por linha, de cima para baixo
const PONTOS: readonly (readonly [string, string, string])[] = [
  ["Ativação", "aviso", VERDE],
  ["1 dia útil antes", "lembrete", VERDE],
  ["Dia do prazo", "aviso", AMARELO],
  ["1º dia útil de atraso", "cobrança", VERMELHO],
  ["3º dia útil", "cobrança", VERMELHO],
  ["8º dia útil", "cobrança", VERMELHO],
  ["13º dia útil", "cobrança", VERMELHO],
];
const X_LINHA = 100;
const TOPO_LISTA = 400;
const PASSO = 116;
const R = 42;
export const CadenciaV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const de = [-99, m("Um") - 4, m("No") - 4, m("primeiro") - 4, m("terceiro") - 4, m("cinco") - 4, m("cinco") + 8];
  const atual = de.reduce((u, d, i) => (frame >= d ? i : u), 0);
  const y = (i: number) => TOPO_LISTA + R + i * PASSO;
  const fimLinha = interpolate(frame, de, de.map((_, i) => y(i)), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: X_LINHA - 3, top: y(0), width: 6, height: y(6) - y(0), borderRadius: 3, background: "#2A2F2B" }} />
      <div style={{ position: "absolute", left: X_LINHA - 3, top: y(0), width: 6, height: fimLinha - y(0), borderRadius: 3, background: VERDE, boxShadow: "0 0 18px rgba(60,224,30,0.6)" }} />
      {PONTOS.map(([rotulo, sub, cor], i) => {
        const k = rampa(frame, de[i], 10);
        if (k <= 0) return null;
        const aceso = i === atual;
        return (
          <div key={rotulo} style={{ position: "absolute", left: X_LINHA - R, right: 50, top: y(i) - R, height: 2 * R, display: "flex", alignItems: "center", gap: 26, opacity: k, transform: `translateX(${(1 - k) * 30}px)` }}>
            <div style={{ flex: "none", width: 2 * R, height: 2 * R, boxSizing: "border-box", borderRadius: "50%", display: "grid", placeItems: "center", background: "#141815", border: `3px solid ${cor}`, color: cor, boxShadow: aceso ? `0 0 34px ${cor}` : "none" }}>
              <Envelope tam={44} />
            </div>
            <div style={{ flex: 1, fontFamily, fontWeight: 800, fontSize: 44, color: aceso ? "white" : "#C9CEC9" }}>{rotulo}</div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 38, color: cor }}>{sub}</div>
          </div>
        );
      })}
      <Surge de={m("resolvida") - 8} style={{ left: 0, right: 0, top: 1216, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 42, color: CINZA }}>
          até a ação ser <span style={{ color: VERDE }}>resolvida</span>
        </div>
      </Surge>
    </>
  );
};

// ---------- escalada: a cobrança sobe de baixo para cima
const ALTURA_DEGRAU = 230;
const Degrau: React.FC<{ readonly de: number; readonly y: number; readonly cor: string; readonly etiqueta: string; readonly titulo: React.ReactNode; readonly nota?: string; readonly notaDe?: number; readonly seta?: boolean }> = ({ de, y, cor, etiqueta, titulo, nota, notaDe = 0, seta }) => {
  const frame = useCurrentFrame();
  return (
    <Surge de={de} style={{ left: 50, right: 50, top: y }}>
      {seta && (
        <svg width={44} height={22} viewBox="0 0 44 22" style={{ position: "absolute", left: 478, top: 4 + ALTURA_DEGRAU }}>
          <path d="M4 20 L22 4 L40 20" fill="none" stroke={VERMELHO} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <div style={{ boxSizing: "border-box", height: ALTURA_DEGRAU, padding: "24px 32px", borderRadius: 20, background: "#141815", border: `3px solid ${cor}`, boxShadow: `0 0 40px ${cor}33` }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: cor }}>{etiqueta}</div>
        <div style={{ ...TITULO, fontSize: 52, lineHeight: 1.08, color: "white", marginTop: 12 }}>{titulo}</div>
        {nota && <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA, marginTop: 10, opacity: rampa(frame, notaDe, 8) }}>{nota}</div>}
      </div>
    </Surge>
  );
};
export const EscalaV: TelaV = ({ c }) => {
  const m = uso(c);
  return (
    <>
      <Surge de={m("sobe") - 6} style={{ left: 50, top: 430 }}>
        <div style={{ ...TITULO, fontSize: 60, lineHeight: 1, color: "white" }}>
          A COBRANÇA <span style={textoDegrade}>SOBE</span>
        </div>
      </Surge>
      <Degrau de={m("atraso") - 6} y={1060} cor={AMARELO} etiqueta="ATRASOU" titulo={<>O responsável é cobrado por <span style={{ whiteSpace: "nowrap" }}>e-mail</span></>} />
      <Degrau de={m("terceiro") - 4} y={800} cor={VERMELHO} etiqueta="A PARTIR DO 3º DIA ÚTIL" titulo="A referência da área recebe um resumo" seta />
      <Degrau de={m("quarta") - 4} y={540} cor={VERMELHO} etiqueta="4ª COBRANÇA SEM RESPOSTA" titulo='Vai para "Precisa de você"' nota="e notifica no navegador quem acompanha" notaDe={m("notificação") - 4} seta />
    </>
  );
};

// ---------- visuais dos ganchos
const CartaoVisual: React.FC<{ readonly cor?: string; readonly children: React.ReactNode }> = ({ cor = VERDE, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, boxSizing: "border-box", height: 92, padding: "0 28px", borderRadius: 18, background: "#141815", border: `2px solid ${cor}`, fontFamily, fontWeight: 800, fontSize: 40, color: "white" }}>{children}</div>
);
const Pilha: React.FC<{ readonly k: number; readonly antes: React.ReactNode; readonly depois: React.ReactNode; readonly altura?: number }> = ({ k, antes, depois, altura = 330 }) => (
  <div style={{ position: "relative", width: 860, height: altura, fontFamily }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, opacity: 1 - k }}>{antes}</div>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, opacity: k, transform: `scale(${0.94 + 0.06 * k})` }}>{depois}</div>
  </div>
);
const Linhas: React.FC<{ readonly itens: readonly (readonly [string, string])[] }> = ({ itens }) => (
  <>
    {itens.map(([a, b]) => (
      <CartaoVisual key={a}>
        <span style={{ flex: 1 }}>{a}</span>
        <span style={{ fontSize: 34, color: VERDE }}>{b}</span>
      </CartaoVisual>
    ))}
  </>
);
const SEM_DONO: readonly (readonly [string, number])[] = [
  ["Pedido de estoque", -3],
  ["Campanha", 2],
  ["Contratar equipe", -2],
];
export const VisualDono: Visual = ({ k }) => (
  <Pilha
    k={k}
    antes={SEM_DONO.map(([t, r], i) => (
      <div key={t} style={{ alignSelf: i === 1 ? "flex-end" : "flex-start", transform: `rotate(${r}deg)`, background: "#FFD84D", color: "#1B1E1C", fontWeight: 800, fontSize: 40, padding: "16px 28px", borderRadius: 6 }}>{t}</div>
    ))}
    depois={<Linhas itens={[["Pedido de estoque", "Rafael"], ["Campanha", "Pedro"], ["Contratar equipe", "Helena"]]} />}
  />
);
export const VisualAta: Visual = ({ k }) => (
  <Pilha
    k={k}
    antes={
      <div style={{ alignSelf: "center", width: 300, height: 320, boxSizing: "border-box", padding: 26, background: "#F2F2EE", borderRadius: 8, color: "#1B1E1C", fontWeight: 800, fontSize: 36 }}>
        ATA
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ height: 11, marginTop: 20, width: `${95 - i * 9}%`, background: "#C9CCC9", borderRadius: 5 }} />
        ))}
      </div>
    }
    depois={<Linhas itens={[["Pedido de estoque", "13/11"], ["Campanha", "19/11"], ["Data com a arquitetura", "06/11"]]} />}
  />
);
export const VisualRevisa: Visual = ({ k }) => (
  <Pilha
    k={k}
    antes={<div style={{ alignSelf: "center", ...TITULO, fontSize: 240, lineHeight: 1, color: "#3A3F3B" }}>?</div>}
    depois={
      <>
        {["Trecho conferido", "Alerta no prazo", "Autorizar e ativar"].map((t) => (
          <CartaoVisual key={t}>
            <span style={{ color: VERDE }}>✓</span>
            {t}
          </CartaoVisual>
        ))}
      </>
    }
  />
);
export const VisualEmail: Visual = ({ k }) => (
  <Pilha
    k={k}
    antes={
      <div style={{ alignSelf: "center", width: 560, boxSizing: "border-box", padding: 30, borderRadius: 16, border: "2px solid #2A2F2B", background: "#141815" }}>
        <div style={{ fontFamily: fonteMono, fontSize: 30, color: "#9AA19C" }}>usuário</div>
        <div style={{ height: 44, borderRadius: 8, background: "#1F2420", marginTop: 12 }} />
        <div style={{ fontFamily: fonteMono, fontSize: 30, color: "#9AA19C", marginTop: 22 }}>senha</div>
        <div style={{ height: 44, borderRadius: 8, background: "#1F2420", marginTop: 12 }} />
      </div>
    }
    depois={
      <>
        {["Ação concluída", "Solicitar novo prazo", "Ação de outra área/pessoa"].map((t) => (
          <CartaoVisual key={t}>
            <span style={{ color: VERDE, display: "grid" }}><Envelope tam={46} /></span>
            {t}
          </CartaoVisual>
        ))}
      </>
    }
  />
);
export const VisualAprova: Visual = ({ k }) => (
  <Pilha
    k={k}
    altura={260}
    antes={
      <div style={{ alignSelf: "center", background: "#1F2420", color: "#C9CEC9", fontWeight: 600, fontSize: 44, padding: "20px 34px", borderRadius: 20 }}>Pode deixar, já fiz!</div>
    }
    depois={
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1, height: 130, display: "grid", placeItems: "center", borderRadius: 18, background: VERDE, color: FUNDO, fontWeight: 800, fontSize: 48 }}>✓ Aprovar</div>
        <div style={{ flex: 1, height: 130, display: "grid", placeItems: "center", borderRadius: 18, border: "2px solid #5A615C", color: "white", fontWeight: 800, fontSize: 48 }}>✕ Recusar</div>
      </div>
    }
  />
);
const BARRAS: readonly [string, number, string][] = [
  ["Compras", 0.92, VERDE],
  ["Marketing", 0.66, VERDE],
  ["Obras", 0.34, VERMELHO],
];
export const VisualPainel: Visual = ({ k }) => (
  <div style={{ width: 860, display: "flex", flexDirection: "column", gap: 22, fontFamily }}>
    {BARRAS.map(([t, v, cor]) => (
      <div key={t} style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 240, fontWeight: 800, fontSize: 38, color: "white" }}>{t}</div>
        <div style={{ flex: 1, height: 46, borderRadius: 12, background: "#1F2420" }}>
          <div style={{ width: `${(v * k + 0.04 * (1 - k)) * 100}%`, height: "100%", borderRadius: 12, background: cor }} />
        </div>
      </div>
    ))}
  </div>
);

// ---------- corte 1: como funciona, em pé
const NoV: React.FC<{ readonly de: number; readonly y: number; readonly rotulo: string; readonly titulo: string; readonly nota?: string; readonly notaDe?: number }> = ({ de, y, rotulo, titulo, nota, notaDe = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <Surge de={de} style={{ left: 50, right: 50, top: y }}>
      <div style={{ boxSizing: "border-box", height: 200, padding: "22px 32px", borderRadius: 20, background: "#141815", border: `2px solid ${VERDE}` }}>
        <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 28, letterSpacing: 3, color: VERDE }}>{rotulo}</div>
        <div style={{ ...TITULO, fontSize: 54, lineHeight: 1.08, color: "white", marginTop: 8 }}>{titulo}</div>
        {nota && <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA, marginTop: 6, opacity: rampa(frame, notaDe, 8) }}>{nota}</div>}
      </div>
    </Surge>
  );
};
export const ConceitoV: TelaV = ({ c }) => {
  const m = uso(c);
  return (
    <>
      <NoV de={m("assunto") - 4} y={410} rotulo="DEMANDA" titulo="O assunto" nota="Inauguração da Loja Sul" notaDe={m("assunto")} />
      <NoV de={m("ações") - 4} y={630} rotulo="AÇÕES" titulo="O que precisa ser feito" nota="Pedido de estoque, campanha, equipe" notaDe={m("ações")} />
      <NoV de={m("responsável") - 4} y={850} rotulo="DONO" titulo="Responsável e prazo" nota="Rafael Lima, até 13/11" notaDe={m("prazo") - 4} />
      <Surge de={m("cobra") - 4} style={{ left: 50, right: 50, top: 1080, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 56, lineHeight: 1.1, color: "white" }}>COBRANÇA POR E-MAIL</div>
        <div style={{ ...TITULO, fontSize: 56, lineHeight: 1.1, ...textoDegrade }}>ATÉ RESOLVER</div>
      </Surge>
    </>
  );
};
export const SemAcessoV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  return (
    <>
      <Surge de={m("responsável") - 4} style={{ left: 50, right: 50, top: 410, display: "flex", alignItems: "center", gap: 30 }}>
        <Avatar nome="Rafael" cor={VERDE} foto="pessoas/p92.webp" tam={150} />
        <div>
          <div style={{ ...TITULO, fontSize: 52, color: "white" }}>Rafael Lima</div>
          <div style={{ marginTop: 10, fontFamily: fonteMono, fontWeight: 700, fontSize: 28, color: VERDE, border: `2px solid ${VERDE}`, borderRadius: 8, padding: "6px 14px" }}>SEM ACESSO À PLATAFORMA</div>
        </div>
      </Surge>
      <Surge de={m("tudo") - 4} style={{ left: 40, width: 1000, top: 610 }}>
        <div style={{ borderRadius: 14, overflow: "hidden" }}>
          <EmailResponsavel tam={30} acesos={frame >= m("botões") - 4 ? ["botoes"] : []} />
        </div>
      </Surge>
    </>
  );
};

// ---------- corte 3: da ata ao plano
export const DocumentoV: TelaV = DocumentoM;
// a Clara varrendo a ata: a cena do vídeo longo é larga demais, aqui ata e ações ficam uma sobre a outra
const ACHADAS = [2, 5, 8, 10];
export const LendoV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const atualiza = m("atualiza");
  const achou = (i: number) => frame > 40 + i * 34;
  const barra = interpolate(frame, [12, atualiza - 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Surge de={m("Clara") - 4} style={{ left: 50, right: 50, top: 410, display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 110, height: 110, borderRadius: "50%", overflow: "hidden", border: "4px solid #5ED3F3", boxShadow: "0 0 30px rgba(94,211,243,0.5)" }}>
          <Img src={staticFile("midia/avatars/pessoas/p54.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ fontFamily }}>
          <div style={{ fontWeight: 800, fontSize: 50, color: "white" }}>Clara</div>
          <div style={{ fontWeight: 600, fontSize: 30, color: CINZA }}>assistente do Acompanhamento</div>
        </div>
      </Surge>
      <div style={{ position: "absolute", left: 50, right: 50, top: 550, height: 300, boxSizing: "border-box", padding: "20px 30px", overflow: "hidden", background: "#F2F2EE", borderRadius: 12, opacity: rampa(frame, 4, 10), fontFamily }}>
        <div style={{ fontWeight: 800, fontSize: 28, color: "#1B1E1C", marginBottom: 12 }}>ATA DE REUNIÃO</div>
        {Array.from({ length: 11 }, (_, i) => {
          const a = ACHADAS.indexOf(i);
          const lit = a >= 0 && achou(a);
          return <div key={i} style={{ height: 11, marginBottom: 10, width: `${100 - ((i * 37) % 28)}%`, borderRadius: 4, background: lit ? VERDE : "#C9CCC9" }} />;
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 296 * barra, height: 4, background: VERDE, boxShadow: "0 0 26px 8px rgba(60,224,30,0.55)" }} />
      </div>
      {PROPOSTAS.slice(0, 4).map((p, i) =>
        achou(i) ? (
          <div key={p.texto} style={{ position: "absolute", left: 50, right: 50, top: 870 + i * 96, height: 84, boxSizing: "border-box", padding: "0 26px", display: "flex", alignItems: "center", gap: 18, background: "#141815", border: `2px solid ${VERDE}`, borderRadius: 14, fontFamily, fontWeight: 700, fontSize: 32, color: "white", opacity: rampa(frame, 40 + i * 34, 8) }}>
            <span style={{ color: VERDE, fontWeight: 800 }}>✓</span>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.texto}</span>
          </div>
        ) : null,
      )}
    </>
  );
};
export const ResultadoV: TelaV = ResultadoM;

// ---------- corte 4: você revisa antes
export const TrechoV: TelaV = TrechoM;
export const AlertasV: TelaV = AlertasM;
export const AtivarV: TelaV = AtivarM;

// ---------- corte 5: resposta sem login
export const EmailV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const entre = (de: number, ate: number) => frame >= de && frame < ate;
  const acesos = [...(entre(m("ação") - 4, m("prazo") - 4) ? ["acao"] : []), ...(entre(m("prazo") - 4, m("três") - 4) ? ["prazo"] : []), ...(frame >= m("três") - 4 ? ["botoes"] : [])];
  return (
    <>
      <Surge de={m("abre") - 8} style={{ left: 40, top: 440 }}>
        <CaixaEmail assunto="Acompanhamento · Você recebeu 1 ação" para="rafael.lima@lojamodelo.com.br" hora="15:12" largura={1000}>
          <EmailResponsavel tam={29} acesos={acesos} />
        </CaixaEmail>
      </Surge>
      <Surge de={m("login") - 6} style={{ left: 0, right: 0, top: 1090, display: "flex", justifyContent: "center" }}>
        <div style={{ background: VERDE, color: FUNDO, ...TITULO, fontSize: 56, padding: "14px 36px", borderRadius: 14 }}>SEM LOGIN</div>
      </Surge>
    </>
  );
};
const BOTOES_V: readonly (readonly [string, string, string, string])[] = [
  ["terminou", "Ação concluída", "conta o que foi feito", VERDE],
  ["tempo", "Solicitar novo prazo", "com a nova data e a justificativa", AMARELO],
  ["outra", "Ação de outra área/pessoa", "indica quem deveria responder", "#8FB7FF"],
];
export const BotoesV: TelaV = ({ c }) => {
  const m = uso(c);
  return (
    <>
      {BOTOES_V.map(([p, t, nota, cor], i) => (
        <Surge key={t} de={m(p) - 4} style={{ left: 50, right: 50, top: 440 + i * 280 }}>
          <div style={{ boxSizing: "border-box", height: 250, padding: "0 36px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, borderRadius: 20, background: "#141815", border: `3px solid ${cor}` }}>
            <div style={{ ...TITULO, fontSize: 54, lineHeight: 1.08, color: "white" }}>{t}</div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 36, color: cor }}>{nota}</div>
          </div>
        </Surge>
      ))}
    </>
  );
};

// ---------- corte 6: entrega com aprovação
export const ConcluidaV: TelaV = ConcluidaM;
export const AprovarV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const quadro = m("quadro");
  const clica = m("aprovar", 1) + 2;
  const k = useMola(m("concluída") - 4);
  return (
    <>
      <ParaAprovarM aceso={frame >= quadro - 4 && frame < clica - 8} aprovarAceso={frame >= clica - 8 && frame < clica + 4} aprovada={frame >= clica + 6} />
      <Surge de={m("retorno") - 2} ate={quadro - 12} style={{ left: 169, top: 520 }}>
        <div style={{ width: 742, height: 560, transform: "scale(1.4)", transformOrigin: "0 0" }}>
          <MiniRetorno />
        </div>
      </Surge>
      <div style={{ position: "absolute", left: 50, right: 50, top: 1090, height: 150, display: "grid", placeItems: "center", borderRadius: 20, background: "#141815", border: `3px solid ${VERDE}`, opacity: k, transform: `scale(${0.9 + 0.1 * k})`, ...TITULO, fontSize: 58, color: "white" }}>
        ✓ AÇÃO CONCLUÍDA
      </div>
    </>
  );
};
export const RecusarV: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const clica = m("recusar") + 2;
  const motivo = m("escreve");
  const texto = "Faltou o aceite do fornecedor de embalagens.".slice(0, Math.max(0, Math.floor((frame - motivo) * 1.5)));
  return (
    <>
      <ParaAprovarM recusarAceso={frame >= clica - 8 && frame < clica + 6} recusa={frame >= clica + 2 ? texto : undefined} />
      <Surge de={m("volta") - 6} style={{ left: 40, width: 1000, top: 620 }}>
        <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}>
          <EmailResponsavel tam={28} frase="Marina Costa pediu um retorno sobre esta ação." nota={<>Reaberta por <u>Marina Costa</u>: faltou o aceite do fornecedor de embalagens.</>} />
        </div>
      </Surge>
    </>
  );
};
const QUEM_V: readonly (readonly [string, string])[] = [
  ["criou", "Quem criou a demanda"],
  ["usuários", "Usuários do setor responsável"],
  ["administradores", "Administradores"],
];
export const QuemV: TelaV = ({ c }) => {
  const m = uso(c);
  return (
    <>
      <Surge de={0} style={{ left: 50, top: 420 }}>
        <div style={{ ...TITULO, fontSize: 60, color: "white" }}>
          QUEM PODE <span style={textoDegrade}>APROVAR</span>
        </div>
      </Surge>
      {QUEM_V.map(([p, t], i) => (
        <Surge key={t} de={m(p) - 4} style={{ left: 50, right: 50, top: 510 + i * 134 }}>
          <div style={{ boxSizing: "border-box", height: 116, padding: "0 30px", display: "flex", alignItems: "center", gap: 22, borderRadius: 16, background: "#141815", border: `2px solid ${VERDE}` }}>
            <span style={{ fontFamily, fontWeight: 900, fontSize: 46, color: VERDE }}>✓</span>
            <span style={{ fontFamily, fontWeight: 800, fontSize: 42, color: "white" }}>{t}</span>
          </div>
        </Surge>
      ))}
      <Surge de={m("registra") - 6} style={{ left: 50, right: 50, top: 930 }}>
        <div style={{ boxSizing: "border-box", padding: "26px 32px", borderRadius: 16, background: "#141815", border: `3px solid ${VERDE}`, boxShadow: "0 0 40px rgba(60,224,30,0.3)", fontFamily }}>
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: CINZA }}>HISTÓRICO · 13/11, 09:05</div>
          <div style={{ fontWeight: 800, fontSize: 48, color: "white", marginTop: 12 }}>Aprovado por Marina Costa</div>
        </div>
      </Surge>
    </>
  );
};

// ---------- corte 7: onde está travando
export const NumerosV: TelaV = NumerosM;
export const PorPessoaV: TelaV = PorPessoaM;
export const PainelGeralV: TelaV = PainelGeralM;
