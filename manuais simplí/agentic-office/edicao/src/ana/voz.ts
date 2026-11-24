// Linha do tempo das falas da Ana: cada cena dura a fala + folgas, e os eventos visuais são
// marcados pela palavra dita (tempos vindos do edge-tts em scripts/gerar-voz.py).
export type Palavra = [number, number, string];
export type Fala = { readonly texto: string; readonly dur: number; readonly palavras: readonly Palavra[] };
export type Vozes = Record<string, Fala>;

export const FPS = 30;
export const ANTES = 8; // respiro antes da fala (frames)
export const DEPOIS = 14; // respiro depois

export type Cena = { id: string; de: number; dur: number; fala: Fala; extra: number };

// monta as cenas em sequência; `extra` estica uma cena além da fala (ex.: logo no fim)
export const montarCenas = (vozes: Vozes, ordem: readonly (string | [string, number])[]): Cena[] => {
  let f = 0;
  return ordem.map((o) => {
    const [id, extra] = typeof o === "string" ? [o, 0] : o;
    const fala = vozes[id];
    const dur = ANTES + Math.ceil(fala.dur * FPS) + DEPOIS + extra;
    const c = { id, de: f, dur, fala, extra };
    f += dur;
    return c;
  });
};

const normal = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

// frame (relativo ao início da cena) em que começa a n-ésima ocorrência da palavra
export const marca = (fala: Fala, palavra: string, n = 0): number => {
  const alvo = normal(palavra);
  const achadas = fala.palavras.filter((p) => normal(p[2]) === alvo);
  if (!achadas[n]) throw new Error(`palavra "${palavra}" (${n}) não está na fala "${fala.texto}"`);
  return ANTES + Math.round(achadas[n][0] * FPS);
};

// está falando neste frame? (para o anel do avatar pulsar com a voz)
export const falando = (fala: Fala, frame: number): boolean => {
  const s = (frame - ANTES) / FPS;
  return fala.palavras.some((p) => s >= p[0] - 0.03 && s <= p[1] + 0.06);
};
