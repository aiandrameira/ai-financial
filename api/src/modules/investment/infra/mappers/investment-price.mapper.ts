import type { investmentPrices } from "@/db/schema"

import type { InvestmentPriceDto } from "../../app/dtos"

type InvestmentPriceRow = typeof investmentPrices.$inferSelect

export function mapInvestmentPriceToDto(row: InvestmentPriceRow): InvestmentPriceDto {
    return {
        id: row.id,
        investmentId: row.investmentId,
        price: row.price,
        referenceDate: row.referenceDate.toISOString(),
        source: row.source,
        createdAt: row.createdAt.toISOString(),
    }
}
