import { and, count, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { goalContributions } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { GoalContributionDto } from "../../app/dtos"
import type { CreateGoalContributionSchema, FindGoalContributionsQuery } from "../../app/schemas"
import type { GoalContributionRepository } from "../../domain/repositories"
import { mapGoalContributionToDto } from "../mappers"

export class GoalContributionDrizzleRepository implements GoalContributionRepository {
    async find(
        userId: string,
        goalId: string,
        params: FindGoalContributionsQuery,
    ): Promise<ICursorPaginated<GoalContributionDto>> {
        const where = and(eq(goalContributions.userId, userId), eq(goalContributions.goalId, goalId))

        const sort = {
            column: goalContributions.date,
            direction: "desc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const pageWhere = and(where, cursorWhere({ id: goalContributions.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select()
                .from(goalContributions)
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: goalContributions.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(goalContributions).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        return buildCursorPage(rows.map(mapGoalContributionToDto), params.limit, params, total, {
            getValue: (row: GoalContributionDto) => row.date,
        })
    }

    async findAll(userId: string, goalId: string): Promise<GoalContributionDto[]> {
        const rows = await db
            .select()
            .from(goalContributions)
            .where(and(eq(goalContributions.userId, userId), eq(goalContributions.goalId, goalId)))

        return rows.map(mapGoalContributionToDto)
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

        return row ? mapGoalContributionToDto(row) : null
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

        return mapGoalContributionToDto(row)
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
