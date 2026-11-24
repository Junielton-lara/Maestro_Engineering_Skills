"""Regenerate the scaffold files of templates/living-project-knowledge.

PRODUCT_SPECIFICATION.md, ARCHITECTURE.md, DATABASE.md, technical-decisions.md and
README.md are edited directly in the template and are not written by this script.
"""

from pathlib import Path

base = Path("templates/living-project-knowledge")

(base / "PROJECT_CONTEXT.md").write_text(
    """# Project Context

> Preencher com fatos observados. Sem segredos.

## Identidade

| Campo | Valor |
|-------|-------|
| Nome do produto | |
| Tipo | (SaaS / interno / mobile-web / …) |
| Repositório | |
| Owners | |

## Stack observada

| Camada | Tecnologia | Evidência (path) |
|--------|------------|------------------|
| Frontend | | |
| Backend | | |
| Banco | | |
| Auth | | |
| Deploy | | |

## Módulos principais

| Módulo | Responsabilidade | Path |
|--------|------------------|------|
| | | |

## Multi-tenancy / isolation

- Estratégia:
- Onde é enforced:

## Convenções críticas

- Branches / PRs:
- Testes obrigatórios:
- UI kit / tokens:

## Estado atual (retomada entre sessões)

| Campo | Valor |
|-------|-------|
| Fase do fluxo | (1 Discovery … 8 Entrega) |
| Último entregável validado | |
| Próximo passo | |
| Bloqueios / perguntas abertas | |

## Fora de escopo deste knowledge

-
""",
    encoding="utf-8",
)

(base / "skills" / "SKILL.md").write_text(
    """---
name: project-local-skills-index
description: >-
  Index of this project's local Maestro skills under .maestro/skills. Read first
  to choose which local skill to open. Do not treat this as global Maestro catalog.
---

# Skills locais do projeto

Leia apenas a skill da área afetada. Atualize via `knowledge-agent`.

| Skill | Quando usar |
|-------|-------------|
| `business-rules` | Regras de negócio e estados |
| `architecture` | Limites, módulos, decisões |
| `database` | Schema, migrations, índices |
| `frontend` | Padrões de UI deste produto |
| `backend` | Padrões de API/services deste produto |
| `integrations` | Webhooks, gateways, terceiros |

Skills de domínio adicionais (ex.: `order-state-machine`) ficam em subpastas irmãs quando justificadas.
""",
    encoding="utf-8",
)


def area_skill(name: str, title: str, focus: str) -> str:
    return f"""---
name: {name}
description: >-
  Project-local {title} knowledge for this application. Use when working on
  related features in this repo. Do not use as a global Maestro substitute.
---

# {title} (local)

## Objetivo

Capturar {focus} **deste projeto**, com evidência em paths.

## Contexto específico

- Produto:
- Módulos:

## Regras / padrões (com evidência)

1. Regra — path — notas

## Módulos envolvidos

| Módulo | Path |
|--------|------|

## Arquivos e componentes relevantes

-
-

## Padrões de implementação

- Seguir módulo vizinho em:
- Evitar:

## Dependências

- Internas:
- Externas:

## Comportamentos esperados

-

## Erros a evitar

-

## Critérios de validação

- [ ] Alteração respeita regras acima
- [ ] Paths de evidência ainda válidos
- [ ] Sem segredos neste arquivo

## Atualização

Fonte: código/testes/decisão confirmada. Changelog: `../../history/knowledge-changelog.md`.
"""


areas = {
    "business-rules": ("business-rules", "Business Rules", "regras de negócio, estados e invariantes"),
    "architecture": ("architecture", "Architecture", "limites de módulos, fluxos e ADRs locais"),
    "database": ("database", "Database", "modelo de dados, migrations e isolamento"),
    "frontend": ("frontend", "Frontend", "shell, componentes e padrões de UI do produto"),
    "backend": ("backend", "Backend", "API, services, authz e erros do produto"),
    "integrations": ("integrations", "Integrations", "integrações externas e contratos"),
}

for folder, (n, t, f) in areas.items():
    (base / "skills" / folder / "SKILL.md").write_text(area_skill(n, t, f), encoding="utf-8")

knowledge = {
    "business-rules.md": """# Business rules

| ID | Regra | Onde enforced | Teste |
|----|-------|---------------|-------|
| BR-01 | | | |
""",
    "api-map.md": """# API map

Contrato entre frontend e backend (definido na Fase 3, mantido em sincronia com o código). Se houver OpenAPI gerado, linkar e manter aqui só o resumo.

| Method | Path | Auth / perfis | Request (body/query) | Response | Erros | Regras (BR) |
|--------|------|---------------|----------------------|----------|-------|-------------|
""",
    "integrations.md": """# Integrations

| Sistema | Direção | Auth | Path código |
|---------|---------|------|-------------|
""",
    "project-conventions.md": """# Project conventions

## Código

-

## UI

-

## Git / PR

-

## Proibido

-
""",
}

for name, body in knowledge.items():
    (base / "knowledge" / name).write_text(body, encoding="utf-8")

(base / "history" / "knowledge-changelog.md").write_text(
    """# Knowledge changelog

| Data | Mudança | Motivo | Evidência | Autor |
|------|---------|--------|-----------|-------|
| YYYY-MM-DD | bootstrap `.maestro` | template inicial | — | |
""",
    encoding="utf-8",
)

print("template written OK")
