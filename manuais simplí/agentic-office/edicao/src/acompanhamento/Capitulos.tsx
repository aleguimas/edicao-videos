import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { type Cena, marca } from "../ana/voz";
import { COR, Cursor, Digitando, ITEM_MENU, Icone, caminho, rota } from "../agentic/App";
import { Avatar, CenaJanela, MENU_INICIO, MENU_ORGANIZACAO, rampa } from "../apresentacao/comum";
import { CINZA, FUNDO, fontFamily, fonteApp, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Surge } from "../verbas/Montagem";
import { CENTRO, Tela } from "./Cenas";
import { ATA, DEMANDA, INDICADORES_ANDAMENTO, LINHA_MANUAL, LINHAS_ANDAMENTO, LINHAS_INICIO, PROPOSTAS } from "./dados";
import { CaixaEmail, EmailResponsavel, MiniDiario, MiniResumo, MiniRetorno } from "./Emails";
import { BOTAO_DOCUMENTO, noCartao, PaginaDemanda, Revisao, topoProposta } from "./Telas";
import {
  COLUNA_COBRANCA,
  MenuDemanda,
  ModalAtivar,
  ModalExcluir,
  ModalNovaAcao,
  ModalNovaDemanda,
  ModalNovaPessoa,
  type Numeros,
  PaginaAtiva,
  PaginaConfig,
  PaginaIntegracoes,
  PaginaLista,
  PaginaPessoas,
  PaginaSetores,
  PainelAcao,
  PainelGeral,
  QuadroAprovar,
  TOPO_ACOES,
  TOPO_AJUSTE,
  TOPO_CALENDARIO,
  TOPO_PESSOAS,
  TOPO_REMETENTE,
} from "./TelasModulo";

const uso = (c: Cena) => (p: string, n = 0) => marca(c.fala, p, n);
const entre = (frame: number, de: number, ate: number) => frame >= de && frame < ate;
const rola = (frame: number, de: number, dur: number, a: number, b: number) => interpolate(frame, [de, de + dur], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const COMECO: Numeros = { acoes: "4", concluidas: "0%", notaConcluidas: "0 de 4", noPrazo: "—", atrasadas: "0", notaAtrasadas: "nenhuma", reagendadas: "0", aguardando: "1" };
const ANDAMENTO: Numeros = { acoes: "5", concluidas: "40%", notaConcluidas: "2 de 5", noPrazo: "66,7%", atrasadas: "1", notaAtrasadas: "7 dias úteis em média", reagendadas: "1", aguardando: "0" };
const ENCERRADA: Numeros = { acoes: "5", concluidas: "60%", notaConcluidas: "2 não cumpridas", noPrazo: "40%", atrasadas: "0", notaAtrasadas: "nenhuma", reagendadas: "1", aguardando: "0" };
const REVISADA = { responsaveis: { 3: "Equipe Obras" }, extras: { 1: "Sérgio Nunes" }, pedidos: [2], desmarcadas: [4] };

const TituloCena: React.FC<{ readonly de: number; readonly ate?: number; readonly branco: string; readonly verde: string; readonly top?: number; readonly tam?: number }> = ({ de, ate, branco, verde, top = 110, tam = 66 }) => (
  <Surge de={de} ate={ate} style={{ left: 0, right: 0, top, textAlign: "center" }}>
    <div style={{ ...TITULO, fontSize: tam, color: "white" }}>
      {branco} <span style={textoDegrade}>{verde}</span>
    </div>
  </Surge>
);

// ---------- Abertura: fora da plataforma + abas
export const SemAcesso: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = uso(c);
  return (
    <>
      <Surge de={m("responsável") - 4} style={{ left: 170, top: 330, width: 460, textAlign: "center" }}>
        <div style={{ display: "grid", placeItems: "center" }}>
          <Avatar nome="Rafael" cor={VERDE} foto="pessoas/p92.webp" tam={200} />
        </div>
        <div style={{ ...TITULO, fontSize: 44, color: "white", marginTop: 18 }}>Rafael Lima</div>
        <div style={{ fontFamily, fontWeight: 600, fontSize: 28, color: CINZA }}>Compras</div>
        <div style={{ display: "inline-block", marginTop: 16, fontFamily: fonteMono, fontWeight: 700, fontSize: 24, color: VERDE, border: `2px solid ${VERDE}`, borderRadius: 8, padding: "6px 14px" }}>SEM ACESSO À PLATAFORMA</div>
      </Surge>
      <Surge de={m("tudo") - 4} style={{ left: 700, top: 300, width: 1020 }}>
        <EmailResponsavel tam={24} acesos={useCurrentFrame() >= m("botões") - 4 ? ["botoes"] : []} />
      </Surge>
      <TituloCena de={m("melhor") - 4} branco="TUDO CHEGA" verde="POR E-MAIL" />
    </>
  );
};

export const AbasCena: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const item = ITEM_MENU("Acompanhamento", MENU_INICIO);
  const marcas: [string, number][] = [
    ["Demandas", m("Demandas")],
    ["Painel geral", m("Painel")],
    ["Pessoas e áreas", m("Pessoas")],
    ["Configurações", m("Configurações")],
  ];
  const acesa = frame < m("mostrar") - 8 ? [...marcas].reverse().find(([, f]) => frame >= f - 4)?.[0] : undefined;
  const loja = m("inauguração");
  return (
    <Tela quadros={rota(CENTRO, [[m("quatro"), 1.32, 780, 330], [m("mostrar"), 1, 820, 480], [loja, 1.35, 700, 470]], c.dur)} fora={<Cursor pontos={caminho([700, 640], [[m("Acompanhamento"), item.x, item.y], [loja, 650, 470]])} cliques={[m("Acompanhamento")]} />}>
      <PaginaLista acesa={acesa} lojaAceso={frame >= loja - 2} />
    </Tela>
  );
};

// ---------- Capítulo 1: criar uma demanda
const OBJETIVO = "Abrir a Loja Sul com estoque, equipe e campanha prontos.";
const FormularioCompleto = { titulo: DEMANDA.titulo, objetivo: OBJETIVO, setor: DEMANDA.setor, prazo: DEMANDA.prazo };

export const Nova: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const abre = m("Nova") + 4;
  const titulo = m("título");
  const objetivo = m("objetivo");
  const setor = m("setor");
  const prazo = m("prazo");
  const dono = m("dono");
  return (
    <Tela quadros={rota(CENTRO, [[abre, 1.12, 970, 470]], c.dur)} fora={<Cursor pontos={caminho([900, 640], [[abre, 1500, 294]])} cliques={[abre]} />}>
      <PaginaLista novaAcesa={entre(frame, m("Nova") - 8, abre + 2)} />
      {frame >= abre && (
        <ModalNovaDemanda
          k={rampa(frame, abre, 8)}
          titulo={<Digitando texto={DEMANDA.titulo} de={titulo} porFrame={1.4} />}
          objetivo={<Digitando texto={OBJETIVO} de={objetivo} porFrame={2.4} />}
          setor={frame >= setor + 4 ? DEMANDA.setor : "Escolha o setor"}
          prazo={frame >= prazo + 4 ? DEMANDA.prazo : "dd/mm/aaaa"}
          setorAceso={frame >= dono - 8}
        />
      )}
    </Tela>
  );
};

