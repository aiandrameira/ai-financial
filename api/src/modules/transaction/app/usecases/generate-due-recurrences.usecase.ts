import type { TransactionDto } from "../dtos"
import { computeNextOccurrence } from "../../domain/services/compute-next-occurrence"
import { tpTransactionEnum } from "../../domain/enums/tp-transaction.enum"
import { stTransactionEnum } from "../../domain/enums/st-transaction.enum"
import type { RecurrenceRepository, TransactionRepository } from "../../domain/repositories"

export class GenerateDueRecurrencesUseCase {
    constructor(
        private repository: TransactionRepository,
        private recurrenceRepository: RecurrenceRepository,
    ) {}

    async execute(userId: string): Promise<TransactionDto[]> {
        const now = new Date()
        const due = await this.recurrenceRepository.findDue(userId, now)
        const created: TransactionDto[] = []

        for (const recurrence of due) {
            const template = await this.repository.findLatestByRecurrence(userId, recurrence.id)
            if (!template || template.type === tpTransactionEnum.TRANSFER || !template.accountId) continue

            const occurrenceDate = new Date(recurrence.nextOccurrence)

            const occurrence = await this.repository.create(userId, {
                accountId: template.accountId,
                invoiceId: null,
                categoryId: template.categoryId,
                type: template.type,
                status: stTransactionEnum.PLANNED,
                amount: template.amount,
                description: template.description,
                date: occurrenceDate,
                tags: template.tags,
                recurrenceId: recurrence.id,
                attachmentUrl: null,
            })
            created.push(occurrence)

            const nextOccurrence = computeNextOccurrence(occurrenceDate, recurrence.frequency, recurrence.interval)
            const stillActive = !recurrence.endDate || nextOccurrence <= new Date(recurrence.endDate)
            await this.recurrenceRepository.advance(recurrence.id, nextOccurrence, stillActive)
        }

        return created
    }
}
