import { z } from "zod";

export const requestBudgetSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    categoryId: z.string().min(1, "Selecione uma categoria").default(""),
    referenceMonth: z.string().min(1, "Informe o mês").default(new Date().toISOString().slice(0, 10)),
    plannedAmount: z.number().positive("Informe um valor maior que zero").default(0),
});

export type RequestBudgetDto = z.infer<typeof requestBudgetSchema>;

export function makeRequestBudget(raw: Partial<RequestBudgetDto> = {}): RequestBudgetDto {
    return requestBudgetSchema.parse(raw);
}

export const budgetSchema = z.object({
    id: z.string(),
    categoryId: z.string(),
    referenceMonth: z.string(),
    plannedAmount: z.string(),
    realizedAmount: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type BudgetDto = z.infer<typeof budgetSchema>;
