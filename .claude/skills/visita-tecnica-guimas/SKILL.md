---
name: visita-tecnica-guimas
description: Edita vídeos de visita técnica, missão empresarial ou tour por empresa/fábrica do Guimas (@aleguimas) — 1080x1920, falas do Guimas em selfie como base, imagens de apoio do lugar por cima da voz, gancho forte nos primeiros segundos (palavra riscada × palavra em degradê), vinheta com a logo da empresa visitada, capítulos no topo, frases e números que contam no tempo da fala, tarja e foto do grupo com quem realizou a visita, chamada final e capa. Voz preservada, volume sem distorcer, cor leve sem saturar. Use quando pedirem para editar um vídeo de visita técnica, visita a empresa/fábrica, missão ou "fazer igual ao vídeo da Tramontina".
---

# Visita técnica no padrão do Guimas

Modelo aprovado com a visita à Tramontina (Farroupilha-RS, realizada pela FIERGS e pelo Sebrae PE):
projeto em `tramontina/edicao/`, entregue em `tramontina/visita-tramontina.mp4` + `tramontina/capa-visita-tramontina.png`.
É um vídeo **mais longo** (≈ 3 min) que os cortes, então o início precisa prender e o meio precisa de variedade.
Antes de escrever código Remotion, carregue a skill `remotion-best-practices`. Conteúdo do Guimas: nada de verde Simplí nem logo da Simplí.

## Regras do usuário

