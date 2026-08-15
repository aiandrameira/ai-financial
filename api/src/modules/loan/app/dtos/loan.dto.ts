import type { tpLoanEnum } from "../../domain/enums"

export type LoanDto = {
    id: string
    name: string
    type: tpLoanEnum
    principalAmount: string
    interestRate: string
    installmentsTotal: number
    startDate: string
    accountId: string
    outstandingBalance: string
    createdAt: string
    updatedAt: string
}
