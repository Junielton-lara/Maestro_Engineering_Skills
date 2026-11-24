# Claude Code — Maestro Engineering Skills

Skills do projeto em `.claude/skills/<nome>/SKILL.md`.

## Descoberta

Claude Code usa o frontmatter (`description`, opcionalmente `when_to_use`) para decidir invocação. O conteúdo completo carrega quando a skill é ativada.

Campos extras específicos do Claude Code (`allowed-tools`, `disable-model-invocation`, etc.) podem ser adicionados **somente** se necessário — preferir o frontmatter compartilhado Agent Skills para manter sync com Cursor.

## Orquestração

Inicie com `maestro-core` em pedidos amplos. Entregas multi-etapa: `maestro-orchestrator` (papéis sequenciais ou subagentes se disponíveis). Disciplina permanente: `maestro-token-efficiency`.

Living Knowledge do produto: `.maestro/` na raiz do app. Invocação manual via `/nome-da-skill` quando no menu.

## Sincronização

Fonte canônica: `../skills/`.

```bash
python scripts/sync-skills.py
```

Não edite `.claude/skills/` diretamente.

## Templates

Artefatos em `../templates/`.
