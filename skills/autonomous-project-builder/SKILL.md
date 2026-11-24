---
name: autonomous-project-builder
description: >-
  Runs the end-to-end greenfield flow from idea to V1 delivery: discovery,
  Prompt Master, foundation, architecture, development, tests, review, docs,
  knowledge, handoff. Supports automatic, assisted, and planning-only modes.
  Use when building a new product from an idea. Do not use for small fixes; never
  run destructive/push/deploy without explicit approval.
metadata:
  framework: maestro-engineering-skills
  category: core
  version: "1.0.0"
---

# Autonomous Project Builder

## Objetivo

Conduzir a criação de um software do **conceito à V1**, orquestrando Skills/agentes na ordem certa, com modos **automático / assistido / planejamento**, respeitando decisões importantes e economia de tokens.

## Quando ativar

- “Quero criar um sistema…”, greenfield, “construa a V1”.
- Usuário pede fluxo completo ideia → entrega.

## Quando NÃO ativar

- Bug/feature em projeto existente → `maestro-core` / `development-agent`.
- Só especificação → `prompt-master-generator`.
- Só foundation → `project-foundation`.

## Contexto técnico necessário

- Ideia do usuário; restrições (prazo, stack, hosting).
- Modo desejado (perguntar se não dito).
- `maestro-orchestrator`, `maestro-token-efficiency`, Standards.

## Modos de operação

| Modo | Comportamento |
|------|----------------|
| **planning** | Só discovery + Prompt Master + plano de fases. Sem código. |
| **assisted** | Executa etapa a etapa; confirma decisões-chave (stack, auth, tenant, deploy). |
| **automatic** | Avança etapas sozinho **dentro do acordado**; ainda **para** para: ambiguidade de negócio, escolha de stack sem default seguro, secrets, push, deploy, destrutivo, produção. |

Default se omitido: **assisted**.

## Regras obrigatórias

1. Fluxo canônico (pular só com justificativa):

```text
IDEIA → DISCOVERY → PROMPT MASTER → PROJECT FOUNDATION → ARQUITETURA
→ DESENVOLVIMENTO → TESTES → CODE REVIEW → DOCUMENTAÇÃO
→ KNOWLEDGE UPDATE → ENTREGA V1
```

2. Prompt Master **específico do produto** — sem arquitetura única para todos.
3. Foundation antes de features.
4. Modo automatic **não** dispensa esclarecimentos bloqueantes.
5. Sem push/deploy/ credenciais / drop sem OK explícito.
6. Não ativar todos os agentes em toda etapa — mínimo necessário.
7. Consultar/criar `.maestro/` cedo; atualizar no fim.
8. Não afirmar testes sem evidência.
9. V1 = MVP do Prompt Master, não o roadmap inteiro.

## Processo de execução

### Entradas

- Ideia (texto); modo; restrições opcionais.

### Etapas e donos

| Etapa | Skill / agente |
|-------|----------------|
| Discovery | `product-discovery` |
| Spec | `prompt-master-generator` (+ `prompt-optimization`) |
| Foundation | `project-foundation` |
| Arquitetura | `software-architecture` |
| Dev | `development-agent` (+ domínio FE/BE) |
| Testes | `qa-agent` |
| Review | `code-review-agent` |
| Docs | `documentation-agent` |
| Knowledge | `knowledge-agent` |
| Entrega | `git-agent` (+ `infrastructure-agent` se deploy) |
| Coordenação | `maestro-orchestrator` |

### Gate de decisão (sempre)

Parar e perguntar (1 pergunta) se faltar: ator principal, MVP, multi-tenant sim/não, stack sem default aceitável, modelo de auth sensível.

### Saídas

- Prompt Master aprovado (ou em planning: só isso + plano).
- Repo com foundation + V1 implementada (assisted/automatic).
- `.maestro` atualizado.
- Checklist de entrega + pendências.
- Commit/push **somente** se autorizado.

## Boas práticas

- Anunciar modo + próxima etapa em ≤5 linhas.
- Após cada etapa: 3–6 bullets e gate “continuar?”. no assisted.
- Automatic: batchar micro-etapas óbvias; nunca batchar deploy.

## Erros comuns

- Codar antes do Prompt Master.
- Mesma stack Nest+React+Postgres para landing estática.
- Automatic que faz push sozinho.
- V1 = backlog completo.

## Exemplos práticos

**Planning:** SaaS vendas → discovery → Prompt Master → fases; para.

**Assisted:** cursos online → confirma stack → foundation → módulos V1 um a um.

**Automatic (com gates):** OS field service → defaults Postgres+SPA se usuário aceitou “escolha sensata” → implementa MVP → pede OK para commit.

## Critérios de qualidade

- Fluxo rastreável; modo respeitado.
- Spec específica do domínio.
- V1 demonstrável vs aceite do Prompt Master.
- Segurança e auth de publicação ok.

## Checklist de validação

- [ ] Modo definido
- [ ] Discovery + Prompt Master (ou skip justificado)
- [ ] Foundation antes do domínio
- [ ] Arquitetura registrada
- [ ] Dev/QA/Review conforme modo
- [ ] Docs + `.maestro` atualizados
- [ ] Sem irreversível sem OK
- [ ] Entrega V1 vs MVP

## Skills relacionadas

- `maestro-core`, `maestro-orchestrator`, `product-discovery`, `prompt-master-generator`
- `project-foundation`, `software-architecture`, agentes especializados
- `MAESTRO_ENGINEERING_STANDARDS.md`
