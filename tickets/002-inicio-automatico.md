# 002 — Início automático do próximo período

Status: review
Prioridade: média

## Objetivo
Opções nas Configurações para o próximo período começar sozinho ao fim do anterior, sem clicar em Iniciar.

## Contexto
Hoje `finalizarPeriodo()` deixa o próximo período em `fase = "parado"`. Duas opções independentes, ambas desligadas por padrão (comportamento atual preservado): `autoPausa` (inicia pausas) e `autoFoco` (inicia o foco).

## Arquivos relevantes
- `index.html` — `CONFIG_PADRAO`, `valorValido`, `preencherInputs`, handler dos `inputsConfig`, `finalizarPeriodo`, bloco `<details class="config">`
- `CLAUDE.md`, `DECISIONS.md`

## Escopo
1. Duas chaves booleanas em `CONFIG_PADRAO`; `valorValido` aceita booleano para elas.
2. Dois checkboxes em Configurações, persistidos em `tomatata-config`.
3. Disparo ao fim de `finalizarPeriodo()` só quando o período termina naturalmente (não `pulado`, não `silencioso`).
4. Atualizar `CLAUDE.md` e `DECISIONS.md`.

## Fora do escopo
- Contagem regressiva de aviso antes de começar.
- Outras melhorias (modo escuro, histórico, PWA).

## Dependências
Nenhuma.

## Critérios de conclusão
- Config antiga (sem as chaves novas) carrega com ambas desligadas, sem erro.
- Só `autoPausa`: foco termina → pausa começa; pausa termina → foco fica parado. Só `autoFoco`: o contrário.
- Ambas: o ciclo segue sozinho, inclusive a pausa longa.
- Pular não inicia o próximo; restaurar período vencido não inicia o próximo.
- Checkboxes voltam como salvos após recarregar; console sem erros.

## Achados
(a preencher)

## Trabalho realizado
- 2026-10-13 10:43 — Ticket criado e reservado.
- 2026-10-13 — Implementado em `index.html`: `autoPausa`/`autoFoco` em `CONFIG_PADRAO`, `valorValido` booleano, dois checkboxes em Configurações (CSS separado para `input[type=checkbox]` e `input[type=number]`), `preencherInputs` e handler de `change` tratam checkbox, disparo no fim de `finalizarPeriodo`. `CLAUDE.md` e `DECISIONS.md` atualizados.
- Verificação: `node --check` OK. Testes no Chrome (servidor local temporário, já encerrado; foco/pausas = 1 min, ciclo = 2; cliques reais nos checkboxes e em Iniciar, restante encurtado por JS com `fimPrevisto` + `agendarAlarme()` para não esperar):
  - Config antiga sem as chaves: carrega com ambas desligadas, sem erro. OK.
  - Só `autoPausa`: foco termina → pausa rodando (com alarme); pausa termina → foco parado. OK.
  - Só `autoFoco`: foco termina → pausa parada; pausa termina → foco rodando (com alarme). OK.
  - Ambas: foco → pausa longa (4º pomodoro) rodando → foco rodando. OK.
  - Pular com ambas: o próximo fica parado. Restaurar período vencido: fica parado. OK.
  - Recarregar: checkboxes voltam marcados e salvos em `tomatata-config`. OK.
  - Console: sem erros (a leitura começou depois do carregamento da página; erros de carga não foram capturados, mas os testes rodaram sem exceções).
- Nota: o teste não mediu o comportamento em aba realmente oculta (ver ticket 001).
- 2026-10-13 — A pedido do usuário, `autoPausa` e `autoFoco` passam a ser `true` por padrão em `CONFIG_PADRAO` (o "desligadas por padrão" acima ficou superado; ver `DECISIONS.md`). Só `node --check` foi rodado depois da mudança; o caminho de código é o mesmo já testado, mudou apenas o valor padrão.

## Questões pendentes
Nenhuma.

## Próximo passo
Usuário experimentar no uso real; se estiver ok, mudar para `done`.
