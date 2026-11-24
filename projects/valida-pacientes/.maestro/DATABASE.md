# Database

> Modelo de dados vivo. Atualizar junto com migrations. Sem connection strings reais.

## Engine e ferramentas

| Item | Valor |
|------|-------|
| Engine | PostgreSQL 16 (Compose local, porta host 54329) |
| ORM / query builder | Prisma |
| Migrations (path) | `backend/prisma/migrations/` |
| Seeds (path) | `backend/prisma/seed.js` |

Bancos lógicos separados: aplicação e teste. URLs só em `.env` / ambiente de teste, nunca neste arquivo.

## Entidades principais

| Tabela | Papel | Chave | Tenant/dono? |
|--------|-------|-------|--------------|
| User | Médico ou administrador | id (cuid) | Não. Papel no próprio registro |
| RefreshToken | Sessão de refresh revogável | id | userId |
| Patient | Pessoa da lista operacional | id | assignedDoctorId |
| PatientDecision | Histórico imutável de validação | id | doctorId + patientId |

## Relacionamentos

- User 1—N Patient (médico responsável).
- User 1—N PatientDecision (autor da decisão).
- Patient 1—N PatientDecision.
- User 1—N RefreshToken. Apagar usuário remove refresh. Decisão e paciente não somem em cascata a partir do médico: o médico da V1 não é apagado pela API.

## Constraints e índices relevantes

| Tabela | Índice/constraint | Motivo (consulta/regra) |
|--------|-------------------|-------------------------|
| User | email único | Login |
| User | role enum ADMIN, MEDICO | BR-09 |
| RefreshToken | tokenHash único | Lookup do refresh |
| Patient | índice (assignedDoctorId, status) | Lista do médico e resumo |
| Patient | documentLast4 com 4 dígitos (check) | BR-07 |
| Patient | status enum PENDENTE, VALIDADO, RECUSADO | RF-02 |
| PatientDecision | índice (patientId, createdAt) | Histórico |
| PatientDecision | reason obrigatório se RECUSADO (aplicado no serviço) | BR-04 |

## Isolamento de dados

- Estratégia: organização única. Médico restrito a `assignedDoctorId = usuário autenticado` e `active = true`.
- Onde é enforced: `backend/src/patients/patients.service.ts`. A query do cliente não aceita `doctorId`.

## Migrations relevantes

| Migration | Mudança | Data |
|-----------|---------|------|
| `20261124180000_init` | User, RefreshToken, Patient, PatientDecision | 2026-11-24 |

## Backup / dados sensíveis

- V1 local, sem backup de produção.
- Dado pessoal mínimo: nome, data de nascimento, 4 dígitos de documento, nota operacional. Sem dado clínico.
- Senha só como hash argon2. Refresh só como SHA-256.
- Seeds fictícios. Não carregar paciente real.
