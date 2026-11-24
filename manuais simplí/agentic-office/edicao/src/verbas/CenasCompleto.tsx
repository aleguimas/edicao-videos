import type React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { type Cena, marca } from "../ana/voz";
import { Camera, caminho, COR, Cursor, Digitando, rota } from "../agentic/App";
import { Balao, Cabeca as CabecaOlho, Controles, Entrada, Resposta } from "../apresentacao/Olho";
import { CINZA, fontFamily, fonteApp, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { A221, ACORDOS, NOVO_PARCELADO } from "./dados";
import { ITEM_MENU_VERBAS, Janela } from "./JanelaVerbas";
import { EmailComprador, EmailDiretoria, EmailFornecedor, type FocoComprador, type FocoDiretoria, type FocoExcel, PlanilhaExcel } from "./Emails";
import { Etiqueta, Surge } from "./Montagem";
import { ABA, AREA, Aviso, CAMPO, CARTAO_ACORDO, Cabecalho, CartaoAcordo, ModalNovoAcordo, ROLA_FORM, TelaPainel } from "./Telas";
import {
  BOTAO_LANCAR_REC,
  BOTAO_TESTE,
  type EstadoNota,
  FORN_COMPRADOR_X,
  IMP,
  ModalImportar,
  ModalRecebimento,
  NOTA,
  PAGINA,
  RECEB,
  ROLA_GRUPO,
  ROLA_NOTA,
  PaginaAcordo,
  REC,
  TelaCaixa,
  TelaFornecedores,
  TelaParametros,
  TelaPapeis,
  TelaPendencias,
  TelaRecebimentos,
  TRAT_REGISTRAR,
  TRAT_TEXTO,
} from "./Telas2";
import { centroAcordo } from "./VerbasAcordos";

// Cenas do vídeo completo do manual (as do piloto vêm de VerbasAcordos.tsx). Cada uma recebe a
// fala da Ana e marca câmera, cursor e destaques pela palavra dita: m("palavra", n-ésima vez).
type P = { readonly c: Cena };
const usaMarca = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
const MODULO = "Verbas e Acordos";
const CENTRO: readonly [number, number, number] = [1, 820, 480];
// botões do topo do módulo (Importar planilha / Exportar Excel), em coordenadas da janela
const BOTAO_EXPORTAR = { x: AREA.x + 1340 - 40 - 104, y: AREA.y + 28 + 26 };
const BOTAO_IMPORTAR = { x: AREA.x + 1340 - 40 - 208 - 14 - 112, y: AREA.y + 28 + 26 };

// qual valor vale agora: o último cujo frame já passou
const agora = <T,>(frame: number, passos: readonly (readonly [number, T])[], padrao: T): T => passos.reduce<T>((v, [f, x]) => (frame >= f ? x : v), padrao);

// ---------- Abas do módulo (o módulo fica em Inteligência Comercial)
export const Abas: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const ic = ITEM_MENU_VERBAS("Inteligência Comercial");
  const menu = ITEM_MENU_VERBAS(MODULO);
  const abas: [number, string][] = [
    [m("Painel"), "Painel"],
    [m("Acordos", 1), "Acordos"],
    [m("Recebimentos"), "Recebimentos"],
    [m("Caixa"), "Caixa do ERP"],
    [m("Fornecedores"), "Fornecedores"],
    [m("Pendências"), "Pendências"],
    [m("Configurações"), "Configurações"],
  ];
  const acesa = frame < m("Bora") - 6 ? agora<string | undefined>(frame, abas.map(([f, a]) => [f - 3, a] as const), undefined) : undefined;
  const meioAbas = ABA("Caixa do ERP");
  const aceso = frame >= m("Inteligência") - 4 && frame < m("Verbas") - 2 ? "Inteligência Comercial" : frame >= m("Verbas") - 2 && frame < m("abas") ? MODULO : undefined;
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.15, 600, 560],
          [
            [m("menu"), 1.5, 360, (ic.y + menu.y) / 2],
            [m("abas"), 1.4, meioAbas.x + 60, meioAbas.y + 90],
            [m("Bora"), 1, 820, 480],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO} aceso={aceso}>
          <Cabecalho aba="Painel" acesa={acesa} />
          <TelaPainel conta={-60} destaque={-1} />
        </Janela>
        <Cursor
          pontos={caminho(
            [700, 760],
            [
              [m("Inteligência"), ic.x, ic.y],
              [m("Verbas"), menu.x - 20, menu.y],
            ],
          )}
          cliques={[m("Inteligência"), m("Verbas")]}
        />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Acordo parcelado (no próprio formulário do Novo acordo) e acordo acima do limite
