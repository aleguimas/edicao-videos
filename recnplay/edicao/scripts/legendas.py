"""Alinha o texto corrigido de cada trecho aos tempos por palavra do Whisper.

Uso: python3 scripts/legendas.py <spec.json> <saida.json>
spec: {"<id>": [{"ini": s, "fim": s, "quem": "D", "texto": "frase corrigida"}, ...], ...}
saida: mesmo formato, cada trecho com "palavras": [{"t": texto, "a": inicio_s, "b": fim_s}]
Palavras corrigidas sem par no Whisper recebem tempo interpolado entre as vizinhas.
"""
import difflib, json, re, sys, unicodedata

ws = []
for b in range(8):
    ws += json.load(open(f"../transcricao/blocos/{b:03d}.json"))


def norm(s):
    s = unicodedata.normalize("NFD", s.lower()).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]", "", s)


def alinhar(tr):
    ini, fim = tr["ini"], tr["fim"]
    w = [x for x in ws if ini - 0.3 <= x["startMs"] / 1000 <= fim + 0.1]
    wt = [norm(x["text"]) for x in w]
    corr = tr["texto"].split()
    ct = [norm(x) for x in corr]
    sm = difflib.SequenceMatcher(a=ct, b=wt, autojunk=False)
    tempos = [None] * len(corr)
    for bl in sm.get_matching_blocks():
        for k in range(bl.size):
            x = w[bl.b + k]
            tempos[bl.a + k] = (x["startMs"] / 1000, x["endMs"] / 1000)
    # pontas: garante início e fim do trecho
    if tempos[0] is None:
        tempos[0] = (ini, ini + 0.3)
    if tempos[-1] is None:
        tempos[-1] = (fim - 0.3, fim)
    # interpola os buracos
    i = 0
    while i < len(tempos):
        if tempos[i] is None:
            j = i
            while tempos[j] is None:
                j += 1
            a0 = tempos[i - 1][1]
            b0 = tempos[j][0]
            n = j - i
            for k in range(n):
                tempos[i + k] = (a0 + (b0 - a0) * k / n, a0 + (b0 - a0) * (k + 1) / n)
            i = j
        i += 1
    out = []
    for k, (t, (a, b)) in enumerate(zip(corr, tempos)):
        a = max(ini, min(a, fim))
        b = max(a + 0.08, min(b, fim))
        out.append({"t": t, "a": round(a, 2), "b": round(b, 2)})
    return out


spec = json.load(open(sys.argv[1]))
for _id, trechos in spec.items():
    for tr in trechos:
        tr["palavras"] = alinhar(tr)
json.dump(spec, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
print("ok:", ", ".join(f"{k} ({len(v)} trechos)" for k, v in spec.items()))
