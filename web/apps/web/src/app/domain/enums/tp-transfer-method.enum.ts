export enum tpTransferMethodEnum {
    TRANSFER = "transfer",
    PIX = "pix",
}

export const tpTransferMethodMap = new Map<tpTransferMethodEnum, string>([
    [tpTransferMethodEnum.TRANSFER, "Transferência"],
    [tpTransferMethodEnum.PIX, "Pix"],
]);
