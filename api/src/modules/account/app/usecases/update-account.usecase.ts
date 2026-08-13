import { NotFoundError } from "@/http/errors/errors"

import type { UpdateAccountSchema } from "../schemas"
import type { AccountRepository } from "../../domain/repositories"

export class UpdateAccountUseCase {
    constructor(private repository: AccountRepository) {}

    async execute(userId: string, id: string, body: UpdateAccountSchema): Promise<void> {
        const account = await this.repository.get(userId, id)
        if (!account) throw new NotFoundError("Account not found")
        await this.repository.update(userId, id, body)
    }
}
