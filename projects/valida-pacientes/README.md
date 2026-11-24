# ValidaPacientes

O médico entra e valida, um a um, os pacientes atribuídos a ele. O administrador monta essa lista. Não há prontuário: o cadastro guarda nome, nascimento, os 4 últimos dígitos do documento e uma nota operacional. Os dados de demonstração são fictícios.

## Como executar

Pré-requisitos: Node 20, npm e Docker.

```powershell
docker compose -f database/docker-compose.yml up -d
Copy-Item backend/.env.example backend/.env
cd backend
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173
- API: http://localhost:3001/api/v1/health

Acesse com os usuários fictícios (senha `SenhaDev#2026`):

| Papel | E-mail |
|-------|--------|
| Médica | ana.mendes@valida.local |
| Médico | bruno.nogueira@valida.local |
| Admin | admin@valida.local |

Ana e Bruno não veem a lista um do outro.

## Testes

Com o Postgres no ar:

```powershell
cd backend
npm test
cd ../frontend
npm test
```

O teste de API usa o banco `valida_pacientes_test` e apaga as tabelas desse banco a cada caso.

## Limitações

- Médicos novos só entram pelo seed. A tela cadastra pacientes, não usuários.
- Não há validação em lote.
- Sem prontuário, agenda, portal do paciente ou mais de uma clínica.
- `COOKIE_SECURE=false` serve só para HTTP local. Não publique esse `.env`.
