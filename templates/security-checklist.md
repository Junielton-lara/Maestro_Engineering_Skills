# Checklist de Segurança — [Nome]

> Usar com `security-engineering`, `authentication-authorization`, `multi-tenancy`.

## Segredos e configuração

- [ ] Nenhum segredo commitado (`.env` no `.gitignore`)
- [ ] Secrets só em ambiente/CI/cofre
- [ ] Rotação documentada para chaves críticas
- [ ] Credenciais de DB não expostas ao cliente

## Autenticação

- [ ] Senhas com hash forte (nunca plaintext)
- [ ] Cookies de sessão: HttpOnly, Secure, SameSite adequado
- [ ] Tokens com expiração e invalidação claras
- [ ] Proteção contra brute force / rate limit em login

## Autorização

- [ ] Checagem no servidor em toda mutação
- [ ] Princípio do menor privilégio
- [ ] IDs de recurso não autorizam só por “conhecer o UUID”
- [ ] Isolamento multi-tenant em todas as queries

## Entrada e saída

- [ ] Validação server-side de todos os inputs
- [ ] Proteção XSS (encoding/CSP conforme stack)
- [ ] Queries parametrizadas (sem concatenar SQL)
- [ ] Upload com tipo/tamanho e storage seguro

## Transporte e headers

- [ ] HTTPS em produção
- [ ] Headers de segurança básicos (HSTS, X-Content-Type-Options, etc.)
- [ ] CORS restrito aos origins necessários

## Dependências e infra

- [ ] Dependências sem CVEs críticos conhecidos (ou risco aceito)
- [ ] Portas mínimas no firewall
- [ ] PostgreSQL não exposto publicamente
- [ ] Logs sem PII/segredos

## Incidentes

- [ ] Contato / canal de incidente
- [ ] Plano de rotação de secrets
- [ ] Backup recente testável
