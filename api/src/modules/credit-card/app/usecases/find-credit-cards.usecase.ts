import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { CreditCardDto } from "../dtos"
import type { CreditCardRepository } from "../../domain/repositories"

export class FindCreditCardsUseCase {
    constructor(private repository: CreditCardRepository) {}

    async execute(userId: string, params: PaginationParams): Promise<IPaginated<CreditCardDto>> {
        return this.repository.find(userId, params)
    }
}
