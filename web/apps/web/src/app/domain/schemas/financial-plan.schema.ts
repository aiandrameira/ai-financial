import { z } from "zod";

export const financialPlanDebtSchema = z.object({
    id: z.string(),
    name: z.string(),
    outstandingBalance: z.string(),
    nextInstallmentAmount: z.string().nullable(),
    nextInstallmentDueDate: z.string().nullable(),
});

export type FinancialPlanDebtDto = z.infer<typeof financialPlanDebtSchema>;

export const financialPlanGoalSchema = z.object({
    id: z.string(),
    name: z.string(),
    targetAmount: z.string(),
    remainingAmount: z.number(),
    progressPercent: z.number(),
    targetDate: z.string().nullable(),
});

export type FinancialPlanGoalDto = z.infer<typeof financialPlanGoalSchema>;

export const financialPlanSchema = z.object({
    monthlyIncome: z.string(),
    fixedExpenses: z.string(),
    surplus: z.string(),
    debts: z.array(financialPlanDebtSchema),
    goals: z.array(financialPlanGoalSchema),
});

export type FinancialPlanDto = z.infer<typeof financialPlanSchema>;
