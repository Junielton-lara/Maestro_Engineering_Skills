---
name: autonomous-project-builder
description: >-
  Builds a complete software product from a developer's idea inside the Maestro
  workspace (projects/<slug>/): discovery, product specification, architecture,
  foundation, module-by-module development, QA, docs, knowledge and V1 delivery.
  Takes technical decisions autonomously and records them. Use when the user
  describes a system/app to create ("Quero criar um sistema para...") or asks to
  continue a project in projects/. Do not use for small fixes; never push,
  deploy, spend money or run destructive operations without explicit approval.
metadata:
  framework: maestro-engineering-skills
  category: core
  version: "2.0.0"
---

# Autonomous Project Builder

## Objetivo

Conduzir um software da **ideia à V1 funcional**, dentro de `projects/<slug>/`, como Tech Lead + PM + Arquiteto: interpretar a ideia, decidir a engenharia, registrar decisões e implementar com comportamento real, persistência, validação e testes — sem exigir aprovação para cada decisão técnica.

## Quando ativar

- “Quero criar um sistema/app/plataforma para…”, greenfield, “construa a V1”.
- “Continue o projeto X” / trabalho em `projects/<slug>/` que ainda não chegou à V1.

## Quando NÃO ativar

- Bug/feature pontual em projeto que já passou da V1 → `maestro-core` / `development-agent`.
- Só especificação → `prompt-master-generator`; só foundation → `project-foundation`.
- Manutenção da biblioteca Maestro (`skills/`, `templates/`) → `CONTRIBUTING.md`.

## Contexto técnico necessário

- Ideia do usuário (texto literal) e restrições explícitas (stack, prazo, hosting).
- `python scripts/new-project.py --list` (projetos existentes e fase).
- `stack-defaults.md` (nesta pasta) para decisões de stack.
- Toolchain local real (`node`, `python`, `docker`, gerenciador de pacotes) — detectar, não supor.
- `maestro-token-efficiency` sempre ativo.

## Modos de operação

| Modo | Comportamento |
|------|----------------|
| **automatic** (padrão) | Decide e executa todas as fases; comunica decisões; para só nas condições de parada. |
| **assisted** | Igual, mas confirma stack/arquitetura e cada módulo antes de seguir. Só se o usuário pedir. |
| **planning** | Fases 1–3 (documentos), sem código. Só se o usuário pedir. |

## Regras obrigatórias

1. **Preservar a ideia original**: copiar o pedido literal em `PRODUCT_SPECIFICATION.md` §1; todo item pedido vira requisito com origem `pedido`. Pode expandir (origem `maestro`), nunca descartar — adiar só com motivo registrado.
2. **Autonomia técnica**: stack, arquitetura, banco, libs, módulos, complementos, design system, padrões, testes e infra são decididos pelo Maestro com base nas Skills e em `stack-defaults.md`, e registrados como ADR (`Decidido por: maestro`). Restrição explícita do usuário prevalece sobre defaults.
3. **Condições de parada** (perguntar, 1 pergunta objetiva com recomendação): informação indispensável que não pode ser inferida; dados sensíveis reais/produção; custo financeiro (serviço pago, domínio, API paga); credenciais ou autorização de terceiros; ação irreversível/destrutiva; push, deploy, publicação. Fora disso, **inferir, registrar em §10 “Premissas” e seguir**.
4. **Isolamento**: todo código e conhecimento do produto em `projects/<slug>/`. Não alterar Skills globais, `templates/` ou outros projetos. Toda menção a `.maestro/` nas Skills = `projects/<slug>/.maestro/` (o `.maestro/` da raiz é scaffold da biblioteca).
5. **Ordem de consulta** antes de cada etapa: Skills globais necessárias → `.maestro/PROJECT_CONTEXT.md` → `.maestro/skills/` relevante → código existente.
6. Foundation antes de features; arquitetura registrada antes de código.
7. **Sem telas demonstrativas**: cada funcionalidade tem API real, persistência, validação server-side, estados de UI e teste.
8. Nunca afirmar teste/build executado sem a saída real.
9. Retomada: ao fim de cada etapa, atualizar “Estado atual” em `PROJECT_CONTEXT.md` e status em `PRODUCT_SPECIFICATION.md` §4.
10. Skills mínimas por etapa: abrir as **obrigatórias** da tabela de fases; as marcadas “se necessário” só quando o caso exigir. Subagentes só com benefício real (ver `maestro-orchestrator`); se os `maestro-*` não estiverem disponíveis na IDE/sessão, o agente principal executa o papel em sequência seguindo a mesma skill.
11. V1 = escopo V1 da spec, não o roadmap inteiro.
12. Isolamento de dados por padrão: organização única com dono/perfil por registro; multi-tenant só se o pedido citar várias empresas/unidades independentes ou SaaS.
13. Dados sensíveis (saúde, financeiro, menores): mínimo necessário na V1; funcionalidades de alto risco (ex.: prontuário clínico completo) ficam pós-V1 com nota LGPD, salvo pedido explícito.

