---
title: Banco de dados
description: Tabelas, relacionamentos, migrations e diagrama ER do AI Financial.
order: 13
---

# Banco de dados

O AI Financial usa PostgreSQL com Drizzle ORM. Schemas ficam em `src/db/schema` e migrations em `src/db/migrations`.

## Diagrama ER

```mermaid
erDiagram
    ACCOUNTS ||--o{ TRANSACTIONS : movimenta
    ACCOUNTS ||--o{ CREDIT_CARDS : possui
    ACCOUNTS ||--o{ LOANS : paga_por
    ACCOUNTS ||--o{ SAVINGS_GOALS : vinculada_a
    CATEGORIES ||--o{ CATEGORIES : subcategoria_de
    CATEGORIES ||--o{ TRANSACTIONS : classifica
    CATEGORIES ||--o{ BUDGETS : orcada_em
    RECURRENCES ||--o{ TRANSACTIONS : gera
    TRANSACTIONS ||--o{ TRANSFERS : origem
    TRANSACTIONS ||--o{ TRANSFERS : destino
    CREDIT_CARDS ||--o{ CREDIT_CARD_INVOICES : fatura
    CREDIT_CARDS ||--o{ INSTALLMENT_GROUPS : parcelamento
    CREDIT_CARD_INVOICES ||--o{ TRANSACTIONS : contem
    INSTALLMENT_GROUPS ||--o{ TRANSACTIONS : contem
    LOANS ||--o{ LOAN_INSTALLMENTS : parcela
    SAVINGS_GOALS ||--o{ GOAL_CONTRIBUTIONS : recebe
    TRANSACTIONS ||--o{ GOAL_CONTRIBUTIONS : origina
    INVESTMENT_ASSETS ||--o{ INVESTMENT_MOVEMENTS : movimenta
    INVESTMENT_ASSETS ||--o{ INVESTMENT_PRICES : cotado_em

    ACCOUNTS {
        text id PK
        text user_id
        text name
        enum type "checking, savings, wallet"
        text institution
        numeric initial_balance
        text color
        text icon
        timestamp archived_at
    }

    CATEGORIES {
        text id PK
        text user_id
        text name
        enum type "income, expense"
        text parent_id FK
        text icon
        text color
    }

    TRANSACTIONS {
        text id PK
        text user_id
        text account_id FK
        text category_id FK
        enum type "income, expense, transfer"
        enum status "planned, pending, completed, cancelled"
        numeric amount
        text description
        timestamp date
        text_array tags
        text recurrence_id FK
        text transfer_id
        text invoice_id FK
        text installment_group_id FK
        integer installment_number
        text attachment_url
    }

    TRANSFERS {
        text id PK
        text user_id
        text source_transaction_id FK
        text destination_transaction_id FK
        enum method "transfer, pix"
    }

    RECURRENCES {
        text id PK
        text user_id
        enum frequency "daily, weekly, monthly, yearly"
        smallint interval
        date start_date
        date end_date
        date next_occurrence
        boolean active
    }

    CREDIT_CARDS {
        text id PK
        text user_id
        text name
        text account_id FK
        text institution
        numeric limit_amount
        integer closing_day
        integer due_day
        enum network "visa, mastercard, elo, amex, other"
        timestamp archived_at
    }

    CREDIT_CARD_INVOICES {
        text id PK
        text user_id
        text credit_card_id FK
        date reference_month
        timestamp closing_date
        timestamp due_date
        timestamp paid_at
    }

    INSTALLMENT_GROUPS {
        text id PK
        text user_id
        text credit_card_id FK
        text description
        numeric total_amount
        integer installments_total
        timestamp purchase_date
    }

    BUDGETS {
        text id PK
        text user_id
        text category_id FK
        date reference_month
        numeric planned_amount
    }

    LOANS {
        text id PK
        text user_id
        text name
        enum type "real_estate, vehicle, personal, consortium"
        numeric principal_amount
        numeric interest_rate
        integer installments_total
        timestamp start_date
        text account_id FK
    }

    LOAN_INSTALLMENTS {
        text id PK
        text user_id
        text loan_id FK
        integer number
        timestamp due_date
        numeric amount
        numeric principal_portion
        numeric interest_portion
        timestamp paid_at
    }

    SAVINGS_GOALS {
        text id PK
        text user_id
        text name
        numeric target_amount
        timestamp target_date
        text icon
        text linked_account_id FK
    }

    GOAL_CONTRIBUTIONS {
        text id PK
        text user_id
        text goal_id FK
        text transaction_id FK
        numeric amount
        timestamp date
    }

    ASSETS {
        text id PK
        text user_id
        text name
        enum type "real_estate, vehicle, other"
        numeric purchase_value
        numeric current_value
        timestamp acquired_at
    }

    INVESTMENT_ASSETS {
        text id PK
        text user_id
        text name
        enum type "fixed_income, stock, reit, treasury, crypto, fund"
        text broker
        text ticker
    }

    INVESTMENT_MOVEMENTS {
        text id PK
        text user_id
        text investment_id FK
        enum type "buy, sell, dividend, contribution, withdrawal"
        numeric quantity
        numeric price
        numeric amount
        timestamp date
    }

    INVESTMENT_PRICES {
        text id PK
        text user_id
        text investment_id FK
        numeric price
        timestamp reference_date
        enum source "manual, automatic"
    }

    FINANCIAL_SETTINGS {
        text user_id PK
        numeric monthly_income
        timestamp updated_at
    }
```

`PK` indica chave primária e `FK` chave estrangeira. Toda tabela carrega `user_id` (sem `FK` para uma tabela de usuários, já que a autenticação ainda não existe — veja [Identidade](./overview.md#identidade)). `FINANCIAL_SETTINGS` não aparece com relacionamento porque é lida por `user_id` diretamente, uma linha por usuário.

## Tabelas por domínio

| Domínio | Tabelas |
| --- | --- |
| contas e transações | `accounts`, `categories`, `transactions`, `transfers`, `recurrences` |
| cartão de crédito | `credit_cards`, `credit_card_invoices`, `installment_groups` |
| orçamento | `budgets` |
| financiamentos | `loans`, `loan_installments` |
| metas de economia | `savings_goals`, `goal_contributions` |
| investimentos | `investment_assets`, `investment_movements`, `investment_prices` |
| patrimônio | `assets` |
| planejamento | `financial_settings` |

## Pontos de atenção do schema

- **`transactions.transfer_id`** não tem `FK` declarada — evita referência circular, já que uma transferência (`transfers`) referencia duas transações, e cada uma dessas transações poderia querer apontar de volta para a transferência.
- **`transactions.installment_number`** existe sem um `installments_total` na própria linha — o total vive em `installment_groups.installments_total`, referenciado por `installment_group_id`.
- **`loan_installments`** guarda `principal_portion`/`interest_portion` separados por parcela (tabela de amortização Price/French pré-calculada na criação do financiamento) — o saldo devedor é a soma do `principal_portion` das parcelas ainda não pagas.
- **`goal_contributions.transaction_id`** é opcional — um aporte pode ser só um registro manual, sem transação real associada.

## Migrations

```bash
bun run db:generate
bun run db:migrate
bun run db:seed
bun run studio
```

::: warning
Não edite SQL gerado manualmente. Altere o schema Drizzle, gere a migration e revise o arquivo antes de aplicar.
:::
