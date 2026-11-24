import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { DEMANDA, EVOLUCAO, INDICADORES_ANDAMENTO, POR_AREA, POR_PESSOA, PROPOSTAS, type Proposta } from "../acompanhamento/dados";
import { type Cena, marca } from "../ana/voz";
import { rampa } from "../apresentacao/comum";
import { AbasM, BotaoM, CartaoM, ChipM, DescricaoM, M, NumeroM, RotuloM, rolagem, SeletorM, TelaM, TituloM } from "./Kit";

// Módulo Acompanhamento no celular. A página da demanda segue a captura real; as janelas (adicionar
// documento, revisão, ativar) não foram capturadas no celular e usam o conteúdo do vídeo longo no
// mesmo padrão visual, como folha que sobe de baixo.
type P = { readonly c: Cena };
const marcas = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
const Grade: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>{children}</div>;

const Topo: React.FC<{ readonly situacao?: string }> = ({ situacao = "Ativa" }) => (
  <>
    <div style={{ fontSize: 12, color: M.suave }}>← Acompanhamento</div>
    <div style={{ marginTop: 4 }}>
      <TituloM tam={21}>{DEMANDA.titulo}</TituloM>
    </div>
    <ChipM cheio style={{ marginTop: 6 }}>{situacao}</ChipM>
    <div style={{ fontSize: 12.5, color: M.suave, lineHeight: 1.4, marginTop: 6 }}>
      {DEMANDA.setor} ({DEMANDA.email})
      <br />
      Criada por {DEMANDA.autora} em {DEMANDA.criada}
    </div>
  </>
);
// folha que sobe de baixo, no lugar da janela do computador
const Folha: React.FC<{ readonly k: number; readonly titulo: string; readonly altura: number; readonly children: React.ReactNode }> = ({ k, titulo, altura, children }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", opacity: k }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: altura, boxSizing: "border-box", padding: 16, background: M.cardSolido, borderTop: `1px solid ${M.borda}`, borderRadius: "12px 12px 0 0", transform: `translateY(${(1 - k) * altura}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600 }}>
        {titulo} <span style={{ color: M.suave }}>✕</span>
      </div>
      {children}
    </div>
  </>
);

