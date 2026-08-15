import type { IPaginated } from "@/http/api/response"

import type { CreditCardInvoiceDto } from "../../app/dtos"
import type { FindCreditCardInvoicesQuery } from "../../app/schemas"

export interface CreditCardInvoiceRepository {
    find(userId: string, creditCardId: string, params: FindCreditCardInvoicesQuery): Promise<IPaginated<CreditCardInvoiceDto>>
    get(userId: string, creditCardId: string, id: string): Promise<CreditCardInvoiceDto | null>
    getOrCreateForDate(
        userId: string,
        creditCardId: string,
        closingDay: number,
        dueDay: number,
        date: Date,
    ): Promise<CreditCardInvoiceDto>
    pay(userId: string, id: string, paidAt: Date): Promise<void>
}

export type { CreditCardInvoiceDto }
