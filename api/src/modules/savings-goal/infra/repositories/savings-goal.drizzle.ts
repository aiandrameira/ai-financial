import { ilike, count, and, eq, inArray, sql } from "drizzle-orm"

import { db } from "@/db/client"
import { goalContributions, savingsGoals } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { SavingsGoalDto } from "../../app/dtos"
import type { CreateSavingsGoalSchema, FindSavingsGoalsQuery, UpdateSavingsGoalSchema } from "../../app/schemas"
import type { SavingsGoalRepository } from "../../domain/repositories"
import { mapSavingsGoalToDto } from "../mappers"

async function computeContributedAmounts(goalIds: string[]): Promise<Map<string, string>> {
    if (goalIds.length === 0) return new Map()

    const rows = await db
        .select({
            goalId: goalContributions.goalId,
            total: sql<string>`coalesce(sum(${goalContributions.amount}), 0)`,
        })
        .from(goalContributions)
        .where(inArray(goalContributions.goalId, goalIds))
        .groupBy(goalContributions.goalId)

    return new Map(rows.map((row) => [row.goalId, row.total]))
}

export class SavingsGoalDrizzleRepository implements SavingsGoalRepository {
    async find(userId: string, params: FindSavingsGoalsQuery): Promise<ICursorPaginated<SavingsGoalDto>> {
        const where = and(
            eq(savingsGoals.userId, userId),
            params.query ? ilike(savingsGoals.name, `%${params.query}%`) : undefined,
        )

        const sort = {
            column: savingsGoals.createdAt,
            direction: "asc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const pageWhere = and(where, cursorWhere({ id: savingsGoals.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select()
                .from(savingsGoals)
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: savingsGoals.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(savingsGoals).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        const contributedAmounts = await computeContributedAmounts(rows.map((row) => row.id))

        return buildCursorPage(
            rows.map((row) => mapSavingsGoalToDto(row, contributedAmounts.get(row.id))),
            params.limit,
            params,
            total,
            { getValue: (row: SavingsGoalDto) => row.createdAt },
        )
    }

    async get(userId: string, id: string): Promise<SavingsGoalDto | null> {
        const [row] = await db
            .select()
            .from(savingsGoals)
            .where(and(eq(savingsGoals.userId, userId), eq(savingsGoals.id, id)))

        if (!row) return null

        const contributedAmounts = await computeContributedAmounts([row.id])
        return mapSavingsGoalToDto(row, contributedAmounts.get(row.id))
    }

    async create(userId: string, body: CreateSavingsGoalSchema): Promise<SavingsGoalDto> {
        const [row] = await db
            .insert(savingsGoals)
            .values({
                userId,
                name: body.name,
                targetAmount: body.targetAmount.toFixed(2),
                targetDate: body.targetDate ?? null,
                icon: body.icon ?? null,
                linkedAccountId: body.linkedAccountId ?? null,
            })
            .returning()

        return mapSavingsGoalToDto(row)
    }

    async update(userId: string, id: string, body: UpdateSavingsGoalSchema): Promise<void> {
        await db
            .update(savingsGoals)
            .set({
                name: body.name,
                targetAmount: body.targetAmount.toFixed(2),
                targetDate: body.targetDate ?? null,
                icon: body.icon ?? null,
                linkedAccountId: body.linkedAccountId ?? null,
                updatedAt: new Date(),
            })
            .where(and(eq(savingsGoals.userId, userId), eq(savingsGoals.id, id)))
    }

    async delete(userId: string, id: string): Promise<void> {
        await db.transaction(async (tx) => {
            await tx
                .delete(goalContributions)
                .where(and(eq(goalContributions.userId, userId), eq(goalContributions.goalId, id)))
            await tx.delete(savingsGoals).where(and(eq(savingsGoals.userId, userId), eq(savingsGoals.id, id)))
        })
    }
}
