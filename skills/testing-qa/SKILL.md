---
name: testing-qa
description: >-
  Define critérios de aceite, fluxos críticos, regressão e validação manual/estruturada antes de
  release. Use when planejar testes, UAT, checklist de release ou garantir cobertura de risco de
  negócio. Do not use when o foco for só escrever código de teste automatizado (automated-testing).
metadata:
  framework: maestro-engineering-skills
  category: quality
  version: "1.0.0"
---

# Testes e QA

## Objetivo

Garantir que o software atende critérios de aceite acordados, com foco em fluxos que geram valor ou risco, e prevenir regressões em áreas já estáveis.

## Quando ativar

- Nova feature, mudança de regra de negócio ou correção de bug com impacto em usuário.
- Preparação de release, homologação ou handoff para stakeholders.
- Incidente em produção que exige plano de regressão.
- Definição de “pronto” (DoD) para história ou épico.

## Quando NÃO ativar

- Implementação pura de framework de teste ou mocks → `automated-testing`.
- Otimização de performance medida com benchmarks → `performance-optimization`.
- Hardening de segurança detalhado → `security-engineering`.

## Contexto técnico necessário

- Requisitos, user stories ou Prompt Master aprovado.
- Ambientes disponíveis (local, staging, prod-like).
- Histórico de bugs e áreas instáveis no produto.
- Dados de teste permitidos (anonimizados, seeds).

## Regras obrigatórias

1. **Priorizar por risco e valor**: pagamento, auth, dados sensíveis, fluxos revenue primeiro.
2. **Critérios de aceite testáveis** (dado/quando/então ou checklist objetivo).
3. **Regressão explícita** para bugs corrigidos e módulos tocados indiretamente.
4. **Não depender só de “funciona na minha máquina”** — validar no ambiente alvo quando possível.
5. **Documentar** cenários bloqueados (dependência externa, flag, dado faltando).
6. **Sem ações destrutivas** em dados compartilhados/staging sem autorização.

## Processo de execução

1. **Extrair fluxos críticos** da mudança e do domínio (máx. 10 para um ciclo curto).
2. **Escrever critérios de aceite** por fluxo (feliz, alternativo, erro).
3. **Matriz de regressão**: listar áreas adjacentes (ex.: alterou checkout → carrinho, cupom, estoque).
4. **Executar** testes manuais ou semi-automatizados conforme matriz.
5. **Registrar evidências** (passo, resultado, build/commit, ambiente).
6. **Go/No-Go** com pendências classificadas (blocker, major, minor).

### Modelo de caso de teste

| ID | Fluxo | Pré-condição | Passos | Resultado esperado | Prioridade |
|----|-------|--------------|--------|--------------------|------------|
| TC-01 | Login | usuário ativo | ... | sessão válida | P0 |

## Boas práticas

- **Pirâmide consciente**: QA define *o quê* validar; automação cobre repetição → `automated-testing`.
- **Dados sintéticos** rotulados; nunca PII real em staging compartilhado.
- **Exploratório time-boxed** após roteiro estruturado em features novas.
- **Smoke pós-deploy** curto (5–15 min) alinhado com `observability` health checks.
- Alinhar severidade de defeitos com `code-review` (blocker vs nit).

## Erros comuns

- Testar só o caminho feliz.
- Aceite vago (“deve funcionar bem”).
- Ignorar mobile, timezone, locale ou permissões.
- Não retestar bug fix sob condições originais.
- QA bloqueado por ambiente sem comunicar dependência.

## Exemplos práticos

**História:** “Recuperação de senha”  
Aceite: e-mail enviado em ≤2 min; link expira; token único; mensagem genérica se e-mail não existe (anti-enumeração).

**Regressão mínima pós-fix:** bug no filtro de pedidos → listar, ordenar, paginar, exportar, permissão de outro perfil.

## Critérios de qualidade

- Todo fluxo P0/P1 tem aceite escrito e executado ou justificativa de skip.
- Regressão cobre módulos tocados e integrações declaradas.
- Defeitos abertos têm severidade e dono.
- Evidência suficiente para release ou rollback informado.

## Checklist de validação

- [ ] Critérios de aceite ligados ao requisito
- [ ] Fluxos críticos (auth, pagamento, dados sensíveis) exercitados
- [ ] Cenários de erro e permissão negada
- [ ] Regressão do bug fix (se aplicável)
- [ ] Ambiente e versão registrados
- [ ] Pendências classificadas; blockers resolvidos ou aceitos pelo usuário

## Skills relacionadas

- `automated-testing` — automação da pirâmide de testes
- `code-review` — qualidade antes do merge
- `error-handling` — mensagens e códigos em cenários de falha
- `ci-cd` — gates e artefatos de release
- `observability` — smoke e monitoramento pós-deploy
- `maestro-core` — ordenação de entrega