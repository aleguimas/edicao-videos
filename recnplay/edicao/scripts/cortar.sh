#!/bin/bash
# Gera os cortes brutos 9:16 do workshop (o original já é vertical: 1920x1080 com rotação de 90°).
# Cada corte = um ou mais trechos "inicio-fim" (h:mm:ss.s) concatenados.
# Uso (de dentro de edicao/): bash scripts/cortar.sh [nome-do-corte]
set -e
ORIGINAL=../20261015_082734.mp4
SAIDA=../cortes
mkdir -p "$SAIDA"

CORTES=(
  "01-banco-ou-bando-de-dados|1:41:00.0-1:41:57.0"
  "02-chute-muito-bem-escrito|1:30:23.0-1:31:12.4"
  "03-humano-robotizado|0:29:46.6-0:30:25.9"
  "04-ia-erra-e-estagiario|1:12:31.3-1:13:10.8 1:15:18.3-1:16:20.4"
  "06-freio-e-fusquinha-ferrari|1:53:17.3-1:54:57.5"
  "07-semaforo-da-ia|1:55:06.8-1:55:57.3"
  "10-privacidade-desligar-treino|1:55:59.2-1:56:23.9 2:01:37.4-2:02:18.7 2:04:45.0-2:04:57.2"
  "11-meta-ads-no-claude|2:50:01.0-2:50:13.5 3:00:12.0-3:00:58.5 3:01:00.0-3:01:41.5 3:02:52.0-3:03:01.7 3:05:14.0-3:05:23.3"
)

seg() { # h:mm:ss.s -> segundos
  echo "$1" | awk -F: '{ print $1*3600 + $2*60 + $3 }'
}

for corte in "${CORTES[@]}"; do
  nome="${corte%%|*}"
  trechos="${corte#*|}"
  [ -n "$1" ] && [ "$1" != "$nome" ] && continue

  args=()
  filtro=""
  n=0
  for t in $trechos; do
    ini=$(seg "${t%-*}")
    fim=$(seg "${t#*-}")
    dur=$(echo "$fim - $ini" | bc)
    args+=(-ss "$ini" -t "$dur" -i "$ORIGINAL")
    filtro+="[$n:v:0][$n:a:0]"
    n=$((n + 1))
  done
  filtro+="concat=n=$n:v=1:a=1[v][a];[v]scale=1080:1920,format=yuv420p[vout]"

  echo "→ $nome ($n trecho(s))"
  npx remotion ffmpeg -v error -y "${args[@]}" \
    -filter_complex "$filtro" -map "[vout]" -map "[a]" \
    -r 30 -c:v h264_videotoolbox -b:v 12M -c:a aac -b:a 192k -ar 48000 \
    -movflags +faststart "$SAIDA/$nome.mp4"
done
echo "cortes em $SAIDA"
