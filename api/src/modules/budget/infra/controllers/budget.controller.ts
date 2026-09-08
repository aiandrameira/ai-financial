import { ApiResponse } from "@/http/api/response"

import type { CreateBudgetSchema, FindBudgetsQuery, UpdateBudgetSchema } from "../../app/schemas"
import type {
    CreateBudgetUseCase,
    DeleteBudgetUseCase,
    FindBudgetsUseCase,
    GetBudgetUseCase,
    UpdateBudgetUseCase,
} from "../../app/usecases"

type UseCases = {
    find: FindBudgetsUseCase
    get: GetBudgetUseCase
    create: CreateBudgetUseCase
    update: UpdateBudgetUseCase
    delete: DeleteBudgetUseCase
}

export class BudgetController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, params: FindBudgetsQuery) {
        const result = await this.usecases.find.execute(userId, params)
        return ApiResponse.cursorPaginated(result)
    }

    async get(userId: string, id: string) {
        const budget = await this.usecases.get.execute(userId, id)
        return ApiResponse.item(budget)
    }

    async create(userId: string, body: CreateBudgetSchema) {
        const budget = await this.usecases.create.execute(userId, body)
        return ApiResponse.item(budget, "Budget created", 201)
    }

    async update(userId: string, id: string, body: UpdateBudgetSchema) {
        await this.usecases.update.execute(userId, id, body)
        return ApiResponse.success("Budget updated")
    }

    async delete(userId: string, id: string) {
        await this.usecases.delete.execute(userId, id)
        return ApiResponse.success("Budget deleted")
    }
}
