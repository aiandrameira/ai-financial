import type { AccountDto } from "../dtos/account.dto"
import type { CreateAccountSchema } from "../schemas/account.schema"
import type { AccountRepository } from "../../domain/repositories/account.repository"

export class CreateAccountUseCase {
    constructor(private repository: AccountRepository) {}

    async execute(userId: string, body: CreateAccountSchema): Promise<AccountDto> {
        return this.repository.create(userId, body)
    }
}
