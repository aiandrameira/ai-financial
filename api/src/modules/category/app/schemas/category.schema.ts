import { z } from "zod"

export const createCategorySchema = z.object({
    name: z.string().min(1).max(120),
    type: z.enum(["income", "expense"]),
    parentId: z.string().min(1).optional(),
    icon: z.string().max(60).optional(),
    color: z.string().max(40).optional(),
})

export type CreateCategorySchema = z.infer<typeof createCategorySchema>

export const updateCategorySchema = createCategorySchema.partial()

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>
