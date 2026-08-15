import type { AccountRepository } from "@/modules/account/domain/repositories"
import { NotFoundError } from "@/http/errors/errors"

import type { UpdateLoanSchema } from "../schemas"
import type { LoanRepository } from "../../domain/repositories"

export class UpdateLoanUseCase {
    constructor(
        private repository: LoanRepository,
        private accountRepository: AccountRepository,
    ) {}

    async execute(userId: string, id: string, body: UpdateLoanSchema): Promise<void> {
        const loan = await this.repository.get(userId, id)
        if (!loan) throw new NotFoundError("Loan not found")

        const account = await this.accountRepository.get(userId, body.accountId)
        if (!account) throw new NotFoundError("Account not found")

        await this.repository.update(userId, id, body)
    }
}
