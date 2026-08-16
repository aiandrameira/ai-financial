import type { AiIconType } from "@aiandralves/ai-ui";
import { stLoanInstallmentEnum, tpLoanEnum, tpLoanMap } from "@domain/enums";
import type { BadgeVariant } from "@domain/types";

export const LOAN_TYPE_ICONS: Record<tpLoanEnum, AiIconType> = {
    [tpLoanEnum.REAL_ESTATE]: "home",
    [tpLoanEnum.VEHICLE]: "car",
    [tpLoanEnum.PERSONAL]: "user",
    [tpLoanEnum.CONSORTIUM]: "group-2",
};

export const LOAN_TYPES: { value: tpLoanEnum; label: string; icon: AiIconType }[] = Array.from(tpLoanMap, ([value, label]) => ({
    value,
    label,
    icon: LOAN_TYPE_ICONS[value],
}));

export const LOAN_INSTALLMENT_STATUS_VARIANT: Record<stLoanInstallmentEnum, BadgeVariant> = {
    [stLoanInstallmentEnum.PENDING]: "info",
    [stLoanInstallmentEnum.PAID]: "success",
    [stLoanInstallmentEnum.LATE]: "destructive",
};
