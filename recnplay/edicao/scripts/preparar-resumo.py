# Prepara as mídias do vídeo resumo em public/resumo/: corta cada trecho do workshop
# e dos depoimentos (1080x1920, 30 fps) e aplica ganho LINEAR na voz para -15,5 LUFS
# com pico <= -1,5 dBTP (sem compressor). Trechos de b-roll saem sem áudio.
# Uso (de dentro de edicao/): python3 scripts/preparar-resumo.py [nome]
import json
import re
import subprocess
import sys

WORKSHOP = "../20261015_082734.mp4"
DEP = "../depoimentos/"
SAIDA = "public/resumo/"
ALVO_LUFS = -15.5
PICO_MAX = -1.5

# nome, origem, início, fim (s ou h:mm:ss.s), tem voz?
TRECHOS = [
    ("abertura-sala", WORKSHOP, "0:07:26.0", "0:07:33.0", False),
    ("vilma-abre", DEP + "Vilma Santos -1.mp4", "1.2", "11.95", True),
    ("robotizado", WORKSHOP, "0:30:11.6", "0:30:15.8", True),
    ("bando", WORKSHOP, "1:41:42.5", "1:41:47.0", True),
    ("chute", WORKSHOP, "1:30:32.0", "1:30:39.9", True),
    ("erra-valendo", WORKSHOP, "1:12:52.6", "1:13:01.8", True),
    ("estagiario", WORKSHOP, "1:15:18.3", "1:15:25.4", True),
    ("freio", WORKSHOP, "1:53:43.0", "1:53:47.8", True),
    ("broll-slide", WORKSHOP, "1:41:26.0", "1:41:28.5", False),
    ("broll-notebooks", WORKSHOP, "2:57:00.0", "2:57:02.5", False),
    ("broll-palestra", WORKSHOP, "0:45:00.0", "0:45:02.5", False),
    ("broll-sala-maira", WORKSHOP, "0:16:00.0", "0:16:16.0", False),
    ("maira-1", DEP + "Maira Calane.mp4", "8.4", "18.35", True),
    ("maira-2", DEP + "Maira Calane.mp4", "25.9", "29.2", True),
    ("simony", DEP + "Simony Bastos.mp4", "15.2", "22.3", True),
    ("vilma-fecha", DEP + "Vilma Santos -2.mp4", "25.3", "33.75", True),
]


def seg(t: str) -> float:
    s = 0.0
    for parte in t.split(":"):
        s = s * 60 + float(parte)
    return s


def ffmpeg(*args: str) -> str:
    r = subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-2000:])
    return r.stderr


def medir(origem: str, ini: float, dur: float) -> tuple[float, float]:
    log = ffmpeg("-ss", f"{ini}", "-t", f"{dur}", "-i", origem, "-vn",
                 "-af", "loudnorm=print_format=json", "-f", "null", "-")
    j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", log).group(0))
    return float(j["input_i"]), float(j["input_tp"])


so = sys.argv[1] if len(sys.argv) > 1 else None
for nome, origem, a, b, voz in TRECHOS:
    if so and so != nome:
        continue
    ini, dur = seg(a), seg(b) - seg(a)
    args = ["-v", "error", "-y", "-ss", f"{ini}", "-t", f"{dur}", "-i", origem,
            "-vf", "scale=1080:1920,format=yuv420p", "-r", "30",
            "-c:v", "h264_videotoolbox", "-b:v", "14M", "-movflags", "+faststart"]
    if voz:
        i, tp = medir(origem, ini, dur)
        ganho = min(ALVO_LUFS - i, PICO_MAX - tp)
        args += ["-af", f"volume={ganho:.2f}dB", "-c:a", "aac", "-b:a", "256k", "-ar", "48000"]
        info = f"{i:.1f} LUFS, pico {tp:.1f} → ganho {ganho:+.1f} dB"
    else:
        args += ["-an"]
        info = "b-roll sem áudio"
    ffmpeg(*args, f"{SAIDA}{nome}.mp4")
    print(f"{nome:18s} {dur:5.1f}s  {info}")
