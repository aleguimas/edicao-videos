# Prepara a mídia da visita: cada original vira 1080x1920/30 fps x264 CRF 14 em public/midia/,
# sem a marcação de rotação. As falas (01 e 02) recebem ganho LINEAR para -15,5 LUFS com
# pico <= -1,5 dBTP; as imagens de apoio guardam o som ambiente sem mexer.
# Uso (de dentro de edicao/): python3 scripts/preparar-midia.py
import json
import os
import re
import subprocess

ORIGEM = "../"
SAIDA = "public/midia/"
ALVO_LUFS = -15.5
PICO_MAX = -1.5

FALAS = {"01 Guimas.mp4": "fala01", "02 Guimas.mp4": "fala02"}
APOIO = {
    "1911 e faixada loja.mp4": "fachada-1911",
    "Armazém da Tramontina automatizado (por fora).mp4": "armazem",
    "Faixa  Loja Tramontina 115 anos criando laços e transformando vidas.mp4": "faixa-115-anos",
    "Grupo caminhando na entrada da fábrica.mp4": "grupo-caminhando",
    "Grupo na entrada da fábrica.mp4": "grupo-entrada",
    "História da Tramontina 1911.mp4": "historia-1911",
    "Munumento ao trabalhador - entrada da fábrica.mp4": "monumento",
    "grupo entrando na fábrica.mp4": "grupo-entrando",
    "hall da loja.mp4": "hall-loja",
}


def ffmpeg(*args: str) -> str:
    r = subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-2000:])
    return r.stderr


def medir(arquivo: str) -> tuple[float, float]:
    log = ffmpeg("-i", arquivo, "-vn", "-af", "loudnorm=print_format=json", "-f", "null", "-")
    j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", log).group(0))
    return float(j["input_i"]), float(j["input_tp"])


def preparar(origem: str, nome: str, ganho: float) -> None:
    tmp = f"{SAIDA}{nome}-tmp.mp4"
    ffmpeg("-v", "error", "-y", "-i", origem, "-vf", "scale=1080:1920,format=yuv420p", "-r", "30",
           "-af", f"volume={ganho:.2f}dB,aresample=48000",
           "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-c:a", "aac", "-b:a", "256k", tmp)
    ffmpeg("-v", "error", "-y", "-display_rotation", "0", "-i", tmp, "-c", "copy", "-movflags", "+faststart", f"{SAIDA}{nome}.mp4")
    os.remove(tmp)


os.makedirs(SAIDA, exist_ok=True)
for arq, nome in FALAS.items():
    i, tp = medir(ORIGEM + arq)
    ganho = min(ALVO_LUFS - i, PICO_MAX - tp)
    preparar(ORIGEM + arq, nome, ganho)
    i2, tp2 = medir(f"{SAIDA}{nome}.mp4")
    print(f"{nome}: {i:.1f} LUFS / pico {tp:.1f} → ganho {ganho:+.1f} dB → {i2:.1f} LUFS / pico {tp2:.1f}")
for arq, nome in APOIO.items():
    preparar(ORIGEM + arq, nome, 0)
    print(f"{nome}: ok")
