import { NotFoundError } from "@/http/errors/errors"
import type { TransactionRepository } from "@/modules/transaction/domain/repositories"
import type { GoalContributionRepository, SavingsGoalRepository } from "../../domain/repositories"
import type { GoalReachedNotifier } from "../../domain/services"
import type { GoalContributionDto } from "../dtos"
import type { CreateGoalContributionSchema } from "../schemas"

export class CreateGoalContributionUseCase {
    constructor(
        private repository: GoalContributionRepository,
        private goalRepository: SavingsGoalRepository,
        private transactionRepository: TransactionRepository,
        private notifier: GoalReachedNotifier,
    ) {}

    async execute(userId: string, goalId: string, body: CreateGoalContributionSchema): Promise<GoalContributionDto> {
        const goal = await this.goalRepository.get(userId, goalId)
        if (!goal) throw new NotFoundError("Savings goal not found")

        if (body.transactionId) {
            const transaction = await this.transactionRepository.get(userId, body.transactionId)
            if (!transaction) throw new NotFoundError("Transaction not found")
        }

        const contribution = await this.repository.create(userId, goalId, body)

        const updatedGoal = await this.goalRepository.get(userId, goalId)
        if (updatedGoal && updatedGoal.progressPercent >= 100) {
            await this.notifier.notify(userId, updatedGoal)
        }

        return contribution
    }
}
