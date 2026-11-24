# Claude Code — Maestro Engineering Skills

Skills do projeto em `.claude/skills/<nome>/SKILL.md`.

## Descoberta

Claude Code usa o frontmatter (`description`, opcionalmente `when_to_use`) para decidir invocação. O conteúdo completo carrega quando a skill é ativada.

Campos extras específicos do Claude Code (`allowed-tools`, `disable-model-invocation`, etc.) podem ser adicionados **somente** se necessário — preferir o frontmatter compartilhado Agent Skills para manter sync com Cursor.

## Orquestração

Inicie com `maestro-core` em pedidos amplos. Entregas multi-etapa: `maestro-orchestrator` (papéis sequenciais ou subagentes se disponíveis). Disciplina permanente: `maestro-token-efficiency`.

Living Knowledge do produto: `projects/<slug>/.maestro/` (ou `.maestro/` na raiz de um app externo). Invocação manual via `/nome-da-skill` quando no menu.

Memória: `CLAUDE.md` (raiz e por projeto) importa `AGENTS.md`. Subagentes Maestro em `.claude/agents/` (fonte: `../agents/`); o campo `tools` dos reviewers restringe a leitura — **não validado em execução real** no Claude Code.

## Sincronização

Fonte canônica: `../skills/`.

```bash
python scripts/sync-skills.py
```

Não edite `.claude/skills/` ou `.claude/agents/` diretamente.

## Templates

Artefatos em `../templates/`.
