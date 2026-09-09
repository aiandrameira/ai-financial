import { z } from "zod";
import { cursorFilterSchema } from "./cursor-filter.schema";

import { stTransactionEnum, tpRecurrenceFrequencyEnum, tpTransactionEnum, tpTransferMethodEnum } from "../enums";

export const requestRecurrenceSchema = z.object({
    frequency: z.enum(tpRecurrenceFrequencyEnum).default(tpRecurrenceFrequencyEnum.MONTHLY),
    interval: z.number().int().positive().default(1),
    endDate: z.string().optional(),
});

export type RequestRecurrenceDto = z.infer<typeof requestRecurrenceSchema>;

export const requestTransactionSchema = z.object({
    id: z
        .union([z.uuidv7(), z.literal("")])
        .default("")
        .optional(),
    accountId: z.string().default(""),
    creditCardId: z.string().default(""),
    categoryId: z.string().default(""),
    type: z.enum(tpTransactionEnum).exclude(["TRANSFER"]).default(tpTransactionEnum.EXPENSE),
    status: z.enum(stTransactionEnum).optional(),
    amount: z.number().positive("Informe um valor maior que zero").default(0),
    description: z.string().default(""),
    date: z.string().min(1, "Informe a data").default(new Date().toISOString().slice(0, 10)),
    installments: z.number().int().min(1).max(48).default(1),
    recurrence: requestRecurrenceSchema.optional(),
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
    accountId: z.string().nullable(),
    invoiceId: z.string().nullable(),
    creditCardId: z.string().nullable(),
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
    installmentGroupId: z.string().nullable(),
    installmentNumber: z.number().nullable(),
    installmentsTotal: z.number().nullable(),
    attachmentUrl: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type TransactionDto = z.infer<typeof transactionSchema>;

export const transactionFilterSchema = cursorFilterSchema.extend({
    accountId: z.string().optional(),
    invoiceId: z.string().optional(),
    categoryId: z.string().optional(),
    status: z.enum(stTransactionEnum).optional(),
    type: z.enum(tpTransactionEnum).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
});
export type TransactionFilterDto = z.infer<typeof transactionFilterSchema>;

export function makeTransactionFilter(raw: Partial<TransactionFilterDto> = {}): TransactionFilterDto {
    return transactionFilterSchema.parse(raw);
}
