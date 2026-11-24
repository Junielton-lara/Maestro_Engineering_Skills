---
name: hostinger-deployment
description: >-
  Deploy e operação em VPS Hostinger (Ubuntu): SSH, Nginx, Node (PM2 opcional), Docker opcional,
  PostgreSQL, HTTPS, firewall, proxy reverso, deploy/rollback — sempre detectando setup existente
  primeiro. Use when publicar ou manter app na Hostinger. Do not use for generic cloud unrelated to
  Hostinger VPS or when only editing app code without infra.
metadata:
  framework: maestro-engineering-skills
  category: infra
  version: "1.0.0"
---

# Deploy na Hostinger (VPS)

## Objetivo

Colocar ou atualizar aplicações em VPS Hostinger com caminho seguro: descobrir o que já está instalado, reutilizar Nginx/PM2/Docker/DB existentes, HTTPS válido e rollback possível.

## Quando ativar

- Novo projeto na VPS Hostinger.
- Trocar domínio, certificado ou upstream.
- App Node/API + PostgreSQL na mesma VPS ou DB gerenciado.
- Incidente pós-deploy (502, disco, processo caído).

## Quando NÃO ativar

- Infra em outro provedor sem VPS Hostinger → `devops-infrastructure`.
- Apenas ajuste de pipeline CI → `ci-cd`.
- Só hardening SSH genérico → `linux-server-management`.

## Contexto técnico necessário

- IP/host SSH, usuário (não assumir `root`), chave ou senha (preferir chave).
- Painel Hostinger: DNS apontando para VPS, snapshots se disponíveis.
- Repo, branch de deploy, comando de build/start.
- Variáveis de produção (sem colar segredos no chat).

## Regras obrigatórias

1. **Detectar primeiro**: Nginx ativo? PM2/listen port? Docker compose? Postgres local/remoto?
2. **Não impor stack**: PM2 e Docker são opcionais conforme projeto.
3. **HTTPS obrigatório** em produção (Let’s Encrypt ou cert existente).
4. **Firewall** (ufw): 22, 80, 443 — demais fechados salvo necessidade documentada.
5. **Deploy atômico** preferível (nova pasta + symlink ou nova tag de imagem).
6. **Rollback** definido antes de trocar release em produção.
7. **Sem** `DROP DATABASE`, apagar ` /var/www`, ou `docker system prune -a` sem autorização explícita.

## Processo de execução

### Fase 0 — Discovery (obrigatória)

1. Conectar SSH (usuário com sudo se necessário).
2. Verificar: `nginx -t`, sites em `/etc/nginx/sites-enabled/`, processos (node, pm2, docker).
3. Localizar app (`/var/www`, `/home/*/app`, compose path).
4. Checar PostgreSQL (local `psql` ou `DATABASE_URL` remota).
5. Checar certificados (`/etc/letsencrypt/live/`).
6. Registrar versão em produção (git SHA, tag de imagem).

### Fase 1 — Preparar release

1. Build no CI ou na VPS (preferir artefato do CI → `ci-cd`).
2. Migrar DB se houver (backup antes → `backup-recovery`).
3. `.env` produção fora do repo → `environment-configuration`.

### Fase 2 — Proxy e app

1. Nginx `server_name` + `proxy_pass` para upstream (socket ou porta).
2. Headers: `X-Forwarded-*`, timeouts, `client_max_body_size` se upload.
3. Iniciar app: systemd, PM2, ou `docker compose up -d` conforme detectado.
4. Validar health local (`curl 127.0.0.1:PORT/health`).

### Fase 3 — Go-live e rollback

1. Recarregar Nginx (`nginx -s reload`) após testar config.
2. Smoke HTTPS + fluxo crítico.
3. **Rollback**: apontar symlink upstream antigo / `pm2 resurrect` anterior / `compose` imagem anterior.

## Boas práticas

- **DNS**: TTL baixo antes de cutover; testar com `/etc/hosts` opcional.
- **Node**: `NODE_ENV=production`; usuário não-root para processo.
- **PostgreSQL**: usuário app com privilégio mínimo; não expor 5432 publicamente.
- **Logs**: journald, PM2 logs, ou driver json-file com rotação.
- **Snapshot Hostinger** antes de mudanças estruturais.

## Erros comuns

- Instalar segundo Nginx/Caddy sem desativar o primeiro.
- `proxy_pass` sem trailing slash correto → rotas 404.
- Esquecer `ufw enable` após abrir portas.
- Build na VPS em máquina pequena (OOM).
- Certificado Let’s Encrypt sem renovação (`certbot timer`).

## Exemplos práticos

**Node + PM2 + Nginx:** app em `:3000`, Nginx 443 → proxy; PM2 `ecosystem` com `cwd` e `env_file`.

**Docker:** compose na VPS; Nginx proxy para `127.0.0.1:8080`; volumes para uploads/DB data.

**Rollback:** manter `releases/20251124-1430`; symlink `current` volta para release anterior.

## Critérios de qualidade

- Discovery documentada no PR/runbook.
- HTTPS válido, redirect HTTP→HTTPS.
- Health check responde 200.
- Rollback testado ou scriptificado.
- Segredos só em servidor/CI, nunca no repositório.

## Checklist de validação

- [ ] Setup existente mapeado (Nginx/PM2/Docker/DB)
- [ ] Backup/migração segura se DB mudou
- [ ] Firewall e portas mínimas
- [ ] Nginx `nginx -t` OK
- [ ] App reinicia após reboot (systemd/PM2/docker restart policy)
- [ ] Smoke pós-deploy + plano de rollback
- [ ] Renovação TLS ativa

## Skills relacionadas

- `devops-infrastructure` — visão geral de infra
- `nginx-configuration` — vhosts e TLS
- `linux-server-management` — usuários e SSH
- `docker-management` — se usar containers
- `environment-configuration` — `.env` produção
- `backup-recovery` — dump antes de migrate
- `observability` — health e logs pós-deploy
- `ci-cd` — artefatos e deploy remoto