import { NotFoundError } from "@/http/errors/errors"

import type { CreditCardInvoiceDto } from "../dtos"
import type { CreditCardInvoiceRepository } from "../../domain/repositories"

export class GetCreditCardInvoiceUseCase {
    constructor(private repository: CreditCardInvoiceRepository) {}

    async execute(userId: string, creditCardId: string, id: string): Promise<CreditCardInvoiceDto> {
        const invoice = await this.repository.get(userId, creditCardId, id)
        if (!invoice) throw new NotFoundError("Invoice not found")

        return invoice
    }
}
