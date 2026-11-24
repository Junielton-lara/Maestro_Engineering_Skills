---
name: security-engineering
description: >-
  Aplica defesa em profundidade no código e na configuração: OWASP, segredos, validação de entrada,
  autorização, headers e risco de dependências. Use when implementar auth, exposição de dados,
  validação, revisão de superfície de ataque ou hardening. Do not use when o escopo for só testes
  funcionais (testing-qa) ou só pipeline CI (ci-cd).
metadata:
  framework: maestro-engineering-skills
  category: quality
  version: "1.0.0"
---

# Engenharia de Segurança

## Objetivo

Reduzir risco de vulnerabilidades com controles verificáveis: validação e sanitização na borda, princípio do menor privilégio, segredos fora do código, respostas que não vazam stack ou dados sensíveis.

## Quando ativar

- Novos endpoints, formulários, uploads ou integrações que aceitam entrada externa.
- Fluxos de login, sessão, JWT, permissões ou multi-tenant.
- Exposição de APIs, webhooks ou painéis administrativos.
- Auditoria pré-deploy, resposta a incidente ou hardening após scan (SAST/dependabot).

## Quando NÃO ativar

- Ajuste visual ou copy sem impacto em dados ou autenticação.
- Performance pura sem superfície de ataque nova → `performance-optimization`.
- Configuração de servidor genérica sem política de segurança → combinar com `nginx-configuration` / `linux-server-management`.
- Revisão de estilo/clean code sem foco em risco → `code-review` (com lente de segurança opcional).

## Contexto técnico necessário

- Modelo de autenticação/autorização atual (sessão, OAuth, API keys).
- Onde entram dados (HTTP, filas, CLI, jobs) e o que é persistido.
- Gestão de segredos (.env, vault, CI secrets).
- Dependências críticas e política de atualização.

## Regras obrigatórias

1. **Validar e limitar toda entrada** no servidor (tipo, tamanho, formato, allowlist).
2. **Autorizar por recurso**, não só “usuário logado”; negar por padrão.
3. **Nunca commitar** tokens, senhas, chaves privadas ou `.env` reais.
4. **Nunca logar** senhas, tokens completos, PAN, ou PII desnecessária.
5. **Escapar/sanitizar** ao renderizar conteúdo não confiável (XSS).
6. **Parametrizar queries**; proibir concatenação SQL com entrada do usuário.
7. **Headers de segurança** na borda quando aplicável (CSP, HSTS, X-Frame-Options).
8. **Sem comandos destrutivos** em produção sem autorização explícita do usuário.

## Processo de execução

1. **Mapear superfície**: rotas, uploads, SSR, redirects, callbacks OAuth.
2. **Classificar dados** (público, interno, sensível, regulado).
3. **OWASP quick pass** (checklist abaixo) por fluxo alterado.
4. **Implementar controles** com diff mínimo; manter compatibilidade de API quando possível.
5. **Revisar dependências** novas ou atualizadas (CVE conhecido? alternativa?).
6. **Documentar** decisões de authz e rotação de segredos se mudarem.

### Checklist OWASP-minded (por mudança)

| Área | Verificar |
|------|-----------|
| A01 Broken Access Control | IDOR, escalação horizontal/vertical, admin escondido |
| A02 Cryptographic Failures | TLS em trânsito, hashing de senha (argon2/bcrypt), não armazenar segredo em texto plano |
| A03 Injection | SQL/NoSQL, command, LDAP, template injection |
| A04 Insecure Design | rate limit, anti-enumeration, idempotência em pagamentos |
| A05 Security Misconfiguration | debug off em prod, defaults perigosos, CORS `*` com credenciais |
| A06 Vulnerable Components | lockfile, auditoria de pacote |
| A07 Auth Failures | brute force, sessão inválida, logout, refresh token |
| A08 Software/Data Integrity | CI confiável, assinatura de artefatos quando existir |
| A09 Logging/Monitoring | eventos de segurança sem vazar segredo |
| A10 SSRF | URLs fornecidas pelo usuário em fetch server-side |

## Boas práticas

- **CSRF** em sessões cookie-based; **SameSite** + tokens quando padrão do framework.
- **Rate limiting** em login, reset de senha e endpoints caros.
- **CSP** restritiva iterativa (não bloquear app legado de uma vez sem teste).
- **Secrets**: rotação documentada; princípio 12-factor → `environment-configuration`.
- **Princípio do menor privilégio** em DB user, IAM e tokens de CI.

## Erros comuns

- Confiar em `role` no JWT sem consultar permissão atual no servidor.
- Validar só no frontend ou confiar em hidden fields.
- Retornar diferença de timing/mensagem que permite enumeração de usuários.
- `Access-Control-Allow-Origin: *` com `credentials: true`.
- Expor stack trace ou versão de libs em produção.

## Exemplos práticos

**Autorização por recurso:**
```
Usuário autenticado ≠ autorizado: sempre checar tenant_id/org_id na query
e política (RBAC/ABAC) antes de update/delete.
```

**Redirect seguro:** allowlist de hosts de destino; rejeitar `//evil.com` e esquemas não-HTTP(S).

**Upload:** validar MIME e extensão, tamanho máximo, armazenar fora do webroot, sem execução.

## Critérios de qualidade

- Cada fluxo novo tem validação server-side e decisão de authz explícita.
- Segredos só em canais apropriados; exemplo em `.env.example` sem valores reais.
- Nenhum dado sensível em URL, logs ou mensagem de erro ao cliente.
- Dependências novas justificadas e auditadas.

## Checklist de validação

- [ ] Entrada validada na borda com limites claros
- [ ] Authz testada para usuário não autorizado e outro tenant
- [ ] Sem segredos no diff ou em logs previstos
- [ ] Queries parametrizadas / ORM seguro
- [ ] Headers/cookies com flags seguros (Secure, HttpOnly quando aplicável)
- [ ] CORS e redirects revisados
- [ ] `npm audit` / equivalente consultado para mudanças de deps

## Skills relacionadas

- `authentication-authorization` — desenho de login e permissões (se existir no catálogo)
- `error-handling` — respostas de erro sem vazamento
- `code-review` — revisão com severidade
- `environment-configuration` — gestão de `.env` e segredos
- `nginx-configuration` — TLS e headers na borda
- `automated-testing` — testes de segurança em fluxos críticos