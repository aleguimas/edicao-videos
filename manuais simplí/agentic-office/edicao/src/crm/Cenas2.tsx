import type React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ALTURA, caminho, Cursor, LARGURA, rota } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { Chip, Selo } from "../apresentacao/comum";
import { CINZA, fontFamily, textoDegrade, TITULO, VERDE } from "../fonte";
import { Etiqueta, FotoAna, Surge } from "../verbas/Montagem";
import { CenaCelular, CenaCrm, CENTRO, J, JanelaCrm } from "./Cenas";
import { Moldura, TelaNotificacoes, TelaVendedor } from "./Celular";
import { LARGURA_CRM, TelaCrm } from "./Kit";
import { type Conversa, CONVERSAS_NOITE, type Mensagem, MenuMacros, ModalEtapas, PainelContato, TelaChat } from "./TelaChat";
import { MARCOS, TelaCard, TelaConexoes, TelaIgAutomacoes, TelaIgSequencia, TelaKanban, TelaSitePopup } from "./TelasEntrada";
import { TelaAprovacoes, TelaContratos, TelaDashboard, TelaEvento, TelaFinanceiro, TelaGestao, TelaGestaoVista, TelaIgPainel, TelaMcp, TelaNovaTarefa, TelaPaginaPublica, TelaProjeto, TelaRelatorios, TelaSentimentos, TelaTarefaDetalhe } from "./TelasGestor";
import { TelaEmailDominio, TelaEmailEditor, TelaEmailRelatorio, TelaEventoCampanha, TelaFlow, TelaFormularios, TelaGrupos, TelaHistorico, TelaPopups, TelaSegmentacao, TelaSites, TelaSms, TelaSmsPainel } from "./TelasRelacionamento";
import { ModalCliente, ModalLembrete, TelaCrmClientes, TelaObra, TelaOrcamentos, TelaTarefas } from "./TelasVenda";

type P = { readonly c: Cena };
type Q = readonly [number, number, number, number];

// foco da câmera em um ponto da tela do CRM, sem deixar aparecer o fundo além da janela
export const Foco = (f: number, z: number, x: number, y: number): Q => {
  const [wx, wy] = J(x, y);
  const k = 1.047 * z;
  const mx = 960 / k;
  const my = 540 / k;
  const cx = mx >= LARGURA / 2 ? LARGURA / 2 : Math.min(LARGURA - mx, Math.max(mx, wx));
  const cy = my >= ALTURA / 2 ? ALTURA / 2 : Math.min(ALTURA - my, Math.max(my, wy));
  return [f, z, cx, cy];
};
export const fixo = (x: Q): readonly [readonly [number, number, number, number], readonly [number, number, number, number]] => [[0, x[1], x[2], x[3]], [1e5, x[1], x[2], x[3]]];
const k01 = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const digita = (texto: string, frame: number, de: number, porFrame = 1.6) => texto.slice(0, Math.max(0, Math.floor((frame - de) * porFrame)));

// troca de tela dentro da mesma fala, com um fade curto
export const Troca: React.FC<{ readonly cortes: readonly number[]; readonly children: readonly React.ReactNode[] }> = ({ cortes, children }) => {
  const frame = useCurrentFrame();
  let i = 0;
  while (i < cortes.length && frame >= cortes[i]) i += 1;
  const de = i === 0 ? -99 : cortes[i - 1];
  return <AbsoluteFill style={{ opacity: interpolate(frame, [de, de + 7], [0, 1], { extrapolateRight: "clamp" }) }}>{children[i]}</AbsoluteFill>;
};

export const Tarja: React.FC<{ readonly de: number; readonly ate?: number; readonly x?: number; readonly y?: number; readonly children: React.ReactNode }> = ({ de, ate, x = 960, y = 120, children }) => (
  <Surge de={de} ate={ate} style={{ left: x, top: y, zIndex: 40 }}>
    <div style={{ transform: "translateX(-50%)", background: VERDE, color: "#0B0B0C", borderRadius: 10, padding: "10px 22px", fontFamily, fontWeight: 900, fontSize: 30, letterSpacing: 1, whiteSpace: "nowrap", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>{children}</div>
  </Surge>
);

const Lista: React.FC<{ readonly x: number; readonly y: number; readonly itens: readonly (readonly [number, string])[]; readonly ate?: number }> = ({ x, y, itens, ate }) => (
  <>
    {itens.map(([de, t], i) => (
      <Surge key={t} de={de} ate={ate} style={{ left: x, top: y + i * 76, zIndex: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(11,11,12,0.92)", border: "1px solid rgba(60,224,30,0.5)", borderRadius: 12, padding: "12px 22px", whiteSpace: "nowrap" }}>
          <div style={{ width: 13, height: 13, borderRadius: 7, background: VERDE }} />
          <div style={{ ...TITULO, fontSize: 32, color: "white" }}>{t}</div>
        </div>
      </Surge>
    ))}
  </>
);

// ---------- jornada do Marcos: fecha cada capítulo avançando uma etapa
const ETAPAS_MARCOS = ["Chegou", "Atendido", "Assumido", "Orçamento", "Comprou", "Em risco", "Voltou"];
const Trilha: React.FC<{ readonly etapa: number; readonly grande?: boolean }> = ({ etapa, grande }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    {ETAPAS_MARCOS.map((e, i) => {
      const feita = i < etapa;
      const d = grande ? 74 : 34;
      return (
        <div key={e} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 ? <div style={{ width: grande ? 150 : 72, height: grande ? 8 : 5, marginTop: grande ? -46 : -32, background: feita ? VERDE : "#2F3531" }} /> : null}
          <div style={{ width: grande ? 110 : 90, display: "flex", flexDirection: "column", alignItems: "center", margin: grande ? "0 -18px" : "0 -28px" }}>
            <div style={{ width: d, height: d, borderRadius: d / 2, background: feita ? VERDE : "#1C201D", border: `2px solid ${feita ? VERDE : "#3A403B"}`, color: "#0B0B0C", ...TITULO, fontSize: grande ? 34 : 17, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: i === etapa - 1 ? "0 0 30px rgba(60,224,30,0.7)" : "none" }}>{feita ? "✓" : ""}</div>
            <div style={{ fontFamily, fontWeight: 700, fontSize: grande ? 25 : 15, color: feita ? "white" : CINZA, marginTop: 7, whiteSpace: "nowrap" }}>{e}</div>
          </div>
        </div>
      );
    })}
  </div>
);

export const comJornada = (Tela: React.FC<P>, etapa: number, lado: readonly [number, number] = [0, 0]): React.FC<P> => {
  const Com: React.FC<P> = ({ c }) => {
    const frame = useCurrentFrame();
    const de = c.dur - 84;
    const passa = k01(frame, de + 22, de + 40);
    return (
      <>
        <Tela c={c} />
        <Surge de={de} style={{ left: lado[0], right: lado[1], top: 96, display: "flex", justifyContent: "center", zIndex: 45 }}>
          <div style={{ background: "rgba(11,11,12,0.94)", border: "1px solid rgba(60,224,30,0.4)", borderRadius: 16, padding: "14px 40px", zoom: 1.15 }}>
            <Trilha etapa={etapa - 1 + (passa > 0.5 ? 1 : 0)} />
          </div>
        </Surge>
      </>
    );
  };
  return Com;
};

// ---------- para quem é
const PERFIS = [
  ["Varejo", "VAREJO E DISTRIBUIÇÃO", "volume de atendimento e ERP"],
  ["empresas", "EMPRESAS DE SERVIÇO", "agências e consultorias, com contrato recorrente"],
] as const;
export const Quem2: React.FC<P> = ({ c }) => (
  <>
    <Surge de={marca(c.fala, "dois") - 4} style={{ left: 0, right: 0, top: 130, textAlign: "center" }}>
      <div style={{ fontFamily, fontWeight: 600, fontSize: 40, color: CINZA }}>O Simplí CRM atende dois perfis</div>
    </Surge>
    {PERFIS.map(([p, t, n], i) => (
      <Surge key={p} de={marca(c.fala, p) - 4} style={{ left: 160 + i * 820, top: 270 }}>
        <div style={{ width: 780, height: 420, boxSizing: "border-box", padding: "70px 54px", borderRadius: 22, background: "#141815", border: "1px solid #2A2F2B" }}>
          <div style={{ ...TITULO, fontSize: 66, lineHeight: 1.06, color: "white" }}>{t}</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA, marginTop: 20 }}>{n}</div>
        </div>
      </Surge>
    ))}
  </>
);

export const Quem3: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("CRM") - 4} style={{ left: 0, right: 0, top: 210, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 44, color: CINZA }}>Um CRM que</div>
      </Surge>
      {(["atende", "vende", "gerencia"] as const).map((p, i) => (
        <Surge key={p} de={m(p) - 3} style={{ left: [150, 710, 1190][i], top: 340 }}>
          <div style={{ ...TITULO, fontSize: 104, whiteSpace: "nowrap", ...(i === 2 ? textoDegrade : { color: "white" }) }}>{p.toUpperCase()}.</div>
        </Surge>
      ))}
      <Surge de={m("mesmo") - 4} style={{ left: 0, right: 0, top: 520, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 44, color: CINZA }}>no mesmo lugar</div>
      </Surge>
    </>
  );
};

