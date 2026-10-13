# 001 — Timer para ou não avisa em segundo plano

Status: review
Prioridade: alta

## Objetivo
Quando o TOMATATA está em outra aba, o fim do período deve ser detectado no horário e o aviso (som + notificação) deve sair.

## Contexto
Relato do usuário: "quando estamos em outra aba, o timer está parando e/ou não tocando o aviso". Causas prováveis, pela leitura do `index.html`:
1. Throttling de timers em aba oculta (1×/s; depois de 5 min, 1×/min). O fim só é detectado no `tick()` via `setInterval(tick, 250)`.
2. Aba descartada/recarregada: `carregarTimer()` chama `finalizarPeriodo({ silencioso: true })`, que fecha o período sem som e sem notificação.
3. Após recarregar com o timer rodando, `audioCtx` é `null`; o contexto criado sem gesto fica suspenso e o som não sai.

## Arquivos relevantes
- `index.html` — `iniciarPomodoro`, `pararTick`, `carregarTimer`, `finalizarPeriodo`, `desbloquearAudio`, `emitirSom`
- `CLAUDE.md`, `DECISIONS.md`

## Escopo
1. Alarme no relógio do Web Audio (`agendarAlarme`/`cancelarAlarme`), que chama `tick()` no `onended`; `cancelarAlarme()` dentro de `pararTick()`.
2. Após recarregar com o timer rodando, desbloquear o áudio e agendar o alarme no primeiro `pointerdown`/`keydown` (`{ once: true }`).
3. `silencioso` passa a suprimir só o som; a notificação sai mesmo assim.
4. Atualizar `CLAUDE.md` (Arquitetura) e `DECISIONS.md`.

## Fora do escopo
- Service worker, PWA, Web Worker para o timer.
- Novas opções na interface.

## Dependências
Nenhuma.

## Critérios de conclusão
- Com a aba oculta, o aviso sai com atraso de cerca de 1 s (antes: até ~60 s).
- Recarregar com o timer rodando e clicar uma vez: o som toca no fim.
- Período que terminou com a aba fechada: notificação sem som, estado avança.
- Pausar, pular e reiniciar não deixam aviso fantasma.

## Achados
(a preencher)

## Trabalho realizado
- 2026-10-13 10:35 — Ticket criado e reservado.
- 2026-10-13 — Implementado em `index.html`: `agendarAlarme`/`cancelarAlarme` (chamado em `pararTick`), `desbloquearAudio` devolve promessa, `iniciarPomodoro` agenda o alarme após liberar o áudio, `carregarTimer` libera o áudio no primeiro `pointerdown`/`keydown`, `silencioso` suprime só o som. `CLAUDE.md` e `DECISIONS.md` atualizados.
- Verificação feita: sintaxe do `<script>` extraído conferida com `node --check` (OK).
- 2026-10-13 — Testes no Chrome (servidor local `python -m http.server` em 127.0.0.1:8765, já encerrado; foco/pausas = 1 min; `finalizarPeriodo` e `emitirSom` instrumentados):
  - Fim normal com clique real em Iniciar: áudio `running`, alarme agendado; fim 2 ms após `fimPrevisto`, com som. OK.
  - Alarme isolado: com o `setInterval` cancelado por JS, o período terminou sozinho 30 ms após `fimPrevisto`, com som. OK.
  - Pausar, pular e reiniciar: `alarme` volta a `null` em todos; nenhum aviso extra no log. OK.
  - Recarregar com o timer rodando: sem clique, `audioCtx` nulo e sem alarme; após um clique na página, áudio `running` e alarme agendado. OK.
  - Período vencido restaurado (estado salvo com fim 2 min no passado, `carregarTimer()` com `Notification` e `emitirSom` simulados): notificação enviada, sem som, estado avançou para `pausa-curta`. OK (notificação simulada; não vi uma real).
  - Console: nenhum erro.
- Limitação: o Chrome automatizado manteve `document.hidden === false` mesmo com outra aba na frente, então o throttling real de aba oculta (inclusive o de 1×/min depois de 5 min) NÃO foi reproduzido. O teste do alarme isolado cobre o mecanismo, não o ganho medido.

## Questões pendentes
Confirmar na prática, com a aba realmente em segundo plano (outra janela, ou minimizada) por mais de 5 min, que o aviso sai no horário.

## Próximo passo
Usuário usar o app em uso real por um dia (foco normal, aba em segundo plano); se o aviso sair no horário, mudar para `done`.
