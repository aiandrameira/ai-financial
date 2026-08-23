import type { ICursorPaginated } from "@/http/api/response"

import type { CreditCardDto } from "../dtos"
import type { CreditCardRepository, FindCreditCardsParams } from "../../domain/repositories"

export class FindCreditCardsUseCase {
    constructor(private repository: CreditCardRepository) {}

    async execute(userId: string, params: FindCreditCardsParams): Promise<ICursorPaginated<CreditCardDto>> {
        return this.repository.find(userId, params)
    }
}
