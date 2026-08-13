import { NotFoundError, ValidationError } from "@/http/errors/errors"

import type { TransactionRepository } from "../../domain/repositories/transaction.repository"

export class DeleteTransactionUseCase {
    constructor(private repository: TransactionRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const transaction = await this.repository.get(userId, id)
        if (!transaction) throw new NotFoundError("Transaction not found")
        if (transaction.type === "transfer") {
            throw new ValidationError("Transfer transactions cannot be deleted directly")
        }

        await this.repository.delete(userId, id)
    }
}
