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
    # 02 · chute muito bem escrito: abre com a pergunta + "chute muito bem escrito", depois
    # generativa × preditiva, o exemplo da planilha e fecha com "vai dar ruim"
    "corte02": [
        ("1:30:34.55", "1:30:40.20"),  # quanto eu vou vender em novembro? Ele vai dar um chute muito bem escrito.
        ("1:30:23.20", "1:30:26.10"),  # Uma vai criar, a outra vai calcular.
        ("1:30:41.50", "1:31:04.20"),  # Você bota lá a planilha […] uma base de cinco anos.
        ("1:31:08.50", "1:31:12.20"),  # E aí, a massa de dados é gigantesca. (sem a pausa do "Certo?")
        ("1:31:17.00", "1:31:27.90"),  # Vai trazer a informação […] Vai dar ruim no final das contas.
    ],
    # 03 · humano robotizado: abre com a frase, depois a explicação (automação apoia o
    # humano, "por que trabalhar como um robô?") e fecha com o tempo que se ganharia
    "corte03": [
        ("0:30:11.70", "0:30:15.70"),  # Hoje a gente tem muito humano robotizado dentro das empresas.
        ("0:29:36.70", "0:30:10.00"),  # Vai trazer o ser humano […] Por que que você tem que trabalhar como um robô?
        ("0:30:17.60", "0:30:25.60"),  # E o robô automação está sem uso. […] um tempo enorme no nosso dia.
    ],
    # 04 · a IA erra valendo + a IA é um estagiário: abre com "erra valendo", explica a
    # validação, vira para a analogia do estagiário e fecha com "dê uma função"
    "corte04": [
        ("1:12:52.75", "1:12:57.75"),  # Não é que ele pode, não. Ele erra mesmo. E ele erra valendo.
        ("1:12:43.00", "1:12:51.50"),  # Se você olhar no Cloud […] uma ferramenta de IA que pode errar.
        ("1:12:58.10", "1:13:01.90"),  # Só que o problema é que ele erra valendo achando que está certo.
        ("1:13:06.30", "1:13:10.70"),  # Então você tem que entender para poder validar aquilo que ele está trazendo.
        ("1:15:18.45", "1:15:32.55"),  # Entenda, a IA é um estagiário. […] Ensina, treina.
        ("1:15:37.60", "1:15:39.90"),  # Você acompanha.
        ("1:15:47.35", "1:15:48.90"),  # Dê uma função.
        ("1:15:53.30", "1:15:58.00"),  # Se você der mais de uma função, dependendo do estagiário vai dar ruim.
    ],
    # 06 · motor e freio + Fusquinha × Ferrari: abre com "o melhor motor… e o melhor freio",
    # explica a analogia da corrida e fecha com a Ferrari que "pode nem sair do lugar"
    "corte06": [
        ("1:53:43.20", "1:53:46.95"),  # Você tem que ter o melhor motor de aceleração, mas […] o melhor freio.
        ("1:53:17.60", "1:53:28.60"),  # Frear é a pior coisa. […] É a mesma coisa com a IA.
        ("1:53:34.10", "1:53:42.70"),  # Não é o carro que tem o melhor motor […] É um conjunto, né?
        ("1:53:47.90", "1:53:52.80"),  # E tem muito carro de corrida que perde porque o freio no meio da corrida já foi.
        ("1:53:58.30", "1:54:07.40"),  # E aí, quando você chega na curva […] a mesma coisa é IA.
        ("1:54:08.15", "1:54:12.60"),  # ou uma outra analogia mais fácil, você tem um Fusquinha e você tem uma Ferrari
        ("1:54:43.40", "1:54:57.50"),  # você sabe pilotar a Ferrari […] Você pode nem sair do lugar.
    ],
    # 07 · semáforo da IA: abre com o vermelho ("não entra: senhas, dados bancários, CPF"),
    # explica o verde e o amarelo e fecha com o ambiente seguro e "na dúvida, pare e pergunte"
    "corte07": [
        ("1:55:33.90", "1:55:41.30"),  # E o nunca, vermelho. Não entra. Senhas, dados bancários, CPF, essas informações.
        ("1:55:07.00", "1:55:31.90"),  # Então aqui é tomar cuidado com o copia e cola […] sem identificar pessoas.
        ("1:55:41.90", "1:55:57.10"),  # Só se você realmente tiver um ambiente seguro […] Na dúvida, pare e pergunte.
    ],
    # 10 · privacidade: abre com "tudo que você coloca é usado para treinar a ferramenta",
    # explica por que desligar (sua estratégia pode virar a de outro) e fecha com a marca
    "corte10": [
        ("1:56:09.40", "1:56:17.65"),  # Hoje, no plano individual, tudo que você coloca […] para treinar a ferramenta.
        ("1:56:20.20", "1:56:23.85"),  # Porém, você pode desligar isso daí.
        ("1:56:24.30", "1:56:35.95"),  # Ah, mas, Alexandre, quando que alguém vai pegar os dados […] É o mundo inteiro usando.
        ("1:56:37.00", "1:56:48.85"),  # Mas você acha que a sua pesquisa lá de estratégia […] colocou estratégia lá dentro?
        ("1:57:20.10", "1:57:25.20"),  # Se você não fizer esse trabalho com a equipe, […] um problema maior.
        ("1:57:26.60", "1:57:38.00"),  # E aí você pode acelerar muito rápido em três dias […] a marca da sua empresa.
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
