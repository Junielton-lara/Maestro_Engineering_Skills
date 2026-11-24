---
name: docker-management
description: >-
  Gerencia imagens, Compose, volumes e secrets com Docker apenas quando o projeto usa ou precisa de
  containers. Use when containerizar, ajustar compose, volumes ou deploy com imagens. Do not use when
  o app roda bare metal/PM2 sem Docker e o usuário não pediu containerização.
metadata:
  framework: maestro-engineering-skills
  category: infra
  version: "1.0.0"
---

# Gestão Docker

## Objetivo

Operar containers de forma previsível: builds reprodutíveis, compose alinhado ao ambiente, volumes persistentes corretos e segredos fora das imagens — **somente** quando Docker faz parte do projeto ou requisito explícito.

## Quando ativar

- Repositório já tem `Dockerfile` / `docker-compose.yml`.
- Usuário pede containerização ou paridade dev/prod via containers.
- Deploy na VPS com compose (comum em Hostinger).
- Debug de container unhealthy, volume ou rede.

## Quando NÃO ativar

- App apenas com PM2/systemd e sem menção a Docker.
- Imposição de Docker “por padrão” sem necessidade.
- Infra totalmente gerenciada sem acesso ao daemon (PaaS abstrato).

## Contexto técnico necessário

- Versão Docker/Compose no host.
- Arquivos existentes (`Dockerfile`, `compose`, `.dockerignore`).
- Dados que devem persistir (DB, uploads).
- Rede exposta (portas publicadas vs proxy Nginx).

## Regras obrigatórias

1. **Confirmar** que o time/projeto aceita Docker antes de introduzir.
2. **Multi-stage** para imagens de app menores quando build inclui toolchain.
3. **Não bakear** segredos na imagem; usar env/runtime ou Docker secrets.
4. **`.dockerignore`** para `node_modules`, `.git`, `.env`.
5. **Usuário não-root** no container quando imagem base permitir.
6. **Sem** `docker volume rm`, `prune -a`, ou `down -v` em produção sem autorização explícita.

## Processo de execução

1. Ler Dockerfile/compose atuais e como a prod roda hoje.
2. Mapear serviços: app, db, redis, worker.
3. Volumes nomeados para estado; bind mount só para dev se necessário.
4. Rede interna compose; publicar porta só o necessário (proxy na frente).
5. Build com tag versionada (`app:gitsha`).
6. `docker compose up -d`; validar healthcheck e logs.
7. Integrar com `nginx-configuration` para expor HTTPS.

### Compose — checklist

| Item | Verificar |
|------|-----------|
| `restart: unless-stopped` | produção |
| `healthcheck` | app e db |
| `depends_on` + condition | ordem de subida |
| env_file | fora do git, permissões restritas |
| limits | `mem_limit` / deploy resources se necessário |

## Boas práticas

- **Pin** versões de imagem base (`node:20-bookworm-slim`), não `latest` em prod.
- **Uma responsabilidade** por container (app vs migrate one-off).
- **Migrations** como job/init container, não manual esquecido.
- **Logs** para stdout; rotação no host (`json-file` max-size).
- **Scan** imagem no CI quando disponível → `ci-cd`.

## Erros comuns

- `docker compose up` com `.env` commitado.
- Volume de Postgres apagado com `down -v`.
- Publicar porta 5432 na internet.
- Build gigante sem cache (ordem errada de COPY).
- Dev compose igual prod sem ajustes de recurso.

## Exemplos práticos

**Dev:** `compose.override.yml` com bind mount e hot reload.
**Prod VPS:** imagens do registry ou build no deploy; Nginx proxy para `127.0.0.1:8080`.
**Secret:** `env_file: /opt/app/.env` legível só pelo usuário deploy.

## Critérios de qualidade

- `docker compose config` válido.
- App sobe do zero com documentação mínima.
- Dados persistem entre restart.
- Nenhum segredo na camada de imagem ou no git.

## Checklist de validação

- [ ] Projeto realmente usa/precisa Docker
- [ ] `.dockerignore` presente
- [ ] Volumes e backups definidos (`backup-recovery`)
- [ ] Portas mínimas expostas
- [ ] Healthcheck passando
- [ ] Integração Nginx/proxy documentada
- [ ] Plano de rollback de tag de imagem

## Skills relacionadas

- `hostinger-deployment` — compose na VPS
- `nginx-configuration` — proxy para containers
- `environment-configuration` — env em runtime
- `ci-cd` — build e push de imagem
- `linux-server-management` — daemon e disco
- `observability` — logs de container
- `devops-infrastructure` — decisão container vs bare metal