import type { ICursorPaginated } from "@/http/api/response"

import type { BudgetDto } from "../dtos"
import type { FindBudgetsQuery } from "../schemas"
import type { BudgetRepository } from "../../domain/repositories"

export class FindBudgetsUseCase {
    constructor(private repository: BudgetRepository) {}

    async execute(userId: string, params: FindBudgetsQuery): Promise<ICursorPaginated<BudgetDto>> {
        return this.repository.find(userId, params)
    }
}
