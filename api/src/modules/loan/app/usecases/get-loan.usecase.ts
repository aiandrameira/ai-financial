import { NotFoundError } from "@/http/errors/errors"

import type { LoanDto } from "../dtos"
import type { LoanRepository } from "../../domain/repositories"

export class GetLoanUseCase {
    constructor(private repository: LoanRepository) {}

    async execute(userId: string, id: string): Promise<LoanDto> {
        const loan = await this.repository.get(userId, id)
        if (!loan) throw new NotFoundError("Loan not found")
        return loan
    }
}
