---
name: linux-server-management
description: >-
  Administra servidores Linux (Ubuntu em VPS): usuários, SSH, pacotes, systemd, disco e manutenção
  sem ações destrutivas não autorizadas. Use when hardening SSH, criar usuários de deploy, instalar
  dependências de SO ou diagnosticar serviços. Do not use when o escopo for só Nginx vhost ou deploy
  de app (nginx-configuration / hostinger-deployment).
metadata:
  framework: maestro-engineering-skills
  category: infra
  version: "1.0.0"
---

# Gestão de Servidor Linux

## Objetivo

Manter servidor Ubuntu/VPS estável e seguro: contas adequadas, SSH endurecido, pacotes controlados, serviços supervisionados e espaço em disco monitorável.

## Quando ativar

- Novo usuário de deploy ou desativar login root direto.
- Instalar runtime (Node, Python, Postgres client) no SO.
- Serviço não inicia (systemd failed).
- Disco cheio, rotação de logs, fuso horário.

## Quando NÃO ativar

- Configuração de site TLS → `nginx-configuration`.
- Pipeline de build → `ci-cd`.
- Backups de banco → `backup-recovery`.

## Contexto técnico necessário

- Distribuição e versão (`/etc/os-release`).
- Acesso sudo atual e política do provedor (Hostinger, etc.).
- Serviços críticos em produção e janela de manutenção.
- Se há painel que também altera firewall (conflito).

## Regras obrigatórias

1. **Inspecionar** uso de disco, memória e serviços antes de mudanças.
2. **Preferir pacotes do distro** ou repos oficiais (NodeSource, Docker oficial) documentados.
3. **Nunca bloquear SSH** sem sessão alternativa validada.
4. **Testar** `sshd -t` e manter uma conexão aberta ao mudar SSH.
5. **Sem apagar** logs/dados/ usuários sem autorização explícita.
6. **Timezone** coerente (`UTC` recomendado em servidores).

## Processo de execução

1. **Baseline**: `uname`, espaço em disco, `systemctl list-units --failed`.
2. **Usuários**: criar `deploy` em grupo `sudo` (ou sem sudo se só leitura); chave SSH em `authorized_keys`.
3. **SSH hardening** (incremental): `PasswordAuthentication no` após chave OK; `PermitRootLogin prohibit-password` ou `no`.
4. **Pacotes**: `apt update`; instalar só o necessário; remover auto-start desnecessário.
5. **Serviços**: `enable --now` para app; `restart` com validação pós.
6. **Disco**: identificar pastas grandes (logs, docker, releases); rotacionar, não `rm` cego.

### systemd (padrão)

- Unit em `/etc/systemd/system/app.service`
- `User=`, `WorkingDirectory=`, `EnvironmentFile=`
- `Restart=on-failure`, `LimitNOFILE` se app exigir

## Boas práticas

- **fail2ban** ou rate limit SSH quando política permitir.
- **unattended-upgrades** para segurança com reboot planejado.
- **logrotate** para app e nginx.
- **Separar** usuário do processo do usuário humano de deploy.
- **Documentar** mudanças em runbook do repo.

## Erros comuns

- Editar `sshd_config` e reiniciar sem testar — perda de acesso.
- Instalar Node via `snap` sem alinhar ao projeto.
- `chmod 777` em diretório de upload.
- Cron duplicado com systemd timer.
- Ignorar `No space left on device` até PG parar.

## Exemplos práticos

**Novo deploy user:** `adduser deploy`, colar chave pública, `usermod -aG sudo deploy` se precisar.

**Serviço falhou:** `journalctl -u app -n 100 --no-pager` → corrigir env ou permissão de pasta.

**Disco:** limpar journal antigo (`journalctl --vacuum-size`), revisar Docker logs se aplicável → `docker-management`.

## Critérios de qualidade

- SSH acessível por chave após hardening.
- Serviços críticos `active (running)`.
- Disco <80% em partição raiz ou plano de expansão.
- Mudanças registradas e reversíveis.

## Checklist de validação

- [ ] OS e recursos inventariados
- [ ] Usuário/chaves SSH validados antes de desligar senha
- [ ] `sshd -t` OK
- [ ] Serviços habilitados para boot
- [ ] Disco e logs sob controle
- [ ] Nenhuma ação destrutiva sem OK do usuário

## Skills relacionadas

- `hostinger-deployment` — contexto Hostinger VPS
- `devops-infrastructure` — arquitetura de hosting
- `nginx-configuration` — serviço web
- `docker-management` — daemon e recursos
- `observability` — journal e métricas de SO
- `backup-recovery` — snapshots e dumps