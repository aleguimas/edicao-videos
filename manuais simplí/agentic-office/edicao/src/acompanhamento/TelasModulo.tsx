import type React from "react";
import { COR, Icone } from "../agentic/App";
import { Abas, Botao, Titulo } from "../apresentacao/comum";
import { VERDE } from "../fonte";
import { ATA, DEMANDA, DEMANDAS_CARTOES, EVOLUCAO, type Linha, POR_AREA, POR_PESSOA } from "./dados";
import { Campo, Indicador, luz, Modal, Topo } from "./Telas";

// Telas do módulo depois da ativação e as abas do Acompanhamento. Mesmas regras de Telas.tsx:
// posições fixas em px da área do módulo, dados fictícios da Loja Modelo.
const DESCRICAO = "Suba uma ata ou um plano e a Clara propõe quem recebe cada ação e até quando, ou crie as ações você mesmo. A cobrança sai por e-mail até cada ação ser resolvida.";
const ABAS = ["Demandas", "Painel geral", "Pessoas e áreas", "Configurações"];

export const Cabecalho: React.FC<{ readonly aba: string; readonly acesa?: string; readonly rolagem?: number }> = ({ aba, acesa, rolagem = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: -rolagem, width: 1340, height: 200 }}>
    <Titulo icone="acompanhamento" titulo="ACOMPANHAMENTO" descricao={DESCRICAO} />
    <Abas x={40} y={160} abas={ABAS} ativa={aba} acesa={acesa} />
  </div>
);

export const Chave: React.FC<{ readonly ligada?: boolean }> = ({ ligada }) => (
  <div style={{ width: 46, height: 26, borderRadius: 13, flexShrink: 0, background: ligada ? "white" : "#3A3F3B", position: "relative" }}>
    <div style={{ position: "absolute", top: 3, left: ligada ? 23 : 3, width: 20, height: 20, borderRadius: "50%", background: ligada ? "#0B0B0C" : "#9AA19C" }} />
  </div>
);

const Rotulo: React.FC<{ readonly children: React.ReactNode; readonly style?: React.CSSProperties }> = ({ children, style }) => <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 6, ...style }}>{children}</div>;

const Bloco: React.FC<{ readonly x?: number; readonly y: number; readonly w?: number; readonly h: number; readonly aceso?: boolean; readonly children: React.ReactNode }> = ({ x = 40, y, w = 1259, h, aceso, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", padding: "20px 24px", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 10, overflow: "hidden", ...(aceso ? { boxShadow: `0 0 0 2px ${VERDE}, 0 0 30px rgba(60,224,30,0.3)` } : {}) }}>{children}</div>
);

// ---------- Aba Demandas
const CartaoDemanda: React.FC<{ readonly d: (typeof DEMANDAS_CARTOES)[number]; readonly x: number; readonly y: number; readonly aceso?: boolean }> = ({ d, x, y, aceso }) => {
  const [titulo, selo, feitas, total, prazoOk, proximo] = d;
  return (
    <Bloco x={x} y={y} w={622} h={210} aceso={aceso}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 23, fontWeight: 700 }}>{titulo}</div>
        <span style={{ fontSize: 15, fontWeight: 600, padding: "2px 12px", borderRadius: 99, color: selo === "Ativa" ? "#0B0B0C" : COR.texto, background: selo === "Ativa" ? "#9DF57F" : "transparent", border: `1px solid ${selo === "Ativa" ? "#9DF57F" : COR.borda}` }}>{selo}</span>
      </div>
      <div style={{ fontSize: 16, color: COR.suave, marginTop: 8 }}>{selo === "Ativa" ? "Expansão · envia por agente.ia@lojamodelo.com.br" : "Expansão"}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, marginTop: 14 }}>
        <span>Concluídas</span>
        <span>
          {feitas} de {total}
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "#333", marginTop: 6 }}>
        <div style={{ height: 8, borderRadius: 4, background: "white", width: total ? `${(feitas / total) * 100}%` : 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12, textAlign: "center", fontSize: 20, fontWeight: 700 }}>
        <div>
          {prazoOk}
          <div style={{ fontSize: 14, fontWeight: 400, color: COR.suave }}>no prazo</div>
        </div>
        <div>
          0<div style={{ fontSize: 14, fontWeight: 400, color: COR.suave }}>atrasadas</div>
        </div>
        <div>
          {proximo}
          <div style={{ fontSize: 14, fontWeight: 400, color: COR.suave }}>próximo prazo</div>
        </div>
      </div>
    </Bloco>
  );
};

export const FiltrosDemandas: React.FC<{ readonly y: number; readonly novaAcesa?: boolean }> = ({ y, novaAcesa }) => (
  <>
    <div style={{ position: "absolute", left: 40, top: y, display: "flex", gap: 8, fontSize: 19, fontWeight: 600 }}>
      {["Ativas (3)", "Encerradas (2)", "Todas (5)"].map((t, i) => (
        <span key={t} style={{ padding: "8px 14px", borderRadius: 6, color: i === 0 ? "#0B0B0C" : COR.texto, background: i === 0 ? "#9DF57F" : "transparent" }}>
          {t}
        </span>
      ))}
    </div>
    <div style={{ position: "absolute", right: 41, top: y }}>
      <Botao icone="mais" cheio style={luz(novaAcesa)}>
        Nova demanda
      </Botao>
    </div>
  </>
);

export const PaginaLista: React.FC<{ readonly acesa?: string; readonly novaAcesa?: boolean; readonly lojaAceso?: boolean }> = ({ acesa, novaAcesa, lojaAceso }) => (
  <>
    <Cabecalho aba="Demandas" acesa={acesa} />
    <FiltrosDemandas y={224} novaAcesa={novaAcesa} />
    {DEMANDAS_CARTOES.map((d, i) => (
      <CartaoDemanda key={d[0]} d={d} x={40 + (i % 2) * 637} y={296 + Math.floor(i / 2) * 226} aceso={i === 0 && lojaAceso} />
    ))}
  </>
);

