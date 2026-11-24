---
name: database-postgresql
description: >-
  Modela e evolui schema PostgreSQL com FKs, tipos adequados, constraints, migrações versionadas
  e JSONB quando fizer sentido. Use when criar tabelas, relações, migrations ou políticas de
  integridade referencial. Do not use when o foco for só performance/EXPLAIN (use
  database-optimization) ou isolamento multi-tenant sem DDL (use multi-tenancy).
metadata:
  framework: maestro-engineering-skills
  category: backend
  version: "1.0.0"
---

# PostgreSQL — Schema e Migrações

## Objetivo

Manter dados consistentes e evoluíveis: normalização adequada, chaves estrangeiras, tipos corretos, migrações reversíveis quando possível, e uso consciente de JSONB para atributos semi-estruturados sem substituir relacionamentos.

## Quando ativar

- Nova tabela, coluna, FK, constraint ou índice estrutural (não só tuning).
- Migração de dados entre formatos.
- Introdução de enums, check constraints ou particionamento.
- Modelagem de auditoria (`created_at`, soft delete).

## Quando NÃO ativar

- Análise de plano lento ou criação fina de índices → `database-optimization`.
- Regras só em código sem mudança de schema.
- Estratégia de tenant (RLS, schema por cliente) sem DDL → combinar com `multi-tenancy`.

## Contexto técnico necessário

- Ferramenta de migration (Flyway, Liquibase, Prisma, Alembic, etc.).
- Convenções de naming (`snake_case`, prefixos).
- Ambientes (dev/staging/prod) e política de rollback.
- Volume e retenção estimados.

## Regras obrigatórias

1. **Preferir migrations versionadas** — nunca alterar produção manualmente sem registro.
2. **Integridade referencial** com FKs; `ON DELETE` explícito (`RESTRICT`, `CASCADE`, `SET NULL`).
3. **Nunca expor** connection strings ou dumps completos a clientes ou repositório público.
4. **Tipos adequados**: `timestamptz`, `numeric` para dinheiro, `uuid` ou `bigint` para IDs conforme padrão do projeto.
5. **JSONB** para extensões opcionais; não para substituir N:N ou entidades com consultas relacionais frequentes.
6. **Inspecionar schema existente** antes de criar tabelas duplicadas.
7. **Multi-tenant**: coluna `tenant_id` + FK/index quando modelo for row-level (`multi-tenancy`).

## Processo de execução

1. **Esboçar ER** (entidades, cardinalidades, ciclo de vida).
2. **Comparar** com tabelas existentes; reutilizar dimensões compartilhadas.
3. **Escrever migration up/down** (ou estratégia expand-contract para zero-downtime).
4. **Constraints**: NOT NULL gradual em colunas novas (backfill → NOT NULL).
5. **Índices mínimos** para FKs e unicidade; tuning extra em `database-optimization`.
6. **Validar** em staging com dados representativos.
7. **Documentar** breaking changes para `api-design` / `backend-engineering`.

## Boas práticas

- **Unicidade composta** `(tenant_id, external_id)` em SaaS.
- **Soft delete** via `deleted_at` + índice parcial `WHERE deleted_at IS NULL`.
- **Auditoria**: `created_at`, `updated_at`, opcionalmente `created_by`.
- **Enums Postgres** ou tabelas de lookup conforme frequência de mudança.
- **Comentários SQL** (`COMMENT ON`) em colunas não óbvias.

## Erros comuns

- `varchar(255)` para tudo; datas sem timezone.
- Sem FK “para ganhar performance” e dados órfãos em produção.
- Migration gigante sem batch em tabelas grandes.
- JSONB sem GIN quando filtros dependem de chaves internas.
- Esquecer `tenant_id` em tabela nova num SaaS.

## Exemplos práticos

**Tabela com FK e tenant:**

```sql
CREATE TABLE orders (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  customer_id uuid NOT NULL REFERENCES customers(id),
  status      text NOT NULL CHECK (status IN ('draft','paid','cancelled')),
  metadata    jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_tenant_created ON orders (tenant_id, created_at DESC);
```

**Migration expand (nova coluna nullable):**

```sql
ALTER TABLE customers ADD COLUMN phone text;
-- backfill em job separado, depois:
-- ALTER TABLE customers ALTER COLUMN phone SET NOT NULL;
```

## Critérios de qualidade

- Schema reflete invariantes de negócio (CHECK, FK, UNIQUE).
- Migrações rastreáveis e repetíveis em CI.
- Sem dados sensíveis em colunas sem criptografia quando exigido.
- Compatível com queries planejadas (evitar full scan em caminhos quentes).

## Checklist de validação

- [ ] Migration versionada e testada (up em banco limpo e com dados).
- [ ] FKs e ON DELETE definidos.
- [ ] Tipos e NOT NULL alinhados ao domínio.
- [ ] `tenant_id` onde aplicável.
- [ ] Índices para FK/unicidade; EXPLAIN se rota crítica.
- [ ] Segredos fora do repositório.

## Skills relacionadas

- `database-optimization` — EXPLAIN, índices finos, N+1.
- `multi-tenancy` — RLS, schema por tenant.
- `backend-engineering` — repositórios e transações.
- `api-design` — exposição de campos ao cliente.
- `maestro-core` — ordem schema → API → código.