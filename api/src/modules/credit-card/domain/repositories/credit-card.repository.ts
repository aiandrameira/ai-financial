import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { CreditCardDto } from "../../app/dtos"
import type { CreateCreditCardSchema, UpdateCreditCardSchema } from "../../app/schemas"

export interface CreditCardRepository {
    find(userId: string, params: PaginationParams): Promise<IPaginated<CreditCardDto>>
    get(userId: string, id: string): Promise<CreditCardDto | null>
    create(userId: string, body: CreateCreditCardSchema): Promise<CreditCardDto>
    update(userId: string, id: string, body: UpdateCreditCardSchema): Promise<void>
    archive(userId: string, id: string): Promise<void>
    restore(userId: string, id: string): Promise<void>
}

export type { CreditCardDto }
