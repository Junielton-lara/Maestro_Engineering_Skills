---
name: design-system
description: >-
  Enforces semantic design tokens, a thin reusable UI kit, and consistent visual
  hierarchy (buttons, inputs, cards, badges, modals, empty/loading states). Use
  when creating or changing screens, components, or visual identity. Do not use
  for pure backend work or when inventing a second parallel component library.
metadata:
  framework: maestro-engineering-skills
  category: frontend
  version: "1.1.0"
  source: "generalized-from-staltek-reference"
---

# Design System

## Objetivo

Garantir identidade visual consistente via **tokens semânticos** + **primitivos reutilizáveis**, sem copiar a marca de um produto específico. Fonte: padrões GENERALIZADOS do projeto de referência (kit fino + CSS variables + Tailwind).

## Quando ativar

- Nova tela, componente ou ajuste visual.
- Introdução de botões, campos, cards, tabelas, modais, alertas, empty/loading.
- Definição de identidade para projeto novo (`project-foundation`).

## Quando NÃO ativar

- Só lógica de API/DB sem UI.
- Já existe DS externo obrigatório (Material, chakra, etc.) — **respeitar o existente**; esta skill adapta princípios, não força outro kit.
- Pedido exclusivo de a11y profunda → `accessibility`.

## Contexto técnico necessário

- Onde vivem tokens (`:root` CSS, theme file).
- Pasta de primitivos UI e composição de página.
- Biblioteca de ícones já adotada.
- Documento `MAESTRO_ENGINEERING_STANDARDS.md` (seção Front-end).

## Regras obrigatórias

1. **Cores via token** — proibido hex solto se o token existir.
2. **Um kit** — não criar segundo `Button`/`Modal`/`Input` paralelo.
3. **Variants por função**, não por “gosto”:
   - Primária (CTA) · Secundária (outline) · Terciária (ghost/subtle) · Destrutiva · Ênfase institucional (opcional)
4. **Superfície**: conteúdo em card/surface sobre canvas/fundo; não empilhar cards sem hierarquia.
5. **Estados obrigatórios**: empty, loading, erro — não só o “happy path”.
6. **Feedback**: toast/sonner (ou equivalente do projeto) para sucesso/erro de mutation.
7. **Ícones**: uma família só; tamanho consistente no mesmo contexto (ex.: nav vs ação).
8. **Marca do produto** ≠ tokens Staltek — definir tokens do **produto atual**.

## Processo de execução

1. Localizar tokens e primitivos existentes; listar o que já resolve o pedido.
2. Se faltar primitivo: criar no kit (`ui/`), com variants (CVA ou equivalente), **não** inline ad-hoc na feature.
3. Mapear ação → variant de botão.
4. Compor página com blocos padrão (`PageHeader`, `Field`, `EmptyState`, `FilterBar` ou equivalentes).
5. Validar contraste ink/muted sobre surface/canvas.
6. Checklist abaixo.

### Tokens mínimos (contrato)

Definir (nomes podem variar):

| Token semântico | Papel |
|-----------------|-------|
| brand / primary | CTA principal |
| accent / logo | foco, links, anéis |
| ink | texto principal |
| muted | texto secundário |
| line | bordas |
| canvas | fundo da app |
| surface | cards/painéis |
| danger / success / warning / info | feedback |
| radius-sm/md/lg | arredondamento |
| shadow-sm/md | elevação |
| font-sans | tipografia do produto |

**OBSERVADO (referência):** CSS variables + bridge Tailwind; white-label runtime opcional via API de empresa.

## Boas práticas

- Preferir composição (`PageHeader` + `Card` + lista) a telas monolíticas.
- KPI cards: poucos, com hierarquia; evitar grade barulhenta na primeira dobra.
- Relatório operacional ≠ visual de PDF impresso.
- Tema claro/escuro via `data-theme` (ou equivalente), sem duplicar componentes.

## Erros comuns

- Hex hardcoded e `style={{ color }}` espalhado.
- Novo pacote de UI “porque é mais bonito”.
- Vários estilos de formulário (login marketing vs app) sem necessidade.
- Outline de foco globalmente transparente sem ring por componente (**débito observado** — corrigir: foco visível).

## Exemplos práticos

**Botão** — salvar: variant primária + `loading`; excluir: `ActionModal` destrutivo, não `window.confirm` como padrão.

**Campo** — `Field` com label, `required`, mensagem de erro; input do kit com altura touch-friendly.

**Lista vazia** — `EmptyState` + CTA opcional alinhado à ação primária da página.

## Critérios de qualidade

- Tela usa primitivos existentes; ação principal usa token de marca do **produto**.
- Sem componente visual paralelo.
- Empty/loading/erro desenhados.

## Checklist de validação

- [ ] Cores via token
- [ ] Variant correta por função
- [ ] Ícones da família adotada, tamanho coerente
- [ ] Empty, loading, erro
- [ ] Contraste legível
- [ ] Sem segundo design system

## Skills relacionadas

- `frontend-engineering`, `ux-ui-design`, `mobile-first`, `accessibility`, `project-foundation`
- Padrão oficial: `MAESTRO_ENGINEERING_STANDARDS.md`
