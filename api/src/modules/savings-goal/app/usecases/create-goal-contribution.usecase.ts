import type { TransactionRepository } from "@/modules/transaction/domain/repositories"
import { NotFoundError } from "@/http/errors/errors"

import type { GoalContributionDto } from "../dtos"
import type { CreateGoalContributionSchema } from "../schemas"
import type { GoalContributionRepository, SavingsGoalRepository } from "../../domain/repositories"

export class CreateGoalContributionUseCase {
    constructor(
        private repository: GoalContributionRepository,
        private goalRepository: SavingsGoalRepository,
        private transactionRepository: TransactionRepository,
    ) {}

    async execute(userId: string, goalId: string, body: CreateGoalContributionSchema): Promise<GoalContributionDto> {
        const goal = await this.goalRepository.get(userId, goalId)
        if (!goal) throw new NotFoundError("Savings goal not found")

        if (body.transactionId) {
            const transaction = await this.transactionRepository.get(userId, body.transactionId)
            if (!transaction) throw new NotFoundError("Transaction not found")
        }

        return this.repository.create(userId, goalId, body)
    }
}