// ---------- adicionar documento
export const DocumentoM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const abre = m("Adicionar") + 4;
  const ata = m("ata");
  const cola = m("cola");
  const nada = m("nada");
  const k = rampa(frame, abre, 10);
  return (
    <TelaM
      fixo={
        frame >= abre ? (
          <Folha k={k} titulo="Adicionar documento" altura={330}>
            <div style={{ marginTop: 8 }}>
              <AbasM abas={["Arquivo", "Colar texto"]} ativa={frame >= cola ? "Colar texto" : "Arquivo"} />
            </div>
            {frame < cola ? (
              <div style={{ marginTop: 12, height: 110, boxSizing: "border-box", borderRadius: 6, border: `1px dashed ${frame >= m("PDF") - 4 ? M.verde : M.borda}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13.5 }}>
                {frame >= ata + 2 ? <span>Ata reunião Loja Sul - 03-11-2026.pdf</span> : <span style={{ color: M.suave }}>Escolher arquivo</span>}
                <span style={{ fontSize: 12, color: frame >= m("PDF") - 4 ? M.verde : M.suave }}>PDF, Word ou planilha</span>
              </div>
            ) : (
              <div style={{ marginTop: 12, height: 110, boxSizing: "border-box", padding: 10, borderRadius: 6, border: `1px solid ${M.borda}`, fontSize: 12.5, lineHeight: 1.45, overflow: "hidden" }}>
                {"ATA DE REUNIÃO. Assunto: Inauguração da Loja Sul. Plano de ação: Rafael envia o pedido de estoque até 13/11...".slice(0, Math.max(0, (frame - cola - 6) * 3))}
              </div>
            )}
            <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 4, fontSize: 12.5, lineHeight: 1.4, border: `1px solid ${frame >= nada - 2 ? M.verde : M.borda}`, color: frame >= nada - 2 ? "white" : M.suave }}>Nada é enviado aos responsáveis antes da sua revisão.</div>
          </Folha>
        ) : null
      }
    >
      <Topo />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <BotaoM tam={13}>CSV</BotaoM>
        <BotaoM tam={13}>···</BotaoM>
      </div>
      <CartaoM pad={14} style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>Documentos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <BotaoM tam={13} style={{ height: 32 }}>Nova ação</BotaoM>
            <BotaoM tipo="branco" tam={13} aceso={frame >= m("Adicionar") - 8 && frame < abre + 2} style={{ height: 32 }}>Adicionar documento</BotaoM>
          </div>
        </div>
        <div style={{ fontSize: 13, color: M.suave, marginTop: 10 }}>Nenhum documento ainda. Suba a ata ou o plano: a Clara propõe as ações.</div>
      </CartaoM>
    </TelaM>
  );
};

// ---------- revisão: cada combinado vira uma proposta de ação
type Acesos = { readonly trecho?: boolean; readonly selo?: boolean; readonly resp?: boolean; readonly prazo?: boolean; readonly alerta?: boolean; readonly prazoTexto?: string };
const CartaoProposta: React.FC<{ readonly p: Proposta; readonly i: number; readonly a?: Acesos }> = ({ p, i, a = {} }) => (
  <CartaoM pad={14} style={{ marginTop: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: M.suave }}>
      <span>Ação {i + 1} · {p.secao}</span>
      <ChipM cheio={a.selo} cor={M.verde}>✓ Trecho conferido</ChipM>
    </div>
    <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, marginTop: 8 }}>{p.texto}</div>
    <div style={{ fontSize: 12.5, lineHeight: 1.4, color: a.trecho ? "white" : M.suave, marginTop: 8, padding: "6px 8px", borderLeft: `2px solid ${a.trecho ? M.verde : M.borda}`, background: a.trecho ? "rgba(134,239,172,0.12)" : "transparent" }}>“{p.trecho}”</div>
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11.5, color: M.suave, marginBottom: 3 }}>Responsável</div>
        <SeletorM aceso={a.resp}>{p.responsavel}</SeletorM>
      </div>
      <div style={{ width: 130 }}>
        <div style={{ fontSize: 11.5, color: M.suave, marginBottom: 3 }}>Prazo</div>
        <SeletorM aceso={a.prazo}>{a.prazoTexto ?? p.prazo}</SeletorM>
      </div>
    </div>
    {p.notaPrazo && <div style={{ fontSize: 11.5, color: M.suave, marginTop: 5 }}>{p.notaPrazo}</div>}
    {p.alertas?.map((t) => (
      <div key={t} style={{ marginTop: 8, padding: "6px 9px", borderRadius: 4, fontSize: 12.5, lineHeight: 1.35, color: M.vermelho, background: "rgba(248,113,113,0.1)", border: `1px solid ${a.alerta ? M.vermelho : "rgba(248,113,113,0.35)"}`, boxShadow: a.alerta ? "0 0 14px rgba(248,113,113,0.45)" : "none" }}>
        ⚠ {t}
      </div>
    ))}
  </CartaoM>
);
const Resumo: React.FC<{ readonly aceso?: boolean }> = ({ aceso }) => (
  <CartaoM pad={14} aceso={aceso} style={{ marginTop: 12 }}>
    <RotuloM>Resumo da Clara</RotuloM>
    <div style={{ fontSize: 13, lineHeight: 1.45, marginTop: 6 }}>Reunião sobre a inauguração da Loja Sul: estoque de abertura, campanha, equipe e cronograma da obra.</div>
  </CartaoM>
);
const Revisao: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <>
    <div style={{ fontSize: 12, color: M.suave }}>← {DEMANDA.titulo}</div>
    <div style={{ marginTop: 4 }}>
      <TituloM tam={19}>Revisar ações</TituloM>
    </div>
    <DescricaoM>Ata reunião Loja Sul - 03-11-2026.pdf · a Clara achou 5 ações</DescricaoM>
    {children}
  </>
);
export const ResultadoM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const separou = m("separou");
  const resp = frame >= m("responsável") - 2;
  const prazo = frame >= m("prazo") - 2;
  return (
    <TelaM rola={rolagem(c, 0, [[separou, 205]])}>
      <Revisao>
        <Resumo aceso={frame >= m("resumiu") - 4 && frame < separou - 6} />
        {PROPOSTAS.slice(0, 3).map((p, i) => (
          <div key={p.texto} style={{ opacity: rampa(frame, separou + 8 + i * 8, 8) }}>
            <CartaoProposta p={p} i={i} a={{ resp, prazo }} />
          </div>
        ))}
      </Revisao>
    </TelaM>
  );
};
export const TrechoM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  return (
    <TelaM rola={[[0, 205]]}>
      <Revisao>
        <Resumo />
        <CartaoProposta p={PROPOSTAS[0]} i={0} a={{ trecho: frame >= m("trecho") - 2, selo: frame >= m("selo") - 2 }} />
        <CartaoProposta p={PROPOSTAS[1]} i={1} />
      </Revisao>
    </TelaM>
  );
};
export const AlertasM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const data = m("data", 1);
  const digitado = "06/11/2026".slice(0, Math.max(0, Math.floor((frame - data) * 0.6)));
  return (
    <TelaM rola={rolagem(c, 0, [[m("frase"), 170]])}>
      <CartaoProposta p={PROPOSTAS[3]} i={3} a={{ alerta: frame >= m("passou") - 4, prazo: frame >= data - 4, prazoTexto: frame >= data ? digitado : undefined }} />
      <CartaoProposta p={PROPOSTAS[2]} i={2} a={{ alerta: frame >= m("frase") - 2 }} />
    </TelaM>
  );
};
export const AtivarM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const clica = m("Revisar");
  const abre = clica + 16;
  const previa = m("prévia");
  const aut = m("Autorizar");
  const k = rampa(frame, abre, 10);
  return (
    <TelaM
      rola={[[0, 170]]}
      fixo={
        <>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 16px", background: M.fundo, borderTop: `1px solid ${M.borda}` }}>
            <BotaoM tipo="branco" aceso={frame >= clica - 8 && frame < abre} style={{ width: "100%", justifyContent: "center", boxSizing: "border-box" }}>Revisar e ativar</BotaoM>
          </div>
          {frame >= abre && (
            <Folha k={k} titulo="Revisar e ativar" altura={345}>
              <div style={{ fontSize: 12, color: M.suave, marginTop: 10 }}>Conta de envio</div>
              <SeletorM aceso={frame >= m("conta") - 4 && frame < previa - 8} style={{ marginTop: 4 }}>agente.ia@lojamodelo.com.br</SeletorM>
              <div style={{ fontSize: 12, color: M.suave, marginTop: 10 }}>Prévia do e-mail</div>
              <div style={{ marginTop: 4, padding: 10, borderRadius: 4, background: "white", color: "#1B1E1C", fontSize: 12.5, lineHeight: 1.4, outline: frame >= previa - 4 && frame < aut - 8 ? `2px solid ${M.verde}` : "none" }}>
                <b>Você recebeu 1 ação</b>
                <br />
                Enviar o pedido de abertura de estoque aos fornecedores.
                <br />
                <span style={{ color: "#555" }}>Prazo: 13/11/2026 · {DEMANDA.titulo}</span>
              </div>
              <BotaoM tipo="verde" aceso={frame >= aut - 4} style={{ width: "100%", boxSizing: "border-box", justifyContent: "center", marginTop: 12 }}>Autorizar e ativar</BotaoM>
            </Folha>
          )}
        </>
      }
    >
      <Revisao>
        <Resumo />
        <CartaoProposta p={PROPOSTAS[0]} i={0} a={{ selo: true }} />
      </Revisao>
    </TelaM>
  );
};

// ---------- página de resposta que o responsável abre pelo e-mail (sem login)
export const ConcluidaM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const clica = m("clica");
  const desc = m("descreve");
  const anexa = m("anexar");
  const texto = "Pedido enviado aos 12 fornecedores, com o aceite de cada um.".slice(0, Math.max(0, Math.floor((frame - desc) * 1.4)));
  return (
    <TelaM>
      <RotuloM>Acompanhamento · {DEMANDA.titulo}</RotuloM>
      <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3, marginTop: 10 }}>Enviar o pedido de abertura de estoque aos fornecedores.</div>
      <div style={{ fontSize: 12.5, color: M.suave, marginTop: 6 }}>Rafael Lima · prazo 13/11/2026</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <BotaoM tipo="verde" tam={13} aceso={frame >= clica - 2} style={{ height: 32 }}>Ação concluída</BotaoM>
        <BotaoM tam={13} style={{ height: 32 }}>Solicitar novo prazo</BotaoM>
      </div>
      <CartaoM pad={14} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>O que foi feito</div>
        <div style={{ height: 76, boxSizing: "border-box", marginTop: 6, padding: 9, borderRadius: 4, border: `1px solid ${frame >= desc - 2 ? M.verde : M.borda}`, fontSize: 13.5, lineHeight: 1.4 }}>{texto}</div>
        <div style={{ fontSize: 11.5, color: M.suave, marginTop: 4 }}>Pelo menos 10 caracteres.</div>
        <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 12 }}>Evidência da entrega (opcional)</div>
        <SeletorM aceso={frame >= anexa - 2} style={{ marginTop: 6 }}>{frame >= anexa + 6 ? "aceites-fornecedores.pdf" : "Escolher arquivos"}</SeletorM>
        <div style={{ fontSize: 11.5, color: M.suave, marginTop: 4 }}>Documento, foto ou planilha · até 5 arquivos de 10 MB.</div>
      </CartaoM>
      <div style={{ fontSize: 12, color: M.suave, marginTop: 10, lineHeight: 1.4 }}>O retorno vai para análise; o status e o prazo só mudam depois da aprovação.</div>
    </TelaM>
  );
};

// ---------- quadro Para aprovar
export const ParaAprovarM: React.FC<{ readonly aceso?: boolean; readonly aprovarAceso?: boolean; readonly recusarAceso?: boolean; readonly aprovada?: boolean; readonly recusa?: string }> = ({ aceso, aprovarAceso, recusarAceso, aprovada, recusa }) => (
  <TelaM>
    <TituloM icone="acompanhamento">Acompanhamento</TituloM>
    <div style={{ marginTop: 8 }}>
      <AbasM abas={["Demandas", "Painel geral", "Pessoas e áreas"]} ativa="Demandas" />
    </div>
    <CartaoM pad={14} aceso={aceso} style={{ marginTop: 14 }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>Para aprovar ({aprovada ? 0 : 1})</div>
      <div style={{ fontSize: 12.5, color: M.suave, lineHeight: 1.4, marginTop: 3 }}>Retornos dos responsáveis. O status e o prazo da ação só mudam depois da sua aprovação.</div>
      {aprovada ? (
        <div style={{ fontSize: 13.5, color: M.suave, marginTop: 16 }}>Nenhum retorno esperando decisão.</div>
      ) : (
        <CartaoM pad={12} style={{ marginTop: 10 }}>
          <ChipM cheio>Ação concluída</ChipM>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, marginTop: 8 }}>Enviar o pedido de abertura de estoque aos fornecedores.</div>
          <div style={{ fontSize: 11.5, color: M.suave, marginTop: 4 }}>Rafael Lima · enviado 12/11, 16:40 · prazo 13/11/2026</div>
          <div style={{ fontSize: 13, lineHeight: 1.4, marginTop: 8 }}>Pedido enviado aos 12 fornecedores, com o aceite de cada um.</div>
          <div style={{ marginTop: 6 }}>
            <ChipM cor={M.suave}>aceites-fornecedores.pdf</ChipM>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <BotaoM tipo="branco" aceso={aprovarAceso}>✓ Aprovar</BotaoM>
            <BotaoM aceso={recusarAceso}>✕ Recusar</BotaoM>
          </div>
          {recusa !== undefined && <div style={{ height: 52, boxSizing: "border-box", marginTop: 8, padding: 8, borderRadius: 4, border: `1px solid ${M.verde}`, fontSize: 13, lineHeight: 1.35 }}>{recusa}</div>}
        </CartaoM>
      )}
    </CartaoM>
  </TelaM>
);

// ---------- números da demanda, quadros por pessoa e por área, evolução
const Numeros: React.FC<{ readonly k: number; readonly aceso?: string }> = ({ k, aceso }) => {
  const I = INDICADORES_ANDAMENTO;
  return (
    <Grade>
      <NumeroM rotulo="Ações" valor={Math.round(I.acoes * k)} nota="ativadas, sem as canceladas" aceso={aceso === "acoes"} />
      <NumeroM rotulo="Concluídas" valor={`${Math.round(40 * k)}%`} nota="2 de 5" aceso={aceso === "concluidas"} />
      <NumeroM rotulo="No prazo" valor={`${(I.noPrazo * k).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`} nota="2 de 3, pelo primeiro prazo" aceso={aceso === "noPrazo"} />
      <NumeroM rotulo="Atrasadas" valor={Math.round(I.atrasadas * k)} nota="1 ação" cor={M.vermelho} aceso={aceso === "atrasadas"} />
    </Grade>
  );
};
export const NumerosM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const k = interpolate(frame, [m("tudo") - 6, m("tudo") + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const passos: [string, number][] = [["acoes", m("total")], ["concluidas", m("concluídas")], ["atrasadas", m("atrasadas")], ["noPrazo", m("prazo")]];
  const aceso = [...passos].reverse().find(([, f]) => frame >= f - 4)?.[0];
  return (
    <TelaM rola={rolagem(c, 0, [[m("total"), 128]])}>
      <Topo />
      <Numeros k={k} aceso={aceso} />
    </TelaM>
  );
};
const Tabela: React.FC<{ readonly titulo: string; readonly col: string; readonly linhas: typeof POR_PESSOA; readonly aceso?: boolean }> = ({ titulo, col, linhas, aceso }) => (
  <CartaoM pad={14} aceso={aceso} style={{ marginTop: 12 }}>
    <div style={{ fontSize: 14, fontWeight: 600 }}>{titulo}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 58px 68px 44px", fontSize: 11, color: M.suave, marginTop: 10 }}>
      <span>{col}</span>
      <span>Abertas</span>
      <span>Atrasadas</span>
      <span>Feitas</span>
    </div>
    {linhas.map(([n, a, t, f]) => (
      <div key={n} style={{ display: "grid", gridTemplateColumns: "1fr 58px 68px 44px", fontSize: 13, padding: "7px 0", borderTop: `1px solid ${M.borda}` }}>
        <span>{n}</span>
        <span>{a}</span>
        <span style={{ color: t ? M.vermelho : "white" }}>{t}</span>
        <span>{f}</span>
      </div>
    ))}
  </CartaoM>
);
const Evolucao: React.FC<{ readonly k: number; readonly aceso?: boolean }> = ({ k, aceso }) => (
  <CartaoM pad={14} aceso={aceso} style={{ marginTop: 12 }}>
    <div style={{ fontSize: 14, fontWeight: 600 }}>Previsto × concluído, semana a semana</div>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, marginTop: 10 }}>
      {EVOLUCAO.semanas.map((s, i) => (
        <div key={s} style={{ flex: 1, textAlign: "center", fontSize: 10, color: M.suave }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 100 }}>
            <div style={{ flex: 1, height: EVOLUCAO.previstas[i] * 19 * k, background: "#5A615C", borderRadius: "2px 2px 0 0" }} />
            <div style={{ flex: 1, height: (EVOLUCAO.concluidas[i] ?? 0) * 19 * k, background: M.verdeForte, borderRadius: "2px 2px 0 0" }} />
          </div>
          <div style={{ marginTop: 4 }}>{s}</div>
        </div>
      ))}
    </div>
  </CartaoM>
);
export const PorPessoaM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const area = m("área");
  const grafico = m("gráfico");
  return (
    <TelaM rola={rolagem(c, 0, [[area, 230], [grafico, 500]])}>
      <Tabela titulo="Por pessoa" col="Pessoa" linhas={POR_PESSOA} aceso={frame >= m("pessoa") - 4 && frame < area - 4} />
      <Tabela titulo="Por área" col="Área" linhas={POR_AREA} aceso={frame >= area - 4 && frame < grafico - 8} />
      <Evolucao k={rampa(frame, grafico + 6, 30)} aceso={frame >= grafico} />
    </TelaM>
  );
};
const MESES: [string, number][] = [["08/26", 62], ["09/26", 71], ["10/26", 58], ["11/26", 79]];
const ATRASOS: [string, number][] = [["Equipe Obras", 4], ["Sérgio Nunes", 2], ["Pedro Alves", 1]];
export const PainelGeralM: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = marcas(c);
  const mes = m("percentual");
  const quem = m("quem");
  const k = rampa(frame, mes - 4, 24);
  return (
    <TelaM rola={rolagem(c, 0, [[mes, 330], [quem, 560]])}>
      <TituloM icone="acompanhamento">Acompanhamento</TituloM>
      <DescricaoM>Somando as demandas ativas e pausadas.</DescricaoM>
      <div style={{ marginTop: 8 }}>
        <AbasM abas={["Demandas", "Painel geral", "Pessoas e áreas"]} ativa="Painel geral" />
      </div>
      <Grade>
        <NumeroM rotulo="Ações" valor="57" nota="ativadas, sem as canceladas" aceso={frame < mes - 10} />
        <NumeroM rotulo="Concluídas" valor="28,1%" nota="16 de 57" aceso={frame < mes - 10} />
        <NumeroM rotulo="No prazo" valor="56,5%" nota="13 de 23" aceso={frame < mes - 10} />
        <NumeroM rotulo="Atrasadas" valor="6" nota="7,3 dias úteis em média" cor={M.vermelho} aceso={frame < mes - 10} />
      </Grade>
      <CartaoM pad={14} aceso={frame >= mes - 4 && frame < quem - 8} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>No prazo, mês a mês</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 130, marginTop: 10 }}>
          {MESES.map(([d, v]) => (
            <div key={d} style={{ flex: 1, textAlign: "center", fontSize: 10.5, color: M.suave }}>
              <div style={{ height: v * 1.2 * k, background: M.verdeForte }} />
              <div style={{ marginTop: 4 }}>{d}</div>
            </div>
          ))}
        </div>
      </CartaoM>
      <CartaoM pad={14} aceso={frame >= quem - 2} style={{ marginTop: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Quem tem mais atrasos</div>
        {ATRASOS.map(([n, v]) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "8px 0", borderTop: `1px solid ${M.borda}`, marginTop: 6 }}>
            <span>{n}</span>
            <b style={{ color: M.vermelho, fontWeight: 600 }}>{v}</b>
          </div>
        ))}
      </CartaoM>
    </TelaM>
  );
};
