---
name: ux-ui-design
description: >-
  Shapes professional UX flows: hierarchy, navigation, feedback, confirmations,
  empty/loading/error states, and intentional component choice by context. Use
  when designing screens, flows, or usability fixes. Do not use for pure CSS
  token work (design-system) or backend-only tasks.
metadata:
  framework: maestro-engineering-skills
  category: frontend
  version: "1.1.0"
  source: "generalized-from-staltek-reference"
---

# UX / UI Design

## Objetivo

Entregar fluxos intuitivos e interfaces profissionais: hierarquia clara, poucos cliques desnecessários, feedback imediato e prevenção de erros — escolhendo componentes **conforme o contexto**, sem checklist rígido de widgets.

## Quando ativar

- Nova jornada, redesign de tela, melhora de usabilidade.
- Decisões de modal vs página, cards vs tabela, confirmações.

## Quando NÃO ativar

- Só performance de bundle → `frontend-performance`.
- Só tokens/variants → `design-system`.
- Sem UI.

## Contexto técnico necessário

- Personas/fluxo (ou Prompt Master).
- Shell e padrões mobile do projeto.
- Kit de componentes existente.
- `MAESTRO_ENGINEERING_STANDARDS.md` § UX/UI.

## Regras obrigatórias

1. **Uma tarefa principal por tela** (ou por passo).
2. **Hierarquia**: título → ação primária → conteúdo → secundário.
3. **Feedback imediato** em toda mutation (toast/inline); nunca silêncio.
4. **Confirmar destrutivo** (`ActionModal` ou equivalente) — não `window.confirm` como padrão de produto.
5. **Estados**: loading (skeleton/spinner contextual), empty (com próximo passo), erro (recuperável).
6. **Prevenir perda de dados** (dirty guard) em forms/modais.
7. **Não poluir**: evitar badges, chips e KPIs competindo na primeira dobra.
8. **Escolher componente pelo job** (tabela vs cards, modal vs página, tabs vs rotas) — não “porque existe no catálogo”.
9. Identidade do **produto atual**; evitar visual genérico de template de IA.

## Processo de execução

1. Nomear o job do usuário nesta tela (1 frase).
2. Mapear passos felizes + erros + vazio.
3. Definir navegação contextual (voltar, breadcrumb, menu).
4. Escolher superfície (página / sheet / modal).
5. Definir CTA primário único visível.
6. Aplicar `design-system` + `mobile-first`.
7. Revisar com checklist.

### Catálogo de decisão (não obrigatório)

| Necessidade | Preferir | Evitar |
|-------------|----------|--------|
| Lista densa desktop | Tabela | Cards infinitos sem filtro |
| Lista mobile | Cards | Tabela com scroll de página |
| Confirmar exclusão | ActionModal | Link sem confirmação |
| Form curto | Modal/sheet | Página inteira se desnecessário |
| Form longo / multi-step | Página + FormActionBar | Modal apertado |
| Filtros | FilterBar / sheet | 12 controles sempre abertos |
| Ação global rápida | FAB / ação central nav | Duplicar 5 botões iguais |
| Feedback efêmero | Toast | Alert bloqueante |

## Boas práticas

- Breadcrumbs: úteis no desktop; no mobile mostrar só o contexto atual.
- Command palette / busca global quando há muitos módulos (OBSERVADO na referência).
- Abas: poucas; sincronizar com querystring se compartilhável.
- Dashboards: período + KPIs principais + atalhos; gráficos com empty state.

## Erros comuns

- Múltiplos CTAs “primários” na mesma dobra.
- Loading global bloqueando navegação entre páginas (preferir skeleton por página).
- Empty sem CTA.
- Copiar layout Staltek (cores/nav) em produto sem relação.

## Exemplos práticos

**Criar registro:** desktop — botão no `PageHeader`; mobile — mesma ação no header ou ação central da bottom nav (se o produto usar esse padrão).

**Falha de query:** card com mensagem + “Tentar novamente”, não só console.

## Critérios de qualidade

- Usuário identifica ação principal em &lt;3s.
- Fluxo crítico tem feedback e recuperação de erro.
- Mobile e desktop coerentes (mesmo modelo mental).

## Checklist de validação

- [ ] Job da tela explícito
- [ ] CTA primário único
- [ ] Loading / empty / erro
- [ ] Confirmação destrutiva
- [ ] Dirty guard se form
- [ ] Sem poluição visual na primeira dobra
- [ ] Consistente com DS do produto

## Skills relacionadas

- `design-system`, `mobile-first`, `responsive-layout`, `accessibility`, `frontend-engineering`
