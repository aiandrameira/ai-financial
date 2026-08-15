import { z } from "zod";

import { tpLoanEnum } from "../enums";

export const requestLoanSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    name: z.string().min(2, "O nome precisa ter no mínimo 2 caracteres.").default(""),
    type: z.enum(tpLoanEnum).default(tpLoanEnum.PERSONAL),
    accountId: z.string().min(1, "Selecione uma conta").default(""),
    principalAmount: z.number().positive("Informe um valor maior que zero").default(0),
    interestRate: z.number().min(0, "Informe uma taxa válida").default(0),
    installmentsTotal: z.number().int().min(1, "Informe ao menos 1 parcela").max(600).default(12),
    startDate: z.string().min(1, "Informe a data de início").default(new Date().toISOString().slice(0, 10)),
});

export type RequestLoanDto = z.infer<typeof requestLoanSchema>;

export function makeRequestLoan(raw: Partial<RequestLoanDto> = {}): RequestLoanDto {
    return requestLoanSchema.parse(raw);
}

export const loanSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(tpLoanEnum),
    principalAmount: z.string(),
    interestRate: z.string(),
    installmentsTotal: z.number(),
    startDate: z.string(),
    accountId: z.string(),
    outstandingBalance: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type LoanDto = z.infer<typeof loanSchema>;
