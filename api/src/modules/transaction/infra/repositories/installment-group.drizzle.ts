import { and, eq } from "drizzle-orm"

import { db } from "@/db/client"
import { installmentGroups, transactions } from "@/db/schema"

import type { TransactionDto } from "../../app/dtos"
import type { CreateInstallmentGroupData, CreateTransactionData, InstallmentGroupRepository } from "../../domain/repositories"

type TransactionRow = typeof transactions.$inferSelect

function toDto(row: TransactionRow, installmentsTotal: number): TransactionDto {
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

export class InstallmentGroupDrizzleRepository implements InstallmentGroupRepository {
    async createWithTransactions(
        userId: string,
        group: CreateInstallmentGroupData,
        installments: Omit<CreateTransactionData, "installmentGroupId">[],
    ): Promise<TransactionDto[]> {
        return db.transaction(async (tx) => {
            const [groupRow] = await tx
                .insert(installmentGroups)
                .values({
                    userId,
                    creditCardId: group.creditCardId,
                    description: group.description,
                    totalAmount: group.totalAmount,
                    installmentsTotal: group.installmentsTotal,
                    purchaseDate: group.purchaseDate,
                })
                .returning()

            const rows = await tx
                .insert(transactions)
                .values(
                    installments.map((installment) => ({
                        userId,
                        accountId: installment.accountId,
                        invoiceId: installment.invoiceId,
                        categoryId: installment.categoryId,
                        type: installment.type,
                        status: installment.status,
                        amount: installment.amount,
                        description: installment.description,
                        date: installment.date,
                        tags: installment.tags,
                        recurrenceId: installment.recurrenceId,
                        installmentGroupId: groupRow.id,
                        installmentNumber: installment.installmentNumber,
                        attachmentUrl: installment.attachmentUrl,
                    })),
                )
                .returning()

            return rows.map((row) => toDto(row, groupRow.installmentsTotal))
        })
    }

    async delete(userId: string, id: string): Promise<void> {
        await db.delete(installmentGroups).where(and(eq(installmentGroups.userId, userId), eq(installmentGroups.id, id)))
    }
}
