---
name: design-system
description: >-
  Enforces semantic design tokens, a thin reusable UI kit, and consistent visual
  hierarchy (buttons, inputs, cards, badges, modals, empty/loading states). Default
  B2B palette follows the +Gestor/tanamao reference (navy, secondary blue, Inter).
  Use when creating or changing screens, components, or visual identity. Do not use
  for pure backend work or when inventing a second parallel component library.
metadata:
  framework: maestro-engineering-skills
  category: frontend
  version: "1.2.0"
  source: "generalized-from-plusgestor-tanamao"
---

# Design System

## Objetivo

Garantir identidade visual consistente via **tokens semânticos** + **primitivos reutilizáveis**. Para apps web B2B com login, o padrão Maestro é o shell/+Gestor documentado em `saas-app-shell` (não inventar tipografia/paleta “marketing” paralela).

## Quando ativar

- Nova tela, componente ou ajuste visual.
- Introdução de botões, campos, cards, tabelas, modais, alertas, empty/loading.
- Definição de identidade para projeto novo (`project-foundation`).

## Quando NÃO ativar

- Só lógica de API/DB sem UI.
- Já existe DS externo obrigatório (Material, Chakra, etc.) — **respeitar o existente**.
- Pedido exclusivo de a11y profunda → `accessibility`.

## Contexto técnico necessário

- Tokens (`index.css` / theme) e pasta `components/ui`.
- Shell: `saas-app-shell` quando o app for autenticado B2B.
- `MAESTRO_ENGINEERING_STANDARDS.md` (seção Front-end).

## Regras obrigatórias

1. **Cores via token** — proibido hex solto na feature se o token existir.
2. **Um kit** — não criar segundo `Button`/`Modal`/`Input` paralelo.
3. **Variants por função**: Primária (CTA = `secondary` no padrão +Gestor) · Ghost/outline · Destrutiva · Sidebar/nav.
4. **Superfície**: cards brancos sobre canvas `#e3e7ea` (ou token `background`).
5. **Estados**: empty, loading (skeleton), erro.
6. **Feedback**: toast/modal do kit — nunca `alert()`/`confirm()`.
7. **Ícones**: Lucide; tamanho coerente (nav vs ação).
8. **Tipografia B2B padrão**: Inter + letter-spacing levemente negativo em headings.
9. Marca do **produto atual** no logo; não reutilizar slogan +Gestor em outro app.

## Processo de execução

1. Localizar tokens/primitivos; reutilizar.
2. Se faltar primitivo: criar em `components/ui`, não inline na page.
3. Compor com `PageHeader` + `Card` + estados.
4. Validar claro (e escuro se o projeto tiver `data-theme`).

### Tokens mínimos (contrato padrão Maestro B2B)

| Token | Valor de referência | Papel |
|-------|---------------------|-------|
| primary | `#05102d` | Sidebar, texto forte |
| secondary | `#0f7dc7` | CTA, ativo, focus ring |
| background | `#e3e7ea` | Canvas |
| card / surface | `#ffffff` | Painéis |
| foreground | `#05102d` | Texto |
| muted | `#5c6b7a` | Secundário |
| border | `#c5cdd4` | Linhas |
| success / danger / warning | `#60b04a` / `#dc2626` / `#d97706` | Status |
| font-sans | Inter | UI |

Overrides de produto: só via CSS variables no tema, documentados no `.maestro/`.

## Boas práticas

- Tema claro/escuro com `html[data-theme]` se o produto precisar; mesmas classes semânticas.
- KPI cards: poucos, hierarquia clara no dashboard.
- Sombras: `shadow-card` / `shadow-elevated` via token.

## Erros comuns

- Hex hardcoded e tipografia serif/display na área logada B2B.
- Segundo kit de UI “mais bonito”.
- Shell só com header central (viola `saas-app-shell`).

## Exemplos práticos

**Botão salvar** — fundo `secondary`, texto branco, loading no próprio botão.

**Badge de status** — success/warning/danger tokens, não cores soltas.

## Critérios de qualidade

- Tela usa tokens + primitivos; CTA usa `secondary` (ou token de marca documentado).
- Sem segundo design system.
- Empty/loading/erro presentes.

## Checklist de validação

- [ ] Cores via token
- [ ] Inter (ou override documentado)
- [ ] Variant correta por função
- [ ] Lucide coerente
- [ ] Empty, loading, erro
- [ ] Contraste legível

## Skills relacionadas

- `saas-app-shell`, `frontend-engineering`, `ux-ui-design`, `mobile-first`, `accessibility`, `project-foundation`
