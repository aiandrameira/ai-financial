import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { CategoryDto } from "../../app/dtos/category.dto"
import type { CreateCategorySchema, UpdateCategorySchema } from "../../app/schemas/category.schema"

export interface CategoryRepository {
    find(userId: string, params: PaginationParams): Promise<IPaginated<CategoryDto>>
    get(userId: string, id: string): Promise<CategoryDto | null>
    create(userId: string, body: CreateCategorySchema): Promise<CategoryDto>
    update(userId: string, id: string, body: UpdateCategorySchema): Promise<void>
    delete(userId: string, id: string): Promise<void>
}

export type { CategoryDto }
