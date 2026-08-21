import type { loans } from "@/db/schema"

import type { LoanDto } from "../../app/dtos"

type LoanRow = typeof loans.$inferSelect

export function mapLoanToDto(row: LoanRow, paidPrincipal = "0"): LoanDto {
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
