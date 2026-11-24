---
name: maestro-orchestrator
description: >-
  Coordinates specialized Maestro agents (dev, review, QA, docs, git, knowledge,
  infra) for a delivery lifecycle: select agents, share minimal context, consolidate
  results, and propose a closing checklist. Use for multi-step deliveries or when
  the user asks to orchestrate agents. Do not activate every agent on trivial edits.
metadata:
  framework: maestro-engineering-skills
  category: agents
  version: "1.1.0"
---

# Maestro Orchestrator

## Objetivo

Coordenar **agentes especializados** (skills de papel) ao longo do ciclo de entrega, sem ativar todos sempre. Usa ferramentas reais da IDE (etapas sequenciais no mesmo agente, ou subagentes/`Task` quando disponíveis) — **não** inventa runtime fictício.

## Quando ativar

- Entrega com várias etapas (dev → review → QA → docs → knowledge → git).
- Pedido explícito de orquestração / “finalize a entrega”.
- Tarefa complexa que cruza implementação e pós-trabalho.

## Quando NÃO ativar

- Hotfix trivial (1 arquivo óbvio) — use `development-agent` ou skill de domínio direta.
- Usuário pediu só uma etapa (ex.: “só revise”).
- Sem mudança de código e sem necessidade de knowledge/git.

## Contexto técnico necessário

- Objetivo + aceite da tarefa.
- Diff/arquivos tocados (ou pedido ainda não implementado).
- `.maestro/` do projeto se existir (Living Knowledge).
- Skills globais mínimas + `maestro-token-efficiency`.
- Capacidade real: subagentes disponíveis? Se não, executar **papéis em sequência**.

## Regras obrigatórias

1. Escolher agentes pelo **escopo/complexidade** — nunca todos por padrão.
2. Cada agente recebe **só o contexto necessário** (resumo + paths), não o histórico inteiro.
3. Evitar dois agentes editando os **mesmos arquivos** sem coordenação.
4. Consultar `.maestro/skills/` e `.maestro/knowledge/` **antes** de redescobrir o projeto.
5. Não afirmar testes/review feitos sem evidência → `qa-agent` / `code-review-agent`.
6. Push, deploy, produção → autorização explícita (`git-agent`, `infrastructure-agent`).
7. Encerramento **proporcional**: tarefa simples ≠ checklist completo.
8. Não repetir etapas já validadas na sessão.
9. Separar conhecimento **global** (Maestro) de **local** (`.maestro/`).
10. Aplicar `maestro-token-efficiency` e `agent-orchestration` em toda distribuição.

## Entradas / saídas / limites

| | |
|--|--|
| **Entradas** | Pedido; diff ou objetivo; modo (se builder); `.maestro` se houver |
| **Saídas** | Trilha anunciada; resultados consolidados; proposta de closeout; pendências |
| **Não faz** | Implementar no lugar do `development-agent` sem necessidade; push/deploy sozinho; inventar subagentes sem tool real |
| **Conclusão** | Usuário tem escolha clara de próximos papéis **ou** entrega encerrada se trivial |

## Processo de execução

### 1. Entender pedido

- Classificar: `create` | `fix` | `extend` | `refactor` | `ops` | `closeout`.
- Greenfield completo → preferir `autonomous-project-builder`.
- Workspace Maestro: todo agente recebe o projeto ativo `projects/<slug>/` e só atua dentro dele.
- Definir in/out de escopo em 2–4 bullets.

### 2. Selecionar agentes

| Sinal | Agentes típicos |
|-------|-----------------|
| Implementar/corrigir UI ou API | `development-agent` |
| Diff não trivial / segurança | `code-review-agent` |
| Fluxos críticos / regressão | `qa-agent` |
| Contrato/API/README mudou | `documentation-agent` |
| Novas regras/módulos/padrões | `knowledge-agent` |
| Commit/PR/push | `git-agent` |
| Deploy/env/servidor | `infrastructure-agent` |

### 2b. Papéis do ciclo de produto → execução real

Papéis não viram agentes novos: cada um é uma skill existente executada pelo agente principal **ou** um subagente real (`agents/*.md`, sincronizado em `.cursor/agents` e `.claude/agents`).

