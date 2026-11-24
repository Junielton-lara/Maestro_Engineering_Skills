---
name: project-foundation
description: >-
  Bootstraps a consistent engineering foundation for a new repository before
  feature work: purpose, stack, architecture, directories, FE/BE/DB/auth/env/
  security/components/responsiveness/tests/docs. Use after Prompt Master or for
  greenfield setup. Do not force one architecture on every product or start
  coding features before the foundation is defined and recorded.
metadata:
  framework: maestro-engineering-skills
  category: core
  version: "1.1.0"
---

# Project Foundation

## Objetivo

Antes de funcionalidades, estabelecer a **fundação técnica** do repositório: decisões mínimas, estrutura e padrões — adaptáveis à stack do produto, alinhadas a `MAESTRO_ENGINEERING_STANDARDS.md`.

## Quando ativar

- Greenfield após Prompt Master (ou spec equivalente).
- Repo vazio / “iniciar projeto”.
- Etapa foundation de `autonomous-project-builder`.

## Quando NÃO ativar

- Projeto já estruturado — usar `.maestro` + skills de domínio.
- Hotfix / feature pontual.

## Contexto técnico necessário

- Prompt Master ou objetivos + restrições.
- Preferências de hosting/stack do usuário.
- `MAESTRO_ENGINEERING_STANDARDS.md`.
- Template Living Knowledge.

## Regras obrigatórias

1. Entender finalidade do produto **antes** de pastas/código.
2. Stack **adequada** — justificar; não clonar Staltek/outro produto por padrão.
3. Definir arquitetura e limites de módulos.
4. Planejar estrutura de diretórios (FE/BE/mono conforme decisão).
5. Padrões FE (tokens, kit, mobile-first) e BE (validação, erros, authz).
6. Organização do banco + migrations.
7. Estratégia de autenticação/autorização.
8. Ambientes (`.env.example` sem segredos) e segurança baseline.
9. Padrões de componentes e responsividade.
10. Estratégia de testes e documentação mínima.
11. Bootstrap `.maestro/` a partir de `templates/living-project-knowledge/` (no workspace Maestro: `python scripts/new-project.py <slug>` já cria `projects/<slug>/` com `.maestro/`). Decisões vão para `.maestro/ARCHITECTURE.md`, `.maestro/DATABASE.md` e `.maestro/technical-decisions.md`.
12. Sem push/deploy/prod sem autorização.
13. Não inventar módulos de negócio nesta fase — só fundação.

## Processo de execução

Checklist obrigatório (completar ou N/A justificado):

1. Finalidade e MVP (link/resumo do Prompt Master).
2. Stack FE/BE/DB/infra + tradeoffs.
3. Arquitetura (modular monolito, BFF, etc.).
4. Árvore de diretórios inicial.
5. Padrões FE (tokens, shell, forms).
6. Padrões BE (camadas, ValidationPipe/equivalente, erros).
7. Schema inicial / ferramenta de migration.
8. Auth (sessão/JWT/cookies) + roles.
9. Env: local / staging / prod (placeholders).
10. Segurança: secrets, HTTPS, CORS, tenant se SaaS.
11. Componentes base e responsividade.
12. Testes: comandos + P0 futuros.
13. Docs: README esqueleto + `.maestro` bootstrap.
14. Apresentar fundação ao usuário (resumo curto); em modo automatic do `autonomous-project-builder` seguir direto para o desenvolvimento (`maestro-orchestrator` → `development-agent`), senão aguardar OK.
15. Fundação **executável**: dependências instaladas, app sobe localmente e o primeiro teste de cada app passa (saída real).

### Saída esperada

- Árvore de pastas definida e criada (em modo assisted, após OK do usuário).
- README inicial + `.env.example`.
- `.maestro/PROJECT_CONTEXT.md` preenchido com fatos.
- Lista de próximas fases (V1).

## Boas práticas

- Preferir monorepo simples ou dois pacotes claros se FE/BE separados.
- Copiar padrões Maestro (estados UI, paginação, tenant) como **princípios**, não código proprietário.
- Templates: `templates/frontend-structure.md`, `templates/backend-structure.md`.

## Erros comuns

- Gerar CRUD completo na foundation.
- Fixar stack sem justificativa nem ADR, ou contra restrição do usuário (defaults de `autonomous-project-builder/stack-defaults.md` registrados em ADR são válidos).
- Commitar `.env` real.
- Pular `.maestro` e perder Living Knowledge.

## Exemplos práticos

**SaaS B2B:** modular monolito API + SPA; Postgres; JWT+refresh; `.maestro` com tenant isolation.

**Landing + form:** FE estático/hosting simples; API mínima; sem multi-tenant.

## Critérios de qualidade

- Decisões documentadas e justificadas.
- Estrutura pronta para a fase 1 do Prompt Master.
- Standards consultados.

## Checklist de validação

- [ ] 15 pontos do processo cobertos ou N/A
- [ ] Stack justificada
- [ ] `.maestro` bootstrap
- [ ] `.env.example` sem segredos
- [ ] Sem features de negócio prematuras
- [ ] Pronto para development-agent

## Skills relacionadas

- `autonomous-project-builder`, `prompt-master-generator`, `software-architecture`, `maestro-core`
- `MAESTRO_ENGINEERING_STANDARDS.md`
- `knowledge-agent`, `environment-configuration`
