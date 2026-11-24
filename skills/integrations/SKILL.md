---
name: integrations
description: >-
  Integra sistemas externos com webhooks, retries, idempotência, segredos seguros, timeouts e
  padrões de circuit breaker em alto nível. Use when consumir ou expor APIs de terceiros, filas ou
  callbacks. Do not use when mudança for só lógica interna sem IO externo (use backend-engineering)
  ou só modelagem de DB (use database-postgresql).
metadata:
  framework: maestro-engineering-skills
  category: backend
  version: "1.0.0"
---

# Integrações

## Objetivo

Conectar serviços de forma resiliente: contratos claros, autenticação de ponta a ponta, timeouts explícitos, retentativas com backoff, chaves de idempotência, verificação de assinatura em webhooks e degradação controlada (circuit breaker) sem espalhar credenciais no código ou no cliente.

## Quando ativar

- Cliente HTTP/SDK para PSP, ERP, email, storage.
- Recebimento de webhooks ou eventos assíncronos.
- Fila/outbox para entrega confiável.
- Falhas intermitentes, duplicação de eventos ou SLA de parceiro.

## Quando NÃO ativar

- Refatoração interna sem boundary externo.
- Design de REST próprio → `api-design`.
- Login OIDC do usuário final → `authentication-authorization` (complementar).

## Contexto técnico necessário

- Documentação do parceiro, ambientes sandbox/prod.
- Onde guardar secrets (vault, env, KMS).
- Política de retry e DLQ existente.
- Idempotência já exigida pelo domínio (`backend-engineering`).

## Regras obrigatórias

1. **Secrets só no servidor** — nunca no frontend, mobile embutido ou repo.
2. **Validação de negócio no servidor** após receber webhook (não confiar só no payload).
3. **Timeout** em toda chamada outbound; cancelar corpo se suportado.
4. **Retries** só em erros transitórios (5xx, rede); não em 4xx de validação.
5. **Idempotency-Key** / dedupe store para POST e processamento de webhooks.
6. **Assinatura HMAC** (ou mTLS) em webhooks inbound; rejeitar replay antigo (timestamp).
7. **Transações locais** curtas: persistir outbox/evento antes de acknowledge quando necessário.

## Processo de execução

1. **Definir boundary**: adapter isolado, interface interna estável.
2. **Mapear endpoints**, limites de taxa e códigos de erro do parceiro.
3. **Configurar** secrets via env/vault; rotacionar sem redeploy se possível.
4. **Implementar** cliente com timeout, retry policy e logging redigido.
5. **Webhooks**: rota dedicada, raw body para verify, resposta rápida 2xx após enfileirar.
6. **Circuit breaker** (contagem de falhas → open → half-open) em integrações críticas.
7. **Testes** com sandbox, stubs e cenários de duplicata.

## Boas práticas

- **Outbox pattern**: gravar evento na mesma TX do domínio; worker envia.
- **Exponential backoff + jitter**; max attempts documentado.
- **DLQ** com alerta; reprocessamento manual auditado.
- **Versionar** payloads de webhook internos.
- **Feature flag** para desligar integração sem derrubar app inteiro.

## Erros comuns

- Retry infinito em 401 (credencial errada).
- ACK webhook antes de persistir (perda em crash).
- Processar mesmo `event_id` duas vezes sem idempotência.
- Chamar parceiro dentro de transação DB longa.
- Logar body completo com PII ou tokens.

## Exemplos práticos

**Cliente com timeout e retry (conceitual):**

```typescript
await http.post(url, body, {
  timeout: 8_000,
  headers: { Authorization: `Bearer ${secret}`, "Idempotency-Key": key },
  retry: { attempts: 3, retryOn: [502, 503, 504] },
});
```

**Webhook verify:**

```typescript
const sig = hmacSha256(rawBody, webhookSecret);
if (!timingSafeEqual(sig, headerSig)) throw new UnauthorizedError();
if (Math.abs(now - event.timestamp) > 300) throw new BadRequestError("STALE");
```

**Tabela de idempotência:**

```sql
CREATE TABLE integration_idempotency (
  key         text PRIMARY KEY,
  response    jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

## Critérios de qualidade

- Falha do parceiro não corrompe estado local (compensação ou retry seguro).
- Duplicatas não duplicam efeito financeiro.
- Observabilidade: latência, taxa de erro, fila DLQ.
- Segredos fora do código; rotação testada.

## Checklist de validação

- [ ] Timeouts e limites de retry configurados.
- [ ] Idempotência em writes e webhooks.
- [ ] Verificação de assinatura em inbound.
- [ ] Sem secrets em logs/repos/cliente.
- [ ] Circuit breaker ou fallback documentado.
- [ ] Alinhado com `api-design` se expõe endpoint público.

## Skills relacionadas

- `backend-engineering` — adapters e transações.
- `api-design` — endpoints de webhook expostos.
- `authentication-authorization` — OAuth, API keys.
- `database-postgresql` — outbox, idempotency tables.
- `database-optimization` — índices em filas de eventos.
- `multi-tenancy` — eventos escopados por tenant.
- `maestro-core` — coordenação em entregas com parceiros.