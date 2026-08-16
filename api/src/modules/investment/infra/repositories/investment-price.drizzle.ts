import { and, count, desc, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { investmentPrices } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

import type { InvestmentPriceDto } from "../../app/dtos"
import type { CreateInvestmentPriceSchema, FindInvestmentPricesQuery } from "../../app/schemas"
import type { InvestmentPriceRepository } from "../../domain/repositories"

type InvestmentPriceRow = typeof investmentPrices.$inferSelect

function toDto(row: InvestmentPriceRow): InvestmentPriceDto {
    return {
        id: row.id,
        investmentId: row.investmentId,
        price: row.price,
        referenceDate: row.referenceDate.toISOString(),
        source: row.source,
        createdAt: row.createdAt.toISOString(),
    }
}

export class InvestmentPriceDrizzleRepository implements InvestmentPriceRepository {
    async find(userId: string, investmentId: string, params: FindInvestmentPricesQuery): Promise<IPaginated<InvestmentPriceDto>> {
        const where = and(eq(investmentPrices.userId, userId), eq(investmentPrices.investmentId, investmentId))

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(investmentPrices)
                .where(where)
                .orderBy(desc(investmentPrices.referenceDate))
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(investmentPrices).where(where),
        ])

        return { data: rows.map(toDto), page: params.page, size: params.size, total }
    }

    async create(userId: string, investmentId: string, body: CreateInvestmentPriceSchema): Promise<InvestmentPriceDto> {
        const [row] = await db
            .insert(investmentPrices)
            .values({ userId, investmentId, price: body.price.toFixed(4), referenceDate: body.referenceDate ?? new Date(), source: "manual" })
            .returning()

        return toDto(row)
    }

    async deleteByInvestment(userId: string, investmentId: string): Promise<void> {
        await db.delete(investmentPrices).where(and(eq(investmentPrices.userId, userId), eq(investmentPrices.investmentId, investmentId)))
    }
}
