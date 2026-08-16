import { NotFoundError } from "@/http/errors/errors"

import type { UpdateAssetSchema } from "../schemas"
import type { AssetRepository } from "../../domain/repositories"

export class UpdateAssetUseCase {
    constructor(private repository: AssetRepository) {}

    async execute(userId: string, id: string, body: UpdateAssetSchema): Promise<void> {
        const asset = await this.repository.get(userId, id)
        if (!asset) throw new NotFoundError("Asset not found")
        await this.repository.update(userId, id, body)
    }
}
