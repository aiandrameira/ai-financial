import { tpRecurrenceFrequencyEnum } from "../enums"

export function computeNextOccurrence(from: Date, frequency: tpRecurrenceFrequencyEnum, interval: number): Date {
    const next = new Date(from)

    switch (frequency) {
        case tpRecurrenceFrequencyEnum.DAILY:
            next.setDate(next.getDate() + interval)
            break
        case tpRecurrenceFrequencyEnum.WEEKLY:
            next.setDate(next.getDate() + interval * 7)
            break
        case tpRecurrenceFrequencyEnum.MONTHLY:
            next.setMonth(next.getMonth() + interval)
            break
        case tpRecurrenceFrequencyEnum.YEARLY:
            next.setFullYear(next.getFullYear() + interval)
            break
    }

    return next
}
