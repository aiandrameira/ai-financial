import { NotFoundError, ValidationError } from "@/http/errors/errors"

import type { InvestmentMovementDto } from "../dtos"
import type { CreateInvestmentMovementSchema } from "../schemas"
import { tpInvestmentMovementEnum } from "../../domain/enums"
import type { InvestmentAssetRepository, InvestmentMovementRepository } from "../../domain/repositories"
import { computeInvestmentPosition } from "../../domain/services"

export class CreateInvestmentMovementUseCase {
    constructor(
        private repository: InvestmentMovementRepository,
        private assetRepository: InvestmentAssetRepository,
    ) {}

    async execute(userId: string, investmentId: string, body: CreateInvestmentMovementSchema): Promise<InvestmentMovementDto> {
        const asset = await this.assetRepository.get(userId, investmentId)
        if (!asset) throw new NotFoundError("Investment asset not found")

        if (body.type === tpInvestmentMovementEnum.SELL || body.type === tpInvestmentMovementEnum.WITHDRAWAL) {
            const existing = await this.repository.findAll(userId, investmentId)
            const position = computeInvestmentPosition(
                existing.map((movement) => ({ type: movement.type, quantity: Number(movement.quantity), amount: Number(movement.amount), date: new Date(movement.date) })),
                null,
            )

            if (body.quantity > position.quantity) throw new ValidationError("Quantidade maior que a posição atual do ativo")
        }

        return this.repository.create(userId, investmentId, body)
    }
}
