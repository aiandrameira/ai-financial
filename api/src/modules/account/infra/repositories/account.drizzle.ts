import { and, count, eq, inArray, isNull, sql } from "drizzle-orm"

import { db } from "@/db/client"
import { accounts, transactions } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { AccountDto } from "../../app/dtos/account.dto"
import type { CreateAccountSchema, UpdateAccountSchema } from "../../app/schemas/account.schema"
import type { AccountRepository } from "../../domain/repositories/account.repository"

type AccountRow = typeof accounts.$inferSelect
type Balances = { current: string; projected: string }

// Amount é sempre armazenado em centavos inteiros no cálculo para evitar erro de ponto flutuante
// em soma decimal — ver docs/planning.md seção 5.1 ("valores derivados não são fonte de verdade").
function addDecimal(a: string, b: string): string {
    const toCents = (value: string) => Math.round(Number(value) * 100)
    return ((toCents(a) + toCents(b)) / 100).toFixed(2)
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

    return new Map(rows.map((row) => [row.accountId, { current: row.current, projected: row.projected }]))
}

function toDto(row: AccountRow, balances?: Balances): AccountDto {
    const current = balances?.current ?? "0"
    const projected = balances?.projected ?? "0"

    return {
        id: row.id,
        name: row.name,
        type: row.type,
        institution: row.institution,
        initialBalance: row.initialBalance,
        currentBalance: addDecimal(row.initialBalance, current),
        projectedBalance: addDecimal(row.initialBalance, projected),
        color: row.color,
        icon: row.icon,
        archivedAt: row.archivedAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export class AccountDrizzleRepository implements AccountRepository {
    async find(userId: string, params: PaginationParams): Promise<IPaginated<AccountDto>> {
        const where = and(eq(accounts.userId, userId), isNull(accounts.archivedAt))

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(accounts)
                .where(where)
                .orderBy(accounts.createdAt)
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(accounts).where(where),
        ])

        const balances = await computeBalances(rows.map((row) => row.id))

        return {
            data: rows.map((row) => toDto(row, balances.get(row.id))),
            page: params.page,
            size: params.size,
            total,
        }
    }

    async get(userId: string, id: string): Promise<AccountDto | null> {
        const [row] = await db
            .select()
            .from(accounts)
            .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))

        if (!row) return null

        const balances = await computeBalances([row.id])
        return toDto(row, balances.get(row.id))
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

        return toDto(row)
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
