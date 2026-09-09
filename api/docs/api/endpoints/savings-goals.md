---
title: Metas de economia
description: Endpoints, parâmetros, bodies e respostas de metas e aportes.
order: 22
---

# Metas de economia

## 1. Cadastrar meta

::http-method[POST] `/goals`

```json
{
  "name": "Reforma",
  "targetAmount": 20000,
  "targetDate": "2027-06-01",
  "linkedAccountId": "019..."
}
```

`targetDate` e `linkedAccountId` são opcionais.

## 2. Listar metas

::http-method[GET] `/goals`

Cada item traz `currentAmount`, `remainingAmount` e `progressPercent`, calculados a partir da soma dos aportes — nunca armazenados.

## 3. Obter meta

::http-method[GET] `/goals/:id`

## 4. Atualizar meta

::http-method[PUT] `/goals/:id`

## 5. Excluir meta

::http-method[DELETE] `/goals/:id`

Exclui em cascata todos os aportes.

## 6. Listar aportes

::http-method[GET] `/goals/:id/contributions`

## 7. Registrar aporte

::http-method[POST] `/goals/:id/contributions`

### Regras de negócio

- `transactionId` é opcional — vincula o aporte a uma transação real já existente (validada como pertencente ao usuário);
- ao atingir 100% do progresso, dispara uma notificação (via AI Flow, quando configurado) avisando que a meta foi alcançada.

```json
{ "amount": 500, "date": "2026-09-05" }
```

## 8. Excluir aporte

::http-method[DELETE] `/goals/:id/contributions/:contributionId`
