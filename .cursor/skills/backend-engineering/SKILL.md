---
name: backend-engineering
description: >-
  Estrutura serviços backend em camadas/módulos com validação no servidor, erros padronizados,
  transações e reutilização de domínio. Use when implementar ou refatorar lógica de negócio,
  handlers, serviços e repositórios. Do not use when o escopo for só documentação de API (use
  api-design) ou só DDL/índices (use database-postgresql / database-optimization).
metadata:
  framework: maestro-engineering-skills
  category: backend
  version: "1.0.0"
---

# Engenharia de Backend

## Objetivo

Entregar código backend coeso: limites claros entre entrada (HTTP/mensagens), aplicação (casos de uso), domínio e persistência; validação e regras de negócio apenas no servidor; falhas previsíveis com transações onde houver escrita correlacionada.

## Quando ativar

- Novo módulo, serviço, caso de uso ou endpoint que altera estado.
- Refatoração de “god service”, controllers gordos ou lógica espalhada.
- Padronização de erros, validação ou padrão de transação.
- Correção de bug causada por regra validada só no cliente.

## Quando NÃO ativar

- Somente desenho de contrato REST/OpenAPI sem implementação → `api-design`.
- Somente schema, migração ou índice → `database-postgresql` / `database-optimization`.
- Apenas fluxo de login/permissões → `authentication-authorization`.
- Integração com terceiro (webhook, fila) sem mudança estrutural interna → `integrations`.

## Contexto técnico necessário

- Layout atual (`src/`, `modules/`, `packages/`) e convenções de nomes.
- Onde ficam DTOs, entidades, repositórios e middleware.
- Estratégia de ORM/query e como migrations são aplicadas.
- Padrão de erros e logging existente.

## Regras obrigatórias

1. **Nunca confiar em validação só no frontend** — tipos, limites e invariantes de negócio no servidor.
2. **Nunca expor credenciais, connection strings ou SQL bruto ao cliente**.
3. **Inspecionar arquitetura existente** antes de criar módulos paralelos; estender o que já existe.
4. **Transações** para operações que precisam ser atômicas (múltiplas escritas relacionadas).
5. **Reutilizar** funções de domínio; não duplicar regras em handlers diferentes.
6. **Fail fast** na entrada com validação síncrona; erros de domínio mapeados para respostas estáveis.
7. **Evitar N+1** na camada que orquestra persistência; delegar otimização a repositórios conscientes.

## Processo de execução

1. **Mapear fluxo**: entrada → caso de uso → domínio → persistência → resposta/erro.
2. **Ler módulos vizinhos** e copiar padrões (injeção, testes, nomenclatura).
3. **Definir invariantes** de negócio e onde validar (domínio vs borda).
4. **Implementar** com diff mínimo; interfaces estáveis na borda pública.
5. **Transação**: delimitar escopo no serviço/aplicação, não espalhar `begin` em controllers.
6. **Testes** nos casos de uso críticos (mocks de repositório quando existir padrão).
7. **Revisar** com checklist de validação.

## Boas práticas

- **Camadas**: handler fino; caso de uso orquestra; domínio puro quando possível.
- **Erros**: hierarquia (`ValidationError`, `NotFound`, `Conflict`) + código/campo para clientes.
- **Idempotência** quando o mesmo comando puder ser reenviado (coordenar com `api-design`).
- **Observabilidade**: correlation ID propagado; log sem PII/senhas.
- **Feature flags** só na borda; regra de negócio não depende de flag sem default seguro.

## Erros comuns

- Regra de negócio duplicada no controller e no service.
- Transação aberta durante chamada HTTP externa (lock longo).
- Retornar exceção de ORM/stack trace ao cliente.
- Criar `utils/` genérico em vez de estender módulo existente.
- Validar tenant só no JWT sem filtro na query (ver `multi-tenancy`).

## Exemplos práticos

**Serviço com transação (pseudocódigo):**

```typescript
async function createOrder(cmd: CreateOrderCmd, ctx: TxContext) {
  return ctx.transaction(async (tx) => {
    const items = await catalog.validateItems(cmd.lines, tx);
    const order = Order.create(cmd.customerId, items);
    await orders.save(order, tx);
    await inventory.reserve(order.lines, tx);
    return order.id;
  });
}
```

**Validação na borda + domínio:**

```typescript
if (cmd.amount <= 0) throw new ValidationError("amount", "INVALID");
const payment = Payment.charge(cmd); // regras de moeda/limites no domínio
```

## Critérios de qualidade

- Handlers sem SQL ou regra de negócio pesada.
- Escritas correlacionadas dentro de uma transação testável.
- Erros documentados e mapeados para status HTTP corretos (`api-design`).
- Código alinhado à estrutura do repositório, sem dependências circulares.

## Checklist de validação

- [ ] Regras críticas cobertas no servidor (não só no FE).
- [ ] Sem vazamento de segredos em logs/respostas.
- [ ] Transação delimitada onde há múltiplas escritas.
- [ ] Sem N+1 óbvio nas listagens alteradas.
- [ ] Testes ou plano manual para happy path + falhas de domínio.
- [ ] Skills filhas consultadas se API/DB/auth/tenant mudaram.

## Skills relacionadas

- `api-design` — contratos HTTP e status.
- `database-postgresql` — schema e migrações.
- `database-optimization` — índices e EXPLAIN.
- `multi-tenancy` — isolamento por tenant.
- `authentication-authorization` — identidade e permissões.
- `integrations` — chamadas externas e webhooks.
- `maestro-core` — orquestração entre skills.