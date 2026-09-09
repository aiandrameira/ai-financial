import { ApiResponse } from "@/http/api/response"

import type { GetFinancialPlanUseCase } from "../../app/usecases"

type UseCases = {
    get: GetFinancialPlanUseCase
}

export class FinancialPlanController {
    constructor(private usecases: UseCases) {}

    async get(userId: string) {
        const plan = await this.usecases.get.execute(userId)
        return ApiResponse.item(plan)
    }
}