export const Quem4: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("Loja") - 4} style={{ left: 170, top: 250 }}>
        <div style={{ width: 760, height: 400, boxSizing: "border-box", padding: "60px 54px", borderRadius: 22, background: "#141815", border: "1px solid #2A2F2B" }}>
          <Etiqueta>A EMPRESA</Etiqueta>
          <div style={{ ...TITULO, fontSize: 76, color: "white", marginTop: 16 }}>LOJA MODELO</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA, marginTop: 14 }}>materiais de construção</div>
        </div>
      </Surge>
      <Surge de={m("Marcos") - 4} style={{ left: 990, top: 250 }}>
        <div style={{ width: 760, height: 400, boxSizing: "border-box", padding: "60px 54px", borderRadius: 22, background: "#141815", border: `1px solid ${VERDE}` }}>
          <Etiqueta>O CLIENTE</Etiqueta>
          <div style={{ ...TITULO, fontSize: 76, color: "white", marginTop: 16 }}>MARCOS</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 32, color: CINZA, marginTop: 14 }}>reformando o banheiro</div>
        </div>
      </Surge>
    </>
  );
};

// ---------- capítulo 1
const CANAIS = [
  ["vários", "SITE", "formulário ou popup"],
  ["caminhos", "WHATSAPP", "API oficial ou WhatsApp comum"],
  ["plataforma", "INSTAGRAM", "Direct e comentários"],
] as const;
export const Cap11: React.FC<P> = ({ c }) => (
  <>
    {CANAIS.map(([p, t, n], i) => (
      <Surge key={p} de={marca(c.fala, p) - 4} style={{ left: 170 + i * 540, top: 300 }}>
        <div style={{ width: 500, height: 300, boxSizing: "border-box", padding: "70px 40px", borderRadius: 22, background: "#141815", border: "1px solid #2A2F2B", textAlign: "center" }}>
          <div style={{ ...TITULO, fontSize: 62, color: "white" }}>{t}</div>
          <div style={{ fontFamily, fontWeight: 600, fontSize: 28, color: CINZA, marginTop: 14 }}>{n}</div>
        </div>
      </Surge>
    ))}
  </>
);

export const Cap12: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const lead = m("lead") - 4;
  return (
    <Troca cortes={[lead]}>
      {[
        <AbsoluteFill key="a">
          <CenaCrm quadros={rota(CENTRO, [Foco(m("popup"), 1.12, 800, 420)], lead)}>
            <TelaSitePopup popup={k01(frame, m("formulário") - 4, m("formulário") + 8)} nome={digita("Marcos Oliveira", frame, m("popup"), 0.8)} whats={digita("(81) 90000-1234", frame, m("popup") + 20, 0.8)} />
          </CenaCrm>
        </AbsoluteFill>,
        <AbsoluteFill key="b">
          <CenaCrm quadros={rota(CENTRO, [Foco(lead + 6, 1.45, 500, 420)], c.dur)}>
            <TelaKanban marcos={{ ...MARCOS, dono: undefined, nota: undefined, canal: "Site: Popup", aceso: true }} entra={lead + 14} />
          </CenaCrm>
          <Tarja de={lead + 14}>O LEAD CAIU NO FUNIL</Tarja>
        </AbsoluteFill>,
      ]}
    </Troca>
  );
};

const CONVERSA_INSTA: Mensagem[] = [
  { tipo: "cliente", autor: "Patrícia Souza", texto: "Vocês entregam em Olinda?", hora: "02/07, 22:40" },
  { tipo: "enviada", autor: "Bot_lojamodelo", texto: "Entregamos sim, Patrícia! Me passa o seu CEP que eu confirmo o prazo.", hora: "02/07, 22:40" },
];
export const Cap13: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("WhatsApp"), 1.12, 800, 340)], c.dur)}>
        <TelaChat conversas={CONVERSAS_NOITE} aberta={1} telefone="@patricia.souza" topo mensagens={CONVERSA_INSTA} />
      </CenaCrm>
      <Tarja de={m("caixa") - 4} x={1250}>UMA CAIXA DE ENTRADA</Tarja>
    </>
  );
};

export const Cap14: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("conexão") - 4, 1.2, 900, 240)], c.dur)}>
        <TelaConexoes />
      </CenaCrm>
      <Surge de={m("Tech") - 6} style={{ left: 330, top: 772, zIndex: 40 }}>
        <div style={{ background: "#0B0B0C", border: `1px solid ${VERDE}`, borderRadius: 18, padding: "14px 34px" }}>
          <Img src={staticFile("midia/meta-tech-provider-fundo-escuro.webp")} style={{ height: 100 }} />
        </div>
      </Surge>
      <Surge de={m("verificado") - 4} style={{ left: 760, top: 778, zIndex: 40 }}>
        <Chip cheio cor={VERDE} style={{ fontSize: 26, padding: "8px 18px" }}>NÚMERO VERIFICADO</Chip>
      </Surge>
      <Surge de={m("templates") - 4} style={{ left: 760, top: 846, zIndex: 40 }}>
        <Chip cheio cor={VERDE} style={{ fontSize: 26, padding: "8px 18px" }}>TEMPLATES APROVADOS</Chip>
      </Surge>
    </>
  );
};

