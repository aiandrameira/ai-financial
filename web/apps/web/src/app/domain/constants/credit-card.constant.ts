import { stInvoiceEnum, tpCreditCardNetworkEnum } from "@domain/enums";
import type { BadgeVariant } from "@domain/types";

export const CREDIT_CARD_NETWORKS = Object.values(tpCreditCardNetworkEnum);

export const INVOICE_STATUS_VARIANT: Record<stInvoiceEnum, BadgeVariant> = {
    [stInvoiceEnum.OPEN]: "info",
    [stInvoiceEnum.CLOSED]: "warning",
    [stInvoiceEnum.PAID]: "success",
};
