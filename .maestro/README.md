# Living Project Knowledge (`.maestro/`)

> **Não é um projeto.** Este `.maestro/` na raiz do Maestro é só um scaffold de exemplo da biblioteca (cópia de `templates/living-project-knowledge/`). O conhecimento de cada produto fica em `projects/<slug>/.maestro/`.

Conhecimento **vivo e específico deste projeto**. Copie esta pasta para a raiz do app como `.maestro/`
(projetos criados em `projects/` pelo Maestro recebem esta pasta via `scripts/new-project.py`).

## Para que serve

- Evitar que agentes redescubram arquitetura, regras e convenções a cada tarefa.
- Separar conhecimento **local** (aqui) de Skills **globais** do Maestro (`skills/` da biblioteca).
- Alimentar `maestro-orchestrator`, `development-agent` e `knowledge-agent`.

## Estrutura

| Arquivo | Conteúdo |
|---------|----------|
| `PROJECT_CONTEXT.md` | Identidade, stack observada, módulos, estado atual |
| `PRODUCT_SPECIFICATION.md` | Produto: pedido original, requisitos, regras, fluxos, aceite |
| `ARCHITECTURE.md` | Stack, estilo, limites, FE/BE/API/auth/segurança/testes/infra |
| `DATABASE.md` | Modelo de dados, migrations, índices, isolamento |
| `technical-decisions.md` | ADRs leves (quem decidiu e por quê) |
| `knowledge/*` | Mapas de evidência: API, regras→código, integrações, convenções |
| `skills/*` | Skills locais (não descobertas automaticamente pela IDE; ler pelo índice) |
| `history/knowledge-changelog.md` | Registro de mudanças deste conhecimento |

## Como usar

1. Copiar `templates/living-project-knowledge/` → `.maestro/` no repositório do produto.
2. Preencher `PROJECT_CONTEXT.md` com fatos observados.
3. Atualizar documentos, `knowledge/*` e `skills/*` via `knowledge-agent` após entregas relevantes.
4. Registrar mudanças em `history/knowledge-changelog.md`.

## Regras

- Sem senhas, tokens, PII ou connection strings reais.
- Não duplicar Skills globais — referenciar pelo nome.
- Atualizar só com evidência (código, testes, decisão confirmada).
- Não criar uma skill local por arquivo trivial.

## Ordem de leitura sugerida (agentes)

1. `PROJECT_CONTEXT.md` (inclui estado atual)
2. `skills/SKILL.md` (índice)
3. Skill local da área tocada
4. `PRODUCT_SPECIFICATION.md` / `ARCHITECTURE.md` / `DATABASE.md` / `knowledge/*` sob demanda
