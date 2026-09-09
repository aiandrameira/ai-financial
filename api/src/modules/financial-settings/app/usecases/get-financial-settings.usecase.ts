import type { FinancialSettingsDto } from "../dtos"
import type { FinancialSettingsRepository } from "../../domain/repositories"

export class GetFinancialSettingsUseCase {
    constructor(private repository: FinancialSettingsRepository) {}

    async execute(userId: string): Promise<FinancialSettingsDto> {
        const settings = await this.repository.get(userId)
        if (settings) return settings

        return { userId, monthlyIncome: "0.00", updatedAt: new Date().toISOString() }
    }
}
