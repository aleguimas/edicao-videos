#!/bin/bash
# Renderiza o vídeo e masteriza o áudio (+4 dB com limitador em -1 dBFS).
set -e
cd "$(dirname "$0")/.."
# uso: ./scripts/render.sh [composição] [saída]
COMP=${1:-MontanhaRussa}
SAIDA=${2:-../montanha-russa-vibe-coder.mp4}
TMP=$(mktemp -d)
npx remotion render "$COMP" "$TMP/bruto.mp4" --crf=18 --concurrency=4 --gl=angle --log=error
npx remotion ffmpeg -v error -y -i "$TMP/bruto.mp4" -vn -ac 2 -ar 48000 "$TMP/audio.wav"
python3 scripts/masterizar.py "$TMP/audio.wav" "$TMP/master.wav" 4 -1
npx remotion ffmpeg -v error -y -i "$TMP/bruto.mp4" -i "$TMP/master.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -movflags +faststart "$SAIDA"
rm -rf "$TMP"
echo "ok: $SAIDA"
