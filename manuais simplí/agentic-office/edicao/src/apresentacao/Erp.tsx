import type React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COR, Icone, rota } from "../agentic/App";
import { type Cena, marca } from "../ana/voz";
import { CINZA, fontFamily, fonteMono, textoDegrade, TITULO, VERDE } from "../fonte";
import { Etiqueta, Surge } from "../verbas/Montagem";
import { CENTRO } from "./Agentes";
import { Abas, atual, Barras, Botao, Cartao, CenaJanela, Chip, Kpi, MENU_MODULOS, MENU_ORGANIZACAO, rampa, Titulo } from "./comum";

type P = { readonly c: Cena; readonly extras?: boolean };

export const Banco: React.FC<{ readonly tam?: number; readonly cor?: string }> = ({ tam = 120, cor = VERDE }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={1.4} strokeLinecap="round">
    <ellipse cx={12} cy={5} rx={8} ry={3} />
    <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </svg>
);
const Cadeado: React.FC<{ readonly tam?: number }> = ({ tam = 40 }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke="#0B0B0C" strokeWidth={2.2} strokeLinecap="round">
    <rect x={5} y={11} width={14} height={10} rx={2} />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

// ---------- erp-1: Agentic Office ⇄ banco de dados da empresa
export const Erp1: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const liga = rampa(frame, m("conexão") - 6, 16);
  const fluxo = (frame * 3) % 40;
  return (
    <>
      <Surge de={m("diferencial") - 8} style={{ left: 0, right: 0, top: 150, textAlign: "center" }}>
        <Etiqueta>O GRANDE DIFERENCIAL</Etiqueta>
      </Surge>
      <Surge de={m("Agentic") - 6} style={{ left: 200, top: 400 }}>
        <div style={{ width: 520, height: 240, borderRadius: 24, background: "#141815", border: "1px solid #2A2F2B", display: "grid", placeItems: "center" }}>
          <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 420 }} />
        </div>
      </Surge>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <line x1={720} y1={520} x2={720 + 480 * liga} y2={520} stroke={VERDE} strokeWidth={6} strokeDasharray="22 18" strokeDashoffset={-fluxo} strokeLinecap="round" />
      </svg>
      {liga >= 1 && (
        <div style={{ position: "absolute", left: 925, top: 485, width: 70, height: 70, borderRadius: "50%", background: VERDE, display: "grid", placeItems: "center", boxShadow: "0 0 40px rgba(60,224,30,0.6)" }}>
          <Cadeado />
        </div>
      )}
      <Surge de={m("banco") - 6} style={{ left: 1200, top: 370 }}>
        <div style={{ width: 520, height: 300, borderRadius: 24, background: "#141815", border: `2px solid ${VERDE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 0 70px rgba(60,224,30,0.25)" }}>
          <Banco tam={110} />
          <div style={{ ...TITULO, fontSize: 38, color: "white", textAlign: "center", lineHeight: 1.1 }}>
            o banco de dados
            <br />
            <span style={textoDegrade}>da sua empresa</span>
          </div>
        </div>
      </Surge>
    </>
  );
};

// ---------- erp-2: as duas formas de conexão (banco de dados ou MCP), por canal seguro e só leitura
const CONEXOES: [string, string, string][] = [
  ["Banco de dados", "Conexão direta ao banco do seu sistema de gestão, com um usuário somente leitura.", "banco"],
  ["Conexão MCP", "O sistema de gestão entrega os dados por um servidor MCP, no formato que os agentes entendem.", "MCP"],
];
export const Erp2: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const aceso = atual(
    frame,
    CONEXOES.map(([, , p]) => m(p)),
  );
  const seguro = m("seguro") - 4;
  const leitura = m("leitura") - 4;
  return (
    <CenaJanela ativo="Integrações" menu={MENU_ORGANIZACAO} quadros={rota(CENTRO, [], c.dur)}>
      <Titulo icone="integracoes" titulo="INTEGRAÇÕES" descricao="Conecte os sistemas e as contas da empresa para os agentes trabalharem com os seus dados." />
      <Abas x={40} y={150} abas={["Sistema de gestão", "Diversas", "Redes sociais"]} ativa="Sistema de gestão" />
      <Cartao x={40} y={220} w={1260} h={620}>
        <div style={{ fontSize: 26, fontWeight: 700 }}>Sistema de gestão</div>
        <div style={{ fontSize: 18, color: COR.suave, marginTop: 6 }}>Escolha como o Agentic Office vai ler os dados do seu sistema de gestão.</div>
        {CONEXOES.map(([nome, desc], i) => (
          <Cartao key={nome} x={24 + i * 610} y={110} w={590} h={270} aceso={i === aceso && frame < seguro} style={{ background: "#121513" }}>
            {i === 0 ? <Banco tam={64} /> : <Icone nome="integracoes" tam={64} cor={VERDE} />}
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 14 }}>{nome}</div>
            <div style={{ fontSize: 18, color: COR.suave, marginTop: 8, lineHeight: 1.4 }}>{desc}</div>
            <Botao style={{ position: "absolute", right: 20, top: 20, height: 40, fontSize: 17 }}>⏻ Conectar</Botao>
          </Cartao>
        ))}
        <Cartao x={24} y={420} w={1210} h={170} aceso={frame >= seguro} style={{ background: "#121513" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Loja Modelo · sistema de gestão</div>
            <Chip cheio>CONECTADO</Chip>
            <Chip cor={frame >= seguro ? VERDE : COR.suave}>CANAL SEGURO</Chip>
            <Chip cor={frame >= leitura ? VERDE : COR.suave} cheio={frame >= leitura}>
              🔒 SOMENTE LEITURA
            </Chip>
          </div>
          <div style={{ fontSize: 17, color: COR.suave, marginTop: 12 }}>Mapeado em 18/09/2026 · 1.248 tabelas · relações extraídas do próprio banco</div>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Botao style={{ height: 42, fontSize: 17 }}>Ver mapa do banco</Botao>
            <Botao style={{ height: 42, fontSize: 17 }}>Ver gráfico do banco</Botao>
          </div>
        </Cartao>
      </Cartao>
    </CenaJanela>
  );
};

// ---------- erp-3: o mapa da base (gráfico de tabelas e relações) + pergunta em português
const SETORES_BANCO = ["Cadastros", "Comercial", "Compras", "Estoque e Logística", "Financeiro", "Fiscal", "Outros", "Produção"];
// gerador pseudoaleatório fixo (o gráfico sai igual em todo frame)
const aleatorio = (s: number) => {
  const x = Math.sin(s * 127.1) * 43758.5453;
  return x - Math.floor(x);
};
const GraficoBanco: React.FC<{ readonly de: number }> = ({ de }) => {
  const frame = useCurrentFrame();
  const cx = 460;
  const cy = 420;
  const R = 240;
  const k = rampa(frame, de, 30);
  const giro = frame * 0.002;
  return (
    <svg width={1280} height={760} style={{ position: "absolute", left: 30, top: 150 }}>
      <circle cx={cx} cy={cy} r={R + 70} fill="none" stroke={VERDE} strokeOpacity={0.15} strokeWidth={2} />
      {SETORES_BANCO.map((s, i) => {
        const a = (i / SETORES_BANCO.length) * Math.PI * 2 - Math.PI / 2 + giro;
        const sx = cx + Math.cos(a) * R * k;
        const sy = cy + Math.sin(a) * R * k;
        return (
          <g key={s}>
            <line x1={cx} y1={cy} x2={sx} y2={sy} stroke={VERDE} strokeOpacity={0.5} strokeWidth={1.5} />
            {Array.from({ length: 34 }, (_, j) => {
              const r = 18 + aleatorio(i * 100 + j) * 60;
              const b = aleatorio(i * 300 + j) * Math.PI * 2;
              const px = sx + Math.cos(b) * r * k;
              const py = sy + Math.sin(b) * r * k;
              const alvo = (i + 1 + (j % 3)) % SETORES_BANCO.length;
              const aa = (alvo / SETORES_BANCO.length) * Math.PI * 2 - Math.PI / 2 + giro;
              return (
                <g key={j}>
                  {j % 4 === 0 && <line x1={px} y1={py} x2={cx + Math.cos(aa) * R * k} y2={cy + Math.sin(aa) * R * k} stroke={VERDE} strokeOpacity={0.07} strokeWidth={1} />}
                  <circle cx={px} cy={py} r={2.4} fill="#9DF57F" opacity={0.75 * k} />
                </g>
              );
            })}
            <circle cx={sx} cy={sy} r={10} fill={VERDE} />
            <text x={sx} y={sy + 34} fill="#9DF57F" fontSize={18} textAnchor="middle" fontFamily={fontFamily} fontWeight={600} opacity={k}>
              {s}
            </text>
          </g>
        );
      })}
      <rect x={cx - 110} y={cy - 26} width={220} height={52} rx={26} fill="#0E110F" stroke={VERDE} strokeWidth={2} />
      <text x={cx} y={cy + 7} fill="white" fontSize={21} textAnchor="middle" fontFamily={fontFamily} fontWeight={700}>
        LojaModelo-BD
      </text>
    </svg>
  );
};
export const Erp3: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const pergunta = m("pergunta") - 6;
  const resposta = m("resposta") - 4;
  return (
    <CenaJanela ativo="Integrações" menu={MENU_ORGANIZACAO} quadros={rota(CENTRO, [], c.dur)}>
      <div style={{ position: "absolute", left: 40, top: 26, fontFamily: fonteMono, fontSize: 16, letterSpacing: 2, color: COR.suave }}>// GRAFO DE RELAÇÕES</div>
      <div style={{ position: "absolute", left: 40, top: 52, fontSize: 40, fontWeight: 600, letterSpacing: 9 }}>GRÁFICO DO BANCO</div>
      <div style={{ position: "absolute", left: 40, top: 108, fontSize: 19, color: COR.suave }}>Cada ponto é uma tabela do banco e cada linha, uma relação extraída do próprio banco.</div>
      {[
        ["1.248", "TABELAS"],
        ["2.410", "RELAÇÕES"],
        ["8", "SETORES"],
      ].map(([v, r], i) => (
        <div key={r} style={{ position: "absolute", left: 40 + i * 150, top: 170, width: 136, padding: "8px 0", textAlign: "center", border: `1px solid ${COR.borda}`, borderRadius: 8, background: "#0E110F", zIndex: 2 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: VERDE }}>{v}</div>
          <div style={{ fontSize: 13, letterSpacing: 2, color: COR.suave }}>{r}</div>
        </div>
      ))}
      <GraficoBanco de={m("mapa") - 10} />
      {frame >= pergunta && (
        <Cartao x={820} y={240} w={480} h={330} aceso style={{ background: "#141815", opacity: rampa(frame, pergunta, 10) }}>
          <div style={{ fontFamily: fonteMono, fontSize: 15, letterSpacing: 2, color: VERDE }}>PERGUNTA EM PORTUGUÊS</div>
          <div style={{ marginTop: 10, background: "white", color: "#111", borderRadius: 10, padding: "10px 14px", fontSize: 20 }}>Quanto vendemos de porcelanato em outubro?</div>
          {frame >= resposta && (
            <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.45, opacity: rampa(frame, resposta, 8) }}>
              <b style={{ color: VERDE }}>R$ 412 mil</b> em porcelanato, 8% acima de setembro. A loja Shopping puxou o resultado.
              <div style={{ fontSize: 15, color: COR.suave, marginTop: 4 }}>Fonte: banco de dados da Loja Modelo</div>
            </div>
          )}
        </Cartao>
      )}
    </CenaJanela>
  );
};

// ---------- erp-4: painel de KPIs montado numa conversa
const KPIS: [string, number, (v: number) => string, string][] = [
  ["Faturamento do mês", 1840000, (v) => "R$ " + (v / 1e6).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " mi", "+6% sobre outubro"],
  ["Margem", 29.4, (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%", "meta: 28%"],
  ["Ticket médio", 587, (v) => "R$ " + Math.round(v), "todas as lojas"],
  ["Ruptura de estoque", 3.2, (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%", "dos itens ativos"],
  ["Pedidos hoje", 417, (v) => String(Math.round(v)), "até 14:00"],
  ["Devoluções", 1.8, (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%", "da venda bruta"],
];
export const Erp4: React.FC<P> = ({ c, extras = true }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const monta = m("conversa") - 4;
  const hora = m("hora") - 4;
  const credito = m("crédito") - 4;
  const digitar = m("digitar") - 4;
  return (
    <>
      <CenaJanela ativo="Gestão Avançada" menu={MENU_MODULOS} quadros={rota(CENTRO, [], c.dur)}>
        <Titulo icone="gestao" titulo="PAINEL DE KPIs" descricao="Gestão Avançada · os números do ERP que a empresa escolheu acompanhar." />
        <Cartao x={40} y={160} w={400} h={700}>
          <div style={{ fontFamily: fonteMono, fontSize: 15, letterSpacing: 2, color: VERDE }}>OLHO DE DEUS</div>
          <div style={{ marginTop: 14, background: "white", color: "#111", borderRadius: 10, padding: "12px 14px", fontSize: 19, lineHeight: 1.4, opacity: rampa(frame, m("monta") - 6, 8) }}>
            Quero acompanhar faturamento, margem, ticket médio, ruptura, pedidos do dia e devoluções.
          </div>
          {frame >= monta + 6 && (
            <div style={{ marginTop: 16, fontSize: 19, lineHeight: 1.45, opacity: rampa(frame, monta + 6, 8) }}>
              Testei cada indicador com o valor real do ERP e montei o painel. <b style={{ color: VERDE }}>Ele se atualiza sozinho de hora em hora.</b>
            </div>
          )}
        </Cartao>
        <div style={{ position: "absolute", left: 470, top: 160, display: "flex", gap: 12, alignItems: "center", opacity: rampa(frame, monta, 10) }}>
          <div style={{ fontSize: 18, padding: "8px 14px", borderRadius: 8, border: `${frame >= hora ? 2 : 1}px solid ${frame >= hora ? VERDE : COR.borda}`, color: frame >= hora ? VERDE : COR.suave }}>⟳ Atualizado às 14:00 · próxima às 15:00</div>
        </div>
        {KPIS.map(([r, v, f, n], i) => (
          <Kpi key={r} x={470 + (i % 2) * 420} y={230 + Math.floor(i / 2) * 150} w={400} rotulo={r} valor={v} formato={f} nota={n} conta={monta + 8 + i * 4} aceso={frame >= hora && frame < credito} />
        ))}
        <Cartao x={470} y={690} w={820} h={170} style={{ opacity: rampa(frame, monta + 20, 10) }}>
          <div style={{ fontSize: 18, color: COR.suave }}>Faturamento por hora · hoje</div>
          <div style={{ marginTop: 10 }}>
            <Barras valores={[12, 28, 41, 52, 47, 38]} rotulos={["9h", "10h", "11h", "12h", "13h", "14h"]} w={760} h={80} de={monta + 24} />
          </div>
        </Cartao>
      </CenaJanela>
      {extras && (
        <>
      <Surge de={credito} style={{ left: 1420, top: 200 }}>
        <div style={{ background: VERDE, color: "#0B0B0C", borderRadius: 14, padding: "16px 22px", fontFamily, fontWeight: 900, fontSize: 30, lineHeight: 1.1, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
          0 CRÉDITO
          <br />
          DE IA
        </div>
      </Surge>
      <Surge de={digitar} style={{ left: 1420, top: 340 }}>
        <div style={{ background: "#0B0B0C", color: VERDE, border: `2px solid ${VERDE}`, borderRadius: 14, padding: "16px 22px", fontFamily, fontWeight: 900, fontSize: 26, lineHeight: 1.15 }}>
          NÚMEROS
          <br />
          DIRETO DO ERP
        </div>
      </Surge>
        </>
      )}
    </>
  );
};

// ---------- erp-5: Vendas 360 e Rastreabilidade
const FILTROS = [
  ["Filial", "filial"],
  ["Vendedor", ""],
  ["Marca", "marca"],
  ["Departamento", ""],
  ["Região", "região"],
  ["Cliente", "cliente"],
  ["Forma de pagamento", "pagamento"],
];
const JORNADA: [string, string, string][] = [
  ["Pedido de compra", "12/10", "PC 1003/7767"],
  ["NF de entrada", "15/10", "NF 88.214"],
  ["Recebimento no CD", "16/10", "conferido"],
  ["Transferência", "18/10", "CD → loja Centro"],
  ["Venda ao cliente", "22/10", "pedido 48213"],
  ["NF de venda", "22/10", "NF 120.553"],
  ["Entrega", "24/10", "entregue"],
];
export const Erp5: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const troca = m("Rastreabilidade") - 8;
  const v360 = interpolate(frame, [troca, troca + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ditos = FILTROS.filter(([, p]) => p).map(([, p]) => m(p));
  const filtroAceso = FILTROS.filter(([, p]) => p)[atual(frame, ditos)]?.[0];
  const segue = m("segue") - 4;
  const ate = m("entrega");
  const passo = Math.floor(interpolate(frame, [segue, ate], [0, JORNADA.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <>
      {v360 > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: v360 }}>
          <CenaJanela ativo="Gestão Avançada" menu={MENU_MODULOS} quadros={rota(CENTRO, [], c.dur)}>
            <Titulo icone="gestao" titulo="VENDAS 360" descricao="atualizado às 14:05 · dados desde jan/2024" />
            <div style={{ position: "absolute", left: 40, top: 150, display: "flex", gap: 10 }}>
              {FILTROS.map(([f]) => {
                const aceso = f === filtroAceso;
                return (
                  <div key={f} style={{ fontSize: 17, padding: "8px 14px", borderRadius: 8, border: `${aceso ? 2 : 1}px solid ${aceso ? VERDE : COR.borda}`, color: aceso ? VERDE : COR.texto, background: aceso ? "rgba(60,224,30,0.1)" : "transparent", boxShadow: aceso ? "0 0 20px rgba(60,224,30,0.4)" : "none" }}>
                    {f} ⌄
                  </div>
                );
              })}
            </div>
            {(
              [
                ["Faturamento", 21400000, (v: number) => "R$ " + (v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + " mi"],
                ["Lucro", 6300000, (v: number) => "R$ " + (v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + " mi"],
                ["Margem", 29.4, (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + "%"],
                ["Nº de vendas", 31200, (v: number) => (v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) + " mil"],
              ] as const
            ).map(([r, v, f], i) => (
              <Kpi key={r} x={40 + i * 318} y={220} w={300} rotulo={r} valor={v} formato={f} conta={4} />
            ))}
            <Cartao x={40} y={380} w={800} h={470}>
              <div style={{ fontSize: 21, fontWeight: 700 }}>Comparativo mensal</div>
              <div style={{ fontSize: 16, color: COR.suave, marginTop: 4 }}>
                <span style={{ color: "#2FB344" }}>■</span> 2025 <span style={{ color: "#B8F5A8", marginLeft: 12 }}>■</span> 2026
              </div>
              <div style={{ marginTop: 20 }}>
                <Barras valores={[1.6, 1.5, 1.8, 1.7, 1.9, 1.8, 2.0, 2.1, 1.9, 2.0]} valores2={[1.8, 1.7, 2.0, 1.9, 2.2, 2.1, 2.3, 2.4, 2.2, 2.3]} rotulos={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out"]} w={740} h={300} de={6} />
              </div>
            </Cartao>
            <Cartao x={860} y={380} w={440} h={470} aceso={filtroAceso === "Forma de pagamento"}>
              <div style={{ fontSize: 21, fontWeight: 700 }}>Forma de pagamento</div>
              {(
                [
                  ["Pix", 38],
                  ["Cartão de crédito", 34],
                  ["Boleto", 16],
                  ["Cartão de débito", 12],
                ] as const
              ).map(([f, p], i) => (
                <div key={f} style={{ marginTop: 26 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
                    <span>{f}</span>
                    <b>{p}%</b>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: "#1F2420", marginTop: 8 }}>
                    <div style={{ width: `${p * 2.4 * rampa(frame, 10 + i * 4, 16)}%`, height: "100%", borderRadius: 5, background: VERDE }} />
                  </div>
                </div>
              ))}
            </Cartao>
          </CenaJanela>
        </div>
      )}
      {frame >= troca && (
        <div style={{ position: "absolute", inset: 0, opacity: rampa(frame, troca, 10) }}>
          <CenaJanela ativo="Inteligência de Estoque" menu={MENU_MODULOS} quadros={rota(CENTRO, [], c.dur)}>
            <Titulo icone="estoque" titulo="RASTREABILIDADE DO PRODUTO" descricao="A jornada de um item, do pedido de compra à entrega, lida ao vivo no ERP." />
            <div style={{ position: "absolute", left: 40, top: 160, display: "flex", gap: 12 }}>
              <div style={{ width: 240, height: 52, boxSizing: "border-box", padding: "0 16px", display: "flex", alignItems: "center", borderRadius: 8, border: `1px solid ${COR.borda}`, fontSize: 19 }}>Pedido de venda ⌄</div>
              <div style={{ width: 360, height: 52, boxSizing: "border-box", padding: "0 16px", display: "flex", alignItems: "center", borderRadius: 8, border: `1px solid ${COR.borda}`, fontSize: 19 }}>48213</div>
              <Botao cheio>⌕ Buscar</Botao>
            </div>
            <Cartao x={40} y={250} w={1260} h={110}>
              <div style={{ fontSize: 15, color: COR.suave }}>PRODUTO</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>Porcelanato Areia 60x60 · caixa 2,16 m² · 14 caixas</div>
            </Cartao>
            <div style={{ position: "absolute", left: 100, right: 100, top: 442, height: 4, background: "#1F2420" }}>
              <div style={{ width: `${(Math.max(0, passo - 1) / (JORNADA.length - 1)) * 100}%`, height: "100%", background: VERDE }} />
            </div>
            {JORNADA.map(([t, d, n], i) => {
              const x = 100 + (i * 1140) / (JORNADA.length - 1);
              const feito = i < passo;
              return (
                <div key={t} style={{ position: "absolute", left: x - 85, top: 420, width: 170, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: feito ? VERDE : "#1F2420", border: `2px solid ${feito ? VERDE : COR.borda}`, color: "#0B0B0C", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 22, boxShadow: feito ? "0 0 20px rgba(60,224,30,0.5)" : "none" }}>{feito ? "✓" : ""}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 14, color: feito ? "white" : COR.suave }}>{t}</div>
                  <div style={{ fontSize: 16, color: COR.suave, marginTop: 4 }}>{d}</div>
                  <div style={{ fontSize: 15, color: feito ? VERDE : COR.suave, marginTop: 2 }}>{n}</div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 40, top: 640, fontSize: 22, fontWeight: 700 }}>Movimento do dia</div>
            {(
              [
                ["Pedidos de compra", "12"],
                ["Recebimentos", "8"],
                ["Transferências", "22"],
                ["Vendas ao cliente", "417"],
                ["Entregas", "228"],
              ] as const
            ).map(([r, v], i) => (
              <Cartao key={r} x={40 + i * 254} y={685} w={236} h={120}>
                <div style={{ fontSize: 16, color: COR.suave }}>{r}</div>
                <div style={{ fontSize: 38, fontWeight: 700, marginTop: 6 }}>{v}</div>
              </Cartao>
            ))}
          </CenaJanela>
        </div>
      )}
    </>
  );
};

// ---------- erp-6: os dados ficam na empresa; só os indicadores vêm
export const INDICADORES = ["Faturamento: R$ 1,84 mi", "Margem: 29,4%", "Ruptura: 3,2%"];
export const Erp6: React.FC<P> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  const consulta = m("consulta") - 4;
  const volta = m("indicadores") - 6;
  const nunca = m("nunca") - 4;
  const ida = rampa(frame, consulta, 18);
  return (
    <>
      <Surge de={0} style={{ left: 0, right: 0, top: 120, textAlign: "center" }}>
        <div style={{ ...TITULO, fontSize: 64, color: "white" }}>
          os dados <span style={textoDegrade}>continuam na sua empresa</span>
        </div>
      </Surge>
      <Surge de={4} style={{ left: 170, top: 330 }}>
        <div style={{ width: 460, height: 420, borderRadius: 24, background: "#141815", border: `2px solid ${VERDE}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Banco tam={110} />
          <div style={{ ...TITULO, fontSize: 34, color: "white" }}>ERP da Loja Modelo</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 70px)", gap: 6, marginTop: 6, position: "relative" }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} style={{ height: 16, borderRadius: 3, background: "#2A2F2B" }} />
            ))}
            {frame >= nunca && <div style={{ position: "absolute", inset: -10, border: "3px solid #FF6B6B", borderRadius: 8, opacity: rampa(frame, nunca, 6) }} />}
          </div>
          <div style={{ fontFamily: fonteMono, fontSize: 18, color: frame >= nunca ? "#FF6B6B" : CINZA, letterSpacing: 1 }}>as linhas ficam aqui</div>
        </div>
      </Surge>
      <Surge de={6} style={{ left: 1290, top: 330 }}>
        <div style={{ width: 460, height: 420, borderRadius: 24, background: "#141815", border: "1px solid #2A2F2B", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <Img src={staticFile("midia/logo-agentic-office.png")} style={{ width: 360 }} />
          {INDICADORES.map((t, i) => (
            <div key={t} style={{ fontFamily, fontWeight: 800, fontSize: 24, color: "#0B0B0C", background: VERDE, borderRadius: 10, padding: "8px 16px", opacity: rampa(frame, volta + 24 + i * 6, 8) }}>
              {t}
            </div>
          ))}
        </div>
      </Surge>
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
        <line x1={1280} y1={480} x2={1280 - 630 * ida} y2={480} stroke={VERDE} strokeWidth={5} strokeDasharray="14 12" />
        {ida >= 1 && <text x={960} y={460} fill={CINZA} fontSize={22} textAnchor="middle" fontFamily={fonteMono}>consulta</text>}
        {frame >= volta && <line x1={650} y1={600} x2={650 + 630 * rampa(frame, volta, 18)} y2={600} stroke={VERDE} strokeWidth={5} />}
        {frame >= volta + 18 && <text x={960} y={640} fill={VERDE} fontSize={22} textAnchor="middle" fontFamily={fonteMono}>só os indicadores</text>}
      </svg>
    </>
  );
};
