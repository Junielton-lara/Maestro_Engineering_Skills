# Deploy — [Nome]

> Skills: `hostinger-deployment`, `devops-infrastructure`, `nginx-configuration`, `ci-cd`, `backup-recovery`.

## Ambiente detectado

| Item | Valor |
|------|-------|
| Provedor | Hostinger VPS / outro |
| SO | Ubuntu … |
| App runtime | Node / Docker / outro |
| Processo | PM2 / systemd / compose |
| Proxy | Nginx |
| Banco | PostgreSQL local/remoto |
| Domínio | |
| TLS | Let’s Encrypt / outro |

## Pré-requisitos

- [ ] DNS apontando
- [ ] Acesso SSH (usuário e chave)
- [ ] Firewall: 22/80/443
- [ ] Backup recente do DB
- [ ] Variáveis de produção preparadas (fora do repo)

## Procedimento de deploy

1. …
2. …
3. Health check:
4. Smoke dos fluxos P0:

## Nginx (resumo)

- `server_name`:
- Upstream:
- Cert path:

## Rollback

1. Gatilho (ex.: health falhou / erro crítico):
2. Passos:
3. Validação pós-rollback:

## Migrations

- Comando:
- Backup antes:
- Rollback de migration (se possível):

## Monitoramento pós-deploy

- Logs:
- Health endpoint:
- Alertas:

## Contatos

| Papel | Contato |
|-------|---------|
| On-call | |
