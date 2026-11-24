---
name: efficient-development
description: >-
  Implements with minimal waste: reuse existing components, surgical edits,
  no parallel reinvented modules, and scoped validation. Use during coding.
  Do not rewrite whole files or invent duplicate abstractions.
metadata:
  framework: maestro-engineering-skills
  category: efficiency
  version: "1.0.0"
---

# Efficient Development

## Objetivo

Codar com desperdício mínimo: reutilizar, editar pontual, validar o pacote tocado.

## Quando ativar

- Durante implementação (com `development-agent`).
- Tendência a reescrita ampla ou novos módulos desnecessários.

## Quando NÃO ativar

- Exploração pura / só review.

## Contexto técnico necessário

- Padrão do módulo vizinho; componentes existentes; pedido.

## Regras obrigatórias

1. Reutilizar antes de criar.
2. Não recriar componente com outro nome.
3. Preferir patch pontual a reescrita total.
4. Sem refatoração fora do escopo.
5. Validar só o necessário (lint/test do pacote).
6. Sem docs duplicadas na mesma entrega.

## Processo de execução

1. Achar análogo.
2. Planejar ≤5 passos se simples (senão quebrar).
3. Editar.
4. Validar escopo.
5. Parar.

## Boas práticas

- API e UI no mesmo padrão de paginação/erros do projeto.
- Migrations só com mudança real de schema.

## Erros comuns

- “Aproveitei e limpei a pasta”.
- Novo utils genérico para uma linha.

## Exemplos práticos

**Botão:** variant do kit existente, não `PrimaryButton2`.

## Critérios de qualidade

- Diff mínimo suficiente.
- Zero duplicata óbvia.

## Checklist de validação

- [ ] Análogo reutilizado
- [ ] Edit pontual
- [ ] Sem módulo extra injustificado
- [ ] Validação escopada

## Skills relacionadas

- `development-agent`, `maestro-token-efficiency`, `frontend-engineering`, `backend-engineering`
