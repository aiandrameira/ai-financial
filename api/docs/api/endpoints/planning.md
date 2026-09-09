---
title: Planejamento (renda e painel)
description: Endpoints, parâmetros, bodies e respostas da renda mensal e do painel de planejamento.
order: 24
---

# Planejamento

Dois módulos pequenos e sem tela própria de cadastro: `financial-settings` guarda a renda mensal (uma linha por usuário) e `financial-plan` só **agrega**, em memória, dados que já existem em outros módulos — não tem tabela própria.

## Renda mensal

### 1. Obter renda mensal

::http-method[GET] `/financial-settings`

Se o usuário nunca configurou, retorna `monthlyIncome: "0.00"` (não cria linha nenhuma até o primeiro `PUT`).

### 2. Atualizar renda mensal

::http-method[PUT] `/financial-settings`

Upsert — cria a linha na primeira vez, atualiza nas seguintes.

```json
{ "monthlyIncome": 6000 }
```

## Painel de planejamento

### 3. Obter o painel

::http-method[GET] `/financial-plan`

### Regras de negócio

- `fixedExpenses`: soma das transações de despesa não canceladas do mês corrente;
- `debts`: financiamentos com saldo devedor maior que zero, cada um com a próxima parcela em aberto (`nextInstallmentAmount`/`nextInstallmentDueDate`);
- `goals`: metas de economia ainda não atingidas (`remainingAmount > 0`);
- `surplus = monthlyIncome − fixedExpenses − soma das próximas parcelas de dívida`;
- **não sugere divisão** entre dívidas e metas — só os números; a decisão de alocação é do usuário.

### Resposta — 200 OK

```json
{
  "data": {
    "monthlyIncome": "6000.00",
    "fixedExpenses": "1200.00",
    "surplus": "3300.00",
    "debts": [
      {
        "id": "019...",
        "name": "Financiamento do carro",
        "outstandingBalance": "28000.00",
        "nextInstallmentAmount": "700.00",
        "nextInstallmentDueDate": "2026-10-01T00:00:00.000Z"
      }
    ],
    "goals": [
      { "id": "019...", "name": "Reforma", "targetAmount": "20000.00", "remainingAmount": 15000, "progressPercent": 25, "targetDate": "2027-06-01T00:00:00.000Z" }
    ]
  },
  "meta": { "message": "OK", "status": 200, "type": "success" }
}
```
