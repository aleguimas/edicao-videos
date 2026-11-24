import type React from "react";
import { AbasCrm, AbasLinha, BotaoCrm, Cabecalho, CampoCrm, CartaoCrm, COR_CRM, DEGRADE_ATIVO, FONTE_CRM, Icone, ModalCrm, SeletorCrm, SeloCrm, TelaCrm } from "./Kit";

// ---------- Segmentação de Base
const SEGMENTOS = [
  ["Clientes em risco", "Classificação do CRM", 536, true],
  ["Recebeu a campanha e não comprou", "Filtro por campanha", 1248, true],
  ["DDD 81", "Telefone", 5214, false],
  ["Feirão da Reforma", "Importado de uma planilha", 207, false],
] as const;

const Filtro: React.FC<{ r: string; v: string; aceso?: boolean }> = ({ r, v, aceso }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 13px", border: `1px solid ${aceso ? "#10B981" : COR_CRM.borda}`, background: aceso ? "#F0FDF4" : "#FFFFFF", borderRadius: 8, marginBottom: 8, fontSize: 14.5 }}>
    <span style={{ width: 170, color: COR_CRM.suave }}>{r}</span>
    <span style={{ flex: 1 }}>{v}</span>
    <Icone nome="xis" tam={13} cor={COR_CRM.suave} />
  </div>
);

export const TelaSegmentacao: React.FC<{ filtros?: number; contagem?: string; dinamico?: boolean }> = ({ filtros, contagem, dinamico }) => {
  const lista: [string, string][] = [["Tag", "reforma"], ["DDD", "81"], ["Data de cadastro", "últimos 12 meses"], ["Classificação", "Em risco"], ["Recebeu campanha", "e não comprou"]];
  return (
    <TelaCrm
      ativo="segmentacao"
      relacionamento
      sobre={
        filtros !== undefined ? (
          <ModalCrm largura={720} topo={60} titulo="Novo segmento" sub="Monte um público uma vez e use em tag, campanha e e-mail">
            <div style={{ padding: "15px 24px 20px" }}>
              <CampoCrm rotulo="Nome" valor="Clientes em risco" />
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Filtros</div>
              <div style={{ minHeight: 244 }}>
                {lista.slice(0, filtros).map(([r, v], i) => <Filtro key={r} r={r} v={v} aceso={i === filtros - 1} />)}
              </div>
              <div style={{ display: "flex", alignItems: "center", background: "#F0FDF4", borderRadius: 9, padding: "11px 15px", marginTop: 4 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: "#059669", marginRight: 8 }}>{contagem}</span>
                <span style={{ fontSize: 14.5, color: "#475467", flex: 1 }}>pessoas neste público</span>
                <span style={{ fontSize: 14, color: dinamico ? "#047857" : COR_CRM.suave, display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 16, height: 16, borderRadius: 3, background: dinamico ? "#16A34A" : "#FFFFFF", border: `1px solid ${dinamico ? "#16A34A" : "#D0D5DD"}`, color: "#FFFFFF", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{dinamico ? "✓" : ""}</span>
                  Segmento dinâmico
                </span>
              </div>
            </div>
          </ModalCrm>
        ) : null
      }
    >
      <div style={{ padding: "0 8px" }}>
        <Cabecalho titulo="Segmentação de Base" descricao="Monte um público uma vez e use em tag, campanha e e-mail — o segmento dinâmico se atualiza sozinho" direita={<BotaoCrm icone="mais" primario>Novo segmento</BotaoCrm>} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {SEGMENTOS.map(([n, s, q, auto]) => (
            <CartaoCrm key={n} estilo={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>{n}</span>
                {auto ? <SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857">⚡ automático</SeloCrm> : null}
              </div>
              <div style={{ fontSize: 13.5, color: COR_CRM.suave }}>{s}</div>
              <div style={{ fontSize: 14, color: COR_CRM.suave, margin: "6px 0 4px" }}><b style={{ color: COR_CRM.texto }}>{q.toLocaleString("pt-BR")}</b> pessoas</div>
              {auto ? <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COR_CRM.suave, marginBottom: 7 }}><Icone nome="etiqueta" tam={12} cor="#10B981" /> {n} · aplicada 05/11, 11:00</div> : <div style={{ height: 7 }} />}
              <div style={{ display: "flex", gap: 7 }}>
                <BotaoCrm>Editar</BotaoCrm>
                <BotaoCrm icone="girar">Aplicar tag</BotaoCrm>
                <BotaoCrm icone="anexo">CSV</BotaoCrm>
                <BotaoCrm icone="lixeira" />
              </div>
            </CartaoCrm>
          ))}
        </div>
      </div>
    </TelaCrm>
  );
};

// ---------- WhatsApp: histórico de campanhas com anéis
const Anel: React.FC<{ pct: number; rotulo: string; cor?: string }> = ({ pct, rotulo, cor = "#16A34A" }) => {
  const r = 21;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ textAlign: "center", width: 74 }}>
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="#E4E7EC" strokeWidth="3.5" />
        <circle cx="26" cy="26" r={r} fill="none" stroke={cor} strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 26 26)" />
        <text x="26" y="31" textAnchor="middle" fontSize="13" fontWeight="700" fill={cor} fontFamily={FONTE_CRM}>{pct}%</text>
      </svg>
      <div style={{ fontSize: 11.5, color: COR_CRM.suave }}>{rotulo}</div>
    </div>
  );
};
const DISPAROS = [
  ["Reativação em risco", "ENVIADA", "20/10/2026, 10:00:12", "536", 97, 81, 42, 3, true],
  ["Feirão da Reforma", "ENVIADA", "17/10/2026, 09:30:40", "2.140", 96, 74, 31, 4, false],
  ["Novidades em louças", "ENVIADA", "09/10/2026, 15:12:05", "1.320", 95, 68, 24, 5, false],
  ["Convite Dia do Cliente", "ENVIADA", "28/09/2026, 11:02:33", "980", 98, 79, 36, 2, false],
  ["Aniversariantes setembro", "ENVIADA", "01/09/2026, 09:00:00", "214", 99, 83, 44, 1, false],
] as const;
export const TelaHistorico: React.FC = () => (
  <TelaCrm ativo="historico" relacionamento>
    <Cabecalho sobre="Campanha" titulo="Histórico de campanhas" descricao="Acompanhe os disparos realizados, os resultados por template e os flows." />
    <AbasLinha abas={["Histórico", "Resultados", "Flows", "Erros"]} ativa="Histórico" />
    <CartaoCrm estilo={{ padding: "15px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 18, fontWeight: 700, marginBottom: 7 }}><Icone nome="relogio" tam={17} /> Historico de automacoes</div>
      <div style={{ display: "grid", gridTemplateColumns: "2.3fr 1.2fr .6fr 74px 74px 74px 74px 20px", gap: 8, padding: "6px 0", fontSize: 12, fontWeight: 600, color: "#475467", borderBottom: `1px solid ${COR_CRM.borda}` }}>
        <span>TEMPLATE</span><span>DATA</span><span style={{ textAlign: "right" }}>TOTAL</span><span style={{ textAlign: "center" }}>ENTREGUES</span><span style={{ textAlign: "center" }}>LIDAS</span><span style={{ textAlign: "center" }}>CLIQUES</span><span style={{ textAlign: "center" }}>FALHAS</span><span />
      </div>
      {DISPAROS.map(([n, st, d, t, e, l, r, f, aceso]) => (
        <div key={n} style={{ display: "grid", gridTemplateColumns: "2.3fr 1.2fr .6fr 74px 74px 74px 74px 20px", gap: 8, alignItems: "center", height: 91, fontSize: 15, borderBottom: `1px solid ${COR_CRM.borda}`, background: aceso ? "#F6FEF9" : "#FFFFFF" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 9 }}><span style={{ width: 16, height: 16, borderRadius: 3, border: "1.5px solid #98A2B3" }} /><span style={{ fontWeight: 500 }}>{n}</span><span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: 0.6, color: "#047857", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 999, padding: "2px 10px" }}>{st}</span></span>
          <span style={{ fontSize: 13.5, color: COR_CRM.suave }}>{d}</span>
          <span style={{ textAlign: "right", fontWeight: 600 }}>{t}</span>
          <Anel pct={e} rotulo="Entregues" /><Anel pct={l} rotulo="Lidas" /><Anel pct={r} rotulo="Cliques" /><Anel pct={f} rotulo="Falhas" cor="#EF4444" /><span style={{ fontSize: 18, color: COR_CRM.suave, textAlign: "center" }}>⋮</span>
        </div>
      ))}
    </CartaoCrm>
  </TelaCrm>
);

