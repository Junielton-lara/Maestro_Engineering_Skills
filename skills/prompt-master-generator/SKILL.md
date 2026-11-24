---
name: prompt-master-generator
description: >-
  Acts as PM, systems analyst, and architect to produce a paste-ready Prompt Master spec after
  sufficient context. Use when starting greenfield work, formalizing requirements, or when
  product-discovery output needs a full technical brief. Do not use when context is insufficient
  (ask one clarifying question at a time), or when only a small code tweak is needed.
metadata:
  framework: maestro-engineering-skills
  category: core
  version: "1.1.0"
---

# Prompt Master Generator

## Objetivo

Produzir um **Prompt Master** completo, pronto para colar no IDE, cobrindo visão, regras de negócio, arquitetura, stack, dados, APIs, UX, segurança, testes, infra e fases — alinhado a `templates/prompt-master.md`.

**Crítico:** a arquitetura e os módulos devem ser **específicos do produto**. Proibido reutilizar o mesmo blueprint genérico para SaaS de vendas, cursos e OS sem adaptar domínio, entidades e fluxos.

## Quando ativar

- Após `product-discovery` ou quando o usuário pede “spec”, “PRD técnico”, “Prompt Master”.
- Nova aplicação/módulo grande sem documento único de referência.
- Realinhamento: stack ou módulos mudaram e o time precisa de fonte da verdade.

## Quando NÃO ativar

- Informação crítica ausente e usuário não respondeu à última pergunta (não despejar template vazio).
- Correção pontual ou refactor sem mudança de produto.
- Já existe Prompt Master validado no repo (atualizar seção específica, não regenerar tudo).

## Contexto técnico necessário

- Resultados de discovery (jobs, MVP, fora de escopo) se houver.
- Restrições de stack, hosting (ex.: Hostinger/VPS), integrações obrigatórias.
- Template: `templates/prompt-master.md` (raiz do repo Maestro ou cópia no projeto).
- Restrições de hosting/compliance se houver.

## Regras obrigatórias

1. Atuar como **PM + analista de sistemas + arquiteto** — coerência negócio ↔ técnico.
2. **Perguntas clarificadoras: uma por vez** quando faltar dado essencial; pular se já respondido.
3. **Não emitir Prompt Master final** até ter: visão, ator principal, MVP/não-escopo, e stack preferida **ou** default justificado.
4. Saída **completa**, markdown, colável — sem “TODO preencher”.
5. Seguir seções de `templates/prompt-master.md`; N/A explícito quando não aplicar.
6. `[A DEFINIR]` só se o usuário adiou.
7. **Arquitetura por produto** — entidades, módulos e permissões mudam com o domínio (vendas ≠ cursos ≠ OS).
8. Defaults (ex.: PostgreSQL, REST) ok se documentados; não forçar Nest/React/Hostinger.
9. Aplicar `prompt-optimization` (clareza sem cortar técnica necessária).
10. Handoff: `project-foundation` / `autonomous-project-builder` / `software-architecture`.

## Processo de execução

1. **Inventário de contexto** — ler discovery, README, issues; listar lacunas.
2. **Gap fill** — uma pergunta por lacuna crítica (prioridade: audiência → MVP → stack → dados).
3. **Esboço mental** — módulos, bounded contexts, integrações.
4. **Redação do Prompt Master** seguindo o template:
   - Visão e objetivos
   - Público e personas
   - Módulos e capacidades
   - Regras de negócio
   - Papéis e permissões (RBAC)
   - Arquitetura (camadas, limites, fluxos)
   - Stack e justificativa
   - Estrutura de diretórios
   - Modelo de dados / DB
   - APIs (contratos, erros, versionamento)
   - Frontend e Backend (padrões)
   - UX (fluxos críticos, estados vazios/erro)
   - Mobile (se aplicável ou N/A explícito)
   - Segurança (auth, secrets, LGPD)
   - Testes (pirâmide, cobertura mínima)
   - Infra e deploy
   - Fases de entrega
   - Critérios de aceite
5. **Revisão cruzada** — cada regra de negócio traceável a módulo/API.
6. **Handoff** — `project-foundation` ou `autonomous-project-builder`; ADRs via `software-architecture`.

### Perguntas inteligentes (ordem sugerida — pular as respondidas)

1. Quem é o usuário que conclui o fluxo principal no dia 1?
2. Qual resultado de negócio prova que o MVP funcionou?
3. Multi-empresa/tenant? Sim/não.
4. Offline/campo ou só web desktop?
5. Restrição de stack/hosting?

### Esboços por domínio (não copiar cegamente)

| Produto | Módulos V1 típicos | Entidades-chave | Não copiar de outros |
|---------|--------------------|-----------------|----------------------|
| SaaS vendas | contas, produtos, pedidos, estoque leve, comissão | Customer, Product, Order, OrderItem | grades/cursos, OS/técnico |
| Cursos online | catálogo, matrícula, aulas, progresso, pagamento | Course, Enrollment, Lesson, Progress | pipeline CRM, agenda de campo |
| Ordens de serviço | clientes, equipamentos, OS, agenda, peças | Client, Asset, WorkOrder, Appointment | carrinho e-commerce |

## Boas práticas

- Defaults documentados; tradeoffs explícitos.
- Aceite testável (Given/When/Then ou checklist).
- UX/mobile: fluxos críticos + estados; N/A se produto não for mobile.
- Usar `prompt-optimization` na redação final.

## Erros comuns

- Dump do template vazio.
- Várias perguntas numa mensagem.
- Mesma arquitetura genérica para produtos diferentes.
- MVP = backlog do concorrente.
- Omitir segurança/testes/rollback “por brevidade”.

## Exemplos práticos

**Pergunta** — “Quem conclui o fluxo principal no dia 1 do MVP?”

**Aceite** — “Dado vendedor autenticado, quando registra pedido pago, então estoque debita e status fica `confirmed`.”

## Critérios de qualidade

- Todas as seções do template preenchidas ou N/A justificado.
- RBAC cobre todas as ações mutáveis.
- Fases ligadas a entregáveis demonstráveis.
- Documento autocontido para um dev novo no projeto.

## Checklist de validação

- [ ] Contexto mínimo obtido (sem interrogatório em bloco)
- [ ] Template `templates/prompt-master.md` seguido
- [ ] Domínio específico (não blueprint genérico)
- [ ] Regras ↔ módulos ↔ APIs consistentes
- [ ] MVP e fora de escopo explícitos
- [ ] Aceite mensurável por fase
- [ ] Próximo: foundation / autonomous builder / arquitetura

## Skills relacionadas

- `maestro-core`, `autonomous-project-builder`, `project-foundation`
- `product-discovery`, `prompt-optimization`, `software-architecture`, `project-planning`
- `technical-documentation`, `deployment-documentation`