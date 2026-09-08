import { z } from "zod"

import { cursorPaginationQuerySchema } from "@/http/api/schema/schemas"

import { tpLoanEnum } from "../../domain/enums"

export const createLoanSchema = z.object({
    name: z.string().min(1).max(120),
    type: z.enum(tpLoanEnum),
    principalAmount: z.number().positive(),
    interestRate: z.number().min(0),
    installmentsTotal: z.number().int().min(1).max(600),
    startDate: z.coerce.date(),
    accountId: z.string().min(1),
})

export type CreateLoanSchema = z.infer<typeof createLoanSchema>

export const updateLoanSchema = z.object({
    name: z.string().min(1).max(120),
    type: z.enum(tpLoanEnum),
    accountId: z.string().min(1),
})

export type UpdateLoanSchema = z.infer<typeof updateLoanSchema>

export const findLoansQuerySchema = cursorPaginationQuerySchema

export type FindLoansQuery = z.infer<typeof findLoansQuerySchema>

export const findLoanInstallmentsQuerySchema = cursorPaginationQuerySchema

export type FindLoanInstallmentsQuery = z.infer<typeof findLoanInstallmentsQuerySchema>

export const payLoanInstallmentSchema = z.object({
    paidAt: z.coerce.date().optional(),
})

export type PayLoanInstallmentSchema = z.infer<typeof payLoanInstallmentSchema>
