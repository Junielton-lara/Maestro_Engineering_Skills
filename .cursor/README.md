# Cursor — Maestro Engineering Skills

Skills do projeto em `.cursor/skills/<nome>/SKILL.md`.

## Descoberta

O Cursor carrega `name` + `description` para decidir quando aplicar uma skill (progressive disclosure). O corpo do `SKILL.md` é lido sob demanda.

## Orquestração

Para tarefas amplas, peça **Maestro Core** (`maestro-core`). Entregas multi-etapa: `maestro-orchestrator` + agentes de papel. Economia contínua: `maestro-token-efficiency`.

Conhecimento do **produto**: `projects/<slug>/.maestro/` (ou `.maestro/` na raiz de um app externo) — não confundir com esta biblioteca global.

Instruções sempre ativas: `AGENTS.md` na raiz e `projects/<slug>/AGENTS.md` (aplicado ao trabalhar em arquivos do projeto).

Subagentes Maestro em `.cursor/agents/` (fonte: `../agents/`): FE/BE podem rodar em paralelo em paths disjuntos; reviewers são `readonly`. Escrita no mesmo arquivo permanece serial.

## Sincronização

Fonte canônica: `../skills/`.

```bash
python scripts/sync-skills.py
```

Não edite cópias em `.cursor/skills/` ou `.cursor/agents/` — altere `skills/` / `agents/` e sincronize.

## Templates

Artefatos em `../templates/` (Prompt Master, arquitetura, deploy, etc.).
