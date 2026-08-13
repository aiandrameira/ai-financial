import { ApiResponse } from "@/http/api/response"
import type { PaginationParams } from "@/http/api/schema/schemas"

import type { CreateCategorySchema, UpdateCategorySchema } from "../../app/schemas/category.schema"
import type { CreateCategoryUseCase } from "../../app/usecases/create-category.usecase"
import type { DeleteCategoryUseCase } from "../../app/usecases/delete-category.usecase"
import type { FindCategoriesUseCase } from "../../app/usecases/find-categories.usecase"
import type { GetCategoryUseCase } from "../../app/usecases/get-category.usecase"
import type { UpdateCategoryUseCase } from "../../app/usecases/update-category.usecase"

type UseCases = {
    find: FindCategoriesUseCase
    get: GetCategoryUseCase
    create: CreateCategoryUseCase
    update: UpdateCategoryUseCase
    delete: DeleteCategoryUseCase
}

export class CategoryController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, params: PaginationParams) {
        const result = await this.usecases.find.execute(userId, params)
        return ApiResponse.paginated(result)
    }

    async get(userId: string, id: string) {
        const category = await this.usecases.get.execute(userId, id)
        return ApiResponse.item(category)
    }

    async create(userId: string, body: CreateCategorySchema) {
        const category = await this.usecases.create.execute(userId, body)
        return ApiResponse.item(category, "Category created", 201)
    }

    async update(userId: string, id: string, body: UpdateCategorySchema) {
        await this.usecases.update.execute(userId, id, body)
        return ApiResponse.success("Category updated")
    }

    async delete(userId: string, id: string) {
        await this.usecases.delete.execute(userId, id)
        return ApiResponse.success("Category deleted")
    }
}
