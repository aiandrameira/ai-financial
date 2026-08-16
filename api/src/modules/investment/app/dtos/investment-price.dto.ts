export type InvestmentPriceDto = {
    id: string
    investmentId: string
    price: string
    referenceDate: string
    source: "manual" | "automatic"
    createdAt: string
}
