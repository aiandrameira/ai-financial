import type { IPaginated } from "@/http/api/response"

import type { BudgetDto } from "../../app/dtos"
import type { CreateBudgetSchema, FindBudgetsQuery, UpdateBudgetSchema } from "../../app/schemas"

export interface BudgetRepository {
    find(userId: string, params: FindBudgetsQuery): Promise<IPaginated<BudgetDto>>
    get(userId: string, id: string): Promise<BudgetDto | null>
    getByCategoryAndMonth(userId: string, categoryId: string, referenceMonth: Date): Promise<BudgetDto | null>
    create(userId: string, body: CreateBudgetSchema): Promise<BudgetDto>
    update(userId: string, id: string, body: UpdateBudgetSchema): Promise<void>
    delete(userId: string, id: string): Promise<void>
}

export type { BudgetDto }
