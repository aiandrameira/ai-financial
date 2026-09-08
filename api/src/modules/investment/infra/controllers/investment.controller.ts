import { ApiResponse } from "@/http/api/response"

import type {
    CreateInvestmentAssetSchema,
    CreateInvestmentMovementSchema,
    CreateInvestmentPriceSchema,
    FindInvestmentAssetsQuery,
    FindInvestmentMovementsQuery,
    FindInvestmentPricesQuery,
    UpdateInvestmentAssetSchema,
} from "../../app/schemas"
import type {
    CreateInvestmentAssetUseCase,
    CreateInvestmentMovementUseCase,
    CreateInvestmentPriceUseCase,
    DeleteInvestmentAssetUseCase,
    DeleteInvestmentMovementUseCase,
    FindInvestmentAssetsUseCase,
    FindInvestmentMovementsUseCase,
    FindInvestmentPricesUseCase,
    GetInvestmentAssetUseCase,
    UpdateInvestmentAssetUseCase,
} from "../../app/usecases"

type UseCases = {
    find: FindInvestmentAssetsUseCase
    get: GetInvestmentAssetUseCase
    create: CreateInvestmentAssetUseCase
    update: UpdateInvestmentAssetUseCase
    delete: DeleteInvestmentAssetUseCase
    findMovements: FindInvestmentMovementsUseCase
    createMovement: CreateInvestmentMovementUseCase
    deleteMovement: DeleteInvestmentMovementUseCase
    findPrices: FindInvestmentPricesUseCase
    createPrice: CreateInvestmentPriceUseCase
}

export class InvestmentController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, params: FindInvestmentAssetsQuery) {
        const result = await this.usecases.find.execute(userId, params)
        return ApiResponse.cursorPaginated(result)
    }

    async get(userId: string, id: string) {
        const asset = await this.usecases.get.execute(userId, id)
        return ApiResponse.item(asset)
    }

    async create(userId: string, body: CreateInvestmentAssetSchema) {
        const asset = await this.usecases.create.execute(userId, body)
        return ApiResponse.item(asset, "Investment asset created", 201)
    }

    async update(userId: string, id: string, body: UpdateInvestmentAssetSchema) {
        await this.usecases.update.execute(userId, id, body)
        return ApiResponse.success("Investment asset updated")
    }

    async delete(userId: string, id: string) {
        await this.usecases.delete.execute(userId, id)
        return ApiResponse.success("Investment asset deleted")
    }

    async findMovements(userId: string, investmentId: string, params: FindInvestmentMovementsQuery) {
        const result = await this.usecases.findMovements.execute(userId, investmentId, params)
        return ApiResponse.cursorPaginated(result)
    }

    async createMovement(userId: string, investmentId: string, body: CreateInvestmentMovementSchema) {
        const movement = await this.usecases.createMovement.execute(userId, investmentId, body)
        return ApiResponse.item(movement, "Investment movement created", 201)
    }

    async deleteMovement(userId: string, investmentId: string, id: string) {
        await this.usecases.deleteMovement.execute(userId, investmentId, id)
        return ApiResponse.success("Investment movement deleted")
    }

    async findPrices(userId: string, investmentId: string, params: FindInvestmentPricesQuery) {
        const result = await this.usecases.findPrices.execute(userId, investmentId, params)
        return ApiResponse.cursorPaginated(result)
    }

    async createPrice(userId: string, investmentId: string, body: CreateInvestmentPriceSchema) {
        const price = await this.usecases.createPrice.execute(userId, investmentId, body)
        return ApiResponse.item(price, "Investment price added", 201)
    }
}
