# Edição de vídeos — Simplí

Vídeos de conteúdo (Reels/TikTok/Shorts, vídeos longos e manuais) editados com [Remotion](https://www.remotion.dev).

## Estrutura

- `.claude/skills/` — skills com os fluxos de edição (scripts + templates)
- `logos/` — logos da Simplí
- `modelo/` — base copiada para cada vídeo novo
- `scripts/remotion.sh` — atalho usado pelos comandos `npm run`
- `recnplay/`, `revestir/`, `tramontina/`, `vibe-coding/`, `workshop-cuiaba/`, `manuais simplí/` — projetos anteriores, cada um com o próprio `package.json` na pasta `edicao/`

## Criar um vídeo novo

Os vídeos novos usam uma única instalação, na raiz do repositório.

```bash
npm i
npm run novo -- meu-video                  # copia modelo/ para meu-video/
npm run studio -- meu-video                # abre o Remotion Studio
npm run render -- meu-video MyVideo        # gera meu-video/out/MyVideo.mp4
npm run still -- meu-video MyVideo         # gera meu-video/out/MyVideo.png
npm run typecheck
```

No macOS, o Chrome headless não roda de dentro de `~/Documents`. Se ele estiver em `~/.local/remotion/`, o `remotion.config.ts` o usa automaticamente.

## Rodar um projeto anterior

```bash
cd tramontina/edicao
npm i
npx remotion studio
```

Vídeos originais, mídia gerada e renders não vão para o git (ver `.gitignore`).
