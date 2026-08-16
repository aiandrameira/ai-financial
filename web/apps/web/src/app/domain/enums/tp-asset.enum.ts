export enum tpAssetEnum {
    REAL_ESTATE = "real_estate",
    VEHICLE = "vehicle",
    OTHER = "other",
}

export const tpAssetMap = new Map<tpAssetEnum, string>([
    [tpAssetEnum.REAL_ESTATE, "Imóvel"],
    [tpAssetEnum.VEHICLE, "Veículo"],
    [tpAssetEnum.OTHER, "Outro"],
]);
