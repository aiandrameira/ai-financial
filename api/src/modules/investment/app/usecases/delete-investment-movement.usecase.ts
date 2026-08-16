import { NotFoundError } from "@/http/errors/errors"

import type { InvestmentMovementRepository } from "../../domain/repositories"

export class DeleteInvestmentMovementUseCase {
    constructor(private repository: InvestmentMovementRepository) {}

    async execute(userId: string, investmentId: string, id: string): Promise<void> {
        const movement = await this.repository.get(userId, investmentId, id)
        if (!movement) throw new NotFoundError("Investment movement not found")

        await this.repository.delete(userId, id)
    }
}
