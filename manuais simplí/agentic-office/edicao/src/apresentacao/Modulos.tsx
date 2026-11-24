import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COR, Icone, rota } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Surge } from "../verbas/Montagem";
import { TelaPainel } from "../verbas/Telas";
import { CENTRO } from "./Agentes";
import { Abas, Avatar, Botao, Cartao, CenaJanela, Chip, MENU_MODULOS, OUTROS, rampa, Titulo } from "./comum";

type P = { readonly c: Cena };

// ---------- modulos-1: os sete módulos prontos (4 em cima, 3 embaixo)
const MODULOS: [string, string, string][] = [
  ["gestao", "Vendas 360", "vendas por todos os ângulos"],
  ["rastreio", "Rastreabilidade", "produto e pedido, ponta a ponta"],
  ["estoque", "Inteligência de Estoque", "previsão e compra"],
  ["comercial", "Inteligência Comercial", "vendas e preços"],
  ["verbas", "Verbas e Acordos", "o que o fornecedor deve"],
  ["conciliacao", "Conciliação bancária", "extrato × ERP"],
  ["prospeccao", "Prospecção", "leads para o CRM"],
];
export const Modulos1: React.FC<P> = ({ c }) => {
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 150, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 70, color: "white" }}>
          módulos <span style={textoDegrade}>prontos</span>
        </div>
      </Surge>
      {MODULOS.map(([ic, nome, sub], i) => {
        const linha = i < 4 ? 0 : 1;
        const x = linha === 0 ? 155 + i * 410 : 360 + (i - 4) * 410;
        return (
          <Surge key={nome} de={m("módulos") - 4 + i * 4} style={{ left: x, top: 320 + linha * 250 }}>
            <div style={{ width: 380, height: 220, boxSizing: "border-box", borderRadius: 20, background: "#141815", border: `2px solid ${VERDE}`, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
              <Icone nome={ic} tam={56} cor={VERDE} />
              <div style={{ ...TITULO, fontSize: 30, color: "white", lineHeight: 1.1 }}>{nome}</div>
              <div style={{ fontFamily, fontWeight: 600, fontSize: 21, color: "#9AA19C" }}>{sub}</div>
            </div>
          </Surge>
        );
      })}
    </>
  );
};

