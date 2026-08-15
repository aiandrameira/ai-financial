import { NotFoundError } from "@/http/errors/errors"

import type { UpdateCreditCardSchema } from "../schemas"
import type { CreditCardRepository } from "../../domain/repositories"

export class UpdateCreditCardUseCase {
    constructor(private repository: CreditCardRepository) {}

    async execute(userId: string, id: string, body: UpdateCreditCardSchema): Promise<void> {
        const creditCard = await this.repository.get(userId, id)
        if (!creditCard) throw new NotFoundError("Credit card not found")
        await this.repository.update(userId, id, body)
    }
}
