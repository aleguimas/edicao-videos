import type React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Icone } from "../agentic/App";
import { ANTES, type Cena, FPS, marca, type Vozes } from "../ana/voz";
import { rampa, useMola } from "../apresentacao/comum";
import { CapaV, GanchoV, type TextoG, type Visual } from "../cortes/Ganchos";
import { LARGURA, MontagemVertical, type TelaV } from "../cortes/Vertical";
import { CINZA, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { ESCALA, M, TELA, TelaM, ChipM } from "../mobile/Kit";
import { type Campanha, PriceWatchM, ProspeccaoM } from "../mobile/Modulos";
import { montarRoteiro, Surge } from "../verbas/Montagem";
import vozes from "../voz-decisao.json";
import { BotaoFolha, DECISOES, FolhaDecisao, type ItemDecisao, ListaDecisoes, Toque } from "./Celular";
import { CapaDecisao } from "./Capa";

// Cortes 9:16 do vídeo "Sistema de decisão", um por setor: gancho, dois exemplos de "a ação chega
// pronta, você aprova", a garantia, o fechamento do setor e o convite para o vídeo completo.
// Empresas fictícias: Loja Modelo (varejo), Indústria Modelo (indústria), Consultoria Modelo (serviços).
const VERMELHO = "#FF5A5A";
const marcas = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
// ponto da tela do celular (px de CSS) em px do vídeo
const ponto = (x: number, y: number) => [x * ESCALA, TELA.y + y * ESCALA] as const;
// cena com marcas extras: para reaproveitar uma tela do kit que procura palavras da fala original
const comMarcas = (c: Cena, extra: Record<string, number>): Cena => ({
  ...c,
  fala: { ...c.fala, palavras: [...Object.entries(extra).map(([p, f]) => [(f - ANTES) / FPS, (f - ANTES) / FPS + 0.2, p] as [number, number, string]), ...c.fala.palavras] },
});

// ---------- visual do gancho: o relatório parado vira a ação pronta
const visualAcao =
  (antes: string, depois: string): Visual =>
  ({ k }) => (
    <div style={{ position: "relative", width: 900, height: 250, fontFamily }}>
      <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", borderRadius: 24, border: "2px solid #2A2F2B", background: "#141815", padding: 36, opacity: 1 - k }}>
        <div style={{ fontFamily: fonteMono, fontSize: 30, color: "#9AA19C" }}>{antes}</div>
        <div style={{ height: 22, borderRadius: 11, background: "#1F2420", marginTop: 30 }}>
          <div style={{ width: "34%", height: "100%", borderRadius: 11, background: "#5A615C" }} />
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, boxSizing: "border-box", borderRadius: 24, border: `2px solid ${VERDE}`, background: "#141815", padding: 32, opacity: k, boxShadow: "0 0 60px rgba(60,224,30,0.25)" }}>
        <div style={{ fontSize: 38, fontWeight: 700, color: "white", lineHeight: 1.25 }}>{depois}</div>
        <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
          <div style={{ padding: "14px 30px", borderRadius: 8, background: "white", color: "#0C140F", fontSize: 30, fontWeight: 700 }}>Aprovar</div>
          <div style={{ padding: "14px 30px", borderRadius: 8, border: "2px solid #3A403C", color: "white", fontSize: 30, fontWeight: 600 }}>Recusar</div>
        </div>
      </div>
    </div>
  );

