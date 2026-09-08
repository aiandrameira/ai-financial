import { ilike, and, count, eq, inArray } from "drizzle-orm"

import { db } from "@/db/client"
import { investmentAssets, investmentMovements, investmentPrices } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { InvestmentAssetDto } from "../../app/dtos"
import type {
    CreateInvestmentAssetSchema,
    FindInvestmentAssetsQuery,
    UpdateInvestmentAssetSchema,
} from "../../app/schemas"
import type { InvestmentAssetRepository } from "../../domain/repositories"
import { computeInvestmentPosition } from "../../domain/services"
import { mapInvestmentAssetToDto } from "../mappers"

async function computePositions(
    investmentIds: string[],
): Promise<Map<string, ReturnType<typeof computeInvestmentPosition>>> {
    if (investmentIds.length === 0) return new Map()

    const [movementRows, priceRows] = await Promise.all([
        db.select().from(investmentMovements).where(inArray(investmentMovements.investmentId, investmentIds)),
        db.select().from(investmentPrices).where(inArray(investmentPrices.investmentId, investmentIds)),
    ])

    const latestPriceEntryByInvestment = new Map<string, { price: number; referenceDate: Date }>()
    for (const row of priceRows) {
        const current = latestPriceEntryByInvestment.get(row.investmentId)
        if (!current || row.referenceDate.getTime() > current.referenceDate.getTime()) {
            latestPriceEntryByInvestment.set(row.investmentId, {
                price: Number(row.price),
                referenceDate: row.referenceDate,
            })
        }
    }
    const latestPriceByInvestment = new Map(
        Array.from(latestPriceEntryByInvestment, ([investmentId, entry]) => [investmentId, entry.price]),
    )

    const movementsByInvestment = new Map<string, typeof movementRows>()
    for (const row of movementRows) {
        const list = movementsByInvestment.get(row.investmentId) ?? []
        list.push(row)
        movementsByInvestment.set(row.investmentId, list)
    }

    const positions = new Map<string, ReturnType<typeof computeInvestmentPosition>>()
    for (const investmentId of investmentIds) {
        const movements = (movementsByInvestment.get(investmentId) ?? []).map((row) => ({
            type: row.type,
            quantity: Number(row.quantity),
            amount: Number(row.amount),
            date: row.date,
        }))
        positions.set(
            investmentId,
            computeInvestmentPosition(movements, latestPriceByInvestment.get(investmentId) ?? null),
        )
    }

    return positions
}

const emptyPosition = computeInvestmentPosition([], null)

export class InvestmentAssetDrizzleRepository implements InvestmentAssetRepository {
    async find(userId: string, params: FindInvestmentAssetsQuery): Promise<ICursorPaginated<InvestmentAssetDto>> {
        const where = and(
            eq(investmentAssets.userId, userId),
            params.query ? ilike(investmentAssets.name, `%${params.query}%`) : undefined,
        )

        const sort = {
            column: investmentAssets.createdAt,
            direction: "asc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const pageWhere = and(where, cursorWhere({ id: investmentAssets.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select()
                .from(investmentAssets)
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: investmentAssets.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(investmentAssets).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        const positions = await computePositions(rows.map((row) => row.id))

        return buildCursorPage(
            rows.map((row) => mapInvestmentAssetToDto(row, positions.get(row.id) ?? emptyPosition)),
            params.limit,
            params,
            total,
            { getValue: (row: InvestmentAssetDto) => row.createdAt },
        )
    }

    async get(userId: string, id: string): Promise<InvestmentAssetDto | null> {
        const [row] = await db
            .select()
            .from(investmentAssets)
            .where(and(eq(investmentAssets.userId, userId), eq(investmentAssets.id, id)))

        if (!row) return null

        const positions = await computePositions([row.id])
        return mapInvestmentAssetToDto(row, positions.get(row.id) ?? emptyPosition)
    }

    async create(userId: string, body: CreateInvestmentAssetSchema): Promise<InvestmentAssetDto> {
        const [row] = await db
            .insert(investmentAssets)
            .values({
                userId,
                name: body.name,
                type: body.type,
                broker: body.broker ?? null,
                ticker: body.ticker ?? null,
            })
            .returning()

        return mapInvestmentAssetToDto(row, emptyPosition)
    }

    async update(userId: string, id: string, body: UpdateInvestmentAssetSchema): Promise<void> {
        await db
            .update(investmentAssets)
            .set({
                name: body.name,
                type: body.type,
                broker: body.broker ?? null,
                ticker: body.ticker ?? null,
                updatedAt: new Date(),
            })
            .where(and(eq(investmentAssets.userId, userId), eq(investmentAssets.id, id)))
    }

    async delete(userId: string, id: string): Promise<void> {
        await db.transaction(async (tx) => {
            await tx
                .delete(investmentPrices)
                .where(and(eq(investmentPrices.userId, userId), eq(investmentPrices.investmentId, id)))
            await tx
                .delete(investmentMovements)
                .where(and(eq(investmentMovements.userId, userId), eq(investmentMovements.investmentId, id)))
            await tx
                .delete(investmentAssets)
                .where(and(eq(investmentAssets.userId, userId), eq(investmentAssets.id, id)))
        })
    }
}
