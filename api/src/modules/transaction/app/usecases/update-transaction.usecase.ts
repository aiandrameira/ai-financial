import type { AccountRepository } from "@/modules/account/domain/repositories"
import type { CategoryRepository } from "@/modules/category/domain/repositories"
import { NotFoundError, ValidationError } from "@/http/errors/errors"

import type { UpdateTransactionSchema } from "../schemas"
import { tpTransactionEnum } from "../../domain/enums/tp-transaction.enum"
import { matchesCategoryType } from "../../domain/services"
import type { TransactionRepository } from "../../domain/repositories"

export class UpdateTransactionUseCase {
    constructor(
        private repository: TransactionRepository,
        private accountRepository: AccountRepository,
        private categoryRepository: CategoryRepository,
    ) {}

    async execute(userId: string, id: string, body: UpdateTransactionSchema): Promise<void> {
        const transaction = await this.repository.get(userId, id)
        if (!transaction) throw new NotFoundError("Transaction not found")
        if (transaction.type === tpTransactionEnum.TRANSFER) {
            throw new ValidationError("Transfer transactions cannot be edited directly")
        }

        if (body.accountId) {
            const account = await this.accountRepository.get(userId, body.accountId)
            if (!account) throw new NotFoundError("Account not found")
        }

        const nextType = body.type ?? transaction.type
        if (body.categoryId) {
            const category = await this.categoryRepository.get(userId, body.categoryId)
            if (!category) throw new NotFoundError("Category not found")
            if (!matchesCategoryType(category.type, nextType)) {
                throw new ValidationError("Category must have the same type as the transaction")
            }
        }

        let amount: string | undefined
        if (body.amount !== undefined || body.type !== undefined) {
            const baseAmount = body.amount ?? Math.abs(Number(transaction.amount))
            amount = (nextType === tpTransactionEnum.EXPENSE ? -baseAmount : baseAmount).toFixed(2)
        }

        await this.repository.update(userId, id, {
            accountId: body.accountId,
            categoryId: body.categoryId,
            status: body.status,
            amount,
            description: body.description,
            date: body.date,
            tags: body.tags,
            attachmentUrl: body.attachmentUrl,
        })
    }
}