// ---------- Flow de disparos
const NO = { borderRadius: 9, background: "#FFFFFF", boxShadow: "0 1px 4px rgba(16,24,40,0.16)", position: "absolute" } as const;
const Fio: React.FC<{ d: string; de?: boolean }> = ({ d }) => <path d={d} fill="none" stroke="#98A2B3" strokeWidth="1.5" />;
export const TelaFlow: React.FC<{ nos?: number }> = ({ nos = 6 }) => (
  <TelaCrm ativo="disparos" relacionamento>
    <Cabecalho sobre="Campanha — Disparos" titulo="Flow de disparos" descricao="Encadeie templates e ramifique pelos botões da API oficial." direita={<><BotaoCrm icone="voltar">Voltar</BotaoCrm><BotaoCrm icone="arquivo">Salvar</BotaoCrm><BotaoCrm icone="enviar" primario>Preparar disparo</BotaoCrm></>} />
    <div style={{ display: "flex", gap: 14, marginBottom: 9 }}>
      <CampoCrm rotulo="Nome do flow" valor="Reativação em risco" estilo={{ flex: 1, marginBottom: 0 }} />
      <CampoCrm rotulo="Conta padrão" valor="Loja Modelo" estilo={{ flex: 1, marginBottom: 0 }} />
    </div>
    <CampoCrm rotulo="Vincular a um evento (opcional)" valor="Reativação em risco" estilo={{ marginBottom: 10 }} />
    <div style={{ display: "flex", background: "#FFFFFF", borderRadius: 12, height: 546, overflow: "hidden" }}>
      <div style={{ width: 196, padding: "15px 13px", borderRight: `1px solid ${COR_CRM.borda}`, flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, color: COR_CRM.suave, marginBottom: 9 }}>ADICIONAR</div>
        {[["chat", "Enviar template", "#22C55E"], ["relogio", "Espera", "#F59E0B"], ["ramo", "SE / SENÃO", "#8B5CF6"], ["email", "Template livre", "#0EA5E9"], ["imagem", "Imagem/Áudio/PDF", "#6366F1"], ["bandeira", "Fim", "#475467"]].map(([i, t, c]) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 9, height: 46, padding: "0 11px", border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, marginBottom: 8, fontSize: 14 }}><Icone nome={i} tam={16} cor={c} /> {t}</div>
        ))}
      </div>
      <div style={{ width: 590, flexShrink: 0, position: "relative", overflow: "hidden", borderRight: `1px solid ${COR_CRM.borda}`, backgroundImage: "radial-gradient(#D5D9DE 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
        <div style={{ position: "absolute", left: 10, bottom: 12, background: "#FFFFFF", borderRadius: 6, boxShadow: "0 1px 4px rgba(16,24,40,0.16)", zIndex: 3 }}>
          {["mais", "divisor", "grade", "cadeado"].map((i) => <div key={i} style={{ width: 28, height: 27, display: "flex", alignItems: "center", justifyContent: "center" }}><Icone nome={i} tam={13} /></div>)}
        </div>
        <div style={{ position: "absolute", left: 0, top: 30, width: 960, height: 636, transform: "scale(.61)", transformOrigin: "0 0" }}>
        <svg width="1090" height="636" style={{ position: "absolute", inset: 0 }}>
          {nos > 1 ? <Fio d="M150 200 C180 200 190 200 215 200" /> : null}
          {nos > 2 ? <Fio d="M435 200 C460 200 470 200 495 200" /> : null}
          {nos > 3 ? <Fio d="M655 200 C680 200 690 200 715 200" /> : null}
          {nos > 4 ? <Fio d="M905 190 C930 190 925 110 880 95" /> : null}
          {nos > 5 ? <Fio d="M905 215 C940 215 930 330 880 345" /> : null}
        </svg>
        <div style={{ ...NO, left: 40, top: 180, width: 110, height: 40, border: "1.5px solid #22C55E", display: "flex", alignItems: "center", gap: 7, justifyContent: "center", fontSize: 13.5, fontWeight: 600, color: "#047857" }}><Icone nome="enviar" tam={13} /> Início</div>
        {nos > 1 ? (
          <div style={{ ...NO, left: 215, top: 150, width: 220, padding: "9px 12px", boxSizing: "border-box" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#16A34A" }}>ETAPA 1</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}><Icone nome="chat" tam={13} cor="#16A34A" /> Enviar template</div>
            <div style={{ fontSize: 12.5, color: COR_CRM.suave }}>sentimos_sua_falta</div>
            <div style={{ fontSize: 12, background: COR_CRM.cinza, borderRadius: 5, padding: "4px 8px", marginTop: 5 }}>Quero ver as novidades</div>
          </div>
        ) : null}
        {nos > 2 ? <div style={{ ...NO, left: 495, top: 170, width: 160, padding: "10px 12px", boxSizing: "border-box" }}><div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}><Icone nome="relogio" tam={13} cor="#F59E0B" /> Espera</div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>2 dias</div></div> : null}
        {nos > 3 ? <div style={{ ...NO, left: 715, top: 165, width: 190, padding: "10px 12px", boxSizing: "border-box" }}><div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}><Icone nome="ramo" tam={13} cor="#8B5CF6" /> SE / SENÃO</div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>Clicou no botão?</div></div> : null}
        {nos > 4 ? <div style={{ ...NO, left: 650, top: 70, width: 230, padding: "10px 12px", boxSizing: "border-box" }}><div style={{ fontSize: 14, fontWeight: 600 }}>Sim: enviar catálogo</div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>louças_e_metais</div></div> : null}
        {nos > 5 ? <div style={{ ...NO, left: 650, top: 320, width: 230, padding: "10px 12px", boxSizing: "border-box" }}><div style={{ fontSize: 14, fontWeight: 600 }}>Não: lembrete</div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>ultima_chance</div></div> : null}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 26, textAlign: "center", fontSize: 15, lineHeight: 1.4, color: COR_CRM.suave }}>Selecione um nó para editar, ou arraste a partir da paleta à esquerda.</div>
    </div>
  </TelaCrm>
);

