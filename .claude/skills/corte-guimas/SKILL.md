---
name: corte-guimas
description: Edita cortes curtos (Reels, Shorts, TikTok) de falas do Guimas em workshops e palestras no padrão @aleguimas — gancho nos primeiros segundos (a frase de impacto abre o vídeo, com palavra riscada e palavra em degradê batendo), câmera virtual que segue o palestrante (rastreio com Apple Vision) com punch-ins, palavras-chave grandes em movimento sincronizadas com a fala, título fixo, barra de progresso, chamada final para comentar e trilha baixa variando entre cortes. Use quando pedirem para editar, finalizar ou "deixar com movimento" um corte de fala do Guimas, ou "fazer igual ao corte 01".
---

# Corte editado no padrão do Guimas

Modelo aprovado com o corte 01 do workshop de Cuiabá ("banco ou bando de dados"), em
`workshop-cuiaba/edicao/src/corte/Corte01.tsx`; entregue em `workshop-cuiaba/cortes-editados/`.
É o motor do modelo da Simplí (palavras grandes que entram com a fala) com a identidade @aleguimas.
Antes de escrever código Remotion, carregue a skill `remotion-best-practices`.
Conteúdo do Guimas: nada de verde Simplí nem logo da Simplí.

`SKILL=.claude/skills/corte-guimas`. Se o projeto já usa `video-workshop-guimas` ou `depoimento-guimas`,
os arquivos compartilhados (`fonte.ts`, `Cantos.tsx`, `Assinatura.tsx`, `Clipe.tsx`, `Flash.tsx`, `public/fontes`) já existem:
copie só `src/corte/` e os scripts.

## O modelo (camadas)

