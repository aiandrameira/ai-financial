import { and, count, desc, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { goalContributions } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

import type { GoalContributionDto } from "../../app/dtos"
import type { CreateGoalContributionSchema, FindGoalContributionsQuery } from "../../app/schemas"
import type { GoalContributionRepository } from "../../domain/repositories"

type GoalContributionRow = typeof goalContributions.$inferSelect

function toDto(row: GoalContributionRow): GoalContributionDto {
    return {
        id: row.id,
        goalId: row.goalId,
        transactionId: row.transactionId,
        amount: row.amount,
        date: row.date.toISOString(),
        createdAt: row.createdAt.toISOString(),
    }
}

export class GoalContributionDrizzleRepository implements GoalContributionRepository {
    async find(
        userId: string,
        goalId: string,
        params: FindGoalContributionsQuery,
    ): Promise<IPaginated<GoalContributionDto>> {
        const where = and(eq(goalContributions.userId, userId), eq(goalContributions.goalId, goalId))

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(goalContributions)
                .where(where)
                .orderBy(desc(goalContributions.date))
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(goalContributions).where(where),
        ])

        return { data: rows.map(toDto), page: params.page, size: params.size, total }
    }

    async findAll(userId: string, goalId: string): Promise<GoalContributionDto[]> {
        const rows = await db
            .select()
            .from(goalContributions)
            .where(and(eq(goalContributions.userId, userId), eq(goalContributions.goalId, goalId)))

        return rows.map(toDto)
    }

    async get(userId: string, goalId: string, id: string): Promise<GoalContributionDto | null> {
        const [row] = await db
            .select()
            .from(goalContributions)
            .where(
                and(
                    eq(goalContributions.userId, userId),
                    eq(goalContributions.goalId, goalId),
                    eq(goalContributions.id, id),
                ),
            )

        return row ? toDto(row) : null
    }

    async create(userId: string, goalId: string, body: CreateGoalContributionSchema): Promise<GoalContributionDto> {
        const [row] = await db
            .insert(goalContributions)
            .values({
                userId,
                goalId,
                transactionId: body.transactionId ?? null,
                amount: body.amount.toFixed(2),
                date: body.date,
            })
            .returning()

        return toDto(row)
    }

    async delete(userId: string, id: string): Promise<void> {
        await db
            .delete(goalContributions)
            .where(and(eq(goalContributions.userId, userId), eq(goalContributions.id, id)))
    }

    async deleteByGoal(userId: string, goalId: string): Promise<void> {
        await db
            .delete(goalContributions)
            .where(and(eq(goalContributions.userId, userId), eq(goalContributions.goalId, goalId)))
    }
}
