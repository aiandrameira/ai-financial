import { NotFoundError } from "@/http/errors/errors"

import type { AccountDto } from "../dtos"
import type { AccountRepository } from "../../domain/repositories"

export class GetAccountUseCase {
    constructor(private repository: AccountRepository) {}

    async execute(userId: string, id: string): Promise<AccountDto> {
        const account = await this.repository.get(userId, id)
        if (!account) throw new NotFoundError("Account not found")
        return account
    }
}