export const Opcoes: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const rigoroso = m("rigoroso");
  const sigilosa = m("sigilosa");
  return (
    <Tela quadros={rota([1.12, 970, 470], [[rigoroso, 1.55, 960, 610], [sigilosa, 1.55, 960, 660]], c.dur)}>
      <PaginaLista />
      <ModalNovaDemanda k={1} {...FormularioCompleto} rigoroso={entre(frame, rigoroso - 4, sigilosa - 8)} sigilosa={frame >= sigilosa - 4} />
    </Tela>
  );
};

export const Rascunho: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const r = m("rascunho");
  const subir = m("subir");
  const voce = m("você", 1);
  return (
    <Tela quadros={rota(CENTRO, [[r, 1.5, 760, 344], [m("caminhos"), 1.35, 1270, 530]], c.dur)} fora={<Cursor pontos={caminho([1000, 700], [[subir, BOTAO_DOCUMENTO.x, BOTAO_DOCUMENTO.y], [voce, 1205, 533]])} />}>
      <PaginaDemanda seloAceso={entre(frame, r - 4, m("caminhos") - 10)} botaoAceso={entre(frame, subir - 4, voce - 6)} novaAcesa={frame >= voce - 4} />
    </Tela>
  );
};

// ---------- Capítulo 3: revisar e ativar
const ListaResponsaveis: React.FC<{ readonly x: number; readonly y: number; readonly k: number; readonly marcado: number }> = ({ x, y, k, marcado }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 520, boxSizing: "border-box", padding: 6, background: "#141815", border: `1px solid ${COR.borda}`, borderRadius: 8, fontSize: 19, opacity: k, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
    {["Helena Duarte", "Marina Costa", "Pedro Alves", "Rafael Lima", "+ Nova pessoa…"].map((t, i) => (
      <div key={t} style={{ padding: "7px 12px", borderRadius: 6, background: i === marcado ? "#1F3524" : "transparent" }}>
        {t}
      </div>
    ))}
  </div>
);

export const Revisar: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const escolhe = m("escolhe");
  const desmarca = m("desmarca");
  const r0 = topoProposta(0) - 40;
  const r4 = topoProposta(4) - 90;
  const rol = rola(frame, desmarca - 12, 12, r0, r4);
  const campo = noCartao(0).responsavel;
  const marca4 = topoProposta(4) + 68;
  const abre = escolhe - 14;
  const abriu = entre(frame, abre, desmarca - 12);
  const tira = desmarca + 8;
  return (
    <Tela
      quadros={rota(CENTRO, [[m("descrição"), 1.25, 900, 280], [abre, 1.3, 800, 460], [desmarca, 1.25, 820, 330]], c.dur)}
      fora={<Cursor pontos={caminho([1100, 700], [[abre, 300 + campo.x, 44 + campo.y - r0], [escolhe + 12, 300 + campo.x - 100, 44 + campo.y - r0 + 148], [tira, 372, 44 + marca4 - r4]])} cliques={[abre, escolhe + 12, tira]} />}
    >
      <Revisao
        rolagem={rol}
        entradas={[-99, -99, -99, -99, -99]}
        acesos={[...(entre(frame, m("descrição") - 4, escolhe - 6) ? ["acao-0"] : []), ...(entre(frame, tira - 12, tira + 2) ? ["marca-4"] : [])]}
        desmarcadas={frame >= tira ? [4] : []}
      >
        {abriu && <ListaResponsaveis x={60} y={campo.y + 30} k={rampa(frame, abre, 5) * (1 - rampa(frame, escolhe + 16, 6))} marcado={frame >= escolhe + 2 ? 3 : -1} />}
      </Revisao>
    </Tela>
  );
};

export const Cadastrar: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const clica = m("Cadastrar");
  const abre = clica + 10;
  const nome = m("nome");
  const email = m("e-mail");
  const rec = m("reconhece");
  const atr = m("atribuir");
  const rol = topoProposta(3) - 90;
  const b = noCartao(3).botao;
  return (
    <Tela quadros={rota(CENTRO, [[clica, 1.3, 800, 300], [abre + 8, 1.2, 960, 470]], c.dur)} fora={<Cursor pontos={caminho([1000, 700], [[clica + 6, 300 + b.x, 44 + b.y - rol]])} cliques={[clica + 6]} />}>
      <Revisao rolagem={rol} entradas={[-99, -99, -99, -99, -99]} acesos={entre(frame, clica - 6, abre) ? ["botao-3"] : []} />
      {frame >= abre && <ModalNovaPessoa k={rampa(frame, abre, 8)} nome={<Digitando texto="Equipe Obras" de={nome - 6} porFrame={1.2} />} email={<Digitando texto="obras@lojamodelo.com.br" de={email - 4} porFrame={2} />} reconhece={entre(frame, rec - 4, atr - 6)} atribui={frame >= atr - 4} />}
    </Tela>
  );
};

export const Varios: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const add = m("Adicionar");
  const marca2 = m("marca");
  const r1 = topoProposta(1) - 90;
  const r2 = topoProposta(2) - 90;
  const rol = rola(frame, m("se") - 6, 14, r1, r2);
  const b = noCartao(1).botao;
  const p = noCartao(2).pedir;
  return (
    <Tela
      quadros={rota(CENTRO, [[add, 1.3, 860, 320], [marca2, 1.3, 1040, 340]], c.dur)}
      fora={<Cursor pontos={caminho([1000, 700], [[add + 6, 300 + b.x, 44 + b.y - r1], [marca2 + 6, 300 + p.x, 44 + p.y - r2]])} cliques={[add + 6, marca2 + 6]} />}
    >
      <Revisao
        rolagem={rol}
        entradas={[-99, -99, -99, -99, -99]}
        acesos={[...(entre(frame, add - 6, add + 12) ? ["botao-1"] : []), ...(frame >= marca2 - 4 ? ["pedir-2"] : [])]}
        extras={frame >= add + 10 ? { 1: "Sérgio Nunes" } : {}}
        pedidos={frame >= marca2 + 6 ? [2] : []}
        responsaveis={{ 3: "Equipe Obras" }}
      />
    </Tela>
  );
};

export const Ativar: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const clica = m("Revisar");
  const abre = clica + 16;
  const conta = m("conta");
  const previa = m("prévia");
  const aut = m("Autorizar");
  const rol = topoProposta(4) + 8 - 300;
  const yBotao = 44 + topoProposta(5) + 8 + 26 - rol;
  return (
    <Tela
      quadros={rota(CENTRO, [[clica, 1.15, 1200, 600], [abre + 4, 1.1, 970, 470], [previa, 1.24, 970, 520], [aut, 1.3, 1200, 740], [m("partir"), 1, 820, 480]], c.dur)}
      fora={<Cursor pontos={caminho([900, 500], [[clica + 8, 1480, yBotao], [aut + 4, 1442, 800]])} cliques={[clica + 8, aut + 4]} />}
    >
      <Revisao rolagem={rol} entradas={[-99, -99, -99, -99, -99]} {...REVISADA} ativarAceso={entre(frame, clica - 8, abre)} />
      {frame >= abre && <ModalAtivar k={rampa(frame, abre, 8)} contaAcesa={entre(frame, conta - 4, previa - 8)} previaAcesa={entre(frame, previa - 4, aut - 8)} autorizarAceso={frame >= aut - 4} previa={<EmailResponsavel tam={17} />} />}
    </Tela>
  );
};

