---
name: observability
description: >-
  Implementa logs estruturados, métricas, health checks e alertas acionáveis sem vazar dados
  sensíveis. Use when diagnosticar produção, expor /health, melhorar correlação ou definir alertas.
  Do not use when o escopo for só formato de erro HTTP (error-handling) ou backup de DB.
metadata:
  framework: maestro-engineering-skills
  category: infra
  version: "1.0.0"
---

# Observabilidade

## Objetivo

Tornar o sistema **perceptível**: saber se está saudável, por que falhou e quando agir — com logs estruturados, sinais de métrica e checks que automação e humanos conseguem consumir.

## Quando ativar

- Deploy novo ou serviço sem health check.
- Debugging lento em produção (“não sei o que aconteceu”).
- Picos de 5xx, fila crescendo, disco cheio.
- Necessidade de SLO básico ou alerta noturno.

## Quando NÃO ativar

- Definir contrato de erro JSON → `error-handling`.
- Estratégia de backup → `backup-recovery`.
- Testes de aceite → `testing-qa`.

## Contexto técnico necessário

- Stack atual (stdout, Loki, Datadog, CloudWatch, journald).
- Endpoints e jobs críticos.
- Dados sensíveis que não podem ir a logs.
- Infra de alerta (email, Slack, PagerDuty) disponível.

## Regras obrigatórias

1. **Logs estruturados** (JSON ou key=value) em produção.
2. **Correlation/request ID** em toda requisição e job derivado.
3. **Health check** distingue **liveness** vs **readiness** (app up vs pronto para tráfego).
4. **Métricas** mínimas: latência, taxa de erro, throughput, recursos.
5. **Alertas** acionáveis — sem ruído de threshold mal calibrado.
6. **Não logar** segredos, tokens, corpo de login, PII desnecessária.

## Processo de execução

1. Inventariar hoje: onde estão logs, retenção, como se busca.
2. Definir **golden signals** por serviço (latency, traffic, errors, saturation).
3. Implementar `/health` e `/ready` (DB ping leve, dependências críticas).
4. Padronizar campos de log (`level`, `msg`, `correlationId`, `durationMs`).
5. Exportar métricas (Prometheus, statsd, ou provedor do host).
6. Criar 2–3 alertas iniciais (5xx rate, disk >85%, process down).
7. Documentar runbook de resposta por alerta.

### Health check — readiness

- Checagens rápidas (<1s); timeout fail → remover do LB
- Opcional: versão/commit em endpoint autenticado, não público

### Alertas iniciais sugeridos

| Alerta | Condição | Ação |
|--------|----------|------|
| HighErrorRate | 5xx > X% por 5 min | checar deploy recente, logs |
| DiskPressure | uso > 85% | `linux-server-management`, logs/docker |
| ProcessDown | health fail 3x | restart controlado, rollback |

## Boas práticas

- **Níveis** de log consistentes; `debug` off em prod por default.
- **Sampling** de traces em alto volume.
- **Dashboard** mínimo: requests, erros, latência p95, CPU/RAM.
- Smoke pós-deploy automatizado ou checklist → `testing-qa`.
- Integrar com `nginx-configuration` access logs + `$request_time`.

## Erros comuns

- Health check que grava no DB a cada 5s.
- Log texto livre impossível de filtrar.
- Alerta em toda exceção 404.
- Métrica sem label de ambiente (mistura staging/prod).
- Trace sem propagation em chamadas HTTP internas.

## Exemplos práticos

**Express/Fastify middleware:** gera `correlationId`, anexa ao `req`, devolve header `X-Correlation-Id`.

**Readiness:** falha se Postgres não conecta; liveness só responde 200 se event loop ok.

**Runbook:** “HighErrorRate” → ver último deploy (`ci-cd`), rollback se correlacionado.

## Critérios de qualidade

- Incidente típico localizável em <15 min com logs/métricas.
- Health usado por proxy ou orchestrator.
- Alertas com dono e runbook linkado.
- Nenhum vazamento de segredo em log exemplar revisado.

## Checklist de validação

- [ ] Correlation ID fim-a-fim
- [ ] Logs estruturados em prod
- [ ] /health e /ready documentados
- [ ] Métricas básicas coletadas
- [ ] ≥1 alerta crítico configurado
- [ ] Retenção e custo de log aceitáveis
- [ ] PII/segredos revisados em amostra de logs

## Skills relacionadas

- `error-handling` — formato de falha e códigos
- `performance-optimization` — latência e profiling
- `hostinger-deployment` — smoke pós-deploy
- `linux-server-management` — journald e disco
- `ci-cd` — notificar falha de deploy
- `backup-recovery` — alertas de backup falho
- `security-engineering` — logging seguro