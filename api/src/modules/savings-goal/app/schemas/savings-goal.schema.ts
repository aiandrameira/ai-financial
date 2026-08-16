import { z } from "zod"

import { paginationQuerySchema } from "@/http/api/schema/schemas"

export const createSavingsGoalSchema = z.object({
    name: z.string().min(1).max(120),
    targetAmount: z.number().positive(),
    targetDate: z.coerce.date().optional(),
    icon: z.string().max(60).optional(),
    linkedAccountId: z.string().min(1).optional(),
})

export type CreateSavingsGoalSchema = z.infer<typeof createSavingsGoalSchema>

export const updateSavingsGoalSchema = createSavingsGoalSchema

export type UpdateSavingsGoalSchema = z.infer<typeof updateSavingsGoalSchema>

export const findSavingsGoalsQuerySchema = paginationQuerySchema

export type FindSavingsGoalsQuery = z.infer<typeof findSavingsGoalsQuerySchema>

export const createGoalContributionSchema = z.object({
    amount: z.number().positive(),
    date: z.coerce.date(),
    transactionId: z.string().min(1).optional(),
})

export type CreateGoalContributionSchema = z.infer<typeof createGoalContributionSchema>

export const findGoalContributionsQuerySchema = paginationQuerySchema.extend({
    size: z.coerce.number().int().min(1).max(300).default(10),
})

export type FindGoalContributionsQuery = z.infer<typeof findGoalContributionsQuerySchema>
