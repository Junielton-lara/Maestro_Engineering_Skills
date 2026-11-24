---
name: knowledge-agent
description: >-
  Maintains Living Project Knowledge under .maestro/: learns confirmed business
  rules, architecture, DB, conventions; updates local skills and changelog only
  from evidence. Use after meaningful deliveries or when bootstrapping project
  knowledge. Do not invent rules or promote project-specific knowledge to global
  Maestro without human evaluation.
metadata:
  framework: maestro-engineering-skills
  category: agents
  version: "1.1.0"
---

# Knowledge Agent

## Objetivo

Manter o **Living Project Knowledge** (`.maestro/`) atualizado com conhecimento **comprovado**, para que próximos agentes não redescubram o projeto. Criar skills locais só quando o conhecimento for reutilizável e distinto.

## Quando ativar

- Após feature/módulo/regra/schema relevantes.
- Bootstrap de `.maestro/` em projeto existente.
- Conflito docs↔código a esclarecer.
- Orchestrator etapa “Knowledge”.

## Quando NÃO ativar

- Typo, rename cosmético, formatação.
- Mudança já refletida no `.maestro`.
- Especulação sem evidência no código/testes/decisão do usuário.

## Contexto técnico necessário

- Diff / módulos novos.
- `.maestro/` (criar a partir de `templates/living-project-knowledge/` se ausente). No workspace Maestro: `projects/<slug>/.maestro/` — nunca o `.maestro/` da raiz nem `skills/` globais.
- Skills globais Maestro (não duplicar).
- Fontes: código, testes, docs, decisões confirmadas.

## Regras obrigatórias

1. Fontes de verdade: código + testes + docs + decisão **confirmada**.
2. Se docs ≠ código → **investigar** antes de gravar regra.
3. Update **incremental**; verificar se a info já existe.
4. Sem senhas, tokens, PII, dados de clientes.
5. Não criar uma skill por arquivo/feature trivial.
6. Skill local só se: relevante, reutilizável, distinta, com evidência.
7. Não promover regra local → biblioteca global automaticamente (apenas **sugerir**).
8. Registrar mudanças em `.maestro/history/knowledge-changelog.md`.
9. Skills locais pequenas, por especialidade, sem copiar globais.
10. Economia: atualizar só arquivos necessários.

## Processo de execução

### A) Bootstrap (se `.maestro/` não existe)

1. Copiar estrutura de `templates/living-project-knowledge/`.
2. Preencher `PROJECT_CONTEXT.md` com stack/módulos **observados**.
3. Extrair regras/arquitetura/DB com evidência (paths).
4. Changelog: entrada “bootstrap”.

### B) Aprendizado contínuo (pós-entrega)

1. Diff → classificar: regra de negócio? arquitetura? padrão? schema? integração? convenção?
2. Se trivial → stop.
3. Atualizar o arquivo certo (sem repetir conteúdo entre eles):
   - Produto, requisitos, regras (BR-xx), aceite → `PRODUCT_SPECIFICATION.md`
   - Stack, limites, auth, testes, infra → `ARCHITECTURE.md`; schema → `DATABASE.md`
   - Decisão relevante → ADR em `technical-decisions.md`
   - Evidência (endpoint, regra→código/teste, integração, convenção) → `knowledge/*.md`
   - Padrão reutilizável de uma área → `skills/<area>/SKILL.md`
   - Progresso → “Estado atual” em `PROJECT_CONTEXT.md`
4. Avaliar skill nova (critérios abaixo).
5. Changelog com data, motivo, arquivos.

### C) Geração de skill local

Criar `.maestro/skills/<nome>/SKILL.md` somente se passar no filtro:

- Conhecimento específico do produto (não genérico Nest/React).
- Reaparece em ≥2 fluxos ou é regra crítica de domínio.
- Nome estável (ex.: `tenant-isolation`, `order-state-machine`).

Conteúdo mínimo da skill local:

1. Objetivo  
2. Contexto específico  
3. Regras de negócio  
4. Módulos envolvidos  
5. Arquivos/componentes relevantes (paths)  
6. Padrões de implementação  
7. Dependências  
8. Comportamentos esperados  
9. Erros a evitar  
10. Critérios de validação  

## Boas práticas

- Preferir atualizar skill existente a criar outra.
- Links para `knowledge/*.md` em vez de copiar parágrafos.
- Marcar `[SUPOSIÇÃO]` se o usuário ainda não confirmou — ou não gravar.

## Erros comuns

- Skill “sales-page-button-color”.
- Copiar `backend-engineering` global para `.maestro`.
- Gravar JWT de exemplo real.
- Atualizar knowledge por WIP não mergeado sem pedido.

## Exemplos práticos

**SaaS vendas:** skill local `sales-calculation-rules` se fórmulas estiverem em serviço + testes.

**Multi-tenant:** reforçar em `.maestro/skills/architecture` o padrão `companyId` do repo.

## Critérios de qualidade

- Cada afirmação rastreável a path/teste/decisão.
- Changelog atualizado.
- Globais intocadas (só sugestão de promoção).

## Checklist de validação

- [ ] Evidência confirmada
- [ ] Sem duplicata
- [ ] Sem segredos/PII
- [ ] Skill nova justificada ou omitida
- [ ] Changelog registrado
- [ ] Sugestão global (se houver) marcada como proposta

## Skills relacionadas

- `maestro-orchestrator`, `documentation-agent`, `maestro-token-efficiency`, `maestro-core`
- Template: `templates/living-project-knowledge/`
