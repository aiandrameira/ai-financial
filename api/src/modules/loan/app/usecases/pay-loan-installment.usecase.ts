import { stTransactionEnum } from "@/modules/transaction/domain/enums/st-transaction.enum"
import { tpTransactionEnum } from "@/modules/transaction/domain/enums/tp-transaction.enum"
import type { TransactionRepository } from "@/modules/transaction/domain/repositories"
import { ConflictError, NotFoundError } from "@/http/errors/errors"

import type { PayLoanInstallmentSchema } from "../schemas"
import { stLoanInstallmentEnum } from "../../domain/enums"
import type { LoanInstallmentRepository, LoanRepository } from "../../domain/repositories"

export class PayLoanInstallmentUseCase {
    constructor(
        private installmentRepository: LoanInstallmentRepository,
        private loanRepository: LoanRepository,
        private transactionRepository: TransactionRepository,
    ) {}

    async execute(userId: string, loanId: string, id: string, body: PayLoanInstallmentSchema): Promise<void> {
        const installment = await this.installmentRepository.get(userId, loanId, id)
        if (!installment) throw new NotFoundError("Installment not found")
        if (installment.status === stLoanInstallmentEnum.PAID) throw new ConflictError("Installment already paid")

        const loan = await this.loanRepository.get(userId, loanId)
        if (!loan) throw new NotFoundError("Loan not found")

        const paidAt = body.paidAt ?? new Date()

        await this.transactionRepository.create(userId, {
            accountId: loan.accountId,
            invoiceId: null,
            categoryId: null,
            type: tpTransactionEnum.EXPENSE,
            status: stTransactionEnum.COMPLETED,
            amount: `-${installment.amount}`,
            description: `Parcela ${installment.number}/${loan.installmentsTotal} - ${loan.name}`,
            date: paidAt,
            tags: [],
            recurrenceId: null,
            installmentGroupId: null,
            installmentNumber: null,
            attachmentUrl: null,
        })

        await this.installmentRepository.pay(userId, id, paidAt)
    }
}
