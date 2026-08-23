import type { ICursorPaginated } from "@/http/api/response"
import type { CursorPaginationParams } from "@/http/api/schema/schemas"

import type { CreditCardDto } from "../../app/dtos"
import type { CreateCreditCardSchema, UpdateCreditCardSchema } from "../../app/schemas"

export const CREDIT_CARD_SORT_COLUMNS = ["name", "network", "createdAt"] as const
export type CreditCardSortColumn = (typeof CREDIT_CARD_SORT_COLUMNS)[number]

export interface FindCreditCardsParams extends CursorPaginationParams {
    sortBy: CreditCardSortColumn
    sortDirection: "asc" | "desc"
}

export interface CreditCardRepository {
    find(userId: string, params: FindCreditCardsParams): Promise<ICursorPaginated<CreditCardDto>>
    get(userId: string, id: string): Promise<CreditCardDto | null>
    create(userId: string, body: CreateCreditCardSchema): Promise<CreditCardDto>
    update(userId: string, id: string, body: UpdateCreditCardSchema): Promise<void>
    archive(userId: string, id: string): Promise<void>
    restore(userId: string, id: string): Promise<void>
}

export type { CreditCardDto }