const PaginaDocumento: React.FC<{ readonly revisando: boolean; readonly botaoAceso: boolean }> = ({ revisando, botaoAceso }) => (
  <div style={{ position: "absolute", inset: 0, background: COR.fundo }}>
    <div style={{ position: "absolute", left: 40, top: 24, fontSize: 18, color: COR.suave }}>← {DEMANDA.titulo}</div>
    <div style={{ position: "absolute", left: 40, top: 52, fontSize: 30, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", whiteSpace: "nowrap" }}>{ATA.arquivo.replace(".pdf", "")}</div>
    <div style={{ position: "absolute", left: 40, top: 110, fontSize: 18, color: COR.suave }}>Documento ativado · 4 ações em acompanhamento</div>
    <div style={{ position: "absolute", left: 40, top: 150, padding: "12px 22px", fontSize: 20, fontWeight: 600, borderRadius: 8, background: "white", color: "#0B0B0C", ...(botaoAceso ? { boxShadow: `0 0 0 3px ${VERDE}, 0 0 26px rgba(60,224,30,0.5)` } : {}) }}>Revisar de novo</div>
    {revisando && (
      <div style={{ position: "absolute", left: 40, top: 240, width: 1259, boxSizing: "border-box", padding: "20px 24px", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>Ficou de fora (1)</div>
        <div style={{ fontSize: 16, color: COR.suave, marginTop: 2 }}>As ações que já estão ativas não mudam.</div>
        <div style={{ marginTop: 14, padding: "12px 16px", border: `1px solid ${COR.borda}`, borderRadius: 7, fontSize: 19 }}>{PROPOSTAS[4].texto}</div>
      </div>
    )}
  </div>
);

export const Ativa: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const ativa = m("ativa");
  const lista = m("lista");
  const abre = m("abre");
  const clica = m("Revisar");
  const fim = TOPO_ACOES - 90;
  return (
    <Tela
      quadros={rota(CENTRO, [[ativa, 1.5, 760, 180], [lista, 1, 820, 480], [abre + 12, 1.3, 800, 260]], c.dur)}
      fora={<Cursor pontos={caminho([1000, 700], [[abre, 560, 534], [clica, 440, 238]])} cliques={[abre, clica]} />}
    >
      <PaginaAtiva rolagem={rola(frame, lista - 8, 14, 0, fim - 40) - rola(frame, abre - 12, 10, 0, fim - 40)} selo={frame >= ativa ? "Ativa" : "Rascunho"} seloAceso={entre(frame, ativa - 2, lista - 8)} numeros={COMECO} linhas={LINHAS_INICIO} docAceso={entre(frame, abre - 10, abre + 6)} />
      {frame >= abre + 4 && <PaginaDocumento revisando={frame >= clica + 4} botaoAceso={entre(frame, clica - 6, clica + 10)} />}
    </Tela>
  );
};

export const Manual: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const clica = m("Nova");
  const abre = clica + 8;
  const escreve = m("escreve");
  const resp = m("responsáveis");
  const prazo = m("prazo");
  const cria = m("Criar");
  const fecha = cria + 12;
  const linhas = frame >= fecha ? [...LINHAS_INICIO, LINHA_MANUAL] : LINHAS_INICIO;
  const numeros = frame >= fecha ? { ...COMECO, acoes: "5", notaConcluidas: "0 de 5" } : COMECO;
  const rol = rola(frame, fecha, 12, 0, TOPO_ACOES - 70);
  return (
    <Tela quadros={rota(CENTRO, [[m("Clica"), 1.25, 1239, 530], [abre + 6, 1.15, 960, 470], [fecha + 6, 1, 820, 480]], c.dur)} fora={<Cursor pontos={caminho([900, 640], [[clica + 2, 1239, 530], [cria + 4, 1420, 800]])} cliques={[clica + 2, cria + 4]} />}>
      <PaginaAtiva rolagem={rol} numeros={numeros} linhas={linhas} novaAcesa={entre(frame, clica - 8, abre)} linhaAcesa={frame >= fecha + 8 ? 4 : undefined} />
      {entre(frame, abre, fecha + 8) && <ModalNovaAcao k={rampa(frame, abre, 8) * (1 - rampa(frame, fecha, 8))} oQue={<Digitando texto={LINHA_MANUAL.acao} de={escreve} porFrame={1.4} />} resp={frame >= resp ? LINHA_MANUAL.resp : "Escolha o responsável"} prazo={frame >= prazo ? LINHA_MANUAL.prazo : "dd/mm/aaaa"} criarAceso={frame >= cria - 6} />}
    </Tela>
  );
};

// ---------- Capítulo 4: a cobrança sai sozinha (linha do tempo)
type Ponto = { x: number; rotulo: string; sub: string; cor: string };
const AMARELO = "#F5B82E";
const VERMELHO = "#FF6B6B";
const PONTOS: readonly Ponto[] = [
  { x: 170, rotulo: "Ativação", sub: "aviso", cor: VERDE },
  { x: 500, rotulo: "1 dia útil antes", sub: "lembrete", cor: VERDE },
  { x: 800, rotulo: "Dia do prazo", sub: "aviso", cor: AMARELO },
  { x: 1040, rotulo: "1º dia útil", sub: "cobrança", cor: VERMELHO },
  { x: 1240, rotulo: "3º dia útil", sub: "cobrança", cor: VERMELHO },
  { x: 1440, rotulo: "8º dia útil", sub: "cobrança", cor: VERMELHO },
  { x: 1640, rotulo: "13º dia útil", sub: "cobrança", cor: VERMELHO },
];
const Y_LINHA = 560;

const LinhaTempo: React.FC<{ readonly de: readonly number[]; readonly acesos?: readonly number[] }> = ({ de, acesos = [] }) => {
  const frame = useCurrentFrame();
  const ultimo = PONTOS.reduce((u, p, i) => (frame >= de[i] ? p.x : u), 120);
  const ant = PONTOS.reduce((u, p, i) => (frame >= de[i] + 12 ? p.x : u), 120);
  const fimLinha = ant + (ultimo - ant) * rampa(frame, Math.max(...de.filter((d) => d <= frame), 0), 12);
  return (
    <>
      <div style={{ position: "absolute", left: 120, width: 1600, top: Y_LINHA - 3, height: 6, borderRadius: 3, background: "#2A2F2B" }} />
      <div style={{ position: "absolute", left: 120, width: fimLinha - 120, top: Y_LINHA - 3, height: 6, borderRadius: 3, background: VERDE, boxShadow: "0 0 18px rgba(60,224,30,0.6)" }} />
      {PONTOS.map((p, i) => {
        const k = rampa(frame, de[i], 10);
        if (k <= 0) return null;
        const aceso = acesos.includes(i);
        return (
          <div key={p.rotulo} style={{ position: "absolute", left: p.x - 100, width: 200, top: Y_LINHA - 38, textAlign: "center", opacity: k, transform: `scale(${0.7 + 0.3 * k})` }}>
            <div style={{ width: 76, height: 76, margin: "0 auto", borderRadius: "50%", display: "grid", placeItems: "center", background: "#141815", border: `3px solid ${p.cor}`, color: p.cor, boxShadow: aceso ? `0 0 34px ${p.cor}` : "none" }}>
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
                <path d="M3 6h18v12H3zM3 7l9 7 9-7" />
              </svg>
            </div>
            <div style={{ fontFamily, fontWeight: 800, fontSize: 25, color: "white", marginTop: 12 }}>{p.rotulo}</div>
            <div style={{ fontFamily, fontWeight: 600, fontSize: 22, color: p.cor }}>{p.sub}</div>
          </div>
        );
      })}
    </>
  );
};

const NUNCA = 99999;
const TODOS: readonly number[] = [-99, -99, -99, -99, -99, -99, -99];

export const Aviso: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = uso(c);
  const na = m("ativação");
  return (
    <>
      <TituloCena de={m("Agora") - 2} branco="SEM VOCÊ" verde="CORRER ATRÁS" top={200} tam={84} />
      <LinhaTempo de={[na - 4, NUNCA, NUNCA, NUNCA, NUNCA, NUNCA, NUNCA]} acesos={[0]} />
    </>
  );
};

export const Cadencia: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const de = [-99, m("Um") - 4, m("No") - 4, m("primeiro") - 4, m("terceiro") - 4, m("cinco") - 4, m("cinco") + 8];
  const acesa = de.reduce((u, d, i) => (frame >= d ? i : u), 0);
  return (
    <>
      <TituloCena de={0} branco="A COBRANÇA" verde="NO PILOTO AUTOMÁTICO" top={200} />
      <LinhaTempo de={de} acesos={[acesa]} />
      <Surge de={m("resolvida") - 8} style={{ left: 0, right: 0, top: 760, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 38, color: CINZA }}>
          até a ação ser <span style={{ color: VERDE }}>resolvida</span>
        </div>
      </Surge>
    </>
  );
};

