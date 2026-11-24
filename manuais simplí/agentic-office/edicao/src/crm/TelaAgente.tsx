import type React from "react";
import { ChaveCrm, CartaoCrm, COR_CRM, DEGRADE_ATIVO, Icone, SeloCrm, TelaCrm } from "./Kit";

// Módulo Agente de IA: a chave liga e desliga a IA em cada canal.
type Canal = {
  nome: string;
  icone: string;
  ligada: number;
  aviso: string;
  numeros: string;
  catalogo: boolean;
};

const CANAIS: Canal[] = [
  { nome: "whatsapp-loja-modelo", icone: "fala", ligada: 1, aviso: "A IA atende 24 horas, todos os dias.", numeros: "1.284 atendimentos · 3.912 mensagens", catalogo: true },
  { nome: "instagram-loja-modelo", icone: "instagram", ligada: 0, aviso: "A IA atende 24 horas, todos os dias.", numeros: "312 atendimentos · 845 mensagens", catalogo: false },
];

const Numero: React.FC<{ rotulo: string; valor: string; nota: string; verde?: boolean }> = ({ rotulo, valor, nota, verde }) => (
  <CartaoCrm estilo={{ flex: 1, padding: "16px 17px" }}>
    <div style={{ fontSize: 13.5, color: COR_CRM.suave }}>{rotulo}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color: verde ? COR_CRM.verdeEscuro : COR_CRM.texto, margin: "3px 0" }}>{valor}</div>
    <div style={{ fontSize: 13, color: COR_CRM.suave }}>{nota}</div>
  </CartaoCrm>
);

const Segmento: React.FC<{ opcoes: string[]; ativo: string }> = ({ opcoes, ativo }) => (
  <div style={{ display: "inline-flex", border: `1px solid ${COR_CRM.borda}`, borderRadius: 7, padding: 2 }}>
    {opcoes.map((o) => (
      <span key={o} style={{ padding: "4px 10px", fontSize: 13.5, borderRadius: 5, color: o === ativo ? "#FFFFFF" : "#475467", background: o === ativo ? DEGRADE_ATIVO : "transparent" }}>
        {o}
      </span>
    ))}
  </div>
);

const LinhaCanal: React.FC<{ canal: Canal; ligada: number; ultima?: boolean; modo?: string }> = ({ canal, ligada, ultima, modo = "Full-time" }) => {
  const on = ligada > 0.5;
  return (
    <div style={{ display: "flex", gap: 16, padding: "17px 21px", borderBottom: ultima ? "none" : `1px solid ${COR_CRM.borda}` }}>
      <div style={{ width: 40, height: 40, borderRadius: 20, background: on ? COR_CRM.verdeClaro : COR_CRM.cinza, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icone nome={canal.icone} tam={19} cor={on ? COR_CRM.verdeEscuro : COR_CRM.suave} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15.5, fontWeight: 600 }}>{canal.nome}</span>
          {on ? (
            <SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857">Atendendo agora</SeloCrm>
          ) : (
            <SeloCrm fundo={COR_CRM.cinza} cor={COR_CRM.suave}>Desligado</SeloCrm>
          )}
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 14, color: "#344054" }}>{on ? "Ligada" : "Desligada"}</span>
          <ChaveCrm ligada={ligada} />
        </div>
        <div style={{ fontSize: 14, color: COR_CRM.suave, marginTop: 1, visibility: modo === "Full-time" ? "visible" : "hidden" }}>{on ? canal.aviso : "A IA não responde neste canal até ser ligada de novo."}</div>
        <div style={{ fontSize: 14, color: "#475467" }}>{canal.numeros}</div>
        <div style={{ display: "flex", gap: 24, marginTop: 13 }}>
          <div>
            <div style={{ fontSize: 11.5, letterSpacing: 0.6, color: COR_CRM.suave, marginBottom: 5 }}>QUANDO ATENDE</div>
            <Segmento opcoes={["Horário comercial", "Full-time", "Fora do horário"]} ativo={modo} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, letterSpacing: 0.6, color: COR_CRM.suave, marginBottom: 5 }}>RAG (CATÁLOGO)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Segmento opcoes={["ON", "OFF"]} ativo={canal.catalogo ? "ON" : "OFF"} />
              <span style={{ fontSize: 13.5, color: COR_CRM.suave }}>{canal.catalogo ? "Consulta o catálogo nesta caixa" : "Só prompt + FAQ nesta caixa"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TelaAgenteIA: React.FC<{ instagramLigada?: number; modo?: string }> = ({ instagramLigada = 0, modo }) => {
  const ligados = instagramLigada > 0.5 ? 2 : 1;
  return (
    <TelaCrm ativo="agente-ia">
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 22 }}>
        <div style={{ width: 48, height: 48, borderRadius: 24, background: COR_CRM.verdeClaro, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icone nome="robo" tam={21} cor={COR_CRM.verdeEscuro} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>Ana</div>
          <div style={{ fontSize: 15, color: COR_CRM.suave }}>Agente de IA da Loja Modelo</div>
        </div>
        <SeloCrm fundo={COR_CRM.verdeClaro} cor="#047857">
          <span style={{ fontSize: 13.5 }}>● Atendendo agora em {ligados} {ligados > 1 ? "canais" : "canal"}</span>
        </SeloCrm>
        <Icone nome="atualizar" tam={16} cor={COR_CRM.suave} />
      </div>
      <div style={{ display: "flex", gap: 17, marginBottom: 24 }}>
        <Numero rotulo="Atendimentos" valor="1.596" nota="18 hoje" />
        <Numero rotulo="Mensagens enviadas" valor="4.757" nota="52 hoje" />
        <Numero rotulo="Ligada há" valor="5 meses" nota="desde 02/06/2026" verde />
        <Numero rotulo="Canais ligados" valor={`${ligados} de 2`} nota="whatsapp-loja-modelo" verde />
      </div>
      <CartaoCrm>
        <div style={{ display: "flex", alignItems: "center", padding: "13px 21px", borderBottom: `1px solid ${COR_CRM.borda}` }}>
          <span style={{ fontSize: 15.5, fontWeight: 600, flex: 1 }}>Canais</span>
          <Icone nome="relogio" tam={14} cor={COR_CRM.suave} />
          <span style={{ fontSize: 13.5, color: COR_CRM.suave, marginLeft: 6 }}>Horário comercial: Seg–Sex 08:00–18:00</span>
        </div>
        <LinhaCanal canal={CANAIS[0]} ligada={1} modo={modo} />
        <LinhaCanal canal={CANAIS[1]} ligada={instagramLigada} ultima />
      </CartaoCrm>
      <CartaoCrm estilo={{ marginTop: 24, overflow: "hidden" }}>
        <div style={{ padding: "13px 21px", borderBottom: `1px solid ${COR_CRM.borda}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15.5, fontWeight: 600 }}>
            <Icone nome="olho" tam={15} />
            Logs de observação
          </div>
          <div style={{ fontSize: 13.5, color: COR_CRM.suave, marginTop: 2 }}>
            No SimpliChat, arraste a resposta da IA para responder, mencione o @ do bot da empresa e descreva o que houve. A menção sempre sai como nota privada e aparece aqui.
          </div>
        </div>
        <div style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14.5, color: COR_CRM.suave }}>Nenhuma observação ainda.</div>
      </CartaoCrm>
    </TelaCrm>
  );
};
