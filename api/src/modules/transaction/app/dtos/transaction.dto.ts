import type { stTransactionEnum } from "../../domain/enums/st-transaction.enum"
import type { tpTransactionEnum } from "../../domain/enums/tp-transaction.enum"

export type TransactionDto = {
    id: string
    accountId: string
    categoryId: string | null
    type: tpTransactionEnum
    status: stTransactionEnum
    amount: string
    description: string | null
    date: string
    tags: string[]
    recurrenceId: string | null
    transferId: string | null
    attachmentUrl: string | null
    createdAt: string
    updatedAt: string
}
