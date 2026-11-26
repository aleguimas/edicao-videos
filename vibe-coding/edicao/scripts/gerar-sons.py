# Gera os efeitos sonoros do vídeo da montanha-russa (só biblioteca padrão do Python).
# Saída: public/audio/*.wav, 44,1 kHz mono 16 bits.
import math
import os
import random
import struct
import wave

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(OUT, exist_ok=True)
random.seed(7)


def salvar(nome, amostras, ganho=0.9):
    pico = max(1e-9, max(abs(a) for a in amostras))
    k = ganho / pico
    with wave.open(os.path.join(OUT, nome), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, a * k)) * 32767)) for a in amostras))
    print("ok", nome, f"{len(amostras) / SR:.2f}s")


def vazio(seg):
    return [0.0] * int(seg * SR)


def somar(base, sinal, t0, ganho=1.0):
    i0 = int(t0 * SR)
    for i, a in enumerate(sinal):
        if i0 + i < len(base):
            base[i0 + i] += a * ganho
    return base


def clique(freq=2600, dur=0.03, ruido=0.6):
    n = int(dur * SR)
    out = []
    for i in range(n):
        t = i / SR
        env = math.exp(-t * 180)
        out.append(env * (math.sin(2 * math.pi * freq * t) * (1 - ruido) + random.uniform(-1, 1) * ruido))
    return out


def passa_baixa(sinal, cortes):
    # cortes: função t -> frequência de corte (Hz)
    out, y = [], 0.0
    for i, a in enumerate(sinal):
        fc = cortes(i / SR)
        alfa = 1 - math.exp(-2 * math.pi * fc / SR)
        y += alfa * (a - y)
        out.append(y)
    return out


def ruido(seg):
    return [random.uniform(-1, 1) for _ in range(int(seg * SR))]


# Catraca da subida: um "tec" a cada 4 quadros (30 fps) por 9,8 s
catraca = vazio(9.8)
t = 0.0
while t < 9.75:
    somar(catraca, clique(freq=random.choice([2300, 2500, 2700]), dur=0.035), t, random.uniform(0.7, 1.0))
    somar(catraca, clique(freq=900, dur=0.05, ruido=0.2), t + 0.004, 0.35)
    t += 4 / 30
salvar("catraca.wav", catraca, 0.8)


# Whoosh (ruído com filtro que abre e fecha)
def whoosh(dur, pico=3800, base=250):
    r = ruido(dur)
    f = passa_baixa(r, lambda t: base + (pico - base) * math.sin(math.pi * min(1, t / dur)) ** 2)
    return [a * math.sin(math.pi * min(1, i / SR / dur)) ** 1.5 for i, a in enumerate(f)]


salvar("whoosh.wav", whoosh(0.9))
salvar("queda.wav", whoosh(1.6, pico=5200, base=180))


# Notificação: duas notas curtas
def nota(freq, dur, decai=7.0):
    return [math.exp(-i / SR * decai) * (math.sin(2 * math.pi * freq * i / SR) + 0.3 * math.sin(4 * math.pi * freq * i / SR)) * min(1, i / 200) for i in range(int(dur * SR))]


ding = vazio(0.8)
somar(ding, nota(1318.5, 0.6), 0)
somar(ding, nota(1760, 0.7), 0.09)
salvar("ding.wav", ding, 0.7)

# Sucesso (arpejo maior)
sucesso = vazio(1.0)
for k, f in enumerate([1046.5, 1318.5, 1568, 2093]):
    somar(sucesso, nota(f, 0.7, 6), k * 0.07, 0.8)
salvar("sucesso.wav", sucesso, 0.6)

# Vibração do celular: dois zumbidos
vibra = vazio(0.75)
for t0 in (0.0, 0.38):
    z = [math.copysign(1, math.sin(2 * math.pi * 155 * i / SR)) * 0.6 * math.sin(math.pi * i / (0.26 * SR)) for i in range(int(0.26 * SR))]
    somar(vibra, passa_baixa(z, lambda t: 900), t0)
salvar("vibra.wav", vibra, 0.8)

# Impacto no chão
imp = vazio(1.8)
fase = 0.0
for i in range(len(imp)):
    t = i / SR
    f = 35 + 75 * math.exp(-t * 6)
    fase += 2 * math.pi * f / SR
    imp[i] = math.sin(fase) * math.exp(-t * 2.6)
estouro = passa_baixa(ruido(0.5), lambda t: 1800 * math.exp(-t * 8) + 120)
somar(imp, [a * math.exp(-i / SR * 9) for i, a in enumerate(estouro)], 0, 1.4)
imp = [math.tanh(a * 1.6) for a in imp]
salvar("impacto.wav", imp, 0.95)

