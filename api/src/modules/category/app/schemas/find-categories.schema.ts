import { z } from "zod"

import { cursorPaginationQuerySchema } from "@/http/api/schema/schemas"

import { CATEGORY_SORT_COLUMNS } from "../../domain/repositories"

export const findCategoriesQuerySchema = cursorPaginationQuerySchema.extend({
    sortBy: z.enum(CATEGORY_SORT_COLUMNS).default("name"),
    sortDirection: z.enum(["asc", "desc"]).default("asc"),
})

export type FindCategoriesQuerySchema = z.infer<typeof findCategoriesQuerySchema>
