# ValidaPacientes — instruções para agentes

Projeto Maestro em `projects/valida-pacientes/`. Todo trabalho deste produto acontece **dentro desta pasta**.

## Antes de qualquer tarefa (nesta ordem)

1. Skills globais relevantes do Maestro — só as necessárias (`maestro-core` decide a trilha).
2. `.maestro/PROJECT_CONTEXT.md` — identidade, stack, **estado atual e próximo passo**.
3. `.maestro/skills/SKILL.md` → skill local da área tocada.
4. Sob demanda: `.maestro/PRODUCT_SPECIFICATION.md`, `.maestro/ARCHITECTURE.md`, `.maestro/DATABASE.md`, `.maestro/technical-decisions.md`, `.maestro/knowledge/*`.
5. Código existente do módulo vizinho.

Skills globais vivem na raiz do Maestro (`skills/<nome>/SKILL.md`, sincronizadas em `.cursor/skills` e `.claude/skills`). Se esta pasta for aberta isoladamente e a skill não estiver disponível, leia `../../skills/<nome>/SKILL.md`.

## Regras

- Não editar Skills globais, `templates/` nem outros projetos em `projects/`.
- Conhecimento específico deste produto fica em `.maestro/` (nunca nas Skills globais).
- Decisões técnicas importantes → `.maestro/technical-decisions.md` (ADR) e `.maestro/ARCHITECTURE.md`.
- Ao concluir uma etapa: atualizar "Estado atual" em `.maestro/PROJECT_CONTEXT.md` e o status em `PRODUCT_SPECIFICATION.md` §4.
- Funcionalidade = comportamento real + persistência + validação no servidor + testes. Sem telas demonstrativas.
- Nunca afirmar que testes passaram sem executá-los.
- Sem segredos em código, docs ou `.maestro/`; usar `.env` (ignorado) e `.env.example`.
- Push, deploy, produção, operações destrutivas ou custos → pedir autorização explícita.

## Comandos

Ver `README.md` deste projeto (seção "Como executar").
