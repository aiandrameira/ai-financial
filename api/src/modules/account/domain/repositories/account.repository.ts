import type { ICursorPaginated } from "@/http/api/response"
import type { CursorPaginationParams } from "@/http/api/schema/schemas"

import type { AccountDto } from "../../app/dtos"
import type { CreateAccountSchema, UpdateAccountSchema } from "../../app/schemas"

export const ACCOUNT_SORT_COLUMNS = ["name", "type", "createdAt"] as const
export type AccountSortColumn = (typeof ACCOUNT_SORT_COLUMNS)[number]

export interface FindAccountsParams extends CursorPaginationParams {
    sortBy: AccountSortColumn
    sortDirection: "asc" | "desc"
}

export interface AccountRepository {
    find(userId: string, params: FindAccountsParams): Promise<ICursorPaginated<AccountDto>>
    get(userId: string, id: string): Promise<AccountDto | null>
    create(userId: string, body: CreateAccountSchema): Promise<AccountDto>
    update(userId: string, id: string, body: UpdateAccountSchema): Promise<void>
    archive(userId: string, id: string): Promise<void>
    restore(userId: string, id: string): Promise<void>
}

export type { AccountDto }
