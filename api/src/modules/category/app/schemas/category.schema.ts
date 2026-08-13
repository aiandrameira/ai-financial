import { z } from "zod"

import { tpCategoryEnum } from "../../domain/enums/tp-category.enum"

export const createCategorySchema = z.object({
    name: z.string().min(1).max(120),
    type: z.enum(tpCategoryEnum),
    parentId: z.string().min(1).optional(),
    icon: z.string().max(60).optional(),
    color: z.string().max(40).optional(),
})

export type CreateCategorySchema = z.infer<typeof createCategorySchema>

export const updateCategorySchema = createCategorySchema.partial()

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>
