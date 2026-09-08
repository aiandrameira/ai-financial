import { z } from "zod"

import { cursorPaginationQuerySchema } from "@/http/api/schema/schemas"

import { tpAssetEnum } from "../../domain/enums"

export const createAssetSchema = z.object({
    name: z.string().min(1).max(120),
    type: z.enum(tpAssetEnum),
    purchaseValue: z.number().positive(),
    currentValue: z.number().positive(),
    acquiredAt: z.coerce.date(),
})

export type CreateAssetSchema = z.infer<typeof createAssetSchema>

export const updateAssetSchema = createAssetSchema

export type UpdateAssetSchema = z.infer<typeof updateAssetSchema>

export const findAssetsQuerySchema = cursorPaginationQuerySchema

export type FindAssetsQuery = z.infer<typeof findAssetsQuerySchema>
