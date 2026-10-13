# Decisões

## 2026-10-13 — Manter o app em arquivo único

`index.html` continua com HTML, CSS e JS juntos, sem build e sem a estrutura `src/`/`pyproject.toml`.

**Motivo:** app pequeno, aberto direto do disco (`file://`); separar em arquivos não traz ganho real, e a estrutura preferida é pensada para Python. Reavaliar se o código crescer muito.

## 2026-10-13 — Fim do período detectado também pelo relógio do Web Audio

Além do `setInterval(tick, 250)`, um oscilador mudo programado para parar em `fimPrevisto` chama `tick()` no `onended` (`agendarAlarme`/`cancelarAlarme`). `silencioso` em `finalizarPeriodo` passa a suprimir só o som; a notificação sai sempre.

**Motivo:** navegadores limitam timers de abas ocultas (até 1×/min), atrasando o fim do período e o aviso (ticket 001). O relógio do áudio não sofre esse limite. O `setInterval` continua para atualizar o mostrador.

## 2026-10-13 — Início automático em duas opções independentes

`autoPausa` (inicia pausas) e `autoFoco` (inicia o foco), ambas desligadas por padrão; `finalizarPeriodo` chama `iniciarPomodoro()` ao fim natural do período. Pular e restaurar um período vencido (`silencioso`) não iniciam o próximo sozinho (ticket 002).

**Motivo:** muita gente quer a pausa automática mas voltar ao foco só quando estiver pronta. Pular é uma ação explícita do usuário, e iniciar uma pausa que já deveria ter acabado ao reabrir a aba não faz sentido.

## 2026-10-13 — Início automático ligado por padrão

`autoPausa` e `autoFoco` passam a vir ligados em `CONFIG_PADRAO` (revoga o "desligadas por padrão" da decisão anterior). Quem já salvou a config com as chaves mantém a escolha; configs antigas sem as chaves passam a ter início automático.

**Motivo:** pedido do usuário; o ciclo contínuo é o uso esperado do app.
