---
name: software-architecture
description: >-
  Defines modular design, boundaries, ADRs, and tradeoffs with inspect-before-change discipline.
  Use when designing new modules, extending systems, refactoring structure, or resolving coupling
  before coding. Do not use for cosmetic UI tweaks or when no structural decision is required.
metadata:
  framework: maestro-engineering-skills
  category: core
  version: "1.0.0"
---

# Software Architecture

## Objetivo

Garantir estrutura sustentável: módulos com fronteiras claras, contratos estáveis, decisões registradas (ADRs) e mudanças precedidas de inspeção do código existente.

## Quando ativar

- Novo subsistema, integração externa ou desenho de API pública.
- `extend` / `refactor` com risco de acoplamento ou duplicação.
- Divergência entre spec (`prompt-master-generator`) e código atual.
- Performance/escala que exige partições (cache, filas, read models).

## Quando NÃO ativar

- Ajuste local dentro de um módulo já bem delimitado.
- Alteração de texto/estilo sem contrato.
- Usuário proíbe análise (“só muda a linha X”) — registrar risco e obedecer.

## Contexto técnico necessário

- Prompt Master ou escopo de módulos (se existir).
- Árvore de código, camadas atuais (UI, domínio, infra).
- Dependências e pontos de entrada (HTTP, CLI, jobs).

## Regras obrigatórias

1. **Inspect-before-change**: mapear chamadas, imports e dados compartilhados antes de propor estrutura.
2. Todo módulo tem **responsabilidade única** e **API explícita** (funções, pacotes, rotas).
3. **Dependências apontam para dentro** (domínio não importa framework de UI).
4. Tradeoffs documentados em **ADR** curto (Contexto, Decisão, Consequências).
5. Preferir **evolução incremental** a big-bang rewrite salvo mandato explícito.
6. Alinhar com `maestro-core`: diff mínimo; sem deletes destrutivos sem auth.

## Processo de execução

1. **Contexto** — capacidades do escopo e restrições não-funcionais (latência, multi-tenant).
2. **As-is** — diagrama mental ou lista: componentes, stores, integrações.
3. **Problemas** — acoplamento, ciclos, god objects, vazamento de infra.
4. **To-be** — bounded contexts, camadas, eventos vs. chamadas síncronas.
5. **Contratos** — DTOs, erros, versionamento, idempotência onde couber.
6. **ADRs** — uma por decisão irreversível ou cara.
7. **Plano de migração** — strangler, feature flags, fases (`project-planning`).
8. **Validação** — checklist abaixo antes de implementar.

### Padrões úteis (escolher com justificativa)

| Cenário | Opções comuns | Sinal de escolha |
|---------|---------------|------------------|
| CRUD app | monólito modular | time pequeno, deploy único |
| Integrações | hexagonal + ports/adapters | múltiplos provedores |
| Leitura pesada | CQRS light | relatórios sem travar write |
| Escala assíncrona | fila + workers | picos, retries |

## Boas práticas

- Nomear módulos pelo **verbo de negócio** (billing, scheduling), não pela tecnologia.
- Testes de contrato na borda do módulo.
- Observabilidade na fronteira (correlation id, logs estruturados).

## Erros comuns

- Microserviços prematuros.
- DTO duplicado em 5 pastas sem fonte única.
- ADR genérico (“usar clean architecture”) sem consequência.
- Refatorar sem medição (métricas, testes de caracterização).

## Exemplos práticos

**ADR exemplo** — Título: “Persistir pedidos em Postgres via repositório no domínio”. Consequência: migrações versionadas; sem SQL na camada HTTP.

**Limite** — `notifications/` publica evento `OrderPaid`; `billing/` não importa `notifications` diretamente.

## Critérios de qualidade

- Diagrama ou lista to-be compreensível em 5 minutos.
- Cada ADR liga a um risco ou requisito da spec.
- Plano de migração compatível com deploy contínuo.

## Checklist de validação

- [ ] Código relevante inspecionado (não só spec)
- [ ] Fronteiras e contratos escritos
- [ ] ADRs para decisões-chave
- [ ] Tradeoffs explícitos
- [ ] Migração faseada definida
- [ ] `project-planning` atualizado se multi-fase

## Skills relacionadas

- `maestro-core` — intenção e sequência
- `prompt-master-generator` — fonte de módulos e regras
- `project-planning` — ordem de dependências entre módulos
- `technical-documentation` — publicar ADRs em `docs/adr/`
- `deployment-documentation` — impacto em serviços e env