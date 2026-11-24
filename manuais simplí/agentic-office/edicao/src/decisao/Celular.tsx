import type React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Icone } from "../agentic/App";
import { fonteMonoSistema } from "../fonte";
import { BotaoM, ChipM, DescricaoM, M, type QuadroTela } from "../mobile/Kit";

// Celular no vídeo 16:9 do "Sistema de decisão": a tela mobile real (kit dos cortes) dentro de um
// aparelho à esquerda; o lado direito fica para os números e os destaques. Dados fictícios (Loja Modelo).
export const TEL: QuadroTela = { x: 300, y: 70, w: 520, h: 820, raio: 44 };

// aparelho: moldura + o conteúdo (uma TelaM com quadro={TEL}); entra subindo
export const Celular: React.FC<{ readonly de?: number; readonly children: React.ReactNode }> = ({ de = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = de < 0 ? 1 : spring({ frame: frame - de, fps, config: { damping: 18, stiffness: 120 } });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: s, transform: `translateY(${(1 - s) * 80}px)` }}>
      <div
        style={{
          position: "absolute",
          left: TEL.x - 16,
          top: TEL.y - 16,
          width: TEL.w + 32,
          height: TEL.h + 32,
          borderRadius: (TEL.raio ?? 0) + 16,
          background: "#050605",
          border: "2px solid #2C322E",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 90px rgba(60,224,30,0.12)",
        }}
      />
      {children}
    </div>
  );
};

// toque do dedo: círculo que aparece e se abre
export const Toque: React.FC<{ readonly x: number; readonly y: number; readonly em: number }> = ({ x, y, em }) => {
  const frame = useCurrentFrame();
  const t = frame - em;
  if (t < -8 || t > 16) return null;
  const k = interpolate(t, [-8, 0, 16], [0, 1, 1.8], { extrapolateRight: "clamp" });
  const o = interpolate(t, [-8, -2, 4, 16], [0, 0.9, 0.9, 0], { extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.35)", border: "2px solid white", opacity: o, transform: `scale(${k})`, pointerEvents: "none" }} />;
};

// ---------- tela Decisões (lista)
export type ItemDecisao = { tipo: string; espera: string; meta: string; titulo: string; resumo: string; icone: string };
export const DECISOES: ItemDecisao[] = [
  {
    tipo: "Delegação da diretoria",
    espera: "esperando há 2 min",
    meta: "· César · delegada por Renata",
    titulo: "Promoção para 38 itens parados há 90 dias",
    resumo: "Montar uma promoção para os 38 itens sem giro, respeitando a margem mínima...",
    icone: "pessoas",
  },
  {
    tipo: "Delegação da diretoria",
    espera: "esperando há 2 min",
    meta: "· Mei · delegada por Otávio",
    titulo: "Diferença de R$ 1.450 nos recebíveis de cartão",
    resumo: "Conferir o lançamento de 14/11 apontado pela conciliação e propor o ajuste...",
    icone: "pessoas",
  },
  {
    tipo: "Acompanhamento",
    espera: "esperando há 2 min",
    meta: "· Plano de ação da semana",
    titulo: "3 pedidos de novo prazo",
    resumo: "Rafael, Pedro e Helena pediram mais tempo para entregar as ações...",
    icone: "acompanhamento",
  },
];

const IcoPessoas: React.FC = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={M.verde} strokeWidth={1.7} strokeLinecap="round">
    <circle cx={9} cy={8} r={3.5} />
    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.4c1.9.8 3 2.9 3 5.6" />
  </svg>
);
export const Quadradinho: React.FC<{ readonly children: React.ReactNode; readonly tam?: number }> = ({ children, tam = 36 }) => (
  <div style={{ width: tam, height: tam, flexShrink: 0, boxSizing: "border-box", borderRadius: 6, border: `1px solid ${M.borda}`, background: "rgba(22,40,30,0.8)", display: "grid", placeItems: "center", color: M.verde }}>{children}</div>
);

