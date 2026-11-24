# Contribuindo para o Maestro Engineering Skills

Obrigado por contribuir. Este repositório é uma **biblioteca de Skills** (Agent Skills), não uma aplicação de produto.

## Princípios

1. Preserve conhecimento existente; corrija com evidência.
2. Skills objetivas (&lt; 500 linhas no `SKILL.md`); detalhes em arquivos irmãos sob demanda.
3. Não duplicar: referencie Skills relacionadas.
4. Sem segredos, PII ou paths privados de máquinas locais.
5. Global (`skills/`) ≠ local (`.maestro/` de um produto).
6. Não inventar runtime de agentes além do que IDEs suportam (Skills + papéis / Task).

## Fluxo

1. Edite a **fonte canônica** em `skills/<nome>/SKILL.md` (ou templates/docs).
2. Atualize `scripts/validate-skills.py` → `EXPECTED` se for skill nova.
3. Rode:

```bash
python scripts/sync-skills.py
python scripts/validate-skills.py
```

4. Atualize `README.md` / `CHANGELOG.md` se a mudança for visível.
5. Abra PR descritivo (o maintainer fará o merge).

## Nova Skill global

- `name` = pasta (kebab-case).
- `description` com WHAT + WHEN (+ anti-trigger).
- Seções padrão Maestro (Objetivo … Skills relacionadas).
- `metadata.framework: maestro-engineering-skills`
- Atualizar roteamento em `maestro-core` se for domínio novo.

## Nova Skill local (produto)

- Não vai neste repo (exceto exemplos em `templates/living-project-knowledge/`).
- Criar em `.maestro/skills/` do app via `knowledge-agent`.

## Ambientes

| Pasta | Uso |
|-------|-----|
| `skills/` | Fonte da verdade |
| `.cursor/skills/` | Cursor (gerada por sync) |
| `.claude/skills/` | Claude Code (gerada por sync) |

Não edite `.cursor` / `.claude` diretamente.

## Licença

Se `LICENSE` não existir no repositório, **não assuma** uma licença — alinhe com o maintainer antes de redistribuir.