const Bolha: React.FC<{ readonly quem: string; readonly texto: string; readonly cor?: string }> = ({ quem, texto, cor = "#FFFFFF" }) => (
  <div style={{ width: 470, background: cor, borderRadius: 14, padding: "14px 20px", boxShadow: "0 14px 40px rgba(0,0,0,0.4)", fontFamily }}>
    <div style={{ fontSize: 19, fontWeight: 700, color: "#475467" }}>{quem}</div>
    <div style={{ fontSize: 25, fontWeight: 600, color: "#101828", lineHeight: 1.25 }}>{texto}</div>
  </div>
);
export const Cap15: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const modelos = m("Você") - 6;
  const seq = m("monta") - 4;
  return (
    <Troca cortes={[modelos, seq]}>
      {[
        <AbsoluteFill key="a">
          <CenaCrm quadros={rota(CENTRO, [Foco(m("Marcos"), 1.2, 700, 340)], modelos)}>
            <TelaIgAutomacoes />
          </CenaCrm>
          <Selo de={8} texto="INSTAGRAM" x={960} y={110} />
          <Surge de={m("comentou") - 4} style={{ left: 1320, top: 480, zIndex: 40 }}><Bolha quem="@marcos.oliveira comentou" texto="porcelanato" /></Surge>
          <Surge de={m("responde") - 4} style={{ left: 1320, top: 610, zIndex: 40 }}><Bolha quem="@lojamodelo respondeu" texto="Te chamei no Direct!" cor="#D1FAE5" /></Surge>
        </AbsoluteFill>,
        <AbsoluteFill key="b">
          <CenaCrm quadros={fixo(Foco(0, 1.12, 820, 400)) as never}>
            <TelaIgAutomacoes aba="modelos" />
          </CenaCrm>
          <Tarja de={m("mensagens") - 4} ate={seq - 10} x={1100} y={120}>RESPOSTAS, MENÇÕES E MENU DO PERFIL</Tarja>
        </AbsoluteFill>,
        <AbsoluteFill key="c">
          <CenaCrm quadros={rota(CENTRO, [Foco(seq + 8, 1.2, 800, 400)], c.dur)}>
            <TelaIgSequencia />
          </CenaCrm>
          <Tarja de={m("comentário", 1) - 4} y={110}>COMENTÁRIO VIRA CONVERSA DE VENDA</Tarja>
        </AbsoluteFill>,
      ]}
    </Troca>
  );
};

export const Cap16: React.FC<P> = ({ c }) => (
  <>
    <CenaCrm quadros={rota(CENTRO, [Foco(30, 1.08, 800, 450)], c.dur)}>
      <TelaChat conversas={CONVERSAS_NOITE} telefone="+5581900001234" topo mensagens={[{ tipo: "clienteAudio", autor: "Marcos Oliveira", duracao: "0:06", hora: "02/07, 23:07", progresso: 0 }]} />
    </CenaCrm>
    <Tarja de={marca(c.fala, "tela") - 4}>TUDO EM UMA TELA SÓ</Tarja>
  </>
);

// ---------- capítulo 3
const MANHA: Conversa[] = CONVERSAS_NOITE.map((x, i) => (i === 0 ? { ...x, tag: "aguardando_humano", previa: "Quero fechar. Consigo desconto?", tempo: "3m" } : x));
const PEDIDO: Mensagem = { tipo: "cliente", autor: "Marcos Oliveira", texto: "Quero fechar. Consigo desconto?", hora: "03/07, 08:12" };
export const Cap31: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const responde = m("responde");
  const assumiu = frame >= m("atribuição") - 4;
  const lista: Conversa[] = MANHA.map((x, i) => (i === 0 && assumiu ? { ...x, tag: "humano_atendendo", dono: "Rafael Lima" } : x));
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("primeira"), 1.2, 840, 240)], c.dur)}>
        <TelaChat
          conversas={lista}
          telefone="+5581900001234"
          topo
          atribuido={assumiu ? "Rafael Lima" : undefined}
          mensagens={[PEDIDO, { tipo: "sistema", texto: "Sistema de Automação adicionou aguardando_humano" }, { tipo: "enviada", autor: "Rafael Lima", texto: "Bom dia, Marcos! Aqui é o Rafael. Vou ver a melhor condição para você.", hora: "03/07, 08:15", de: responde }, { tipo: "sistema", texto: "Rafael Lima atribuiu a si mesmo essa conversa", de: m("atribuição") - 4 }]}
        />
      </CenaCrm>
      <Tarja de={m("atribuição") - 4} ate={m("limitar") - 12}>ATRIBUIÇÃO AUTOMÁTICA</Tarja>
      <Tarja de={m("limitar") - 2}>SÓ PARA COLABORADORES</Tarja>
    </>
  );
};

const DONO: Conversa[] = MANHA.map((x, i) => (i === 0 ? { ...x, tag: "humano_atendendo", dono: "Rafael Lima" } : x));
const CONVERSA_DIA: Mensagem[] = [PEDIDO, { tipo: "enviada", autor: "Rafael Lima", texto: "Bom dia, Marcos! Aqui é o Rafael. Vou ver a melhor condição para você.", hora: "03/07, 08:15" }];
export const Cap32: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const clique = m("dono");
  return (
    <>
      <CenaCrm
        quadros={rota(CENTRO, [Foco(m("carteirização"), 1.3, 1400, 430)], c.dur)}
        fora={<Cursor pontos={caminho([1200, 500], [[clique, ...J(1436, 547)]])} cliques={[clique]} />}
      >
        <TelaChat conversas={DONO} telefone="+5581900001234" topo atribuido="Rafael Lima" mensagens={CONVERSA_DIA} sobre={<PainelContato rolagem={interpolate(frame, [20, clique - 16], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} carteirizado={frame >= clique} />} />
      </CenaCrm>
      <Lista x={110} y={260} itens={[[m("permanente") - 4, "Permanente"], [m("temporária") - 4, "Temporária"], [m("redistribuída") - 4, "Redistribuída se o vendedor sair"]]} />
    </>
  );
};

export const Cap33: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const nota = m("Notas") - 4;
  const mencao = m("menção") - 4;
  const fase = frame >= mencao ? 2 : frame >= nota ? 1 : 0;
  const lista: Mensagem[] = [...CONVERSA_DIA, ...(frame >= mencao ? [{ tipo: "nota", autor: "Rafael Lima", texto: "Cliente pediu desconto, reforma do banheiro.", hora: "03/07, 08:17" } as Mensagem] : [])];
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("Frases"), 1.3, 1000, 620)], c.dur)}>
        <TelaChat
          conversas={DONO}
          telefone="+5581900001234"
          topo
          atribuido="Rafael Lima"
          mensagens={lista}
          compositor={fase === 0 ? { frases: frame >= m("Frases") - 4, acesoFrases: true, texto: "/" } : fase === 1 ? { nota: true, texto: digita("Cliente pediu desconto, reforma do banheiro.", frame, nota + 8, 1.4) } : { nota: true, texto: digita("@Camila Torres confere o frete para o Marcos?", frame, mencao + 4, 1.4) }}
        />
      </CenaCrm>
      <Tarja de={m("Frases") - 4} ate={nota - 8} x={1180} y={500}>FRASES RÁPIDAS</Tarja>
      <Tarja de={nota} ate={mencao - 8} x={1180} y={500}>NOTA PRIVADA</Tarja>
      <Tarja de={mencao} x={1180} y={500}>@MENÇÃO FIXA PARA O COLEGA ATÉ O VISTO</Tarja>
    </>
  );
};

