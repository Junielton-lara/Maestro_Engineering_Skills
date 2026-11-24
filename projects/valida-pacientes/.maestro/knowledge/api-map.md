# API map

Contrato entre frontend e backend. Prefixo `/api/v1`. Erro: `{ "code", "message", "details": [{ "field", "message" }] }`.

| Method | Path | Auth / perfis | Request (body/query) | Response | Erros | Regras (BR) |
|--------|------|---------------|----------------------|----------|-------|-------------|
| GET | /health | público | — | `{ status: "ok" }` | 500 | — |
| POST | /auth/login | público, 5/min | `{ email, password }` | `{ accessToken, user: { id, name, email, role } }` + Set-Cookie `refresh_token` | 400 VALIDATION_FAILED, 401 AUTH_INVALID_CREDENTIALS, 429 | BR-01 |
| POST | /auth/refresh | cookie | — | `{ accessToken, user }` + cookie novo | 401 AUTH_REFRESH_INVALID | — |
| POST | /auth/logout | cookie opcional | — | 204 | — | — |
| GET | /auth/me | Bearer | — | user público | 401 AUTH_REQUIRED | — |
| GET | /patients | médico, admin | `page`, `pageSize`, `q`, `status` | `{ data, page, pageSize, total }` | 401 | BR-02 |
| GET | /patients/summary | médico, admin | — | `{ pendente, validado, recusado }` | 401 | BR-02 |
| GET | /patients/:id | médico (próprio), admin | — | paciente + `decisions[]` | 401, 404 PATIENT_NOT_FOUND | BR-02 |
| POST | /patients | admin | `{ fullName, birthDate, documentLast4, operationalNote?, assignedDoctorId }` | paciente pendente | 400, 403 | BR-07, BR-09 |
| PATCH | /patients/:id | admin | campos parciais | paciente | 400, 403, 404 | BR-08 |
| POST | /patients/:id/decisions | médico atribuído | `{ decision: "VALIDADO"\|"RECUSADO", reason? }` | paciente atualizado | 400, 403 PATIENT_DECISION_FORBIDDEN, 404, 409 PATIENT_INACTIVE | BR-03, BR-04, BR-05, BR-06 |
| GET | /doctors | admin | — | `[{ id, name, email }]` médicos ativos | 401, 403 | BR-09 |

Paciente na resposta: `id`, `fullName`, `birthDate` (`YYYY-MM-DD`), `documentLast4`, `operationalNote`, `status`, `active`, `assignedDoctor` `{ id, name }`, `createdAt`, `updatedAt`. Decisão: `id`, `decision`, `reason`, `createdAt`, `doctor` `{ id, name }`.

Lista do médico ignora `active=false`. Administrador vê inativos. O cliente não envia `assignedDoctorId` como filtro.
