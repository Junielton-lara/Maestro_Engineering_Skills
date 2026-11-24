---
name: performance-optimization
description: >-
  Otimiza desempenho medindo antes (FE, BE, DB), evitando otimização prematura e documentando
  impacto. Use when investigar lentidão, alto uso de CPU/memória, queries pesadas ou bundle grande.
  Do not use when o problema for correção funcional ou segurança sem sintoma de performance.
metadata:
  framework: maestro-engineering-skills
  category: quality
  version: "1.0.0"
---

# Otimização de Performance

## Objetivo

Melhorar tempo de resposta, throughput e uso de recursos com evidência (métricas, traces, profiles), mudanças mínimas e reversíveis.

## Quando ativar

- Latência perceptível, timeouts, filas crescendo.
- Custos de infra altos correlacionados a uso de CPU/RAM/IO.
- Relatório de Lighthouse/Web Vitals ruim.
- Query lenta, N+1, full table scan.
- Bundle frontend grande ou TTFB alto.

## Quando NÃO ativar

- Bug de lógica ou permissão sem métrica de lentidão.
- Micro-otimização em código não executado em hot path.
- “Refatorar tudo para ficar mais rápido” sem baseline.

## Contexto técnico necessário

- Baseline: p50/p95 latência, RPM, uso de CPU/memória, tamanho de bundle.
- Stack de observação (APM, logs, EXPLAIN, DevTools).
- SLAs ou metas declaradas pelo usuário.
- Ambiente representativo (não só laptop).

## Regras obrigatórias

1. **Medir antes e depois** na mesma condição (carga, dados, região).
2. **Encontrar gargalo** (uma mudança por hipótese quando possível).
3. **Evitar otimização prematura** em código frio.
4. **Não sacrificar correção** por cache agressivo sem invalidação clara.
5. **Documentar** trade-offs (memória vs CPU, consistência vs latência).
6. **Sem comandos destrutivos** em prod (índice drop, cache flush global) sem autorização.

## Processo de execução

1. **Definir métrica alvo** (ex.: p95 API < 300ms, LCP < 2.5s).
2. **Capturar baseline** com ferramenta adequada à camada.
3. **Hipótese** → experimento → comparação.
4. **Aplicar fix mínimo** (índice, batch, paginação, lazy load).
5. **Validar** regressão funcional + `testing-qa` smoke.
6. **Registrar** resultado numérico no PR ou nota técnica.

### Camadas

| Camada | Sinais | Ações comuns |
|--------|--------|--------------|
| Frontend | LCP, CLS, bundle KB | code split, lazy, imagens, memo onde medido |
| Backend | CPU, GC, thread pool | cache, async I/O, pool sizing |
| DB | slow query log, seq scan | índice, query rewrite, paginação |
| Rede | RTT, TLS | CDN, compressão, HTTP/2 — com `nginx-configuration` |

## Boas práticas

- **Paginar** listas; cursor para feeds grandes.
- **Cache** com TTL e chave por tenant; stampede protection.
- **Evitar N+1** com eager load ou query consolidada.
- **Background jobs** para trabalho não crítico ao request.
- **Load test** só após fix localizado, ambiente descartável.

## Erros comuns

- Adicionar Redis sem medir que o gargalo é disco.
- Índice em toda coluna “por precaução”.
- `useMemo`/`useCallback` em todo componente React.
- Paralelizar sem limite → sobrecarga DB.
- Otimizar mock em dev que não reflete prod.

## Exemplos práticos

**API lenta:** trace mostra 40 queries → uma query com join + índice em `tenant_id, created_at`.

**Frontend:** bundle 2MB → route-based split; imagem hero em WebP com dimensões fixas.

**Relatório:** export síncrono → job + polling ou e-mail quando pronto.

## Critérios de qualidade

- Melhoria quantificada vs baseline.
- Sem regressão funcional nos fluxos P0.
- Mudança proporcional ao problema (sem reescrita total).
- Observabilidade mantida ou melhorada → `observability`.

## Checklist de validação

- [ ] Baseline registrada
- [ ] Gargalo identificado com evidência
- [ ] Mudança medida pós-deploy ou em staging equivalente
- [ ] Índices/migrações revisados (plano de rollback)
- [ ] Limites de paginação/tamanho de resposta
- [ ] Documentação de trade-off se houver

## Skills relacionadas

- `observability` — métricas, traces, alertas
- `nginx-configuration` — gzip, cache, upstream
- `database-optimization` — se existir no catálogo
- `automated-testing` — testes de carga leves ou benchmarks
- `docker-management` — limites de recurso em containers
- `hostinger-deployment` — recursos de VPS