export const Cap34: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const macros = m("sair") - 2;
  const modal = m("etapa") - 10;
  const estado = frame >= modal ? 2 : frame >= macros ? 1 : 0;
  return (
    <CenaCrm quadros={fixo(Foco(0, 1, 800, 450)) as never}>
      <TelaChat conversas={DONO} telefone="+5581900001234" topo atribuido="Rafael Lima" mensagens={CONVERSA_DIA} sobre={estado === 1 ? <MenuMacros /> : estado === 2 ? <ModalEtapas acesa={frame >= m("funil") - 6 ? "Em andamento" : undefined} /> : null} />
    </CenaCrm>
  );
};

// ---------- capítulo 4
export const Cap41: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const hist = m("histórico") - 8;
  const funis = m("Você") - 4;
  return (
    <Troca cortes={[hist, funis]}>
      {[
        <CenaCrm key="a" quadros={rota(CENTRO, [Foco(m("Kanban"), 1.55, 400, 470)], hist)}>
          <TelaKanban marcos={{ ...MARCOS, aceso: true }} />
        </CenaCrm>,
        <AbsoluteFill key="b">
          <CenaCrm quadros={fixo(Foco(0, 1.08, 800, 400)) as never}>
            <TelaCard aba="Histórico" ia={frame >= m("atualiza") - 4} />
          </CenaCrm>
          <Tarja de={m("IA") - 4} ate={m("atendente") - 10} y={836}>A IA ATUALIZA O CARD PELA CONVERSA</Tarja>
          <Tarja de={m("atendente") - 2} y={836}>NADA MANUAL PARA O ATENDENTE</Tarja>
        </AbsoluteFill>,
        <CenaCrm key="c" quadros={rota(CENTRO, [Foco(funis + 8, 1.3, 1100, 220)], c.dur)}>
          <TelaKanban marcos={MARCOS} funis />
        </CenaCrm>,
      ]}
    </Troca>
  );
};

export const Cap42: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("orçamento"), 1.5, 420, 560)], c.dur)}>
        <TelaOrcamentos />
      </CenaCrm>
      <Surge de={m("orçamento", 1) - 4} style={{ left: 980, top: 400, zIndex: 40 }}>
        <div style={{ background: "rgba(11,11,12,0.94)", border: "2px solid #FF6B6B", borderRadius: 16, padding: "26px 36px", ...TITULO, fontSize: 52, lineHeight: 1.1, color: "white" }}>
          O ORÇAMENTO QUE<br /><span style={{ color: "#FF8A80" }}>NINGUÉM COBROU</span>
        </div>
      </Surge>
    </>
  );
};

export const Cap43: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const tarefa = m("tarefa") - 6;
  return (
    <Troca cortes={[tarefa]}>
      {[
        <AbsoluteFill key="a">
          <CenaCrm quadros={rota(CENTRO, [Foco(m("cadência"), 1.2, 640, 560)], tarefa)}>
            <TelaOrcamentos coluna={frame >= m("cadência") ? 1 : 0} />
          </CenaCrm>
          <Selo de={m("módulo") - 4} texto="ORÇAMENTOS" x={960} y={50} />
          <Surge de={m("definidos") - 4} style={{ left: 1040, top: 380, zIndex: 40 }}>
            <Chip cheio cor={VERDE} style={{ fontSize: 26, padding: "8px 18px" }}>DEFINIDO COM VOCÊ NA IMPLANTAÇÃO</Chip>
          </Surge>
        </AbsoluteFill>,
        <AbsoluteFill key="b">
          <CenaCrm quadros={rota(CENTRO, [Foco(tarefa + 10, 1.5, 480, 620)], c.dur)}>
            <TelaTarefas acao />
          </CenaCrm>
          <Selo de={tarefa + 8} texto="TAREFAS DO VENDEDOR" x={1250} y={110} />
        </AbsoluteFill>,
      ]}
    </Troca>
  );
};

export const Cap44: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <CenaCrm quadros={fixo(Foco(0, 1.3, 620, 580)) as never}>
        <TelaTarefas acao />
      </CenaCrm>
      <Surge de={m("lembra") - 6} style={{ left: 1050, top: 290, zIndex: 40 }}>
        <div style={{ ...TITULO, fontSize: 54, color: "white", background: "rgba(11,11,12,0.92)", borderRadius: 14, padding: "14px 26px" }}>A ferramenta lembra.</div>
      </Surge>
      <Lista x={1050} y={420} itens={[[m("chama") - 4, "Chama o cliente"], [m("personalizado") - 4, "Atende de forma personalizada"], [m("fecha") - 4, "Fecha a venda"]]} />
    </>
  );
};

export const Cap45: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const modal = m("lembrete") - 6;
  return (
    <>
      <CenaCrm quadros={fixo(Foco(0, 1.08, 800, 440)) as never} fora={<Cursor pontos={caminho([900, 400], [[modal, ...J(1436, 735)]])} cliques={[modal]} />}>
        <TelaChat conversas={DONO} telefone="+5581900001234" topo atribuido="Rafael Lima" mensagens={CONVERSA_DIA} sobre={frame >= modal ? <ModalLembrete /> : <PainelContato acesoLembrete={frame > modal - 20} />} />
      </CenaCrm>
      <Surge de={m("notificação") - 4} style={{ left: 1180, top: 130, zIndex: 40 }}>
        <div style={{ width: 590, display: "flex", gap: 16, alignItems: "center", background: "#0B0B0C", border: `1px solid ${VERDE}`, borderRadius: 14, padding: "14px 20px", fontFamily, color: "white" }}>
          <div style={{ fontSize: 32 }}>🔔</div>
          <div><div style={{ fontWeight: 800, fontSize: 24 }}>Lembrete de sexta, 09:00</div><div style={{ fontWeight: 600, fontSize: 22, color: CINZA }}>Retornar para o Marcos</div></div>
        </div>
      </Surge>
    </>
  );
};

export const Cap46: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  const entra = k01(useCurrentFrame(), m("celular") - 10, m("celular") + 8);
  return (
    <>
      <CenaCrm quadros={fixo(Foco(0, 1, 800, 450)) as never}>
        <TelaKanban marcos={MARCOS} />
      </CenaCrm>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.72)", opacity: entra }} />
      <Moldura escala={0.98} estilo={{ left: 1040, top: 58 - (1 - entra) * -900, zIndex: 30 }}>
        <TelaNotificacoes de={[m("mensagem"), m("menção"), m("follow-up")]} />
      </Moldura>
      <Surge de={m("instala") - 4} style={{ left: 140, top: 390, zIndex: 40 }}>
        <div style={{ ...TITULO, fontSize: 70, lineHeight: 1.1, color: "white" }}>INSTALA NO CELULAR<br /><span style={textoDegrade}>COMO APLICATIVO</span></div>
      </Surge>
    </>
  );
};

