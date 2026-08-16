import type { tpAssetEnum } from "../../domain/enums"

export type AssetDto = {
    id: string
    name: string
    type: tpAssetEnum
    purchaseValue: string
    currentValue: string
    acquiredAt: string
    createdAt: string
    updatedAt: string
}
