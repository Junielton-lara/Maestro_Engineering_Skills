# Maestro Engineering — instruções para agentes

Este repositório tem duas funções:

1. **Biblioteca global** de engenharia: `skills/` (fonte canônica), `agents/` (subagentes), `templates/`, `MAESTRO_ENGINEERING_STANDARDS.md`.
2. **Workspace de produtos**: cada software fica isolado em `projects/<slug>/` com seu próprio `.maestro/`.

## Roteamento

| Pedido | Ação |
|--------|------|
| Ideia de software (“Quero criar um sistema…”) | Skill `autonomous-project-builder` (modo automatic): cria `projects/<slug>/` e conduz até a V1 |
| Trabalho em projeto existente | Skill `maestro-core`; projeto ativo = `projects/<slug>/` citado ou do arquivo aberto (`python scripts/new-project.py --list`) |
| Alterar Skills, agentes ou templates do Maestro | Seguir `CONTRIBUTING.md` (editar `skills/` e `agents/`, nunca `.cursor/` ou `.claude/`; rodar sync + validate) |

## Regras permanentes

- Economia de tokens sempre (`maestro-token-efficiency`): carregar só as Skills necessárias, não reler arquivos, resumos curtos.
- Ordem de consulta em projetos: Skills globais relevantes → `projects/<slug>/.maestro/PROJECT_CONTEXT.md` → `.maestro/skills/` relevante → código.
- O `.maestro/` da **raiz** é o scaffold da biblioteca, não conhecimento de produto.
- Conhecimento de produto nunca entra em `skills/`; Skills globais nunca são copiadas para projetos.
- Um projeto não altera outro projeto.
- Decisões técnicas seguras são tomadas sem pedir aprovação e registradas em `.maestro/technical-decisions.md`.
- Perguntar apenas quando faltar informação indispensável ou houver risco: dados sensíveis reais, custo, credenciais/autorização externa, ação irreversível, commit, push, deploy ou produção.
- Nunca afirmar que testes passaram sem executá-los. Nunca commitar segredos.
