import type React from "react";
import { Img, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Icone } from "../agentic/App";
import { TarjaAna } from "../ana/Ana";
import { type Cena, marca } from "../ana/voz";
import { rampa } from "../apresentacao/comum";
import { CINZA, FUNDO, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { ChipM, DescricaoM, M, SeletorM, TelaM, TituloM } from "../mobile/Kit";
import { FotoAna, Surge } from "../verbas/Montagem";
import { BotaoFolha, Celular, DECISOES, FolhaDecisao, ListaDecisoes, Rotulo, TEL, Toque } from "./Celular";

// Segunda metade do vídeo "Sistema de decisão": conciliação, novo prazo, garantia, setores e fechamento.
// Empresa fictícia: Loja Modelo.
type P = { readonly c: Cena };
const marcas = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
const VERMELHO = "#FF5A5A";
const ESC = TEL.w / 412;
const naTela = (x: number, y: number) => [TEL.x + x * ESC, TEL.y + y * ESC] as const;

// ---------- d3: diferença de R$ 1.450 nos recebíveis de cartão
const Linha: React.FC<{ readonly rotulo: string; readonly valor: string; readonly cor?: string; readonly grande?: boolean }> = ({ rotulo, valor, cor = "white", grande }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 30, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
    <span style={{ fontFamily, fontWeight: 600, fontSize: 30, color: CINZA, whiteSpace: "nowrap" }}>{rotulo}</span>
    <span style={{ ...TITULO, fontSize: grande ? 64 : 44, color: cor, whiteSpace: "nowrap" }}>{valor}</span>
  </div>
);

export const D3: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const toque = m("dia") - 8;
  const k = rampa(frame, toque + 6, 10);
  const ok = m("ok");
  const [tx, ty] = naTela(220, 470);
  const [ix, iy] = naTela(48, 372);
  return (
    <>
      <Celular de={-1}>
        <TelaM
          quadro={TEL}
          menuBadge={3}
          sobre={
            k > 0 ? (
              <FolhaDecisao
                k={k}
                titulo={DECISOES[1].titulo}
                tipo="Delegação da diretoria"
                agente="Mei"
                descricao={
                  <>
                    A conciliação de 14/11 encontrou uma diferença de <b>R$ 1.450,00</b> entre os recebíveis de cartão no sistema (R$ 12.480,00) e o crédito no extrato do banco (R$ 11.030,00).{" "}
                    <span style={frame >= m("lançamento") - 4 ? { color: M.verde, fontWeight: 600 } : undefined}>Lançamento apontado: venda no crédito, lote 0412, loja Centro.</span> Conferir com a adquirente e propor o ajuste para aprovação.
                  </>
                }
                botoes={
                  <>
                    <BotaoFolha branco aceso={frame >= ok - 8}>
                      Iniciar
                    </BotaoFolha>
                    <BotaoFolha>Cancelar tarefa</BotaoFolha>
                  </>
                }
                eventos={[{ texto: `Delegada pela diretoria (Otávio) à agente Mei: "${DECISOES[1].titulo}".`, quando: "17/11, 08:00 · Otávio" }]}
              />
            ) : null
          }
        >
          <ListaDecisoes aceso={frame >= m("financeiro") - 6 ? 1 : -1} />
        </TelaM>
        <Toque x={tx} y={ty} em={toque} />
        {frame >= ok - 10 && <Toque x={ix} y={iy} em={ok} />}
      </Celular>
      <Surge de={m("financeiro") - 6} style={{ left: 1000, top: 110 }}>
        <Rotulo>NO FINANCEIRO · CONCILIAÇÃO</Rotulo>
      </Surge>
      <div style={{ position: "absolute", left: 1000, top: 170, width: 780 }}>
        <div style={{ position: "relative", height: 90 }}>
          <Surge de={m("sistema") - 6} style={{ left: 0, right: 0, top: 0 }}>
            <Linha rotulo="Recebíveis no sistema" valor="R$ 12.480,00" />
          </Surge>
        </div>
        <div style={{ position: "relative", height: 90 }}>
          <Surge de={m("extrato") - 6} style={{ left: 0, right: 0, top: 0 }}>
            <Linha rotulo="Extrato do banco" valor="R$ 11.030,00" />
          </Surge>
        </div>
        <div style={{ position: "relative", height: 110 }}>
          <Surge de={m("extrato") + 6} style={{ left: 0, right: 0, top: 0 }}>
            <Linha rotulo="Diferença" valor="R$ 1.450,00" cor={VERMELHO} grande />
          </Surge>
        </div>
      </div>
      <Surge de={m("dia") - 4} style={{ left: 1000, top: 500 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: VERDE, padding: "14px 22px", borderRadius: 12, border: `2px solid ${VERDE}`, background: "rgba(60,224,30,0.08)" }}>DIA 14/11</div>
          {frame >= m("lançamento") - 4 && <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: VERDE, padding: "14px 22px", borderRadius: 12, border: `2px solid ${VERDE}`, background: "rgba(60,224,30,0.08)" }}>LOTE 0412</div>}
        </div>
      </Surge>
      <Surge de={ok - 8} style={{ left: 1000, top: 620 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA }}>a tarefa de resolver espera o</div>
        <div style={{ ...TITULO, fontSize: 80, lineHeight: 1.05, ...textoDegrade }}>SEU OK</div>
      </Surge>
    </>
  );
};

