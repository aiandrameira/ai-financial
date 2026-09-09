import type { FinancialSettingsDto } from "../dtos"
import type { UpdateFinancialSettingsSchema } from "../schemas"
import type { FinancialSettingsRepository } from "../../domain/repositories"

export class UpdateFinancialSettingsUseCase {
    constructor(private repository: FinancialSettingsRepository) {}

    async execute(userId: string, body: UpdateFinancialSettingsSchema): Promise<FinancialSettingsDto> {
        return this.repository.upsert(userId, body.monthlyIncome)
    }
}
