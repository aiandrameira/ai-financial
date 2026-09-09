---
title: Cartões de crédito e faturas
description: Endpoints, parâmetros, bodies e respostas de cartões e faturas.
order: 18
---

# Cartões de crédito e faturas

## Cartões

### 1. Cadastrar cartão

::http-method[POST] `/credit-cards`

```json
{
  "name": "Cartão principal",
  "accountId": "019...",
  "limitAmount": 5000,
  "closingDay": 20,
  "dueDay": 28,
  "network": "visa"
}
```

`accountId` é a conta usada para pagar a fatura. `closingDay`/`dueDay` definem em qual mês uma compra cai e quando a fatura vence.

### 2. Listar cartões

::http-method[GET] `/credit-cards`

### 3. Obter cartão

::http-method[GET] `/credit-cards/:id`

### 4. Atualizar cartão

::http-method[PUT] `/credit-cards/:id`

### 5. Arquivar cartão

::http-method[POST] `/credit-cards/:id/archive`

### 6. Restaurar cartão arquivado

::http-method[POST] `/credit-cards/:id/restore`

## Faturas

Faturas não são cadastradas manualmente — surgem conforme compras são lançadas no cartão, e a rota "atual" cria a fatura em aberto do mês se ela ainda não existir.

### 7. Listar faturas do cartão

::http-method[GET] `/credit-cards/:id/invoices`

### 8. Obter ou criar a fatura em aberto

::http-method[GET] `/credit-cards/:id/invoices/current`

### 9. Obter fatura

::http-method[GET] `/credit-cards/:id/invoices/:invoiceId`

### 10. Pagar fatura

::http-method[POST] `/credit-cards/:id/invoices/:invoiceId/pay`

### Regras de negócio

- cria uma transação de despesa real na conta associada ao cartão (`accountId`), pelo valor total da fatura;
- marca a fatura como `paid`;
- uma fatura já paga retorna `409 Conflict`.

```json
{ "paidAt": "2026-09-28" }
```

`paidAt` é opcional; sem ele, usa a data/hora atual.
