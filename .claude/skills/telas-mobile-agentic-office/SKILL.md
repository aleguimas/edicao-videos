---
name: telas-mobile-agentic-office
description: Reproduz as telas do Agentic Office na versão mobile real nos cortes 9:16 (Reels e Shorts) dos vídeos de módulo com a Ana — kit Remotion com a fonte e as cores do sistema, tela cheia com a barra branca, rolagem em vez de zoom, dados fictícios da Loja Modelo. Use sempre que for criar ou ajustar um corte vertical que mostre tela do sistema, ou quando pedirem para "colocar a versão mobile", "tela do celular" ou "fazer igual aos cortes da apresentação".
---

# Telas mobile do Agentic Office

Regra do usuário (05/11/2026): **em corte 9:16, toda tela do sistema é a versão mobile do aplicativo.** Nunca a tela de computador recortada. Vídeo longo 16:9 continua com a tela de computador.

Antes de escrever código Remotion, carregue a skill `remotion-best-practices`.

## Onde está cada coisa

Projeto: `manuais simplí/agentic-office/edicao/`.

| Material | Caminho |
|---|---|
| Kit (peças e tokens) | `src/mobile/Kit.tsx` |
| Olho de Deus | `src/mobile/Olho.tsx` |
| Tarefas, Rotinas, Calls | `src/mobile/Trabalho.tsx` |
| Agentes, Integrações, Gráfico do banco, KPIs, Base, Memória, Habilidades, Diversas, Estoque, Price Watch, Verbas, Conciliação, Prospecção, Logs, Mini Apps | `src/mobile/Modulos.tsx` |
| Acompanhamento (demanda, documento, revisão, ativar, resposta, aprovar, números, painel geral) | `src/mobile/Acompanhamento.tsx` |
| Montagem do corte, cabeçalho, legenda, ícone | `src/cortes/Vertical.tsx` |
| Gancho e capa | `src/cortes/Ganchos.tsx` |
| Exemplo completo de cortes | `src/cortes/Cortes.tsx` e `src/cortes-acompanhamento/Cortes.tsx` |
| Capturas do sistema real, por empresa | `manuais simplí/agentic-office/referencia-mobile/` |
| Logos e ícone | `logos/` (`logo-agentic-office-fundo-claro.png`, `ico-simplí-fundo-escuro.png`) |

**As capturas têm dados reais de clientes.** São só consulta: nunca entram em vídeo, nunca vão para o git (a pasta está no `.gitignore`).

## Layout do corte (1080x1920)

- Cabeçalho com a Ana e o título: y 150 a 340.
- Tela mobile `TelaM`: largura toda, y 360 a 1480, sem moldura de aparelho. Barra branca fixa de 61 px com a logo e o menu.
- Legenda: y 1500.
- Ícone da Simplí: canto inferior direito, automático em `MontagemVertical`.
- Fim e cenas gráficas (dados na empresa, papéis de acesso, ponte do módulo) continuam como cenas gráficas: a regra vale para **tela do sistema**.

## Valores do sistema (não trocar)

| Item | Valor |
|---|---|
| Largura de referência | 412 px de CSS, escala 2,62 |
| Fontes | Octosquares (títulos e texto) e Geist Mono (rótulos `//`). Em `src/fonte.ts`: `fonteSistema`, `fonteMonoSistema` |
| Fundo | `#0C140F` com grade branca a 5%, de 44 px |
| Cartão | `rgba(15,29,21,0.88)`, borda branca a 12%, raio 10 |
| Verde do sistema | `#86EFAC` (botão "Criar com IA", chips, ativo). O verde `#3CE01E` é da marca e fica nas peças do vídeo, fora da tela |
| Título H1 | 24 px, peso 600, espaçamento 0,14 em, maiúsculas |
| Botão | altura 36, raio 4; branco para ação principal, contorno para as demais |
| Mensagem do usuário | fundo branco, raio 6, 14 px; resposta `#1B261F` |

## Como montar uma tela

Tudo é escrito em pixels de CSS do celular, em layout normal (flex), como a página real. A tela escala sozinha.

```tsx
export const MinhaTelaM: React.FC<{ c: Cena }> = ({ c }) => {
  const frame = useCurrentFrame();
  const m = (p: string, n = 0) => marca(c.fala, p, n);
  return (
    <TelaM rola={rolagem(c, 0, [[m("palavra"), 150]])}>
      <TituloM icone="estoque">Nome do módulo</TituloM>
      <DescricaoM>Descrição igual à do sistema.</DescricaoM>
      <CartaoM aceso={frame >= m("outra") - 4}>...</CartaoM>
    </TelaM>
  );
};
```

- **Movimento:** o celular rola, não dá zoom. `rolagem(c, inicio, [[frame, y]])` para perto da palavra da fala. Abas e colunas trocam no tempo da fala.
- **Janelas:** no celular viram folha que sobe de baixo (`Folha` em `Acompanhamento.tsx`). Cartões flutuantes vão na prop `fixo` de `TelaM`.
- **Destaque:** `aceso` nas peças do kit, sempre no momento em que a Ana fala daquilo.
- **Etiquetas da marca sobre a tela** (ex.: `0 CRÉDITO DE IA`, `+1.000`): ficam fora de `TelaM`, em `Surge`, sem cobrir o dado principal.
- Altura útil abaixo da barra: 366 px de CSS (`VISIVEL`). Se o conteúdo não cabe, role.
- Em `marca()`, a palavra precisa existir na fala, senão a composição quebra.

## Dados

Só dados fictícios da Loja Modelo. Nunca Revestir, Grupo BCI, nomes, e-mails ou telefones reais. Reaproveite os dados que já existem em cada módulo (`src/acompanhamento/dados.ts`, `src/verbas/dados.ts`) para o corte combinar com o vídeo longo.

Vale o que está na memória sobre termos do produto: skills, Acompanhamento com ações, prazo e responsável, sistema de gestão pelo banco ou MCP sem citar nomes de ERP. "Decisões" existe no menu.

## Conferência antes do render final

1. `npx tsc --noEmit`.
2. Render de quadros em cada cena: início, meio e fim. Olhar texto cortado, cartão fora da tela, peça cobrindo dado.
3. Piloto de um corte para o usuário aprovar, quando o módulo for novo.
4. Duração abaixo de 60 s.

## Capturar uma tela nova

Quando faltar referência de um módulo:

1. Abra um Chrome separado, com perfil próprio:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --user-data-dir=<pasta temporária> --remote-debugging-port=9333 https://agenticoffice.simpli.ia.br/dashboard`
2. Peça ao usuário para fazer o login nessa janela. Não peça senha no chat.
3. `node .claude/skills/telas-mobile-agentic-office/scripts/capturar-mobile.mjs <url> saida.png 4000`.
4. Só navegue e leia. Não clique em ação que altere dados (Executar, Aprovar, Excluir, Salvar).
5. Salve em `referencia-mobile/<empresa>/`.

Onde há dados: Acompanhamento e Conciliação no Grupo BCI; Estoque, Price Watch, Verbas, KPIs, Vendas 360 e Memória na Revestir; Tarefas, Rotinas, Olho de Deus, Calls, Prospecção, Habilidades e Base de conhecimento na Simplí. A empresa é trocada pelo usuário.

Telas ainda sem captura no celular, feitas a partir do conteúdo do vídeo longo no padrão mobile: janelas do Acompanhamento (adicionar documento, revisão, ativar, página de resposta) e o cartão de fluxo em Rotinas.