# Rebobinar: dente de serra subindo, picotado, com chiado de fita
dur = 1.6
reb = []
fase = 0.0
for i in range(int(dur * SR)):
    t = i / SR
    f = 180 * (1 + 7 * (t / dur) ** 1.6)
    fase = (fase + f / SR) % 1
    serra = 2 * fase - 1
    picote = 0.55 + 0.45 * math.sin(2 * math.pi * 22 * t)
    env = min(1, t / 0.05) * min(1, (dur - t) / 0.12)
    reb.append((serra * 0.5 * picote + random.uniform(-1, 1) * 0.25) * env)
reb = passa_baixa(reb, lambda t: 5000)
salvar("rebobinar.wav", reb, 0.7)

# Contador da fatura: tiques acelerando por 2,8 s
tiques = vazio(3.0)
t, passo = 0.0, 0.12
while t < 2.7:
    somar(tiques, clique(freq=3600, dur=0.02, ruido=0.3), t, 0.8)
    t += passo
    passo = max(0.035, passo * 0.93)
somar(tiques, nota(880, 0.5, 5), 2.72, 0.9)
salvar("tiques.wav", tiques, 0.6)

# Pop do checklist
pop = []
fase = 0.0
for i in range(int(0.16 * SR)):
    t = i / SR
    f = 500 + 900 * min(1, t / 0.05)
    fase += 2 * math.pi * f / SR
    pop.append(math.sin(fase) * math.exp(-t * 28))
salvar("pop.wav", pop, 0.6)

# Riser do gancho: ruído que abre + tom subindo
dur = 3.2
r = passa_baixa(ruido(dur), lambda t: 200 + 5500 * (t / dur) ** 2)
fase = 0.0
riser = []
for i, a in enumerate(r):
    t = i / SR
    fase += 2 * math.pi * (110 * 2 ** (2 * t / dur)) / SR
    riser.append((a * 0.6 + 0.4 * math.sin(fase)) * (t / dur) ** 1.4 * min(1, (dur - t) / 0.05))
salvar("riser.wav", riser, 0.7)

# Vento da versão POV: ruído grave que respira, 15 s
dur = 15.0
r = passa_baixa(ruido(dur), lambda t: 500 + 350 * math.sin(t * 1.3) + 250 * math.sin(t * 3.7))
r = passa_baixa(r, lambda t: 1400)
salvar("vento.wav", [a * min(1, i / SR / 0.5) * min(1, (dur - i / SR) / 0.5) for i, a in enumerate(r)], 0.8)

# ---------- Fatura ao vivo ----------
# Impressora térmica: motor + agulhadas rápidas, 0,7 s
imp = vazio(0.7)
for i in range(len(imp)):
    t = i / SR
    imp[i] = 0.25 * math.sin(2 * math.pi * 120 * t) * (0.6 + 0.4 * math.sin(2 * math.pi * 30 * t))
t = 0.0
while t < 0.65:
    somar(imp, clique(freq=random.choice([3200, 3600, 4100]), dur=0.012, ruido=0.7), t, 0.5)
    t += 0.018
imp = [a * min(1, i / 400) * min(1, (len(imp) - i) / 2000) for i, a in enumerate(imp)]
salvar("impressora.wav", imp, 0.7)

# Papel rasgando: estalos de ruído agudo em sequência, 0,7 s
rasgo = vazio(0.75)
t = 0.0
while t < 0.65:
    dur = random.uniform(0.01, 0.035)
    r = [random.uniform(-1, 1) * math.exp(-k / SR * 60) for k in range(int(dur * SR))]
    somar(rasgo, r, t, random.uniform(0.4, 1.0))
    t += random.uniform(0.006, 0.02)
rasgo = passa_baixa(rasgo, lambda t: 6000)
salvar("rasgo.wav", rasgo, 0.8)

# Carimbo: batida seca e grave
carimbo = vazio(0.5)
fase = 0.0
for i in range(len(carimbo)):
    t = i / SR
    fase += 2 * math.pi * (60 + 120 * math.exp(-t * 30)) / SR
    carimbo[i] = math.sin(fase) * math.exp(-t * 14)
somar(carimbo, passa_baixa([random.uniform(-1, 1) * math.exp(-k / SR * 70) for k in range(int(0.08 * SR))], lambda t: 2500), 0, 0.8)
carimbo = [math.tanh(a * 1.8) for a in carimbo]
salvar("carimbo.wav", carimbo, 0.95)
