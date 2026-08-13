export enum tpAccountEnum {
    CHECKING = "checking",
    SAVINGS = "savings",
    WALLET = "wallet",
}

export const tpAccountMap = new Map<tpAccountEnum, string>([
    [tpAccountEnum.CHECKING, "Conta corrente"],
    [tpAccountEnum.SAVINGS, "Poupança"],
    [tpAccountEnum.WALLET, "Carteira"],
]);
