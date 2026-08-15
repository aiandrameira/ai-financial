import type { stLoanInstallmentEnum } from "../../domain/enums"

export type LoanInstallmentDto = {
    id: string
    loanId: string
    number: number
    dueDate: string
    amount: string
    principalPortion: string
    interestPortion: string
    paidAt: string | null
    status: stLoanInstallmentEnum
    createdAt: string
    updatedAt: string
}