// ---------- exemplo 1 do varejo: a promoção delegada ao César
const DESC_PROMO = "Montar uma promoção para os 38 itens sem giro há 90 dias, com preço atual, preço sugerido e margem de cada item. Respeitar a margem mínima de cada categoria e entregar para aprovação.";
const PROPOSTA = [
  ["Ventilador de coluna 40 cm", "R$ 249,90", "R$ 199,90"],
  ["Jogo de panelas 5 peças", "R$ 389,00", "R$ 319,00"],
  ["Luminária LED de mesa", "R$ 129,90", "R$ 99,90"],
];
const VarejoUm: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const abre = m("delegada") - 2;
  const inicia = m("Iniciar");
  const volta = m("promoção") + 6;
  const aprova = m("aprovar");
  const [lx, ly] = ponto(206, 330);
  const [ix, iy] = ponto(48, 330);
  const titulo = DECISOES[0].titulo;
  return (
    <>
      <TelaM
        menuBadge={3}
        sobre={
          <>
            {frame >= abre + 4 && (
              <FolhaDecisao
                k={rampa(frame, abre + 4, 10)}
                titulo={titulo}
                tipo="Delegação da diretoria"
                agente="César"
                descricao={DESC_PROMO}
                botoes={frame < inicia + 4 ? <><BotaoFolha branco aceso={frame >= inicia - 8}>Iniciar</BotaoFolha><BotaoFolha>Cancelar tarefa</BotaoFolha></> : <ChipM style={{ fontSize: 12.5, padding: "6px 12px" }}>Em andamento · César</ChipM>}
                eventos={[{ texto: `Delegada pela diretoria (Renata) ao agente César: "${titulo}".`, quando: "17/11, 08:00 · Renata" }]}
              />
            )}
            {frame >= volta && (
              <FolhaDecisao
                k={rampa(frame, volta, 12)}
                titulo="Promoção para 38 itens parados — proposta"
                tipo="Aprovação"
                agente="César"
                descricao="Proposta de promoção dos 38 itens parados: desconto médio de 19%, todos acima da margem mínima."
                botoes={<><BotaoFolha branco aceso={frame >= aprova - 8}>Aprovar</BotaoFolha><BotaoFolha>Reprovar</BotaoFolha></>}
                entrega={
                  <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: "#141C17", fontSize: 12.5 }}>
                    {PROPOSTA.map((l) => (
                      <div key={l[0]} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <span>{l[0]}</span>
                        <span>
                          <span style={{ color: M.suave, textDecoration: "line-through" }}>{l[1]}</span> <span style={{ color: M.verde }}>{l[2]}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                }
                eventos={[{ texto: "César entregou a proposta. Renata revisou.", quando: "17/11, 08:31 · César", novo: true }]}
              />
            )}
          </>
        }
      >
        <ListaDecisoes aceso={frame >= m("acha") - 6 ? 0 : -1} />
      </TelaM>
      <Toque x={lx} y={ly} em={abre} />
      {frame < volta && <Toque x={ix} y={iy + 70 * ESCALA} em={inicia} />}
    </>
  );
};

// ---------- exemplo 2 do varejo: Price Watch (tela do kit)
const VarejoDois: TelaV = ({ c }) => {
  const m = marcas(c);
  return <PriceWatchM c={comMarcas(c, { concorrência: m("concorrente"), sugerido: m("sugerido"), margem: m("pronto") })} />;
};

