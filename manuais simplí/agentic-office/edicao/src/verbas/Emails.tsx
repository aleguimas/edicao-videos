import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Digitando } from "../agentic/App";
import { fonteApp, VERDE } from "../fonte";

// E-mails do módulo (fundo branco, como chegam na caixa de entrada) e a planilha do Excel.
// A empresa é a fictícia "Loja Modelo", com marca própria em azul.
const AZUL = "#2B3A8F";
const TEXTO = "#1F2328";
const SUAVE = "#6B7280";

export const LogoLojaModelo: React.FC<{ readonly tam?: number }> = ({ tam = 34 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonteApp }}>
    <div style={{ width: tam * 1.2, height: tam * 1.2, borderRadius: 8, background: AZUL, color: "white", display: "grid", placeItems: "center", fontWeight: 800, fontSize: tam * 0.55 }}>LM</div>
    <div style={{ fontWeight: 800, fontSize: tam, color: AZUL, letterSpacing: 1 }}>Loja Modelo</div>
  </div>
);

// cartão de e-mail: cabeçalho da caixa de entrada + corpo
export const Email: React.FC<{ readonly de: string; readonly assunto: string; readonly hora: string; readonly largura?: number; readonly children: React.ReactNode }> = ({ de, assunto, hora, largura = 980, children }) => (
  <div style={{ width: largura, borderRadius: 18, overflow: "hidden", background: "white", boxShadow: "0 40px 120px rgba(0,0,0,0.7)", fontFamily: fonteApp, color: TEXTO }}>
    <div style={{ background: "#F3F4F6", padding: "18px 30px", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 46, height: 46, borderRadius: "50%", background: AZUL, color: "white", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 18 }}>LM</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{assunto}</div>
        <div style={{ fontSize: 16, color: SUAVE }}>{de}</div>
      </div>
      <div style={{ fontSize: 16, color: SUAVE }}>{hora}</div>
    </div>
    <div style={{ padding: "30px 40px 36px", borderTop: `6px solid ${AZUL}` }}>{children}</div>
  </div>
);

const destaque = (aceso: boolean | undefined): React.CSSProperties =>
  aceso ? { outline: `3px solid ${VERDE}`, outlineOffset: 6, borderRadius: 6, boxShadow: "0 0 30px rgba(60,224,30,0.35)" } : {};

