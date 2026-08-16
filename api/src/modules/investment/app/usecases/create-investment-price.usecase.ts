import { NotFoundError } from "@/http/errors/errors"

import type { InvestmentPriceDto } from "../dtos"
import type { CreateInvestmentPriceSchema } from "../schemas"
import type { InvestmentAssetRepository, InvestmentPriceRepository } from "../../domain/repositories"

export class CreateInvestmentPriceUseCase {
    constructor(
        private repository: InvestmentPriceRepository,
        private assetRepository: InvestmentAssetRepository,
    ) {}

    async execute(userId: string, investmentId: string, body: CreateInvestmentPriceSchema): Promise<InvestmentPriceDto> {
        const asset = await this.assetRepository.get(userId, investmentId)
        if (!asset) throw new NotFoundError("Investment asset not found")

        return this.repository.create(userId, investmentId, body)
    }
}
