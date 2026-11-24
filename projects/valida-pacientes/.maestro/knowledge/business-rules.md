# Business rules

| ID | Regra | Onde |
|----|-------|------|
| BR-01 | Mensagem única de credencial inválida | `auth.service.ts` login |
| BR-02 | Escopo do médico no `where` | `patients.service.ts` `scopeWhere` / `getById` |
| BR-03 | Decisão só do papel MEDICO | `patients.controller.ts` + service |
| BR-04 | Motivo 10–280 na recusa | DTO + service |
| BR-05 | Insert em PatientDecision e update de status na mesma transação | `patients.service.ts` `decide` |
| BR-06 | Inativo bloqueia decisão | `decide` |
| BR-07 | documentLast4 `^\d{4}$`; sem campos clínicos no schema | DTO + `schema.prisma` |
| BR-08 | Reset para PENDENTE se identidade ou médico mudam | `update` |
| BR-09 | Atribuição só a médico ativo | `assertDoctor` |
| BR-10 | Sem endpoint de decisão em lote | ausência de rota |