// ---------- E-mail Marketing
const ABAS_EMAIL = [["Campanhas", "email"], ["Modelos", "modelo"], ["Listas", "contatos"], ["Automações", "conexoes"], ["Configuração", "config"]] as const;
const CabecaEmail: React.FC<{ aba: string }> = ({ aba }) => (
  <div style={{ padding: "0 8px" }}>
    <Cabecalho titulo="E-mail Marketing" descricao="Monte o e-mail arrastando blocos, dispare para suas listas e acompanhe quem abriu e clicou" direita={<SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857"><span style={{ fontSize: 13.5 }}>Pronto para enviar</span></SeloCrm>} />
    <AbasCrm abas={ABAS_EMAIL} ativa={aba} />
  </div>
);

const BLOCOS = [["titulo", "Título"], ["texto", "Texto"], ["imagem", "Imagem"], ["cursor", "Botão"], ["lista", "Lista"], ["divisor", "Divisor"], ["espaco", "Espaço"], ["partilha", "Redes"], ["video", "Vídeo"]] as const;
export const TelaEmailEditor: React.FC<{ blocos?: number }> = ({ blocos = 4 }) => (
  <TelaCrm ativo="email" relacionamento>
    <CartaoCrm estilo={{ margin: "-20px 8px 0", overflow: "hidden" }}>
      <div style={{ padding: "11px 15px 9px", borderBottom: `1px solid ${COR_CRM.borda}` }}>
        <div style={{ marginBottom: 7 }}><Icone nome="xis" tam={15} cor="#475467" /></div>
        <CampoCrm valor="Reativação em risco" estilo={{ width: 240, marginBottom: 8 }} />
        <CampoCrm valor="Faz tempo que a gente não se vê, {{primeiro_nome}}" estilo={{ marginBottom: 8 }} />
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 9 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, color: "#475467" }}><Icone nome="olho" tam={14} /> Prévia</span>
          <div style={{ display: "flex", gap: 4, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, padding: 3 }}><span style={{ background: COR_CRM.verdeClaro, borderRadius: 5, padding: "3px 6px", display: "flex" }}><Icone nome="monitor" tam={14} cor="#047857" /></span><span style={{ padding: "3px 6px", display: "flex" }}><Icone nome="celular" tam={14} cor={COR_CRM.suave} /></span></div>
          <BotaoCrm icone="enviar">Teste</BotaoCrm>
          <BotaoCrm icone="arquivo" primario>Salvar</BotaoCrm>
        </div>
      </div>
      <div style={{ display: "flex", height: 618 }}>
        <div style={{ width: 250, borderRight: `1px solid ${COR_CRM.borda}`, flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 14.5, color: COR_CRM.suave, borderBottom: `1px solid ${COR_CRM.borda}` }}><span style={{ flex: 1, padding: "9px 12px", color: "#047857", fontWeight: 500, borderBottom: "2px solid #047857", display: "flex", gap: 6, alignItems: "center" }}><Icone nome="modelo" tam={13} /> Conteúdo</span><span style={{ flex: 1, padding: "9px 12px", display: "flex", gap: 6, alignItems: "center" }}><Icone nome="config" tam={13} /> Estilo</span></div>
          <div style={{ padding: 12, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, color: COR_CRM.suave, marginBottom: 8 }}>CONTEÚDO</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
              {BLOCOS.map(([i, t]) => (
                <div key={t} style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, height: 76, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 13, color: "#475467" }}><Icone nome={i} tam={17} /> {t}</div>
              ))}
            </div>
          </div>
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${COR_CRM.borda}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>Preheader</div>
            <div style={{ height: 38, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, display: "flex", alignItems: "center", padding: "0 11px", fontSize: 14, color: COR_CRM.apagado, overflow: "hidden", whiteSpace: "nowrap" }}>Resumo na caixa de entrada</div>
            <div style={{ fontSize: 11.5, color: COR_CRM.suave, lineHeight: 1.3, marginTop: 5 }}>Aparece depois do assunto. Sem ele o cliente puxa o começo do corpo.</div>
          </div>
        </div>
        <div style={{ flex: 1, background: "#F3F5F6", display: "flex", justifyContent: "center", padding: "16px 0" }}>
          <div style={{ width: 620, background: "#FFFFFF", padding: "28px 38px", fontFamily: "Arial, sans-serif", fontSize: 16, lineHeight: 1.55, color: "#101828", border: "1px dashed #D0D5DD", boxSizing: "border-box", overflow: "hidden" }}>
            {blocos > 0 ? <div style={{ fontSize: 25, fontWeight: 700, marginBottom: 11 }}>Faz tempo que a gente não se vê</div> : null}
            {blocos > 1 ? <div style={{ marginBottom: 13 }}>Oi, {"{{primeiro_nome}}"}. Como ficou a reforma? Chegaram louças e metais novos na Loja Modelo, e separamos uma condição especial para quem já é cliente.</div> : null}
            {blocos > 2 ? <div style={{ height: 150, background: "linear-gradient(120deg, #E8DFD2, #CDBFAC)", borderRadius: 7, marginBottom: 13, display: "flex", alignItems: "center", justifyContent: "center", color: "#6B5D4C", fontWeight: 700, fontSize: 19, letterSpacing: 1 }}>LOUÇAS E METAIS</div> : null}
            {blocos > 3 ? <div style={{ display: "inline-block", background: "#047857", color: "#FFFFFF", fontWeight: 700, padding: "11px 26px", borderRadius: 6 }}>Ver as novidades</div> : null}
          </div>
        </div>
      </div>
    </CartaoCrm>
  </TelaCrm>
);

