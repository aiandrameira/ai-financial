export function addDecimal(a: string, b: string): string {
    const toCents = (value: string) => Math.round(Number(value) * 100)
    return ((toCents(a) + toCents(b)) / 100).toFixed(2)
}
