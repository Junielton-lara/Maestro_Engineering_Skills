---
name: response-efficiency
description: >-
  Produces proportional user-facing answers: short status, key findings, next
  steps—no internal narration, no unsolicited long reports, no repeated plans.
  Use for all user communication. Do not hide critical risks to stay brief.
metadata:
  framework: maestro-engineering-skills
  category: efficiency
  version: "1.0.0"
---

# Response Efficiency

## Objetivo

Comunicar ao usuário com densidade alta: o essencial, riscos reais, próximo passo — sem teatro interno nem relatórios não pedidos.

## Quando ativar

- Sempre que responder ao usuário (disciplina contínua via Core/Orchestrator).

## Quando NÃO ativar

- Usuário pediu relatório detalhado / walkthrough — então expandir.

## Contexto técnico necessário

- Resultado da tarefa; pedidos explícitos de verbosidade.

## Regras obrigatórias

1. Proporcionalidade: typo ≠ ensaio.
2. Não narrar tool calls internos irrelevantes.
3. Não repetir o plano a cada mensagem.
4. Não perguntar o que já está no contexto.
5. Não omitir Critical/segurança por brevidade.
6. Preferir bullets e paths a prosa longa.
7. Relatórios longos só sob solicitação ou encerramento multi-agente consolidado.

## Processo de execução

1. O que o usuário precisa saber agora?
2. 3 blocos máx.: feito / problemas / próximo.
3. Anexar evidência só se útil (comando, path).
4. Encerrar.

## Boas práticas

- Uma pergunta por vez se faltar dado.
- Encerramento do orchestrator: checklist escolhível, não monólogo.

## Erros comuns

- “Vou analisar… agora vou ler… agora pensei…”
- Colar diff inteiro sem pedido.

## Exemplos práticos

**Bom:** “Corrigido `Button` loading em `button.tsx`. Lint OK. Quer commit?”  
**Ruim:** narrativa de 40 linhas sobre o processo mental.

## Critérios de qualidade

- Usuário age no próximo passo sem reler wall of text.
- Riscos críticos visíveis.

## Checklist de validação

- [ ] Resposta proporcional
- [ ] Sem narração interna inútil
- [ ] Riscos críticos citados
- [ ] Próximo passo claro (se houver)

## Skills relacionadas

- `maestro-token-efficiency`, `maestro-orchestrator`, `prompt-optimization`
