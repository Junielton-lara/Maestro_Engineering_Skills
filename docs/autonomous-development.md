# Ambiente de desenvolvimento autônomo

Como usar o Maestro para construir um software completo dentro deste repositório. Regras detalhadas de cada etapa ficam nas Skills (fonte da verdade); este guia mostra como as peças se encaixam.

## Uso

1. Abra a **raiz do Maestro** como workspace no Cursor (ou Claude Code).
2. Escreva a ideia, por exemplo: *“Quero criar um sistema para gerenciar médicos, pacientes e atendimentos.”*
3. O Maestro cria `projects/<slug>/`, especifica, decide a arquitetura, implementa, testa e entrega um relatório. Ele só pergunta quando falta algo indispensável ou há risco (dados reais sensíveis, custo, credenciais, ação irreversível, push/deploy).

Para continuar depois: *“Continue o projeto <slug>”* — o estado fica em `projects/<slug>/.maestro/PROJECT_CONTEXT.md`.

Modos opcionais: *“só planeje”* (planning: documentos, sem código) ou *“modo assistido”* (confirma stack e cada módulo).

## Estrutura

```text
AGENTS.md / CLAUDE.md        instruções sempre carregadas (roteamento + regras)
skills/                      Skills globais (fonte) → sync → .cursor/skills, .claude/skills
agents/                      subagentes (fonte)     → sync → .cursor/agents, .claude/agents
templates/project/           scaffold de projeto (README, AGENTS.md, CLAUDE.md, .gitignore)
templates/living-project-knowledge/   scaffold do .maestro/ de cada projeto
scripts/new-project.py       cria/lista projetos
projects/<slug>/
  frontend/ backend/ database/ tests/ docs/   conforme a arquitetura decidida
  .maestro/
    PROJECT_CONTEXT.md        identidade, stack, estado atual (retomada)
    PRODUCT_SPECIFICATION.md  pedido original, requisitos rastreáveis, regras, fluxos, aceite
    ARCHITECTURE.md           stack, estilo, FE/BE/API/auth/segurança/testes/infra
    DATABASE.md               modelo de dados e migrations
    technical-decisions.md    ADRs (quem decidiu e por quê)
    knowledge/                evidências: api-map, regras→código, integrações, convenções
    skills/                   skills locais do produto
    history/                  changelog do conhecimento
  AGENTS.md CLAUDE.md README.md
```

## Fluxo

| Fase | Skill principal | Resultado |
|------|-----------------|-----------|
| 0 Identificar projeto | `autonomous-project-builder` | Projeto novo criado ou existente retomado |
| 1 Product Discovery | `product-discovery` | Requisitos explícitos + complementos + premissas |
| 2 Product Definition | `prompt-master-generator` | `PRODUCT_SPECIFICATION.md` |
| 3 Arquitetura | `software-architecture` + `stack-defaults.md` | `ARCHITECTURE.md`, `DATABASE.md`, `technical-decisions.md` |
| 4 Foundation | `project-foundation` | Apps executáveis, auth, migrations, testes iniciais |
| 5 Desenvolvimento | `maestro-orchestrator` + subagentes FE/BE | Módulos completos (API + banco + UI + testes) |
| 6 QA | `maestro-qa`, `maestro-code-reviewer`, `maestro-security-reviewer` | Testes reais, achados corrigidos |
| 7 Docs + Knowledge | `documentation-agent`, `knowledge-agent` | README, `.maestro/` e skills locais atualizados |
| 8 Entrega | `git-agent` | Relatório; commit/push só com autorização |

Detalhes, regras de autonomia e condições de parada: [`skills/autonomous-project-builder/SKILL.md`](../skills/autonomous-project-builder/SKILL.md). Papéis (PM, arquiteto, FE, BE, DB, UX, QA, review, segurança, docs, infra, git, knowledge) e regras de paralelismo: [`skills/maestro-orchestrator/SKILL.md`](../skills/maestro-orchestrator/SKILL.md).

## Conhecimento global × local

| | Global | Local |
|--|--------|-------|
| Onde | `skills/`, `agents/`, `templates/`, Standards | `projects/<slug>/.maestro/` |
| Conteúdo | Engenharia reutilizável | Regras de negócio, arquitetura e decisões do produto |
| Quem altera | Mantenedor (via `CONTRIBUTING.md`) | `knowledge-agent` durante o projeto |

Promover algo local para global é sempre uma sugestão ao mantenedor, nunca automático.

## Compatibilidade com IDEs

Base: documentação oficial do Cursor (Skills, Rules/AGENTS.md, Subagents) e convenções do Claude Code.

| Mecanismo | Cursor | Claude Code |
|-----------|--------|-------------|
| Skills globais | `.cursor/skills/` (também lê `.claude/skills/`) | `.claude/skills/` |
| Instruções sempre ativas | `AGENTS.md` raiz (e `CLAUDE.md`) | `CLAUDE.md` raiz → importa `AGENTS.md` |
| Instruções do projeto | `projects/<slug>/AGENTS.md` aninhado (aplicado ao trabalhar em arquivos da pasta) | `projects/<slug>/CLAUDE.md` aninhado → importa `AGENTS.md` |
| Subagentes | `.cursor/agents/*.md` (também lê `.claude/agents/`) | `.claude/agents/*.md` |
| Skills locais `.maestro/skills/` | Não descobertas automaticamente — lidas por instrução do `AGENTS.md` do projeto | Idem |

Limites conhecidos:

- Abrir `projects/<slug>/` **sozinho** como workspace não carrega as Skills/subagentes da raiz (comportamento não documentado como suportado). O `AGENTS.md` do projeto instrui o fallback `../../skills/<nome>/SKILL.md`, mas o recomendado é abrir a raiz do Maestro.
- Validado neste repositório: estrutura, sync, validação e criação de projeto por script. **Não** validado em execução real: carregamento dos subagentes no Claude Code e o campo `tools` dos reviewers (o Cursor usa `readonly`).
- O Cursor lê `.cursor/agents` e `.claude/agents`; os nomes iguais resolvem para a versão `.cursor` (conteúdo idêntico via sync).

## Versionamento dos projetos

Projetos são versionados no repositório do Maestro por padrão: pastas ignoradas pelo Git tendem a ficar fora das buscas dos agentes (ripgrep respeita `.gitignore`), o que prejudicaria o desenvolvimento. Para um repositório próprio, peça ao `git-agent` a extração. Push/publicação sempre exigem autorização.
