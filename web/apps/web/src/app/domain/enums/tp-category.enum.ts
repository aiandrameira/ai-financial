export enum tpCategoryEnum {
    INCOME = "income",
    EXPENSE = "expense",
}

export const tpCategoryMap = new Map<tpCategoryEnum, string>([
    [tpCategoryEnum.INCOME, "Receita"],
    [tpCategoryEnum.EXPENSE, "Despesa"],
]);

export const tpCategoryTrendIconMap = new Map<tpCategoryEnum, string>([
    [tpCategoryEnum.INCOME, "trending_up"],
    [tpCategoryEnum.EXPENSE, "trending_down"],
]);
