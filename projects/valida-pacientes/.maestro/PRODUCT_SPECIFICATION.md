# Product Specification

> Fonte da verdade do **produto** (o quê e por quê). Gerado nas fases Discovery + Product Definition.
> Decisões técnicas ficam em `ARCHITECTURE.md`, `DATABASE.md` e `technical-decisions.md`.
> Sem segredos ou dados reais de clientes.

## 1. Pedido original

> Texto do desenvolvedor, literal. Nunca editar — é a referência para não perder requisitos.

```text
crie um app para login de medido e validar lista de pacientes
```

## 2. Identidade

| Campo | Valor |
|-------|-------|
| Nome provisório | ValidaPacientes |
| Slug (`projects/<slug>`) | `valida-pacientes` |
| Objetivo | O médico autentica-se e confirma, paciente a paciente, a lista operacional atribuída a ele. |
| Problema que resolve | A lista do turno chega sem registro de quem conferiu cada pessoa e se o cadastro mínimo está aceito ou recusado. |
| Proposta de valor (1 frase) | Em um login, o médico vê só os seus pacientes e deixa registrado se cada um foi validado ou recusado. |

## 3. Público-alvo e perfis

| Perfil | Quem é | Objetivo principal | Pode | Não pode |
|--------|--------|--------------------|------|----------|
| Médico | Profissional que assume a lista do turno | Conferir e registrar a validação dos seus pacientes | Entrar, ver a própria lista, buscar, filtrar, validar ou recusar com motivo | Ver pacientes de outro médico, alterar cadastro, validar inativo |
| Administrador | Operação da clínica (uma organização) | Manter a lista e a atribuição | Entrar, cadastrar e editar pacientes, atribuir médico, ver todos e o histórico | Validar ou recusar no lugar do médico; ver prontuário (não existe) |

## 4. Requisitos — rastreabilidade

Todo item do pedido original aparece aqui com origem `pedido`. Complementos sugeridos pelo Maestro têm origem `maestro`.

| ID | Requisito | Origem | Módulo | Fase | Status |
|----|-----------|--------|--------|------|--------|
| RF-01 | Login de médico | pedido | auth | V1 | validado |
| RF-02 | Validar a lista de pacientes (decisão por paciente: validado ou recusado) | pedido | pacientes | V1 | validado |
| RF-03 | Sessão com access token curto, refresh em cookie httpOnly e logout | maestro | auth | V1 | validado |
| RF-04 | Médico só acessa pacientes atribuídos a ele | maestro | pacientes | V1 | validado |
| RF-05 | Busca por nome, filtro por status e paginação | maestro | pacientes | V1 | validado |
| RF-06 | Administrador cadastra e edita a lista e atribui o médico | maestro | pacientes | V1 | validado |
| RF-07 | Histórico de quem decidiu, quando e com qual motivo | maestro | pacientes | V1 | validado |
| RF-08 | Resumo de pendentes, validados e recusados | maestro | pacientes | V1 | validado |
| RF-09 | Prontuário clínico, diagnóstico, prescrição e exames | maestro | — | pós-V1 | adiado (dado de saúde além do mínimo; LGPD) |

Status: `pendente` · `em andamento` · `implementado` · `validado` · `adiado (motivo)`.

## 5. Módulos

| Módulo | Responsabilidade | Depende de |
|--------|------------------|------------|
| auth | Identidade, sessão, papéis | usuários |
| pacientes | Lista, cadastro mínimo, decisão de validação, histórico | auth |
| usuários | Médicos ativos para atribuição (somente leitura na V1) | auth |

## 6. Regras de negócio

IDs estáveis; onde/como são aplicadas no código fica em `knowledge/business-rules.md`.

| ID | Regra | Exceções |
|----|-------|----------|
| BR-01 | Login exige e-mail e senha; falha de credencial ou usuário inativo devolve a mesma mensagem genérica. | Nenhuma |
| BR-02 | Médico lista, abre e decide somente pacientes ativos atribuídos a ele. Paciente de outro médico responde 404. | Administrador lê todos, inclusive inativos |
| BR-03 | Só o médico atribuído registra validado ou recusado. Administrador recebe 403. | Nenhuma |
| BR-04 | Recusa exige motivo entre 10 e 280 caracteres. Validação aceita observação opcional no mesmo limite. | Nenhuma |
| BR-05 | Cada decisão gera histórico imutável e atualiza o status atual do paciente. | Nenhuma |
| BR-06 | Paciente inativo não entra na lista do médico e não aceita nova decisão. | Administrador ainda consulta o cadastro |
| BR-07 | Cadastro guarda só os 4 últimos dígitos do documento, data de nascimento, nome e nota operacional. Sem CID, evolução ou exame. | Nenhuma |
| BR-08 | Mudança de nome, nascimento, final do documento ou médico responsável volta o status para pendente. Nota e ativação não reiniciam a decisão. | Nenhuma |
| BR-09 | Paciente só pode ser atribuído a usuário ativo com papel médico. | Nenhuma |
| BR-10 | Não há validação em lote na V1: cada paciente é decidido individualmente. | Nenhuma |

