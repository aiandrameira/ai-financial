import { NotFoundError } from "@/http/errors/errors"
import type { AccountRepository } from "@/modules/account/domain/repositories"
import type { SavingsGoalRepository } from "../../domain/repositories"
import type { SavingsGoalDto } from "../dtos"
import type { CreateSavingsGoalSchema } from "../schemas"

export class CreateSavingsGoalUseCase {
    constructor(
        private repository: SavingsGoalRepository,
        private accountRepository: AccountRepository,
    ) {}

    async execute(userId: string, body: CreateSavingsGoalSchema): Promise<SavingsGoalDto> {
        if (body.linkedAccountId) {
            const account = await this.accountRepository.get(userId, body.linkedAccountId)
            if (!account) throw new NotFoundError("Account not found")
        }

        return this.repository.create(userId, body)
    }
}
