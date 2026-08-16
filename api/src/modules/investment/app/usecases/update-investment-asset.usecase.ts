import { NotFoundError } from "@/http/errors/errors"

import type { UpdateInvestmentAssetSchema } from "../schemas"
import type { InvestmentAssetRepository } from "../../domain/repositories"

export class UpdateInvestmentAssetUseCase {
    constructor(private repository: InvestmentAssetRepository) {}

    async execute(userId: string, id: string, body: UpdateInvestmentAssetSchema): Promise<void> {
        const asset = await this.repository.get(userId, id)
        if (!asset) throw new NotFoundError("Investment asset not found")

        await this.repository.update(userId, id, body)
    }
}