export const TelaEmailDominio: React.FC = () => (
  <TelaCrm ativo="email" relacionamento>
    <CabecaEmail aba="Configuração" />
    <div style={{ margin: "0 8px" }}>
      <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 11, padding: "12px 18px", color: "#065F46", fontSize: 14.5, lineHeight: 1.4, marginBottom: 13 }}>
        <div style={{ fontWeight: 600 }}>Antes de enviar, autentique seu domínio</div>
        E-mail marketing sai do <b>seu</b> domínio, não do nosso. Para o Gmail e o Outlook confiarem na mensagem, você publica no DNS os registros de SPF e DKIM abaixo, que provam que a Simplí pode enviar em seu nome. Sem isso, a maior parte dos e-mails cai no spam — por isso o módulo fica bloqueado até a verificação passar. O <b>DMARC</b> é um registro à parte, seu, e está explicado logo abaixo da tabela.
        <div style={{ fontSize: 13.5, marginTop: 5 }}><b>Dica:</b> use um subdomínio (ex.: mkt.suaempresa.com.br). Assim uma campanha com muitos descadastros não contamina a entrega dos seus e-mails do dia a dia.</div>
      </div>
      <CartaoCrm estilo={{ padding: "13px 18px", marginBottom: 13 }}>
        <div style={{ fontSize: 14, marginBottom: 6 }}>Domínio de envio</div>
        <div style={{ display: "flex", gap: 9 }}>
          <div style={{ flex: 1, height: 40, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, display: "flex", alignItems: "center", padding: "0 12px", color: COR_CRM.apagado, fontSize: 15 }}>mkt.suaempresa.com.br</div>
          <BotaoCrm icone="mais" primario>Adicionar</BotaoCrm>
        </div>
      </CartaoCrm>
      <CartaoCrm estilo={{ padding: "11px 18px", display: "flex", alignItems: "center", gap: 11, marginBottom: 13 }}>
        <span style={{ transform: "rotate(-90deg)", display: "flex" }}><Icone nome="seta" tam={14} /></span>
        <span style={{ fontSize: 17 }}>mkt.lojamodelo.com.br</span>
        <SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857"><span style={{ fontSize: 13.5 }}>Verificado</span></SeloCrm>
        <span style={{ flex: 1 }} />
        <BotaoCrm icone="girar">Verificar</BotaoCrm>
        <Icone nome="lixeira" tam={15} cor={COR_CRM.suave} />
      </CartaoCrm>
      <CartaoCrm estilo={{ padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 15.5, fontWeight: 600, marginBottom: 5 }}><Icone nome="xis" tam={15} /> Descadastros e bloqueios <SeloCrm fundo={COR_CRM.cinza} cor="#475467">14</SeloCrm></div>
        <div style={{ fontSize: 13.5, color: COR_CRM.suave }}>Quem está aqui <b>não recebe mais e-mail desta empresa</b> — a lista é aplicada no momento do disparo.</div>
      </CartaoCrm>
    </div>
  </TelaCrm>
);

const FUNIL_EMAIL = [["Enviados", 536, ""], ["Entregues", 528, "98.5%"], ["Abertos", 243, "46%"], ["Clicados", 61, "25.1%"], ["Agendaram", 9, "14.8%"]] as const;
const PESSOAS_EMAIL = [["Ana Beatriz Lemos", "ana@email.com", "Clicou", "20/10/2026, 14:15", "20/10/2026, 14:16"], ["Jéssica Matos", "jessica@email.com", "Abriu", "20/10/2026, 13:02", "—"]] as const;
export const TelaEmailRelatorio: React.FC = () => (
  <TelaCrm
    ativo="email"
    relacionamento
    sobre={
      <ModalCrm largura={1170} topo={36} titulo="Reativação em risco" sub="Faz tempo que a gente não se vê">
        <div style={{ padding: "15px 24px 18px" }}>
          <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 10, padding: "13px 18px", marginBottom: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Funil da campanha <span style={{ fontSize: 12.5, fontWeight: 400, color: COR_CRM.suave }}>% = conversão do estágio anterior</span></div>
            <div style={{ display: "flex", alignItems: "flex-end", height: 150, borderBottom: `1px solid ${COR_CRM.borda}` }}>
              {FUNIL_EMAIL.map(([r, n], i) => (
                <div key={r} style={{ flex: 1, height: "100%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", background: `linear-gradient(0deg, #E8F6EF ${i < 2 ? 80 : (n / 536) * 96}%, transparent 0)` }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{n}</div>
                  <div style={{ width: "56%", height: Math.max(6, (n / 536) * 118), background: "#059669", borderRadius: "4px 4px 0 0" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", marginTop: 7 }}>{FUNIL_EMAIL.map(([r, , p]) => <div key={r} style={{ flex: 1, textAlign: "center", fontSize: 13.5, color: "#475467" }}>{r}<div style={{ fontSize: 12.5, color: COR_CRM.suave, height: 16 }}>{p}</div></div>)}</div>
          </div>
          <div style={{ display: "flex", background: "#F6F8F7", borderRadius: 9, padding: 4, fontSize: 14.5, marginBottom: 11 }}>
            {["Todos (536)", "Abriram (243)", "Clicaram (61)", "Agendaram (9)", "Não abriram (285)", "Problemas (8)"].map((t, i) => <div key={t} style={{ flex: 1, textAlign: "center", padding: "7px 0", borderRadius: 6, color: i ? COR_CRM.suave : COR_CRM.texto, background: i === 0 ? "#FFFFFF" : "transparent" }}>{t}</div>)}
          </div>
          <div style={{ display: "flex", gap: 9, marginBottom: 11 }}>
            <div style={{ flex: 1, height: 38, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, display: "flex", alignItems: "center", gap: 7, padding: "0 12px", fontSize: 14.5, color: COR_CRM.suave }}><Icone nome="busca" tam={14} /> Buscar por nome ou e-mail...</div>
            <BotaoCrm icone="subir">Exportar</BotaoCrm>
          </div>
          <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 9, padding: "9px 14px", marginBottom: 11 }}>
            <div style={{ fontSize: 11.5, letterSpacing: 0.4, color: COR_CRM.suave, marginBottom: 5 }}>PÚBLICO USADO</div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, background: "#F6F8F7", borderRadius: 6, padding: "3px 9px" }}><Icone nome="email" tam={13} /> Clientes em risco</span>
          </div>
          <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 9, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.3fr .8fr 1.1fr 1.1fr", padding: "8px 14px", fontSize: 12, letterSpacing: 0.4, color: COR_CRM.suave, background: "#F6F8F7" }}><span>PESSOA</span><span>SITUAÇÃO</span><span>ABRIU</span><span>CLICOU</span></div>
            {PESSOAS_EMAIL.map(([n, e, st, a, c]) => <div key={n} style={{ display: "grid", gridTemplateColumns: "2.3fr .8fr 1.1fr 1.1fr", alignItems: "center", padding: "6px 14px", fontSize: 14, borderTop: `1px solid ${COR_CRM.borda}` }}><span style={{ lineHeight: 1.2 }}>{n}<br /><span style={{ fontSize: 12.5, color: COR_CRM.suave }}>{e}</span></span><span><SeloCrm fundo="#E0F2FE" cor="#0369A1">{st}</SeloCrm></span><span style={{ color: COR_CRM.suave }}>{a}</span><span style={{ color: COR_CRM.suave }}>{c}</span></div>)}
          </div>
        </div>
      </ModalCrm>
    }
  >
    <CabecaEmail aba="Campanhas" />
  </TelaCrm>
);

// ---------- Grupos de WhatsApp
export const TelaGrupos: React.FC = () => (
  <TelaCrm ativo="grupos" relacionamento>
    <div style={{ padding: "0 8px" }}>
      <Cabecalho titulo="Grupos de WhatsApp" descricao="Comunidades como canal de vendas: grupos, rotação, disparo e captura no CRM" />
      <AbasCrm abas={[["Projetos", "colunas"], ["Métricas", "dashboard"], ["Modelos", "modelo"], ["Disparos", "enviar"], ["Números", "celular"]]} ativa="Projetos" />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
        <div style={{ display: "flex", background: "#FFFFFF", borderRadius: 9, padding: 4 }}>
          {["7 dias", "14 dias", "21 dias", "28 dias", "90 dias"].map((t, i) => <div key={t} style={{ padding: "6px 13px", borderRadius: 6, fontSize: 15, color: i === 0 ? "#FFFFFF" : "#475467", background: i === 0 ? DEGRADE_ATIVO : "transparent" }}>{t}</div>)}
        </div>
        <span style={{ flex: 1 }} />
        <BotaoCrm icone="mais" primario>Novo Projeto</BotaoCrm>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 15 }}>
        {[["Clicks", "1.284", "últimos 7 dias", COR_CRM.texto], ["Entraram", "412", "últimos 7 dias", "#059669"], ["% de entrada", "32,1%", "últimos 7 dias", "#059669"], ["Saíram", "17", "últimos 7 dias", "#DC2626"], ["Participantes", "2.906", "", COR_CRM.texto], ["Grupos", "6", "", COR_CRM.texto], ["Grupos cheios", "5", "", "#D97706"], ["Grupos disponíveis", "1", "", COR_CRM.texto]].map(([r, v, s, c]) => (
          <CartaoCrm key={r} estilo={{ padding: "11px 16px" }}>
            <div style={{ fontSize: 13.5, color: COR_CRM.suave }}>{r}</div>
            <div style={{ fontSize: 23, fontWeight: 700, color: c, lineHeight: 1.2 }}>{v}</div>
            <div style={{ fontSize: 12, color: COR_CRM.suave, height: 15 }}>{s}</div>
          </CartaoCrm>
        ))}
      </div>
      <CartaoCrm>
        {[["Ofertas da Loja Modelo", "Grupo de ofertas semanais para clientes", "1.180", "5", "2.790", "96"], ["Profissionais da Obra", "Pedreiros, pintores e instaladores parceiros", "104", "1", "116", "4"]].map(([n, d, c, g, a, i], x) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderTop: x ? `1px solid ${COR_CRM.borda}` : "none" }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: "#101828", color: "#FFFFFF", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>LM</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 600 }}>{n} <SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857">ativo</SeloCrm></div>
              <div style={{ fontSize: 14, color: COR_CRM.suave }}>{d}</div>
            </div>
            {[[c, "clicks", "cursor"], [g, "grupos", "pacote"], [a, "ativos", "contatos"], [i, "inativos", "pessoa"]].map(([q, r, ic]) => <div key={r} style={{ textAlign: "center", width: 66 }}><div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 15.5, fontWeight: 700, color: r === "inativos" ? "#667085" : "#059669" }}><Icone nome={ic} tam={13} /> <span style={{ color: r === "clicks" || r === "grupos" ? COR_CRM.texto : "inherit" }}>{q}</span></div><div style={{ fontSize: 12.5, color: COR_CRM.suave }}>{r}</div></div>)}
            <Icone nome="lapis" tam={16} cor={COR_CRM.suave} />
            <Icone nome="lixeira" tam={16} cor={COR_CRM.suave} />
          </div>
        ))}
      </CartaoCrm>
    </div>
  </TelaCrm>
);

