import type { AccountRepository } from "@/modules/account/domain/repositories"
import type { CategoryRepository } from "@/modules/category/domain/repositories"
import type { CreditCardInvoiceRepository } from "@/modules/credit-card-invoice/domain/repositories"
import type { CreditCardRepository } from "@/modules/credit-card/domain/repositories"
import { NotFoundError, ValidationError } from "@/http/errors/errors"

import type { TransactionDto } from "../dtos"
import type { CreateTransactionSchema } from "../schemas"
import { addMonthsUtc, computeNextOccurrence, matchesCategoryType, splitAmount } from "../../domain/services"
import { tpTransactionEnum } from "../../domain/enums/tp-transaction.enum"
import type {
    CreateTransactionData,
    InstallmentGroupRepository,
    RecurrenceRepository,
    TransactionRepository,
} from "../../domain/repositories"

export class CreateTransactionUseCase {
    constructor(
        private repository: TransactionRepository,
        private accountRepository: AccountRepository,
        private categoryRepository: CategoryRepository,
        private recurrenceRepository: RecurrenceRepository,
        private creditCardRepository: CreditCardRepository,
        private creditCardInvoiceRepository: CreditCardInvoiceRepository,
        private installmentGroupRepository: InstallmentGroupRepository,
    ) {}

    async execute(userId: string, body: CreateTransactionSchema): Promise<TransactionDto> {
        if (!body.accountId === !body.creditCardId) {
            throw new ValidationError("Provide exactly one of accountId or creditCardId")
        }
        if (body.installments && !body.creditCardId) {
            throw new ValidationError("Installments require a credit card")
        }

        if (body.categoryId) {
            const category = await this.categoryRepository.get(userId, body.categoryId)
            if (!category) throw new NotFoundError("Category not found")
            if (!matchesCategoryType(category.type, body.type)) {
                throw new ValidationError("Category must have the same type as the transaction")
            }
        }

        if (body.creditCardId && body.installments && body.installments >= 2) {
            return this._createInstallmentPurchase(userId, body.creditCardId, body)
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
            installmentGroupId: null,
            installmentNumber: null,
            attachmentUrl: body.attachmentUrl ?? null,
        })
    }

    private async _createInstallmentPurchase(
        userId: string,
        creditCardId: string,
        body: CreateTransactionSchema,
    ): Promise<TransactionDto> {
        const creditCard = await this.creditCardRepository.get(userId, creditCardId)
        if (!creditCard) throw new NotFoundError("Credit card not found")

        const count = body.installments as number
        const amounts = splitAmount(body.amount, count)
        const sign = body.type === tpTransactionEnum.EXPENSE ? -1 : 1

        const installments: Omit<CreateTransactionData, "installmentGroupId">[] = []
        for (let index = 0; index < count; index++) {
            const installmentDate = addMonthsUtc(body.date, index)
            const invoice = await this.creditCardInvoiceRepository.getOrCreateForDate(
                userId,
                creditCard.id,
                creditCard.closingDay,
                creditCard.dueDay,
                installmentDate,
            )

            installments.push({
                accountId: null,
                invoiceId: invoice.id,
                categoryId: body.categoryId ?? null,
                type: body.type,
                status: body.status,
                amount: (sign * amounts[index]).toFixed(2),
                description: body.description ?? null,
                date: installmentDate,
                tags: body.tags,
                recurrenceId: null,
                installmentNumber: index + 1,
                attachmentUrl: body.attachmentUrl ?? null,
            })
        }

        const created = await this.installmentGroupRepository.createWithTransactions(
            userId,
            {
                creditCardId: creditCard.id,
                description: body.description ?? null,
                totalAmount: (sign * body.amount).toFixed(2),
                installmentsTotal: count,
                purchaseDate: body.date,
            },
            installments,
        )

        return created.find((transaction) => transaction.installmentNumber === 1) ?? created[0]
    }
}
