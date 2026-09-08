import { z } from "zod";
import { cursorFilterSchema } from "./cursor-filter.schema";

import { tpAssetEnum } from "../enums";

export const requestAssetSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    name: z.string().min(2, "O nome precisa ter no mínimo 2 caracteres.").default(""),
    type: z.enum(tpAssetEnum).default(tpAssetEnum.REAL_ESTATE),
    purchaseValue: z.number().positive("Informe um valor maior que zero").default(0),
    currentValue: z.number().positive("Informe um valor maior que zero").default(0),
    acquiredAt: z.string().min(1, "Informe a data de aquisição").default(new Date().toISOString().slice(0, 10)),
});

export type RequestAssetDto = z.infer<typeof requestAssetSchema>;

export function makeRequestAsset(raw: Partial<RequestAssetDto> = {}): RequestAssetDto {
    return requestAssetSchema.parse(raw);
}

export const assetSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(tpAssetEnum),
    purchaseValue: z.string(),
    currentValue: z.string(),
    acquiredAt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type AssetDto = z.infer<typeof assetSchema>;

export const assetFilterSchema = cursorFilterSchema;
export type AssetFilterDto = z.infer<typeof assetFilterSchema>;

export function makeAssetFilter(raw: Partial<AssetFilterDto> = {}): AssetFilterDto {
    return assetFilterSchema.parse(raw);
}
