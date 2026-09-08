import { and, count, eq, inArray, isNull, lte, sql } from "drizzle-orm"

import { db } from "@/db/client"
import { creditCardInvoices, creditCards, transactions } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { CreditCardInvoiceDto } from "../../app/dtos"
import type { FindCreditCardInvoicesQuery } from "../../app/schemas"
import type { CreditCardInvoiceRepository, DueSoonInvoiceDto } from "../../domain/repositories"
import { computeInvoicePeriod } from "../../domain/services"
import { mapCreditCardInvoiceToDto } from "../mappers"

async function computeTotals(invoiceIds: string[]): Promise<Map<string, string>> {
    if (invoiceIds.length === 0) return new Map()

    const rows = await db
        .select({
            invoiceId: transactions.invoiceId,
            total: sql<string>`coalesce(sum(${transactions.amount}), 0)`,
        })
        .from(transactions)
        .where(inArray(transactions.invoiceId, invoiceIds))
        .groupBy(transactions.invoiceId)

    return new Map(rows.map((row) => [row.invoiceId as string, row.total]))
}

export class CreditCardInvoiceDrizzleRepository implements CreditCardInvoiceRepository {
    async find(
        userId: string,
        creditCardId: string,
        params: FindCreditCardInvoicesQuery,
    ): Promise<ICursorPaginated<CreditCardInvoiceDto>> {
        const where = and(eq(creditCardInvoices.userId, userId), eq(creditCardInvoices.creditCardId, creditCardId))

        const sort = {
            column: creditCardInvoices.referenceMonth,
            direction: "asc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const pageWhere = and(where, cursorWhere({ id: creditCardInvoices.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select()
                .from(creditCardInvoices)
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: creditCardInvoices.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(creditCardInvoices).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        const totals = await computeTotals(rows.map((row) => row.id))

        return buildCursorPage(
            rows.map((row) => mapCreditCardInvoiceToDto(row, totals.get(row.id))),
            params.limit,
            params,
            total,
            { getValue: (row: CreditCardInvoiceDto) => row.referenceMonth },
        )
    }

    async get(userId: string, creditCardId: string, id: string): Promise<CreditCardInvoiceDto | null> {
        const [row] = await db
            .select()
            .from(creditCardInvoices)
            .where(
                and(
                    eq(creditCardInvoices.userId, userId),
                    eq(creditCardInvoices.creditCardId, creditCardId),
                    eq(creditCardInvoices.id, id),
                ),
            )

        if (!row) return null

        const totals = await computeTotals([row.id])
        return mapCreditCardInvoiceToDto(row, totals.get(row.id))
    }

    async getOrCreateForDate(
        userId: string,
        creditCardId: string,
        closingDay: number,
        dueDay: number,
        date: Date,
    ): Promise<CreditCardInvoiceDto> {
        const period = computeInvoicePeriod(date, closingDay, dueDay)

        const [existing] = await db
            .select()
            .from(creditCardInvoices)
            .where(
                and(
                    eq(creditCardInvoices.userId, userId),
                    eq(creditCardInvoices.creditCardId, creditCardId),
                    eq(creditCardInvoices.referenceMonth, period.referenceMonth),
                ),
            )

        if (existing) {
            const totals = await computeTotals([existing.id])
            return mapCreditCardInvoiceToDto(existing, totals.get(existing.id))
        }

        const [created] = await db
            .insert(creditCardInvoices)
            .values({
                userId,
                creditCardId,
                referenceMonth: period.referenceMonth,
                closingDate: period.closingDate,
                dueDate: period.dueDate,
            })
            .returning()

        return mapCreditCardInvoiceToDto(created)
    }

    async pay(userId: string, id: string, paidAt: Date): Promise<void> {
        await db
            .update(creditCardInvoices)
            .set({ paidAt, updatedAt: new Date() })
            .where(and(eq(creditCardInvoices.userId, userId), eq(creditCardInvoices.id, id)))
    }

    async findDueSoon(maxDueDate: Date): Promise<DueSoonInvoiceDto[]> {
        const rows = await db
            .select({
                id: creditCardInvoices.id,
                userId: creditCardInvoices.userId,
                cardName: creditCards.name,
                dueDate: creditCardInvoices.dueDate,
            })
            .from(creditCardInvoices)
            .innerJoin(creditCards, eq(creditCards.id, creditCardInvoices.creditCardId))
            .where(and(isNull(creditCardInvoices.paidAt), lte(creditCardInvoices.dueDate, maxDueDate)))

        return rows.map((row) => ({ ...row, dueDate: row.dueDate.toISOString() }))
    }
}
