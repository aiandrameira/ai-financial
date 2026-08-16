export enum tpInvestmentMovementEnum {
    BUY = "buy",
    SELL = "sell",
    DIVIDEND = "dividend",
    CONTRIBUTION = "contribution",
    WITHDRAWAL = "withdrawal",
}

export const tpInvestmentMovementMap = new Map<tpInvestmentMovementEnum, string>([
    [tpInvestmentMovementEnum.BUY, "Compra"],
    [tpInvestmentMovementEnum.SELL, "Venda"],
    [tpInvestmentMovementEnum.DIVIDEND, "Dividendo"],
    [tpInvestmentMovementEnum.CONTRIBUTION, "Aporte"],
    [tpInvestmentMovementEnum.WITHDRAWAL, "Resgate"],
]);