// ---------- d4: três pedidos de novo prazo no plano de ação
const PEDIDOS = [
  ["Rafael Lima", "Enviar o pedido de estoque aos fornecedores", "13/11", "20/11", "O fornecedor atrasou a tabela de preços."],
  ["Pedro Alves", "Aprovar a campanha de inauguração", "19/11", "26/11", "A agência entrega a nova versão na sexta."],
  ["Helena Duarte", "Contratar a equipe da loja", "04/12", "11/12", "A obra terminou uma semana depois."],
] as const;
const Pedido: React.FC<{ readonly p: (typeof PEDIDOS)[number]; readonly estado: "espera" | "aceso" | "aprovado" | "recusado" }> = ({ p, estado }) => (
  <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: "#141C17", border: `1px solid ${estado === "aceso" ? M.verde : M.borda}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 }}>
      <b style={{ fontWeight: 600 }}>{p[0]}</b>
      <span style={{ color: M.suave, fontSize: 12 }}>
        {p[2]} → <span style={{ color: "white" }}>{p[3]}</span>
      </span>
    </div>
    <div style={{ fontSize: 12.5, marginTop: 4 }}>{p[1]}</div>
    <div style={{ fontSize: 12, color: M.suave, marginTop: 4 }}>Motivo: {p[4]}</div>
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      {estado === "aprovado" ? (
        <ChipM cheio style={{ fontSize: 12, padding: "4px 10px" }}>
          Novo prazo aprovado · e-mail enviado
        </ChipM>
      ) : estado === "recusado" ? (
        <ChipM cor={M.vermelho} style={{ fontSize: 12, padding: "4px 10px" }}>
          Recusado · e-mail enviado
        </ChipM>
      ) : (
        <>
          <BotaoFolha branco aceso={estado === "aceso"}>
            Aprovar
          </BotaoFolha>
          <BotaoFolha>Recusar</BotaoFolha>
        </>
      )}
    </div>
  </div>
);
export const D4: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const toque = m("três") - 2;
  const k = rampa(frame, toque + 6, 10);
  const decide = m("toque");
  const email = m("e-mail");
  const estado = (i: number): "espera" | "aceso" | "aprovado" | "recusado" => {
    const em = decide + i * 10;
    if (frame >= em + 4) return "aprovado";
    if (frame >= em - 6) return "aceso";
    return "espera";
  };
  const [tx, ty] = naTela(220, 590);
  return (
    <>
      <Celular de={-1}>
        <TelaM
          quadro={TEL}
          menuBadge={3}
          sobre={
            k > 0 ? (
              <FolhaDecisao
                k={k}
                titulo="3 pedidos de novo prazo — Plano de ação da semana"
                tipo="Acompanhamento"
                agente="Clara"
                descricao="Três responsáveis pediram mais tempo para entregar as suas ações. Aprove ou recuse cada pedido: a resposta vai por e-mail para cada um."
                entrega={
                  <div style={{ marginTop: 12 }}>
                    {PEDIDOS.map((p, i) => (
                      <Pedido key={p[0]} p={p} estado={estado(i)} />
                    ))}
                  </div>
                }
                eventos={[{ texto: "Pedidos recebidos pelo Acompanhamento.", quando: "17/11, 07:40 · Clara" }]}
              />
            ) : null
          }
        >
          <ListaDecisoes aceso={frame >= m("plano") - 6 ? 2 : -1} />
        </TelaM>
        <Toque x={tx} y={ty} em={toque} />
      </Celular>
      <Surge de={m("plano") - 6} style={{ left: 1000, top: 110 }}>
        <Rotulo>NO PLANO DE AÇÃO DA SEMANA</Rotulo>
      </Surge>
      <Surge de={m("três") - 4} style={{ left: 1000, top: 170 }}>
        <div style={{ ...TITULO, fontSize: 120, lineHeight: 1, color: "white" }}>3</div>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 34, color: CINZA, whiteSpace: "nowrap" }}>pedidos de novo prazo</div>
      </Surge>
      <Surge de={decide - 6} style={{ left: 1000, top: 380 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA }}>a decisão é sua, num toque:</div>
        <div style={{ ...TITULO, fontSize: 62, lineHeight: 1.08, color: "white", whiteSpace: "nowrap" }}>
          <span style={textoDegrade}>APROVAR</span> OU RECUSAR
        </div>
      </Surge>
      <div style={{ position: "absolute", left: 1000, top: 560, display: "flex", flexDirection: "column", gap: 12 }}>
        {PEDIDOS.map((p, i) => (
          <div key={p[0]} style={{ position: "relative", height: 58 }}>
            <Surge de={email - 4 + i * 5} style={{ left: 0, top: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily, fontWeight: 700, fontSize: 30, color: "white", whiteSpace: "nowrap" }}>
                <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke={VERDE} strokeWidth={2} strokeLinecap="round">
                  <rect x={3} y={5} width={18} height={14} rx={2} />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                {p[0]} <span style={{ color: CINZA, fontWeight: 600 }}>recebeu a resposta</span>
              </div>
            </Surge>
          </div>
        ))}
      </div>
    </>
  );
};

// ---------- g1: tudo passa pela aprovação e fica no histórico (Logs)
const HISTORICO = [
  ["08:40", "Você", "Acompanhamento", "Aprovou o novo prazo de Helena Duarte"],
  ["08:40", "Você", "Acompanhamento", "Aprovou o novo prazo de Pedro Alves"],
  ["08:39", "Você", "Acompanhamento", "Aprovou o novo prazo de Rafael Lima"],
  ["08:36", "Você", "Decisões", "Iniciou: Diferença de R$ 1.450 nos recebíveis"],
  ["08:32", "Você", "Decisões", "Aprovou: Promoção para 38 itens parados"],
  ["08:14", "Você", "Decisões", "Iniciou: Promoção para 38 itens parados"],
] as const;
export const G1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const hist = m("histórico") - 6;
  return (
    <>
      <Celular de={-1}>
        <TelaM quadro={TEL}>
          <TituloM icone="logs">Logs</TituloM>
          <DescricaoM>O que as pessoas fizeram nos últimos 60 dias. Registros mais antigos são apagados automaticamente.</DescricaoM>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <SeletorM style={{ flex: 1 }}>Hoje</SeletorM>
            <SeletorM style={{ flex: 2 }}>Todos os setores</SeletorM>
          </div>
          <div style={{ fontSize: 12, letterSpacing: "0.04em", color: M.suave, marginTop: 14 }}>TERÇA-FEIRA, 17 DE NOVEMBRO</div>
          <div style={{ border: `1px solid ${frame >= hist ? M.verde : M.borda}`, borderRadius: 6, marginTop: 8 }}>
            {HISTORICO.map(([h, q, se, a], i) => (
              <div key={a} style={{ display: "flex", gap: 10, padding: "11px 12px", borderTop: i ? `1px solid ${M.borda}` : "none", opacity: rampa(frame, 4 + (HISTORICO.length - 1 - i) * 5, 8) }}>
                <span style={{ fontSize: 12, color: M.suave }}>{h}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13 }}>
                    <b style={{ fontWeight: 600 }}>{q}</b>
                    <ChipM cor={M.suave} style={{ fontSize: 10 }}>
                      {se}
                    </ChipM>
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{a}</div>
                </div>
              </div>
            ))}
          </div>
        </TelaM>
      </Celular>
      <Surge de={0} style={{ left: 1000, top: 150 }}>
        <svg width={120} height={140} viewBox="0 0 24 28" fill="none" stroke={VERDE} strokeWidth={1.6} strokeLinejoin="round">
          <path d="M12 2l9 4v7c0 6-4 11-9 13C7 24 3 19 3 13V6z" />
          <path d="M8 14l3 3 5-6" strokeLinecap="round" />
        </svg>
      </Surge>
      <Surge de={m("nada") - 4} style={{ left: 1000, top: 320 }}>
        <div style={{ ...TITULO, fontSize: 80, lineHeight: 1.04, color: "white", whiteSpace: "nowrap" }}>NADA RODA</div>
        <div style={{ ...TITULO, fontSize: 80, lineHeight: 1.04, ...textoDegrade }}>SOZINHO</div>
      </Surge>
      <Surge de={m("aprovação") - 6} style={{ left: 1000, top: 540 }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 36, color: "white", whiteSpace: "nowrap" }}>✓ toda ação passa pela sua aprovação</div>
      </Surge>
      <Surge de={hist} style={{ left: 1000, top: 610 }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 36, color: "white", whiteSpace: "nowrap" }}>✓ cada decisão fica no histórico</div>
      </Surge>
    </>
  );
};

// ---------- s1 a s3: o setor e o que ele vigia; s4: sob medida
type Setor = { nome: string; fala: string; icone: string; itens: readonly (readonly [string, string])[] };
const SETORES: Setor[] = [
  { nome: "VAREJO", fala: "s1", icone: "estoque", itens: [["ruptura", "Ruptura"], ["preço", "Preço da concorrência"], ["verba", "Verba de fornecedor"]] },
  { nome: "INDÚSTRIA", fala: "s2", icone: "acompanhamento", itens: [["plano", "Plano de ação"], ["pedido", "Pedido na operação"], ["recebíveis", "Recebíveis"]] },
  { nome: "SERVIÇOS", fala: "s3", icone: "calls", itens: [["reunião", "Reunião vira ações"], ["leads", "Leads para o comercial"]] },
];
const Faixa: React.FC<{ readonly s: Setor; readonly i: number; readonly ativa: boolean; readonly m: ((p: string) => number) | null }> = ({ s, i, ativa, m }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 110, right: 110, top: 110 + i * 250, height: 210, boxSizing: "border-box", padding: "0 50px", display: "flex", alignItems: "center", gap: 46, borderRadius: 22, background: ativa ? "rgba(60,224,30,0.07)" : "rgba(255,255,255,0.02)", border: `2px solid ${ativa ? VERDE : "rgba(255,255,255,0.08)"}`, opacity: ativa ? 1 : 0.4 }}>
      <div style={{ width: 96, height: 96, borderRadius: 18, border: `2px solid ${VERDE}`, display: "grid", placeItems: "center", color: VERDE, flexShrink: 0 }}>
        <Icone nome={s.icone} tam={52} cor={VERDE} />
      </div>
      <div style={{ ...TITULO, fontSize: 64, color: "white", width: 400, flexShrink: 0 }}>{s.nome}</div>
      <div style={{ display: "flex", gap: 14, flex: 1 }}>
        {s.itens.map(([p, t]) => {
          const on = !m || frame >= m(p) - 4;
          return (
            <div key={p} style={{ opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 20}px)`, fontFamily: fonteMono, fontWeight: 800, fontSize: 28, letterSpacing: 1, color: VERDE, padding: "12px 20px", borderRadius: 10, border: `2px solid ${VERDE}`, background: "rgba(60,224,30,0.08)", whiteSpace: "nowrap" }}>
              {t.toUpperCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
};
const CenaSetor: React.FC<P & { readonly n: number }> = ({ c, n }) => {
  const m = marcas(c);
  return (
    <>
      {SETORES.slice(0, n + 1).map((s, i) => (
        <Faixa key={s.nome} s={s} i={i} ativa={i === n} m={i === n ? (p) => m(p) : null} />
      ))}
    </>
  );
};
export const S1: React.FC<P> = ({ c }) => <CenaSetor c={c} n={0} />;
export const S2: React.FC<P> = ({ c }) => <CenaSetor c={c} n={1} />;
export const S3: React.FC<P> = ({ c }) => <CenaSetor c={c} n={2} />;

