import type { ICursorPaginated } from "@/http/api/response"

import type { SavingsGoalDto } from "../../app/dtos"
import type { CreateSavingsGoalSchema, FindSavingsGoalsQuery, UpdateSavingsGoalSchema } from "../../app/schemas"

export interface SavingsGoalRepository {
    find(userId: string, params: FindSavingsGoalsQuery): Promise<ICursorPaginated<SavingsGoalDto>>
    get(userId: string, id: string): Promise<SavingsGoalDto | null>
    create(userId: string, body: CreateSavingsGoalSchema): Promise<SavingsGoalDto>
    update(userId: string, id: string, body: UpdateSavingsGoalSchema): Promise<void>
    delete(userId: string, id: string): Promise<void>
}

export type { SavingsGoalDto }
