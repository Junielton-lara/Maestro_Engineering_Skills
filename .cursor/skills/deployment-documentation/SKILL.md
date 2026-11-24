---
name: deployment-documentation
description: >-
  Documents deployment for Hostinger/VPS and similar: env vars, build, health checks, rollback,
  and monitoring. Use when shipping to staging/prod, changing infra, or onboarding DevOps. Do not
  use for local-only dev setup without deploy path, or to document secret values inline.
metadata:
  framework: maestro-engineering-skills
  category: docs
  version: "1.0.0"
---

# Deployment Documentation

## Objetivo

Descrever como o software é construído, configurado, publicado e revertido em ambientes reais — com foco em Hostinger, VPS Linux e padrões CI/CD comuns.

## Quando ativar

- Primeiro deploy ou mudança de pipeline.
- Novas variáveis de ambiente ou serviços (DB, Redis, worker).
- Migração entre shared hosting e VPS (ou containers).
- Pós-implementação que exige runbook de release.

## Quando NÃO ativar

- Desenvolvimento local apenas (cobrir brevemente no README, skill opcional).
- Valores de secrets — documentar **nomes** e **onde setar**, nunca valores.

## Contexto técnico necessário

- Stack de build (Node, Python, Docker, estático).
- Onde roda: Hostinger (hPanel), VPS (SSH, systemd/Docker), reverse proxy (Nginx/Caddy).
- Branch → ambiente; migrações de DB; jobs em background.
- Monitoring/alertas existentes ou `[A DEFINIR]`.

## Regras obrigatórias

1. Cada ambiente tem **matriz de env vars** (nome, obrigatório, exemplo fake, efeito).
2. Procedimento **deploy** e **rollback** testáveis — passo a passo numerado.
3. **Health checks** e smoke tests pós-deploy documentados.
4. Backups e ordem: migração → app → workers → limpar cache se necessário.
5. Compatível com `project-handoff` — sem secrets no git.
6. Registrar downtime esperado e janela de manutenção.

## Processo de execução

1. **Inventário de runtime** — processos, portas, domínios, TLS.
2. **Build** — comandos, artefatos, cache CI.
3. **Config** — `.env.example` sincronizado com doc.
4. **Deploy path** — escolher modelo (tabela) e detalhar.
5. **Migrações** — ordem, lock, fallback.
6. **Verificação** — health URL, logs, métrica chave.
7. **Rollback** — imagem/tag anterior, down migration policy, feature flags.
8. **Monitoramento** — onde ver erro 5xx, disco, certificado SSL.
9. Linkar em `technical-documentation` e handoff.

### Modelos comuns

| Ambiente | Padrão | Notas |
|----------|--------|-------|
| Hostinger shared | FTP/Git deploy + PHP/Node conforme plano | limites de processo, cron no painel |
| Hostinger VPS | SSH, Docker ou systemd, Nginx reverse proxy | firewall ufw, fail2ban |
| CI → VPS | GitHub Actions rsync/scp ou SSH deploy key | secrets no GitHub Environments |

### Health check mínimo

- `GET /health` → 200 + versão/commit
- Conexão DB leve (ping)
- Fila opcional: depth abaixo de threshold

### Rollback (esqueleto)

1. Identificar release anterior (tag/commit).
2. Pausar workers se necessário.
3. Reverter artefato ou `git checkout` tag + rebuild.
4. Rollback migração **somente** se reversível e aprovado.
5. Smoke test + monitorar 15–30 min.

## Boas práticas

- Blue/green ou canary quando VPS permitir; senão deploy em janela + backup.
- Logs centralizados ou `journalctl -u app -f` documentado.
- Renovação TLS automática (Certbot) com verificação mensal.

## Erros comuns

- Deploy manual não documentado (“só eu sei”).
- Migração destrutiva sem backup.
- Health check que não valida DB.
- Variável só em prod sem espelho em staging.

## Exemplos práticos

**Env** — `APP_URL` obrigatório; exemplo `https://staging.example.com`; usado em links de e-mail.

**Hostinger cron** — `*/5 * * * * cd /home/user/app && php artisan schedule:run` no hPanel.

## Critérios de qualidade

- Outro dev repete deploy em staging sem perguntar.
- Rollback exercitado pelo menos uma vez antes de prod.
- `.env.example` = conjunto de vars da doc.

## Checklist de validação

- [ ] Build e artefato claros
- [ ] Matriz de env por ambiente
- [ ] Passos deploy + rollback
- [ ] Health/smoke definidos
- [ ] Backup antes de migração citado
- [ ] Sem valores secretos
- [ ] Links para `project-handoff`

## Skills relacionadas

- `maestro-core` — deploy como etapa final de `create`
- `project-planning` — marcos de release
- `technical-documentation` — índice e ADR de infra
- `project-handoff` — operação pós go-live
- `software-architecture` — serviços e portas