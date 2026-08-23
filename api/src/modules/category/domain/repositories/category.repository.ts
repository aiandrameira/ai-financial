import type { ICursorPaginated } from "@/http/api/response"
import type { CursorPaginationParams } from "@/http/api/schema/schemas"

import type { CategoryDto } from "../../app/dtos"
import type { CreateCategorySchema, UpdateCategorySchema } from "../../app/schemas"

export const CATEGORY_SORT_COLUMNS = ["name", "type", "createdAt"] as const
export type CategorySortColumn = (typeof CATEGORY_SORT_COLUMNS)[number]

export interface FindCategoriesParams extends CursorPaginationParams {
    sortBy: CategorySortColumn
    sortDirection: "asc" | "desc"
}

export interface CategoryRepository {
    find(userId: string, params: FindCategoriesParams): Promise<ICursorPaginated<CategoryDto>>
    get(userId: string, id: string): Promise<CategoryDto | null>
    create(userId: string, body: CreateCategorySchema): Promise<CategoryDto>
    update(userId: string, id: string, body: UpdateCategorySchema): Promise<void>
    delete(userId: string, id: string): Promise<void>
}

export type { CategoryDto }
