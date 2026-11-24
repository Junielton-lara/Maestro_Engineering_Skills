# Database map

## Entidades principais

User, RefreshToken, Patient, PatientDecision. Ver `DATABASE.md`.

## Relacionamentos

Médico 1—N pacientes. Paciente 1—N decisões. Refresh pertence ao usuário.

## Migrations recentes relevantes

`20261124180000_init` cria o schema e o check dos 4 dígitos do documento.