const Parcelas: React.FC<{ readonly de: number }> = ({ de }) => {
  const frame = useCurrentFrame();
  const meses = ["nov/26", "dez/26", "jan/27", "fev/27", "mar/27", "abr/27", "mai/27", "jun/27", "jul/27", "ago/27"];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, width: 500, marginTop: 14 }}>
      {meses.map((mes, i) => {
        const s = interpolate(frame - de - i * 3, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={mes} style={{ opacity: s, transform: `scale(${0.7 + 0.3 * s})`, border: `1px solid ${VERDE}`, background: "#14301A", borderRadius: 10, padding: "8px 14px", fontFamily: fonteApp, color: COR.texto, display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 16, color: VERDE, fontFamily: fonteMono }}>{i + 1}/10</span>
            <span style={{ fontSize: 20, fontWeight: 700, whiteSpace: "nowrap" }}>R$ 12.000</span>
            <span style={{ fontSize: 16, color: COR.suave, marginLeft: "auto" }}>{mes}</span>
          </div>
        );
      })}
    </div>
  );
};
export const Parcelado: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = usaMarca(c);
  const marca = m("marca");
  const limite = m("quando");
  const aprovado = frame >= m("aprovar");
  const sCard = spring({ frame: frame - limite - 6, fps, config: { damping: 16 } });
  const rola = interpolate(frame, [marca - 2, marca + 12], [ROLA_FORM(false), ROLA_FORM(true)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const caixa = CAMPO.parcelado(ROLA_FORM(true));
  const ja = -100;
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.1, 820, 520],
          [
            [m("parcelado"), 1.35, caixa.x + 260, caixa.y - 40],
            [m("número"), 1.4, caixa.x + 260, caixa.y + 20],
            [m("cria"), 1.3, caixa.x + 520, caixa.y - 20],
            [limite + 6, 1.4, AREA.x + 670, AREA.y + 430],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Acordos" />
          {[ACORDOS.a215, ACORDOS.a214, ACORDOS.a209, ACORDOS.a198].map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} apagado />
          ))}
          <ModalNovoAcordo
            m={{ abre: -10, fornecedor: ja, modalidade: ja, forma: ja, descricao: ja, valor: ja, prevista: ja, anexa: ja, salvar: limite }}
            dados={NOVO_PARCELADO}
            rola={rola}
            parcelas={{ marca, numero: m("número"), qtd: "10" }}
          />
          {frame >= limite + 6 && (
            <div
              style={{
                position: "absolute",
                left: 370,
                top: 260,
                width: 600,
                boxSizing: "border-box",
                padding: "26px 30px",
                borderRadius: 14,
                background: COR.cartao,
                border: `2px solid ${aprovado ? VERDE : COR.amarelo}`,
                boxShadow: `0 0 50px ${aprovado ? "rgba(60,224,30,0.3)" : "rgba(245,184,46,0.3)"}`,
                opacity: sCard,
                transform: `scale(${0.9 + 0.1 * sCard})`,
                zIndex: 30,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 26, fontWeight: 600 }}>ACD-0226</span>
                <span style={{ fontSize: 19, fontWeight: 700, padding: "4px 12px", borderRadius: 6, background: aprovado ? "#14301A" : "#3A2E12", color: aprovado ? VERDE : COR.amarelo }}>{aprovado ? "No prazo" : "Em aprovação"}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 10 }}>Tintas Horizonte</div>
              <div style={{ fontSize: 18, color: COR.suave, marginTop: 4 }}>Cota de verão · 10x R$ 12.000,00</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 14 }}>R$ 120.000,00</div>
              <div style={{ marginTop: 16, fontSize: 18, padding: "10px 14px", borderRadius: 8, background: aprovado ? "#14301A" : "#3A2E12", color: aprovado ? VERDE : COR.amarelo, fontWeight: 600 }}>
                {aprovado ? "✓ Aprovado pela diretoria · Helena Duarte" : "Acima do limite de R$ 50.000 · aguardando a diretoria"}
              </div>
              {frame >= m("saldo") - 4 && <div style={{ marginTop: 12, fontSize: 18, color: VERDE, fontWeight: 700 }}>+ R$ 120.000,00 no saldo a receber</div>}
            </div>
          )}
        </Janela>
        <Cursor pontos={caminho([1200, 700], [[marca, CAMPO.parcelado(ROLA_FORM(false)).x, CAMPO.parcelado(ROLA_FORM(false)).y], [m("número"), CAMPO.parcelas(ROLA_FORM(true)).x, CAMPO.parcelas(ROLA_FORM(true)).y]])} cliques={[marca, m("número")]} />
      </Camera>
      {/* ilustração: o sistema cria uma parcela por mês */}
      <Surge de={m("cria") - 4} ate={limite} style={{ left: 1360, top: 150 }}>
        <div style={{ background: "rgba(11,11,12,0.92)", borderRadius: 16, padding: "18px 20px", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
          <Etiqueta>UMA PARCELA POR MÊS</Etiqueta>
          <Parcelas de={m("cria")} />
        </div>
      </Surge>
    </AbsoluteFill>
  );
};

