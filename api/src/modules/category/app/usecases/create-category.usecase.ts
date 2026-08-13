import { ValidationError } from "@/http/errors/errors"

import type { CategoryDto } from "../dtos"
import type { CreateCategorySchema } from "../schemas"
import type { CategoryRepository } from "../../domain/repositories"

export class CreateCategoryUseCase {
    constructor(private repository: CategoryRepository) {}

    async execute(userId: string, body: CreateCategorySchema): Promise<CategoryDto> {
        if (body.parentId) {
            const parent = await this.repository.get(userId, body.parentId)
            if (!parent) throw new ValidationError("Parent category not found")
            if (parent.type !== body.type) throw new ValidationError("Parent category must have the same type")
        }

        return this.repository.create(userId, body)
    }
}
