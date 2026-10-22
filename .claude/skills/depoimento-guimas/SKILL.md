---
name: depoimento-guimas
description: Edita depoimentos em vídeo (participantes, parceiros, clientes de workshops e palestras do Guimas) no padrão @aleguimas — 1080x1920, pessoa em tela cheia com aproximação lenta, cabeçalho "DEPOIMENTO", tarja com nome, legenda palavra a palavra em cartão navy com degradê azul→lavanda e citação final assinada. Voz preservada, volume normalizado sem distorcer e cor corrigida sem saturar. Use quando pedirem para editar, tratar ou finalizar um depoimento, ou "fazer igual ao depoimento da Vilma".
---

# Depoimento no padrão do Guimas

Padrão validado no projeto `workshop-cuiaba/edicao/`: `DepoimentoVilma` (tela cheia) e `DepoimentoMaira`
(modo moldura, vídeo repostado do Instagram). Antes de escrever código Remotion, carregue a skill `remotion-best-practices`.
Conteúdo do Guimas: nada de verde Simplí nem logo da Simplí.

`SKILL=.claude/skills/depoimento-guimas`. Se o projeto já usa a skill `video-workshop-guimas`, os arquivos
compartilhados (`fonte.ts`, `Cantos.tsx`, `Assinatura.tsx`, `Tarja.tsx`, `public/fontes`) já existem: copie só `src/depoimento/`.

## Regras do usuário (não negociáveis)

- **1080x1920, 9:16.**
- **Preservar a voz e o sentido da fala**: não corte no meio de frase, não mude palavras (nem na legenda, nem na citação). Corte só sobras (início antes da fala, fim depois da última palavra útil, risos/caretas, câmera se mexendo) e repetições entre tomadas.
- **Volume sem distorcer**: só ganho linear por tomada (sem compressor/limitador), -15,5 LUFS, pico ≤ -1,5 dBTP.
- **Cor sem perder qualidade e sem saturar**: correção leve via CSS no Remotion; saturação ≤ 1.
- **Sem música** por padrão (só a voz). Ofereça trilha bem baixa como opção.

## O padrão (componente `Depoimento`)

| Camada | Como é |
|---|---|
| Vídeo | tela cheia, aproximação lenta e contínua 1,03 → 1,10 centrada em `foco` (rosto/tronco), `FILTRO_DEPOIMENTO = contrast(1.05) brightness(0.98) saturate(0.96) sepia(0.04)` |
| Vinheta | radial leve nas bordas + base navy (62–100% da altura) para a legenda ler sobre roupa clara |
| Cabeçalho | cartão navy em left 84/top 176 (abaixo da moldura de canto): "DEPOIMENTO" em mono branco, barrinha em degradê, nome do evento em mono #8FA9E6 |
| Assinatura | molduras de canto + "@aleguimas" (componente `Assinatura`) |
| Tarja | 0,6–5,1 s, topo 1150: nome em Archivo + empresa/cargo em mono #8FA9E6 |
| Legenda (`Legendas`) | topo 1440, cartão navy `rgba(12,17,40,0.72)`, Archivo 800 caixa alta 62 px; frase inteira na tela, palavra não dita com opacidade 0,38, palavra falada acende em degradê #8DB0FF→#B4A3F7 e cresce 8%, palavras-chave (`destaques`) ficam no degradê depois de ditas; uma frase por tela (`pageBreakAfter`) |
| Citação final (`CitacaoFinal`) | ~3,7 s no fundo navy com brilhos: aspas grandes em degradê, a frase mais forte da pessoa **literal**, últimas linhas em degradê, nome + cargo, @aleguimas; o tamanho se ajusta para cada linha caber em 888 px |

Duração: vídeo + 112 frames de citação. Para YouTube Shorts, mire em ≤ 60 s.

