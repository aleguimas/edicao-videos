---
name: video-workshop-guimas
description: Transforma a gravação longa de um workshop/palestra do Guimas (@aleguimas) em conteúdo publicável — transcrição de horas de vídeo, cortes 9:16 das melhores falas, depoimentos tratados, vídeo resumo do evento (60 s para YouTube Shorts e 90 s para Instagram/TikTok/LinkedIn) no visual @aleguimas (navy, degradê azul→lavanda), trilha licenciada sincronizada nos cortes, capa e copies por rede. Use quando pedirem para transcrever, cortar ou montar um resumo/aftermovie de workshop, palestra ou evento do Guimas, ou "fazer igual ao workshop de Cuiabá".
---

# Vídeo de workshop do Guimas

Fluxo validado no projeto `workshop-cuiaba/` (Workshop IA para Empresários, CDL Cuiabá + Sebrae MT, out/2026).
Referência completa e funcionando: `workshop-cuiaba/edicao/` (Remotion) e os entregáveis na raiz de `workshop-cuiaba/`.
Antes de escrever código Remotion, carregue a skill `remotion-best-practices`.

**Este conteúdo é do Guimas, não da Simplí**: nada de verde #3CE01E nem logo da Simplí. Para vídeo curto de conteúdo da Simplí, use `video-conteudo-simpli`.

`SKILL=.claude/skills/video-workshop-guimas` (caminhos relativos à raiz `editor-videos/`).

## Entregáveis (nesta ordem, com aprovação do usuário entre eles)

| # | Entrega | Onde fica |
|---|---|---|
| 1 | Transcrição completa (texto com tempos + legendas por palavra) e resumo do workshop com estrutura e momentos fortes | `<evento>/transcricao/` |
| 2 | Cortes brutos 9:16 das falas escolhidas pelo usuário | `<evento>/cortes/` |
| 3 | Depoimentos cortados (e emendados quando a pessoa gravou em 2 partes) | `<evento>/cortes/depoimentos/` |
| 4 | Roteiro do vídeo resumo **para aprovar antes de montar** | resposta no chat |
| 5 | Vídeo resumo 60 s (YouTube Shorts) e 90 s (Instagram, TikTok, LinkedIn) | `<evento>/resumo-<evento>-60s.mp4` / `-90s.mp4` |
| 6 | Capa 1080x1920 | `<evento>/capa-resumo-<evento>.png` |
| 7 | Copies: Instagram, TikTok, YouTube Shorts e LinkedIn (com agradecimento aos parceiros) | resposta no chat |

## 1. Projeto

```bash
mkdir -p <evento>/edicao && cd <evento>/edicao
cp -R ../../$SKILL/template/. .          # package.json, configs, src/, public/fontes
mkdir -p scripts public/resumo ../transcricao ../cortes
cp ../../$SKILL/scripts/* scripts/
npm i
```
- Remotion fixo em **4.0.533** (a 4.0.535 derruba o Chrome headless neste Mac). Não faça symlink de `node_modules` para outra pasta de vídeo: o usuário apaga projetos antigos e tudo quebra no meio.
- O modelo Whisper fica em `node_modules/@huggingface/transformers/.cache` (~3,7 GB); projeto novo baixa de novo (~10 min).
- As fontes (Archivo variável, Inter Tight, JetBrains Mono) ficam em `public/fontes` e são carregadas por `src/fonte.ts` com `FontFace` + `delayRender`. **Não use `@remotion/google-fonts`**: se a internet cair, o render falha.
- Abra o Studio em background (`npx remotion studio`) e mantenha aberto.

## 2. Transcrição do vídeo longo (horas)

