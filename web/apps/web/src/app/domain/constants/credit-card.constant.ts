import type { AiIconType } from "@aiandralves/ai-ui";
import { stInvoiceEnum, tpCreditCardNetworkEnum, tpCreditCardNetworkMap } from "@domain/enums";
import type { BadgeVariant } from "@domain/types";

export const CREDIT_CARD_ICONS: AiIconType[] = ["bank-card", "bank", "wallet", "money-dollar-circle", "shield-check", "safe"];

export const CREDIT_CARD_NETWORKS: { value: tpCreditCardNetworkEnum; label: string }[] = Array.from(tpCreditCardNetworkMap, ([value, label]) => ({ value, label }));

export const INVOICE_STATUS_VARIANT: Record<stInvoiceEnum, BadgeVariant> = {
    [stInvoiceEnum.OPEN]: "info",
    [stInvoiceEnum.CLOSED]: "warning",
    [stInvoiceEnum.PAID]: "success",
};
