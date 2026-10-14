---
name: video-conteudo-simpli
description: Edita vídeos curtos de conteúdo (Reels/TikTok/Shorts) no padrão Simplí a partir de uma gravação de celular — 1080x1920, apresentador centralizado com câmera que o acompanha, frases-chave em destaque ATRÁS do apresentador, volume normalizado sem distorcer, correção de cor, trilha instrumental original e encerramento com a logo da Simplí. Use quando pedirem para editar, montar ou criar um vídeo de conteúdo a partir de um arquivo em originais/, ou "fazer igual ao vídeo da IA falhou".
---

# Vídeo de conteúdo Simplí

Fluxo validado no projeto `video-ia-falhou/` (referência completa e funcionando).
Antes de escrever código Remotion, carregue a skill `remotion-best-practices`.

## Entradas

- Vídeo original do celular em `originais/` (normalmente iPhone, vertical 4K, HDR HLG, 60fps)
- Logo: `logos/logo-simpli-fundo-escuro.png`
- Do usuário: as **frases a destacar** (se não vierem, proponha 2–4 a partir da transcrição e confirme)

## Dois estilos de frase

| Estilo | Componente | Quando | Recorte |
|---|---|---|---|
| **Atrás** (vídeo "IA falhou") | `Destaque` | padrão; branco + verde Simplí, apresentador passa na frente | precisa do WebM com alfa |
| **Na frente** (vídeo "freio") | `DestaqueFrente` | pedido de "branco com transparência / movimentação na frente do apresentador" | NÃO precisa: rode o preparo com `SO_CENTRO=1` e remova a camada do recorte |

`DestaqueFrente`: Montserrat 900, branco `rgba(255,255,255,0.85)`, na altura do peito (`top: 1080`, abaixo do rosto), cada palavra sobe e entra em foco (blur→nítido), o bloco flutua devagar e sai subindo com desfoque.

## Padrão visual e sonoro (manter, salvo pedido contrário)

| Item | Padrão |
|---|---|
| Formato | 1080x1920, 30fps, H.264 |
| Enquadramento | janela de 1080x1920 sobre a origem 2160x3840 (zoom 2x sem perda), câmera suave acompanhando o centro do apresentador; zoom extra até 1,2x quando ele vai para a borda |
| Altura | `CAMERA_CENTRO_Y = 0.55`: cabeça no terço superior, plano até a cintura |
| Cor | HDR→SDR (tonemap mobius) + `filter: saturate(0.78) contrast(1.03)` aplicado IGUAL no vídeo base e no recorte |
| Frases | Montserrat 900, maiúsculas, 2 linhas: linha 1 branca, linha 2 verde Simplí `#3CE01E`; gradiente escuro no topo; entram palavra a palavra sincronizadas com a fala |
| Profundidade | ordem das camadas: vídeo base → frases → recorte das pessoas (WebM com alfa) |
| Posição das frases | acima da cabeça, com a cabeça cobrindo **só ~1/3 da altura** das letras da linha 2. Nunca uma letra inteira (o usuário reprovou frases escondidas) |
| Largura | `whiteSpace: nowrap`; cada linha ≤ ~940px (Montserrat Black ≈ 0,72·tamanho por caractere) |
| Saída das frases | a última frase termina ANTES da transição para a logo |
| Áudio voz | ganho LINEAR para -15,5 LUFS, pico ≤ -1,5 dBTP (nada de compressor) |
| Trilha | original gerada por script (sem direitos), volume 0.42 sob a voz (~12 dB abaixo), sobe para 1 na logo |
| Encerramento | logo em fundo `#0B0B0C` (75 frames) entra POR CIMA do vídeo com fade de 18 frames, começando em Apresentação − 18. Não usar `TransitionSeries` aqui: ela remonta o vídeo e dá um piscar preto na prévia |

## Passo a passo

`SKILL=.claude/skills/video-conteudo-simpli` (caminhos relativos à raiz `editor-videos/`).

### 1. Projeto
```bash
npx create-video@latest --yes --blank --no-tailwind <nome-do-video>
cd <nome-do-video> && npm i
npx remotion add @remotion/media @remotion/transitions @remotion/google-fonts @remotion/whisper-webgpu @huggingface/transformers mediabunny @mediabunny/server
rm -rf .git                     # o repositório é a raiz editor-videos/
rm src/Composition.tsx
cp ../$SKILL/template/src/*.tsx ../$SKILL/template/src/fonte.ts src/
mkdir -p scripts && cp ../$SKILL/scripts/transcrever.mts scripts/
cp ../logos/logo-simpli-fundo-escuro.png public/
```
**Fixe as versões do Remotion iguais às de `video-ia-falhou/package.json` (4.0.533, mediabunny 1.56.1) e copie o `remotion.config.ts` de lá.** A 4.0.535 derruba o Chrome headless neste Mac (crash de GPU → "Target closed" em qualquer still). Depois rode `npm i`.
Para não baixar o Whisper de novo (~1,5 GB): `ln -sfn <editor-videos>/video-ia-falhou/node_modules/@huggingface/transformers/.cache node_modules/@huggingface/transformers/.cache`

Abra o Studio logo em seguida (`npx remotion studio`, em background) e mantenha aberto.

