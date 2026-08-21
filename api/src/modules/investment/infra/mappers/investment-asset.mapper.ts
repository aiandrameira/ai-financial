import type { investmentAssets } from "@/db/schema"

import type { InvestmentAssetDto } from "../../app/dtos"
import type { computeInvestmentPosition } from "../../domain/services"

type InvestmentAssetRow = typeof investmentAssets.$inferSelect

export function mapInvestmentAssetToDto(
    row: InvestmentAssetRow,
    position: ReturnType<typeof computeInvestmentPosition>,
): InvestmentAssetDto {
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        broker: row.broker,
        ticker: row.ticker,
        quantity: position.quantity,
        averagePrice: position.averagePrice,
        investedAmount: position.investedAmount,
        currentValue: position.currentValue,
        profitLoss: position.profitLoss,
        profitLossPercent: position.profitLossPercent,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}
