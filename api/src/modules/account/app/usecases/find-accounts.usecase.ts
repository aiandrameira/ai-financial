import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { AccountDto } from "../dtos"
import type { AccountRepository } from "../../domain/repositories"

export class FindAccountsUseCase {
    constructor(private repository: AccountRepository) {}

    async execute(userId: string, params: PaginationParams): Promise<IPaginated<AccountDto>> {
        return this.repository.find(userId, params)
    }
}
