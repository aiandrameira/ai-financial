function daysInMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

export function addMonthsUtc(date: Date, months: number): Date {
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + months
    const targetYear = year + Math.floor(month / 12)
    const targetMonth = ((month % 12) + 12) % 12
    const day = Math.min(date.getUTCDate(), daysInMonth(targetYear, targetMonth))

    return new Date(Date.UTC(targetYear, targetMonth, day, date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()))
}
