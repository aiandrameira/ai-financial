import { NotFoundError } from "@/http/errors/errors"

import type { AssetRepository } from "../../domain/repositories"

export class DeleteAssetUseCase {
    constructor(private repository: AssetRepository) {}

    async execute(userId: string, id: string): Promise<void> {
        const asset = await this.repository.get(userId, id)
        if (!asset) throw new NotFoundError("Asset not found")
        await this.repository.delete(userId, id)
    }
}
