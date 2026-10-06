# Gera uma trilha instrumental original (sem direitos de terceiros): beat
# eletrônico em Lá menor (~115 BPM). O andamento é ajustado para que um tempo
# forte caia exatamente no --impacto (início da transição para a logo), onde
# entra um impacto precedido de uma subida.
# Uso (na pasta do projeto):
#   python3 <skill>/scripts/gerar-trilha.py --duracao 15.1 --impacto 12.5 [--final-cheio]
#   --final-cheio: o beat continua por baixo da logo (padrão: só o acorde final)
# Saída: public/trilha.wav (ou o caminho de --saida)
import argparse
import math
import random
import struct
import wave
from array import array

ap = argparse.ArgumentParser()
ap.add_argument("--duracao", type=float, required=True, help="duração total do vídeo (s)")
ap.add_argument("--impacto", type=float, required=True, help="início da transição para a logo (s)")
ap.add_argument("--final-cheio", action="store_true")
ap.add_argument("--saida", default="public/trilha.wav")
args = ap.parse_args()

SR = 44100
DURACAO = args.duracao
IMPACTO = args.impacto
# número inteiro de compassos até o impacto, com andamento mais próximo de 115
_compassos = max(1, round(IMPACTO * 115 / 240))
COMPASSO = IMPACTO / _compassos
BEAT = COMPASSO / 4
N = int(SR * DURACAO)
FINAL_CHEIO = args.final_cheio
SAIDA = args.saida
print(f"{60 / BEAT:.1f} BPM, {_compassos} compassos até o impacto")

esq = array("d", [0.0]) * N
dir_ = array("d", [0.0]) * N
random.seed(7)


def somar(inicio, amostras, ganho=1.0, pan=0.0):
    i0 = int(inicio * SR)
    ge = ganho * math.cos((pan + 1) * math.pi / 4)
    gd = ganho * math.sin((pan + 1) * math.pi / 4)
    for k, v in enumerate(amostras):
        i = i0 + k
        if i >= N:
            break
        esq[i] += v * ge
        dir_[i] += v * gd


def bumbo(forte=1.0):
    dur = int(0.32 * SR)
    fase = 0.0
    out = []
    for k in range(dur):
        t = k / SR
        f = 45 + 110 * math.exp(-t * 28)
        fase += 2 * math.pi * f / SR
        env = math.exp(-t * 9)
        clique = math.exp(-t * 400) * 0.3
        out.append((math.sin(fase) * env + clique) * forte)
    return out


def ruido_filtrado(dur_s, decai, corte_alto=True):
    dur = int(dur_s * SR)
    out = []
    ant = 0.0
    for k in range(dur):
        r = random.uniform(-1, 1)
        v = r - ant if corte_alto else r
        ant = r
        out.append(v * math.exp(-(k / SR) * decai))
    return out


def palma():
    out = [0.0] * int(0.2 * SR)
    for atraso in (0.0, 0.008, 0.016):
        rajada = ruido_filtrado(0.18, 22 if atraso == 0.016 else 60)
        a = int(atraso * SR)
        for k, v in enumerate(rajada):
            if a + k < len(out):
                out[a + k] += v * 0.5
    return out


def nota(freq, dur_s, decai, harmonicos, corte=1.0):
    dur = int(dur_s * SR)
    out = []
    for k in range(dur):
        t = k / SR
        v = 0.0
        for h in range(1, harmonicos + 1):
            v += math.sin(2 * math.pi * freq * h * t) / (h ** (1.0 + (1 - corte)))
        ataque = min(1.0, t / 0.004)
        out.append(v * ataque * math.exp(-t * decai))
    return out


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


# Am – F – C – G (raiz do baixo e notas do arpejo, em MIDI)
ACORDES = [
    (45, [69, 72, 76, 72]),
    (41, [65, 69, 72, 69]),
    (48, [67, 72, 76, 72]),
    (43, [67, 71, 74, 71]),
]

BUMBO = bumbo()
BUMBO_FORTE = bumbo(1.3)
PALMA = palma()
CHIMBAL = ruido_filtrado(0.05, 90)
CHIMBAL_ABERTO = ruido_filtrado(0.22, 14)

compassos_groove = math.ceil(DURACAO / COMPASSO) if FINAL_CHEIO else _compassos
for c in range(compassos_groove):
    t0 = c * COMPASSO
    raiz, arpejo = ACORDES[c % 4]
    intro = c == 0
    for b in range(4):
        tb = t0 + b * BEAT
        if not intro or b >= 2:
            somar(tb, BUMBO, 0.9)
        if b in (1, 3):
            somar(tb, PALMA, 0.35 if not intro else 0.2, 0.1)
        # chimbal em colcheias no contratempo + semicolcheias leves
        somar(tb + BEAT / 2, CHIMBAL_ABERTO if b == 3 else CHIMBAL, 0.22, 0.35)
        somar(tb + BEAT / 4, CHIMBAL, 0.08, -0.35)
        somar(tb + 3 * BEAT / 4, CHIMBAL, 0.1, -0.35)
        # baixo pulsando no contratempo
        for s in (0.5, 0.75):
            somar(tb + s * BEAT, nota(hz(raiz), 0.16, 14, 6, 0.6), 0.3)
    # arpejo em semicolcheias, alternando os lados
    for s in range(16):
        m = arpejo[s % 4] + (12 if s % 8 == 7 else 0)
        somar(t0 + s * BEAT / 4, nota(hz(m), 0.2, 16, 3, 0.5), 0.07 if intro else 0.1, -0.4 if s % 2 else 0.4)

# subida (ruído crescente) no compasso antes do impacto
dur_sub = int(COMPASSO * SR)
subida = []
for k in range(dur_sub):
    p = k / dur_sub
    subida.append(random.uniform(-1, 1) * (p ** 3) * 0.25)
somar(IMPACTO - COMPASSO, subida, 1.0)

# impacto na entrada da logo + acorde de Lá menor sustentado
somar(IMPACTO, BUMBO_FORTE, 1.0)
somar(IMPACTO, ruido_filtrado(1.6, 2.2), 0.25, -0.2)
somar(IMPACTO, ruido_filtrado(1.6, 2.4), 0.25, 0.2)
somar(IMPACTO, nota(hz(33), 2.6, 1.4, 6, 0.5), 0.35)
for m, pan in ((57, -0.3), (60, 0.0), (64, 0.3), (69, 0.0)):
    somar(IMPACTO, nota(hz(m), 2.6, 1.3, 4, 0.4), 0.09, pan)

# fade final curto e normalização a -1 dBFS
fade = int(0.4 * SR)
for k in range(fade):
    g = 1 - k / fade
    esq[N - fade + k] *= g
    dir_[N - fade + k] *= g
pico = max(max(abs(v) for v in esq), max(abs(v) for v in dir_))
ganho = 10 ** (-1 / 20) / pico

with wave.open(SAIDA, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    quadros = bytearray()
    for a, b in zip(esq, dir_):
        quadros += struct.pack("<hh", int(a * ganho * 32767), int(b * ganho * 32767))
    w.writeframes(bytes(quadros))
print("ok")
