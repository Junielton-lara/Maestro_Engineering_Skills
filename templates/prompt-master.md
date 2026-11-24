# Prompt Master — [Nome do Produto]

> Documento gerado pela skill `prompt-master-generator`. Pronto para colar em IDE/agente.
> Marque `[A DEFINIR]` apenas quando a decisão foi explicitamente adiada.

## 1. Visão geral do produto

- **Nome:**
- **Problema que resolve:**
- **Proposta de valor (1 frase):**
- **Fora de escopo (MVP):**

## 2. Objetivos

- Objetivo de negócio 1
- Objetivo de produto 1
- Métrica de sucesso

## 3. Público-alvo

| Persona | Necessidade | Frequência de uso |
|---------|-------------|-------------------|
| | | |

## 4. Escopo funcional

### 4.1 Principais

- [ ] Funcionalidade A
- [ ] Funcionalidade B

### 4.2 Secundárias (pós-MVP)

- [ ] Funcionalidade C

## 5. Módulos

| Módulo | Responsabilidade | Dependências |
|--------|------------------|--------------|
| | | |

## 6. Regras de negócio

1. Regra — condição — exceção
2. …

## 7. Perfis e permissões

| Perfil | Pode | Não pode |
|--------|------|----------|
| Admin | | |
| Usuário | | |

## 8. Arquitetura técnica

- Estilo (modular monolito / BFF / etc.):
- Limites entre front, API e dados:
- Diagrama textual (fluxos principais):

## 9. Stack tecnológica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | | |
| Backend | | |
| Banco | PostgreSQL (preferência) | |
| Infra | | |

## 10. Estrutura de diretórios

```text
/
  apps/ ou src/
  ...
```

## 11. Banco de dados

- Entidades principais:
- Relacionamentos:
- Isolamento multi-tenant (se aplicável):
- Estratégia de migrations:

## 12. APIs

| Método | Recurso | Auth | Notas |
|--------|---------|------|-------|
| | | | |

- Paginação, erros padronizados, idempotência:

## 13. Front-end

- Padrões de componentes / design system:
- Estados: loading, empty, error:
- Formulários e validação client-side (sempre espelhada no server):

## 14. Back-end

- Camadas / módulos:
- Validação server-side:
- Transações e regras no servidor:

## 15. UX/UI

- Fluxos críticos (passo a passo):
- Feedback visual e confirmações destrutivas:

## 16. Responsividade / mobile

- Mobile-first: sim/não
- Breakpoints e tabelas adaptáveis:

## 17. Segurança

- Auth (sessão/JWT/cookies):
- Autorização (RBAC):
- Secrets e LGPD/dados sensíveis:
- Headers e hardening básicos:

## 18. Testes

- Críticos (manuais/automatizados):
- Pirâmide (unit / integration / e2e):
- Critérios de regressão:

## 19. Infraestrutura

- Ambiente (ex.: VPS Hostinger / outro):
- Serviços (Nginx, PM2, Docker, PostgreSQL):
- Observabilidade (logs, health):

## 20. Deploy

- Pipeline:
- Variáveis de ambiente:
- Rollback:
- Backup pré-migrate:

## 21. Fases de implementação

| Fase | Entregável | Dependências | Aceite |
|------|------------|--------------|--------|
| 0 | Fundação | | |
| 1 | MVP núcleo | | |
| 2 | Ampliação | | |

## 22. Critérios de aceite (globais)

- [ ] Fluxo principal completo autenticado
- [ ] Isolamento de dados / permissões validados
- [ ] Deploy com HTTPS e health check
- [ ] Documentação mínima atualizada
