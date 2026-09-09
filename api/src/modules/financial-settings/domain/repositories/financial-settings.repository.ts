import type { FinancialSettingsDto } from "../../app/dtos"

export interface FinancialSettingsRepository {
    get(userId: string): Promise<FinancialSettingsDto | null>
    upsert(userId: string, monthlyIncome: number): Promise<FinancialSettingsDto>
}

export type { FinancialSettingsDto }
