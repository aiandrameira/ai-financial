import { z } from "zod"

export const updateFinancialSettingsSchema = z.object({
    monthlyIncome: z.number().min(0),
})

export type UpdateFinancialSettingsSchema = z.infer<typeof updateFinancialSettingsSchema>
