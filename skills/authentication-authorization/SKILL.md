---
name: authentication-authorization
description: >-
  Implementa autenticação segura (sessão, JWT, cookies) e autorização (RBAC, permissões, least
  privilege) no servidor. Use when login, tokens, roles, políticas de acesso ou hardening de
  sessão. Do not use when o problema for só filtro SQL por tenant (use multi-tenancy) ou desenho
  de rotas públicas (use api-design).
metadata:
  framework: maestro-engineering-skills
  category: backend
  version: "1.0.0"
---

# Autenticação e Autorização

## Objetivo

Estabelecer identidade confiável na borda e permissões explícitas no servidor: credenciais nunca vazam ao cliente, tokens com vida curta quando stateless, cookies com flags seguras, e cada ação verificada contra política (RBAC/ABAC) antes de tocar dados ou integrações.

## Quando ativar

- Login, registro, refresh, logout, MFA.
- Proteção de rotas e escopos de API.
- Modelagem de roles/permissões ou mudança de política.
- Incidente de sessão fixation, token leakage ou escalada de privilégio.

## Quando NÃO ativar

- Isolamento de dados entre organizações → `multi-tenancy` (complementar, não substituir).
- Contrato HTTP sem mudança de auth → `api-design`.
- OAuth com parceiro e retries → `integrations`.

## Contexto técnico necessário

- Estratégia atual: session store, JWT, OIDC, API keys.
- HTTPS obrigatório; domínios e SameSite para cookies.
- Onde permissões são checadas (middleware, guard, policy engine).
- Requisitos de auditoria e revogação.

## Regras obrigatórias

1. **Validação sempre no servidor** — não confiar em claims do cliente sem verificar assinatura/sessão.
2. **Nunca expor** secrets, refresh tokens em URLs, ou hashes de senha em respostas/logs.
3. **Least privilege** — permissões granulares; default deny.
4. **Senhas**: argon2/bcrypt; nunca plaintext; rate limit e lockout em login.
5. **JWT**: expiração curta, audience/issuer, rotação de refresh; preferir denylist ou sessão server-side para revogação imediata quando exigido.
6. **Cookies**: `HttpOnly`, `Secure`, `SameSite=Lax/Strict` conforme fluxo.
7. **Autorização após autenticação** — 401 vs 403 corretos (`api-design`).

## Processo de execução

1. **Mapear atores** (usuário, serviço, admin) e recursos protegidos.
2. **Escolher mecanismo** alinhado ao projeto (não trocar stack sem motivo).
3. **Modelar permissões** (roles + overrides por tenant se SaaS).
4. **Implementar guards** centralizados; evitar `if (isAdmin)` espalhado.
5. **Revisar rotas** novas e jobs com o mesmo guard.
6. **Testes**: não autenticado, autenticado sem role, role correta, IDOR.
7. **Documentar** fluxos e rotação de chaves.

## Boas práticas

- **Permission como string estável** `orders:read`, checada no caso de uso.
- **Separar authentication** (quem é) de **authorization** (o que pode).
- **Service accounts** com escopo mínimo e rotação.
- **MFA** para admin e ações sensíveis.
- **Correlação** userId/tenantId em logs sem PII desnecessária.

## Erros comuns

- JWT no localStorage para app com XSS surface ampla (avaliar cookie HttpOnly).
- Confundir “autenticado” com “pode acessar recurso de outro usuário”.
- Permissão só no frontend.
- Refresh token sem binding ou rotação.
- API key com permissões de admin em integração.

## Exemplos práticos

**Checagem no caso de uso:**

```typescript
async function cancelOrder(ctx: AuthContext, orderId: string) {
  requirePermission(ctx, "orders:cancel");
  const order = await orders.get(ctx.tenantId, orderId);
  if (!order) throw new NotFoundError();
  // ...
}
```

**Cookie de sessão (atributos conceituais):**

```http
Set-Cookie: sid=...; Path=/; HttpOnly; Secure; SameSite=Lax
```

**RBAC simples (SQL seed):**

```sql
INSERT INTO role_permissions (role, permission) VALUES
  ('member', 'orders:read'),
  ('admin', 'orders:cancel');
```

## Critérios de qualidade

- Nenhuma rota mutável sem authz explícita.
- Tokens/sessões revogáveis conforme requisito.
- Política testada para escalada negativa.
- Sem segredos em repositório; rotação documentada.

## Checklist de validação

- [ ] Login e refresh com rate limiting.
- [ ] 401/403 corretos e consistentes.
- [ ] Permissões no servidor em todos os writes.
- [ ] Cookies/tokens com flags e TTL adequados.
- [ ] Integração com `multi-tenancy` (membership).
- [ ] Logs sem credenciais.

## Skills relacionadas

- `multi-tenancy` — escopo organizacional.
- `api-design` — contratos e headers.
- `backend-engineering` — guards e domínio.
- `integrations` — OAuth client, API keys de parceiros.
- `maestro-core` — priorização em incidentes de segurança.