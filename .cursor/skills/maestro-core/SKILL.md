---
name: maestro-core
description: >-
  Orchestrates Maestro Engineering: classifies intent, applies continuous token
  efficiency, resolves the active project under projects/<slug>, consults its
  .maestro Living Knowledge, selects domain skills and/or
  specialized agents, and proposes proportional closeout. Use for non-trivial
  engineering work. Do not load the full catalog or every agent by default.
metadata:
  framework: maestro-engineering-skills
  category: core
  version: "1.4.0"
---

# Maestro Core (Orquestrador)

## Objetivo

Ponto de entrada do Maestro: classificar intenção, **aplicar economia de tokens continuamente**, consultar conhecimento vivo do projeto (`.maestro/`), selecionar skills/agentes mínimos e entregar com validação — sem redescorrer o produto a cada tarefa.

Consulte `MAESTRO_ENGINEERING_STANDARDS.md` ao planejar greenfield ou auditar aderência.

## Quando ativar

- Feature, correção, extensão, refatoração ou entrega multi-etapa.
- Pedidos amplos ou dúvida sobre qual skill/agente usar.
- Ideia sem spec → `prompt-master-generator`.

## Quando NÃO ativar

- Q&A conceitual sem mudança.
- Hotfix trivial com path óbvio (ainda aplicar disciplina de tokens).
- Usuário já fixou um agente/skill com contexto completo.

## Contexto técnico necessário

- Pedido + aceite.
- `.maestro/PROJECT_CONTEXT.md` e índice local se existirem.
- Stack detectável; restrições do usuário.
- Capacidades reais da IDE (subagentes/Task ou papéis sequenciais).

## Workspace Maestro (`projects/`)

Quando o repositório aberto é o próprio Maestro (existem `skills/` e `projects/` na raiz):

- **Projeto ativo** = `projects/<slug>/` citado no pedido ou do arquivo aberto; senão `python scripts/new-project.py --list`.
- Ideia de software nova → `autonomous-project-builder` (modo **automatic** por padrão) cria `projects/<slug>/`.
- “`.maestro/`” nas Skills = `projects/<slug>/.maestro/`. O `.maestro/` da raiz é só scaffold da biblioteca — não é conhecimento de produto.
- Ordem de consulta antes de desenvolver: (1) Skills globais necessárias → (2) `PROJECT_CONTEXT.md` do projeto → (3) skills locais `.maestro/skills/` relevantes → (4) código existente.
- Mudanças em `skills/`, `agents/`, `templates/` = manutenção da biblioteca (`CONTRIBUTING.md`), nunca efeito colateral de um projeto.

## Regras obrigatórias

1. Classificar intenção: `create` | `fix` | `extend` | `refactor` | `ops` | `closeout`.
2. **Sempre** aplicar `maestro-token-efficiency` (não só quando pedido).
3. Consultar `.maestro/` do projeto ativo **antes** de exploração ampla do código.
4. Carregar só skills/agentes necessários — nunca o catálogo inteiro.
5. Preferir `maestro-orchestrator` quando houver pós-trabalho (review/QA/docs/git/knowledge).
6. Preservar padrões do projeto; diff mínimo.
7. Sem destrutivo / push / prod / custo sem autorização; decisões técnicas seguras são tomadas sem perguntar e registradas (`technical-decisions.md`).
8. Não inventar métricas de tokens.
9. Knowledge local ≠ global; promoção global só como sugestão humana.
10. Respostas proporcionais → `response-efficiency`.

## Processo de execução

1. Objetivo + aceite (1–2 frases).
2. Classificar intenção.
3. Ler Living Knowledge mínimo (se houver).
4. Scan leve só do que falta (deps/README/paths).
5. Montar trilha: skills de domínio e/ou agentes.
6. Executar etapa a etapa; reavaliar necessidade da próxima.
7. Se entrega não trivial: propor encerramento (review/QA/docs/knowledge/git).
8. Resumo curto: feito / problemas / próximo.

