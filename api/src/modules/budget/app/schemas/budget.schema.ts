import { z } from "zod"

import { cursorPaginationQuerySchema } from "@/http/api/schema/schemas"

export const createBudgetSchema = z.object({
    categoryId: z.string().min(1),
    referenceMonth: z.coerce.date(),
    plannedAmount: z.number().positive(),
})

export type CreateBudgetSchema = z.infer<typeof createBudgetSchema>

export const updateBudgetSchema = z.object({
    plannedAmount: z.number().positive(),
})

export type UpdateBudgetSchema = z.infer<typeof updateBudgetSchema>

export const findBudgetsQuerySchema = cursorPaginationQuerySchema.extend({
    categoryId: z.string().optional(),
    referenceMonth: z.coerce.date().optional(),
})

export type FindBudgetsQuery = z.infer<typeof findBudgetsQuerySchema>
