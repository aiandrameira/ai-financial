---
title: Contas
description: Endpoints, parâmetros, bodies e respostas de contas.
order: 15
---

# Contas

## 1. Cadastrar conta

::http-method[POST] `/accounts`

### Regras de negócio

- `type` é `checking` (corrente), `savings` (poupança) ou `wallet` (carteira/dinheiro);
- `initialBalance` é o saldo no momento do cadastro — o saldo atual e o projetado são somados a partir daí, nunca reescritos.

### Corpo da requisição

```json
{
  "name": "Conta principal",
  "type": "checking",
  "institution": "Banco Exemplo",
  "initialBalance": 1000,
  "color": "primary",
  "icon": "bank"
}
```

### Resposta — 201 Created

```json
{
  "data": {
    "id": "019...",
    "name": "Conta principal",
    "type": "checking",
    "currentBalance": "1000.00",
    "projectedBalance": "1000.00"
  },
  "meta": { "message": "OK", "status": 201, "type": "success" }
}
```

## 2. Listar contas

::http-method[GET] `/accounts`

Retorna, por conta, `currentBalance` (soma de transações `completed`) e `projectedBalance` (soma de `completed` + `planned` + `pending`) somados ao `initialBalance`.

## 3. Obter conta

::http-method[GET] `/accounts/:id`

## 4. Atualizar conta

::http-method[PUT] `/accounts/:id`

Todos os campos são opcionais (atualização parcial). `initialBalance` também pode ser corrigido aqui.

## 5. Arquivar conta

::http-method[POST] `/accounts/:id/archive`

Não exclui a conta nem suas transações — só marca `archivedAt` e ela deixa de aparecer nos seletores de novas transações.

## 6. Restaurar conta arquivada

::http-method[POST] `/accounts/:id/restore`

Limpa `archivedAt`.
