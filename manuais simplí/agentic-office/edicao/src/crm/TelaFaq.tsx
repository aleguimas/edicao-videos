import type React from "react";
import { CartaoCrm, COR_CRM, DEGRADE_ATIVO, Icone, TelaCrm } from "./Kit";

// FAQ: perguntas e PDFs que viram conhecimento do Agente de IA.
const PERGUNTAS: { texto: string; tema?: string; pdf?: boolean }[] = [
  { texto: "Onde fica a Loja Modelo?", tema: "Localidade" },
  { texto: "Quais as formas de pagamento aceitas?", tema: "Pagamento" },
  { texto: "Qual o prazo e como funciona o frete/entrega?", tema: "Entrega" },
  { texto: "Quais tipos de pisos, porcelanatos e acabamentos vocês vendem?", tema: "Produtos", pdf: true },
  { texto: "Como solicitar um orçamento ou enviar minha lista de material?", tema: "Vendas / Qualificação" },
  { texto: "Vocês têm encarte de promoções ou ofertas ativas?", pdf: true },
  { texto: "Condições para arquitetos, engenheiros, mestres de obras e construtoras", tema: "Parcerias B2B" },
  { texto: "Falar sobre entrega atrasada, troca, avaria ou SAC" },
];

const Etiqueta: React.FC<{ fundo: string; cor: string; children: React.ReactNode }> = ({ fundo, cor, children }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: fundo, color: cor, fontSize: 13, padding: "2px 9px", borderRadius: 999 }}>{children}</span>
);

export const TelaFaq: React.FC = () => (
  <TelaCrm ativo="faq">
    <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 26 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, color: COR_CRM.suave }}>Base de Conhecimento</div>
        <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.25 }}>FAQ — Perguntas Frequentes</div>
        <div style={{ fontSize: 15.5, color: COR_CRM.suave, marginTop: 2 }}>Cadastre perguntas, respostas e documentos (PDF ou Markdown) para o Agente de IA atender clientes automaticamente.</div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0, marginLeft: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 16px", background: "#FFFFFF", border: `1px solid ${COR_CRM.borda}`, borderRadius: 8, fontSize: 15.5 }}>
          <Icone nome="arquivo" tam={15} /> Ver arquivados (2)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 18px", background: DEGRADE_ATIVO, color: "#FFFFFF", borderRadius: 8, fontSize: 15.5 }}>
          <Icone nome="mais" tam={15} /> Nova pergunta
        </div>
      </div>
    </div>
    <CartaoCrm estilo={{ padding: "18px 32px" }}>
      {PERGUNTAS.map((p, i) => (
        <div key={p.texto} style={{ display: "flex", alignItems: "center", gap: 14, height: 64, borderBottom: i < PERGUNTAS.length - 1 ? `1px solid ${COR_CRM.borda}` : "none" }}>
          <Icone nome="seta" tam={15} cor="#344054" />
          <span style={{ fontSize: 16.5, fontWeight: 600 }}>{p.texto}</span>
          {p.tema ? <Etiqueta fundo={COR_CRM.cinza} cor="#344054">{p.tema}</Etiqueta> : null}
          {p.pdf ? (
            <Etiqueta fundo={COR_CRM.verdeClaro} cor="#047857">
              <Icone nome="documento" tam={12} cor="#047857" /> PDF
            </Etiqueta>
          ) : null}
        </div>
      ))}
    </CartaoCrm>
  </TelaCrm>
);
