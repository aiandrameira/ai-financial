import { NotFoundError } from "@/http/errors/errors"

import type { TransactionDto } from "../dtos"
import type { TransactionRepository } from "../../domain/repositories"

export class GetTransactionUseCase {
    constructor(private repository: TransactionRepository) {}

    async execute(userId: string, id: string): Promise<TransactionDto> {
        const transaction = await this.repository.get(userId, id)
        if (!transaction) throw new NotFoundError("Transaction not found")
        return transaction
    }
}
