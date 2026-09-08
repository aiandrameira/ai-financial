import { z } from "zod";
import { cursorFilterSchema } from "./cursor-filter.schema";

import { tpInvestmentEnum } from "../enums";

export const requestInvestmentAssetSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    name: z.string().min(2, "O nome precisa ter no mínimo 2 caracteres.").default(""),
    type: z.enum(tpInvestmentEnum).default(tpInvestmentEnum.FIXED_INCOME),
    broker: z.string().default(""),
    ticker: z.string().default(""),
});

export type RequestInvestmentAssetDto = z.infer<typeof requestInvestmentAssetSchema>;

export function makeRequestInvestmentAsset(raw: Partial<RequestInvestmentAssetDto> = {}): RequestInvestmentAssetDto {
    return requestInvestmentAssetSchema.parse(raw);
}

export const investmentAssetSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(tpInvestmentEnum),
    broker: z.string().nullable(),
    ticker: z.string().nullable(),
    quantity: z.number(),
    averagePrice: z.number(),
    investedAmount: z.number(),
    currentValue: z.number(),
    profitLoss: z.number(),
    profitLossPercent: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type InvestmentAssetDto = z.infer<typeof investmentAssetSchema>;

export const investmentFilterSchema = cursorFilterSchema;
export type InvestmentFilterDto = z.infer<typeof investmentFilterSchema>;

export function makeInvestmentFilter(raw: Partial<InvestmentFilterDto> = {}): InvestmentFilterDto {
    return investmentFilterSchema.parse(raw);
}
