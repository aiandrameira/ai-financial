import { NotFoundError } from "@/http/errors/errors"

import type { SavingsGoalDto } from "../dtos"
import type { SavingsGoalRepository } from "../../domain/repositories"

export class GetSavingsGoalUseCase {
    constructor(private repository: SavingsGoalRepository) {}

    async execute(userId: string, id: string): Promise<SavingsGoalDto> {
        const goal = await this.repository.get(userId, id)
        if (!goal) throw new NotFoundError("Savings goal not found")
        return goal
    }
}
