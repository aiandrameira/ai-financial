---
title: Financiamentos
description: Endpoints, parâmetros, bodies e respostas de financiamentos e suas parcelas.
order: 20
---

# Financiamentos

## 1. Cadastrar financiamento

::http-method[POST] `/loans`

### Regras de negócio

- `type` é `real_estate`, `vehicle`, `personal` ou `consortium`;
- ao cadastrar, a API já calcula e grava **toda a tabela de amortização** (sistema Price/França — parcelas de valor total constante, com proporção entre principal e juros mudando mês a mês), de forma atômica;
- depois de criado, os termos financeiros (`principalAmount`, `interestRate`, `installmentsTotal`, `startDate`) não podem mais ser alterados — só `name`, `type` e `accountId`.

```json
{
  "name": "Financiamento do carro",
  "type": "vehicle",
  "principalAmount": 30000,
  "interestRate": 0.0149,
  "installmentsTotal": 48,
  "startDate": "2026-09-01",
  "accountId": "019..."
}
```

### Resposta — 201 Created

```json
{
  "data": { "id": "019...", "name": "Financiamento do carro", "outstandingBalance": "30000.00" },
  "meta": { "message": "OK", "status": 201, "type": "success" }
}
```

## 2. Listar financiamentos

::http-method[GET] `/loans`

Cada item inclui `outstandingBalance` — o principal menos a soma do `principalPortion` das parcelas já pagas.

## 3. Obter financiamento

::http-method[GET] `/loans/:id`

## 4. Atualizar financiamento

::http-method[PUT] `/loans/:id`

Só `name`, `type` e `accountId` — os termos financeiros são imutáveis.

## 5. Excluir financiamento

::http-method[DELETE] `/loans/:id`

## 6. Listar parcelas

::http-method[GET] `/loans/:id/installments`

Cada parcela traz `amount`, `principalPortion`, `interestPortion` e `status` (`pending`, `paid` ou `late`, derivado de `paidAt`/`dueDate`).

## 7. Pagar parcela

::http-method[POST] `/loans/:id/installments/:installmentId/pay`

### Regras de negócio

- cria uma transação de despesa real na conta do financiamento, com o valor da parcela;
- marca `paidAt`;
- uma parcela já paga retorna `409 Conflict`.

```json
{ "paidAt": "2026-10-01" }
```

`paidAt` é opcional; sem ele, usa a data/hora atual.