// ---------- modulos-2: Inteligência de Estoque
const PREVISTO = [62, 58, 71, 66, 80, 77, 85, 82, 90, 88];
const REAL = [60, 61, 69, 70, 76, 79, 83, 86, 87];
const Linha: React.FC<{ readonly v: readonly number[]; readonly w: number; readonly h: number; readonly cor: string; readonly k: number; readonly tracejada?: boolean }> = ({ v, w, h, cor, k, tracejada }) => {
  const n = Math.max(2, Math.ceil(v.length * k));
  const pts = v
    .slice(0, n)
    .map((y, i) => `${(i / (PREVISTO.length - 1)) * w},${h - ((y - 50) / 45) * h}`)
    .join(" ");
  return <polyline points={pts} fill="none" stroke={cor} strokeWidth={4} strokeDasharray={tracejada ? "10 8" : undefined} strokeLinecap="round" strokeLinejoin="round" />;
};
export const Modulos2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const abas: [string, number][] = [
    ["Previsão", m("demanda")],
    ["Validação", m("acerto")],
    ["Ações", m("compras")],
    ["Sortimento", m("sortimento")],
  ];
  const acesa = [...abas].reverse().find(([, f]) => frame >= f - 4)?.[0];
  const grafico = rampa(frame, m("demanda") - 4, 40);
  return (
    <CenaJanela ativo="Inteligência de Estoque" menu={MENU_MODULOS} quadros={rota(CENTRO, [], c.dur)}>
      <Titulo icone="estoque" titulo="INTELIGÊNCIA DE ESTOQUE" descricao="O que comprar e remanejar hoje, a previsão de venda por produto e loja e quanto ela acertou." />
      <Abas x={40} y={150} abas={["Ações", "Previsão", "Validação", "Campanhas", "Sortimento"]} ativa="Ações" acesa={acesa} />
      {(
        [
          ["Comprar", "412 linhas", "R$ 1.284.300 · 96 urgentes"],
          ["CD → lojas", "238 linhas", "R$ 205.410 · 61 urgentes"],
          ["Entre lojas", "151 linhas", "R$ 98.770 · 33 urgentes"],
        ] as const
      ).map(([r, v, n], i) => (
        <Cartao key={r} x={40 + i * 425} y={230} w={405} h={130} aceso={acesa === "Ações" && i === 0}>
          <div style={{ fontSize: 18, color: COR.suave }}>{r}</div>
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 4 }}>{v}</div>
          <div style={{ fontSize: 16, color: COR.suave, marginTop: 2 }}>{n}</div>
        </Cartao>
      ))}
      <Cartao x={40} y={390} w={840} h={450} aceso={acesa === "Previsão"}>
        <div style={{ fontSize: 21, fontWeight: 700 }}>Porcelanato Areia 60x60 · loja Centro</div>
        <div style={{ fontSize: 16, color: COR.suave, marginTop: 4 }}>
          <span style={{ color: VERDE }}>━</span> venda real <span style={{ color: "#F5B82E", marginLeft: 14 }}>┅</span> previsão
        </div>
        <svg width={780} height={300} style={{ marginTop: 26, overflow: "visible" }}>
          <Linha v={PREVISTO} w={780} h={300} cor="#F5B82E" k={grafico} tracejada />
          <Linha v={REAL} w={780} h={300} cor={VERDE} k={grafico} />
        </svg>
      </Cartao>
      <Cartao x={900} y={390} w={400} h={210} aceso={acesa === "Validação"}>
        <div style={{ fontSize: 18, color: COR.suave }}>Acerto da previsão · semana 44</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: VERDE, marginTop: 8 }}>87%</div>
        <div style={{ fontSize: 16, color: COR.suave }}>medido toda segunda às 05:00</div>
      </Cartao>
      <Cartao x={900} y={620} w={400} h={220} aceso={acesa === "Sortimento"}>
        <div style={{ fontSize: 18, color: COR.suave }}>Sortimento</div>
        <div style={{ fontSize: 22, marginTop: 10, lineHeight: 1.5 }}>
          <b style={{ color: "#F5B82E" }}>38 itens</b> parados há 90 dias
          <br />
          <b>R$ 64 mil</b> liberados se cortar
        </div>
      </Cartao>
    </CenaJanela>
  );
};

