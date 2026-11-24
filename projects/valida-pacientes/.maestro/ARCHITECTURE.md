# Architecture

> Como o produto é construído. Fatos e decisões com evidência (paths). Motivos detalhados em `technical-decisions.md`.

## Estilo

- Estilo: SPA + API REST, monólito modular.
- Por quê: um time, dois papéis, CRUD com regra de acesso. Sem fila, sem microsserviço. ADR-001.

## Stack

| Camada | Tecnologia | Versão | Justificativa |
|--------|------------|--------|---------------|
| Frontend | React + TypeScript + Vite | lockfile do `frontend/` | SPA com login e lista |
| Backend | Node 20 + TypeScript + NestJS 10.4 | `backend/package.json` | CommonJS neste Node; Nest 12 é ESM e pede Node 22 (ADR-006) |
| Banco | PostgreSQL 16 | imagem `postgres:16-alpine` | Relação usuário–paciente–decisão |
| ORM / migrations | Prisma 6.19 | `backend/package.json` | Prisma 7 exige Node 22 (ADR-006) |
| Auth | JWT de acesso (15 min) + refresh opaco em cookie httpOnly; senha com argon2 (`@node-rs/argon2`) ou bcryptjs se o binário nativo falhar | — | ADR-002 |
| Testes | Jest + Supertest (API); Vitest (regras de formulário) | lockfile | CA-01–CA-07 e schemas |
| Infra local | Docker Compose em `database/docker-compose.yml` | Docker 29.3.1 | Postgres só do projeto, porta 54329 |

## Diagrama textual

```text
[Browser SPA] --Bearer + cookie refresh--> [NestJS /api/v1]
  auth        pacientes        usuários
     \            |               /
      +---- PrismaService ---- PostgreSQL
```

O médico nunca escolhe o filtro de dono: o serviço impõe `assignedDoctorId` a partir do token.

## Estrutura de diretórios

```text
projects/valida-pacientes/
  frontend/src/{app,layouts,features,components/ui,services,lib}
  backend/src/{auth,patients,users,health,common,prisma}
  backend/prisma/
  database/docker-compose.yml
  docs/
  .maestro/
```

## Módulos e limites

| Módulo | Pode | Não pode |
|--------|------|----------|
| auth | Login, refresh, logout, identidade do token | Decidir validação de paciente |
| patients | Lista, cadastro, decisão, histórico | Emitir sessão; guardar dado clínico |
| users | Listar médicos ativos para o select do admin | Criar usuário na V1 (seed) |
| frontend | Estados de UI e validação espelhada | Autorizar sozinho; confiar em papel vindo só da tela |

## Frontend

- Shell: barra superior com nome, papel e sair; conteúdo em coluna única até 64rem.
- Design system: tokens em `frontend/src/index.css`; primitivos em `components/ui` (botão, campo, badge, diálogo, estados).
- Data fetching: TanStack Query. Access token só em memória. Refresh pelo cookie.
- Formulários: React Hook Form + Zod, mensagens iguais às regras do servidor.
- Estados: carregando com região viva, vazio com orientação, erro com tentar de novo.

## Backend

- Camadas: controller → service → Prisma. Sem repository extra.
- Validação: `ValidationPipe` whitelist + `forbidNonWhitelisted`.
- Erro: `{ code, message, details[] }`. 500 sem stack na resposta.
- Logs: JSON com método, rota, status, code e requestId. Sem senha, cookie, token ou corpo de login.

## APIs

- REST, prefixo `/api/v1`, sem versão no payload.
- Lista: `page`, `pageSize` (máx. 50), `q`, `status`. Resposta `{ data, page, pageSize, total }`.
- Erros estáveis documentados em `knowledge/api-map.md`.
- Mapa de endpoints: `knowledge/api-map.md`.

## Autenticação e permissões

- Access JWT (issuer/audience `valida-pacientes`) no header `Authorization: Bearer`.
- Refresh opaco, hash SHA-256 no banco, cookie `refresh_token` HttpOnly, SameSite=Lax, Path=/api/v1/auth. `Secure` só quando `COOKIE_SECURE=true`.
- Rotação no refresh. Reuso de refresh revogado invalida os refresh daquele usuário.
- Guard JWT carrega o usuário no banco (desativação vale na hora). `RolesGuard` default deny.
- Matriz: médico lê e decide os próprios; administrador cria e edita; decisão é exclusiva do médico.
- Enforced em `backend/src/common/guards` e `patients.service.ts`.

## Segurança

- Segredos só em `backend/.env` (gitignored). `.env.example` sem segredo de produção.
- CORS com origem explícita e `credentials`. Helmet. Limite de login: 5 por minuto.
- LGPD: mínimo cadastral, seed fictício, sem prontuário, documento só com 4 dígitos.
- Isolamento por dono do registro (`assignedDoctorId`), organização única.

## Integrações

- Nenhuma externa. E-mail e storage: N/A.

## Estratégia de testes

| Nível | Ferramenta | Escopo | Comando |
|-------|------------|--------|---------|
| Unit | Vitest | Schemas de login, paciente e recusa | `npm test` em `frontend/` |
| Integração/API | Jest + Supertest + Postgres de teste | Auth, isolamento, decisão, reset de status | `npm test` em `backend/` |
| E2E | Browser do fluxo P0 | Login, lista, validar | Verificação manual do fluxo na entrega |

## Infraestrutura e deploy

- Local: `docker compose -f database/docker-compose.yml up -d`. API em 3001, SPA em 5173 com proxy `/api`.
- Variáveis: `backend/.env.example`, `frontend/.env.example`.
- Deploy: não definido. Sem push nem publicação nesta entrega.
- Health: `GET /api/v1/health`. Rollback de schema: migration Prisma anterior, sem comando destrutivo automático.

## Skills globais aplicadas

- product-discovery, prompt-master-generator, software-architecture, project-foundation
- authentication-authorization, error-handling, design-system, development-agent
- database-postgresql (modelo), security-engineering (baseline de auth e dado mínimo)
