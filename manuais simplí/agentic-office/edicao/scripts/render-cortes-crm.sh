#!/bin/zsh
# Render dos 5 cortes 9:16 do Simplí CRM e das capas (de dentro de edicao/).
set -u
P=../../simpli-crm/apresentação/cortes
mkdir -p $P
typeset -A NOMES
NOMES=(1 agente-23h 2 orcamento-parado 3 cliente-antigo 4 app-vendedor 5 campanha-vendeu)
for n in 1 2 3 4 5; do
  npx remotion render CorteCrm$n $P/corte-0$n-$NOMES[$n].mp4 --codec=h264 --crf=18 --concurrency=1 --hardware-acceleration=if-possible --timeout=600000 --log=error && echo "ok corte $n ($(date +%H:%M))"
  npx remotion still CapaCorteCrm$n $P/capa-corte-0$n.png --log=error && echo "ok capa $n"
done
echo FIM
