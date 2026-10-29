# Prepara a mídia da missão Revestir: cada trecho dos originais (horizontais, 4K HLG do iPhone ou
# 1080p) vira um recorte 9:16 em 1080x1920/30 fps x264 CRF 14 em public/midia/.
# O recorte pode andar (pan) de cx0 até cx1 ao longo do trecho. HLG entra sem tonemap: só
# reescala e marca bt709 (o tonemap deixava a parede vinho rosada e estourada).
# As falas recebem ganho LINEAR para -15,5 LUFS com pico <= -1,5 dBTP; o resto sai sem som.
# Uso (de dentro de edicao/): python3 scripts/preparar-midia.py [nome ...]
import json
import os
import re
import subprocess
import sys

ORIGEM = "../"
SAIDA = "public/midia/"
ALVO_LUFS = -15.5
PICO_MAX = -1.5

V1, V2 = "revestir-1.MOV", "revestir-2.MOV"
# nome: (arquivo, início s, duração s, largura do recorte na origem, cx0, cx1, topo, fala?)
# altura do recorte = largura · 16/9
TRECHOS = {
    # falas do Guimas
    "gancho": (V1, 69.6, 10.8, 900, 1640, 1900, 400, True),  # quando a gente diz que vai colocar IA na empresa… não é bem assim
    "agentes": (V2, 911.3, 11.6, 1215, 1450, 1900, 0, True),  # a IA vai entender… três agentes… tudo conversacional
    "juntos": (V2, 229.3, 11.8, 800, 1260, 1260, 490, True),  # a gente não vai só trazer a plataforma… pegar na mão e vamos juntos
    "gestores": (V2, 1635.8, 7.5, 860, 880, 880, 390, True),  # por que juntamos os gestores… a equipe não compra
    # viagem
    "aeroporto-1": ("aeroporto-1.MOV", 0.2, 2.6, 1215, 1790, 1790, 0, False),
    "aeroporto-2": ("aeroporto-2.MOV", 0.0, 2.0, 1215, 2350, 2150, 0, False),
    "aviao": ("avião-1.mp4", 0.4, 2.0, 607, 1000, 1100, 0, False),
    "carro": ("carro-1.MOV", 0.3, 2.0, 1215, 1700, 2300, 0, False),
    # loja
    "fachada": ("loja-revestir.mp4", 0.3, 4.0, 607, 420, 1000, 0, False),
    "loja-entrada": ("loja-revestir.mp4", 12.3, 2.6, 607, 900, 1050, 0, False),
    "loja-dentro": ("loja-revestir.mp4", 16.8, 3.4, 607, 800, 1150, 0, False),
    # sala: letramento
    "slide-ia": (V1, 247.0, 3.0, 1100, 2150, 2350, 100, False),
    "experimentacao": (V1, 398.0, 3.0, 1100, 2200, 2000, 100, False),
    "caio": (V1, 118.0, 3.4, 900, 3330, 3330, 250, False),
    "como-usar": (V1, 600.0, 3.0, 1100, 2250, 2450, 100, False),
}


def ffmpeg(*args: str) -> str:
    r = subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-2000:])
    return r.stderr


def medir(arquivo: str, ini: float = 0, dur=None):
    janela = ["-ss", str(ini), "-t", str(dur)] if dur else []
    log = ffmpeg(*janela, "-i", arquivo, "-vn", "-af", "loudnorm=print_format=json", "-f", "null", "-")
    j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", log).group(0))
    return float(j["input_i"]), float(j["input_tp"])


def preparar(nome: str) -> None:
    arq, ini, dur, w, cx0, cx1, topo, fala = TRECHOS[nome]
    src = ORIGEM + arq
    h = round(w * 16 / 9)
    x = f"min(max(0,{cx0}+({cx1}-{cx0})*t/{dur}-{w}/2),iw-{w})"
    vf = f"crop=w={w}:h={h}:x='{x}':y={topo},scale=1080:1920:flags=lanczos,format=yuv420p"
    cor = ["-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709"]
    if fala:
        i, tp = medir(src, ini, dur)
        ganho = min(ALVO_LUFS - i, PICO_MAX - tp)
        audio = ["-af", f"volume={ganho:.2f}dB,aresample=48000", "-c:a", "aac", "-b:a", "256k"]
    else:
        audio = ["-an"]
    out = f"{SAIDA}{nome}.mp4"
    ffmpeg("-v", "error", "-y", "-ss", str(ini), "-t", str(dur), "-i", src, "-vf", vf, "-r", "30",
           "-c:v", "libx264", "-crf", "14", "-preset", "medium", *cor, *audio, "-movflags", "+faststart", out)
    if fala:
        i2, tp2 = medir(out)
        print(f"{nome}: {i:.1f} LUFS / pico {tp:.1f} → ganho {ganho:+.1f} dB → {i2:.1f} LUFS / pico {tp2:.1f}")
    else:
        print(f"{nome}: ok")


os.makedirs(SAIDA, exist_ok=True)
for nome in sys.argv[1:] or TRECHOS:
    preparar(nome)
