import type { transactions } from "@/db/schema"

import type { TransactionDto } from "../../app/dtos"

type TransactionRow = typeof transactions.$inferSelect

export function mapInstallmentGroupTransactionToDto(row: TransactionRow, installmentsTotal: number): TransactionDto {
    return {
        id: row.id,
        accountId: row.accountId,
        invoiceId: row.invoiceId,
        creditCardId: null,
        categoryId: row.categoryId,
        type: row.type,
        status: row.status,
        amount: row.amount,
        description: row.description,
        date: row.date.toISOString(),
        tags: row.tags,
        recurrenceId: row.recurrenceId,
        transferId: row.transferId,
        transferMethod: null,
        installmentGroupId: row.installmentGroupId,
        installmentNumber: row.installmentNumber,
        installmentsTotal,
        attachmentUrl: row.attachmentUrl,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}
