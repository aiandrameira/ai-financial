import type { assets } from "@/db/schema"

import type { AssetDto } from "../../app/dtos"

type AssetRow = typeof assets.$inferSelect

export function mapAssetToDto(row: AssetRow): AssetDto {
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        purchaseValue: row.purchaseValue,
        currentValue: row.currentValue,
        acquiredAt: row.acquiredAt.toISOString(),
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
    }
}
