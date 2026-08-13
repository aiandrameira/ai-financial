import type { AccountRepository } from "@/modules/account/domain/repositories"
import { NotFoundError, ValidationError } from "@/http/errors/errors"

import type { TransactionDto } from "../dtos"
import type { CreateTransferSchema } from "../schemas"
import type { TransactionRepository } from "../../domain/repositories"

export class CreateTransferUseCase {
    constructor(
        private repository: TransactionRepository,
        private accountRepository: AccountRepository,
    ) {}

    async execute(
        userId: string,
        body: CreateTransferSchema,
    ): Promise<{ source: TransactionDto; destination: TransactionDto }> {
        if (body.sourceAccountId === body.destinationAccountId) {
            throw new ValidationError("Source and destination accounts must be different")
        }

        const [source, destination] = await Promise.all([
            this.accountRepository.get(userId, body.sourceAccountId),
            this.accountRepository.get(userId, body.destinationAccountId),
        ])
        if (!source) throw new NotFoundError("Source account not found")
        if (!destination) throw new NotFoundError("Destination account not found")

        return this.repository.createTransfer(userId, {
            sourceAccountId: body.sourceAccountId,
            destinationAccountId: body.destinationAccountId,
            amount: body.amount.toFixed(2),
            description: body.description ?? null,
            date: body.date,
            status: body.status,
        })
    }
}
