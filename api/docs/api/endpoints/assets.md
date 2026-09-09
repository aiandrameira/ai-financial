---
title: Bens
description: Endpoints, parâmetros, bodies e respostas de bens (patrimônio).
order: 23
---

# Bens

Bens (`assets`) representam patrimônio fora do fluxo de transações — um imóvel ou veículo, por exemplo — usados para compor o patrimônio líquido junto com contas, investimentos e dívidas.

## 1. Cadastrar bem

::http-method[POST] `/assets`

```json
{
  "name": "Apartamento",
  "type": "real_estate",
  "purchaseValue": 350000,
  "currentValue": 380000,
  "acquiredAt": "2023-01-15"
}
```

`type` é `real_estate`, `vehicle` ou `other`.

## 2. Listar bens

::http-method[GET] `/assets`

## 3. Obter bem

::http-method[GET] `/assets/:id`

## 4. Atualizar bem

::http-method[PUT] `/assets/:id`

Use para atualizar `currentValue` conforme o bem se valoriza ou deprecia.

## 5. Excluir bem

::http-method[DELETE] `/assets/:id`
