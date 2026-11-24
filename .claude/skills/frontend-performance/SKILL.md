---
name: frontend-performance
description: >-
  Improves FE performance via route lazy-loading, query policies, image
  optimization, chart code-splitting, and measuring before optimizing. Use when
  pages feel slow, bundles grow, or optimizing lists/dashboards. Do not use for
  premature micro-optimizations without evidence.
metadata:
  framework: maestro-engineering-skills
  category: frontend
  version: "1.1.0"
  source: "generalized-from-staltek-reference"
---

# Frontend Performance

## Objetivo

Manter UI responsiva: menos JS inicial, fetches disciplinados, mídia otimizada — alinhado a práticas OBSERVADAS (lazy routes, charts em chunk separado, staleTime, otimização de imagem antes do upload).

## Quando ativar

- TTI lento, bundle grande, listas pesadas, dashboards com charts.
- PWA/offline com custo de cache.

## Quando NÃO ativar

- Bug funcional sem sintoma de perf.
- Otimizar sem medir (chame `performance-optimization` + evidência).

## Contexto técnico necessário

- Bundler (Vite/webpack), rotas, política de cache HTTP client.
- Relatórios/docs de perf do projeto se existirem.

## Regras obrigatórias

1. **Medir antes** (Network, Lighthouse, script de perf da API se houver).
2. Rotas de feature: **lazy import** + skeleton.
3. Libs pesadas (charts, PDF viewer, editor): **dynamic import**.
4. Queries: `staleTime` / políticas explícitas; evitar refetch agressivo em toda navegação.
5. Listas: paginação/virtualização se volume alto.
6. Imagens: dimensões, formato moderno, compressão no client **antes** de upload quando o fluxo for mobile (padrão OBSERVADO).
7. Não adicionar animação/lib só por estética se custar TTI.
8. Prefetch de rota sob hover/focus na nav — com moderação.

## Processo de execução

1. Reproduzir lentidão e capturar evidência.
2. Classificar: bundle / network / render / imagens.
3. Aplicar correção mínima.
4. Re-medir.
5. Documentar tradeoff se cache mais longo.

## Boas práticas

- Separar vendor chunks conscientes (OBSERVADO: recharts isolado).
- Evitar waterfall: parallel queries quando independentes.
- Skeleton no lugar de spinners genéricos em listagens.

## Erros comuns

- `framer-motion` (ou similar) instalado e não usado (**débito OBSERVADO**).
- Invalidar “todas as queries” a cada keystroke.
- Base64 enorme no estado React.

## Exemplos práticos

**Dashboard:** KPI queries com staleTime; charts lazy; empty se sem dados.

**Upload:** redimensionar ≤1920px / WebP~JPEG no aparelho; servidor ainda valida MIME/tamanho.

## Critérios de qualidade

- Evidência antes/depois.
- Sem regressão funcional.
- Bundle da rota crítica não puxa charts sem necessidade.

## Checklist de validação

- [ ] Medição registrada
- [ ] Lazy nas rotas/libs pesadas
- [ ] Política de query
- [ ] Imagens/upload otimizados se aplicável
- [ ] Dependências mortas não introduzidas

## Skills relacionadas

- `frontend-engineering`, `performance-optimization`, `mobile-first`, `observability`
