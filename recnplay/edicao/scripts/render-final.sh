#!/bin/bash
# Render final do Rec'n Play 2026. Retomável: pula arquivos que já existem.
# Uso: bash scripts/render-final.sh   (rodar em recnplay/edicao)
set -u
cd "$(dirname "$0")/.."
OUT=..
R="npx remotion render"
OPC="--codec=h264 --crf=16 --audio-bitrate=320k --concurrency=4 --timeout=300000"

# 1) resumo e cortes
[ -f $OUT/resumo-recnplay-90s.mp4 ] || $R Resumo90 $OUT/resumo-recnplay-90s.mp4 $OPC >/dev/null 2>&1 && echo "resumo ok"
NOMES=(x usar-a-ia funcionario-numero-um criatividade-humana mesma-ia-resultados-diferentes por-onde-comecar decisao-final-e-sua de-2-dias-para-10-minutos estrategia-de-negocio a-ia-vai-tirar-meu-emprego antes-da-tecnologia-pessoas)
mkdir -p $OUT/cortes
for i in 01 02 03 04 05 06 07 08 09 10; do
  f="$OUT/cortes/corte$i-${NOMES[$((10#$i))]}.mp4"
  [ -f "$f" ] || { $R corte$i "$f.tmp.mp4" $OPC >/dev/null 2>&1 && mv "$f.tmp.mp4" "$f"; }
  echo "corte$i $( [ -f "$f" ] && echo ok || echo ERRO)"
done

# 2) completo: vídeo em blocos sem áudio
TOTAL=$(npx remotion compositions 2>/dev/null | awk '$1=="Completo"{print $4}')
BLOCO=18000
mkdir -p $OUT/previa/blocos
n=0; ini=0
: > $OUT/previa/blocos/lista.txt
while [ $ini -lt $TOTAL ]; do
  fim=$((ini + BLOCO - 1)); [ $fim -ge $TOTAL ] && fim=$((TOTAL - 1))
  f=$OUT/previa/blocos/bloco$n.mp4
  [ -f $f ] || { $R Completo $f.tmp.mp4 --frames=$ini-$fim --muted --codec=h264 --crf=16 --concurrency=4 --timeout=300000 >/dev/null 2>&1 && mv $f.tmp.mp4 $f; }
  echo "bloco$n $ini-$fim $( [ -f $f ] && echo ok || echo ERRO)"
  echo "file '$(cd $OUT/previa/blocos && pwd)/bloco$n.mp4'" >> $OUT/previa/blocos/lista.txt
  n=$((n + 1)); ini=$((fim + 1))
done

# 3) áudio do completo nos mesmos blocos (de uma vez estoura a memória), depois junta
A=$OUT/previa/blocos/audio-completo.wav
if [ ! -f $A ]; then
  : > $OUT/previa/blocos/lista-audio.txt
  n=0; ini=0
  while [ $ini -lt $TOTAL ]; do
    fim=$((ini + BLOCO - 1)); [ $fim -ge $TOTAL ] && fim=$((TOTAL - 1))
    f=$OUT/previa/blocos/audio$n.wav
    [ -f $f ] || { $R Completo $f.tmp.wav --frames=$ini-$fim --codec=wav --concurrency=4 --timeout=300000 >/dev/null 2>&1 && mv $f.tmp.wav $f; }
    echo "audio$n $( [ -f $f ] && echo ok || echo ERRO)"
    echo "file '$(cd $OUT/previa/blocos && pwd)/audio$n.wav'" >> $OUT/previa/blocos/lista-audio.txt
    n=$((n + 1)); ini=$((fim + 1))
  done
  npx remotion ffmpeg -v error -y -f concat -safe 0 -i $OUT/previa/blocos/lista-audio.txt -c copy $A.tmp.wav && mv $A.tmp.wav $A
fi
echo "audio $( [ -f $A ] && echo ok || echo ERRO)"

# 4) junta vídeo + áudio
F=$OUT/conversa-recnplay-2026-completo.mp4
[ -f $F ] || npx remotion ffmpeg -v error -y -f concat -safe 0 -i $OUT/previa/blocos/lista.txt -i $A \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -movflags +faststart $F
echo "completo $( [ -f $F ] && echo ok || echo ERRO)"