export const ListaDecisoes: React.FC<{ readonly aceso?: number; readonly itens?: ItemDecisao[]; readonly abas?: readonly (readonly [string, string])[] }> = ({ aceso = -1, itens = DECISOES, abas = [["Todas", "3"], ["Delegação da diretoria", "2"], ["Acompanhamento", "1"]] }) => (
  <>
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <Quadradinho>
        <Icone nome="decisoes" tam={18} cor={M.verde} />
      </Quadradinho>
      <div>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", lineHeight: 1.25 }}>Decisões</div>
        <DescricaoM>O que está esperando por você: entregas para aprovar, acessos para liberar, fluxos parados e pedidos dos agentes e do Acompanhamento.</DescricaoM>
      </div>
    </div>
    <div style={{ marginTop: 18, padding: 12, borderRadius: 10, border: `1px solid ${M.borda}`, background: M.card, display: "flex", flexWrap: "wrap", gap: 8 }}>
      {abas.map(([n, q], i) => [n, q, i === 0] as const).map(([n, q, on]) => (
        <div key={n} style={{ height: 32, boxSizing: "border-box", padding: "0 12px", display: "flex", alignItems: "center", gap: 8, borderRadius: 4, fontSize: 13.5, background: on ? "white" : "rgba(15,29,21,0.6)", color: on ? M.fundo : "white", border: on ? "none" : `1px solid ${M.borda}` }}>
          {n} <span style={{ color: on ? "#5A615C" : M.suave }}>{q}</span>
        </div>
      ))}
    </div>
    {itens.map((it, i) => (
      <div key={it.titulo} style={{ marginTop: 16, display: "flex", gap: 12, padding: 16, borderRadius: 10, background: M.card, border: `1px solid ${aceso === i ? M.verde : M.borda}`, boxShadow: aceso === i ? "0 0 18px rgba(134,239,172,0.35)" : "none" }}>
        <Quadradinho>{it.icone === "pessoas" ? <IcoPessoas /> : <Icone nome={it.icone} tam={18} cor={M.verde} />}</Quadradinho>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 8px", fontSize: 11.5, color: M.suave }}>
            <ChipM cheio style={{ fontSize: 11.5, padding: "3px 9px" }}>
              {it.tipo}
            </ChipM>
            <span>{it.espera}</span>
            <span>{it.meta}</span>
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 500, lineHeight: 1.35, marginTop: 8 }}>{it.titulo}</div>
          <div style={{ fontSize: 13, lineHeight: 1.4, color: M.suave, marginTop: 4 }}>{it.resumo}</div>
        </div>
      </div>
    ))}
  </>
);

// ---------- folha da decisão (tela cheia, por cima da barra branca)
export type Evento = { texto: string; quando: string; novo?: boolean };
export const FolhaDecisao: React.FC<{
  readonly k: number;
  readonly titulo: string;
  readonly tipo: string;
  readonly agente: string;
  readonly descricao: React.ReactNode;
  readonly botoes?: React.ReactNode;
  readonly revisao?: React.ReactNode;
  readonly entrega?: React.ReactNode;
  readonly eventos: readonly Evento[];
  readonly y?: number;
}> = ({ k, titulo, tipo, agente, descricao, botoes, revisao, entrega, eventos, y = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#101412", opacity: Math.min(1, k * 4), transform: `translateY(${(1 - k) * 100}%)`, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: -y, padding: "18px 17px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>{titulo}</div>
        <div style={{ width: 24, height: 24, flexShrink: 0, boxSizing: "border-box", borderRadius: 5, border: `1.5px solid ${M.verdeForte}`, display: "grid", placeItems: "center", fontSize: 13, color: M.suave }}>✕</div>
      </div>
      <div style={{ fontSize: 13.5, color: M.suave, marginTop: 8 }}>{tipo}</div>
      <div style={{ fontSize: 13.5, color: M.suave, marginTop: 38 }}>Agente: {agente}</div>
      <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", marginTop: 22 }}>DESCRIÇÃO</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 4 }}>{descricao}</div>
      {revisao}
      {botoes && <div style={{ display: "flex", gap: 8, marginTop: 20 }}>{botoes}</div>}
      {entrega}
      <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", marginTop: 26 }}>LINHA DO TEMPO</div>
      {eventos.map((e) => (
        <div key={e.texto} style={{ display: "flex", gap: 12, marginTop: 14, opacity: 1 }}>
          <div style={{ width: 16, paddingTop: 2, color: e.novo ? M.verde : M.suave }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x={4} y={8} width={16} height={12} rx={2} />
              <path d="M12 4v4M9 14h.01M15 14h.01" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12.5, lineHeight: 1.5, color: e.novo ? "white" : "#D8DDD9" }}>{e.texto}</div>
            <div style={{ fontSize: 11.5, color: M.suave, marginTop: 2 }}>{e.quando}</div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 30, fontSize: 14, fontWeight: 500 }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round">
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
        Abrir na tela de origem
      </div>
    </div>
  </div>
);

export const BotaoFolha: React.FC<{ readonly branco?: boolean; readonly aceso?: boolean; readonly children: React.ReactNode }> = ({ branco, aceso, children }) => (
  <BotaoM tipo={branco ? "branco" : "contorno"} aceso={aceso} tam={14} style={{ height: 36, padding: "0 16px", background: branco ? "white" : "#171C19" }}>
    {children}
  </BotaoM>
);

// rótulo pequeno do lado direito (fora do celular)
export const Rotulo: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: fonteMonoSistema, fontSize: 22, fontWeight: 600, letterSpacing: 4, color: "#86EFAC" }}>{children}</div>
);
