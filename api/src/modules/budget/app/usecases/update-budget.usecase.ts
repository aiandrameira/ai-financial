import { NotFoundError } from "@/http/errors/errors"

import type { UpdateBudgetSchema } from "../schemas"
import type { BudgetRepository } from "../../domain/repositories"

export class UpdateBudgetUseCase {
    constructor(private repository: BudgetRepository) {}

    async execute(userId: string, id: string, body: UpdateBudgetSchema): Promise<void> {
        const budget = await this.repository.get(userId, id)
        if (!budget) throw new NotFoundError("Budget not found")

        await this.repository.update(userId, id, body)
    }
}
