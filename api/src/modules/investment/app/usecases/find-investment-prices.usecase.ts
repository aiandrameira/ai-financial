import type { IPaginated } from "@/http/api/response"
import { NotFoundError } from "@/http/errors/errors"

import type { InvestmentPriceDto } from "../dtos"
import type { FindInvestmentPricesQuery } from "../schemas"
import type { InvestmentAssetRepository, InvestmentPriceRepository } from "../../domain/repositories"

export class FindInvestmentPricesUseCase {
    constructor(
        private repository: InvestmentPriceRepository,
        private assetRepository: InvestmentAssetRepository,
    ) {}

    async execute(userId: string, investmentId: string, params: FindInvestmentPricesQuery): Promise<IPaginated<InvestmentPriceDto>> {
        const asset = await this.assetRepository.get(userId, investmentId)
        if (!asset) throw new NotFoundError("Investment asset not found")

        return this.repository.find(userId, investmentId, params)
    }
}
