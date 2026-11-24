import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CartaoCrm, COR_CRM, FONTE_CRM, Icone } from "./Kit";

// Celular dentro do quadro 16:9. A tela é desenhada no tamanho real (390 x 844, como na captura)
// e a moldura escala por fora.
export const CSS_CEL = { largura: 390, altura: 844 };

export const Moldura: React.FC<{ escala?: number; children: React.ReactNode; estilo?: React.CSSProperties }> = ({ escala = 1, children, estilo }) => (
  <div style={{ position: "absolute", width: CSS_CEL.largura + 24, height: CSS_CEL.altura + 24, padding: 12, boxSizing: "border-box", borderRadius: 56, background: "#0B0B0C", boxShadow: "0 0 0 2px #3A3F3B, 0 30px 80px rgba(0,0,0,0.6)", transform: `scale(${escala})`, transformOrigin: "0 0", ...estilo }}>
    <div style={{ width: CSS_CEL.largura, height: CSS_CEL.altura, borderRadius: 44, overflow: "hidden", position: "relative", background: "#FFFFFF", fontFamily: FONTE_CRM }}>{children}</div>
  </div>
);

const Numero: React.FC<{ rotulo: string; valor: number; cor: string }> = ({ rotulo, valor, cor }) => (
  <CartaoCrm estilo={{ padding: "8px 13px", width: 166, height: 74, boxSizing: "border-box" }}>
    <div style={{ fontSize: 12.5, color: COR_CRM.suave, lineHeight: 1.25 }}>{rotulo}</div>
    <div style={{ fontSize: 21, fontWeight: 700, color: cor }}>{valor}</div>
  </CartaoCrm>
);

const Cliente: React.FC<{ nome: string; classe: string; ultima: string; feito?: boolean; aceso?: boolean; retorno?: boolean; azul?: boolean }> = ({ nome, classe, ultima, feito, aceso, retorno, azul }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 21px", borderTop: `1px solid ${COR_CRM.borda}`, background: aceso ? "#ECFDF5" : "#FFFFFF" }}>
    <div style={{ width: 20, height: 20, borderRadius: 4, border: `1.5px solid ${feito ? COR_CRM.verdeEscuro : "#667085"}`, background: feito ? COR_CRM.verdeEscuro : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#FFFFFF", fontSize: 13 }}>{feito ? "✓" : ""}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nome}</span>
        <span style={{ fontSize: 10.5, fontWeight: 600, color: "#667085", background: COR_CRM.cinza, borderRadius: 999, padding: "1px 8px", flexShrink: 0 }}>{classe}</span>
      </div>
      <div style={{ fontSize: 12.5, color: COR_CRM.suave }}>{ultima}</div>
      <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 600, color: retorno ? "#6D28D9" : "#0369A1", background: retorno ? "#EDE9FE" : "#E0F2FE", borderRadius: 999, padding: "1px 8px", marginTop: 3 }}>{retorno ? "Follow-up 1" : "Primeiro contato"}</span>
    </div>
    <div style={{ width: 38, height: 30, borderRadius: 8, background: azul ? "#DBEAFE" : COR_CRM.verdeClaro, boxShadow: azul ? "0 0 0 2px #3B82F6" : "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icone nome="chat" tam={16} cor={azul ? "#1D4ED8" : COR_CRM.verdeEscuro} />
    </div>
  </div>
);

const SUGESTAO = "Oi, Marcos! Aqui é o Rafael, da Loja Modelo. Como ficou o banheiro? Chegaram louças e metais novos, posso te mostrar?";

const PainelCompras: React.FC<{ sobe: number }> = ({ sobe }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "rgba(16,24,40,0.45)", opacity: sobe }} />
    <div style={{ position: "absolute", left: 16, right: 16, bottom: 64, top: 42, background: "#FFFFFF", borderRadius: "20px 20px 0 0", transform: `translateY(${(1 - sobe) * 780}px)` }}>
      <div style={{ padding: "22px 24px 14px", borderBottom: `1px solid ${COR_CRM.borda}` }}>
        <div style={{ fontSize: 19, fontWeight: 700 }}>MARCOS OLIVEIRA</div>
        <div style={{ fontSize: 14, color: COR_CRM.suave }}>Última compra: há 110 dias</div>
      </div>
      <div style={{ padding: "14px 24px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 13 }}>
          <span style={{ fontSize: 13.5, color: COR_CRM.verdeEscuro, textDecoration: "underline" }}>5581900001234</span>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: "#475467", background: COR_CRM.cinza, borderRadius: 999, padding: "1px 8px" }}>EM RISCO</span>
        </div>
        <div style={{ border: `1px solid ${COR_CRM.borda}`, borderRadius: 10 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: 0.5, color: COR_CRM.suave, padding: "9px 13px", borderBottom: `1px solid ${COR_CRM.borda}` }}>COMPRAS (MAIS RECENTE PRIMEIRO)</div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 13px 6px" }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>18/07/2026 · Loja 1</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: COR_CRM.verdeEscuro }}>R$ 6.840,00</div>
          </div>
          <div style={{ padding: "0 13px 11px", fontSize: 11, color: "#475467", lineHeight: 1.5, borderBottom: `1px solid ${COR_CRM.borda}` }}>
            PORCELANATO ACETINADO AREIA 60X60 · 72 m²<br />ARGAMASSA AC-III CINZA 20 KG · 28 un
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 13px" }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>11/07/2026 · Loja 1</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: COR_CRM.verdeEscuro }}>R$ 1.215,40</div>
          </div>
        </div>
      </div>
    </div>
  </>
);

