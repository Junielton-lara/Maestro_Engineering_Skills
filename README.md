# Maestro Engineering Skills

Biblioteca profissional de **Agent Skills** para engenharia de software assistida por IA.

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
6. **Agentes de papel** (`*-agent`) para etapas do ciclo de vida.
7. Sync para IDEs: `.cursor/skills/` e `.claude/skills/`.

```bash
python scripts/sync-skills.py
python scripts/validate-skills.py
```

> Convenções reais: **`.cursor`** (Cursor) e **`.claude`** (Claude Code). Pastas `.curso`/`.cloud` **não** são o mecanismo de descoberta dessas ferramentas.

## Início rápido

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

### Iniciar um projeto novo (ideia → V1)

```text
Use autonomous-project-builder no modo assisted
(ou planning / automatic com gates de segurança).
```

Fluxo: Discovery → Prompt Master → `project-foundation` → Arquitetura → Dev → Testes → Review → Docs → Knowledge → Entrega V1.

### Living Project Knowledge

```powershell
Copy-Item -Recurse templates\living-project-knowledge caminho\do\app\.maestro
```

Atualize com `knowledge-agent` após mudanças relevantes de regra/arquitetura/schema.

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
| Cursor | `.cursor/skills/` | Descoberta por description; subagentes `Task` opcionais |
| Claude Code | `.claude/skills/` | Mesmo conteúdo sync; campos extras Claude só se necessários e documentados |
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
skills/                         # fonte canônica global
.cursor/skills/                 # sync Cursor
.claude/skills/                 # sync Claude Code
.maestro/                       # scaffold Living Knowledge (biblioteca)
templates/                      # Prompt Master, foundation, publish, living knowledge
docs/                           # notas de extração / histórico
scripts/sync-skills.py
scripts/validate-skills.py
MAESTRO_ENGINEERING_STANDARDS.md
README.md
CONTRIBUTING.md
CHANGELOG.md
```
