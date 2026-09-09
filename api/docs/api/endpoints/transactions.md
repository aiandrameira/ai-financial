---
title: Transações, transferências e recorrências
description: Endpoints, parâmetros, bodies e respostas de transações, transferências e contas fixas.
order: 16
---

# Transações, transferências e recorrências

## 1. Listar transações

::http-method[GET] `/transactions`

Filtros suportados: `accountId`, `invoiceId`, `categoryId`, `status`, `type`, `dateFrom`, `dateTo`, além de `query`/`limit`/`cursor`/`includeTotal`.

## 2. Obter transação

::http-method[GET] `/transactions/:id`

## 3. Cadastrar transação

::http-method[POST] `/transactions`

### Regras de negócio

- `type` é `income` ou `expense` (`transfer` é criado por [`POST /transactions/transfer`](#6-cadastrar-transferencia), não aqui);
- `status` padrão é `completed`; use `planned` para lançar algo que ainda vai acontecer (ex.: uma conta a pagar);
- `installments` (2 a 48) parcela a transação — só faz sentido para despesas em cartão de crédito, criando um `installment_group` e uma transação por parcela;
- `recurrence` opcional transforma a transação em uma **conta fixa**: cria uma `Recurrence` e liga essa transação como o "molde" das próximas ocorrências.

### Corpo da requisição

```json
{
  "accountId": "019...",
  "categoryId": "019...",
  "type": "expense",
  "amount": 150.9,
  "description": "Supermercado",
  "date": "2026-09-05",
  "tags": ["essencial"]
}
```

Com recorrência (conta fixa mensal):

```json
{
  "accountId": "019...",
  "categoryId": "019...",
  "type": "expense",
  "amount": 89.9,
  "description": "Streaming",
  "date": "2026-09-05",
  "recurrence": { "frequency": "monthly", "interval": 1 }
}
```

### Resposta — 201 Created

```json
{
  "data": { "id": "019...", "status": "completed", "amount": "-150.90" },
  "meta": { "message": "Transaction created", "status": 201, "type": "success" }
}
```

## 4. Atualizar transação

::http-method[PUT] `/transactions/:id`

Todos os campos são opcionais. Usado tanto para editar dados quanto para **marcar uma conta fixa como paga** (`{ "status": "completed" }`).

## 5. Excluir transação

::http-method[DELETE] `/transactions/:id`

Se a transação pertencer a um parcelamento (`installmentGroupId`), todas as parcelas vinculadas são excluídas juntas.

## 6. Cadastrar transferência

::http-method[POST] `/transactions/transfer`

Cria, de forma atômica, duas transações ligadas (saída na conta de origem, entrada na conta de destino) e o registro de `Transfer`.

```json
{
  "sourceAccountId": "019...",
  "destinationAccountId": "019...",
  "amount": 500,
  "date": "2026-09-05",
  "method": "pix"
}
```

## 7. Excluir transferência

::http-method[DELETE] `/transactions/transfer/:transferId`

Exclui as duas transações vinculadas e o registro de `Transfer` juntos.

## 8. Gerar ocorrências de recorrência devidas

::http-method[POST] `/transactions/recurrences/generate`

Materializa a próxima ocorrência de cada recorrência ativa cuja `nextOccurrence` já chegou, com `status: planned`. Roda automaticamente uma vez por dia (job `generate-due-recurrences`); esta rota é o disparo manual, útil para testar sem esperar o agendamento.

::: warning
Recorrências vinculadas a cartão de crédito (sem `accountId`) ou a transferências são ignoradas na geração — o suporte hoje cobre transações de conta.
:::