### Intenção → trilha

| Intenção | Sequência típica (podar!) |
|----------|---------------------------|
| `create` (ideia → produto) | `autonomous-project-builder` (automatic, em `projects/<slug>/`) — conduz discovery → spec → arch → foundation → dev → QA → docs → entrega |
| `create` (módulo em repo existente) | `.maestro` → arch leve → `development-agent` → closeout seletivo |
| `fix` | análise cirúrgica → `development-agent` → QA se P0 (**sem** orquestra completa) |
| `extend` | `.maestro` + limites → dev → docs/knowledge se contrato mudar |
| `refactor` | architecture → dev incremental → review |
| `ops` | `infrastructure-agent` |
| `closeout` | `maestro-orchestrator` checklist |

**Cenário E (correção simples):** 1 skill/agente de implementação; zero review/QA/docs/git agents até o usuário pedir.

### Agentes (sob demanda)

| Agente | Papel |
|--------|-------|
| `development-agent` | Implementar |
| `code-review-agent` | Revisar (read-only) |
| `qa-agent` | Testar com evidência |
| `documentation-agent` | Docs sync |
| `knowledge-agent` | `.maestro` vivo |
| `git-agent` | Commit; push com OK |
| `infrastructure-agent` | Deploy/env |

Coordenação: `maestro-orchestrator` + `agent-orchestration`. Subagentes delegáveis (definidos em `agents/`, sincronizados em `.cursor/agents` e `.claude/agents`): `maestro-frontend-developer`, `maestro-backend-developer`, `maestro-qa`, `maestro-code-reviewer`, `maestro-security-reviewer`.

### Domínio (skills clássicas)

| Domínio | Skills mínimas |
|---------|----------------|
| UI | `saas-app-shell` + `design-system` + FE/UX/mobile (apps com login) |
| API/dados | backend, api-design, postgres, multi-tenancy |
| Segurança | security, auth |
| Infra | hostinger/docker/nginx/env… |

**Economia:** ≤1–3 `SKILL.md` abertos por etapa; agents recebem resumo, não transcript.

## Boas práticas

- Anunciar trilha em ≤5 linhas.
- Uma etapa por vez.
- Após mudanças relevantes, sugerir `knowledge-agent` (não forçar em typo).

## Erros comuns

- Ativar todos os agentes.
- Ignorar `.maestro` e reler o monorepo.
- Afirmar testes sem executar.
- Push automático.
- Duplicar global em local.

## Exemplos práticos

**A** — portal novo: discovery → Prompt Master → foundation/arch → orchestrator com dev…  
**B** — bug login: analysis → development-agent → qa-agent smoke.  
**C** — “finalize entrega”: orchestrator closeout com escolha do usuário.

## Critérios de qualidade

- Trilha justificada e mínima.
- Knowledge local usado quando existe.
- Tokens: sem exploração/planos/relatórios desperdício.
- Closeout proporcional.

## Checklist de validação

- [ ] Intenção classificada
- [ ] Token efficiency aplicada
- [ ] Projeto ativo identificado (se workspace Maestro)
- [ ] `.maestro` consultado ou ausência notada
- [ ] Skills/agentes mínimos
- [ ] Sem irreversível sem auth
- [ ] Encerramento proposto se cabível
- [ ] Resposta concisa

## Skills relacionadas

- `maestro-token-efficiency`, `maestro-orchestrator`, `agent-orchestration`
- Agentes: `development-agent`, `code-review-agent`, `qa-agent`, `documentation-agent`, `git-agent`, `knowledge-agent`, `infrastructure-agent`
- Efficiency: `context-management`, `prompt-optimization`, `intelligent-code-analysis`, `efficient-development`, `response-efficiency`
- Template: `templates/living-project-knowledge/` → `.maestro/`; projetos: `scripts/new-project.py`, `docs/autonomous-development.md`
