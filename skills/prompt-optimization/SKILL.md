---
name: prompt-optimization
description: >-
  Crafts clear, non-redundant prompts and Prompt Masters with priority hierarchy,
  reusable rules, separated context vs execution, and crisp acceptance criteria.
  Use when writing specs or agent prompts. Do not strip required technical detail
  only to shorten text.
metadata:
  framework: maestro-engineering-skills
  category: efficiency
  version: "1.0.0"
---

# Prompt Optimization

## Objetivo

Prompts e Prompt Masters claros, sem redundância, com hierarquia de prioridades — **sem** cortar técnica necessária só para enxugar.

## Quando ativar

- Redigir/refinar Prompt Master, briefs de agente, checklists de entrega.
- Prompt genérico demais ou repetitivo.

## Quando NÃO ativar

- Implementação pura sem necessidade de reespecificar.

## Contexto técnico necessário

- Template `templates/prompt-master.md`; skill `prompt-master-generator`.

## Regras obrigatórias

1. Clareza > formalismo.
2. Sem repetir a mesma regra em 4 seções.
3. Hierarquia: deve / deve evitar / opcional.
4. Separar **contexto** (fatos) de **execução** (passos).
5. Aceite testável.
6. Regras reutilizáveis por referência a skills/`.maestro`.
7. Não omitir segurança/tenant/testes “por tamanho”.

## Processo de execução

1. Listar decisões já tomadas.
2. Remover duplicatas e floreios.
3. Ordenar: objetivo → restrições → passos → aceite.
4. Validar se um dev novo executaria sem ambiguidade.

## Boas práticas

- Tabelas curtas; bullets; N/A explícito.
- Uma pergunta por vez se faltar dado (`prompt-master-generator`).

## Erros comuns

- Wall of text com sinônimos.
- Aceite vago (“ficar bom”).

## Exemplos práticos

**Antes:** três parágrafos sobre “código limpo”.  
**Depois:** “Seguir padrão do módulo vizinho; diff mínimo; lint do pacote”.

## Critérios de qualidade

- Sem redundância material.
- Técnica essencial preservada.
- Aceite verificável.

## Checklist de validação

- [ ] Contexto ≠ execução
- [ ] Prioridades claras
- [ ] Sem duplicata
- [ ] Aceite testável
- [ ] Segurança/dados não omitidos se relevantes

## Skills relacionadas

- `prompt-master-generator`, `maestro-token-efficiency`, `response-efficiency`
