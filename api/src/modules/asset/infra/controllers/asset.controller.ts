import { ApiResponse } from "@/http/api/response"

import type { CreateAssetSchema, FindAssetsQuery, UpdateAssetSchema } from "../../app/schemas"
import type {
    CreateAssetUseCase,
    DeleteAssetUseCase,
    FindAssetsUseCase,
    GetAssetUseCase,
    UpdateAssetUseCase,
} from "../../app/usecases"

type UseCases = {
    find: FindAssetsUseCase
    get: GetAssetUseCase
    create: CreateAssetUseCase
    update: UpdateAssetUseCase
    delete: DeleteAssetUseCase
}

export class AssetController {
    constructor(private usecases: UseCases) {}

    async find(userId: string, params: FindAssetsQuery) {
        const result = await this.usecases.find.execute(userId, params)
        return ApiResponse.cursorPaginated(result)
    }

    async get(userId: string, id: string) {
        const asset = await this.usecases.get.execute(userId, id)
        return ApiResponse.item(asset)
    }

    async create(userId: string, body: CreateAssetSchema) {
        const asset = await this.usecases.create.execute(userId, body)
        return ApiResponse.item(asset, "Asset created", 201)
    }

    async update(userId: string, id: string, body: UpdateAssetSchema) {
        await this.usecases.update.execute(userId, id, body)
        return ApiResponse.success("Asset updated")
    }

    async delete(userId: string, id: string) {
        await this.usecases.delete.execute(userId, id)
        return ApiResponse.success("Asset deleted")
    }
}