// ---------- modulos-3: Inteligência Comercial (monitoramento de preços)
const CONCORRENTES: [string, number][] = [
  ["Casa & Obra", 74.9],
  ["Constrular", 77.5],
  ["Piso Fácil", 82.0],
];
const preco = (v: number) => "R$ " + v.toFixed(2).replace(".", ",");
export const Modulos3: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const conc = m("concorrência") - 6;
  const sugerido = m("sugerido") - 4;
  const margem = m("margem") - 4;
  return (
    <CenaJanela ativo="Inteligência Comercial" menu={MENU_MODULOS} quadros={rota(CENTRO, [[sugerido, 1.1, 1000, 500]], c.dur)}>
      <Titulo icone="comercial" titulo="INTELIGÊNCIA COMERCIAL" descricao="Sugestões de venda e o preço da concorrência, com o preço sugerido para cada produto." />
      <Abas x={40} y={150} abas={["Sugestão de vendas", "AI Price Watch"]} ativa={frame >= conc ? "AI Price Watch" : "Sugestão de vendas"} acesa={frame < conc ? "Sugestão de vendas" : undefined} />
      <Cartao x={40} y={230} w={560} h={610}>
        <div style={{ fontSize: 15, color: COR.suave }}>PRODUTO MONITORADO</div>
        <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>Porcelanato Areia 60x60 (m²)</div>
        <div style={{ fontSize: 20, color: COR.suave, marginTop: 14 }}>
          Nosso preço: <b style={{ color: "white" }}>R$ 79,90</b>
        </div>
        <div style={{ fontFamily: fonteMono, fontSize: 15, letterSpacing: 2, color: VERDE, marginTop: 30 }}>CONCORRENTES</div>
        {CONCORRENTES.map(([n, v], i) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", fontSize: 22, marginTop: 18, paddingBottom: 14, borderBottom: `1px solid ${COR.borda}`, opacity: rampa(frame, conc + i * 6, 8) }}>
            <span>{n}</span>
            <b>{preco(v)}</b>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, marginTop: 18, color: COR.suave, opacity: rampa(frame, conc + 20, 8) }}>
          <span>Média dos concorrentes</span>
          <b>R$ 78,13</b>
        </div>
      </Cartao>
      <Cartao x={630} y={230} w={670} h={300} aceso={frame >= sugerido} style={{ opacity: rampa(frame, sugerido, 10) }}>
        <div style={{ fontSize: 18, color: COR.suave }}>Preço sugerido</div>
        <div style={{ fontSize: 72, fontWeight: 700, color: VERDE, marginTop: 6 }}>R$ 76,90</div>
        <div style={{ fontSize: 19, color: COR.texto, marginTop: 6 }}>abaixo da média dos concorrentes, sem sair da regra de margem</div>
      </Cartao>
      <Cartao x={630} y={550} w={670} h={140} aceso={frame >= margem} style={{ opacity: rampa(frame, margem, 10), display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: VERDE, color: "#0B0B0C", display: "grid", placeItems: "center", fontSize: 34, fontWeight: 800 }}>✓</div>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>Margem de 23,1%</div>
          <div style={{ fontSize: 18, color: COR.suave }}>margem mínima da empresa: 22%</div>
        </div>
      </Cartao>
    </CenaJanela>
  );
};

// ---------- modulos-4: Verbas e Acordos (telas do vídeo do módulo) + Conciliação bancária
const EXTRATO: [string, string, string, string, boolean][] = [
  ["01/10", "PIX RECEBIDO · CLIENTE 3321", "R$ 4.280,00", "Venda 48.102", true],
  ["01/10", "TED · CERÂMICA AURORA", "R$ 8.000,00", "Verba ACD-0214", true],
  ["02/10", "BOLETO PAGO · FRETE SUL", "-R$ 1.940,00", "Título 7.731", true],
  ["02/10", "TARIFA BANCÁRIA", "-R$ 58,90", "—", false],
  ["03/10", "CARTÃO · LOTE 228", "R$ 12.415,30", "Lote 228", true],
];
export const Modulos4: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const troca = m("Conciliação") - 8;
  const verbas = interpolate(frame, [troca, troca + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const linha = m("confere") - 4;
  return (
    <>
      {verbas > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: verbas }}>
          <CenaJanela ativo="Verbas e Acordos" menu={MENU_MODULOS} quadros={rota(CENTRO, [], c.dur)}>
            <TelaPainel conta={m("controla") - 4} destaque={-1} />
          </CenaJanela>
        </div>
      )}
      {frame >= troca && (
        <div style={{ position: "absolute", inset: 0, opacity: rampa(frame, troca, 10) }}>
          <CenaJanela ativo="Conciliação" menu={MENU_MODULOS} quadros={rota(CENTRO, [], c.dur)}>
            <Titulo icone="conciliacao" titulo="CONCILIAÇÃO BANCÁRIA" descricao="Banco Exemplo · conta 12345-6 · outubro de 2026 · extrato conferido contra o ERP." />
            <div style={{ position: "absolute", left: 40, top: 160, display: "flex", gap: 14 }}>
              <Chip cheio>4 CONCILIADAS</Chip>
              <Chip cor="#F5B82E">1 PARA REVISAR</Chip>
            </div>
            <div style={{ position: "absolute", left: 40, right: 40, top: 220, display: "grid", gridTemplateColumns: "90px 1fr 190px 60px 220px", fontSize: 17, color: COR.suave, padding: "0 16px" }}>
              <span>Data</span>
              <span>Extrato do banco</span>
              <span>Valor</span>
              <span />
              <span>No ERP</span>
            </div>
            {EXTRATO.map(([d, t, v, erp, ok], i) => {
              const k = rampa(frame, linha + i * 7, 6);
              return (
                <Cartao key={t} x={40} y={260 + i * 100} w={1260} h={84} aceso={k > 0.5 && ok} style={{ display: "grid", gridTemplateColumns: "90px 1fr 190px 60px 220px", alignItems: "center", fontSize: 19, padding: "0 16px", borderColor: k > 0.5 && !ok ? "#F5B82E" : undefined }}>
                  <span style={{ color: COR.suave }}>{d}</span>
                  <span style={{ fontWeight: 600 }}>{t}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{v}</span>
                  <span style={{ fontSize: 26, color: ok ? VERDE : "#F5B82E", opacity: k }}>{ok ? "✓" : "!"}</span>
                  <span style={{ color: ok ? COR.texto : "#F5B82E", opacity: k }}>{ok ? erp : "sem lançamento"}</span>
                </Cartao>
              );
            })}
          </CenaJanela>
        </div>
      )}
    </>
  );
};