### Vários depoimentos curtos num vídeo só
Depoimentos de ~20 s cada (ex.: parceiro + participante) rendem mais juntos. Em Cuiabá: Simony (Sebrae MT) + Geraldo (Estrela da Borracha), 43,6 s.
- Prepare um arquivo só com as tomadas em sequência (`DEPOIMENTOS["a-b"] = [(arquivo A, ini, fim), (arquivo B, ini, fim)]`): cada pessoa recebe o próprio ganho e chegam ao mesmo volume.
- Ordem: quem dá contexto primeiro (anfitrião/parceiro), depois quem participou.
- Passe `pessoas: [{ nome, cargo, inicioS, citacao, citacaoInicioDegrade }, …]` (`inicioS` = segundo do arquivo preparado em que a pessoa começa): tarja de cada um na sua entrada, clarão na troca, cabeçalho "DEPOIMENTOS" e encerramento `CitacaoDupla` com uma frase curta e assinada de cada pessoa (~150 frames).
- Capa: `CapaDepoimentoDupla` (dois rostos lado a lado, nome e empresa embaixo, uma frase literal de uma das pessoas que represente as duas).

### Modo moldura (vídeo com legendas/figurinhas queimadas)
Repost do Instagram/TikTok traz legenda automática e figurinhas na imagem. Em vez de tela cheia:
- Passe `moldura: { x, y, w, h }` (região limpa na origem 1080x1920) e `fundo` (vídeo em `public/depoimentos/`, ex.: 60 s da sala do evento em 540x960, sem áudio). O fundo entra desfocado (22 px) com tinta navy e brilhos; a pessoa aparece numa moldura de 880 px de largura no topo 360, com cantos em L e aproximação lenta.
- Ajuste `topoTarja` para logo abaixo da moldura (ex.: 1290); a legenda desce sozinha para 1480.
- **Mapeie a região limpa no depoimento inteiro**, não só no começo: extraia 1 quadro a cada ~4 s (`-vf scale=120:-1`) e veja onde ficam legendas e figurinhas ao longo do tempo. Em Cuiabá (Maíra): legendas no canto superior esquerdo até y≈560, figurinhas a partir de y≈1460 → `{ x: 108, y: 570, w: 864, h: 850 }`.
- Origem 720p ampliada perde nitidez: não aplique nitidez artificial; avise o usuário.

## Passo a passo

### 0. Projeto (se ainda não existe um Remotion na pasta do evento)
```bash
mkdir -p <evento>/edicao && cd <evento>/edicao
cp -R ../../$SKILL/template/. . && mkdir -p scripts public/depoimentos ../previa
cp ../../$SKILL/scripts/* scripts/ && npm i
```
Remotion fixo em 4.0.533. O Whisper (~3,7 GB) é baixado na primeira transcrição.

### 1. Preparar o vídeo (direto dos originais)
Configure o depoimento em `scripts/preparar-depoimento.py` (`DEPOIMENTOS["nome"] = [(arquivo, ini, fim), …]`; várias tomadas são emendadas) e rode:
```bash
python3 scripts/preparar-depoimento.py <nome>     # -> public/depoimentos/<nome>.mp4
```
- Monta a partir dos originais em `../depoimentos/` com x264 CRF 14 (sem perda visível). Não parta de cortes intermediários já reencodados.
- Mede cada tomada e aplica o ganho linear dela; imprime o loudness final (alvo -15,5 LUFS).
- Celular costuma gravar com pico acima de 0 dB: o ganho sai negativo e a folga fica boa. Se o original já veio clipado, não dá para consertar: avise.
- Para achar os cortes: transcreva os originais (passo 2 no arquivo bruto) e confira os últimos quadros de cada tomada.
- Duas tomadas da mesma pessoa: contexto da 1ª (apresentação, evento, parceiros) + 2ª inteira, sem o que se repete no fim da 1ª; corte na pausa entre frases.

### 2. Transcrever e gerar as legendas
```bash
npx tsx scripts/transcrever-curtos.mts public/depoimentos          # -> public/depoimentos/transcricoes/<nome>.json
node scripts/gerar-legendas.mjs public/depoimentos/transcricoes/<nome>.json src/depoimento/legendas-<nome>.ts LEGENDAS_<NOME>
```
Revise o arquivo gerado: nomes próprios, siglas (CDL, Sebrae, IA), números e pontuação. O Whisper às vezes repete um trecho no fim de um bloco: apague as palavras duplicadas (mesmo texto com tempos sobrepostos).

