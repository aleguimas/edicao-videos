#!/bin/bash
# Trilha "Running Faster" (Infraction, sem copyright, crédito na descrição) ajustada ao vídeo de 60 s.
# Estrutura medida (scripts/analisar-musica.mjs): ~85,4 BPM (compasso 2,81 s); parte cheia 26–72 s,
# parte mais calma 74–98 s, drop em 99,2 s, parte cheia até o acorde final em 144,9 s, cauda até 150 s.
# Montagem: música a partir de 64,2 s (vídeo 0 s) -> o drop de 99,2 s cai no "mão na massa" (vídeo 35 s);
# no compasso 4 após o drop (110,45 s) salta para 133,04 s (8 compassos, +100 ms medidos no casamento da bateria), levando o acorde final
# (144,9 s) para o impacto do @aleguimas (vídeo 58,2 s). Ganho -6,3 dB: original a -8,9 LUFS com pico > 0 dBTP.
set -e
npx remotion ffmpeg -v error -y -i ../../musicas/videoplayback.mp4 \
  -filter_complex "[0:a]atrim=64.2:110.45,asetpts=PTS-STARTPTS[a];[0:a]atrim=133.04:150.5,asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1,volume=-6.3dB,aresample=48000" \
  -c:a pcm_s16le public/resumo/trilha-infraction-60.wav
npx remotion ffmpeg -hide_banner -i public/resumo/trilha-infraction-60.wav -af loudnorm=print_format=json -f null - 2>&1 | grep -E "input_i|input_tp"

# Versão de 90 s (Instagram, TikTok, LinkedIn): música a partir de 45,2 s -> drop (99,2 s) no
# "mão na massa" (vídeo 54 s); no compasso 6 após o drop (116,07 s) salta para 127,37 s
# (4 compassos, +50 ms medidos), levando o acorde final ao @aleguimas (vídeo 88,4 s).
npx remotion ffmpeg -v error -y -i ../../musicas/videoplayback.mp4 \
  -filter_complex "[0:a]atrim=45.2:116.07,asetpts=PTS-STARTPTS[a];[0:a]atrim=127.37:150.5,asetpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=0:a=1,volume=-6.3dB,aresample=48000" \
  -c:a pcm_s16le public/resumo/trilha-infraction-90.wav
npx remotion ffmpeg -hide_banner -i public/resumo/trilha-infraction-90.wav -af loudnorm=print_format=json -f null - 2>&1 | grep -E "input_i|input_tp"
