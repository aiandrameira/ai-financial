import { ApiResponse } from "@/http/api/response"
import type { CursorPaginationParams } from "@/http/api/schema/schemas"

import type { PayCreditCardInvoiceSchema } from "../../app/schemas"
import type {
    FindCreditCardInvoicesUseCase,
    GetCreditCardInvoiceUseCase,
    GetCurrentCreditCardInvoiceUseCase,
    PayCreditCardInvoiceUseCase,
} from "../../app/usecases"

type UseCases = {
    find: FindCreditCardInvoicesUseCase
    get: GetCreditCardInvoiceUseCase
    getCurrent: GetCurrentCreditCardInvoiceUseCase
    pay: PayCreditCardInvoiceUseCase
}

export class CreditCardInvoiceController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, creditCardId: string, params: CursorPaginationParams) {
        const result = await this.usecases.find.execute(userId, creditCardId, params)
        return ApiResponse.cursorPaginated(result)
    }

    async get(userId: string, creditCardId: string, id: string) {
        const invoice = await this.usecases.get.execute(userId, creditCardId, id)
        return ApiResponse.item(invoice)
    }

    async getCurrent(userId: string, creditCardId: string) {
        const invoice = await this.usecases.getCurrent.execute(userId, creditCardId)
        return ApiResponse.item(invoice)
    }

    async pay(userId: string, creditCardId: string, id: string, body: PayCreditCardInvoiceSchema) {
        await this.usecases.pay.execute(userId, creditCardId, id, body)
        return ApiResponse.success("Invoice paid")
    }
}
