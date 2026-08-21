import type { investmentMovements } from "@/db/schema"

import type { InvestmentMovementDto } from "../../app/dtos"

type InvestmentMovementRow = typeof investmentMovements.$inferSelect

export function mapInvestmentMovementToDto(row: InvestmentMovementRow): InvestmentMovementDto {
    return {
        id: row.id,
        investmentId: row.investmentId,
        type: row.type,
        quantity: row.quantity,
        price: row.price,
        amount: row.amount,
        date: row.date.toISOString(),
        createdAt: row.createdAt.toISOString(),
    }
}
