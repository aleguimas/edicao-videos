"""Gera os planos da câmera virtual e o ganho de voz por turno do vídeo completo.

Entrada: ../analise/turnos.txt (segundo de início + quem fala: A B C D, P = plateia, X = fora)
         ../analise/turnos-volume.json (loudness medido por turno)
         ../transcricao/blocos/*.json (tempos por palavra, para cortar nas pausas)
Saída:   src/rp/dados/planos.json e src/rp/dados/ganhos.json
Uso: python3 scripts/gerar-planos.py
"""
import json, os, random

ALVO_LUFS = -16.0
random.seed(26)

turnos = [l.split() for l in open("../analise/turnos.txt") if l.strip()]
turnos = [(float(a), s) for a, s in turnos]
ws = []
for b in range(8):
    ws += json.load(open(f"../transcricao/blocos/{b:03d}.json"))
palavras = [(w["startMs"] / 1000, w["endMs"] / 1000) for w in ws]

# pausas: meio do intervalo entre o fim de uma palavra e o início da próxima
pausas = []
for (a0, f0), (a1, _) in zip(palavras, palavras[1:]):
    if a1 - f0 >= 0.18:
        pausas.append(((f0 + a1) / 2, a1 - f0))


def na_pausa(t, janela=2.0):
    cands = [p for p in pausas if abs(p[0] - t) <= janela]
    if not cands:
        return t
    # prefere pausas maiores e mais perto
    return max(cands, key=lambda p: p[1] - abs(p[0] - t) * 0.15)[0]


LADO = {"A": "duplaEsq", "B": "duplaEsq", "C": "duplaDir", "D": "duplaDir"}
planos = []
for i, (ini, quem) in enumerate(turnos[:-1]):
    fim = turnos[i + 1][0]
    if quem in ("X", "P"):
        planos.append({"ini": ini, "fim": fim, "tipo": "geral"})
        continue
    t = ini
    ciclo = ["close", LADO[quem], "close", "geral"] if fim - ini > 45 else ["close", LADO[quem]]
    k = 0
    while t < fim - 0.01:
        tipo = ciclo[k % len(ciclo)]
        dur = {"close": random.uniform(11, 17), "geral": random.uniform(6, 9)}.get(tipo, random.uniform(8, 12))
        corte = na_pausa(t + dur)
        if corte <= t + 4 or fim - corte < 6:
            corte = fim
        p = {"ini": round(t, 2), "fim": round(corte, 2), "tipo": tipo}
        if tipo == "close":
            p["pessoa"] = quem
        planos.append(p)
        t = corte
        k += 1

# junta planos vizinhos iguais
fundidos = []
for p in planos:
    if fundidos and fundidos[-1]["tipo"] == p["tipo"] and fundidos[-1].get("pessoa") == p.get("pessoa"):
        fundidos[-1]["fim"] = p["fim"]
    else:
        fundidos.append(p)

vol = json.load(open("../analise/turnos-volume.json"))
ganhos = []
for v in vol:
    db = max(-9.0, min(0.0, ALVO_LUFS - v["lufs"]))
    ganhos.append({"ini": v["ini"], "fim": v["fim"], "quem": v["quem"], "ganho": round(10 ** (db / 20), 4)})

os.makedirs("src/rp/dados", exist_ok=True)
json.dump(fundidos, open("src/rp/dados/planos.json", "w"), indent=0)
json.dump(ganhos, open("src/rp/dados/ganhos.json", "w"), indent=0)
print(len(fundidos), "planos;", sum(1 for p in fundidos if p["tipo"] == "close"), "closes")
