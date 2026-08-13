import { NotFoundError } from "@/http/errors/errors"

import type { CategoryDto } from "../dtos/category.dto"
import type { CategoryRepository } from "../../domain/repositories/category.repository"

export class GetCategoryUseCase {
    constructor(private repository: CategoryRepository) {}

    async execute(userId: string, id: string): Promise<CategoryDto> {
        const category = await this.repository.get(userId, id)
        if (!category) throw new NotFoundError("Category not found")
        return category
    }
}
