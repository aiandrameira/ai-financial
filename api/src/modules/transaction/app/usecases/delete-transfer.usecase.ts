import { NotFoundError } from "@/http/errors/errors"

import type { TransactionRepository } from "../../domain/repositories"

export class DeleteTransferUseCase {
    constructor(private repository: TransactionRepository) {}

    async execute(userId: string, transferId: string): Promise<void> {
        const deleted = await this.repository.deleteTransfer(userId, transferId)
        if (!deleted) throw new NotFoundError("Transfer not found")
    }
}
