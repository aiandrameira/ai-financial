export enum tpInvestmentEnum {
    FIXED_INCOME = "fixed_income",
    STOCK = "stock",
    REIT = "reit",
    TREASURY = "treasury",
    CRYPTO = "crypto",
    FUND = "fund",
}

export const tpInvestmentMap = new Map<tpInvestmentEnum, string>([
    [tpInvestmentEnum.FIXED_INCOME, "Renda fixa"],
    [tpInvestmentEnum.STOCK, "Ação"],
    [tpInvestmentEnum.REIT, "Fundo imobiliário"],
    [tpInvestmentEnum.TREASURY, "Tesouro direto"],
    [tpInvestmentEnum.CRYPTO, "Criptomoeda"],
    [tpInvestmentEnum.FUND, "Fundo de investimento"],
]);
