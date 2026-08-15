import { NotFoundError } from "@/http/errors/errors"

import type { BudgetDto } from "../dtos"
import type { BudgetRepository } from "../../domain/repositories"

export class GetBudgetUseCase {
    constructor(private repository: BudgetRepository) {}

    async execute(userId: string, id: string): Promise<BudgetDto> {
        const budget = await this.repository.get(userId, id)
        if (!budget) throw new NotFoundError("Budget not found")
        return budget
    }
}
