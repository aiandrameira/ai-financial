import { NotFoundError } from "@/http/errors/errors"

import type { UpdateCategorySchema } from "../schemas"
import type { CategoryRepository } from "../../domain/repositories"

export class UpdateCategoryUseCase {
    constructor(private repository: CategoryRepository) {}

    async execute(userId: string, id: string, body: UpdateCategorySchema): Promise<void> {
        const category = await this.repository.get(userId, id)
        if (!category) throw new NotFoundError("Category not found")
        await this.repository.update(userId, id, body)
    }
}
