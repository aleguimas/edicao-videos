# Prepara um corte editado do workshop: monta os trechos (na ordem dada, permitindo
# abrir com o gancho) direto do original, em 1080x1920/30 fps x264 CRF 14, com ganho
# LINEAR por trecho para -15,5 LUFS e pico <= -1,5 dBTP. Zera a marcação de rotação.
# Uso (de dentro de edicao/): python3 scripts/preparar-corte.py corte01
import json
import os
import re
import subprocess
import sys

WORKSHOP = "../20261015_082734.mp4"
SAIDA = "public/cortes/"
ALVO_LUFS = -15.5
PICO_MAX = -1.5

# nome: lista de (início, fim) no workshop, na ordem em que entram no corte
CORTES = {
    # 01 · banco ou bando de dados: abre com a pergunta (gancho), depois a explicação
    # e fecha com "a planilha que só eu entendo" (a pergunta não se repete no meio)
    "corte01": [
        ("1:41:42.60", "1:41:46.95"),  # Sua empresa hoje […] tem um banco de dados ou tem um bando de dados?
        ("1:41:00.00", "1:41:41.20"),  # O que você coloca dentro da IA […] Essa é a realidade, tá?
        ("1:41:49.20", "1:41:56.40"),  # Pois é, essa é a preocupação. […] a planilha que só eu entendo.
    ],
}


def seg(t: str) -> float:
    s = 0.0
    for p in t.split(":"):
        s = s * 60 + float(p)
    return s


def ffmpeg(*args: str) -> str:
    r = subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-2000:])
    return r.stderr


def medir(arquivo: str, ini: float, dur: float) -> tuple[float, float]:
    log = ffmpeg("-ss", f"{ini}", "-t", f"{dur}", "-i", arquivo, "-vn", "-af", "loudnorm=print_format=json", "-f", "null", "-")
    j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", log).group(0))
    return float(j["input_i"]), float(j["input_tp"])


nome = sys.argv[1]
os.makedirs(SAIDA, exist_ok=True)
entradas: list[str] = []
filtro = ""
t = 0.0
for k, (a, b) in enumerate(CORTES[nome]):
    ini, dur = seg(a), seg(b) - seg(a)
    i, tp = medir(WORKSHOP, ini, dur)
    ganho = min(ALVO_LUFS - i, PICO_MAX - tp)
    print(f"trecho {k + 1}: {a}–{b} → no corte {t:.2f}–{t + dur:.2f}s  {i:.1f} LUFS → ganho {ganho:+.1f} dB")
    t += dur
    entradas += ["-ss", f"{ini}", "-t", f"{dur}", "-i", WORKSHOP]
    filtro += f"[{k}:v:0]scale=1080:1920,format=yuv420p[v{k}];[{k}:a:0]volume={ganho:.2f}dB,aresample=48000[a{k}];"
n = len(CORTES[nome])
filtro += "".join(f"[v{k}][a{k}]" for k in range(n)) + f"concat=n={n}:v=1:a=1[v][a]"
tmp = f"{SAIDA}{nome}-tmp.mp4"
ffmpeg("-v", "error", "-y", *entradas, "-filter_complex", filtro, "-map", "[v]", "-map", "[a]", "-r", "30",
       "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", tmp)
ffmpeg("-v", "error", "-y", "-display_rotation", "0", "-i", tmp, "-c", "copy", "-movflags", "+faststart", f"{SAIDA}{nome}.mp4")
os.remove(tmp)
i, tp = medir(f"{SAIDA}{nome}.mp4", 0, 9999)
print(f"{SAIDA}{nome}.mp4: {t:.2f}s, {i:.1f} LUFS, pico {tp:.1f} dBTP")
