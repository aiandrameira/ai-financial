import { and, count, eq, inArray } from "drizzle-orm"

import { db } from "@/db/client"
import { investmentAssets, investmentMovements, investmentPrices } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

import type { InvestmentAssetDto } from "../../app/dtos"
import type { CreateInvestmentAssetSchema, FindInvestmentAssetsQuery, UpdateInvestmentAssetSchema } from "../../app/schemas"
import { computeInvestmentPosition } from "../../domain/services"
import type { InvestmentAssetRepository } from "../../domain/repositories"

type InvestmentAssetRow = typeof investmentAssets.$inferSelect

async function computePositions(investmentIds: string[]): Promise<Map<string, ReturnType<typeof computeInvestmentPosition>>> {
    if (investmentIds.length === 0) return new Map()

    const [movementRows, priceRows] = await Promise.all([
        db.select().from(investmentMovements).where(inArray(investmentMovements.investmentId, investmentIds)),
        db.select().from(investmentPrices).where(inArray(investmentPrices.investmentId, investmentIds)),
    ])

    const latestPriceEntryByInvestment = new Map<string, { price: number; referenceDate: Date }>()
    for (const row of priceRows) {
        const current = latestPriceEntryByInvestment.get(row.investmentId)
        if (!current || row.referenceDate.getTime() > current.referenceDate.getTime()) {
            latestPriceEntryByInvestment.set(row.investmentId, { price: Number(row.price), referenceDate: row.referenceDate })
        }
    }
    const latestPriceByInvestment = new Map(Array.from(latestPriceEntryByInvestment, ([investmentId, entry]) => [investmentId, entry.price]))

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
        positions.set(investmentId, computeInvestmentPosition(movements, latestPriceByInvestment.get(investmentId) ?? null))
    }

    return positions
}

function toDto(row: InvestmentAssetRow, position: ReturnType<typeof computeInvestmentPosition>): InvestmentAssetDto {
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

const emptyPosition = computeInvestmentPosition([], null)

export class InvestmentAssetDrizzleRepository implements InvestmentAssetRepository {
    async find(userId: string, params: FindInvestmentAssetsQuery): Promise<IPaginated<InvestmentAssetDto>> {
        const where = eq(investmentAssets.userId, userId)

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(investmentAssets)
                .where(where)
                .orderBy(investmentAssets.createdAt)
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(investmentAssets).where(where),
        ])

        const positions = await computePositions(rows.map((row) => row.id))

        return {
            data: rows.map((row) => toDto(row, positions.get(row.id) ?? emptyPosition)),
            page: params.page,
            size: params.size,
            total,
        }
    }

    async get(userId: string, id: string): Promise<InvestmentAssetDto | null> {
        const [row] = await db
            .select()
            .from(investmentAssets)
            .where(and(eq(investmentAssets.userId, userId), eq(investmentAssets.id, id)))

        if (!row) return null

        const positions = await computePositions([row.id])
        return toDto(row, positions.get(row.id) ?? emptyPosition)
    }

    async create(userId: string, body: CreateInvestmentAssetSchema): Promise<InvestmentAssetDto> {
        const [row] = await db
            .insert(investmentAssets)
            .values({ userId, name: body.name, type: body.type, broker: body.broker ?? null, ticker: body.ticker ?? null })
            .returning()

        return toDto(row, emptyPosition)
    }

    async update(userId: string, id: string, body: UpdateInvestmentAssetSchema): Promise<void> {
        await db
            .update(investmentAssets)
            .set({ name: body.name, type: body.type, broker: body.broker ?? null, ticker: body.ticker ?? null, updatedAt: new Date() })
            .where(and(eq(investmentAssets.userId, userId), eq(investmentAssets.id, id)))
    }

    async delete(userId: string, id: string): Promise<void> {
        await db.transaction(async (tx) => {
            await tx.delete(investmentPrices).where(and(eq(investmentPrices.userId, userId), eq(investmentPrices.investmentId, id)))
            await tx.delete(investmentMovements).where(and(eq(investmentMovements.userId, userId), eq(investmentMovements.investmentId, id)))
            await tx.delete(investmentAssets).where(and(eq(investmentAssets.userId, userId), eq(investmentAssets.id, id)))
        })
    }
}
