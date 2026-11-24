---
name: code-review
description: >-
  Revisa mudanças com foco em correção, segurança, manutenibilidade e clareza, usando rótulos de
  severidade. Use when revisar PR/diff, solicitar revisão estruturada ou auditar mudanças locais.
  Do not use when o escopo for implementar a feature (skills de domínio) sem pedido de revisão.
metadata:
  framework: maestro-engineering-skills
  category: quality
  version: "1.0.0"
---

# Revisão de Código

## Objetivo

Elevar qualidade antes do merge: detectar defeitos, riscos de segurança e dívida evitável, com feedback acionável e priorizado.

## Quando ativar

- Pull request próprio ou de terceiros.
- Diff grande antes de commit (auto-revisão).
- Pós-incidente: revisar mudanças suspeitas.
- Usuário pede “review”, “olha esse PR” ou “está seguro?”.

## Quando NÃO ativar

- Escrita da solução do zero sem diff → skill de implementação correspondente.
- Pentest ou threat modeling completo → `security-engineering`.
- Planejamento de testes de aceite → `testing-qa`.

## Contexto técnico necessário

- Descrição do PR, issue e critério de aceite.
- Diff completo ou arquivos alterados.
- Padrões do repo (lint, ADR, estrutura).
- Escopo explícito (hotfix vs refactor amplo).

## Regras obrigatórias

1. **Ler o contexto** (título, descrição, testes) antes do código.
2. **Classificar cada achado** com severidade padronizada.
3. **Preferir sugestões concretas** (snippet ou direção) a críticas vagas.
4. **Distinguir blocker** de melhoria futura.
5. **Respeitar escopo**: não exigir refactor não relacionado no hotfix.
6. **Não aprovar** mudanças que exponham segredos ou quebrem contrato sem documentação.

### Rótulos de severidade

| Rótulo | Significado | Ação típica |
|--------|-------------|-------------|
| **BLOCKER** | Bug, segurança, perda de dados, quebra de contrato | Corrigir antes do merge |
| **MAJOR** | Manutenibilidade ruim, falta de teste em fluxo crítico, performance clara | Corrigir ou plano acordado |
| **MINOR** | Legibilidade, naming, duplicação pequena | Sugestão opcional |
| **NIT** | Estilo, preferência pessoal | Opcional; não bloquear |

## Processo de execução

1. **Entender intenção** da mudança em uma frase.
2. **Verificar escopo**: arquivos fora do escopo justificados?
3. **Correção**: lógica, bordas, concorrência, null/undefined.
4. **Segurança rápida**: entrada, authz, segredos, logs → `security-engineering`.
5. **Manutenibilidade**: nomes, tamanho de função, acoplamento, testes.
6. **Operação**: migração, rollback, feature flag, observabilidade.
7. **Sintetizar**: resumo + lista de achados por severidade + veredito.

## Boas práticas

- Elogiar decisões boas (reforço específico).
- Perguntar quando intenção não está clara.
- Checar se testes cobrem o diff em fluxos críticos → `automated-testing`.
- Validar erros e mensagens ao usuário → `error-handling`.
- Diff mínimo: questionar mudanças cosméticas massivas.

## Erros comuns

- Review só de estilo ignorando bug lógico.
- Bikeshedding (NIT como BLOCKER).
- Aprovar sem ler testes ou migrações.
- Comentários sem severidade → prioridade confusa.
- Exigir arquitetura ideal em correção de uma linha.

## Exemplos práticos

**Comentário BLOCKER:** “Query usa `userId` do body sem validar que pertence ao tenant da sessão — risco IDOR.”

**Comentário MAJOR:** “Endpoint novo sem teste de 401/403; fluxo de pagamento é P0.”

**Veredito:** Aprovar com ressalvas, pedir mudanças, ou solicitar divisão do PR se escopo grande.

## Critérios de qualidade

- Cada BLOCKER/MAJOR referencia arquivo/comportamento específico.
- Veredito explícito (approve / request changes / comment only).
- Risco de deploy comentado (migração, config, breaking change).
- Alinhado aos padrões já usados no repositório.

## Checklist de validação

- [ ] Intenção da mudança compreendida
- [ ] Lógica e bordas revisadas
- [ ] Authz/entrada/segredos checados em superfície tocada
- [ ] Testes adequados ao risco
- [ ] Migrações e rollback considerados
- [ ] Achados com severidade + veredito final

## Skills relacionadas

- `security-engineering` — profundidade em ameaças
- `automated-testing` — cobertura e pirâmide
- `error-handling` — contratos de falha
- `performance-optimization` — hotspots no diff
- `maestro-core` — classificar intenção da entrega