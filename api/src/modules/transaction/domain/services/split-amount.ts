export function splitAmount(total: number, count: number): number[] {
    const totalCents = Math.round(total * 100)
    const base = Math.floor(totalCents / count)
    const remainder = totalCents - base * count

    return Array.from({ length: count }, (_, index) => (base + (index < remainder ? 1 : 0)) / 100)
}