// ---------- SMS: novo disparo, sem custo na tela
const Passo: React.FC<{ n: number; t: string; children: React.ReactNode }> = ({ n, t, children }) => (
  <CartaoCrm estilo={{ padding: "13px 18px", marginBottom: 11 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, marginBottom: 9 }}>
      <span style={{ width: 21, height: 21, borderRadius: 11, background: COR_CRM.verdeClaro, color: "#047857", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
      {t}
    </div>
    {children}
  </CartaoCrm>
);
export const TelaSms: React.FC<{ publico?: string; agendar?: boolean; rolagem?: number }> = ({ publico = "Segmento", agendar, rolagem = 0 }) => (
  <TelaCrm ativo="sms" relacionamento>
    <div style={{ marginTop: -14, transform: `translateY(${-rolagem}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}><Icone nome="voltar" tam={20} cor={COR_CRM.suave} /><div style={{ fontSize: 26, fontWeight: 700 }}>Novo disparo de SMS</div></div>
      <Passo n={1} t="Nome do disparo"><div style={{ height: 38, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 15 }}>Reativação em risco</div></Passo>
      <Passo n={2} t="Mensagem">
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Mensagem <span style={{ fontWeight: 400, color: "#047857" }}>Inserir {"{link}"}</span></div>
            <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, padding: "9px 12px", fontSize: 15, height: 86, lineHeight: 1.4, boxSizing: "border-box" }}>Loja Modelo: louças e metais novos com condição especial para você até sexta.</div>
            <div style={{ fontSize: 14, fontWeight: 600, margin: "10px 0 4px" }}>Link de destino <span style={{ fontWeight: 400, color: COR_CRM.suave }}>(opcional)</span></div>
            <SeletorCrm texto="Sem link" estilo={{ width: "100%" }} />
            <div style={{ fontSize: 12.5, color: COR_CRM.suave, marginTop: 4 }}>Cada pessoa recebe um link curto próprio (33 caracteres), que mede quem clicou.</div>
            <div style={{ background: "#FEFCE8", border: "1px solid #FDE68A", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#92400E", lineHeight: 1.35, margin: "8px 0" }}>Só links aprovados pelo provedor vão no SMS. Para usar um link novo, submeta à aprovação: ele aparece aqui quando o provedor aprovar.<div style={{ marginTop: 6 }}><BotaoCrm estilo={{ height: 32, fontSize: 14 }}>Submeter à aprovação</BotaoCrm></div></div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14 }}><span style={{ width: 15, height: 15, borderRadius: 3, background: "#16A34A", color: "#FFFFFF", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span> Incluir "SAIR p/ cancelar" no fim</div>
          </div>
          <div style={{ width: 400 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>Como chega no celular</div>
            <div style={{ background: "#F3F5F6", borderRadius: 11, padding: "9px 13px" }}>
              <div style={{ fontSize: 12, color: COR_CRM.suave, marginBottom: 5 }}>De: 29389</div>
              <div style={{ background: "#FFFFFF", borderRadius: 13, padding: "7px 12px", fontSize: 13.5, lineHeight: 1.35 }}>Loja Modelo: louças e metais novos com condição especial para você até sexta. SAIR p/ cancelar</div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: COR_CRM.suave, marginTop: 6 }}>95/160 caracteres</div>
          </div>
        </div>
      </Passo>
      <Passo n={3} t="Público">
        <div style={{ display: "flex", gap: 5, background: "#F6F8F7", borderRadius: 8, padding: 4, marginBottom: 9 }}>
          {[["subir", "Planilha"], ["etiqueta", "Etiquetas"], ["contatos", "Classificação"], ["segmentacao", "Segmento"], ["documento", "Colar números"]].map(([i, t]) => <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 6, fontSize: 14, color: t === publico ? "#FFFFFF" : "#475467", background: t === publico ? "#22C55E" : "transparent" }}><Icone nome={i} tam={14} /> {t}</div>)}
        </div>
        <SeletorCrm texto="Clientes em risco · 536 pessoas" estilo={{ width: "100%", marginBottom: 9 }} />
        <BotaoCrm>Calcular público</BotaoCrm>
      </Passo>
      <Passo n={4} t="Enviar um teste (opcional)">
        <div style={{ display: "flex", gap: 9 }}><div style={{ width: 340, height: 38, border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 14.5, color: COR_CRM.suave }}>Seu celular com DDD</div><BotaoCrm icone="celular" estilo={{ color: COR_CRM.suave }}>Enviar teste</BotaoCrm></div>
      </Passo>
      <Passo n={5} t="Quando">
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 15 }}>
          {[["Agora", !agendar], ["Agendar", agendar]].map(([t, on]) => (
            <span key={t as string} style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 15, height: 15, borderRadius: 8, border: "1.5px solid #667085", background: on ? "#16A34A" : "#FFFFFF" }} />{t}</span>
          ))}
          {agendar ? <span style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, padding: "6px 12px" }}>21/10/2026, 10:00</span> : null}
        </div>
      </Passo>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><BotaoCrm icone="enviar" primario>Disparar</BotaoCrm></div>
    </div>
  </TelaCrm>
);

const CartaoSms: React.FC<{ r: string; v: string; s?: string; c?: string }> = ({ r, v, s, c }) => <CartaoCrm estilo={{ flex: 1, padding: "12px 18px", height: 104, boxSizing: "border-box" }}><div style={{ fontSize: 14, color: COR_CRM.suave }}>{r}</div><div style={{ fontSize: 24, fontWeight: 700, color: c ?? COR_CRM.texto, lineHeight: 1.3 }}>{v}</div><div style={{ fontSize: 13, color: COR_CRM.suave }}>{s}</div></CartaoCrm>;
const DISPAROS_SMS = [["Reativação em risco", "536", "521", "15", "0", "48", "9%"], ["Lembrete Semana do Piso", "980", "958", "22", "0", "71", "7%"]] as const;
export const TelaSmsPainel: React.FC = () => (
  <TelaCrm ativo="sms" relacionamento>
    <div style={{ padding: "0 8px", marginTop: -12 }}>
      <Cabecalho titulo="SMS" descricao="Dispare SMS e acompanhe a performance dos envios" direita={<BotaoCrm icone="mais" primario>Novo disparo</BotaoCrm>} />
      <AbasCrm abas={[["Painel", "dashboard"], ["Disparos", "enviar"], ["Respostas", "retorno"], ["Links", "anexo"]]} ativa="Painel" />
      <div style={{ display: "flex", alignItems: "center", marginBottom: 13 }}>
        <div style={{ display: "flex", background: "#FFFFFF", borderRadius: 9, padding: 4 }}>{["7 dias", "30 dias", "90 dias"].map((t, i) => <div key={t} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 15, color: i === 1 ? "#FFFFFF" : "#475467", background: i === 1 ? "#059669" : "transparent" }}>{t}</div>)}</div>
        <span style={{ flex: 1 }} /><span style={{ fontSize: 14, color: COR_CRM.suave, marginRight: 12 }}>dados até 11:03</span><BotaoCrm icone="girar">Atualizar</BotaoCrm>
      </div>
      <div style={{ display: "flex", gap: 13, marginBottom: 13 }}><CartaoSms r="Enviados" v="1.516" /><CartaoSms r="Entregues" v="1.479" c="#059669" /><CartaoSms r="Falhas" v="37" c="#DC2626" /><CartaoSms r="Incertos" v="0" /></div>
      <div style={{ display: "flex", gap: 13, marginBottom: 13 }}><CartaoSms r="Cliques únicos" v="119" s="154 no total" /><CartaoSms r="Taxa de clique" v="8%" s="cliques únicos ÷ entregues" c="#059669" /><CartaoSms r="Respostas" v="31" s="12 pediram para sair" /><div style={{ flex: 1 }} /></div>
      <CartaoCrm estilo={{ padding: "13px 20px" }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 7 }}>Por disparo</div>
        <div style={{ display: "grid", gridTemplateColumns: "2.3fr repeat(6, 1fr)", fontSize: 13.5, color: COR_CRM.suave, padding: "4px 0" }}>{["Disparo", "Enviados", "Entregues", "Falhas", "Incertos", "Cliques", "Taxa"].map((t, i) => <span key={t} style={{ textAlign: i ? "right" : "left" }}>{t}</span>)}</div>
        {DISPAROS_SMS.map((l) => <div key={l[0]} style={{ display: "grid", gridTemplateColumns: "2.3fr repeat(6, 1fr)", fontSize: 15, padding: "9px 0", borderTop: `1px solid ${COR_CRM.borda}` }}>{l.map((c, i) => <span key={i} style={{ textAlign: i ? "right" : "left" }}>{c}</span>)}</div>)}
      </CartaoCrm>
    </div>
  </TelaCrm>
);

// ---------- Prospecção
const ABAS_PROSP = [["Métricas", "dashboard"], ["SDR", "robo"], ["Popups", "modelo"], ["Formulários", "documento"], ["Sites", "globo"]] as const;
const CabecaProsp: React.FC<{ aba: string }> = ({ aba }) => (
  <div style={{ padding: "0 8px" }}>
    <Cabecalho titulo="Prospecção" descricao="Captura de leads em sites externos: instale um script, ative popups e receba os leads no Kanban" />
    <AbasCrm abas={ABAS_PROSP} ativa={aba} />
  </div>
);
const Regra: React.FC<{ t: string; on?: boolean }> = ({ t, on }) => <div style={{ flex: 1, height: 46, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, fontSize: 14.5, border: `1px solid ${on ? "#10B981" : COR_CRM.borda}`, background: on ? "#ECFDF5" : "#FFFFFF", color: on ? "#047857" : "#475467", fontWeight: on ? 600 : 400 }}>{t}</div>;
export const TelaSites: React.FC = () => (
  <TelaCrm ativo="prospeccao">
    <CabecaProsp aba="Sites" />
    <div style={{ padding: "0 8px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 13 }}>
        <span style={{ flex: 1, fontSize: 14.5, color: COR_CRM.suave }}>Cada site tem uma chave própria e a lista de domínios onde o widget pode rodar.</span>
        <BotaoCrm icone="mais" primario>Novo site</BotaoCrm>
      </div>
      <CartaoCrm estilo={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>Loja Modelo</span>
          <SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857">Ativo</SeloCrm>
          <span style={{ flex: 1 }} />
          <BotaoCrm icone="anexo" primario>Instalar</BotaoCrm>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 13.5, color: COR_CRM.suave, marginTop: 4 }}>pr_lojamodelo</div>
        <div style={{ fontSize: 14, color: COR_CRM.suave, marginTop: 2 }}>www.lojamodelo.com.br</div>
      </CartaoCrm>
    </div>
  </TelaCrm>
);
export const TelaPopups: React.FC<{ regra?: number }> = ({ regra = -1 }) => (
  <TelaCrm
    ativo="prospeccao"
    sobre={
      regra >= 0 ? (
        <ModalCrm largura={640} topo={110} titulo="Editar popup" sub="Reformando o banheiro? A gente ajuda a escolher.">
          <div style={{ padding: "16px 24px 22px" }}>
            <CampoCrm rotulo="Nome" valor="Captação de Leads" />
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 7 }}>Quando aparecer</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <Regra t="Após alguns segundos" on={regra === 0} />
              <Regra t="Ao rolar a página" on={regra === 1} />
              <Regra t="Ao tentar sair" on={regra === 2} />
            </div>
            <CampoCrm rotulo="Frequência" valor="1x por sessão" />
            <CampoCrm rotulo="Funil de destino" valor="whatsapp-loja-modelo · Novo Lead" />
          </div>
        </ModalCrm>
      ) : null
    }
  >
    <CabecaProsp aba="Popups" />
    <div style={{ padding: "0 8px" }}>
      <div style={{ display: "flex", marginBottom: 13 }}>
        <SeletorCrm texto="Loja Modelo" />
        <span style={{ flex: 1 }} />
        <BotaoCrm icone="mais" primario>Novo popup</BotaoCrm>
      </div>
      <CartaoCrm estilo={{ padding: "15px 20px", display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 17, fontWeight: 600 }}>Captação de Leads <SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857">Ativo</SeloCrm></div>
          <div style={{ fontSize: 14, color: COR_CRM.suave }}>Reformando o banheiro? A gente ajuda a escolher. · após segundos · 1x/sessão</div>
        </div>
        <span style={{ fontSize: 15, marginRight: 22 }}>Pausar</span>
        <Icone nome="lapis" tam={16} />
        <span style={{ width: 20 }} />
        <Icone nome="lixeira" tam={16} cor="#DC2626" />
      </CartaoCrm>
    </div>
  </TelaCrm>
);
const FORM = [
  ["Fale com um especialista", ["nome", "email", "telefone"], "www.lojamodelo.com.br/contato", "whatsapp-loja-modelo", "Novo Lead", "Site: Contato"],
  ["Peça seu orçamento", ["nome", "telefone", "obra"], "www.lojamodelo.com.br/orcamento", "Orçamentos", "Novo Lead", "Site: Orçamento"],
] as const;
export const TelaFormularios: React.FC = () => (
  <TelaCrm ativo="prospeccao">
    <CabecaProsp aba="Formulários" />
    <div style={{ padding: "0 8px" }}>
      <div style={{ display: "inline-flex", background: "#EEF1F4", borderRadius: 8, padding: 3, marginBottom: 9 }}>
        {["Criados por nós", "Detectados no site"].map((t, i) => <div key={t} style={{ padding: "6px 13px", borderRadius: 6, fontSize: 14.5, color: i ? COR_CRM.texto : COR_CRM.suave, background: i ? "#FFFFFF" : "transparent" }}>{t}</div>)}
      </div>
      <div style={{ fontSize: 14.5, color: COR_CRM.suave, marginBottom: 9 }}>Detecta os formulários que já existem no site (com email/telefone) e deixa você mandar cada um para um funil diferente.</div>
      <CartaoCrm estilo={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", marginBottom: 10 }}><SeletorCrm texto="Loja Modelo" /><span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 500 }}><span style={{ width: 15, height: 15, borderRadius: 3, background: "#16A34A", color: "#FFFFFF", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span> Detectar formulários deste site</span></CartaoCrm>
      <CartaoCrm>
        {FORM.map(([n, cs, u, f, e, t], i) => (
          <div key={n} style={{ padding: "13px 18px", borderTop: i ? `1px solid ${COR_CRM.borda}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 16 }}>{n} <span style={{ width: 15, height: 15, borderRadius: 3, background: "#16A34A", color: "#FFFFFF", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span> <span style={{ fontSize: 13.5, color: COR_CRM.suave }}>capturar</span></div>
            <div style={{ display: "flex", gap: 5, margin: "6px 0 4px" }}>{cs.map((c) => <span key={c} style={{ fontSize: 12, background: COR_CRM.cinza, borderRadius: 4, padding: "1px 7px" }}>{c}</span>)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13.5, color: "#047857", marginBottom: 9 }}><Icone nome="linkFora" tam={12} /> {u}</div>
            <div style={{ display: "flex", gap: 9 }}>
              {[["Funil", f], ["Etapa", e], ["Tag", t]].map(([r, v]) => <div key={r} style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>{r}</div><SeletorCrm texto={v} estilo={{ width: "100%" }} /></div>)}
            </div>
          </div>
        ))}
      </CartaoCrm>
    </div>
  </TelaCrm>
);

