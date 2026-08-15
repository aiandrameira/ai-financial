import type { InstallmentGroupDto, TransactionDto } from "../../app/dtos"

import type { CreateTransactionData } from "./transaction.repository"

export type CreateInstallmentGroupData = {
    creditCardId: string
    description: string | null
    totalAmount: string
    installmentsTotal: number
    purchaseDate: Date
}

export interface InstallmentGroupRepository {
    createWithTransactions(
        userId: string,
        group: CreateInstallmentGroupData,
        transactions: Omit<CreateTransactionData, "installmentGroupId">[],
    ): Promise<TransactionDto[]>
    delete(userId: string, id: string): Promise<void>
}

export type { InstallmentGroupDto }