export const S4: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = marcas(c);
  const s = spring({ frame: frame - (m("desenvolve") - 6), fps, config: { damping: 16, stiffness: 120 } });
  return (
    <>
      {SETORES.map((st, i) => (
        <div key={st.nome} style={{ position: "absolute", left: 230 + i * 520, top: 170 - s * 40, width: 420, height: 130, borderRadius: 18, border: `2px solid ${VERDE}`, background: "rgba(60,224,30,0.07)", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, opacity: 0.5 + (1 - s) * 0.5 }}>
          <Icone nome={st.icone} tam={44} cor={VERDE} />
          <div style={{ ...TITULO, fontSize: 46, color: "white" }}>{st.nome}</div>
        </div>
      ))}
      <Surge de={m("específica") - 4} style={{ left: 0, right: 0, top: 370, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 40, color: CINZA }}>o seu setor pede alguma coisa específica?</div>
      </Surge>
      <Surge de={m("desenvolve") - 4} style={{ left: 0, right: 0, top: 450, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 96, lineHeight: 1.05, color: "white" }}>MÓDULOS E AGENTES</div>
        <div style={{ ...TITULO, fontSize: 120, lineHeight: 1.05, ...textoDegrade }}>SOB MEDIDA</div>
      </Surge>
    </>
  );
};

