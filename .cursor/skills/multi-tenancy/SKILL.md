---
name: multi-tenancy
description: >-
  Garante isolamento de tenant (row-level, schema ou DB) com filtro em toda query e zero vazamento
  cross-tenant. Use when SaaS, múltiplas organizações ou ambientes compartilhados. Do not use when
  sistema é single-tenant sem plano de isolamento, ou foco for só performance SQL (use
  database-optimization).
metadata:
  framework: maestro-engineering-skills
  category: backend
  version: "1.0.0"
---

# Multi-tenancy

## Objetivo

Garantir que cada tenant acesse apenas seus dados: estratégia explícita (row-level com `tenant_id`, schema por tenant ou banco dedicado), enforcement em toda leitura/escrita e testes que provam ausência de vazamento lateral.

## Quando ativar

- Novo módulo em produto SaaS.
- Correção de bug “usuário A viu dados de B”.
- Migração single → multi-tenant.
- Implementação de RLS, middleware de tenant ou provisionamento.

## Quando NÃO ativar

- Aplicação on-premise única organização sem requisito futuro documentado.
- Otimização de query sem mudança de escopo de dados.
- Auth genérica sem contexto de organização → começar em `authentication-authorization`.

## Contexto técnico necessário

- Modelo escolhido: **shared DB + tenant_id**, **schema por tenant**, ou **DB por tenant**.
- Origem do tenant: JWT claim, subdomain, header (evitar só query param confiável).
- ORM/middleware existente; suporte a RLS no Postgres.
- Requisitos de compliance (residência, backup por tenant).

## Regras obrigatórias

1. **Filtro de tenant em toda query** — sem exceção em repositórios e jobs.
2. **Nunca confiar no cliente** para `tenant_id` no body sem validar contra identidade (`authentication-authorization`).
3. **Nunca expor** lista de tenants ou IDs internos sem autorização.
4. **404 ou 403 uniforme** ao acessar recurso de outro tenant (política documentada em `api-design`).
5. **Jobs/filas** propagam `tenant_id`; workers não processam mensagem sem contexto.
6. **Migrations** consideram todas as estratégias (schema per tenant: loop ou ferramenta).
7. **Inspecionar código existente** antes de novo bypass “admin global”.

## Processo de execução

1. **Confirmar modelo** com stakeholders (custo ops vs isolamento).
2. **Definir resolução de tenant** na request (middleware único).
3. **Schema**: `tenant_id` NOT NULL + índices compostos (`database-postgresql`).
4. **Enforcement**: repositório base, RLS, ou ambos (defesa em profundidade).
5. **Auditar** endpoints e cron sem filtro.
6. **Testes**: dois tenants, tentativa de acesso cruzado, IDOR por UUID.
7. **Documentar** exceções (super-admin, suporte) com trilha de auditoria.

## Boas práticas

- **RLS Postgres** como rede de segurança mesmo com ORM.
- **Connection pooling** por estratégia: schema-per-tenant pode exigir `search_path` por conexão.
- **Provisioning** idempotente de tenant (signup, trial).
- **Export/delete** por tenant (LGPD) planejado cedo.
- **Cache keys** sempre prefixados com `tenant_id`.

## Erros comuns

- Tenant no JWT mas query `WHERE id = $1` sem `tenant_id`.
- Admin panel reutilizando mesmas rotas sem guard.
- Background job usando “primeiro tenant do banco”.
- Subdomain spoofing sem validação de membership.
- Testes só com um tenant fixture.

## Exemplos práticos

**RLS (ilustrativo):**

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY orders_tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**Repositório (padrão):**

```typescript
async function getOrder(tenantId: string, orderId: string) {
  return db.orders.findFirst({
    where: { id: orderId, tenant_id: tenantId },
  });
}
```

**Middleware:**

```typescript
// tenantId derivado de sessão/JWT, não de body
req.context.tenantId = membership.tenantId;
```

## Critérios de qualidade

- Impossível (ou detectável em teste) ler/escrever outro tenant por ID válido.
- Estratégia documentada para backup, restore e offboarding.
- Performance aceitável com índice `(tenant_id, ...)`.
- Operações de suporte auditadas.

## Checklist de validação

- [ ] Middleware único define tenant confiável.
- [ ] Todas as queries/jobs com escopo de tenant.
- [ ] RLS ou equivalente em tabelas sensíveis quando aplicável.
- [ ] Testes cross-tenant negativos.
- [ ] Cache e filas namespaced.
- [ ] API não vaza existência indevida de recursos alheios.

## Skills relacionadas

- `authentication-authorization` — membership e roles por tenant.
- `database-postgresql` — colunas, FKs, RLS DDL.
- `database-optimization` — índices com `tenant_id` primeiro.
- `backend-engineering` — casos de uso e transações.
- `api-design` — contratos e códigos de erro.
- `maestro-core` — impacto em create/extend.