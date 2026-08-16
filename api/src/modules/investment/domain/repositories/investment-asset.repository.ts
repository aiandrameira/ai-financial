import type { IPaginated } from "@/http/api/response"

import type { InvestmentAssetDto } from "../../app/dtos"
import type { CreateInvestmentAssetSchema, FindInvestmentAssetsQuery, UpdateInvestmentAssetSchema } from "../../app/schemas"

export interface InvestmentAssetRepository {
    find(userId: string, params: FindInvestmentAssetsQuery): Promise<IPaginated<InvestmentAssetDto>>
    get(userId: string, id: string): Promise<InvestmentAssetDto | null>
    create(userId: string, body: CreateInvestmentAssetSchema): Promise<InvestmentAssetDto>
    update(userId: string, id: string, body: UpdateInvestmentAssetSchema): Promise<void>
    delete(userId: string, id: string): Promise<void>
}

export type { InvestmentAssetDto }
