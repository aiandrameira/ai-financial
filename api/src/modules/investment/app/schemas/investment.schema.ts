import { z } from "zod"

import { paginationQuerySchema } from "@/http/api/schema/schemas"

import { tpInvestmentEnum, tpInvestmentMovementEnum } from "../../domain/enums"

export const createInvestmentAssetSchema = z.object({
    name: z.string().min(1).max(120),
    type: z.enum(tpInvestmentEnum),
    broker: z.string().max(120).optional(),
    ticker: z.string().max(20).optional(),
})

export type CreateInvestmentAssetSchema = z.infer<typeof createInvestmentAssetSchema>

export const updateInvestmentAssetSchema = createInvestmentAssetSchema

export type UpdateInvestmentAssetSchema = z.infer<typeof updateInvestmentAssetSchema>

export const findInvestmentAssetsQuerySchema = paginationQuerySchema

export type FindInvestmentAssetsQuery = z.infer<typeof findInvestmentAssetsQuerySchema>

export const createInvestmentMovementSchema = z.object({
    type: z.enum(tpInvestmentMovementEnum),
    quantity: z.number().min(0).default(0),
    price: z.number().min(0).default(0),
    amount: z.number().positive(),
    date: z.coerce.date(),
})

export type CreateInvestmentMovementSchema = z.infer<typeof createInvestmentMovementSchema>

export const findInvestmentMovementsQuerySchema = paginationQuerySchema.extend({
    size: z.coerce.number().int().min(1).max(300).default(10),
})

export type FindInvestmentMovementsQuery = z.infer<typeof findInvestmentMovementsQuerySchema>

export const createInvestmentPriceSchema = z.object({
    price: z.number().positive(),
    referenceDate: z.coerce.date().optional(),
})

export type CreateInvestmentPriceSchema = z.infer<typeof createInvestmentPriceSchema>

export const findInvestmentPricesQuerySchema = paginationQuerySchema

export type FindInvestmentPricesQuery = z.infer<typeof findInvestmentPricesQuerySchema>