### 2. Mídia (≈15 min para 13 s de 4K: rode em background)
```bash
zsh ../$SKILL/scripts/preparar.sh ../originais/<VIDEO>.MOV
```
Gera `public/apresentacao.mp4`, `public/apresentador-recorte.webm` e `scripts/centro.json`.
- Estilo "na frente": `SO_CENTRO=1 zsh ...` (não grava PNGs nem WebM; muito mais rápido e leve).
- `FAIXA_Y=0.15,0.40 MAX_X=1.0` para apresentador sentado sem plateia (padrão `0.38,0.52` / `0.6` é para palestra com plateia à direita).
- Origem 1080x1920 (não 4K): zoom no máximo ~1,06–1,1 só para centralizar.
- Apresentador sentado e parado: prefira enquadramento FIXO (centro médio). Seguir a máscara faz a câmera tremer com os gestos.

**Corte de início/fim:** confira os primeiros e últimos segundos (quadros + loudness por segundo). Gravações costumam ter o apresentador se sentando no início e ruído depois da última fala. Corte com `trimBefore` no `<Video>` (ex.: `INICIO_ORIGINAL`).
Avise o usuário: enquanto roda, o Studio mostra erro de mídia (arquivo sendo escrito). É esperado.

### 3. Transcrição e tempos das frases (em paralelo ao passo 2)
```bash
npx tsx scripts/transcrever.mts ../originais/<VIDEO>.MOV
npx remotion ffmpeg -hide_banner -i ../originais/<VIDEO>.MOV -vn -af silencedetect=noise=-26dB:d=0.06 -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+" | paste - -
```
O Whisper (`large-v3-turbo`, `language: "pt"`) acerta o texto mas erra palavras curtas (não reconheceu "IA") e os tempos por palavra são aproximados. **Use as pausas do silencedetect para os tempos exatos** de início de cada frase e de cada linha (`atrasoLinha2`).

### 4. Câmera
```bash
python3 ../$SKILL/scripts/calcular-camera.py
```
Cole a saída no topo de `src/Apresentacao.tsx` (substitui `CAMERA_FRAMES`, `CAMERA_CENTRO_X`, `ZOOM_FRAMES`, `ZOOM`).

### 5. Durações
- `nb_frames` de `public/apresentacao.mp4` = `durationInFrames` da Apresentação (em `VideoConteudo.tsx` e no `Root.tsx`)
- Composição principal = Apresentação + 75 − 18
- Transição começa em `Apresentação − 18`; keyframes do volume da trilha: `[0, transição − 6, transição + 12]`
- Última frase: `from + durationInFrames` ≤ início da transição

### 6. Frases
Uma `<Destaque>` por frase em `src/Apresentacao.tsx`, cada uma como nó JSX próprio, com `name`, `from`, `durationInFrames`, `linha1`, `linha2`, `tamanho1/2`, `atrasoLinha2` e `style={{ paddingTop }}`.
Escreva as frases exatamente como o usuário pediu.

### 7. Trilha
```bash
python3 ../$SKILL/scripts/gerar-trilha.py --duracao <total em s> --impacto <início da transição em s>
```
`--final-cheio` mantém o beat por baixo da logo (deixa o final mais vivo). O andamento é ajustado (~115 BPM) para o impacto cair no tempo forte da entrada da logo.

### 8. Conferência visual (obrigatória antes de mostrar)
```bash
npx remotion still VideoConteudo /tmp/s.jpg --frame=<f> --image-format=jpeg --scale=0.4
```
Renderize um still no meio de cada frase (e no ponto mais alto da cabeça) e verifique:
apresentador centralizado, frases inteiras dentro da tela, cabeça cobrindo só a base da linha 2, tela limpa antes da logo, logo legível.
Para o áudio: `npx remotion render VideoConteudo mix.wav --codec=wav` e meça com `loudnorm=print_format=json` (pico deve ficar < -1 dBTP).

### 9. Render (só quando o usuário pedir)
```bash
npx remotion render VideoConteudo ../<nome>-final.mp4 --codec=h264 --crf=16 --audio-bitrate=320k --concurrency=1 --timeout=300000
```
- **Nunca sobrescreva um MP4 final já entregue**: versões novas vão como `-v2`, `-v3`…
- `--concurrency=1` é necessário em Mac de 8 GB: com mais processos o decode do WebM 4K com alfa estoura a RAM e dá timeout. Leva ~10 min para 15 s.
- Depois do render: `open -R <arquivo>` para mostrar no Finder.

## Armadilhas já resolvidas

- No zsh, `$var:l...` aplica o modificador `:l` (minúsculas) e engole o texto: sempre `${var}` antes de `:` em strings de filtro.
- O ffmpeg do Remotion (`npx remotion ffmpeg`) NÃO tem `fps`, `alphamerge`, `ebur128` nem `hstack`. Use `-r 30`, gere o PNG com alfa no Swift e meça com `loudnorm=print_format=json`.
- Um `pkill` no wrapper `npm exec` não mata o ffmpeg filho: confira com `ps` antes de reexecutar, senão dois processos escrevem no mesmo arquivo.
- `<Video>` do `@remotion/media` não aceita `transparent`; o WebM VP9 `yuva420p` já sai com alfa.
- `InteractivitySchema` de `number` exige `hiddenFromList: false`.
- A segmentação (Vision) recorta TODAS as pessoas: a plateia em primeiro plano também fica na frente das frases, o que é desejável (profundidade real).
- Se o apresentador estiver na borda do quadro original, nenhuma câmera o centraliza 100%: o zoom extra até 1,2x é o limite aceitável de qualidade.
