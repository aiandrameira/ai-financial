import { ApiResponse } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { CreateCreditCardSchema, UpdateCreditCardSchema } from "../../app/schemas"
import type {
    ArchiveCreditCardUseCase,
    CreateCreditCardUseCase,
    FindCreditCardsUseCase,
    GetCreditCardUseCase,
    RestoreCreditCardUseCase,
    UpdateCreditCardUseCase,
} from "../../app/usecases"

type UseCases = {
    find: FindCreditCardsUseCase
    get: GetCreditCardUseCase
    create: CreateCreditCardUseCase
    update: UpdateCreditCardUseCase
    archive: ArchiveCreditCardUseCase
    restore: RestoreCreditCardUseCase
}

export class CreditCardController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, params: PaginationParams) {
        const result = await this.usecases.find.execute(userId, params)
        return ApiResponse.paginated(result)
    }

    async get(userId: string, id: string) {
        const creditCard = await this.usecases.get.execute(userId, id)
        return ApiResponse.item(creditCard)
    }

    async create(userId: string, body: CreateCreditCardSchema) {
        const creditCard = await this.usecases.create.execute(userId, body)
        return ApiResponse.item(creditCard, "Credit card created", 201)
    }

    async update(userId: string, id: string, body: UpdateCreditCardSchema) {
        await this.usecases.update.execute(userId, id, body)
        return ApiResponse.success("Credit card updated")
    }

    async archive(userId: string, id: string) {
        await this.usecases.archive.execute(userId, id)
        return ApiResponse.success("Credit card archived")
    }

    async restore(userId: string, id: string) {
        await this.usecases.restore.execute(userId, id)
        return ApiResponse.success("Credit card restored")
    }
}