| Papel | Skill(s) | Executor |
|-------|----------|----------|
| Product Manager | `product-discovery`, `prompt-master-generator` | Principal (dono da conversa com o usuário) |
| Software Architect | `software-architecture` (+ `stack-defaults.md` do builder) | Principal |
| Database | `database-postgresql`, `database-optimization` | Principal ou `maestro-backend-developer` |
| UX/UI | `ux-ui-design`, `design-system`, `mobile-first` | Principal ou `maestro-frontend-developer` |
| Frontend Development | `development-agent` + `frontend-engineering` | `maestro-frontend-developer` |
| Backend Development | `development-agent` + `backend-engineering`, `api-design` | `maestro-backend-developer` |
| QA | `qa-agent` | `maestro-qa` |
| Code Review | `code-review-agent` | `maestro-code-reviewer` (read-only) |
| Security | `security-engineering` | `maestro-security-reviewer` (read-only) |
| Documentation | `documentation-agent` | Principal |
| Infrastructure | `infrastructure-agent` | Principal (com autorização para prod) |
| Git | `git-agent` | Principal (push só com OK) |
| Knowledge | `knowledge-agent` | Principal |

Sem suporte a subagentes na IDE → o principal executa o papel em sequência (“Agora: maestro-qa…”).

### Paralelo vs sequencial

- **Paralelo** só quando: entradas prontas (ex.: contrato em `knowledge/api-map.md`), paths disjuntos (`frontend/` × `backend/`), e nenhum depende do resultado do outro. Ex.: FE + BE do mesmo módulo; code review + security review (read-only).
- **Sequencial** quando há dependência: spec → arquitetura → foundation → módulo N → integração → QA → docs/knowledge → git. Migrations, `package.json` compartilhado, `.maestro/` e git: sempre um executor por vez.
- Prompt de delegação: projeto (`projects/<slug>/`), objetivo, paths permitidos, contrato/regras relevantes (IDs BR/CA), comandos de validação, formato de retorno. Nunca o histórico inteiro.

### 3. Distribuir

- Ordem padrão adaptativa: **dev → análise diff → review → QA → docs → knowledge → git → (deploy se pedido)**.
- Pular etapas irrelevantes.
- Com subagentes: 1 responsabilidade / agente; entregável objetivo; sem overlap de paths.
- Sem subagentes: mesmo chat, **mudar de papel** explicitamente (“Agora: code-review-agent…”).

### 4. Consolidar

- Unir achados sem repetir.
- Lista de pendências abertas.
- Proposta de encerramento ao usuário.

### 5. Encerramento (apresentar escolha)

Chamado pelo `autonomous-project-builder` em modo automatic: **não** apresentar menu — executar QA/review/docs/knowledge proporcionais e perguntar só sobre Git (commit/push).

Exemplo (adaptar; omitir itens já feitos):

```text
Desenvolvimento concluído. Atividades recomendadas:
- Code Review — segurança/qualidade
- QA — testes relacionados
- Documentação — sync com o código
- Knowledge — atualizar .maestro
- Git — preparar commit (push só com sua autorização)
Quais deseja executar?
```

## Boas práticas

- Anunciar trilha em ≤5 linhas.
- Preferir Living Knowledge a varrer o repo.
- Após cada agente: 3–6 bullets de resultado.

## Erros comuns

- Ativar 7 agentes para typo.
- Dois agentes reescrevendo o mesmo arquivo.
- Push automático.
- Documentar feature não implementada.
- Promover regra local para global sem avaliação.

## Exemplos práticos

**Simples** — corrigir label: só `development-agent` (+ commit se pedido).

**Média** — novo endpoint + tela: `development-agent` → `code-review-agent` → `qa-agent` (smoke) → `documentation-agent` (API) → `knowledge-agent` se regra nova → `git-agent`.

**Ops** — nginx/HTTPS: `infrastructure-agent` (+ auth do usuário).

## Critérios de qualidade

- Agentes justificados pelo diff/pedido.
- Contexto compartilhado mínimo e suficiente.
- Encerramento opcional e claro.
- Sem operações irreversíveis sem OK.

## Checklist de validação

- [ ] Objetivo e escopo claros
- [ ] Agentes selecionados (mínimos)
- [ ] `.maestro` consultado se existir
- [ ] Sem overlap destrutivo de arquivos
- [ ] Resultados consolidados
- [ ] Encerramento proposto (se não trivial)
- [ ] Auth para push/deploy se aplicável

## Skills relacionadas

- `maestro-core`, `maestro-token-efficiency`, `agent-orchestration`
- `development-agent`, `code-review-agent`, `qa-agent`, `documentation-agent`, `git-agent`, `knowledge-agent`, `infrastructure-agent`
- `autonomous-project-builder` (fluxo completo em `projects/<slug>/`); subagentes em `agents/`
