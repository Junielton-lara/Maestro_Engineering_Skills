---
name: environment-configuration
description: >-
  Configura ambientes no estilo 12-factor: padrões .env, separação dev/staging/prod, nunca commitar
  segredos. Use when criar .env.example, validar variáveis de boot ou alinhar config entre local e
  VPS. Do not use when o escopo for só pipeline YAML (ci-cd) ou hardening de SO.
metadata:
  framework: maestro-engineering-skills
  category: infra
  version: "1.0.0"
---

# Configuração de Ambiente

## Objetivo

Tornar configuração explícita, por ambiente, via variáveis de ambiente — sem segredos no repositório e com defaults seguros documentados.

## Quando ativar

- Novo serviço ou integração (API keys, URLs).
- App falha ao subir por variável ausente.
- Onboarding de dev (“como configuro local?”).
- Divergência entre local e produção.

## Quando NÃO ativar

- Escrita de infra Terraform completa sem vars de app → `devops-infrastructure`.
- Tuning de Nginx → `nginx-configuration`.
- Lógica de leitura de config no código → `backend-engineering`.

## Contexto técnico necessário

- Framework de config (dotenv, `config/`, Nest `ConfigModule`, etc.).
- Arquivos `.env*`, `example`, documentação README.
- Onde prod carrega vars (systemd, PM2, compose, painel CI).
- Lista de integrações e flags de feature.

## Regras obrigatórias

1. **Nunca commitar** `.env`, credenciais reais ou dumps com segredos.
2. **`.env.example`** com todas as chaves, valores fictícios e comentários.
3. **Validar no boot** variáveis obrigatórias; falhar rápido com mensagem clara.
4. **12-factor**: config no ambiente, não baked em build (exceto `NODE_ENV` build-time documentado).
5. **Separação** dev/staging/prod — nunca apontar local para DB de produção.
6. **Permissões** `600` em arquivos de env no servidor.

## Processo de execução

1. Inventariar `process.env` / config usados no código (grep leve).
2. Classificar: obrigatório vs opcional; segredo vs público.
3. Atualizar `.env.example` e README (tabela de variáveis).
4. Adicionar validação (schema zod/joi ou checagem manual no boot).
5. Replicar chaves em CI secrets e servidor → `ci-cd`, `hostinger-deployment`.
6. Revisar que logs não imprimem config completa.

### Modelo de documentação

| Variável | Obrigatória | Exemplo | Descrição |
|----------|-------------|---------|-----------|
| `DATABASE_URL` | sim | `postgres://...` | Conexão Postgres |
| `JWT_SECRET` | sim | `(gerar 32+ bytes)` | Assinatura de token |

## Boas práticas

- **Prefixo** por integração (`STRIPE_`, `SMTP_`).
- **Feature flags** com default seguro (desligado).
- **URLs** absolutas por ambiente (`APP_URL`).
- **Rotação**: documentar como trocar secret sem downtime (dual-key quando possível).
- **Dotenv** só em dev; prod usa env do process manager.

## Erros comuns

- `.env` no git por engano.
- `example` desatualizado após refactor.
- Booleano como string (`"false"` truthy em JS).
- Mesmo `JWT_SECRET` em dev e prod.
- Commitar `credentials.json` do GCP/AWS.

## Exemplos práticos

**Boot validation:** se falta `DATABASE_URL`, processo sai com código 1 e log único.

**Local:** copiar `.env.example` → `.env`; preencher com DB docker local.

**Prod:** arquivo em `/opt/app/.env` referenciado por systemd `EnvironmentFile=`.

## Critérios de qualidade

- Novo dev sobe app seguindo README + example.
- Nenhum segredo no histórico git (se houver, rotacionar).
- Variáveis sensíveis não logadas.
- Paridade documentada entre ambientes (não idêntica por design).

## Checklist de validação

- [ ] `.env` no `.gitignore`
- [ ] `.env.example` completo e sem valores reais
- [ ] Validação no boot para obrigatórias
- [ ] CI e servidor com mesmas chaves (valores distintos)
- [ ] Permissões de arquivo no servidor
- [ ] README atualizado

## Skills relacionadas

- `ci-cd` — secrets no pipeline
- `hostinger-deployment` — env em produção
- `docker-management` — env_file em compose
- `security-engineering` — proteção de segredos
- `error-handling` — erro claro se config inválida
- `devops-infrastructure` — política por ambiente