import type { goalContributions } from "@/db/schema"

import type { GoalContributionDto } from "../../app/dtos"

type GoalContributionRow = typeof goalContributions.$inferSelect

export function mapGoalContributionToDto(row: GoalContributionRow): GoalContributionDto {
    return {
        id: row.id,
        goalId: row.goalId,
        transactionId: row.transactionId,
        amount: row.amount,
        date: row.date.toISOString(),
        createdAt: row.createdAt.toISOString(),
    }
}
