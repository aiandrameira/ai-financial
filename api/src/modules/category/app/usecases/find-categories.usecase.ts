import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { CategoryDto } from "../dtos/category.dto"
import type { CategoryRepository } from "../../domain/repositories/category.repository"

export class FindCategoriesUseCase {
    constructor(private repository: CategoryRepository) {}

    async execute(userId: string, params: PaginationParams): Promise<IPaginated<CategoryDto>> {
        return this.repository.find(userId, params)
    }
}
