import type { CreditCardRepository } from "@/modules/credit-card/domain/repositories"
import { NotFoundError } from "@/http/errors/errors"
import type { ICursorPaginated } from "@/http/api/response"

import type { CreditCardInvoiceDto } from "../dtos"
import type { FindCreditCardInvoicesQuery } from "../schemas"
import type { CreditCardInvoiceRepository } from "../../domain/repositories"

export class FindCreditCardInvoicesUseCase {
    constructor(
        private repository: CreditCardInvoiceRepository,
        private creditCardRepository: CreditCardRepository,
    ) {}

    async execute(
        userId: string,
        creditCardId: string,
        params: FindCreditCardInvoicesQuery,
    ): Promise<ICursorPaginated<CreditCardInvoiceDto>> {
        const creditCard = await this.creditCardRepository.get(userId, creditCardId)
        if (!creditCard) throw new NotFoundError("Credit card not found")

        return this.repository.find(userId, creditCardId, params)
    }
}
