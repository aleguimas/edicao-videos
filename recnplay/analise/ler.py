import json,sys,csv,collections
# imprime a transcrição em linhas de ~20 s com o assento que segura o microfone
ini,fim=int(sys.argv[1]),int(sys.argv[2])
ws=[]
for b in range(8):
  try: ws+= [w|{'off':0} for w in json.load(open(f'transcricao/blocos/{b:03d}.json'))]
  except FileNotFoundError: pass
seats={'A':(0.24,0.31),'B':(0.31,0.40),'C':(0.50,0.62),'D':(0.62,0.76)}
best=collections.defaultdict(dict)
for r in csv.DictReader(open('analise/poses.csv')):
  x,y,d=float(r['x']),float(r['y']),float(r['dist'])
  if y>0.48: continue
  for s,(a,b) in seats.items():
    if a<=x<b: best[int(r['seg'])][s]=min(best[int(r['seg'])].get(s,9),d)
linha=[];t0=None
def quem(a,b):
  c=collections.Counter(s for t in range(int(a),int(b)+1) for s in seats if best[t].get(s,9)<0.07)
  return ''.join(f"{s}{n}" for s,n in c.most_common(2))
for w in ws:
  t=(w['startMs']+w['off'])/1000
  if t<ini or t>fim: continue
  if t0 is None: t0=t
  linha.append(w['text'])
  if t-t0>20 and w['text'].rstrip().endswith(('.','?','!',',')):
    print(f"[{int(t0)//60:02d}:{int(t0)%60:02d} {quem(t0,t)}]{''.join(linha)}");linha=[];t0=None
if linha: print(f"[{int(t0)//60:02d}:{int(t0)%60:02d}]{''.join(linha)}")
