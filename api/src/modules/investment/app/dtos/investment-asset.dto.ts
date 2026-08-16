import type { tpInvestmentEnum } from "../../domain/enums"

export type InvestmentAssetDto = {
    id: string
    name: string
    type: tpInvestmentEnum
    broker: string | null
    ticker: string | null
    quantity: number
    averagePrice: number
    investedAmount: number
    currentValue: number
    profitLoss: number
    profitLossPercent: number
    createdAt: string
    updatedAt: string
}
