---
name: devops-infrastructure
description: >-
  Planeja e ajusta infraestrutura com inspeção primeiro: VPS Ubuntu, permissões mínimas, serviços e
  deploy seguro sem assumir stack única. Use when estruturar hosting, servidores, processos ou
  evolução de ambiente. Do not use when o escopo for só um arquivo nginx (nginx-configuration) ou só
  Hostinger passo a passo (hostinger-deployment).
metadata:
  framework: maestro-engineering-skills
  category: infra
  version: "1.0.0"
---

# DevOps e Infraestrutura

## Objetivo

Alinhar infraestrutura ao projeto real: descobrir o que já existe, aplicar mudanças incrementais com menor privilégio e caminho claro de rollback, sem impor Docker/PM2/stack fixa.

## Quando ativar

- Primeiro deploy ou migração de hosting.
- Novo serviço (DB, fila, worker) em VPS ou cloud.
- Hardening, usuários, firewall, atualizações de SO.
- Padronização de ambientes (dev/staging/prod).

## Quando NÃO ativar

- Apenas pipeline GitHub Actions → `ci-cd`.
- Só variáveis `.env` → `environment-configuration`.
- Detalhe de vhost TLS → `nginx-configuration`.
- Runbook só Hostinger → `hostinger-deployment`.

## Contexto técnico necessário

- Inventário atual: SO, versões, serviços (`systemctl`), portas, usuários SSH.
- O app roda como? (systemd, PM2, Docker, bare Node).
- DNS, certificados, backups existentes.
- Restrições de orçamento/região (ex.: VPS Hostinger).

## Regras obrigatórias

1. **Inspecionar antes de alterar** (read-only: `status`, configs, logs).
2. **Menor privilégio**: usuário de deploy sem root; sudo pontual.
3. **Não assumir** Docker, PM2 ou PostgreSQL — confirmar no ambiente.
4. **Mudanças reversíveis**: backup de config antes de editar.
5. **Nunca** executar wipe, `rm -rf /`, format, drop database sem autorização explícita.
6. **Documentar** portas, usuários e dependências após mudança.

## Processo de execução

1. **Discovery**: SO, CPU/RAM/disco, serviços ativos, firewall, app path.
2. **Diagrama mental**: cliente → proxy → app → DB → jobs.
3. **Gap analysis** vs requisitos (HTTPS, backups, CI).
4. **Plano em etapas** com validação entre cada etapa.
5. **Aplicar** em staging ou horário acordado; smoke test.
6. **Handoff**: variáveis → `environment-configuration`; proxy → `nginx-configuration`.

### Discovery (comandos informativos — ajustar ao SO)

- Versão SO, espaço em disco, memória.
- Serviços: web server, app runtime, database.
- Portas em escuta e dono do processo.
- Últimos deploys e local do código.

## Boas práticas

- **Um servidor = uma responsabilidade** quando possível (app vs DB).
- **SSH key-only**; desabilitar password auth após validar chave → `linux-server-management`.
- **Atualizações** de segurança agendadas; reboot planejado.
- **IaC leve**: scripts idempotentes ou documentação versionada no repo.
- **Segredos** fora do servidor em plaintext amplo; permissões `600` em `.env`.

## Erros comuns

- Copiar tutorial genérico sem checar porta 80/443 ocupada.
- Rodar app como root.
- Abrir todas as portas no firewall “para testar”.
- Dois proxies competindo (Nginx + Caddy sem saber).
- Deploy manual sem tag/commit rastreável.

## Exemplos práticos

**Node sem Docker:** usuário `app`, systemd unit, `WorkingDirectory`, `EnvironmentFile`.
**Com Docker:** compose com volumes nomeados; secrets via env file fora do git → `docker-management`.
**Rollback:** manter release anterior em `/var/www/app/releases/` ou imagem tag anterior.

## Critérios de qualidade

- Estado antes/depois documentado.
- App acessível via HTTPS com health check.
- Contas e permissões revisadas.
- Backup e monitoramento mínimo referenciados.

## Checklist de validação

- [ ] Ambiente inspecionado e inventariado
- [ ] Stack confirmada (sem suposições)
- [ ] Backup de configs críticas
- [ ] Firewall e SSH revisados
- [ ] Deploy e rollback testados em staging ou dry-run
- [ ] Skills filhas invocadas onde necessário

## Skills relacionadas

- `hostinger-deployment` — VPS Hostinger
- `linux-server-management` — SO e usuários
- `nginx-configuration` — proxy e TLS
- `docker-management` — quando houver containers
- `ci-cd` — entrega automatizada
- `environment-configuration` — variáveis e 12-factor
- `observability` — logs e métricas
- `backup-recovery` — retenção e restore