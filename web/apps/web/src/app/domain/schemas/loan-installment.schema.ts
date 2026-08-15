import { z } from "zod";

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
