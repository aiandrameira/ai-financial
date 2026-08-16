import type { tpInvestmentMovementEnum } from "../../domain/enums"

export type InvestmentMovementDto = {
    id: string
    investmentId: string
    type: tpInvestmentMovementEnum
    quantity: string
    price: string
    amount: string
    date: string
    createdAt: string
}
