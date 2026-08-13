import type { TransactionDto } from "../dtos/transaction.dto"
import { computeNextOccurrence } from "../../domain/services/compute-next-occurrence"
import type { RecurrenceRepository } from "../../domain/repositories/recurrence.repository"
import type { TransactionRepository } from "../../domain/repositories/transaction.repository"

// Materializa a próxima ocorrência de cada recorrência vencida, clonando a última transação
// gerada por ela como modelo. Sem scheduler embutido ainda — chamado manualmente via
// POST /transactions/recurrences/generate, ou por um cron externo no futuro (docs/planning.md Fase 1).
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
            if (!template || template.type === "transfer") continue

            const occurrenceDate = new Date(recurrence.nextOccurrence)

            const occurrence = await this.repository.create(userId, {
                accountId: template.accountId,
                categoryId: template.categoryId,
                type: template.type,
                status: "planned",
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
