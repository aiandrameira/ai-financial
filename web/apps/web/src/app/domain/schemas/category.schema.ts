import { z } from "zod";
import { cursorFilterSchema } from "./cursor-filter.schema";

import { tpCategoryEnum } from "../enums";

export const requestCategorySchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    name: z.string().min(2, "O nome precisa ter no mínimo 2 caracteres.").default(""),
    type: z.enum(tpCategoryEnum).default(tpCategoryEnum.EXPENSE),
    parentId: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
});

export type RequestCategoryDto = z.infer<typeof requestCategorySchema>;

export function makeRequestCategory(raw: Partial<RequestCategoryDto> = {}): RequestCategoryDto {
    return requestCategorySchema.parse(raw);
}

export const categorySchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    type: z.enum(tpCategoryEnum),
    parentId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type CategoryDto = z.infer<typeof categorySchema>;

export const categoryFilterSchema = cursorFilterSchema.extend({
    sortBy: z.enum(["name", "type", "createdAt"]).optional(),
    sortDirection: z.enum(["asc", "desc"]).optional(),
});
export type CategoryFilterDto = z.infer<typeof categoryFilterSchema>;

export function makeCategoryFilter(raw: Partial<CategoryFilterDto> = {}): CategoryFilterDto {
    return categoryFilterSchema.parse(raw);
}