// ---------- Eventos: fundo, cabeçalho do evento e aba Campanhas
export const FundoEventos: React.FC = () => (
  <div style={{ marginTop: -14 }}>
    <Cabecalho sobre="Acompanhe vendas e metas de cada ação comercial" titulo="Eventos de Vendas" descricao="Crie eventos com período e metas; o módulo monitora as vendas reais e marca os clientes compradores com a tag." direita={<BotaoCrm icone="mais" primario>Novo evento</BotaoCrm>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>{[0, 1, 2, 3, 4, 5].map((i) => <CartaoCrm key={i} estilo={{ height: 210 }}><span /></CartaoCrm>)}</div>
  </div>
);
export const CabecaEvento: React.FC<{ nome: string; datas: string; dias: string[]; filtros: string[] }> = ({ nome, datas, dias, filtros }) => (
  <div style={{ padding: "16px 22px 12px", borderBottom: `1px solid ${COR_CRM.borda}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 17.5, fontWeight: 700, flex: 1, whiteSpace: "nowrap" }}>{nome} <SeloCrm fundo={COR_CRM.cinza} cor="#475467">Encerrado</SeloCrm></span>
      <BotaoCrm icone="lapis" estilo={{ height: 34, fontSize: 14 }}>Editar</BotaoCrm>
      <BotaoCrm icone="etiqueta" estilo={{ height: 34, fontSize: 14 }}>Aplicar tag</BotaoCrm>
      <BotaoCrm icone="documento" estilo={{ height: 34, fontSize: 14 }}>PDF</BotaoCrm>
      <BotaoCrm icone="anexo" estilo={{ height: 34, fontSize: 14 }}>CSV</BotaoCrm>
      <Icone nome="xis" tam={17} cor={COR_CRM.suave} />
    </div>
    <div style={{ fontSize: 13, color: COR_CRM.suave, marginBottom: 7 }}>{datas}</div>
    <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13.5, marginBottom: 8 }}>Dia: {["Evento todo", ...dias].map((t, i) => <span key={t} style={{ padding: "3px 12px", borderRadius: 999, background: i ? "#FFFFFF" : "#22C55E", color: i ? COR_CRM.texto : "#FFFFFF", border: `1px solid ${i ? COR_CRM.borda : "#22C55E"}` }}>{t}</span>)}</div>
    <div style={{ display: "flex", gap: 7 }}>{filtros.map((t) => <SeletorCrm key={t} texto={t} estilo={{ height: 32, fontSize: 14 }} />)}</div>
  </div>
);
const CartaoEv: React.FC<{ i: string; v: string; r: string; c: string }> = ({ i, v, r, c }) => (
  <div style={{ flex: 1, border: `1px solid ${COR_CRM.borda}`, borderRadius: 10, padding: "8px 11px" }}>
    <Icone nome={i} tam={15} cor={c} />
    <div style={{ fontSize: 16.5, fontWeight: 700, color: c, lineHeight: 1.3, whiteSpace: "nowrap" }}>{v}</div>
    <div style={{ fontSize: 11.5, color: COR_CRM.suave, lineHeight: 1.25 }}>{r}</div>
  </div>
);
const CAMPANHAS_EV = [
  ["sentimos_sua_falta", "29 Em risco", "20/10 às 10:00", "536", "29", "5,4%", "R$ 38.210,00", "69,5x"],
  ["Reativação em risco", "5 Em risco · 7 Ativos", "22/10 às 09:00", "536", "12", "2,2%", "R$ 15.640,00", "28,4x"],
  ["SMS Reativação", "1 Em risco · 3 Recorrentes", "24/10 às 10:00", "536", "7", "1,3%", "R$ 7.570,00", "13,8x"],
] as const;
export const TelaEventoCampanha: React.FC<{ valor?: string; compraram?: string }> = ({ valor = "R$ 61.420,00", compraram = "48" }) => (
  <TelaCrm
    ativo="eventos"
    sobre={
      <ModalCrm largura={900} topo={30}>
        <div style={{ height: 838, overflow: "hidden" }}>
          <CabecaEvento nome="REATIVAÇÃO EM RISCO" datas="20/10/2026 às 10:00 → 05/11/2026 às 23:59 · Todas as lojas" dias={["20/10", "21/10", "22/10", "23/10"]} filtros={["Vendedor", "Equipe"]} />
          <div style={{ padding: "9px 22px" }}>
            <AbasLinha abas={["Resumo", "Detalhamento", "Campanhas", "Gráficos", "Público"]} ativa="Campanhas" estilo={{ marginBottom: 11 }} />
            <div style={{ display: "flex", alignItems: "center", fontSize: 15.5, fontWeight: 600, marginBottom: 9 }}><span style={{ flex: 1 }}>Campanhas vinculadas <span style={{ fontSize: 13, fontWeight: 400, color: COR_CRM.suave }}>— 3 disparo(s)</span></span><BotaoCrm icone="anexo" estilo={{ height: 32, fontSize: 14 }}>Gerenciar</BotaoCrm></div>
            <div style={{ display: "flex", gap: 7, marginBottom: 11 }}>
              <CartaoEv i="enviar" v="1.608" r="Enviados" c="#0284C7" />
              <CartaoEv i="contatos" v={compraram} r="Compraram · ver lista" c="#059669" />
              <CartaoEv i="sobe" v="3,0%" r="Conversão" c="#EA580C" />
              <CartaoEv i="dolar" v={valor} r="Valor gerado" c="#059669" />
              <CartaoEv i="sobe" v="11,4%" r="% do faturado · do líquido do evento" c="#C026D3" />
              <CartaoEv i="sobe" v="111,7x" r="ROAS do evento · líquido do período / custo" c="#7C3AED" />
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#475467", marginBottom: 6 }}>QUEM COMPROU, POR CLASSIFICAÇÃO <span style={{ fontWeight: 400 }}>— dos 48 alcançados que compraram, na classificação que tinham na hora da compra</span></div>
            <div style={{ display: "flex", gap: 7, marginBottom: 11 }}>
              {[["1", "Novos · 2%", "#0284C7"], ["7", "Ativos · 15%", "#059669"], ["3", "Recorrentes · 6%", "#7C3AED"], ["2", "VIP · 4%", "#D97706"], ["35", "Em risco · 73%", "#EA580C"], ["0", "Inativos · 0%", "#475467"]].map(([n, r, c]) => (
                <div key={r} style={{ flex: 1, border: `1px solid ${COR_CRM.borda}`, borderRadius: 8, padding: "6px 10px" }}><div style={{ fontSize: 16, fontWeight: 700, color: c }}>{n}</div><div style={{ fontSize: 11.5, color: COR_CRM.suave }}>{r}</div></div>
              ))}
            </div>
            <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr .7fr .8fr .8fr 1.1fr .6fr", padding: "8px 13px", fontSize: 12.5, fontWeight: 600, color: "#475467" }}>
                <span>Campanha</span><span>Enviada</span><span>Enviados</span><span>Compraram</span><span>Conversão</span><span style={{ textAlign: "right" }}>Valor gerado</span><span style={{ textAlign: "right" }}>ROAS</span>
              </div>
              {CAMPANHAS_EV.map(([n, cl, d, e, q, c, v, r]) => (
                <div key={n} style={{ display: "grid", gridTemplateColumns: "2fr 1fr .7fr .8fr .8fr 1.1fr .6fr", alignItems: "center", height: 50, padding: "0 13px", fontSize: 13.5, borderTop: `1px solid ${COR_CRM.borda}` }}>
                  <span style={{ lineHeight: 1.25 }}>{n}<br /><span style={{ fontSize: 11.5, color: "#EA580C" }}>{cl}</span></span><span style={{ color: COR_CRM.suave }}>{d}</span><span>{e}</span><span style={{ color: "#16A34A" }}>{q}</span><span style={{ color: "#EA580C" }}>{c}</span><span style={{ textAlign: "right", color: "#059669", fontWeight: 600 }}>{v}</span><span style={{ textAlign: "right", color: "#7C3AED", fontWeight: 600 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ModalCrm>
    }
  >
    <FundoEventos />
  </TelaCrm>
);
