import { z } from "zod";

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
