import { z } from "zod";

import { stTransactionEnum, tpTransactionEnum } from "../enums";

export const createTransactionSchema = z.object({
    accountId: z.string().min(1, "Selecione uma conta"),
    categoryId: z.string().optional(),
    type: z.enum(tpTransactionEnum).exclude(["TRANSFER"]),
    amount: z.number().positive("Informe um valor maior que zero"),
    description: z.string().optional(),
    date: z.string().min(1, "Informe a data"),
});

export type CreateTransaction = z.infer<typeof createTransactionSchema>;

export function makeCreateTransaction(overrides: Partial<CreateTransaction> = {}): CreateTransaction {
    return {
        accountId: "",
        categoryId: "",
        type: tpTransactionEnum.EXPENSE,
        amount: 0,
        description: "",
        date: new Date().toISOString().slice(0, 10),
        ...overrides,
    };
}

export type TransactionDto = {
    id: string;
    accountId: string;
    categoryId: string | null;
    type: tpTransactionEnum;
    status: stTransactionEnum;
    amount: string;
    description: string | null;
    date: string;
    tags: string[];
    recurrenceId: string | null;
    transferId: string | null;
    attachmentUrl: string | null;
    createdAt: string;
    updatedAt: string;
};
