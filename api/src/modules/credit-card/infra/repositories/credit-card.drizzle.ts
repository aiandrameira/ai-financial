import { type AnyColumn, and, count, eq, isNull } from "drizzle-orm"

import { db } from "@/db/client"
import { creditCards } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { CreditCardDto } from "../../app/dtos"
import type { CreateCreditCardSchema, UpdateCreditCardSchema } from "../../app/schemas"
import type { CreditCardRepository, CreditCardSortColumn, FindCreditCardsParams } from "../../domain/repositories"
import { mapCreditCardToDto } from "../mappers"

type SortStrategy = {
    column: AnyColumn
    getValue: (row: CreditCardDto) => string
    parseValue?: (value: string | number) => unknown
}

const SORT_STRATEGIES: Record<CreditCardSortColumn, SortStrategy> = {
    name: { column: creditCards.name, getValue: (row) => row.name },
    network: { column: creditCards.network, getValue: (row) => row.network },
    createdAt: { column: creditCards.createdAt, getValue: (row) => row.createdAt, parseValue: (value) => new Date(value) },
}

export class CreditCardDrizzleRepository implements CreditCardRepository {
    async find(userId: string, params: FindCreditCardsParams): Promise<ICursorPaginated<CreditCardDto>> {
        const filterWhere = and(eq(creditCards.userId, userId), isNull(creditCards.archivedAt))

        const strategy = SORT_STRATEGIES[params.sortBy]
        const sort = { column: strategy.column, direction: params.sortDirection, parseValue: strategy.parseValue }
        const cursorCondition = cursorWhere({ id: creditCards.id }, params, sort)
        const pageWhere = cursorCondition ? and(filterWhere, cursorCondition) : filterWhere

        const rowsQuery = db
            .select()
            .from(creditCards)
            .where(pageWhere)
            .orderBy(...cursorOrder({ id: creditCards.id }, params, sort))
            .limit(params.limit + 1)

        const totalQuery = params.includeTotal ? db.select({ total: count() }).from(creditCards).where(filterWhere) : undefined

        const [rows, totalResult] = await Promise.all([rowsQuery, totalQuery])
        const total = totalResult ? totalResult[0].total : undefined
        const data = rows.map(mapCreditCardToDto)

        return buildCursorPage(data, params.limit, params, total, { getValue: strategy.getValue })
    }

    async get(userId: string, id: string): Promise<CreditCardDto | null> {
        const [row] = await db
            .select()
            .from(creditCards)
            .where(and(eq(creditCards.userId, userId), eq(creditCards.id, id)))

        return row ? mapCreditCardToDto(row) : null
    }

    async create(userId: string, body: CreateCreditCardSchema): Promise<CreditCardDto> {
        const [row] = await db
            .insert(creditCards)
            .values({
                userId,
                name: body.name,
                accountId: body.accountId,
                institution: body.institution,
                limitAmount: body.limitAmount.toFixed(2),
                closingDay: body.closingDay,
                dueDay: body.dueDay,
                network: body.network,
                icon: body.icon,
            })
            .returning()

        return mapCreditCardToDto(row)
    }

    async update(userId: string, id: string, body: UpdateCreditCardSchema): Promise<void> {
        await db
            .update(creditCards)
            .set({
                ...body,
                limitAmount: body.limitAmount !== undefined ? body.limitAmount.toFixed(2) : undefined,
                updatedAt: new Date(),
            })
            .where(and(eq(creditCards.userId, userId), eq(creditCards.id, id)))
    }

    async archive(userId: string, id: string): Promise<void> {
        await db
            .update(creditCards)
            .set({ archivedAt: new Date(), updatedAt: new Date() })
            .where(and(eq(creditCards.userId, userId), eq(creditCards.id, id)))
    }

    async restore(userId: string, id: string): Promise<void> {
        await db
            .update(creditCards)
            .set({ archivedAt: null, updatedAt: new Date() })
            .where(and(eq(creditCards.userId, userId), eq(creditCards.id, id)))
    }
}
