import { type AnyColumn, and, count, eq, inArray, isNull, sql } from "drizzle-orm"

import { db } from "@/db/client"
import { accounts, transactions } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { AccountDto } from "../../app/dtos"
import type { CreateAccountSchema, UpdateAccountSchema } from "../../app/schemas"
import type { AccountRepository, AccountSortColumn, FindAccountsParams } from "../../domain/repositories"
import { type Balances, mapAccountToDto } from "../mappers"

type SortStrategy = {
    column: AnyColumn
    getValue: (row: AccountDto) => string
    parseValue?: (value: string | number) => unknown
}

const SORT_STRATEGIES: Record<AccountSortColumn, SortStrategy> = {
    name: { column: accounts.name, getValue: (row) => row.name },
    type: { column: accounts.type, getValue: (row) => row.type },
    createdAt: { column: accounts.createdAt, getValue: (row) => row.createdAt, parseValue: (value) => new Date(value) },
}

async function computeBalances(accountIds: string[]): Promise<Map<string, Balances>> {
    if (accountIds.length === 0) return new Map()

    const rows = await db
        .select({
            accountId: transactions.accountId,
            current: sql<string>`coalesce(sum(${transactions.amount}) filter (where ${transactions.status} = 'completed'), 0)`,
            projected: sql<string>`coalesce(sum(${transactions.amount}) filter (where ${transactions.status} in ('completed', 'planned', 'pending')), 0)`,
        })
        .from(transactions)
        .where(inArray(transactions.accountId, accountIds))
        .groupBy(transactions.accountId)

    return new Map(rows.map((row) => [row.accountId as string, { current: row.current, projected: row.projected }]))
}

export class AccountDrizzleRepository implements AccountRepository {
    async find(userId: string, params: FindAccountsParams): Promise<ICursorPaginated<AccountDto>> {
        const filterWhere = and(eq(accounts.userId, userId), isNull(accounts.archivedAt))

        const strategy = SORT_STRATEGIES[params.sortBy]
        const sort = { column: strategy.column, direction: params.sortDirection, parseValue: strategy.parseValue }
        const cursorCondition = cursorWhere({ id: accounts.id }, params, sort)
        const pageWhere = cursorCondition ? and(filterWhere, cursorCondition) : filterWhere

        const rowsQuery = db
            .select()
            .from(accounts)
            .where(pageWhere)
            .orderBy(...cursorOrder({ id: accounts.id }, params, sort))
            .limit(params.limit + 1)

        const totalQuery = params.includeTotal ? db.select({ total: count() }).from(accounts).where(filterWhere) : undefined

        const [rows, totalResult] = await Promise.all([rowsQuery, totalQuery])
        const total = totalResult ? totalResult[0].total : undefined

        const balances = await computeBalances(rows.map((row) => row.id))
        const data = rows.map((row) => mapAccountToDto(row, balances.get(row.id)))

        return buildCursorPage(data, params.limit, params, total, { getValue: strategy.getValue })
    }

    async get(userId: string, id: string): Promise<AccountDto | null> {
        const [row] = await db
            .select()
            .from(accounts)
            .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))

        if (!row) return null

        const balances = await computeBalances([row.id])
        return mapAccountToDto(row, balances.get(row.id))
    }

    async create(userId: string, body: CreateAccountSchema): Promise<AccountDto> {
        const [row] = await db
            .insert(accounts)
            .values({
                userId,
                name: body.name,
                type: body.type,
                institution: body.institution,
                initialBalance: body.initialBalance.toFixed(2),
                color: body.color,
                icon: body.icon,
            })
            .returning()

        return mapAccountToDto(row)
    }

    async update(userId: string, id: string, body: UpdateAccountSchema): Promise<void> {
        await db
            .update(accounts)
            .set({
                ...body,
                initialBalance: body.initialBalance !== undefined ? body.initialBalance.toFixed(2) : undefined,
                updatedAt: new Date(),
            })
            .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))
    }

    async archive(userId: string, id: string): Promise<void> {
        await db
            .update(accounts)
            .set({ archivedAt: new Date(), updatedAt: new Date() })
            .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))
    }

    async restore(userId: string, id: string): Promise<void> {
        await db
            .update(accounts)
            .set({ archivedAt: null, updatedAt: new Date() })
            .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))
    }
}
