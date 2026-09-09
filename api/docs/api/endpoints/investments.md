---
title: Investimentos
description: Endpoints, parâmetros, bodies e respostas de ativos, movimentos e preços de investimento.
order: 21
---

# Investimentos

## Ativos

### 1. Cadastrar ativo de investimento

::http-method[POST] `/investments`

```json
{ "name": "Tesouro Selic 2029", "type": "treasury", "broker": "Corretora Exemplo", "ticker": "" }
```

`type` é `fixed_income`, `stock`, `reit`, `treasury`, `crypto` ou `fund`.

### 2. Listar ativos

::http-method[GET] `/investments`

Cada item traz a **posição calculada**: quantidade, preço médio e valor investido (a partir dos movimentos) e valor atual/lucro ou perda (usando o preço manual mais recente).

### 3. Obter ativo

::http-method[GET] `/investments/:id`

### 4. Atualizar ativo

::http-method[PUT] `/investments/:id`

### 5. Excluir ativo

::http-method[DELETE] `/investments/:id`

Exclui em cascata todos os movimentos e o histórico de preço.

## Movimentos

### 6. Listar movimentos

::http-method[GET] `/investments/:id/movements`

### 7. Cadastrar movimento

::http-method[POST] `/investments/:id/movements`

### Regras de negócio

- `type` é `buy`, `sell`, `dividend`, `contribution` ou `withdrawal`;
- `buy`/`contribution` aumentam a posição; `sell`/`withdrawal` diminuem — e são rejeitados (`400`) se a quantidade pedida for maior que a posição atual.

```json
{ "type": "buy", "quantity": 100, "price": 10.5, "amount": 1050, "date": "2026-09-05" }
```

### 8. Excluir movimento

::http-method[DELETE] `/investments/:id/movements/:movementId`

## Preços

### 9. Listar histórico de preço

::http-method[GET] `/investments/:id/prices`

### 10. Adicionar cotação manual

::http-method[POST] `/investments/:id/prices`

Usado como referência de valor atual do ativo até existir uma fonte automática de cotação (fase futura).

```json
{ "price": 10.8, "referenceDate": "2026-09-05" }
```
