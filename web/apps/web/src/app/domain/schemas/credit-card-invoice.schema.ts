import { z } from "zod";
import { cursorFilterSchema } from "./cursor-filter.schema";

import { stInvoiceEnum } from "../enums";

export const creditCardInvoiceSchema = z.object({
    id: z.string(),
    creditCardId: z.string(),
    referenceMonth: z.string(),
    closingDate: z.string(),
    dueDate: z.string(),
    status: z.enum(stInvoiceEnum),
    totalAmount: z.string(),
    paidAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type CreditCardInvoiceDto = z.infer<typeof creditCardInvoiceSchema>;

export const creditCardInvoiceFilterSchema = cursorFilterSchema;
export type CreditCardInvoiceFilterDto = z.infer<typeof creditCardInvoiceFilterSchema>;

export function makeCreditCardInvoiceFilter(raw: Partial<CreditCardInvoiceFilterDto> = {}): CreditCardInvoiceFilterDto {
    return creditCardInvoiceFilterSchema.parse(raw);
}