```bash
until [ -f ../transcricao/transcricao.md ]; do
  MAX_BLOCOS=4 npx tsx scripts/transcrever-longo.mts ../<ORIGINAL>.mp4 ../transcricao
done
```
- Blocos de 10 min, retomável (cada bloco vira `transcricao/blocos/NNN.json`), cache do áudio em `audio-16k.f32`.
- **Mac de 8 GB**: um processo só é morto (exit 137) depois de ~8 blocos. Por isso lotes de 4 em loop. O exit 134 (onnxruntime ao sair) é inofensivo: os blocos já foram salvos.
- ~4 min por bloco de 10 min (large-v3-turbo). 3 h ≈ 1h20 + download do modelo.
- Gravação de celular em pé vem como 1920x1080 **com rotação de 90°**: na prática já é 9:16. Confira com `ffprobe … side_data` antes de pensar em recorte lateral.
- Depois leia a transcrição inteira e entregue: estrutura com tempos, temas e uma lista numerada de **momentos fortes para cortes** (frase de impacto + tempo). O Whisper erra nomes próprios (Sankhya→"Sanker", Anthropic→"Antropik", ChatGPT→"chat EPT"): avise e corrija quando o texto for para tela.

## 3. Cortes brutos 9:16

- Ache as frases: `node` sobre `transcricao/legendas.json` (busca por termo) e imprima as frases com tempo na janela. Escolha início/fim nas pausas, sem cortar palavra.
- Liste os cortes em `scripts/cortar.sh` (`"nome|ini-fim ini-fim"`; vários trechos são concatenados) e rode `bash scripts/cortar.sh [nome]`. Teste com o menor corte primeiro.
- **Conferência obrigatória**: `npx tsx scripts/conferir-cortes.mts ../cortes` transcreve cada corte e mostra as primeiras/últimas palavras.
- O ffmpeg do Remotion (`npx remotion ffmpeg`) **não tem** `fade/afade`, `tile`, `hstack`, `f32le` nem `pcm_f32le`: use WAV `pcm_s16le`, `-r 30` e faça fades no Remotion.

## 4. Depoimentos

- `npx tsx scripts/transcrever-curtos.mts ../depoimentos` (tempos por palavra em `depoimentos/transcricoes/`).
- Fim do depoimento: confira os últimos quadros (gente rindo, careta, câmera se mexendo) e corte logo depois da última palavra útil.
- Pessoa que gravou em 2 vídeos: emende o contexto do 1º (apresentação, evento, parceiros) com o 2º inteiro, removendo o que se repete no fim do 1º. Corte na pausa entre frases.
- Vídeo repostado do Instagram (legendas e figurinhas queimadas): mapeie onde ficam as legendas ao longo do tempo (quadros a cada 1–2 s) e recorte só a região limpa dentro de uma **moldura** (`Moldura.tsx`, constante `REGIAO`) com o workshop desfocado atrás. Em Cuiabá: legendas até y≈560 no canto superior esquerdo, figurinhas a partir de y≈1478.
- Cortes em `scripts/cortar-depoimentos.sh`.

## 5. Roteiro do resumo (aprovar antes de montar)

Estrutura aprovada (60 s / 90 s):
1. **Abertura** (4 s): sala do workshop com zoom lento, pin de localização caindo e o nome da cidade passando, etiqueta "IA NA PRÁTICA", título do workshop e selo dos parceiros.
2. **Anfitrião abre** (ex.: Vilma/CDL) dizendo onde e o quê.
3. **Falas do Guimas** (4–9 s cada, frase de impacto + palavras em destaque).
4. **Mão na massa** (só música, cortes de b-roll no drop da trilha).
5. **Depoimentos** de participantes e parceiros com tarja (nome + empresa/cargo).
6. **Anfitrião fecha** com o agradecimento.
7. **Encerramento @aleguimas** no acorde final da música.

Versão de 60 s: comece cada fala direto no ponto (`trimBefore`), tire 1 fala e 1 b-roll, e deixe só a frase principal de cada depoimento.

## 6. Mídia do resumo

- Liste os trechos em `scripts/preparar-resumo.py` (`TRECHOS`) e rode `python3 scripts/preparar-resumo.py`. Ele corta em 1080x1920/30 fps e aplica **ganho linear** na voz para -15,5 LUFS com pico ≤ -1,5 dBTP (sem compressor). Gravação de celular costuma vir com pico em 0 dB (AGC): o ganho será negativo, está certo.
- Enquadramento: câmera fixa no fundo da sala deixa o Guimas pequeno. `Clipe` faz zoom 1,6–1,9 com o centro indo do início ao fim do trecho (`x`, `y` em coordenadas da origem). Tire os centros de 2 quadros por trecho (15% e 85%). Depoimentos: zoom 1,05–1,2.

