import type { IPaginated } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { AccountDto } from "../../app/dtos/account.dto"
import type { CreateAccountSchema, UpdateAccountSchema } from "../../app/schemas/account.schema"

export interface AccountRepository {
    find(userId: string, params: PaginationParams): Promise<IPaginated<AccountDto>>
    get(userId: string, id: string): Promise<AccountDto | null>
    create(userId: string, body: CreateAccountSchema): Promise<AccountDto>
    update(userId: string, id: string, body: UpdateAccountSchema): Promise<void>
    archive(userId: string, id: string): Promise<void>
    restore(userId: string, id: string): Promise<void>
}

export type { AccountDto }
