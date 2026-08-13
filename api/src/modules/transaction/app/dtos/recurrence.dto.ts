import type { tpRecurrenceFrequencyEnum } from "../../domain/enums/tp-recurrence-frequency.enum"

export type RecurrenceDto = {
    id: string
    frequency: tpRecurrenceFrequencyEnum
    interval: number
    startDate: string
    endDate: string | null
    nextOccurrence: string
    active: boolean
}
