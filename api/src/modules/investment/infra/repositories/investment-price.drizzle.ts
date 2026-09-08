import { and, count, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { investmentPrices } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { InvestmentPriceDto } from "../../app/dtos"
import type { CreateInvestmentPriceSchema, FindInvestmentPricesQuery } from "../../app/schemas"
import type { InvestmentPriceRepository } from "../../domain/repositories"
import { mapInvestmentPriceToDto } from "../mappers"

export class InvestmentPriceDrizzleRepository implements InvestmentPriceRepository {
    async find(
        userId: string,
        investmentId: string,
        params: FindInvestmentPricesQuery,
    ): Promise<ICursorPaginated<InvestmentPriceDto>> {
        const where = and(eq(investmentPrices.userId, userId), eq(investmentPrices.investmentId, investmentId))

        const sort = {
            column: investmentPrices.referenceDate,
            direction: "desc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const pageWhere = and(where, cursorWhere({ id: investmentPrices.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select()
                .from(investmentPrices)
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: investmentPrices.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(investmentPrices).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        return buildCursorPage(rows.map(mapInvestmentPriceToDto), params.limit, params, total, {
            getValue: (row: InvestmentPriceDto) => row.referenceDate,
        })
    }

    async create(userId: string, investmentId: string, body: CreateInvestmentPriceSchema): Promise<InvestmentPriceDto> {
        const [row] = await db
            .insert(investmentPrices)
            .values({
                userId,
                investmentId,
                price: body.price.toFixed(4),
                referenceDate: body.referenceDate ?? new Date(),
                source: "manual",
            })
            .returning()

        return mapInvestmentPriceToDto(row)
    }

    async deleteByInvestment(userId: string, investmentId: string): Promise<void> {
        await db
            .delete(investmentPrices)
            .where(and(eq(investmentPrices.userId, userId), eq(investmentPrices.investmentId, investmentId)))
    }
}
