import { z } from "zod";

export const requestFinancialSettingsSchema = z.object({
    monthlyIncome: z.number().min(0).default(0),
});

export type RequestFinancialSettingsDto = z.infer<typeof requestFinancialSettingsSchema>;

export function makeRequestFinancialSettings(raw: Partial<RequestFinancialSettingsDto> = {}): RequestFinancialSettingsDto {
    return requestFinancialSettingsSchema.parse(raw);
}

export const financialSettingsSchema = z.object({
    userId: z.string(),
    monthlyIncome: z.string(),
    updatedAt: z.string(),
});

export type FinancialSettingsDto = z.infer<typeof financialSettingsSchema>;
