---
name: saas-app-shell
description: >-
  Defines the default authenticated shell for Maestro B2B/web apps with login:
  dark sidebar, sticky topbar, dashboard with KPI cards, PageHeader, Inter font,
  and +Gestor-like tokens. Use when creating or refactoring app layout, nav,
  dashboard home, or greenfield SPA shells. Do not use for marketing landings
  without login or for backend-only work.
metadata:
  framework: maestro-engineering-skills
  category: frontend
  version: "1.0.0"
  source: "generalized-from-plusgestor-tanamao"
---

# SaaS App Shell (+Gestor reference)

## Objetivo

Padronizar o **chrome autenticado** dos sistemas web Maestro no estilo auditado do +Gestor (Tá na Mão): sidebar escura, topbar, dashboard com resumo, tipografia Inter e tokens semânticos — sem copiar marca/slogan de um produto cliente.

## Quando ativar

- Foundation/FE de app com login + área logada.
- Pedido de “igual o Mais Gestor / +Gestor / tanamao”.
- Troca de shell (header só → sidebar + dash).

## Quando NÃO ativar

- Landing/marketing sem sessão.
- App mobile nativo.
- Projeto que já tenha shell documentado distinto no `.maestro/` (respeitar o existente).

## Contexto técnico necessário

- `design-system` (tokens) e `mobile-first` (nav dual).
- Stack FE do projeto (React + Tailwind típico).
- Lista real de módulos/rotas do produto (não inventar menu de ERP alheio).

## Regras obrigatórias

1. **Área logada** usa shell com **sidebar (desktop)** + **topbar** + conteúdo — não só header com “Sair”.
2. **Home autenticada** = dashboard com KPIs/resumo do domínio (não cair direto numa lista crua sem contexto).
3. **Fonte padrão**: Inter (ou token `font-sans` apontando para Inter).
4. **Tokens +Gestor-like** (valores padrão Maestro B2B; produto pode sobrescrever via CSS vars, nunca hex solto na feature):

| Token | Valor padrão | Uso |
|-------|--------------|-----|
| `--color-primary` | `#05102d` | Sidebar, títulos fortes |
| `--color-secondary` | `#0f7dc7` | CTA, item ativo, ring |
| `--color-background` | `#e3e7ea` | Canvas da app |
| `--color-card` / surface | `#ffffff` | Cards, topbar |
| `--color-foreground` | `#05102d` | Texto |
| `--color-muted` | `#5c6b7a` | Secundário |
| `--color-border` | `#c5cdd4` | Bordas |
| `--color-sidebar` | `#05102d` | Fundo da sidebar |
| `--color-success` / `danger` / `warning` | `#60b04a` / `#dc2626` / `#d97706` | Feedback |

5. **Nav única** em config (`layouts/navigation.ts` ou equivalente); sidebar desktop e bottom nav mobile leem a mesma fonte.
6. **Breakpoint app**: sidebar `lg+`; abaixo disso bottom nav (itens essenciais) — ver `mobile-first`.
7. **PageHeader** em toda página de módulo: título + descrição + ações (empilham no mobile).
8. Login pode ser tela full-bleed, mas **herda os mesmos tokens** (primary escuro + secondary CTA).
9. Ícones: **Lucide** (uma família só).
10. Sem segundo design system; sem Fraunces/serif “marketing” na área logada B2B padrão.

## Processo de execução

1. Definir/atualizar tokens em `index.css` (+ bridge Tailwind).
2. Criar `layouts/AppLayout` (sidebar + topbar + `<Outlet />`), `Sidebar`, `TopBar`, `navigation`.
3. Rota `/` ou `/dashboard` autenticada com cards de resumo (API real).
4. Rotas de módulo sob o shell; `PageHeader` + estados loading/empty/error.
5. Mobile: bottom nav + padding inferior com safe-area.
6. Validar 390 px e desktop sem scroll horizontal da página.

### Estrutura mínima

```text
frontend/src/
  layouts/
    AppLayout.tsx
    Sidebar.tsx
    TopBar.tsx
    navigation.ts
    mobile/          # bottom nav se houver
  components/
    shared/PageHeader.tsx
    ui/              # Button, Input, Card, Badge…
  pages/ ou features/
    DashboardPage.tsx
```

### Sidebar

- Fixa `lg:flex`, largura ~260 px (recolhida ~72 px opcional).
- Logo/nome do **produto atual** no topo.
- Item ativo: fundo/indicador `secondary`.
- Texto `sidebar-foreground`; hover suave.

### TopBar

- Sticky, `bg-card/70` + blur, borda inferior.
- Usuário + papel + sair (e busca só se o produto tiver).
- No mobile: marca compacta à esquerda (logo linka ao dashboard).

### Dashboard

- Grade de KPI cards (1 col mobile → 2/3/4 no desktop).
- Cada card: label muted, valor forte, link opcional para a lista filtrada.
- Sem widgets de outro domínio (vendas/OS) se o produto não tiver.

## Boas práticas

- Tema claro/escuro opcional via `data-theme` (`design-system`); V1 pode só light se documentado.
- Feedback de mutation: modal/toast do kit — nunca `alert()`.
- Skeleton nos KPIs enquanto carrega.

## Erros comuns

- SPA autenticada só com header central e tipografia de landing.
- Menu lateral hardcode divergente da bottom nav.
- Dashboard mockado sem API.
- Copiar slogan/logo +Gestor para outro produto.

## Exemplos práticos

**ValidaPacientes:** sidebar (Dashboard, Pacientes), KPIs pendente/validado/recusado, Inter + tokens acima.

**ERP estoque:** mesmos tokens/shell; itens de nav = Produtos, Movimentos, etc.

## Critérios de qualidade

- Área logada reconhece o padrão +Gestor à primeira vista (sidebar escura + canvas cinza + Inter + CTA azul).
- Dashboard real + nav consistente mobile/desktop.
- Tokens só via CSS vars / classes semânticas.

## Checklist de validação

- [ ] Sidebar + topbar na área logada
- [ ] Dashboard com KPIs do domínio
- [ ] Inter + tokens padrão (ou override documentado)
- [ ] Nav única para desktop/mobile
- [ ] PageHeader nas páginas de módulo
- [ ] Lucide; sem hex solto nas features

## Skills relacionadas

- `design-system`, `frontend-engineering`, `mobile-first`, `ux-ui-design`, `project-foundation`, `autonomous-project-builder`
