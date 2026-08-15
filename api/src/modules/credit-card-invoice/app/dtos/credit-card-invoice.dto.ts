import type { stInvoiceEnum } from "../../domain/enums"

export type CreditCardInvoiceDto = {
    id: string
    creditCardId: string
    referenceMonth: string
    closingDate: string
    dueDate: string
    status: stInvoiceEnum
    totalAmount: string
    paidAt: string | null
    createdAt: string
    updatedAt: string
}
