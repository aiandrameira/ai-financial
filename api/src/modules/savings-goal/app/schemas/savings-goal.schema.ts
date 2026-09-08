import { z } from "zod"

import { cursorPaginationQuerySchema } from "@/http/api/schema/schemas"

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

export const findSavingsGoalsQuerySchema = cursorPaginationQuerySchema

export type FindSavingsGoalsQuery = z.infer<typeof findSavingsGoalsQuerySchema>

export const createGoalContributionSchema = z.object({
    amount: z.number().positive(),
    date: z.coerce.date(),
    transactionId: z.string().min(1).optional(),
})

export type CreateGoalContributionSchema = z.infer<typeof createGoalContributionSchema>

export const findGoalContributionsQuerySchema = cursorPaginationQuerySchema

export type FindGoalContributionsQuery = z.infer<typeof findGoalContributionsQuerySchema>
