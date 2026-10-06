# Converte scripts/centro.json (centro horizontal do apresentador por frame,
# gerado pelo recortar.swift) em keyframes de câmera e de zoom prontos para
# colar no topo de src/Apresentacao.tsx.
# Uso (na pasta do projeto): python3 <skill>/scripts/calcular-camera.py
import json

JANELA = 25  # frames de cada lado na média móvel (suaviza a câmera)
PASSO = 15  # um keyframe a cada 0,5 s
# Com zoom 1 a janela 1080 mostra metade da largura original (2160), então o
# centro mínimo alcançável é 0,25. Abaixo disso aplicamos zoom extra.
CENTRO_MIN = 0.25
ZOOM_MAX = 1.2

c = json.load(open("scripts/centro.json"))
n = len(c)
validos = [x for x in c if x >= 0]
padrao = sum(validos) / len(validos) if validos else 0.3
for i in range(n):
    if c[i] < 0:
        c[i] = next((x for x in c[i:] if x >= 0), padrao)

suave = []
for i in range(n):
    trecho = c[max(0, i - JANELA) : i + JANELA + 1]
    suave.append(sum(trecho) / len(trecho))

frames = list(range(0, n, PASSO))
if frames[-1] != n - 1:
    frames.append(n - 1)
centros = [round(suave[i], 3) for i in frames]

# Zoom: 1 por padrão; sobe até ZOOM_MAX nos trechos em que o apresentador
# passa da borda. Keyframes só nas mudanças, para a transição ficar suave.
zoom_bruto = [round(min(max(CENTRO_MIN / max(suave[i], 0.01), 1), ZOOM_MAX), 2) for i in frames]
zoom_bruto = [1 if z < 1.08 else z for z in zoom_bruto]  # ignora zooms mínimos
zf, zv = [0], [zoom_bruto[0]]
for f, z in zip(frames[1:], zoom_bruto[1:]):
    if abs(z - zv[-1]) >= 0.05:
        zf.append(f)
        zv.append(z)
if zf[-1] != n - 1:
    zf.append(n - 1)
    zv.append(zv[-1])


def lista(v):
    linhas, atual = [], "  "
    for x in v:
        s = f"{x}, "
        if len(atual) + len(s) > 80:
            linhas.append(atual.rstrip())
            atual = "  "
        atual += s
    linhas.append(atual.rstrip())
    return "\n".join(linhas)


print(f"// {n} frames")
print(f"const CAMERA_FRAMES = [\n{lista(frames)}\n];")
print(f"const CAMERA_CENTRO_X = [\n{lista(centros)}\n];")
print(f"const ZOOM_FRAMES = [{', '.join(map(str, zf))}];")
print(f"const ZOOM = [{', '.join(map(str, zv))}];")
