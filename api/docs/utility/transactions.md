---
title: Transações, transferências e contas fixas
description: Como lançar transações, transferir entre contas e cadastrar contas fixas recorrentes.
order: 33
---

# Transações, transferências e contas fixas

![Tela de transações](../assets/img/list-transaction.png)

*Lista de transações, com badge de tipo e status.*

## Lançar uma transação

1. Selecione o botão de cadastrar.
2. Escolha **Tipo** (receita ou despesa).
3. Escolha a origem: **Conta** ou **Cartão**.
4. Se for conta, selecione a conta; se for cartão, selecione o cartão e, opcionalmente, o número de **parcelas** (parcelamento só existe para despesas em cartão).
5. Selecione a **Categoria**, informe **Valor**, **Data** e, se quiser, uma **Descrição**.
6. Selecione **Salvar**.

Uma transação de cartão entra automaticamente na fatura certa, com base no dia de fechamento cadastrado no cartão.

## Repetir automaticamente (conta fixa)

Disponível só para transações de **Conta** (não cartão) e só ao cadastrar uma transação nova (não em uma edição).

1. Ative **Repetir automaticamente**.
2. Escolha a **Frequência** (diária, semanal, mensal, anual) e **A cada** quantas unidades dessa frequência (ex.: a cada 2 meses).
3. Salve normalmente.

A próxima ocorrência é gerada automaticamente (uma vez por dia, em segundo plano) com status "Previsto". Acompanhe e marque como paga em **Planejamento → Contas fixas**.

## Transferir entre contas

1. Selecione **Nova transferência**.
2. Escolha a conta de origem e a de destino (precisam ser diferentes).
3. Informe **Valor**, **Data** e o método (Transferência ou Pix).
4. Selecione **Salvar**.

Uma transferência cria duas transações ligadas — saída na origem, entrada no destino — e as duas são excluídas juntas se você apagar a transferência.

## Editar e apagar

- editar uma transação normal só muda os dados dela;
- apagar uma transação parcelada apaga **todas** as parcelas daquele parcelamento — o app avisa antes de confirmar;
- apagar uma transferência apaga as duas pontas (origem e destino) junto com o registro da transferência.

## Filtrar e pesquisar

Use o campo de pesquisa (por descrição), e os filtros de conta, categoria, status, tipo e período, quando disponíveis na tela.