## 7. Fluxos principais

### F-01 — Entrar

1. Médico informa e-mail e senha na tela de login.
2. O servidor confere o hash, emite access token e grava refresh em cookie httpOnly.
3. O médico cai na própria lista. Credencial inválida permanece na tela com mensagem genérica.

### F-02 — Validar ou recusar um paciente

1. Médico autenticado abre um paciente da sua lista.
2. Confere nome, nascimento, idade e final do documento.
3. Confirma validação ou recusa com motivo.
4. O status muda e o histórico mostra autor, data e motivo. A lista atualiza os contadores.

### F-03 — Montar a lista

1. Administrador cadastra o paciente com dados mínimos e escolhe o médico.
2. O paciente nasce pendente e passa a aparecer só para esse médico.
3. Se o administrador corrigir identidade ou trocar o médico, a validação anterior deixa de valer e o status volta a pendente. O histórico permanece.

## 8. Critérios de aceite

| ID | Critério verificável | Fluxo/Requisito | Verificação (teste/manual) |
|----|----------------------|-----------------|----------------------------|
| CA-01 | Médico com senha correta recebe sessão e os dados públicos do próprio usuário, sem hash | F-01 / RF-01 | API |
| CA-02 | Senha errada ou usuário inativo responde 401 com a mesma mensagem, sem indicar qual falhou | F-01 / BR-01 | API |
| CA-03 | Médico não lista nem abre paciente de outro médico (404 no detalhe) | F-02 / BR-02 | API |
| CA-04 | Médico valida o próprio paciente pendente e o status fica validado, com uma linha de histórico | F-02 / RF-02 | API |
| CA-05 | Recusa sem motivo, ou com motivo curto, responde 400 e não grava decisão | F-02 / BR-04 | API |
| CA-06 | Administrador não consegue decidir validação (403) | F-02 / BR-03 | API |
| CA-07 | Alterar o nome de um paciente validado volta o status para pendente e preserva o histórico | F-03 / BR-08 | API |
| CA-08 | Tela de login, lista (vazio, carregando, erro, filtro) e decisão funcionam no navegador | F-01, F-02 | Browser |
| CA-09 | Sem sessão, a API de pacientes responde 401 e a interface volta ao login | RF-03 | API + browser |

## 9. Escopo

- **V1 (MVP):** login de médico e de administrador; lista isolada por médico; busca, filtro e paginação; validar ou recusar com histórico; cadastro mínimo pelo administrador; resumo de status; dados fictícios.
- **Pós-V1:** gestão de usuários pela interface; carimbo em lote se a operação pedir; exportação; múltiplas unidades.
- **Fora de escopo:** prontuário, prescrição, exames, agenda, portal do paciente, app nativo, multi-clínica, dados reais de pacientes, envio de e-mail.

## 10. Premissas assumidas pelo Maestro

Inferências feitas sem perguntar (revisáveis pelo desenvolvedor).

- “medido” no pedido original é médico.
- “Validar lista” significa decisão registrada por paciente, não um único aceite da lista inteira. Lote ficou de fora (BR-10) para não confirmar gente não conferida.
- Uma clínica só. Não é SaaS. Isolamento é por médico responsável, não por tenant.
- Existe um administrador para a lista não depender só do seed. Médicos da V1 nascem no seed.
- Dados de saúde: só o mínimo para reconhecer a pessoa na lista. Prontuário fica fora (RF-09), com nota LGPD.
- Seeds e senhas de desenvolvimento são fictícios e locais. Não usar com pessoa real.
- Web responsiva. Sem app nativo.
- Stack padrão de sistema web com login (ADR-001), porque o pedido não fixou tecnologia.

## 11. Perguntas em aberto

Somente o que bloqueia ou envolve risco (dados sensíveis, custo, autorização externa).

- Nenhuma. Dados reais, produção e provedores pagos não entram na V1.
