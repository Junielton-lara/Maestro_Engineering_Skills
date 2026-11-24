# Changelog

Todas as mudanças notáveis deste repositório.

## Unreleased

### Added — Shell B2B estilo +Gestor

- Skill global `saas-app-shell`: sidebar, topbar, dashboard KPI, Inter, tokens navy/azul (referência tanamao/+Gestor).
- `design-system`, `frontend-engineering`, `mobile-first` e `stack-defaults` alinhados a esse padrão para apps com login.
- Projeto exemplo `projects/valida-pacientes/` (login de médico + validação de lista).

### Added — Ambiente de desenvolvimento autônomo

- Workspace `projects/<slug>/` para produtos isolados + `scripts/new-project.py` (criar/listar) + `templates/project/`.
- `AGENTS.md` e `CLAUDE.md` na raiz (roteamento sempre carregado); `AGENTS.md`/`CLAUDE.md` por projeto.
- Subagentes reais em `agents/` (`maestro-frontend-developer`, `maestro-backend-developer`, `maestro-qa`, `maestro-code-reviewer`, `maestro-security-reviewer`), sincronizados em `.cursor/agents` e `.claude/agents`.
- `.maestro/PRODUCT_SPECIFICATION.md` e seção “Estado atual” em `PROJECT_CONTEXT.md`.
- `skills/autonomous-project-builder/stack-defaults.md` (matriz de decisão de stack).
- `docs/autonomous-development.md`.

### Changed — Ambiente de desenvolvimento autônomo

- `autonomous-project-builder` 2.0: modo automatic por padrão, 8 fases, autonomia técnica com ADR e condições de parada explícitas.
- `maestro-core`, `maestro-orchestrator` (papéis → skills/subagentes, paralelo × sequencial), `project-foundation`, `prompt-master-generator`, `knowledge-agent`, `documentation-agent`, `development-agent`, `git-agent` cientes do workspace.
- Living Knowledge: `knowledge/architecture.md` → `ARCHITECTURE.md`, `knowledge/database-map.md` → `DATABASE.md`, `knowledge/technical-decisions.md` → `technical-decisions.md` (raiz do `.maestro/`).
- `sync-skills` também sincroniza `agents/`; `validate-skills` valida agentes e arquivos do workspace.

### Added

- Ecossistema de agentes: `maestro-orchestrator`, `development-agent`, `code-review-agent`, `qa-agent`, `documentation-agent`, `git-agent`, `knowledge-agent`, `infrastructure-agent`.
- Token efficiency: `maestro-token-efficiency` + skills complementares.
- Living Project Knowledge: template `templates/living-project-knowledge/` e scaffold `.maestro/`.
- `project-foundation` e `autonomous-project-builder`.
- `MAESTRO_ENGINEERING_STANDARDS.md`.
- Templates de estrutura FE/BE, componentes, páginas e publish checklist.
- `CONTRIBUTING.md` e este `CHANGELOG.md`.
- Biblioteca inicial de Skills de engenharia (FE, BE, qualidade, infra, docs).

### Changed

- `maestro-core` passa a integrar tokens contínuos, agentes, foundation e autonomous builder.
- `prompt-master-generator` exige arquitetura específica por domínio.

### Security

- `.gitignore` cobre `.env`, chaves e artefatos comuns.
- Política: sem segredos em Skills/docs.

## Notas

- Versão inicial pré-release; tags semânticas a definir no primeiro release GitHub.
