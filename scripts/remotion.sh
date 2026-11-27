#!/bin/zsh
# Uso: scripts/remotion.sh <studio|render|still|novo> <pasta> [composição] [extras...]
# Todas as pastas de vídeo usam a instalação da raiz (node_modules único).
set -e
cd "$(dirname "$0")/.."
acao="$1"; pasta="${2%/}"
[[ -z "$acao" || -z "$pasta" ]] && { echo "Uso: npm run <studio|render|still|novo> -- <pasta> [composição]"; exit 1; }
shift 2

if [[ "$acao" == "novo" ]]; then
  [[ -e "$pasta" ]] && { echo "A pasta '$pasta' já existe."; exit 1; }
  mkdir -p "$pasta"
  cp -R modelo/src modelo/public "$pasta"/
  echo "Pasta '$pasta' criada a partir de modelo/. Abra com: npm run studio -- $pasta"
  exit 0
fi

[[ -f "$pasta/src/index.ts" ]] || { echo "Não achei $pasta/src/index.ts"; exit 1; }
entrada="$pasta/src/index.ts"
publico=(--public-dir="$pasta/public")

case "$acao" in
  studio) exec npx remotion studio "$entrada" "${publico[@]}" "$@" ;;
  render)
    comp="${1:?Informe a composição, ex: MyVideo}"; shift
    exec npx remotion render "$entrada" "$comp" "$pasta/out/$comp.mp4" "${publico[@]}" "$@" ;;
  still)
    comp="${1:?Informe a composição, ex: MyVideo}"; shift
    exec npx remotion still "$entrada" "$comp" "$pasta/out/$comp.png" "${publico[@]}" "$@" ;;
  *) echo "Ação desconhecida: $acao"; exit 1 ;;
esac
