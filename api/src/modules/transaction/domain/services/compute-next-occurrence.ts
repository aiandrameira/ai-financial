export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly"

export function computeNextOccurrence(from: Date, frequency: RecurrenceFrequency, interval: number): Date {
    const next = new Date(from)

    switch (frequency) {
        case "daily":
            next.setDate(next.getDate() + interval)
            break
        case "weekly":
            next.setDate(next.getDate() + interval * 7)
            break
        case "monthly":
            next.setMonth(next.getMonth() + interval)
            break
        case "yearly":
            next.setFullYear(next.getFullYear() + interval)
            break
    }

    return next
}
