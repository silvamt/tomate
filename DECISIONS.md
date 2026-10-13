# Decisões

## 2026-10-13 — Manter o app em arquivo único

`index.html` continua com HTML, CSS e JS juntos, sem build e sem a estrutura `src/`/`pyproject.toml`.

**Motivo:** app pequeno, aberto direto do disco (`file://`); separar em arquivos não traz ganho real, e a estrutura preferida é pensada para Python. Reavaliar se o código crescer muito.
