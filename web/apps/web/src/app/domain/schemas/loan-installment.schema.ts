import { z } from "zod";
import { cursorFilterSchema } from "./cursor-filter.schema";

import { stLoanInstallmentEnum } from "../enums";

export const loanInstallmentSchema = z.object({
    id: z.string(),
    loanId: z.string(),
    number: z.number(),
    dueDate: z.string(),
    amount: z.string(),
    principalPortion: z.string(),
    interestPortion: z.string(),
    paidAt: z.string().nullable(),
    status: z.enum(stLoanInstallmentEnum),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type LoanInstallmentDto = z.infer<typeof loanInstallmentSchema>;

export const loanInstallmentFilterSchema = cursorFilterSchema;
export type LoanInstallmentFilterDto = z.infer<typeof loanInstallmentFilterSchema>;

export function makeLoanInstallmentFilter(raw: Partial<LoanInstallmentFilterDto> = {}): LoanInstallmentFilterDto {
    return loanInstallmentFilterSchema.parse(raw);
}