// ---------- capítulo 5
const FINAL = { ...MARCOS, nota: undefined, valor: "R$ 6.840,00", aceso: true };
export const Cap51: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const a = m("comprou");
  const passo = 258;
  const anda = k01(frame, a, a + 28);
  const chegou = anda >= 1;
  return (
    <>
      <CenaCrm quadros={fixo(Foco(0, 1, 800, 450)) as never}>
        <TelaKanban marcos={FINAL} coluna={chegou ? 4 : 2} desloca={chegou ? 0 : anda * passo * 2} />
      </CenaCrm>
      <Surge de={m("Aqui") - 4} style={{ left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", zIndex: 40 }}>
        <div style={{ ...TITULO, fontSize: 92, color: "white", background: "rgba(11,11,12,0.95)", border: `1px solid ${VERDE}`, borderRadius: 18, padding: "24px 52px" }}>AQUI, ELA <span style={textoDegrade}>CONTINUA</span></div>
      </Surge>
    </>
  );
};

const CLASSES = ["novo", "ativo", "recorrente", "VIP", "risco", "inativo"];
export const Cap52: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const corte = m("classifica") - 6;
  let aceso: number | undefined;
  CLASSES.forEach((p, i) => {
    if (frame >= m(p) - 4) aceso = i + 1;
  });
  const dica = frame >= m("Critérios") - 2 ? "Em risco" : undefined;
  return (
    <Troca cortes={[corte]}>
      {[
        <AbsoluteFill key="a">
          <Surge de={m("ERP") - 4} style={{ left: 240, top: 360 }}>
            <div style={{ width: 380, height: 280, borderRadius: 22, background: "#141815", border: "1px solid #2A2F2B", display: "flex", alignItems: "center", justifyContent: "center", ...TITULO, fontSize: 88, color: "white" }}>ERP</div>
          </Surge>
          <Lista x={740} y={356} itens={[[m("clientes") - 4, "Clientes"], [m("pedidos") - 4, "Pedidos"], [m("produtos") - 4, "Produtos"]]} />
          <Surge de={m("Simplí") - 4} style={{ left: 1120, top: 360 }}>
            <div style={{ width: 540, height: 280, borderRadius: 22, background: "#141815", border: `1px solid ${VERDE}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 430 }} /></div>
          </Surge>
          <Surge de={m("digitação") - 10} style={{ left: 0, right: 0, top: 240, textAlign: "center" }}>
            <div style={{ fontFamily, fontWeight: 700, fontSize: 40, color: CINZA }}>sem digitação dupla</div>
          </Surge>
        </AbsoluteFill>,
        <CenaCrm key="b" quadros={rota(CENTRO, [Foco(corte + 10, 1.25, 900, 240)], c.dur)}>
          <TelaCrmClientes aceso={aceso} dica={dica} />
        </CenaCrm>,
      ]}
    </Troca>
  );
};

export const Cap53: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const sobe = interpolate(frame, [m("histórico") - 8, m("histórico") + 10], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("linha"), 1.4, 800, 470), Foco(m("histórico"), 1.4, 800, 640)], c.dur)}>
        <TelaCrmClientes sobre={<ModalCliente rolagem={sobe} />} />
      </CenaCrm>
      <Tarja de={m("dez") - 4} y={110}>EM DEZ SEGUNDOS, QUEM ESTÁ DO OUTRO LADO</Tarja>
    </>
  );
};

export const Cap54: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("fase"), 1.3, 620, 440), Foco(m("janela"), 1.35, 1100, 420)], c.dur)}>
        <TelaObra acesaFase={frame >= m("fase") ? "Revestimentos" : undefined} />
      </CenaCrm>
      <Selo de={m("Ciclo") - 4} texto="CICLO DE VIDA DA OBRA" x={1000} y={110} />
    </>
  );
};

// ---------- capítulo 6
export const Cap61: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const muda = frame >= m("classificação");
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("Marcos"), 1.45, 640, 600)], c.dur)}>
        <TelaCrmClientes classeMarcos={muda ? "Em Risco" : "Ativo"} aceso={muda ? 5 : undefined} />
      </CenaCrm>
      <Tarja de={m("risco") - 4}>MARCOS AGORA ESTÁ EM RISCO</Tarja>
    </>
  );
};

export const Cap62: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <CenaCrm quadros={fixo(Foco(0, 1.35, 300, 420)) as never}>
        <TelaSegmentacao />
      </CenaCrm>
      <div style={{ position: "absolute", left: 640, top: 90, right: 0, bottom: 0, background: "linear-gradient(90deg, transparent, rgba(11,11,12,0.95) 16%)" }} />
      <Surge de={m("Relacionamento") - 6} style={{ left: 860, top: 130, zIndex: 40 }}>
        <Etiqueta>NOVIDADE</Etiqueta>
        <div style={{ ...TITULO, fontSize: 76, color: "white", marginTop: 8 }}>RELACIONAMENTO</div>
      </Surge>
      <Lista x={860} y={290} itens={[[m("e-mail") - 4, "E-mail marketing"], [m("SMS") - 4, "SMS"], [m("grupos") - 4, "Grupos de WhatsApp"]]} />
    </>
  );
};

const CONTAGENS = ["8.420", "5.214", "3.962", "2.308", "612", "536"];
export const Cap63: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const passos = [m("tag"), m("DDD"), m("data"), m("classificação"), m("recebeu")];
  const n = passos.filter((p) => frame >= p - 3).length;
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("filtra"), 1.25, 800, 450)], c.dur)}>
        <TelaSegmentacao filtros={n} contagem={CONTAGENS[n]} dinamico={frame >= m("dinâmico")} />
      </CenaCrm>
      <Selo de={m("Segmentação") - 4} texto="SEGMENTAÇÃO DE BASE" x={960} y={110} />
      <Lista x={1370} y={300} itens={[[m("WhatsApp") - 4, "WhatsApp"], [m("e-mail") - 4, "E-mail"], [m("SMS") - 4, "SMS"]]} />
    </>
  );
};

export const Cap64: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const flows = m("flows") - 6;
  const nos = 1 + Math.floor(interpolate(frame, [flows + 6, c.dur - 30], [0, 5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <Troca cortes={[flows]}>
      {[
        <AbsoluteFill key="a">
          <CenaCrm quadros={rota(CENTRO, [Foco(m("métricas"), 1.25, 1000, 380)], flows)}>
            <TelaHistorico />
          </CenaCrm>
          <Selo de={m("WhatsApp") - 4} texto="CAMPANHAS DE WHATSAPP" x={960} y={110} />
        </AbsoluteFill>,
        <CenaCrm key="b" quadros={fixo(Foco(0, 1.08, 860, 520)) as never}>
          <TelaFlow nos={nos} />
        </CenaCrm>,
      ]}
    </Troca>
  );
};

export const Cap65: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const dom = m("autentica") - 6;
  const rel = m("relatório") - 6;
  return (
    <Troca cortes={[dom, rel]}>
      {[
        <AbsoluteFill key="a">
          <CenaCrm quadros={rota(CENTRO, [Foco(m("editor"), 1.15, 860, 520)], dom)}>
            <TelaEmailEditor blocos={Math.floor(interpolate(frame, [m("editor") - 4, dom - 10], [1, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))} />
          </CenaCrm>
          <Etiquetado de={m("marketing")} texto="E-MAIL MARKETING" />
        </AbsoluteFill>,
        <CenaCrm key="b" quadros={rota(CENTRO, [Foco(dom + 8, 1.3, 860, 490)], rel)}>
          <TelaEmailDominio />
        </CenaCrm>,
        <AbsoluteFill key="c">
          <CenaCrm quadros={rota(CENTRO, [Foco(rel + 8, 1.15, 800, 400)], c.dur)}>
            <TelaEmailRelatorio />
          </CenaCrm>
          <Tarja de={m("robô") - 4} y={110}>CLIQUE DE GENTE × CLIQUE DE ROBÔ</Tarja>
        </AbsoluteFill>,
      ]}
    </Troca>
  );
};
const Etiquetado: React.FC<{ readonly de: number; readonly texto: string }> = ({ de, texto }) => (
  <Surge de={de} style={{ left: 760, top: 110, zIndex: 40 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#0B0B0C", border: `1px solid ${VERDE}`, borderRadius: 10, padding: "9px 20px" }}>
      <Etiqueta>NOVIDADE</Etiqueta>
      <div style={{ ...TITULO, fontSize: 28, color: "white" }}>{texto}</div>
    </div>
  </Surge>
);

export const Cap66: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("grupos"), 1.15, 860, 420)], c.dur)}>
        <TelaGrupos />
      </CenaCrm>
      <Etiquetado de={m("gestão")} texto="GRUPOS DE WHATSAPP" />
      <Lista x={1180} y={300} itens={[[m("massa") - 4, "Grupos em massa"], [m("link") - 4, "Um link só, com rotação"], [m("disparos") - 4, "Disparos agendados"], [m("moderação") - 4, "Moderação por IA"], [m("contato") - 4, "Entrou, vira contato"]]} />
    </>
  );
};

export const Cap67: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const painel = m("acompanha") - 6;
  return (
    <>
      <CenaCrm quadros={fixo(Foco(0, 1.04, 800, 450)) as never}>
        <TelaSms agendar={frame >= m("agenda")} rolagem={interpolate(frame, [m("públicos") - 14, m("públicos") + 6], [0, 440], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </CenaCrm>
      {frame >= painel ? <AbsoluteFill><CenaCrm quadros={fixo(Foco(0, 1, 800, 450)) as never}><TelaSmsPainel /></CenaCrm></AbsoluteFill> : null}
      <Etiquetado de={m("SMS")} texto="SMS" />
      <Tarja de={m("SAIR") - 4} ate={m("Nada") - 10} y={110}>QUEM RESPONDE SAIR É DESCADASTRADO</Tarja>
      <Tarja de={m("Nada") - 2} y={110}>NADA SAI ENTRE 22H E 7H</Tarja>
    </>
  );
};

export const Cap68: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const inst = m("instala") - 4;
  const reg = m("regras") - 10;
  const det = m("detecta") - 10;
  const lead = m("lead") - 4;
  const regra = frame >= m("sair") - 3 ? 2 : frame >= m("rola") - 3 ? 1 : 0;
  return (
    <Troca cortes={[inst, reg, det, lead]}>
      {[
        <AbsoluteFill key="a">
          <CenaCrm quadros={fixo(Foco(0, 1, 800, 450)) as never}><TelaSitePopup popup={k01(frame, 30, 46)} /></CenaCrm>
          <Etiquetado de={m("Prospecção")} texto="PROSPECÇÃO" />
        </AbsoluteFill>,
        <CenaCrm key="b" quadros={rota(CENTRO, [Foco(inst + 8, 1.3, 860, 420)], reg)}><TelaSites /></CenaCrm>,
        <CenaCrm key="c" quadros={fixo(Foco(0, 1.2, 800, 340)) as never}><TelaPopups regra={regra} /></CenaCrm>,
        <AbsoluteFill key="d">
          <CenaCrm quadros={rota(CENTRO, [Foco(det + 8, 1.2, 860, 470)], lead)}><TelaFormularios /></CenaCrm>
          <Tarja de={m("funil") - 4} y={110}>CADA FORMULÁRIO NO FUNIL CERTO</Tarja>
        </AbsoluteFill>,
        <AbsoluteFill key="e">
          <CenaCrm quadros={rota(CENTRO, [Foco(lead + 8, 1.45, 500, 420)], c.dur)}>
            <TelaKanban marcos={{ nome: "Luiza Ramos", id: "2240", fone: "+558190000917", canal: "Site: Popup", aceso: true }} entra={lead + 12} />
          </CenaCrm>
          <Tarja de={m("WhatsApp") - 4} x={1250} y={210}>O BOTÃO PODE ABRIR O WHATSAPP</Tarja>
        </AbsoluteFill>,
      ]}
    </Troca>
  );
};

export const Cap86: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const conta = k01(frame, m("compraram") - 6, m("financeiro"));
  const valor = Math.round(61420 * conta).toLocaleString("pt-BR");
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("cruza"), 1.1, 800, 300)], c.dur)}>
        <TelaEventoCampanha compraram={String(Math.round(48 * conta))} valor={`R$ ${valor},00`} />
      </CenaCrm>
      <Tarja de={m("atrelar") - 4} ate={m("pergunta") - 12}>CAMPANHAS ATRELADAS AO EVENTO</Tarja>
      <Tarja de={m("pergunta") - 2} ate={m("cruza") - 8}>A CAMPANHA VENDEU?</Tarja>
      <Tarja de={m("financeiro") - 4}>RETORNO FINANCEIRO DA CAMPANHA</Tarja>
    </>
  );
};

// ---------- capítulo 7
export const Cap71: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("física") - 8} style={{ left: 180, top: 200 }}>
        <Etiqueta>QUEM FICA DE FORA DO CRM</Etiqueta>
        <div style={{ ...TITULO, fontSize: 100, lineHeight: 1.05, color: "white", marginTop: 12 }}>O VENDEDOR DA</div>
        <div style={{ ...TITULO, fontSize: 100, lineHeight: 1.1, ...textoDegrade }}>LOJA FÍSICA</div>
      </Surge>
      <Lista x={180} y={540} itens={[[m("balcão") - 4, "No balcão, longe do computador"], [m("parado") - 4, "Cliente parado na carteira"]]} />
    </>
  );
};

export const Cap73: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const base = frame >= m("planilha") - 3 ? "Planilha" : frame >= m("Ciclo") - 3 ? "Ciclo da Obra" : "Classificação do CRM";
  const voltou = frame >= m("quantos") - 8;
  return (
    <>
      <CenaCrm quadros={fixo(Foco(0, 1.12, 798, 400)) as never}>
        <TelaNovaTarefa base={voltou ? "Classificação do CRM" : base} classe={voltou || frame >= m("classificação")} quantidade={frame >= m("quantos") ? "50" : "20"} />
      </CenaCrm>
      <Tarja de={m("distribui") - 4} x={760} y={872}>PRIMEIRO O DONO DA CARTEIRA, DEPOIS A EQUIPE</Tarja>
      <Tarja de={m("Gestão") - 4} x={1690} y={130}>GESTÃO DE TAREFAS</Tarja>
    </>
  );
};

export const Cap75: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <CenaCelular tela={<TelaVendedor rodada={2} retornos abordagens={3} />}>
      <Surge de={m("régua") - 4} style={{ left: 880, top: 280 }}>
        <div style={{ ...TITULO, fontSize: 72, lineHeight: 1.08, color: "white" }}>RÉGUA DE</div>
        <div style={{ ...TITULO, fontSize: 72, lineHeight: 1.08, ...textoDegrade }}>FOLLOW-UP</div>
      </Surge>
      <Lista x={880} y={480} itens={[[m("retornos") - 4, "Retornos voltam sozinhos"], [m("novos") - 4, "Junto com os clientes novos"]]} />
    </CenaCelular>
  );
};

export const Cap76: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const gestor = m("gestor") - 6;
  return (
    <Troca cortes={[gestor]}>
      {[
        <AbsoluteFill key="a">
          <CenaCrm quadros={fixo(Foco(0, 1, 800, 450)) as never}><TelaTarefaDetalhe /></CenaCrm>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
          <Surge de={m("Marcos") - 4} style={{ left: 300, top: 250, zIndex: 40 }}>
            <div style={{ width: 1320, background: "#0B0B0C", border: `1px solid ${VERDE}`, borderRadius: 18, padding: "34px 48px", fontFamily, color: "white" }}>
              <Etiqueta>O MARCOS VOLTOU</Etiqueta>
              <div style={{ ...TITULO, fontSize: 66, marginTop: 10 }}>Louças e metais do banheiro</div>
              <div style={{ display: "flex", gap: 60, marginTop: 20 }}>
                <div><div style={{ fontSize: 26, color: CINZA, fontWeight: 600 }}>Venda no ERP</div><div style={{ ...TITULO, fontSize: 50, ...textoDegrade }}>R$ 4.280,00</div></div>
                <div><div style={{ fontSize: 26, color: CINZA, fontWeight: 600 }}>Na conta de</div><div style={{ ...TITULO, fontSize: 50 }}>Rafael Lima</div></div>
              </div>
            </div>
          </Surge>
        </AbsoluteFill>,
        <CenaCrm key="b" quadros={fixo([0, ...CENTRO]) as never}>
          <TelaTarefaDetalhe tabela acesa="Rafael Lima" />
        </CenaCrm>,
      ]}
    </Troca>
  );
};

export const Cap77: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <CenaCelular tela={<TelaVendedor digital />}>
      <Surge de={m("digital") - 6} style={{ left: 880, top: 300 }}>
        <div style={{ ...TITULO, fontSize: 76, lineHeight: 1.08, color: "white" }}>TIME DIGITAL</div>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 38, color: CINZA, marginTop: 12 }}>mesma lista</div>
      </Surge>
      <Lista x={880} y={500} itens={[[m("botão") - 4, "Botão abre o Simplí Chat"]]} />
    </CenaCelular>
  );
};

// ---------- capítulo 8
export const Cap81: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const rel = m("Relatórios") - 6;
  const visao = frame >= m("física") - 3 ? "Loja física" : frame >= m("digital") - 3 ? "Digital" : "Geral";
  return (
    <Troca cortes={[rel]}>
      {[
        <CenaCrm key="a" quadros={rota(CENTRO, [Foco(m("canal"), 1.08, 860, 440)], rel)}>
          <TelaDashboard rolagem={interpolate(frame, [m("painéis") - 12, m("painéis") + 6, m("quantas") - 12, m("quantas") + 6, m("lista") - 12, m("lista") + 6], [0, 390, 390, 800, 800, 920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        </CenaCrm>,
        <AbsoluteFill key="b">
          <CenaCrm quadros={rota(CENTRO, [Foco(rel + 8, 1.15, 850, 330)], c.dur)}>
            <TelaRelatorios visao={visao} />
          </CenaCrm>
          <Tarja de={m("equipe") - 4} y={110}>CADA GESTOR VÊ A PRÓPRIA EQUIPE</Tarja>
        </AbsoluteFill>,
      ]}
    </Troca>
  );
};

export const Cap82: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("seguidores"), 1.2, 860, 300), Foco(m("melhores"), 1.2, 860, 620)], c.dur)}>
        <TelaIgPainel />
      </CenaCrm>
      <Selo de={m("Painel") - 4} texto="PAINEL DO INSTAGRAM" x={1340} y={110} />
    </>
  );
};

export const Cap83: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const z = interpolate(frame, [0, c.dur], [1, 1.05]);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 160, top: 96, width: 1280, height: 730, transform: `scale(${z})`, transformOrigin: "50% 50%" }}>
        <div style={{ width: 1280, height: 720, background: "#050505", borderRadius: 14, border: "12px solid #1A1A1A", boxSizing: "content-box", boxShadow: "0 30px 80px rgba(0,0,0,0.7)", overflow: "hidden", marginLeft: -12 }}>
          <div style={{ transform: `scale(${1280 / 1600})`, transformOrigin: "0 0" }}><TelaGestaoVista /></div>
        </div>
      </div>
      <Selo de={m("Gestão") - 4} texto="GESTÃO À VISTA" x={800} y={40} />
      <Lista x={1270} y={240} itens={[[m("aguardando") - 4, "Aguardando humano"], [m("tempo") - 4, "Há quanto tempo"], [m("esquecido") - 4, "Visível para todo mundo"]]} />
    </AbsoluteFill>
  );
};

export const Cap84: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const csat = m("pesquisa") - 6;
  return (
    <>
      <CenaCrm quadros={rota(CENTRO, [Foco(m("classifica"), 1.1, 860, 400)], c.dur)}>
        <TelaSentimentos />
      </CenaCrm>
      {frame >= csat ? <AbsoluteFill><CenaCrm quadros={fixo(Foco(0, 1.04, 800, 450)) as never}><TelaDashboard rolagem={490} /></CenaCrm><Tarja de={csat + 4} x={1000} y={190}>PESQUISA DE SATISFAÇÃO</Tarja></AbsoluteFill> : null}
      <Selo de={m("Análise") - 4} texto="ANÁLISE DE SENTIMENTOS" x={1000} y={110} />
    </>
  );
};

export const Cap85: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const detalhe = frame >= m("rankeia") - 6 && frame < m("compara") - 6;
  return (
    <>
      <CenaCrm quadros={fixo(Foco(0, 1.04, 800, 450)) as never}>
        <TelaEvento aba={detalhe ? "Detalhamento" : "Resumo"} rolagem={interpolate(frame, [m("compara") - 8, m("compara") + 10], [0, 260], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </CenaCrm>
      <Selo de={m("Eventos") - 4} texto="EVENTOS" x={200} y={250} />
      <Tarja de={m("tag") - 4} x={1640} y={520}>COMPRADORES COM TAG</Tarja>
    </>
  );
};

// ---------- capítulo 9
export const Cap91: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("novidade") - 4} style={{ left: 170, top: 150 }}>
        <Etiqueta>NOVIDADE</Etiqueta>
        <div style={{ ...TITULO, fontSize: 80, lineHeight: 1.06, color: "white", marginTop: 12 }}>AGENTES DE IA</div>
        <div style={{ ...TITULO, fontSize: 80, lineHeight: 1.1, ...textoDegrade }}>DENTRO DO CRM</div>
      </Surge>
      <Surge de={m("MCP") - 6} style={{ left: 170, top: 390 }}>
        <div style={{ width: 800, background: "#141815", border: "1px solid #2A2F2B", borderRadius: 16, padding: "22px 30px", fontFamily, color: "white" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: CINZA, marginBottom: 7 }}>Pedido ao agente</div>
          <div style={{ fontSize: 34, fontWeight: 600, lineHeight: 1.28 }}>“Crie um card para a Construtora Horizonte e prepare a campanha de reativação.”</div>
        </div>
      </Surge>
      <Lista x={1100} y={250} itens={[[m("card") - 4, "Criar card"], [m("etapa") - 4, "Mover de etapa"], [m("tag") - 4, "Colocar tag"], [m("campanha") - 4, "Preparar campanha"]]} />
    </>
  );
};

export const Cap92: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const apr = m("Quando") - 6;
  return (
    <Troca cortes={[apr]}>
      {[
        <AbsoluteFill key="a">
          <CenaCrm quadros={rota(CENTRO, [Foco(m("família"), 1.3, 850, 560)], apr)}>
            <TelaMcp mudou={frame >= m("aval")} />
          </CenaCrm>
          <Selo de={m("família") - 4} texto="CADA FAMÍLIA DE AÇÃO" x={1000} y={110} />
        </AbsoluteFill>,
        <AbsoluteFill key="b">
          <CenaCrm quadros={rota(CENTRO, [Foco(apr + 8, 1.2, 860, 300)], c.dur)} fora={<Cursor pontos={caminho([900, 620], [[m("aprovar"), ...J(1290, 270)]])} cliques={[m("aprovar")]} />}>
            <TelaAprovacoes estado={frame >= m("aprovar") + 6 ? "aprovada" : "pendente"} />
          </CenaCrm>
          <Selo de={apr + 8} texto="APROVAÇÕES" x={1000} y={110} />
        </AbsoluteFill>,
      ]}
    </Troca>
  );
};

export const Cap93: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("IA") - 4} style={{ left: 0, right: 0, top: 300, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 96, color: "white" }}>A IA ADIANTA O TRABALHO</div>
      </Surge>
      <Surge de={m("decisão") - 4} style={{ left: 0, right: 0, top: 440, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 96, ...textoDegrade }}>A DECISÃO É DA SUA EQUIPE</div>
      </Surge>
    </>
  );
};

// ---------- capítulo 10
export const Cap101: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("serviço") - 6} style={{ left: 180, top: 300 }}>
        <div style={{ ...TITULO, fontSize: 120, lineHeight: 1.05, color: "white" }}>EMPRESAS</div>
        <div style={{ ...TITULO, fontSize: 120, lineHeight: 1.08, ...textoDegrade }}>DE SERVIÇO</div>
      </Surge>
      <Lista x={1100} y={340} itens={[[m("agência") - 4, "Agências"], [m("consultoria") - 4, "Consultorias"]]} />
    </>
  );
};

export const Cap102: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  const proj = m("Projetos") - 6;
  const pub = m("página") - 6;
  const fin = m("Financeiro") - 6;
  const ges = m("Gestão") - 6;
  return (
    <Troca cortes={[proj, pub, fin, ges]}>
      {[
        <CenaCrm key="a" quadros={rota(CENTRO, [Foco(30, 1.15, 860, 330)], proj)}><TelaContratos /></CenaCrm>,
        <CenaCrm key="b" quadros={rota(CENTRO, [Foco(proj + 10, 1.12, 860, 440)], pub)}><TelaProjeto /></CenaCrm>,
        <CenaCrm key="c" quadros={fixo(Foco(0, 1.04, 800, 450)) as never}><TelaPaginaPublica /></CenaCrm>,
        <CenaCrm key="d" quadros={rota(CENTRO, [Foco(fin + 10, 1.15, 860, 300)], ges)}><TelaFinanceiro /></CenaCrm>,
        <CenaCrm key="e" quadros={rota(CENTRO, [Foco(ges + 10, 1.1, 860, 420)], c.dur)}><TelaGestao /></CenaCrm>,
      ]}
    </Troca>
  );
};

// ---------- fechamento
export const Fim1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string) => marca(c.fala, p);
  const passos = [m("Marcos"), m("atendido"), m("assumiu"), m("orçamento"), m("venda"), m("esfriou"), m("voltou")];
  const n = passos.filter((p) => frame >= p - 3).length;
  return (
    <>
      <Surge de={8} style={{ left: 0, right: 0, top: 190, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 76, color: "white" }}>A JORNADA DO <span style={textoDegrade}>MARCOS</span></div>
      </Surge>
      <Surge de={m("Marcos") - 6} style={{ left: 0, right: 0, top: 420, display: "flex", justifyContent: "center" }}>
        <Trilha etapa={n} grande />
      </Surge>
    </>
  );
};

export const Fim2: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const itens: [number, string][] = [
    [m("plataforma"), "Uma plataforma só, do contato à recompra"],
    [m("Meta"), "WhatsApp e Instagram direto com a Meta"],
    [m("IA"), "IA com os dados da empresa e pessoas no controle"],
    [m("ligado"), "CRM ligado ao faturamento real"],
    [m("Relacionamento"), "Relacionamento: WhatsApp, e-mail, SMS e grupos"],
    [m("Captação"), "Captação de leads no seu site"],
    [m("app"), "App para o vendedor da loja"],
    [m("módulos"), "Módulos que você liga conforme a operação"],
  ];
  return (
    <>
      <Surge de={8} style={{ left: 130, top: 60 }}><Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 420 }} /></Surge>
      <Lista x={130} y={190} itens={itens.map(([f, t]) => [f - 4, t] as const)} />
      <Surge de={m("Tech") - 4} style={{ left: 1290, top: 120 }}>
        <Img src={staticFile("midia/meta-tech-provider-fundo-escuro.webp")} style={{ height: 120 }} />
      </Surge>
      <Surge de={m("app") - 6} style={{ left: 1340, top: 270, width: 210, height: 440 }}>
        <Moldura escala={0.5} estilo={{ left: 0, top: 0 }}><TelaVendedor /></Moldura>
      </Surge>
    </>
  );
};

export const Fim3: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={m("mensalidade") - 4} style={{ left: 0, right: 0, top: 280, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 130, ...textoDegrade }}>MENSALIDADE FIXA</div>
      </Surge>
      <Surge de={m("templates") - 4} style={{ left: 0, right: 0, top: 480, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 42, color: "white" }}>Templates da Meta na conta da sua empresa</div>
      </Surge>
      <Surge de={m("SMS") - 4} style={{ left: 0, right: 0, top: 560, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 42, color: CINZA }}>SMS à parte, com valor sob consulta</div>
      </Surge>
    </>
  );
};

export const Fim4: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <FotoAna arquivo="ana-verde.jpg" x={120} dur={c.dur} />
      <Surge de={m("link") - 6} style={{ left: 940, top: 230 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 36, color: CINZA, marginBottom: 10 }}>Fale com o nosso time</div>
        <div style={{ ...TITULO, fontSize: 58, color: "white" }}>LINK NA DESCRIÇÃO</div>
      </Surge>
      <Surge de={m("WhatsApp") - 6} style={{ left: 940, top: 460 }}>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 36, color: CINZA, marginBottom: 10 }}>Ou me chama no WhatsApp</div>
        <div style={{ ...TITULO, fontSize: 80, ...textoDegrade }}>(81) 97506-2426</div>
      </Surge>
    </>
  );
};

export const Fim5: React.FC<P> = ({ c }) => {
  const m = (p: string) => marca(c.fala, p);
  return (
    <>
      <Surge de={6} style={{ left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("midia/logo-simpli-crm-escuro.png")} style={{ width: 760 }} />
      </Surge>
      <Surge de={m("inscreva") - 6} style={{ left: 0, right: 0, top: 500, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 68, color: "white" }}>SE INSCREVA NO CANAL</div>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 38, color: CINZA, marginTop: 14 }}>YouTube @simplidigital · Instagram @simpli.inovacao</div>
      </Surge>
    </>
  );
};

export { JanelaCrm, TelaCrm, LARGURA_CRM };
