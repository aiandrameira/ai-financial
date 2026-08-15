import { NotFoundError } from "@/http/errors/errors"

import type { BudgetRepository } from "../../domain/repositories"

export class DeleteBudgetUseCase {
    constructor(private repository: BudgetRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const budget = await this.repository.get(userId, id)
        if (!budget) throw new NotFoundError("Budget not found")

        await this.repository.delete(userId, id)
    }
}
