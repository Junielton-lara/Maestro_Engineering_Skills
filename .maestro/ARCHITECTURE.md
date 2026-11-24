# Architecture

> Como o produto é construído. Fatos e decisões com evidência (paths). Motivos detalhados em `technical-decisions.md`.

## Estilo

- Estilo (modular monolito / SPA + API / fullstack SSR / …):
- Por quê (1–2 linhas; ADR em `technical-decisions.md`):

## Stack

| Camada | Tecnologia | Versão | Justificativa |
|--------|------------|--------|---------------|
| Frontend | | | |
| Backend | | | |
| Banco | | | |
| ORM / migrations | | | |
| Auth | | | |
| Testes | | | |
| Infra local | | | |

## Diagrama textual

```text
[Client] -> [API] -> [Services] -> [DB]
```

## Estrutura de diretórios

```text
./
  frontend/
  backend/
  database/
  tests/
  docs/
  .maestro/
```

## Módulos e limites

| Módulo | Pode | Não pode |
|--------|------|----------|

## Frontend

- Shell / navegação:
- Design system (tokens, kit de componentes):
- Data fetching / estado:
- Formulários e validação:
- Estados loading / empty / error:

## Backend

- Camadas (controller → service → repository):
- Validação de entrada:
- Formato de erro padronizado:
- Logs:

## APIs

- Estilo (REST / …), prefixo, versionamento:
- Paginação, filtros, ordenação:
- Contrato de erro:
- Mapa de endpoints: `knowledge/api-map.md`

## Autenticação e permissões

- Mecanismo (sessão / JWT + refresh / …):
- Perfis e matriz de permissões:
- Onde é enforced (paths):

## Segurança

- Segredos (env), CORS, rate limit, headers:
- Dados sensíveis / LGPD:
- Isolamento de dados (tenant / dono do registro):

## Integrações

- Ver `knowledge/integrations.md`.

## Estratégia de testes

| Nível | Ferramenta | Escopo | Comando |
|-------|------------|--------|---------|
| Unit | | | |
| Integração/API | | | |
| E2E | | | |

## Infraestrutura e deploy

- Ambiente local (Docker / serviços nativos):
- Variáveis de ambiente: `.env.example` em cada app
- Alvo de deploy (quando definido):
- Health check / rollback:

## Skills globais aplicadas

- 
