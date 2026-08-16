import { tpInvestmentMovementEnum } from "../enums"

export type InvestmentMovementInput = {
    type: tpInvestmentMovementEnum
    quantity: number
    amount: number
    date: Date
}

export type InvestmentPosition = {
    quantity: number
    averagePrice: number
    investedAmount: number
    currentValue: number
    profitLoss: number
    profitLossPercent: number
}

function round(value: number): number {
    return Math.round(value * 100) / 100
}

function roundQuantity(value: number): number {
    return Math.round(value * 1e8) / 1e8
}

export function computeInvestmentPosition(movements: InvestmentMovementInput[], latestPrice: number | null): InvestmentPosition {
    const sorted = [...movements].sort((a, b) => a.date.getTime() - b.date.getTime())

    let quantity = 0
    let investedAmount = 0

    for (const movement of sorted) {
        if (movement.type === tpInvestmentMovementEnum.BUY || movement.type === tpInvestmentMovementEnum.CONTRIBUTION) {
            quantity += movement.quantity
            investedAmount += movement.amount
        } else if (movement.type === tpInvestmentMovementEnum.SELL || movement.type === tpInvestmentMovementEnum.WITHDRAWAL) {
            const averagePriceAtSale = quantity > 0 ? investedAmount / quantity : 0
            const quantityRemoved = Math.min(movement.quantity, quantity)
            investedAmount = round(investedAmount - averagePriceAtSale * quantityRemoved)
            quantity = roundQuantity(quantity - quantityRemoved)
        } else {
            continue
        }

        quantity = roundQuantity(quantity)
    }

    const averagePrice = quantity > 0 ? round(investedAmount / quantity) : 0
    const currentValue = latestPrice !== null ? round(quantity * latestPrice) : investedAmount
    const profitLoss = round(currentValue - investedAmount)
    const profitLossPercent = investedAmount > 0 ? round((profitLoss / investedAmount) * 100) : 0

    return { quantity: roundQuantity(quantity), averagePrice, investedAmount: round(investedAmount), currentValue, profitLoss, profitLossPercent }
}
