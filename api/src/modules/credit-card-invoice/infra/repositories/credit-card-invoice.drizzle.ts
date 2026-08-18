import { and, count, eq, inArray, isNull, lte, sql } from "drizzle-orm"

import { db } from "@/db/client"
import { creditCardInvoices, creditCards, transactions } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

import type { CreditCardInvoiceDto } from "../../app/dtos"
import type { FindCreditCardInvoicesQuery } from "../../app/schemas"
import { stInvoiceEnum } from "../../domain/enums"
import type { CreditCardInvoiceRepository, DueSoonInvoiceDto } from "../../domain/repositories"
import { computeInvoicePeriod } from "../../domain/services"

type InvoiceRow = typeof creditCardInvoices.$inferSelect

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

function toDto(row: InvoiceRow, totalAmount = "0.00"): CreditCardInvoiceDto {
    const status = row.paidAt
        ? stInvoiceEnum.PAID
        : row.closingDate <= new Date()
          ? stInvoiceEnum.CLOSED
          : stInvoiceEnum.OPEN

    return {
        id: row.id,
        creditCardId: row.creditCardId,
        referenceMonth: row.referenceMonth.toISOString(),
        closingDate: row.closingDate.toISOString(),
        dueDate: row.dueDate.toISOString(),
        status,
        totalAmount,
        paidAt: row.paidAt?.toISOString() ?? null,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export class CreditCardInvoiceDrizzleRepository implements CreditCardInvoiceRepository {
    async find(
        userId: string,
        creditCardId: string,
        params: FindCreditCardInvoicesQuery,
    ): Promise<IPaginated<CreditCardInvoiceDto>> {
        const where = and(eq(creditCardInvoices.userId, userId), eq(creditCardInvoices.creditCardId, creditCardId))

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(creditCardInvoices)
                .where(where)
                .orderBy(creditCardInvoices.referenceMonth)
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(creditCardInvoices).where(where),
        ])

        const totals = await computeTotals(rows.map((row) => row.id))

        return {
            data: rows.map((row) => toDto(row, totals.get(row.id))),
            page: params.page,
            size: params.size,
            total,
        }
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
        return toDto(row, totals.get(row.id))
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
            return toDto(existing, totals.get(existing.id))
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

        return toDto(created)
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
