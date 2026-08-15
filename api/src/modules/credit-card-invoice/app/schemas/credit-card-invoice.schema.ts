import { z } from "zod"

import { paginationQuerySchema } from "@/http/api/schema/schemas"

export const findCreditCardInvoicesQuerySchema = paginationQuerySchema

export type FindCreditCardInvoicesQuery = z.infer<typeof findCreditCardInvoicesQuerySchema>

export const payCreditCardInvoiceSchema = z.object({
    paidAt: z.coerce.date().optional(),
})

export type PayCreditCardInvoiceSchema = z.infer<typeof payCreditCardInvoiceSchema>