### 3. Composição
Em `src/Root.tsx`, um `<Composition component={Depoimento}>` por pessoa (veja o exemplo do template):
- `inicioMs`: corte do começo do arquivo preparado (~200 ms antes da 1ª palavra); `duracaoVideo`: frames até ~150 ms depois da última palavra.
- `nome`, `cargo` (empresa/cargo exatamente como o usuário pediu), `evento` (ex.: "WORKSHOP IA · CUIABÁ").
- `destaques`: 8–14 palavras-chave do que a pessoa disse (evento, parceiros, "IA", resultados).
- `citacao`: a frase mais forte, **literal**, quebrada em 3–4 linhas; `citacaoInicioDegrade` = a partir de qual linha vai o degradê (a parte de impacto).
- `foco`: centro do rosto/tronco na origem 1080x1920 (tire de um quadro do meio).

### 4. Conferência (obrigatória antes de mostrar)
- `npx tsc --noEmit`; stills na tarja (~frame 60), no meio (~1000), numa frase longa e na citação: `npx remotion still <Id> /tmp/x.jpg --frame=N --scale=0.35`.
  Verifique: legenda legível (inclusive sobre roupa escura), cabeçalho sem encostar na moldura de canto, tarja e legenda sem se sobrepor, citação sem quebrar linha.
- Prévia leve: `npx remotion render <Id> ../previa/<nome>-previa.mp4 --scale=0.5 --crf=24 --concurrency=2` e `open`. Meça o áudio da prévia com `loudnorm=print_format=json` (≈ -15,5 LUFS, pico < -1,5 dBTP).
- Se o Studio mostrar algo diferente da prévia renderizada, reinicie o Studio (cache de componentes).

### 5. Capa (`CapaDepoimento`, still 1080x1920)
- Foto: amostre 6–8 quadros do depoimento preparado e escolha o rosto mais expressivo (sorriso, olhar para a câmera); no modo moldura, só dentro da região limpa. Extraia em PNG: `npx remotion ffmpeg -ss <s> -i public/depoimentos/<nome>.mp4 -frames:v 1 public/depoimentos/capa-<nome>.png`.
- Layout: "DEPOIMENTO" no topo, rosto num cartão 800x860 com molduras de canto (`centro` + `escala` enquadram o rosto), frase da pessoa entre aspas em 2 linhas (2ª em degradê; **palavras dela**, no máximo encurtada sem mudar o sentido, e avise), nome, empresa, selo do evento e @aleguimas. Tudo dentro do recorte 3:4 do grid (y≈240–1680).
- `npx remotion still CapaDepoimento<Nome> ../capa-depoimento-<nome>.png`.

### 6. Render final (só com aprovação)
```bash
npx remotion render <Id> ../depoimento-<nome>.mp4 --codec=h264 --crf=16 --audio-bitrate=320k --concurrency=2 --timeout=300000
```

## Armadilhas

- **Vídeo deitado**: celular grava em pé com marcação de rotação (-90°); o ffmpeg gira os quadros mas às vezes copia a marcação para a saída e o player gira de novo. O `preparar-depoimento.py` já zera a marcação (`-display_rotation 0` + remux). Confira com `ffprobe … stream_side_data=rotation` (não pode aparecer -90 no arquivo preparado).

- O ffmpeg do Remotion não tem `setsar`, `fade`, `f32le`: use `format=yuv420p` no filtro e WAV `pcm_s16le` para análise.
- Texto com `background-clip: text` (degradê) não aceita `text-shadow`: a legibilidade vem do cartão navy, não de sombra.
- Vídeo repostado do Instagram (legendas/figurinhas queimadas): use a moldura com recorte da região limpa (`Moldura.tsx` da skill `video-workshop-guimas`) em vez de tela cheia, ou avise o usuário.
- Fontes locais (`public/fontes` + `fonte.ts`): o render não depende de internet.
- Modo moldura renderiza bem mais devagar (fundo desfocado em tela cheia a cada quadro): ~25 min para 60 s neste Mac, contra ~5 min em tela cheia. Rode em background.
