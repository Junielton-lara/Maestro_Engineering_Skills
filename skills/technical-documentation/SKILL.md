---
name: technical-documentation
description: >-
  Guides docs-as-code: what to document, when, and how to structure README, API, ADR, and runbooks.
  Use when shipping features, changing contracts, onboarding devs, or closing a project phase.
  Do not use to duplicate auto-generated API specs without curation, or to store secrets.
metadata:
  framework: maestro-engineering-skills
  category: docs
  version: "1.0.0"
---

# Technical Documentation

## Objetivo

Manter documentação técnica versionada, próxima ao código, atualizada com as mudanças — reduzindo custo de onboarding e erros operacionais.

## Quando ativar

- Nova feature, endpoint, job ou fluxo de dados.
- Mudança de comportamento visível a integradores ou ops.
- Criação de ADR pós `software-architecture`.
- Pós-MVP ou antes de `project-handoff`.

## Quando NÃO ativar

- Mudança interna refatorada sem efeito em contrato/comportamento (opcional: nota no PR).
- Usuário pede apenas código sem entrega documentada (registrar dívida se crítico).

## Contexto técnico necessário

- Diff ou lista de mudanças.
- Público: dev, DevOps, suporte, parceiro API.
- Local padrão no repo (`docs/`, `README.md`, `docs/adr/`).

## Regras obrigatórias

1. **Docs as code**: mesma PR ou PR imediata que a mudança (salvo spike explicitamente descartável).
2. **Uma fonte da verdade** — evitar README e wiki divergentes; linkar em vez de copiar.
3. **Nunca** colocar secrets, tokens ou PII real; usar placeholders e referência a cofre (`project-handoff`).
4. Documentar **por que** (decisão) em ADR; **como** em guias; **o quê** em referência de API.
5. Idioma: alinhar ao projeto (PT-BR se o restante do repo for PT).
6. Atualizar índice ou `docs/README.md` quando criar nova página.

## Processo de execução

1. **Classificar tipo de doc** necessário (tabela abaixo).
2. **Auditar existente** — extender, não duplicar.
3. **Rascunhar estrutura** — título, audiência, pré-requisitos, passos, troubleshooting.
4. **Escrever** conciso; diagramas só se clarificam fluxo complexo.
5. **Ligar ao código** — paths, comandos copy-paste testados.
6. **Revisão** — checklist; apontar gaps em `deployment-documentation` ou `project-handoff`.

### O quê documentar

| Evento | Doc mínimo |
|--------|------------|
| Nova API | contrato, erros, auth, exemplos curl |
| Schema DB | migração, rollback, índices |
| Job/cron | schedule, idempotência, alertas |
| Feature flag | default, rollout, remoção |
| Incidente fix | causa raiz + prevenção em runbook |

### Estrutura sugerida de pasta

```
docs/
  README.md          # índice
  adr/               # decisões
  api/               # OpenAPI ou markdown
  architecture/      # diagramas de contexto
  operations/        # runbooks (ponte para handoff)
```

## Boas práticas

- Começar pelo “happy path” de 5 minutos para novo dev.
- Exemplos com dados fictícios.
- Changelog ou seção “Última atualização” em docs voláteis.

## Erros comuns

- README marketing sem comandos `npm test` / `docker compose`.
- ADR sem status (proposto/aceito/depreciado).
- Screenshots obsoletos sem data.
- Documentar intenção futura como se já existisse.

## Exemplos práticos

**Snippet README** — seção “Desenvolvimento local”: deps, `.env.example`, comandos, portas.

**ADR** — Status: Aceito; links para PR que implementa.

## Critérios de qualidade

- Novo dev roda projeto com doc apenas (ou gaps listados honestamente).
- Contratos batem com código (verificar rota real).
- Sem secrets; referências a variáveis por nome.

## Checklist de validação

- [ ] Tipo de doc correto para a mudança
- [ ] Co-localizado/versionado com código
- [ ] Comandos reproduzíveis
- [ ] ADR se decisão estrutural
- [ ] Índice atualizado
- [ ] Handoff/deploy referenciados se ops impactado

## Skills relacionadas

- `maestro-core` — incluir doc no fechamento de trilha
- `software-architecture` — ADRs
- `prompt-master-generator` — spec viva (sync)
- `deployment-documentation` — procedures de release
- `project-handoff` — pacote para operação