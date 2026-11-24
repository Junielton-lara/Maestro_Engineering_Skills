---
name: product-discovery
description: >-
  Guides product discovery via interviews, Jobs-to-be-Done, problem-solution fit, and MVP scoping.
  Use when validating a new idea, defining scope before build, or reducing ambiguity on who suffers
  which problem. Do not use when a signed-off Prompt Master or fixed backlog already exists, or for
  pure technical refactors with no product change.
metadata:
  framework: maestro-engineering-skills
  category: core
  version: "1.0.0"
---

# Product Discovery

## Objetivo

Transformar intenção vaga em entendimento verificável do problema, usuários, jobs críticos e escopo de MVP — antes de arquitetura ou código.

## Quando ativar

- Ideia de produto/feature sem métricas de sucesso nem personas.
- “Não sei por onde começar” ou múltiplas features competindo.
- Necessidade de cortar escopo para primeira entrega.
- Validação de fit (problema real vs. solução imaginada).

## Quando NÃO ativar

- Prompt Master ou PRD aprovado (ir direto a `prompt-master-generator` ou `software-architecture`).
- Bugfix ou refatoração sem mudança de comportamento de negócio.
- Discovery já documentado no repositório (atualizar doc, não refazer entrevista fictícia).

## Contexto técnico necessário

- Domínio do negócio (B2B/B2C, regulatório, offline/online).
- Restrições: prazo, orçamento, equipe, mercado existente.
- Concorrentes ou alternativas atuais do usuário (planilha, WhatsApp, etc.).

## Regras obrigatórias

1. Separar **problema**, **job-to-be-done** e **solução proposta**.
2. Identificar **ator primário** e **jobs secundários** (não listar features primeiro).
3. Definir **hipóteses testáveis** e sinais de invalidação.
4. Delimitar **MVP**: o mínimo que prova valor; explicitar **fora de escopo**.
5. Ao final, recomendar `prompt-master-generator` se ainda não houver spec escrita.
6. Não inventar dados de mercado; marcar suposições como `[SUPOSIÇÃO]`.

## Processo de execução

1. **Enquadramento** — outcome desejado em 6 meses vs. em 2 semanas (MVP).
2. **Mapa de stakeholders** — quem usa, paga, opera, integra.
3. **Entrevista estruturada** (roteiro abaixo) — uma pergunta por vez se interativo.
4. **JTBD** — formato: “Quando [situação], quero [motivação], para [resultado].”
5. **Problem-solution fit** — dores intensas, frequência, alternativas, willingness to switch.
6. **MVP** — 3–7 capacidades nucleus; critérios de “done” de negócio.
7. **Handoff** — resumo para `prompt-master-generator` ou `project-planning`.

### Roteiro de entrevista (adaptar)

- Conte a última vez que [problema] aconteceu — passo a passo.
- O que você fez antes de recorrer a [solução atual]?
- O que mais te frustrou? O que você evitou fazer por causa disso?
- Se existisse magia, o que mudaria amanhã? (sem pedir features)
- Como mediríamos sucesso da primeira versão?

## Boas práticas

- Priorizar jobs com alta frequência + alta dor.
- MVP que permite aprendizado (métrica de ativação), não “mini produto completo”.
- Registrar decisões de corte com motivo (custo, risco, dependência).

## Erros comuns

- Pular para stack/tecnologia antes do job.
- MVP = “tudo que o concorrente tem”.
- Personas genéricas (“usuário jovem”) sem contexto de uso.
- Confundir requisito legal com desejo opcional.

## Exemplos práticos

**Clínica** — Job: “reduzir no-show em consultas”. MVP: lembrete SMS + confirmação; fora: prontuário completo.

**SaaS interno** — Job: “aprovar compras em &lt;24h”. MVP: fila + notificação Slack; fora: ERP.

## Critérios de qualidade

- JTBD principal articulado em uma frase clara.
- Lista MVP com no máximo 7 itens e “não faremos” explícito.
- Hipóteses e riscos de produto nomeados.
- Próximo skill indicado (`prompt-master-generator` na maioria dos `create`).

## Checklist de validação

- [ ] Problema ≠ solução (redação distinta)
- [ ] Ator primário identificado
- [ ] JTBD documentado
- [ ] Fit argumentado (dor, frequência, alternativa)
- [ ] MVP e anti-escopo definidos
- [ ] Encaminhamento para spec/plano

## Skills relacionadas

- `maestro-core` — orquestração e classificação de intenção
- `prompt-master-generator` — especificação técnica completa pós-discovery
- `project-planning` — fases quando MVP já está claro
- `software-architecture` — após escopo de capacidades estabilizado