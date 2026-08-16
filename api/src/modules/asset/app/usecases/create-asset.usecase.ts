import type { AssetDto } from "../dtos"
import type { CreateAssetSchema } from "../schemas"
import type { AssetRepository } from "../../domain/repositories"

export class CreateAssetUseCase {
    constructor(private repository: AssetRepository) {}

    async execute(userId: string, body: CreateAssetSchema): Promise<AssetDto> {
        return this.repository.create(userId, body)
    }
}
