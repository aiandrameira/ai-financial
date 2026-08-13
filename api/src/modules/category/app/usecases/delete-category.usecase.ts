import { ConflictError, NotFoundError } from "@/http/errors/errors"

import type { CategoryRepository } from "../../domain/repositories"

export class DeleteCategoryUseCase {
    constructor(private repository: CategoryRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const category = await this.repository.get(userId, id)
        if (!category) throw new NotFoundError("Category not found")

        try {
            await this.repository.delete(userId, id)
        } catch {
            throw new ConflictError("Category is in use by subcategories or transactions and cannot be deleted")
        }
    }
}
