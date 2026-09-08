import { and, count, eq, gte, lt, sql } from "drizzle-orm"

import { db } from "@/db/client"
import { budgets, transactions } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { BudgetDto } from "../../app/dtos"
import type { CreateBudgetSchema, FindBudgetsQuery, UpdateBudgetSchema } from "../../app/schemas"
import type { BudgetRepository } from "../../domain/repositories"
import { mapBudgetToDto } from "../mappers"

function monthEnd(referenceMonth: Date): Date {
    return new Date(Date.UTC(referenceMonth.getUTCFullYear(), referenceMonth.getUTCMonth() + 1, 1))
}

async function computeRealizedAmount(categoryId: string, referenceMonth: Date): Promise<string> {
    const [row] = await db
        .select({
            total: sql<string>`coalesce(-sum(${transactions.amount}) filter (where ${transactions.status} = 'completed'), 0)`,
        })
        .from(transactions)
        .where(
            and(
                eq(transactions.categoryId, categoryId),
                gte(transactions.date, referenceMonth),
                lt(transactions.date, monthEnd(referenceMonth)),
            ),
        )

    return row.total
}

export class BudgetDrizzleRepository implements BudgetRepository {
    async find(userId: string, params: FindBudgetsQuery): Promise<ICursorPaginated<BudgetDto>> {
        const where = and(
            eq(budgets.userId, userId),
            params.categoryId ? eq(budgets.categoryId, params.categoryId) : undefined,
            params.referenceMonth
                ? eq(
                      budgets.referenceMonth,
                      new Date(
                          Date.UTC(params.referenceMonth.getUTCFullYear(), params.referenceMonth.getUTCMonth(), 1),
                      ),
                  )
                : undefined,
        )

        const sort = {
            column: budgets.referenceMonth,
            direction: "asc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const pageWhere = and(where, cursorWhere({ id: budgets.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select()
                .from(budgets)
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: budgets.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(budgets).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        const data = await Promise.all(
            rows.map(async (row) =>
                mapBudgetToDto(row, await computeRealizedAmount(row.categoryId, row.referenceMonth)),
            ),
        )

        return buildCursorPage(data, params.limit, params, total, { getValue: (row: BudgetDto) => row.referenceMonth })
    }

    async get(userId: string, id: string): Promise<BudgetDto | null> {
        const [row] = await db
            .select()
            .from(budgets)
            .where(and(eq(budgets.userId, userId), eq(budgets.id, id)))

        if (!row) return null

        return mapBudgetToDto(row, await computeRealizedAmount(row.categoryId, row.referenceMonth))
    }

    async getByCategoryAndMonth(userId: string, categoryId: string, referenceMonth: Date): Promise<BudgetDto | null> {
        const [row] = await db
            .select()
            .from(budgets)
            .where(
                and(
                    eq(budgets.userId, userId),
                    eq(budgets.categoryId, categoryId),
                    eq(budgets.referenceMonth, referenceMonth),
                ),
            )

        if (!row) return null

        return mapBudgetToDto(row, await computeRealizedAmount(row.categoryId, row.referenceMonth))
    }

    async create(userId: string, body: CreateBudgetSchema): Promise<BudgetDto> {
        const [row] = await db
            .insert(budgets)
            .values({
                userId,
                categoryId: body.categoryId,
                referenceMonth: body.referenceMonth,
                plannedAmount: body.plannedAmount.toFixed(2),
            })
            .returning()

        return mapBudgetToDto(row, await computeRealizedAmount(row.categoryId, row.referenceMonth))
    }

    async update(userId: string, id: string, body: UpdateBudgetSchema): Promise<void> {
        await db
            .update(budgets)
            .set({ plannedAmount: body.plannedAmount.toFixed(2), updatedAt: new Date() })
            .where(and(eq(budgets.userId, userId), eq(budgets.id, id)))
    }

    async delete(userId: string, id: string): Promise<void> {
        await db.delete(budgets).where(and(eq(budgets.userId, userId), eq(budgets.id, id)))
    }
}
