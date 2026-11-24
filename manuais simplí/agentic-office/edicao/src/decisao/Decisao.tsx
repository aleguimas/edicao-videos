import type React from "react";
import type { Vozes } from "../ana/voz";
import { Montagem, montarRoteiro } from "../verbas/Montagem";
import vozes from "../voz-decisao.json";
import { A1, A2, A3, A4, D1, D2, V1, V2 } from "./Telas";
import { D3, D4, F1, F2, G1, S1, S2, S3, S4 } from "./Telas2";

// Vídeo "Sistema de decisão" (16:9, YouTube), com a Ana. Falas em scripts/falas-decisao.json;
// roteiro em manuais simplí/agentic-office/sistema-de-decisao/roteiro.md.
const TELAS = { a1: A1, a2: A2, a3: A3, a4: A4, v1: V1, v2: V2, d1: D1, d2: D2, d3: D3, d4: D4, g1: G1, s1: S1, s2: S2, s3: S3, s4: S4, f1: F1, f2: F2 };
const SEM_PIP: Record<string, readonly [number, number]> = { a4: [860, 0], f2: [0, 860] };

const ROTEIRO = montarRoteiro(vozes as unknown as Vozes, ["a1", "a2", "a3", "a4", "v1", "v2", "d1", "d2", "d3", "d4", "g1", "s1", "s2", "s3", "s4", "f1", ["f2", 60]]);
export const DURACAO_DECISAO = ROTEIRO.duracao;
export const Decisao: React.FC = () => <Montagem itens={ROTEIRO.itens} duracao={ROTEIRO.duracao} telas={TELAS} pastaVoz="voz/decisao" semPip={SEM_PIP} />;

// piloto para aprovar o visual: gancho, apresentação, 8h e a primeira ação
const PILOTO = montarRoteiro(vozes as unknown as Vozes, ["a1", "a2", "a3", "a4", "v1", "v2", "d1", "d2"]);
export const DURACAO_DECISAO_PILOTO = PILOTO.duracao;
export const DecisaoPiloto: React.FC = () => <Montagem itens={PILOTO.itens} duracao={PILOTO.duracao} telas={TELAS} pastaVoz="voz/decisao" semPip={SEM_PIP} />;
export const INICIOS_DECISAO_PILOTO = Object.fromEntries(PILOTO.itens.flatMap((i) => (i.tipo === "fala" ? [[i.c.id, i.c.de]] : [])));