// quadro "Para aprovar" no topo da aba Demandas
export const QuadroAprovar: React.FC<{ readonly aceso?: boolean; readonly anexosAceso?: boolean; readonly recusa?: React.ReactNode; readonly aprovada?: boolean; readonly aprovarAceso?: boolean; readonly recusarAceso?: boolean }> = ({ aceso, anexosAceso, recusa, aprovada, aprovarAceso, recusarAceso }) => (
  <>
    <Cabecalho aba="Demandas" />
    <Bloco y={224} h={recusa ? 380 : 300} aceso={aceso}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>Para aprovar ({aprovada ? 0 : 1})</div>
      <div style={{ fontSize: 16, color: COR.suave, marginTop: 2 }}>Retornos dos responsáveis. O status e o prazo da ação só mudam depois da sua aprovação.</div>
      {aprovada ? (
        <div style={{ fontSize: 19, color: COR.suave, marginTop: 40 }}>Nenhum retorno esperando decisão.</div>
      ) : (
        <div style={{ position: "relative", marginTop: 14, height: recusa ? 268 : 190, boxSizing: "border-box", padding: "14px 18px", border: `1px solid ${COR.borda}`, borderRadius: 8 }}>
          <div style={{ fontSize: 19, fontWeight: 600 }}>Enviar o pedido de abertura de estoque aos fornecedores.</div>
          <div style={{ fontSize: 15, color: COR.suave, marginTop: 2 }}>Rafael Lima · enviado 12/11, 16:40 · prazo atual 13/11/2026 · {DEMANDA.titulo}</div>
          <span style={{ position: "absolute", right: 16, top: 14, fontSize: 15, fontWeight: 600, padding: "2px 12px", borderRadius: 99, color: "#0B0B0C", background: "#9DF57F" }}>Ação concluída</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12, fontSize: 18 }}>
            <span style={{ padding: "2px 6px", ...luz(anexosAceso) }}>Pedido enviado aos 12 fornecedores, com o aceite de cada um.</span>
            <span style={{ fontSize: 16, padding: "3px 10px", border: `1px solid ${COR.borda}`, borderRadius: 6, ...luz(anexosAceso) }}>aceites-fornecedores.pdf</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Botao cheio style={{ height: 44, ...luz(aprovarAceso) }}>
              ✓ Aprovar
            </Botao>
            <Botao style={{ height: 44, ...luz(recusarAceso) }}>✕ Recusar</Botao>
          </div>
          {recusa && (
            <div style={{ marginTop: 12 }}>
              <Campo style={{ height: 62 }}>{recusa}</Campo>
            </div>
          )}
        </div>
      )}
    </Bloco>
    <FiltrosDemandas y={recusa ? 624 : 544} />
    {DEMANDAS_CARTOES.slice(0, 2).map((d, i) => (
      <CartaoDemanda key={d[0]} d={d} x={40 + i * 637} y={recusa ? 696 : 616} />
    ))}
  </>
);

// ---------- Janelas da aba Demandas
export const ModalNovaDemanda: React.FC<{
  readonly k: number;
  readonly titulo?: React.ReactNode;
  readonly objetivo?: React.ReactNode;
  readonly setor?: React.ReactNode;
  readonly prazo?: React.ReactNode;
  readonly setorAceso?: boolean;
  readonly rigoroso?: boolean;
  readonly sigilosa?: boolean;
  readonly sigilosaLigada?: boolean;
  readonly criarAceso?: boolean;
}> = ({ k, titulo, objetivo, setor, prazo, setorAceso, rigoroso, sigilosa, sigilosaLigada, criarAceso }) => (
  <Modal k={k} topo={60} largura={760}>
    <div style={{ fontSize: 28, fontWeight: 700 }}>Nova demanda</div>
    <div style={{ fontSize: 18, lineHeight: 1.4, color: COR.suave, marginTop: 6 }}>Uma demanda junta as ações de um assunto. Depois de criar, suba a ata ou o plano, ou crie as ações você mesmo.</div>
    <Rotulo style={{ marginTop: 14 }}>Título</Rotulo>
    <Campo>{titulo}</Campo>
    <Rotulo style={{ marginTop: 12 }}>Objetivo (opcional)</Rotulo>
    <Campo style={{ height: 72, alignItems: "flex-start", paddingTop: 10 }}>{objetivo}</Campo>
    <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
      <div style={{ flex: 1 }}>
        <Rotulo>Setor responsável</Rotulo>
        <Campo style={luz(setorAceso)}>{setor}</Campo>
      </div>
      <div style={{ flex: 1 }}>
        <Rotulo>Prazo final (opcional)</Rotulo>
        <Campo>{prazo}</Campo>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, padding: "6px 8px", marginLeft: -8, ...luz(rigoroso) }}>
      <div>
        <div style={{ fontSize: 19, fontWeight: 600 }}>Modo rigoroso</div>
        <div style={{ fontSize: 15, color: COR.suave }}>Sugestões da Clara e trechos não encontrados vêm desmarcados na revisão.</div>
      </div>
      <Chave ligada />
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, padding: "6px 8px", marginLeft: -8, ...luz(sigilosa) }}>
      <div>
        <div style={{ fontSize: 19, fontWeight: 600 }}>Demanda sigilosa</div>
        <div style={{ fontSize: 15, color: COR.suave }}>O título não aparece nos e-mails de cobrança.</div>
      </div>
      <Chave ligada={sigilosaLigada} />
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
      <Botao>Cancelar</Botao>
      <Botao cheio style={luz(criarAceso)}>
        Criar
      </Botao>
    </div>
  </Modal>
);

const Marca: React.FC<{ readonly aceso?: boolean; readonly children: React.ReactNode }> = ({ aceso, children }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12, fontSize: 18, padding: "4px 6px", marginLeft: -6, ...luz(aceso) }}>
    <div style={{ width: 22, height: 22, flexShrink: 0, borderRadius: 4, background: "white", color: "#0B0B0C", display: "grid", placeItems: "center", fontWeight: 800 }}>✓</div>
    <span>{children}</span>
  </div>
);

