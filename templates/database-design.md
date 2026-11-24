# Desenho de Banco — [Nome]

> Alinhar com `database-postgresql`, `database-optimization`, `multi-tenancy`.

## Visão geral

- SGBD: PostgreSQL
- Ferramenta de migrations:
- Convenções de nomenclatura:

## Entidades

| Tabela | Descrição | Tenant? |
|--------|-----------|---------|
| | | |

## Relacionamentos

```text
users 1—N orders
...
```

## Constraints e integridade

- PKs / FKs:
- UNIQUE / CHECK:
- Soft delete vs hard delete:

## Índices planejados

| Tabela | Índice | Colunas | Motivo |
|--------|--------|---------|--------|
| | | | |

## Multi-tenancy

- Estratégia: coluna `tenant_id` | schema | DB
- Garantias (todo SELECT/UPDATE/DELETE filtrado):
- Testes de vazamento cross-tenant:

## Paginação e listas

- Estratégia padrão (keyset / offset):
- Limites máximos:

## Auditoria

- Campos `created_at` / `updated_at` / `created_by`:
- Tabelas de audit (se houver):

## Migrations

| # | Nome | Risco | Rollback |
|---|------|-------|----------|
| | | | |

## Backup e restore (resumo)

- Frequência:
- Retenção:
- Ver `templates/deployment.md` e skill `backup-recovery`
