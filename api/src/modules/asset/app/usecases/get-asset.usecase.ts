import { NotFoundError } from "@/http/errors/errors"

import type { AssetDto } from "../dtos"
import type { AssetRepository } from "../../domain/repositories"

export class GetAssetUseCase {
    constructor(private repository: AssetRepository) {}

    async execute(userId: string, id: string): Promise<AssetDto> {
        const asset = await this.repository.get(userId, id)
        if (!asset) throw new NotFoundError("Asset not found")
        return asset
    }
}
