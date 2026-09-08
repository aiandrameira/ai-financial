import { ilike, count, and, eq, inArray, isNotNull, sql } from "drizzle-orm"

import { db } from "@/db/client"
import { loanInstallments, loans } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"

import type { LoanDto } from "../../app/dtos"
import type { CreateLoanSchema, FindLoansQuery, UpdateLoanSchema } from "../../app/schemas"
import type { LoanRepository } from "../../domain/repositories"
import type { AmortizationInstallment } from "../../domain/services"
import { mapLoanToDto } from "../mappers"

async function computePaidPrincipal(loanIds: string[]): Promise<Map<string, string>> {
    if (loanIds.length === 0) return new Map()

    const rows = await db
        .select({
            loanId: loanInstallments.loanId,
            paidPrincipal: sql<string>`coalesce(sum(${loanInstallments.principalPortion}), 0)`,
        })
        .from(loanInstallments)
        .where(and(inArray(loanInstallments.loanId, loanIds), isNotNull(loanInstallments.paidAt)))
        .groupBy(loanInstallments.loanId)

    return new Map(rows.map((row) => [row.loanId, row.paidPrincipal]))
}

export class LoanDrizzleRepository implements LoanRepository {
    async find(userId: string, params: FindLoansQuery): Promise<ICursorPaginated<LoanDto>> {
        const where = and(eq(loans.userId, userId), params.query ? ilike(loans.name, `%${params.query}%`) : undefined)

        const sort = {
            column: loans.createdAt,
            direction: "asc" as const,
            parseValue: (value: string | number) => new Date(value),
        }
        const pageWhere = and(where, cursorWhere({ id: loans.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select()
                .from(loans)
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: loans.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(loans).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        const paidPrincipal = await computePaidPrincipal(rows.map((row) => row.id))

        return buildCursorPage(
            rows.map((row) => mapLoanToDto(row, paidPrincipal.get(row.id))),
            params.limit,
            params,
            total,
            { getValue: (row: LoanDto) => row.createdAt },
        )
    }

    async get(userId: string, id: string): Promise<LoanDto | null> {
        const [row] = await db
            .select()
            .from(loans)
            .where(and(eq(loans.userId, userId), eq(loans.id, id)))

        if (!row) return null

        const paidPrincipal = await computePaidPrincipal([row.id])
        return mapLoanToDto(row, paidPrincipal.get(row.id))
    }

    async createWithInstallments(
        userId: string,
        loan: CreateLoanSchema,
        schedule: AmortizationInstallment[],
    ): Promise<LoanDto> {
        return db.transaction(async (tx) => {
            const [loanRow] = await tx
                .insert(loans)
                .values({
                    userId,
                    name: loan.name,
                    type: loan.type,
                    principalAmount: loan.principalAmount.toFixed(2),
                    interestRate: loan.interestRate.toFixed(4),
                    installmentsTotal: loan.installmentsTotal,
                    startDate: loan.startDate,
                    accountId: loan.accountId,
                })
                .returning()

            await tx.insert(loanInstallments).values(
                schedule.map((installment) => ({
                    userId,
                    loanId: loanRow.id,
                    number: installment.number,
                    dueDate: installment.dueDate,
                    amount: installment.amount.toFixed(2),
                    principalPortion: installment.principalPortion.toFixed(2),
                    interestPortion: installment.interestPortion.toFixed(2),
                })),
            )

            return mapLoanToDto(loanRow)
        })
    }

    async update(userId: string, id: string, body: UpdateLoanSchema): Promise<void> {
        await db
            .update(loans)
            .set({ name: body.name, type: body.type, accountId: body.accountId, updatedAt: new Date() })
            .where(and(eq(loans.userId, userId), eq(loans.id, id)))
    }

    async delete(userId: string, id: string): Promise<void> {
        await db.transaction(async (tx) => {
            await tx
                .delete(loanInstallments)
                .where(and(eq(loanInstallments.userId, userId), eq(loanInstallments.loanId, id)))
            await tx.delete(loans).where(and(eq(loans.userId, userId), eq(loans.id, id)))
        })
    }
}
