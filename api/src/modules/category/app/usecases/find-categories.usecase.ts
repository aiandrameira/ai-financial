import type { ICursorPaginated } from "@/http/api/response"

import type { CategoryDto } from "../dtos"
import type { CategoryRepository, FindCategoriesParams } from "../../domain/repositories"

export class FindCategoriesUseCase {
    constructor(private repository: CategoryRepository) {}

    async execute(userId: string, params: FindCategoriesParams): Promise<ICursorPaginated<CategoryDto>> {
        return this.repository.find(userId, params)
    }
}
