#!/bin/zsh
# Render do vídeo longo em partes de 1 minuto (Mac de 8 GB: o render inteiro com 2 abas travou o
# Chrome por memória no frame 16170). Uma aba, retomável: pula partes que já existem e tenta de
# novo as que falharem. Cada parte sai em MKV com áudio PCM (h264-mkv), para a emenda do som ser
# exata; no fim o vídeo é copiado e o áudio vira AAC no MP4. (Renderizar só o áudio à parte
# custa quase um render inteiro: o Remotion avalia todos os quadros.)
# Uso (de dentro de edicao/): caffeinate -is zsh scripts/render-longo.sh
set -u
ID=VideoLongo
SAIDA=../video-longo.mp4
PASTA=../render-partes
PARTE=1800 # frames (60 s)
mkdir -p $PASTA

TOTAL=$(npx remotion compositions 2>/dev/null | awk -v id=$ID '$1 == id { print $4 }')
echo "total: $TOTAL frames"
n=$(( (TOTAL + PARTE - 1) / PARTE ))

for tentativa in 1 2 3; do
  faltam=0
  for ((i = 0; i < n; i++)); do
    arq=$PASTA/parte-$(printf %02d $i).mkv
    [[ -f $arq ]] && continue
    a=$(( i * PARTE )); b=$(( (i + 1) * PARTE - 1 )); (( b >= TOTAL )) && b=$(( TOTAL - 1 ))
    echo "parte $i: frames $a-$b ($(date +%H:%M))"
    if npx remotion render $ID $PASTA/tmp.mkv --frames=$a-$b --codec=h264-mkv --crf=17 \
        --concurrency=1 --hardware-acceleration=if-possible --timeout=600000 --log=error; then
      mv $PASTA/tmp.mkv $arq
    else
      echo "parte $i falhou (tentativa $tentativa)"; faltam=1
    fi
  done
  (( faltam == 0 )) && break
done

: > $PASTA/lista.txt
for ((i = 0; i < n; i++)); do echo "file 'parte-$(printf %02d $i).mkv'" >> $PASTA/lista.txt; done
npx remotion ffmpeg -v error -y -f concat -safe 0 -i $PASTA/lista.txt \
  -c:v copy -c:a aac -b:a 320k -movflags +faststart $SAIDA && echo "pronto: $SAIDA ($(date +%H:%M))"
