import type { ICursorPaginated } from "@/http/api/response"

import type { AssetDto } from "../../app/dtos"
import type { CreateAssetSchema, FindAssetsQuery, UpdateAssetSchema } from "../../app/schemas"

export interface AssetRepository {
    find(userId: string, params: FindAssetsQuery): Promise<ICursorPaginated<AssetDto>>
    get(userId: string, id: string): Promise<AssetDto | null>
    create(userId: string, body: CreateAssetSchema): Promise<AssetDto>
    update(userId: string, id: string, body: UpdateAssetSchema): Promise<void>
    delete(userId: string, id: string): Promise<void>
}

export type { AssetDto }
