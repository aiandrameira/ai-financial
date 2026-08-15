import { NotFoundError } from "@/http/errors/errors"

import type { CreditCardRepository } from "../../domain/repositories"

export class RestoreCreditCardUseCase {
    constructor(private repository: CreditCardRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const creditCard = await this.repository.get(userId, id)
        if (!creditCard) throw new NotFoundError("Credit card not found")
        await this.repository.restore(userId, id)
    }
}
