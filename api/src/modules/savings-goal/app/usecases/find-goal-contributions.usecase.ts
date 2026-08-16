import type { IPaginated } from "@/http/api/response"
import { NotFoundError } from "@/http/errors/errors"

import type { GoalContributionDto } from "../dtos"
import type { FindGoalContributionsQuery } from "../schemas"
import type { GoalContributionRepository, SavingsGoalRepository } from "../../domain/repositories"

export class FindGoalContributionsUseCase {
    constructor(
        private repository: GoalContributionRepository,
        private goalRepository: SavingsGoalRepository,
    ) {}

    async execute(userId: string, goalId: string, params: FindGoalContributionsQuery): Promise<IPaginated<GoalContributionDto>> {
        const goal = await this.goalRepository.get(userId, goalId)
        if (!goal) throw new NotFoundError("Savings goal not found")

        return this.repository.find(userId, goalId, params)
    }
}
