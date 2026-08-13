import type { IPaginated } from "@/http/api/response"

import type { TransactionDto } from "../dtos/transaction.dto"
import type { FindTransactionsQuery } from "../schemas/transaction.schema"
import type { TransactionRepository } from "../../domain/repositories/transaction.repository"

export class FindTransactionsUseCase {
    constructor(private repository: TransactionRepository) {}

    async execute(userId: string, query: FindTransactionsQuery): Promise<IPaginated<TransactionDto>> {
        return this.repository.find(userId, query)
    }
}