// ---------- f1 e f2: fechamento
const FRASES = [
  ["Menos", "MENOS ABAS", 0],
  ["menos", "MENOS RELATÓRIO PARADO", 1],
  ["mais", "MAIS DECISÕES NO MESMO DIA", 0],
] as const;
export const F1: React.FC<P> = ({ c }) => {
  const m = marcas(c);
  return (
    <>
      {FRASES.map(([p, t, n], i) => (
        <Surge key={t} de={m(p, n) - 4} style={{ left: 0, right: 0, top: 130 + i * 130, textAlign: "center" }}>
          <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.05, ...(i === 2 ? textoDegrade : { color: "white" }) }}>{t}</div>
        </Surge>
      ))}
      <Surge de={m("Agentic") - 6} style={{ left: 0, right: 0, top: 590, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 760 }} />
      </Surge>
    </>
  );
};

export const F2: React.FC<P> = ({ c }) => {
  const m = marcas(c);
  return (
    <>
      <FotoAna arquivo="ana-bracos.jpg" x={1080} dur={c.dur} />
      <Sequence from={10} layout="none">
        <TarjaAna x={1120} y={810} />
      </Sequence>
      <Surge de={m("Quer") - 4} style={{ left: 120, top: 150 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 42, color: CINZA }}>Quer ver isso funcionando</div>
        <div style={{ ...TITULO, fontSize: 86, lineHeight: 1.05, color: "white" }}>NA SUA EMPRESA?</div>
      </Surge>
      <Surge de={m("Fala") - 4} style={{ left: 120, top: 400 }}>
        <Img src={staticFile("midia/logo-simpli-fundo-escuro.png")} style={{ width: 340, marginLeft: -18 }} />
        <div style={{ fontFamily: fonteMono, fontSize: 30, color: CINZA, marginTop: 4, letterSpacing: 1 }}>simpli.ia.br</div>
      </Surge>
      <Surge de={m("bora") - 4} style={{ left: 120, top: 620 }}>
        <div style={{ background: VERDE, color: FUNDO, ...TITULO, fontSize: 48, padding: "16px 30px", borderRadius: 12 }}>BORA SIMPLIFICAR JUNTOS!</div>
      </Surge>
    </>
  );
};
