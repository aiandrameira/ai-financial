import { z } from "zod"

import { isValidCursor } from "../cursor"

export const paginationQuerySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    size: z.coerce.number().int().min(1).max(100).default(10),
})

export type PaginationParams = z.infer<typeof paginationQuerySchema>

export const listQuerySchema = z.object({
    query: z.string().optional(),
})

export type ListQueryParams = z.infer<typeof listQuerySchema>

const cursorSchema = z.string().min(1).refine(isValidCursor, { message: "Invalid cursor" })

export const cursorPaginationQuerySchema = z.object({
    query: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    cursor: cursorSchema.optional(),
    includeTotal: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .default(false),
})

export type CursorPaginationParams = z.infer<typeof cursorPaginationQuerySchema>
