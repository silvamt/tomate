# Decisões

## 2026-10-13 — Manter o app em arquivo único

`index.html` continua com HTML, CSS e JS juntos, sem build e sem a estrutura `src/`/`pyproject.toml`.

**Motivo:** app pequeno, aberto direto do disco (`file://`); separar em arquivos não traz ganho real, e a estrutura preferida é pensada para Python. Reavaliar se o código crescer muito.

## 2026-10-13 — Fim do período detectado também pelo relógio do Web Audio

Além do `setInterval(tick, 250)`, um oscilador mudo programado para parar em `fimPrevisto` chama `tick()` no `onended` (`agendarAlarme`/`cancelarAlarme`). `silencioso` em `finalizarPeriodo` passa a suprimir só o som; a notificação sai sempre.

**Motivo:** navegadores limitam timers de abas ocultas (até 1×/min), atrasando o fim do período e o aviso (ticket 001). O relógio do áudio não sofre esse limite. O `setInterval` continua para atualizar o mostrador.
