import type { IPaginated } from "@/http/api/response"
import type { SavingsGoalRepository } from "../../domain/repositories"
import type { SavingsGoalDto } from "../dtos"
import type { FindSavingsGoalsQuery } from "../schemas"

export class FindSavingsGoalsUseCase {
    constructor(private repository: SavingsGoalRepository) {}

    async execute(userId: string, params: FindSavingsGoalsQuery): Promise<IPaginated<SavingsGoalDto>> {
        return this.repository.find(userId, params)
    }
}
