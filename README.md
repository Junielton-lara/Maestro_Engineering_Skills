# Maestro Engineering Skills

Biblioteca profissional de **Agent Skills** para engenharia de software assistida por IA — e ambiente onde o Maestro transforma uma ideia em software completo dentro de `projects/`.

O Maestro transforma boas práticas de arquitetura, front-end, back-end, qualidade, infra e operação em instruções reutilizáveis que agentes (Cursor, Claude Code e compatíveis com [Agent Skills](https://agentskills.io/specification)) podem descobrir e aplicar sob demanda.

## Problema que resolve

Sem um framework, agentes tendem a:

- Redescobrir o projeto a cada conversa
- Carregar contexto demais (custo e ruído)
- Inventar arquitetura/UI genéricas
- Pular testes, segurança ou documentação
- Misturar conhecimento global com regras de um produto

O Maestro organiza **o que** fazer, **quando** ativar cada especialidade e **como** preservar conhecimento vivo por projeto.

## Como funciona

1. **Skills globais** em `skills/<nome>/SKILL.md` (fonte canônica).
2. Descoberta por `name` + `description` (progressive disclosure).
3. **`maestro-core`** classifica a intenção e monta a trilha mínima.
4. **`maestro-token-efficiency`** vale **sempre** (não só quando pedida).
5. **Living Knowledge** do produto em `.maestro/` (separado do global).
6. **Agentes de papel** (`*-agent`) para etapas do ciclo de vida + **subagentes reais** em `agents/` (FE, BE, QA, review, segurança).
7. Sync para IDEs: `.cursor/skills/` e `.claude/skills/`; `.cursor/agents/` e `.claude/agents/`.
8. **Workspace de produtos** em `projects/<slug>/`: o Maestro recebe uma ideia e constrói o software ali, isolado, com `.maestro/` próprio. `AGENTS.md`/`CLAUDE.md` na raiz roteiam o agente.

```bash
python scripts/sync-skills.py
python scripts/validate-skills.py
```

> Convenções reais: **`.cursor`** (Cursor) e **`.claude`** (Claude Code). Pastas `.curso`/`.cloud` **não** são o mecanismo de descoberta dessas ferramentas.

## Início rápido

### Construir um software completo (ideia → V1)

Abra a raiz deste repositório no Cursor ou Claude Code e escreva a ideia:

```text
Quero criar um sistema para gerenciar médicos, pacientes e atendimentos.
```

O Maestro (`autonomous-project-builder`, modo automatic) cria `projects/<slug>/`, gera especificação, arquitetura e decisões em `.maestro/`, implementa frontend/backend/banco com testes e entrega um relatório — perguntando só o indispensável ou arriscado. Guia: [`docs/autonomous-development.md`](./docs/autonomous-development.md).

```bash
python scripts/new-project.py --list   # projetos existentes e fase atual
```

### Usar no Cursor / Claude Code

1. Clone ou copie este repositório (ou só `skills/` + sync).
2. Garanta `.cursor/skills` e/ou `.claude/skills` atualizados via sync.
3. Peça: **“Use Maestro Core”** ou nomeie a skill (`prompt-master-generator`, `hostinger-deployment`, …).

### Gerar um Prompt Master

```text
Use product-discovery se a ideia for vaga.
Depois use prompt-master-generator.
Faça uma pergunta por vez só se faltar dado essencial.
Gere o Prompt Master específico deste produto (não um blueprint genérico).
```

Template: `templates/prompt-master.md`.

### Modos do builder

```text
Use autonomous-project-builder em modo planning (só documentos) ou assisted (confirma stack e módulos).
Sem indicação, o modo é automatic.
```

Fluxo: Discovery → Product Definition → Arquitetura → Foundation → Desenvolvimento → QA → Docs/Knowledge → Entrega V1.

### Living Project Knowledge

```powershell
Copy-Item -Recurse templates\living-project-knowledge caminho\do\app\.maestro
```

Atualize com `knowledge-agent` após mudanças relevantes de regra/arquitetura/schema. Projetos em `projects/` já recebem o `.maestro/` via `scripts/new-project.py`.

### Correção simples (economia)

```text
Corrija X em Y. Use o mínimo de contexto.
Não acione review/QA/docs/git a menos que eu peça.
```

## Catálogo (resumo)

| Grupo | Skills |
|-------|--------|
| **Core** | `maestro-core`, `maestro-orchestrator`, `maestro-token-efficiency`, `autonomous-project-builder`, `project-foundation`, `product-discovery`, `prompt-master-generator`, `software-architecture`, `project-planning` |
| **Agentes** | `development-agent`, `code-review-agent`, `qa-agent`, `documentation-agent`, `git-agent`, `knowledge-agent`, `infrastructure-agent` |
| **Subagentes** (`agents/`) | `maestro-frontend-developer`, `maestro-backend-developer`, `maestro-qa`, `maestro-code-reviewer`, `maestro-security-reviewer` |
| **Efficiency** | `context-management`, `prompt-optimization`, `intelligent-code-analysis`, `efficient-development`, `agent-orchestration`, `response-efficiency` |
| **FE / BE / Quality / Infra / Docs** | ver pastas em `skills/` |

Padrões oficiais: [`MAESTRO_ENGINEERING_STANDARDS.md`](./MAESTRO_ENGINEERING_STANDARDS.md).

## Exemplos práticos

**A — Ideia SaaS:** “Quero um CRM de vendas simples” → `autonomous-project-builder` (planning) ou Core → discovery → Prompt Master com módulos contas/pedidos/estoque.

**B — Feature em app existente:** consultar `.maestro` → `development-agent` → diff mínimo.

**C — Closeout:** `maestro-orchestrator` propõe Review / QA / Docs / Knowledge / Git; usuário escolhe.

**D — Regra de negócio mudou:** `knowledge-agent` atualiza `.maestro` + changelog (sem skill nova se for incremento).

**E — Typo:** um arquivo, sem orquestra.

## Compatibilidade

| Ambiente | Pasta de Skills | Notas |
|----------|-----------------|-------|
| Cursor | `.cursor/skills/`, `.cursor/agents/`, `AGENTS.md` | Descoberta por description; `AGENTS.md` raiz e aninhado em `projects/<slug>/` |
| Claude Code | `.claude/skills/`, `.claude/agents/`, `CLAUDE.md` | Mesmo conteúdo sync; `CLAUDE.md` importa `AGENTS.md`; subagentes não validados em execução |
| Outros Agent Skills | `skills/` | Seguir [agentskills.io](https://agentskills.io/specification) |

**Não** afirmamos compatibilidade universal com qualquer IDE sem validação.

Adapters: `.cursor/README.md`, `.claude/README.md`.

## Segurança

- Não commitar `.env`, chaves, certificados, PII.
- Skills e `.maestro` **nunca** armazenam segredos.
- Push/deploy/produção exigem autorização explícita (`git-agent`, `infrastructure-agent`).
- Ver `.gitignore`.

## Contribuir

Veja [CONTRIBUTING.md](./CONTRIBUTING.md). Histórico: [CHANGELOG.md](./CHANGELOG.md).

## Licença

**Pendência:** não há arquivo `LICENSE` neste repositório. Defina e adicione uma licença **antes** de publicar como open source ou redistribuir. Não assuma MIT/Apache sem decisão do maintainer.

## Estrutura do repositório

```text
AGENTS.md / CLAUDE.md           # instruções sempre carregadas pelos agentes
skills/                         # fonte canônica global
agents/                         # subagentes (fonte canônica)
.cursor/skills/ .cursor/agents/ # sync Cursor
.claude/skills/ .claude/agents/ # sync Claude Code
.maestro/                       # scaffold Living Knowledge (biblioteca; não é projeto)
projects/                       # produtos construídos pelo Maestro (um por pasta)
templates/                      # Prompt Master, foundation, project, living knowledge
docs/                           # guia do ambiente autônomo, notas de extração
scripts/sync-skills.py
scripts/validate-skills.py
scripts/new-project.py
MAESTRO_ENGINEERING_STANDARDS.md
README.md
CONTRIBUTING.md
CHANGELOG.md
```
