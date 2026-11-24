---
name: backup-recovery
description: >-
  Define backups de banco e artefatos, retenção, testes de restore e noções de RPO/RTO sem operações
  destrutivas não autorizadas. Use when configurar backup Postgres, política de retenção ou plano de
  disaster recovery em VPS. Do not use when o escopo for só métricas (observability) ou deploy de app.
metadata:
  framework: maestro-engineering-skills
  category: infra
  version: "1.0.0"
---

# Backup e Recuperação

## Objetivo

Garantir que dados e configs críticos possam ser restaurados dentro de janelas aceitáveis (RPO/RTO), com backups automatizados, retenção clara e **testes de restore** periódicos.

## Quando ativar

- Banco de dados em produção (PostgreSQL, etc.).
- Antes de migração estrutural ou deploy de alto risco.
- Política de retenção inexistente ou ad hoc.
- Incidente de perda/corrupção de dados.

## Quando NÃO ativar

- Logging e alertas operacionais → `observability`.
- Variáveis de ambiente → `environment-configuration`.
- Hardening SSH → `linux-server-management`.

## Contexto técnico necessário

- Onde roda o DB (mesma VPS, managed, container volume).
- Tamanho aproximado dos dados e janela de manutenção.
- RPO/RTO desejados (ou defaults: RPO 24h, RTO 4h para VPS pequeno).
- Destino de backup (S3, Backblaze, outro VPS, snapshot Hostinger).

## Regras obrigatórias

1. **Inspecionar** backups existentes antes de criar política paralela.
2. **3-2-1** quando possível: 3 cópias, 2 mídias, 1 off-site.
3. **Criptografar** backups com dados sensíveis em trânsito e repouso.
4. **Nunca restaurar em prod** por cima sem autorização e plano de rollback.
5. **Testar restore** em ambiente isolado (staging ou DB temporário).
6. **Sem** `DROP`, `pg_resetwal`, ou apagar volume de backup sem OK explícito.

### RPO / RTO (referência rápida)

| Termo | Significado | Pergunta |
|-------|-------------|----------|
| **RPO** | Recovery Point Objective | Quanto dado podemos perder? |
| **RTO** | Recovery Time Objective | Quanto tempo para voltar? |

## Processo de execução

1. **Inventário**: DB, uploads, configs Nginx/systemd, secrets (onde estão, não o valor).
2. **Escolher ferramenta**: `pg_dump`/`pg_dumpall`, snapshots VPS, volume snapshot.
3. **Agendar** cron/systemd timer com janela de baixo tráfego.
4. **Retenção**: ex. diário 7d, semanal 4, mensal 6 — documentar.
5. **Off-site copy** automatizada (rclone, provider API).
6. **Restore drill** trimestral: restaurar dump em DB vazio e validar checksum/contagem.
7. **Runbook** com comandos exatos e contatos.

### PostgreSQL (padrão)

- Backup lógico: `pg_dump -Fc` (custom format) por database ou role.
- Global: `pg_dumpall --globals-only` para roles (separado).
- Restore test: `pg_restore -d db_restore ...` em instância descartável.
- Antes de migrate: backup manual + anotar timestamp.

### Artefatos não-DB

- Uploads em volume → incluir no backup ou sync S3.
- `/etc/nginx`, systemd units, compose — versionar no git quando possível.

## Boas práticas

- **Monitorar** job de backup (sucesso/falha) → `observability`.
- **Notificar** se backup não rodou em 24h.
- **Imutabilidade** ou versionamento em object storage contra ransomware.
- **Segregar** credenciais de backup (não reutilizar superuser app).
- Coordenar snapshot Hostinger com quiesce DB quando necessário.

## Erros comuns

- Backup só na mesma VPS do app (perda total do servidor).
- `pg_dump` sem compressão em DB grande (disco enche).
- Nunca testar restore — backup corrompido só descoberto na crise.
- Retenção infinita sem custo controlado.
- Restore em prod sem parar escritas (split-brain).

## Exemplos práticos

**Cron diário:** dump para `/var/backups/pg/` + rclone para bucket; delete >7 dias local.

**Pré-deploy:** snapshot painel Hostinger + `pg_dump` manual nomeado com SHA do release.

**Incidente:** promover staging restaurado; cutover DNS se RTO exigir.

## Critérios de qualidade

- Política escrita com frequência, retenção, destino, dono.
- Restore testado com evidência datada.
- Backups cobrem DB + arquivos críticos não versionados.
- RPO/RTO explícitos ou defaults documentados.

## Checklist de validação

- [ ] Inventário de dados críticos completo
- [ ] Job automatizado e logado
- [ ] Cópia off-site configurada
- [ ] Retenção aplicada (não enche disco)
- [ ] Restore drill executado ou agendado
- [ ] Runbook acessível ao time
- [ ] Backup antes de migração destrutiva (quando aplicável)

## Skills relacionadas

- `hostinger-deployment` — snapshots VPS
- `docker-management` — volumes persistentes
- `linux-server-management` — cron, disco
- `devops-infrastructure` — estratégia geral
- `observability` — alertas de falha de backup
- `environment-configuration` — credenciais de backup segregadas
- `ci-cd` — artefatos de release recuperáveis