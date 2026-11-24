---
name: mobile-first
description: >-
  Builds narrow-first UIs with dual shell navigation, touch targets, adaptive
  modals/sheets, mobile-friendly forms, and no page-level horizontal scroll. Use
  when creating or fixing pages, forms, tables, navigation, uploads, or any
  frontend layout. Do not use for backend-only or desktop-print layout work.
metadata:
  framework: maestro-engineering-skills
  category: frontend
  version: "1.1.0"
  source: "generalized-from-staltek-reference"
---

# Mobile-First

## Objetivo

Garantir que fluxos caibam e sejam usáveis em largura estreita (≥320px) **antes** de enriquecer o desktop. Padrões GENERALIZADOS da referência: shell dual, bottom nav, sheets, alvos de toque, formulários e tabelas adaptadas.

## Quando ativar

- Qualquer UI nova ou alterada.
- Formulários longos, listagens, modais, menus, upload/mídia, dashboards.

## Quando NÃO ativar

- API/DB sem UI.
- Artefato só impressão/PDF.
- Projeto explicitamente desktop-only (documentar exceção).

## Contexto técnico necessário

- Breakpoint de “app mobile” do projeto (referência OBSERVADA: **1024px / `lg`**).
- Shell, bottom nav, `useIsMobile` (ou equivalente).
- Safe-area / PWA se aplicável.
- `MAESTRO_ENGINEERING_STANDARDS.md` § Mobile.

## Regras obrigatórias

1. **Desenhar estreito primeiro** com componentes atuais — não inventar `FooMobile` se `lg:` resolve.
2. **Sem scroll horizontal da página**. Scroll local só em tabela/gráfico que não virou card.
3. **Tabela larga** → cards abaixo do breakpoint app; tabela `hidden lg:block` (padrão OBSERVADO).
4. **Modal grande** → sheet/drawer no mobile; se ainda estourar → página, não modal fixo largo.
5. **Alvos de toque** ≥ ~44px; evitar `size="sm"` como CTA principal no celular.
6. **Formulário** em 1 coluna; `sm:grid-cols-2` só quando os pares couberem.
7. **Teclado**: `type`/`inputMode` corretos (`tel`, `email`, `decimal`, `numeric`, `search`).
8. **Inputs** com `text-base` no mobile (evita zoom iOS); pode reduzir em `sm:`.
9. **Não descartar rascunho** ao fechar sheet/voltar — dirty state + confirmação.
10. **Barra de ação** (`FormActionBar` ou equivalente) não pode cobrir o último campo; respeitar padding da nav + safe-area.
11. **Menus de linha / popovers** → sheet no mobile se houver risco de sair da viewport.
12. **Loading / erro / vazio** em todas as larguras.
13. Poucas media queries novas — preferir utilitários já do projeto (`sm`/`md`/`lg`).

## Processo de execução

1. Identificar shell: sidebar desktop vs nav inferior mobile.
2. Implementar fluxo em 320–430px.
3. Adaptar overlays (modal→sheet), listas (card↔tabela), headers (ações em sheet se necessário).
4. Verificar teclado virtual + barras fixas.
5. Expandir para tablet/desktop sem regressão mobile.
6. Declarar o que foi testado (browser) ou **não** testado — não inventar QA visual.

### Navegação (OBSERVADO → GENERALIZADO)

| Largura | Padrão |
|---------|--------|
| ≥ breakpoint app (ex. 1024) | Sidebar + topbar |
| < breakpoint | Bottom nav (itens essenciais + “Mais” + ação central opcional) |
| Overlays | Bottom sheet / ActionModal |

Não duplicar listas de nav sem fonte única (RECOMENDAÇÃO MAESTRO: config de nav compartilhada).

### Mídia (quando o produto anexa foto)

- Separar câmera (`capture`) e galeria; não misturar no mesmo input se o fluxo precisar dos dois.
- Upload com status por arquivo; não limpar formulário durante envio.
- Limites no cliente **e** no servidor.

## Boas práticas

- Prefetch/hover na nav desktop; tap feedback (`active:scale`) no mobile.
- `100dvh` / safe-area em chrome fixo.
- Gráficos: container responsivo; se ilegível → lista.

## Erros comuns

- Sidebar-drawer abaixo de `lg` competindo com bottom nav sem necessidade.
- Tabela só com `overflow-x` forçando scroll de página.
- CTA pequeno (`sm`) como ação principal no polegar.
- Afirmar “testado no mobile” sem abrir no browser.

## Exemplos práticos

**Lista de registros:** mobile = cards com título + status + `RowMenu` sheet; desktop = `<table>` no card.

**Form longo:** campos empilhados + `FormActionBar` sticky; nav inferior com `pb` + safe-area no shell.

## Critérios de qualidade

- Fluxo cabe em 320px sem scroll horizontal de página.
- CTAs com alvo confortável; dados sobrevivem a fechar sheet.
- Verificação visual explícita (feita ou não).

## Checklist de validação

- [ ] 320 / 360 / 390 / 430 (+ tablet/desktop) — se houver browser
- [ ] Teclado em tel/email/número
- [ ] Modal/sheet/menu na viewport
- [ ] Form longo + nav + action bar
- [ ] Sem scroll horizontal indevido
- [ ] Lint/build do pacote FE, ou falha relatada

## Skills relacionadas

- `responsive-layout`, `ux-ui-design`, `design-system`, `accessibility`, `frontend-engineering`
- `MAESTRO_ENGINEERING_STANDARDS.md`
