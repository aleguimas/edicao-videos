# Edição de vídeos — Simplí

Vídeos curtos de conteúdo (Reels/TikTok/Shorts) editados com [Remotion](https://www.remotion.dev).

- `.claude/skills/video-conteudo-simpli/` — skill com o fluxo completo de edição (scripts + template)
- `video-ia-falhou/` — projeto do vídeo "A IA falhou?" (referência do padrão)
- `logos/` — logos da Simplí
- `capa-video-ia-falhou.png` — capa do vídeo

## Rodar um projeto

```bash
cd video-ia-falhou
npm i
zsh scripts/preparar.sh          # recria a mídia a partir de ../originais/IMG_6273.MOV
npx remotion studio
```

Vídeos originais, mídia gerada e renders não vão para o git (ver `.gitignore`).
