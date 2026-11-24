# Cursor — Maestro Engineering Skills

Skills do projeto em `.cursor/skills/<nome>/SKILL.md`.

## Descoberta

O Cursor carrega `name` + `description` para decidir quando aplicar uma skill (progressive disclosure). O corpo do `SKILL.md` é lido sob demanda.

## Orquestração

Para tarefas amplas, peça **Maestro Core** (`maestro-core`). Entregas multi-etapa: `maestro-orchestrator` + agentes de papel. Economia contínua: `maestro-token-efficiency`.

Conhecimento do **produto** (se for um app): pasta `.maestro/` na raiz do app — não confundir com esta biblioteca global.

Subagentes Cursor (`Task`) podem executar papéis em paralelo para **leitura**; escrita no mesmo arquivo permanece serial.

## Sincronização

Fonte canônica: `../skills/`.

```bash
python scripts/sync-skills.py
```

Não edite cópias em `.cursor/skills/` — altere `skills/` e sincronize.

## Templates

Artefatos em `../templates/` (Prompt Master, arquitetura, deploy, etc.).
