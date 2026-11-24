# projects/

Workspace de produtos construídos com o Maestro. Cada subpasta é um projeto **independente**, com código, testes, documentação e conhecimento próprios (`.maestro/`).

```text
projects/<slug>/
  frontend/  backend/  database/  tests/  docs/   # conforme .maestro/ARCHITECTURE.md
  .maestro/                                       # spec, arquitetura, banco, decisões, skills locais
  AGENTS.md  CLAUDE.md  README.md
```

## Criar / listar

```bash
python scripts/new-project.py <slug> --name "Nome do Produto"
python scripts/new-project.py --list
```

Normalmente quem executa é o próprio Maestro (`autonomous-project-builder`) ao receber uma ideia.

## Regras

- Skills globais ficam em `skills/` na raiz — não copiar para dentro do projeto.
- Um projeto não lê nem altera outro projeto.
- Abra a **raiz do Maestro** como workspace na IDE para que as Skills e subagentes globais sejam descobertos. Ver `docs/autonomous-development.md`.
- Versionamento: os projetos ficam no repositório do Maestro por padrão. Extrair para um repositório próprio é uma decisão do desenvolvedor (`git-agent`).
