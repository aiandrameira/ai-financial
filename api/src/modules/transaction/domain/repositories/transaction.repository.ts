import type { IPaginated } from "@/http/api/response"

import type { TransactionDto } from "../../app/dtos"
import type { FindTransactionsQuery } from "../../app/schemas"
import type { stTransactionEnum } from "../enums/st-transaction.enum"
import type { tpTransactionEnum } from "../enums/tp-transaction.enum"
import type { tpTransferMethodEnum } from "../enums/tp-transfer-method.enum"

export type CreateTransactionData = {
    accountId: string | null
    invoiceId: string | null
    categoryId: string | null
    type: Exclude<tpTransactionEnum, tpTransactionEnum.TRANSFER>
    status: stTransactionEnum
    amount: string
    description: string | null
    date: Date
    tags: string[]
    recurrenceId: string | null
    installmentGroupId: string | null
    installmentNumber: number | null
    attachmentUrl: string | null
}

export type CreateTransferData = {
    sourceAccountId: string
    destinationAccountId: string
    amount: string
    description: string | null
    date: Date
    status: stTransactionEnum
    method: tpTransferMethodEnum
}

export type UpdateTransactionData = Partial<{
    accountId: string | null
    invoiceId: string | null
    categoryId: string | null
    status: stTransactionEnum
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
    deleteTransfer(userId: string, transferId: string): Promise<boolean>
    deleteByInstallmentGroup(userId: string, installmentGroupId: string): Promise<void>
}

export type { TransactionDto }
