export enum stLoanInstallmentEnum {
    PENDING = "pending",
    PAID = "paid",
    LATE = "late",
}

export const stLoanInstallmentMap = new Map<stLoanInstallmentEnum, string>([
    [stLoanInstallmentEnum.PENDING, "Pendente"],
    [stLoanInstallmentEnum.PAID, "Paga"],
    [stLoanInstallmentEnum.LATE, "Atrasada"],
]);
