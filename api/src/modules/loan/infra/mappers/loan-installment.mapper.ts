import type { loanInstallments } from "@/db/schema"

import type { LoanInstallmentDto } from "../../app/dtos"
import { stLoanInstallmentEnum } from "../../domain/enums"

type LoanInstallmentRow = typeof loanInstallments.$inferSelect

export function mapLoanInstallmentToDto(row: LoanInstallmentRow): LoanInstallmentDto {
    const status = row.paidAt
        ? stLoanInstallmentEnum.PAID
        : row.dueDate < new Date()
          ? stLoanInstallmentEnum.LATE
          : stLoanInstallmentEnum.PENDING

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
