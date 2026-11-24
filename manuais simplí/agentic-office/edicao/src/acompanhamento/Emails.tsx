import type React from "react";
import { DEMANDA } from "./dados";
import { luz } from "./Telas";

// E-mails do módulo (brancos, como chegam na caixa de entrada). Texto e botões seguem os prints;
// nomes e endereços são da Loja Modelo.
const VERDE_EMAIL = "#1E7A1E";
export const REMETENTE = "AGENTE DE IA | ACOMPANHAMENTO · LOJA MODELO";

const BotaoEmail: React.FC<{ readonly cheio?: boolean; readonly aceso?: boolean; readonly children: React.ReactNode; readonly tam: number }> = ({ cheio, aceso, children, tam }) => (
  <span style={{ display: "inline-block", fontSize: tam, fontWeight: 700, padding: `${tam * 0.55}px ${tam}px`, borderRadius: 6, background: cheio ? "#0B0B0C" : "white", color: cheio ? "white" : VERDE_EMAIL, border: `1.5px solid ${cheio ? "#0B0B0C" : VERDE_EMAIL}`, whiteSpace: "nowrap", ...luz(aceso) }}>{children}</span>
);

// corpo do e-mail que o responsável recebe, com os três botões
export const EmailResponsavel: React.FC<{ readonly nome?: string; readonly frase?: string; readonly nota?: React.ReactNode; readonly acao?: string; readonly prazo?: string; readonly acesos?: readonly string[]; readonly tam?: number }> = ({
  nome = "Rafael",
  frase = "Marina Costa registrou uma ação com você. O prazo está abaixo; quando terminar, é só apertar \"Ação concluída\".",
  nota,
  acao = "Enviar o pedido de abertura de estoque aos fornecedores.",
  prazo = "13/11/2026",
  acesos = [],
  tam = 22,
}) => (
  <div style={{ background: "white", color: "#1B1E1C", fontFamily: "Arial, Helvetica, sans-serif", padding: `${tam * 1.1}px ${tam * 1.4}px`, borderRadius: 6 }}>
    <div style={{ fontSize: tam * 0.8, fontWeight: 700, color: VERDE_EMAIL, letterSpacing: 0.3 }}>{REMETENTE}</div>
    <div style={{ fontSize: tam, marginTop: tam * 0.6, lineHeight: 1.35 }}>
      Olá, {nome}. {frase}
    </div>
    <div style={{ height: 1, background: "#999", margin: `${tam * 0.6}px 0` }} />
    <div style={{ fontSize: tam * 1.05, fontWeight: 700, display: "inline-block", padding: "1px 4px", marginLeft: -4, ...luz(acesos.includes("acao")) }}>{acao}</div>
    <div style={{ fontSize: tam * 0.75, color: "#555", marginTop: 4 }}>{DEMANDA.titulo}</div>
    <div style={{ fontSize: tam * 0.8, color: "#333", marginTop: 4 }}>
      <span style={{ padding: "1px 4px", marginLeft: -4, ...luz(acesos.includes("prazo")) }}>Prazo: {prazo}</span>
    </div>
    {nota && <div style={{ fontSize: tam * 0.8, color: "#333", marginTop: 6 }}>{nota}</div>}
    <div style={{ display: "flex", gap: tam * 0.5, marginTop: tam * 0.7 }}>
      <BotaoEmail cheio tam={tam * 0.8} aceso={acesos.includes("botoes")}>
        Ação concluída
      </BotaoEmail>
      <BotaoEmail tam={tam * 0.8} aceso={acesos.includes("botoes")}>
        Solicitar novo prazo
      </BotaoEmail>
      <BotaoEmail tam={tam * 0.8} aceso={acesos.includes("botoes")}>
        Ação de outra área/pessoa
      </BotaoEmail>
    </div>
    <div style={{ fontSize: tam * 0.62, color: "#555", marginTop: tam * 0.9, lineHeight: 1.4 }}>Enviado pelo Acompanhamento do Agentic Office em nome de Marina Costa (Loja Modelo). Responda pelos botões: a resposta por e-mail chega a Marina Costa, mas não atualiza o acompanhamento.</div>
  </div>
);