| Camada | Como é |
|---|---|
| **Gancho (0–~4 s)** | a frase de impacto do corte **abre o vídeo**, mesmo que na fala ela venha depois (reordene os trechos). `Gancho`: linha pequena em mono branca, palavra grande que aparece e é **riscada** (linha lilás #9A7BF0, apaga para #6C779F), palavra em **degradê** que bate no lugar com escala, tremida, clarão e punch-in, e o complemento. Halo navy atrás. Nada parado no frame 0: a câmera abre afastando (2,0 → 1,7) |
| Câmera | segue o palestrante: `rastrear-apresentador.swift` (Apple Vision, 2 quadros/s) → `gerar-camera.mjs` (preenche buracos + média móvel ~2,5 s) → `camera-<corte>.ts`. Zoom base 1,7; **punch-ins** (+0,12 a +0,28, sobe em 3 frames e volta em 0,7 s) nas palavras de impacto |
| Título fixo | depois do gancho, no topo (y 150): cartão navy com etiqueta mono (ex.: "IA NA PRÁTICA") e o tema em 1 linha (branco + degradê) |
| Palavras-chave (`PalavrasCineticas`) | 6–10 por minuto, na altura do tronco (topo 1140–1160): sem cartão, Archivo 800 caixa alta; linha 1 branca, linha 2 em degradê com "batida" (0,6 → 1,12 → 1); cada palavra sobe e entra em foco na hora em que é dita (`atrasoLinha2` = segundo da palavra); halo navy desfocado + `drop-shadow` no texto (funciona no degradê) |
| Barra de progresso | 8 px em degradê no topo, cresce até o fim |
| Assinatura | molduras de canto + @aleguimas |
| Chamada final (75 frames) | fundo navy: "E NA SUA EMPRESA?" + a pergunta do corte em degradê + "COMENTA AQUI E SEGUE" + @aleguimas (puxa comentário) |
| Áudio | voz com ganho linear por trecho (-15,5 LUFS, pico ≤ -1,5 dBTP); trilha a 0,12 sob a fala, sobe para 0,6 na chamada e some no fim |
| Cor | `FILTRO_COR` do `Clipe.tsx` (contraste 1,08, saturação 0,9, toque quente) |

Duração alvo ≤ 60 s (Shorts). Textos sempre com as **palavras do Guimas** (pode encurtar, não mudar o sentido).

## Passo a passo (por corte)

### 1. Roteiro do corte
Leia a transcrição do trecho (`transcricao/legendas.json` do workshop ou `transcrever-curtos.mts` no corte bruto) e defina:
- **Gancho**: a frase mais forte/polêmica (pergunta, contraste, "erra valendo"). Ela vai para o começo; não repita a frase no meio.
- **Corpo**: a explicação em ordem, sem as pausas longas; **fim** numa frase de fechamento.
- Palavra **riscada × destaque** para o gancho (ex.: BANCO → BANDO; "pode errar" → "erra valendo").
- Pergunta da chamada final (devolve o tema para quem assiste).

### 2. Mídia
```bash
python3 scripts/preparar-corte.py <corte>      # trechos em CORTES["<corte>"] = [(ini, fim), …] na ordem do roteiro
```
Monta do original do workshop (x264 CRF 14, ganho por trecho, zera a marcação de rotação) em `public/cortes/<corte>.mp4` e imprime onde cada trecho caiu no corte.

### 3. Câmera
```bash
mkdir -p /tmp/rastreio && npx remotion ffmpeg -i public/cortes/<corte>.mp4 -r 2 -vf scale=360:-1 -q:v 4 /tmp/rastreio/%05d.jpg
swift scripts/rastrear-apresentador.swift /tmp/rastreio 2 public/cortes/<corte>-camera.json
node scripts/gerar-camera.mjs public/cortes/<corte>-camera.json <duração s> src/corte/camera-<corte>.ts CAMERA_<CORTE> <emendas s, ex.: 5,13.5,17.3>
```
Passe as **emendas** (instantes em que o corte junta momentos diferentes do workshop; o `preparar-corte.py` imprime onde cada trecho cai): a câmera não suaviza através delas e troca de posição de uma vez na emenda (corte seco), em vez de deslizar pela sala.
O rastreio identifica o palestrante pela **cor da roupa no tronco** (4º argumento, padrão `azul`: a camisa azul clara do Guimas em Cuiabá); quem passa na frente da câmera é ignorado e o buraco é interpolado. Se ele estiver com outra cor, use `qualquer` (maior pessoa em pé) ou adapte a regra de cor no script.
Regras do rastreio (aprendidas nos cortes 02 e 07): só conta quem está **em pé** (caixa com proporção altura/largura ≥ 1,8; sentados saem); se ninguém passar (pernas encobertas pela plateia), aceita só o tronco com a cabeça alta no quadro (acima das cabeças sentadas); a cor é medida no **peito** (12–30% do topo da caixa) com limiar baixo (azul − vermelho ≥ 2), porque **contra a luz da janela a camisa azul fica cinza-escura**; e o `gerar-camera.mjs` descarta picos isolados (> 250 px dos dois vizinhos).
**Confira sempre** os pontos do JSON: altura (`h`) que salta para 800+ px ou x que dispara indicam outra pessoa (no corte 02 uma participante passou na frente e a câmera a seguiu de 10 a 18 s antes da regra de cor). Abra o quadro suspeito (`/tmp/rastreio/NNNNN.jpg`) e confirme.

### 4. Palavras no tempo da fala
```bash
npx tsx scripts/transcrever-curtos.mts <pasta só com public/cortes/<corte>.mp4>
```
Liste as palavras com o frame (`Math.round(startMs/1000*30)`) e marque: frames do gancho (`emTopo`, `emRiscada`, `emDestaque`, `emFim`), punch-ins e cada `PalavrasCineticas` (`from` ~5 frames antes da 1ª palavra, `atrasoLinha2` = (frame da palavra da linha 2 − from)/30, duração até a próxima frase).

### 5. Trilha (variar entre cortes)
Use uma música diferente por corte (pasta `editor-videos/musicas/`); confira licença (YouTube Audio Library e "No Copyright Music" com crédito). `node scripts/analisar-musica.mjs <música>` dá BPM e energia; escolha um trecho de energia constante.
```bash
python3 scripts/preparar-trilha-corte.py "<música>" <início s> <duração do corte + 3> public/cortes/trilha-<corte>.wav
```
Mede e normaliza a música para -15,5 LUFS (as faixas vêm entre -8 e -13 LUFS) e faz fade-out de 1,5 s.

### 6. Composição
Copie `src/corte/CorteExemplo.tsx` para `src/corte/Corte<NN>.tsx` e troque: vídeo, trilha, `camera-<corte>`, `VIDEO` (frames), `PUNCH`, props do `Gancho`, `TituloFixo`, cada `PalavrasCineticas` (um nó JSX por frase, editável no Studio) e a `ChamadaFinal`. Registre no `Root.tsx` com `durationInFrames = VIDEO + 75`.

### 7. Conferência (obrigatória)
- `npx tsc --noEmit`; stills no gancho (antes e depois do risco), em 2–3 palavras-chave e na chamada final (`--scale=0.33`). Verifique: nada vazando da tela (frases ajustam sozinhas a 960 px), palavras legíveis sobre o fundo claro, palestrante enquadrado.
- Prévia: `npx remotion render Corte<NN> ../previa/corte<NN>-editado-previa.mp4 --scale=0.5 --crf=24 --concurrency=2`, meça o áudio (≈ -15,5 LUFS, pico < -1,5 dBTP) e `open`.

### 8. Capa (`CapaCorte`, still 1080x1920)
Repete o gancho do corte na capa: foto do Guimas **perto da câmera** em cima (nos cortes a câmera está longe e a imagem fica mole; use um quadro em que ele passa perto, achado com `achar-apresentador.swift` da skill `video-workshop-guimas`, ex.: `resumo/capa-frame-perto.png` em Cuiabá), etiqueta, linha pequena em mono, palavra **riscada** em lilás, palavra em **degradê** grande e complemento, dentro do recorte 3:4 do grid.
```bash
npx remotion still CapaCorte<NN> ../cortes-editados/capa-corte<NN>-<tema>.png
```

### 9. Final (com aprovação)
```bash
npx remotion render Corte<NN> ../cortes-editados/corte<NN>-<tema>.mp4 --codec=h264 --crf=16 --audio-bitrate=320k --concurrency=2 --timeout=300000
```
Rode em background (~10–15 min para 55 s neste Mac).

## Armadilhas
- Texto em degradê (`background-clip: text`) não aceita `text-shadow`: use `filter: drop-shadow(...)` no contêiner da linha.
- **Acento cortado no degradê** (Ô, Á, É): o fundo do `background-clip: text` só pinta dentro da caixa, e com `line-height` < 1 o acento fica acima dela. O `textoDegrade` do `fonte.ts` já tem padding de 0,2em em cima com margem negativa; não remova. Confira sempre um still com palavra acentuada na linha em degradê.
- Frase longa estoura a tela: o `caber()` reduz o tamanho para caber em 960 px; ainda assim prefira 2 linhas curtas.
- Palavra lavanda/azul solta sem halo some sobre a sala clara (o usuário reprovou): mantenha halo + sombra.
- O ffmpeg do Remotion não tem `afade`: o fade da trilha é `volume` com expressão no tempo.
- Gravação de celular: sempre zerar a marcação de rotação na mídia preparada (já feito no script).
- Linhas do gancho com frase longa (ex.: "QUANTO VOU VENDER EM NOVEMBRO?") se ajustam sozinhas à largura (`caber` no `Gancho.tsx`).
