---
name: project-planning
description: >-
  Builds phased delivery plans with milestones, risks, Definition of Done, and dependency order.
  Use when work spans multiple PRs, releases, or teams, or when sequencing architecture and
  implementation. Do not use for single-file fixes or when the user only needs ad-hoc coding.
metadata:
  framework: maestro-engineering-skills
  category: core
  version: "1.0.0"
---

# Project Planning

## Objetivo

Ordenar entregas em fases com marcos, riscos mitigados, Definition of Done (DoD) e dependências explícitas — conectando spec, arquitetura e execução.

## Quando ativar

- MVP ou feature grande pós `prompt-master-generator` / `software-architecture`.
- Refatoração multi-sprint.
- Coordenação FE/BE/infra com datas.
- Necessidade de reduzir risco por entregas incrementais.

## Quando NÃO ativar

- Hotfix único com teste já existente.
- Escopo de uma PR bem definido e sem dependências externas.

## Contexto técnico necessário

- Escopo MVP e fora de escopo.
- ADRs ou desenho de módulos (`software-architecture`).
- Capacidade da equipe, ambiente (staging/prod), datas críticas.

## Regras obrigatórias

1. **Fases entregam valor demonstrável** — não “só infraestrutura” por fases inteiras sem demo.
2. **Dependências em ordem topológica** — migrations antes de API; API antes de UI que consome.
3. Cada fase tem **DoD** verificável (testes, docs, deploy, aceite).
4. **Riscos** com probabilidade/impacto e mitigação concreta.
5. Buffer realista em integrações e aprovações legais/terceiros.
6. Sincronizar com `maestro-core` — não planejar trabalho paralelo que exige skills não carregadas.

## Processo de execução

1. **Decomposição** — épicos → entregáveis → tarefas (tamanho ≤ 1–2 dias ideal).
2. **Mapa de dependências** — grafo simples (A → B → C).
3. **Fases** — nome, objetivo, saídas, duração estimada.
4. **Marcos** — decisão go/no-go, demo, release.
5. **Riscos** — tabela risco / gatilho / mitigação / dono.
6. **DoD por fase** — funcional, qualidade, operação.
7. **Comunicação** — o que documentar em `technical-documentation` / `deployment-documentation`.

### Modelo de DoD (adaptar)

- Código revisado, testes passando no CI
- Contrato API/versionamento atualizado se mudou
- Feature flag ou rollback documentado
- Aceite da spec da fase atendido
- Sem secrets em repositório

## Boas práticas

- Primeira fase reduz **maior incerteza** (spike, POC de integração).
- WIP limitado; fechar fase antes de abrir próxima.
- Estimar em intervalos se incerteza alta (S/M/L).

## Erros comuns

- Cronograma sem dependências (FE bloqueado esperando API fictícia).
- DoD só “merge na main”.
- Ignorar homologação, migração de dados, treinamento.
- Paralelizar refactor profundo com feature freeze sem plano.

## Exemplos práticos

**Fase 1** — Auth + modelo User + deploy staging.  
**Fase 2** — CRUD principal + testes e2e happy path.  
**Fase 3** — Relatórios + otimização + hardening segurança.

**Risco** — API pagamento atrasada → mitigação: adapter mock + contrato congelado.

## Critérios de qualidade

- Qualquer dev entende ordem de execução sem reunião.
- Cada fase tem demo script de 2 minutos.
- Riscos top 3 com mitigação acionável.

## Checklist de validação

- [ ] Dependências desenhadas e sem ciclo ignorado
- [ ] DoD por fase
- [ ] Marcos com data ou ordem relativa
- [ ] Riscos e donos
- [ ] Ligação com fases da spec / Prompt Master
- [ ] Docs/deploy previstos na fase certa

## Skills relacionadas

- `maestro-core` — orquestração
- `product-discovery` — escopo MVP
- `prompt-master-generator` — fases de aceite na spec
- `software-architecture` — ordem de extração de módulos
- `technical-documentation` — marcos de documentação
- `deployment-documentation` — releases e rollback
- `project-handoff` — plano de transição ao final