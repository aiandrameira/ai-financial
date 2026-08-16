import type { AccountRepository } from "@/modules/account/domain/repositories"
import { NotFoundError } from "@/http/errors/errors"

import type { UpdateSavingsGoalSchema } from "../schemas"
import type { SavingsGoalRepository } from "../../domain/repositories"

export class UpdateSavingsGoalUseCase {
    constructor(
        private repository: SavingsGoalRepository,
        private accountRepository: AccountRepository,
    ) {}

    async execute(userId: string, id: string, body: UpdateSavingsGoalSchema): Promise<void> {
        const goal = await this.repository.get(userId, id)
        if (!goal) throw new NotFoundError("Savings goal not found")

        if (body.linkedAccountId) {
            const account = await this.accountRepository.get(userId, body.linkedAccountId)
            if (!account) throw new NotFoundError("Account not found")
        }

        await this.repository.update(userId, id, body)
    }
}
