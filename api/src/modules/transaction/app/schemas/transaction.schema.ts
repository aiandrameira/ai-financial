import { z } from "zod"

import { paginationQuerySchema } from "@/http/api/schema/schemas"

const recurrenceInputSchema = z.object({
    frequency: z.enum(["daily", "weekly", "monthly", "yearly"]),
    interval: z.number().int().positive().default(1),
    endDate: z.coerce.date().optional(),
})

export type RecurrenceInputSchema = z.infer<typeof recurrenceInputSchema>

const baseTransactionSchema = z.object({
    accountId: z.string().min(1),
    categoryId: z.string().min(1).optional(),
    type: z.enum(["income", "expense"]),
    status: z.enum(["planned", "pending", "completed", "cancelled"]).default("completed"),
    amount: z.number().positive(),
    description: z.string().max(280).optional(),
    date: z.coerce.date(),
    tags: z.array(z.string().max(40)).default([]),
    attachmentUrl: z.url().optional(),
})

export const createTransactionSchema = baseTransactionSchema.extend({
    recurrence: recurrenceInputSchema.optional(),
})

export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>

export const updateTransactionSchema = baseTransactionSchema.partial()

export type UpdateTransactionSchema = z.infer<typeof updateTransactionSchema>

export const createTransferSchema = z.object({
    sourceAccountId: z.string().min(1),
    destinationAccountId: z.string().min(1),
    amount: z.number().positive(),
    description: z.string().max(280).optional(),
    date: z.coerce.date(),
    status: z.enum(["planned", "pending", "completed", "cancelled"]).default("completed"),
})

export type CreateTransferSchema = z.infer<typeof createTransferSchema>

export const findTransactionsQuerySchema = paginationQuerySchema.extend({
    accountId: z.string().optional(),
    categoryId: z.string().optional(),
    status: z.enum(["planned", "pending", "completed", "cancelled"]).optional(),
    type: z.enum(["income", "expense", "transfer"]).optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional(),
})

export type FindTransactionsQuery = z.infer<typeof findTransactionsQuerySchema>
