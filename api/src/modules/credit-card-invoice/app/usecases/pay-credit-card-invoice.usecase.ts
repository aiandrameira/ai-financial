import type { CreditCardRepository } from "@/modules/credit-card/domain/repositories"
import { stTransactionEnum } from "@/modules/transaction/domain/enums/st-transaction.enum"
import { tpTransactionEnum } from "@/modules/transaction/domain/enums/tp-transaction.enum"
import type { TransactionRepository } from "@/modules/transaction/domain/repositories"
import { ConflictError, NotFoundError } from "@/http/errors/errors"

import type { PayCreditCardInvoiceSchema } from "../schemas"
import { stInvoiceEnum } from "../../domain/enums"
import type { CreditCardInvoiceRepository } from "../../domain/repositories"

export class PayCreditCardInvoiceUseCase {
    constructor(
        private repository: CreditCardInvoiceRepository,
        private creditCardRepository: CreditCardRepository,
        private transactionRepository: TransactionRepository,
    ) {}

    async execute(userId: string, creditCardId: string, id: string, body: PayCreditCardInvoiceSchema): Promise<void> {
        const invoice = await this.repository.get(userId, creditCardId, id)
        if (!invoice) throw new NotFoundError("Invoice not found")
        if (invoice.status === stInvoiceEnum.PAID) throw new ConflictError("Invoice already paid")

        const creditCard = await this.creditCardRepository.get(userId, creditCardId)
        if (!creditCard) throw new NotFoundError("Credit card not found")

        const paidAt = body.paidAt ?? new Date()

        await this.transactionRepository.create(userId, {
            accountId: creditCard.accountId,
            invoiceId: null,
            categoryId: null,
            type: tpTransactionEnum.EXPENSE,
            status: stTransactionEnum.COMPLETED,
            amount: invoice.totalAmount,
            description: `Fatura ${creditCard.name}`,
            date: paidAt,
            tags: [],
            recurrenceId: null,
            attachmentUrl: null,
        })

        await this.repository.pay(userId, id, paidAt)
    }
}
