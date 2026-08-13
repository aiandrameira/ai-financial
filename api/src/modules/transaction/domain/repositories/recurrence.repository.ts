import type { RecurrenceDto } from "../../app/dtos"
import type { tpRecurrenceFrequencyEnum } from "../enums/tp-recurrence-frequency.enum"

export type CreateRecurrenceData = {
    frequency: tpRecurrenceFrequencyEnum
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
