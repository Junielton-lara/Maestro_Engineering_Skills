# Checklist de publicação

## Antes do commit

- [ ] Sem `.env`, chaves, certificados ou PII no diff
- [ ] `.env.example` atualizado (valores vazios)
- [ ] Lint/testes do escopo executados ou falha relatada
- [ ] Review Critical resolvido ou aceito pelo dono

## Antes do push (autorização explícita)

- [ ] Branch correta
- [ ] Mensagem de commit clara
- [ ] Sem force-push em main/master sem pedido explícito

## Antes do deploy (autorização explícita)

- [ ] Backup/migrate plan se DB
- [ ] Health check definido
- [ ] Rollback definido
- [ ] Secrets só no ambiente/CI
