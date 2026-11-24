# Architecture

## Estilo

SPA + API REST. Monólito modular NestJS. Isolamento por médico no serviço de pacientes.

## Diagrama textual

Browser -> `/api/v1` -> auth | patients | doctors -> Prisma -> PostgreSQL.

## Módulos e limites

auth emite sessão. patients decide validação. doctors só lista médicos ativos para o admin.

## Decisões

ADR-001 a ADR-006 em `technical-decisions.md`.
