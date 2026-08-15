import type { IPaginated } from "@/http/api/response"

import type { LoanDto } from "../../app/dtos"
import type { CreateLoanSchema, FindLoansQuery, UpdateLoanSchema } from "../../app/schemas"
import type { AmortizationInstallment } from "../services"

export interface LoanRepository {
    find(userId: string, params: FindLoansQuery): Promise<IPaginated<LoanDto>>
    get(userId: string, id: string): Promise<LoanDto | null>
    createWithInstallments(userId: string, loan: CreateLoanSchema, schedule: AmortizationInstallment[]): Promise<LoanDto>
    update(userId: string, id: string, body: UpdateLoanSchema): Promise<void>
    delete(userId: string, id: string): Promise<void>
}

export type { LoanDto }
