# Maestro Engineering Standards

Referência central de padrões do framework. **Não** substitui Skills — resume princípios. Skills de domínio trazem o detalhe executável.

`maestro-core` e `project-foundation` devem consultar este documento ao planejar ou auditar projetos.

## 1. Filosofia

1. Inspecionar antes de alterar.
2. Diff mínimo; reutilizar o que existe.
3. Regras de negócio no servidor; UI não autoriza.
4. Conhecimento do produto em `.maestro/`; conhecimento genérico nas Skills globais.
5. Economia de tokens contínua sem omitir segurança/testes necessários.
6. Evidência > afirmação (testes, health, review).
7. Sem operações destrutivas / push / prod sem autorização explícita.

## 2. Arquitetura

- Preferir modularidade clara (features/módulos) adequada ao tamanho do produto.
- Contratos estáveis entre UI ↔ API ↔ dados.
- ADRs leves para decisões irreversíveis.
- Não impor a mesma stack a todos os produtos — justificar tradeoffs.
- Multi-tenant: isolamento explícito em toda leitura/escrita quando aplicável.

## 3. Front-end

- Tokens semânticos (brand, ink, muted, canvas, surface, danger…) — sem hex solto se token existir.
- Um kit de primitivos; sem biblioteca paralela.
- Feature folders + shell + `components/ui` (ou padrão equivalente do projeto).
- Validação client + server; estados loading/empty/error obrigatórios.
- Feedback de mutation (toast ou equivalente).

## 4. UX / UI

- Uma tarefa principal por tela; CTA primário único na dobra.
- Confirmar destrutivo; dirty guard em forms.
- Escolher componente pelo job (modal vs página, cards vs tabela) — não checklist rígido.
- Evitar visual genérico de template de IA; identidade do **produto**.

## 5. Mobile

- Mobile-first; sem scroll horizontal de página.
- Breakpoint app tipicamente `lg` (~1024) quando shell dual (sidebar / bottom nav).
- Alvos de toque ≥ ~44px; inputs confortáveis; `text-base` no mobile (anti-zoom iOS).
- Modal → sheet no estreito; tabelas → cards no mobile.

## 6. Componentes

- Variants por função (primary / outline / ghost / danger).
- EmptyState, skeletons, ActionModal, FormActionBar quando o produto tiver shell mobile.
- Não recriar componente existente com outro nome.

## 7. Back-end

- Validação de entrada no servidor; whitelist.
- Erros padronizados e mensagens seguras.
- AuthN/AuthZ em toda mutação sensível.
- Paginação em listagens; evitar N+1.
- Auditoria em escritas relevantes quando o domínio exigir.

## 8. Banco de dados

- Migrations versionadas; integridade referencial.
- Índices justificados por consultas reais.
- Isolamento de tenant se SaaS.
- Backup antes de migrate em produção.

## 9. Segurança

- Segredos só em env/cofre; nunca em Skills/docs/código commitado.
- HTTPS em produção; CORS restrito; rate limit quando aplicável.
- Menor privilégio; sem confiar no cliente para `tenant_id`/roles.

## 10. Infraestrutura

- Discover-first (não assumir Docker/PM2/Hostinger).
- Separar dev e prod; `.env.example` sem valores reais.
- Health check; rollback definido.
- Logs sem PII/segredos.

## 11. Qualidade

- Testes nos fluxos P0; não afirmar “passou” sem evidência.
- Review com severidade e path:linha.
- Lint/typecheck do pacote tocado.

## 12. Critérios de aceitação (entrega)

- [ ] Comportamento pedido atendido
- [ ] Padrões do projeto / `.maestro` respeitados
- [ ] Segurança básica do escopo ok
- [ ] Testes/smoke relevantes executados ou bloqueio explícito
- [ ] Docs/knowledge atualizados se contrato/regra mudou
- [ ] Sem segredos no diff

## Relacionados

- Skills: `project-foundation`, `maestro-core`, `autonomous-project-builder`
- Living Knowledge: `.maestro/` / `templates/living-project-knowledge/`
