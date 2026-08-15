export type InvoicePeriod = {
    referenceMonth: Date
    closingDate: Date
    dueDate: Date
}

function daysInMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

function makeDay(year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month, Math.min(day, daysInMonth(year, month))))
}

export function computeInvoicePeriod(purchaseDate: Date, closingDay: number, dueDay: number): InvoicePeriod {
    const year = purchaseDate.getUTCFullYear()
    const month = purchaseDate.getUTCMonth()

    const candidateClosing = makeDay(year, month, closingDay)
    const belongsToCurrentMonth = purchaseDate.getUTCDate() <= candidateClosing.getUTCDate()

    const closingYear = belongsToCurrentMonth ? year : year + Math.floor((month + 1) / 12)
    const closingMonth = belongsToCurrentMonth ? month : (month + 1) % 12
    const closingDate = makeDay(closingYear, closingMonth, closingDay)

    const dueBelongsToClosingMonth = dueDay > closingDay
    const dueYear = dueBelongsToClosingMonth ? closingYear : closingYear + Math.floor((closingMonth + 1) / 12)
    const dueMonth = dueBelongsToClosingMonth ? closingMonth : (closingMonth + 1) % 12
    const dueDate = makeDay(dueYear, dueMonth, dueDay)

    return {
        referenceMonth: new Date(Date.UTC(closingYear, closingMonth, 1)),
        closingDate,
        dueDate,
    }
}
