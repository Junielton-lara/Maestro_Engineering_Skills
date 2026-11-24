---
name: ci-cd
description: >-
  Define pipelines com gates (lint, test, build), artefatos versionados e uso seguro de secrets de
  ambiente. Use when criar ou melhorar GitHub Actions/GitLab CI, deploy automatizado ou quality
  gates. Do not use when o escopo for só testes manuais (testing-qa) ou config de servidor (linux-
  server-management).
metadata:
  framework: maestro-engineering-skills
  category: infra
  version: "1.0.0"
---

# CI/CD

## Objetivo

Entregar mudanças com feedback rápido e confiável: pipeline reprodutível, gates que bloqueiam regressão óbvia, artefatos rastreáveis e segredos só em stores do CI.

## Quando ativar

- Novo repositório sem CI.
- PRs mergeados sem testes automáticos.
- Deploy manual error-prone.
- Necessidade de publicar imagem, bundle ou pacote versionado.

## Quando NÃO ativar

- Homologação funcional com stakeholders → `testing-qa`.
- Ajuste pontual de `.env` no servidor → `environment-configuration`.
- Hardening SSH na VPS → `linux-server-management`.

## Contexto técnico necessário

- Plataforma CI (GitHub Actions, GitLab, etc.) já em uso.
- Comandos locais oficiais: `lint`, `test`, `build`.
- Branch policy (main protegida?).
- Destino de deploy (Hostinger SSH, registry, PaaS).

## Regras obrigatórias

1. **Inspecionar** workflows existentes antes de duplicar jobs.
2. **CI falha** se lint/test/build falhar — sem `continue-on-error` em gates críticos.
3. **Secrets** só em settings do CI; nunca ecoar em logs.
4. **Cache** deps com chave de lockfile.
5. **Artefato** etiquetado com SHA do commit.
6. **Deploy produção** com confirmação ou branch/tag protegida conforme política do usuário.
7. **Sem** credenciais de produção em PRs de fork.

## Processo de execução

1. Mapear estágios: `install` → `lint` → `test` → `build` → `deploy` (opcional).
2. Matriz mínima de runtime (versão Node/Python do projeto).
3. Paralelizar jobs independentes.
4. Upload artefato (dist, imagem digest, tarball).
5. Deploy: ssh/rsync, compose pull, ou release API — alinhado a `hostinger-deployment`.
6. Pós-deploy smoke (curl health) quando possível.

### Gates recomendados

| Gate | Quando obrigatório |
|------|---------------------|
| Lint/format | sempre que existir no repo |
| Unit/integration tests | `automated-testing` existente |
| Typecheck | TS projects |
| Build | antes de deploy |
| Security audit | deps críticas (não bloquear sem política) |

## Boas práticas

- **Concurrency** cancelando runs antigos na mesma branch.
- **Reusable workflows** ou template interno para consistência.
- **Environments** GitHub com protection rules para prod.
- **OIDC** para cloud em vez de chave longa quando disponível.
- **Semantic versioning** ou calver em releases tagueadas.

## Erros comuns

- Instalar deps global sem lockfile pinado.
- Testes flaky sem retry cego infinito.
- Deploy na main de todo commit sem staging.
- Secret copiado para `env:` em log de debug.
- Job deploy sem `if: github.ref == 'refs/heads/main'`.

## Exemplos práticos

**Node:** `npm ci` → `npm run lint` → `npm test` → `npm run build` → artifact `dist/`.

**Docker:** build on tag → push `ghcr.io/org/app:${{ github.sha }}` → SSH compose pull on VPS.

**Hostinger:** job deploy com `appleboy/ssh-action` ou rsync + `pm2 reload` — chave em secret.

## Critérios de qualidade

- PR típico recebe feedback <15 min (meta ajustável).
- Pipeline reproduzível a partir de clone limpo.
- Artefato/deploy ligado a commit SHA.
- Segredos não aparecem em logs públicos.

## Checklist de validação

- [ ] Comandos batem com README/package scripts
- [ ] Lockfile commitado e usado no CI
- [ ] Secrets configurados no provedor CI
- [ ] Branch protection alinhada
- [ ] Deploy idempotente ou rollback documentado
- [ ] Smoke pós-deploy ou manual checklist referenciado

## Skills relacionadas

- `automated-testing` — suíte no pipeline
- `code-review` — qualidade antes do merge
- `environment-configuration` — vars por ambiente
- `hostinger-deployment` — destino SSH/VPS
- `docker-management` — build/push de imagem
- `observability` — notificar falha de pipeline
- `security-engineering` — permissões e segredos