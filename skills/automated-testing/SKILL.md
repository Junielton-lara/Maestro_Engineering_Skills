---
name: automated-testing
description: >-
  Implementa testes automatizados na pirâmide unit/integration/e2e: o que automatizar, ferramentas
  do projeto e manutenção sustentável. Use when criar ou expandir suíte de testes, CI com test gates
  ou reduzir regressão manual. Do not use when o escopo for só critérios de aceite/UAT (testing-qa).
metadata:
  framework: maestro-engineering-skills
  category: quality
  version: "1.0.0"
---

# Testes Automatizados

## Objetivo

Construir suíte automatizada que protege comportamento crítico com custo de manutenção previsível, alinhada à stack e convenções já presentes no repositório.

## Quando ativar

- Novo módulo, endpoint ou componente com lógica não trivial.
- Bug recorrente que merece teste de regressão.
- CI sem testes ou com falhas flaky frequentes.
- Refatoração que exige rede de segurança.

## Quando NÃO ativar

- Definição de cenários de negócio sem implementação → `testing-qa`.
- Performance/load testing profundo → `performance-optimization`.
- Scan de segurança ou pentest → `security-engineering`.

## Contexto técnico necessário

- Runner e libs já no projeto (Jest, Vitest, pytest, Playwright, etc.).
- Estrutura de pastas de testes e padrão de naming.
- Como o CI executa testes hoje → `ci-cd`.
- Fixtures, factories e mocks existentes.

## Regras obrigatórias

1. **Inspecionar o projeto** antes de introduzir novo framework de teste.
2. **Pirâmide**: muitos unitários rápidos, menos integração, poucos e2e caros.
3. **Automatizar o repetível e estável**; não e2e flakey sem quarentena.
4. **Testes determinísticos** (sem dependência de rede/hora não controlada).
5. **Um assert principal por teste** quando possível; nome descreve comportamento.
6. **Não commitar** credenciais reais em fixtures.

## Processo de execução

1. **Inventariar** stack de testes e comandos (`package.json`, Makefile, CI).
2. **Escolher nível** por comportamento:
   - Regra pura → unit
   - Repositório/HTTP com DB testcontainer ou in-memory → integration
   - Jornada crítica de usuário → e2e (poucos)
3. **Espelhar convenções** (describe/it, AAA, given-when-then).
4. **Implementar** começando pelo caso que reproduz o bug ou contrato novo.
5. **Integrar ao CI** com gate obrigatório quando política do projeto permitir.
6. **Medir tempo** da suíte; paralelizar ou fatiar se > budget do time.

### O que automatizar (prioridade)

| Sim | Evitar no início |
|-----|------------------|
| Regras de domínio e validação | UI pixel-perfect |
| Mapeamento de erros HTTP | Todo e2e em cada PR |
| Serialização DTO | Integração com API de terceiro instável |
| Regressão de bug P0/P1 | Testes que duplicam implementação trivial |

## Boas práticas

- **Factories/builders** para entidades de teste; evitar objetos gigantes inline.
- **Integration**: transação rollback ou DB isolado por worker.
- **E2E**: dados seed idempotentes; `data-testid` estável.
- **Snapshot** só para contratos estáveis; revisar diff com cuidado.
- **Coverage** como sinal, não meta cega; cobrir ramos de risco.

## Erros comuns

- E2E cobrindo tudo → suíte lenta e flaky.
- Mock excessivo que não testa integração real.
- Testes acoplados a implementação interna (quebram em refator).
- `sleep(5000)` em vez de espera condicional.
- Ignorar testes falhando com `.skip` permanente.

## Exemplos práticos

**Unit (validação):** entrada inválida → exceção/`Result` esperado; borda (vazio, max length).

**Integration (API):** `POST /orders` persiste e retorna 201; 401 sem token.

**E2E:** login → criar recurso → logout; rodar nightly se lento.

## Critérios de qualidade

- Comando de teste documentado e passa localmente e no CI.
- Novos fluxos críticos têm pelo menos um teste no nível adequado.
- Flaky identificado e corrigido ou isolado.
- Tempo total da suíte dentro do acordo do time.

## Checklist de validação

- [ ] Ferramenta existente reutilizada (sem framework duplicado)
- [ ] Nível da pirâmide adequado ao comportamento
- [ ] Teste falha antes do fix (quando bug) e passa depois
- [ ] Sem dados/segredos reais
- [ ] CI executa testes (ou PR documenta pendência)
- [ ] Nomes legíveis e falhas com mensagem clara

## Skills relacionadas

- `testing-qa` — critérios de aceite e regressão manual
- `ci-cd` — pipelines e gates
- `code-review` — revisão de testes no PR
- `error-handling` — asserts em formatos de erro
- `backend-engineering` / `frontend-engineering` — camadas a testar
- `performance-optimization` — benchmarks sob demanda