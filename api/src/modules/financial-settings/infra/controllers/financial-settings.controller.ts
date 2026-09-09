import { ApiResponse } from "@/http/api/response"

import type { UpdateFinancialSettingsSchema } from "../../app/schemas"
import type { GetFinancialSettingsUseCase, UpdateFinancialSettingsUseCase } from "../../app/usecases"

type UseCases = {
    get: GetFinancialSettingsUseCase
    update: UpdateFinancialSettingsUseCase
}

export class FinancialSettingsController {
    constructor(private usecases: UseCases) {}

    async get(userId: string) {
        const settings = await this.usecases.get.execute(userId)
        return ApiResponse.item(settings)
    }

    async update(userId: string, body: UpdateFinancialSettingsSchema) {
        const settings = await this.usecases.update.execute(userId, body)
        return ApiResponse.item(settings, "Financial settings updated")
    }
}