## Processo de execução

### 0. Identificar o projeto

- Rodar `python scripts/new-project.py --list`.
- Pedido cita projeto existente ou arquivo aberto está em `projects/<slug>/` → **continuar** a partir de “Estado atual”.
- Ideia nova → escolher slug kebab-case curto e nome provisório → `python scripts/new-project.py <slug> --name "<Nome>"`.
- Anunciar em ≤ 5 linhas: projeto, modo, próxima fase.

### Fases, donos e saídas

| Fase | Obrigatórias | Se necessário | Saída (em `projects/<slug>/`) |
|------|--------------|---------------|-------------------------------|
| 1 Product Discovery | `product-discovery` | — | Spec §1, §3–5 (rascunho) e §10 |
| 2 Product Definition | `prompt-master-generator` | `prompt-optimization` | `.maestro/PRODUCT_SPECIFICATION.md` completo |
| 3 Arquitetura | `software-architecture`, `stack-defaults.md` | `database-postgresql`, `authentication-authorization`, `security-engineering`, `multi-tenancy` | `.maestro/ARCHITECTURE.md`, `.maestro/DATABASE.md`, `.maestro/technical-decisions.md`, contrato em `.maestro/knowledge/api-map.md` |
| 4 Foundation | `project-foundation` | `environment-configuration`, `design-system`, `error-handling`, `observability` | Apps criados, deps, `.env.example`, migrations iniciais, auth, componentes-base, testes iniciais passando |
| 5 Desenvolvimento | `maestro-orchestrator`, `development-agent` | skills de domínio FE/BE; subagentes `maestro-backend-developer` + `maestro-frontend-developer` | Módulos V1 completos (fatias verticais) |
| 6 QA | `qa-agent` (`maestro-qa`) | `code-review-agent` (`maestro-code-reviewer`), `security-engineering` (`maestro-security-reviewer`) | Testes executados, achados corrigidos |
| 7 Docs + Knowledge | `documentation-agent`, `knowledge-agent` | — | README, `docs/`, `.maestro/` atualizados; skills locais se justificadas |
| 8 Entrega | `git-agent` | `infrastructure-agent` (só se pedido) | Relatório de entrega; commit só se autorizado |

### Fase 1–2 — Produto

- Extrair: problema, público, perfis, módulos, funcionalidades pedidas, regras implícitas do domínio, fluxos.
- Sugerir complementos de alto valor e baixo risco (auth, auditoria, busca, filtros, dashboard) como origem `maestro`.
- Preencher todos os campos da spec; critérios de aceite **verificáveis** (CA-xx) ligados a fluxos.
- Domínios com dados sensíveis (saúde, financeiro, menores): registrar LGPD em premissas e arquitetura; seguir com dados fictícios.

### Fase 3 — Arquitetura

- Detectar toolchain; escolher stack por `stack-defaults.md`; registrar ADR por decisão relevante (stack, estilo, banco, auth, layout de pastas).
- Definir contrato de API inicial em `.maestro/knowledge/api-map.md` (habilita FE/BE em paralelo).
- Definir entidades, relações e isolamento em `DATABASE.md`.

### Fase 4 — Foundation

- Criar `frontend/`, `backend/`, `database/`, `tests/`, `docs/` conforme a arquitetura (separar FE/BE quando a arquitetura exigir).
- Instalar dependências (gerenciador escolhido), `.env.example` sem segredos, scripts `dev`/`test`/`build`/`lint`.
- Base: tratamento de erro padronizado, logs, conexão + migrations, auth funcional, layout/shell + tokens, primeiro teste passando em cada app.
- Seguir templates `templates/frontend-structure.md`, `templates/backend-structure.md`, `templates/components-organization.md` como princípios.

### Fase 5 — Desenvolvimento por módulos

