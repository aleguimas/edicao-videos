import csv,collections,json
seats={'A':(0.24,0.31),'B':(0.31,0.40),'C':(0.50,0.62),'D':(0.62,0.76),'P':(0.80,1.0)}
best=collections.defaultdict(dict)
for r in csv.DictReader(open('analise/poses.csv')):
  x,y,d=float(r['x']),float(r['y']),float(r['dist'])
  for s,(a,b) in seats.items():
    if a<=x<b and (y<0.48 or s=='P'): best[int(r['seg'])][s]=min(best[int(r['seg'])].get(s,9),d)
N=4465
lab=[]
for t in range(N):
  c=collections.Counter()
  for u in range(max(0,t-6),min(N,t+7)):
    for s in 'ABCD':
      if best[u].get(s,9)<0.07: c[s]+=1
  s,n=(c.most_common(1) or [('?',0)])[0]
  lab.append(s if n>=4 else '?')
# segmentos
seg=[];ini=0
for t in range(1,N+1):
  if t==N or lab[t]!=lab[ini]:
    seg.append([lab[ini],ini,t]);ini=t
# absorve segmentos curtos (<5s) no vizinho
out=[]
for s in seg:
  if out and (s[2]-s[1]<5 or s[0]==out[-1][0]): out[-1][2]=s[2]
  else: out.append(s)
ws=[w for b in range(8) for w in json.load(open(f'transcricao/blocos/{b:03d}.json'))]
for s,a,b in out:
  txt=''.join(w['text'] for w in ws if a<=w['startMs']/1000<a+6)
  print(f"{s} {a//60:02d}:{a%60:02d}-{b//60:02d}:{b%60:02d} {txt[:70]}")
