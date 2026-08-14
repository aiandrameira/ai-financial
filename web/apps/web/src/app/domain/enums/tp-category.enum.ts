export enum tpCategoryEnum {
    INCOME = "income",
    EXPENSE = "expense",
}

export const tpCategoryMap = new Map<tpCategoryEnum, string>([
    [tpCategoryEnum.INCOME, "Receita"],
    [tpCategoryEnum.EXPENSE, "Despesa"],
]);
