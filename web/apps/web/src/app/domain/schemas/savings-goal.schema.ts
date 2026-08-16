import { z } from "zod";

export const requestSavingsGoalSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    name: z.string().min(2, "O nome precisa ter no mínimo 2 caracteres.").default(""),
    targetAmount: z.number().positive("Informe um valor maior que zero").default(0),
    targetDate: z.string().default(""),
    icon: z.string().default("shield-check"),
    linkedAccountId: z.string().default(""),
});

export type RequestSavingsGoalDto = z.infer<typeof requestSavingsGoalSchema>;

export function makeRequestSavingsGoal(raw: Partial<RequestSavingsGoalDto> = {}): RequestSavingsGoalDto {
    return requestSavingsGoalSchema.parse(raw);
}

export const savingsGoalSchema = z.object({
    id: z.string(),
    name: z.string(),
    targetAmount: z.string(),
    targetDate: z.string().nullable(),
    icon: z.string().nullable(),
    linkedAccountId: z.string().nullable(),
    currentAmount: z.number(),
    remainingAmount: z.number(),
    progressPercent: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type SavingsGoalDto = z.infer<typeof savingsGoalSchema>;
