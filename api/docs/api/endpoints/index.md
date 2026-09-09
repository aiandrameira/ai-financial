---
title: Endpoints e respostas
description: Convenções HTTP e índice da referência detalhada da API.
order: 14
---

# Endpoints e respostas

Cada página reúne método, rota, parâmetros, corpo JSON, resposta e regras de negócio do mesmo módulo.

## Informações gerais

- Base local: `http://localhost:3006`;
- não há autenticação ainda — toda rota opera sob `env.DEV_USER_ID` (veja [Identidade](../overview.md#identidade));
- identificadores são UUIDv7;
- cursores de paginação são opacos;
- valores monetários chegam e saem como string decimal (`"150.00"`), exceto no corpo de requisição, onde são `number`.

## Envelope padrão

Item:

```json
{
  "data": { "id": "019..." },
  "meta": { "message": "OK", "status": 200, "type": "success" }
}
```

Lista simples:

```json
{
  "data": [],
  "total": 0,
  "meta": { "message": "OK", "status": 200, "type": "success" }
}
```

Paginação por cursor:

```json
{
  "data": [],
  "pagination": { "limit": 20, "next": null, "prev": null, "total": 0 },
  "meta": { "message": "OK", "status": 200, "type": "success" }
}
```

Erro:

```json
{
  "data": null,
  "meta": { "message": "Resource not found", "status": 404, "type": "error" }
}
```

## Paginação e filtros

As listagens usam cursor opaco (UUIDv7). Não interprete o cursor: envie em uma nova requisição o valor recebido em `pagination.next` ou `pagination.prev`.

Parâmetros compartilhados:

| Parâmetro | Descrição |
| --- | --- |
| `query` | texto de pesquisa (quando o filtro suportar) |
| `limit` | quantidade por página (1 a 100; padrão 20) |
| `cursor` | cursor retornado pela API |
| `includeTotal=true` | solicita contagem total |

## Referência por módulo

- [Contas](./accounts.md)
- [Transações, transferências e recorrências](./transactions.md)
- [Categorias](./categories.md)
- [Cartões de crédito e faturas](./credit-cards.md)
- [Orçamento](./budgets.md)
- [Financiamentos](./loans.md)
- [Investimentos](./investments.md)
- [Metas de economia](./savings-goals.md)
- [Bens](./assets.md)
- [Planejamento (renda e painel)](./planning.md)

## Regras de negócio gerais

- valores derivados (saldo, realizado, saldo devedor, progresso, posição) são sempre calculados a partir das transações/movimentos — veja [Valores derivados não são fonte de verdade](../architecture.md#valores-derivados-nao-sao-fonte-de-verdade);
- arquivar (`archive`) é o padrão para "remover" contas e cartões — preserva o histórico de transações; exclusão (`delete`) é reservada a cadastros sem movimentação real (categorias, orçamentos, bens, ativos de investimento);
- pagar uma parcela (financiamento) ou fatura (cartão) sempre cria, na mesma operação, uma transação de despesa real na conta associada;
- uma parcela ou fatura já paga não pode ser paga de novo (`409 Conflict`).

## Status comuns

| Status | Significado |
| --- | --- |
| `200` | consulta ou alteração concluída |
| `201` | recurso criado |
| `400` | payload ou regra de negócio inválida (ex.: resgate maior que a posição atual) |
| `404` | recurso não encontrado |
| `409` | duplicidade ou estado incompatível (ex.: parcela já paga) |
| `500` | falha interna não tratada |
