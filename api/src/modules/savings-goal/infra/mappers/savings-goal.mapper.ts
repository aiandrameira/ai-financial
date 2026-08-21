import type { savingsGoals } from "@/db/schema"

import type { SavingsGoalDto } from "../../app/dtos"
import { computeGoalProgress } from "../../domain/services"

type SavingsGoalRow = typeof savingsGoals.$inferSelect

export function mapSavingsGoalToDto(row: SavingsGoalRow, contributedAmount = "0"): SavingsGoalDto {
    const progress = computeGoalProgress(Number(row.targetAmount), [Number(contributedAmount)])

    return {
        id: row.id,
        name: row.name,
        targetAmount: row.targetAmount,
        targetDate: row.targetDate?.toISOString() ?? null,
        icon: row.icon,
        linkedAccountId: row.linkedAccountId,
        currentAmount: progress.currentAmount,
        remainingAmount: progress.remainingAmount,
        progressPercent: progress.progressPercent,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}