// ---------- Aprovação do fornecedor por e-mail
export const Aprovacao: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = usaMarca(c);
  const s = spring({ frame: frame - 4, fps, config: { damping: 18 } });
  const hist = m("histórico");
  const sh = spring({ frame: frame - hist + 4, fps, config: { damping: 16 } });
  const z = interpolate(frame, [m("Não", 1) - 10, m("Não", 1) + 6], [1.12, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Surge de={0} style={{ left: 100, top: 96 }}>
        <Etiqueta>O QUE O FORNECEDOR RECEBE</Etiqueta>
      </Surge>
      <div style={{ position: "absolute", left: 100, top: 146, transform: `scale(${z * (0.9 + 0.1 * s)})`, transformOrigin: "0 0", opacity: s }}>
        <EmailFornecedor naoAprovar={m("Não", 1)} loginAceso={frame >= m("login") - 4 && frame < m("Se") - 4} />
      </div>
      {frame >= hist - 4 && (
        <div style={{ position: "absolute", right: 50, top: 520, width: 540, zIndex: 5, opacity: sh, transform: `translateX(${(1 - sh) * 80}px)`, background: COR.cartao, border: `2px solid ${VERDE}`, borderRadius: 14, padding: "24px 26px", fontFamily: fonteApp, color: COR.texto, boxShadow: "0 0 50px rgba(60,224,30,0.25)" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>ACD-0215 · Tratativas e histórico</div>
          <div style={{ borderLeft: `3px solid ${COR.vermelho}`, paddingLeft: 12, marginTop: 18 }}>
            <div style={{ fontSize: 15, color: COR.vermelho }}>30/10/26, 10:05 · Fornecedor não aprovou</div>
            <div style={{ fontSize: 19, marginTop: 4 }}>“O valor combinado foi R$ 20 mil, não R$ 24 mil.” — Carla, Cerâmica Aurora</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Alertas do cadastro
export const Alertas: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const lista = [A221, ACORDOS.a187, ACORDOS.a215, ACORDOS.a209];
  const foco = agora<number>(frame, [[m("prazo") - 8, 0], [m("evidência") - 8, 1], [m("completo") - 8, 2]], -1);
  const [x0, y0] = centroAcordo(0);
  const [x1, y1] = centroAcordo(1);
  const [x2, y2] = centroAcordo(2);
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 560], [[m("alertas"), 1.25, 1150, y1], [m("prazo"), 1.4, x0 + 130, y0], [m("evidência"), 1.4, x1 + 130, y1], [m("completo"), 1.4, x2 + 130, y2]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Acordos" />
          <div style={{ position: "absolute", left: 40, top: 280, fontSize: 18, color: COR.suave }}>Filtro: Todo alerta · 55 acordo(s)</div>
          {lista.map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} aceso={i === foco} apagado={foco >= 0 && i !== foco} alertaAceso={frame >= m("alertas") - 4 && (foco < 0 || foco === i)} />
          ))}
          {frame >= m("completo") - 4 && (
            <div style={{ position: "absolute", left: 40 + 1280 - 250, top: CARTAO_ACORDO(2).y + 16, zIndex: 3, background: VERDE, color: "#0B0B0C", fontWeight: 800, fontSize: 20, padding: "6px 14px", borderRadius: 8 }}>✓ Cadastro completo</div>
          )}
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Caixa do ERP: busca, agrupa e sugere (com motivo e confiança)
// faixa de frames [de, ate) em que cada destaque fica aceso
const acesas = (frame: number, faixas: readonly (readonly [number, number, readonly string[]])[]) => faixas.flatMap(([de, ate, l]) => (frame >= de && frame < ate ? l : []));
export const CaixaErp: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const sug = NOTA.sugestao(0);
  const luzes = acesas(frame, [
    [m("notas") - 4, m("agrupa") - 4, ["sub"]],
    [m("agrupa") - 4, m("inteligência") - 4, ["grupo0"]],
    [m("sugere") - 4, m("motivo") - 4, ["sug0"]],
    [m("motivo") - 4, m("confiança") - 4, ["mot0", "mot1"]],
    [m("confiança") - 4, m("nada") - 4, ["conf0", "conf1"]],
  ]);
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1, 820, 480],
          [
            [m("Caixa"), 1.05, 820, 500],
            [m("notas"), 1.4, 640, AREA.y + 380],
            [m("agrupa"), 1.3, 820, NOTA.grupo(0).y + 150],
            [m("sugere"), 1.5, sug.x - 60, sug.y + 10],
            [m("confiança"), 1.3, sug.x - 140, NOTA.sugestao(1).y - 90],
            [m("nada"), 1.05, 820, 520],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Caixa do ERP" acesa={frame >= m("Caixa") - 4 && frame < m("Você") ? "Caixa do ERP" : undefined} />
          <TelaCaixa luzes={luzes} />
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};

export const Saidas: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const aceita = m("Aceitar");
  const todas = m("todas");
  const preferir = m("preferir");
  const divide = m("divide");
  const ignora = m("ignora");
  const R = ROLA_GRUPO(1);
  // a última nota (brinde) só cabe inteira depois de a lista subir mais uma vez, antes do retroativo
  const R2 = ROLA_NOTA(3);
  const sobe = m("retroativo") - 30;
  const volta = m("ensina") - 8;
  const rola = interpolate(frame, [preferir - 12, preferir + 6, sobe, sobe + 16, volta, volta + 16], [0, R, R, R2, R2, R], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const estados: EstadoNota[] = [
    frame >= aceita + 6 ? { tipo: "aceito", de: aceita + 6 } : { tipo: "pendente" },
    frame >= todas + 6 ? { tipo: "aceito", de: todas + 6 } : { tipo: "pendente" },
    frame >= divide + 8 ? { tipo: "dividida", de: divide + 8 } : { tipo: "pendente" },
    frame >= m("motivo") + 18 ? { tipo: "ignorado", de: m("motivo") + 18 } : frame >= ignora + 4 ? { tipo: "motivo", de: ignora + 4 } : { tipo: "pendente" },
  ];
  const luzes = acesas(frame, [
    [m("sugestão") - 4, aceita, ["sug0"]],
    [m("alta") - 4, todas + 4, ["gac0"]],
    [m("lança") - 4, divide - 4, ["sel2"]],
    [divide - 4, divide + 6, ["div2"]],
    [m("retroativo") - 4, ignora - 2, ["retro3"]],
    [ignora - 4, ignora + 4, ["ign3"]],
  ]);
  const a0 = NOTA.aceitar(0);
  const g0 = NOTA.grupoAceitar(0);
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.15, 820, 600],
          [
            [aceita, 1.4, a0.x - 180, a0.y + 70],
            [todas, 1.35, g0.x - 260, NOTA.grupo(0).y + 170],
            [preferir, 1.12, 820, 640],
            [m("lança"), 1.4, 1150, NOTA.lancar(2, R).y - 40],
            [m("retroativo"), 1.4, 1100, NOTA.ignorar(3, R2).y - 90],
            [m("ensina"), 1.1, 900, NOTA.grupo(1, R).y + 260],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Caixa do ERP" />
          <TelaCaixa estados={estados} luzes={luzes} rola={rola} cliques={{ aceitar0: aceita, grupo0: todas }} />
          {frame < todas && <Aviso de={aceita + 8} texto="ACD-0215: saldo de R$ 24.000 para R$ 10.000" />}
          {frame >= todas && frame < preferir && <Aviso de={todas + 8} texto="ACD-0215: saldo de R$ 10.000 para R$ 4.000" />}
          <Aviso de={m("ensina") - 2} texto="A IA usa as suas decisões nas próximas sugestões da Tintas Horizonte" />
        </Janela>
        <Cursor
          pontos={caminho(
            [1100, 820],
            [
              [aceita, a0.x, a0.y],
              [todas, g0.x, g0.y],
              [m("lança"), NOTA.lancar(2, R).x, NOTA.lancar(2, R).y],
              [divide, NOTA.dividir(2, R).x, NOTA.dividir(2, R).y],
              [m("retroativo"), NOTA.retro(3, R2).x, NOTA.retro(3, R2).y],
              [ignora, NOTA.ignorar(3, R2).x, NOTA.ignorar(3, R2).y],
            ],
          )}
          cliques={[aceita, todas, divide, ignora]}
        />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Quando a sugestão não está certa: lista de acordos com busca, Lançar, retroativo ou cadastrar
export const Ajuste: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const abre = m("abre");
  const busca = m("buscar");
  const certo = m("certo");
  const lancar = m("Lançar");
  const existe = m("existe");
  const cadastra = m("cadastra");
  const R1 = 258; // nota 2 da Cerâmica Aurora perto do topo da lista
  const R2 = ROLA_GRUPO(1);
  const rola = interpolate(frame, [existe - 10, existe + 8], [R1, R2], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const digitado = "vitrine".slice(0, Math.max(0, Math.floor((frame - busca - 4) * 0.5)));
  const aberta = frame >= abre + 4 && frame < certo + 4;
  const escolhido = frame >= certo + 4;
  const estados: EstadoNota[] = [
    { tipo: "aceito", de: -100 },
    frame >= lancar + 6 ? { tipo: "aceito", de: lancar + 6, texto: "✓ Lançada no ACD-0222 · saldo R$ 0" } : { tipo: "pendente" },
  ];
  const luzes = acesas(frame, [
    [abre - 6, abre + 4, ["selab1"]],
    [m("sugerido") - 4, m("saldo") - 4, ["pg-Suger"]],
    [m("saldo") - 4, m("liquidados") - 4, ["pg-Com s"]],
    [m("liquidados") - 4, busca - 4, ["pg-Liqui"]],
    [busca - 4, certo - 8, ["busca"]],
    [lancar - 6, lancar + 4, ["lan1"]],
    [m("retroativo") - 4, cadastra - 4, ["retro2"]],
  ]);
  const sel = NOTA.seletor(1, R1);
  const item = { x: AREA.x + 40 + 770 + 200, y: AREA.y + 514 };
  const abaAcordos = ABA("Acordos");
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.15, 1100, 600],
          [
            [abre, 1.25, 1150, 470],
            [busca, 1.4, 1150, 560],
            [lancar, 1.35, 1150, NOTA.lancar(1, R1).y - 60],
            [existe, 1.2, 1050, NOTA.retro(2, R2).y - 120],
            [cadastra, 1.05, 820, 480],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba="Caixa do ERP" acesa={frame >= cadastra - 4 ? "Acordos" : undefined} />
          <TelaCaixa
            estados={estados}
            luzes={luzes}
            rola={rola}
            cliques={{ lancar1: lancar }}
            selecoes={escolhido ? { 1: "ACD-0222 · saldo R$ 6.000 · Vitrine de novembro" } : {}}
            lista={aberta ? { i: 1, busca: frame >= busca + 4 ? <Digitando texto="vitrine" de={busca + 4} porFrame={0.5} /> : undefined, filtro: digitado, item: frame >= certo - 10 ? "ACD-0222" : undefined } : undefined}
          />
        </Janela>
        <Cursor
          pontos={caminho(
            [1250, 820],
            [
              [abre, sel.x, sel.y],
              [certo, item.x, item.y],
              [lancar, NOTA.lancar(1, R1).x, NOTA.lancar(1, R1).y],
              [m("retroativo"), NOTA.retro(2, R2).x, NOTA.retro(2, R2).y],
              [cadastra, abaAcordos.x, abaAcordos.y],
            ],
          )}
          cliques={[abre, certo, lancar]}
        />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Valor dos produtos × total da NF
export const Produtos: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const v = NOTA.valor(0);
  const luzes = acesas(frame, [
    [m("produtos") - 4, m("nota") - 4, ["prod0", "prod1"]],
    [m("nota") - 4, m("Por"), ["imp0", "imp1"]],
    [m("conta") - 4, m("total") - 4, ["prod0", "prod1"]],
    [m("total") - 4, c.dur, ["imp0", "imp1"]],
  ]);
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 560], [[m("acordo"), 1.6, v.x - 40, v.y + 60], [m("total"), 1.6, v.x - 40, v.y + 90]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Caixa do ERP" />
          <TelaCaixa luzes={luzes} />
        </Janela>
      </Camera>
      <Surge de={m("conta") - 4} ate={m("total") - 4} style={{ left: 80, top: 770 }}>
        <div style={{ background: VERDE, color: "#0B0B0C", ...TITULO, fontSize: 34, padding: "14px 22px", borderRadius: 12, lineHeight: 1.15 }}>
          Conta no saldo:
          <br />o valor dos produtos
        </div>
      </Surge>
      <Surge de={m("total") - 4} style={{ left: 80, top: 770 }}>
        <div style={{ background: COR.amarelo, color: "#0B0B0C", ...TITULO, fontSize: 34, padding: "14px 22px", borderRadius: 12, lineHeight: 1.15 }}>
          Embaixo: o total
          <br />
          da NF e os impostos
        </div>
      </Surge>
    </AbsoluteFill>
  );
};

// ---------- Recebimentos (A resolver), Fornecedores e Pendências
export const Outras: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const forn = m("Fornecedores") - 8;
  const pend = m("Pendências") - 8;
  const corrige = m("clique");
  const aba = frame < forn ? "Recebimentos" : frame < pend ? "Fornecedores" : "Pendências";
  const acesaPend = agora<"prioridade" | "valor" | "acao" | undefined>(frame, [[m("prioridade") - 4, "prioridade"], [m("valor") - 4, "valor"], [m("ação") - 4, "acao"]], undefined);
  const k = interpolate(frame, [forn - 6, forn, forn + 6, pend - 6, pend, pend + 6], [1, 0, 1, 1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entre = (de: number, ate: number) => frame >= de && frame < ate;
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.05, 820, 520],
          [
            [m("resolver"), 1.45, RECEB.aba.x + 300, RECEB.aba.y + 60],
            [m("conferência"), 1.4, RECEB.financeiro.x - 220, RECEB.financeiro.y - 80],
            [m("divergente"), 1.35, 900, RECEB.linha(2).y],
            [m("impostos"), 1.45, RECEB.usar.x - 260, RECEB.usar.y + 20],
            [forn + 8, 1.15, 820, 560],
            [m("comprador"), 1.5, FORN_COMPRADOR_X + 160, AREA.y + 436 + 150],
            [pend + 8, 1.15, 820, 560],
            [m("prioridade"), 1.55, 760, 44 + 376 + 40],
            [m("ação"), 1.55, 760, 44 + 376 + 120],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <Cabecalho aba={aba} />
          <div style={{ position: "absolute", inset: 0, opacity: k }}>
            {aba === "Recebimentos" && (
              <TelaRecebimentos
                abaAcesa={entre(m("resolver") - 4, m("conferência") - 4)}
                finAceso={entre(m("conferência") - 4, m("divergente") - 4)}
                linhaAcesa={entre(m("divergente") - 4, m("impostos") - 4) ? 2 : undefined}
                avisoAceso={entre(m("impostos") - 4, corrige)}
                corrige={corrige}
              />
            )}
            {aba === "Fornecedores" && <TelaFornecedores compradorAceso={frame >= m("comprador") - 4} />}
            {aba === "Pendências" && <TelaPendencias acesa={acesaPend} />}
          </div>
        </Janela>
        {frame < forn && <Cursor pontos={caminho([1300, 820], [[corrige, RECEB.usar.x, RECEB.usar.y]])} cliques={[corrige]} />}
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Página do acordo
export const Pagina: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const clique = m("código") + 4;
  const abre = clique + 6;
  const foco = agora<"recebimentos" | "saldo" | "aprovacao" | "evidencias" | null>(
    frame,
    [
      [m("recebimentos") - 6, "recebimentos"],
      [m("saldo") - 6, "saldo"],
      [m("aprovação") - 6, "aprovacao"],
      [m("evidências") - 6, "evidencias"],
    ],
    null,
  );
  const k = interpolate(frame, [abre - 6, abre, abre + 8], [1, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const codigo = { x: AREA.x + 40 + 50, y: AREA.y + CARTAO_ACORDO(0).y + 34 };
  return (
    <AbsoluteFill>
      <Camera
        quadros={rota(
          [1.3, 640, 520],
          [
            [m("página"), 1, 820, 480],
            [m("recebimentos"), 1.45, PAGINA.recebimentos.x, PAGINA.recebimentos.y],
            [m("saldo"), 1.45, PAGINA.saldo.x + 200, PAGINA.saldo.y],
            [m("aprovação"), 1.45, PAGINA.aprovacao.x, PAGINA.aprovacao.y],
            [m("evidências"), 1.45, PAGINA.evidencias.x, PAGINA.evidencias.y],
          ],
          c.dur,
        )}
      >
        <Janela ativo={MODULO}>
          <div style={{ position: "absolute", inset: 0, opacity: k }}>
            {frame < abre ? (
              <>
                <Cabecalho aba="Acordos" />
                {[ACORDOS.a214, ACORDOS.a209, ACORDOS.a215, ACORDOS.a187].map((a, i) => (
                  <CartaoAcordo key={a.codigo} a={a} i={i} aceso={i === 0 && frame >= clique - 10} />
                ))}
              </>
            ) : (
              <PaginaAcordo foco={foco} anexos={[m("contrato"), m("email"), m("WhatsApp")]} />
            )}
          </div>
        </Janela>
        <Cursor pontos={caminho([700, 700], [[clique, codigo.x, codigo.y]])} cliques={[clique]} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Tratativas e histórico
export const Tratativas: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const registra = m("histórico");
  return (
    <AbsoluteFill>
      <Camera quadros={rota(CENTRO, [[m("registra"), 1.55, PAGINA.tratativas.x, 44 + 290 + 190], [registra, 1.55, PAGINA.tratativas.x, 44 + 290 + 260], [m("substitui"), 1.05, 820, 480]], c.dur)}>
        <Janela ativo={MODULO}>
          <PaginaAcordo foco={frame >= m("registra") - 6 && frame < m("substitui") ? "tratativas" : null} anexos={[-99, -99, -99]} digita={m("cobrado")} registra={registra} />
        </Janela>
        <Cursor
          pontos={caminho(
            [1200, 820],
            [
              [m("registra"), TRAT_TEXTO.x, TRAT_TEXTO.y],
              [registra, TRAT_REGISTRAR.x, TRAT_REGISTRAR.y],
            ],
          )}
          cliques={[m("registra"), registra]}
        />
      </Camera>
      {/* a velha coluna "Obs." da planilha, riscada */}
      <Surge de={m("velha") - 4} style={{ left: 140, top: 240 }}>
        <div style={{ background: "white", borderRadius: 8, overflow: "hidden", width: 300, fontFamily: "Arial, sans-serif", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", position: "relative" }}>
          {["Obs.", "cobrar", "ver c/ fin.", "e-mail??", "falta 1", "confirmar"].map((t, i) => (
            <div key={t} style={{ height: 50, padding: "0 16px", display: "flex", alignItems: "center", fontSize: 22, fontWeight: i ? 400 : 700, background: i ? "white" : "#C9D3CC", borderBottom: "1px solid #ccc", color: "#1B1E1C" }}>
              {t}
            </div>
          ))}
          <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 8, background: COR.vermelho, transform: `rotate(-24deg) scaleX(${interpolate(frame - m("observações"), [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }} />
        </div>
      </Surge>
    </AbsoluteFill>
  );
};

// ---------- Lançar recebimento
export const Recebimento: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  const clique = m("Lançar");
  const f = { abre: clique + 4, acordo: m("acordo"), valor: m("valor"), forma: m("forma"), numero: m("número"), dividir: m("dividir"), lancar: c.dur - 22 };
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 480], [[clique, 1.3, BOTAO_LANCAR_REC.x - 260, BOTAO_LANCAR_REC.y + 140], [f.acordo, 1.22, 960, 430], [f.forma, 1.22, 960, 540], [f.dividir, 1.22, 960, 450], [f.lancar, 1.15, 960, 560]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Recebimentos" />
          <TelaRecebimentos clique={clique} />
          <ModalRecebimento m={f} />
          <Aviso de={f.lancar + 12} texto="Recebimento lançado em 2 acordos" />
        </Janela>
        <Cursor
          pontos={caminho(
            [1300, 700],
            [
              [clique, BOTAO_LANCAR_REC.x, BOTAO_LANCAR_REC.y],
              [f.acordo, REC.acordo.x, REC.acordo.y],
              [f.valor, REC.valor.x, REC.valor.y],
              [f.forma, REC.forma.x, REC.forma.y],
              [f.numero, REC.numero.x, REC.numero.y],
              [f.dividir, REC.dividir.x, REC.dividir.y],
              [f.lancar, REC.lancar.x, REC.lancar.y],
            ],
          )}
          cliques={[clique, f.acordo, f.valor, f.forma, f.numero, f.dividir, f.lancar]}
        />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Planilha: exportar, alterar e importar
export const Planilha: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = usaMarca(c);
  const exporta = m("Exporta");
  const importa = m("importa");
  const imp = { abre: importa + 4, arquivo: m("volta") + 6, conferir: m("Antes"), linhas: [m("cadastrar"), m("alterar"), m("mudança") - 4, m("erro")], importar: c.dur - 20 };
  const aba = agora<FocoExcel>(frame, [[m("acordos", 1) - 4, "Acordos"], [m("recebimentos") - 4, "Recebimentos"]], "Fornecedores");
  const sx = spring({ frame: frame - exporta - 6, fps, config: { damping: 16 } });
  const saiExcel = interpolate(frame, [importa - 6, importa + 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.15, 1100, 360], [[importa, 1.1, 970, 470], [m("cadastrar"), 1.15, 970, 590]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Acordos" />
          {[ACORDOS.a215, ACORDOS.a214, ACORDOS.a209, A221].map((a, i) => (
            <CartaoAcordo key={a.codigo} a={a} i={i} apagado />
          ))}
          <ModalImportar m={imp} />
        </Janela>
        <Cursor
          pontos={caminho(
            [1100, 500],
            [
              [exporta, BOTAO_EXPORTAR.x, BOTAO_EXPORTAR.y],
              [importa, BOTAO_IMPORTAR.x, BOTAO_IMPORTAR.y],
              [imp.conferir, IMP.conferir.x, IMP.conferir.y],
              [imp.importar, IMP.importar.x, IMP.importar.y],
            ],
          )}
          cliques={[exporta, importa, imp.conferir, imp.importar]}
        />
      </Camera>
      {frame >= exporta + 6 && saiExcel > 0 && (
        <div style={{ position: "absolute", left: 370, top: 230, opacity: sx * saiExcel, transform: `translateY(${(1 - sx) * 60}px)` }}>
          <PlanilhaExcel aba={aba} edita={m("acordos", 1) + 12} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Regras da importação
const Regra: React.FC<{ readonly de: number; readonly x: number; readonly titulo: string; readonly linha2: string; readonly icone: React.ReactNode }> = ({ de, x, titulo, linha2, icone }) => (
  <Surge de={de} style={{ left: x, top: 330 }}>
    <div style={{ width: 760, height: 380, boxSizing: "border-box", borderRadius: 22, background: "#141815", border: "2px solid rgba(60,224,30,0.5)", padding: "44px 46px", boxShadow: "0 0 60px rgba(60,224,30,0.15)" }}>
      <div style={{ fontSize: 64 }}>{icone}</div>
      <div style={{ ...TITULO, fontSize: 52, color: "white", marginTop: 20, lineHeight: 1.1 }}>{titulo}</div>
      <div style={{ ...TITULO, fontSize: 52, marginTop: 6, lineHeight: 1.15, ...textoDegrade }}>{linha2}</div>
    </div>
  </Surge>
);
export const Regras: React.FC<P> = ({ c }) => {
  const m = usaMarca(c);
  return (
    <>
      <Surge de={m("tranquilo") - 6} style={{ left: 0, right: 0, top: 170, textAlign: "center" }}>
        <Etiqueta>PODE FICAR TRANQUILO</Etiqueta>
      </Surge>
      <Regra de={m("célula") - 4} x={150} titulo="Célula vazia" linha2="não apaga nada" icone="▢" />
      <Regra de={m("mesmo") - 4} x={1010} titulo="Documento repetido" linha2="o sistema avisa" icone="🧾" />
    </>
  );
};

// ---------- E-mails semanais
// e-mail com zoom por seção: quadros [frame, escala, y do e-mail que fica no centro da tela]
export const RolaEmail: React.FC<{ readonly quadros: readonly (readonly [number, number, number])[]; readonly children: React.ReactNode }> = ({ quadros, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 2, fps, config: { damping: 18 } });
  const op = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) } as const;
  const fs = quadros.map((q) => q[0]);
  const z = interpolate(frame, fs, quadros.map((q) => q[1]), op);
  const fy = interpolate(frame, fs, quadros.map((q) => q[2]), op);
  return <div style={{ position: "absolute", left: 1000 - 490 * z, top: 500 - fy * z + (1 - s) * 80, transform: `scale(${z})`, transformOrigin: "0 0", opacity: s }}>{children}</div>;
};
// zoom que chega na seção 12 frames antes da palavra
export const secao = (f: number, z: number, y: number) => [[f - 12, z, y] as const, [f + 1, z, y] as const];
export const Selo: React.FC<{ readonly de: number; readonly ate?: number; readonly y: number; readonly children: React.ReactNode }> = ({ de, ate, y, children }) => (
  <Surge de={de} ate={ate} style={{ left: 40, top: y, width: 290 }}>
    <div style={{ background: VERDE, color: "#0B0B0C", ...TITULO, fontSize: 30, padding: "16px 22px", borderRadius: 12, lineHeight: 1.15 }}>{children}</div>
  </Surge>
);
export const EmailCompradorCena: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const foco = agora<FocoComprador>(frame, [[m("vencidos") - 6, "vencidos"], [m("vencem") - 6, "breve"], [m("prazo") - 6, "semprazo"], [m("respostas") - 6, "respostas"], [m("notas") - 6, "notas"], [m("quem") - 4, null]], null);
  return (
    <>
      <RolaEmail quadros={[[0, 0.95, 470], ...secao(m("vencidos"), 1.25, 380), ...secao(m("vencem"), 1.25, 495), ...secao(m("prazo"), 1.25, 615), ...secao(m("respostas"), 1.25, 740), ...secao(m("notas"), 1.25, 865), ...secao(m("quem"), 0.95, 500)]}>
        <EmailComprador foco={foco} />
      </RolaEmail>
      <Selo de={m("oito") - 4} y={160}>
        Toda segunda,
        <br />
        às 8h
      </Selo>
      <Selo de={m("pendência") - 4} y={420}>
        Sem pendência,
        <br />
        sem e-mail
      </Selo>
    </>
  );
};
export const EmailDiretoriaCena: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const foco = agora<FocoDiretoria>(frame, [[m("negociado") - 6, "numeros"], [m("vencido") - 6, "comprador"], [m("atrasos") - 6, "atrasos"], [m("aprovação") - 6, "aprovacao"], [m("tudo") - 4, null]], null);
  return (
    <>
      <RolaEmail quadros={[[0, 1, 420], ...secao(m("negociado"), 1.25, 290), ...secao(m("vencido"), 1.25, 420), ...secao(m("atrasos"), 1.25, 560), ...secao(m("aprovação"), 1.25, 680), ...secao(m("tudo"), 1, 420)]}>
        <EmailDiretoria foco={foco} />
      </RolaEmail>
      <Selo de={m("diretoria") - 4} y={160}>
        Resumo da
        <br />
        diretoria
      </Selo>
    </>
  );
};

// ---------- Rotina da semana
export const Rotina: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = usaMarca(c);
  const itens: [number, string][] = [
    [m("Lê"), "Ler o e-mail semanal"],
    [m("cobra"), "Cobrar os vencidos e registrar a cobrança"],
    [m("combina"), "Combinar a data dos acordos sem prazo"],
    [m("aceita"), "Aceitar as sugestões da Caixa do ERP"],
    [m("resolve"), "Resolver o que ficou em Recebimentos"],
    [m("cadastra"), "Cadastrar no mesmo dia todo acordo novo"],
  ];
  return (
    <>
      <Surge de={0} style={{ left: 140, top: 150 }}>
        <Etiqueta>ROTINA DA SEMANA</Etiqueta>
        <div style={{ ...TITULO, fontSize: 150, lineHeight: 1, marginTop: 14, ...textoDegrade }}>10 min</div>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 34, color: CINZA, marginTop: 6 }}>por semana, no dia do e-mail</div>
      </Surge>
      <div style={{ position: "absolute", left: 820, top: 150, width: 960 }}>
        {itens.map(([f, t], i) => {
          const s = spring({ frame: frame - (i === 0 ? 0 : 6) - i * 4, fps, config: { damping: 18 } });
          const feito = frame >= f;
          const k = spring({ frame: frame - f, fps, config: { damping: 12, stiffness: 180 } });
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 26, height: 104, borderBottom: "1px solid rgba(255,255,255,0.08)", opacity: s }}>
              <div style={{ width: 62, height: 62, borderRadius: 14, border: `3px solid ${feito ? VERDE : "#444"}`, background: feito ? VERDE : "transparent", display: "grid", placeItems: "center", color: "#0B0B0C", fontSize: 40, fontWeight: 900, transform: `scale(${feito ? 0.8 + 0.2 * k : 1})`, boxShadow: feito ? "0 0 26px rgba(60,224,30,0.5)" : "none" }}>
                {feito ? "✓" : ""}
              </div>
              <div style={{ fontFamily, fontWeight: 800, fontSize: 38, color: feito ? "white" : "rgba(255,255,255,0.45)" }}>{t}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// ---------- Configurações (Admin)
export const Config: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const coluna = agora<"Comprador" | "Assistente de Compras" | "Financeiro" | "Marketing / Trade" | "Diretoria" | undefined>(
    frame,
    [
      [m("comprador") - 4, "Comprador"],
      [m("assistente") - 4, "Assistente de Compras"],
      [m("financeiro") - 4, "Financeiro"],
      [m("marketing") - 4, "Marketing / Trade"],
      [m("diretoria") - 4, "Diretoria"],
    ],
    undefined,
  );
  const cfg = ABA("Configurações");
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.3, cfg.x - 200, cfg.y + 60], [[m("define"), 1.05, 820, 520], [m("comprador"), 1.2, 900, 600]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Configurações" acesa={frame < m("define") ? "Configurações" : undefined} />
          <TelaPapeis coluna={coluna} />
          {frame >= m("Admin") - 4 && (
            <div style={{ position: "absolute", left: 1060, top: 140, background: COR.amarelo, color: "#0B0B0C", fontWeight: 800, fontSize: 18, padding: "6px 14px", borderRadius: 8 }}>Só aparece para o Admin</div>
          )}
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};

export const Config2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const foco = agora<"tolerancia" | "limite" | "listas" | "emails" | null>(
    frame,
    [
      [m("tolerância") - 4, "tolerancia"],
      [m("limite") - 4, "limite"],
      [m("listas") - 4, "listas"],
      [m("emails") - 4, "emails"],
    ],
    null,
  );
  const teste = m("teste");
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 820, 560], [[m("tolerância"), 1.4, 650, 44 + 262 + 170], [m("listas"), 1.4, 1290, 44 + 262 + 170], [m("emails"), 1.3, 820, 44 + 602 + 150]], c.dur)}>
        <Janela ativo={MODULO}>
          <Cabecalho aba="Configurações" />
          <TelaParametros foco={foco} teste={teste} />
        </Janela>
        <Cursor pontos={caminho([1100, 900], [[teste, BOTAO_TESTE.x, BOTAO_TESTE.y]])} cliques={[teste]} />
      </Camera>
    </AbsoluteFill>
  );
};

// ---------- Olho de Deus: pergunta sobre o módulo
export const OlhoVerbas: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = usaMarca(c);
  const pergunta = "Quanto a Tintas Horizonte ainda deve?";
  const digita = m("exemplo") - 4;
  const enviada = digita + Math.ceil(pergunta.length / 2.4) + 6;
  const responde = Math.max(enviada + 14, m("enxerga") - 10);
  return (
    <AbsoluteFill>
      <Camera quadros={rota([1.05, 900, 520], [[m("exemplo"), 1.2, 960, 640], [m("enxerga"), 1.2, 900, 420]], c.dur)}>
        <Janela ativo="Olho de Deus">
          <CabecaOlho />
          <Controles escopo="Geral (a empresa toda)" />
          <div style={{ position: "absolute", left: 40, right: 40, top: 220, height: 590, border: `1px solid ${COR.borda}`, borderRadius: 12 }} />
          <Balao de={enviada} y={250}>
            {pergunta}
          </Balao>
          <Resposta de={responde} y={330} w={900}>
            A <b>Tintas Horizonte</b> ainda deve <b>R$ 21.400,00</b> em 6 acordos abertos. Desse total, <b style={{ color: COR.vermelho }}>R$ 6.500,00 já venceu</b>: a parcela 2/6 da cota de aniversário (ACD-0214), desde 30/09.
            <div style={{ fontSize: 17, color: COR.suave, marginTop: 8 }}>Fonte: Verbas e Acordos · acordos, recebimentos e Caixa do ERP</div>
          </Resposta>
          <Entrada>{frame < enviada ? <Digitando texto={pergunta} de={digita} porFrame={2.4} /> : undefined}</Entrada>
        </Janela>
      </Camera>
    </AbsoluteFill>
  );
};
