import { NotFoundError } from "@/http/errors/errors"

import type { InvestmentAssetRepository } from "../../domain/repositories"

export class DeleteInvestmentAssetUseCase {
    constructor(private repository: InvestmentAssetRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const asset = await this.repository.get(userId, id)
        if (!asset) throw new NotFoundError("Investment asset not found")

        await this.repository.delete(userId, id)
    }
}
