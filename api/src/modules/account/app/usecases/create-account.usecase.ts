import type { AccountDto } from "../dtos"
import type { CreateAccountSchema } from "../schemas"
import type { AccountRepository } from "../../domain/repositories"

export class CreateAccountUseCase {
    constructor(private repository: AccountRepository) {}

    async execute(userId: string, body: CreateAccountSchema): Promise<AccountDto> {
        return this.repository.create(userId, body)
    }
}
