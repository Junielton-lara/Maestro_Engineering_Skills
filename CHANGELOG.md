# Changelog

Todas as mudanças notáveis deste repositório.

## Unreleased

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
