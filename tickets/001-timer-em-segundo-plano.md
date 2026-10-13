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
- Verificação NÃO feita: teste no navegador (aba oculta, recarga com timer rodando, aba fechada, pausar/pular/reiniciar).

## Questões pendentes
Teste manual no navegador dos critérios de conclusão.

## Próximo passo
Testar no navegador (foco = 1 min, trocar de aba; depois foco = 7 min oculto) e, se passar, mudar para `done`.
