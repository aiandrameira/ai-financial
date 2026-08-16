import type { IPaginated } from "@/http/api/response"

import type { AssetDto } from "../dtos"
import type { FindAssetsQuery } from "../schemas"
import type { AssetRepository } from "../../domain/repositories"

export class FindAssetsUseCase {
    constructor(private repository: AssetRepository) {}

    async execute(userId: string, params: FindAssetsQuery): Promise<IPaginated<AssetDto>> {
        return this.repository.find(userId, params)
    }
}
