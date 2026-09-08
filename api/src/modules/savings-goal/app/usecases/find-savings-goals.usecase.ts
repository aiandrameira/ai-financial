import type { ICursorPaginated } from "@/http/api/response"
import type { SavingsGoalRepository } from "../../domain/repositories"
import type { SavingsGoalDto } from "../dtos"
import type { FindSavingsGoalsQuery } from "../schemas"

export class FindSavingsGoalsUseCase {
    constructor(private repository: SavingsGoalRepository) {}

    async execute(userId: string, params: FindSavingsGoalsQuery): Promise<ICursorPaginated<SavingsGoalDto>> {
        return this.repository.find(userId, params)
    }
}