// moldura da caixa de entrada: assunto e remetente acima do corpo
export const CaixaEmail: React.FC<{ readonly assunto: string; readonly de?: string; readonly para: string; readonly hora: string; readonly largura: number; readonly children: React.ReactNode }> = ({ assunto, de = "Agente de IA | Acompanhamento", para, hora, largura, children }) => (
  <div style={{ width: largura, boxSizing: "border-box", background: "white", color: "#1B1E1C", borderRadius: 14, padding: "26px 34px 20px", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", fontFamily: "Arial, Helvetica, sans-serif" }}>
    <div style={{ fontSize: 30 }}>{assunto}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
      <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#2B3A8F", color: "white", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 18 }}>LM</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{de}</div>
        <div style={{ fontSize: 17, color: "#555" }}>para {para}</div>
      </div>
      <div style={{ fontSize: 17, color: "#555" }}>{hora}</div>
    </div>
    <div style={{ marginTop: 6 }}>{children}</div>
  </div>
);

// cartões menores, para o capítulo do setor
const Mini: React.FC<{ readonly titulo: string; readonly aceso?: boolean; readonly rodape?: React.ReactNode; readonly children: React.ReactNode }> = ({ titulo, aceso, rodape, children }) => (
  <div style={{ width: 530, height: 400, boxSizing: "border-box", padding: "24px 28px", background: "white", color: "#1B1E1C", borderRadius: 12, boxShadow: aceso ? "0 0 0 3px #3CE01E, 0 24px 70px rgba(60,224,30,0.3)" : "0 24px 70px rgba(0,0,0,0.6)", fontFamily: "Arial, Helvetica, sans-serif" }}>
    <div style={{ fontSize: 15, fontWeight: 700, color: VERDE_EMAIL }}>{REMETENTE}</div>
    <div style={{ fontSize: 25, fontWeight: 700, marginTop: 12, lineHeight: 1.2 }}>{titulo}</div>
    <div style={{ height: 1, background: "#999", margin: "12px 0" }} />
    <div style={{ fontSize: 23, lineHeight: 1.35 }}>{children}</div>
    {rodape && <div style={{ display: "flex", gap: 10, marginTop: 16 }}>{rodape}</div>}
  </div>
);
export const MiniResumo: React.FC<{ readonly aceso?: boolean }> = ({ aceso }) => (
  <Mini titulo="4 ações criadas em Inauguração da Loja Sul" aceso={aceso} rodape={<BotaoEmail cheio tam={18}>Abrir a demanda</BotaoEmail>}>
    <b>Enviar o pedido de estoque</b>
    <br />
    Rafael Lima · prazo 13/11/2026
    <br />
    <b>Aprovar a campanha</b>
    <br />
    Pedro Alves · prazo 19/11/2026
  </Mini>
);
export const MiniDiario: React.FC<{ readonly aceso?: boolean }> = ({ aceso }) => (
  <Mini titulo="Resumo do dia · Expansão" aceso={aceso} rodape={<BotaoEmail cheio tam={18}>Abrir a demanda</BotaoEmail>}>
    <b>Vence hoje:</b> 1 ação
    <br />
    <b style={{ color: "#C8423E" }}>Atrasadas:</b> 1 ação
    <br />
    <b>Esperando aprovação:</b> 2 retornos
  </Mini>
);
export const MiniRetorno: React.FC<{ readonly aceso?: boolean }> = ({ aceso }) => (
  <Mini
    titulo="Rafael Lima respondeu"
    aceso={aceso}
    rodape={
      <>
        <BotaoEmail cheio tam={18}>
          Aprovar
        </BotaoEmail>
        <BotaoEmail tam={18}>Recusar</BotaoEmail>
      </>
    }
  >
    <b>Enviar o pedido de estoque</b>
    <br />
    "Pedido enviado aos 12 fornecedores, com o aceite de cada um."
  </Mini>
);

