import { and, count, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { loanInstallments } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { LoanInstallmentDto } from "../../app/dtos"
import { stLoanInstallmentEnum } from "../../domain/enums"
import type { LoanInstallmentRepository } from "../../domain/repositories"

type LoanInstallmentRow = typeof loanInstallments.$inferSelect

function toDto(row: LoanInstallmentRow): LoanInstallmentDto {
    const status = row.paidAt ? stLoanInstallmentEnum.PAID : row.dueDate < new Date() ? stLoanInstallmentEnum.LATE : stLoanInstallmentEnum.PENDING

    return {
        id: row.id,
        loanId: row.loanId,
        number: row.number,
        dueDate: row.dueDate.toISOString(),
        amount: row.amount,
        principalPortion: row.principalPortion,
        interestPortion: row.interestPortion,
        paidAt: row.paidAt?.toISOString() ?? null,
        status,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export class LoanInstallmentDrizzleRepository implements LoanInstallmentRepository {
    async find(userId: string, loanId: string, params: PaginationParams): Promise<IPaginated<LoanInstallmentDto>> {
        const where = and(eq(loanInstallments.userId, userId), eq(loanInstallments.loanId, loanId))

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(loanInstallments)
                .where(where)
                .orderBy(loanInstallments.number)
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: count() }).from(loanInstallments).where(where),
        ])

        return { data: rows.map(toDto), page: params.page, size: params.size, total }
    }

    async get(userId: string, loanId: string, id: string): Promise<LoanInstallmentDto | null> {
        const [row] = await db
            .select()
            .from(loanInstallments)
            .where(and(eq(loanInstallments.userId, userId), eq(loanInstallments.loanId, loanId), eq(loanInstallments.id, id)))

        return row ? toDto(row) : null
    }

    async pay(userId: string, id: string, paidAt: Date): Promise<void> {
        await db
            .update(loanInstallments)
            .set({ paidAt, updatedAt: new Date() })
            .where(and(eq(loanInstallments.userId, userId), eq(loanInstallments.id, id)))
    }
}
