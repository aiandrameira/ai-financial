export type InstallmentGroupDto = {
    id: string
    creditCardId: string
    description: string | null
    totalAmount: string
    installmentsTotal: number
    purchaseDate: string
}
