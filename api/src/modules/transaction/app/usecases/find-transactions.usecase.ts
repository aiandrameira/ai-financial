import type { IPaginated } from "@/http/api/response"

import type { TransactionDto } from "../dtos"
import type { FindTransactionsQuery } from "../schemas"
import type { TransactionRepository } from "../../domain/repositories"

export class FindTransactionsUseCase {
    constructor(private repository: TransactionRepository) {}

    async execute(userId: string, query: FindTransactionsQuery): Promise<IPaginated<TransactionDto>> {
        return this.repository.find(userId, query)
    }
}
