import { z } from "zod";

export const cursorFilterSchema = z.object({
    query: z.string().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    cursor: z.string().optional(),
    includeTotal: z.boolean().optional(),
});