const Degrau: React.FC<{ readonly de: number; readonly x: number; readonly w: number; readonly linhaX: number; readonly etiqueta: string; readonly titulo: string; readonly nota?: string; readonly notaDe?: number }> = ({ de, x, w, linhaX, etiqueta, titulo, nota, notaDe = 0 }) => {
  const frame = useCurrentFrame();
  const k = rampa(frame, de + 6, 10);
  return (
    <>
      <div style={{ position: "absolute", left: linhaX - 2, top: 372 + (Y_LINHA - 40 - 372) * (1 - k), width: 4, height: (Y_LINHA - 40 - 372) * k, background: VERMELHO, opacity: frame >= de ? 1 : 0 }} />
      <Surge de={de} style={{ left: x, top: 150, width: w }}>
        <div style={{ boxSizing: "border-box", height: 222, padding: "22px 26px", borderRadius: 16, background: "#1A1214", border: `2px solid ${VERMELHO}`, boxShadow: "0 0 40px rgba(255,107,107,0.2)" }}>
          <div style={{ fontFamily: fonteMono, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: VERMELHO }}>{etiqueta}</div>
          <div style={{ ...TITULO, fontSize: 34, lineHeight: 1.12, color: "white", marginTop: 8 }}>{titulo}</div>
          {nota && <div style={{ fontFamily, fontWeight: 600, fontSize: 23, color: CINZA, marginTop: 8, opacity: rampa(frame, notaDe, 8) }}>{nota}</div>}
        </div>
      </Surge>
    </>
  );
};

export const Escala: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = uso(c);
  return (
    <>
      <Surge de={m("sobe") - 6} style={{ left: 130, top: 170 }}>
        <div style={{ ...TITULO, fontSize: 84, lineHeight: 1.05, color: "white" }}>A COBRANÇA</div>
        <div style={{ ...TITULO, fontSize: 84, lineHeight: 1.05, ...textoDegrade }}>SOBE</div>
      </Surge>
      <LinhaTempo de={TODOS} acesos={[4, 6]} />
      <Degrau de={m("terceiro") - 4} x={880} w={420} linhaX={1240} etiqueta="A PARTIR DO 3º DIA ÚTIL" titulo="Referência da área recebe um resumo" />
      <Degrau de={m("quarta") - 4} x={1320} w={500} linhaX={1640} etiqueta="4ª COBRANÇA SEM RESPOSTA" titulo='Vai para "Precisa de você"' nota="e notifica no navegador quem acompanha" notaDe={m("notificação") - 4} />
    </>
  );
};

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
export const Janela: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const uteis = m("dias");
  const horario = m("horário");
  const fora = m("fora");
  const prox = m("próximo");
  const dom = m("domingo");
  const x = (h: number) => 310 + (h / 24) * 1300;
  const carta = fora < frame ? interpolate(frame, [prox - 6, prox + 12], [x(20), x(8)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : x(20);
  return (
    <>
      <div style={{ position: "absolute", left: 310, top: 150, display: "flex", gap: 18 }}>
        {DIAS.map((d, i) => {
          const util = i < 5;
          const lit = util && frame >= uteis - 4 + i * 3;
          const dnao = i === 6 && entre(frame, dom - 4, uteis - 4);
          return (
            <div key={d} style={{ width: 170, height: 150, boxSizing: "border-box", borderRadius: 14, display: "grid", placeItems: "center", fontFamily, fontWeight: 800, fontSize: 36, color: lit ? "#0B0B0C" : dnao ? VERMELHO : "#6B726D", background: lit ? VERDE : "#141815", border: `2px solid ${dnao ? VERMELHO : lit ? VERDE : "#2A2F2B"}` }}>
              {d}
              {!util && <div style={{ fontSize: 22, fontWeight: 700 }}>sem envio</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: x(0), width: x(24) - x(0), top: 500, height: 70, borderRadius: 12, background: "#141815", border: "1px solid #2A2F2B", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: (x(8) - x(0)), width: (x(18) - x(8)) * rampa(frame, horario - 4, 12), top: 0, bottom: 0, background: VERDE, opacity: 0.85 }} />
      </div>
      {[0, 8, 18, 24].map((h) => (
        <div key={h} style={{ position: "absolute", left: x(h) - 50, width: 100, top: 582, textAlign: "center", fontFamily, fontWeight: 800, fontSize: 32, color: h === 8 || h === 18 ? "white" : "#6B726D" }}>
          {h}h
        </div>
      ))}
      <Surge de={horario + 6} style={{ left: x(8), width: x(18) - x(8), top: 512, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 32, color: "#0B0B0C" }}>HORÁRIO DE ENVIO</div>
      </Surge>
      {frame >= fora - 4 && (
        <div style={{ position: "absolute", left: carta - 44, top: 650, width: 88, height: 88, borderRadius: "50%", display: "grid", placeItems: "center", background: "white", color: "#0B0B0C", boxShadow: "0 12px 30px rgba(0,0,0,0.5)", opacity: rampa(frame, fora - 4, 8) }}>
          <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
            <path d="M3 6h18v12H3zM3 7l9 7 9-7" />
          </svg>
        </div>
      )}
      <Surge de={prox - 2} style={{ left: 0, right: 0, top: 770, textAlign: "center" }}>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 34, color: VERDE }}>sai no próximo horário permitido</div>
      </Surge>
    </>
  );
};

export const Setor: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const resumo = m("resumo");
  const diario = m("diário");
  const aviso = m("aviso");
  return (
    <>
      <TituloCena de={m("quem") - 4} branco="QUEM CRIOU E O SETOR" verde="FICAM INFORMADOS" top={100} tam={58} />
      <Surge de={resumo - 4} style={{ left: 110, top: 240 }}>
        <div style={{ transform: "rotate(-2deg)" }}>
          <MiniResumo aceso={entre(frame, resumo - 4, diario - 8)} />
        </div>
      </Surge>
      <Surge de={diario - 6} style={{ left: 695, top: 220 }}>
        <MiniDiario aceso={entre(frame, diario - 6, aviso - 8)} />
      </Surge>
      <Surge de={aviso - 4} style={{ left: 1280, top: 240 }}>
        <div style={{ transform: "rotate(2deg)" }}>
          <MiniRetorno aceso={frame >= aviso - 4} />
        </div>
      </Surge>
    </>
  );
};

// ---------- Capítulo 5: o responsável responde
export const Email: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const abre = m("abre");
  const acesos = [...(entre(frame, m("ação") - 4, m("prazo") - 4) ? ["acao"] : []), ...(entre(frame, m("prazo") - 4, m("três") - 4) ? ["prazo"] : []), ...(frame >= m("três") - 4 ? ["botoes"] : [])];
  return (
    <>
      <TituloCena de={0} ate={abre - 10} branco="O LADO DE" verde="QUEM RECEBE" top={400} tam={96} />
      <Surge de={abre - 6} style={{ left: 280, top: 120 }}>
        <CaixaEmail assunto="Acompanhamento · Você recebeu 1 ação" para="rafael.lima@lojamodelo.com.br" hora="15:12" largura={1360}>
          <EmailResponsavel tam={25} acesos={acesos} />
        </CaixaEmail>
      </Surge>
      <Surge de={m("login") - 6} style={{ left: 1290, top: 140 }}>
        <div style={{ background: VERDE, color: FUNDO, ...TITULO, fontSize: 36, padding: "12px 22px", borderRadius: 10, transform: "rotate(3deg)" }}>SEM LOGIN</div>
      </Surge>
    </>
  );
};

