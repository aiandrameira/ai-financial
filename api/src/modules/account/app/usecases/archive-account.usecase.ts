import { NotFoundError } from "@/http/errors/errors"

import type { AccountRepository } from "../../domain/repositories/account.repository"

export class ArchiveAccountUseCase {
    constructor(private repository: AccountRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const account = await this.repository.get(userId, id)
        if (!account) throw new NotFoundError("Account not found")
        await this.repository.archive(userId, id)
    }
}
