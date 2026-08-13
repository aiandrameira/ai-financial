import { NotFoundError, ValidationError } from "@/http/errors/errors"

import { tpTransactionEnum } from "../../domain/enums/tp-transaction.enum"
import type { TransactionRepository } from "../../domain/repositories"

export class DeleteTransactionUseCase {
    constructor(private repository: TransactionRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const transaction = await this.repository.get(userId, id)
        if (!transaction) throw new NotFoundError("Transaction not found")
        if (transaction.type === tpTransactionEnum.TRANSFER) {
            throw new ValidationError("Transfer transactions cannot be deleted directly")
        }

        await this.repository.delete(userId, id)
    }
}
