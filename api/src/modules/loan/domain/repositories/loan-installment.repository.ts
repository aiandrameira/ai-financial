import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { LoanInstallmentDto } from "../../app/dtos"

export interface LoanInstallmentRepository {
    find(userId: string, loanId: string, params: PaginationParams): Promise<IPaginated<LoanInstallmentDto>>
    get(userId: string, loanId: string, id: string): Promise<LoanInstallmentDto | null>
    pay(userId: string, id: string, paidAt: Date): Promise<void>
}

export type { LoanInstallmentDto }
