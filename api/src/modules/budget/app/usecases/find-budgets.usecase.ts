import type { IPaginated } from "@/http/api/response"

import type { BudgetDto } from "../dtos"
import type { FindBudgetsQuery } from "../schemas"
import type { BudgetRepository } from "../../domain/repositories"

export class FindBudgetsUseCase {
    constructor(private repository: BudgetRepository) {}

    async execute(userId: string, params: FindBudgetsQuery): Promise<IPaginated<BudgetDto>> {
        return this.repository.find(userId, params)
    }
}
