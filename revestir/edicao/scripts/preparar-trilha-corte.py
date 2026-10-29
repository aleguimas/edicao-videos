# Prepara a trilha de fundo de um corte: trecho da música (início + duração), ganho LINEAR
# para -15,5 LUFS (mesma referência da voz; no Remotion ela entra a ~0,12 sob a fala),
# fade-out de 1,5 s no fim e WAV 48 kHz.
# Uso (de dentro de edicao/): python3 scripts/preparar-trilha-corte.py "<musica>" <inicio s> <duracao s> public/cortes/trilha-<corte>.wav
import json
import re
import subprocess
import sys

musica, ini, dur, saida = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]


def ffmpeg(*args: str) -> str:
    r = subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", *args], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr[-2000:])
    return r.stderr


log = ffmpeg("-ss", f"{ini}", "-t", f"{dur}", "-i", musica, "-vn", "-af", "loudnorm=print_format=json", "-f", "null", "-")
j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", log).group(0))
ganho = min(-15.5 - float(j["input_i"]), -1.5 - float(j["input_tp"]))
# fade-out manual (o ffmpeg do Remotion não tem afade): volume com expressão no tempo
fade = f"volume='if(gt(t,{dur - 1.5}),max(0,({dur}-t)/1.5),1)':eval=frame"
ffmpeg("-v", "error", "-y", "-ss", f"{ini}", "-t", f"{dur}", "-i", musica, "-vn",
       "-af", f"volume={ganho:.2f}dB,{fade},aresample=48000", "-c:a", "pcm_s16le", saida)
print(f"{saida}: {dur:.1f} s de {musica} a partir de {ini:.1f} s, {j['input_i']} LUFS → ganho {ganho:+.1f} dB")
