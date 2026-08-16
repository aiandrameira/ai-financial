import { z } from "zod";

export const requestGoalContributionSchema = z.object({
    amount: z.number().positive("Informe um valor maior que zero").default(0),
    date: z.string().min(1, "Informe a data").default(new Date().toISOString().slice(0, 10)),
});

export type RequestGoalContributionDto = z.infer<typeof requestGoalContributionSchema>;

export function makeRequestGoalContribution(raw: Partial<RequestGoalContributionDto> = {}): RequestGoalContributionDto {
    return requestGoalContributionSchema.parse(raw);
}

export const goalContributionSchema = z.object({
    id: z.string(),
    goalId: z.string(),
    transactionId: z.string().nullable(),
    amount: z.string(),
    date: z.string(),
    createdAt: z.string(),
});

export type GoalContributionDto = z.infer<typeof goalContributionSchema>;
