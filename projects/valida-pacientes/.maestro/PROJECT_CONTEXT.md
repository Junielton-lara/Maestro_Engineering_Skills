# Project Context

> Preencher com fatos observados. Sem segredos.

## Identidade

| Campo | Valor |
|-------|-------|
| Nome do produto | ValidaPacientes |
| Tipo | interno (uma clínica) |
| Repositório | `projects/valida-pacientes/` |
| Owners | desenvolvedor do workspace |

## Stack observada

| Camada | Tecnologia | Evidência (path) |
|--------|------------|------------------|
| Frontend | React, TypeScript, Vite, Tailwind | `frontend/` |
| Backend | NestJS, TypeScript | `backend/` |
| Banco | PostgreSQL 16 + Prisma | `database/docker-compose.yml`, `backend/prisma/` |
| Auth | JWT + refresh cookie httpOnly | `backend/src/auth/` |
| Deploy | não definido | — |

## Módulos principais

| Módulo | Responsabilidade | Path |
|--------|------------------|------|
| auth | Login, refresh, logout | `backend/src/auth/`, `frontend/src/features/auth/` |
| pacientes | Lista, cadastro, validação | `backend/src/patients/`, `frontend/src/features/patients/` |

## Multi-tenancy / isolation

- Estratégia: organização única; médico limitado aos próprios pacientes ativos.
- Onde é enforced: `backend/src/patients/patients.service.ts`.

## Convenções críticas

- Branches / PRs: ainda no workspace, sem remoto desta entrega.
- Testes obrigatórios: `npm test` em `backend/` e `frontend/`.
- UI kit / tokens: `frontend/src/index.css` e `frontend/src/components/ui/`.

## Estado atual (retomada entre sessões)

| Campo | Valor |
|-------|-------|
| Fase do fluxo | 8 Entrega |
| Último entregável validado | Front no padrão saas-app-shell (+Gestor): sidebar, dash, Inter |
| Próximo passo | Revisar visual; commit se pedido |
| Bloqueios / perguntas abertas | Nenhum |

## Fora de escopo deste knowledge

- Prontuário e qualquer dado clínico.
- Outros projetos em `projects/`.
