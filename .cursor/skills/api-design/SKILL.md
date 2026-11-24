---
name: api-design
description: >-
  Desenha APIs REST com recursos claros, códigos HTTP corretos, versionamento, paginação,
  idempotência e contratos estáveis. Use when criar ou alterar endpoints, DTOs públicos ou
  documentação de contrato. Do not use when o foco for só implementação interna de serviços
  (use backend-engineering) ou só otimização de queries (use database-optimization).
metadata:
  framework: maestro-engineering-skills
  category: backend
  version: "1.0.0"
---

# Design de API

## Objetivo

Definir interfaces HTTP previsíveis: nomes de recursos consistentes, semântica REST pragmática, respostas e erros uniformes, paginação obrigatória em listas, versionamento explícito e operações idempotentes onde o cliente pode repetir requisições.

## Quando ativar

- Novos endpoints ou mudança de payload/status que clientes consomem.
- Padronização de erros, paginação, filtros ou headers.
- Introdução de versionamento (`/v1`) ou depreciação.
- Design de operações com efeito colateral (POST de pagamento, webhook interno).

## Quando NÃO ativar

- Refatoração interna sem mudança de contrato.
- Modelagem apenas de banco → `database-postgresql`.
- Política de JWT/RBAC → `authentication-authorization`.
- Entrega de webhooks para sistemas externos → `integrations`.

## Contexto técnico necessário

- Rotas e middleware atuais; OpenAPI/Swagger se existir.
- Consumidores conhecidos (web, mobile, parceiros).
- Autenticação na borda (cookie, Bearer, API key).
- Limites de taxa e tamanho de payload.

## Regras obrigatórias

1. **Regras de negócio validadas no servidor** — API não substitui validação de domínio (`backend-engineering`).
2. **Nunca expor credenciais de DB ou segredos** em respostas, headers de debug ou erros 500.
3. **Listagens sempre paginadas** (cursor ou offset+limit com teto máximo).
4. **Códigos HTTP corretos**: 200/201/204, 400 validação, 401 não autenticado, 403 sem permissão, 404 recurso inexistente ou fora do escopo do tenant, 409 conflito, 422 semântica de domínio quando aplicável.
5. **Idempotency-Key** (ou equivalente) em POST que criam cobrança, pedido ou efeito financeiro.
6. **Versionamento** antes de breaking change; período de depreciação documentado.
7. **Contrato explícito**: tipos de campos, formatos de data (ISO 8601 UTC), enums fechados.

## Processo de execução

1. **Modelar recurso** (substantivos pluralizados, relações aninhadas só com profundidade razoável).
2. **Mapear verbos**: GET leitura, POST criação/ação, PATCH parcial, PUT substituição completa quando necessário, DELETE remoção lógica ou física conforme política.
3. **Definir request/response** e envelope de erro único.
4. **Paginação e filtros** (`?status=active&page[cursor]=...`).
5. **Alinhar status e corpo de erro** com implementação (`backend-engineering`).
6. **Documentar** breaking changes e migração para clientes.
7. **Validar** com checklist.

## Boas práticas

- **HATEOAS opcional**; links estáveis em listas grandes ajudam paginação por cursor.
- **POST /resources/{id}/actions/approve** para ações não-CRUD em vez de verbos na URL raiz.
- **ETag/If-Match** em updates concorrentes quando o domínio exige.
- **Campos somente leitura** (`createdAt`, `id`) claramente marcados no contrato.
- **Bulk** com limite de itens e resposta parcial documentada.

## Erros comuns

- 200 com `{ "error": "..." }` no corpo.
- Listar milhões de registros sem paginação.
- Usar 404 para “sem permissão” (prefira 403 ou 404 uniforme por tenant — ver `multi-tenancy`).
- Quebrar contrato sem bump de versão.
- Expor stack trace ou SQL em 500.

## Exemplos práticos

**Listagem paginada:**

```http
GET /v1/orders?limit=20&cursor=eyJpZCI6MTIzfQ
```

```json
{
  "data": [{ "id": "ord_1", "status": "paid" }],
  "meta": { "next_cursor": "eyJpZCI6MTQ1fQ", "has_more": true }
}
```

**Erro padronizado:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "fields": [{ "path": "email", "code": "INVALID_FORMAT" }]
  }
}
```

**Idempotência:**

```http
POST /v1/payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

## Critérios de qualidade

- Cliente consegue integrar só com documentação e exemplos.
- Sem ambiguidade entre 401 e 403.
- Operações sensíveis repetíveis sem duplicar efeito.
- Listas bounded; filtros indexáveis (coordenar com `database-optimization`).

## Checklist de validação

- [ ] Recursos e métodos alinhados a REST pragmático.
- [ ] Paginação e limites máximos definidos.
- [ ] Status codes e corpo de erro consistentes.
- [ ] Versionamento ou plano de depreciação para mudanças breaking.
- [ ] Idempotência em writes críticos.
- [ ] Validação e autorização descritas (não só no FE).

## Skills relacionadas

- `backend-engineering` — implementação de handlers e domínio.
- `authentication-authorization` — auth na API.
- `multi-tenancy` — escopo de dados por tenant nas rotas.
- `database-optimization` — filtros e índices para query params.
- `integrations` — APIs de saída e webhooks.
- `maestro-core` — sequenciamento de entrega.