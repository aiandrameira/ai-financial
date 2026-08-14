import { z } from "zod";

import { stTransactionEnum, tpTransactionEnum, tpTransferMethodEnum } from "../enums";

export const requestTransactionSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    accountId: z.string().min(1, "Selecione uma conta").default(""),
    categoryId: z.string().default(""),
    type: z.enum(tpTransactionEnum).exclude(["TRANSFER"]).default(tpTransactionEnum.EXPENSE),
    amount: z.number().positive("Informe um valor maior que zero").default(0),
    description: z.string().default(""),
    date: z.string().min(1, "Informe a data").default(new Date().toISOString().slice(0, 10)),
});

export type RequestTransactionDto = z.infer<typeof requestTransactionSchema>;

export function makeRequestTransaction(raw: Partial<RequestTransactionDto> = {}): RequestTransactionDto {
    return requestTransactionSchema.parse(raw);
}

export const requestTransferSchema = z
    .object({
        sourceAccountId: z.string().min(1, "Selecione a conta de origem").default(""),
        destinationAccountId: z.string().min(1, "Selecione a conta de destino").default(""),
        amount: z.number().positive("Informe um valor maior que zero").default(0),
        description: z.string().default(""),
        date: z.string().min(1, "Informe a data").default(new Date().toISOString().slice(0, 10)),
        method: z.enum(tpTransferMethodEnum).default(tpTransferMethodEnum.TRANSFER),
    })
    .refine(value => !value.sourceAccountId || !value.destinationAccountId || value.sourceAccountId !== value.destinationAccountId, {
        message: "As contas de origem e destino devem ser diferentes.",
        path: ["destinationAccountId"],
    });

export type RequestTransferDto = z.infer<typeof requestTransferSchema>;

export function makeRequestTransfer(raw: Partial<RequestTransferDto> = {}): RequestTransferDto {
    return requestTransferSchema.parse(raw);
}

export const transactionSchema = z.object({
    id: z.string(),
    accountId: z.string(),
    categoryId: z.string().nullable(),
    type: z.enum(tpTransactionEnum),
    status: z.enum(stTransactionEnum),
    amount: z.string(),
    description: z.string().nullable(),
    date: z.string(),
    tags: z.array(z.string()),
    recurrenceId: z.string().nullable(),
    transferId: z.string().nullable(),
    transferMethod: z.enum(tpTransferMethodEnum).nullable(),
    attachmentUrl: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type TransactionDto = z.infer<typeof transactionSchema>;
