import { ApiResponse } from "@/http/api/response"

import type {
    CreateGoalContributionSchema,
    CreateSavingsGoalSchema,
    FindGoalContributionsQuery,
    FindSavingsGoalsQuery,
    UpdateSavingsGoalSchema,
} from "../../app/schemas"
import type {
    CreateGoalContributionUseCase,
    CreateSavingsGoalUseCase,
    DeleteGoalContributionUseCase,
    DeleteSavingsGoalUseCase,
    FindGoalContributionsUseCase,
    FindSavingsGoalsUseCase,
    GetSavingsGoalUseCase,
    UpdateSavingsGoalUseCase,
} from "../../app/usecases"

type UseCases = {
    find: FindSavingsGoalsUseCase
    get: GetSavingsGoalUseCase
    create: CreateSavingsGoalUseCase
    update: UpdateSavingsGoalUseCase
    delete: DeleteSavingsGoalUseCase
    findContributions: FindGoalContributionsUseCase
    createContribution: CreateGoalContributionUseCase
    deleteContribution: DeleteGoalContributionUseCase
}

export class SavingsGoalController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, params: FindSavingsGoalsQuery) {
        const result = await this.usecases.find.execute(userId, params)
        return ApiResponse.paginated(result)
    }

    async get(userId: string, id: string) {
        const goal = await this.usecases.get.execute(userId, id)
        return ApiResponse.item(goal)
    }

    async create(userId: string, body: CreateSavingsGoalSchema) {
        const goal = await this.usecases.create.execute(userId, body)
        return ApiResponse.item(goal, "Savings goal created", 201)
    }

    async update(userId: string, id: string, body: UpdateSavingsGoalSchema) {
        await this.usecases.update.execute(userId, id, body)
        return ApiResponse.success("Savings goal updated")
    }

    async delete(userId: string, id: string) {
        await this.usecases.delete.execute(userId, id)
        return ApiResponse.success("Savings goal deleted")
    }

    async findContributions(userId: string, goalId: string, params: FindGoalContributionsQuery) {
        const result = await this.usecases.findContributions.execute(userId, goalId, params)
        return ApiResponse.paginated(result)
    }

    async createContribution(userId: string, goalId: string, body: CreateGoalContributionSchema) {
        const contribution = await this.usecases.createContribution.execute(userId, goalId, body)
        return ApiResponse.item(contribution, "Contribution added", 201)
    }

    async deleteContribution(userId: string, goalId: string, id: string) {
        await this.usecases.deleteContribution.execute(userId, goalId, id)
        return ApiResponse.success("Contribution deleted")
    }
}
