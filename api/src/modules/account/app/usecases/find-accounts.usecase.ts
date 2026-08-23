import type { ICursorPaginated } from "@/http/api/response"

import type { AccountDto } from "../dtos"
import type { AccountRepository, FindAccountsParams } from "../../domain/repositories"

export class FindAccountsUseCase {
    constructor(private repository: AccountRepository) {}

    async execute(userId: string, params: FindAccountsParams): Promise<ICursorPaginated<AccountDto>> {
        return this.repository.find(userId, params)
    }
}
