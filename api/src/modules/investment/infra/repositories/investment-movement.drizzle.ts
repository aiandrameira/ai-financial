import { and, count, desc, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { investmentMovements } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

import type { InvestmentMovementDto } from "../../app/dtos"
import type { CreateInvestmentMovementSchema, FindInvestmentMovementsQuery } from "../../app/schemas"
import type { InvestmentMovementRepository } from "../../domain/repositories"
import { mapInvestmentMovementToDto } from "../mappers"

export class InvestmentMovementDrizzleRepository implements InvestmentMovementRepository {
    async find(
        userId: string,
        investmentId: string,
        params: FindInvestmentMovementsQuery,
    ): Promise<IPaginated<InvestmentMovementDto>> {
        const where = and(eq(investmentMovements.userId, userId), eq(investmentMovements.investmentId, investmentId))

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(investmentMovements)
                .where(where)
                .orderBy(desc(investmentMovements.date))
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(investmentMovements).where(where),
        ])

        return { data: rows.map(mapInvestmentMovementToDto), page: params.page, size: params.size, total }
    }

    async findAll(userId: string, investmentId: string): Promise<InvestmentMovementDto[]> {
        const rows = await db
            .select()
            .from(investmentMovements)
            .where(and(eq(investmentMovements.userId, userId), eq(investmentMovements.investmentId, investmentId)))

        return rows.map(mapInvestmentMovementToDto)
    }

    async get(userId: string, investmentId: string, id: string): Promise<InvestmentMovementDto | null> {
        const [row] = await db
            .select()
            .from(investmentMovements)
            .where(
                and(
                    eq(investmentMovements.userId, userId),
                    eq(investmentMovements.investmentId, investmentId),
                    eq(investmentMovements.id, id),
                ),
            )

        return row ? mapInvestmentMovementToDto(row) : null
    }

    async create(
        userId: string,
        investmentId: string,
        body: CreateInvestmentMovementSchema,
    ): Promise<InvestmentMovementDto> {
        const [row] = await db
            .insert(investmentMovements)
            .values({
                userId,
                investmentId,
                type: body.type,
                quantity: body.quantity.toFixed(8),
                price: body.price.toFixed(4),
                amount: body.amount.toFixed(2),
                date: body.date,
            })
            .returning()

        return mapInvestmentMovementToDto(row)
    }

    async delete(userId: string, id: string): Promise<void> {
        await db
            .delete(investmentMovements)
            .where(and(eq(investmentMovements.userId, userId), eq(investmentMovements.id, id)))
    }

    async deleteByInvestment(userId: string, investmentId: string): Promise<void> {
        await db
            .delete(investmentMovements)
            .where(and(eq(investmentMovements.userId, userId), eq(investmentMovements.investmentId, investmentId)))
    }
}
