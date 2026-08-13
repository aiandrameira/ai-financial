export enum tpTransactionEnum {
    INCOME = "income",
    EXPENSE = "expense",
    TRANSFER = "transfer",
}

export const tpTransactionMap = new Map<tpTransactionEnum, string>([
    [tpTransactionEnum.INCOME, "Receita"],
    [tpTransactionEnum.EXPENSE, "Despesa"],
    [tpTransactionEnum.TRANSFER, "Transferência"],
]);
