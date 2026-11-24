---
name: agent-orchestration
description: >-
  Coordinates multiple agents/subagents without overlap: clear ownership, no
  duplicate investigations, objective deliverables, and technical summaries
  instead of full histories. Use with maestro-orchestrator or parallel Task
  agents. Do not spawn redundant agents for the same files.
metadata:
  framework: maestro-engineering-skills
  category: efficiency
  version: "1.0.0"
---

# Agent Orchestration

## Objetivo

Distribuir trabalho entre papéis/subagentes **sem sobreposição**, passando resumos técnicos — compatível com tools reais (Task/subagents) ou papéis sequenciais.

## Quando ativar

- ≥2 responsabilidades distintas (ex.: explorar FE e BE em paralelo).
- `maestro-orchestrator` em entrega multi-etapa.

## Quando NÃO ativar

- Tarefa single-thread óbvia.
- Ambiente sem subagentes — usar sequência de papéis, não fingir paralelismo.

## Contexto técnico necessário

- Capacidades reais (há `Task`/subagentes?).
- Paths a evitar conflito.
- `maestro-token-efficiency`.

## Regras obrigatórias

1. 1 agente = 1 responsabilidade + entregável objetivo.
2. Sem dois agentes nos mesmos arquivos de escrita.
3. Briefing: objetivo, paths, restrições, formato de saída — **sem** transcript completo.
4. Consolidar sem repetir.
5. Não disparar agente “por precaução”.
6. Preferir paralelo só em leituras/explorações independentes.

## Processo de execução

1. Particionar trabalho.
2. Escrever brief por agente (≤15 linhas).
3. Executar (paralelo ou sequência).
4. Mesclar resultados.
5. Resolver conflitos de achados.

## Boas práticas

- Explore paralelo → implementa serial.
- Review depois do diff estável.

## Erros comuns

- 4 explores no mesmo diretório.
- Passar 50kb de histórico ao subagente.

## Exemplos práticos

**Brief:** “Liste padrões de modal em `src/components/ui`; retorne paths + 5 bullets; não edite.”

## Critérios de qualidade

- Sem trabalho duplicado.
- Consolidação curta e acionável.

## Checklist de validação

- [ ] Partição sem overlap de escrita
- [ ] Briefs mínimos
- [ ] Entregáveis objetivos
- [ ] Merge sem redundância

## Skills relacionadas

- `maestro-orchestrator`, `maestro-token-efficiency`, `context-management`, `response-efficiency`
