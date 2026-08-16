import type { IPaginated } from "@/http/api/response"

import type { GoalContributionDto } from "../../app/dtos"
import type { CreateGoalContributionSchema, FindGoalContributionsQuery } from "../../app/schemas"

export interface GoalContributionRepository {
    find(userId: string, goalId: string, params: FindGoalContributionsQuery): Promise<IPaginated<GoalContributionDto>>
    findAll(userId: string, goalId: string): Promise<GoalContributionDto[]>
    get(userId: string, goalId: string, id: string): Promise<GoalContributionDto | null>
    create(userId: string, goalId: string, body: CreateGoalContributionSchema): Promise<GoalContributionDto>
    delete(userId: string, id: string): Promise<void>
    deleteByGoal(userId: string, goalId: string): Promise<void>
}

export type { GoalContributionDto }
