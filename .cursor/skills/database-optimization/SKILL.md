---
name: database-optimization
description: >-
  Otimiza PostgreSQL com índices adequados, EXPLAIN, eliminação de N+1, paginação eficiente e
  noções de pool de conexões. Use when listagens lentas, locks, alto CPU de DB ou suspeita de
  queries ruins. Do not use when o escopo for modelagem inicial de tabelas (use
  database-postgresql) ou regra de negócio sem SQL (use backend-engineering).
metadata:
  framework: maestro-engineering-skills
  category: backend
  version: "1.0.0"
---

# Otimização de Banco (PostgreSQL)

## Objetivo

Reduzir latência e carga do banco com evidência: medir com `EXPLAIN (ANALYZE, BUFFERS)`, corrigir planos ruins, indexar com critério, paginar corretamente e eliminar padrões N+1 na camada de aplicação.

## Quando ativar

- Endpoint de listagem ou relatório lento.
- Timeouts, saturação de conexões, spikes de I/O.
- Revisão pós-feature com novos filtros/joins.
- Incidente “funcionava em dev” com volume de produção.

## Quando NÃO ativar

- Primeira modelagem de domínio (ir a `database-postgresql` primeiro).
- Problema é rede/API externa → `integrations`.
- Vazamento cross-tenant (corrigir isolamento em `multi-tenancy`).

## Contexto técnico necessário

- Query ou ORM gerado; parâmetros típicos (tenant, datas, status).
- Tamanho de tabela, estatísticas, índices existentes.
- Pool (PgBouncer, driver limits) e `max_connections`.
- SLO de latência do endpoint afetado.

## Regras obrigatórias

1. **Medir antes de indexar** — EXPLAIN em staging/prod read replica quando possível.
2. **Paginação obrigatória** — nunca `SELECT *` ilimitado em API.
3. **Evitar N+1** — joins, `IN (...)`, batch loaders ou dataloader no serviço.
4. **Transações curtas** — sem I/O externo dentro de TX (`backend-engineering`).
5. **Índices alinhados a filtros reais** — ordem de colunas importa; partial indexes quando útil.
6. **Nunca expor** plans, credenciais ou dumps ao cliente.
7. **Integridade preservada** — otimização não remove FKs sem plano de dados.

## Processo de execução

1. **Reproduzir** com parâmetros reais; capturar query e tempo.
2. **EXPLAIN ANALYZE**; identificar Seq Scan, nested loop caro, sort em disco.
3. **Corrigir aplicação** (eager load, projeção de colunas, paginação por cursor).
4. **Propor índice** se selective; validar tamanho e writes extras.
5. **Re-testar** carga e plano; documentar índice na migration.
6. **Pool**: revisar conexões por instância vs limite do Postgres.
7. **Checklist** e monitorar após deploy.

## Boas práticas

- **Cursor pagination** em tabelas grandes: `WHERE (created_at, id) < (...)` com índice composto.
- **Covering index** só quando leitura domina e tabela não é write-heavy demais.
- **`VACUUM`/`ANALYZE`** após bulk load; bloat investigado se degradar.
- **Materialized views** para agregados pesados com refresh documentado.
- **Statement timeout** no servidor para queries runaway.

## Erros comuns

- Índice em toda coluna de filtro sem cardinalidade.
- Offset grande (`OFFSET 100000`) em listas infinitas.
- `COUNT(*)` em toda request de listagem sem necessidade.
- Resolver N+1 só com cache sem corrigir query.
- Connection storm: pool maior que Postgres aguenta.

## Exemplos práticos

**EXPLAIN:**

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.status
FROM orders o
WHERE o.tenant_id = '...'
  AND o.status = 'paid'
ORDER BY o.created_at DESC
LIMIT 20;
```

**Índice parcial:**

```sql
CREATE INDEX idx_orders_tenant_paid_recent
  ON orders (tenant_id, created_at DESC)
  WHERE status = 'paid';
```

**Batch em vez de N+1 (SQL):**

```sql
SELECT * FROM order_items WHERE order_id = ANY($1::uuid[]);
```

## Critérios de qualidade

- Latência p95 dentro do SLO com volume representativo.
- Plano usa índice ou justifica seq scan pequeno.
- Listagens bounded; memória estável sob carga.
- Writes não degradam excessivamente por índices novos.

## Checklist de validação

- [ ] EXPLAIN antes/depois arquivado ou referenciado no PR.
- [ ] N+1 eliminado na rota afetada.
- [ ] Paginação com limite máximo (`api-design`).
- [ ] Filtro `tenant_id` em queries multi-tenant.
- [ ] Migration para novos índices.
- [ ] Pool e timeouts revisados.

## Skills relacionadas

- `database-postgresql` — DDL e constraints.
- `backend-engineering` — repositórios e transações.
- `api-design` — contratos de listagem.
- `multi-tenancy` — índices compostos com `tenant_id`.
- `maestro-core` — priorização em incidentes.