## 7. Trilha

Preferência do usuário: **rock instrumental com bateria e guitarra**, enérgico. Fluxo:
1. O usuário escolhe a música (link). Verifique os direitos pelo título/canal (`youtube.com/oembed`): biblioteca paga (ex.: Mojo Soundtrack) exige licença; canal "No Copyright Music" (ex.: Infraction) pede crédito na descrição. **Não baixe do YouTube**: peça o arquivo (o usuário salva em `editor-videos/musicas/`).
2. `node scripts/analisar-musica.mjs <arquivo>`: BPM, fase e energia por segundo (intro, partes cheias, breaks, drops, acorde final).
3. Monte a trilha (`scripts/preparar-trilha-infraction.sh` como modelo): escolha o início para que o **drop caia no "mão na massa"** e faça **uma emenda** num número inteiro de compassos, durante uma fala (música baixa), para o **acorde final cair no @aleguimas**. Afine a emenda com `node scripts/alinhar-emenda.mjs <arquivo> <A> <B>` (casa o padrão da bateria; em Cuiabá a correção foi de +50 a +100 ms). Ganho para ~-15,5 LUFS.
4. Volume no Remotion: 0,8 na abertura/mão na massa, **0,22 sob as falas** (~12 dB abaixo), 0,85 no final e fade-out no último segundo. **A descida antes de uma voz tem que terminar antes dela entrar** (o pico estourou quando o depoimento entrou junto com o drop).
5. Sem música do usuário: `node scripts/gerar-trilha-rock.mjs --versao 60|90` gera um rock original 120 BPM (guitarra sintetizada, soa artificial; use só como provisória).

## 8. Visual @aleguimas (padrão aprovado)

Paleta e tipografia vêm da skill `anthropic-skills:aleguimas-instagram`. No vídeo:

