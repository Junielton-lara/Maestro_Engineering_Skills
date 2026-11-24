# Living Project Knowledge (`.maestro/`)

Conhecimento **vivo e específico deste projeto**. Copie esta pasta para a raiz do app como `.maestro/`.

## Para que serve

- Evitar que agentes redescubram arquitetura, regras e convenções a cada tarefa.
- Separar conhecimento **local** (aqui) de Skills **globais** do Maestro (`skills/` da biblioteca).
- Alimentar `maestro-orchestrator`, `development-agent` e `knowledge-agent`.

## Como usar

1. Copiar `templates/living-project-knowledge/` → `.maestro/` no repositório do produto.
2. Preencher `PROJECT_CONTEXT.md` com fatos observados.
3. Atualizar `knowledge/*` e `skills/*` via `knowledge-agent` após entregas relevantes.
4. Registrar mudanças em `history/knowledge-changelog.md`.

## Regras

- Sem senhas, tokens, PII ou connection strings reais.
- Não duplicar Skills globais — referenciar pelo nome.
- Atualizar só com evidência (código, testes, decisão confirmada).
- Não criar uma skill local por arquivo trivial.

## Ordem de leitura sugerida (agentes)

1. `PROJECT_CONTEXT.md`
2. `skills/SKILL.md` (índice)
3. Skill local da área tocada
4. `knowledge/*` sob demanda
