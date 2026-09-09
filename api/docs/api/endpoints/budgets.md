---
title: Orçamento
description: Endpoints, parâmetros, bodies e respostas de orçamento mensal por categoria.
order: 19
---

# Orçamento

## 1. Cadastrar orçamento

::http-method[POST] `/budgets`

### Regras de negócio

- só é permitido para categorias de despesa;
- um orçamento por categoria e mês — tentar cadastrar de novo para o mesmo par retorna `409 Conflict`.

```json
{ "categoryId": "019...", "referenceMonth": "2026-09-01", "plannedAmount": 800 }
```

## 2. Listar orçamentos

::http-method[GET] `/budgets`

Filtros: `categoryId`, `referenceMonth`. Cada item inclui `realizedAmount` — soma das transações de despesa `completed` daquela categoria no mês, calculada na hora, nunca armazenada.

## 3. Obter orçamento

::http-method[GET] `/budgets/:id`

## 4. Atualizar orçamento

::http-method[PUT] `/budgets/:id`

Só o `plannedAmount` pode ser alterado — categoria e mês são fixos após o cadastro.

## 5. Excluir orçamento

::http-method[DELETE] `/budgets/:id`