// ---------- indústria: novo prazo e conciliação
const ITENS_INDUSTRIA: ItemDecisao[] = [
  { tipo: "Acompanhamento", espera: "esperando há 2 min", meta: "· Plano de ação da produção", titulo: "3 pedidos de novo prazo", resumo: "Marcos, Júlia e Sérgio pediram mais tempo para entregar as ações...", icone: "acompanhamento" },
  { tipo: "Delegação da diretoria", espera: "esperando há 2 min", meta: "· Mei · delegada por Otávio", titulo: "Diferença de R$ 1.450 entre recebíveis e extrato", resumo: "Conferir o lançamento de 14/11 apontado pela conciliação e propor o ajuste...", icone: "pessoas" },
];
const ABAS_2: readonly (readonly [string, string])[] = [["Todas", "2"], ["Acompanhamento", "1"], ["Delegação da diretoria", "1"]];
const PEDIDOS = [
  ["Marcos Silva", "Ajustar o setup da linha 2", "13/11", "20/11", "A peça de reposição chega na quarta."],
  ["Júlia Ramos", "Treinar o turno da noite no procedimento novo", "19/11", "26/11", "Dois operadores estão de férias."],
  ["Sérgio Nunes", "Revisar o plano de manutenção da prensa", "04/12", "11/12", "Aguardando o laudo do fornecedor."],
] as const;
const IndustriaUm: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const abre = m("três") - 2;
  const decide = m("aprova");
  const [lx, ly] = ponto(206, 330);
  return (
    <>
      <TelaM
        menuBadge={2}
        sobre={
          frame >= abre + 4 ? (
            <FolhaDecisao
              k={rampa(frame, abre + 4, 10)}
              y={interpolate(frame, [abre + 34, abre + 52], [0, 250], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })}
              titulo="3 pedidos de novo prazo — Plano de ação da produção"
              tipo="Acompanhamento"
              agente="Clara"
              descricao="Três responsáveis da produção pediram mais tempo para entregar as suas ações. Aprove ou recuse cada pedido: a resposta vai por e-mail para cada um."
              entrega={
                <div style={{ marginTop: 12 }}>
                  {PEDIDOS.map((p, i) => {
                    const em = decide + i * 10;
                    const feito = frame >= em + 4;
                    return (
                      <div key={p[0]} style={{ marginTop: 10, padding: 12, borderRadius: 8, background: "#141C17", border: `1px solid ${!feito && frame >= em - 6 ? M.verde : M.borda}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 }}>
                          <b style={{ fontWeight: 600 }}>{p[0]}</b>
                          <span style={{ color: M.suave, fontSize: 12 }}>
                            {p[2]} → <span style={{ color: "white" }}>{p[3]}</span>
                          </span>
                        </div>
                        <div style={{ fontSize: 12.5, marginTop: 4 }}>{p[1]}</div>
                        <div style={{ fontSize: 12, color: M.suave, marginTop: 4 }}>Motivo: {p[4]}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          {feito ? (
                            <ChipM cheio style={{ fontSize: 12, padding: "4px 10px" }}>
                              Novo prazo aprovado · e-mail enviado
                            </ChipM>
                          ) : (
                            <>
                              <BotaoFolha branco aceso={frame >= em - 6}>
                                Aprovar
                              </BotaoFolha>
                              <BotaoFolha>Recusar</BotaoFolha>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
              eventos={[{ texto: "Pedidos recebidos pelo Acompanhamento.", quando: "17/11, 07:40 · Clara" }]}
            />
          ) : null
        }
      >
        <ListaDecisoes itens={ITENS_INDUSTRIA} abas={ABAS_2} aceso={frame >= m("três") - 10 ? 0 : -1} />
      </TelaM>
      <Toque x={lx} y={ly} em={abre} />
    </>
  );
};

const IndustriaDois: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const abre = m("diferença") - 2;
  const card = useMola(m("recebíveis") - 4);
  const [lx, ly] = ponto(206, 520);
  return (
    <>
      <TelaM
        menuBadge={2}
        sobre={
          frame >= abre + 4 ? (
            <FolhaDecisao
              k={rampa(frame, abre + 4, 10)}
              titulo={ITENS_INDUSTRIA[1].titulo}
              tipo="Delegação da diretoria"
              agente="Mei"
              descricao={
                <>
                  A conciliação de 14/11 encontrou uma diferença de <b>R$ 1.450,00</b> entre os recebíveis no sistema e o crédito no extrato do banco.{" "}
                  <span style={frame >= m("lançamento") - 4 ? { color: M.verde, fontWeight: 600 } : undefined}>Lançamento apontado: duplicata 3318, cliente Distribuidora Norte.</span> Conferir e propor o ajuste para aprovação.
                </>
              }
              botoes={<><BotaoFolha branco>Iniciar</BotaoFolha><BotaoFolha>Cancelar tarefa</BotaoFolha></>}
              eventos={[{ texto: `Delegada pela diretoria (Otávio) à agente Mei: "${ITENS_INDUSTRIA[1].titulo}".`, quando: "17/11, 08:00 · Otávio" }]}
            />
          ) : null
        }
      >
        <ListaDecisoes itens={ITENS_INDUSTRIA} abas={ABAS_2} aceso={frame >= m("conciliação") - 6 ? 1 : -1} />
      </TelaM>
      <Toque x={lx} y={ly} em={abre} />
      {/* conta da diferença, por cima da parte de baixo da tela */}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1080, padding: "26px 34px", borderRadius: 22, background: "rgba(12,20,15,0.96)", border: `2px solid ${VERDE}`, boxShadow: "0 0 50px rgba(60,224,30,0.25)", opacity: card, transform: `translateY(${(1 - card) * 60}px)`, fontFamily }}>
        {[
          ["Recebíveis no sistema", "R$ 48.920,00", "white", m("recebíveis")],
          ["Extrato do banco", "R$ 47.470,00", "white", m("extrato")],
          ["Diferença", "R$ 1.450,00", VERMELHO, m("extrato") + 10],
        ].map(([r, v, cor, de]) => (
          <div key={r as string} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", opacity: rampa(frame, (de as number) - 4, 8) }}>
            <span style={{ fontWeight: 600, fontSize: 34, color: CINZA }}>{r}</span>
            <span style={{ ...TITULO, fontSize: 40, color: cor as string }}>{v}</span>
          </div>
        ))}
      </div>
    </>
  );
};

// ---------- serviços: ações da reunião e Prospecção
const ITENS_SERVICOS: ItemDecisao[] = [
  { tipo: "Acompanhamento", espera: "esperando há 5 min", meta: "· Calls · Reunião de planejamento", titulo: "5 ações sem dono na reunião de ontem", resumo: "A Clara propôs responsável e prazo para cada ação. Revise e ative...", icone: "acompanhamento" },
  { tipo: "Delegação da diretoria", espera: "esperando há 1 hora", meta: "· Bruna · delegada por Diego", titulo: "Leads da semana prontos para o CRM", resumo: "41 leads qualificados nas duas campanhas ativas...", icone: "pessoas" },
];
const ACOES = [
  ["Enviar a proposta revisada ao cliente", "Fernanda Lopes", "19/11"],
  ["Agendar o workshop de diagnóstico", "Bruno Teixeira", "21/11"],
  ["Levantar os indicadores atuais", "Camila Rocha", "24/11"],
  ["Montar o cronograma do projeto", "Fernanda Lopes", "26/11"],
  ["Validar o escopo com o jurídico", "André Moura", "28/11"],
] as const;
const ServicosUm: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const abre = m("cinco") - 2;
  const distribui = m("distribuição") - 4;
  const aprova = m("aprovar");
  const [lx, ly] = ponto(206, 330);
  return (
    <>
      <TelaM
        menuBadge={2}
        sobre={
          frame >= abre + 4 ? (
            <FolhaDecisao
              k={rampa(frame, abre + 4, 10)}
              y={interpolate(frame, [distribui - 20, distribui - 2, aprova - 22, aprova - 6], [0, 190, 190, 290], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })}
              titulo={ITENS_SERVICOS[0].titulo}
              tipo="Acompanhamento"
              agente="Clara"
              descricao="A reunião de planejamento de ontem terminou com 5 ações sem responsável. A Clara propôs quem fica com cada uma e o prazo, a partir do relatório da call."
              botoes={<><BotaoFolha branco aceso={frame >= aprova - 8}>Aprovar e ativar</BotaoFolha><BotaoFolha>Editar</BotaoFolha></>}
              revisao={
                <div style={{ marginTop: 14 }}>
                  {ACOES.map(([a, r, p], i) => {
                    const on = frame >= distribui + i * 5;
                    return (
                      <div key={a} style={{ padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ fontSize: 13 }}>{a}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 5, fontSize: 12 }}>
                          {on ? (
                            <>
                              <ChipM cheio style={{ fontSize: 11.5 }}>
                                {r}
                              </ChipM>
                              <ChipM style={{ fontSize: 11.5 }}>até {p}</ChipM>
                            </>
                          ) : (
                            <ChipM cor={M.vermelho} style={{ fontSize: 11.5 }}>
                              Sem responsável
                            </ChipM>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
              eventos={[{ texto: "Relatório da call gerado: Reunião de planejamento.", quando: "16/11, 17:20 · Calls" }]}
            />
          ) : null
        }
      >
        <ListaDecisoes itens={ITENS_SERVICOS} abas={ABAS_2} aceso={frame >= m("reunião") - 6 ? 0 : -1} />
      </TelaM>
      <Toque x={lx} y={ly} em={abre} />
    </>
  );
};

const CAMPANHAS_SERVICOS: Campanha[] = [
  ["Indústrias de alimentos · Goiânia", "Google Maps", 212, 41],
  ["Diretores de RH · São Paulo", "LinkedIn", 168, 33],
];
const ServicosDois: TelaV = ({ c }) => {
  const m = marcas(c);
  return <ProspeccaoM c={comMarcas(c, { Google: m("Prospecção"), LinkedIn: m("quarenta") + 30, qualifica: m("qualificados"), CRM: m("CRM") })} campanhas={CAMPANHAS_SERVICOS} />;
};

// ---------- garantia, fechamento do setor e convite
const Garantia: TelaV = ({ c }) => {
  const m = marcas(c);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 470, display: "flex", justifyContent: "center" }}>
        <svg width={200} height={233} viewBox="0 0 24 28" fill="none" stroke={VERDE} strokeWidth={1.4} strokeLinejoin="round">
          <path d="M12 2l9 4v7c0 6-4 11-9 13C7 24 3 19 3 13V6z" />
          <path d="M8 14l3 3 5-6" strokeLinecap="round" />
        </svg>
      </Surge>
      <Surge de={m("nada") - 4} style={{ left: 0, right: 0, top: 760, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.04, color: "white" }}>NADA MUDA</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.04, ...textoDegrade }}>SEM O SEU OK</div>
      </Surge>
      <Surge de={m("histórico") - 6} style={{ left: 0, right: 0, top: 1010, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 44, color: CINZA }}>e cada decisão fica no histórico</div>
      </Surge>
    </>
  );
};

type Setor = { nome: string; icone: string; itens: readonly (readonly [string, string])[]; sob: string };
const fechamento =
  (s: Setor): TelaV =>
  ({ c }) => {
    const m = marcas(c);
    return (
      <>
        <Surge de={0} style={{ left: 0, right: 0, top: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ width: 150, height: 150, borderRadius: 28, border: `3px solid ${VERDE}`, display: "grid", placeItems: "center" }}>
            <Icone nome={s.icone} tam={80} cor={VERDE} />
          </div>
          <div style={{ ...TITULO, fontSize: 120, color: "white" }}>{s.nome}</div>
        </Surge>
        <div style={{ position: "absolute", left: 0, right: 0, top: 780, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {s.itens.map(([p, t]) => (
            <div key={p} style={{ position: "relative", width: LARGURA, height: 84 }}>
              <Surge de={m(p) - 4} style={{ left: 0, right: 0, top: 0, display: "flex", justifyContent: "center" }}>
                <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 38, letterSpacing: 2, color: VERDE, padding: "14px 30px", borderRadius: 12, border: `2px solid ${VERDE}`, background: "rgba(60,224,30,0.08)" }}>{t}</div>
              </Surge>
            </div>
          ))}
        </div>
        <Surge de={m(s.sob) - 4} style={{ left: 0, right: 0, top: 1130, textAlign: "center" }}>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 40, color: CINZA }}>e a Simplí cria</div>
          <div style={{ ...TITULO, fontSize: 76, lineHeight: 1.08, ...textoDegrade }}>SOB MEDIDA</div>
        </Surge>
      </>
    );
  };

const Fim: TelaV = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const s = useMola(m("vídeo") - 6);
  const brilho = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 520 }} />
      </Surge>
      <div style={{ position: "absolute", left: 90, top: 570, width: 900, height: 506, borderRadius: 24, overflow: "hidden", border: `3px solid ${VERDE}`, boxShadow: `0 0 ${40 + brilho * 30}px rgba(60,224,30,0.45)`, opacity: s, transform: `scale(${0.85 + 0.15 * s})` }}>
        <div style={{ width: 1920, height: 1080, transform: `scale(${900 / 1920})`, transformOrigin: "0 0" }}>
          <CapaDecisao />
        </div>
      </div>
      <Surge de={m("ar") - 4} style={{ left: 0, right: 0, top: 1110, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 64, color: "white", lineHeight: 1.05 }}>VÍDEO COMPLETO</div>
        <div style={{ ...TITULO, fontSize: 92, lineHeight: 1.1, ...textoDegrade }}>JÁ NO AR</div>
      </Surge>
    </>
  );
};

// ---------- definição dos cortes
type Def = { n: number; chave: string; titulo: React.ReactNode; rotulo: string; g: TextoG; V: Visual; um: TelaV; dois: TelaV; setor: Setor };
const DEFS: Def[] = [
  {
    n: 1,
    chave: "varejo",
    titulo: (<>decisões<br /><span style={textoDegrade}>no varejo</span></>),
    rotulo: "AGENTIC OFFICE · VAREJO",
    g: { rotulo: "SEU ESTOQUE PARADO", linhas: [], riscada: "SÓ VIRA RELATÓRIO", novo: "VIRA AÇÃO PRONTA", tamRiscada: 84, tamNovo: 92, risca: "relatório", vira: "lá" },
    V: visualAcao("relatório de estoque: 38 itens sem giro", "Promoção para 38 itens parados, dentro da margem mínima."),
    um: VarejoUm,
    dois: VarejoDois,
    setor: { nome: "VAREJO", icone: "estoque", itens: [["estoque", "ESTOQUE"], ["preço", "PREÇO"], ["verba", "VERBA DE FORNECEDOR"]], sob: "módulos" },
  },
  {
    n: 2,
    chave: "industria",
    titulo: (<>decisões<br /><span style={textoDegrade}>na indústria</span></>),
    rotulo: "AGENTIC OFFICE · INDÚSTRIA",
    g: { rotulo: "O PLANO DE AÇÃO", linhas: [], riscada: "AINDA NO PAPEL", novo: "COBRADO E DECIDIDO", tamRiscada: 100, tamNovo: 84, risca: "papel", vira: "cobrar" },
    V: visualAcao("plano de ação da reunião de segunda...", "3 pedidos de novo prazo da produção esperando você."),
    um: IndustriaUm,
    dois: IndustriaDois,
    setor: { nome: "INDÚSTRIA", icone: "acompanhamento", itens: [["produção", "PRODUÇÃO"], ["pedidos", "PEDIDOS"], ["financeiro", "FINANCEIRO"]], sob: "agentes" },
  },
  {
    n: 3,
    chave: "servicos",
    titulo: (<>decisões<br /><span style={textoDegrade}>em serviços</span></>),
    rotulo: "AGENTIC OFFICE · SERVIÇOS",
    g: { rotulo: "AÇÕES DA ÚLTIMA REUNIÃO", linhas: [], riscada: "SEM DONO", novo: "COM DONO E PRAZO", tamRiscada: 120, tamNovo: 90, risca: "dono", vira: "percebeu" },
    V: visualAcao("ata da reunião: 5 ações sem dono", "5 ações com responsável e prazo, prontas para ativar."),
    um: ServicosUm,
    dois: ServicosDois,
    setor: { nome: "SERVIÇOS", icone: "calls", itens: [["combinado", "O QUE FOI COMBINADO"], ["comercial", "O COMERCIAL"]], sob: "módulos" },
  },
];

const VOZES = vozes as unknown as Vozes;
export const CORTES_DECISAO = DEFS.map((d) => {
  const ids = [`${d.chave}-gancho`, `${d.chave}-1`, `${d.chave}-2`, "corte-garantia", `${d.chave}-fim`, "corte-fim"] as const;
  const roteiro = montarRoteiro(VOZES, [...ids.slice(0, 5), ["corte-fim", 30]]);
  const Gancho: TelaV = ({ c }) => <GanchoV c={c} g={d.g} V={d.V} />;
  const telas: Record<string, TelaV> = { [ids[0]]: Gancho, [ids[1]]: d.um, [ids[2]]: d.dois, "corte-garantia": Garantia, [ids[4]]: fechamento(d.setor), "corte-fim": Fim };
  const Corte: React.FC = () => (
    <MontagemVertical itens={roteiro.itens} duracao={roteiro.duracao} telas={telas} semCabecalho={[ids[0], "corte-fim"]} semLegenda={[ids[0]]} titulo={d.titulo} pastaVoz={() => "voz/decisao"} rotulo={d.rotulo} />
  );
  const Capa: React.FC = () => <CapaV g={d.g} V={d.V} />;
  const inicios = Object.fromEntries(roteiro.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));
  return { n: d.n, chave: d.chave, duracao: roteiro.duracao, Corte, Capa, inicios };
});
