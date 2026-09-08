import type { ICursorPaginated } from "@/http/api/response"
import type { CursorPaginationParams } from "@/http/api/schema/schemas"

import type { LoanInstallmentDto } from "../../app/dtos"

export type DueSoonInstallmentDto = {
    id: string
    userId: string
    loanName: string
    installmentNumber: number
    dueDate: string
}

export interface LoanInstallmentRepository {
    find(userId: string, loanId: string, params: CursorPaginationParams): Promise<ICursorPaginated<LoanInstallmentDto>>
    get(userId: string, loanId: string, id: string): Promise<LoanInstallmentDto | null>
    pay(userId: string, id: string, paidAt: Date): Promise<void>
    findDueSoon(maxDueDate: Date): Promise<DueSoonInstallmentDto[]>
}

export type { LoanInstallmentDto }
