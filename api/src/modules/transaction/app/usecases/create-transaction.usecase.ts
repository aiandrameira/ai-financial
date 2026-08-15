import type { AccountRepository } from "@/modules/account/domain/repositories"
import type { CategoryRepository } from "@/modules/category/domain/repositories"
import type { CreditCardInvoiceRepository } from "@/modules/credit-card-invoice/domain/repositories"
import type { CreditCardRepository } from "@/modules/credit-card/domain/repositories"
import { NotFoundError, ValidationError } from "@/http/errors/errors"

import type { TransactionDto } from "../dtos"
import type { CreateTransactionSchema } from "../schemas"
import { computeNextOccurrence, matchesCategoryType } from "../../domain/services"
import { tpTransactionEnum } from "../../domain/enums/tp-transaction.enum"
import type { RecurrenceRepository, TransactionRepository } from "../../domain/repositories"

export class CreateTransactionUseCase {
    constructor(
        private repository: TransactionRepository,
        private accountRepository: AccountRepository,
        private categoryRepository: CategoryRepository,
        private recurrenceRepository: RecurrenceRepository,
        private creditCardRepository: CreditCardRepository,
        private creditCardInvoiceRepository: CreditCardInvoiceRepository,
    ) {}

    async execute(userId: string, body: CreateTransactionSchema): Promise<TransactionDto> {
        if (!body.accountId === !body.creditCardId) {
            throw new ValidationError("Provide exactly one of accountId or creditCardId")
        }

        let accountId: string | null = null
        let invoiceId: string | null = null

        if (body.accountId) {
            const account = await this.accountRepository.get(userId, body.accountId)
            if (!account) throw new NotFoundError("Account not found")
            accountId = account.id
        } else if (body.creditCardId) {
            const creditCard = await this.creditCardRepository.get(userId, body.creditCardId)
            if (!creditCard) throw new NotFoundError("Credit card not found")

            const invoice = await this.creditCardInvoiceRepository.getOrCreateForDate(
                userId,
                creditCard.id,
                creditCard.closingDay,
                creditCard.dueDay,
                body.date,
            )
            invoiceId = invoice.id
        }

        if (body.categoryId) {
            const category = await this.categoryRepository.get(userId, body.categoryId)
            if (!category) throw new NotFoundError("Category not found")
            if (!matchesCategoryType(category.type, body.type)) {
                throw new ValidationError("Category must have the same type as the transaction")
            }
        }

        let recurrenceId: string | null = null
        if (body.recurrence) {
            const recurrence = await this.recurrenceRepository.create(userId, {
                frequency: body.recurrence.frequency,
                interval: body.recurrence.interval,
                startDate: body.date,
                endDate: body.recurrence.endDate ?? null,
                nextOccurrence: computeNextOccurrence(body.date, body.recurrence.frequency, body.recurrence.interval),
            })
            recurrenceId = recurrence.id
        }

        const signedAmount = body.type === tpTransactionEnum.EXPENSE ? -body.amount : body.amount

        return this.repository.create(userId, {
            accountId,
            invoiceId,
            categoryId: body.categoryId ?? null,
            type: body.type,
            status: body.status,
            amount: signedAmount.toFixed(2),
            description: body.description ?? null,
            date: body.date,
            tags: body.tags,
            recurrenceId,
            attachmentUrl: body.attachmentUrl ?? null,
        })
    }
}