// tela "Clientes pra contatar": os estados seguem a fala (compras abertas, mensagem copiada, contato feito)
export const TelaVendedor: React.FC<{ comprasDe?: number; comprasAte?: number; copiado?: boolean; feito?: boolean; abordagens?: number; rodada?: number; retornos?: boolean; digital?: boolean }> = ({ comprasDe = 1e6, comprasAte = 2e6, copiado, feito, abordagens = 0, rodada = 1, retornos, digital }) => {
  const frame = useCurrentFrame();
  const sobe = interpolate(frame, [comprasDe, comprasDe + 12, comprasAte, comprasAte + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, background: COR_CRM.fundo, color: COR_CRM.texto }}>
      <div style={{ padding: "18px 24px 0" }}>
        <div style={{ fontSize: 23, fontWeight: 700 }}>Clientes pra contatar</div>
        <div style={{ fontSize: 13.5, color: COR_CRM.suave, lineHeight: 1.35, marginTop: 2 }}>Sua lista de clientes da loja. Clique no WhatsApp, converse e marque o contato.</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#475467", background: "#FFFFFF", border: `1px solid ${COR_CRM.borda}`, borderRadius: 8, padding: "4px 11px", marginTop: 8 }}>
          <Icone nome="relogio" tam={13} /> Lembretes e tarefas
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 11 }}>
          <Numero rotulo="Pendentes" valor={feito ? 49 : 50} cor="#D97706" />
          <Numero rotulo="Clientes contatados" valor={feito ? 1 : 0} cor={COR_CRM.verdeEscuro} />
          <Numero rotulo="Abordagens realizadas" valor={feito ? 1 : 0} cor="#6D28D9" />
        </div>
      </div>
      <div style={{ margin: "14px 24px 0", background: "#EEF1F4", borderRadius: 9, padding: 3, display: "flex" }}>
        <div style={{ flex: 1, background: "#FFFFFF", borderRadius: 7, textAlign: "center", fontSize: 14.5, padding: "6px 0" }}>Pendentes</div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 14.5, padding: "6px 0", color: COR_CRM.suave }}>Contatados</div>
      </div>
      <div style={{ margin: "13px 3px 0", background: "#FFFFFF", borderRadius: 14, border: `1px solid ${COR_CRM.borda}`, overflow: "hidden" }}>
        <div style={{ padding: "14px 21px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.25 }}>Reativação - Clientes em risco</div>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: "#475467", background: COR_CRM.cinza, borderRadius: 999, padding: "2px 9px", whiteSpace: "nowrap" }}>Rodada {rodada}</span>
          </div>
          <div style={{ fontSize: 12, color: COR_CRM.suave }}>{feito ? 49 : 50} pendentes</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COR_CRM.suave, marginTop: 7 }}>
            <span>Abordagens da rodada</span>
            <span>{abordagens} de 50</span>
          </div>
          <div style={{ height: 6, background: COR_CRM.cinza, borderRadius: 3, marginTop: 4, overflow: "hidden" }}>
            <div style={{ width: `${abordagens * 2}%`, height: "100%", background: COR_CRM.verde }} />
          </div>
        </div>
        <div style={{ padding: "9px 21px 12px", borderTop: `1px solid ${COR_CRM.borda}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, fontWeight: 600, letterSpacing: 0.5, color: COR_CRM.suave, marginBottom: 6 }}>
            SUGESTÃO DE MENSAGEM
            <span style={{ display: "flex", transform: "rotate(180deg)" }}>
              <Icone nome="seta" tam={13} />
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: copiado ? "#D1FAE5" : "#F4F6F6", borderRadius: 9, padding: "8px 11px", fontSize: 12.5, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{SUGESTAO}</div>
            <div style={{ width: 37, height: 37, borderRadius: 9, background: COR_CRM.verdeClaro, display: "flex", alignItems: "center", justifyContent: "center", color: COR_CRM.verdeEscuro, fontSize: 17, flexShrink: 0 }}>{copiado ? "✓" : <Icone nome="copiar" tam={17} cor={COR_CRM.verdeEscuro} />}</div>
          </div>
        </div>
        <Cliente nome="MARCOS OLIVEIRA" classe="EM RISCO" ultima="Última compra: há 110 dias" feito={feito} aceso retorno={retornos} azul={digital} />
        <Cliente nome="RENATA DIAS" classe="EM RISCO" ultima="Última compra: há 97 dias" azul={digital} />
      </div>
      <PainelCompras sobe={sobe} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: "#000000", display: "flex", alignItems: "center", justifyContent: "space-around", color: "#FFFFFF", fontSize: 12 }}>
        {(digital ? ([["dashboard", "Dashboard"], ["tarefas", "Tarefas"], ["chat", "Simplí Chat"], ["gestaoTarefas", "Gestão"], ["linhas", "Mais"]] as const) : ([["tarefas", "Tarefas"], ["config", "Ajustes"]] as const)).map(([i, t]) => (
          <div key={t} style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 30, background: t === "Tarefas" ? "#22C55E" : "transparent", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2px" }}>
              <Icone nome={i} tam={17} cor="#FFFFFF" />
            </div>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

// celular com o sistema instalado: notificações de mensagem nova, menção e follow-up
export const TelaNotificacoes: React.FC<{ de: readonly number[] }> = ({ de }) => {
  const frame = useCurrentFrame();
  const itens = [
    ["Mensagem nova", "Marcos Oliveira: Bom dia, Rafael!"],
    ["Você foi mencionado", "Camila: @Rafael confere o frete do Marcos?"],
    ["Follow-up", "Orçamento em aberto: Marcos, R$ 6.840,00"],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0F2A20, #0B0B0C)", color: "#FFFFFF" }}>
      <div style={{ textAlign: "center", fontSize: 54, fontWeight: 600, paddingTop: 66 }}>09:41</div>
      <div style={{ textAlign: "center", fontSize: 15, opacity: 0.7, marginBottom: 34 }}>sexta-feira</div>
      {itens.map(([t, x], i) => {
        const k = interpolate(frame, [de[i], de[i] + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={t} style={{ margin: "0 15px 11px", padding: "11px 14px", borderRadius: 16, background: "rgba(255,255,255,0.15)", opacity: k, transform: `translateY(${(1 - k) * 18}px)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, opacity: 0.75, marginBottom: 3 }}><span>Simplí CRM</span><span>agora</span></div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{t}</div>
            <div style={{ fontSize: 14, lineHeight: 1.3 }}>{x}</div>
          </div>
        );
      })}
    </div>
  );
};
