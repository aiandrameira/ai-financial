import type { ICursorPaginated } from "@/http/api/response"

import type { InvestmentMovementDto } from "../../app/dtos"
import type { CreateInvestmentMovementSchema, FindInvestmentMovementsQuery } from "../../app/schemas"

export interface InvestmentMovementRepository {
    find(
        userId: string,
        investmentId: string,
        params: FindInvestmentMovementsQuery,
    ): Promise<ICursorPaginated<InvestmentMovementDto>>
    findAll(userId: string, investmentId: string): Promise<InvestmentMovementDto[]>
    get(userId: string, investmentId: string, id: string): Promise<InvestmentMovementDto | null>
    create(userId: string, investmentId: string, body: CreateInvestmentMovementSchema): Promise<InvestmentMovementDto>
    delete(userId: string, id: string): Promise<void>
    deleteByInvestment(userId: string, investmentId: string): Promise<void>
}

export type { InvestmentMovementDto }
