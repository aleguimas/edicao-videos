#!/bin/bash
# Cortes dos depoimentos do workshop (todos verticais, saída 1080x1920 30 fps).
# Formato: "arquivo de origem|nome de saída|início|fim" (segundos).
# Uso (de dentro de edicao/): bash scripts/cortar-depoimentos.sh
set -e
ORIGEM=../depoimentos
SAIDA=../cortes/depoimentos
mkdir -p "$SAIDA"

CORTES=(
  # Vilma 1: termina logo após "…manusear as ferramentas", antes de ela rir/fazer careta (57s+)
  "Vilma Santos -1.mp4|vilma-santos-1|1.0|56.5"
  # Vilma 2: termina após "…muitas descobertas", antes de a câmera começar a se mexer (33.9s)
  "Vilma Santos -2.mp4|vilma-santos-2|1.1|33.75"
  # Maíra: termina em "…impressionado com as possibilidades" (sem o trecho do almoço)
  "Maira Calane.mp4|maira-calane|0.0|55.6"
  "Simony Bastos.mp4|simony-bastos|2.0|22.6"
)

for corte in "${CORTES[@]}"; do
  IFS='|' read -r origem nome ini fim <<< "$corte"
  dur=$(echo "$fim - $ini" | bc)
  echo "→ $nome (${ini}s–${fim}s)"
  npx remotion ffmpeg -v error -y -ss "$ini" -t "$dur" -i "$ORIGEM/$origem" \
    -vf "scale=1080:1920,format=yuv420p" -r 30 \
    -c:v h264_videotoolbox -b:v 12M -c:a aac -b:a 192k -ar 48000 \
    -movflags +faststart "$SAIDA/$nome.mp4"
done
# Vilma completo: contexto do vídeo 1 (até "…Sebrae Mato Grosso.") + vídeo 2 inteiro.
# O resto do vídeo 1 ("Foram dois dias…", "a IA veio para fortalecer…") repete o que ela diz melhor no 2.
echo "→ vilma-santos (1 + 2)"
npx remotion ffmpeg -v error -y \
  -ss 1.0 -t 24.05 -i "$ORIGEM/Vilma Santos -1.mp4" \
  -ss 1.1 -t 32.65 -i "$ORIGEM/Vilma Santos -2.mp4" \
  -filter_complex "[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[v][a];[v]scale=1080:1920,format=yuv420p[vout]" \
  -map "[vout]" -map "[a]" -r 30 \
  -c:v h264_videotoolbox -b:v 12M -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart "$SAIDA/vilma-santos.mp4"

echo "depoimentos em $SAIDA"
