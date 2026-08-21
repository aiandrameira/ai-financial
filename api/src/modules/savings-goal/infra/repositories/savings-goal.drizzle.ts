import { and, eq, inArray, sql } from "drizzle-orm"

import { db } from "@/db/client"
import { goalContributions, savingsGoals } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

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
    async find(userId: string, params: FindSavingsGoalsQuery): Promise<IPaginated<SavingsGoalDto>> {
        const where = eq(savingsGoals.userId, userId)

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(savingsGoals)
                .where(where)
                .orderBy(savingsGoals.createdAt)
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: sql<number>`count(*)` }).from(savingsGoals).where(where),
        ])

        const contributedAmounts = await computeContributedAmounts(rows.map((row) => row.id))

        return {
            data: rows.map((row) => mapSavingsGoalToDto(row, contributedAmounts.get(row.id))),
            page: params.page,
            size: params.size,
            total: Number(total),
        }
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
