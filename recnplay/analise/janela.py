import json,sys
ws=[w for b in range(8) for w in json.load(open(f'transcricao/blocos/{b:03d}.json'))]
for arg in sys.argv[1:]:
  a,b=map(float,arg.split('-'))
  print(f"--- {arg}")
  print(' '.join(f"[{w['startMs']/1000:.1f}]{w['text'].strip()}" for w in ws if a<=w['startMs']/1000<=b))
