import type { CreditCardDto } from "../dtos"
import type { CreateCreditCardSchema } from "../schemas"
import type { CreditCardRepository } from "../../domain/repositories"

export class CreateCreditCardUseCase {
    constructor(private repository: CreditCardRepository) {}

    async execute(userId: string, body: CreateCreditCardSchema): Promise<CreditCardDto> {
        return this.repository.create(userId, body)
    }
}
