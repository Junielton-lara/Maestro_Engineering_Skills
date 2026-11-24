---
name: error-handling
description: >-
  Padroniza formatos de erro, logging seguro (sem vazar segredos) e mensagens ao usuário com códigos
  estáveis. Use when tratar falhas em API/UI, middleware de erro ou melhorar DX de debugging.
  Do not use when o escopo for só segurança ofensiva ou auth (security-engineering).
metadata:
  framework: maestro-engineering-skills
  category: quality
  version: "1.0.0"
---

# Tratamento de Erros

## Objetivo

Comportamento previsível em falhas: contrato de erro claro para clientes, logs úteis para operação sem exposição de segredos, e mensagens humanas que não confundem nem vazam implementação.

## Quando ativar

- Novo endpoint, job ou fluxo UI com estados de falha.
- Inconsistência de formatos de erro no projeto.
- Incidentes difíceis de debugar por falta de contexto em logs.
- Integração externa com timeout e retry.

## Quando NÃO ativar

- Design de sistema de alertas completo → `observability`.
- Revisão de vulnerabilidades → `security-engineering`.
- Testes de aceite manuais → `testing-qa`.

## Contexto técnico necessário

- Padrão existente (RFC 7807, `{ code, message, details }`, GraphQL errors).
- Middleware/filters de erro do framework.
- O que pode ser exposto ao cliente (compliance, anti-enumeração).
- Ferramenta de logging e correlation ID.

## Regras obrigatórias

1. **Um formato estável** na borda pública (HTTP/WS); estender o existente antes de inventar outro.
2. **Código de erro machine-readable** (`VALIDATION_FAILED`, `NOT_FOUND`) além de HTTP status.
3. **Mensagem ao usuário** genérica em falhas internas; detalhe técnico só em log.
4. **Nunca retornar** stack trace, SQL, path de servidor ou variáveis de ambiente ao cliente.
5. **Logs estruturados** com `correlationId`, `userId` (se permitido), `errorCode`, duração.
6. **Sem logar** senhas, tokens, cookies, cartão, corpo bruto de request sensível.
7. **Validação**: campo + mensagem em `details[]` quando aplicável.

## Processo de execução

1. **Ler** handlers/middleware atuais e exemplos de resposta de erro.
2. **Mapear classes**: validação (4xx), negócio (409/422), auth (401/403), não encontrado (404), inesperado (500).
3. **Definir shape** (exemplo abaixo) e aplicar na borda.
4. **Traduzir** exceções de domínio/ORM para contrato público.
5. **Centralizar** logging no middleware; handlers não fazem `console.log` disperso.
6. **Testar** formatos com `automated-testing` em casos representativos.

### Shape recomendado (HTTP JSON)

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Dados inválidos",
    "details": [{ "field": "email", "message": "Formato inválido" }],
    "correlationId": "01HF..."
  }
}
```

## Boas práticas

- **Correlation ID** gerado na borda e propagado a serviços externos.
- **Timeout e circuit breaker** em integrações; erro mapeado (`UPSTREAM_TIMEOUT`).
- **Idempotência**: conflito claro (`ALREADY_EXISTS`) vs retry seguro.
- **i18n**: código fixo; mensagem pode ser localizada no cliente.
- **Frontend**: exibir `message` + ações; logar `correlationId` no suporte.

## Erros comuns

- `catch(e) {}` silencioso.
- 500 com mensagem `e.message` do driver SQL.
- Misturar string e objeto no mesmo endpoint.
- Log duplicado em cada camada sem nível (`error` vs `warn`).
- Mensagens diferentes para “usuário não existe” vs “senha errada” (enumeração).

## Exemplos práticos

**Domínio:** `throw new BusinessError('INSUFFICIENT_STOCK', 'Estoque insuficiente')` → middleware retorna 409 + shape padrão.

**500:** cliente vê “Erro interno. ID: 01HF…”; log contém stack e contexto sanitizado.

**Job falhou:** dead-letter + alerta; não reprocessar infinitamente sem backoff.

## Critérios de qualidade

- 100% dos endpoints públicos novos seguem o shape acordado.
- Nenhum segredo ou PII excessiva em logs de erro.
- Cliente consegue agir em 4xx (campo, código documentado).
- Operação localiza incidente por `correlationId`.

## Checklist de validação

- [ ] Shape documentado e consistente
- [ ] 401/403/404/409/422/500 mapeados
- [ ] Validação com `details`
- [ ] Middleware centralizado
- [ ] Logs sem credenciais/corpo sensível
- [ ] Testes em caminhos de erro principais

## Skills relacionadas

- `security-engineering` — anti-vazamento e mensagens seguras
- `code-review` — severidade em erros no PR
- `observability` — métricas e alertas em taxa de 5xx
- `backend-engineering` — erros na camada de aplicação
- `automated-testing` — asserts de contrato de erro
- `nginx-configuration` — páginas de erro na borda