type Modo = "concluir" | "prazo" | "outra";
const BOTOES_RESPOSTA: readonly [Modo, string, number][] = [
  ["concluir", "Ação concluída", 200],
  ["prazo", "Solicitar novo prazo", 250],
  ["outra", "Ação de outra área/pessoa", 310],
];
const CampoResposta: React.FC<{ readonly rotulo: string; readonly nota?: string; readonly alto?: boolean; readonly children: React.ReactNode }> = ({ rotulo, nota, alto, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 21, fontWeight: 600, marginBottom: 6 }}>{rotulo}</div>
    <div style={{ minHeight: alto ? 94 : 54, boxSizing: "border-box", padding: "12px 16px", borderRadius: 7, border: `1px solid ${COR.borda}`, background: "#1E2320", fontSize: 21, lineHeight: 1.3 }}>{children}</div>
    {nota && <div style={{ fontSize: 16, color: COR.suave, marginTop: 4 }}>{nota}</div>}
  </div>
);

const PaginaResposta: React.FC<{ readonly modo: Modo; readonly children: React.ReactNode; readonly situacao?: string }> = ({ modo, children, situacao = "Aberta" }) => (
  <AbsoluteFill style={{ background: "#0B100C", fontFamily: fonteApp, color: COR.texto }}>
    <div style={{ position: "absolute", left: 460, width: 1000, top: 56 }}>
      <div style={{ fontSize: 18, letterSpacing: 2, color: COR.suave }}>LOJA MODELO · ACOMPANHAMENTO</div>
      <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: 4, marginTop: 4 }}>OLÁ, RAFAEL.</div>
      <div style={{ marginTop: 16, padding: "18px 26px", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 12 }}>
        <div style={{ fontSize: 24, fontWeight: 600 }}>{PROPOSTAS[0].texto}</div>
        <div style={{ fontSize: 19, color: COR.suave, marginTop: 6 }}>
          {DEMANDA.titulo} · Prazo: 13/11/2026 · {situacao}
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        {BOTOES_RESPOSTA.map(([id, t]) => (
          <div key={id} style={{ padding: "11px 20px", fontSize: 21, fontWeight: 600, borderRadius: 8, background: id === modo ? "white" : "transparent", color: id === modo ? "#0B0B0C" : COR.texto, border: `1px solid ${id === modo ? "white" : COR.borda}` }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: "20px 26px 8px", background: COR.cartao, border: `1px solid ${COR.borda}`, borderRadius: 12 }}>{children}</div>
    </div>
  </AbsoluteFill>
);

const CURSOR_TELA = { concluir: [565, 318] as const, prazo: [810, 318] as const, outra: [1110, 318] as const };

export const Concluida: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const clica = m("clica");
  const desc = m("descreve");
  const anexa = m("anexar");
  return (
    <>
      <PaginaResposta modo="concluir">
        <CampoResposta rotulo="O que foi feito" nota="Pelo menos 10 caracteres." alto>
          <Digitando texto="Pedido enviado aos 12 fornecedores, com o aceite de cada um." de={desc} porFrame={1.4} />
        </CampoResposta>
        <CampoResposta rotulo="Evidência da entrega (opcional)" nota="Documento, foto ou planilha · até 5 arquivos de 10 MB.">
          <b>Escolher arquivos</b> <span style={{ color: frame >= anexa + 6 ? VERDE : COR.texto, marginLeft: 8 }}>{frame >= anexa + 6 ? "aceites-fornecedores.pdf" : "Nenhum arquivo escolhido"}</span>
        </CampoResposta>
        <div style={{ fontSize: 16, color: COR.suave, marginBottom: 14 }}>O retorno vai para análise da Expansão; o status e o prazo só mudam depois da aprovação.</div>
      </PaginaResposta>
      <Cursor pontos={caminho([900, 600], [[clica + 4, ...CURSOR_TELA.concluir], [anexa + 4, 640, 616]])} cliques={[clica + 4, anexa + 4]} />
    </>
  );
};

export const Prazo: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const novo = m("clica") + 4;
  const outra = m("clica", 1) + 4;
  const data = m("nova");
  const just = m("justificativa");
  const modo: Modo = frame >= outra ? "outra" : "prazo";
  return (
    <>
      <PaginaResposta modo={modo}>
        {modo === "prazo" ? (
          <>
            <CampoResposta rotulo="Nova data">{frame >= data ? "20/11/2026" : "dd/mm/aaaa"}</CampoResposta>
            <CampoResposta rotulo="Justificativa" alto>
              <Digitando texto="Dois fornecedores pediram mais uma semana para fechar o aceite." de={just - 8} porFrame={1.6} />
            </CampoResposta>
            <div style={{ fontSize: 18, color: frame >= m("aprovação") - 6 ? VERDE : COR.suave, fontWeight: 600, marginBottom: 14 }}>O novo prazo só passa a valer depois de aprovado.</div>
          </>
        ) : (
          <>
            <CampoResposta rotulo="Nome de quem deveria responder">
              <Digitando texto="Bruno Teixeira" de={m("indica") - 4} porFrame={1.4} />
            </CampoResposta>
            <CampoResposta rotulo="E-mail">
              <Digitando texto="bruno.teixeira@lojamodelo.com.br" de={m("quem") - 2} porFrame={2.4} />
            </CampoResposta>
          </>
        )}
      </PaginaResposta>
      <Cursor pontos={caminho([700, 700], [[novo, ...CURSOR_TELA.prazo], [outra, ...CURSOR_TELA.outra]])} cliques={[novo, outra]} />
    </>
  );
};

