import { ApiResponse } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { CreateAccountSchema, UpdateAccountSchema } from "../../app/schemas"
import type {
    ArchiveAccountUseCase,
    CreateAccountUseCase,
    FindAccountsUseCase,
    GetAccountUseCase,
    RestoreAccountUseCase,
    UpdateAccountUseCase,
} from "../../app/usecases"

type UseCases = {
    find: FindAccountsUseCase
    get: GetAccountUseCase
    create: CreateAccountUseCase
    update: UpdateAccountUseCase
    archive: ArchiveAccountUseCase
    restore: RestoreAccountUseCase
}

export class AccountController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, params: PaginationParams) {
        const result = await this.usecases.find.execute(userId, params)
        return ApiResponse.paginated(result)
    }

    async get(userId: string, id: string) {
        const account = await this.usecases.get.execute(userId, id)
        return ApiResponse.item(account)
    }

    async create(userId: string, body: CreateAccountSchema) {
        const account = await this.usecases.create.execute(userId, body)
        return ApiResponse.item(account, "Account created", 201)
    }

    async update(userId: string, id: string, body: UpdateAccountSchema) {
        await this.usecases.update.execute(userId, id, body)
        return ApiResponse.success("Account updated")
    }

    async archive(userId: string, id: string) {
        await this.usecases.archive.execute(userId, id)
        return ApiResponse.success("Account archived")
    }

    async restore(userId: string, id: string) {
        await this.usecases.restore.execute(userId, id)
        return ApiResponse.success("Account restored")
    }
}
