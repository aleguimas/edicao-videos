# Gera a voz da Ana (edge-tts) para cada fala do roteiro e grava o tempo de cada palavra.
# Uso: <venv>/bin/python -I scripts/gerar-voz.py scripts/falas-verbas.json public/voz/verbas src/voz-verbas.json
# Saída: um mp3 por fala + JSON {id: {dur, palavras: [[ini, fim, palavra], ...]}} em segundos.
# Só regera a fala cujo texto mudou (o texto usado fica gravado no JSON).
import asyncio
import json
import os
import subprocess
import sys
import time

import edge_tts
from edge_tts import communicate as _comunicacao

# O edge-tts manda todo pedido como <speak xml:lang='en-US'>. A Thalita é multilíngue e, nas
# frases curtas ou ambíguas ("Bora simplificar?"), segue essa marca e fala com sotaque americano.
# Forçamos pt-BR no SSML. LINGUA_SSML só existe para o teste de sotaque (scripts/validar-sotaque).
LINGUA = os.environ.get("LINGUA_SSML", "pt-BR")
_mkssml = _comunicacao.mkssml
_comunicacao.mkssml = lambda tc, texto: _mkssml(tc, texto).replace("xml:lang='en-US'", f"xml:lang='{LINGUA}'")


async def gerar(texto, voz, velocidade, destino):
    c = edge_tts.Communicate(texto, voz, rate=velocidade, boundary="WordBoundary")
    palavras = []
    with open(destino, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                ini = ch["offset"] / 1e7
                palavras.append([round(ini, 3), round(ini + ch["duration"] / 1e7, 3), ch["text"]])
    return palavras


def duracao(arq):
    # afinfo vem no macOS: "estimated duration: 2.400000 sec"
    out = subprocess.run(["afinfo", arq], capture_output=True, text=True).stdout
    linha = next(l for l in out.splitlines() if "estimated duration" in l)
    return float(linha.split(":")[1].split()[0])


def main():
    roteiro, pasta, saida = sys.argv[1:4]
    cfg = json.load(open(roteiro))
    os.makedirs(pasta, exist_ok=True)
    antigo = json.load(open(saida)) if os.path.exists(saida) else {}
    novo = {}
    for fala in cfg["falas"]:
        arq = os.path.join(pasta, f"{fala['id']}.mp3")
        ant = antigo.get(fala["id"])
        if ant and ant.get("texto") == fala["texto"] and ant.get("lingua") == LINGUA and ant.get("voz") == fala.get("voz") and os.path.exists(arq):
            novo[fala["id"]] = ant
            continue
        for tentativa in range(6):  # o serviço às vezes devolve vazio
            try:
                palavras = asyncio.run(gerar(fala["texto"], fala.get("voz", cfg["voz"]), fala.get("velocidade", cfg["velocidade"]), arq))
                break
            except edge_tts.exceptions.NoAudioReceived:
                if tentativa == 5:
                    raise
                time.sleep(10 * (tentativa + 1))
        # grafia fonética só na voz: a legenda e as marcas usam a palavra certa ("Nôuxan" -> "Notion")
        for pal in palavras:
            for fon, certa in cfg.get("grafias", {}).items():
                pal[2] = pal[2].replace(fon, certa)
        novo[fala["id"]] = {"texto": fala["texto"], "lingua": LINGUA, **({"voz": fala["voz"]} if "voz" in fala else {}), "dur": round(duracao(arq), 3), "palavras": palavras}
        print(f"{fala['id']}: {novo[fala['id']]['dur']:.2f} s, {len(palavras)} palavras")
        json.dump({**antigo, **novo}, open(saida, "w"), ensure_ascii=False, indent=1)  # não perde o progresso se o serviço falhar
    json.dump(novo, open(saida, "w"), ensure_ascii=False, indent=1)


main()
