"""Prepara os cortes 9:16: legendas por palavra (texto do Whisper com correções de nomes,
ou o texto corrigido do roteiro, alinhado) e planos alternando fechado/médio nas pausas.
Uso: python3 scripts/gerar-cortes.py  (lê roteiros/cortes.json, grava src/rp/dados/cortes.json)
"""
import json, random, re, subprocess, sys
sys.argv = ["", "x", "y"]
exec(open("scripts/legendas.py").read().split("spec = json.load")[0])  # importa ws, norm, alinhar

TROCAS = [
    (r"\bchat (EPT|GPT)\b", "ChatGPT"), (r"\bCloud\b", "Claude"), (r"\bMalve\b", "Malwee"),
    (r"\bGan\b", "Gun"), (r"Hack and Play", "Rec'n Play"), (r"Mid Journey", "Midjourney"),
    (r"\bDarwin\b", "DALL-E"), (r" -", "-"), (r"\bRaia\b", "Raí"), (r"\bISIS\b", "íris"),
]
random.seed(7)


def texto_whisper(a, b):
    t = " ".join(w["text"].strip() for w in ws if a - 0.05 <= w["startMs"] / 1000 <= b)
    for de, para in TROCAS:
        t = re.sub(de, para, t)
    return t


def pausas(a, b):
    sel = [w for w in ws if a <= w["startMs"] / 1000 <= b]
    return [((x["endMs"] + y["startMs"]) / 2000) for x, y in zip(sel, sel[1:]) if y["startMs"] - x["endMs"] >= 200]


def planos(tr):
    out, t, k = [], tr["ini"], 0
    ps = pausas(tr["ini"], tr["fim"])
    while t < tr["fim"] - 0.01:
        alvo = t + random.uniform(7, 11)
        cands = [p for p in ps if p > t + 4 and abs(p - alvo) < 3]
        corte = min(cands, key=lambda p: abs(p - alvo)) if cands and tr["fim"] - alvo > 4 else tr["fim"]
        out.append({"ini": round(t, 2), "fim": round(corte, 2), "h": 720 if k % 2 == 0 else 930})
        t, k = corte, k + 1
    return out


spec = json.load(open("roteiros/cortes.json"))
for nome, c in spec.items():
    for tr in c["trechos"] + [c["gancho"]]:
        if "texto" not in tr:
            tr["texto"] = texto_whisper(tr["ini"], tr["fim"])
        tr["palavras"] = alinhar(tr)
    for tr in c["trechos"]:
        tr["planos"] = planos(tr)
    dur = sum(t["fim"] - t["ini"] for t in c["trechos"]) + c["gancho"]["fim"] - c["gancho"]["ini"]
    print(f"{nome}: {dur:.0f}s de fala")
json.dump(spec, open("src/rp/dados/cortes.json", "w"), ensure_ascii=False, indent=1)
