import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"
import { NotFoundError } from "@/http/errors/errors"

import type { LoanInstallmentDto } from "../dtos"
import type { LoanInstallmentRepository, LoanRepository } from "../../domain/repositories"

export class FindLoanInstallmentsUseCase {
    constructor(
        private repository: LoanInstallmentRepository,
        private loanRepository: LoanRepository,
    ) {}

    async execute(userId: string, loanId: string, params: PaginationParams): Promise<IPaginated<LoanInstallmentDto>> {
        const loan = await this.loanRepository.get(userId, loanId)
        if (!loan) throw new NotFoundError("Loan not found")

        return this.repository.find(userId, loanId, params)
    }
}
