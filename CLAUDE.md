# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Visão geral

TOMATATA: timer Pomodoro em um único arquivo, `index.html` (HTML + CSS + JS puro). Sem build, sem dependências, sem testes e sem lint configurados. Para rodar, abra no navegador: `Start-Process index.html`. Repositório: https://github.com/silvamt/tomate (branch `master`); o app publicado fica em https://tomatata.netlify.app/.

## Arquitetura

Todo o JS fica no `<script>` ao fim do `index.html`; é preciso ler o bloco inteiro para entender o fluxo.

- **Máquina de estados** com três variáveis globais: `periodo` (`trabalho` | `pausa-curta` | `pausa-longa`), `fase` (`parado` | `rodando` | `pausado`) e `contexto` (`inicio` | `pos-foco` | `pos-pausa`, como se chegou ao período atual). `temaAtual()` (classe do `body`) e `statusTexto()` derivam daí.
- **Renderização**: depois de mutar o estado, chama-se `salvarTimer()` e `render()`. O `tick()` só chama `atualizarTimer()`.
- **Tempo por relógio**: `fimPrevisto` guarda um timestamp e `calcularRestante()` recalcula `restante` a cada 250 ms; nada é decrementado, para resistir a abas em segundo plano. `visibilitychange` força um `tick()`.
- **Transições** passam todas por `finalizarPeriodo({ pulado, silencioso })`: só conta pomodoro se não for pulado; a pausa longa vem quando `pomodorosConcluidos % config.ciclo === 0`; `silencioso` é usado ao restaurar um timer que expirou com a página fechada (sem som nem notificação).
- **Persistência** em `localStorage`, três chaves (`tomatata-data`, `tomatata-timer`, `tomatata-config`), via `lerJSON`/`gravarJSON` (com try/catch). `carregarTimer()` valida o estado salvo e volta ao inicial se for inválido. As estatísticas são por dia (`toDateString()`) e zeradas em `garantirDia()`.
- **Configuração**: `CONFIG_PADRAO` + `LIMITES`; inputs com `data-config` são arredondados e limitados no evento `change`. Mudar a duração só reinicia o relógio se `fase === "parado"`.
- **Som e avisos**: Web Audio (`emitirSom`, sem arquivos de áudio) e Notification API; áudio e permissão são liberados no primeiro "Iniciar".
- **Atalhos**: Espaço (iniciar/pausar), R (reiniciar), S (pular); ignorados dentro de inputs.

## Convenções

- Identificadores, textos da interface e comentários em português.
- Cores como variáveis CSS em `:root`; respeitar `prefers-reduced-motion`.
- Ao criar período, fase ou contexto, atualize também `PERIODOS`/`FASES`/`CONTEXTOS` e a validação em `carregarTimer()`.
- Ao mudar o formato salvo no `localStorage`, mantenha compatibilidade; senão a validação descarta o estado do usuário.

## Fluxo por tickets

- No início de cada sessão, identifique o ticket ativo em `tickets/` e leia-o primeiro; atualize-o a cada etapa concluída. Tickets ficam em `tickets/NNN-descricao-curta.md` e são a única lista de tarefas (não crie outras).
- Campos do ticket: status (`todo`, `in_progress`, `blocked`, `review`, `done`), prioridade, objetivo, contexto, arquivos relevantes, escopo, fora do escopo, dependências, critérios de conclusão, achados, trabalho realizado (com comandos de verificação e dados conferidos), questões pendentes e próximo passo.
- Ao passar para `in_progress`, releia o cabeçalho e, sem reserva recente de outro responsável, acrescente abaixo de `Prioridade` as linhas `Responsável: <máquina/sessão>` e `Reservado em: AAAA-MM-DD HH:MM` (hora de `Get-Date -Format "yyyy-MM-dd HH:mm"`, sem estimar). Apague-as ao sair de `in_progress`. Reserva com mais de 1 h pode ser retomada, com registro no ticket.
- Dependências na seção "Dependências" só com números (`- NNN — motivo`). Em "Trabalho realizado" e em `DECISIONS.md` só acrescente; não reescreva o que outra sessão escreveu.
- Decisões permanentes vão em `DECISIONS.md`; a descrição do projeto, em `PROJECT.md`.
- Commit local automático ao concluir uma etapa (ou o ticket), sem pedir confirmação. Liste os arquivos um a um (nunca `git add .` nem `-A`) e confira a lista; só os que a sessão alterou. Mensagem curta no imperativo. Nunca faça push, amend, reset ou reescrita de histórico sem pedir. Use o PowerShell para o Git.
