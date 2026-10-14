#!/bin/zsh
# Prepara a mídia de um vídeo de conteúdo a partir do original do celular.
# Uso (na pasta do projeto Remotion):
#   zsh <skill>/scripts/preparar.sh ../originais/VIDEO.MOV
#   SO_CENTRO=1 zsh ...   frases NA FRENTE do apresentador: não gera o recorte
#   FAIXA_Y / MAX_X        repassados ao recortar.swift (faixa da cabeça)
# Gera:
#   public/apresentacao.mp4          vídeo SDR 30fps, resolução nativa, áudio normalizado
#   public/apresentador-recorte.webm pessoas recortadas (VP9 com alfa)
#   scripts/centro.json              centro horizontal do apresentador por frame
set -e

ORIGINAL=${1:?"informe o caminho do vídeo original"}
SKILL_DIR=${0:A:h}
FF="npx remotion ffmpeg -hide_banner"
mkdir -p public scripts

# --- 1. Medição de loudness (passo 1 do loudnorm)
MED=$($=FF -i "$ORIGINAL" -vn -af loudnorm=I=-15.5:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
mi=$(echo $MED | python3 -c 'import json,sys;print(json.load(sys.stdin)["input_i"])')
mtp=$(echo $MED | python3 -c 'import json,sys;print(json.load(sys.stdin)["input_tp"])')
mlra=$(echo $MED | python3 -c 'import json,sys;print(json.load(sys.stdin)["input_lra"])')
mth=$(echo $MED | python3 -c 'import json,sys;print(json.load(sys.stdin)["input_thresh"])')
moff=$(echo $MED | python3 -c 'import json,sys;print(json.load(sys.stdin)["target_offset"])')
echo "loudness original: $mi LUFS, pico $mtp dBTP"

# --- 2. Cor: HDR do iPhone (HLG/PQ) -> SDR BT.709; SDR passa direto
TRANSF=$(npx remotion ffprobe -v error -select_streams v:0 -show_entries stream=color_transfer -of default=nw=1:nk=1 "$ORIGINAL" | head -1)
if [[ "$TRANSF" == "arib-std-b67" || "$TRANSF" == "smpte2084" ]]; then
  echo "HDR detectado ($TRANSF): convertendo para SDR"
  VF="zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p"
else
  VF="format=yuv420p"
fi

# --- 3. Vídeo base. Ganho LINEAR (sem compressão): preserva a voz e
#        mantém o pico abaixo de -1,5 dBTP. O ffmpeg do Remotion não tem o
#        filtro fps: usar -r.
$=FF -v error -y -i "$ORIGINAL" -vf "$VF" -r 30 \
  -af "loudnorm=I=-15.5:TP=-1.5:LRA=11:measured_I=${mi}:measured_TP=${mtp}:measured_LRA=${mlra}:measured_thresh=${mth}:offset=${moff}:linear=true,aresample=48000" \
  -c:v libx264 -crf 15 -preset medium -profile:v high -movflags +faststart \
  -c:a aac -b:a 256k -map 0:v:0 -map 0:a:0 public/apresentacao.mp4
echo "public/apresentacao.mp4 ok"

# --- 4. Recorte das pessoas (Apple Vision) + centro do apresentador
rm -rf scripts/recorte
swift "$SKILL_DIR/recortar.swift"

# --- 5. Recorte -> WebM VP9 com canal alfa
if [[ "$SO_CENTRO" != "1" ]]; then
  $=FF -v error -y -framerate 30 -i scripts/recorte/%04d.png \
    -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -crf 22 -b:v 0 \
    -deadline good -cpu-used 4 -row-mt 1 public/apresentador-recorte.webm
  echo "public/apresentador-recorte.webm ok"
fi

npx remotion ffprobe -v error -show_entries format=duration:stream=width,height,nb_frames -of compact public/apresentacao.mp4
