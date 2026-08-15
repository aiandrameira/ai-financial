import type { stTransactionEnum } from "../../domain/enums/st-transaction.enum"
import type { tpTransactionEnum } from "../../domain/enums/tp-transaction.enum"
import type { tpTransferMethodEnum } from "../../domain/enums/tp-transfer-method.enum"

export type TransactionDto = {
    id: string
    accountId: string | null
    invoiceId: string | null
    creditCardId: string | null
    categoryId: string | null
    type: tpTransactionEnum
    status: stTransactionEnum
    amount: string
    description: string | null
    date: string
    tags: string[]
    recurrenceId: string | null
    transferId: string | null
    transferMethod: tpTransferMethodEnum | null
    installmentGroupId: string | null
    installmentNumber: number | null
    installmentsTotal: number | null
    attachmentUrl: string | null
    createdAt: string
    updatedAt: string
}
