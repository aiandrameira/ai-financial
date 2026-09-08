import type { ICursorPaginated } from "@/http/api/response"

import type { TransactionDto } from "../dtos"
import type { FindTransactionsQuery } from "../schemas"
import type { TransactionRepository } from "../../domain/repositories"

export class FindTransactionsUseCase {
    constructor(private repository: TransactionRepository) {}

    async execute(userId: string, query: FindTransactionsQuery): Promise<ICursorPaginated<TransactionDto>> {
        return this.repository.find(userId, query)
    }
}