Para cada módulo, em ordem de dependência:
1. Schema/migration → service + regras (BR-xx) → endpoints + validação + authz → testes de API.
2. Telas: listagem (paginação, filtros, empty/loading/error), formulário (validação espelhada), detalhe, ações destrutivas com confirmação; responsivo.
3. Executar testes/lint/build do módulo; corrigir; marcar RF-xx `implementado`.
4. Atualizar “Estado atual”.

Paralelismo: com contrato definido, backend e frontend do mesmo módulo podem ir a subagentes distintos (paths disjuntos). Integração e validação final são sequenciais.

### Fase 6 — QA

Proporcional ao risco: sempre testes automatizados + verificação dos CA-xx; review de código e segurança antes da entrega V1 e após mudanças de auth/permissões/dados. Reviewers e QA só reportam; quem corrige Critical/High (antes de entregar) é o agente principal ou o subagente de desenvolvimento da área, seguido de novo teste.

### Fase 7 — Documentação e conhecimento

- `documentation-agent`: README do projeto (pré-requisitos, `.env`, como executar FE/BE, testes, limitações) e `docs/` se houver contrato público.
- `knowledge-agent`: conferir `ARCHITECTURE.md`/`DATABASE.md` com o código real, `knowledge/*` com evidências, skills locais só se o conhecimento for comprovado e reutilizável; changelog.
- Promoção para Skills globais: apenas sugerir no relatório.

### Fase 8 — Relatório de entrega

- Escopo: RF-xx implementados / adiados (motivo).
- CA-xx: validado / não verificado (por quê).
- Testes executados (comandos + resultado real).
- Como executar FE/BE, configuração (`.env`), limitações conhecidas, próximos passos.
- Git: propor commit (escopo `projects/<slug>/`); push/deploy só com autorização.

## Boas práticas

- Comunicar decisões importantes em bullets curtos; detalhes ficam nos documentos.
- Fatias verticais pequenas e verificáveis; rodar testes a cada módulo, não só no fim.
- Preferir bibliotecas maduras já citadas em `stack-defaults.md` a soluções próprias.
- Seeds com dados fictícios para o fluxo principal ser demonstrável de verdade.

## Erros comuns

- Pedir aprovação para cada escolha técnica (viola autonomia).
- Perder requisitos do pedido original ao “simplificar”.
- Criar telas com dados mockados sem API/persistência.
- Codar antes de `ARCHITECTURE.md`; criar o projeto fora de `projects/`.
- Mesma stack pesada para tudo (landing estática ≠ SaaS).
- Push/deploy automático.

## Exemplos práticos

**“Quero criar um sistema para gerenciar médicos, pacientes e atendimentos.”** → slug `gestao-clinica`; perfis admin/recepção/médico; módulos auth, médicos, pacientes, agenda/atendimentos (pedidos) + busca/filtros, auditoria e dashboard (complementos); prontuário clínico completo pós-V1 com nota LGPD; BR de conflito de horário e acesso de médico só aos próprios atendimentos; organização única; stack padrão web B2B; desenvolvimento módulo a módulo; QA + security review; relatório.

**“Continue o projeto gestao-clinica”** → ler `PROJECT_CONTEXT.md` “Estado atual” → retomar no próximo módulo.

**planning:** “só planeje um marketplace” → fases 1–3, para.

## Critérios de qualidade

- Todo requisito do pedido rastreável em §4.
- Decisões técnicas registradas com alternativa e motivo.
- V1 executável localmente seguindo só o README.
- Testes reais executados; resultado reportado com honestidade.

## Checklist de validação

- [ ] Projeto identificado/criado em `projects/<slug>/`
- [ ] Pedido original literal + rastreabilidade completa
- [ ] PRODUCT_SPECIFICATION, ARCHITECTURE, DATABASE, technical-decisions preenchidos
- [ ] Foundation com testes iniciais passando
- [ ] Módulos V1 com API + persistência + validação + UI + testes
- [ ] QA/review/security proporcionais; Critical/High resolvidos
- [ ] README (como executar/configurar) + `.maestro` + Estado atual atualizados
- [ ] Sem push/deploy/custo/destrutivo sem autorização

## Skills relacionadas

- `maestro-core`, `maestro-orchestrator`, `product-discovery`, `prompt-master-generator`
- `software-architecture`, `project-foundation`, `development-agent`, `qa-agent`, `code-review-agent`, `security-engineering`, `documentation-agent`, `knowledge-agent`, `git-agent`
- `stack-defaults.md` · `MAESTRO_ENGINEERING_STANDARDS.md` · `docs/autonomous-development.md`
