import { stLoanInstallmentEnum, tpLoanEnum } from "@domain/enums";
import type { BadgeVariant } from "@domain/types";

export const LOAN_TYPES = Object.values(tpLoanEnum);

export const LOAN_INSTALLMENT_STATUS_VARIANT: Record<stLoanInstallmentEnum, BadgeVariant> = {
    [stLoanInstallmentEnum.PENDING]: "info",
    [stLoanInstallmentEnum.PAID]: "success",
    [stLoanInstallmentEnum.LATE]: "destructive",
};