export const Analise: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const detalhe = m("detalhe");
  const emAnalise = m("análise");
  return (
    <>
      <PaginaResposta modo="concluir" situacao={frame >= emAnalise - 4 ? "Em análise" : "Aberta"}>
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Retorno enviado. Obrigado!</div>
        <div style={{ fontSize: 20, color: COR.suave, marginBottom: 14 }}>A Expansão vai analisar. Enquanto isso, as cobranças desta ação ficam paradas.</div>
      </PaginaResposta>
      <Surge de={emAnalise - 4} ate={detalhe - 12} style={{ left: 0, right: 0, top: 590, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 60, color: "white" }}>
          COBRANÇAS <span style={textoDegrade}>PAUSADAS</span>
        </div>
      </Surge>
      <Surge de={detalhe - 4} style={{ left: 330, top: 560, width: 1260 }}>
        <div style={{ boxSizing: "border-box", padding: "26px 34px", borderRadius: 16, background: "#241C0A", border: `2px solid ${AMARELO}`, display: "flex", gap: 26, alignItems: "center" }}>
          <div style={{ fontFamily: fonteMono, fontWeight: 800, fontSize: 26, letterSpacing: 2, color: AMARELO }}>ATENÇÃO</div>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 38, color: "white", lineHeight: 1.2 }}>Responda pelos botões. Responder o e-mail não atualiza a ação.</div>
        </div>
      </Surge>
    </>
  );
};

const LINHAS_DOIS = [{ ...LINHAS_ANDAMENTO[0], situacao: "Em análise", cobranca: "Retorno enviado 12/11, 16:40", proximo: "Cobranças paradas até a decisão" }, ...LINHAS_ANDAMENTO.slice(1)];
export const Dois: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const lista = m("lista");
  const cada = m("cada");
  const rol = TOPO_ACOES - 70;
  return (
    <Tela
      quadros={rota(CENTRO, [[cada, 1.2, 900, 330], [lista, 1.45, 1000, 230]], c.dur)}
      fora={
        <>
          <Surge de={cada - 2} ate={lista - 12} style={{ left: 780, top: 400 }}>
            <EmailDupla nome="Pedro Alves" estado="recebeu o próprio e-mail" />
          </Surge>
          <Surge de={cada + 10} ate={lista - 12} style={{ left: 780, top: 500 }}>
            <EmailDupla nome="Sérgio Nunes" estado={frame >= m("responde") ? "entregou" : "recebeu o próprio e-mail"} ok={frame >= m("responde")} />
          </Surge>
        </>
      }
    >
      <PaginaAtiva rolagem={rol} numeros={ANDAMENTO} linhas={LINHAS_DOIS} filtro="Todas" linhaAcesa={entre(frame, cada - 6, lista - 8) ? 1 : undefined} notaAcesa={frame >= lista - 6 ? 1 : undefined} />
    </Tela>
  );
};
const EmailDupla: React.FC<{ readonly nome: string; readonly estado: string; readonly ok?: boolean }> = ({ nome, estado, ok }) => (
  <div style={{ width: 620, boxSizing: "border-box", padding: "14px 22px", display: "flex", alignItems: "center", gap: 16, borderRadius: 12, background: "#141815", border: `2px solid ${ok ? VERDE : COR.borda}`, fontFamily: fonteApp, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
    <Icone nome="tarefas" tam={28} cor={ok ? VERDE : "white"} />
    <span style={{ fontSize: 26, fontWeight: 700, color: "white" }}>{nome}</span>
    <span style={{ fontSize: 22, color: ok ? VERDE : COR.suave }}>{estado}</span>
  </div>
);

// ---------- Capítulo 6: aprovar ou recusar
export const ParaAprovar: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const quadro = m("quadro");
  const login = m("login");
  return (
    <>
      <Tela quadros={rota(CENTRO, [[quadro, 1.2, 880, 340], [m("confere"), 1.35, 800, 400]], c.dur)}>
        <QuadroAprovar aceso={entre(frame, quadro - 4, m("confere") - 8)} anexosAceso={frame >= m("confere") - 4} />
      </Tela>
      <Surge de={m("retorno") - 2} ate={quadro - 12} style={{ left: 660, top: 290 }}>
        <MiniRetorno />
      </Surge>
      <Surge de={login - 6} style={{ left: 1320, top: 90 }}>
        <div style={{ background: VERDE, color: FUNDO, ...TITULO, fontSize: 32, padding: "10px 20px", borderRadius: 10 }}>EXIGE LOGIN</div>
      </Surge>
    </>
  );
};

const Efeito: React.FC<{ readonly de: number; readonly x: number; readonly titulo: string; readonly nota: string }> = ({ de, x, titulo, nota }) => (
  <Surge de={de} style={{ left: x, top: 420, width: 500 }}>
    <div style={{ boxSizing: "border-box", height: 230, padding: "26px 28px", borderRadius: 16, background: "#141815", border: `2px solid ${VERDE}`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
      <div style={{ ...TITULO, fontSize: 36, color: "white", lineHeight: 1.1 }}>{titulo}</div>
      <div style={{ fontFamily, fontWeight: 600, fontSize: 25, color: CINZA, marginTop: 12, lineHeight: 1.25 }}>{nota}</div>
    </div>
  </Surge>
);

const APROVAR_XY = { aprovar: [452, 492] as const, recusar: [608, 492] as const };
export const Aprovar: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const clica = m("aprovar") + 2;
  return (
    <Tela
      quadros={rota(CENTRO, [[clica + 8, 1, 820, 480]], c.dur)}
      fora={
        <>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1640, height: 960, borderRadius: 16, background: "rgba(0,0,0,0.6)", opacity: rampa(frame, m("concluída") - 8, 8) }} />
          <Efeito de={m("concluída") - 4} x={40} titulo="Ação concluída" nota="quando ele entregou" />
          <Efeito de={m("novo") - 4} x={570} titulo="Novo prazo vale" nota="quando ele pediu mais tempo" />
          <Efeito de={m("pessoa") - 4} x={1100} titulo="Passa para a pessoa" nota="que recebe o aviso" />
          <Cursor pontos={caminho([800, 700], [[clica, ...APROVAR_XY.aprovar], [clica + 26, 820, 840]])} cliques={[clica]} />
        </>
      }
    >
      <QuadroAprovar aprovarAceso={entre(frame, clica - 8, clica + 4)} aprovada={frame >= clica + 6} />
    </Tela>
  );
};

