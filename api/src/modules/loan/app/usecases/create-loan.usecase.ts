import type { AccountRepository } from "@/modules/account/domain/repositories"
import { NotFoundError } from "@/http/errors/errors"

import type { LoanDto } from "../dtos"
import type { CreateLoanSchema } from "../schemas"
import { computeAmortizationSchedule } from "../../domain/services"
import type { LoanRepository } from "../../domain/repositories"

export class CreateLoanUseCase {
    constructor(
        private repository: LoanRepository,
        private accountRepository: AccountRepository,
    ) {}

    async execute(userId: string, body: CreateLoanSchema): Promise<LoanDto> {
        const account = await this.accountRepository.get(userId, body.accountId)
        if (!account) throw new NotFoundError("Account not found")

        const schedule = computeAmortizationSchedule(body.principalAmount, body.interestRate, body.installmentsTotal, body.startDate)

        return this.repository.createWithInstallments(userId, body, schedule)
    }
}
