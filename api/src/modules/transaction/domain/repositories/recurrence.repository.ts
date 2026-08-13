import type { RecurrenceDto } from "../../app/dtos/recurrence.dto"
import type { RecurrenceFrequency } from "../services/compute-next-occurrence"

export type CreateRecurrenceData = {
    frequency: RecurrenceFrequency
    interval: number
    startDate: Date
    endDate: Date | null
    nextOccurrence: Date
}

export interface RecurrenceRepository {
    create(userId: string, data: CreateRecurrenceData): Promise<RecurrenceDto>
    findDue(userId: string, asOf: Date): Promise<RecurrenceDto[]>
    advance(id: string, nextOccurrence: Date, active: boolean): Promise<void>
}

export type { RecurrenceDto }
