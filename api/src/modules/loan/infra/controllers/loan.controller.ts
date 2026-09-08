import { ApiResponse } from "@/http/api/response"
import type { CursorPaginationParams } from "@/http/api/schema/schemas"

import type { CreateLoanSchema, FindLoansQuery, PayLoanInstallmentSchema, UpdateLoanSchema } from "../../app/schemas"
import type {
    CreateLoanUseCase,
    DeleteLoanUseCase,
    FindLoanInstallmentsUseCase,
    FindLoansUseCase,
    GetLoanUseCase,
    PayLoanInstallmentUseCase,
    UpdateLoanUseCase,
} from "../../app/usecases"

type UseCases = {
    find: FindLoansUseCase
    get: GetLoanUseCase
    create: CreateLoanUseCase
    update: UpdateLoanUseCase
    delete: DeleteLoanUseCase
    findInstallments: FindLoanInstallmentsUseCase
    payInstallment: PayLoanInstallmentUseCase
}

export class LoanController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, params: FindLoansQuery) {
        const result = await this.usecases.find.execute(userId, params)
        return ApiResponse.cursorPaginated(result)
    }

    async get(userId: string, id: string) {
        const loan = await this.usecases.get.execute(userId, id)
        return ApiResponse.item(loan)
    }

    async create(userId: string, body: CreateLoanSchema) {
        const loan = await this.usecases.create.execute(userId, body)
        return ApiResponse.item(loan, "Loan created", 201)
    }

    async update(userId: string, id: string, body: UpdateLoanSchema) {
        await this.usecases.update.execute(userId, id, body)
        return ApiResponse.success("Loan updated")
    }

    async delete(userId: string, id: string) {
        await this.usecases.delete.execute(userId, id)
        return ApiResponse.success("Loan deleted")
    }

    async findInstallments(userId: string, loanId: string, params: CursorPaginationParams) {
        const result = await this.usecases.findInstallments.execute(userId, loanId, params)
        return ApiResponse.cursorPaginated(result)
    }

    async payInstallment(userId: string, loanId: string, id: string, body: PayLoanInstallmentSchema) {
        await this.usecases.payInstallment.execute(userId, loanId, id, body)
        return ApiResponse.success("Installment paid")
    }
}
