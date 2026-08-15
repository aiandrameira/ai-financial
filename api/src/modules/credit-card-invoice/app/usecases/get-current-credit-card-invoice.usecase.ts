import type { CreditCardRepository } from "@/modules/credit-card/domain/repositories"
import { NotFoundError } from "@/http/errors/errors"

import type { CreditCardInvoiceDto } from "../dtos"
import type { CreditCardInvoiceRepository } from "../../domain/repositories"

export class GetCurrentCreditCardInvoiceUseCase {
    constructor(
        private repository: CreditCardInvoiceRepository,
        private creditCardRepository: CreditCardRepository,
    ) {}

    async execute(userId: string, creditCardId: string, date: Date = new Date()): Promise<CreditCardInvoiceDto> {
        const creditCard = await this.creditCardRepository.get(userId, creditCardId)
        if (!creditCard) throw new NotFoundError("Credit card not found")

        return this.repository.getOrCreateForDate(userId, creditCardId, creditCard.closingDay, creditCard.dueDay, date)
    }
}
