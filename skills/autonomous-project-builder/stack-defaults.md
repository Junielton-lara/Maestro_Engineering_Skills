# Stack defaults — matriz de decisão autônoma

Lido na Fase 3 do `autonomous-project-builder`. Objetivo: decidir rápido e com segurança, sem pedir aprovação. Restrição explícita do usuário **sempre** prevalece. Registrar cada escolha como ADR (`Decidido por: maestro`, com alternativa considerada).

Versões: usar a versão estável/LTS atual de cada ferramenta e fixá-la no lockfile; registrar em `ARCHITECTURE.md`.

## 1. Detectar o ambiente antes de escolher

```bash
node --version; npm --version; python --version; docker --version; git --version
```

Escolher apenas ferramentas disponíveis ou instaláveis via gerenciador de pacotes do projeto.

- **Pode sem perguntar**: dependências do projeto (`npm install`, `pip install` em venv), `docker compose up` de serviços locais do projeto (baixa imagens), CLIs via `npx`.
- **Condição de parada**: instalar ou atualizar runtimes/serviços no sistema do usuário (Node, Python, Docker, PostgreSQL).
- Runtime instalado fora de suporte (EOL): seguir com ele se as libs suportarem, registrar ADR e recomendar upgrade no relatório.

## 2. Escolha pelo tipo de produto

| Tipo de produto | Arquitetura | Frontend | Backend | Banco |
|-----------------|-------------|----------|---------|-------|
| **Sistema web com login, perfis e CRUD** (padrão: gestão, ERP leve, clínica, CRM) | SPA + API REST, modular monolito | React + TypeScript + Vite | Node LTS + TypeScript + NestJS | PostgreSQL + Prisma |
| SaaS multi-empresa | Igual + `tenantId` em toda tabela de negócio, enforced na camada de repositório | idem | idem + guard de tenant | PostgreSQL (RLS opcional) |
| Site/conteúdo com SEO forte | Fullstack SSR | Next.js | Route handlers / server actions | PostgreSQL + Prisma (se houver dados) |
| Landing / institucional | Estático | Astro ou Vite estático | Nenhum (form → serviço/endpoint mínimo) | Nenhum |
| App mobile | Mobile + API | Expo (React Native) | NestJS | PostgreSQL + Prisma |
| Foco em dados/ML ou pedido Python | SPA + API | React + Vite | FastAPI + SQLAlchemy + Alembic + Pydantic | PostgreSQL |
| Tempo real (chat, painel ao vivo) | Igual ao padrão + WebSocket | idem | NestJS gateway (WebSocket) | PostgreSQL |

## 3. Pacote padrão (sistema web)

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Layout | `frontend/`, `backend/`, `database/`, `tests/` (E2E), `docs/` | Separação clara FE/BE; permite subagentes em paralelo |
| Gerenciador | npm (vem com Node) | Zero instalação extra |
| UI | Tailwind CSS + componentes próprios em `components/ui` com tokens semânticos | Alinha com `design-system`; sem lock-in |
| Roteamento / dados | React Router · TanStack Query | Cache, loading/error padronizados |
| Formulários | React Hook Form + Zod | Validação tipada; schema espelhado no server |
| API | NestJS (módulo por domínio), `ValidationPipe` whitelist, filtro de exceção global | Estrutura modular + validação server-side |
| ORM / migrations | Prisma (`backend/prisma/` ou `database/`) | Migrations versionadas, tipos gerados |
| Auth | JWT de acesso curto + refresh em cookie httpOnly; senha com argon2 (ou bcrypt); RBAC por guard | `authentication-authorization` |
| Logs | Logger estruturado (pino/nestjs-pino) sem PII | `observability` |
| Testes BE | Jest (padrão Nest) + Supertest com banco de teste | Regras e endpoints reais |
| Testes FE | Vitest + Testing Library | Componentes e hooks |
| E2E | Playwright (fluxos P0) | Critérios de aceite |
| Banco local | PostgreSQL via `database/docker-compose.yml` | Paridade com produção |
| Docs API | OpenAPI gerado pelo Nest (Swagger) | Contrato navegável |

## 4. Fallbacks (decidir sem parar)

| Situação | Decisão |
|----------|---------|
| Sem Docker, PostgreSQL local disponível | Usar o local; `DATABASE_URL` no `.env` |
| Sem Docker e sem PostgreSQL | Condição de parada: oferecer (a) instalar Docker/PostgreSQL ou (b) usar SQLite como banco da V1. Prisma prende as migrations a um provider (`migration_lock.toml`): trocar de banco depois exige regerar as migrations — registrar em ADR |
| Usuário pediu outra stack | Usar a pedida; adaptar estrutura e testes equivalentes |
| Produto pequeno, sem login | Remover auth/perfis; manter validação e persistência |

## 5. Integrações externas (decidir o padrão, pedir só credencial/custo)

| Necessidade | Em dev (decide sozinho) | Produção (condição de parada) |
|-------------|-------------------------|-------------------------------|
| E-mail | Log no console ou Mailpit | Provedor e credenciais |
| Upload de arquivos | Disco local atrás de interface `StorageService` | S3-compatível (custo) |
| Pagamentos | Interface + sandbox se o usuário fornecer chaves | Conta e chaves reais |
| Mapas, SMS, IA | Interface + stub determinístico nos testes | Conta/chaves/custo |

## 6. Anti-padrões

- Microsserviços, filas ou Kubernetes na V1 sem necessidade comprovada.
- Duas bibliotecas para o mesmo papel (dois ORMs, dois kits de UI).
- Dependência paga ou SaaS obrigatório sem autorização.
- Stack pesada para landing estática.
