import type { financialSettings } from "@/db/schema"

import type { FinancialSettingsDto } from "../../app/dtos"

type FinancialSettingsRow = typeof financialSettings.$inferSelect

export function mapFinancialSettingsToDto(row: FinancialSettingsRow): FinancialSettingsDto {
    return {
        userId: row.userId,
        monthlyIncome: row.monthlyIncome,
        updatedAt: row.updatedAt.toISOString(),
    }
}
