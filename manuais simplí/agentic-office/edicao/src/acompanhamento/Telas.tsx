import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COR } from "../agentic/App";
import { Botao } from "../apresentacao/comum";
import { VERDE } from "../fonte";
import { ATA, DEMANDA, PROPOSTAS, type Proposta } from "./dados";

// Telas do módulo Acompanhamento. Posições fixas (px da área do módulo, que começa em x=300, y=44
// da janela) para o cursor e a câmera acertarem cada botão.
export const luz = (acesa: boolean | undefined): React.CSSProperties => (acesa ? { boxShadow: `0 0 0 2px ${VERDE}, 0 0 26px rgba(60,224,30,0.45)`, borderRadius: 8 } : {});

export const Campo: React.FC<{ readonly children?: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ height: 50, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 16px", borderRadius: 7, border: `1px solid ${COR.borda}`, background: "#1E2320", fontSize: 19, color: COR.texto, ...style }}>{children}</div>
);

export const Indicador: React.FC<{ readonly rotulo: string; readonly valor: string; readonly nota: string; readonly x: number; readonly y: number }> = ({ rotulo, valor, nota, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 409, height: 116, boxSizing: "border-box", padding: "14px 20px", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 10 }}>
    <div style={{ fontSize: 16, color: COR.suave }}>{rotulo}</div>
    <div style={{ fontSize: 32, fontWeight: 700, marginTop: 2 }}>{valor}</div>
    <div style={{ fontSize: 15, color: COR.suave, marginTop: 2 }}>{nota}</div>
  </div>
);

// topo das páginas internas: volta + título espaçado + selo
export const Topo: React.FC<{ readonly volta: string; readonly titulo: string; readonly selo?: string; readonly tamanho?: number; readonly seloAceso?: boolean }> = ({ volta, titulo, selo, tamanho = 38, seloAceso }) => (
  <>
    <div style={{ position: "absolute", left: 40, top: 24, fontSize: 18, color: COR.suave }}>← {volta}</div>
    <div style={{ position: "absolute", left: 40, top: 52, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ fontSize: tamanho, fontWeight: 700, letterSpacing: tamanho > 34 ? 7 : 4, whiteSpace: "nowrap", textTransform: "uppercase" }}>{titulo}</div>
      {selo && <span style={{ fontSize: 16, fontWeight: 600, padding: "3px 12px", borderRadius: 99, color: selo === "Ativa" ? "#0B0B0C" : COR.texto, background: selo === "Ativa" ? "#9DF57F" : "transparent", border: `1px solid ${selo === "Ativa" ? "#9DF57F" : COR.borda}`, ...(seloAceso ? { boxShadow: `0 0 0 3px ${VERDE}, 0 0 30px rgba(60,224,30,0.7)` } : {}) }}>{selo}</span>}
    </div>
  </>
);

// centro dos botões da página da demanda, em coordenadas da janela
export const BOTAO_DOCUMENTO = { x: 1446, y: 533 };

