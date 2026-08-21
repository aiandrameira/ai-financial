import type { transactions } from "@/db/schema"

import type { TransactionDto } from "../../app/dtos"
import type { tpTransferMethodEnum } from "../../domain/enums/tp-transfer-method.enum"

type TransactionRow = typeof transactions.$inferSelect

export function mapTransactionToDto(
    row: TransactionRow,
    transferMethod: tpTransferMethodEnum | null = null,
    creditCardId: string | null = null,
    installmentsTotal: number | null = null,
): TransactionDto {
    return {
        id: row.id,
        accountId: row.accountId,
        invoiceId: row.invoiceId,
        creditCardId,
        categoryId: row.categoryId,
        type: row.type,
        status: row.status,
        amount: row.amount,
        description: row.description,
        date: row.date.toISOString(),
        tags: row.tags,
        recurrenceId: row.recurrenceId,
        transferId: row.transferId,
        transferMethod,
        installmentGroupId: row.installmentGroupId,
        installmentNumber: row.installmentNumber,
        installmentsTotal,
        attachmentUrl: row.attachmentUrl,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}
