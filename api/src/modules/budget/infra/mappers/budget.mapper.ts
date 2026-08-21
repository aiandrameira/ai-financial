import type { budgets } from "@/db/schema"

import type { BudgetDto } from "../../app/dtos"

type BudgetRow = typeof budgets.$inferSelect

export function mapBudgetToDto(row: BudgetRow, realizedAmount: string): BudgetDto {
    return {
        id: row.id,
        categoryId: row.categoryId,
        referenceMonth: row.referenceMonth.toISOString(),
        plannedAmount: row.plannedAmount,
        realizedAmount,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}