| Elemento | Padrão |
|---|---|
| Palavras em destaque (`Destaque`) | cartão navy translúcido `rgba(12,17,40,0.84)`, borda `rgba(143,169,230,0.35)`, molduras de canto em L (#3F58B8 em cima à esquerda, #5B4BC4 embaixo à direita), barrinha 64x5 em degradê #6F8FF2→#9A7BF0; linha 1 branca, linha 2 em degradê de texto #8DB0FF→#B4A3F7; Archivo 800 `fontStretch 92%`, caixa alta; tamanho se ajusta para caber em 860 px |
| Tarja de nome (`Tarja`) | cartão navy, nome em Archivo branco, cargo em JetBrains Mono #8FA9E6 com espaçamento 5 px |
| Abertura, encerramento, moldura | tinta navy + brilho azul (sup. esq.) e roxo (inf. dir.), molduras de canto |
| Assinatura (`Assinatura`) | molduras de canto + "@aleguimas" em mono durante todo o vídeo |
| Encerramento | "@aleguimas" grande em degradê, ícone do Instagram em círculo, "ALEXANDRE GUIMARÃES" em mono, batendo no acorde final |
| Cor do vídeo | `FILTRO_COR` em `Clipe.tsx`: contraste 1,08, saturação 0,9, sépia 0,07 (tira o azulado da luz fria) |
| Transições | punch-in de 1,12→1 em cada corte + clarões brancos nas trocas de bloco, no tempo da música |

**Rejeitado pelo usuário**: texto lavanda/azul solto sobre o vídeo (some no fundo claro) e qualquer verde.

Regras de layout: tarja e destaque nunca no mesmo lugar ao mesmo tempo (destaque ~1040–1120 quando há tarja em ~1560–1600); frases dentro da tela (`whiteSpace: nowrap` + ajuste automático); nada importante abaixo de ~1700 (rodapé com @aleguimas).

## 9. Conferência (antes de mostrar)

- `npx tsc --noEmit` e stills nos momentos-chave: `npx remotion still Resumo60 /tmp/x.jpg --frame=N --scale=0.3`.
- Áudio: `npx remotion render Resumo60 mix.wav --codec=wav` e meça com `loudnorm=print_format=json` o total e **cada parte** (abertura, falas, mão na massa, depoimentos, final). Alvo: ~-15,5 LUFS em todas, pico < -1,5 dBTP. Se uma parte estourar, procure em janelas de 2 s.
- Prévia leve para o usuário assistir: `npx remotion render Resumo60 ../previa/x.mp4 --scale=0.5 --crf=26 --concurrency=2` (~2,5 min) e `open`. Transcreva a prévia (`transcrever-curtos.mts` numa pasta com ela) para garantir que nenhuma fala começa/termina cortada.
- **Studio desatualizado** depois de reescrever componentes: o preview pode mostrar tarjas em lugares errados. Mate o Studio (`pkill -f "remotion studio"`), suba de novo e confira com a prévia renderizada antes de mexer no código.

## 10. Render final (só quando o usuário aprovar)

```bash
npx remotion render Resumo60 ../resumo-<evento>-60s.mp4 --codec=h264 --crf=16 --audio-bitrate=320k --concurrency=2 --timeout=300000
npx remotion render Resumo   ../resumo-<evento>-90s.mp4 --codec=h264 --crf=16 --audio-bitrate=320k --concurrency=2 --timeout=300000
```
~4,5 min (60 s) e ~7 min (90 s). Depois: `ffprobe` (1080x1920, 30 fps, duração), loudness do arquivo final e `open -R`.

## 11. Capa (`Capa`, still 1080x1920)

- Foto: procure o momento em que o Guimas está **mais perto da câmera**: amostre 1 quadro a cada 30 s (`ffmpeg -ss … -vf scale=360:-1`) e rode `swift scripts/achar-apresentador.swift <pasta>` (Apple Vision, ordena pela altura da pessoa). Refine em passos de 0,2 s e escolha o quadro nítido. Foto de longe com zoom forte fica borrada (o usuário reprovou).
- Layout: etiqueta "IA NA PRÁTICA" no topo, foto na metade de cima, título "WORKSHOP DE IA / PARA EMPRESÁRIOS" + 📍 CIDADE em degradê, selo dos parceiros e @aleguimas. Título e selo dentro do recorte 3:4 do grid do Instagram (y≈240–1680).
- `npx remotion still Capa ../capa-resumo-<evento>.png`.

## 12. Copies

Use o tom da skill `anthropic-skills:aleguimas-instagram` (primeira pessoa, sem travessão "—", sem dado inventado, frases reais do workshop):
- **Instagram**: gancho, contexto do evento e parceiros, 4–5 aprendizados com 👉, frase de impacto, pergunta com 👇, pedido de salvar/compartilhar, 10–12 hashtags CamelCase.
- **TikTok**: 2–3 frases + pergunta, 6–8 hashtags minúsculas.
- **YouTube Shorts**: título (≤100 caracteres, gancho) + descrição curta + #Shorts.
- **LinkedIn**: agradecimento nominal aos parceiros (ex.: CDL na pessoa da Vilma Santos, Sebrae MT na pessoa da Simony Bastos), aprendizados em lista com →, frase de fechamento e pergunta. Avise para trocar as @menções pelos perfis reais.
- Todas com o **crédito da música** (ex.: "Music: Running Faster by Infraction").

## Armadilhas já resolvidas

- `rm -f $VAR/*` é bloqueado pela checagem de segurança: use caminho literal ou `"${VAR:?}"/*`.
- No zsh, `for t in $lista` não separa palavras e `$var:x` aplica modificadores: rode loops com várias palavras via `bash -c`.
- `tr` sem buffer de linha num `tail -f | tr | grep` não entrega eventos ao Monitor: para acompanhar progresso, faça um laço que conta arquivos.
- `Interactive.withSchema({ wrapInSequence: true })`: `useVideoConfig().durationInFrames` dentro do componente é a duração da sequência (usado nas saídas).
- Legenda do Instagram queimada no vídeo da participante aparece em momentos diferentes: confira quadros do trecho usado, não só do começo.