export const Recusar: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const clica = m("recusar") + 2;
  const motivo = m("escreve");
  const volta = m("volta");
  return (
    <>
      <Tela quadros={rota(CENTRO, [[motivo, 1.3, 800, 440]], c.dur)} fora={<Cursor pontos={caminho([800, 700], [[clica, ...APROVAR_XY.recusar]])} cliques={[clica]} />}>
        <QuadroAprovar recusarAceso={entre(frame, clica - 8, clica + 6)} recusa={frame >= clica + 2 ? <Digitando texto="Faltou o aceite do fornecedor de embalagens." de={motivo} porFrame={1.5} /> : undefined} />
      </Tela>
      <Surge de={volta - 6} style={{ left: 330, top: 200, width: 1260 }}>
        <EmailResponsavel tam={24} frase="Marina Costa pediu um retorno sobre esta ação." nota={<>Reaberta por <u>Marina Costa</u>: faltou o aceite do fornecedor de embalagens.</>} />
      </Surge>
    </>
  );
};

const QUEM_DECIDE: readonly (readonly [string, string])[] = [
  ["criou", "Quem criou a demanda"],
  ["usuários", "Usuários do setor responsável"],
  ["administradores", "Administradores"],
];
export const Quem: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const reg = m("registra");
  return (
    <>
      <TituloCena de={0} branco="QUEM PODE" verde="APROVAR" top={110} />
      {QUEM_DECIDE.map(([p, t], i) => (
        <Surge key={t} de={m(p) - 4} style={{ left: 200, top: 280 + i * 130, width: 760 }}>
          <div style={{ boxSizing: "border-box", height: 110, padding: "0 30px", display: "flex", alignItems: "center", gap: 20, borderRadius: 14, background: "#141815", border: `2px solid ${VERDE}` }}>
            <span style={{ fontWeight: 900, fontFamily, fontSize: 40, color: VERDE }}>✓</span>
            <span style={{ fontFamily, fontWeight: 800, fontSize: 34, color: "white" }}>{t}</span>
          </div>
        </Surge>
      ))}
      <Surge de={reg - 6} style={{ left: 1030, top: 280, width: 690 }}>
        <div style={{ boxSizing: "border-box", padding: "24px 30px", borderRadius: 14, background: COR.cartao, border: `1px solid ${COR.borda}`, fontFamily: fonteApp, color: COR.texto }}>
          <div style={{ fontSize: 20, letterSpacing: 1, color: COR.suave }}>HISTÓRICO</div>
          {[
            ["13/11, 09:05", "Aprovado por Marina Costa", true],
            ["12/11, 16:40", "Retorno de Rafael Lima", false],
            ["12/11, 08:00", "Lembrete enviado", false],
            ["03/11, 15:12", "Aviso enviado", false],
          ].map(([q, t, lit]) => (
            <div key={String(q)} style={{ display: "flex", gap: 22, fontSize: 25, marginTop: 14, padding: "3px 6px", borderRadius: 6, boxShadow: lit && frame >= reg ? `0 0 0 2px ${VERDE}, 0 0 22px rgba(60,224,30,0.4)` : "none" }}>
              <span style={{ width: 150, color: COR.suave }}>{q}</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </Surge>
    </>
  );
};

// ---------- Capítulo 7: acompanhar o andamento
export const NumerosCena: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const k = interpolate(frame, [m("tudo") - 6, m("tudo") + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const I = INDICADORES_ANDAMENTO;
  const n: Numeros = {
    ...ANDAMENTO,
    acoes: String(Math.round(I.acoes * k)),
    concluidas: `${Math.round(40 * k)}%`,
    noPrazo: `${(I.noPrazo * k).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`,
    atrasadas: String(Math.round(I.atrasadas * k)),
    reagendadas: String(Math.round(I.reagendadas * k)),
  };
  const passos: [string, number][] = [
    ["acoes", m("total")],
    ["concluidas", m("concluídas")],
    ["atrasadas", m("atrasadas")],
    ["noPrazo", m("prazo")],
  ];
  const aceso = [...passos].reverse().find(([, f]) => frame >= f - 4)?.[0];
  return (
    <Tela quadros={rota(CENTRO, [[m("total"), 1.3, 980, 370]], c.dur)}>
      <PaginaAtiva numeros={n} numerosAcesos={aceso ? [aceso] : []} linhas={LINHAS_ANDAMENTO} filtro="Todas" />
    </Tela>
  );
};

export const Lista: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const cob = m("Cobrança");
  const rol = TOPO_ACOES - 70;
  return (
    <Tela quadros={rota(CENTRO, [[m("mostra"), 1.08, 860, 360], [cob, 1.5, 300 + COLUNA_COBRANCA + 30, 300]], c.dur)}>
      <PaginaAtiva rolagem={rola(frame, 0, 14, 0, rol)} numeros={ANDAMENTO} linhas={LINHAS_ANDAMENTO} filtro="Todas" colunaAcesa={frame >= cob - 4} />
    </Tela>
  );
};

export const PainelCena: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const clica = m("Clicando") + 2;
  const rol = TOPO_ACOES - 70;
  const marcar = m("marcar");
  const menu = m("menu");
  const itens = [m("edita"), m("muda"), m("reatribui"), m("adiciona"), m("cancela")];
  const item = itens.reduce((u, f, i) => (frame >= f - 3 ? i : u), -1);
  return (
    <Tela quadros={rota(CENTRO, [[clica + 12, 1.12, 1200, 480]], c.dur)} fora={<Cursor pontos={caminho([900, 600], [[clica, 600, 44 + TOPO_ACOES + 116 + 3 * 66 + 33 - rol], [menu, 1260, 400]])} cliques={[clica, menu]} />}>
      <PaginaAtiva rolagem={rol} numeros={ANDAMENTO} linhas={LINHAS_ANDAMENTO} filtro="Todas" linhaAcesa={entre(frame, clica - 8, clica + 6) ? 3 : undefined} />
      {frame >= clica + 4 && <PainelAcao k={rampa(frame, clica + 4, 10)} historicoAceso={entre(frame, m("histórico") - 4, marcar - 8)} botoesAcesos={entre(frame, marcar - 4, menu - 8)} menuK={rampa(frame, menu + 2, 6)} menuItem={item} />}
    </Tela>
  );
};

export const PorPessoa: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const area = m("área");
  const grafico = m("gráfico");
  const r1 = TOPO_PESSOAS - 90;
  const r2 = TOPO_PESSOAS + 634 - 200;
  const rol = interpolate(frame, [0, 14, grafico - 8, grafico + 8], [TOPO_ACOES - 70, r1, r1, r2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Tela quadros={rota(CENTRO, [[grafico - 12, 1, 820, 480]], c.dur)}>
      <PaginaAtiva rolagem={rol} numeros={ANDAMENTO} linhas={LINHAS_ANDAMENTO} filtro="Todas" pessoaAceso={entre(frame, m("pessoa") - 4, area - 4)} areaAceso={entre(frame, area - 4, grafico - 8)} evolucaoAceso={frame >= grafico} evolucao={rampa(frame, grafico + 6, 44)} />
    </Tela>
  );
};

export const PainelGeralCena: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const aba = m("aba");
  const mes = m("percentual");
  const quem = m("quem");
  const rol = interpolate(frame, [mes - 10, mes + 4, quem - 8, quem + 6], [0, 300, 300, 470], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Tela quadros={rota(CENTRO, [[m("números"), 1.08, 860, 470]], c.dur)} fora={<Cursor pontos={caminho([800, 500], [[aba + 6, 548, 226]])} cliques={[aba + 6]} />}>
      <PainelGeral rolagem={rol} acesa={entre(frame, aba, aba + 18) ? "Painel geral" : undefined} numerosAcesos={entre(frame, m("números") - 4, mes - 10)} mesAceso={entre(frame, mes - 4, quem - 8)} atrasosAceso={frame >= quem - 2} k={rampa(frame, mes - 4, 24)} />
    </Tela>
  );
};