export const PaginaDemanda: React.FC<{ readonly selo?: string; readonly botaoAceso?: boolean; readonly novaAcesa?: boolean; readonly seloAceso?: boolean }> = ({ selo = "Rascunho", botaoAceso, novaAcesa, seloAceso }) => (
  <>
    <Topo volta="Acompanhamento" titulo={DEMANDA.titulo} selo={selo} seloAceso={seloAceso} />
    <div style={{ position: "absolute", left: 40, top: 112, fontSize: 18, lineHeight: 1.6, color: COR.suave }}>
      {DEMANDA.setor} · prazo final {DEMANDA.prazo} · sem conta de envio (escolhida na primeira ativação)
      <br />
      Criada por {DEMANDA.autora} ({DEMANDA.emailAutora}) em {DEMANDA.criada}
    </div>
    <Indicador x={40} y={186} rotulo="Ações" valor="0" nota="ativadas, sem as canceladas" />
    <Indicador x={465} y={186} rotulo="Concluídas" valor="—" nota="0 de 0" />
    <Indicador x={890} y={186} rotulo="No prazo" valor="—" nota="contra o primeiro prazo" />
    <Indicador x={40} y={316} rotulo="Atrasadas" valor="0" nota="nenhuma" />
    <Indicador x={465} y={316} rotulo="Reagendadas" valor="0" nota="pediram nova data" />
    <Indicador x={890} y={316} rotulo="Aguardando" valor="0" nota="data, decisão ou dono" />
    <div style={{ position: "absolute", left: 40, top: 450, width: 1259, height: 150, boxSizing: "border-box", padding: "20px 24px", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 10 }}>
      <div style={{ fontSize: 20, fontWeight: 600, marginTop: 8 }}>Documentos</div>
      <div style={{ fontSize: 18, color: COR.suave, marginTop: 34 }}>Nenhum documento ainda. Suba uma ata ou um plano para a Clara ler, ou crie as ações em "Nova ação".</div>
    </div>
    <div style={{ position: "absolute", right: 64, top: 464, display: "flex", gap: 12 }}>
      <Botao icone="tarefas" style={luz(novaAcesa)}>
        Nova ação
      </Botao>
      <Botao icone="importar" cheio style={luz(botaoAceso)}>
        Adicionar documento
      </Botao>
    </div>
    <div style={{ position: "absolute", left: 40, top: 616, width: 1259, height: 280, boxSizing: "border-box", padding: "20px 24px", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 10 }}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>Ações</div>
      <div style={{ display: "flex", gap: 120, marginTop: 22, fontSize: 18, fontWeight: 600, paddingBottom: 12, borderBottom: `1px solid ${COR.borda}` }}>
        {["Ação", "Responsável", "Prazo", "Situação", "Cobrança"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div style={{ fontSize: 18, color: COR.suave, marginTop: 16 }}>Nenhuma ação neste filtro.</div>
    </div>
  </>
);

// fundo escurecido + caixa central, com entrada `k` (0 a 1)
export const Modal: React.FC<{ readonly k: number; readonly topo: number; readonly largura: number; readonly children: React.ReactNode }> = ({ k, topo, largura, children }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.62)", opacity: k }} />
    <div style={{ position: "absolute", left: 670 - largura / 2, top: topo, width: largura, boxSizing: "border-box", padding: "24px 28px", background: "#141815", border: `1px solid ${COR.borda}`, borderRadius: 10, opacity: k, transform: `scale(${0.96 + 0.04 * k})`, boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}>{children}</div>
  </>
);

export const ModalDocumento: React.FC<{
  readonly k: number;
  readonly aba: "Arquivo" | "Colar texto";
  readonly arquivo?: boolean;
  readonly formatosAcesos?: boolean;
  readonly avisoAceso?: boolean;
  readonly textoColado?: React.ReactNode;
}> = ({ k, aba, arquivo, formatosAcesos, avisoAceso, textoColado }) => (
  <Modal k={k} topo={230} largura={760}>
    <div style={{ fontSize: 28, fontWeight: 700 }}>Adicionar documento</div>
    <div style={{ display: "inline-block", fontSize: 20, color: COR.texto, marginTop: 8, padding: "2px 6px", marginLeft: -6, ...luz(avisoAceso) }}>A Clara lê e propõe as ações. Nada é cobrado antes da sua revisão.</div>
    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
      {(["Arquivo", "Colar texto"] as const).map((a) => (
        <div key={a} style={{ fontSize: 20, fontWeight: 600, padding: "8px 16px", borderRadius: 6, color: a === aba ? "#0B0B0C" : COR.texto, background: a === aba ? "#9DF57F" : "transparent" }}>
          {a}
        </div>
      ))}
    </div>
    {aba === "Arquivo" ? (
      <>
        <Campo style={{ marginTop: 18, fontWeight: 600 }}>
          Escolher arquivo <span style={{ fontWeight: 400, marginLeft: 10, color: arquivo ? VERDE : COR.texto }}>{arquivo ? ATA.arquivo : "Nenhum arquivo escolhido"}</span>
        </Campo>
        <div style={{ display: "inline-block", fontSize: 17, color: COR.suave, marginTop: 10, padding: "2px 6px", marginLeft: -6, ...luz(formatosAcesos) }}>.pdf, .docx, .xlsx, .csv, .txt, .md · até 20 MB · até ~30 páginas de texto</div>
      </>
    ) : (
      <>
        <div style={{ fontSize: 19, fontWeight: 600, marginTop: 16 }}>Título</div>
        <Campo style={{ marginTop: 6 }}>Ata de 03/11</Campo>
        <div style={{ fontSize: 19, fontWeight: 600, marginTop: 12 }}>Texto</div>
        <Campo style={{ marginTop: 6, height: 104, alignItems: "flex-start", paddingTop: 12, lineHeight: 1.35 }}>{textoColado}</Campo>
      </>
    )}
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
      <Botao>Cancelar</Botao>
      <Botao cheio={Boolean(arquivo) || aba === "Colar texto"}>Enviar</Botao>
    </div>
  </Modal>
);

// ---------- Revisão do documento (a página é mais alta que a janela: `rolagem` em px)
const TOPO_PROPOSTAS = 650;
const altura = (p: Proposta) => 306 + (p.notaPrazo ? 28 : 0) + (p.alertas?.length ?? 0) * 28;
export const topoProposta = (i: number) => TOPO_PROPOSTAS + PROPOSTAS.slice(0, i).reduce((s, p) => s + altura(p) + 16, 0);

const CartaoProposta: React.FC<{ readonly p: Proposta; readonly i: number; readonly de: number; readonly acesos: readonly string[]; readonly prazo?: React.ReactNode; readonly desmarcada?: boolean; readonly responsavel?: string; readonly extra?: string; readonly pedido?: boolean }> = ({ p, i, de, acesos, prazo, desmarcada, responsavel, extra, pedido }) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [de, de + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aceso = (n: string) => acesos.includes(`${n}-${i}`);
  return (
    <div style={{ position: "absolute", left: 0, top: topoProposta(i) - TOPO_PROPOSTAS, width: 1259, opacity: k, transform: `translateY(${(1 - k) * 24}px)` }}>
      <div style={{ height: 40, fontSize: 20, fontWeight: 600 }}>
        {p.grupo} <span style={{ marginLeft: 8, fontSize: 16, fontWeight: 400, color: COR.suave }}>{p.emailGrupo}</span>
      </div>
      <div style={{ height: altura(p) - 40, boxSizing: "border-box", padding: "16px 20px", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 24, height: 24, boxSizing: "border-box", borderRadius: 5, background: desmarcada ? "transparent" : "white", border: desmarcada ? `1px solid ${COR.suave}` : "none", color: "#0B0B0C", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18, ...(aceso("marca") ? { boxShadow: `0 0 0 3px ${VERDE}` } : {}) }}>{desmarcada ? "" : "✓"}</div>
          <Campo style={{ flex: 1, opacity: desmarcada ? 0.5 : 1, ...luz(aceso("acao")) }}>{p.texto}</Campo>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 600, padding: "3px 12px", borderRadius: 99, border: `1px solid ${COR.borda}` }}>Do documento</span>
          <span style={{ fontSize: 16, fontWeight: 600, padding: "3px 12px", borderRadius: 99, color: "#0B0B0C", background: "#9DF57F", ...(aceso("selo") ? { boxShadow: `0 0 0 3px ${VERDE}, 0 0 30px rgba(60,224,30,0.8)` } : {}) }}>Trecho conferido</span>
        </div>
        <div style={{ display: "inline-block", fontSize: 17, color: aceso("trecho") ? "white" : COR.suave, marginTop: 10, padding: "1px 6px", marginLeft: -6, ...luz(aceso("trecho")) }}>
          "{p.trecho}" · {p.secao}
        </div>
        <div style={{ position: "relative", height: 22, fontSize: 16, color: COR.suave, marginTop: 3 }}>
          No documento: {p.noDocumento}
          <span style={{ position: "absolute", left: 300, top: -4, fontSize: 15, fontWeight: 600, padding: "2px 12px", color: COR.texto, border: `1px solid ${COR.borda}`, borderRadius: 6, background: "#1E2320", ...luz(aceso("botao")) }}>{(responsavel ?? p.responsavel) === "Sem responsável" ? "Cadastrar responsável" : "+ Adicionar responsável"}</span>
          {extra && <span style={{ position: "absolute", left: 540, top: -4, fontSize: 15, fontWeight: 600, padding: "2px 12px", color: "#0B0B0C", background: "#9DF57F", borderRadius: 6 }}>{extra}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
          <Campo style={{ width: 520, ...luz(aceso("resp")) }}>
            <span style={{ flex: 1 }}>{responsavel ?? p.responsavel}</span>
            <span style={{ color: COR.suave }}>⌄</span>
          </Campo>
          <Campo style={{ width: 300, opacity: pedido ? 0.45 : 1, ...luz(aceso("prazo")) }}>{prazo ?? p.prazo}</Campo>
          <div style={{ width: 20, height: 20, boxSizing: "border-box", border: `1px solid ${pedido ? "white" : COR.suave}`, borderRadius: 4, background: pedido ? "white" : "transparent", color: "#0B0B0C", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 800 }}>{pedido ? "✓" : ""}</div>
          <span style={{ fontSize: 17, padding: "1px 4px", ...luz(aceso("pedir")) }}>pedir ao responsável</span>
        </div>
        {p.notaPrazo && <div style={{ fontSize: 16, color: COR.suave, marginTop: 10 }}>{p.notaPrazo}</div>}
        {p.alertas?.map((a) => (
          <div key={a} style={{ display: "inline-block", fontSize: 17, color: COR.vermelho, marginTop: 4, padding: "1px 8px", marginLeft: -8, borderRadius: 6, ...(aceso("alerta") ? { boxShadow: `0 0 0 2px ${COR.vermelho}, 0 0 22px rgba(255,107,107,0.5)` } : {}) }}>
            • {a}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Revisao: React.FC<{
  readonly rolagem?: number;
  readonly entradas: readonly number[];
  readonly acesos?: readonly string[];
  readonly prazos?: Record<number, React.ReactNode>;
  readonly resumoAceso?: boolean;
  readonly desmarcadas?: readonly number[];
  readonly responsaveis?: Record<number, string>;
  readonly extras?: Record<number, string>;
  readonly pedidos?: readonly number[];
  readonly ativarAceso?: boolean;
  readonly children?: React.ReactNode;
}> = ({ rolagem = 0, entradas, acesos = [], prazos = {}, resumoAceso, desmarcadas = [], responsaveis = {}, extras = {}, pedidos = [], ativarAceso, children }) => (
  <div style={{ position: "absolute", left: 0, top: -rolagem, width: 1340 }}>
    <Topo volta={DEMANDA.titulo} titulo={ATA.arquivo.replace(".pdf", "")} tamanho={30} />
    <div style={{ position: "absolute", left: 40, top: 104, fontSize: 18, color: COR.suave }}>Ata de 03/11/2026 · enviado em 03/11/2026</div>
    <div style={{ position: "absolute", left: 34, top: 136, width: 1120, padding: "4px 6px", fontSize: 20, lineHeight: 1.5, ...luz(resumoAceso) }}>{ATA.resumo}</div>
    <div style={{ position: "absolute", left: 40, top: 240, width: 1259, height: 290, boxSizing: "border-box", padding: "16px 24px", overflow: "hidden", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 10, fontSize: 18, lineHeight: 1.45 }}>
      <div style={{ fontSize: 15, letterSpacing: 2, color: COR.suave, marginBottom: 6 }}>DOCUMENTO</div>
      {ATA.linhas.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 40, top: 546, display: "flex", gap: 12 }}>
      <Botao icone="mais" style={{ height: 44, fontSize: 18 }}>
        Adicionar ação
      </Botao>
      <Botao style={{ height: 44, fontSize: 18 }}>Pedir data nas sem prazo</Botao>
      <Botao style={{ height: 44, fontSize: 18 }}>Pedir novo plano à Clara</Botao>
      <span style={{ alignSelf: "center", fontSize: 18, marginLeft: 12 }}>Descartar</span>
    </div>
    <div style={{ position: "absolute", left: 40, top: 604, fontSize: 16, color: COR.suave }}>Modo rigoroso: sugestões da Clara, trechos não encontrados no documento e ações que já existem vêm desmarcadas. Marque as que devem ser cobradas.</div>
    <div style={{ position: "absolute", left: 40, top: TOPO_PROPOSTAS }}>
      {PROPOSTAS.map((p, i) => (
        <CartaoProposta key={p.texto} p={p} i={i} de={entradas[i] ?? -99} acesos={acesos} prazo={prazos[i]} desmarcada={desmarcadas.includes(i)} responsavel={responsaveis[i]} extra={extras[i]} pedido={pedidos.includes(i)} />
      ))}
    </div>
    <div style={{ position: "absolute", right: 41, top: topoProposta(PROPOSTAS.length) + 8 }}>
      <Botao cheio style={luz(ativarAceso)}>
        Revisar e ativar ({PROPOSTAS.length - desmarcadas.length})
      </Botao>
    </div>
    {children}
  </div>
);

// centro dos elementos de um cartão da revisão, em px da área do módulo (antes da rolagem)
export const noCartao = (i: number) => ({ botao: { x: 475, y: topoProposta(i) + 196 }, responsavel: { x: 320, y: topoProposta(i) + 240 }, pedir: { x: 908, y: topoProposta(i) + 240 } });

// página do documento enquanto a Clara lê
export const PaginaLendo: React.FC<{ readonly aviso?: boolean }> = ({ aviso }) => (
  <>
    <Topo volta={DEMANDA.titulo} titulo={ATA.arquivo.replace(".pdf", "")} tamanho={30} />
    <div style={{ position: "absolute", left: 40, top: 104, fontSize: 18, color: COR.suave }}>Documento · enviado em 03/11/2026</div>
    <div style={{ position: "absolute", left: 40, top: 150, width: 1259, height: 120, display: "grid", placeItems: "center", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 10, fontSize: 21, color: COR.suave }}>
      <span style={{ padding: "4px 10px", color: aviso ? "white" : COR.suave, ...luz(aviso) }}>A Clara está montando o plano... Esta página atualiza sozinha.</span>
    </div>
  </>
);

