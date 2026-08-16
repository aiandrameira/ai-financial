import { AssetDto, RequestAssetDto } from "@domain/schemas";

export class AssetAdapter {
    static toDto(raw: AssetDto): RequestAssetDto {
        return {
            id: raw.id,
            name: raw.name,
            type: raw.type,
            purchaseValue: Number(raw.purchaseValue),
            currentValue: Number(raw.currentValue),
            acquiredAt: raw.acquiredAt.slice(0, 10),
        };
    }
}
