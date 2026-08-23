import { z } from "zod"

import { cursorPaginationQuerySchema } from "@/http/api/schema/schemas"

import { CREDIT_CARD_SORT_COLUMNS } from "../../domain/repositories"

export const findCreditCardsQuerySchema = cursorPaginationQuerySchema.extend({
    sortBy: z.enum(CREDIT_CARD_SORT_COLUMNS).default("createdAt"),
    sortDirection: z.enum(["asc", "desc"]).default("asc"),
})

export type FindCreditCardsQuerySchema = z.infer<typeof findCreditCardsQuerySchema>
