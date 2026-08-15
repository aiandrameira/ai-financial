export enum tpLoanEnum {
    REAL_ESTATE = "real_estate",
    VEHICLE = "vehicle",
    PERSONAL = "personal",
    CONSORTIUM = "consortium",
}

export const tpLoanMap = new Map<tpLoanEnum, string>([
    [tpLoanEnum.REAL_ESTATE, "Imóvel"],
    [tpLoanEnum.VEHICLE, "Veículo"],
    [tpLoanEnum.PERSONAL, "Pessoal"],
    [tpLoanEnum.CONSORTIUM, "Consórcio"],
]);