- **1080x1920, 9:16.** Preservar a voz e o sentido da fala: cortar só entre frases, não mudar palavras (frases na tela usam as palavras dele, podem encurtar).
- **Volume sem distorcer**: só ganho linear por arquivo de fala (alvo -15,5 LUFS, pico ≤ -1,5 dBTP). Selfie ao ar livre tem vento/plosivas: o pico costuma limitar antes (Tramontina ficou em -18,6 LUFS). Iguale as falas entre si e **ofereça** um limitador leve; não aplique sem pedir.
- **Cor**: `FILTRO_VISITA` (contraste 1,07, saturação 0,94, sépia 0,06) igual em falas e apoios.
- Perguntar/confirmar **quem realizou a visita** (ex.: FIERGS · Sebrae PE): entra na tarja de abertura, na foto final e na capa.
- **Logo da empresa visitada**: usar o arquivo que o usuário der como está (o SVG da Tramontina já é colorido: faixa azul #00529A com letras brancas). Abra o SVG antes: filtro `brightness(0) invert(1)` apaga as cores.

## O modelo (camadas, em `src/visita/`)

| Camada | Como é |
|---|---|
| **Gancho (0–~6 s)** | a frase mais forte (contraste/número) **abre o vídeo** e não se repete depois. Primeiros ~3 s sobre uma imagem de **pessoas/grupo** no lugar (o usuário reprovou abrir com a parede do armazém), depois o rosto. `Gancho` do corte (linha mono, palavra **riscada**, palavra em **degradê** com batida + clarão, complemento) com `y` ≈ 1080 |
| **Vinheta (75 frames)** | 4 tomadas rápidas do lugar (fachada, letreiro, monumento, hall) com clarão a cada corte, "VISITA TÉCNICA", logo da empresa e cidade · UF; a trilha sobe |
| Fala (selfie) | trechos de cada arquivo em `TRECHOS` (segundos da fala preparada), na ordem do roteiro. Câmera: centro em `FOCO` [540, 1000] (rosto no terço de cima, peito livre para as frases); enquadramento alterna aberto 1,03 / fechado 1,14 por frase (`FECHADOS`), respiração lenta e **punch-ins** nas palavras fortes (`PUNCH`). Rampas de 3 frames no volume em cada emenda |
| Apoio | `ApoioEm` (tela cheia, voz continua por baixo) **quando ele fala daquilo**: "115 anos" → prédio com a frase, "não pode filmar" → grupo entrando, "humano e robô junto" → monumento ao trabalhador, "vocês vão ver o galpão" → armazém. 3–20 s cada |
| Tarja de realização | 4–5 s logo após a vinheta, topo 1330: "VISITA TÉCNICA · REALIZAÇÃO", quem realizou, empresa · cidade |
| Capítulos | `Capitulo` no topo (y 150): "EMPRESA · PARTE N" + tema (branco + degradê), troca a cada assunto (5–7 partes): quem chega no meio se acha |
| Frases | `Frase` (PalavrasCineticas) topo ~1240, linha 2 em degradê na hora em que a palavra é dita (`l2` = segundo da fala). 6–10 por minuto |
| Números | `NumeroEm`: número grande em degradê que **conta** até o valor quando é dito (80 robôs, 30.000 posições, 1.000 colaboradores). "Antes × depois" (4 mil → 1.500 itens) usa o `Gancho` com riscada |
| Encerramento | `FotoGrupo` (foto oficial do grupo, aproximação lenta, logo, "REALIZAÇÃO" + nomes, 140 frames) → `ChamadaFinal` (pergunta que devolve o tema, 90 frames) |
| Trilha | uma música por vídeo (`musicas/`), -15,5 LUFS, 0,11–0,13 sob a fala, 0,55 na vinheta e no encerramento |

## Passo a passo

### 0. Projeto
```bash
mkdir -p <pasta>/edicao <pasta>/previa && cd <pasta>/edicao
cp -R ../../.claude/skills/visita-tecnica-guimas/template/. . && mkdir -p scripts public/midia
cp ../../.claude/skills/visita-tecnica-guimas/scripts/* scripts/ && npm i
```
Remotion fixo em 4.0.533; node_modules próprio (o Whisper fica em cache dentro dele). O ffmpeg do Remotion é mínimo (sem `fps`, `select`, `tile`, `afade`, `alimiter`): para folhas de contato extraia quadros soltos e junte com `uv run --with pillow`.

### 1. Mídia
Edite `FALAS` e `APOIO` em `scripts/preparar-midia.py` (arquivo original → nome curto) e rode `python3 scripts/preparar-midia.py`: tudo vira 1080x1920/30 fps CRF 14 sem marcação de rotação (celular grava deitado com rotação ±90), falas com ganho linear. Copie a logo e a foto do grupo (`sips -Z 2400`) para `public/midia/`.

### 2. Transcrever e ver o material
```bash
mkdir -p ../transcricao && ln -sf "../<fala 1>.mp4" ../transcricao/01.mp4   # idem para as outras falas
npx tsx scripts/transcrever-curtos.mts ../transcricao
```
Liste palavra a palavra com tempo (`startMs`) para os `l2`/punch-ins. Monte folhas de contato das falas e de cada apoio (quadros a cada ~1/6 da duração) para saber o que tem em cada imagem.

### 3. Roteiro
- Gancho: frase de contraste/número (Tramontina: "apesar de toda a automação, a empresa só fez crescer em número de colaboradores" → DEMITIU riscado, CRESCEU).
- Corpo: falas em ordem, cortando só entre frases; junte trechos que continuam o assunto do gancho perto dele.
- Para cada apoio, ache a frase em que ele fala daquilo. Para cada número dito, um `NumeroEm`.
- Capítulos por assunto e a pergunta da chamada final.

### 4. Composição
Copie `src/visita/VisitaTramontina.tsx` para o novo nome e troque `TRECHOS`, `FECHADOS`, `PUNCH`, apoios, gancho, vinheta, tarja, capítulos, frases, números, foto e chamada. Registre no `Root.tsx` (duração = `DURACAO_VISITA`).

### 5. Trilha
`node scripts/analisar-musica.mjs <música>` e `python3 scripts/preparar-trilha-corte.py "<música>" <início> <duração + 8> public/midia/trilha.wav`. Escolha uma faixa com duração ≥ vídeo (sem emendas).

### 6. Conferência (obrigatória)
`npx tsc --noEmit`; stills `--scale=0.3` no gancho (antes/depois do risco), vinheta (logo), tarja, 2–3 frases, cada número, o "antes × depois", foto e chamada. Verifique: nada vazando (destaque do gancho com largura 800 por causa da batida), texto fora da boca, palavras em degradê separadas (gap 0,32em), logo com as cores certas.
Prévia: `npx remotion render <Id> ../previa/<nome>-previa.mp4 --scale=0.5 --crf=24 --concurrency=2` (≈ 15 min para 3 min de vídeo) e meça o áudio.

### 7. Capa (`CapaVisita`, still 1080x1920)
**Foto oficial do grupo** na frente da empresa (o usuário preferiu ao rosto do Guimas): `subir` desloca a foto para o grupo ficar no meio do recorte 3:4. Em cima: "VISITA TÉCNICA", logo da empresa, barrinha e quem realizou; embaixo o gancho do vídeo (linha mono, palavra riscada, palavra em degradê, complemento) sobre o navy; @aleguimas.
```bash
npx remotion still CapaVisita ../capa-visita-<empresa>.png
```

### 8. Final (com aprovação)
```bash
npx remotion render <Id> ../visita-<empresa>.mp4 --codec=h264 --crf=16 --audio-bitrate=320k --concurrency=2 --timeout=300000
```
Rode em background (≈ 30–40 min para 3 min neste Mac).

### 9. Copies (`<pasta>/copies-visita-<empresa>.md`)
Mesmo tom da skill `video-workshop-guimas` (primeira pessoa, sem travessão "—", só fatos ditos no vídeo). Gancho = o contraste do vídeo. Instagram com 👉 e 10–12 hashtags; TikTok curto com pergunta; YouTube: até 3 min ainda é Shorts (título ≤ 100 caracteres + #Shorts); LinkedIn agradecendo quem realizou a visita e a empresa visitada, aprendizados com →. Todas com o crédito da música. Exemplo: `tramontina/copies-visita-tramontina.md`.
