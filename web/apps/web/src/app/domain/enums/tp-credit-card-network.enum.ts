export enum tpCreditCardNetworkEnum {
    VISA = "visa",
    MASTERCARD = "mastercard",
    ELO = "elo",
    AMEX = "amex",
    OTHER = "other",
}

export const tpCreditCardNetworkMap = new Map<tpCreditCardNetworkEnum, string>([
    [tpCreditCardNetworkEnum.VISA, "Visa"],
    [tpCreditCardNetworkEnum.MASTERCARD, "Mastercard"],
    [tpCreditCardNetworkEnum.ELO, "Elo"],
    [tpCreditCardNetworkEnum.AMEX, "Amex"],
    [tpCreditCardNetworkEnum.OTHER, "Outra"],
]);
