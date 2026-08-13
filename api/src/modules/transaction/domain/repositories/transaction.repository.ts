import type { IPaginated } from "@/http/api/response"

import type { TransactionDto } from "../../app/dtos/transaction.dto"
import type { FindTransactionsQuery } from "../../app/schemas/transaction.schema"

export type CreateTransactionData = {
    accountId: string
    categoryId: string | null
    // "transfer" nunca passa por aqui — ver createTransfer, que grava as duas pernas diretamente.
    type: "income" | "expense"
    status: "planned" | "pending" | "completed" | "cancelled"
    // Já assinado (positivo = entrada, negativo = saída) e fixado em 2 casas — ver transaction.dto.ts.
    amount: string
    description: string | null
    date: Date
    tags: string[]
    recurrenceId: string | null
    attachmentUrl: string | null
}

export type CreateTransferData = {
    sourceAccountId: string
    destinationAccountId: string
    amount: string
    description: string | null
    date: Date
    status: "planned" | "pending" | "completed" | "cancelled"
}

export type UpdateTransactionData = Partial<{
    accountId: string
    categoryId: string | null
    status: "planned" | "pending" | "completed" | "cancelled"
    // Já assinado, quando presente — ver CreateTransactionData.
    amount: string
    description: string | null
    date: Date
    tags: string[]
    attachmentUrl: string | null
}>

export interface TransactionRepository {
    find(userId: string, params: FindTransactionsQuery): Promise<IPaginated<TransactionDto>>
    get(userId: string, id: string): Promise<TransactionDto | null>
    findLatestByRecurrence(userId: string, recurrenceId: string): Promise<TransactionDto | null>
    create(userId: string, data: CreateTransactionData): Promise<TransactionDto>
    createTransfer(
        userId: string,
        data: CreateTransferData,
    ): Promise<{ source: TransactionDto; destination: TransactionDto }>
    update(userId: string, id: string, data: UpdateTransactionData): Promise<void>
    delete(userId: string, id: string): Promise<void>
}

export type { TransactionDto }
