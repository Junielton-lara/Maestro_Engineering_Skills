---
name: maestro-token-efficiency
description: >-
  Continuously minimizes unnecessary token use while preserving quality: scoped
  reads, no redundant plans/docs, minimal skill loading, focused responses. Use
  on every engineering task as a standing discipline; deepen when the user asks
  about cost, context limits, or agent waste. Do not invent token metrics or
  skip required technical reading to look "cheap".
metadata:
  framework: maestro-engineering-skills
  category: efficiency
  version: "1.0.0"
---

# Maestro Token Efficiency

## Objetivo

Executar tarefas com o **mínimo de desperdício de contexto**, preservando qualidade, segurança e precisão. Princípio: entender → usar só o necessário → executar → entregar, sem ler tudo, planejar indefinidamente ou escrever demais.

**Aplicar continuamente** — não apenas quando o usuário pedir economia.

## Quando ativar

- **Sempre** em tarefas de engenharia (via `maestro-core`).
- Explicitamente quando houver limite de contexto, custo, ou desperdício observado.
- Antes de disparar subagentes ou carregar várias skills.

## Quando NÃO ativar

- Não usar como desculpa para omitir inspeção **necessária** à correção segura.
- Não substituir skills de domínio (security, multi-tenancy) por “economia”.

## Contexto técnico necessário

- Objetivo e critério de sucesso da tarefa atual.
- O que já está no histórico da conversa / docs do repo.
- Capacidades reais da IDE/modelo (cache, tools) — **sem inventar métricas**.

## Regras obrigatórias

1. Não ler arquivos sem relação com a tarefa.
2. Não reler arquivos já compreendidos, salvo mudança relevante.
3. Não carregar diretórios inteiros indiscriminadamente.
4. Não repetir contexto já documentado (referenciar path/seção).
5. Não gerar planos extensos para tarefas simples.
6. Não criar documentação duplicada.
7. Não reescrever arquivo inteiro se alteração pontual resolve.
8. Não recriar componentes existentes com outro nome.
9. Não ativar skills que não agreguem à tarefa.
10. Não usar múltiplos agentes para trabalho redundante.
11. Não repetir pesquisas/buscas sem necessidade.
12. Não gerar relatórios longos sem solicitação.
13. Não perguntar o que já está no contexto.
14. Não narrar ações internas irrelevantes ao usuário.
15. Preservar decisões importantes entre etapas de tarefas complexas (notas curtas).

## Processo de execução

### Início

1. Objetivo em 1 frase + aceite em 1 frase.
2. Consultar contexto já disponível (chat, README, skill ativa).
3. Localizar arquivos com busca **cirúrgica** (nome/símbolo), não dump de árvore.
4. Listar dependências mínimas; definir escopo (in/out).
5. Escolher 0–3 skills de domínio além desta disciplina.

### Durante

1. Manter foco: uma subtarefa por vez.
2. Registrar decisões em 2–5 bullets se a tarefa for longa.
3. Evitar releitura; se precisar, ler só o trecho.
4. Preferir `StrReplace` / edit pontual a reescrita total.
5. Entre agentes: passar **resumo técnico**, não histórico completo → `agent-orchestration`.

### Fim

1. Validar mudanças (lint/teste do pacote tocado, ou reportar falha).
2. Resposta curta: feito / problemas / próximo passo.
3. Sem relatório espelhando o diff inteiro, salvo pedido.

## Boas práticas

- Abrir skill complementar só se o gargalo for específico (`context-management`, `prompt-optimization`, etc.).
- Para Prompt Master: clareza sem cortar técnica necessária → `prompt-optimization`.
- Análise de código: grep → arquivo → símbolo → vizinhos → `intelligent-code-analysis`.

## Erros comuns

- “Li a pasta toda para ter certeza.”
- Plano de 40 linhas para trocar um label.
- Ativar 8 skills FE para um bug de CSS pontual.
- Inventar “economizamos N tokens”.

## Exemplos práticos

**Simples** — “Corrigir typo no botão Salvar”: 1 arquivo, edit pontual, sem plano, sem subagente.

**Média** — “Paginação na listagem X”: localizar page + API + tipo; 2–3 arquivos; skill `api-design` só se contrato mudar.

**Complexa** — “Novo módulo Y”: anotar decisões; etapas; 1–2 skills por etapa; resumos entre etapas.

## Critérios de qualidade

- Leituras justificáveis pelo objetivo.
- Diff mínimo suficiente.
- Resposta proporcional à tarefa.
- Nenhuma skill/agente ocioso.

## Checklist de validação

- [ ] Escopo mínimo definido
- [ ] Sem leituras/exploração irrelevantes
- [ ] Sem plano/doc/relatório excessivo
- [ ] Skills/agentes só os necessários
- [ ] Decisões preservadas se tarefa longa
- [ ] Entrega validada e concisa

## Skills relacionadas

- `maestro-core` — aplica esta disciplina em toda trilha
- `context-management`, `prompt-optimization`, `intelligent-code-analysis`
- `efficient-development`, `agent-orchestration`, `response-efficiency`
