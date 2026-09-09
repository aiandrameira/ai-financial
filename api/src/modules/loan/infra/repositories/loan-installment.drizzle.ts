import { and, asc, count, eq, isNull, lte } from "drizzle-orm"

import { db } from "@/db/client"
import { loanInstallments, loans } from "@/db/schema"
import { buildCursorPage, cursorOrder, cursorWhere } from "@/http/api/cursor"
import type { ICursorPaginated } from "@/http/api/response"
import type { CursorPaginationParams } from "@/http/api/schema/schemas"

import type { LoanInstallmentDto } from "../../app/dtos"
import type { DueSoonInstallmentDto, LoanInstallmentRepository } from "../../domain/repositories"
import { mapLoanInstallmentToDto } from "../mappers"

export class LoanInstallmentDrizzleRepository implements LoanInstallmentRepository {
    async find(
        userId: string,
        loanId: string,
        params: CursorPaginationParams,
    ): Promise<ICursorPaginated<LoanInstallmentDto>> {
        const where = and(eq(loanInstallments.userId, userId), eq(loanInstallments.loanId, loanId))

        const sort = { column: loanInstallments.number, direction: "asc" as const }
        const pageWhere = and(where, cursorWhere({ id: loanInstallments.id }, params, sort))

        const [rows, totalResult] = await Promise.all([
            db
                .select()
                .from(loanInstallments)
                .where(pageWhere)
                .orderBy(...cursorOrder({ id: loanInstallments.id }, params, sort))
                .limit(params.limit + 1),
            params.includeTotal ? db.select({ total: count() }).from(loanInstallments).where(where) : undefined,
        ])
        const total = totalResult?.[0].total

        return buildCursorPage(rows.map(mapLoanInstallmentToDto), params.limit, params, total, {
            getValue: (row: LoanInstallmentDto) => row.number,
        })
    }

    async get(userId: string, loanId: string, id: string): Promise<LoanInstallmentDto | null> {
        const [row] = await db
            .select()
            .from(loanInstallments)
            .where(
                and(
                    eq(loanInstallments.userId, userId),
                    eq(loanInstallments.loanId, loanId),
                    eq(loanInstallments.id, id),
                ),
            )

        return row ? mapLoanInstallmentToDto(row) : null
    }

    async pay(userId: string, id: string, paidAt: Date): Promise<void> {
        await db
            .update(loanInstallments)
            .set({ paidAt, updatedAt: new Date() })
            .where(and(eq(loanInstallments.userId, userId), eq(loanInstallments.id, id)))
    }

    async findDueSoon(maxDueDate: Date): Promise<DueSoonInstallmentDto[]> {
        const rows = await db
            .select({
                id: loanInstallments.id,
                userId: loanInstallments.userId,
                loanName: loans.name,
                installmentNumber: loanInstallments.number,
                dueDate: loanInstallments.dueDate,
            })
            .from(loanInstallments)
            .innerJoin(loans, eq(loans.id, loanInstallments.loanId))
            .where(and(isNull(loanInstallments.paidAt), lte(loanInstallments.dueDate, maxDueDate)))

        return rows.map((row) => ({ ...row, dueDate: row.dueDate.toISOString() }))
    }

    async findNextUnpaid(userId: string, loanId: string): Promise<LoanInstallmentDto | null> {
        const [row] = await db
            .select()
            .from(loanInstallments)
            .where(
                and(
                    eq(loanInstallments.userId, userId),
                    eq(loanInstallments.loanId, loanId),
                    isNull(loanInstallments.paidAt),
                ),
            )
            .orderBy(asc(loanInstallments.number))
            .limit(1)

        return row ? mapLoanInstallmentToDto(row) : null
    }
}
