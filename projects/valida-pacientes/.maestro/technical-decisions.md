# Technical decisions

> ADRs leves. Uma entrada por decisão relevante (stack, arquitetura, banco, auth, libs, infra).
> `Decidido por`: `maestro` (autônomo, dentro da regra de autonomia) ou `usuário`.

### ADR-001 — SPA + API NestJS + PostgreSQL

- Status: aceito
- Data: 2026-11-24
- Decidido por: maestro
- Contexto: app com login, dois papéis e lista persistida. O pedido não fixou stack. Ambiente com Node 20, npm e Docker.
- Decisão: React + Vite + TypeScript, NestJS, PostgreSQL 16, Prisma, Tailwind com tokens próprios. Layout `frontend/`, `backend/`, `database/`.
- Alternativas consideradas: Next.js (SEO irrelevante numa área logada); FastAPI (o pedido não é Python); SQLite (Docker está disponível, então Postgres desde a V1).
- Consequências: dois processos locais e Compose. Trocar o provider do Prisma depois exige regerar migrations.
- Evidência: `backend/`, `frontend/`, `database/docker-compose.yml`.

### ADR-002 — JWT curto e refresh em cookie httpOnly

- Status: aceito
- Data: 2026-11-24
- Decidido por: maestro
- Contexto: sessão de médico em SPA, com revogação e sem guardar refresh em localStorage.
- Decisão: access token 15 minutos em memória no browser; refresh opaco (hash no banco) em cookie HttpOnly Path=/api/v1/auth; rotação e detecção de reuso; senha com `@node-rs/argon2`.
- Alternativas consideradas: sessão só server-side (mais estado no processo); JWT longo no localStorage (XSS leva a sessão); bcryptjs puro (reserva se o binário argon2 não instalar no Windows).
- Consequências: SPA precisa chamar `/auth/refresh` no carregamento. Cookie `Secure` fica desligado só no HTTP local.
- Evidência: `backend/src/auth/`.

### ADR-003 — Decisão por paciente, sem prontuário

- Status: aceito
- Data: 2026-11-24
- Decidido por: maestro
- Contexto: “validar lista de pacientes” em domínio de saúde. Dado clínico amplo fica fora da V1.
- Decisão: status atual no paciente mais histórico append-only. Documento persistido apenas com 4 dígitos. Sem CID, evolução ou exame.
- Alternativas consideradas: um booleano “lista validada” no turno (perde quem foi conferido); prontuário mínimo (excede o pedido e aumenta risco LGPD).
- Consequências: validar a lista é percorrer os pendentes. Não há carimbo em lote.
- Evidência: `PRODUCT_SPECIFICATION.md` BR-05, BR-07, BR-10; `prisma/schema.prisma`.

### ADR-004 — Isolamento por médico, sem multi-tenant

- Status: aceito
- Data: 2026-11-24
- Decidido por: maestro
- Contexto: o pedido não cita várias clínicas nem SaaS.
- Decisão: uma organização. Autorização por papel e por `assignedDoctorId`.
- Alternativas consideradas: `tenantId` em todas as tabelas (custo sem requisito).
- Consequências: segunda clínica exigiria migração de modelo.
- Evidência: `patients.service.ts`.

### ADR-006 — Nest 10 e Prisma 6 neste Node

- Status: aceito
- Data: 2026-11-24
- Decidido por: maestro
- Contexto: a máquina tem Node 20.20.2. Nest 12 é só ESM e o Jest da V1 não carrega esse pacote. Prisma 7 tirou `url` do schema e pede Node 22.
- Decisão: NestJS 10.4, Prisma 6.19, TypeScript 6 no backend (compila com o Nest 10) e PostgreSQL 16.
- Alternativas consideradas: subir o Node do sistema para 22 (condição de parada: não instalar runtime global); reescrever a API em ESM puro para Nest 12.
- Consequências: a V1 fica em CommonJS. Subir para Nest 12 ou Prisma 7 exige Node 22 e uma migração de toolchain.
- Evidência: `backend/package.json`.

### ADR-005 — Postgres em porta alta do Compose

- Status: aceito
- Data: 2026-11-24
- Decidido por: maestro
- Contexto: a máquina pode já usar 5432.
- Decisão: publicar o Postgres do projeto em `localhost:54329`, com banco de teste separado criado no init do volume.
- Alternativas consideradas: 5432 padrão (conflito); SQLite (ADR-001).
- Consequências: connection string local usa 54329. Volume novo é necessário para o script de init rodar.
- Evidência: `database/docker-compose.yml`.
