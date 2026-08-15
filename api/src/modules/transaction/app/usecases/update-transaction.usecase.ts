import type { AccountRepository } from "@/modules/account/domain/repositories"
import type { CategoryRepository } from "@/modules/category/domain/repositories"
import type { CreditCardInvoiceRepository } from "@/modules/credit-card-invoice/domain/repositories"
import type { CreditCardRepository } from "@/modules/credit-card/domain/repositories"
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
        private creditCardRepository: CreditCardRepository,
        private creditCardInvoiceRepository: CreditCardInvoiceRepository,
    ) {}

    async execute(userId: string, id: string, body: UpdateTransactionSchema): Promise<void> {
        const transaction = await this.repository.get(userId, id)
        if (!transaction) throw new NotFoundError("Transaction not found")
        if (transaction.type === tpTransactionEnum.TRANSFER) {
            throw new ValidationError("Transfer transactions cannot be edited directly")
        }

        if (body.accountId && body.creditCardId) {
            throw new ValidationError("Provide exactly one of accountId or creditCardId")
        }

        let accountId: string | null | undefined
        let invoiceId: string | null | undefined

        if (body.accountId) {
            const account = await this.accountRepository.get(userId, body.accountId)
            if (!account) throw new NotFoundError("Account not found")
            accountId = account.id
            invoiceId = null
        } else if (body.creditCardId) {
            const creditCard = await this.creditCardRepository.get(userId, body.creditCardId)
            if (!creditCard) throw new NotFoundError("Credit card not found")

            const invoice = await this.creditCardInvoiceRepository.getOrCreateForDate(
                userId,
                creditCard.id,
                creditCard.closingDay,
                creditCard.dueDay,
                body.date ?? new Date(transaction.date),
            )
            invoiceId = invoice.id
            accountId = null
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
            accountId,
            invoiceId,
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