// ---------- modulos-5: Prospecção com a Bruna
const CAMPANHAS: [string, string, number, number, number][] = [
  ["Lojas de acabamento · Recife", "Google Maps", 227, 41, 0],
  ["Construtoras · Fortaleza", "LinkedIn", 180, 36, 0],
  ["Arquitetos · Natal", "LinkedIn", 96, 22, 0],
];
export const Modulos5: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const maps = frame >= m("Google") - 4 && frame < m("LinkedIn") - 4;
  const linkedin = frame >= m("LinkedIn") - 4 && frame < m("qualifica") - 4;
  const qualifica = frame >= m("qualifica") - 4;
  const crm = m("CRM") - 4;
  const bruna = OUTROS.bruna;
  return (
    <CenaJanela ativo="Prospecção" menu={MENU_MODULOS} quadros={rota(CENTRO, [], c.dur)}>
      <Titulo
        icone="prospeccao"
        titulo="PROSPECÇÃO"
        descricao="Cada campanha é uma busca de leads com filtros, ritmo e recorrência. Confira e mande ao CRM."
        direita={
          <Botao cheio icone="mais">
            Nova prospecção
          </Botao>
        }
      />
      <Cartao x={40} y={170} w={1260} h={110} style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Avatar nome={bruna.nome} cor={bruna.cor} foto={bruna.foto} tam={70} />
        <div>
          <div style={{ fontSize: 23, fontWeight: 700 }}>A Bruna monta a busca e qualifica cada contato</div>
          <div style={{ fontSize: 18, color: COR.suave, marginTop: 4 }}>Você confere o resultado e decide quando mandar ao CRM.</div>
        </div>
      </Cartao>
      {CAMPANHAS.map(([nome, fonte, leads, qual], i) => {
        const fonteAcesa = (fonte === "Google Maps" && maps) || (fonte === "LinkedIn" && linkedin);
        const enviados = Math.round(qual * rampa(frame, crm + i * 4, 18));
        return (
          <Cartao key={nome} x={40 + i * 425} y={310} w={405} h={520} aceso={fonteAcesa}>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3, minHeight: 58 }}>{nome}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Chip cheio={fonteAcesa}>{fonte.toUpperCase()}</Chip>
              <Chip cor={COR.suave}>TODA SEMANA</Chip>
            </div>
            {(
              [
                ["leads", String(leads), false],
                ["qualificados", String(qual), qualifica],
                ["no CRM", String(enviados), frame >= crm],
              ] as const
            ).map(([r, v, aceso]) => (
              <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 26, paddingBottom: 12, borderBottom: `1px solid ${COR.borda}` }}>
                <span style={{ fontSize: 19, color: COR.suave }}>{r}</span>
                <span style={{ fontSize: 36, fontWeight: 700, color: aceso ? VERDE : "white" }}>{v}</span>
              </div>
            ))}
            <Botao verde={frame >= crm} style={{ marginTop: 26 }}>
              Enviar ao CRM
            </Botao>
          </Cartao>
        );
      })}
    </CenaJanela>
  );
};
