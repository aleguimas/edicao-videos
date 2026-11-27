# Vídeos de demonstração do Agentic Office (com a Ana)

Vídeos 16:9 dos módulos do Agentic Office, apresentados pela Ana, a Assistente de IA da Simplí.

- **Telas:** recriadas em React (`src/agentic/App.tsx` + `src/<módulo>/Telas.tsx`) com nomes e números **fictícios** (`src/<módulo>/dados.ts`). Os prints do manual vêm de cliente real: servem só de referência.
- **Avatar** com os arquivos 2.0 da Ana. O retrato `ana-bracos-2.0.jpg` é usado no avatar de canto. A foto da Ana em reunião fica em `ana-reuniao-2.0.jpg` e o retrato com fundo verde fica em `ana-verde-2.0.jpg`. As versões para edição estão em `public/midia/` e os originais PNG em `../ana-simplí/`.
- **Voz** com edge-tts e `pt-BR-ThalitaMultilingualNeural`. O gerador usa “Agêntic, Office” na síntese para acentuar **gên** e preservar a pausa entre as palavras. Os roteiros aceitam “Agentic Office” e “Agentic, Office”, e as legendas mantêm o nome da marca.
- **Sincronia:** cada clique, campo e movimento de câmera é marcado pela palavra falada (`marca(fala, "palavra")`).

## Composições

| Composição | Roteiro (falas) | Voz | Duração |
|---|---|---|---|
| `AcompanhamentoCompleto`: módulo Acompanhamento, 9 capítulos | `scripts/falas-acompanhamento.json` | `public/voz/acompanhamento`, `src/voz-acompanhamento.json` | 9 min 2 s |
| `CorteAcomp1` a `CorteAcomp7`: 7 cortes 9:16 comerciais do Acompanhamento (`CapaCorteAcomp<n>` para as capas) | `scripts/falas-cortes-acompanhamento.json` + falas do vídeo longo | `public/voz/cortes-acompanhamento`, `src/voz-cortes-acompanhamento.json` | até 60 s |
| `AcompanhamentoPiloto`: abertura + capítulo da Clara | (mesmas falas) | (mesma voz) | 1 min 42 s |
| `Apresentacao`: apresentação geral do Agentic Office (YouTube), 8 capítulos | `scripts/falas-apresentacao.json` | `public/voz/apresentacao`, `src/voz-apresentacao.json` | 7 min 31 s |
| `ApresentacaoPiloto`: abertura + capítulo dos agentes | (mesmas falas) | (mesma voz) | 1 min 38 s |
| `VerbasCompleto`: manual inteiro, 9 capítulos | `scripts/falas-verbas-completo.json` | `public/voz/completo`, `src/voz-completo.json` | 5 min 41 s |
| `VerbasAcordos`: piloto | `scripts/falas-verbas.json` | `public/voz/verbas`, `src/voz-verbas.json` | 1 min 17 s |

Cortes do Acompanhamento: `src/cortes-acompanhamento/` (tabela `DEFS` em `Cortes.tsx`; todo corte tem a ponte que apresenta o módulo logo depois do gancho, e o cabeçalho mantém o nome do módulo na tela).
Acompanhamento: `src/acompanhamento/` (`dados.ts` com o caso fictício da Loja Sul, `Telas.tsx` e `TelasModulo.tsx` com as telas, `Emails.tsx`, `Cenas.tsx` e `Capitulos.tsx` com as cenas).
Apresentação: `src/apresentacao/` (um arquivo por capítulo; `comum.tsx` tem menus, avatares, cartões e indicadores).
Avatares em `public/midia/avatars/`: os da Diretoria têm o nome do cargo (`ceo.webp`...), a Íris tem `iris.webp` e os
outros agentes usam fotos de `avatars/pessoas/`. Um `{ cap: 0 }` no roteiro encerra a etiqueta do capítulo sem cartela.

Código: `src/verbas/Montagem.tsx` (linha do tempo, capítulos, avatar, legenda, trilha), `VerbasAcordos.tsx` (cenas do piloto),
`CenasCompleto.tsx` (cenas do manual), `Telas.tsx`/`Telas2.tsx` (telas recriadas), `Emails.tsx` (e-mails e Excel).
Para um módulo novo, reaproveite `src/agentic/App.tsx` (janela, câmera `rota`, cursor `caminho`) e `Montagem`.

## Passo a passo

```sh
# 1. dependências (uma vez)
npm install
python3 -m venv .venv && .venv/bin/pip install edge-tts

# 2. voz: edite scripts/falas-verbas.json e gere (só refaz as falas que mudaram)
.venv/bin/python -I scripts/gerar-voz.py scripts/falas-verbas.json public/voz/verbas src/voz-verbas.json

# 3. validar o sotaque: todo trecho precisa sair acima de 50% português (~1 min por fala)
#    Frase curta isolada ("Vencido?", "Relaxa.") sai com sotaque americano: junte com uma frase em português.
node scripts/validar-sotaque.mjs public/voz/verbas src/voz-verbas.json

# 4. conferir no Studio e renderizar
npm run dev
npx remotion render VerbasAcordos "../verbas e acordos/piloto-verbas-e-acordos-ana.mp4"
```

Trilha: `public/trilha.mp3` (Invisible, Anno Domini Beats), a 7% do volume, por baixo da voz.
