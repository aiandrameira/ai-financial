import { NotFoundError } from "@/http/errors/errors"

import type { CreditCardDto } from "../dtos"
import type { CreditCardRepository } from "../../domain/repositories"

export class GetCreditCardUseCase {
    constructor(private repository: CreditCardRepository) {}

    async execute(userId: string, id: string): Promise<CreditCardDto> {
        const creditCard = await this.repository.get(userId, id)
        if (!creditCard) throw new NotFoundError("Credit card not found")
        return creditCard
    }
}
