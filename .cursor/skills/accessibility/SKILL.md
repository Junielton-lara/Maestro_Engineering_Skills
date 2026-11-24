---
name: accessibility
description: >-
  Applies practical WCAG-minded UI: labels, keyboard, focus visibility, dialog
  semantics, live regions for loading, and contrast. Use when building interactive
  UI or fixing a11y issues. Do not use as a substitute for full legal audit.
metadata:
  framework: maestro-engineering-skills
  category: frontend
  version: "1.1.0"
  source: "generalized-from-staltek-reference"
---

# Accessibility

## Objetivo

Interfaces usáveis por teclado e leitores de tela, com contraste e foco visíveis — incorporando práticas OBSERVADAS (dialogs, aria em loading/accordion) e corrigindo débitos comuns (foco global transparente).

## Quando ativar

- Componentes interativos novos (modal, menu, tabs, forms).
- Relato de teclado/leitor/contraste.

## Quando NÃO ativar

- Mudança só de API.
- Auditoria formal completa (esta skill é engenharia prática, não laudo).

## Contexto técnico necessário

- Primitivos UI e padrões de modal/menu do projeto.
- Tokens de cor (contraste ink/surface).

## Regras obrigatórias

1. Controles com **nome acessível** (label visível ou `aria-label`).
2. **Foco visível** — ring/outline real; não desativar `:focus-visible` globalmente sem alternativa.
3. Dialogs: `role="dialog"`, `aria-modal`, Escape, **focus trap**, retorno de foco ao fechar (OBSERVADO: `bindDialogKeys`).
4. Ícone-only: `aria-label`.
5. Loading: `role="status"` / `aria-live` / `aria-busy` quando bloqueia região.
6. Não usar só cor para status — texto ou ícone + texto.
7. `prefers-reduced-motion`: reduzir animações não essenciais.
8. Tabs custom: teclado e roles adequados, ou usar links/rotas se mais simples.
9. Contraste: texto `ink`/`muted` legível sobre `surface`/`canvas`.

## Processo de execução

1. Percorrer fluxo só com teclado (Tab, Enter, Escape).
2. Verificar nomes e estados (expanded, selected, invalid).
3. Checar foco ao abrir/fechar overlays.
4. Revisar contraste dos tokens usados.
5. Checklist.

## Boas práticas

- `sr-only` para cabeçalhos de coluna de ações.
- Mensagens de erro ligadas ao campo (`aria-describedby` / texto abaixo do Field).
- Bottom nav: `aria-current` no item ativo.

## Erros comuns

- Outline global `transparent` sem ring nos componentes (**débito OBSERVADO**).
- Overlay fecha no click mas sem trap de foco.
- `div` clicável sem role/botão.

## Exemplos práticos

**Modal:** foca o título ou primeiro campo ao abrir; Tab cicla; Escape pergunta se dirty.

**Accordion:** `aria-expanded` + `aria-controls`.

## Critérios de qualidade

- Fluxo crítico completável só com teclado.
- Overlays anunciáveis e focáveis.
- Nenhum controle ícone-only sem nome.

## Checklist de validação

- [ ] Labels / aria-label
- [ ] Foco visível
- [ ] Dialog trap + Escape
- [ ] Live region em loading crítico
- [ ] Contraste tokens
- [ ] Reduced motion considerado

## Skills relacionadas

- `design-system`, `ux-ui-design`, `mobile-first`, `frontend-engineering`
