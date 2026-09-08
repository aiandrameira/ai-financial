import type { ICursorPaginated } from "@/http/api/response"

import type { InvestmentPriceDto } from "../../app/dtos"
import type { CreateInvestmentPriceSchema, FindInvestmentPricesQuery } from "../../app/schemas"

export interface InvestmentPriceRepository {
    find(
        userId: string,
        investmentId: string,
        params: FindInvestmentPricesQuery,
    ): Promise<ICursorPaginated<InvestmentPriceDto>>
    create(userId: string, investmentId: string, body: CreateInvestmentPriceSchema): Promise<InvestmentPriceDto>
    deleteByInvestment(userId: string, investmentId: string): Promise<void>
}

export type { InvestmentPriceDto }
