import { z } from "zod"

import { cursorPaginationQuerySchema } from "@/http/api/schema/schemas"

export const findCreditCardInvoicesQuerySchema = cursorPaginationQuerySchema

export type FindCreditCardInvoicesQuery = z.infer<typeof findCreditCardInvoicesQuerySchema>

export const payCreditCardInvoiceSchema = z.object({
    paidAt: z.coerce.date().optional(),
})

export type PayCreditCardInvoiceSchema = z.infer<typeof payCreditCardInvoiceSchema>
