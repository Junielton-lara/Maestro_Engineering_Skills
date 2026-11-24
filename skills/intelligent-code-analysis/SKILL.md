---
name: intelligent-code-analysis
description: >-
  Analyzes code with progressive narrowing: search symbols, open targets, then
  neighbors—avoiding full-tree scans. Use when locating bugs, call chains, or
  impact analysis. Do not reread unchanged files or load unrelated packages.
metadata:
  framework: maestro-engineering-skills
  category: efficiency
  version: "1.0.0"
---

# Intelligent Code Analysis

## Objetivo

Entender código por **afunilamento**: busca → alvo → vizinhos → conclusão — sem varrer o repositório.

## Quando ativar

- Localizar causa, impacto de mudança, call graph.
- Antes de refactor não trivial.

## Quando NÃO ativar

- Path já conhecido e escopo trivial.

## Contexto técnico necessário

- Sintoma ou símbolo; stack do projeto; `.maestro` maps (api/database) se houver.

## Regras obrigatórias

1. Começar por grep/glob do símbolo/erro — não `Read` em massa.
2. Ler arquivo alvo; só então imports/callers.
3. Parar quando a hipótese estiver evidenciada.
4. Não reler sem diff.
5. Ignorar `node_modules`, `dist`, builds.
6. Registrar cadeia curta (A→B→C) se multi-arquivo.

## Processo de execução

1. Hipótese inicial (1 frase).
2. Busca cirúrgica.
3. Confirmar/refutar com trechos mínimos.
4. Impacto: quem chama / testes / contratos.
5. Entregar mapa curto + recomendação.

## Boas práticas

- Preferir stack traces e logs a exploração cega.
- Usar mapa `.maestro/knowledge/api-map.md` quando existir.

## Erros comuns

- Abrir 30 arquivos “por precaução”.
- Analisar vendor code sem necessidade.

## Exemplos práticos

**Erro 403:** grep guard/roles → service assertCompany → teste.

## Critérios de qualidade

- Causa com evidência path/linha.
- Leituras proporcionais.

## Checklist de validação

- [ ] Busca antes de dump
- [ ] Cadeia mínima documentada
- [ ] Sem vendor desnecessário
- [ ] Hipótese confirmada ou refutada

## Skills relacionadas

- `context-management`, `maestro-token-efficiency`, `code-review-agent`, `development-agent`
