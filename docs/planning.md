# Planejamento — AI Financial

> Documento vivo. É a fonte de verdade sobre **o que** o produto é e **por quê**, antes do "como" (arquitetura de código fica em `api/.agents/skills/architecture/SKILL.md` e `web/.agents/skills/architecture/SKILL.md`). Deve ser atualizado sempre que o escopo mudar.

## 1. Visão geral

O AI Financial é um gerenciador financeiro pessoal completo: um lugar único para registrar despesas e receitas, acompanhar financiamentos, investimentos e metas de economia, e enxergar a saúde financeira geral (patrimônio líquido, fluxo de caixa, orçamento por categoria) sem depender de planilha.

**Modelo de uso**: single-user. Não existe conceito de organização/workspace/multiusuário — decisão tomada em 2026-08-13 para simplificar o modelo de dados. Se um dia fizer sentido compartilhar com outra pessoa (ex: casal dividindo orçamento), isso volta como uma fase futura explícita, não como suposição de design desde já.

## 2. Contexto do repositório (importante para quem for implementar)

Este repositório foi criado a partir da estrutura de um **projeto de clínica** (agenda de pacientes, prontuário, profissionais). Isso significa que boa parte do que existe hoje em `api/` e nos docs (`README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `docker-compose.yml`) **não reflete o domínio financeiro** e precisa ser substituído, não só renomeado. Ver seção 8 (limpeza do scaffold) para a lista concreta.

Dois problemas específicos já identificados no scaffold herdado:

- `api/src/db/schema/**` contém entidades de clínica (`patients.ts`, `appointments.ts`, `medical-record-entries.ts`, `waiting-list.ts`, `workspaces.ts`, `workspace-members.ts` etc.) — tudo isso será removido e substituído pelo schema financeiro (seção 6).
- O find-replace que renomeou o projeto original quebrou `docker-compose.yml`: `healthcheck` virou `financialcheck` e `service_healthy` virou `service_financial` — chaves inválidas do Compose, precisam ser corrigidas para os nomes reais do Docker, não apenas cosméticas.

## 3. Autenticação — decisão e plano

O scaffold herdado já vem com um padrão de **auth remota**: a API valida sessão contra um microsserviço `ai-auth` separado via `@aiandrameira/api-auth` (`api/src/http/plugins/remote-auth.ts`), e o frontend consome `@aiandrameira/ai-auth`. Esse padrão **não será mantido**.

Decisão: autenticação **embutida no próprio ai-financial**, implementada **por último**, depois do resto do produto estar funcional. Motivo prático: não travar o desenvolvimento das features financeiras atrás de um fluxo de login, e não ter que autenticar o tempo todo em dev.

- Referência de implementação: `ai-book` (mais completo — já integra Cloudinary para foto de perfil) e `better-auth` (projeto próprio, mais simples). Copiar/adaptar padrões desses dois, não reinventar do zero conceitualmente.
- Durante o desenvolvimento das fases 0–6 (antes da fase de auth), usar um **usuário de desenvolvimento fixo** (seed, `DEV_USER_ID` estável) e desligar qualquer guard de sessão — evita ter que logar toda vez que o servidor reinicia.
- Quando a fase de auth acontecer: usuário/sessão local no banco do próprio `ai-financial` (não um serviço externo), upload de avatar via Cloudinary (já é dependência da API), e todo o restante do produto passa a ser escopado pelo `user_id` real em vez do usuário de dev fixo — como esse campo já existe desde a Fase 1 (seção 5), essa transição não exige migração de schema, só trocar o valor.
- Ideia adiada, não descartada: atualizar o `better-auth` para também suportar troca de foto de perfil via Cloudinary, igualando-o ao `ai-book`. Fora do escopo deste projeto — mencionado aqui só para não se perder.

## 4. Escopo funcional

### 4.1 MVP (fases 1–6, ver roadmap)

| Módulo | Descrição |
| --- | --- |
| **Contas e carteiras** | Contas correntes, poupança, carteira/dinheiro. Cada uma com saldo inicial e saldo calculado. |
| **Categorias** | Categorias de receita/despesa, com subcategorias. Um conjunto padrão pré-cadastrado (seed), mas o usuário pode criar as suas. |
| **Transações (despesas e receitas)** | Lançamento manual, com data, valor, categoria, conta, descrição, tags, anexo (nota fiscal/comprovante via Cloudinary), recorrência, status (previsto/pendente/concluído/cancelado). |
| **Transferências** | Movimentação entre contas, tratada como entidade própria — nunca conta como receita/despesa. |
| **Cartões de crédito** | Entidade separada de conta: limite, dia de fechamento, dia de vencimento, conta associada ao pagamento da fatura. |
| **Faturas e parcelamento** | Fatura por competência vinculada ao cartão; compras parceladas geram parcelas rastreáveis por fatura. |
| **Orçamento (budget)** | Valor planejado por categoria por mês, comparado ao realizado. |
| **Financiamentos/empréstimos** | Cadastro de financiamento (imóvel, veículo, pessoal, consórcio) com parcelas, taxa de juros, saldo devedor. Cada parcela é rastreável (paga/pendente/atrasada). |
| **Investimentos** | Carteira de ativos (renda fixa, ações, FIIs, tesouro, cripto, fundos), aportes/resgates, preço médio, valor atual (informado manualmente no MVP — sem cotação automática). |
| **Metas de economia** | Meta com valor-alvo, prazo, progresso derivado de aportes vinculados. Ex: "reserva de emergência", "viagem", "entrada do apartamento". |
| **Bens (patrimônio)** | Bens relevantes (imóvel, veículo) com valor de aquisição e valor atual, para o patrimônio líquido não contar só a dívida de um financiamento sem contar o bem financiado. |
| **Dashboard / relatórios** | Visão consolidada: patrimônio líquido, saldo atual/projetado, fluxo de caixa mensal, gastos por categoria, próximos vencimentos, evolução das metas. |

### 4.1.1 Decisões de domínio importantes para o MVP

- **Transferências entre contas são movimentações internas**, não receita nem despesa. Relacionam a saída da conta de origem à entrada na conta de destino, para não distorcer fluxo de caixa e relatórios.
- **Cartão de crédito é uma entidade própria**, separado de conta corrente/poupança. Possui limite, dia de fechamento, dia de vencimento e uma conta associada ao pagamento da fatura.
- **Compras parceladas fazem parte do MVP de cartões.** Uma compra parcelada mantém um identificador comum (`installment_group_id`) e gera parcelas rastreáveis nas respectivas competências/faturas.
- **Transações possuem status** (`planned`, `pending`, `completed`, `cancelled`) para diferenciar lançamentos previstos dos efetivamente realizados e permitir projeção de saldo.
- **Recorrência é modelada separadamente da transação.** Cada ocorrência gerada referencia uma regra de recorrência, permitindo editar só uma ocorrência, editar esta e as próximas, ou encerrar sem apagar o histórico.
- **Valores derivados não são fonte de verdade.** Saldos de contas, posição de investimentos, progresso de metas e totais de fatura são calculados a partir das movimentações, não armazenados como segunda fonte de verdade.
- **Ownership nasce antes da autenticação.** As entidades financeiras já têm `user_id` desde o primeiro schema. Nas fases 0–6 ele aponta para o usuário fixo de desenvolvimento; na fase 7 passa a apontar para o usuário autenticado real — sem migração de schema.
- **Contas a pagar/receber não têm tabela própria no MVP.** São uma visão sobre transações `planned`/`pending` com data futura, evitando duplicar domínio.

### 4.2 Fora de escopo do MVP (fases futuras explícitas)

- Importação de extrato bancário (CSV/OFX) — entrada é 100% manual no MVP, por decisão explícita (2026-08-13).
- Integração via Open Finance (conexão direta com bancos).
- Cotação automática de ativos (API de bolsa/cripto) — valor de investimentos é atualizado manualmente no MVP.
- Notificações/alertas (conta a vencer, orçamento estourado) — por e-mail (Resend já é dependência) ou push.
- Multiusuário/workspace compartilhado (casal, família) — decisão explícita de manter single-user por ora; se voltar, é redesenho de dados, não add-on.
- Apps mobile nativos.
- Qualquer recurso de IA (categorização automática de despesas, insights) — o nome do projeto segue a convenção `ai-*` dos outros repositórios do autor, não implica que haja IA no escopo atual. Fica como ideia a avaliar depois do MVP.

## 5. Modelo de dados (rascunho)

Não é o schema final (isso é trabalho de implementação, feito módulo a módulo seguindo `api/.agents/skills/architecture/SKILL.md`), mas o suficiente para orientar as fases do roadmap. Todas as entidades levam `user_id` desde já (seção 4.1.1).

```
accounts              (id, user_id, name, type[checking|savings|wallet], institution, initial_balance, color, icon, archived_at)
categories            (id, user_id, name, type[income|expense], parent_id, icon, color)

transactions          (id, user_id, account_id, category_id, type[income|expense|transfer],
                       status[planned|pending|completed|cancelled], amount, description, date, tags[],
                       recurrence_id, transfer_id, invoice_id, installment_group_id, attachment_url)

transfers             (id, user_id, source_transaction_id, destination_transaction_id, created_at)
recurrences           (id, user_id, frequency, interval, start_date, end_date, next_occurrence, active)

credit_cards          (id, user_id, name, account_id, institution, limit_amount, closing_day, due_day, color, archived_at)
credit_card_invoices  (id, user_id, credit_card_id, reference_month, closing_date, due_date, status[open|closed|paid])
installment_groups    (id, user_id, credit_card_id, description, total_amount, installments_total, purchase_date)

budgets               (id, user_id, category_id, reference_month, planned_amount)

loans                 (id, user_id, name, type[real_estate|vehicle|personal|consortium], principal_amount,
                       interest_rate, installments_total, start_date, account_id)
loan_installments     (id, user_id, loan_id, number, due_date, amount, principal_portion, interest_portion,
                       paid_at, status[pending|paid|late])

investment_assets     (id, user_id, name, type[fixed_income|stock|reit|treasury|crypto|fund], broker, ticker)
investment_movements  (id, user_id, investment_id, type[buy|sell|dividend|contribution|withdrawal],
                       quantity, price, amount, date)
investment_prices     (id, user_id, investment_id, price, reference_date, source[manual|automatic])

savings_goals         (id, user_id, name, target_amount, target_date, icon, color, linked_account_id)
goal_contributions    (id, user_id, goal_id, transaction_id, amount, date)

assets                (id, user_id, name, type[real_estate|vehicle|other], purchase_value, current_value, acquired_at)
```

Nenhuma entidade tem `organizationId`/`workspaceId`. `user_id` referencia o usuário fixo de desenvolvimento até a Fase 7, quando passa a referenciar o usuário autenticado real.

### 5.1 Regras de domínio e cálculos derivados

**Transferências.** Uma transferência entre contas gera duas movimentações vinculadas: saída na conta de origem e entrada na conta de destino. Não entra nos totais de receita/despesa, mas altera o saldo das duas contas.

**Saldo atual e saldo projetado.**
- Saldo atual = saldo inicial + transações `completed`.
- Saldo projetado = saldo atual + receitas `planned`/`pending` − despesas `planned`/`pending`.
- Transações `cancelled` não entram em nenhum cálculo.

**Cartões e parcelamento.**
- O cartão tem limite, fechamento e vencimento próprios; a fatura pertence ao cartão, não à conta.
- A conta associada ao cartão é a origem esperada do pagamento da fatura.
- Uma compra parcelada mantém `installment_group_id`; cada parcela é uma transação individual vinculada à fatura correspondente.
- Total da fatura e limite disponível são calculados, nunca editados manualmente.

**Recorrências.** A regra é independente das ocorrências geradas, permitindo alterar só uma ocorrência, alterar esta e as próximas, ou encerrar a recorrência sem apagar o histórico já realizado.

**Investimentos.** A fonte de verdade são `investment_movements` + `investment_prices`. Quantidade atual, preço médio, custo investido e valor atual são derivados. `investment_prices` começa com `source: manual` no MVP, já preparado para cotação automática (Fase 9) sem mudança de schema.

**Metas.** O progresso é derivado de `goal_contributions` — não existe um `current_amount` editável como segunda fonte de verdade. Quando possível, uma contribuição referencia a transação que efetivamente movimentou o dinheiro.

**Patrimônio e bens.** Patrimônio líquido = contas + investimentos + bens − dívidas. A entidade `assets` evita que um financiamento imobiliário apareça só como dívida, sem o bem financiado do outro lado.

**Contas a pagar e receber.** São uma visão sobre transações `planned`/`pending` com data futura — mostra próximos vencimentos e projeção de caixa sem duplicar lançamentos em outro módulo.

## 6. Arquitetura técnica

Mantém a stack já escolhida no scaffold (o problema era o domínio, não a stack):

- **`api/`**: Bun + Elysia, Drizzle ORM + PostgreSQL, Zod v4, Cloudinary (anexos/avatar futuro), Resend (e-mail, usado a partir da fase de notificações), arquitetura em camadas `domain → app → infra` (Route → Controller → Use Case → Repository).
- **`web/`**: Nx + Angular 21 (standalone, signals, `OnPush`), `@aiandralves/ai-ui` como design system, Tailwind v4.
- **Docker Compose** na raiz sobe Postgres + API + Web + docs (`ai-docs`) — precisa dos ajustes da seção 8.

O que muda em relação ao scaffold herdado:

- Remove o plugin `remote-auth` e as dependências `@aiandrameira/api-auth` / `@aiandrameira/ai-auth` (voltam, reimplementadas localmente, só na fase de auth).
- Remove o conceito de `workspace`/multi-tenant (schema, guards, invitations).
- `googleapis` (Google Calendar) era específico da clínica — sem uso conhecido no ai-financial; remover até que apareça uma necessidade real (ex: lembrete de vencimento no calendário — fase futura).

## 7. Roadmap por fases

| Fase | Escopo | Depende de |
| --- | --- | --- |
| **0** | Limpeza do scaffold: remover domínio de clínica (schema, rotas, docs), corrigir `docker-compose.yml`, reescrever `README.md`/`CONTRIBUTING.md`/`AGENTS.md`/`CLAUDE.md` para o domínio financeiro, criar usuário de dev fixo (sem auth ainda) | — |
| **1** | Contas, categorias, transações, transferências, status e recorrências — o núcleo do produto | Fase 0 |
| **2** | Cartões de crédito, faturas, compras parceladas + orçamento mensal por categoria | Fase 1 |
| **3** | Financiamentos/empréstimos com tabela de parcelas | Fase 1 |
| **4** | Investimentos (carteira, aportes, valor manual) | Fase 1 |
| **5** | Metas de economia + bens (patrimônio) | Fase 1 |
| **6** | Dashboard e relatórios (patrimônio líquido, saldo atual/projetado, próximos vencimentos, fluxo de caixa, gráficos) | Fases 1–5 |
| **7** | Autenticação embutida (baseada em `ai-book`/`better-auth`) + perfil com foto (Cloudinary) | Fases 1–6 concluídas |
| **8** *(futuro)* | Importação de extrato (CSV/OFX) | Fase 7 |
| **9** *(futuro)* | Open Finance, notificações/alertas, cotação automática de investimentos | Fase 8 |

### 7.1 Organização funcional sugerida da interface

```text
AI Financial
│
├── Dashboard
│   ├── Patrimônio líquido
│   ├── Saldo atual
│   ├── Saldo projetado
│   ├── Receitas x despesas
│   ├── Gastos por categoria
│   └── Próximos vencimentos
│
├── Transações
│   ├── Receitas
│   ├── Despesas
│   ├── Transferências
│   └── Recorrências
│
├── Contas
│   ├── Conta corrente
│   ├── Poupança
│   └── Dinheiro
│
├── Cartões
│   ├── Cartões
│   ├── Faturas
│   └── Compras parceladas
│
├── Planejamento
│   ├── Orçamentos
│   ├── Contas a pagar
│   ├── Contas a receber
│   └── Metas
│
├── Patrimônio
│   ├── Investimentos
│   ├── Bens
│   └── Financiamentos
│
└── Relatórios
    ├── Fluxo de caixa
    ├── Categorias
    ├── Evolução patrimonial
    └── Orçado x realizado
```

Essa estrutura é referência de produto/UX, não uma obrigação de rotas ou módulos técnicos.

## 8. Limpeza do scaffold (checklist da Fase 0)

Trabalho de implementação, não deste doc, mas registrado aqui para não se perder:

- [ ] Remover `api/src/db/schema/{patients,appointments,medical-record-*,waiting-list,specialties,charges,calendar-*,message-*,workspace-*}.ts` e tudo que referenciar essas tabelas
- [ ] Remover `api/src/http/plugins/remote-auth.ts`, `api/src/http/helpers/{fetch-auth-user,assert-workspace-member,assert-workspace-owner}.ts`
- [ ] Remover dependências não usadas: `@aiandrameira/api-auth`, `@aiandrameira/ai-auth` (API e web), `googleapis` (a menos que já se saiba que Google Calendar volta cedo)
- [ ] Corrigir `docker-compose.yml`: `financialcheck` → `healthcheck`, `service_financial` → `service_healthy`, revisar nomes de container/rede
- [ ] Reescrever `README.md` (está vazio) com visão geral, instalação, scripts
- [ ] Reescrever `CONTRIBUTING.md`: tirar todas as referências a `ai-auth` remoto e ao domínio de clínica (tabela de "Projetos" na seção Arquitetura, seção "Autenticação e autorização")
- [ ] Atualizar `api/AGENTS.md`, `api/CLAUDE.md`, `web/AGENTS.md` (referências a "identity & auth" delegada a `ai-auth` remoto ficam desatualizadas)
- [ ] Gerar o app Angular real em `web/apps/` (hoje a pasta existe mas está vazia)
- [ ] Criar seed de usuário de desenvolvimento + categorias padrão
- [ ] Definir `DEV_USER_ID` estável e usar `user_id` desde o primeiro schema financeiro

## 9. Próximos passos

1. Revisar este documento e ajustar o que não bater com a intenção real.
2. Executar a Fase 0 (limpeza do scaffold).
3. Modelar o schema Drizzle da Fase 1 (`accounts`, `categories`, `transactions`, `transfers`, `recurrences`) já com `user_id`, status e regras de saldo/projeção, seguindo `api/.agents/skills/architecture/SKILL.md`.
4. Gerar o app Angular em `web/apps/` e ligar o primeiro fluxo end-to-end (listar/criar transação).

## 10. Histórico de revisões

**2026-08-13 — refinamento de domínio pré-Fase 1**

- Transferências como movimentação vinculada entre contas, fora dos totais de receita/despesa.
- Status de transação (`planned/pending/completed/cancelled`) para saldo atual vs. projetado.
- Recorrência como entidade própria, independente das ocorrências geradas.
- Cartão de crédito separado de conta, com fatura e parcelamento (`installment_group_id`) próprios.
- `user_id` em todas as entidades desde a Fase 1, evitando migração transversal na Fase 7.
- Investimentos divididos em `investment_assets` (dado estático) + `investment_movements` + `investment_prices` (histórico, já preparado para cotação automática).
- Progresso de metas derivado de `goal_contributions`, não um campo editável.
- Entidade `assets` (bens) para o patrimônio líquido refletir corretamente financiamentos com contrapartida (imóvel, veículo).
- Contas a pagar/receber como visão sobre transações futuras, sem tabela própria.
- Seção 7.1 com organização funcional sugerida da interface, como referência de produto.
