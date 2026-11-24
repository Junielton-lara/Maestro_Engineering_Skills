---
name: context-management
description: >-
  Keeps agent context focused: minimal file reads, reuse of known facts, short
  decision logs, and .maestro-first lookup. Use when context is growing, tasks
  span multiple steps, or before broad exploration. Do not skip necessary reads.
metadata:
  framework: maestro-engineering-skills
  category: efficiency
  version: "1.0.0"
---

# Context Management

## Objetivo

Manter no contexto só o necessário: objetivo, decisões, paths críticos — evitando releituras e dumps de diretório.

## Quando ativar

- Tarefas longas / multi-etapa.
- Contexto inchado ou risco de truncamento.
- Antes de exploração ampla.

## Quando NÃO ativar

- Tarefa de 1 arquivo já identificado.

## Contexto técnico necessário

- Objetivo atual; o que já foi lido; `.maestro/` se existir.

## Regras obrigatórias

1. Consultar `.maestro` e chat antes de explorar.
2. Grep/glob cirúrgico → ler trechos, não pastas inteiras.
3. Não reler sem mudança relevante.
4. Decisões longas: 2–5 bullets persistidos (chat ou `.maestro`).
5. Não colar arquivos enormes na resposta.

## Processo de execução

1. Inventário do já conhecido.
2. Lista de lacunas (máx. N arquivos).
3. Preencher lacunas.
4. Atualizar notas de decisão se complexo.

## Boas práticas

- Preferir referências `path:linha` a citações longas.
- Uma pergunta só se a lacuna bloquear.

## Erros comuns

- `Read` em node_modules / dist.
- Re-resumir o mesmo diff três vezes.

## Exemplos práticos

**Feature:** ler skill local + 1 serviço + 1 página vizinha — não o monorepo.

## Critérios de qualidade

- Cada leitura justificada.
- Notas suficientes para continuar sem redescobrir.

## Checklist de validação

- [ ] Knowledge local checado
- [ ] Escopo de arquivos limitado
- [ ] Sem releitura inútil
- [ ] Decisões registradas se longo

## Skills relacionadas

- `maestro-token-efficiency`, `intelligent-code-analysis`, `knowledge-agent`, `agent-orchestration`
