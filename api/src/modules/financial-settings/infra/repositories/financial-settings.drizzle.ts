import { eq } from "drizzle-orm"

import { db } from "@/db/client"
import { financialSettings } from "@/db/schema"

import type { FinancialSettingsDto } from "../../app/dtos"
import type { FinancialSettingsRepository } from "../../domain/repositories"
import { mapFinancialSettingsToDto } from "../mappers"

export class FinancialSettingsDrizzleRepository implements FinancialSettingsRepository {
    async get(userId: string): Promise<FinancialSettingsDto | null> {
        const [row] = await db.select().from(financialSettings).where(eq(financialSettings.userId, userId))

        if (!row) return null

        return mapFinancialSettingsToDto(row)
    }

    async upsert(userId: string, monthlyIncome: number): Promise<FinancialSettingsDto> {
        const [row] = await db
            .insert(financialSettings)
            .values({ userId, monthlyIncome: monthlyIncome.toFixed(2) })
            .onConflictDoUpdate({
                target: financialSettings.userId,
                set: { monthlyIncome: monthlyIncome.toFixed(2), updatedAt: new Date() },
            })
            .returning()

        return mapFinancialSettingsToDto(row)
    }
}
