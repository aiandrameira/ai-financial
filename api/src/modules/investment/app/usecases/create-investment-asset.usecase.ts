import type { InvestmentAssetDto } from "../dtos"
import type { CreateInvestmentAssetSchema } from "../schemas"
import type { InvestmentAssetRepository } from "../../domain/repositories"

export class CreateInvestmentAssetUseCase {
    constructor(private repository: InvestmentAssetRepository) {}

    async execute(userId: string, body: CreateInvestmentAssetSchema): Promise<InvestmentAssetDto> {
        return this.repository.create(userId, body)
    }
}
