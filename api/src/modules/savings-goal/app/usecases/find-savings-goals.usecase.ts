import type { IPaginated } from "@/http/api/response"

import type { SavingsGoalDto } from "../dtos"
import type { FindSavingsGoalsQuery } from "../schemas"
import type { SavingsGoalRepository } from "../../domain/repositories"

export class FindSavingsGoalsUseCase {
    constructor(private repository: SavingsGoalRepository) {}

    async execute(userId: string, params: FindSavingsGoalsQuery): Promise<IPaginated<SavingsGoalDto>> {
        return this.repository.find(userId, params)
    }
}
