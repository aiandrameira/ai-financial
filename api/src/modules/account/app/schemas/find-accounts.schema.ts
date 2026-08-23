import { z } from "zod"

import { cursorPaginationQuerySchema } from "@/http/api/schema/schemas"

import { ACCOUNT_SORT_COLUMNS } from "../../domain/repositories"

export const findAccountsQuerySchema = cursorPaginationQuerySchema.extend({
    sortBy: z.enum(ACCOUNT_SORT_COLUMNS).default("createdAt"),
    sortDirection: z.enum(["asc", "desc"]).default("asc"),
})

export type FindAccountsQuerySchema = z.infer<typeof findAccountsQuerySchema>