export const ModalNovaPessoa: React.FC<{ readonly k: number; readonly nome?: React.ReactNode; readonly email?: React.ReactNode; readonly reconhece?: boolean; readonly atribui?: boolean; readonly cadastrarAceso?: boolean }> = ({ k, nome, email, reconhece, atribui, cadastrarAceso }) => (
  <Modal k={k} topo={120} largura={760}>
    <div style={{ fontSize: 28, fontWeight: 700 }}>Nova pessoa</div>
    <div style={{ fontSize: 18, lineHeight: 1.4, color: COR.suave, marginTop: 6 }}>Entra no cadastro de pessoas, já fica como responsável desta ação e é reconhecida nas próximas atas.</div>
    <div style={{ fontSize: 16, color: COR.suave, marginTop: 10 }}>No documento: Equipe Obras</div>
    <Rotulo style={{ marginTop: 12 }}>Nome</Rotulo>
    <Campo>{nome}</Campo>
    <Rotulo style={{ marginTop: 12 }}>E-mail</Rotulo>
    <Campo>{email}</Campo>
    <Marca aceso={reconhece}>Reconhecer "Equipe Obras" como esta pessoa nas próximas atas</Marca>
    <Marca aceso={atribui}>Atribuir também às outras ações sem responsável que citam "Equipe Obras"</Marca>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 14 }}>
      <Botao>Cancelar</Botao>
      <Botao cheio style={luz(cadastrarAceso)}>
        Cadastrar e atribuir
      </Botao>
    </div>
  </Modal>
);

export const ModalAtivar: React.FC<{ readonly k: number; readonly contaAcesa?: boolean; readonly previaAcesa?: boolean; readonly autorizarAceso?: boolean; readonly previa: React.ReactNode }> = ({ k, contaAcesa, previaAcesa, autorizarAceso, previa }) => (
  <Modal k={k} topo={50} largura={1000}>
    <div style={{ fontSize: 28, fontWeight: 700 }}>Ativar as cobranças</div>
    <div style={{ fontSize: 18, lineHeight: 1.4, color: COR.suave, marginTop: 6 }}>Serão enviados 5 e-mails da conta escolhida para 5 pessoas agora. As próximas cobranças sairão sozinhas em dias úteis, até cada ação ser resolvida.</div>
    <Campo style={{ marginTop: 12, ...luz(contaAcesa) }}>
      <span style={{ flex: 1 }}>agente.ia@lojamodelo.com.br</span>
      <span style={{ color: COR.suave }}>⌄</span>
    </Campo>
    <div style={{ fontSize: 18, fontWeight: 600, marginTop: 12 }}>Para Rafael Lima · Você recebeu 1 ação · {DEMANDA.titulo}</div>
    <div style={{ marginTop: 10, borderRadius: 6, ...luz(previaAcesa) }}>{previa}</div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 14 }}>
      <Botao>Voltar à revisão</Botao>
      <Botao cheio style={luz(autorizarAceso)}>
        Autorizar e ativar
      </Botao>
    </div>
  </Modal>
);

export const ModalNovaAcao: React.FC<{ readonly k: number; readonly oQue?: React.ReactNode; readonly resp?: React.ReactNode; readonly prazo?: React.ReactNode; readonly criarAceso?: boolean }> = ({ k, oQue, resp, prazo, criarAceso }) => (
  <Modal k={k} topo={120} largura={760}>
    <div style={{ fontSize: 28, fontWeight: 700 }}>Nova ação</div>
    <div style={{ fontSize: 18, lineHeight: 1.4, color: COR.suave, marginTop: 6 }}>Uma ação criada à mão, sem documento. Ela já começa em acompanhamento: cada responsável recebe o aviso por e-mail.</div>
    <Rotulo style={{ marginTop: 14 }}>O que precisa ser feito</Rotulo>
    <Campo>{oQue}</Campo>
    <Rotulo style={{ marginTop: 12 }}>Detalhes (opcional)</Rotulo>
    <Campo style={{ height: 60 }} />
    <Rotulo style={{ marginTop: 12 }}>Responsáveis</Rotulo>
    <Campo>{resp}</Campo>
    <Rotulo style={{ marginTop: 12 }}>Prazo</Rotulo>
    <Campo style={{ width: 240 }}>{prazo}</Campo>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
      <Botao>Cancelar</Botao>
      <Botao cheio style={luz(criarAceso)}>
        Criar ação
      </Botao>
    </div>
  </Modal>
);

export const ModalExcluir: React.FC<{ readonly k: number; readonly nome: React.ReactNode; readonly pronto?: boolean }> = ({ k, nome, pronto }) => (
  <Modal k={k} topo={190} largura={760}>
    <div style={{ fontSize: 28, fontWeight: 700 }}>Excluir a demanda?</div>
    <div style={{ fontSize: 18, lineHeight: 1.45, color: COR.suave, marginTop: 8 }}>Some de vez: as ações, os documentos, o histórico, os retornos e os e-mails ainda na fila. Não dá para desfazer. Para só parar as cobranças e guardar o histórico, use "Encerrar demanda".</div>
    <Rotulo style={{ marginTop: 16 }}>Digite o nome da demanda para confirmar: {DEMANDA.titulo}</Rotulo>
    <Campo>{nome}</Campo>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
      <Botao>Cancelar</Botao>
      <Botao style={{ background: pronto ? "#C8423E" : "#5A2C2A", color: "white", borderColor: "transparent" }}>Excluir de vez</Botao>
    </div>
  </Modal>
);

// ---------- Página da demanda ativa (mais alta que a janela: `rolagem` em px)
export const TOPO_ACOES = 576;
export const TOPO_PESSOAS = 1022;
const ALTURA_LINHA = 66;
// colunas da lista de ações, em px da área do módulo
export const COLUNA_COBRANCA = 1012;

const SELO: Record<string, [string, string, string]> = {
  Atrasada: ["#8E3A3A", "white", "#8E3A3A"],
  Concluída: ["#9DF57F", "#0B0B0C", "#9DF57F"],
  "Em análise": ["#F5B82E", "#0B0B0C", "#F5B82E"],
  Aguardando: ["transparent", COR.amarelo, COR.amarelo],
  "A vencer": ["transparent", COR.texto, COR.borda],
};

