# Extração de conhecimento — projeto de referência (histórico)

**Fonte:** análise **somente leitura** de um produto SaaS B2B de campo (stack React/Vite + Nest/Prisma + PWA), usada para generalizar padrões ao Maestro.  
**Escopo:** padrões de engenharia reutilizáveis — **não** regras de domínio do produto de referência.  
**Nota de publicação:** paths absolutos de máquinas locais foram omitidos de propósito.

## Classificação

| Tipo | Significado |
|------|-------------|
| **OBSERVADO** | Existia no código/docs/skills da referência |
| **GENERALIZADO** | Adaptado sem marca/domínio do produto |
| **RECOMENDAÇÃO MAESTRO** | Melhoria do framework |

## Achados reutilizados (resumo)

- Tokens CSS + kit fino de UI; shell dual (sidebar / bottom nav ~1024px).
- Modal→sheet; tabelas→cards no mobile; touch targets; RHF+Zod + validação server.
- Nest modular, ValidationPipe, tenant por `companyId` no service, JWT+roles no servidor.
- Compose local ≠ stack prod; migrate no entrypoint; healthcheck.
- Acervo de skills/docs de agente como padrão de Living Knowledge.

## Explicitamente NÃO incorporado como obrigatório

- Cores/marca do produto de referência.
- Domínio de assistência técnica / parsers específicos / gateway WhatsApp.
- Credenciais, IPs, seeds de senha.
- Débitos (dependência morta, focus outline transparente) — tratados como anti-padrões.

## Mapeamento → Maestro

Ver Skills `design-system`, `mobile-first`, `frontend-engineering`, `ux-ui-design`, Standards e Living Knowledge.
