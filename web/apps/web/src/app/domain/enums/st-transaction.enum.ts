export enum stTransactionEnum {
    PLANNED = "planned",
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export const stTransactionMap = new Map<stTransactionEnum, string>([
    [stTransactionEnum.PLANNED, "Previsto"],
    [stTransactionEnum.PENDING, "Pendente"],
    [stTransactionEnum.COMPLETED, "Concluído"],
    [stTransactionEnum.CANCELLED, "Cancelado"],
]);