const LinhaAcao: React.FC<{ readonly l: Linha; readonly i: number; readonly acesa?: boolean; readonly notaAcesa?: boolean; readonly opacidade?: number }> = ({ l, i, acesa, notaAcesa, opacidade = 1 }) => {
  const [fundo, cor, borda] = SELO[l.situacao];
  return (
    <div style={{ position: "absolute", left: 18, right: 18, top: 116 + i * ALTURA_LINHA, height: ALTURA_LINHA, display: "flex", alignItems: "center", borderTop: `1px solid ${COR.borda}`, fontSize: 17, opacity: opacidade, borderRadius: 6, ...luz(acesa) }}>
      <div style={{ position: "absolute", left: 6, width: 440, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.acao}</div>
      <div style={{ position: "absolute", left: 456 }}>
        {l.resp}
        <div style={{ fontSize: 14, color: COR.suave }}>{l.area}</div>
      </div>
      <div style={{ position: "absolute", left: 610 }}>
        {l.prazo}
        {l.era && <div style={{ fontSize: 14, color: COR.suave }}>{l.era}</div>}
      </div>
      <div style={{ position: "absolute", left: 746, textAlign: "left" }}>
        <span style={{ fontSize: 15, fontWeight: 600, padding: "2px 12px", borderRadius: 99, background: fundo, color: cor, border: `1px solid ${borda}` }}>{l.situacao}</span>
        {l.nota && <div style={{ fontSize: 14, color: notaAcesa ? "white" : COR.suave, marginTop: 3, ...(notaAcesa ? { ...luz(true), padding: "0 4px" } : {}) }}>{l.nota}</div>}
      </div>
      <div style={{ position: "absolute", left: 932, width: 290, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden" }}>
        {l.cobranca}
        <div style={{ color: COR.suave }}>{l.proximo}</div>
      </div>
    </div>
  );
};

const Tabela: React.FC<{ readonly titulo: string; readonly primeira: string; readonly linhas: readonly (readonly [string, number, number, number, string, number])[]; readonly y: number; readonly h: number; readonly aceso?: boolean }> = ({ titulo, primeira, linhas, y, h, aceso }) => {
  const xs = [560, 720, 880, 1040, 1190];
  const cab = ["Abertas", "Atrasadas", "Concluídas", "No prazo", "Reagend."];
  return (
    <Bloco y={y} h={h} aceso={aceso}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{titulo}</div>
      <div style={{ position: "relative", marginTop: 14, height: 34, fontSize: 17, fontWeight: 600 }}>
        <span style={{ position: "absolute", left: 8 }}>{primeira}</span>
        {cab.map((c, i) => (
          <span key={c} style={{ position: "absolute", left: xs[i] }}>
            {c}
          </span>
        ))}
      </div>
      {linhas.map((l) => (
        <div key={l[0]} style={{ position: "relative", height: 34, fontSize: 17, borderTop: `1px solid ${COR.borda}`, lineHeight: "34px" }}>
          <span style={{ position: "absolute", left: 8 }}>{l[0]}</span>
          {l.slice(1).map((v, i) => (
            <span key={i} style={{ position: "absolute", left: xs[i], color: i === 1 && v !== 0 ? COR.vermelho : COR.texto }}>
              {v}
            </span>
          ))}
        </div>
      ))}
    </Bloco>
  );
};

export type Numeros = { readonly acoes: string; readonly concluidas: string; readonly notaConcluidas: string; readonly noPrazo: string; readonly atrasadas: string; readonly notaAtrasadas: string; readonly reagendadas: string; readonly aguardando: string };

export const PaginaAtiva: React.FC<{
  readonly rolagem?: number;
  readonly selo?: string;
  readonly seloAceso?: boolean;
  readonly numeros: Numeros;
  readonly numerosAcesos?: readonly string[];
  readonly linhas: readonly Linha[];
  readonly linhaAcesa?: number;
  readonly notaAcesa?: number;
  readonly opacidades?: Record<number, number>;
  readonly colunaAcesa?: boolean;
  readonly filtro?: string;
  readonly novaAcesa?: boolean;
  readonly docAceso?: boolean;
  readonly menuAceso?: boolean;
  readonly evolucao?: number;
  readonly pessoaAceso?: boolean;
  readonly areaAceso?: boolean;
  readonly evolucaoAceso?: boolean;
  readonly fechamento?: boolean;
  readonly fechamentoAceso?: boolean;
  readonly children?: React.ReactNode;
}> = ({ rolagem = 0, selo = "Ativa", seloAceso, numeros, numerosAcesos = [], linhas, linhaAcesa, notaAcesa, opacidades = {}, colunaAcesa, filtro = "Abertas", novaAcesa, docAceso, menuAceso, evolucao = 1, pessoaAceso, areaAceso, evolucaoAceso, fechamento, fechamentoAceso, children }) => {
  const n = numeros;
  const k = (nome: string) => (numerosAcesos.includes(nome) ? { borderRadius: 10, boxShadow: `0 0 0 2px ${VERDE}, 0 0 26px rgba(60,224,30,0.4)` } : {});
  return (
    <div style={{ position: "absolute", left: 0, top: -rolagem, width: 1340, height: 2000 }}>
      <Topo volta="Acompanhamento" titulo={DEMANDA.titulo} selo={selo} seloAceso={seloAceso} />
      <div style={{ position: "absolute", right: 41, top: 40, display: "flex", gap: 10 }}>
        <Botao icone="exportar" style={{ height: 44, fontSize: 18 }}>
          CSV
        </Botao>
        <Botao style={{ height: 44, width: 44, padding: 0, fontSize: 22, ...luz(menuAceso) }}>⋯</Botao>
      </div>
      <div style={{ position: "absolute", left: 40, top: 112, fontSize: 18, lineHeight: 1.6, color: COR.suave }}>
        {DEMANDA.setor} ({DEMANDA.email}) · prazo final {DEMANDA.prazo} · envia por agente.ia@lojamodelo.com.br
        <br />
        Criada por {DEMANDA.autora} ({DEMANDA.emailAutora}) em {DEMANDA.criada}
      </div>
      {([
        ["acoes", 40, 186, "Ações", n.acoes, "ativadas, sem as canceladas"],
        ["concluidas", 465, 186, "Concluídas", n.concluidas, n.notaConcluidas],
        ["noPrazo", 890, 186, "No prazo", n.noPrazo, "contra o primeiro prazo"],
        ["atrasadas", 40, 316, "Atrasadas", n.atrasadas, n.notaAtrasadas],
        ["reagendadas", 465, 316, "Reagendadas", n.reagendadas, "pediram nova data"],
        ["aguardando", 890, 316, "Aguardando", n.aguardando, "data, decisão ou dono"],
      ] as const).map(([nome, x, y, rotulo, valor, nota]) => (
        <div key={nome}>
          <Indicador x={x} y={y} rotulo={rotulo} valor={valor} nota={nota} />
          <div style={{ position: "absolute", left: x, top: y, width: 409, height: 116, ...k(nome) }} />
        </div>
      ))}
      <Bloco y={450} h={110}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Documentos</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 16, fontSize: 18 }}>
          <span style={{ flex: 1, padding: "1px 6px", marginLeft: -6, ...luz(docAceso) }}>{ATA.arquivo}</span>
          <span style={{ fontSize: 16, color: COR.suave, marginRight: 14 }}>03/11/2026</span>
          <span style={{ fontSize: 15, padding: "2px 12px", border: `1px solid ${COR.borda}`, borderRadius: 99 }}>Ativado</span>
        </div>
      </Bloco>
      <div style={{ position: "absolute", right: 64, top: 462, display: "flex", gap: 12 }}>
        <Botao icone="tarefas" style={{ height: 44, fontSize: 18, ...luz(novaAcesa) }}>
          Nova ação
        </Botao>
        <Botao icone="importar" cheio style={{ height: 44, fontSize: 18 }}>
          Adicionar documento
        </Botao>
      </div>
      <Bloco y={TOPO_ACOES} h={Math.max(linhas.length, 1) * ALTURA_LINHA + 134}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Ações</div>
        <div style={{ position: "absolute", right: 24, top: 16, display: "flex", gap: 8, fontSize: 16 }}>
          {["Abertas", "Atrasadas", "Aguardando", "Concluídas", "Todas"].map((t) => (
            <span key={t} style={{ padding: "3px 10px", borderRadius: 5, color: t === filtro ? "#0B0B0C" : COR.suave, background: t === filtro ? "#9DF57F" : "transparent" }}>
              {t}
            </span>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, top: 76, width: "100%", fontSize: 17, fontWeight: 600 }}>
          {([["Ação", 30], ["Responsável", 480], ["Prazo", 634], ["Situação", 770], ["Cobrança", 956]] as const).map(([t, x]) => (
            <span key={t} style={{ position: "absolute", left: x, ...(t === "Cobrança" && colunaAcesa ? { ...luz(true), padding: "0 6px" } : {}) }}>
              {t}
            </span>
          ))}
        </div>
        {linhas.length === 0 && <div style={{ position: "absolute", left: 30, top: 120, fontSize: 18, color: COR.suave }}>Nenhuma ação neste filtro.</div>}
        {linhas.map((l, i) => (
          <LinhaAcao key={l.acao} l={l} i={i} acesa={linhaAcesa === i} notaAcesa={notaAcesa === i} opacidade={opacidades[i]} />
        ))}
        {colunaAcesa && <div style={{ position: "absolute", left: 932, top: 106, width: 300, bottom: 12, border: `2px solid ${VERDE}`, borderRadius: 8, boxShadow: "0 0 26px rgba(60,224,30,0.3)" }} />}
      </Bloco>
      {fechamento ? (
        <Bloco y={792} h={290} aceso={fechamentoAceso}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Fechamento por pessoa</div>
          <div style={{ position: "relative", marginTop: 14, height: 34, fontSize: 17, fontWeight: 600 }}>
            {([["Pessoa", 8], ["Cumpriu no prazo", 420], ["Com atraso", 640], ["Não cumpriu", 830], ["Total", 1090]] as const).map(([t, x]) => (
              <span key={t} style={{ position: "absolute", left: x }}>
                {t}
              </span>
            ))}
          </div>
          {([["Rafael Lima", 1, 0, 0, 1], ["Pedro Alves", 0, 1, 0, 1], ["Helena Duarte", 0, 0, 1, 1], ["Equipe Obras", 0, 0, 1, 1], ["Área de TI", 1, 0, 0, 1]] as const).map(([p, a, b, c, t]) => (
            <div key={p} style={{ position: "relative", height: 34, lineHeight: "34px", fontSize: 17, borderTop: `1px solid ${COR.borda}` }}>
              <span style={{ position: "absolute", left: 8 }}>{p}</span>
              <span style={{ position: "absolute", left: 420 }}>{a}</span>
              <span style={{ position: "absolute", left: 640 }}>{b}</span>
              <span style={{ position: "absolute", left: 830, color: c ? COR.vermelho : COR.texto }}>{c}</span>
              <span style={{ position: "absolute", left: 1090 }}>{t}</span>
            </div>
          ))}
        </Bloco>
      ) : (
        <>
          <Tabela titulo="Por pessoa" primeira="Pessoa" linhas={POR_PESSOA} y={TOPO_PESSOAS} h={320} aceso={pessoaAceso} />
          <Tabela titulo="Por área" primeira="Área" linhas={POR_AREA} y={TOPO_PESSOAS + 336} h={282} aceso={areaAceso} />
          <Bloco y={TOPO_PESSOAS + 634} h={320} aceso={evolucaoAceso}>
            <div style={{ fontSize: 20, fontWeight: 600 }}>Evolução: previstas × concluídas (acumulado por semana)</div>
            <Curvas k={evolucao} />
          </Bloco>
        </>
      )}
      {children}
    </div>
  );
};

const Curvas: React.FC<{ readonly k: number }> = ({ k }) => {
  const w = 1180;
  const h = 200;
  const ponto = (v: number, i: number) => `${(i / (EVOLUCAO.semanas.length - 1)) * w},${h - (v / 5) * h}`;
  const total = 1800;
  return (
    <svg width={w + 20} height={h + 44} style={{ marginTop: 14, overflow: "visible" }}>
      {[0, 1, 2, 3, 4, 5].map((v) => (
        <line key={v} x1={0} x2={w} y1={h - (v / 5) * h} y2={h - (v / 5) * h} stroke="#2A2F2B" strokeDasharray="3 5" />
      ))}
      <polyline points={EVOLUCAO.previstas.map(ponto).join(" ")} fill="none" stroke="#7F8A83" strokeWidth={4} strokeDasharray={total} strokeDashoffset={total * (1 - k)} />
      <polyline points={EVOLUCAO.concluidas.map(ponto).join(" ")} fill="none" stroke={VERDE} strokeWidth={5} strokeDasharray={total} strokeDashoffset={total * (1 - k)} />
      {EVOLUCAO.semanas.map((s, i) => (
        <text key={s} x={(i / (EVOLUCAO.semanas.length - 1)) * w} y={h + 30} fill="#9AA19C" fontSize={15} textAnchor="middle">
          {s}
        </text>
      ))}
    </svg>
  );
};

// menu ⋯ da demanda
export const MenuDemanda: React.FC<{ readonly k: number; readonly encerrarAceso?: boolean }> = ({ k, encerrarAceso }) => (
  <div style={{ position: "absolute", right: 41, top: 92, width: 260, boxSizing: "border-box", padding: 8, background: "#141815", border: `1px solid ${COR.borda}`, borderRadius: 8, opacity: k, fontSize: 19, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
    {["Editar demanda", "Trocar conta de envio", "Encerrar demanda", "Excluir demanda"].map((t, i) => (
      <div key={t} style={{ padding: "8px 12px", color: i > 1 ? COR.vermelho : COR.texto, ...luz(i === 2 && encerrarAceso) }}>
        {t}
      </div>
    ))}
  </div>
);

// ---------- Painel lateral da ação
export const PainelAcao: React.FC<{
  readonly k: number;
  readonly historicoAceso?: boolean;
  readonly botoesAcesos?: boolean;
  readonly menuK?: number;
  readonly menuItem?: number;
  readonly historico?: readonly (readonly [string, string])[];
  readonly linhaAcesa?: number;
}> = ({ k, historicoAceso, botoesAcesos, menuK = 0, menuItem = -1, historico, linhaAcesa }) => {
  const itens =
    historico ??
    ([
      ["11/11, 08:00", "Cobrança de atraso enviada"],
      ["09/11, 08:00", "Cobrança de atraso enviada"],
      ["06/11, 08:00", "Aviso do dia enviado"],
      ["05/11, 08:00", "Lembrete enviado"],
      ["03/11, 15:12", "Setor avisado"],
      ["03/11, 15:12", "Aviso enviado"],
      ["03/11, 15:12", "Ativada"],
    ] as const);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", opacity: k }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 660, boxSizing: "border-box", padding: "24px 28px", background: "#101311", borderLeft: `1px solid ${COR.borda}`, transform: `translateX(${(1 - k) * 660}px)` }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Confirmar a data com a arquitetura</div>
        <div style={{ fontSize: 18, color: COR.suave, marginTop: 6 }}>Equipe Obras · Aberta</div>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", rowGap: 8, marginTop: 18, fontSize: 19 }}>
          <span style={{ color: COR.suave }}>Prazo</span>
          <span>06/11/2026</span>
          <span style={{ color: COR.suave }}>Primeiro prazo</span>
          <span>06/11/2026</span>
          <span style={{ color: COR.suave }}>Reagendamentos</span>
          <span>0</span>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <Botao style={{ height: 46, fontSize: 19, ...luz(botoesAcesos) }}>Marcar como concluída</Botao>
          <Botao style={{ height: 46, fontSize: 19, ...luz(botoesAcesos) }}>Cobrar agora</Botao>
        </div>
        <div style={{ position: "relative", marginTop: 16, padding: "12px 16px", border: `1px solid ${COR.borda}`, borderRadius: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Outra ação</div>
          <Campo>
            <span style={{ flex: 1, color: COR.suave }}>Escolha</span>⌄
          </Campo>
          {menuK > 0 && (
            <div style={{ position: "absolute", left: 16, right: 16, top: 40, padding: 6, background: "#141815", border: `1px solid ${COR.borda}`, borderRadius: 8, opacity: menuK, fontSize: 19, zIndex: 2 }}>
              {["Editar", "Mudar o prazo", "Reatribuir", "Adicionar responsável", "Cancelar"].map((t, i) => (
                <div key={t} style={{ padding: "6px 10px", borderRadius: 6, background: i === menuItem ? "#1F3524" : "transparent" }}>
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize: 16, letterSpacing: 1, color: COR.suave, marginTop: 18 }}>HISTÓRICO</div>
        <div style={{ marginTop: 8, padding: "4px 6px", marginLeft: -6, ...luz(historicoAceso) }}>
          {itens.map(([q, o], i) => (
            <div key={`${q}${o}`} style={{ display: "flex", gap: 20, fontSize: 18, padding: "3px 0", ...(i === linhaAcesa ? { ...luz(true), padding: "3px 6px" } : {}) }}>
              <span style={{ width: 120, color: COR.suave }}>{q}</span>
              <span>{o}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ---------- Aba Painel geral
export const PainelGeral: React.FC<{ readonly rolagem?: number; readonly k?: number; readonly atrasosAceso?: boolean; readonly mesAceso?: boolean; readonly numerosAcesos?: boolean; readonly acesa?: string }> = ({ rolagem = 0, k = 1, atrasosAceso, mesAceso, numerosAcesos, acesa }) => {
  const meses: [string, number][] = [
    ["08/26", 62],
    ["09/26", 71],
    ["10/26", 78],
    ["11/26", 84],
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: -rolagem, width: 1340, height: 1700 }}>
      <Cabecalho aba="Painel geral" acesa={acesa} />
      <div style={{ position: "absolute", left: 40, top: 222, fontSize: 18, color: COR.suave }}>Somando as demandas ativas e pausadas. O gráfico mês a mês conta todas as demandas, inclusive as encerradas.</div>
      <div style={{ position: "absolute", left: 30, top: 256, width: 1280, height: 266, borderRadius: 12, ...(numerosAcesos ? luz(true) : {}) }} />
      <Indicador x={40} y={266} rotulo="Ações" valor="42" nota="ativadas, sem as canceladas" />
      <Indicador x={465} y={266} rotulo="Concluídas" valor="38,1%" nota="16 de 42" />
      <Indicador x={890} y={266} rotulo="No prazo" valor="84,2%" nota="contra o primeiro prazo" />
      <Indicador x={40} y={396} rotulo="Atrasadas" valor="3" nota="4,3 dias úteis em média" />
      <Indicador x={465} y={396} rotulo="Reagendadas" valor="4" nota="pediram nova data" />
      <Indicador x={890} y={396} rotulo="Aguardando" valor="2" nota="data, decisão ou dono" />
      <Bloco y={530} h={300} aceso={mesAceso}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>No prazo, mês a mês</div>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 20, height: 210, display: "flex", alignItems: "flex-end", gap: 60, borderBottom: "1px solid #3A3F3B" }}>
          {meses.map(([m, v]) => (
            <div key={m} style={{ flex: 1, height: `${v * k}%`, background: "#2FB344", borderRadius: "4px 4px 0 0", position: "relative" }}>
              <span style={{ position: "absolute", top: -26, left: 0, right: 0, textAlign: "center", fontSize: 17 }}>{Math.round(v * k)}%</span>
              <span style={{ position: "absolute", bottom: 6, left: 0, right: 0, textAlign: "center", fontSize: 16, color: "#0B0B0C", fontWeight: 600 }}>{m}</span>
            </div>
          ))}
        </div>
      </Bloco>
      <Tabela
        titulo="Quem tem mais atrasos"
        primeira="Pessoa"
        y={846}
        h={250}
        aceso={atrasosAceso}
        linhas={[
          ["Equipe Obras", 2, 1, 0, "—", 0],
          ["Carla Mendes", 3, 1, 2, "67%", 1],
          ["Bruno Teixeira", 2, 1, 4, "80%", 0],
        ]}
      />
    </div>
  );
};

// ---------- Aba Pessoas e áreas
const PESSOAS: readonly (readonly [string, string, string, boolean])[] = [
  ["Bruno Teixeira", "bruno.teixeira@lojamodelo.com.br", "Logística", false],
  ["Helena Duarte", "helena.duarte@lojamodelo.com.br", "RH", true],
  ["Marina Costa", "marina.costa@lojamodelo.com.br", "Expansão", true],
  ["Pedro Alves", "pedro.alves@lojamodelo.com.br", "Marketing", false],
  ["Rafael Lima", "rafael.lima@lojamodelo.com.br", "Compras", true],
  ["Sérgio Nunes", "sergio.nunes@agenciaparceira.com.br", "Marketing", false],
];
const AREAS: readonly (readonly [string, string, string])[] = [
  ["Compras", "compras@lojamodelo.com.br", "Rafael Lima"],
  ["Marketing", "marketing@lojamodelo.com.br", "Pedro Alves"],
  ["TI", "ti@lojamodelo.com.br", "Bruno Teixeira"],
];
export const PaginaPessoas: React.FC<{ readonly selosAcesos?: boolean; readonly botaoAceso?: boolean; readonly areaAcesa?: boolean; readonly rolagem?: number }> = ({ selosAcesos, botaoAceso, areaAcesa, rolagem = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: -rolagem, width: 1340, height: 1300 }}>
    <Cabecalho aba="Pessoas e áreas" />
    <Bloco y={224} h={470}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>Pessoas</div>
      <div style={{ fontSize: 16, color: COR.suave }}>Quem recebe ação. Os usuários da plataforma entram sozinhos; quem não usa também pode receber, por e-mail.</div>
      <div style={{ position: "absolute", right: 24, top: 18 }}>
        <Botao icone="mais" cheio style={{ height: 44, fontSize: 18, ...luz(botaoAceso) }}>
          Pessoa
        </Botao>
      </div>
      <div style={{ display: "flex", marginTop: 24, fontSize: 17, fontWeight: 600 }}>
        <span style={{ width: 380 }}>Nome</span>
        <span style={{ width: 520 }}>E-mail</span>
        <span>Área</span>
      </div>
      {PESSOAS.map(([n, e, a, u]) => (
        <div key={n} style={{ display: "flex", alignItems: "center", height: 50, fontSize: 18, borderTop: `1px solid ${COR.borda}`, marginTop: 4 }}>
          <span style={{ width: 380, display: "flex", alignItems: "center", gap: 12 }}>
            {n}
            {u && <span style={{ fontSize: 14, fontWeight: 600, padding: "1px 10px", borderRadius: 99, color: "#0B0B0C", background: "#9DF57F", ...(selosAcesos ? { boxShadow: `0 0 0 2px ${VERDE}, 0 0 16px rgba(60,224,30,0.8)` } : {}) }}>usuário</span>}
          </span>
          <span style={{ width: 520 }}>{e}</span>
          <span>{a}</span>
        </div>
      ))}
    </Bloco>
    <Bloco y={710} h={280} aceso={areaAcesa}>
      <div style={{ fontSize: 20, fontWeight: 600 }}>Áreas</div>
      <div style={{ display: "flex", marginTop: 14, fontSize: 17, fontWeight: 600 }}>
        <span style={{ width: 380 }}>Área</span>
        <span style={{ width: 520 }}>E-mail</span>
        <span>Pessoa de referência</span>
      </div>
      {AREAS.map(([n, e, r]) => (
        <div key={n} style={{ display: "flex", alignItems: "center", height: 50, fontSize: 18, borderTop: `1px solid ${COR.borda}`, marginTop: 4 }}>
          <span style={{ width: 380 }}>{n}</span>
          <span style={{ width: 520 }}>{e}</span>
          <span>{r}</span>
        </div>
      ))}
    </Bloco>
  </div>
);

// ---------- Aba Configurações do módulo
const CampoCfg: React.FC<{ readonly x: number; readonly y: number; readonly rotulo: string; readonly valor: string; readonly nota: string; readonly aceso?: boolean }> = ({ x, y, rotulo, valor, nota, aceso }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 560 }}>
    <Rotulo style={{ fontSize: 18 }}>{rotulo}</Rotulo>
    <Campo style={{ height: 44, ...luz(aceso) }}>{valor}</Campo>
    <div style={{ fontSize: 14, color: COR.suave, marginTop: 4 }}>{nota}</div>
  </div>
);
const LinhaChave: React.FC<{ readonly y: number; readonly texto: string; readonly nota?: string; readonly ligada?: boolean; readonly aceso?: boolean }> = ({ y, texto, nota, ligada, aceso }) => (
  <div style={{ position: "absolute", left: 16, right: 16, top: y, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", fontSize: 19, ...luz(aceso) }}>
    <div>
      {texto}
      {nota && <div style={{ fontSize: 15, color: COR.suave }}>{nota}</div>}
    </div>
    <Chave ligada={ligada} />
  </div>
);
export const TOPO_CALENDARIO = 846;
export const TOPO_AJUSTE = 1270;
export const TOPO_REMETENTE = 1500;
export const PaginaConfig: React.FC<{
  readonly rolagem?: number;
  readonly acesos?: readonly string[];
  readonly feriado?: React.ReactNode;
  readonly ajuste?: React.ReactNode;
  readonly pausa?: boolean;
}> = ({ rolagem = 0, acesos = [], feriado, ajuste, pausa }) => {
  const a = (n: string) => acesos.includes(n);
  return (
    <div style={{ position: "absolute", left: 0, top: -rolagem, width: 1340, height: 1900 }}>
      <Cabecalho aba="Configurações" />
      <Bloco y={224} h={606}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Cadência padrão</div>
        <div style={{ fontSize: 16, color: COR.suave }}>Vale para toda demanda que não tiver a própria. Tudo em dias úteis, no fuso de Brasília.</div>
        <CampoCfg x={24} y={78} rotulo="Hora de envio" valor="8" nota="Primeira passada do dia (Brasília)" aceso={a("horario")} />
        <CampoCfg x={640} y={78} rotulo="Fim da janela" valor="18" nota="Nenhum envio a partir desta hora" aceso={a("horario")} />
        <CampoCfg x={24} y={186} rotulo="Lembrete (dias úteis antes)" valor="1" nota="0 desliga" aceso={a("lembrete")} />
        <CampoCfg x={640} y={186} rotulo="Área entra a partir de (dias úteis de atraso)" valor="3" nota="Resumo à pessoa de referência" />
        <CampoCfg x={24} y={294} rotulo="Follow-up semanal a cada (dias úteis)" valor="5" nota="Depois dos follow-ups de atraso iniciais" aceso={a("cobranca")} />
        <CampoCfg x={640} y={294} rotulo="Follow-ups até avisar o gestor" valor="4" nota={'"Precisa de você"'} />
        <CampoCfg x={24} y={402} rotulo="Nova data precisa de aprovação a partir do pedido nº" valor="1" nota="1 = sempre aprova" />
        <CampoCfg x={640} y={402} rotulo="Follow-ups de atraso (dias úteis, separados por vírgula)" valor="1, 3" nota="Padrão: 1, 3" aceso={a("cobranca")} />
      </Bloco>
      <Bloco y={TOPO_CALENDARIO} h={408}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Calendário e regras</div>
        <LinhaChave y={58} texto="Carnaval (segunda e terça) não é dia útil" ligada aceso={a("carnaval")} />
        <LinhaChave y={100} texto="Corpus Christi não é dia útil" ligada aceso={a("carnaval")} />
        <div style={{ position: "absolute", left: 24, right: 24, top: 146 }}>
          <Rotulo style={{ fontSize: 18 }}>Feriados locais (um por linha, AAAA-MM-DD)</Rotulo>
          <Campo style={{ height: 64, alignItems: "flex-start", paddingTop: 10, ...luz(a("feriados")) }}>{feriado}</Campo>
        </div>
        <LinhaChave y={254} texto="Demandas novas nascem em modo rigoroso" ligada />
        <LinhaChave y={298} texto="Pausa geral" nota="Nenhuma cobrança automática sai de nenhuma demanda." ligada={pausa} aceso={a("pausa")} />
      </Bloco>
      <Bloco y={TOPO_AJUSTE} h={214} aceso={a("ajuste")}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Ajuste da Clara</div>
        <div style={{ fontSize: 16, color: COR.suave }}>Instruções desta empresa para a leitura dos documentos. As regras da Clara vencem em conflito.</div>
        <Campo style={{ height: 70, marginTop: 12, alignItems: "flex-start", paddingTop: 10 }}>{ajuste}</Campo>
        <Botao style={{ height: 40, fontSize: 17, marginTop: 8, width: 150 }}>Salvar ajuste</Botao>
      </Bloco>
      <Bloco y={TOPO_REMETENTE} h={190} aceso={a("remetente")}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Nome do remetente</div>
        <div style={{ fontSize: 16, color: COR.suave }}>Identifica os e-mails do Acompanhamento: vai no topo e no rodapé de cada e-mail, com o nome da empresa.</div>
        <Rotulo style={{ marginTop: 12 }}>Nome</Rotulo>
        <Campo style={{ height: 46 }}>Agente de IA | Acompanhamento</Campo>
      </Bloco>
    </div>
  );
};

// ---------- Configurações da plataforma › Setores
const SETORES: readonly (readonly [string, string])[] = [
  ["Comercial", "comercial@lojamodelo.com.br"],
  ["Expansão", "expansao@lojamodelo.com.br"],
  ["Marketing", "marketing@lojamodelo.com.br"],
  ["Operações", ""],
];
export const PaginaSetores: React.FC<{ readonly email?: React.ReactNode; readonly aceso?: boolean; readonly integracaoAcesa?: boolean; readonly aba?: "Setores" | "Integrações" }> = ({ email, aceso, integracaoAcesa, aba = "Setores" }) => (
  <>
    <Titulo icone="config" titulo="CONFIGURAÇÕES" descricao="Dados da empresa, setores e usuários da plataforma." />
    <Abas x={40} y={160} abas={["Empresa", "Usuários", "Setores"]} ativa="Setores" />
    <Bloco y={224} h={420}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Setores</div>
        <div style={{ fontSize: 16, color: COR.suave }}>O e-mail do setor recebe os resumos das demandas de que ele é dono.</div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 17, fontWeight: 600 }}>
          <span style={{ width: 380 }}>Setor</span>
          <span>E-mail do setor</span>
        </div>
        {SETORES.map(([n, e]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", height: 62, fontSize: 18, borderTop: `1px solid ${COR.borda}`, marginTop: 4 }}>
            <span style={{ width: 380 }}>{n}</span>
            {e ? <span>{e}</span> : <Campo style={{ width: 520, ...luz(aceso) }}>{email}</Campo>}
          </div>
        ))}
    </Bloco>
  </>
);

// conta de envio conectada (aba do menu Integrações)
export const PaginaIntegracoes: React.FC<{ readonly acesa?: boolean }> = ({ acesa }) => (
  <>
    <Titulo icone="integracoes" titulo="INTEGRAÇÕES" descricao="Contas conectadas à plataforma." />
    <Bloco y={190} w={760} h={130} aceso={acesa}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Icone nome="integracoes" tam={30} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 21, fontWeight: 600 }}>Conta de e-mail</div>
          <div style={{ fontSize: 17, color: COR.suave }}>agente.ia@lojamodelo.com.br</div>
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, padding: "2px 12px", borderRadius: 99, color: "#0B0B0C", background: "#9DF57F" }}>Conectada</span>
      </div>
    </Bloco>
  </>
);

