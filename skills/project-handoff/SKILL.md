---
name: project-handoff
description: >-
  Prepares operational handoff with runbooks, ownership, credential locations (no secrets in docs),
  and knowledge transfer checklist. Use at release to ops, team change, client delivery, or end of
  engagement. Do not use mid-sprint for minor tasks or to paste passwords into markdown.
metadata:
  framework: maestro-engineering-skills
  category: docs
  version: "1.0.0"
---

# Project Handoff

## Objetivo

Transferir operação e manutenção com clareza de responsáveis, procedimentos, dependências externas e onde obter credenciais **sem** expor segredos na documentação.

## Quando ativar

- Go-live em produção ou entrega a cliente/outro squad.
- Fim de contrato ou rotação de mantenedor primário.
- Após `project-planning` fase final ou release major.

## Quando NÃO ativar

- PR interna sem mudança operacional.
- Pedido para “colocar a senha no README” — recusar e apontar cofre seguro.

## Contexto técnico necessário

- Inventário de ambientes (dev/staging/prod).
- Repositórios, pipelines CI/CD, hosting (Hostinger/VPS/cloud).
- Contatos: dono produto, dono técnico, suporte terceiros.
- Docs existentes (`technical-documentation`, `deployment-documentation`).

## Regras obrigatórias

1. **Zero secrets** em markdown, issues, ou chat exportado — apenas nomes de vars e local do cofre.
2. **Ownership** — RACI simples por sistema (quem aprova deploy, quem acorda de madrugada).
3. Runbook mínimo: subir, derrubar, restaurar backup, contatos de escalação.
4. Listar **dívida técnica** e riscos conhecidos com prioridade.
5. Sessão de walkthrough (ou gravada) referenciada no pacote de handoff.
6. Validar que `deployment-documentation` está linkado, não duplicado integralmente.

## Processo de execução

1. **Pacote de handoff** — índice único (`docs/handoff.md` ou equivalente).
2. **Sistemas** — diagrama de contexto: app, DB, fila, DNS, CDN, e-mail.
3. **Acessos** — quem concede; onde solicitar; MFA obrigatório.
4. **Credenciais** — tabela: Nome lógico | Onde vive (1Password, Hostinger painel, GitHub env) | Rotacionado em | Dono — **sem valores**.
5. **Runbooks** — link para `docs/operations/` por procedimento.
6. **SLAs/SLOs** acordados ou “não definido” explícito.
7. **Suporte** — bugs: tracker; severidades; template de incidente.
8. **KT checklist** — marcar itens demonstrados ao receptor.
9. **Janela de hypercare** — período e canal se aplicável.

### RACI enxuto (exemplo)

| Atividade | Responsible | Accountable | Consulted | Informed |
|-----------|-------------|-------------|-----------|----------|
| Deploy prod | DevOps | Tech Lead | Devs | Produto |
| Incidente S1 | On-call | Tech Lead | Infra | Cliente |

## Boas práticas

- Gravar demo de deploy e rollback em staging.
- Incluir “primeiras 48h” pós go-live.
- Manter handoff datado; revisão trimestral em sistemas críticos.

## Erros comuns

- Dump de `.env` no zip de entrega.
- Dono “time X” sem nome ou e-mail.
- Runbook só para deploy feliz, sem falha de DB ou fila cheia.
- Omitir custos recorrentes (domínio, VPS, APIs pagas).

## Exemplos práticos

**Tabela credencial** — `DATABASE_URL` → GitHub Environment `production` → rotacionada trimestralmente → dono: Tech Lead.

**Dívida** — “Fila sem DLQ” — risco médio — mitigação planejada Fase 2.

## Critérios de qualidade

- Receptor consegue achar qualquer acesso em &lt;10 min via índice.
- Incidente simulado (tabletop) passou ou gaps anotados.
- Nenhum secret em artefato versionado.

## Checklist de validação

- [ ] Índice handoff publicado
- [ ] RACI/ownership definidos
- [ ] Credenciais só por referência segura
- [ ] Runbooks linkados e testados
- [ ] Dívida e riscos listados
- [ ] KT realizada ou agendada
- [ ] `deployment-documentation` alinhada

## Skills relacionadas

- `maestro-core` — encerramento de trilha
- `technical-documentation` — base de docs
- `deployment-documentation` — procedimentos de release/rollback
- `project-planning` — marco final e hypercare
- `software-architecture` — diagrama de sistemas