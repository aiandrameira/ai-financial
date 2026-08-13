import { ApiResponse } from "@/http/api/response"

import type {
    CreateTransactionSchema,
    CreateTransferSchema,
    FindTransactionsQuery,
    UpdateTransactionSchema,
} from "../../app/schemas"
import type {
    CreateTransactionUseCase,
    CreateTransferUseCase,
    DeleteTransactionUseCase,
    FindTransactionsUseCase,
    GenerateDueRecurrencesUseCase,
    GetTransactionUseCase,
    UpdateTransactionUseCase,
} from "../../app/usecases"

type UseCases = {
    find: FindTransactionsUseCase
    get: GetTransactionUseCase
    create: CreateTransactionUseCase
    update: UpdateTransactionUseCase
    delete: DeleteTransactionUseCase
    createTransfer: CreateTransferUseCase
    generateDueRecurrences: GenerateDueRecurrencesUseCase
}

export class TransactionController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, query: FindTransactionsQuery) {
        const result = await this.usecases.find.execute(userId, query)
        return ApiResponse.paginated(result)
    }

    async get(userId: string, id: string) {
        const transaction = await this.usecases.get.execute(userId, id)
        return ApiResponse.item(transaction)
    }

    async create(userId: string, body: CreateTransactionSchema) {
        const transaction = await this.usecases.create.execute(userId, body)
        return ApiResponse.item(transaction, "Transaction created", 201)
    }

    async update(userId: string, id: string, body: UpdateTransactionSchema) {
        await this.usecases.update.execute(userId, id, body)
        return ApiResponse.success("Transaction updated")
    }

    async delete(userId: string, id: string) {
        await this.usecases.delete.execute(userId, id)
        return ApiResponse.success("Transaction deleted")
    }

    async createTransfer(userId: string, body: CreateTransferSchema) {
        const result = await this.usecases.createTransfer.execute(userId, body)
        return ApiResponse.item(result, "Transfer created", 201)
    }

    async generateDueRecurrences(userId: string) {
        const created = await this.usecases.generateDueRecurrences.execute(userId)
        return ApiResponse.list(created, `${created.length} occurrence(s) generated`)
    }
}
