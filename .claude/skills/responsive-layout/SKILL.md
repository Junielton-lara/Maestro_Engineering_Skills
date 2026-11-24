---
name: responsive-layout
description: >-
  Applies fluid grids, breakpoint strategy, adaptive tables, and overflow
  control so layouts work from 320px to desktop without broken chrome. Use when
  fixing layout, grids, tables, sidebars, or viewport issues. Do not use for
  pure visual branding without layout change.
metadata:
  framework: maestro-engineering-skills
  category: frontend
  version: "1.1.0"
  source: "generalized-from-staltek-reference"
---

# Responsive Layout

## Objetivo

Layouts fluidos e previsíveis: breakpoints conscientes, grids adaptativos, overflow controlado e chrome (sidebar/nav/topbar) que não quebra o conteúdo.

## Quando ativar

- Grids, sidebars, tabelas, headers, dashboards, modais largos.
- Bugs de overflow, clip, ou “desktop quebrado no mobile”.

## Quando NÃO ativar

- Só tipografia/cor → `design-system`.
- Só gestos/teclado → `mobile-first` / `accessibility`.

## Contexto técnico necessário

- Breakpoints do Tailwind/CSS do projeto.
- Divisor app mobile/desktop (OBSERVADO: `lg` = 1024px).
- Shell e containers (`main`, padding, safe-area).

## Regras obrigatórias

1. Conteúdo em **container com padding** responsivo (`px-4 sm:px-6` ou padrão do projeto).
2. Grids: 1 coluna → `sm`/`md` multi-coluna só quando couber.
3. Sidebar: `hidden` abaixo do breakpoint app; não comprimir conteúdo &lt;1024 com sidebar fixa sem estratégia.
4. **Overflow**: `min-w-0` em flex filhos; evitar `w-screen` que causa scroll horizontal.
5. Tabelas: wrapper `overflow-x-auto` **local** no desktop; preferir cards no mobile (`mobile-first`).
6. Imagens/gráficos: `max-w-full`; charts em `ResponsiveContainer` ou equivalente.
7. Posição `fixed`/`sticky`: considerar topbar + bottom nav + safe-area.
8. Não inventar breakpoints custom sem necessidade.

## Processo de execução

1. Reproduzir larguras 320 → 1440.
2. Identificar elemento que causa overflow (devtools).
3. Aplicar adaptação (stack, hide/show, sheet, card).
4. Validar chrome fixo vs teclado (mobile).
5. Checklist.

## Boas práticas

- Preferir `dvh` a `vh` em shells mobile.
- Topbar sticky com z-index coerente abaixo de modais.
- Filtros: colapsar em sheet no mobile; inline no desktop.

## Erros comuns

- `flex` sem `min-w-0` → texto empurra viewport.
- Modal `w-[800px]` fixo no mobile.
- Dois scrollbars (body + painel) sem intenção.

## Exemplos práticos

**Detail page:** coluna única no mobile; `lg:grid-cols-[1fr_320px]` para aside.

**FilterBar:** chips scrolláveis horizontalmente **dentro** da barra, não na página.

## Critérios de qualidade

- Sem scroll horizontal de página em 320–430.
- Desktop não “esmaga” ações; hierarquia preservada.

## Checklist de validação

- [ ] 320 / 768 / 1024 / 1440
- [ ] Overflow local vs página
- [ ] Shell + conteúdo
- [ ] Tabela/cards coerentes
- [ ] Fixed elements + safe-area

## Skills relacionadas

- `mobile-first`, `ux-ui-design`, `design-system`, `frontend-engineering`
