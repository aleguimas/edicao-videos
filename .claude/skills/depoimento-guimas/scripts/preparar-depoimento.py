# Prepara um depoimento para edição: monta os trechos direto dos originais (sem passar
# pelos cortes intermediários), em 1080x1920/30 fps com x264 CRF 14 (sem perda visível),
# e aplica ganho LINEAR em cada trecho para -15,5 LUFS com pico <= -1,5 dBTP: sem
# compressor nem limitador, a voz fica intacta e trechos gravados em tomadas diferentes
# chegam ao mesmo volume.
# Uso (de dentro de edicao/): python3 scripts/preparar-depoimento.py vilma-santos
import json
import os
import re
import subprocess
import sys

DEP = "../depoimentos/"
SAIDA = "public/depoimentos/"
ALVO_LUFS = -15.5
PICO_MAX = -1.5

# nome: lista de (arquivo, início s, fim s)
DEPOIMENTOS = {
    # contexto do vídeo 1 (até "…Sebrae Mato Grosso.") + vídeo 2 inteiro (sem a repetição do fim do 1)
    "vilma-santos": [("Vilma Santos -1.mp4", 1.0, 25.05), ("Vilma Santos -2.mp4", 1.1, 33.75)],
    "simony-bastos": [("Simony Bastos.mp4", 2.0, 22.6)],
    # Simony (Sebrae MT, parceira) + Geraldo (participante) num vídeo só: depoimentos curtos (~20 s cada)
    "simony-geraldo": [("Simony Bastos.mp4", 2.1, 22.3), ("Geraldo Costa - Estrela da Borracha.mp4", 1.6, 20.2)],
    "maira-calane": [("Maira Calane.mp4", 0.0, 55.6)],
}


def ffmpeg(*args: str) -> str:
    r = subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-2000:])
    return r.stderr


def medir(arquivo: str, ini: float, dur: float) -> tuple[float, float]:
    log = ffmpeg("-ss", f"{ini}", "-t", f"{dur}", "-i", arquivo, "-vn",
                 "-af", "loudnorm=print_format=json", "-f", "null", "-")
    j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", log).group(0))
    return float(j["input_i"]), float(j["input_tp"])


nome = sys.argv[1]
trechos = DEPOIMENTOS[nome]
entradas: list[str] = []
filtro = ""
for k, (arq, ini, fim) in enumerate(trechos):
    dur = fim - ini
    i, tp = medir(DEP + arq, ini, dur)
    ganho = min(ALVO_LUFS - i, PICO_MAX - tp)
    print(f"trecho {k + 1}: {arq} {ini}–{fim}s  {i:.1f} LUFS, pico {tp:.1f} → ganho {ganho:+.1f} dB")
    entradas += ["-ss", f"{ini}", "-t", f"{dur}", "-i", DEP + arq]
    filtro += f"[{k}:v:0]scale=1080:1920,format=yuv420p[v{k}];[{k}:a:0]volume={ganho:.2f}dB,aresample=48000[a{k}];"
filtro += "".join(f"[v{k}][a{k}]" for k in range(len(trechos)))
filtro += f"concat=n={len(trechos)}:v=1:a=1[v][a]"

ffmpeg("-v", "error", "-y", *entradas, "-filter_complex", filtro, "-map", "[v]", "-map", "[a]",
       "-r", "30", "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p",
       "-c:a", "aac", "-b:a", "256k", f"{SAIDA}{nome}-tmp.mp4")
# Celular grava em pé com marcação de rotação (-90°). O ffmpeg já gira os quadros, mas às
# vezes copia a marcação para a saída e o player gira de novo (vídeo deitado). Zera a marcação
# sem reencodar.
ffmpeg("-v", "error", "-y", "-display_rotation", "0", "-i", f"{SAIDA}{nome}-tmp.mp4", "-c", "copy",
       "-movflags", "+faststart", f"{SAIDA}{nome}.mp4")
os.remove(f"{SAIDA}{nome}-tmp.mp4")
i, tp = medir(f"{SAIDA}{nome}.mp4", 0, 9999)
print(f"{SAIDA}{nome}.mp4: {i:.1f} LUFS, pico {tp:.1f} dBTP")