// ---------- Capítulo 8: encerrar ou excluir
const LINHAS_VAZIAS: typeof LINHAS_ANDAMENTO = [];
export const Encerrar: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const menu = m("três") + 6;
  const encerra = m("encerra");
  const fecha = encerra + 18;
  const cumprido = m("cumprido");
  const rol = rola(frame, m("aberto") - 10, 14, 0, 372);
  return (
    <Tela quadros={rota(CENTRO, [[menu, 1.35, 1330, 240], [fecha + 6, 1, 820, 480], [cumprido, 1.15, 900, 440]], c.dur)} fora={<Cursor pontos={caminho([1000, 700], [[menu, 1577, 106], [encerra + 6, 1470, 246]])} cliques={[menu, encerra + 6]} />}>
      <PaginaAtiva rolagem={rol} selo={frame >= fecha ? "Encerrada" : "Ativa"} seloAceso={entre(frame, fecha, fecha + 26)} numeros={frame >= fecha ? ENCERRADA : ANDAMENTO} linhas={frame >= fecha ? LINHAS_VAZIAS : LINHAS_ANDAMENTO} filtro="Abertas" menuAceso={entre(frame, menu - 8, menu + 2)} fechamento={frame >= fecha} fechamentoAceso={frame >= cumprido - 6}>
        {entre(frame, menu, fecha) && <MenuDemanda k={rampa(frame, menu, 5) * (1 - rampa(frame, fecha - 6, 6))} encerrarAceso={frame >= encerra - 6} />}
      </PaginaAtiva>
    </Tela>
  );
};

export const Excluir: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const ex = m("Excluir");
  const abre = ex + 18;
  const digitar = m("digitar");
  const manter = m("manter");
  const n = DEMANDA.titulo.length / 1.3;
  return (
    <Tela quadros={rota(CENTRO, [[abre + 4, 1.25, 970, 420], [manter, 1.45, 970, 500]], c.dur)} fora={<Cursor pontos={caminho([1200, 500], [[ex + 2, 1577, 106], [ex + 12, 1470, 287]])} cliques={[ex + 2, ex + 12]} />}>
      <PaginaAtiva selo="Encerrada" numeros={ENCERRADA} linhas={LINHAS_VAZIAS} fechamento>
        {entre(frame, ex + 2, abre) && <MenuDemanda k={rampa(frame, ex + 2, 5)} />}
      </PaginaAtiva>
      {frame >= abre && <ModalExcluir k={rampa(frame, abre, 8)} nome={<Digitando texto={DEMANDA.titulo} de={digitar} porFrame={1.3} />} pronto={frame >= digitar + n} />}
    </Tela>
  );
};

// ---------- Capítulo 9: preparar o módulo
const TelaOrganizacao: React.FC<{ readonly ativo: string; readonly quadros: Parameters<typeof CenaJanela>[0]["quadros"]; readonly children: React.ReactNode }> = ({ ativo, quadros, children }) => (
  <CenaJanela ativo={ativo} menu={MENU_ORGANIZACAO} quadros={quadros}>
    {children}
  </CenaJanela>
);

export const UmaVez: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = uso(c);
  const e = m("cadastra");
  return (
    <TelaOrganizacao ativo="Configurações" quadros={rota(CENTRO, [[e, 1.35, 900, 480]], c.dur)}>
      <PaginaSetores email={<Digitando texto="operacoes@lojamodelo.com.br" de={e + 6} porFrame={1.6} placeholder="e-mail do setor" />} aceso />
      <Surge de={m("administrador") - 4} ate={e - 10} style={{ left: 340, top: 600 }}>
        <div style={{ background: VERDE, color: FUNDO, ...TITULO, fontSize: 30, padding: "10px 20px", borderRadius: 10 }}>SÓ PRECISA SER FEITA UMA VEZ</div>
      </Surge>
    </TelaOrganizacao>
  );
};

export const Pessoas: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const usuarios = m("usuários");
  const quem = m("quem");
  const area = m("área");
  const rol = rola(frame, area - 12, 14, 0, 300);
  return (
    <Tela quadros={rota(CENTRO, [[usuarios, 1.25, 700, 480], [quem, 1.3, 1280, 300], [area, 1, 820, 480]], c.dur)}>
      <PaginaPessoas rolagem={rol} selosAcesos={entre(frame, usuarios - 2, quem - 6)} botaoAceso={entre(frame, quem - 2, area - 12)} areaAcesa={frame >= area - 2} />
    </Tela>
  );
};

export const AprovaCfg: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const conta = m("conta");
  const rol = TOPO_REMETENTE - 160;
  return frame < conta - 6 ? (
    <Tela quadros={rota(CENTRO, [[m("nome"), 1.25, 800, 412]], c.dur)}>
      <PaginaConfig rolagem={rol} acesos={frame >= m("nome") - 4 ? ["remetente"] : []} />
    </Tela>
  ) : (
    <TelaOrganizacao ativo="Integrações" quadros={rota(CENTRO, [[conta + 8, 1.4, 700, 300]], c.dur)}>
      <PaginaIntegracoes acesa={frame >= conta + 2} />
    </TelaOrganizacao>
  );
};

export const CadenciaCfg: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = uso(c);
  const carnaval = m("Carnaval");
  const feriados = m("feriados");
  const pausa = m("Pausa");
  const rol = rola(frame, carnaval - 12, 14, 200, TOPO_CALENDARIO - 90);
  const acesos = [...(entre(frame, m("horários") - 4, m("lembretes") - 2) ? ["horario"] : []), ...(entre(frame, m("lembretes") - 2, m("cobranças") - 2) ? ["lembrete"] : []), ...(entre(frame, m("cobranças") - 2, carnaval - 12) ? ["cobranca"] : []), ...(entre(frame, carnaval - 4, feriados - 4) ? ["carnaval"] : []), ...(entre(frame, feriados - 4, pausa - 4) ? ["feriados"] : []), ...(frame >= pausa - 4 ? ["pausa"] : [])];
  return (
    <Tela quadros={rota(CENTRO, [[carnaval, 1.15, 860, 400]], c.dur)}>
      <PaginaConfig rolagem={rol} acesos={acesos} feriado={frame >= feriados ? <Digitando texto="2026-12-08" de={feriados} porFrame={1.2} /> : undefined} pausa={frame >= pausa + 8} />
    </Tela>
  );
};

export const Ajuste: React.FC<{ readonly c: Cena }> = ({ c }) => {
  const m = uso(c);
  const ex = m("exemplo");
  return (
    <Tela quadros={rota(CENTRO, [[m("Ajuste"), 1.3, 800, 397]], c.dur)}>
      <PaginaConfig rolagem={TOPO_AJUSTE - 150} acesos={["ajuste"]} ajuste={<Digitando texto="Nas nossas atas, o plano de ação é sempre a seção 5." de={ex} porFrame={1.2} />} />
    </Tela>
  );
};

