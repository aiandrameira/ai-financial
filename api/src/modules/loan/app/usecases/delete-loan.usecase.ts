import { NotFoundError } from "@/http/errors/errors"

import type { LoanRepository } from "../../domain/repositories"

export class DeleteLoanUseCase {
    constructor(private repository: LoanRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const loan = await this.repository.get(userId, id)
        if (!loan) throw new NotFoundError("Loan not found")

        await this.repository.delete(userId, id)
    }
}
