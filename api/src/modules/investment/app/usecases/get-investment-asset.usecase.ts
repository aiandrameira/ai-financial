import { NotFoundError } from "@/http/errors/errors"

import type { InvestmentAssetDto } from "../dtos"
import type { InvestmentAssetRepository } from "../../domain/repositories"

export class GetInvestmentAssetUseCase {
    constructor(private repository: InvestmentAssetRepository) {}

    async execute(userId: string, id: string): Promise<InvestmentAssetDto> {
        const asset = await this.repository.get(userId, id)
        if (!asset) throw new NotFoundError("Investment asset not found")

        return asset
    }
}
