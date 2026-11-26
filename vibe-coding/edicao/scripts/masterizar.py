# Ganho + limitador suave no áudio do vídeo final (só biblioteca padrão).
# uso: python3 masterizar.py entrada.wav saida.wav ganho_db teto_db
import sys, wave, array, math
ent, sai, ganho_db, teto_db = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
w = wave.open(ent); ch = w.getnchannels(); sr = w.getframerate()
d = array.array('h', w.readframes(w.getnframes()))
g = 10 ** (ganho_db / 20); teto = 10 ** (teto_db / 20) * 32767
sol = math.exp(-1 / (0.12 * sr)); env = 0.0
out = array.array('h', bytes(len(d) * 2))
for i in range(0, len(d), ch):
    pico = max(abs(d[i + c]) for c in range(ch)) * g
    env = pico if pico > env else env * sol + pico * (1 - sol)
    r = teto / env if env > teto else 1.0
    for c in range(ch):
        v = d[i + c] * g * r
        out[i + c] = int(max(-teto, min(teto, v)))
o = wave.open(sai, 'wb'); o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr); o.writeframes(out.tobytes())
