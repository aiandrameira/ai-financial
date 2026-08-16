import { NotFoundError } from "@/http/errors/errors"

import type { SavingsGoalRepository } from "../../domain/repositories"

export class DeleteSavingsGoalUseCase {
    constructor(private repository: SavingsGoalRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const goal = await this.repository.get(userId, id)
        if (!goal) throw new NotFoundError("Savings goal not found")

        await this.repository.delete(userId, id)
    }
}
