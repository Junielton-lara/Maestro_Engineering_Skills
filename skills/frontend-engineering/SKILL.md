---
name: frontend-engineering
description: >-
  Implements maintainable frontend architecture: feature folders, app shell,
  data fetching, forms (client+server validation), reusable UI composition, and
  route-level loading. Use when building or refactoring frontend apps. Do not
  use for backend-only or pure visual token tweaks without structure change.
metadata:
  framework: maestro-engineering-skills
  category: frontend
  version: "1.2.0"
  source: "generalized-from-plusgestor-tanamao"
---

# Frontend Engineering

## Objetivo

Entregar front-end estruturado, reutilizável e alinhado ao DS/UX do Maestro — padrão B2B do +Gestor/tanamao: `layouts/` (sidebar+topbar), `components/ui`, TanStack Query, RHF/Zod, Lucide. Respeitar stack já existente do repo se divergir.

## Quando ativar

- Novo app FE, feature, rota, formulário, integração com API.
- Refatoração de organização de pastas/componentes.

## Quando NÃO ativar

- Só copy visual sem estrutura → `design-system` / `ux-ui-design`.
- Só API → `backend-engineering`.

## Contexto técnico necessário

- Stack FE real do repo (inspecionar `package.json`).
- Padrões de roteamento, estado servidor, validação.
- `MAESTRO_ENGINEERING_STANDARDS.md` + `templates/frontend-structure.md`.

## Regras obrigatórias

1. **Inspecionar antes de criar** — reutilizar componente/hook/serviço existente.
2. **Não introduzir** outra lib de UI/HTTP/form sem decisão explícita.
3. **Organização**: `layouts/` (AppLayout/Sidebar/TopBar) + `features/` ou `pages/` + `components/ui` + `components/shared` (PageHeader).
4. App com login → aplicar `saas-app-shell` + `design-system` (Inter, tokens navy/azul).
5. **Validação client + server** — todo input com limite (`maxLength`/Zod); schema não substitui o backend.
6. **Dados remotos** com TanStack Query (ou padrão do repo) e `invalidateQueries` após mutation.
7. Tratar **loading / empty / error** em cada página de dados (skeleton > spinner global).
8. **AuthZ na UI é cosmético** — permissão real no servidor. Access token só em memória; refresh via cookie.
9. Rotas pesadas: **lazy + Suspense** com skeleton da página.
10. Utilitário `cn` (clsx + tailwind-merge) quando o projeto usar Tailwind.
11. Sem `alert()` / `confirm()` / `prompt()`.

## Processo de execução

1. Mapear feature vizinha e copiar o padrão.
2. Rota protegida (se autenticado) dentro do shell.
3. Página: header + dados (`useQuery`) + mutations + toasts.
4. Form: schema + `useForm` + `Field` + submit com erro de API.
5. Listagem: paginação estável; mobile cards / desktop tabela (`mobile-first`).
6. Extrair para `components/ui` só o que for reutilizável de verdade.
7. Lint/build do pacote FE.

### Estrutura alvo (template — adaptar à stack)

```text
src/
  app/           # providers, router
  layouts/       # shell, sidebar, topbar
  features/<x>/  # páginas e lógica do domínio
  components/ui/ # primitivos
  components/    # page blocks, charts, …
  hooks/
  services/      # api client
  lib/ utils/ types/
```

### Página (padrão OBSERVADO generalizado)

- Título: `PageHeader` (mobile pode delegar a header sticky).
- Feedback: toast sucesso/erro (`ApiError` message).
- Vazio: `EmptyState`. Loading: skeleton/spinner **da página**, sem overlay global em toda navegação.
- Listas paginadas: contrato alinhado à API (`items`, `total`, `page`, `pageSize` ou o do projeto).

### Formulário

- Zod (ou equivalente) + resolver.
- Campos do kit; selects longos com busca (desktop dropdown / mobile sheet).
- `blank` → null no backend quando aplicável.
- Form longo: barra de ações sticky no mobile.

## Boas práticas

- Chaves de query estáveis; `invalidateQueries` após salvar.
- Prefetch em hover de nav quando fizer sentido.
- White-label: tokens CSS injetados no shell, não forks de tema.
- Documentar chunking (ex.: charts lazy) se bundle crescer.

## Erros comuns

- Segunda biblioteca de componentes.
- `any` em respostas de API; ignorar paginação e tratar lista como array solto.
- Duplicar nav sidebar vs mobile sem fonte única.
- Criar página sem estados de erro/vazio.

## Exemplos práticos

**Feature clientes:** `features/clients/clients-page.tsx` + queries + modal/sheet de create/edit + cards mobile.

**Charts:** wrapper com empty state; import lazy da lib de gráficos.

## Critérios de qualidade

- Padrão igual ao módulo vizinho.
- Zero dependência nova injustificada.
- FE + BE validam; UI não “autoriza” de verdade.

## Checklist de validação

- [ ] Inspecionou vizinhos antes de criar
- [ ] Feature/rota/shell coerentes
- [ ] Loading/empty/error
- [ ] Form com schema + erro API
- [ ] Mobile-first aplicado
- [ ] Lint/build (ou falha relatada)

## Skills relacionadas

- `saas-app-shell`, `design-system`, `ux-ui-design`, `mobile-first`, `responsive-layout`, `frontend-performance`, `accessibility`, `project-foundation`, `api-design`
