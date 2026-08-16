import { NotFoundError } from "@/http/errors/errors"

import type { GoalContributionRepository } from "../../domain/repositories"

export class DeleteGoalContributionUseCase {
    constructor(private repository: GoalContributionRepository) {}

    async execute(userId: string, goalId: string, id: string): Promise<void> {
        const contribution = await this.repository.get(userId, goalId, id)
        if (!contribution) throw new NotFoundError("Contribution not found")

        await this.repository.delete(userId, id)
    }
}
