import json,sys,re,unicodedata
def n(s): return re.sub(r'[^a-z0-9 ]','',unicodedata.normalize('NFD',s.lower()).encode('ascii','ignore').decode())
ws=[w for b in range(8) for w in json.load(open(f'transcricao/blocos/{b:03d}.json'))]
toks=[n(w['text']).strip() for w in ws]
for q in sys.argv[1:]:
  qs=n(q).split(); hits=[]
  for i in range(len(toks)):
    if [toks[i+k] if i+k<len(toks) else '' for k in range(len(qs))]==qs: hits.append(ws[i]['startMs']/1000)
  print(f"{q!r}: "+", ".join(f"{h:.2f}" for h in hits))
