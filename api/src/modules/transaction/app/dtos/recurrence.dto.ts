import type { RecurrenceFrequency } from "../../domain/services/compute-next-occurrence"

export type RecurrenceDto = {
    id: string
    frequency: RecurrenceFrequency
    interval: number
    startDate: string
    endDate: string | null
    nextOccurrence: string
    active: boolean
}
