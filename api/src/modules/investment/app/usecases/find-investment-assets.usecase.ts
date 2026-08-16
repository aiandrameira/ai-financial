import type { IPaginated } from "@/http/api/response"

import type { InvestmentAssetDto } from "../dtos"
import type { FindInvestmentAssetsQuery } from "../schemas"
import type { InvestmentAssetRepository } from "../../domain/repositories"

export class FindInvestmentAssetsUseCase {
    constructor(private repository: InvestmentAssetRepository) {}

    async execute(userId: string, params: FindInvestmentAssetsQuery): Promise<IPaginated<InvestmentAssetDto>> {
        return this.repository.find(userId, params)
    }
}
