# Prepara a mídia do vídeo longo (16:9): cada bloco dos originais 4K vira 2560x1440/30 fps x264
# em public/longo/, para a câmera virtual do Remotion ter folga de zoom (aberto = quadro inteiro,
# médio = janela 1920x1080 sem ampliar, fechado = janela 1440x810). HLG entra sem tonemap (só
# marca bt709, como na missão). Fala com ganho LINEAR para -16 LUFS e pico <= -1,5 dBTP.
# Também extrai 1 quadro por segundo (960x540) em scripts/quadros/<bloco>/ para o rastreio.
# Uso (de dentro de edicao/): python3 scripts/preparar-longo.py [bloco ...]
import json
import os
import re
import subprocess
import sys

ORIGEM = "../"
SAIDA = "public/longo/"
QUADROS = "scripts/quadros/"
ALVO_LUFS = -16.0
PICO_MAX = -1.5

# bloco: (arquivo, início s, fim s) — os cortes finos ficam no Remotion
BLOCOS = {
    "v1": ("revestir-1.MOV", 55.0, 641.0),  # letramento inteiro
    "olho": ("revestir-2.MOV", 14.0, 72.0),  # olho de Deus, relatório das 9h, torre de controle
    "ferrari": ("revestir-2.MOV", 203.0, 244.0),  # Ferrari × Fusca, pegar na mão
    "agentes": ("revestir-2.MOV", 802.0, 980.0),  # estrutura de agentes, funcionário digital, conversacional
    "maturidade": ("revestir-2.MOV", 1043.0, 1061.0),  # maturidade junto com vocês
    "manha": ("revestir-2.MOV", 1178.0, 1211.0),  # análise de uma manhã em 30 minutos
    "confianca": ("revestir-2.MOV", 1286.0, 1330.0),  # 3, 5 processos, ganhar confiança
    "compras": ("revestir-2.MOV", 1402.0, 1490.0),  # abre a cabeça, compras é o coração, verba na planilha
    "dores": ("revestir-2.MOV", 1506.0, 1533.0),  # pense em cinco processos
    "gestores": ("revestir-2.MOV", 1632.0, 1663.0),  # por que juntamos os gestores
    "foco": ("revestir-2.MOV", 1722.0, 1801.0),  # foque em compras, alma do negócio, tem que ter um foco
    "sempre": ("revestir-2.MOV", 1984.0, 1991.0),  # a gente vai estar sempre por aqui
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
    arq, ini, fim = BLOCOS[nome]
    src, dur = ORIGEM + arq, fim - ini
    i, tp = medir(src, ini, dur)
    ganho = min(ALVO_LUFS - i, PICO_MAX - tp)
    out = f"{SAIDA}{nome}.mp4"
    # decodifica e codifica no hardware da Apple (VideoToolbox): o x264 levava ~7x o tempo real
    ffmpeg("-v", "error", "-y", "-hwaccel", "videotoolbox", "-ss", str(ini), "-t", str(dur), "-i", src,
           "-vf", "scale=2560:1440:flags=lanczos,format=yuv420p", "-r", "30",
           "-c:v", "h264_videotoolbox", "-b:v", "28M", "-profile:v", "high",
           "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
           "-af", f"volume={ganho:.2f}dB,aresample=48000", "-c:a", "aac", "-b:a", "256k",
           "-movflags", "+faststart", out)
    pasta = f"{QUADROS}{nome}/"
    os.makedirs(pasta, exist_ok=True)
    ffmpeg("-v", "error", "-y", "-i", out, "-vf", "scale=960:540", "-r", "1", "-start_number", "0", f"{pasta}%05d.jpg")
    i2, tp2 = medir(out)
    print(f"{nome}: {i:.1f} LUFS / pico {tp:.1f} → ganho {ganho:+.1f} dB → {i2:.1f} LUFS / pico {tp2:.1f}", flush=True)


os.makedirs(SAIDA, exist_ok=True)
for nome in sys.argv[1:] or BLOCOS:
    preparar(nome)
