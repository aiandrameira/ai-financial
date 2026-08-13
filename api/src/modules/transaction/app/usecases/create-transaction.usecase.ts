import type { AccountRepository } from "@/modules/account/domain/repositories"
import type { CategoryRepository } from "@/modules/category/domain/repositories"
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
    ) {}

    async execute(userId: string, body: CreateTransactionSchema): Promise<TransactionDto> {
        const account = await this.accountRepository.get(userId, body.accountId)
        if (!account) throw new NotFoundError("Account not found")

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
            accountId: body.accountId,
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
