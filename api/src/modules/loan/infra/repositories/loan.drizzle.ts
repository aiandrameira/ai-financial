import { and, eq, inArray, isNotNull, sql } from "drizzle-orm"

import { db } from "@/db/client"
import { loanInstallments, loans } from "@/db/schema"
import type { IPaginated } from "@/http/api/response"

import type { LoanDto } from "../../app/dtos"
import type { CreateLoanSchema, FindLoansQuery, UpdateLoanSchema } from "../../app/schemas"
import type { AmortizationInstallment } from "../../domain/services"
import type { LoanRepository } from "../../domain/repositories"

type LoanRow = typeof loans.$inferSelect

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

function toDto(row: LoanRow, paidPrincipal = "0"): LoanDto {
    const outstandingBalance = (Number(row.principalAmount) - Number(paidPrincipal)).toFixed(2)

    return {
        id: row.id,
        name: row.name,
        type: row.type,
        principalAmount: row.principalAmount,
        interestRate: row.interestRate,
        installmentsTotal: row.installmentsTotal,
        startDate: row.startDate.toISOString(),
        accountId: row.accountId,
        outstandingBalance,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}

export class LoanDrizzleRepository implements LoanRepository {
    async find(userId: string, params: FindLoansQuery): Promise<IPaginated<LoanDto>> {
        const where = eq(loans.userId, userId)

        const [rows, [{ total }]] = await Promise.all([
            db
                .select()
                .from(loans)
                .where(where)
                .orderBy(loans.createdAt)
                .limit(params.size)
                .offset((params.page - 1) * params.size),
            db.select({ total: sql<number>`count(*)` }).from(loans).where(where),
        ])

        const paidPrincipal = await computePaidPrincipal(rows.map((row) => row.id))

        return {
            data: rows.map((row) => toDto(row, paidPrincipal.get(row.id))),
            page: params.page,
            size: params.size,
            total: Number(total),
        }
    }

    async get(userId: string, id: string): Promise<LoanDto | null> {
        const [row] = await db
            .select()
            .from(loans)
            .where(and(eq(loans.userId, userId), eq(loans.id, id)))

        if (!row) return null

        const paidPrincipal = await computePaidPrincipal([row.id])
        return toDto(row, paidPrincipal.get(row.id))
    }

    async createWithInstallments(userId: string, loan: CreateLoanSchema, schedule: AmortizationInstallment[]): Promise<LoanDto> {
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

            return toDto(loanRow)
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
            await tx.delete(loanInstallments).where(and(eq(loanInstallments.userId, userId), eq(loanInstallments.loanId, id)))
            await tx.delete(loans).where(and(eq(loans.userId, userId), eq(loans.id, id)))
        })
    }
}
