#!/bin/zsh
# Prepara os arquivos de mídia a partir do vídeo original do iPhone.
# Uso (na pasta do projeto): zsh scripts/preparar.sh
set -e

ORIGINAL=../originais/IMG_6273.MOV

# 1. HDR (HLG) -> SDR, 30fps, resolução nativa 2160x3840.
#    Áudio: ganho linear para -15,5 LUFS com pico abaixo de -1,5 dBTP
#    (o original batia em 0 dBTP). Sem compressão: a voz não é alterada.
npx remotion ffmpeg -hide_banner -v error -y -i $ORIGINAL \
  -vf "zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p" \
  -r 30 \
  -af "loudnorm=I=-15.5:TP=-1.5:LRA=11:measured_I=-13.61:measured_TP=0.02:measured_LRA=3.30:measured_thresh=-25.23:offset=0.16:linear=true,aresample=48000" \
  -c:v libx264 -crf 15 -preset medium -profile:v high -movflags +faststart \
  -c:a aac -b:a 256k -map 0:v:0 -map 0:a:0 public/apresentacao.mp4

# 2. Recorte das pessoas quadro a quadro (Apple Vision) + centro do apresentador
rm -rf scripts/recorte
swift scripts/recortar.swift

# 3. Recorte -> WebM VP9 com canal alfa
npx remotion ffmpeg -hide_banner -v error -y -framerate 30 -i scripts/recorte/%04d.png \
  -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -crf 22 -b:v 0 \
  -deadline good -cpu-used 4 -row-mt 1 public/apresentador-recorte.webm

echo "ok"