const Tabela: React.FC<{ readonly titulo: string; readonly cab: readonly string[]; readonly linhas: readonly (readonly string[])[]; readonly aceso?: boolean; readonly cor?: string }> = ({ titulo, cab, linhas, aceso, cor = AZUL }) => (
  <div style={{ marginTop: 26, ...destaque(aceso) }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: cor }}>{titulo}</div>
    <div style={{ marginTop: 8, fontSize: 17 }}>
      <div style={{ display: "flex", fontWeight: 700, color: SUAVE, borderBottom: "2px solid #E5E7EB", padding: "8px 0" }}>
        {cab.map((c, i) => (
          <span key={c} style={{ flex: i === 2 ? 2.4 : 1, textAlign: i === cab.length - 1 ? "right" : "left" }}>
            {c}
          </span>
        ))}
      </div>
      {linhas.map((l) => (
        <div key={l.join()} style={{ display: "flex", borderBottom: "1px solid #EEF0F2", padding: "9px 0" }}>
          {l.map((c, i) => (
            <span key={i} style={{ flex: i === 2 ? 2.4 : 1, textAlign: i === l.length - 1 ? "right" : "left" }}>
              {c}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ---------- E-mail de aprovação para o fornecedor (link público, sem login)
export type DadosEmailForn = { readonly para: string; readonly nome: string; readonly linhas: readonly (readonly [string, string])[]; readonly recusa: string };
const EMAIL_FORN_PADRAO: DadosEmailForn = {
  para: "carla@ceramicaaurora.com.br",
  nome: "Carla",
  linhas: [
    ["Fornecedor", "Cerâmica Aurora"],
    ["Modalidade", "Cota de campanha"],
    ["Combinado", "Cota Fim de Ano — R$ 24 mil, NF de bonificação em dezembro"],
    ["Valor negociado", "R$ 24.000,00"],
    ["Previsto para", "30/12/2026"],
  ],
  recusa: "O valor combinado foi R$ 20 mil, não R$ 24 mil.",
};
export const EmailFornecedor: React.FC<{ readonly naoAprovar?: number; readonly loginAceso?: boolean; readonly dados?: DadosEmailForn }> = ({ naoAprovar, loginAceso, dados = EMAIL_FORN_PADRAO }) => {
  const frame = useCurrentFrame();
  const clicou = naoAprovar !== undefined && frame >= naoAprovar;
  const apertado = clicou && frame < (naoAprovar ?? 0) + 6;
  return (
    <Email de={`Loja Modelo <verbas@lojamodelo.com.br> para ${dados.para}`} assunto="Confirme o acordo negociado com a Loja Modelo" hora="30/10, 10:02">
      <LogoLojaModelo />
      <div style={{ fontSize: 20, marginTop: 20, lineHeight: 1.5 }}>Olá, {dados.nome}. A Loja Modelo registrou o acordo abaixo. Confira se está tudo como vocês combinaram:</div>
      <div style={{ marginTop: 18, border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden", fontSize: 18 }}>
        {dados.linhas.map(([r, v], i) => (
          <div key={r} style={{ display: "flex", padding: "10px 16px", background: i % 2 ? "white" : "#F9FAFB" }}>
            <span style={{ width: 200, color: SUAVE }}>{r}</span>
            <span style={{ fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 24, alignItems: "center" }}>
        <div style={{ background: "#16A34A", color: "white", fontWeight: 800, fontSize: 20, padding: "14px 34px", borderRadius: 10 }}>Aprovar</div>
        <div style={{ border: "2px solid #DC2626", color: "#DC2626", fontWeight: 800, fontSize: 20, padding: "12px 30px", borderRadius: 10, transform: apertado ? "scale(0.94)" : "none", background: clicou ? "#FEF2F2" : "white" }}>
          Não aprovar
        </div>
        <div style={{ fontSize: 16, color: SUAVE, marginLeft: 8, padding: "4px 8px", ...destaque(loginAceso) }}>🔒 Link seguro · não precisa de login</div>
      </div>
      {clicou && (
        <div style={{ marginTop: 22, opacity: interpolate(frame - (naoAprovar ?? 0), [4, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>O que está diferente do combinado? (obrigatório)</div>
          <div style={{ marginTop: 8, border: "2px solid #DC2626", borderRadius: 10, padding: 14, fontSize: 19, minHeight: 30 }}>
            <Digitando texto={dados.recusa} de={(naoAprovar ?? 0) + 14} porFrame={1.3} />
          </div>
        </div>
      )}
    </Email>
  );
};

// ---------- E-mail semanal do comprador
export type FocoComprador = "vencidos" | "breve" | "semprazo" | "respostas" | "notas" | null;
export const EmailComprador: React.FC<{ readonly foco: FocoComprador }> = ({ foco }) => (
  <Email de="Verbas e Acordos <verbas@lojamodelo.com.br> para marina@lojamodelo.com.br" assunto="Suas verbas e acordos da semana" hora="seg, 08:00">
    <LogoLojaModelo />
    <div style={{ fontSize: 20, marginTop: 20, lineHeight: 1.5 }}>
      Olá, Marina. Estas são as suas verbas e acordos que pedem atenção em 02/11/2026: 1 vencido (R$ 6.500,00), 1 vencendo em breve, 1 sem prazo, 1 resposta de fornecedor e 2 nota(s) do ERP para lançar.
    </div>
    <div style={{ display: "inline-block", marginTop: 18, background: AZUL, color: "white", fontWeight: 700, fontSize: 19, padding: "12px 24px", borderRadius: 8 }}>Abrir Verbas e Acordos</div>
    <Tabela titulo="Vencidos · 1 · R$ 6.500,00" cab={["Acordo", "Fornecedor", "Descrição", "Atraso", "Saldo"]} linhas={[["ACD-0214", "Tintas Horizonte", "Cota aniversário · parcela 2/6", "33 d", "R$ 6.500,00"]]} aceso={foco === "vencidos"} cor="#B91C1C" />
    <Tabela titulo="Vencem em breve · 1 · R$ 12.000,00" cab={["Acordo", "Fornecedor", "Descrição", "Prazo", "Saldo"]} linhas={[["ACD-0209", "Metais Prisma", "Bonificação · linha banho", "10/11/2026", "R$ 12.000,00"]]} aceso={foco === "breve"} cor="#B45309" />
    <Tabela titulo="Sem prazo · 1" cab={["Acordo", "Fornecedor", "Descrição", "Comprador", "Saldo"]} linhas={[["ACD-0221", "Vidros Cristal", "Rapel semestral · 2% (estimado)", "—", "R$ 7.200,00"]]} aceso={foco === "semprazo"} />
    <Tabela titulo="Respostas dos fornecedores · 1" cab={["Acordo", "Fornecedor", "Resposta", "Quando", "Valor"]} linhas={[["ACD-0215", "Cerâmica Aurora", "Não aprovou: “o combinado foi R$ 20 mil”", "30/10", "R$ 24.000,00"]]} aceso={foco === "respostas"} cor="#B91C1C" />
    <Tabela
      titulo="Notas do ERP para lançar · 2"
      cab={["Emissão", "Fornecedor", "Documento", "Tipo", "Valor"]}
      linhas={[
        ["28/10/2026", "Cerâmica Aurora", "NF 4821", "Bonificação", "R$ 14.000,00"],
        ["26/10/2026", "Tintas Horizonte", "NF 3310", "Bonificação", "R$ 9.000,00"],
      ]}
      aceso={foco === "notas"}
    />
  </Email>
);

// ---------- E-mail semanal da diretoria
export type FocoDiretoria = "numeros" | "comprador" | "atrasos" | "aprovacao" | null;
export const EmailDiretoria: React.FC<{ readonly foco: FocoDiretoria }> = ({ foco }) => (
  <Email de="Verbas e Acordos <verbas@lojamodelo.com.br> para diretoria@lojamodelo.com.br" assunto="Posição das verbas e acordos comerciais" hora="seg, 08:00">
    <LogoLojaModelo />
    <div style={{ fontSize: 20, marginTop: 20 }}>Resumo para as cobranças da semana · posição em 02/11/2026</div>
    <div style={{ display: "flex", gap: 14, marginTop: 18, ...destaque(foco === "numeros") }}>
      {(
        [
          ["Negociado", "R$ 1.284.600", "418 acordos ativos", TEXTO],
          ["Recebido", "R$ 1.012.350", "78,8% de realização", "#15803D"],
          ["Saldo a receber", "R$ 272.250", "54 em aberto", "#B45309"],
          ["Vencido", "R$ 46.800", "7 acordos", "#B91C1C"],
        ] as const
      ).map(([r, v, n, c]) => (
        <div key={r} style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ fontSize: 15, color: SUAVE }}>{r}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: c }}>{v}</div>
          <div style={{ fontSize: 14, color: SUAVE }}>{n}</div>
        </div>
      ))}
    </div>
    <Tabela
      titulo="Vencido por comprador"
      cab={["Comprador", "Acordos", "Vencidos", "", "Valor vencido"]}
      linhas={[
        ["Marina Costa", "212", "4", "", "R$ 28.300,00"],
        ["Rafael Lima", "174", "3", "", "R$ 18.500,00"],
      ]}
      aceso={foco === "comprador"}
    />
    <Tabela
      titulo="Maiores saldos vencidos"
      cab={["Acordo", "Fornecedor", "Descrição", "Atraso", "Saldo"]}
      linhas={[
        ["ACD-0162", "Pisos Atlântico", "Cota Dia das Mães", "92 d", "R$ 9.800,00"],
        ["ACD-0214", "Tintas Horizonte", "Cota aniversário · parcela 2/6", "33 d", "R$ 6.500,00"],
      ]}
      aceso={foco === "atrasos"}
      cor="#B91C1C"
    />
    <Tabela titulo="Esperando aprovação · 1" cab={["Acordo", "Fornecedor", "Descrição", "Comprador", "Valor"]} linhas={[["ACD-0226", "Tintas Horizonte", "Cota de verão · 10 parcelas", "Marina", "R$ 120.000,00"]]} aceso={foco === "aprovacao"} cor="#B45309" />
  </Email>
);

// ---------- Planilha do Excel (Exportar / Importar)
export type FocoExcel = "Fornecedores" | "Acordos" | "Recebimentos";
export const PlanilhaExcel: React.FC<{ readonly aba: FocoExcel; readonly edita?: number }> = ({ aba, edita }) => {
  const frame = useCurrentFrame();
  const editado = edita !== undefined && frame >= edita;
  const LINHAS: Record<FocoExcel, string[][]> = {
    Fornecedores: [
      ["Código", "Fornecedor", "CNPJ", "Contato", "E-mail do contato"],
      ["FOR-021", "Cerâmica Aurora", "12.345.678/0001-90", "Carla", "carla@ceramicaaurora.com.br"],
      ["FOR-034", "Tintas Horizonte", "23.456.789/0001-01", "Bruno", "bruno@tintashorizonte.com.br"],
      ["", "Vidros Cristal", "", "Ana Paula", "anapaula@vidroscristal.com.br"],
    ],
    Acordos: [
      ["ID Acordo", "Fornecedor", "Descrição", "Valor negociado", "Data prevista"],
      ["ACD-0215", "Cerâmica Aurora", "Cota Fim de Ano", "24.000,00", "30/12/2026"],
      ["ACD-0221", "Vidros Cristal", "Rapel semestral", "7.200,00", editado ? "30/11/2026" : ""],
      ["", "Cerâmica Aurora", "Cota Natal", "18.000,00", "20/12/2026"],
    ],
    Recebimentos: [
      ["ID Acordo", "Documento", "Forma", "Valor", "Data"],
      ["ACD-0215", "NF 4821", "NF de bonificação", "14.000,00", "28/10/2026"],
      ["ACD-0187", "Boleto 55120/02", "Desconto em boleto", "5.700,00", "20/10/2026"],
      ["ACD-0198", "Depósito 0931", "Depósito", "3.150,00", "14/10/2026"],
    ],
  };
  return (
    <div style={{ width: 1180, borderRadius: 14, overflow: "hidden", background: "white", boxShadow: "0 40px 120px rgba(0,0,0,0.7)", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "#1D6F42", color: "white", padding: "14px 22px", fontSize: 20, fontWeight: 700 }}>verbas-e-acordos.xlsx — Excel</div>
      <div style={{ display: "grid", gridTemplateColumns: "60px 170px 240px 300px 200px 210px" }}>
        {["", "A", "B", "C", "D", "E"].map((c) => (
          <div key={c} style={{ background: "#F3F4F6", borderRight: "1px solid #D1D5DB", borderBottom: "1px solid #D1D5DB", height: 34, display: "grid", placeItems: "center", fontSize: 15, color: "#555" }}>
            {c}
          </div>
        ))}
        {LINHAS[aba].flatMap((l, i) => [
          <div key={`n${i}`} style={{ background: "#F3F4F6", borderRight: "1px solid #D1D5DB", borderBottom: "1px solid #E5E7EB", height: 52, display: "grid", placeItems: "center", fontSize: 15, color: "#555" }}>
            {i + 1}
          </div>,
          ...l.map((v, j) => {
            const alvo = aba === "Acordos" && i === 2 && j === 4;
            return (
              <div
                key={`${i}-${j}`}
                style={{
                  borderRight: "1px solid #E5E7EB",
                  borderBottom: "1px solid #E5E7EB",
                  height: 52,
                  padding: "0 12px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 18,
                  fontWeight: i === 0 ? 700 : 400,
                  background: i === 0 ? "#E8F5EC" : alvo && editado ? "#DCFCE7" : "white",
                  color: "#1F2328",
                  outline: alvo && editado ? "3px solid #16A34A" : "none",
                  outlineOffset: -3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {v}
              </div>
            );
          }),
        ])}
      </div>
      <div style={{ display: "flex", gap: 2, background: "#F3F4F6", padding: "0 12px", borderTop: "1px solid #D1D5DB" }}>
        {(["Fornecedores", "Acordos", "Recebimentos"] as const).map((a) => (
          <div key={a} style={{ padding: "10px 22px", fontSize: 17, fontWeight: a === aba ? 700 : 400, color: a === aba ? "#1D6F42" : "#555", background: a === aba ? "white" : "transparent", borderBottom: a === aba ? "3px solid #1D6F42" : "3px solid transparent" }}>
            {a}
          </div>
        ))}
      </div>
    </div>
  );
};
