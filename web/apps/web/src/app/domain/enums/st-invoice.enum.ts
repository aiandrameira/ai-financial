export enum stInvoiceEnum {
    OPEN = "open",
    CLOSED = "closed",
    PAID = "paid",
}

export const stInvoiceMap = new Map<stInvoiceEnum, string>([
    [stInvoiceEnum.OPEN, "Aberta"],
    [stInvoiceEnum.CLOSED, "Fechada"],
    [stInvoiceEnum.PAID, "Paga"],
]);
