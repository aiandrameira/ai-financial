import type { IPaginated } from "@/http/api/response"
import { NotFoundError } from "@/http/errors/errors"

import type { InvestmentMovementDto } from "../dtos"
import type { FindInvestmentMovementsQuery } from "../schemas"
import type { InvestmentAssetRepository, InvestmentMovementRepository } from "../../domain/repositories"

export class FindInvestmentMovementsUseCase {
    constructor(
        private repository: InvestmentMovementRepository,
        private assetRepository: InvestmentAssetRepository,
    ) {}

    async execute(userId: string, investmentId: string, params: FindInvestmentMovementsQuery): Promise<IPaginated<InvestmentMovementDto>> {
        const asset = await this.assetRepository.get(userId, investmentId)
        if (!asset) throw new NotFoundError("Investment asset not found")

        return this.repository.find(userId, investmentId, params)
    }
}
